# Starship Safety — Judging System

Automated evaluation for the hackathon. Implements the exact scoring rule
from the problem statement PDF:

```
Final Score = (Accuracy x 100) + P_size + P_time        (max 300)
```

- **Accuracy** — % of correct predictions against the secret answer key
  (`test-y.csv`). Scored from the predictions the model **actually produces
  when the judge runs it**, not from the submitted CSV (see anti-cheat).
- **P_size** — % of other submissions whose `model.pkl` file is **larger**.
- **P_time** — % of other submissions whose execution time is **slower**.

## How it works

```
submissions/                 results/
  team_a/  ─┐                  team_a.json ─┐
  team_b/  ─┼─► evaluate.py ─► team_b.json ─┼─► leaderboard.py ─► leaderboard.csv
  team_c/  ─┘   (one team      team_c.json ─┘   (percentiles +      + printed table
                at a time,                       final scores)
                sandboxed)
```

You can run this **two ways**:
- **Offline batch** (this doc): drop every team's folder in `submissions/`,
  run two scripts, get a ranking. Simplest for judging after a deadline.
- **Live service** (`DEPLOYMENT.md`): a hosted `portal.py` participants submit
  to + a `worker.py` on your lab PC that pulls jobs and judges them, with a
  live leaderboard. Same judge core underneath.

Two phases, because P_size and P_time are *relative* ranks — they can only
be computed after **every** team has been measured:

1. **`evaluate.py`** measures each team independently and writes one
   `results/<team>.json`. For each team it records the model file size, runs
   the model in a sandboxed subprocess to get its real predictions, and
   times that run.
2. **`leaderboard.py`** reads all result files, computes the percentiles,
   applies the anti-cheat policy, and prints/writes the final ranking.

## Running an evaluation

```bash
# 0. One-time: install the libraries participants may use (see Dockerfile),
#    or just use the Docker image below. The judging box needs pandas,
#    numpy, scikit-learn, joblib, and anything else you allow — otherwise
#    real models cannot be unpickled.

# 1. Drop each team's files into submissions/<team_name>/
#      model.pkl        (required)
#      predictions.csv  (required — header "target_breach", then 500 rows of 0/1)
#      model.py         (only if their pickle uses a custom class/function)

# 2. Prove the judge itself is sound (adversarial self-test):
python selftest.py

# 3. Measure every submission (or re-run one team: python evaluate.py team_name)
python evaluate.py

# 4. Score and rank
python leaderboard.py
```

Try it end-to-end with fake teams first: `python make_mock_submissions.py`,
then steps 3–4. It creates honest teams, a scikit-learn+joblib team, and two
cheaters so you can see the anti-cheat in action. Delete `submissions/` and
`results/` before the real event.

All policies (timing runs, timeouts, size limits, anti-cheat, accuracy
floor) live in `config.py`. Freeze it before the first real evaluation.

## The submission contract (announce this to participants!)

The PDF says to submit a `.pkl` and a CSV, but for the judge to *run* every
model uniformly, participants must also be told:

1. **The pickled object must expose `model.predict(df)`** where `df` is the
   raw `test-x.csv` loaded with `pandas.read_csv`. All preprocessing must
   live **inside** the model object (e.g. an sklearn `Pipeline` or a custom
   class). It must return 500 **class labels** — each exactly `0` or `1`
   (or `True`/`False`). Returning probabilities (e.g. `0.93`) is rejected;
   threshold them yourself.
2. **Saving the model.** Either `pickle.dump(model, f)` or
   `joblib.dump(model, "model.pkl")` is accepted (joblib, including
   `compress=`, is the standard way to shrink an sklearn model and the judge
   loads both). The file must be named exactly `model.pkl`.
3. **Custom classes/functions must live in a file named exactly `model.py`**
   (module name `model`), included in the submission, and the pickle must be
   created by importing from that module. A class or `FunctionTransformer`
   pickled from a notebook or a differently-named script records its origin
   as `__main__`/`<scriptname>` and will fail to load on the judge even if
   `model.py` is present.
4. **Only libraries installed on the judging server may be used.** Publish
   the exact list with pinned versions (see `Dockerfile`) — a pickle saved
   under a different sklearn/xgboost version may fail to load.
5. **The predictions CSV must be produced by the submitted model.** The
   judge re-runs every model and compares its output to the submitted CSV.

## Anti-cheat

The scoring formula rewards tiny, fast models, which invites two exploits.
The system is built so neither pays off — verified by `selftest.py`:

**Exploit A — leaked answer key as a CSV, paired with a dummy/broken model.**
`evaluate.py` runs every model and **scores accuracy from the model's own
output**, using the submitted CSV only to flag mismatches. A model that
fails to load or run yields *unverifiable* predictions and earns **0
accuracy** — a deliberately-crashing pickle can no longer launder a leaked
CSV into points. `config.INTEGRITY_POLICY` tunes the response to a CSV that
disagrees with a *working* model:

| Policy                | Effect                                                      |
|-----------------------|-------------------------------------------------------------|
| `use_model_accuracy`  | Accuracy scored from the model's real output *(default)*    |
| `disqualify`          | Mismatching team's final score set to 0                     |
| `use_csv`             | Trust the CSV even for a non-running model *(reopens exploit A — not recommended)* |

**Exploit B — a model that reads the answer key off disk.** The sandbox runs
each model in a scratch directory containing only a **copy of `test-x.csv`**,
never `test-y.csv`, so a model cannot open the key as a sibling of the inputs
it is given. (The mock `team_ghost` demonstrates this: it scores 100% when
the key is reachable and 50% under the judge.)

**Forged self-reporting.** Because unpickling runs arbitrary code, the judge
trusts *nothing* the model process prints about itself: timing is measured
by the parent's wall-clock, predictions are read from a parent-created
result file, and accuracy is recomputed by the parent.

**The formula's own degenerate strategy.** Size + time are worth up to 200
points but accuracy only 100, so a do-nothing model (predict all zeros:
~50% accuracy on this balanced test set, tiny, instant) can out-score a
perfect model. If you don't want that, set `MIN_ACCURACY_PERCENT` in
`config.py` (e.g. `70`) — teams below the floor earn no size/time points —
and announce the rule beforehand.

## What "execution time" means here

Per the PDF, timing is the average over `N_TIMING_RUNS` (100) executions.
One execution = **load the model file + predict on the full test set**. The
**judge measures wall-clock time in the parent process** around the whole
100-run sandbox job and divides by 100; it never trusts a time reported by
the model. This includes one process/library startup amortized across the
runs (a small fixed cost every team pays equally), which keeps the relative
P_time ranking fair while making a forged "0.000001s" impossible.

Timing fairness:
- Teams are evaluated **one at a time, never in parallel** — parallel runs
  compete for CPU and corrupt each other's timing. (Parallelism is for web
  servers, not benchmarking.)
- Run on one otherwise-idle machine, plugged in (laptops throttle on
  battery), other apps closed.
- Re-runs vary slightly; the 100-run average smooths this.

## Security

A `.pkl` file is a program: unpickling it executes arbitrary code. This
system isolates each submission in a subprocess with CPU/memory/time limits
and its own process group (so a timeout kills the whole tree), which handles
accidents — infinite loops, memory bombs, crashes — and the key-read exploit
above. For a **deliberately hostile** field, add container isolation:

```bash
docker build -t starship-judge judging/
# Run from the project root. Mount the project so the judge can read the
# code and inputs; --network none blocks exfiltration and downloads.
docker run --rm --network none --cpus 2 --memory 4g \
  -v "$PWD":/hackathon -w /hackathon/judging starship-judge \
  python evaluate.py
```

Honest caveats:
- `--network none` blocks a model from *sending* data out, but does **not**
  protect the answer key if the key is present in the sandbox's filesystem —
  a model could just read it and return it as predictions. The real
  protection is keeping `test-y.csv` **out of the model's reach**: the
  evaluator already hands the sandbox only a copy of `test-x.csv`. For
  maximum safety, run the model-execution step in a container that has
  **only `test-x.csv` mounted** and do the scoring against `test-y.csv`
  outside that container.
- Never run untrusted pickles on a machine holding anything sensitive.

## Operational checklist for event day

- [ ] Install/verify the allowed libraries on the judging box (or use Docker).
- [ ] Run `python selftest.py` — it must print `ALL CHECKS PASSED`.
- [ ] Keep `test-y.csv` off any machine/drive participants can access.
- [ ] Announce the submission contract (above) and the pinned library list.
- [ ] Freeze `config.py`; same rules for everyone.
- [ ] Collect submissions (one folder per team).
- [ ] `python evaluate.py` (auto-prunes results for withdrawn teams), then
      `python leaderboard.py`.
- [ ] Review every flag in the output before announcing winners
      (`INTEGRITY_MISMATCH`, `MODEL_FAILED`, `UNVERIFIED_PREDICTIONS`, …).
- [ ] Keep `results/*.json` and `leaderboard.csv` as the audit trail.
