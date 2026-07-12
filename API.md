# Judging API — quick guide for the summit website

Base URL: `https://dsummit-judge.duckdns.org`

CORS is enabled for `https://data-science-summit-2026.vercel.app` — call the API
directly from the browser, no proxy needed.

---

## 1. Submit a model

`POST /api/submissions` — multipart/form-data. **All fields are required.**

| Field | Type | Notes |
|---|---|---|
| `team_name` | text | |
| `email` | text | **autofill this from the logged-in user's account — do not make them type it** |
| `model_file` | file | **`.joblib` only** (`.pkl` is rejected) |
| `predictions_csv` | file | team's predictions on the test set (`.csv`) |
| `requirements_txt` | file | pinned pip deps of their training env |
| `metrics_csv` | file | team's model metrics (`.csv`) |
| `test_x_csv` | file | the test X data (`.csv`) the model expects — the model is evaluated on this file; must have the same number of rows as the official test set |

```bash
curl -X POST https://dsummit-judge.duckdns.org/api/submissions \
  -F team_name="Team Rocket" \
  -F email="user@example.com" \
  -F model_file=@best_model_pipeline.joblib \
  -F predictions_csv=@predictions.csv \
  -F requirements_txt=@requirements.txt \
  -F metrics_csv=@metrics.csv \
  -F test_x_csv=@test_x.csv
```

Response (`201`):

```json
{ "id": "9dc75ce8e244", "status": "pending" }
```

Evaluation runs in the background — usually under a minute, up to a few minutes
during a rush (submissions are evaluated one at a time for fair timing). Poll the
leaderboard (or `GET /api/submissions/{id}`) until the status is no longer
`pending`.

JS example:

```js
const fd = new FormData();
fd.append("team_name", teamName);
fd.append("email", currentUser.email);            // autofilled, not user-typed
fd.append("model_file", modelInput.files[0]);     // .joblib only
fd.append("predictions_csv", predsInput.files[0]);
fd.append("requirements_txt", reqsInput.files[0]);
fd.append("metrics_csv", metricsInput.files[0]);
fd.append("test_x_csv", testXInput.files[0]);
const res = await fetch("https://dsummit-judge.duckdns.org/api/submissions", {
  method: "POST",
  body: fd,                                        // no Content-Type header — browser sets it
});
const { id, status } = await res.json();
```

Errors come back as `{ "detail": "message" }` with a 4xx status
(e.g. wrong file extension, invalid email, missing field).

---

## 2. Leaderboard

`GET /api/leaderboard` — ranked results, best first.

```bash
curl https://dsummit-judge.duckdns.org/api/leaderboard
```

```json
{
  "count": 2,
  "entries": [
    {
      "rank": 1,
      "team_name": "Team Rocket",
      "score": 266.0,
      "accuracy": 0.66,
      "p_size": 100.0,
      "p_time": 100.0,
      "avg_time_s": 0.0014,
      "size_bytes": 1024,
      "status": "completed"
    }
  ]
}
```

Display columns: `rank`, `team_name`, `score`, `accuracy` (multiply by 100 for %),
`p_size`, `p_time`, `avg_time_s`, `size_bytes`.

Score formula: `accuracy × 100 + Psize + Ptime` (Psize/Ptime = % of other teams
with a larger file / slower time — they change as new teams submit).

Statuses: `pending` (still evaluating), `completed`, `failed_run` (model didn't
run; the `error` field says why).
