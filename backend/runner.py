"""Standalone model runner.

Executed as a subprocess so it can run either in the server's own
environment or in a per-submission virtualenv (fallback when the
server env can't unpickle the model).

Usage:
    python runner.py <model_path> <test_x_csv> <predictions_out_csv> <n_runs>

Prints a single JSON object to stdout:
    {"ok": true, "load_time_s": ..., "times_s": [...], "avg_time_s": ..., "n_rows": ...}
On failure prints {"ok": false, "error": "..."} and exits 1.
"""
import json
import sys
import time
import traceback


def main() -> int:
    model_path, x_path, preds_out, n_runs = (
        sys.argv[1],
        sys.argv[2],
        sys.argv[3],
        int(sys.argv[4]),
    )
    try:
        import joblib
        import pandas as pd

        X = pd.read_csv(x_path)
        # Drop a pandas-written index column if present
        if X.columns[0].startswith("Unnamed: 0") or X.columns[0] == "":
            X = X.drop(columns=[X.columns[0]])

        t0 = time.perf_counter()
        model = joblib.load(model_path)
        load_time = time.perf_counter() - t0

        times = []
        preds = None
        for _ in range(n_runs):
            t0 = time.perf_counter()
            preds = model.predict(X)
            times.append(time.perf_counter() - t0)

        pd.DataFrame({"prediction": preds}).to_csv(preds_out, index=False)
        print(
            json.dumps(
                {
                    "ok": True,
                    "load_time_s": load_time,
                    "times_s": times,
                    "avg_time_s": sum(times) / len(times),
                    "n_rows": len(X),
                }
            )
        )
        return 0
    except Exception:
        print(json.dumps({"ok": False, "error": traceback.format_exc()}))
        return 1


if __name__ == "__main__":
    sys.exit(main())
