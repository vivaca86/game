# Event / Encounter Data

Status: `영상 부분 검증`

Event data requires video or direct-play observation because guide sources found so far focus on unlocks rather than room choice text and outcomes.

Current implementation gap map: [`event-gap-map.md`](./event-gap-map.md).
Generated event taxonomy reconciliation: [`event-taxonomy-reconciliation.md`](./event-taxonomy-reconciliation.md).
Generated official wiki enemy/event/power-up field crawl: [`official-wiki-enemy-event-powerup-field-crawl.md`](./official-wiki-enemy-event-powerup-field-crawl.md).
Generated official wiki enemy/event/Power-Up value extract: [`official-wiki-enemy-event-powerup-value-extract.md`](./official-wiki-enemy-event-powerup-value-extract.md).
Generated Steam Store movie frame crawl: [`steam-store-movie-frame-crawl.md`](./steam-store-movie-frame-crawl.md).

## Source Basis

| Source ID | Source | Used For | Current Grade |
| --- | --- | --- | --- |
| VID-004 to VID-012 | Storyboard video logs | Partial event, station, room-object, and result-screen candidates | E3 partial |
| SRC-142 | Official wiki dungeon-event category crawl | 10 official-wiki dungeon-event category pages and event-name capture queue | E5 official wiki / not direct play |
| SRC-148 | Official wiki enemy/event/Power-Up value extract | 10 official-wiki dungeon-event category rows, keyword buckets, and no-common-infobox boundary | E5 official wiki structured values / not direct play |
| SRC-145 | Steam Store movie / frame crawl | Official Store movie frame `SM-257250926` `00:35` captures `Spend a card to gain Mana.` with `Leave` and a selectable card grid; `SM-257306012` preserves marketing-only object callouts for later audit | E5 official Store media for visible UI candidates only |
| derived | Event taxonomy reconciliation | Separates official-wiki page names, actionable wiki mechanics, sparse label-only pages, Store media UI candidates, storyboard route candidates, and current prototype event layers | Source-level reconciliation / not direct play |

## Official Wiki Dungeon Event Snapshot

`research/official-wiki-enemy-event-powerup-field-crawl.md` adds 10 official-wiki dungeon event pages, and `research/official-wiki-enemy-event-powerup-value-extract.md` preserves them as category value rows with keyword buckets: Abandoned cart, Bat Goblin, Card stat offering table, Duplicate offering table, Evolution statue, Floor chicken offering table, Light source, Mana offering table, Mana statue, and Treasure chest. `research/event-taxonomy-reconciliation.md` further separates those rows into actionable wiki mechanics, sparse label-only pages, Store media UI candidates, storyboard route candidates, and prototype-only local event layers.

The current value extract did not expose a common event infobox, so exact option text, cost, reward, invalid-state text, repeat rules, persistence, and whether each page is a normal event room or another interaction class still need direct UI/game-file proof.

The event taxonomy pass adds source-level mechanics for four official-wiki pages: Abandoned cart as a Bracer / +1 Hand run-duration pickup, Card stat offering table / Bing Upgrades Vending Machine as a stat-card-destroying run-duration buff with a 200 coin cash-out, Duplicate offering table as a mirror-like card duplicate event, and Evolution statue as a reveal/interact evolution-gem flow with sacrifice, fallback, backout, and 200 gold cash-out boundaries. These values remain source-level only.

Official Store movie note: `research/steam-store-movie-frame-crawl.md` adds a visible Mana offering table candidate. SM-257250926 `00:35` shows the exact header `Spend a card to gain Mana.`, a red `Leave` button, and a card grid containing `Bone`, `Magic Wand`, `Garlic`, `Candella`, `Runetracer`, `Armor`, `Empty Tome`, and `Duplicator`. This likely maps to the official-wiki `Mana offering table` queue, but it still does not prove the consumed-card result, invalid state, repeat rule, or whether the event grants temporary or permanent mana.

## Event Rows

| ID | Event / Encounter | Stage / Room Context | Choices | Cost | Reward | Failure / Penalty | Repeat Rule | Evidence | Current Implementation | Gap | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EVT-001 | Locked interaction / unmet-condition dialog | Inlaid Library object/NPC-like encounter | Leave/confirm-style buttons visible; exact labels unresolved | 미확정 | 미확정 | Condition/resource failure implied by dialog | 미확정 | VID-004 `04:40`, `20:20` storyboard frames | `balance.eventPool` prototype events | Exact text, trigger, cost, and result missing | 영상 부분 검증 |
| EVT-002 | Shop/event purchase candidate | Inlaid Library object/NPC-like encounter | Leave/buy-style buttons visible; exact labels unresolved | 미확정 | 미확정 | Purchase/choice can likely be declined; exact penalty unknown | 미확정 | VID-004 `23:20` storyboard frame | `balance.eventPool` prototype events | Event/shop classification and outcome missing | 영상 부분 검증 |
| EVT-003 | Color-lock / card-sacrifice gate candidate | Teeny Bridge / Cappella-Ultima late route locked gate/object | Card grid, lock icons, leave control, and `Choose a card to sacrifice`-style surfaces visible; exact labels unresolved | likely card sacrifice, exact cost unknown | Unlock/gate/event result unknown | Wrong color/insufficient card failure possible, unverified | unknown | VID-006 `08:40`, `12:20`; VID-010 `35:20`, `57:20` storyboard frames | no direct equivalent | Card-color gate and sacrifice rules missing | Partial E3 |
| EVT-004 | Experimental Machine candidate | Milk Factory machine/object room | Machine-style interaction panel with card-like inputs and skip/leave control visible; exact labels unresolved | 미확정 | Possible combine/upgrade/reward outcome, unverified | Invalid input or skipped outcome possible, unverified | 미확정 | VID-008 `21:30` storyboard frame | no direct equivalent | Machine rule, input requirements, cost, reward, and repeat behavior missing | 영상 부분 검증 |
| EVT-005 | Insert Gem into a Card station | Dairy Plant / Milk Factory / Gallo Tower / Cappella-Ultima / Library Sanctum / broken-build route gem-card insertion screen | Inventory/card list with `Insert Gem into a Card`-style header and back control visible | likely gem/card socket action, exact cost unknown | Card socket/deck mutation candidate | No valid target, replacement, cancel, or wrong socket behavior unverified | unknown | VID-002 `00:35:00` gem choice and card-insertion overview frames; VID-005 `05:50`; VID-007 `01:40`, `08:50`; VID-008 `25:30`, `29:20`, `29:40`; VID-009 `15:40`, `33:00`; VID-010 `01:10`, `03:40`, `10:30`, `33:10`, `37:50`, `45:00`; VID-011 `22:50`; VID-012 `03:00`, `17:10` storyboard frames | limited prototype gem station | Original card socket flow and restrictions missing | Partial E3 |
| EVT-006 | Duplicate-card station candidate | Dairy Plant / Cappella-Ultima card-copy interaction | `Choose a card to duplicate`-style inventory screen visible; exact labels unresolved | likely card-copy cost/resource, exact cost unknown | Duplicated card/deck mutation candidate | No valid target, cancel, duplicate limit, or failure behavior unverified | unknown | VID-007 `14:40`, `18:50`; VID-010 `50:40`, `53:40`, `54:00` storyboard frames | no direct equivalent | Card-copy interaction rules missing | Partial E3 |
| EVT-007 | BING / arcade cabinet candidate | Dairy Plant / Gallo Tower arcade-like room object | `BING`/arcade-cabinet-like object visible in a room | 미확정 | Arcade/event reward candidate | Cost, input, failure, and repeat behavior unverified | 미확정 | VID-007 `07:30`; VID-009 `10:10`, `13:10` storyboard frames | no direct equivalent | Arcade object rules missing | 영상 부분 검증 |
| EVT-008 | Blessed Hands / recruit-offer / activate-crawler event candidate | Cappella-Ultima late route / Library Sanctum route event-dialog rooms | Buy/leave-style controls visible; VID-005 screen offers to activate/recruit a Crawler for a souls-like cost, while VID-010 small text suggests a recruit-for-souls offer but is not fully readable | likely souls/currency cost, exact amount unresolved except VID-005 appears to show 250 souls | Recruit/event reward candidate | Insufficient currency/decline outcome unverified | unknown | VID-005 `18:50`; VID-010 `55:20` storyboard frames | no direct equivalent | Exact event text, cost, reward, and repeat behavior missing | Partial E3 |
| EVT-009 | Permanent-stat card sacrifice event candidate | Library Sanctum upgrade/event room | `Sacrifice a card to get a permanent stat boost`-style screen with leave/confirm controls visible | card sacrifice, exact stat/cost unresolved | Permanent stat boost candidate | Cancel, invalid card, repeat, and persistence behavior unverified | unknown | VID-012 `05:20`, `19:30` storyboard frames | no direct equivalent | Exact stat list, permanence, cost, and repeat behavior missing | Partial E3 |
| EVT-010 | Soul-force / no-valid-cards exception candidate | Library Sanctum card/event station | Screen says `No valid cards available. Come back when you have more cards.` under a soul-force/arcana-style header | requires more valid cards; exact type/count unknown | unavailable action / retry prompt | Need test with enough cards, wrong cards, cancel, and repeat cases | unknown | VID-005 `16:20` storyboard frame | no direct equivalent | Triggering station, required cards, and failure/retry behavior missing | Partial E3 |
| EVT-011 | Mana offering table / spend-card-to-mana event | Store movie forest/ruin room with blue orb/table | Header `Spend a card to gain Mana.`; `Leave`; selectable card grid visible | card sacrifice, exact card eligibility and selected-card outcome unknown | Mana gain candidate; temporary vs permanent unresolved | Cancel, no-valid-card, repeat, and wrong-card behavior unverified | unknown | SRC-145 SM-257250926 `00:35`; official-wiki event queue has `Mana offering table` | no direct equivalent | Consumed-card result, mana amount, repeat rule, and persistence missing | official Store media candidate / needs runtime proof |
| EVT-TBD | Unclassified event set | Official wiki value extract preserves 10 dungeon-event category rows but no option/cost/reward infobox fields | TBD | TBD | TBD | TBD | TBD | SRC-148 | `balance.eventPool` prototype events | Original event set not fully collected | 미시작 |

## Required Completion

- Log every event room name, option text, option cost, reward, penalty, and whether it can repeat.
- Use `research/event-taxonomy-reconciliation.md` to keep official-wiki page names, actionable mechanics, Store media, storyboard candidates, and prototype-only local events separate before assigning parity.
- Use the 10 official-wiki dungeon-event category rows as a capture queue, not as final behavior.
- Include non-event interaction rooms such as chests, light sources, mine carts, coffins, sparkly relic objects, gem stations, and shovels if they have special interaction rules.
- Each event choice must be verified at least once by video or direct play.
