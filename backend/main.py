"""Hackathon judging backend.

Endpoints:
    POST /api/submissions          - upload team name + joblib model (+ optional predictions csv, requirements.txt)
    GET  /api/submissions          - raw list of submissions
    GET  /api/submissions/{id}     - one submission
    GET  /api/leaderboard          - scored + ranked results
    PUT  /api/test-data            - replace test X (and optionally test y) csvs
    GET  /api/health
"""
import json
import shutil
import sqlite3
import subprocess
import sys
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
from fastapi import BackgroundTasks, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
SUBMISSIONS_DIR = DATA_DIR / "submissions"
TEST_X_PATH = DATA_DIR / "test_x.csv"
TEST_Y_PATH = DATA_DIR / "test_y.csv"
DB_PATH = DATA_DIR / "results.db"
RUNNER = Path(__file__).resolve().parent / "runner.py"
N_RUNS = 100  # per spec discussion: 10 for now (real evaluation uses 100)

app = FastAPI(title="Model Judging API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://data-science-summit-2026.vercel.app",
        "https://dsummit-judge.duckdns.org",
        "http://localhost:3000",
        "http://165.101.22.29:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    SUBMISSIONS_DIR.mkdir(parents=True, exist_ok=True)
    with db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS submissions (
                id TEXT PRIMARY KEY,
                team_name TEXT NOT NULL,
                email TEXT,
                model_filename TEXT NOT NULL,
                size_bytes INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                avg_time_s REAL,
                load_time_s REAL,
                accuracy REAL,
                accuracy_source TEXT,
                sanity_match_pct REAL,
                used_fallback_env INTEGER DEFAULT 0,
                error TEXT,
                created_at TEXT NOT NULL
            )
            """
        )
        # migration for DBs created before the email column existed
        cols = [r[1] for r in conn.execute("PRAGMA table_info(submissions)")]
        if "email" not in cols:
            conn.execute("ALTER TABLE submissions ADD COLUMN email TEXT")


init_db()


# ---------------------------------------------------------------- evaluation

def _compute_accuracy(pred_csv: Path) -> float | None:
    """Accuracy of a predictions csv against the ground-truth labels, if present."""
    if not TEST_Y_PATH.exists():
        return None
    y_true = pd.read_csv(TEST_Y_PATH).iloc[:, 0]
    y_pred = pd.read_csv(pred_csv).iloc[:, 0]
    if len(y_true) != len(y_pred):
        return None
    return float((y_true.values.astype(str) == y_pred.values.astype(str)).mean())


def _sanity_check(our_preds: Path, team_preds: Path) -> float | None:
    """% agreement between our run's predictions and the team's uploaded csv."""
    try:
        a = pd.read_csv(our_preds).iloc[:, 0]
        b = pd.read_csv(team_preds).iloc[:, 0]
        if len(a) != len(b):
            return None
        return float((a.values.astype(str) == b.values.astype(str)).mean()) * 100
    except Exception:
        return None


def _run_runner(python: str, model_path: Path, preds_out: Path, timeout: int = 600) -> dict:
    proc = subprocess.run(
        [python, str(RUNNER), str(model_path), str(TEST_X_PATH), str(preds_out), str(N_RUNS)],
        capture_output=True,
        text=True,
        timeout=timeout,
    )
    out = proc.stdout.strip().splitlines()
    if out:
        try:
            return json.loads(out[-1])
        except json.JSONDecodeError:
            pass
    return {"ok": False, "error": proc.stderr[-4000:] or "runner produced no output"}


def _submission_env_python(sub_dir: Path) -> str:
    """Create a per-submission venv from the team's requirements.txt."""
    venv_dir = sub_dir / "venv"
    if not venv_dir.exists():
        subprocess.run([sys.executable, "-m", "venv", str(venv_dir)], check=True, timeout=300)
    py = str(venv_dir / "bin" / "python")
    req = sub_dir / "requirements.txt"
    if req.exists():
        subprocess.run([py, "-m", "pip", "install", "--quiet", "-r", str(req)], check=True, timeout=900)
    # the runner itself needs these, whatever the team pinned
    subprocess.run([py, "-m", "pip", "install", "--quiet", "pandas", "joblib"], check=True, timeout=900)
    return py


# Evaluations run one at a time so concurrent submissions can't steal CPU from
# each other and skew the timed runs (Ptime must be measured on a quiet machine).
EVAL_LOCK = threading.Lock()


def evaluate_submission(sub_id: str) -> None:
    with EVAL_LOCK:
        _evaluate_submission(sub_id)


def _evaluate_submission(sub_id: str) -> None:
    sub_dir = SUBMISSIONS_DIR / sub_id
    model_path = next(sub_dir.glob("model*"))
    our_preds = sub_dir / "our_predictions.csv"
    team_preds = sub_dir / "team_predictions.csv"

    fields: dict = {"status": "completed", "error": None}
    try:
        has_reqs = (sub_dir / "requirements.txt").exists()
        if has_reqs:
            # Team pinned their own environment — that is the source of truth.
            try:
                py = _submission_env_python(sub_dir)
                result = _run_runner(py, model_path, our_preds)
                fields["used_fallback_env"] = 1
            except Exception as e:
                result = {"ok": False, "error": f"building team env failed: {e}"}
            if not result.get("ok"):
                first_error = result.get("error", "")
                result = _run_runner(sys.executable, model_path, our_preds)
                if result.get("ok"):
                    fields["used_fallback_env"] = 0
                else:
                    result["error"] = f"{first_error}\n--- server env also failed:\n{result.get('error', '')}"
        else:
            result = _run_runner(sys.executable, model_path, our_preds)

        if result.get("ok"):
            line = (
                f"[eval {sub_id}] ran predict {len(result['times_s'])}x "
                f"(target {N_RUNS}): times={[round(t, 5) for t in result['times_s']]} "
                f"avg={result['avg_time_s']:.5f}s"
            )
            print(line, flush=True)
            with (DATA_DIR / "eval.log").open("a") as f:
                f.write(f"{datetime.now(timezone.utc).isoformat()} {line}\n")
            fields["avg_time_s"] = result["avg_time_s"]
            fields["load_time_s"] = result["load_time_s"]
            acc = _compute_accuracy(our_preds)
            if acc is not None:
                fields["accuracy"] = acc
                fields["accuracy_source"] = "our_run"
            if team_preds.exists():
                fields["sanity_match_pct"] = _sanity_check(our_preds, team_preds)
        else:
            # Model wouldn't run anywhere: fall back to the team's uploaded predictions.
            fields["status"] = "failed_run"
            fields["error"] = result.get("error", "unknown error")[-4000:]
            if team_preds.exists():
                acc = _compute_accuracy(team_preds)
                if acc is not None:
                    fields["accuracy"] = acc
                    fields["accuracy_source"] = "team_csv"
    except Exception as e:
        fields["status"] = "error"
        fields["error"] = str(e)[-4000:]

    sets = ", ".join(f"{k} = ?" for k in fields)
    with db() as conn:
        conn.execute(f"UPDATE submissions SET {sets} WHERE id = ?", [*fields.values(), sub_id])


# ------------------------------------------------------------------- routes

@app.get("/api/health")
def health():
    return {
        "ok": True,
        "test_x_rows": len(pd.read_csv(TEST_X_PATH)) if TEST_X_PATH.exists() else None,
        "test_y_present": TEST_Y_PATH.exists(),
    }


@app.post("/api/submissions", status_code=201)
async def create_submission(
    background: BackgroundTasks,
    team_name: str = Form(...),
    email: str = Form(...),
    model_file: UploadFile = File(...),
    predictions_csv: UploadFile = File(...),
    requirements_txt: UploadFile = File(...),
    metrics_csv: UploadFile = File(...),
):
    if not TEST_X_PATH.exists():
        raise HTTPException(400, "No test data uploaded yet (PUT /api/test-data first).")
    if not model_file.filename.endswith(".joblib"):
        raise HTTPException(400, "Model file must be a .joblib file.")
    if "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(400, "A valid email address is required.")
    for upload, label in ((predictions_csv, "predictions_csv"), (metrics_csv, "metrics_csv")):
        if not upload.filename.endswith(".csv"):
            raise HTTPException(400, f"{label} must be a .csv file.")

    sub_id = uuid.uuid4().hex[:12]
    sub_dir = SUBMISSIONS_DIR / sub_id
    sub_dir.mkdir(parents=True)

    suffix = Path(model_file.filename).suffix
    model_path = sub_dir / f"model{suffix}"
    with model_path.open("wb") as f:
        shutil.copyfileobj(model_file.file, f)
    with (sub_dir / "team_predictions.csv").open("wb") as f:
        shutil.copyfileobj(predictions_csv.file, f)
    with (sub_dir / "requirements.txt").open("wb") as f:
        shutil.copyfileobj(requirements_txt.file, f)
    with (sub_dir / "metrics.csv").open("wb") as f:
        shutil.copyfileobj(metrics_csv.file, f)

    with db() as conn:
        conn.execute(
            "INSERT INTO submissions (id, team_name, email, model_filename, size_bytes, status, created_at)"
            " VALUES (?, ?, ?, ?, ?, 'pending', ?)",
            (
                sub_id,
                team_name.strip(),
                email.strip().lower(),
                model_file.filename,
                model_path.stat().st_size,
                datetime.now(timezone.utc).isoformat(),
            ),
        )

    background.add_task(evaluate_submission, sub_id)
    return {"id": sub_id, "status": "pending"}


@app.get("/api/submissions")
def list_submissions():
    with db() as conn:
        rows = conn.execute("SELECT * FROM submissions ORDER BY created_at DESC").fetchall()
    return [dict(r) for r in rows]


@app.get("/api/submissions/{sub_id}")
def get_submission(sub_id: str):
    with db() as conn:
        row = conn.execute("SELECT * FROM submissions WHERE id = ?", (sub_id,)).fetchone()
    if row is None:
        raise HTTPException(404, "Submission not found")
    return dict(row)


@app.get("/api/leaderboard")
def leaderboard():
    """Score = (Accuracy x 100) + Psize + Ptime.

    Psize / Ptime = % of competing submissions with larger size / slower time.
    Only submissions with both an accuracy and a measured time are scoreable;
    failed-run submissions scored from a team csv get Ptime = 0.
    """
    with db() as conn:
        rows = [dict(r) for r in conn.execute("SELECT * FROM submissions").fetchall()]

    scoreable = [r for r in rows if r["accuracy"] is not None]
    n = len(scoreable)
    entries = []
    for r in scoreable:
        others = [o for o in scoreable if o["id"] != r["id"]]
        denom = len(others) or 1
        p_size = 100.0 * sum(1 for o in others if o["size_bytes"] > r["size_bytes"]) / denom
        if r["avg_time_s"] is not None:
            timed = [o for o in others if o["avg_time_s"] is not None]
            p_time = 100.0 * sum(1 for o in timed if o["avg_time_s"] > r["avg_time_s"]) / (len(timed) or 1)
        else:
            p_time = 0.0
        entries.append(
            {
                **r,
                "p_size": round(p_size, 2),
                "p_time": round(p_time, 2),
                "score": round(r["accuracy"] * 100 + p_size + p_time, 2),
            }
        )
    entries.sort(key=lambda e: e["score"], reverse=True)
    for i, e in enumerate(entries, 1):
        e["rank"] = i
    return {"count": n, "entries": entries}


@app.put("/api/test-data")
async def update_test_data(
    test_x: UploadFile | None = File(None),
    test_y: UploadFile | None = File(None),
):
    if test_x is None and test_y is None:
        raise HTTPException(400, "Provide test_x and/or test_y csv files.")
    updated = {}
    for upload, path, key in ((test_x, TEST_X_PATH, "test_x"), (test_y, TEST_Y_PATH, "test_y")):
        if upload is None:
            continue
        tmp = path.with_suffix(".tmp")
        with tmp.open("wb") as f:
            shutil.copyfileobj(upload.file, f)
        try:
            n = len(pd.read_csv(tmp))
        except Exception as e:
            tmp.unlink(missing_ok=True)
            raise HTTPException(400, f"{key} is not a valid csv: {e}")
        tmp.replace(path)
        updated[key] = {"rows": n}
    return {"updated": updated}
