# Achievement / Town Hall Direct Capture Matrix

Status: `generated 2026-05-22 / direct-proof execution matrix / blocked until app 3265700 or game files are available`

Related files:

- [`direct-play-verification.md`](./direct-play-verification.md) DP-003, DP-005, and DP-207
- [`remaining-proof-queue.md`](./remaining-proof-queue.md)
- [`data-achievements.md`](./data-achievements.md)
- [`achievement-gap-map.md`](./achievement-gap-map.md)
- [`town-taxonomy-reconciliation.md`](./town-taxonomy-reconciliation.md)
- [`town-powerup-relic-arcana-direct-capture-matrix.md`](./town-powerup-relic-arcana-direct-capture-matrix.md)
- [`card-direct-capture-matrix.md`](./card-direct-capture-matrix.md)
- [`gem-direct-capture-matrix.md`](./gem-direct-capture-matrix.md)
- [`character-inn-direct-capture-matrix.md`](./character-inn-direct-capture-matrix.md)
- [`stage-route-direct-capture-matrix.md`](./stage-route-direct-capture-matrix.md)
- [`enemy-direct-capture-matrix.md`](./enemy-direct-capture-matrix.md)
- [`event-direct-capture-matrix.md`](./event-direct-capture-matrix.md)
- [`source-conflicts.md`](./source-conflicts.md)

This matrix turns the 161 official Steam achievement metadata rows and the Town Hall / Unlocks research queue into direct-play, high-resolution video, and game-file capture packets. It is not proof by itself. Achievement implementation remains closed until each accepted row has in-game checklist or platform-only classification, exact trigger text, reward linkage, unlock-popup timing, persistence, and a row-level acceptance condition.

## Capture Packet Standard

Every achievement packet must include these fields before it can close a row:

| Field | Requirement |
| --- | --- |
| Build baseline | App `3265700`, build id/version, platform, language, timestamp, save slot, Steam online/offline state, and whether demo app `4329470` was ever used |
| Source row | Steam achievement ID, name, official public description, global percent snapshot, domain, and linked research table |
| Town Hall proof | Town Hall/Unlocks row label, description, locked/completed state, counter, filter/category, row order, reward text, and if absent, explicit absence proof |
| Trigger proof | Direct runtime trigger, route/stage/combat/event/card/gem/town action, pre-state, post-state, and exact moment the row updates |
| Popup proof | In-game unlock popup, Town Hall notification, Steam achievement popup, order/timing between them, and any delayed/offline sync behavior |
| Reward linkage | Card, gem, character, stage, relic, Arcana, Power-Up, town building, event, enemy/boss, evolution, or platform-only classification |
| Persistence proof | Return to town, save/reload, relaunch, Steam Cloud or save-slot behavior, and repeated-trigger behavior after completion |
| Cross-domain proof | Link to the domain direct-capture packet that proves the underlying gameplay row, not only the achievement metadata |
| Source resolution | Confirmed, contradicted, unresolved, platform-only, Town-Hall-only, hidden, grouped, duplicate, version difference, or excluded |
| Implementation output | Exact row data and testable acceptance condition; do not implement from metadata-only rows |

## Priority Order

| Priority | Packet IDs | Reason |
| --- | --- | --- |
| P0 | ACH-DP-001 to ACH-DP-007 | Establish Town Hall/checklist UI, platform popup timing, and row-category boundary. |
| P1 | ACH-DP-008 to ACH-DP-017 | Capture early high-percentage rows to prove basic unlock and checklist behavior. |
| P2 | ACH-DP-018 to ACH-DP-034 | Capture every achievement domain and cross-domain reward link. |
| P3 | ACH-DP-035 to ACH-DP-046 | Resolve special rows, hidden/platform-only cases, counters, and persistence. |
| P4 | ACH-DP-047 to ACH-DP-055 | Backfill all 161 rows and define implementation acceptance. |

## P0 Town Hall / Platform Boundary

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| ACH-DP-001 | Full Town Hall / Unlocks entry | VID-013 Town Hall/Unlocks surface, 161 Steam rows | Capture building/menu entry, exact label, top-level counters, categories, filters, row count, sorting, search if present, and locked/completed visual states | Town Hall baseline |
| ACH-DP-002 | Steam achievement overlay timing | Steam 161 metadata rows | Trigger one low-risk achievement and capture in-game popup, Steam popup, order/timing, offline behavior if available, and post-sync state | Platform-vs-game boundary |
| ACH-DP-003 | Achievement row absence handling | Steam metadata vs in-game checklist | Verify whether every visible Steam row has a Town Hall row; classify absent rows as platform-only, hidden until condition, grouped, or unresolved | 161-row membership |
| ACH-DP-004 | Completed-row persistence | Any already-completed or newly completed row | Capture completed state, relaunch, changed save slot, Steam Cloud sync if visible, and repeated-trigger no-op behavior | Persistence proof |
| ACH-DP-005 | Locked-row counter behavior | Card/gem/count-based rows | Capture locked row progress counters before/after a small action and confirm whether partial counters are visible or hidden | Counter proof |
| ACH-DP-006 | Reward linkage display | Rows that unlock visible content | Capture whether Town Hall row shows reward, requirement, destination building/catalog, or only text; link to actual reward surface | Reward proof |
| ACH-DP-007 | Game-file achievement table | 161 Steam rows and Town Hall UI | If files are available, extract achievement ids, localization keys, trigger ids, reward ids, categories, ordering, hidden flags, and platform ids | Final source map |

## P1 Early Smoke Rows

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Output |
| --- | --- | --- | --- | --- |
| ACH-DP-008 | ACH-001 `Combo Stack` | Relic/power-up, Tutorial, 99.8% global row | Capture Tutorial relic-found panel, Town Hall row, Steam popup, Museum row, and runtime/toggle proof link | Early relic achievement proof |
| ACH-DP-009 | ACH-002 `Antonio` | Character/Crawler, rescued in countryside | Capture rescue/unlock event, Inn/character row, Town Hall row, Steam popup, starting deck/passive follow-up | Early character proof |
| ACH-DP-010 | ACH-004 `The Inn` | Town/meta building unlock | Capture trigger, building unlock, Town Hall row, Steam popup, Inn entry, save/reload persistence | Town building proof |
| ACH-DP-011 | ACH-005/006/012 level/resource card unlocks | Empty Tome, Hollow Heart, Crown | Capture resource/level trigger, card unlock popup, catalog row, Town Hall row, and Steam popup timing | Card unlock baseline |
| ACH-DP-012 | ACH-007/015 early stage unlocks | Inlaid Library and Teeny Bridge | Capture stage-select before/after, unlock popup, Town Hall row, Steam popup, route persistence | Stage unlock baseline |
| ACH-DP-013 | ACH-008 `Power Ups Shop` | Collect 250 coins | Capture coin counter, building unlock, Power-Up Shop entry, Town Hall row, Steam popup, save persistence | Power-Up Shop proof |
| ACH-DP-014 | ACH-009/020 early gem rows | Return Gem, Copy Gem | Capture gem unlock row, reward/socket UI, Town Hall row, Steam popup, and exact gem catalog text | Gem baseline |
| ACH-DP-015 | ACH-011 `Relic Museum` | Play two dungeons | Capture two-dungeon trigger, Museum unlock, Town Hall row, Steam popup, Museum entry, save persistence | Museum proof |
| ACH-DP-016 | ACH-016 first evolution | Discover Holy Wand | Capture evolution trigger, Grim Grimoire/catalog update, Town Hall row, Steam popup, and deck mutation proof | Evolution baseline |
| ACH-DP-017 | First Arcana row | Example: ACH-030 `Sharp Mind` or earliest unlocked Arcana | Capture tracker, Fortune Teller row, Town Hall row, Steam popup, selection/effect proof link | Arcana baseline |

## P2 Domain-Level Coverage

| Packet ID | Domain | Source-Layer Starting Point | Required Capture | Domain Output |
| --- | --- | --- | --- | --- |
| ACH-DP-018 | Card unlocks | 35 rows: ACH-005 etc. | For every card achievement, capture trigger, Town Hall row, unlock popup, card catalog row, exact card text, and runtime proof link | Card achievement map |
| ACH-DP-019 | Evolution discoveries | 17 rows: ACH-016 etc. | Capture recipe, trigger, result card, Grim Grimoire row, Town Hall row, popup, deck before/after, and ingredient-consumption proof | Evolution achievement map |
| ACH-DP-020 | Gems | 49 rows: ACH-009 etc. | Capture trigger, gem reward/catalog row, rarity/effect/socket proof, Town Hall row, popup, and exact in-game name | Gem achievement map |
| ACH-DP-021 | Characters / Crawlers | 20 public rows | Capture trigger, Inn/character row, price/default state, starting deck/passive, Town Hall row, popup, and party persistence | Character achievement map |
| ACH-DP-022 | Stage progression | 14 rows | Capture stage-select lock/unlock, clear/failure trigger, boss/reward if any, Town Hall row, popup, and route persistence | Stage achievement map |
| ACH-DP-023 | Relics / power-ups | 13 achievement-backed relic rows | Capture relic-found panel, Museum row/toggle, Town Hall row, popup, exact effect text, and runtime consequence | Relic achievement map |
| ACH-DP-024 | Arcana | 10 public rows | Capture tracker/Fortune Teller row, effect text, selection state, Town Hall row, popup, and runtime example | Arcana achievement map |
| ACH-DP-025 | Town / meta buildings | 3 rows: The Inn, Power Ups Shop, Relic Museum | Capture building unlock, exact labels, row state, cost/entry state, Town Hall row, popup, and persistence | Town achievement map |
| ACH-DP-026 | Enemy/boss target rows | Mantichana, Nesufritto, Milk Elemental, Lion Heads, Dragon Shrimps, Giant Enemy Crab, Gallo, Skeletons, Trickster | Capture enemy name/fight/count, unlock row, reward, Town Hall row, popup, and enemy matrix link | Enemy-linked achievement map |
| ACH-DP-027 | Count/progress rows | Cards played, coins, damage, armor, mana, combo, deck size, HP recovered, enemies killed | Capture counter visibility, threshold text, before/after increments, exact trigger moment, and reset/carryover behavior | Counter achievement map |
| ACH-DP-028 | Route/coffin rows | Pugnala, Giovanna, Poppea, Concetta and other coffin/route rows | Capture map route, coffin interaction, character unlock, Town Hall row, popup, Inn state, and persistence | Route achievement map |
| ACH-DP-029 | Light-source and object rows | Fire Wand, Wild Buff, Destroy Gem, Floor Chicken, Mine Cart, Orologion, Rosary, Vacuum, Clover | Capture object pickup/destruction, counter change, reward row, event/object classification, Town Hall row, and popup | Object-linked map |
| ACH-DP-030 | Character-specific level rows | Pasqualina, Pummarola, Cherry Bomb, etc. | Capture selected character, stage if required, level threshold, unlock row, Town Hall row, popup, and follow-up catalog/Inn state | Character-level map |
| ACH-DP-031 | Character-specific card-use rows | Arca, Poe, Porta, Clerici, Christine, etc. | Capture selected character if required, card-use counter, unlock text, Town Hall row, popup, and reward linkage | Character/card-use map |
| ACH-DP-032 | Late-route rows | Cappella Magna, Cappella Ultima, Ovenkilt, Phieraggi, Gorgeous Moon, Valkyrie Turner, Mannajja | Capture late-route conditions, row triggers, endgame progression, Town Hall rows, popup timing, and persistence | Late-game map |
| ACH-DP-033 | Hidden/special rows | MissingN0 if present, Trickster, RedDeath, internal/nonpublic rows if discovered | Capture whether row appears in Town Hall, hidden slot behavior, platform-only behavior, and source conflict linkage | Hidden-row map |
| ACH-DP-034 | Demo/carryover achievement behavior | Demo app `4329470`, full app `3265700`, official carryover claims | Capture demo/full migration, already-earned rows, achievement grant timing, tutorial demo-save deletion exception, and Steam sync | Save/platform map |

## P3 Row-State And Conflict Resolution

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| ACH-DP-035 | Steam row vs Town Hall wording | All 161 rows | Compare official Steam name/description against Town Hall row text; preserve exact wording and mark mismatches | Text reconciliation |
| ACH-DP-036 | Category/filter taxonomy | 35 card, 17 evolution, 49 gem, 20 character, 14 stage, 13 relic/power-up, 10 arcana, 3 town/meta rows | Capture Town Hall categories and whether they match metadata domain mapping or use different grouping | Category proof |
| ACH-DP-037 | Repeated/overlapping triggers | Rows sharing cards, gems, enemies, stage clears, or counters | Capture whether one action unlocks multiple rows, order of popups, and duplicate-row no-op behavior | Multi-unlock timing |
| ACH-DP-038 | Platform-only or absent rows | Any Steam row missing from Town Hall | Capture Steam list, Town Hall filters/search/categories, and game-file flags if available before classifying absence | Absence proof |
| ACH-DP-039 | Grouped checklist rows | If Town Hall groups multiple Steam rows under one checklist item | Capture group row, expanded details, individual Steam popups, and reward resolution | Grouping proof |
| ACH-DP-040 | Counter thresholds | `lots`, `many`, `high`, `very high` public descriptions | Capture exact in-game numeric threshold from Town Hall UI, tracker, popup, or game file; do not infer from wording | Threshold proof |
| ACH-DP-041 | Reward vs requirement split | Rows where achievement name is reward but description is trigger | Capture requirement text, reward display, unlocked content surface, and domain data row update | Reward/trigger boundary |
| ACH-DP-042 | Global percent ordering sanity check | Steam percentages from 2026-05-21 | Keep percentages as metadata only; do not use for unlock order unless UI/game files confirm progression order | Metadata boundary |
| ACH-DP-043 | Offline/online/Cloud behavior | Steam Cloud and platform metadata | Capture offline trigger if possible, reconnect sync, save-slot copy, relaunch, and duplicate unlock handling | Platform persistence |
| ACH-DP-044 | Localization/language boundary | Store lists 12 languages; English is current baseline | Capture language setting and one row before/after language switch if available; keep localization keys separate from English labels | Localization boundary |
| ACH-DP-045 | Game-file achievement flags | Steam ids, Town Hall ids, reward ids | If files are available, extract trigger functions, stat counters, hidden flags, localization keys, and reward mappings | Final achievement source map |
| ACH-DP-046 | Per-row evidence grade upgrade | E5 Steam metadata only, E3/E4 direct proof needed | Assign evidence grade after each row gets UI/runtime proof; keep metadata-only rows blocked | Evidence grade map |

## P4 Backfill And Acceptance

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Output |
| --- | --- | --- | --- | --- |
| ACH-DP-047 | `data-achievements.md` backfill | 161 official rows | Add Town Hall row id/category, exact UI text, reward link, trigger proof, popup timing, and source resolution for every row | Achievement data update |
| ACH-DP-048 | `achievement-gap-map.md` backfill | 0 exact parity for all rows | Update current gap, required proof, implementation surface, and acceptance condition for every resolved row | Gap-map update |
| ACH-DP-049 | Cross-domain data backfill | Cards/gems/characters/stages/enemies/events/town/relics/arcana | For every achievement that proves or contradicts domain data, update the corresponding domain matrix/data/gap files | Domain consistency |
| ACH-DP-050 | `source-conflicts.md` backfill | Existing conflicts plus newly discovered achievement wording conflicts | Close or preserve conflicts where Town Hall/achievement UI resolves counts, names, routes, or reward labels | Conflict update |
| ACH-DP-051 | `gap-map.md` and checklist backfill | Global research state | Update only after row-level files are stable; do not use aggregate success to bypass unresolved row packets | Global status update |
| ACH-DP-052 | Prototype implementation mapping | Current implementation parity is 0 | Map confirmed rows to implementation targets and tests only after direct proof resolves behavior | Implementation queue |
| ACH-DP-053 | Test acceptance table | All confirmed rows | Define test target for unlock trigger, popup, reward surface, persistence, and duplicate/no-op behavior | Test plan |
| ACH-DP-054 | Residual-risk list | Any unresolved rows | List blocked rows, reason, required capture, and whether the blocker is direct play, game files, UI text, or platform sync | Handoff risk list |
| ACH-DP-055 | Stop condition audit | All 161 rows | Verify no metadata-only row is marked implemented, complete, or original-parity | Handoff safety gate |

## Row Groups That Must Stay Separate

| Group | Current Source-Level Boundary | Do Not Collapse Until |
| --- | --- | --- |
| Steam platform achievements | 161 E5 metadata rows from Steam Community | Town Hall/game UI or files prove in-game row mapping and trigger behavior |
| Town Hall checklist rows | Unknown count/order/categories | Direct UI or game files expose row list, filters, categories, and hidden/grouped rows |
| Unlock popup | In-game popup and Steam popup may differ | Direct capture proves timing, text, and persistence |
| Reward rows | Card/gem/character/stage/relic/arcana/etc. | The corresponding domain matrix proves the actual reward surface and runtime behavior |
| Counter rows | Public descriptions use vague words like `lots`, `many`, `high` | UI tracker or files prove exact numeric threshold |
| Platform-only rows | Steam achievements may not all mirror Town Hall | Search/filter/files prove absence or hidden status |
| Demo/full migration | Demo app `4329470`, full app `3265700`, save-slot and Steam Cloud claims | Direct platform audit proves grant timing and migration behavior |

## Backfill Targets

When a packet resolves a row, update in this order:

1. This matrix and/or [`direct-play-verification.md`](./direct-play-verification.md) DP-207.
2. [`data-achievements.md`](./data-achievements.md).
3. [`achievement-gap-map.md`](./achievement-gap-map.md).
4. The relevant domain data, gap, taxonomy, and direct-capture matrix files.
5. [`source-conflicts.md`](./source-conflicts.md) when a conflict closes or remains explicitly unresolved.
6. [`gap-map.md`](./gap-map.md), [`RESEARCH_CHECKLIST.md`](../RESEARCH_CHECKLIST.md), and [`HANDOFF.md`](../HANDOFF.md) only after row-level achievement/domain files are stable.

## Stop Conditions

- Do not mark achievement research complete from Steam metadata, global percentages, or this matrix alone.
- Do not assume every Steam achievement appears in Town Hall until UI/game files prove membership.
- Do not infer exact numeric thresholds from vague public descriptions such as `lots`, `many`, or `high`.
- Do not treat a platform popup as proof of reward behavior unless the in-game reward surface is also captured.
- Do not treat a Town Hall completed row as proof of runtime behavior unless the trigger and resulting content are captured.
- Keep current implementation parity at `0` until direct-play or game-file proof closes row-level achievement acceptance conditions.
