"""Runs ONE team's model in an isolated child process.

evaluate.py launches this as a separate `python sandbox_runner.py ...`
subprocess. Isolation matters because unpickling a .pkl file executes
arbitrary code: if a submission crashes, hangs, or eats memory, only this
child dies and the judge records a failure for that team.

SECURITY MODEL — the parent trusts NOTHING this process claims about itself:

  * Timing is measured by the PARENT (wall-clock around this subprocess),
    never taken from numbers this process prints. A hostile pickle that
    prints "mean_run_seconds: 0.000000001" cannot forge a fast score.
  * Predictions are written to a result file whose path the parent chose,
    and the parent re-derives accuracy from them itself.
  * This process runs with cwd set by the parent to a scratch directory
    that does NOT contain the secret answer key, so a pickle cannot read
    test-y.csv as a sibling of the test inputs it is handed.

Usage:
    python sandbox_runner.py <model.pkl> <test-x.csv> <n_runs> \
                             <mem_mb> <cpu_s> <result.json>

Writes a JSON object to <result.json>:
    {"ok": true, "predictions": [...], "child_mean_seconds": ...}
or  {"ok": false, "error": "..."}

One run of the standardized timing workload = load the model file + call
predict on the full test set, matching the PDF's "running your model file
100 times". The parent times the whole warmup+N-run job.
"""
import json
import pickle
import sys
from pathlib import Path


def set_resource_limits(mem_mb, cpu_seconds):
    """Best-effort CPU and memory caps. Fully enforced on Linux; on macOS the
    memory cap is advisory, so the parent's wall-clock timeout is the real
    backstop there."""
    try:
        import resource
    except ImportError:  # e.g. Windows
        return
    for res, limit in (
        (getattr(__import__("resource"), "RLIMIT_CPU", None), cpu_seconds),
        (getattr(__import__("resource"), "RLIMIT_AS", None), mem_mb * 1024 * 1024),
    ):
        if res is None:
            continue
        try:
            resource.setrlimit(res, (limit, limit))
        except (ValueError, OSError):
            pass


def load_model(model_bytes):
    """Deserialize a submitted model, tolerating the common ways teams save
    them: plain pickle, joblib (including joblib's own compression), and a
    pickle wrapped in a standard compressor (zlib/gzip/bz2/lzma). This avoids
    'invalid load key' errors when a model was saved compressed."""
    import io
    # 1. joblib reads joblib dumps AND plain pickles, and self-decompresses.
    try:
        import joblib
        return joblib.load(io.BytesIO(model_bytes))
    except Exception:
        pass
    # 2. Try transparent decompression, then pickle.
    import bz2
    import gzip
    import lzma
    import zlib
    for decompress in (lambda b: b, gzip.decompress, zlib.decompress,
                       bz2.decompress, lzma.decompress):
        try:
            return pickle.loads(decompress(model_bytes))
        except Exception:
            continue
    # 3. Last resort: raw pickle, so the real error is surfaced.
    return pickle.loads(model_bytes)


def to_label_list(pred, n_expected):
    """Normalize a model's output into a list of ints in {0, 1}.

    Accepts Python lists, numpy arrays, pandas Series/DataFrame, and
    bool/int/float values. A value must be exactly 0 or 1 (0.0/1.0 and
    True/False count); anything else — most importantly probabilities like
    0.93 — is rejected with a clear error instead of being silently
    truncated to the wrong class."""
    if hasattr(pred, "to_numpy"):        # pandas Series / DataFrame
        pred = pred.to_numpy()
    try:
        import numpy as np
        flat = list(np.ravel(pred))
    except Exception:
        flat = list(pred)

    if len(flat) != n_expected:
        raise ValueError(
            f"model.predict returned {len(flat)} predictions for "
            f"{n_expected} rows")

    labels = []
    for v in flat:
        f = float(v)
        if abs(f - 0.0) < 1e-9:
            labels.append(0)
        elif abs(f - 1.0) < 1e-9:
            labels.append(1)
        else:
            raise ValueError(
                f"model output {v!r} is not a 0/1 class label — return "
                f"class predictions, not probabilities")
    return labels


def main():
    model_path = Path(sys.argv[1])
    test_x_path = sys.argv[2]
    n_runs = int(sys.argv[3])
    mem_mb = int(sys.argv[4])
    cpu_seconds = int(sys.argv[5])
    result_path = Path(sys.argv[6])

    set_resource_limits(mem_mb, cpu_seconds)

    # Teams may ship a model.py next to model.pkl defining their model class;
    # putting the submission folder on sys.path lets the unpickler find it.
    sys.path.insert(0, str(model_path.parent))

    import time

    import pandas as pd  # imported after limits are set

    X = pd.read_csv(test_x_path)
    model_bytes = model_path.read_bytes()

    # Warmup (part of the timed job, but its output is what we report): pays
    # one-time import costs and produces the predictions for the integrity
    # check and parent-side accuracy.
    model = load_model(model_bytes)
    predictions = to_label_list(model.predict(X), len(X))

    # Standardized workload the parent is timing: load + predict, N times.
    child_times = []
    for _ in range(n_runs):
        start = time.perf_counter()
        m = load_model(model_bytes)
        m.predict(X)
        child_times.append(time.perf_counter() - start)

    result_path.write_text(json.dumps({
        "ok": True,
        "predictions": predictions,
        "n_runs": n_runs,
        # Diagnostic only — the parent does NOT score on these.
        "child_mean_seconds": sum(child_times) / len(child_times),
        "child_min_seconds": min(child_times),
    }))


if __name__ == "__main__":
    try:
        main()
    except BaseException as exc:  # report anything, including MemoryError
        try:
            Path(sys.argv[6]).write_text(json.dumps(
                {"ok": False, "error": f"{type(exc).__name__}: {exc}"}))
        except Exception:
            pass
        print(json.dumps({"ok": False, "error": f"{type(exc).__name__}: {exc}"}))
        sys.exit(1)
