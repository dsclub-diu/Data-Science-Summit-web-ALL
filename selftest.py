"""Adversarial self-test for the judging system. Builds deliberately nasty
submissions in a temporary area, runs the real evaluator against them, and
asserts the judge stays correct and uncrashable. Run before the event:

    python selftest.py

Each case targets a specific attack or messy-input class that a review
found and that the current code is meant to defend against.
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import config
import evaluate

PASS, FAIL = "PASS", "FAIL"


def write_csv(path, labels, bom=False):
    text_rows = ["target_breach"] + [str(v) for v in labels]
    data = "\n".join(text_rows) + "\n"
    prefix = "﻿" if bom else ""
    path.write_text(prefix + data, encoding="utf-8")


# --- Adversarial / messy model.py sources ----------------------------------

# Raises during unpickle: pairs with a leaked-answer CSV to try to launder
# 100% accuracy through a "broken" model.
CRASH_SRC = '''
class Boom:
    def __reduce__(self):
        return (exec, ("raise RuntimeError('boom on unpickle')",))
def build():
    return Boom()
'''

# Prints a forged "fast + perfect" JSON verdict to stdout and exits before
# doing any real work — tries to beat the timing/prediction channels.
FORGE_SRC = '''
import os, sys, json
class Forge:
    def __reduce__(self):
        payload = json.dumps({"ok": True, "predictions": [1]*500,
                              "n_runs": 100, "child_mean_seconds": 1e-9})
        code = ("import os,sys; sys.stdout.write(%r); sys.stdout.flush(); os._exit(0)"
                % payload)
        return (exec, (code,))
def build():
    return Forge()
'''

# An honest, correct tiny model (reused for the BOM case).
GOOD_SRC = '''
class AllOnes:
    def predict(self, df):
        return [1]*len(df)
def build():
    return AllOnes()
'''


def build_team(root, name, src, csv_labels, bom=False):
    d = root / name
    d.mkdir(parents=True)
    (d / "model.py").write_text(src.lstrip())
    # Pickle in a subprocess that imports the module, exactly as a real
    # participant would (a class must be importable to unpickle later).
    subprocess.run(
        [sys.executable, "-c",
         "import pickle, model; pickle.dump(model.build(), open('model.pkl','wb'))"],
        cwd=d, check=True)
    if csv_labels is not None:
        write_csv(d / "predictions.csv", csv_labels, bom=bom)
    return d


def check(name, condition, detail=""):
    status = PASS if condition else FAIL
    print(f"  [{status}] {name}{(' — ' + detail) if detail else ''}")
    return condition


def main():
    answers = evaluate.load_answer_key()
    tmp = Path(tempfile.mkdtemp(prefix="judge_selftest_"))
    # Point the evaluator at the temp submissions area.
    original = config.SUBMISSIONS_DIR
    config.SUBMISSIONS_DIR = tmp
    ok = True
    try:
        # 1. Leaked-key CSV + crashing model must NOT earn accuracy.
        build_team(tmp, "crash_launder", CRASH_SRC, answers)  # CSV = answer key
        r = evaluate.evaluate_team(tmp / "crash_launder", answers)
        ok &= check("crash-launder: model did not run", r["model_ran"] is False)
        ok &= check("crash-launder: flagged unverified",
                    "UNVERIFIED_PREDICTIONS" in r["flags"])
        ok &= check("crash-launder: model accuracy not credited",
                    r["accuracy_model"] is None)

        # 2. Forged stdout verdict must be ignored (no result file written).
        build_team(tmp, "forger", FORGE_SRC, [1] * 500)
        r = evaluate.evaluate_team(tmp / "forger", answers)
        ok &= check("forger: model did not run", r["model_ran"] is False)
        ok &= check("forger: no forged timing accepted",
                    r["mean_run_seconds"] is None)

        # 3. Excel UTF-8 BOM on the header must still parse correctly.
        build_team(tmp, "bom_team", GOOD_SRC, [1] * 500, bom=True)
        r = evaluate.evaluate_team(tmp / "bom_team", answers)
        ok &= check("bom: CSV parsed despite BOM",
                    r["accuracy_csv"] is not None,
                    f"accuracy_csv={r['accuracy_csv']}")
        ok &= check("bom: model ran and matches CSV",
                    r["model_ran"] and r["csv_vs_model_mismatches"] == 0)

        # 4. The whole batch must survive every hostile team (no crash / DoS).
        try:
            for d in sorted(p for p in tmp.iterdir() if p.is_dir()):
                evaluate.evaluate_team(d, answers)
            ok &= check("batch: no submission crashed the evaluator", True)
        except Exception as exc:
            ok &= check("batch: no submission crashed the evaluator", False,
                        repr(exc))
    finally:
        config.SUBMISSIONS_DIR = original
        shutil.rmtree(tmp, ignore_errors=True)

    print(f"\n{'ALL CHECKS PASSED' if ok else 'SOME CHECKS FAILED'}")
    raise SystemExit(0 if ok else 1)


if __name__ == "__main__":
    main()
