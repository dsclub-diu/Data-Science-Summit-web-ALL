"""Submission portal for the Starship Safety hackathon (runs on the HOSTED
server, e.g. a cloud box participants can reach).

Responsibilities — and, just as important, what it deliberately does NOT do:

  * Accepts submissions from participants (POST /submit).
  * Hands queued submissions to the lab-PC worker, which reaches out and
    PULLS them (GET /worker/next, GET /worker/file/...). The portal never
    needs to connect back to the lab PC, so the lab PC can sit behind a
    firewall/NAT with no exposed ports.
  * Receives finished measurements from the worker (POST /worker/result).
  * Serves a live leaderboard (GET /  and  GET /leaderboard).

  * It does NOT contain the secret answer key and never sees it. Accuracy is
    computed by the worker on the lab PC (the only machine that holds
    test-y.csv); the portal only receives already-computed measurements and
    runs the public scoring math on them. So even if the hosted box is
    compromised, the answer key is not on it.

Run (single worker process, so the in-memory claim lock is authoritative):

    export WORKER_TOKEN="pick-a-long-random-secret"
    uvicorn portal:app --host 0.0.0.0 --port 8000

Resubmission policy: keep best score (scoring.select_best_per_team).
"""
import json
import os
import re
import shutil
import threading
import time
import uuid
from pathlib import Path

from fastapi import (FastAPI, File, Form, Header, HTTPException, Response,
                     UploadFile)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse

import scoring

DATA_DIR = Path(os.environ.get("PORTAL_DATA",
                               Path(__file__).resolve().parent / "portal_data"))
SUBS_DIR = DATA_DIR / "submissions"
RESULTS_DIR = DATA_DIR / "results"
WORKER_TOKEN = os.environ.get("WORKER_TOKEN", "change-me")
MAX_UPLOAD_MB = int(os.environ.get("MAX_UPLOAD_MB", "200"))
# A "running" job older than this (worker died mid-evaluation) is requeued.
STALE_RUNNING_SECONDS = int(os.environ.get("STALE_RUNNING_SECONDS", "900"))

# Files a participant may include and the on-disk names the worker expects.
UPLOAD_FILES = {"model_pkl": "model.pkl",
                "predictions_csv": "predictions.csv",
                "model_py": "model.py"}
TEAM_RE = re.compile(r"^[A-Za-z0-9 _-]{1,64}$")

app = FastAPI(title="Starship Safety Portal")

# The submission form on your website lives on a different origin (e.g.
# https://data-science-summit-2026.vercel.app), so the participant's browser
# makes a CROSS-ORIGIN request to this portal. Browsers block that unless the
# portal explicitly allows the site's origin. List every origin that will
# POST here (comma-separated in ALLOWED_ORIGINS), including any custom domain.
ALLOWED_ORIGINS = [o.strip() for o in os.environ.get(
    "ALLOWED_ORIGINS",
    "https://data-science-summit-2026.vercel.app,http://localhost:3000"
).split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

_claim_lock = threading.Lock()

SUBS_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------------------------------- #
# small on-disk helpers
# --------------------------------------------------------------------------- #
def _meta_path(sid):
    return SUBS_DIR / sid / "meta.json"


def _read_meta(sid):
    return json.loads(_meta_path(sid).read_text())


def _write_meta(sid, meta):
    _meta_path(sid).write_text(json.dumps(meta, indent=2))


def _require_worker(token):
    if token != WORKER_TOKEN:
        raise HTTPException(status_code=401, detail="bad or missing worker token")


async def _save_upload(upload, dest):
    """Stream an upload to disk, enforcing the size cap so one giant file
    cannot fill the server."""
    limit = MAX_UPLOAD_MB * 1024 * 1024
    written = 0
    with open(dest, "wb") as f:
        while True:
            chunk = await upload.read(1024 * 1024)
            if not chunk:
                break
            written += len(chunk)
            if written > limit:
                f.close()
                dest.unlink(missing_ok=True)
                raise HTTPException(status_code=413,
                                    detail=f"{dest.name} exceeds {MAX_UPLOAD_MB} MB")
            f.write(chunk)


# --------------------------------------------------------------------------- #
# participant-facing
# --------------------------------------------------------------------------- #
@app.post("/submit")
async def submit(team: str = Form(...),
                 model_pkl: UploadFile = File(...),
                 predictions_csv: UploadFile = File(...),
                 model_py: UploadFile = File(None)):
    """A participant uploads their model + predictions (+ optional model.py).
    Stored as a queued submission for the worker to pick up."""
    team = team.strip()
    if not TEAM_RE.match(team):
        raise HTTPException(status_code=400,
                            detail="team must be 1-64 chars of letters, digits, space, _ or -")

    sid = uuid.uuid4().hex[:12]
    sub_dir = SUBS_DIR / sid
    sub_dir.mkdir(parents=True)
    try:
        await _save_upload(model_pkl, sub_dir / "model.pkl")
        await _save_upload(predictions_csv, sub_dir / "predictions.csv")
        files = ["model.pkl", "predictions.csv"]
        if model_py is not None and (model_py.filename or "").strip():
            await _save_upload(model_py, sub_dir / "model.py")
            files.append("model.py")
    except HTTPException:
        shutil.rmtree(sub_dir, ignore_errors=True)
        raise

    _write_meta(sid, {"submission_id": sid, "team": team, "status": "queued",
                      "files": files, "submitted_at": time.time()})
    return {"submission_id": sid, "team": team, "status": "queued"}


@app.get("/submission/{sid}")
def submission_status(sid: str):
    if not _meta_path(sid).exists():
        raise HTTPException(status_code=404, detail="no such submission")
    meta = _read_meta(sid)
    res_path = RESULTS_DIR / f"{sid}.json"
    out = {"submission_id": sid, "team": meta["team"], "status": meta["status"]}
    if res_path.exists():
        r = json.loads(res_path.read_text())
        out["flags"] = r.get("flags", [])
        out["accuracy_percent"] = round((r.get("accuracy_model") or 0) * 100, 2)
    return out


# --------------------------------------------------------------------------- #
# worker-facing (the lab PC pulls from here)
# --------------------------------------------------------------------------- #
@app.get("/worker/next")
def worker_next(x_worker_token: str = Header(None)):
    """The worker claims the oldest queued submission. Returns 204 when there
    is nothing to do. Also requeues jobs a dead worker left 'running'."""
    _require_worker(x_worker_token)
    now = time.time()
    with _claim_lock:
        metas = []
        for meta_file in SUBS_DIR.glob("*/meta.json"):
            meta = json.loads(meta_file.read_text())
            if meta["status"] == "running" and (
                    now - meta.get("claimed_at", now)) > STALE_RUNNING_SECONDS:
                meta["status"] = "queued"           # worker died; put it back
                _write_meta(meta["submission_id"], meta)
            if meta["status"] == "queued":
                metas.append(meta)
        if not metas:
            return Response(status_code=204)
        meta = min(metas, key=lambda m: m["submitted_at"])
        meta["status"] = "running"
        meta["claimed_at"] = now
        _write_meta(meta["submission_id"], meta)
    return {"submission_id": meta["submission_id"], "team": meta["team"],
            "files": meta["files"]}


@app.get("/worker/file/{sid}/{name}")
def worker_file(sid: str, name: str, x_worker_token: str = Header(None)):
    _require_worker(x_worker_token)
    if name not in UPLOAD_FILES.values():
        raise HTTPException(status_code=400, detail="unexpected file name")
    path = SUBS_DIR / sid / name
    if not path.exists():
        raise HTTPException(status_code=404, detail="no such file")
    return FileResponse(path)


@app.post("/worker/result")
async def worker_result(payload: dict, x_worker_token: str = Header(None)):
    """The worker posts back the measurements it computed for one submission."""
    _require_worker(x_worker_token)
    sid = payload.get("submission_id")
    if not sid or not _meta_path(sid).exists():
        raise HTTPException(status_code=404, detail="unknown submission_id")
    meta = _read_meta(sid)
    payload.setdefault("team", meta["team"])
    (RESULTS_DIR / f"{sid}.json").write_text(json.dumps(payload, indent=2))
    meta["status"] = "error" if "EVALUATION_ERROR" in " ".join(
        payload.get("flags", [])) else "done"
    meta["judged_at"] = time.time()
    _write_meta(sid, meta)
    return {"stored": sid, "status": meta["status"]}


# --------------------------------------------------------------------------- #
# leaderboard
# --------------------------------------------------------------------------- #
def _compute_leaderboard():
    rows = [json.loads(p.read_text()) for p in RESULTS_DIR.glob("*.json")]
    if not rows:
        return []
    best = scoring.select_best_per_team(rows)   # keep-best resubmission policy
    return scoring.finalize(best)


@app.get("/leaderboard")
def leaderboard():
    rows = _compute_leaderboard()
    return JSONResponse([{
        "rank": i + 1,
        "team": r["team"],
        "accuracy_percent": round(r["accuracy_points"], 2),
        "model_size_bytes": r.get("model_size_bytes"),
        "mean_run_seconds": r.get("mean_run_seconds"),
        "p_size": round(r["p_size"], 2),
        "p_time": round(r["p_time"], 2),
        "final_score": round(r["final_score"], 2),
        "flags": r.get("flags", []),
    } for i, r in enumerate(rows)])


@app.get("/", response_class=HTMLResponse)
def home():
    rows = _compute_leaderboard()
    body = "".join(
        f"<tr><td>{i+1}</td><td>{r['team']}</td>"
        f"<td>{r['accuracy_points']:.1f}</td>"
        f"<td>{(str(r.get('model_size_bytes')) + ' B') if r.get('model_size_bytes') is not None else '-'}</td>"
        f"<td>{('%.2f ms' % (r['mean_run_seconds']*1000)) if r.get('mean_run_seconds') is not None else 'FAILED'}</td>"
        f"<td>{r['p_size']:.1f}</td><td>{r['p_time']:.1f}</td>"
        f"<td><b>{r['final_score']:.1f}</b></td>"
        f"<td>{', '.join(r.get('flags', [])) or '-'}</td></tr>"
        for i, r in enumerate(rows))
    return f"""<!doctype html><html><head><meta charset=utf-8>
<title>Starship Safety Leaderboard</title>
<meta http-equiv=refresh content=15>
<style>body{{font-family:system-ui,sans-serif;margin:2rem;background:#0b1020;color:#e6e9f0}}
h1{{font-weight:600}} table{{border-collapse:collapse;width:100%}}
th,td{{padding:.5rem .7rem;text-align:left;border-bottom:1px solid #26304a}}
th{{color:#9fb0d0;font-weight:600}} tr:hover td{{background:#141b30}}
td:nth-child(8){{color:#7fd1a0}}</style></head><body>
<h1>Starship Safety — Live Leaderboard</h1>
<p>{len(rows)} teams · auto-refresh 15s · score = accuracy×100 + P_size + P_time</p>
<table><thead><tr><th>#</th><th>Team</th><th>Acc%</th><th>Size</th><th>Avg time</th>
<th>P_size</th><th>P_time</th><th>Score</th><th>Flags</th></tr></thead>
<tbody>{body or '<tr><td colspan=9>no results yet</td></tr>'}</tbody></table>
</body></html>"""


@app.get("/health")
def health():
    return {"ok": True}
