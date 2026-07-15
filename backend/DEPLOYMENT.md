# Deployment — hosted portal + lab-PC worker

This is the live setup: a **portal** participants submit to (hosted, public)
and a **worker** that does the judging (your lab PC, which holds the secret
answer key). If you just want to score a folder of submissions offline, use
the batch flow in `README.md` instead — same judge underneath.

## How the two machines talk

```
   participants                     YOUR LAB PC (worker.py)
        │                           holds test-y.csv (the key)
        │ upload                    ┌───────────────────────────┐
        ▼                           │ loop:                     │
 ┌──────────────┐   pull job        │  GET /worker/next  ───────┼──┐
 │  PORTAL      │◄──────────────────┼─ download files           │  │ outbound
 │ (portal.py)  │   push result     │  judge with the key       │  │ only
 │ hosted, public├──────────────────┼─ POST /worker/result      │  │
 │ NO key here  │                   └───────────────────────────┘  │
 └──────┬───────┘◄─────────────────────────────────────────────────┘
        │ live leaderboard
        ▼
   spectators (GET / )
```

**The lab PC reaches out to the portal; the portal never connects back.** The
lab PC makes only outbound HTTPS calls, so it needs no public IP and no open
ports — it works behind your lab's firewall/NAT unchanged. (Like the lab PC
checking a shared mailbox, instead of the portal needing your PC's address.)

**The answer key lives only on the lab PC.** The portal stores submissions
and runs the public scoring math on measurements the worker sends back; it
never sees `test-y.csv`. If the hosted box is compromised, the key isn't on it.

**One worker per judging machine.** Submissions are judged one at a time so
timing stays fair. Don't run multiple workers against one portal.

## 1. Run the portal (hosted server)

```bash
pip install fastapi "uvicorn[standard]" python-multipart   # + this repo's judging/ files
export WORKER_TOKEN="pick-a-long-random-secret"            # shared with the worker
export PORTAL_DATA="/var/lib/starship-portal"              # where submissions are stored
uvicorn portal:app --host 0.0.0.0 --port 8000              # single process (keep it one)
```

Put it behind HTTPS (a reverse proxy like Caddy/nginx, or your cloud's load
balancer). Participants hit `https://your-portal/…`; spectators watch the
leaderboard at `https://your-portal/`.

## 2. Run the worker (lab PC — the "standard server")

The lab PC needs the judge files, the allowed ML libraries (see `Dockerfile`),
and `test-y.csv` present where `config.py` expects it.

```bash
export PORTAL_URL="https://your-portal.example.com"
export WORKER_TOKEN="the-same-secret-as-the-portal"
python worker.py            # polls forever, judging one submission at a time
```

For a public event, run the worker inside the locked-down image so a hostile
model is also network-isolated:

```bash
docker build -t starship-judge judging/
docker run --rm --network none --cpus 2 --memory 4g \
  -e PORTAL_URL -e WORKER_TOKEN -v "$PWD":/hackathon -w /hackathon/judging \
  starship-judge python worker.py
```

(`--network none` blocks a model from phoning home; the worker itself needs
network to reach the portal, so in the strictest setup run the worker on the
host and have it launch each *model* in a `--network none` container — see the
security note in `README.md`.)

## 3. How participants submit

Give them the portal URL and the submission contract from `README.md`. A
submission is a `multipart/form-data` POST to `/submit` with `team`,
`model_pkl`, `predictions_csv`, and optional `model_py`:

```bash
python submit_example.py --url https://your-portal --team "Team Name" \
    --folder ./my_submission
# or plain curl:
curl -F team="Team Name" -F model_pkl=@model.pkl \
     -F predictions_csv=@predictions.csv -F model_py=@model.py \
     https://your-portal/submit
```

The response includes a `submission_id`; they can poll
`GET /submission/<id>` for status and their model's measured accuracy/flags.

## Resubmissions & leaderboard

- **Keep best score.** A team may submit many times; each is judged, and the
  leaderboard shows each team's best submission (highest verified accuracy,
  ties broken by smaller then faster model).
- **Live leaderboard.** `GET /` (HTML, auto-refresh) and `GET /leaderboard`
  (JSON) recompute standings from all results on each request. Because
  P_size/P_time are relative, ranks shift as more teams are judged — expected.
- **Stuck jobs self-heal.** If the worker dies mid-job, the submission is
  requeued after `STALE_RUNNING_SECONDS` (default 15 min).

## Environment variables

| Variable                | Where   | Default            | Meaning                                   |
|-------------------------|---------|--------------------|-------------------------------------------|
| `WORKER_TOKEN`          | both    | `change-me`        | Shared secret; worker endpoints need it   |
| `PORTAL_DATA`           | portal  | `./portal_data`    | Where submissions/results are stored      |
| `MAX_UPLOAD_MB`         | portal  | `200`              | Per-file upload cap                        |
| `STALE_RUNNING_SECONDS` | portal  | `900`              | Requeue a job a dead worker left running   |
| `PORTAL_URL`            | worker  | `http://127.0.0.1:8000` | Portal the worker pulls from         |
| `POLL_SECONDS`          | worker  | `3`                | How often the worker checks for work       |

## Pre-event checklist

- [ ] `python selftest.py` on the worker box → `ALL CHECKS PASSED`.
- [ ] `test-y.csv` is on the worker only, never on the portal.
- [ ] `WORKER_TOKEN` is long, random, and identical on both.
- [ ] Portal is behind HTTPS; only `/submit`, `/`, `/leaderboard` are meant to
      be public (worker endpoints are token-gated).
- [ ] Freeze `config.py` (integrity policy, accuracy floor) before opening.
- [ ] Do a dry run: `make_mock_submissions.py` → submit each → start worker →
      watch the leaderboard fill in.
