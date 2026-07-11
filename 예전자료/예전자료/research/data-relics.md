# Relic / Power-Up Data

Status: `official metadata collected / official wiki value extract / relic taxonomy reconciliation / cross-source secondary effect mapping / video partial`

Relics are persistent run modifiers according to guide sources. The previous 15-slot roster was accounted for by 13 official Steam achievement relic rows plus two non-achievement rows, `Milky Way Map` and `Rilevatore`. GameSpot and GAMES.GG provide secondary location/effect/toggle hints for that 15-row roster, and the generated GameSpot page crawl preserves the current 15-row guide boundary. The official wiki API crawl now exposes 16 relic infobox rows by adding `Deck Box`, while `Deck Box`, `Milky Way Map`, and `Rilevatore` have blank `foundin` fields. `research/relic-taxonomy-reconciliation.md` now maps the 15 guide rows against the 16 official-wiki rows: 15 guide rows map by name or alias, 14 are direct same-display-name matches, `Randomazzo` maps to official-wiki `Arcana Finder` through `RelicConfig_Randomazzo`, and `Deck Box` remains the official-wiki-only 16th row. Rilevatore's location conflicts across sources, `Ultimate Ultra Overkill` has a blank GameSpot unlock-stage value but a Curd Refinery official-wiki field, `Guiding Light` has an Inlaid-Library-vs-Mad-Forest conflict, `Polentir` now has a Furious-Forest-vs-Fortune-Forest route-text conflict, and every row still needs Museum/UI, high-resolution video, direct play, or game-file proof before final completion.

Current implementation gap map: [`relic-gap-map.md`](./relic-gap-map.md).
Generated GameSpot page crawl: [`relic-gamespot-page-crawl.md`](./relic-gamespot-page-crawl.md).
Generated relic taxonomy reconciliation: [`relic-taxonomy-reconciliation.md`](./relic-taxonomy-reconciliation.md).
Generated PC Gamer upgrade-priority crawl: [`pcgamer-upgrade-priority-crawl.md`](./pcgamer-upgrade-priority-crawl.md).
Generated PGG beginner systems crawl: [`pgg-beginner-systems-crawl.md`](./pgg-beginner-systems-crawl.md).
Generated official wiki API crawl: [`official-wiki-api-crawl.md`](./official-wiki-api-crawl.md).
Generated official wiki arcana/relic/dungeon field crawl: [`official-wiki-arcana-relic-dungeon-field-crawl.md`](./official-wiki-arcana-relic-dungeon-field-crawl.md).
Generated official wiki arcana/relic/dungeon value extract: [`official-wiki-arcana-relic-dungeon-value-extract.md`](./official-wiki-arcana-relic-dungeon-value-extract.md).

## Source Basis

| Source ID | Source | Used For | Current Grade |
| --- | --- | --- | --- |
| SRC-006 | Steam Community achievements page | Official achievement-backed relic names/descriptions and global unlock percentages | E5 metadata |
| SRC-112 | GameSpot relic list | 15 relic names, location/effect table, toggleable relic context | E1 |
| SRC-134 | GameSpot relic page crawl | Generated 15-row crawl preserving row order, toggle context, `Rilevatore` as `Curd Refinery`, and blank `Ultimate Ultra Overkill` unlock-stage value | E1 |
| SRC-136 | PC Gamer upgrade priority crawl | Generated selected route hints for Combo Stack, Gem Hammer, Polentir, Grim Grimoire, and Stardust Anvil | E1 |
| SRC-140 | PGG beginner systems crawl | Generated source-level Grim Grimoire tracker, Guiding Light route/effect claim, Blacksmith, and demo carryover rows | E1 |
| SRC-108-R | GAMES.GG relic guide | 15-relic total claim, named relic hints, village Museum behavior, toggle hints | E1 |
| SRC-001 | Steam store page | Official high-level dungeon/chest/gem/evolution/shovel loop | E5 for broad loop only |
| SRC-142 | Official wiki API crawl | 16 relic infobox rows, source-level locations/effects, and the `Deck Box` row absent from the 15-row guide boundary | E5 official wiki / not direct play |
| SRC-147 | Official wiki arcana/relic/dungeon value extract | 16 relic rows with official-wiki id, found-in field, text/effect presence, and keyword buckets; preserves blank `foundin`/`effects` queues without full effect prose | E5 official wiki structured values / not direct play |
| derived | Relic taxonomy reconciliation | 15 guide rows vs 16 official-wiki rows, `Deck Box` boundary, `Randomazzo` / `Arcana Finder` alias mapping, blank-field queues, and location conflict queue | Source-level reconciliation |

## Coverage Counter

| Segment | Known Total | Rows Collected | E2+ | E3+ | E4/E5 | Conflict / Missing |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Relic roster slots | 16 official-wiki rows vs 15 guide rows | 16 wiki rows + 15 guide rows | 16 official-wiki rows + value extract + 15 secondary + relic taxonomy reconciliation | 5 partial | 13 metadata + official-wiki rows | Official wiki adds `Deck Box` and source-level locations/effects; `relic-taxonomy-reconciliation.md` narrows the split to 15 guide rows mapped by name/alias plus one wiki-only row, but the 15-vs-16 roster boundary, starting-state rows, and several toggles still need UI |
| Relic runtime effects | 16 required if wiki roster is final | 16 wiki hints + 15 secondary hints + keyword buckets | 16 official-wiki rows + value extract + 15 secondary | 0 complete | official wiki only | Needs exact Museum/UI text, direct play, or full-resolution relic panels |
| Relic toggle behavior | 16 required if wiki roster is final | 8 toggleable hints + always-on/conflict hints | partial secondary | 0 | 0 | Museum hover/toggle state and disabled behavior still need direct proof |

## Official Wiki Relic Field Snapshot

`research/official-wiki-arcana-relic-dungeon-field-crawl.md` confirms all 16 official-wiki relic rows have `description` and `id` fields, 13 have `foundin`, and 12 have `effects`. `research/official-wiki-arcana-relic-dungeon-value-extract.md` preserves the row-level `id` and `foundin` values plus description/effects presence and keyword buckets without copying full effect prose. The missing `foundin` queue is `Deck Box`, `Milky Way Map`, and `Rilevatore`; the missing `effects` queue is `Combo Stack`, `Deck Box`, `Ovenkilt`, and `Rilevatore`. Treat those as direct Museum/UI capture targets rather than proof that the shipped game omits those fields.

## Relic Rows

| ID | Original Name | Location / Unlock | Effect Summary | Toggleable? | Runtime Evidence | Current Implementation | Gap | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| REL-001 | Milky Way Map | Starting/tutorial according to GAMES.GG; GameSpot lists N/A | Shows enemy positions and other map information | likely yes per secondary toggle lists; needs UI | 미검증 | no direct equivalent | Minimap/enemy-position rule, exact starting state, and Museum toggle missing | 교차검증 필요 |
| REL-002 | Rilevatore | Starting according to GAMES.GG, but GameSpot lists Curd Refinery | Shows weapon effectiveness / how weapons affect enemies | likely yes per secondary toggle lists; needs UI | 미검증 | no direct equivalent | Location conflict, combat-info UI, and Museum toggle missing | 출처 충돌 |
| REL-003 | Combo Stack / Combo Stash | Tutorial reward; Steam achievement `Combo Stack`; VID-001 `00:30` shows `Combo Stash` text; PC Gamer crawl says Combo Stack / Gem Hammer are tutorial-context rewards | Enables ascending mana-cost combo multiplier | likely yes per secondary toggle lists; needs UI | VID-001 `00:30` storyboard frame confirms a `Relic Found` panel and visible ascending-cost combo-multiplier text; exact full text still needs full-resolution capture | `src/rules/turboturn.js` | Name conflict and exact formulas/limits missing | Partial E3 / E5 metadata / 출처 충돌 |
| REL-004 | Gem Hammer | Mad Forest; PC Gamer crawl says Gem Hammer is obtained in tutorial context | Allows gems to be added to cards | toggle behavior needs UI; secondary text says disabling can remove gem functionality | 미검증 | limited gems in dungeon system | Unlock/persistence, exact socket authorization, and toggle behavior missing | 공식 메타데이터 수집 / 교차검증 필요 |
| REL-005 | Polentir | GameSpot `Furious Forest`; official-wiki value extract `Fortune Forest`; PC Gamer crawl says after clearing Mad Forest | Unlocks the Fortune Teller / Arcana Tent | likely always-on according to secondary guide; needs UI | 미검증 | no mature arcana system | Arcana access, route/location text, Fortune Teller UI, and persistence missing | 공식 메타데이터 수집 / 교차검증 필요 / CON-043 |
| REL-006 | Grim Grimoire | Library West Wing; PC Gamer crawl says after clearing Inlaid Library; PGG beginner systems crawl places it in Inlaid Library | Adds a discovered weapon evolution/union reference to the pause menu | likely always-on according to secondary guide; needs UI | 미검증 | no equivalent | Evolution reference, discovered-recipe state, and pause-menu access missing | 공식 메타데이터 수집 / 교차검증 필요 |
| REL-007 | Arcana Finder / Randomazzo | Library Sanctum; Steam achievement `Randomazzo`; VID-005 `04:00` relic-found panel reads `Arcana Finder` | Adds Arcana events/chests to dungeons | likely always-on according to secondary guide; needs UI | VID-005 `04:00` storyboard frame visibly reads `Relic Found` / `Arcana Finder` and says it adds Arcana chests to dungeons; exact relationship between achievement name and relic panel name still needs full-resolution/direct proof | no mature arcana system | Arcana chest flow, persistence, toggle behavior, and naming relation missing | Partial E3 / E5 metadata |
| REL-008 | Stardust Anvil | Teeny Bridge; PC Gamer crawl says Teeny Bridge reward | Unlocks Blacksmith's Workshop / card gem-slot purchases | conflicting secondary toggle hints; needs UI | 미검증 | no equivalent | Blacksmith, slot economy, costs, and persistence missing | 공식 메타데이터 수집 / 교차검증 필요 |
| REL-009 | Overkill | Teeny Bridge | Allows continued attacks on defeated bosses to earn gold | likely yes per secondary toggle lists; needs UI | 미검증 | no equivalent | Overkill economy, cap, coin formula, and persistence missing | 공식 메타데이터 수집 / 교차검증 필요 |
| REL-010 | Lapidary Loupe | Gallo Tower | Allows gem spawn-rate increase/decrease or gem sealing | likely always-on according to secondary guide; needs UI | 미검증 | no equivalent | Jeweller/gem rate UI, cost curve, and effect details missing | 공식 메타데이터 수집 / 교차검증 필요 |
| REL-011 | Sorceress' Tears | Gallo Tower | Adds Hurry/game-speed control or speeds animations | toggle behavior needs UI | 미검증 | no equivalent | Hurry mode, speed control, and timing proof missing | 공식 메타데이터 수집 / 교차검증 필요 |
| REL-012 | Ultimate Ultra Overkill | Curd Refinery according to GAMES.GG; GameSpot page crawl lists the effect but leaves the unlock-stage field blank | Raises Overkill damage cap, with GameSpot giving 5,000 | likely yes per secondary toggle lists; needs UI | 미검증 | no equivalent | Exact cap, dependency, location, and overkill math missing; GameSpot blank unlock-stage value is preserved as `CON-035` | 공식 메타데이터 수집 / 출처 충돌 / 교차검증 필요 |
| REL-013 | Ovenkilt | Cappella Ultima; VID-010 `66:20` relic-found panel | Triggers Overkill on the last enemy of any encounter; chests no longer grant gold | likely yes per secondary toggle lists; needs UI | VID-010 `66:20` storyboard frame shows `Relic Found` panel for `Ovenkilt`; exact effect text unreadable | no equivalent | Endgame economy rule, chest-gold tradeoff, and exact unlock condition missing | Partial E3 / E5 metadata |
| REL-014 | Bomba Infernale | Dairy Plant according to GameSpot; VID-005 has Bomba-like relic panel candidate | Vaporizes all enemies on the first floor of cleared dungeons | likely yes per secondary toggle lists; needs UI | VID-005 `05:10` storyboard frame shows a Bomba-like `Relic Found` panel; Steam achievement confirms `Bomba Infernale` is a relic name, but the exact panel text/effect still needs full-resolution/direct proof | no equivalent | Exact panel mapping, cleared-dungeon rule, source stage, and toggle behavior missing | Partial E3 / E5 metadata |
| REL-015 | Guiding Light | Inlaid Library according to GameSpot, but PGG beginner systems crawl says it drops in Mad Forest after reaching Level 10 (`CON-036`) | Shows breakable light sources on the map/minimap | likely yes per secondary toggle lists; needs UI | 미검증 | no equivalent | Exact map icon behavior, light-source runtime use, toggle state, and location/unlock conflict missing | E5 metadata / 출처 충돌 / 교차검증 필요 |
| REL-016 | Deck Box | Official wiki `foundin` field blank; not present in the 15-row GameSpot crawl boundary | Holds the deck of cards / source-level baseline travel item | unknown | no video/direct proof yet | no equivalent | Whether this is a Museum relic, starting item, tutorial state, or wiki-only/system row needs direct UI/game-file proof | Official wiki row / count conflict |

## Required Completion

- Extract all 16 official-wiki relic rows from in-game Museum/UI, direct play, high-resolution video, or game files, or prove which row is outside the player-facing Museum roster.
- Record location, exact effect text, toggle state, disabled behavior, persistence, and run impact.
- Resolve the 15 guide rows vs 16 official-wiki rows boundary, Rilevatore's starting-vs-Curd-Refinery-vs-blank-wiki location conflict, Ultimate Ultra Overkill's blank GameSpot unlock-stage vs Curd Refinery wiki field, Guiding Light's Inlaid-Library-vs-Mad-Forest route conflict, Polentir's Furious-Forest-vs-Fortune-Forest route-text conflict, Combo Stack vs Combo Stash spelling, Arcana Finder vs Randomazzo naming, and VID-005 Bomba panel mapping.
- Verify persistent save behavior and disabled-relic behavior.
