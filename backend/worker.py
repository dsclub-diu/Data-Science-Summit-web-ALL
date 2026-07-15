"""Judging worker — runs on the LAB PC (your "standard server").

This is the only machine that holds the secret answer key (test-y.csv). It
reaches OUT to the hosted portal, pulls one submission at a time, evaluates
it with the existing judge, and pushes the measurements back. Because it
only makes outbound calls, the lab PC needs no public IP and no open ports —
it can sit behind your lab's firewall/NAT.

Evaluating ONE submission at a time is intentional: it keeps timing fair (no
two models competing for CPU). Run exactly one worker per judging machine.

Usage:
    export PORTAL_URL="https://your-portal.example.com"
    export WORKER_TOKEN="the-same-secret-the-portal-uses"
    python worker.py                 # poll forever
    python worker.py --once          # drain the queue once, then exit (tests)

Security: each model still runs in the key-free, resource-limited sandbox
subprocess. For a public event, run this whole worker inside the locked-down
Docker image (see README) so a hostile model is also network-isolated.
"""
import argparse
import os
import shutil
import sys
import tempfile
import time
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config      # noqa: E402
import evaluate    # noqa: E402

PORTAL_URL = os.environ.get("PORTAL_URL", "http://127.0.0.1:8000").rstrip("/")
WORKER_TOKEN = os.environ.get("WORKER_TOKEN", "change-me")
POLL_SECONDS = float(os.environ.get("POLL_SECONDS", "3"))
HEADERS = {"X-Worker-Token": WORKER_TOKEN}


def fetch_job():
    r = requests.get(f"{PORTAL_URL}/worker/next", headers=HEADERS, timeout=30)
    if r.status_code == 204:
        return None
    r.raise_for_status()
    return r.json()


def download_files(sid, names, dest_dir):
    for name in names:
        r = requests.get(f"{PORTAL_URL}/worker/file/{sid}/{name}",
                         headers=HEADERS, timeout=120)
        r.raise_for_status()
        (dest_dir / name).write_bytes(r.content)


def post_result(result):
    r = requests.post(f"{PORTAL_URL}/worker/result", headers=HEADERS,
                      json=result, timeout=60)
    r.raise_for_status()
    return r.json()


def evaluate_job(job, answers):
    """Download one submission, judge it, return the result row. Any failure
    becomes a flagged result so the submission never stays stuck 'running'."""
    sid, team = job["submission_id"], job["team"]
    work = Path(tempfile.mkdtemp(prefix="worker_"))
    team_dir = work / team
    team_dir.mkdir()
    try:
        download_files(sid, job["files"], team_dir)
        result = evaluate.evaluate_team(team_dir, answers)
    except Exception as exc:
        result = {"team": team, "model_ran": False,
                  "accuracy_csv": None, "accuracy_model": None,
                  "model_size_bytes": None, "mean_run_seconds": None,
                  "csv_present": False, "csv_vs_model_mismatches": None,
                  "flags": [f"EVALUATION_ERROR: {type(exc).__name__}: {exc}",
                            "UNVERIFIED_PREDICTIONS"]}
    finally:
        shutil.rmtree(work, ignore_errors=True)
    result["submission_id"] = sid
    result["team"] = team
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--once", action="store_true",
                        help="process available jobs then exit")
    args = parser.parse_args()

    answers = evaluate.load_answer_key()  # loaded once; the key stays here
    print(f"worker up — portal={PORTAL_URL}, key rows={len(answers)}", flush=True)

    idle = False
    while True:
        try:
            job = fetch_job()
        except requests.RequestException as exc:
            print(f"portal unreachable ({exc}); retrying in {POLL_SECONDS}s",
                  flush=True)
            time.sleep(POLL_SECONDS)
            continue

        if job is None:
            if args.once:
                print("queue empty — exiting (--once)", flush=True)
                return
            if not idle:
                print("queue empty — waiting for submissions", flush=True)
                idle = True
            time.sleep(POLL_SECONDS)
            continue

        idle = False
        print(f"judging {job['team']} ({job['submission_id']}) ...", flush=True)
        result = evaluate_job(job, answers)
        try:
            post_result(result)
        except requests.RequestException as exc:
            print(f"failed to post result for {job['submission_id']}: {exc}",
                  flush=True)
            continue
        t = result.get("mean_run_seconds")
        acc = result.get("accuracy_model")
        print(f"  done: acc={('%.1f%%' % (acc*100)) if acc is not None else 'n/a'} "
              f"time={('%.1f ms' % (t*1000)) if t is not None else 'FAILED'} "
              f"flags={result.get('flags') or 'none'}", flush=True)


if __name__ == "__main__":
    main()
