# Arcana Data

Status: `official metadata collected / Dexerto unlock-table crawl / official wiki value extract / arcana taxonomy reconciliation / cross-source secondary effect mapping / direct UI needed`

Dexerto and Steam achievements provide 10 public arcana unlock rows. The generated Dexerto crawl confirms a single 10-row unlock table and no `Experimental Medicine` / `Shield Bash` rows on that page. GAMES.GG and NeonLightsMedia independently describe 12 total arcanas by adding those two automatic/default cards, and the official wiki API crawl now exposes 12 arcana infobox rows including both Polentir-unlocked rows. `research/arcana-taxonomy-reconciliation.md` now maps all 10 public rows to official-wiki rows by normalized name, keeps `Experimental Medicine` and `Shield Bash` as the two official-wiki rows outside the public table, and adds the `Wild Buff` 200-vs-250 light-source-card count conflict. This is a stronger source-level resolution of the 10/12 conflict, not final proof: Fortune Teller UI, exact in-game text, start-of-run selection, and runtime effects still need high-resolution video, direct play, or game files.

Current implementation gap map: [`arcana-gap-map.md`](./arcana-gap-map.md).
Generated arcana taxonomy reconciliation: [`arcana-taxonomy-reconciliation.md`](./arcana-taxonomy-reconciliation.md).
Generated official wiki arcana/relic/dungeon field crawl: [`official-wiki-arcana-relic-dungeon-field-crawl.md`](./official-wiki-arcana-relic-dungeon-field-crawl.md).
Generated official wiki arcana/relic/dungeon value extract: [`official-wiki-arcana-relic-dungeon-value-extract.md`](./official-wiki-arcana-relic-dungeon-value-extract.md).
Generated Steam Store movie frame crawl: [`steam-store-movie-frame-crawl.md`](./steam-store-movie-frame-crawl.md).

## Source Basis

| Source ID | Source | Used For | Current Grade |
| --- | --- | --- | --- |
| SRC-006 | Steam Community achievements page | 10 public arcana achievement names/descriptions | E5 metadata |
| SRC-106 | Dexerto arcana unlock list | 10 unlock-task rows | E1 |
| SRC-132 | Dexerto arcana unlock table crawl | Generated 10-row `Item` / `How to Get` extraction and page-boundary note | E1 |
| SRC-111 | GAMES.GG arcana guide | 12-total claim, two automatic arcana claim, Fortune Teller/Polentir context, selected effect hints | E1 |
| SRC-206 | NeonLightsMedia arcana guide | 12 arcana names, effect summaries, unlock requirements, two automatic arcana names | E1 |
| SRC-202 | PC Gamer upgrade guide | Fortune Teller/Polentir flow, Over The Top and Your Shield My Liege effect anecdotes | E1 |
| SRC-136 | PC Gamer upgrade priority crawl | Generated Fortune Teller/Polentir, Over The Top top-of-deck, and Your Shield My Liege armor-persistence hints | E1 |
| SRC-108-R | GAMES.GG relic guide | Fortune Teller/Polentir and Arcana Finder context | E1 |
| SRC-141 | Poncle official release FAQ crawl | Official-account broad `12 arcana` shorthand supporting the total-set boundary only | E5 developer statement via social FAQ |
| SRC-142 | Official wiki API crawl | 12 arcana infobox rows, including `Experimental Medicine` and `Shield Bash` as Polentir-unlocked rows | E5 official wiki / not direct play |
| SRC-147 | Official wiki arcana/relic/dungeon value extract | 12 arcana rows with row-level official-wiki unlock fields, text/description presence, and keyword buckets without full effect prose | E5 official wiki structured values / not direct play |
| SRC-145 | Steam Store movie / frame crawl | Official Store movie frame `SM-257250926` `00:30` captures an Arcana/Fortune Teller-like selection room with readable `Mana Syphon`, `Over The Top`, `Wild Buff`, `Your Shield My Liege`, `Equip`, and `Confirm` candidates | E5 official Store media for visible UI candidates only |
| derived | Arcana taxonomy reconciliation | 10 public rows vs 12 official-wiki rows, 10 normalized public-to-wiki matches, 2 Polentir rows outside the public table, and Wild Buff / And Another / Over The Top conflict queues | Source-level reconciliation |

## Coverage Counter

| Segment | Known Total | Rows Collected | E2+ | E3+ | E4/E5 | Conflict / Missing |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Arcana unlock entries | 10 | 10 | 10 metadata + 10 Dexerto crawl rows | 0 | 10 metadata | Exact in-game effect text and UI still missing |
| Total arcana set | 12 | 12 named | 12 secondary + 12 official-wiki rows + value extract + arcana taxonomy reconciliation | 0 | 10 metadata + 12 official-wiki rows | Working source-level resolution: Dexerto crawl supports 10 public unlocks while secondary sources and the official wiki add 2 Polentir/default arcanas; `arcana-taxonomy-reconciliation.md` maps all 10 public rows to wiki rows and keeps the two extra rows blocked on Fortune Teller UI |
| Start-of-run UI evidence | 미확정 | 0 direct | 0 | 0 | 0 | Secondary sources say one Arcana can be equipped at Fortune Teller; needs video/direct play |
| Effect mapping | 12 required | 12 secondary hints | 12 secondary | 0 | 0 | Effects are guide-derived, not exact game text |

Official wiki note: `research/official-wiki-api-crawl.md` preserves the 12-name set as `And Another`, `Chain Link`, `Experimental Medicine`, `Jester's Hat`, `Make a Scene`, `Mana Syphon`, `Over The Top`, `Sharp Mind`, `Shield Bash`, `Swollen Fist`, `Wild Buff`, and `Your Shield My Liege`. `research/official-wiki-arcana-relic-dungeon-field-crawl.md` confirms all 12 official-wiki arcana rows have both `text` and `unlocked by` fields, with `Experimental Medicine` and `Shield Bash` marked as Polentir-unlocked rows. `research/official-wiki-arcana-relic-dungeon-value-extract.md` adds the row-level unlock fields and keyword buckets, including official-wiki support for the `And Another` 150 Free-to-Play side, the Polentir-unlocked status of the two non-Steam/Dexerto rows, and a `Wild Buff` 250 light-source-card threshold that conflicts with the Dexerto 200 row, while still avoiding full effect prose. The two non-Steam/Dexerto rows and the Wild Buff threshold remain blocked on Fortune Teller/Town Hall UI or game-file confirmation.

Official Store movie note: `research/steam-store-movie-frame-crawl.md` adds a stronger visible-media candidate for the Arcana selection surface. SM-257250926 `00:30` shows `Mana Syphon` with `Increase Mana every 100 cards.`, `Over The Top` with `When a Crawler leaves, put them at the top of your Deck.`, visible tabs/cards for `Wild Buff` and `Your Shield My Liege`, plus `Equip` and `Confirm`. This supports the PC Gamer/top-of-deck wording side of the `Over The Top` conflict, but it still does not prove unlock state, final Fortune Teller UI, one-arcana equip limit, or runtime behavior.

## Arcana Rows

| ID | Original Name | Total Set Membership | Unlock Condition | Effect Summary | Start-of-run Availability | Build Impact | Evidence | Conflict Notes | Current Implementation | Gap | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ARC-001 | Wild Buff Arcana | listed unlock entry | Dexerto 200 cards picked up from light sources; official-wiki value extract says 250 | Cards picked up from light sources are affected by combo multipliers | selectable after unlock, needs UI proof | Enables light-source cards to scale with combo chains | SRC-006/SRC-106/SRC-132/SRC-147/SRC-206 | Unlock count conflict `CON-044`; exact in-game text and card category still need proof | no mature system | Effect/UI/runtime missing | 공식 메타데이터 수집 / 출처 충돌 |
| ARC-002 | Jester's Hat Arcana | listed unlock entry | Play 150 Wild cards | Adds or guarantees Wild Card access on every floor | selectable after unlock, needs UI proof | Supports long TurboTurn chains | SRC-006/SRC-106/SRC-111/SRC-206 | "Adds to deck" vs "drop" wording needs UI proof | no mature system | Effect/UI/runtime missing | 공식 메타데이터 수집 / 교차검증 필요 |
| ARC-003 | Chain Link Arcana | listed unlock entry | Reach combo 12+ | Combo multipliers do not clear between turns | selectable after unlock, needs UI proof | Makes multi-turn combo builds possible | SRC-006/SRC-106/SRC-111/SRC-206 | Exact reset/carryover boundaries need runtime proof | no mature system | Effect/UI/runtime missing | 공식 메타데이터 수집 / 교차검증 필요 |
| ARC-004 | Your Shield My Liege Arcana | listed unlock entry | Gain 2,000 armor | Remaining Armor can be saved between turns | selectable after unlock, needs UI proof | Enables persistent armor and Shield Bash builds | SRC-006/SRC-106/SRC-111/SRC-136/SRC-202/SRC-206 | Exact turn/encounter persistence boundary needs runtime proof | no mature system | Effect/UI/runtime missing | 공식 메타데이터 수집 / 교차검증 필요 |
| ARC-005 | Swollen Fist Arcana | listed unlock entry | Reach deck size 40 | Deals end-of-turn damage based on deck size | selectable after unlock, needs UI proof | Turns large decks into damage | SRC-006/SRC-106/SRC-206 | Exact timing/target/formula needs UI/runtime proof | no mature system | Effect/UI/runtime missing | 공식 메타데이터 수집 / 교차검증 필요 |
| ARC-006 | And Another Arcana | listed unlock entry | Play 150 Free-to-Play cards according to Dexerto/NeonLights; GAMES.GG article text says 500 | Repeated cards played during the same turn become free; base 0-cost cards may not count for the tracker | selectable after unlock, needs UI proof | Rewards repeated-card turns and deck cycling | SRC-006/SRC-106/SRC-111/SRC-206 | Unlock count conflict: 150 vs 500; tracker category needs proof | no mature system | Effect/UI/runtime missing | 공식 메타데이터 수집 / 출처 충돌 |
| ARC-007 | Make a Scene Arcana | listed unlock entry | Activate 1,500 Crawler trigger abilities | Crawler abilities trigger automatically at the start of every turn | selectable after unlock, needs UI proof | Raises crawler-trigger consistency | SRC-006/SRC-106/SRC-206 | Exact "start of turn" timing and trigger count need runtime proof | no mature system | Effect/UI/runtime missing | 공식 메타데이터 수집 / 교차검증 필요 |
| ARC-008 | Over The Top Arcana | listed unlock entry | Play Crawler cards 100 times | Crawler cards return after leaving/loss; Store movie frame says leaving Crawlers go to top of deck | selectable after unlock, needs UI proof | Reuses crawler cards for repeated passive bursts | SRC-006/SRC-106/SRC-136/SRC-145/SRC-202/SRC-206 | Return zone/timing conflict remains because NeonLights says hand next turn, while PC Gamer crawl and Store movie frame support top-of-deck wording | no mature system | Effect/UI/runtime missing | 공식 메타데이터 수집 / 출처 충돌 / official Store media candidate |
| ARC-009 | Sharp Mind Arcana | listed unlock entry | Play purple cards 100 times | Saves up to 5 unspent Mana between turns | selectable after unlock, needs UI proof | Smooths mana-heavy builds across turns | SRC-006/SRC-106/SRC-111/SRC-206 | Exact carryover cap and reset timing need runtime proof | no mature system | Effect/UI/runtime missing | 공식 메타데이터 수집 / 교차검증 필요 |
| ARC-010 | Mana Syphon Arcana | listed unlock entry | Gain 15 mana in a turn | Store movie frame reads `Increase Mana every 100 cards.`; secondary/wiki sources describe permanent run mana gain | selectable after unlock, needs UI proof | Long-run mana snowball | SRC-006/SRC-106/SRC-111/SRC-145/SRC-206 | Counter scope, permanence within run, and whether Store frame omits `+1`/duration detail need runtime proof | no mature system | Effect/UI/runtime missing | 공식 메타데이터 수집 / official Store media candidate / 교차검증 필요 |
| ARC-011 | Experimental Medicine | automatic/default arcana candidate | Automatic when Fortune Teller opens according to secondary sources | Doubles healing received from cards and items | automatic/default candidate, needs UI proof | Healing-heavy build support | SRC-111/SRC-206 | Not present in 10 public Steam/Dexerto unlock rows; direct UI needed | no mature system | Effect/UI/runtime missing | 교차검증 필요 |
| ARC-012 | Shield Bash | automatic/default arcana candidate | Automatic when Fortune Teller opens according to secondary sources | Armor cards deal damage equal to the Armor they provide | automatic/default candidate, needs UI proof | Converts defense into offense, pairs with Your Shield My Liege | SRC-111/SRC-202/SRC-206 | Not present in 10 public Steam/Dexerto unlock rows; direct UI needed | no mature system | Effect/UI/runtime missing | 교차검증 필요 |

## Required Completion

- Capture Fortune Teller unlock flow, start-of-run selection, locked/unlocked states, and whether one or more Arcanas can be equipped.
- Verify the 12-card roster directly from Fortune Teller UI or game files, especially `Experimental Medicine` and `Shield Bash`.
- Resolve the `Wild Buff` unlock-count conflict, `And Another` unlock-count conflict, and `Over The Top` return-zone wording with direct UI/runtime proof.
- Record exact effect text and at least one runtime build-impact observation for every arcana.
