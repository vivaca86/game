# Source Conflict Implementation Risk Triage

Status: `generated 2026-05-22 / non-play research pass / full-app direct verification removed / implementation-risk view`

This file compresses `source-conflicts.md` into the conflicts most likely to cause wrong original-parity implementation if development starts before stronger proof exists. It is not a resolution file; it is a risk map.

## Evidence Boundary

- This pass uses existing GitHub research docs and a 2026-05-22 official Steam announcement recheck only.
- It does not use new direct gameplay.
- Full app `3265700` direct verification has been removed from active requirements.
- `source-only working value` means a reasonable planning value, not a final original-accurate value.
- `blocked by game-file proof` means shipped data/assets/localized strings could resolve it without playing.
- `blocked by implementation/tuning` means the remaining answer belongs to development/testing rather than more public-source research.

## Highest Risk Blocks

| Rank | Conflict IDs | Area | Risk If Implemented Now | Current Safe Action |
| ---: | --- | --- | --- | --- |
| 1 | CON-037, CON-031, CON-032 | Card catalog count and membership | Hardcoding an 87/90/113-row interpretation could omit character cards, wiki-only cards, or public-only rows | Use a data model that separates unlock rows, non-character cards, character/Crawler cards, wiki-only candidates, and evolution results |
| 2 | CON-025, CON-034, CON-010 | Gem catalog and naming | Gem totals and names such as `X Mana` / `X Mana Gem` / `Mana X Damage Gem` can create duplicate or wrong reward rows | Preserve aliases and source IDs; require game-file proof or explicit implementation choice before final display names/effects |
| 3 | CON-002, CON-008, CON-023, CON-033, CON-040, CON-041 | Character roster, costs, and hidden rows | Character-select/Inn implementation could be off by several rows or use card mana cost as purchase price | Separate public unlock tasks, default characters, recruitable Inn rows, hidden rows, wiki-only/unavailable rows, Crawler-card play cost, and purchase cost |
| 4 | CON-001, CON-009, CON-015 | Stage and route taxonomy | Stage-select can be wrong if `biome`, `dungeon`, `stage variant`, `tutorial`, and `unlock entry` are collapsed | Keep each layer separate and avoid final stage count claims without game-file proof or explicit implementation choice |
| 5 | CON-004, CON-005, CON-020, CON-021 | Core runtime formulas and mutation | Combo/Wild/Arcana/evolution behavior is easy to make plausible but wrong | Implement only as configurable systems with clear TODO gates; do not claim formula parity |
| 6 | CON-027, CON-038, CON-039 | Power-Up Shop vs run-found rewards | Permanent meta progression could mix shop ranks with run rewards and wrong costs/stat increments | Separate permanent shop rows from run-found Power-Ups and preserve source-specific costs |
| 7 | CON-011, CON-018, CON-035, CON-036, CON-043 | Relic roster, locations, and labels | Museum/relic unlock map could be wrong, especially `Deck Box`, `Rilevatore`, `Guiding Light`, `Polentir`, and route names | Preserve all location aliases; require game-file proof or explicit implementation choice for final names/effects/locations |
| 8 | CON-028, CON-029, CON-030 | Trickster enemy/reward/stats | A special enemy could be mis-modeled as a normal boss, with wrong reward and scaling | Keep Trickster as a special encounter candidate until stronger proof or explicit design choice exists |
| 9 | CON-003, CON-019, CON-044 | Arcana roster and unlock thresholds | Fortune Teller/Arcana implementation could miss 2 rows or use wrong unlock counts | Track 12 source-level Arcana rows, but leave unlock thresholds and default state open |
| 10 | CON-042 | Patch/build baseline | Building around a presumed exact patch can overclaim fidelity | Treat `Hotfix 1.4.1` and SteamDB build metadata as source context only; do not require full app direct verification as a blocker |

## Source-Only Working Values That Are Safe To Carry Forward

These can support planning and schema design, but not final parity:

| Area | Working Value | Why It Is Only Source-Level |
| --- | --- | --- |
| Official announcements | Latest official Steam Community announcement found in the 2026-05-22 recheck remains 2026-04-29 `1 million Crawlers in 1 week`, containing `Hotfix 1.4.1` notes | Announcement layer does not prove all shipped data or runtime behavior |
| Core pitch | TurboTurn, ascending-mana Combo, Wildcards, deckbuilding progression, character cards, village/world map/stage maps, points of interest, and functioning walls | Official text proves feature existence at a high level, not formulas, UI text, or edge cases |
| Steam metadata | 161 achievements, Steam Cloud, full controller support, 12 interface languages, demo app `4329470` | Metadata does not prove runtime save behavior, achievement timing, or localized in-game labels |
| Official/wiki row sets | Cards/gems/characters/relics/enemies/events/Power-Ups have source-level row candidates and reconciliation docs | Row membership still needs game-file proof or implementation choices before final data tables |

## Developer-Facing Guidance

If implementation starts before stronger proof is available, keep it honest:

1. Build schemas and import pipelines around source IDs, aliases, evidence grade, and conflict status.
2. Avoid hardcoded final counts for cards, gems, characters, stages, relics, Arcana, enemies, events, and Power-Ups.
3. Treat formulas, costs, unlock thresholds, drop pools, save behavior, and edge cases as configurable placeholders.
4. Label any implemented behavior as `source-level approximation` unless a row has game-file/direct proof or an explicit accepted design choice.
5. Do not close `source-conflicts.md` rows from this triage alone.
6. Do not reopen full app `3265700` direct verification as an active requirement.

## Next Non-Play Step

The highest value next step is implementation scaffolding from `evidence-aware-schema-plan.md`: schema, import, seed data, conflict badges, evidence labels, and safety tests. Game-file proof is optional only if explicitly provided/approved; further public-source work should be delta-only.
