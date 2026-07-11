# Hackathon Model Judging

FastAPI backend + static frontend for judging ML model submissions. Teams upload a
joblib model (optionally a predictions CSV and a `requirements.txt`); the server runs
each model `N_RUNS` times on the test dataset and scores:

```
score = (accuracy × 100) + Psize + Ptime
```

- **accuracy** — % correct predictions on the hidden test set
- **Psize** — % of competing submissions with a larger model file
- **Ptime** — % of competing submissions with a slower average predict time

## Layout

```
backend/    FastAPI app (main.py) + isolated model runner (runner.py)
frontend/   Single-page upload form + live leaderboard (plain HTML/JS)
data/       (gitignored) test_x.csv, test_y.csv, results.db, submissions/
```

## Run

```bash
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
.venv/bin/uvicorn backend.main:app --port 8000     # backend
python3 -m http.server 3000 -d frontend            # frontend → http://localhost:3000
```

Then upload the test data (admin form in the UI, or):

```bash
curl -X PUT localhost:8000/api/test-data -F test_x=@test_x.csv -F test_y=@test_y.csv
```

## API

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/submissions` | upload team_name, model_file (+ predictions_csv, requirements_txt) |
| GET | `/api/submissions` | all submissions |
| GET | `/api/leaderboard` | ranked scores |
| PUT | `/api/test-data` | replace test X / Y csvs |
| GET | `/api/health` | status |

## Evaluation details

- Each model runs `N_RUNS` times (see `backend/main.py`; spec uses 100) and the
  average predict time is stored. Per-run timings are appended to `data/eval.log`.
- If a team uploads `requirements.txt`, a per-submission virtualenv is built from it
  and the model runs there; otherwise the server environment is used
  (sklearn pinned to Colab's version as a sensible default).
- If the model cannot run at all, accuracy falls back to the team's uploaded
  predictions CSV (`accuracy_source: team_csv`).
