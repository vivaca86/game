# Stage / Dungeon Taxonomy Reconciliation

Status: `generated 2026-05-22 / source-level stage taxonomy reconciliation`

This artifact reconciles the 13 Dexerto stage unlock rows, 14 Steam progression achievement rows, 15 non-tutorial playable-stage candidates from video/guide metadata, the official 6-biome shorthand, and the 16 expanded official-wiki dungeon/stage variant rows. It does not prove the shipped world-map UI, stage-card roster, exact lock state, route graph, floor sequencing, boss mapping, reward mapping, clear/failure consequence, save persistence, or final spelling. Treat it as a capture queue for stage-select UI, high-resolution route video, and game-file proof.

Primary inputs:

- `research/data-stages.md`
- `research/stage-dexerto-unlock-crawl.md`
- `research/stage-gap-map.md`
- `research/data-achievements.md`
- `research/flow-videos.md`
- `research/official-release-faq-crawl.md`
- `research/official-wiki-arcana-relic-dungeon-value-extract.md`
- `research/source-conflicts.md` CON-001, CON-009, CON-013, CON-015, and CON-037
- Sources: SRC-006, SRC-107, SRC-108, SRC-133, SRC-141, SRC-142, SRC-147, and VID-002

## Reconciliation Snapshot

| Segment | Rows | Notes |
| --- | ---: | --- |
| Dexerto visible stage unlock rows | 13 | Single all-stages unlock table; no individual stage-page links exposed |
| Steam progression achievement rows | 14 | Official metadata rows; includes `Unlock Milk Factory`, excludes default `Mad Forest` and `Tutorial` |
| VID-002 chaptered non-tutorial stage candidates | 15 | Description metadata names 15 stages, with storyboard route/gameplay cross-checks at chapter boundaries |
| Official release FAQ biome shorthand | 6 | Developer-social shorthand; not a row-level stage table |
| Official-wiki dungeon pages | 9 | Page layer, not direct stage-select proof |
| Official-wiki expanded dungeon/stage variants | 16 | Adds `Tutorial` to the same 15 named non-tutorial stage candidates |
| Non-tutorial official-wiki variants matching current STG candidates | 15 | Name-level source match only; stage-select UI still required |
| Implementation parity closed by this file | 0 | Direct UI, game files, or runtime proof still required |

## Working Interpretation

The current source-level split is:

- Dexerto is an unlock-table source. Its 13 rows should not be treated as the full playable-stage roster.
- Steam achievements are official metadata for 14 progression/unlock rows. This layer includes `Milk Factory`, which Dexerto omits as an item row.
- VID-002 supports a 15-stage non-tutorial route/candidate layer: `Mad Forest` plus 14 unlock/progression stages. Storyboard evidence is still partial E3, not exact text proof.
- The official wiki expands 9 dungeon pages into 16 named variants: `Tutorial` plus the 15 non-tutorial candidates.
- The official release FAQ's `6 biomes` wording is a grouping/shorthand layer, not a row-level stage count.
- `Mad Forest` is most likely the default/base stage omitted from unlock tables, but its exact fresh-save stage-card state is still unproven.
- `Milk Factory` is an official playable/unlockable candidate at source level because Steam, GAMES.GG route context, VID-002, and the official-wiki value extract all keep it alive despite the Dexerto omission.
- `Cappella` is the current stronger source-level spelling because Dexerto and the official-wiki rows use it, but VID-002's one-`p` `Capella Ultima` metadata keeps the spelling conflict open until high-resolution in-game text or game files resolve it.

Do not implement a final stage-select roster from this file alone. The row split below is a proof plan: it says what needs to be checked, not what the shipped UI definitively displays.

## Row-Level Reconciliation

| Row | Official-Wiki Layer | Dexerto Unlock Row | Steam Progression Row | VID-002 / Video Layer | Reconciliation Note |
| --- | --- | --- | --- | --- | --- |
| STG-TUT | Tutorial; order 0; 1 floor | no row | no row | outside the 15 chaptered stage route | Tutorial is the 16th official-wiki variant; verify whether it is a stage-select row, onboarding-only flow, or demo/tutorial state |
| STG-001 | Mad Forest; order 2; variant 1; 4 floors; difficulty 1 | no item row; prerequisite text for Furious Forest/Inlaid Library | no progression unlock row | chaptered first stage and route/gameplay frames | Default/base-stage candidate; fresh-save stage-card state is the key proof |
| STG-002 | Furious Forest; order 2; variant 2; 5 floors; difficulty 2 | yes; complete Mad Forest | ACH-023 `Unlock Furious Forest` | chaptered route/gameplay frames | Source-level row agreement except direct UI; Polentir route text remains a relic-side conflict |
| STG-003 | Berserk Wood; order 2; variant 3; 5 floors; difficulty 3 | yes; complete Furious Forest | ACH-059 `Berserk Wood` | chaptered route/gameplay frames | Forest variant row; coffin/reward/boss proof still missing |
| STG-004 | Inlaid Library; order 3; variant 1; 5 floors; difficulty 2 | yes; reach Level 10 in Mad Forest | ACH-007 `Unlock Inlaid Library` | chaptered route/gameplay frames plus VID-004 | Source-level row agreement; exact stage-card and reward/boss proof still missing |
| STG-005 | Library West Wing; order 3; variant 2; 5 floors; difficulty 3 | yes; complete Inlaid Library | ACH-033 `Unlock Library West Wing` | chaptered route/gameplay frames | Library variant row; exact reward, boss, and clear consequence unresolved |
| STG-006 | Library Sanctum; order 3; variant 3; 5 floors; difficulty 4 | yes; complete Library West Wing | ACH-076 `Unlock Library Sanctum` | chaptered route plus VID-005/VID-012 | Library variant row with multiple event/relic candidates; exact event and boss taxonomy unresolved |
| STG-007 | Teeny Bridge; order 4; 1 floor; difficulty 3 | yes; reach Level 15 in Inlaid Library | ACH-015 `Unlock Teeny Bridge` | chaptered route plus VID-006 | Single-floor bridge row; boss/reward/clear proof still missing |
| STG-008 | Dairy Plant; order 5; variant 1; 5 floors; difficulty 4 | yes; complete Teeny Bridge | ACH-070 `Unlock Dairy Plant` | chaptered route plus VID-007 | Factory/dairy base variant; route consequences toward Milk Factory/Weeny Bridge unresolved |
| STG-009 | Milk Factory; order 5; variant 2; 5 floors; difficulty 5 | no item row; prerequisite text for Curd Refinery | ACH-098 `Unlock Milk Factory` | chaptered route plus VID-008 | Dexerto omission conflict; source-level playable/unlockable candidate remains open pending stage-select proof |
| STG-010 | Curd Refinery; order 5; variant 3; 5 floors; difficulty 6 | yes; complete Milk Factory | ACH-118 `Unlock Curd Refinery` | chaptered route/gameplay frames | Factory branch row; Nesufritto/Fireproof/U.U.O. links still need exact UI proof |
| STG-011 | Weeny Bridge; order 6; 1 floor; difficulty 5 | yes; reach Level 15 in Dairy Plant | ACH-089 `Unlock Weeny Bridge` | chaptered route/gameplay frames | Single-floor bridge row; boss/reward/clear proof still missing |
| STG-012 | Gallo Tower; order 7; 6 floors; difficulty 6; demo No | yes; complete Weeny Bridge | ACH-117 `Unlock Gallo Tower` | chaptered route plus VID-009 | Tower row; Giant Enemy Crab/Gallo/boss reward mapping unresolved |
| STG-013 | Meany Bridge; order 8; 1 floor; difficulty 7; demo No | yes; defeat Giant Enemy Crab in Gallo Tower | ACH-129 `Unlock Meany Bridge` | chaptered route/gameplay frames | Boss-gated bridge row; exact Giant Enemy Crab trigger and no-reward claim unresolved |
| STG-014 | Cappella Magna; order 9; variant 1; 5 floors; difficulty 8; demo No | yes; complete Meany Bridge | ACH-138 `Unlock Cappella Magna` | chaptered route plus VID-010 route context | Late-stage row; selected-stage label, boss, reward, and clear consequence unresolved |
| STG-015 | Cappella Ultima; order 9; variant 2; 5 floors; difficulty 9; demo No | yes; complete Cappella Magna | ACH-146 `Unlock Cappella Ultima` | VID-002 metadata says `Capella Ultima`; VID-010 endgame route | Final-stage candidate; exact spelling, final boss, Ovenkilt reward text, credits/result, and persistence unresolved |

## Conflict Queue

| Conflict | Rows | Current Treatment |
| --- | --- | --- |
| 13 Dexerto rows vs 14 Steam rows | All non-tutorial rows, especially `Milk Factory` | Treat Dexerto as unlock-table/page-boundary proof; keep Steam `Unlock Milk Factory` as official metadata support |
| 15 non-tutorial candidates vs 16 official-wiki variants | All stage rows plus `Tutorial` | Track `Tutorial` separately from the 15 route candidates until stage-select/onboarding UI or game files prove its player-facing status |
| 6 biomes vs 9 wiki dungeon pages vs 15 stage candidates | All rows | Keep biome, dungeon page, variant, floor, and unlock-entry fields separate |
| Default/base stage | `Mad Forest` | Do not infer the exact fresh-save stage-card state until UI or game files show it |
| Dexerto omission | `Milk Factory` | Preserve as a playable/unlockable candidate; verify exact row/lock state in stage-select UI |
| Spelling | `Cappella Magna`, `Cappella Ultima` / `Capella Ultima` | Prefer two-`p` as source-level working spelling, but keep one-`p` video metadata as unresolved |
| Runtime stage content | Every row | Bosses, rewards, floor transitions, failure/clear consequences, and persistence require direct or high-resolution proof |

## Direct Proof Queue

- Capture a fresh-save world-map/stage-select screen before any run, including `Mad Forest`, any tutorial entry, locks, route branches, difficulty/floor labels, and selected-state text.
- Capture a progressed-save world-map/stage-select screen after each major branch unlock to prove the 13/14/15/16 row taxonomy and whether `Milk Factory` is displayed as a normal stage row.
- Confirm whether `Tutorial` appears as a replayable/selectable row, onboarding-only entry, demo/tutorial state, or wiki-only taxonomy row.
- Confirm whether `Mad Forest` appears as a default unlocked stage card, a hidden/base row, or another UI state.
- Resolve `Cappella` vs `Capella` from high-resolution stage-select UI, result screen, or game files.
- For each non-tutorial stage, capture entry, first room/combat, floor transition count, stage-specific object/event, boss or final encounter, clear/failure result, reward/unlock popup, and persistence after returning to town.
- Map official-wiki `order`, `floors`, `difficulty`, and `demo` values to shipped UI or game-file fields before using them as implementation constants.
