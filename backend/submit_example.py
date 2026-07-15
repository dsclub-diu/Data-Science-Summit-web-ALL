"""Example submission client — how a participant sends a submission to the
portal. Also used by the end-to-end test.

    python submit_example.py --url https://portal.example.com \
        --team "Team Rocket" --folder ./my_submission

The folder must contain model.pkl and predictions.csv, and model.py if the
pickle uses a custom class/function.
"""
import argparse
from pathlib import Path

import requests


def submit(url, team, folder):
    folder = Path(folder)
    files = {
        "model_pkl": ("model.pkl", (folder / "model.pkl").open("rb")),
        "predictions_csv": ("predictions.csv", (folder / "predictions.csv").open("rb")),
    }
    model_py = folder / "model.py"
    if model_py.exists():
        files["model_py"] = ("model.py", model_py.open("rb"))
    resp = requests.post(f"{url.rstrip('/')}/submit",
                         data={"team": team}, files=files, timeout=120)
    resp.raise_for_status()
    return resp.json()


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--url", required=True)
    p.add_argument("--team", required=True)
    p.add_argument("--folder", required=True)
    args = p.parse_args()
    print(submit(args.url, args.team, args.folder))


if __name__ == "__main__":
    main()
