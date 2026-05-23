# Gem Implementation Gap Map

Status: `official metadata collected / Dexerto unlock-table crawl / official wiki value extract / gem taxonomy reconciliation / secondary effect-family mapping / official Store movie modifier candidates / row-level current implementation gap-mapped`
Last updated: 2026-05-22

This file maps each collected Vampire Crawlers gem row against the current prototype implementation. It is intentionally conservative: a placeholder with a similar idea is not counted as original-accurate until the original gem name, effect text, socket rule, reward pool, and runtime behavior are verified from game UI, video, direct play, or game files.

## Source Basis

| Source ID | Source | Use | Grade |
| --- | --- | --- | --- |
| SRC-006 | Steam Community achievements page | Official public achievement names/descriptions for 49 gem unlock rows | E5 metadata |
| SRC-105 | Dexerto gem unlock list | 49 gem names and unlock conditions | E1 |
| SRC-131 | Dexerto gem unlock table crawl | Generated 49-row table extraction and no-individual-gem-page boundary note | E1 |
| SRC-205 | Destructoid gem effects article | Secondary effect-label hints and card-modifier context | E1 |
| SRC-122 | SportsRant gem guide | Secondary effect-family taxonomy and card-attachment context | E1 |
| SRC-123 | GAMES.GG Jeweler guide | Secondary rarity/sealing/Luck context for Jeweler behavior | E1 |
| SRC-138 | GamerBlurb Trickster page crawl | Generated `Uncrackable Gem` anti-shatter reward context from Trickster defeat | E1 |
| SRC-139 | Nintendo Wire Trickster page crawl | Generated `Unbreakable Gem` reward-label conflict and anti-break description | E1 |
| SRC-108-R | GAMES.GG relic guide | Gem Hammer socket access and Stardust Anvil/Blacksmith extra-slot context | E1 |
| SRC-141 | Poncle official release FAQ crawl | Official-account broad `50+ gems` shorthand used as count-boundary context | E5 developer statement via social FAQ |
| SRC-146 | Official wiki card/gem value extract | 58 official-wiki gem rows with rarity/demo/unlock/keyword buckets, duplicate cost-gem display-name rows, and `X Mana` source-level display-name candidate | E5 official wiki structured values / not direct play |
| gem-taxonomy-reconciliation.md | Gem taxonomy reconciliation | 47 public-to-wiki name matches, 2 public `Mana Cost` bucket rows, and 11 official-wiki rows outside direct public matches | Derived source-level reconciliation / not direct proof |
| SRC-145 | Steam Store movie frame crawl | Official Store movie/frame candidates for visible modifier words such as `FREE`, `Wild Return`, `Wild Amount`, `Cost+`, and `Recover`; exact gem/card attribution unresolved | E5 official media candidate |
| VID-003/004/005/006/007/008/009/010/011/012 | Storyboard gameplay videos | Partial gem choice/card insertion surfaces | E3 partial |
| local implementation audit | `src/content/crawler-clone.js`, `src/rules/crawler-dungeon.js`, `src/content/growth.js`, `src/rules/growth.js` | Current prototype gem data and runtime behavior | Local implementation evidence |

## Coverage Counter

| Segment | Rows | Current exact 1:1 implemented | Placeholder-adjacent rows | Current status |
| --- | ---: | ---: | ---: | --- |
| Official/collected gem unlock rows | 49 unlock rows plus official 50+ shorthand plus 58 official-wiki value rows | 0 | 3 | Names and unlock metadata collected; generated Dexerto crawl confirms 49 table rows and no individual gem pages in the current page; official FAQ crawl adds broad 50+ shorthand; official-wiki value extract adds 58 rarity/demo/unlock/keyword rows; `gem-taxonomy-reconciliation.md` narrows this to 47 direct public-to-wiki matches, 2 public `Mana Cost` bucket rows, 7 Gem-Hammer/default-style wiki rows, and 4 cost-modifier variant wiki rows; exact row-to-effect text/runtime unresolved |
| Current crawler-clone prototype gems | 5 | 0 | 3 | `edgeGem`, `flowGem`, `echoGem`, `wideGem`, `linkGem`; only `flowGem`, `echoGem`, and `linkGem` resemble collected original concepts |
| Current generic growth prototype gems | 5 | 0 | 0 | Separate non-original prototype system; not counted as Vampire Crawlers parity |
| Socket/attachment behavior | unknown total | 0 | partial system only | Prototype allows one gem per socketed card; secondary sources now support card attachment, Blacksmith extra-slot, and Jeweler rarity/sealing context, and Store movie frames expose modifier-word candidates, but original restrictions, replacement, cancel, rarity pools, modifier attribution, and persistence remain unverified |

## Current Prototype Surface

| Surface | Current behavior | Why it is not final parity |
| --- | --- | --- |
| `crawlerCloneConfig.gems` | Five custom gems: damage multiplier, cost delta, echo, splash, always-chain | Original has 49 named gem unlock rows; current names/effects are prototype-local |
| `randomCrawlerGem()` | Uniform random selection from the five prototype gems | Original rarity, level-up pool, chest pool, boss reward pool, and sealing are unverified |
| `socketCrawlerGem()` | One stored gem id per card; consumes inventory if present; no replacement UI | Original socket count, valid targets, replacement/cancel behavior, and failure cases are unverified |
| `crawlerCardCostOverride()` | Applies `costDelta` only | Original Mana Cost Gems and mana refund/rebate family are not mapped |
| `crawlerApplyGemToNumbers()` | Handles damage multiplier, splash, always-chain, and echo | Most original gem families have no implementation surface |
| `growthConfig.gems` | Separate generic prototype gem list | Useful code reference only; it is not original Vampire Crawlers data |

## Per-Gem Gap Rows

| ID | Original gem | Collected unlock/effect hint | Current implementation surface | Parity | Current gap | Required proof |
| --- | --- | --- | --- | --- | --- | --- |
| GEM-001 | Nduja Gem | Defeat Nesufritto; Nduja effect label exists | No direct equivalent | No | Enemy target and effect rules missing | Gem UI plus Nesufritto fight/name proof and attached-card runtime |
| GEM-002 | Fireproof Gem | Complete Curd Refinery | No direct equivalent | No | Effect rules missing | Gem reward/socket UI and Curd Refinery completion unlock proof |
| GEM-003 | Crawler Caller Gem | Complete Library Sanctum; Crawler Caller effect hint | No direct equivalent | No | Crawler hand/summon behavior missing | Attached-card runtime proving summon/trigger result |
| GEM-004 | Yin Yang Gem | Complete Berserk Wood; Yin Yang effect hint | No direct equivalent | No | Even/odd mana behavior missing | In-game effect text and paired odd/even card-use examples |
| GEM-005 | Mana Rebate Gem | Gain 15 mana in a turn; Mana Rebate effect hint | No direct equivalent | No | Exact refund amount/timing missing | Mana gain threshold, socket UI, and refund trigger proof |
| GEM-006 | Blue Trigger Gem | Play 250 blue cards | No direct equivalent | No | Blue trigger behavior missing | Blue card socket target and trigger activation proof |
| GEM-007 | Growth Gem | Play Crown 5 times; Growth effect hint | No direct equivalent | No | Growth stat behavior missing | Effect text plus before/after stat or reward-pool proof |
| GEM-008 | Bombard Gem | Play Cherry Bomb 50 times; Bombard effect hint | No direct equivalent | No | Bomb behavior missing | Cherry Bomb unlock, socketing, and bomb runtime proof |
| GEM-009 | Calcium Gem | Play Bone 99 times | No direct equivalent | No | Effect rules missing | Bone card usage unlock and effect proof |
| GEM-010 | Countdown Gem | Play Empty Tome 321 times; Countdown effect hint | No direct equivalent | No | Cost reduction timing missing | Countdown trigger timing and cost-change proof |
| GEM-011 | Copy Gem | Play 1,000 cards; Copy effect hint | No direct equivalent | No | Copy target/timing missing | Copy target selection and duplicate-result proof |
| GEM-012 | Decimate Gem | Deal 666,666 damage; Decimate effect hint | No direct equivalent | No | Percent-health damage rules missing | High-damage unlock and enemy HP interaction proof |
| GEM-013 | Destroy Gem | Play 100 cards picked up from light sources; Destroy effect hint | No direct equivalent | No | Card destruction/coin return behavior missing | Light-source card acquisition plus destroy-result proof |
| GEM-014 | Easy Combo Gem | Reach combo 5+; Easy Combo effect hint | No direct equivalent | No | Combo benefit rules missing | Combo threshold, socketed-card activation, and chain math proof |
| GEM-015 | Drain Gem | Heal 1,500 HP; Drain effect hint | No direct equivalent | No | Kill-heal trigger missing | Healing unlock and enemy defeat heal proof |
| GEM-016 | Duration Gem | Play Spellbinder 10 times; Duration effect hint | No direct equivalent | No | Duration stat missing | In-game effect text and active-duration comparison |
| GEM-017 | Echo Gem | Play 3,000 cards; Echo effect hint | `echoGem` applies `echo` chance to a card | Placeholder only | Replay target, chance, order, and stacking unverified | Original Echo Gem effect text plus repeat-fire runtime proof |
| GEM-018 | Free To Play Gem | Play 200 Free-to-Play cards | No direct equivalent | No | Free-to-play card category and effect missing | Category UI, unlock counter, and socket effect proof |
| GEM-019 | Freeze Gem | Play Clock Lancet; Freeze effect hint | No direct equivalent | No | Enemy freeze/status behavior missing | Clock Lancet unlock plus frozen enemy/status proof |
| GEM-020 | Restore Health Gem | Play Pummarola 10 times; Restore Health effect hint | No direct equivalent | No | Encounter-end heal behavior missing | Healing timing and cap proof |
| GEM-021 | Coin Count Gem | Collect 100,000 coins; economy-scaling damage hint | No direct equivalent | No | Coin-scaling formula missing | Coin counter, socketed damage math, and cap proof |
| GEM-022 | Leader Gem | Deal 100,000 damage; Leader effect hint | No direct equivalent | No | In-hand damage boost rules missing | Hand-position condition and damage comparison proof |
| GEM-023 | Luck Gem | Play Clover 5 times; likely Luck stat | No direct equivalent | No | Luck behavior missing | Luck stat/effect text and reward probability proof |
| GEM-024 | Magic Hat Gem | Play Peachone 77 times; Magic Hat effect hint | No direct equivalent | No | Dove summon behavior missing | Summon target, count, and attack proof |
| GEM-025 | Magnetic Gem | Play 2,000 cards; Magnetic effect hint | No direct equivalent | No | Same-card draw behavior missing | Draw/search target proof after socketed card use |
| GEM-026 | Mana Cost Gems | Collect 10 Mana Orbs; reduce/increase mapping unresolved | `flowGem` applies cost -1 | Placeholder only | Original cost-modifier identity, direction, target, and stacking unresolved | Exact name/effect text plus multiple card-cost examples |
| GEM-027 | Mana Cost Gems 2 | Collect 20 Mana Orbs; reduce/increase mapping unresolved | No direct equivalent | No | Second cost gem identity unresolved | Exact paired cost-gem names/effects and socket examples |
| GEM-028 | Midas Gem | Collect 5,555 coins; Midas effect hint | No direct equivalent | No | Coin gain while in hand missing | In-hand condition and coin reward proof |
| GEM-029 | Purple Trigger Gem | Play 250 purple cards; Purple Trigger effect hint | No direct equivalent | No | Purple trigger behavior missing | Purple card socket target and trigger activation proof |
| GEM-030 | Rainbow Gem | Activate 500 Crawler trigger abilities; Rainbow effect hint | No direct equivalent | No | All-trigger behavior missing | Trigger-family interaction and all-color proof |
| GEM-031 | Red Trigger Gem | Play 500 red cards | No direct equivalent | No | Red trigger behavior missing | Red card socket target and trigger activation proof |
| GEM-032 | Refund Gem | Gain 10 mana in a turn; Refund effect hint | No direct equivalent | No | Mana refund amount/timing missing | Mana gain threshold and refund trigger proof |
| GEM-033 | Remote Gem | Destroy 5 mine carts | No direct equivalent | No | Effect rules missing | Mine-cart event/object proof and resulting effect text |
| GEM-034 | Retain Gem | Have 7 cards in hand; Retain effect hint | No direct equivalent | No | Hand-retain timing missing | End-turn/start-turn hand retention proof |
| GEM-035 | Return Gem | Play 300 cards; Return effect hint | No direct equivalent | No | Return-to-hand timing missing | Played-card zone transition proof |
| GEM-036 | Reverse Combo Gem | Reach combo 6+; Reverse Combo effect hint | No direct equivalent | No | Combo-breaking exception missing | Normal and reversed chain comparison proof |
| GEM-037 | Kill Count Gem | Defeat 10,000 enemies total; Kill Count effect hint | No direct equivalent | No | Enemy-count damage formula missing | Kill counter, formula text, and damage comparison proof |
| GEM-038 | Armor Strike Gem | Gain 15 armor in a turn; Armor Strike effect hint | No direct equivalent | No | Armor-to-damage formula missing | Armor threshold and converted damage proof |
| GEM-039 | Recycle Gem | Have 8 cards in hand; Recycle effect hint | No direct equivalent | No | Discard-skip behavior missing | Hand-size condition and discard/retain proof |
| GEM-040 | Mug Gem | Collect 3,333 coins; Mug effect hint | No direct equivalent | No | Kill-coin trigger missing | Enemy kill plus coin reward proof |
| GEM-041 | Quick Draw Gem | Reach deck size 30; Quick Draw effect hint | No direct equivalent | No | Opening-hand priority missing | Run start draw order and deck-size condition proof |
| GEM-042 | Coin Card Gem | Find and play 20 Big Coin Bag cards; Coin Card effect hint | No direct equivalent | No | Coin shard/card behavior missing | Big Coin Bag use plus generated coin-card proof |
| GEM-043 | Triple Damage Gem | Deal 500,000 damage; Triple Damage effect hint | No direct equivalent | No | Multiplier stacking missing | Damage multiplier text and before/after hit proof |
| GEM-044 | Uncrackable Gem | Defeat The Trickster; generated Trickster crawl preserves secondary `Unbreakable` alias conflict | No direct equivalent | No | Effect, anti-shatter rule, reward label, and Trickster spawn/fight target missing | The Trickster card-break spawn proof, fight/name proof, reward label, and gem effect text |
| GEM-045 | Wild Gem | Play 100 Wild cards; Wild effect hint | `linkGem` adds always-chain bonus | Placeholder only | Wild conversion/chain behavior and exception cases missing | Wild card chain proof with socketed-card comparison |
| GEM-046 | Mana X Damage Gem / X Mana Gem / X Mana | Steam ACH-159 uses `Mana X Damage Gem`; Dexerto crawl row 46 uses `X Mana Gem` with a 3,000 purple-card unlock; SRC-146 official-wiki value extract exposes `X Mana` as an Ultra Rare row with the same 3,000-purple-card unlock | No direct equivalent | No | Name conflict, X-mana/damage behavior, and exact in-game naming missing | In-game name/effect text plus mana-to-damage formula proof |
| GEM-047 | Mild Gem | Complete Gallo Tower with Gallo | No direct equivalent | No | Effect rules missing | Gallo Tower with Gallo clear proof and gem effect text |
| GEM-048 | Yellow Trigger Gem | Play 250 yellow cards; Yellow Trigger effect hint | No direct equivalent | No | Yellow trigger behavior missing | Yellow card socket target and trigger activation proof |
| GEM-049 | Greed Gem | Play Stone Mask 10 times; Greed effect hint | No direct equivalent | No | Greed stat/economy behavior missing | Stone Mask usage unlock plus economy effect proof |

## Required Completion

- Confirm whether the 49 rows are complete for the target Steam build and whether any hidden or patch-added gems exist.
- Resolve every Dexerto/Steam unlock label against official in-game gem names, the 43 visible effect-family labels, any variant rows, duplicate official-wiki cost-gem display names, and the `X Mana` / `X Mana Gem` / `Mana X Damage Gem` naming conflict; use `gem-taxonomy-reconciliation.md` as the current 49-vs-58 queue.
- Capture or directly verify every gem's effect text, valid card types, socket count interaction, replacement/cancel behavior, rarity, pool, sealing rules, and whether Store-movie modifier words such as `FREE`, `Wild Return`, `Wild Amount`, `Cost+`, and `Recover` are gem effects, card keywords, Wild variants, or separate reward modifiers.
- Add at least one runtime proof for each gem family: trigger gems, mana/cost gems, economy gems, draw/hand gems, combo gems, damage gems, status/summon gems, and boss/stage unlock gems.
- Keep implementation approval closed until every row can be tied to an exact file/function parity target and a testable acceptance condition.
