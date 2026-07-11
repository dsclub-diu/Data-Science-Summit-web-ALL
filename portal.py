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
                "requirements_txt": "requirements.txt",
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
                 requirements_txt: UploadFile = File(...),
                 model_py: UploadFile = File(None)):
    """A participant uploads their model + predictions + requirements.txt
    (+ optional model.py). Stored as a queued submission for the worker."""
    team = team.strip()
    if not TEAM_RE.match(team):
        raise HTTPException(status_code=400,
                            detail="team must be 1-64 chars of letters, digits, space, _ or -")

    sid = uuid.uuid4().hex[:12]
    SUBS_DIR.mkdir(parents=True, exist_ok=True)   # survive a data-dir wipe
    sub_dir = SUBS_DIR / sid
    sub_dir.mkdir(parents=True)
    try:
        await _save_upload(model_pkl, sub_dir / "model.pkl")
        await _save_upload(predictions_csv, sub_dir / "predictions.csv")
        await _save_upload(requirements_txt, sub_dir / "requirements.txt")
        files = ["model.pkl", "predictions.csv", "requirements.txt"]
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
    # Recreate the results dir in case it was wiped at runtime (e.g. clearing
    # test data without restarting) so a result write can never 500.
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
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


# Self-contained test dashboard: upload form + live leaderboard. All data is
# fetched client-side from the same origin (/submit, /submission, /leaderboard),
# so there are no cross-site issues. Lets the organizer test the full pipeline
# before the summit website's own form is wired up.
DASHBOARD_HTML = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Starship Safety — Judge Dashboard</title>
<style>
  :root{--bg:#0b1020;--card:#141b30;--line:#26304a;--text:#e6e9f0;--muted:#9fb0d0;--accent:#7fd1a0;--accent2:#5b8cff;--warn:#e6a15b}
  *{box-sizing:border-box}
  body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:var(--bg);color:var(--text)}
  .wrap{max-width:1000px;margin:0 auto;padding:2rem 1.25rem 4rem}
  h1{font-weight:650;margin:0 0 .25rem}
  .sub{color:var(--muted);margin:0 0 2rem}
  .card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:2rem}
  .card h2{margin:0 0 1rem;font-size:1.05rem;font-weight:600}
  label{display:block;font-size:.8rem;color:var(--muted);margin:.75rem 0 .3rem}
  input[type=text],input[type=file]{width:100%;padding:.55rem .6rem;background:#0b1020;color:var(--text);border:1px solid var(--line);border-radius:8px;font-size:.9rem}
  input[type=file]{padding:.4rem}
  button{margin-top:1.1rem;background:var(--accent2);color:#fff;border:0;padding:.6rem 1.5rem;border-radius:8px;font-size:.95rem;font-weight:600;cursor:pointer}
  button:disabled{opacity:.5;cursor:default}
  .status{margin-top:1rem;padding:.7rem .9rem;border-radius:8px;background:#0b1020;border:1px solid var(--line);font-size:.9rem;min-height:1.2rem;color:var(--muted)}
  table{border-collapse:collapse;width:100%;font-size:.9rem}
  th,td{padding:.5rem .6rem;text-align:left;border-bottom:1px solid var(--line)}
  th{color:var(--muted);font-weight:600}
  td.score{color:var(--accent);font-weight:600}
  .flags{color:var(--warn);font-size:.8rem}
  .muted{color:var(--muted);font-size:.85rem}
  .req{color:var(--warn)}
</style></head>
<body><div class="wrap">
  <h1>🚀 Starship Safety — Judge Dashboard</h1>
  <p class="sub">Test console. Anything submitted here is judged by the live server, exactly as the summit website will do.</p>

  <div class="card">
    <h2>Submit a test entry</h2>
    <form id="f" onsubmit="return submitForm(event)">
      <label>Team name</label>
      <input type="text" name="team" required maxlength="64" placeholder="e.g. Test Team 1">
      <label>model.pkl <span class="req">(required)</span></label>
      <input type="file" name="model_pkl" accept=".pkl" required>
      <label>predictions.csv <span class="req">(required)</span></label>
      <input type="file" name="predictions_csv" accept=".csv" required>
      <label>requirements.txt <span class="req">(required — your library dependencies)</span></label>
      <input type="file" name="requirements_txt" accept=".txt" required>
      <label>model.py <span class="muted">(optional — only if the pickle uses a custom class)</span></label>
      <input type="file" name="model_py" accept=".py">
      <button id="btn" type="submit">Submit</button>
    </form>
    <div class="status" id="status">Ready.</div>
  </div>

  <div class="card">
    <h2>Live leaderboard <span class="muted" id="count"></span></h2>
    <div style="overflow-x:auto">
      <table>
        <thead><tr><th>#</th><th>Team</th><th>Acc%</th><th>Size</th><th>Avg time</th>
        <th>P_size</th><th>P_time</th><th>Score</th><th>Flags</th></tr></thead>
        <tbody id="board"><tr><td colspan="9" class="muted">loading…</td></tr></tbody>
      </table>
    </div>
    <p class="muted" style="margin-top:.8rem">Auto-refreshes every 10s · score = accuracy×100 + P_size + P_time (max 300).</p>
  </div>
</div>
<script>
const $ = id => document.getElementById(id);
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
async function submitForm(e){
  e.preventDefault();
  const form=e.target, btn=$('btn');
  const data=new FormData();
  data.append('team', form.team.value);
  data.append('model_pkl', form.model_pkl.files[0]);
  data.append('predictions_csv', form.predictions_csv.files[0]);
  data.append('requirements_txt', form.requirements_txt.files[0]);
  if(form.model_py.files[0]) data.append('model_py', form.model_py.files[0]);
  btn.disabled=true; $('status').textContent='Uploading…';
  try{
    const res=await fetch('/submit',{method:'POST',body:data});
    const body=await res.json().catch(()=>({}));
    if(!res.ok){ $('status').textContent='Error '+res.status+': '+(body.detail||'upload failed'); btn.disabled=false; return false; }
    $('status').textContent='Submitted ('+body.submission_id+') — judging…';
    poll(body.submission_id, btn);
  }catch(err){ $('status').textContent='Network error: '+err; btn.disabled=false; }
  return false;
}
async function poll(sid, btn){
  try{
    const j=await (await fetch('/submission/'+sid)).json();
    if(j.status==='done'||j.status==='error'){
      const fl=(j.flags&&j.flags.length)?' — flags: '+j.flags.join(', '):'';
      $('status').textContent='Result: '+j.status+' · accuracy '+(j.accuracy_percent??'?')+'%'+fl;
      btn.disabled=false; loadBoard(); return;
    }
    $('status').textContent='Status: '+j.status+' …';
  }catch(err){}
  setTimeout(()=>poll(sid, btn), 3000);
}
async function loadBoard(){
  try{
    const rows=await (await fetch('/leaderboard')).json();
    $('count').textContent = rows.length ? '· '+rows.length+' teams' : '';
    if(!rows.length){ $('board').innerHTML='<tr><td colspan="9" class="muted">no submissions yet</td></tr>'; return; }
    $('board').innerHTML = rows.map(r =>
      '<tr><td>'+r.rank+'</td><td>'+esc(r.team)+'</td><td>'+r.accuracy_percent.toFixed(1)+'</td>'
      +'<td>'+(r.model_size_bytes!=null?r.model_size_bytes+' B':'-')+'</td>'
      +'<td>'+(r.mean_run_seconds!=null?(r.mean_run_seconds*1000).toFixed(2)+' ms':'FAILED')+'</td>'
      +'<td>'+r.p_size.toFixed(1)+'</td><td>'+r.p_time.toFixed(1)+'</td>'
      +'<td class="score">'+r.final_score.toFixed(1)+'</td>'
      +'<td class="flags">'+((r.flags&&r.flags.length)?esc(r.flags.join(', ')):'')+'</td></tr>'
    ).join('');
  }catch(err){ $('board').innerHTML='<tr><td colspan="9" class="muted">could not load leaderboard</td></tr>'; }
}
loadBoard(); setInterval(loadBoard, 10000);
</script>
</body></html>"""


@app.get("/", response_class=HTMLResponse)
def home():
    return DASHBOARD_HTML


@app.get("/health")
def health():
    return {"ok": True}
