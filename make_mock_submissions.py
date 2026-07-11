"""Creates fake team submissions so you can test-drive the judging system
before the real event. Delete submissions/ and results/ afterwards.

  team_rocket   — strong team: reverse-engineered the feature processing,
                  ships a tiny pure-Python model (high accuracy, small, fast).
  team_nebula   — average team: found only part of the signal.
  team_sklearn  — realistic team: a scikit-learn model saved with
                  joblib.dump(compress=3). Exercises the joblib loader path
                  and a realistically larger/slower model file.
  team_pixel    — CHEATER #1: submits a perfect predictions.csv (a leaked
                  answer key) but a dummy model that predicts 0 for
                  everything, hoping the tiny/fast model wins P_size/P_time.
                  The integrity check catches it and it is scored on the
                  model's real (50%) output.
  team_ghost    — CHEATER #2: a model that tries to read test-y.csv off disk
                  to return perfect answers. The sandbox runs it in a
                  key-free scratch dir, so the read fails and it scores low.

Each folder follows the participant contract:
    submissions/<team>/model.pkl        (required)
    submissions/<team>/predictions.csv  (required)
    submissions/<team>/model.py         (only if the pickle uses a custom class)
"""
import csv
import subprocess
import sys
import textwrap

import config

ROCKET_MODEL_PY = '''
import math
from datetime import datetime

TRUTHY = {"true", "1", "t"}
SECTOR_WEIGHTS = {"alpha": -5, "beta": 2, "gamma": 8, "delta": -1}
THRESHOLD = 101.1868


class FormulaModel:
    """Pure-Python reconstruction of the hidden scoring formula."""

    def predict(self, df):
        out = []
        for r in df.itertuples(index=False):
            s = int(str(r.f1_hex_code), 16) % 7
            s += float(str(r.f2_temp_log).split(":")[1].split()[0]) / 10
            s += math.sin(float(r.f3_wave_phase)) * 3
            s += int(float(r.f4_micro_metric) * 1000) % 10
            s += SECTOR_WEIGHTS[str(r.f5_sector_class).strip().lower()]
            m, d, y = str(r.f6_launch_date).split("/")
            s += datetime(int(y), int(m), int(d)).weekday()
            s += math.log1p(float(r.f7_power_skew)) / 2
            s += abs(float(r.f8_bimodal_core)) / 5
            s += str(r.f9_cargo_path).count("-") * 1.5
            s += 4 if str(r.f10_status_mix).strip().lower() in TRUTHY else 0
            s += int(r.f11_sync_clock) % 13
            a, b = (int(t) for t in str(r.f12_spatial_coord).strip("[] ").split(","))
            s += math.hypot(a, b) / 3
            s += round(int(r.f13_noisy_base) / 100)
            s += sum(1 for ch in str(r.f14_crew_code).lower() if ch in "aeiou")
            s += (int(r.f15_parity_bit) % 2) * 5
            out.append(1 if s > THRESHOLD else 0)
        return out


def build():
    return FormulaModel()
'''

NEBULA_MODEL_PY = '''
class PartialSignalModel:
    """An average team: only discovered the radiation and clock signals."""

    def predict(self, df):
        out = []
        for r in df.itertuples(index=False):
            s = round(int(r.f13_noisy_base) / 100)
            s += int(r.f11_sync_clock) % 13
            out.append(1 if s > 56 else 0)
        return out


def build():
    return PartialSignalModel()
'''

PIXEL_MODEL_PY = '''
class AlwaysSafe:
    """A do-nothing decoy model: predicts 0 for every row."""

    def predict(self, df):
        return [0] * len(df)


def build():
    return AlwaysSafe()
'''

# CHEATER #2: reads the answer key as a sibling of the test inputs. The
# sandbox hands it a COPY of test-x.csv in a scratch dir with no test-y.csv,
# so the read fails and it falls back to predicting 0 (low accuracy).
GHOST_MODEL_PY = '''
from pathlib import Path


class KeySnoopModel:
    def predict(self, df):
        try:
            here = Path(__file__).resolve()
        except NameError:
            here = None
        for base in filter(None, [here.parent if here else None, Path.cwd()]):
            key = base / "test-y.csv"
            if key.exists():
                lines = key.read_text().splitlines()[1:]
                return [int(x) for x in lines if x.strip()][:len(df)]
        return [0] * len(df)   # key not reachable -> guesses


def build():
    return KeySnoopModel()
'''


def write_predictions_csv(path, labels):
    with open(path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([config.TARGET_COLUMN])
        for label in labels:
            writer.writerow([label])


def build_pickle(team_dir):
    """Pickle the team's model in a subprocess so each team's model.py can
    use the module name 'model' without clashing with the others."""
    script = textwrap.dedent("""
        import pickle, model
        with open("model.pkl", "wb") as f:
            pickle.dump(model.build(), f)
    """)
    subprocess.run([sys.executable, "-c", script], cwd=team_dir, check=True)


SKLEARN_MODEL_PY = '''
import numpy as np


def featurize(df):
    """Custom feature engineering referenced by the pickled Pipeline. It
    lives in model.py (module name 'model') so the judge can import it when
    unpickling — a plain function defined in a build script would pickle as
    __main__.featurize and fail to load elsewhere."""
    f13 = (df["f13_noisy_base"] / 100).round()
    f11 = df["f11_sync_clock"] % 13
    f4 = (df["f4_micro_metric"] * 1000).astype("int64") % 10
    return np.c_[f13, f11, f4]
'''


def build_sklearn_pickle(team_dir):
    """A realistic team: fit a small sklearn tree on features they engineered
    and save it compressed with joblib (the standard sklearn workflow). The
    custom transform lives in model.py so the pickle stays importable."""
    (team_dir / "model.py").write_text(SKLEARN_MODEL_PY.lstrip())
    script = textwrap.dedent(f"""
        import pandas as pd, joblib
        from sklearn.pipeline import Pipeline
        from sklearn.preprocessing import FunctionTransformer
        from sklearn.tree import DecisionTreeClassifier
        from model import featurize

        X = pd.read_csv({str(config.TEST_X_PATH)!r})
        y = pd.read_csv({str(config.ANSWER_KEY_PATH)!r})[{config.TARGET_COLUMN!r}]

        pipe = Pipeline([
            ('feat', FunctionTransformer(featurize)),
            ('clf', DecisionTreeClassifier(max_depth=4, random_state=0)),
        ])
        pipe.fit(X, y)
        joblib.dump(pipe, 'model.pkl', compress=3)
    """)
    subprocess.run([sys.executable, "-c", script], cwd=team_dir, check=True)


def predictions_from_model(team_dir):
    """Run the team's own pickle to produce their predictions.csv, exactly
    like an honest participant would."""
    import json
    script = textwrap.dedent(f"""
        import json, pickle, pandas as pd
        X = pd.read_csv({str(config.TEST_X_PATH)!r})
        with open("model.pkl", "rb") as f:
            m = pickle.load(f)
        print(json.dumps([int(v) for v in m.predict(X)]))
    """)
    proc = subprocess.run([sys.executable, "-c", script], cwd=team_dir,
                          check=True, capture_output=True, text=True)
    return json.loads(proc.stdout)


def predictions_from_joblib(team_dir):
    import json
    script = textwrap.dedent(f"""
        import sys, json, joblib, pandas as pd
        sys.path.insert(0, ".")   # make model.featurize importable, as the judge does
        X = pd.read_csv({str(config.TEST_X_PATH)!r})
        m = joblib.load("model.pkl")
        print(json.dumps([int(v) for v in m.predict(X)]))
    """)
    proc = subprocess.run([sys.executable, "-c", script], cwd=team_dir,
                          check=True, capture_output=True, text=True)
    return json.loads(proc.stdout)


def make_team(name, model_py=None, sklearn=False, cheat_labels=None,
              honest_labels_from_joblib=False):
    team_dir = config.SUBMISSIONS_DIR / name
    team_dir.mkdir(parents=True, exist_ok=True)
    if sklearn:
        build_sklearn_pickle(team_dir)  # no model.py needed for sklearn
    else:
        (team_dir / "model.py").write_text(model_py.lstrip())
        build_pickle(team_dir)

    if cheat_labels is not None:
        labels = cheat_labels                       # CSV not from the model
    elif honest_labels_from_joblib:
        labels = predictions_from_joblib(team_dir)
    else:
        labels = predictions_from_model(team_dir)
    write_predictions_csv(team_dir / "predictions.csv", labels)
    print(f"created {team_dir}")


def main():
    make_team("team_rocket", ROCKET_MODEL_PY)
    make_team("team_nebula", NEBULA_MODEL_PY)
    try:
        make_team("team_sklearn", sklearn=True, honest_labels_from_joblib=True)
    except subprocess.CalledProcessError:
        print("skipped team_sklearn (scikit-learn/joblib not installed here)")

    # CHEATER #1: predictions.csv is the leaked answer key; model predicts 0.
    with open(config.ANSWER_KEY_PATH, newline="") as f:
        answer = [int(row[0]) for row in list(csv.reader(f))[1:] if row]
    make_team("team_pixel", PIXEL_MODEL_PY, cheat_labels=answer)

    # CHEATER #2: model tries to read the key; its CSV matches its own output
    # so there is no integrity flag — the key-free sandbox is what stops it.
    make_team("team_ghost", GHOST_MODEL_PY)


if __name__ == "__main__":
    main()
