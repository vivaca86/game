# Relic Taxonomy Reconciliation

Status: `generated 2026-05-22 / source-level relic taxonomy reconciliation`

This artifact reconciles the 15 visible GameSpot/guide relic rows against the 16 official-wiki relic value rows. It does not prove the shipped Museum roster, exact relic panel text, toggle state, disabled behavior, persistence, unlock order, or runtime formulas. Treat it as a capture queue for Museum UI, relic-found panels, fresh-save baselines, progressed-save states, high-resolution video, and game-file proof.

Primary inputs:

- `research/relic-gamespot-page-crawl.md`
- `research/official-wiki-arcana-relic-dungeon-value-extract.md`
- `research/data-relics.md`
- `research/relic-gap-map.md`
- `research/source-conflicts.md` CON-011, CON-012, CON-018, CON-035, CON-036, and CON-043
- Sources: SRC-006, SRC-108-R, SRC-112, SRC-134, SRC-136, SRC-140, SRC-142, and SRC-147

## Reconciliation Snapshot

| Segment | Rows | Notes |
| --- | ---: | --- |
| GameSpot visible relic rows | 15 | Single all-relic table with relic, description, and unlock-stage columns |
| Official-wiki relic infobox rows | 16 | Adds `Deck Box` to the 15-row guide boundary |
| Guide rows mapped to official-wiki rows by name or alias | 15 | Includes `Randomazzo` mapped to official-wiki `Arcana Finder` through `RelicConfig_Randomazzo` |
| Direct same-display-name matches | 14 | All mapped rows except the `Randomazzo` / `Arcana Finder` display-name split |
| Official-wiki rows outside the 15-row guide boundary | 1 | `Deck Box` |
| Official-wiki rows with blank `foundin` field | 3 | `Deck Box`, `Milky Way Map`, and `Rilevatore` |
| Official-wiki rows with blank `effects` field | 4 | `Combo Stack`, `Deck Box`, `Ovenkilt`, and `Rilevatore` |
| Implementation parity closed by this file | 0 | Direct UI, game files, or runtime proof still required |

## Working Interpretation

The current source-level split is a roster-boundary conflict, not implementation proof:

- GameSpot preserves a 15-row guide-facing relic list.
- The official wiki preserves 16 relic infobox rows and introduces `Deck Box` as the extra row.
- `Randomazzo` is the GameSpot display row, while the official-wiki value row uses `Arcana Finder` with id `RelicConfig_Randomazzo`; VID-005 also visually supports an `Arcana Finder` relic panel candidate.
- `Milky Way Map`, `Rilevatore`, and `Deck Box` are the highest-priority Museum/fresh-save boundary rows because the official-wiki `foundin` field is blank for all three.
- `Combo Stack`, `Ovenkilt`, `Rilevatore`, and `Deck Box` are the highest-priority exact-effect rows because the official-wiki `effects` field is blank for all four.

Do not implement `Deck Box` as a normal collectible relic yet. The shipped Museum UI or game files must prove whether it is a player-facing relic, a starting/system item, a hidden row, a non-toggleable baseline object, or wiki taxonomy only.

## Row-Level Reconciliation

| Row | GameSpot / Guide Row | Official-Wiki Row / ID | Location Comparison | Reconciliation Note |
| --- | --- | --- | --- | --- |
| REL-001 | Milky Way Map | Milky Way Map / RelicConfig_MilkyWayMap | GameSpot `N/A`; wiki blank | Starting/baseline side is plausible but unproven; fresh-save Museum proof required |
| REL-002 | Rilevatore | Rilevatore / RelicConfig_DamageIndicators | GameSpot `Curd Refinery`; wiki blank; GAMES.GG starting claim | Open location conflict; also blank wiki effects field |
| REL-003 | Combo Stack | Combo Stack / RelicConfig_PancakeOfPower | GameSpot and wiki `Tutorial` | Display-name conflict with VID-001 `Combo Stash`; blank wiki effects field |
| REL-004 | Gem Hammer | Gem Hammer / RelicConfig_GemHammer | GameSpot and wiki `Mad Forest` | Source-level location agreement; socket UI and toggle proof still missing |
| REL-005 | Polentir | Polentir / RelicConfig_Polentir | GameSpot `Furious Forest`; wiki `Fortune Forest`; PC Gamer after-Mad-Forest route hint | Route/location text conflict; direct panel or game-file proof required |
| REL-006 | Grim Grimoire | Grim Grimoire / RelicConfig_GrimGrimoire | GameSpot and wiki `Library West Wing`; PGG says Inlaid Library context | Source-level guide/wiki agreement on West Wing, but route wording still needs UI proof |
| REL-007 | Randomazzo | Arcana Finder / RelicConfig_Randomazzo | GameSpot `Library Sanctum`; wiki `Library Sanctum` | Name/display taxonomy conflict; VID-005 supports Arcana Finder panel candidate |
| REL-008 | Stardust Anvil | Stardust Anvil / RelicConfig_Blacksmith | GameSpot and wiki `Teeny Bridge` | Source-level location agreement; Blacksmith UI/cost proof still missing |
| REL-009 | Overkill | Overkill / RelicConfig_Overkill | GameSpot and wiki `Teeny Bridge` | Source-level location agreement; cap/formula/runtime proof still missing |
| REL-010 | Lapidary Loupe | Lapidary Loupe / RelicConfig_Jeweller | GameSpot and wiki `Gallo Tower` | Source-level location agreement; Jeweller UI and sealing proof still missing |
| REL-011 | Sorceress' Tears | Sorceress' Tears / RelicConfig_SorcerersTears | GameSpot and wiki `Gallo Tower` | Source-level location agreement; Hurry/speed UI proof still missing |
| REL-012 | Ultimate Ultra Overkill | Ultimate Ultra Overkill / RelicConfig_UltimateOverkill | GameSpot blank; wiki `Curd Refinery`; GAMES.GG Curd side | Open location conflict; overkill cap proof still missing |
| REL-013 | Ovenkilt | Ovenkilt / RelicConfig_Ovenkilt | GameSpot and wiki `Cappella Ultima` | VID-010 panel candidate exists; blank wiki effects field still requires exact text/runtime proof |
| REL-014 | Bomba Infernale | Bomba Infernale / RelicConfig_BombaInfernale | GameSpot and wiki `Dairy Plant` | VID-005 Bomba-like panel candidate still needs mapping proof |
| REL-015 | Guiding Light | Guiding Light / RelicConfig_GuidingLight | GameSpot and wiki `Inlaid Library`; PGG `Mad Forest` level-10 route claim | Open location conflict; light-source map behavior proof still missing |
| REL-016 | no GameSpot row | Deck Box / RelicConfig_DeckBox | wiki blank | Official-wiki-only row outside the 15-row guide boundary; Museum/game-file proof required |

## Conflict Queue

| Conflict | Rows | Current Treatment |
| --- | --- | --- |
| 15 guide rows vs 16 official-wiki rows | All relic rows, especially `Deck Box` | Keep `Deck Box` separate until Museum or game files prove player-facing status |
| Starting/system rows | `Milky Way Map`, `Rilevatore`, `Deck Box` | Fresh-save baseline and Museum roster are required before assigning starting state |
| Blank official-wiki effects | `Combo Stack`, `Deck Box`, `Ovenkilt`, `Rilevatore` | Use panel/UI/game-file proof for exact text and runtime rules |
| Display-name split | `Randomazzo` vs `Arcana Finder`; `Combo Stack` vs `Combo Stash` | Preserve both labels until high-resolution in-game text or game files resolve them |
| Location conflicts | `Rilevatore`, `Ultimate Ultra Overkill`, `Guiding Light`, `Polentir` | Preserve source split; do not finalize unlock location from guide/wiki alone |

## Direct Proof Queue

- Capture the full Relic Museum roster on a fresh save and a progressed save, including locked/unlocked state and row count.
- Confirm whether `Deck Box` appears in the Museum, save data, relic-found panels, or game files; if not, classify it outside the player-facing Museum roster.
- Capture exact relic-found panel text for `Combo Stack`/`Combo Stash`, `Arcana Finder`/`Randomazzo`, `Ovenkilt`, `Rilevatore`, and `Deck Box` if present.
- Resolve `Rilevatore` starting vs `Curd Refinery` vs blank-wiki location using fresh-save state, unlock panel, Museum source text, or game files.
- Resolve `Ultimate Ultra Overkill` blank GameSpot location vs `Curd Refinery` wiki/GAMES.GG side.
- Resolve `Guiding Light` Inlaid Library vs Mad Forest level-10 route claim.
- Resolve `Polentir` Furious Forest vs Fortune Forest route wording.
- Toggle at least one known-toggle relic off and on, then compare the next run to prove disabled behavior and persistence.
- Record at least one runtime consequence for each confirmed relic row before implementation approval.
