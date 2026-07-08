# Event Direct Capture Matrix

Status: `generated 2026-05-22 / direct-proof execution matrix / blocked until app 3265700 or game files are available`

Related files:

- [`direct-play-verification.md`](./direct-play-verification.md) DP-106 and DP-201 to DP-208
- [`remaining-proof-queue.md`](./remaining-proof-queue.md)
- [`data-events.md`](./data-events.md)
- [`event-gap-map.md`](./event-gap-map.md)
- [`event-taxonomy-reconciliation.md`](./event-taxonomy-reconciliation.md)
- [`official-wiki-enemy-event-powerup-field-crawl.md`](./official-wiki-enemy-event-powerup-field-crawl.md)
- [`official-wiki-enemy-event-powerup-value-extract.md`](./official-wiki-enemy-event-powerup-value-extract.md)
- [`steam-store-movie-frame-crawl.md`](./steam-store-movie-frame-crawl.md)
- [`card-direct-capture-matrix.md`](./card-direct-capture-matrix.md)
- [`gem-direct-capture-matrix.md`](./gem-direct-capture-matrix.md)
- [`town-powerup-relic-arcana-direct-capture-matrix.md`](./town-powerup-relic-arcana-direct-capture-matrix.md)
- [`source-conflicts.md`](./source-conflicts.md) CON-021, CON-022, CON-037, CON-039, CON-045

This matrix turns the source-level event taxonomy into direct-play, high-resolution video, and game-file capture packets. It is not proof by itself. Event implementation remains closed until each accepted row has shipped room/object identity, visible option text, exact cost, reward, invalid state, repeat rule, runtime consequence, persistence, and a row-level acceptance condition.

## Capture Packet Standard

Every event packet must include these fields before it can close a row:

| Field | Requirement |
| --- | --- |
| Build baseline | App `3265700`, build id/version, platform, language, timestamp, save slot, route, stage, floor, and character/party state |
| Source layer | Official-wiki event page, Store media frame, storyboard video row, guide/source row, or game-file row |
| Room/object proof | Stage/floor placement, room entry, object sprite/model, minimap/route marker if visible, prompt trigger, and repeat appearance state |
| UI proof | Exact title/header, option labels, button states, hover text, selected target, confirm/cancel flow, and no-target state |
| Cost proof | Coin/gold, HP, card sacrifice, gem, mana, soul/currency, duplicate target, evolution pair, or no-cost state |
| Outcome proof | Reward, deck mutation, card destruction, card duplication, stat buff, mana gain, heal, chest, relic, Power-Up, Arcana, enemy/combat result, or no-op |
| Invalid-state proof | Insufficient resource, no valid cards, wrong card color/type, missing gem/evolution pair, cancel/backout, and post-cancel object state |
| Repeat proof | Same room repeat, later floor repeat, same-run once-only, route-gated, persistent unlock, or run-reset behavior |
| Runtime proof | Immediate and next-combat/run consequence, not only menu text |
| Source resolution | Confirmed, contradicted, unresolved, version difference, event, station, chest/reward class, NPC/shop, internal-only, hidden, or excluded |
| Implementation output | Exact row data and testable acceptance condition; do not implement from partial packets |

## Priority Order

| Priority | Packet IDs | Reason |
| --- | --- | --- |
| P0 | EVT-DP-001 to EVT-DP-006 | Establish catalog boundary and event-vs-station classification first. |
| P1 | EVT-DP-007 to EVT-DP-014 | Capture the four official-wiki actionable mechanics and their values. |
| P2 | EVT-DP-015 to EVT-DP-026 | Capture the six sparse official-wiki event pages and reward/object classes. |
| P3 | EVT-DP-027 to EVT-DP-039 | Reconcile storyboard and Store media event/station candidates. |
| P4 | EVT-DP-040 to EVT-DP-048 | Resolve cross-system effects, persistence, and implementation acceptance. |

## P0 Catalog / Boundary Capture

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| EVT-DP-001 | Full event catalog boundary | 10 official-wiki dungeon-event pages, 11 collected candidates plus `EVT-TBD`, unknown runtime catalog | Capture every event/station/reward room encountered across several stages and compare against source rows | CON-037, EVT-TBD |
| EVT-DP-002 | Event vs station vs reward class | Wiki pages, Store media, storyboard candidates | Classify each row as event room, object station, chest/reward result, light-source object, NPC/shop, combat encounter, or non-event | Event taxonomy boundary |
| EVT-DP-003 | Game-file event table | No common event infobox in wiki crawl | If files are available, extract event ids, display names, option tables, costs, weights, stages, floors, flags, localization keys, and reward handlers | Final event source map |
| EVT-DP-004 | Repeatable capture format | All event rows | For each capture, record pre-room state, prompt, options, selected branch, result, post-room state, next room/combat, and save/reload behavior | Row evidence standard |
| EVT-DP-005 | Store media reconciliation | `SS-05`, `SS-09`, `SM-257250926 00:35`, other Store event candidates | Re-capture same or equivalent surfaces in current build or files; mark Store-only/development-build material where contradicted | Official media boundary |
| EVT-DP-006 | Storyboard candidate mapping | VID-004 to VID-012 event/station rows | Map every storyboard event candidate to an official-wiki page, Store media row, non-event class, or unresolved standalone row | Storyboard-to-row map |

## P1 Official-Wiki Actionable Mechanics

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| EVT-DP-007 | Abandoned cart trigger | Official-wiki Abandoned cart page | Capture intact cart, hit/damage states, destroyed/debris state, pickup prompt, collection, and whether it occupies a room/event slot | Abandoned cart row proof |
| EVT-DP-008 | Abandoned cart +1 Hand effect | Bracer/Hand link, +1 Hand run-duration source-level mechanic | Capture stat display before/after pickup, card-hand/Hand behavior, stacking with Power-Up Hand, and run-end reset | CON-039 boundary where relevant |
| EVT-DP-009 | Card stat offering table title and options | Official-wiki Card stat offering table / Bing Upgrades Vending Machine | Capture exact title/header, stat-card list, hover text, selectable/unselectable cards, cash-out/leave buttons, and no-valid-card state | CON-045 |
| EVT-DP-010 | Card stat offering selected-card result | Wiki says selected stat card is destroyed and grants run-duration buff | Capture deck before/after, destroyed-card evidence, stat delta, buff duration, next-combat impact, and run-end reset | CON-045 |
| EVT-DP-011 | Card stat offering 200 coin cash-out | Wiki cash-out/skip value 200 coins | Capture cash-out label, coin before/after, whether event object persists, repeat rule, and cancel/backout state | 200-coin value proof |
| EVT-DP-012 | Duplicate offering table | Official-wiki Duplicate offering table, Store screenshot duplicate candidate, VID duplicate candidates | Capture exact title, cost/resource, target list, successful duplicate, card metadata after duplication, cancel, no-valid-card state, duplicate limit, and repeat rule | EVT-006 |
| EVT-DP-013 | Evolution statue reveal and menu | Official-wiki Evolution statue | Capture hidden/revealed statue state, interaction count/collision trigger, chest-like menu, evolution choices, and no-valid-pair fallback | CON-021, CON-022 |
| EVT-DP-014 | Evolution statue sacrifice/backout/cash-out | Wiki sacrifice, backout does not consume statue, random-card fallback, 200 gold cash-out | Capture sacrifice screen, valid/invalid ingredient pairs, backout state, successful deck mutation, socket/gem interaction, cash-out, and statue persistence | CON-021, CON-022 |

## P2 Sparse Official-Wiki Event Pages

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| EVT-DP-015 | Bat Goblin | Official-wiki page exists with gallery sprite only | Capture object/enemy/NPC classification, room placement, dialogue/options if any, combat/reward result, and repeat behavior | Sparse page resolution |
| EVT-DP-016 | Floor chicken offering table | Official-wiki label-only page | Capture whether it heals, costs HP/coins/cards, scales with max HP, has leave/cancel/no-valid states, and persists or repeats | Heal event proof |
| EVT-DP-017 | Light source object class | Official-wiki label-only/external concept page | Capture breakable object behavior, reward pool, card pickup naming, stage/floor placement, and whether it counts as an event room | Light-source proof |
| EVT-DP-018 | Light source Arcana tracker link | Wild Buff uses light-source card count | Capture tracker before/after light-source card pickups and whether Wild Buff uses 200, 250, or another count | CON-044 via Arcana matrix |
| EVT-DP-019 | Mana offering table UI | Official-wiki page plus Store movie `Spend a card to gain Mana.` | Capture exact header/options, selectable card grid, leave/cancel, mana amount, consumed-card result, no-valid-card state, and repeat rule | EVT-011 |
| EVT-DP-020 | Mana offering runtime scope | Mana event vs permanent Mana/Cooldown Power-Up | Capture temporary/current-turn mana, carryover/reset, deck before/after, and Power-Up label separation | CON-039 |
| EVT-DP-021 | Mana statue | Official-wiki label-only page | Capture statue title, cost, reward, resource/stat affected, option text, invalid state, repeat rule, and relation to Mana offering table | Sparse page resolution |
| EVT-DP-022 | Treasure chest class split | Official-wiki label-only/external concept page | Capture normal chest, boss chest, room chest, event chest, reward chest, and whether each has distinct UI/options | Chest taxonomy |
| EVT-DP-023 | Treasure chest reward table | Chest, evolution, relic, gem, card, coin rewards | Capture reward pool samples, reroll/skip if present, animation timing, item rarity/weights, and boss/stage linkage | Reward behavior proof |
| EVT-DP-024 | Treasure chest evolution path | Evolution statue and chest-like menu overlap | Capture whether chests can trigger evolutions separately from Evolution statue, and deck/gem requirements | CON-021 |
| EVT-DP-025 | Sparse page game-file backfill | Six sparse official-wiki pages | Extract or capture option/reward tables from files or direct UI; mark label-only pages as non-event if no runtime surface exists | Sparse page acceptance |
| EVT-DP-026 | Official-wiki page-name display audit | All 10 official-wiki event pages | Compare page names to shipped UI titles and localization keys; preserve aliases until UI/files settle display text | Name normalization |

## P3 Storyboard / Store Media Candidate Resolution

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| EVT-DP-027 | Locked interaction / unmet-condition dialog | EVT-001, VID-004 | Capture locked and satisfied states, exact text, required resource/condition, result, and whether it maps to a wiki page | EVT-001 |
| EVT-DP-028 | Shop/event purchase candidate | EVT-002, VID-004 | Capture title, buy/leave text, item list, costs, insufficient currency, accept/decline results, and shop-vs-event classification | EVT-002 |
| EVT-DP-029 | Color-lock / sacrifice gate | EVT-003, VID-006, VID-010 | Capture card-color/type requirements, valid/invalid examples, sacrificed card, reward/unlock, failure text, and repeat rule | EVT-003 |
| EVT-DP-030 | Experimental Machine | EVT-004, VID-008 | Capture machine title, input requirements, options, cost, result table, skip/leave behavior, and whether it is the Card stat table/BING row | EVT-004, EVT-007 |
| EVT-DP-031 | BING / arcade cabinet | EVT-007, VID-007, VID-009 | Capture object label, cost/input, reward/penalty, repeat, and relation to Card stat offering / Bing Upgrades Vending Machine | EVT-007 |
| EVT-DP-032 | Normal Insert Gem into a Card station | EVT-005, repeated VID station candidates | Capture station title, valid cards, gem list, socket slots, replacement/cancel, no-valid-card state, resulting card state, and cost | EVT-005, CON-026 |
| EVT-DP-033 | Evolution-gem vs normal socket boundary | EVT-005 plus Evolution statue | Capture whether evolution gems use the same station, a separate statue/chest menu, or a separate event class | CON-021, gem matrix link |
| EVT-DP-034 | Recruit / activate-Crawler event | EVT-008, VID-005, VID-010 | Capture exact title, target Crawler, cost/currency, accept/decline, party/Inn/Town Hall persistence, and whether it is separate from Inn recruitment | EVT-008 |
| EVT-DP-035 | Permanent-stat sacrifice candidate | EVT-009, VID-012 | Capture exact wording, selected card, stat delta, save/reload and next-run persistence, and relation to wiki run-duration stat table | CON-045 |
| EVT-DP-036 | No-valid-cards exception | EVT-010, VID-005 | Capture the same station with no valid cards and with valid cards; record required card type/count and retry behavior | EVT-010 |
| EVT-DP-037 | Store Mana offering candidate | SRC-145 `SM-257250926 00:35` | Reproduce or file-verify `Spend a card to gain Mana.`, the visible card grid, Leave button, selected-card result, and mana amount | EVT-011 |
| EVT-DP-038 | Store duplicate/HP/gem-choice candidates | Store screenshots/movie frames | Reproduce or file-verify duplicate-card, HP offering, and gem-choice/station surfaces; classify Store-only/development surfaces if absent | Store media audit |
| EVT-DP-039 | Storyboard contamination and readability audit | VID-004 to VID-012 | Mark unreadable, contaminated, non-Crawlers, marketing, or rejected frames before using any event claim | Evidence hygiene |

## P4 Cross-System Effects And Acceptance

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Output |
| --- | --- | --- | --- | --- |
| EVT-DP-040 | Deck mutation tracking | Card stat, duplicate, sacrifice, evolution, mana offering, gem insertion | Capture deck/card state before/after, card costs/colors/gems, destroyed/duplicated/evolved rows, and persistence | Card data backfill |
| EVT-DP-041 | Gem/socket interaction tracking | Gem insertion, evolution statue, Blacksmith/Jeweller rows | Capture valid targets, socket limits, replacement/cancel, gem consumption, evolution blocking, and town-building dependencies | Gem and town backfill |
| EVT-DP-042 | Resource economy tracking | Coin/gold, HP, mana, souls/currency, cards, gems | Capture every resource before/after event choice and after save/reload; identify run-only vs persistent resource changes | Economy acceptance |
| EVT-DP-043 | Invalid/cancel/no-op matrix | All events | For each confirmed event, capture cancel, insufficient resource, no valid target, invalid target, and backout behavior | Edge-case acceptance |
| EVT-DP-044 | Repeat and weight sampling | All repeatable candidates | Record repeated encounters across stages/floors/runs, once-per-run flags, stage gates, and whether events disappear after use | Spawn/repeat map |
| EVT-DP-045 | Stage/floor placement | All event rows | Map events to Tutorial/Mad Forest/Inlaid Library/etc. route rows, floor counts, stage variants, and unlock gates | Stage cross-link |
| EVT-DP-046 | Reward cross-links | Cards, gems, relics, Power-Ups, Arcana, chests, enemies | Link event outcomes to existing catalog matrices and mark rows that need backfill in multiple domains | Cross-domain queue |
| EVT-DP-047 | Data and conflict backfill | `data-events.md`, `event-gap-map.md`, taxonomy, source conflicts | Update rows as confirmed/contradicted/unresolved; close or preserve CON-021, CON-022, CON-039, CON-045 where appropriate | Research backfill |
| EVT-DP-048 | Implementation acceptance rows | All confirmed events | For each accepted event, write exact display text, options, costs, outcomes, edge cases, persistence, and test target | Event implementation gate |

## Row Groups That Must Stay Separate

| Group | Current Source-Level Boundary | Do Not Collapse Until |
| --- | --- | --- |
| Official-wiki page names | 10 event category pages, no common event infobox | UI/game files prove display names and behavior |
| Actionable wiki mechanics | Abandoned cart, Card stat offering table, Duplicate offering table, Evolution statue | Direct UI/files prove exact options, values, invalid states, repeat rules, and runtime consequences |
| Sparse wiki pages | Bat Goblin, Floor chicken offering table, Light source, Mana offering table, Mana statue, Treasure chest | Direct UI/files prove whether each is an event, station, object, enemy, reward class, or label-only page |
| Store media candidates | Mana offering, duplicate-card, HP offering, gem-choice/station surfaces | Current-build UI or files confirm the same surface and values |
| Storyboard candidates | EVT-001 to EVT-011 from low-resolution video rows | High-resolution capture or files settle labels, costs, and outcomes |
| Card stat vs permanent-stat sacrifice | Wiki run-duration buff vs storyboard permanent-stat screen | UI/runtime/save proof shows same event or separate events |
| Evolution statue vs gem station | Evolution-gem sacrifice/fallback vs normal gem socket insertion | UI/files prove shared or separate interaction classes |
| Mana event vs Mana/Cooldown Power-Up | Spend-card-to-mana event vs permanent Power-Up naming conflict | UI/files prove displayed labels, resource scope, and persistence |
| Chest page vs reward class | Treasure chest room/page vs boss chest/reward/evolution chest | Runtime/files prove taxonomy and reward tables |

## Backfill Targets

When a packet resolves a row, update in this order:

1. This matrix and/or [`direct-play-verification.md`](./direct-play-verification.md) DP-106.
2. [`data-events.md`](./data-events.md).
3. [`event-gap-map.md`](./event-gap-map.md).
4. [`event-taxonomy-reconciliation.md`](./event-taxonomy-reconciliation.md).
5. Cross-domain files for any card, gem, Power-Up, relic, Arcana, stage, town, or achievement row affected by the event.
6. [`source-conflicts.md`](./source-conflicts.md) when a conflict closes or remains explicitly unresolved.
7. [`gap-map.md`](./gap-map.md), [`RESEARCH_CHECKLIST.md`](../RESEARCH_CHECKLIST.md), and [`HANDOFF.md`](../HANDOFF.md) only after row-level files are stable.

## Stop Conditions

- Do not mark the event catalog complete from wiki page names, Store media, storyboard frames, or this matrix alone.
- Do not treat all 10 official-wiki event pages as normal event rooms until UI/game files classify them.
- Do not merge Card stat offering table with the permanent-stat sacrifice candidate until duration and save persistence are proven.
- Do not merge Evolution statue with normal gem insertion until UI/files prove the shared or separate flow.
- Do not resolve Mana offering table vs Mana/Cooldown Power-Up from source labels alone.
- Do not implement chest rewards, duplicate rules, sacrifice rules, no-valid-card behavior, or repeat/weight rules from partial frames.
- Keep current implementation parity at `0` until direct-play or game-file proof closes row-level event acceptance conditions.
