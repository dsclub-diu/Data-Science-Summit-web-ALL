# API update — F1 score (new)

Additions only — everything else in `API.md` is unchanged.

## What's new

- Every evaluated submission now gets an **`f1`** value (0–1): the F1 score of
  the positive class, computed by the judging server on the test set from the
  same predictions used for accuracy.
- F1 is **informational** — the official score is still
  `accuracy × 100 + Psize + Ptime`. F1 does not affect it.
- The internal dashboard shows an F1 column plus a second, F1-sorted leaderboard.

## Where it appears

`f1` is a new field on the objects returned by:

- `GET /api/leaderboard` (each entry)
- `GET /api/submissions` and `GET /api/submissions/{id}`

```bash
curl https://dsummit-judge.duckdns.org/api/leaderboard
```

```json
{
  "count": 2,
  "entries": [
    {
      "rank": 1,
      "team_name": "Team Red",
      "score": 283.0,
      "accuracy": 0.83,
      "f1": 0.83,
      "p_size": 100.0,
      "p_time": 100.0,
      "avg_time_s": 0.0014,
      "size_bytes": 1024,
      "status": "completed"
    }
  ]
}
```

`f1` can be `null` (e.g. the model never ran and no metrics could be computed) —
handle that when rendering.

## Building an F1-ranked leaderboard on the website

There is no separate endpoint — sort the same response client-side:

```js
const { entries } = await fetch("https://dsummit-judge.duckdns.org/api/leaderboard")
  .then(r => r.json());
const byF1 = entries
  .filter(e => e.f1 != null)
  .sort((a, b) => b.f1 - a.f1);   // rank = array index + 1
```

Suggested columns: rank, `team_name`, `f1`, `accuracy`, `avg_time_s`,
`size_bytes`, and the entry's official `rank` for cross-reference. Label the
table clearly as informational so participants don't mistake it for the
official standings.
