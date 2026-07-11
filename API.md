# Starship Safety — Portal API (for the website developer)

The judging portal runs on our VPS. The website (submission form +
leaderboard) talks to it over these HTTP endpoints. Uploads go **straight
from the participant's browser to this API** — do not proxy the model files
through Vercel serverless functions (they cap bodies at ~4.5 MB).

- **Base URL:** `https://judge.<our-domain>`  ← we'll give you the final URL
- **CORS:** already allow-listed for our site origin(s). Tell us every origin
  that will call the API (e.g. `https://data-science-summit-2026.vercel.app`
  and any custom domain) so we add them.
- **Auth:** none for the three endpoints below — they're public. (There are
  internal `/worker/*` endpoints; ignore them, they're token-gated for our
  judging machine and not for browser use.)

---

## 1. `POST /submit` — send a submission

`multipart/form-data` with:

| field             | type   | required | notes                                         |
|-------------------|--------|----------|-----------------------------------------------|
| `team`            | text   | yes      | 1–64 chars: letters, digits, space, `_`, `-`  |
| `model_pkl`       | file   | yes      | the model, `model.pkl`                        |
| `predictions_csv` | file   | yes      | `predictions.csv` (header `target_breach`)    |
| `model_py`        | file   | no       | only if their model uses a custom class       |

**200 OK**
```json
{ "submission_id": "59efc8147995", "team": "Team Rocket", "status": "queued" }
```

**Errors:** `400` invalid team name · `413` a file exceeds the size limit.

Browser example (this is the whole integration):
```js
const form = new FormData();
form.append("team", teamName);
form.append("model_pkl", modelPklFile);          // from <input type="file">
form.append("predictions_csv", predictionsFile);
if (modelPyFile) form.append("model_py", modelPyFile);   // optional

const res = await fetch("https://judge.<our-domain>/submit", {
  method: "POST",
  body: form,                 // do NOT set Content-Type; the browser sets it
});
if (!res.ok) throw new Error(`submit failed: ${res.status}`);
const { submission_id } = await res.json();
// keep submission_id and poll endpoint #2 to show progress
```

---

## 2. `GET /submission/{submission_id}` — status of one submission

Poll this after submitting (e.g. every 3–5 s) to show the team their result.

**200 OK** (before judging finishes)
```json
{ "submission_id": "59efc8147995", "team": "Team Rocket", "status": "queued" }
```

**200 OK** (after judging finishes — extra fields appear)
```json
{
  "submission_id": "59efc8147995",
  "team": "Team Rocket",
  "status": "done",
  "accuracy_percent": 100.0,
  "flags": []
}
```

`status` is one of: `queued` → `running` → `done` (or `error`).
`404` if the id is unknown.

> Note: `accuracy_percent` here is this single submission's accuracy. A
> team's leaderboard score also depends on the whole field (size/speed
> ranks), so read final standings from endpoint #3.

---

## 3. `GET /leaderboard` — live standings (JSON)

Fetch on your leaderboard page (poll every ~10–15 s). Returns an array
already sorted best-first, one row per team (their best submission):

```json
[
  {
    "rank": 1,
    "team": "Team Rocket",
    "accuracy_percent": 100.0,
    "model_size_bytes": 40,
    "mean_run_seconds": 0.0076,
    "p_size": 75.0,
    "p_time": 25.0,
    "final_score": 200.0,
    "flags": []
  }
]
```

Field notes:
- `final_score = accuracy_percent + p_size + p_time` (max 300).
- `mean_run_seconds` is in **seconds** — multiply by 1000 to show milliseconds.
- `model_size_bytes` / `mean_run_seconds` may be `null` if a model failed to run.
- `flags` is a (usually empty) list of judge notes, e.g.
  `"INTEGRITY_MISMATCH: ..."`. Safe to hide from the public view.

If you'd rather not build a table, we also serve a ready-made auto-refreshing
HTML leaderboard at **`GET /`** that you can link to or embed in an iframe.

---

## `GET /health`

Returns `{ "ok": true }`. Handy for an uptime check.

---

## What we need from you

1. The exact origin(s) your site will call from (to allow-list for CORS).
2. Confirm the submission form collects: team name, `model.pkl`,
   `predictions.csv`, and optional `model.py`.
3. Where you want the leaderboard: your own styled page fed by
   `GET /leaderboard`, or a link/iframe to our `GET /`.
