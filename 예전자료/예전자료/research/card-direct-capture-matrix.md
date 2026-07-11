# Card Direct Capture Matrix

Status: `generated 2026-05-22 / direct-proof execution matrix / blocked until app 3265700 or game files are available`

Related files:

- [`direct-play-verification.md`](./direct-play-verification.md) DP-201
- [`remaining-proof-queue.md`](./remaining-proof-queue.md)
- [`card-taxonomy-reconciliation.md`](./card-taxonomy-reconciliation.md)
- [`card-gap-map.md`](./card-gap-map.md)
- [`card-dexerto-page-crawl.md`](./card-dexerto-page-crawl.md)
- [`card-secondary-catalog.md`](./card-secondary-catalog.md)
- [`official-wiki-card-gem-value-extract.md`](./official-wiki-card-gem-value-extract.md)
- [`pgg-beginner-systems-crawl.md`](./pgg-beginner-systems-crawl.md)
- [`source-conflicts.md`](./source-conflicts.md) CON-017, CON-021, CON-022, CON-031, CON-032, CON-037

This matrix turns the card taxonomy into direct-play, high-resolution video, and game-file capture packets. It is not proof by itself. Card implementation remains closed until each accepted row has exact shipped name, type, cost, text, socket fields, target rules, runtime behavior, unlock state, and acceptance criteria.

## Capture Packet Standard

Every card packet must include these fields before it can close a row:

| Field | Requirement |
| --- | --- |
| Build baseline | App `3265700`, build id/version, platform, language, timestamp, save state |
| Source layer | Public unlock row, Dexerto page row, official-wiki row, official Store media candidate, storyboard row, or game-file row |
| Catalog proof | Collection UI, deck UI, reward UI, Grim Grimoire, card tooltip, save data, or game-file table |
| Display proof | Exact name, category/type/color, mana cost, gem slots, max slots if shown, card text, destroy/temporary/retain markers |
| Runtime proof | Targeting, timing, damage/heal/block/draw/mana/status behavior, randomization, restrictions, and failure cases |
| Mutation proof | Deck before/after for destroyed cards, temporary cards, duplicated cards, evolved cards, socketed cards, and Crawler cards |
| Unlock proof | Achievement/Town Hall/card collection row, reward popup, route trigger, or game-file unlock condition |
| Source resolution | Confirmed, contradicted, unresolved, version difference, internal-only, or excluded |
| Implementation output | Exact row data and testable acceptance condition; do not implement from partial packets |

## Priority Order

| Priority | Packet IDs | Reason |
| --- | --- | --- |
| P0 | CARD-DP-001 to CARD-DP-005 | Close the card-count/catalog boundary before row implementation. |
| P1 | CARD-DP-006 to CARD-DP-013 | Capture per-category non-character card membership and exact fields. |
| P2 | CARD-DP-014 to CARD-DP-020 | Resolve missing fields, wiki-only rows, Wild/Temporary behavior, and Crawler-card count overlap. |
| P3 | CARD-DP-021 to CARD-DP-028 | Resolve evolution, Grim Grimoire, socket-blocking, and deck mutation conflicts. |
| P4 | CARD-DP-029 to CARD-DP-035 | Resolve runtime edge cases, unlock mapping, reward pools, and implementation acceptance. |

## P0 Catalog / Count Boundary

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| CARD-DP-001 | Card collection count | Official `65+` shorthand vs 87 Dexerto non-character, 90 wiki non-character, 113 wiki total | Capture collection UI count, tab/category count, completion number, filters, hidden locked rows, and whether count changes with progress | CON-031, CON-037, card-taxonomy count boundary |
| CARD-DP-002 | Non-character vs Crawler-card membership | 23 official-wiki character/Crawler rows; 22 Dexerto character pages | Capture whether Crawler cards appear in the same card catalog, character UI, Inn/party UI, or separate deck-only surfaces | CON-002, CON-008, CON-033, 87/90/113 boundary |
| CARD-DP-003 | Game-file card table index | Official wiki 113 rows, Dexerto 87 rows, local collection unknown | If game files are available, extract card ids/display strings/types/costs/slots/unlocks without guessing from page names | Source row-to-file token map |
| CARD-DP-004 | Locked/unknown/hidden card rows | Official-wiki-only and hidden/unavailable candidates | Capture locked card UI, hidden row placeholders, unavailable rows, and whether unavailable rows count toward completion | Divano, MissingN0/Crawler rows, official-wiki-only rows |
| CARD-DP-005 | Reward pool categories | Level-up, chest, event, shop, evolution, Crawler/party cards | Capture which card categories can appear in each reward surface and what rows are excluded | Reward taxonomy and implementation pool gating |

## P1 Non-Character Category Capture

| Packet ID | Category | Source Rows | Required Capture | Output |
| --- | --- | --- | --- | --- |
| CARD-DP-006 | Attack cards | 40 Dexerto/wiki attack rows plus public weapon/evolution rows | Full card tooltip for each attack row: name, cost, slots, text, unlock, reward surface, runtime attack sample | Confirmed attack card table |
| CARD-DP-007 | Defense cards | 8 Dexerto/wiki defense rows | Tooltip and runtime sample for armor/block/heal/freeze/defense behavior | Confirmed defense card table |
| CARD-DP-008 | Stat / stat boost cards | 18 Dexerto rows, 19 wiki rows including `Crystal Crown` | Tooltip, stat target, destroy marker, duration/persistence, before/after stat proof | Confirmed stat card table and `Crystal Crown` status |
| CARD-DP-009 | Mana cards | 6 Dexerto/wiki rows, including `Mana Bomb` cost conflict | Tooltip, cost, mana gain/spend behavior, chain impact, invalid/blocked cases | Confirmed mana card table; `Mana Bomb` cost |
| CARD-DP-010 | Wild cards | 9 Dexerto rows, 10 wiki rows including `Rich Coin Bag` | Tooltip, W/missing cost, bridge behavior, destroy behavior, random/draw/coin/luck effects, chain failure cases | Confirmed Wild table and missing-cost resolution |
| CARD-DP-011 | Temporary cards | 6 Dexerto rows, 7 wiki rows including `Angelo Spietato` | Tooltip, duration, retain/destroy behavior, deck mutation, reward/removal timing | Confirmed Temporary table and `Angelo Spietato` status |
| CARD-DP-012 | Item/stat unlock rows | 17 item/stat/mana public rows including Stone Mask | Unlock proof, tooltip, cost/color/type, effect, and runtime behavior for each row | CON-017 and item/stat row parity |
| CARD-DP-013 | Weapon unlock rows | 18 public weapon rows | Unlock proof, tooltip, cost/color/type, target behavior, and runtime sample for each row | Weapon row parity |

## P2 Field Conflict / Wiki-Only Rows

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| CARD-DP-014 | `Mana Bomb` | Dexerto page missing cost; official wiki says cost `5` | Tooltip or game-file row with exact cost, text, type, slots, runtime behavior | `Mana Bomb` field conflict |
| CARD-DP-015 | Missing wiki cost rows | `Big Coin Bag`, `Clover Petal`, `Coin Purse`, `Divano`, `Little Clover`, `Raw Mana`, `Rich Coin Bag`, `Vacuum` | Tooltip/game-file proof for displayed cost and whether cost is W, 0, variable, hidden, or internal | Missing-cost queue |
| CARD-DP-016 | Missing wiki gem-slot rows | Bloody Tear, Candelabrador, Candella, Candle, Death Spiral, Duplicator, Hellfire, Holy Wand, La Borra, NO FUTURE, Pummarola, Shatter, Skull O'Maniac, Soul Eater, Spinach, Unholy Vespers | Tooltip/game-file proof for base slots and max slots, plus socket eligibility in card/gem UI | Missing socket queue |
| CARD-DP-017 | Official-wiki-only non-character rows | `Angelo Spietato`, `Crystal Crown`, `Rich Coin Bag` | Collection UI/game-file/reward proof proving player-facing, internal-only, hidden, unavailable, or excluded status | 87-vs-90 boundary |
| CARD-DP-018 | FRVR vs Dexerto differences | FRVR 109 table / Dexerto 87 pages | Use only if UI/game files show a row missing from Dexerto/wiki; otherwise keep FRVR as secondary hints | CON-032 boundary |
| CARD-DP-019 | Store media card text candidates | Store movie/frame visible cards and evolved-card snippets | Cross-check official media visible text against current build tooltip or game files before using values | SRC-145 candidate validation |
| CARD-DP-020 | Character/Crawler card fields | 23 wiki character cards, 22 Dexerto character pages | Capture Crawler-card play cost/duration/text, lead/follower behavior, deck insertion/removal, and whether card appears in card collection | CON-033, character-card table |

## P3 Evolution / Grim Grimoire / Deck Mutation

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| CARD-DP-021 | Grim Grimoire UI | PGG/VGC/KeenGamer guide claims; official relic rows | Capture discovered/undiscovered recipe UI, recipe names, icons, requirements, hidden-state behavior, pause-menu location | Recipe tracker proof |
| CARD-DP-022 | Standard evolution flow | 17 public evolution results, 19 official-wiki `evointo` base rows | Capture base card, ingredient card, empty-socket requirement, evolution trigger, result card, deck before/after | CON-021, evolution base/result mapping |
| CARD-DP-023 | Support-card consumption conflict | PGG main section says both consumed; PGG FAQ/KeenGamer say base consumed/support stays | Capture support item before/after, duplicate support behavior, and exact deck mutation after standard evolution | CON-021 resolution |
| CARD-DP-024 | Socket-blocking evolution | PGG warns filled gem socket can block evolution | Capture valid base card with empty socket, same base with filled socket, fail message or no-valid state, gem refund/loss behavior | Socket-block rule |
| CARD-DP-025 | Union evolution flow | Phieraggi and Vandalier union claims | Capture all required cards, union UI, consumed card list, resulting card fields, duplicate handling | Union model proof |
| CARD-DP-026 | Evolution aliases/spelling | Fire/Flame Wand, Lightning/Thunder Ring, Tirajisu/Tirajisu accent, Hollow Heart(s), candle-family names | Capture in-game exact names in card UI and recipe UI, then map aliases to final display names | CON-022 |
| CARD-DP-027 | Evolution trigger surfaces | Evolution statue, chest, boss reward, Evolution Gem | Capture each trigger type, choice count, no-valid-recipe fallback, cash-out/skip if present, and result deck mutation | Event/evolution boundary |
| CARD-DP-028 | Evolved-card runtime samples | 17 evolution result rows | Capture at least one runtime use per evolved card family: damage, target, timing, special effect, cost, slots, retain/destroy markers | Evolved-card behavior proof |

## P4 Runtime / Unlock / Implementation Acceptance

| Packet ID | Target | Required Capture | Output |
| --- | --- | --- | --- |
| CARD-DP-029 | Auto-use order and blocked cards | Hand order, cost order, insufficient mana, no valid target, status lock, card not played | Runtime card order rules and failure messages |
| CARD-DP-030 | Destroyed-after-use cards | Cards marked destroyed after use, e.g. Hollow Heart source claim; attached gem behavior if socketed | Deck mutation timing and persistence boundary |
| CARD-DP-031 | Wild/Temporary edge cases | Wild bridge, turn carryover, destroy, retain, random cost, freeze, draw, shatter, Confuse/Cursed Lancet/Shatter | Special-card runtime rule table |
| CARD-DP-032 | Unlock and Town Hall linkage | Every public card/evolution achievement row and in-game checklist state | Unlock popup, checklist progress, Steam/Town Hall mapping, persistence |
| CARD-DP-033 | Reward/reroll/skip/card-pool behavior | Level-up, chest, event, boss reward, shop/station, duplicate event | Reward pool and option-state taxonomy |
| CARD-DP-034 | Card/gem compatibility | Each confirmed card type with valid/invalid gem targets, replacement/cancel, socket caps, evolution blocked state | Card-gem compatibility matrix |
| CARD-DP-035 | Implementation acceptance pass | All confirmed card rows | Exact data row, behavior tests, UI text, unlock condition, mutation rule, and parity status for later implementation |

## Backfill Instructions

When a card packet is completed, update these files in order:

1. [`direct-play-verification.md`](./direct-play-verification.md): mark DP-201 evidence and build/language/platform.
2. [`card-taxonomy-reconciliation.md`](./card-taxonomy-reconciliation.md): change source-layer candidates into confirmed/rejected/internal-only mappings.
3. [`data-cards.md`](./data-cards.md): add exact card fields and direct/game-file proof.
4. [`card-gap-map.md`](./card-gap-map.md): update parity only after all acceptance fields are proven.
5. [`source-conflicts.md`](./source-conflicts.md): resolve or preserve CON-017, CON-021, CON-022, CON-031, CON-032, CON-037.
6. [`gem-taxonomy-reconciliation.md`](./gem-taxonomy-reconciliation.md) and gem maps if socket/gem behavior is affected.
7. [`character-taxonomy-reconciliation.md`](./character-taxonomy-reconciliation.md) if Crawler-card rows or character cards are affected.
8. [`gap-map.md`](./gap-map.md) only after row-level files are updated.
9. Later implementation files only after each row has a testable acceptance condition.

## Stop Conditions

Stop and preserve a row as unresolved when any of these happen:

- The tooltip or card text is unreadable.
- The row appears only in Store/trailer media and not in current-build UI/files.
- A source page gives a name but no shipped UI/game-file membership.
- A card is observed in a reward but not enough fields are visible to set cost/text/sockets.
- An evolution result is observed but deck-before/deck-after is missing.
- A Crawler card appears in combat but its collection-count membership is unclear.
- A row may be internal-only, unavailable, hidden, or post-launch, but no authoritative marker proves which.

Under those conditions, keep the row as `source-level / capture queue`, not implementation-ready.
