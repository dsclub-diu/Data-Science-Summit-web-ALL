"""Proof-by-known-answers that the judge grades and ranks correctly.

It feeds the real judge submissions whose correct score anyone can work out
by hand, and checks the judge produces exactly that. Run it any time you want
to reassure yourself (or a co-organizer) that nothing has drifted:

    python verify_correctness.py

No trust required — every expected number below is self-evident from the
test set, not from the code being tested.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

import config
import evaluate
import scoring

FIXED_MODEL = '''
LABELS = {labels}
class Fixed:
    def predict(self, df):
        return LABELS[:len(df)]
def build():
    return Fixed()
'''


def build_submission(folder, labels):
    folder.mkdir(parents=True)
    (folder / "model.py").write_text(FIXED_MODEL.format(labels=labels))
    (folder / "predictions.csv").write_text(
        "target_breach\n" + "\n".join(str(v) for v in labels) + "\n")
    subprocess.run(
        [sys.executable, "-c",
         "import pickle, model; pickle.dump(model.build(), open('model.pkl','wb'))"],
        cwd=folder, check=True)


def approx(a, b, tol=1e-6):
    return abs(a - b) <= tol


def main():
    answers = evaluate.load_answer_key()
    n = len(answers)
    ones = sum(answers)
    zeros = n - ones
    print(f"Answer key: {n} cases — {zeros} safe (0), {ones} failed (1).\n")

    cases = [
        ("submits the exact answers",      answers,                 100.0,
         "every case correct"),
        ("guesses all 0",                  [0] * n,                 100.0 * zeros / n,
         f"{zeros} of {n} happen to be 0"),
        ("guesses all 1",                  [1] * n,                 100.0 * ones / n,
         f"{ones} of {n} happen to be 1"),
        ("submits the opposite of every answer", [1 - a for a in answers], 0.0,
         "every case wrong"),
    ]

    tmp = Path(tempfile.mkdtemp(prefix="verify_"))
    print(f"{'a team that...':<40} {'expected':>9} {'judge said':>11}   result")
    print("-" * 74)
    all_ok = True
    for i, (desc, labels, expected, why) in enumerate(cases):
        folder = tmp / f"case_{i}"
        build_submission(folder, labels)
        result = evaluate.evaluate_team(folder, answers)
        got = (result.get("accuracy_model") or 0.0) * 100
        ok = approx(got, expected)
        all_ok &= ok
        print(f"{desc:<40} {expected:>8.1f}% {got:>10.1f}%   "
              f"{'PASS' if ok else 'FAIL'}   ({why})")

    # --- Ranking formula: two teams whose scores you can add up by hand ----
    print("\nRanking check — two perfect (100%) teams, one smaller & faster:")
    rows = [
        {"team": "small_fast", "model_ran": True, "accuracy_model": 1.0,
         "model_size_bytes": 100, "mean_run_seconds": 0.01, "flags": []},
        {"team": "big_slow", "model_ran": True, "accuracy_model": 1.0,
         "model_size_bytes": 200, "mean_run_seconds": 0.02, "flags": []},
    ]
    ranked = scoring.finalize(rows)
    by_team = {r["team"]: r for r in ranked}
    # small_fast beats the 1 other team on both size and time -> 100 + 100 + 100
    expect = {"small_fast": 300.0, "big_slow": 100.0}
    for team, exp in expect.items():
        got = by_team[team]["final_score"]
        ok = approx(got, exp)
        all_ok &= ok
        print(f"  {team:<12} expected score {exp:>6.1f}, judge said {got:>6.1f}   "
              f"{'PASS' if ok else 'FAIL'}")
    print("  (score = accuracy 100 + P_size + P_time; smaller+faster of two = "
          "100+100+100 = 300)")

    import shutil
    shutil.rmtree(tmp, ignore_errors=True)

    print("\n" + ("EVERYTHING CORRECT — the judge grades and ranks exactly as "
                  "specified." if all_ok else "SOMETHING IS WRONG — do not use "
                  "until fixed."))
    raise SystemExit(0 if all_ok else 1)


if __name__ == "__main__":
    main()
