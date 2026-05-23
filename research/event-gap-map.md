# Event / Encounter Implementation Gap Map

Status: `partial video proof / official wiki event value extract / event taxonomy reconciliation / row-level current implementation gap-mapped`
Last updated: 2026-05-22

This file maps each collected Vampire Crawlers event or special encounter row against the current prototype implementation. It is intentionally conservative: a local event type or gem station is not counted as original-accurate until the original room/object name, option text, cost, reward, penalty, repeat rule, failure case, and runtime consequence are verified.

## Source Basis

| Source ID | Source | Use | Grade |
| --- | --- | --- | --- |
| VID-004 | Inlaid Library storyboard | Locked interaction and shop/purchase candidates | E3 partial |
| VID-005 | Library Sanctum storyboard | Gem insertion, no-valid-card exception, activate/recruit-crawler event | E3 partial |
| VID-006 | Teeny Bridge storyboard | Card-sacrifice / color-lock candidate | E3 partial |
| VID-007 | Dairy Plant storyboard | Gem insertion, duplicate-card station, BING/arcade candidate | E3 partial |
| VID-008 | Milk Factory storyboard | Experimental Machine and gem/card insertion candidates | E3 partial |
| VID-009 | Gallo Tower storyboard | Arcade, shop/setup, gem/card insertion, floor-transition candidates | E3 partial |
| VID-010 | Cappella/Ultima storyboard | Color-lock, duplicate-card, recruit/shop-like, and sacrifice candidates | E3 partial |
| VID-012 | Library Sanctum pressure storyboard | Permanent-stat card sacrifice and gem/card insertion candidates | E3 partial |
| SRC-145 | Steam Store movie frame crawl | Mana offering table / spend-card-to-mana event candidate | E5 official Store media for visible UI candidates only |
| SRC-142 | Official wiki enemy/event/Power-Up field crawl | 10 dungeon-event category page boundary | E5 official wiki / not direct play |
| SRC-148 | Official wiki enemy/event/Power-Up value extract | 10 dungeon-event category rows with keyword buckets and no common event infobox | E5 official wiki structured values / not direct play |
| derived | Event taxonomy reconciliation | Separates 10 official-wiki page rows into actionable mechanics vs sparse label-only pages, Store media UI candidates, storyboard route candidates, and prototype-only event layers | Source-level reconciliation / not direct play |
| local implementation audit | `src/content/crawler-clone.js`, `src/content/balance.js`, `src/content/expansion.js`, `src/rules/crawler-dungeon.js`, `src/rules/progression.js` | Current prototype event pools and reward handlers | Local implementation evidence |

## Coverage Counter

| Segment | Rows | Current exact 1:1 implemented | Placeholder-adjacent rows | Current status |
| --- | ---: | ---: | ---: | --- |
| Classified event / encounter candidates | 11 | 0 | 5 | Storyboard and official Store media candidates exist, and event taxonomy reconciliation now separates official-wiki actionable mechanics, sparse label-only pages, media candidates, and prototype-only rows, but exact text, costs, outcomes, and repeat rules are unresolved |
| Official-wiki dungeon-event category rows | 10 | 0 | 0 | Event taxonomy reconciliation identifies 4 actionable source-level mechanic pages and 6 sparse label-only pages; all still need UI or game-file proof |
| Unclassified original event set | unknown total | 0 | 0 | No complete original event catalog exists yet |
| Current prototype event pool | 13 | 0 | 5 | Local events cover broad ideas but not original names/options/rules |
| Gem/card station behavior | unknown total | 0 | 1 | Prototype socket flow exists, but original station restrictions and exceptions are unresolved |

## Current Prototype Surface

| Surface | Current behavior | Why it is not final parity |
| --- | --- | --- |
| `balance.eventPool` in `crawler-clone.js` | Five crawler prototype events: healing, sealed chamber, wild fountain, portrait gallery, wandering smith | Local event names/options/effects do not match collected original event rows |
| `content/expansion.js` event additions | Adds eight more generic prototype event types | Useful local coverage only; not original catalog proof |
| `showCrawlerEvent()` | Randomly offers three prototype event choices | Original room identity, option text, costs, failure rules, and repeat logic are unverified |
| `resolveCrawlerReward()` | Handles local event rewards and a few gem/socket/evolve actions | Original event outcomes, persistence, and invalid-target exceptions are not implemented |
| `showCrawlerGemStation()` / socket helpers | Lets the prototype insert a local gem into a local card | Original `Insert Gem into a Card` station text, valid targets, replacement/cancel, and no-valid-card cases remain unresolved |
| Generic progression events | Old act-flow events and shops exist separately | They are not mapped to Vampire Crawlers event-room proof |

## Per-Event Gap Rows

| ID | Event / encounter candidate | Collected proof | Current implementation surface | Parity | Current gap | Required proof |
| --- | --- | --- | --- | --- | --- | --- |
| EVT-001 | Locked interaction / unmet-condition dialog | VID-004 shows locked object/dialog candidate | No direct equivalent | No | Trigger condition, exact text, option labels, cost/resource, and result missing | High-resolution/direct capture of locked and satisfied states |
| EVT-002 | Shop/event purchase candidate | VID-004 shows buy/leave-style interaction | Generic shop/event pool is placeholder-adjacent | Placeholder only | Shop-vs-event classification, item list, costs, decline behavior, and reward missing | Event room name, options, buy result, insufficient-currency case |
| EVT-003 | Color-lock / card-sacrifice gate candidate | VID-006 and VID-010 show card grid / sacrifice-style surfaces | `sealedChamber` and card removal concepts are placeholder-adjacent | Placeholder only | Color requirement, sacrifice cost, accepted cards, unlock/result, and failure case missing | Valid/invalid card examples plus final room outcome |
| EVT-004 | Experimental Machine candidate | VID-008 shows machine/object panel candidate; event taxonomy flags possible Card stat offering table / Bing Upgrades Vending Machine overlap | No direct equivalent | No | Machine rule, input requirements, cost, reward, invalid input, and repeat behavior missing | Full panel text and one successful plus one skipped/invalid outcome |
| EVT-005 | Insert Gem into a Card station | VID-002/005/007/008/009/010/011/012 show repeated card-gem insertion surfaces; event taxonomy separates normal gem insertion from Evolution statue/evolution-gem insertion | Prototype gem station is placeholder-adjacent | Placeholder only | Exact original station flow, card target restrictions, replacement/cancel, no-valid-card, evolution-gem boundary, and cost rules missing | Station UI, valid target, invalid target, replacement/cancel, and resulting card state |
| EVT-006 | Duplicate-card station candidate | VID-007 and VID-010 show duplicate-card inventory screens; official-wiki Duplicate offering table and Store screenshot `SS-09` support the source-level card-duplicate family | Generic `duplicateDraft` exists in the older progression event flow, not as proven crawler-event parity | Placeholder only | Cost, duplicate limit, target restrictions, cancel behavior, development-build caveat, and resulting deck mutation missing | Panel text plus successful duplicate and invalid/no-target case |
| EVT-007 | BING / arcade cabinet candidate | VID-007 and VID-009 show arcade-like room/object; event taxonomy flags possible Card stat offering table / Bing Upgrades Vending Machine overlap | No direct equivalent | No | Object identity, input, cost, reward table, penalty, and repeat rule missing | Direct/high-resolution arcade interaction and outcome proof |
| EVT-008 | Blessed Hands / recruit-offer / activate-crawler event candidate | VID-005 and VID-010 show recruit/activate/buy-style event surfaces | Local party/character concepts only | No | Exact event name, souls/currency cost, target crawler, reward, decline, and persistence missing | Panel text, cost, accept/decline outcomes, and next-run roster state |
| EVT-009 | Permanent-stat card sacrifice event candidate | VID-012 shows permanent-stat sacrifice surface; official-wiki Card stat offering table describes a stat-card-destroying run-duration buff, so this may be a conflict or a separate event | `sealedChamber` / trade-health style concepts are placeholder-adjacent | Placeholder only | Stat list, permanence, card restrictions, repeat rule, wiki run-duration vs storyboard permanent-state boundary, and save impact missing | Sacrifice choice, stat delta, next-run persistence, and invalid/cancel behavior |
| EVT-010 | Soul-force / no-valid-cards exception candidate | VID-005 shows `No valid cards available`-style exception | No direct equivalent | No | Triggering station identity, required cards, retry rules, and valid-case outcome missing | Capture both no-valid and valid-card states with resulting reward |
| EVT-011 | Mana offering table / spend-card-to-mana event | SRC-145 SM-257250926 `00:35` reads `Spend a card to gain Mana.` with `Leave` and a selectable card grid; official-wiki Mana offering table supplies the page-name layer only | No direct equivalent | No | Consumed-card result, mana amount, temporary/permanent scope, invalid state, Mana/Cooldown boundary, and repeat rule missing | Capture one successful card spend, cancel/leave, no-valid-card state, and post-event mana/deck state |
| EVT-TBD | Unclassified original event set | Official-wiki value extract preserves 10 dungeon-event category rows, and event taxonomy reconciliation splits them into 4 actionable mechanics plus 6 sparse label-only pages, but no common event infobox or complete option/cost/reward table exists | Prototype event pool only | No | Total event count, names, stages, weights, option text, costs, rewards, and special interactions unknown | Full event catalog from direct play, high-resolution footage, guide table, or game files |

## Required Completion

- Log every event room/object name, option text, option cost, reward, penalty, invalid-state message, repeat rule, and persistence consequence.
- Use `event-taxonomy-reconciliation.md` to preserve official-wiki page rows, actionable wiki mechanics, Store media, storyboard candidates, and current prototype layers separately.
- Use the 10 official-wiki dungeon-event category rows as a capture queue, not as final event behavior.
- Include non-event interaction rooms such as chests, light sources, mine carts, coffins, relic objects, gem stations, duplicate stations, sacrifice stations, and shovels if they have special rules.
- Verify each event choice at least once by direct play, high-resolution video, or game files.
- Keep implementation approval closed until every event row has a testable acceptance condition and source confidence level.
