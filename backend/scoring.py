"""Shared scoring math for the Starship Safety judge.

Both the offline CLI (leaderboard.py) and the live service (portal.py) use
these functions so a team's score is computed identically no matter how the
leaderboard is produced.

A "result row" is the dict evaluate.py writes to results/<team>.json: it
carries the absolute per-team measurements (accuracy_model, accuracy_csv,
model_size_bytes, mean_run_seconds, model_ran, flags, ...). The RELATIVE
parts of the score — P_size and P_time — are computed here across a set of
rows, which is why they can only exist once every team has been measured.
"""
import config


def percent_of_others(rows, row, key, worse):
    """% of other rows whose `key` value is strictly worse. Rows with a
    missing value are treated as worst possible (they can't beat anyone)."""
    others = [r for r in rows if r is not row]
    if not others:
        return 0.0
    mine = row.get(key)
    if mine is None:
        return 0.0
    beaten = sum(
        1 for o in others
        if o.get(key) is None or worse(o[key], mine))
    return 100.0 * beaten / len(others)


def scored_accuracy(row):
    """The accuracy (0..1) a team is credited, applying the integrity policy.
    Depends only on this row (not the field), so it is safe to use both for
    ranking and for picking a team's best submission. Returns (acc, flags)
    and may set row['disqualified']."""
    flags = []
    model_ran = row.get("model_ran")
    acc_model = row.get("accuracy_model")
    acc_csv = row.get("accuracy_csv")
    mismatch = (row.get("csv_vs_model_mismatches") or 0) > 0

    if not model_ran:
        if config.INTEGRITY_POLICY == "use_csv" and acc_csv is not None:
            flags.append("SCORED_ON_UNVERIFIED_CSV")
            return acc_csv, flags
        return 0.0, flags  # default: unverifiable predictions earn nothing

    if mismatch:
        if config.INTEGRITY_POLICY == "disqualify":
            row["disqualified"] = True
            flags.append("DISQUALIFIED")
        else:
            flags.append("SCORED_ON_MODEL_OUTPUT")
    return (acc_model or 0.0), flags


def _selection_key(row):
    """Rank a team's own submissions to pick their best: highest verified
    accuracy first, then smaller model, then faster. Field-independent, so
    'keep best' is deterministic and cannot loop with the relative scores."""
    acc, _ = scored_accuracy(dict(row))  # copy: don't mutate while selecting
    size = row.get("model_size_bytes")
    time = row.get("mean_run_seconds")
    big = float("inf")
    return (acc, -(size if size is not None else big),
            -(time if time is not None else big))


def select_best_per_team(rows):
    """Given many result rows (possibly several per team), return one row per
    team: the submission that would score best for them. Implements the
    'keep best score' resubmission policy."""
    best = {}
    for row in rows:
        team = row["team"]
        if team not in best or _selection_key(row) > _selection_key(best[team]):
            best[team] = row
    return list(best.values())


def finalize(rows):
    """Compute final scores for a set of result rows and return them sorted
    best-first. Mutates each row with accuracy_points, p_size, p_time and
    final_score. Assumes one row per team (call select_best_per_team first if
    a team may have multiple submissions)."""
    for row in rows:
        row.setdefault("flags", [])
        acc, extra = scored_accuracy(row)
        row["flags"].extend(extra)
        row["accuracy"] = acc
        row["accuracy_points"] = acc * 100
        row["p_size"] = percent_of_others(
            rows, row, "model_size_bytes", worse=lambda o, m: o > m)
        row["p_time"] = percent_of_others(
            rows, row, "mean_run_seconds", worse=lambda o, m: o > m)

        floor = config.MIN_ACCURACY_PERCENT
        if floor is not None and row["accuracy_points"] < floor:
            row["p_size"] = 0.0
            row["p_time"] = 0.0
            row["flags"].append(f"BELOW_ACCURACY_FLOOR ({floor}%)")

        row["final_score"] = row["accuracy_points"] + row["p_size"] + row["p_time"]
        if row.get("disqualified"):
            row["final_score"] = 0.0

    rows.sort(key=lambda r: r["final_score"], reverse=True)
    return rows
