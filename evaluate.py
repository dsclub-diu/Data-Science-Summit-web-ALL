"""Phase 1 of judging: evaluate every submission independently.

For each folder under submissions/ this script measures the three raw
quantities the score is built from:

  1. Accuracy   — from the predictions the model ACTUALLY produces when run
                  (see the anti-cheat note below), compared to the answer key.
  2. Model size — bytes of model.pkl on disk.
  3. Execution time — measured by THIS parent process as wall-clock around a
                  sandboxed subprocess that loads + predicts N times.

ANTI-CHEAT DESIGN. The score rewards a tiny, fast model, so the obvious
exploits are (a) submit a leaked-answer predictions.csv next to a dummy or
deliberately-crashing model, and (b) have the model read the secret answer
key off disk. This evaluator is built so neither pays off:

  * The parent never trusts numbers the untrusted process prints. Timing is
    the parent's own wall-clock measurement; predictions come from a result
    file; accuracy is re-derived here.
  * The subprocess runs in a scratch directory containing only a COPY of the
    test inputs — never test-y.csv — so the model cannot read the key as a
    sibling file. (For a fully hostile field, also run inside Docker with
    only the inputs mounted; see README.md.)
  * accuracy is scored from the model's real output, not the submitted CSV.
    The CSV is compared to the model output only to flag integrity
    mismatches for the judges.
  * A model that fails to load/run produces UNVERIFIABLE predictions and is
    given 0 accuracy — a crashing pickle can no longer launder a leaked CSV
    into accuracy points.

Teams are evaluated ONE AT A TIME on purpose: timing runs must not compete
for CPU, or the measurements become unfair.

Usage:
    python evaluate.py            # evaluate every team in submissions/
    python evaluate.py team_name  # (re-)evaluate a single team
"""
import csv
import json
import os
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import config


def read_label_csv(path, expected_column):
    """Read a one-column CSV of 0/1 labels. Returns (labels, warnings).
    Opened as utf-8-sig so an Excel 'CSV UTF-8' byte-order mark on the
    header does not cause a spurious rejection."""
    warnings = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        rows = [r for r in csv.reader(f) if r]  # skip blank lines

    if not rows:
        raise ValueError("file is empty")
    if len(rows[0]) != 1:
        raise ValueError(f"expected exactly 1 column, found {len(rows[0])}")

    header = rows[0][0].strip()
    if header == expected_column:
        rows = rows[1:]
    elif header in ("0", "1"):
        warnings.append(f"missing '{expected_column}' header; accepted anyway")
    else:
        raise ValueError(f"unexpected header {header!r}")

    labels = []
    for i, row in enumerate(rows):
        value = row[0].strip()
        if value not in ("0", "1"):
            raise ValueError(f"row {i + 1}: value {value!r} is not 0 or 1")
        labels.append(int(value))
    return labels, warnings


def load_answer_key():
    labels, _ = read_label_csv(config.ANSWER_KEY_PATH, config.TARGET_COLUMN)
    if len(labels) != config.N_ROWS_EXPECTED:
        raise SystemExit(
            f"answer key has {len(labels)} rows, expected {config.N_ROWS_EXPECTED}")
    return labels


def accuracy(predictions, answers):
    hits = sum(p == a for p, a in zip(predictions, answers))
    return hits / len(answers)


def parse_requirement_names(text):
    """Pull bare package names out of a requirements.txt (drop version pins,
    extras, comments, and pip options)."""
    names = []
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or line.startswith("-"):
            continue
        name = re.split(r"[<>=!~;\[\( ]", line, 1)[0].strip().lower()
        if name:
            names.append(name)
    return names


def unsupported_libraries(req_path):
    """Return requirement names that are not on the allow-list. The judge
    never installs anything; this only produces a clear diagnostic flag."""
    text = req_path.read_text(encoding="utf-8-sig", errors="replace")
    allowed = {a.lower() for a in config.ALLOWED_LIBRARIES}
    return sorted({n for n in parse_requirement_names(text) if n not in allowed})


def run_model_sandboxed(model_path, n_expected):
    """Run one model in an isolated scratch dir and return measurements.

    The parent copies the test inputs into a fresh temp dir (WITHOUT the
    answer key), runs the sandbox there in its own process group, and times
    the whole job with its own clock. Returns a dict with ok / predictions /
    mean_run_seconds, or ok=False and an error."""
    with tempfile.TemporaryDirectory(prefix="judge_") as work:
        work = Path(work)
        # Only the inputs go into the sandbox's world — never test-y.csv.
        shutil.copy2(config.TEST_X_PATH, work / "test-x.csv")
        result_path = work / "result.json"

        cmd = [
            sys.executable,
            str(config.JUDGING_DIR / "sandbox_runner.py"),
            str(model_path.resolve()),
            str(work / "test-x.csv"),
            str(config.N_TIMING_RUNS),
            str(config.SANDBOX_MEMORY_MB),
            str(config.SANDBOX_CPU_SECONDS),
            str(result_path),
        ]

        # start_new_session isolates the child in its own process group so a
        # timeout can kill the whole tree, not just the direct child.
        start = time.perf_counter()
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE, text=True,
                                cwd=str(work),
                                start_new_session=(os.name == "posix"))
        try:
            _, stderr = proc.communicate(timeout=config.SANDBOX_TIMEOUT_SECONDS)
        except subprocess.TimeoutExpired:
            _kill_process_group(proc)
            proc.communicate()
            return {"ok": False,
                    "error": f"timed out after {config.SANDBOX_TIMEOUT_SECONDS}s"}
        wall_seconds = time.perf_counter() - start
        _kill_process_group(proc)  # reap any detached grandchildren

        if not result_path.exists():
            detail = (stderr or "no result written").strip()[-500:]
            return {"ok": False, "error": f"model produced no result: {detail}"}
        try:
            data = json.loads(result_path.read_text())
        except json.JSONDecodeError:
            return {"ok": False, "error": "result file was not valid JSON"}
        if not data.get("ok"):
            return {"ok": False, "error": str(data.get("error", "unknown"))}

        predictions = data.get("predictions")
        if (not isinstance(predictions, list)
                or len(predictions) != n_expected
                or any(p not in (0, 1) for p in predictions)):
            return {"ok": False,
                    "error": "model did not return a valid 0/1 prediction list"}

        return {
            "ok": True,
            "predictions": [int(p) for p in predictions],
            # Parent-measured timing is authoritative; child_mean is diagnostic.
            "mean_run_seconds": wall_seconds / config.N_TIMING_RUNS,
            "wall_seconds": wall_seconds,
            "child_mean_seconds": data.get("child_mean_seconds"),
        }


def _kill_process_group(proc):
    if os.name != "posix":
        proc.kill()
        return
    try:
        os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
    except (ProcessLookupError, PermissionError):
        pass


def evaluate_team(team_dir, answers):
    """Measure one team. Returns a result dict; leaderboard.py turns the raw
    measurements into the scored accuracy according to the integrity policy."""
    result = {"team": team_dir.name, "flags": [],
              "accuracy_csv": None, "accuracy_model": None,
              "model_ran": False, "csv_present": False,
              "csv_vs_model_mismatches": None,
              "model_size_bytes": None, "mean_run_seconds": None}

    # --- 1. Read the submitted predictions.csv (advisory / integrity) ------
    predictions_path = team_dir / "predictions.csv"
    csv_predictions = None
    if not predictions_path.exists():
        result["flags"].append("MISSING_PREDICTIONS_CSV")
    else:
        result["csv_present"] = True
        try:
            csv_predictions, warnings = read_label_csv(
                predictions_path, config.TARGET_COLUMN)
            result["flags"].extend(warnings)
            if len(csv_predictions) != len(answers):
                result["flags"].append(
                    f"BAD_ROW_COUNT: {len(csv_predictions)} predictions "
                    f"for {len(answers)} test rows")
                csv_predictions = None
        except ValueError as exc:
            result["flags"].append(f"INVALID_PREDICTIONS_CSV: {exc}")
    if csv_predictions is not None:
        result["accuracy_csv"] = accuracy(csv_predictions, answers)

    # --- 2. Model size -------------------------------------------------------
    model_path = team_dir / "model.pkl"
    if not model_path.exists():
        result["flags"].append("MISSING_MODEL_PKL")
    else:
        size = model_path.stat().st_size
        result["model_size_bytes"] = size
        if size > config.MAX_MODEL_SIZE_MB * 1024 * 1024:
            result["flags"].append(
                f"MODEL_TOO_LARGE: {size} bytes exceeds the "
                f"{config.MAX_MODEL_SIZE_MB} MB limit")

    # --- 2b. Declared dependencies (required; validated, never installed) ---
    req_path = team_dir / "requirements.txt"
    result["requirements_present"] = req_path.exists()
    if not req_path.exists():
        result["flags"].append("MISSING_REQUIREMENTS")
    else:
        try:
            bad = unsupported_libraries(req_path)
            if bad:
                result["flags"].append(f"UNSUPPORTED_LIBRARY: {', '.join(bad)}")
        except OSError:
            result["flags"].append("INVALID_REQUIREMENTS")

    # --- 3. Run the model: timing + verified predictions --------------------
    if model_path.exists():
        sandbox = run_model_sandboxed(model_path, len(answers))
        if sandbox.get("ok"):
            result["model_ran"] = True
            result["mean_run_seconds"] = sandbox["mean_run_seconds"]
            result["wall_seconds"] = sandbox["wall_seconds"]
            result["child_mean_seconds"] = sandbox["child_mean_seconds"]
            model_predictions = sandbox["predictions"]
            result["accuracy_model"] = accuracy(model_predictions, answers)
            if csv_predictions is not None:
                mismatches = sum(
                    c != m for c, m in zip(csv_predictions, model_predictions))
                result["csv_vs_model_mismatches"] = mismatches
                if mismatches:
                    result["flags"].append(
                        f"INTEGRITY_MISMATCH: submitted CSV disagrees with the "
                        f"model's own output on {mismatches} rows")
        else:
            result["flags"].append(f"MODEL_FAILED: {sandbox['error']}")

    if not result["model_ran"]:
        # Predictions could not be verified by running the model, so no
        # accuracy can be trusted — a crashing pickle cannot launder a CSV.
        result["flags"].append("UNVERIFIED_PREDICTIONS")

    return result


def clean_stale_results():
    """Remove result files whose submission folder no longer exists, so a
    withdrawn/renamed team can't linger on the leaderboard and skew everyone
    else's P_size / P_time percentiles."""
    for p in config.RESULTS_DIR.glob("*.json"):
        if not (config.SUBMISSIONS_DIR / p.stem).is_dir():
            p.unlink()
            print(f"removed stale result for '{p.stem}' (no submission folder)")


def main():
    answers = load_answer_key()
    config.RESULTS_DIR.mkdir(exist_ok=True)

    if len(sys.argv) > 1:  # single team
        team_dirs = [config.SUBMISSIONS_DIR / sys.argv[1]]
        if not team_dirs[0].is_dir():
            raise SystemExit(f"no submission folder: {team_dirs[0]}")
    else:
        clean_stale_results()
        team_dirs = sorted(
            d for d in config.SUBMISSIONS_DIR.iterdir() if d.is_dir())
        if not team_dirs:
            raise SystemExit(f"no submissions found in {config.SUBMISSIONS_DIR}")

    for team_dir in team_dirs:
        print(f"evaluating {team_dir.name} ...", flush=True)
        try:
            result = evaluate_team(team_dir, answers)
        except Exception as exc:  # never let one team abort the whole batch
            result = {"team": team_dir.name, "model_ran": False,
                      "accuracy_csv": None, "accuracy_model": None,
                      "model_size_bytes": None, "mean_run_seconds": None,
                      "csv_present": False, "csv_vs_model_mismatches": None,
                      "flags": [f"EVALUATION_ERROR: {type(exc).__name__}: {exc}",
                                "UNVERIFIED_PREDICTIONS"]}
        out_path = config.RESULTS_DIR / f"{team_dir.name}.json"
        out_path.write_text(json.dumps(result, indent=2))
        t = result["mean_run_seconds"]
        acc_m = result.get("accuracy_model")
        print(f"  model_acc={('%.1f%%' % (acc_m * 100)) if acc_m is not None else 'n/a':>7}  "
              f"size={result['model_size_bytes']}B  "
              f"time={('%.1f ms' % (t * 1000)) if t is not None else 'FAILED':>9}  "
              f"flags={result['flags'] or 'none'}")

    print(f"\nDone. Now run: python leaderboard.py")


if __name__ == "__main__":
    main()
