#!/usr/bin/env python3
"""Generate public/seatmap.json for the /my-seat participant lookup.

Usage:
    python3 scripts/generate_seatmap.py <registrations.xls> [seatplan_dir]

<registrations.xls>  admin-panel export (HTML table saved as .xls)
[seatplan_dir]       folder containing per-segment seat assignment CSVs
                     (default: ~/Downloads/NDSS-2026-SeatPlan)

The registration export contains contact and payment data and must NEVER be
committed to the repo. This script ships only: display name, event, team,
role, seat allocation, and SHA-256 hashes of the student ID / email used
for lookup matching. Emails, phones, payment info and coupons are dropped.
"""

import csv
import hashlib
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

SALT = "ndss2026"

EVENT_KEYS = {
    "Promptcraft Challenge": "promptcraft",
    "Data Hackathon": "data-hackathon",
    "Project Showcase": "project-showcase",
    "Research Poster Presentation": "research-poster",
    "Hands-On Workshop": "hands-on-workshop",
}

TEAM_EVENTS = {"data-hackathon", "project-showcase", "research-poster"}

# Segment seat CSVs: filename -> (event key, columns that identify the person)
SEAT_FILES = {
    "promptcraft/PromptCraft_SeatPlan_master.csv": "promptcraft",
    "data-hackathon/DataHackathon_SeatPlan_master.csv": "data-hackathon",
    "project-showcase/ProjectShowcase_SeatPlan_master.csv": "project-showcase",
    "research-poster/ResearchPoster_SeatPlan_master.csv": "research-poster",
}


class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows, self.row, self.cell, self.in_cell = [], [], "", False

    def handle_starttag(self, tag, attrs):
        if tag in ("td", "th"):
            self.in_cell, self.cell = True, ""
        elif tag == "tr":
            self.row = []

    def handle_endtag(self, tag):
        if tag in ("td", "th"):
            self.in_cell = False
            self.row.append(self.cell.strip())
        elif tag == "tr" and self.row:
            self.rows.append(self.row)

    def handle_data(self, data):
        if self.in_cell:
            self.cell += data


def norm_sid(v):
    return re.sub(r"\s+", "", str(v or "")).lower()


def norm_email(v):
    return str(v or "").strip().lower()


def h(value):
    if not value:
        return None
    return hashlib.sha256(f"{SALT}:{value}".encode()).hexdigest()


def mask_sid(sid):
    s = str(sid or "").strip()
    if len(s) <= 3:
        return "•" * len(s)
    return s[:-3] + "•••"


def load_registrations(path):
    p = TableParser()
    p.feed(Path(path).read_text(encoding="utf-8"))
    header = p.rows[0]
    return [dict(zip(header, r)) for r in p.rows[1:]]


def load_seats(seatplan_dir):
    """Return {(event, norm_sid): seat dict} and {(event, norm_email): seat dict}."""
    by_sid, by_email = {}, {}
    for rel, event in SEAT_FILES.items():
        f = Path(seatplan_dir) / rel
        if not f.exists():
            continue
        with open(f, newline="", encoding="utf-8") as fh:
            for row in csv.DictReader(fh):
                seat = {
                    "room": str(row.get("Room", "")).strip(),
                    "seat": f"PC {row['PC #']}" if row.get("PC #") else row.get("Seat", ""),
                    "code": row.get("Seat Code", "").strip(),
                }
                sid = norm_sid(row.get("Student ID"))
                em = norm_email(row.get("Email"))
                if sid:
                    by_sid[(event, sid)] = seat
                if em:
                    by_email[(event, em)] = seat
    return by_sid, by_email


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    reg_path = sys.argv[1]
    seatplan_dir = sys.argv[2] if len(sys.argv) > 2 else str(Path.home() / "Downloads/NDSS-2026-SeatPlan")

    regs = load_registrations(reg_path)
    seats_by_sid, seats_by_email = load_seats(seatplan_dir)

    entries, teams = [], {}
    for r in regs:
        event = EVENT_KEYS.get(r.get("Event", ""))
        if not event:
            continue
        if r.get("Status", "").lower() != "verified":
            continue

        sid, em = norm_sid(r.get("Student ID")), norm_email(r.get("Email"))
        seat = seats_by_sid.get((event, sid)) or seats_by_email.get((event, em)) or {}
        team_name = r.get("Team", "").strip()
        team_id = None

        if event in TEAM_EVENTS and team_name:
            team_id = f"{event}::{team_name}".lower()
            t = teams.setdefault(team_id, {"name": team_name, "event": event, "members": []})
            t["members"].append({
                "name": r.get("Name", "").strip(),
                "sid": mask_sid(r.get("Student ID")),
                "role": (r.get("Role") or "").strip().lower() or "member",
            })

        entries.append({
            "idh": h(sid),
            "emh": h(em),
            "name": r.get("Name", "").strip(),
            "event": event,
            "team": team_name if event in TEAM_EVENTS else None,
            "teamId": team_id,
            "role": (r.get("Role") or "").strip().lower() or "member",
            "room": seat.get("room") or None,
            "seat": seat.get("seat") or None,
            "code": seat.get("code") or None,
            "ownDevice": (r.get("Own Device", "").strip().lower() == "yes") if event == "data-hackathon" else None,
        })

    out = {
        "entries": entries,
        "teams": teams,
    }
    dest = Path(__file__).resolve().parent.parent / "public" / "seatmap.json"
    dest.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")))

    seated = sum(1 for e in entries if e["code"])
    print(f"seatmap.json: {len(entries)} entries ({seated} with seats), {len(teams)} teams -> {dest}")


if __name__ == "__main__":
    main()
