# Data Science Summit — DIU Data Science Club

Central monorepo for the **National Data Science Summit (NDSS)**, organized by the DIU Data Science Club at Daffodil International University. Everything needed to run a summit lives here: the web apps, the judging systems, and all planning documentation from previous editions.

Most recent edition: **5th National Data Science Summit 2026** — *AI in Entrepreneurship* — Sunday, 12 July 2026, Daffodil Smart City, Birulia, Savar, Dhaka.

## Repository structure

| Folder | What it is |
|---|---|
| `frontend/` | Next.js summit website — landing page, event info, guest list, results, seat-lookup portal (`/my-seat`) |
| `backend/` | Judging system (dsummit-2026-judge) — score entry and result tabulation for competitions |
| `judgement-data-hackathon/` | Judging web app (FastAPI backend + frontend) for the Data Hackathon |
| `docs/summit-2026/` | All planning documents from the 5th summit (2026) — use these as templates for the next one |

## What a summit looks like

The 2026 edition ran five parallel segments in one day at Knowledge Tower, Daffodil Smart City:

- **Main program** (International Conference Hall, Level 3) — opening ceremony, addresses by department Head / Pro-VC / Dean, photo session, industry talks, closing keynote, sponsor recognition, award ceremony
- **Data Hackathon** — DS Lab 601, CS Lab 614, and additional labs; industry + academic judge panel
- **Project Showcase** — Student Lounge, with jury discussion rounds
- **Promptcraft Challenge** — computer labs 710/711A/711B/814A
- **Research Poster Presentation** + **Hands-on Workshop** — Student Lounge / Seminar Hall

See `docs/summit-2026/Rundown _5th Data Science Summit 2026.docx` for the minute-by-minute schedule that actually ran.

## Playbook for future organizers

Rough timeline based on how the 2026 summit was organized:

1. **3+ months out — scope and budget.** Pick a theme and date, draft the budget (see `5th DIU Data Science Summit_ AI in Business Budget.docx.pdf`), confirm venue availability (ICH + labs + Student Lounge), and get faculty/department sign-off.
2. **2–3 months out — guests and judges.** Invite industry guests and keynote speakers, recruit academic + industry judges for each competition. Track invitations and confirmations in a sheet (see `Data Science Summit_2026_Judge Email Track.xlsx` and `Industrey guest.xlsx`).
3. **1–2 months out — teams and logistics.** Assign faculty coordinators and student volunteers per event with phone contacts (`5thDataScienceSummit_EventHR.docx`, `Volunteer NDSS.xlsx`). Open participant registration on the website. Brief the design team (`SUMMIT Design requirements_judges list2026.docx`).
4. **2–3 weeks out — schedules and seating.** Publish the guest & judges schedule (`5th National Data Science Summit 2026 _ Guest & Judges Schedule.pdf`), finalize the seat plan (`NDSS 2026 Seat Plan.docx`), and generate the seat map for the website (`frontend/scripts/generate_seatmap.py` → `frontend/public/seatmap.json`, served at `/my-seat`).
5. **Event week.** Lock the rundown, do a venue walkthrough, brief volunteers per segment, prepare certificates and awards for the closing ceremony.
6. **After.** Publish results via the judging system, send thank-you notes to guests/sponsors, and **add your edition's documents to `docs/` in this repo** so the next team starts where you left off.

## Development

Frontend (Next.js):

```bash
cd frontend
npm install
npm run dev
```

Each app keeps its own README/config inside its folder. The apps were merged in via `git subtree`, so their full commit history is preserved in this repo.

### Syncing with the original repos

Frontend development may still happen in `sihab873/Data-Science-Summit-2026`. To pull its new commits into the monorepo:

```bash
git subtree pull --prefix=frontend https://github.com/sihab873/Data-Science-Summit-2026.git main
```

## For the next organizing committee

- This repo lives under the club's org account (`dsclub-diu`) so it survives leadership handovers — keep it that way.
- Start by reading `docs/summit-2026/5th Data Science Summit 2026.docx` (full program) and the budget PDF; they answer most "how did they do it last year?" questions.
- When your summit ends, commit your documents under `docs/summit-<year>/`. Future you will thank present you.

---

*Maintained by the DIU Data Science Club.*
