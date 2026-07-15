"""Phase 2 of judging: turn per-team measurements into final scores.

Reads every results/<team>.json written by evaluate.py and applies the
scoring formula from the competition PDF (via scoring.py, shared with the
live service):

    Final Score = (Accuracy x 100) + P_size + P_time      (max 300)

  P_size = % of OTHER submissions whose model file is LARGER
  P_time = % of OTHER submissions whose average run time is SLOWER

These are relative ranks, computable only after every team is measured.
ACCURACY is taken from the model's VERIFIED output (what it actually
produced when the judge ran it), not the submitted CSV; see scoring.py.

Prints the leaderboard and writes leaderboard.csv next to this script.

Usage:
    python leaderboard.py
"""
import csv
import json

import config
import scoring


def main():
    result_files = sorted(config.RESULTS_DIR.glob("*.json"))
    if not result_files:
        raise SystemExit("no results found — run evaluate.py first")
    rows = [json.loads(p.read_text()) for p in result_files]

    for row in rows:
        row.setdefault("flags", [])
        if not (config.SUBMISSIONS_DIR / row["team"]).is_dir():
            row["flags"].append("NO_SUBMISSION_FOLDER")
            print(f"WARNING: result '{row['team']}' has no submission folder; "
                  f"it is counted in the ranking. Re-run evaluate.py to prune.")

    # One result file per team here, so no keep-best selection is needed.
    rows = scoring.finalize(rows)

    header = (f"{'#':>2}  {'team':<20} {'acc%':>6} {'size':>9} "
              f"{'avg time':>10} {'P_size':>6} {'P_time':>6} {'SCORE':>7}  flags")
    print("\n" + header)
    print("-" * len(header))
    for rank, r in enumerate(rows, 1):
        size = r["model_size_bytes"]
        t = r["mean_run_seconds"]
        print(f"{rank:>2}  {r['team']:<20} {r['accuracy_points']:>6.1f} "
              f"{(str(size) + 'B') if size is not None else '-':>9} "
              f"{('%.2f ms' % (t * 1000)) if t is not None else 'FAILED':>10} "
              f"{r['p_size']:>6.1f} {r['p_time']:>6.1f} "
              f"{r['final_score']:>7.1f}  {', '.join(r['flags']) or '-'}")

    out_path = config.JUDGING_DIR / "leaderboard.csv"
    with open(out_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["rank", "team", "accuracy_percent", "model_size_bytes",
                         "mean_run_seconds", "p_size", "p_time", "final_score",
                         "flags"])
        for rank, r in enumerate(rows, 1):
            writer.writerow([
                rank, r["team"], round(r["accuracy_points"], 2),
                r["model_size_bytes"], r["mean_run_seconds"],
                round(r["p_size"], 2), round(r["p_time"], 2),
                round(r["final_score"], 2), "; ".join(r["flags"])])
    print(f"\nwrote {out_path}")


if __name__ == "__main__":
    main()
