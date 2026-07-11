# Judging API — quick guide for the summit website

Base URL: `https://dsummit-judge.duckdns.org`

CORS is enabled for `https://data-science-summit-2026.vercel.app` — call the API
directly from the browser, no proxy needed.

---

## 1. Submit a model

`POST /api/submissions` — multipart/form-data

| Field | Required | Type | Notes |
|---|---|---|---|
| `team_name` | yes | text | |
| `model_file` | yes | file | `.joblib` or `.pkl` |
| `predictions_csv` | no | file | team's own predictions (sanity check / fallback) |
| `requirements_txt` | no | file | pinned deps; we build their env from it |

```bash
curl -X POST https://dsummit-judge.duckdns.org/api/submissions \
  -F team_name="Team Rocket" \
  -F model_file=@best_model_pipeline.joblib \
  -F requirements_txt=@requirements.txt
```

Response (`201`):

```json
{ "id": "9dc75ce8e244", "status": "pending" }
```

Evaluation runs in the background — usually a few seconds, up to ~1–2 minutes
when a `requirements.txt` env has to be built. Poll the leaderboard (or
`GET /api/submissions/{id}`) until the status is no longer `pending`.

JS example:

```js
const fd = new FormData();
fd.append("team_name", name);
fd.append("model_file", fileInput.files[0]);          // required
// fd.append("requirements_txt", reqInput.files[0]);  // optional
const res = await fetch("https://dsummit-judge.duckdns.org/api/submissions", {
  method: "POST",
  body: fd,                                            // no Content-Type header — browser sets it
});
const { id, status } = await res.json();
```

Errors come back as `{ "detail": "message" }` with a 4xx status.

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
