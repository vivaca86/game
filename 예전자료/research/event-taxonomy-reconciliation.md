# Event / Encounter Taxonomy Reconciliation

Status: `generated 2026-05-22 / source-level event taxonomy reconciliation`

This artifact reconciles the collected event/storyboard candidates, the 10 official-wiki dungeon-event pages, official Store media event screens, and the current prototype event pool. It does not prove shipped event UI, current-build option text, exact costs, rewards, invalid states, repeat rules, persistence, or implementation parity. Treat it as a capture queue for high-resolution gameplay, direct play, and game-file proof.

Primary inputs:

- `research/data-events.md`
- `research/event-gap-map.md`
- `research/flow-videos.md`
- `research/steam-store-appdetails-crawl.md`
- `research/steam-store-movie-frame-crawl.md`
- `research/official-wiki-enemy-event-powerup-field-crawl.md`
- `research/official-wiki-enemy-event-powerup-value-extract.md`
- `research/card-taxonomy-reconciliation.md`
- `research/gem-taxonomy-reconciliation.md`
- `research/powerup-taxonomy-reconciliation.md`
- `research/arcana-taxonomy-reconciliation.md`
- `research/relic-taxonomy-reconciliation.md`
- `research/source-conflicts.md` CON-021, CON-022, CON-037, CON-039, and CON-045
- Sources: SRC-004, SRC-142, SRC-145, SRC-148, VID-004, VID-005, VID-006, VID-007, VID-008, VID-009, VID-010, and VID-012

## Reconciliation Snapshot

| Segment | Rows / Count | Notes |
| --- | ---: | --- |
| Collected event / encounter candidates | 11 | 10 classified rows plus `EVT-TBD` in `event-gap-map.md` |
| Official-wiki dungeon-event pages | 10 | Abandoned cart, Bat Goblin, Card stat offering table, Duplicate offering table, Evolution statue, Floor chicken offering table, Light source, Mana offering table, Mana statue, Treasure chest |
| Official-wiki event pages with actionable mechanics | 4 | Abandoned cart, Card stat offering table, Duplicate offering table, and Evolution statue expose source-level behavior beyond a label |
| Official-wiki label-only or sparse event pages | 6 | Bat Goblin, Floor chicken offering table, Light source, Mana offering table, Mana statue, and Treasure chest still need UI/game-file behavior |
| Official-wiki event pages with cash-out value | 2 | Card stat offering table and Evolution statue both expose a 200 coin/gold skip/cash-out value at source level |
| Official Store media event/station candidates | 4 | Store screenshots/movie frames expose HP offering, Mana offering, duplicate-card, and gem-choice/station surfaces |
| Storyboard video event/station candidates | 10+ | Low-resolution E3 rows show locked, shop, sacrifice, machine, gem insertion, duplicate, arcade/BING, recruit, permanent-stat, and no-valid-card candidates |
| Current prototype event rows | 13 | Local event pool and reward handlers are thematic/prototype-only |
| Current implementation parity closed by this file | 0 | Direct UI, game files, or runtime proof still required |

## Working Interpretation

The event data should be split into evidence layers:

- Official-wiki event page layer: 10 page names establish a source-level catalog queue, not complete behavior.
- Actionable wiki mechanic layer: four pages expose source-level event behavior and some values, but still lack shipped UI state and runtime edge cases.
- Official media layer: Store screenshots/movie frames prove visible screen text only where readable. Store media can include staged or development-build material.
- Storyboard route layer: VID rows prove that similar surfaces appear in runs, but low-resolution frames do not settle labels, numbers, or outcomes.
- Cross-system layer: events overlap card sacrifice, card duplication, evolution gems, Power-Ups, mana, Hand, HP, light-source cards, chests, and relic/Arcana flow.
- Prototype layer: current local events and stations remain placeholders until one-to-one event names, options, costs, rewards, invalid states, and persistence are proven.

Do not implement the final event catalog from any single layer. Each confirmed event needs exact room/object name, visible option text, option cost, reward, penalty/failure text, repeat behavior, and post-event state.

## Official-Wiki Event Page Reconciliation

| Official-Wiki Page | Source-Level Behavior Preserved | Source-Level Values / Links | Direct-Proof Need |
| --- | --- | --- | --- |
| Abandoned cart | Cart can be destroyed, then collected as a bracer-like pickup that grants +1 Hand for the run | Links to Bracer and Hand; gallery exposes damaged/debris sprite states | Exact room placement, hit/destroy rules, pickup UI, duration display, stack behavior, and persistence reset |
| Bat Goblin | Dungeon-event page exists with gallery sprite only | No common event infobox and no option/cost/reward fields | Object behavior, reward/penalty, combat or NPC classification, and stage/floor placement |
| Card stat offering table / Bing Upgrades Vending Machine | Opens a menu containing stat-boost cards from the deck; selecting a card destroys it and grants a corresponding run-duration buff | Cash out / skip value 200 coins; upgrade list exposes Armor +1, Golden Armor +2, Rainbow Armor +3 | Exact UI title, eligible card list, hover tooltip, accepted cards, destroyed-card deck mutation, buff duration, invalid/no-card state, cash-out text, and repeat rule |
| Duplicate offering table | Mirror-like event that duplicates an existing card | Links to Cards; no cost/limit fields exposed | Exact UI title, cost/resource, valid targets, duplicate limit, cancel behavior, no-valid-card state, resulting card metadata, and repeat rule |
| Evolution statue | Revealed by repeated collision/interactions; then opens a chest-like menu with up to three weapon evolution choices and requires a sacrifice step | Evolution gem insertion; backing out of sacrifice does not consume the statue; no valid pair falls back to random card choices; cash out 200 gold | Reveal interaction count, exact UI labels, valid evolution-pair rules, sacrifice target rules, card/gem/socket mutation, fallback card list, cash-out wording, and persistence |
| Floor chicken offering table | Dungeon-event page exists by name only | No common event infobox and no option/cost/reward fields | Whether it heals, consumes a card/resource, scales with HP, can be skipped, and persists |
| Light source | Dungeon-event page exists by name only and is marked as an external/shared-series concept | Related to light-source card pickups in Arcana unlock claims, but no Crawlers option fields are exposed | Exact object behavior, card pickup rules, light-source card category, Wild Buff tracking count, reward pool, and stage/floor placement |
| Mana offering table | Dungeon-event page exists by name only | Store movie separately shows a spend-card-to-Mana screen candidate | Exact UI label, card eligibility, mana amount, temporary vs persistent scope, cancel/no-valid state, and repeat rule |
| Mana statue | Dungeon-event page exists by name only | No common event infobox and no option/cost/reward fields | Statue behavior, Mana vs Cooldown naming boundary, stat or resource gain, cost, invalid state, and repeat rule |
| Treasure chest | Dungeon-event page exists by name only and is marked as an external/shared-series concept | Links to Treasure Chest, but no Crawlers option/cost/reward fields are exposed | Chest reward table, evolution chance, gem/card/relic reward split, reroll/skip behavior, animation timing, and stage/boss linkage |

## Candidate Mapping Against Existing Event Rows

| Current Candidate | Strongest Source-Layer Match | Current Treatment |
| --- | --- | --- |
| EVT-001 locked interaction | Storyboard-only | Keep separate until the locked object text and satisfied-state outcome are readable |
| EVT-002 shop/event purchase | Storyboard-only | May be event, shop, or recruit surface; no official-wiki page match yet |
| EVT-003 color-lock / card-sacrifice gate | Evolution statue or sacrifice-screen family, but not proven | Keep as sacrifice/gate candidate until exact UI names and valid-card rules are captured |
| EVT-004 Experimental Machine | Possible Card stat offering table / Bing Upgrades Vending Machine family | Treat as likely related only; machine panel text and stat-card behavior must confirm it |
| EVT-005 Insert Gem into a Card station | Evolution statue / evolution gem layer plus non-event gem station layer | Split normal gem insertion, evolution gem insertion, and socket replacement/cancel before implementation |
| EVT-006 Duplicate-card station | Official-wiki Duplicate offering table plus Store screenshot `SS-09` | Direct source-level match by behavior, but cost, target rules, and development-build caveat remain open |
| EVT-007 BING / arcade cabinet | Possible Card stat offering table / Bing Upgrades Vending Machine family | Strong naming clue, but exact UI and reward still need high-resolution proof |
| EVT-008 recruit / activate-crawler event | Storyboard-only | Keep separate from Inn purchase and Crawler Slot until cost, target, and persistence are proven |
| EVT-009 permanent-stat card sacrifice | Possible Card stat offering table conflict | Wiki says run-duration buff for stat cards; storyboard text suggests permanent stat boost, so do not merge yet |
| EVT-010 no-valid-cards exception | Storyboard-only, possibly sacrifice/evolution/stat-card family | Needs matching valid-state capture to identify the event |
| EVT-011 Mana offering table | Official-wiki Mana offering table plus Store movie `SM-257250926` `00:35` | Page name and visible Store header align, but mana amount, card consumption, invalid state, and repeat rule remain open |
| EVT-TBD original event set | 10 official-wiki pages plus video/media candidates | Full event catalog and weights remain unknown |

## Cross-System Conflict Queue

| Conflict / Boundary | Rows | Current Treatment |
| --- | --- | --- |
| Wiki event page names vs visible UI titles | All 10 official-wiki event pages | Page names are source-level row labels; use UI/game files before final display text |
| Card stat table run-duration buff vs permanent-stat sacrifice footage | Card stat offering table, EVT-009, VID-012 | Keep the wiki stat-card event and storyboard permanent-stat event separate until UI text proves same or different events |
| Evolution statue vs generic gem insertion | Evolution statue, EVT-005, gem station rows | Separate evolution-gem insertion from normal card/gem socketing and chest/level-up evolutions |
| Duplicate offering table vs duplicate reward screen | Duplicate offering table, SS-09, EVT-006 | Behavior aligns by label, but Store `Development Build` caveat and target/cost rules stay unresolved |
| Mana offering table vs Mana/Cooldown Power-Up | Mana offering table, Mana statue, Power-Up Mana/Cooldown | Keep run event resource gain separate from permanent Power-Up label until UI/files prove naming |
| Light source event vs Arcana unlock counter | Light source, Wild Buff | Treat light-source card pickup as a capture queue for Arcana tracking; do not infer count or reward pool from the page name |
| Chest as event page vs reward/result class | Treasure chest, evolution, relic, gem, boss rewards | Keep chest room, boss chest, level-up reward, relic reward, and evolution choices separate until capture proves the taxonomy |

## Direct Proof Queue

- Capture every official-wiki event page in-game or in game files: room/object name, visible title, options, cost, reward, penalty, invalid state, repeat rule, and post-event state.
- For Abandoned cart, record pre-hit, damage states, destroyed state, pickup prompt, +1 Hand display, stack behavior, and run-end reset.
- For Card stat offering table / Bing Upgrades Vending Machine, capture eligible stat cards, hover buffs, selected card destruction, cash-out, no-valid-card state, and whether the buff is run-only or persistent.
- For Duplicate offering table, capture at least one successful duplicate, cancel, no-valid-card state, duplicate limit, resulting card cost/gems/modifiers, and whether reroll/skip counters apply.
- For Evolution statue, capture reveal interactions, evolution-choice list, sacrifice-screen entry/backout, no-valid-pair fallback, cash-out, successful deck mutation, and whether the statue remains after cancel.
- For Floor chicken offering table, Light source, Mana offering table, Mana statue, Bat Goblin, and Treasure chest, capture the full interaction because current official-wiki pages are label-only.
- Cross-check Store media rows `SS-05`, `SS-09`, and `SM-257250926 00:35` against current-build UI or game files before finalizing HP/Mana/duplicate event text.
- Map every VID storyboard candidate to either an official-wiki event row, a non-event interaction class, or an unresolved standalone event row.
- Keep current implementation parity at `0` until each confirmed event has a testable acceptance condition.
