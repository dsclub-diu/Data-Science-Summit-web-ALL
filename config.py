"""Central configuration for the Starship Safety judging system.

Every tunable policy decision lives here so you can change the rules of
evaluation without touching the evaluation code itself.
"""
from pathlib import Path

JUDGING_DIR = Path(__file__).resolve().parent
PROJECT_DIR = JUDGING_DIR.parent

# --- Data (organizer-only; participants never see the answer key) ---------
TEST_X_PATH = PROJECT_DIR / "test-x.csv"      # inputs the models run on
ANSWER_KEY_PATH = PROJECT_DIR / "test-y.csv"  # ground-truth labels (SECRET)

# --- Where submissions live and results go ---------------------------------
# Layout: submissions/<team_name>/predictions.csv + model.pkl (+ model.py)
SUBMISSIONS_DIR = JUDGING_DIR / "submissions"
RESULTS_DIR = JUDGING_DIR / "results"

# --- Submission contract ----------------------------------------------------
TARGET_COLUMN = "target_breach"
N_ROWS_EXPECTED = 500          # rows in test-x.csv / test-y.csv
MAX_MODEL_SIZE_MB = 200        # reject absurdly large model files outright

# --- Timing policy (from the competition PDF) -------------------------------
# "We will measure the execution time by running your model file on our
#  standard server 100 times and taking the average time."
# One timed run = load the model file + predict on the full test set. The
# JUDGE (parent process) measures wall-clock time around the whole N-run
# sandbox job and divides by N; it never trusts timing numbers reported by
# the untrusted model process. This makes a forged "0.000001s" impossible.
N_TIMING_RUNS = 100

# --- Anti-cheat policy --------------------------------------------------------
# The scoring formula rewards a tiny, fast model — so a cheater could submit
# a dummy 40-byte model plus a hand-crafted predictions.csv. evaluate.py
# always detects when the CSV does not match the model's own output; this
# setting controls what the leaderboard does about it:
#   "use_model_accuracy" — score accuracy from what the model ACTUALLY
#                          predicts when the judge runs it (recommended).
#                          A model that won't run scores 0 accuracy.
#   "disqualify"         — teams whose CSV mismatches their model get a
#                          final score of 0.
#   "use_csv"            — trust the submitted CSV even for a model that did
#                          not run (NOT recommended — reopens the leaked-CSV
#                          + crashing-model exploit).
INTEGRITY_POLICY = "use_model_accuracy"

# The PDF formula weighs size+time (up to 200 pts) more than accuracy (up
# to 100 pts), so a do-nothing model that predicts all zeros (~50% accuracy
# on this balanced test set, tiny and instant) can outscore a perfect real
# model. Set a minimum accuracy (in %) that a team must reach before it
# earns any P_size/P_time points, or None to follow the PDF formula as-is.
MIN_ACCURACY_PERCENT = None

# --- Sandbox limits ----------------------------------------------------------
# Each submission is evaluated in its own subprocess. If it exceeds these,
# it is killed and flagged instead of hanging the whole evaluation.
SANDBOX_TIMEOUT_SECONDS = 300  # wall-clock budget for warmup + all timed runs
SANDBOX_CPU_SECONDS = 300      # CPU-time budget (enforced via resource limits)
SANDBOX_MEMORY_MB = 4096       # memory cap (enforced on Linux; best-effort on macOS)
