# Non-Play Continuation Checkpoint

Status: `generated 2026-05-22 / user-directed pause on direct play / full-app direct verification removed / continue non-play research only`

This checkpoint records the latest operating instruction for the remaining Vampire Crawlers research queue. It is intentionally small so the next pass does not spend unnecessary usage rewriting the large handoff/checklist files.

## User Directive

- Do not directly play, launch-control, or continue manipulating the demo/full game runtime.
- Remove full app `3265700` direct verification from active requirements. Do not keep asking for it as a blocker.
- Skip demo/direct-play checklist items unless the user explicitly resumes that track later.
- Continue only with non-play evidence: official/public source checks, GitHub research reconciliation, or game-file proof if files are explicitly provided for that purpose.
- Keep usage disciplined. Thoroughness means targeted verification and clear evidence labels, not repeatedly rereading or rewriting large files.
- Preserve usage for implementation work; future research passes should avoid broad re-crawls unless a new source or contradiction justifies them.

## Current Non-Play Recheck

Checked on 2026-05-22 after the direct-play pause.

| Source | Result | Use / Limit |
| --- | --- | --- |
| Steam Web API `ISteamNews/GetNewsForApp` with `feeds=steam_community_announcements` | Returned 9 official community announcement rows for app `3265700`; latest official row remains `1 million Crawlers in 1 week`, dated 2026-04-29 18:06:55 UTC | No newer official Steam announcement was found in this check; this does not prove no unlisted depot/build exists |
| Steam Community `allnews` page | Latest visible official announcement is still the 2026-04-29 post containing `Hotfix 1.4.1` notes and roadmap/QOL wording | Confirms the existing official-news crawl remains current at the announcement layer |

Primary source URLs:

- https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=3265700&count=20&maxlength=8000&format=json&feeds=steam_community_announcements
- https://steamcommunity.com/app/3265700/allnews/

## Next Non-Play Work

Use this order while direct play is skipped and full-app direct verification is removed:

| Order | Track | Action | Done When |
| ---: | --- | --- | --- |
| 1 | Implementation prep | Convert proven source-only boundaries into implementation risk notes, not original-parity claims | Development can start on clearly marked approximations |
| 2 | Conflict-safe seed data | Preserve aliases, conflict IDs, and uncertainty for high-risk rows | Seed data does not claim final UI text, balance, or original parity |
| 3 | Game-file proof, if explicitly provided | Inspect shipped data/files without running the game | UI/text rows can be upgraded only where files directly prove them |
| 4 | Official-source delta check | Recheck only official Steam/SteamDB/official wiki surfaces when there is a reason to suspect a new patch/source row | New rows are added or an explicit no-delta note is recorded |

## Remaining Non-Research Work

These remain unresolved, but more public-source investigation is not expected to solve them:

| Item | Why It Is Not More Research |
| --- | --- |
| UI text finalization | Needs UI evidence or game-file/localization strings, not more public-source guesses |
| Balance measurement | Needs runtime measurement or later tuning work, not source crawling |
| Original-identical implementation | Is a development/testing target, not a research artifact |

## Current Boundary

- Existing broad source-only matrix work is already covered by `source-only-closeout.md`.
- Demo direct-play evidence gathered before the pause stays demo-scoped and incomplete.
- Full app `3265700` direct verification is removed from active requirements.
- Implementation parity remains `0` for original-accurate systems until future proof or implementation tests justify row-level upgrades.
- Do not spend more usage on broad research unless a genuinely new source or approved game-file proof appears.
