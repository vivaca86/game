# Arcana Taxonomy Reconciliation

Status: `generated 2026-05-22 / source-level arcana taxonomy reconciliation`

This artifact reconciles the 10 public Steam/Dexerto arcana unlock rows against the 12 official-wiki arcana value rows and the secondary 12-arcana roster claims. It does not prove the shipped Fortune Teller UI, exact effect text, lock state, default/automatic state, one-arcana equip limit, Arcana Finder chest behavior, save persistence, or runtime formulas. Treat it as a capture queue for Fortune Teller UI, start-of-run selection, Town Hall counters, arcana reward screens, high-resolution video, and game-file proof.

Primary inputs:

- `research/data-arcana.md`
- `research/arcana-dexerto-unlock-crawl.md`
- `research/official-wiki-arcana-relic-dungeon-value-extract.md`
- `research/steam-store-movie-frame-crawl.md`
- `research/pcgamer-upgrade-priority-crawl.md`
- `research/source-conflicts.md` CON-003, CON-019, CON-020, and CON-044
- Sources: SRC-006, SRC-106, SRC-111, SRC-132, SRC-136, SRC-141, SRC-142, SRC-145, SRC-147, SRC-202, and SRC-206

## Reconciliation Snapshot

| Segment | Rows | Notes |
| --- | ---: | --- |
| Public Steam/Dexerto arcana unlock rows | 10 | Achievement/checklist-facing rows; Dexerto exposes one 10-row table |
| Official-wiki arcana infobox rows | 12 | Adds `Experimental Medicine` and `Shield Bash` |
| Normalized public-to-wiki name matches | 10 | Strip the public `Arcana` suffix and all 10 public rows map to official-wiki rows |
| Official-wiki rows outside public 10 direct matches | 2 | `Experimental Medicine` and `Shield Bash` |
| Official-wiki rows with unlock fields | 12 | No blank official-wiki unlock fields in the current value extract |
| Official Store movie visible arcana candidates | 4 | `Mana Syphon`, `Over The Top`, `Wild Buff`, and `Your Shield My Liege` appear as visible selection-surface candidates |
| Implementation parity closed by this file | 0 | Direct UI, game files, or runtime proof still required |

## Working Interpretation

The current source-level split is:

- Public achievement/checklist sources expose 10 unlock-facing arcana rows.
- Secondary roster guides, official-account shorthand, and the official wiki expose a 12-row source-level arcana set.
- The two rows outside the public 10 are `Experimental Medicine` and `Shield Bash`; the official-wiki unlock field marks both as unlocked when taking Polentir.
- `And Another` is mostly narrowed to the 150 Free-to-Play side because Dexerto, NeonLightsMedia, and official-wiki value rows agree there, while GAMES.GG preserves a 500-count conflict.
- `Wild Buff` now has its own count conflict: Dexerto says 200 cards picked up from light sources, while the official-wiki value row says 250.
- `Over The Top` remains an effect wording conflict: NeonLightsMedia says returned to hand next turn, while PC Gamer and the official Store movie frame support top-of-deck wording.

Do not implement `Experimental Medicine` and `Shield Bash` as default or automatic arcanas yet. The Fortune Teller UI or game files must prove whether those rows are available immediately after Polentir, automatically granted, hidden until a condition, or classified differently in the shipped build.

## Row-Level Reconciliation

| Row | Public / Dexerto Row | Official-Wiki Row | Unlock Comparison | Reconciliation Note |
| --- | --- | --- | --- | --- |
| ARC-001 | Wild Buff Arcana | Wild Buff | Dexerto 200 light-source cards; official wiki 250 light-source cards | New count conflict; direct tracker/Town Hall/UI proof required |
| ARC-002 | Jester's Hat Arcana | Jester's Hat | Both 150 Wild cards | Source-level unlock agreement; effect/drop wording still needs UI proof |
| ARC-003 | Chain Link Arcana | Chain Link | Both combo 12 or more | Source-level unlock agreement; carryover/cap runtime proof still missing |
| ARC-004 | Your Shield My Liege Arcana | Your Shield My Liege | Both 2,000 Armor | Store movie shows selection-surface candidate; armor persistence proof still missing |
| ARC-005 | Swollen Fist Arcana | Swollen Fist | Both 40 Deck size | Source-level unlock agreement; damage formula/timing still missing |
| ARC-006 | And Another Arcana | And Another | Dexerto/official wiki 150 Free-to-Play cards; GAMES.GG 500 | Existing count conflict; public/wiki side currently stronger but not final |
| ARC-007 | Make a Scene Arcana | Make a Scene | Both 1,500 Crawler trigger abilities | Source-level unlock agreement; trigger timing/scope proof still missing |
| ARC-008 | Over The Top Arcana | Over The Top | Both 100 Crawler cards | Unlock agreement, but return zone/timing conflict remains |
| ARC-009 | Sharp Mind Arcana | Sharp Mind | Both 100 purple cards | Source-level unlock agreement; mana carryover cap/reset proof still missing |
| ARC-010 | Mana Syphon Arcana | Mana Syphon | Both 15 Mana in one turn | Store movie supports a shortened visible effect candidate; full text/runtime proof still missing |
| ARC-011 | no public 10-row match | Experimental Medicine | Official wiki says unlocked when taking Polentir | Official-wiki/secondary row outside public unlock table; default/automatic state unproven |
| ARC-012 | no public 10-row match | Shield Bash | Official wiki says unlocked when taking Polentir | Official-wiki/secondary row outside public unlock table; default/automatic state unproven |

## Conflict Queue

| Conflict | Rows | Current Treatment |
| --- | --- | --- |
| 10 public unlock rows vs 12 total rows | All arcana rows, especially `Experimental Medicine` and `Shield Bash` | Track 12 source-level rows, but keep the two non-public rows blocked on Fortune Teller UI/game files |
| Polentir/default state | `Experimental Medicine`, `Shield Bash` | Preserve official-wiki Polentir unlock fields; do not infer automatic availability from source text alone |
| Count conflicts | `Wild Buff`, `And Another` | Preserve Dexerto/official-wiki/secondary split until in-game tracker, Town Hall, or game files prove the numbers |
| Effect wording conflicts | `Over The Top`, `Mana Syphon`, `Your Shield My Liege` | Store movie frames are visible-media candidates, not final effect/runtime proof |

## Direct Proof Queue

- Capture Fortune Teller entry after Polentir, including locked/unlocked rows, current selection, equip/confirm buttons, and row count.
- Confirm whether the UI displays 10, 12, or another arcana count, and whether `Experimental Medicine` and `Shield Bash` are visible by default.
- Capture exact unlock tracker/Town Hall rows for `Wild Buff`, `And Another`, `Over The Top`, `Mana Syphon`, and the two Polentir rows.
- Resolve `Wild Buff` 200 vs 250 light-source cards from UI or game files.
- Resolve `And Another` 150 vs 500 Free-to-Play cards from UI or game files.
- Resolve `Over The Top` return-to-hand vs top-of-deck wording with exact effect text and one runtime example.
- Confirm whether only one Arcana can be equipped at a time and whether Arcana Finder chest rewards bypass or extend that limit.
- Record at least one runtime consequence for each confirmed arcana row before implementation approval.
