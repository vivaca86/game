# Official Wiki Card / Gem Field Crawl

Status: `generated 2026-05-22 / official wiki field-coverage crawl`

Source hub: https://vampire.survivors.wiki/w/Crawlers:Wiki

Related crawl: [`official-wiki-api-crawl.md`](./official-wiki-api-crawl.md)

Follow-up value extract: [`official-wiki-card-gem-value-extract.md`](./official-wiki-card-gem-value-extract.md)

This file stores field coverage extracted from official-wiki individual card and gem infoboxes. It intentionally records structure, counts, missing-field boundaries, and short name lists rather than copying every card or gem text field into this repository.

## Crawl Notes

| Check | Result |
| --- | --- |
| Page/API fetched | 2026-05-22 |
| Card categories used | character, attack, defense, stat boost, mana, wild, temporary |
| Card index pages excluded | `Crawlers:Cards`, `Crawlers:Characters`, and type-index pages |
| Unique card pages parsed | 113 |
| Gem pages parsed | 58 |
| API used | `api.php?action=parse` and `api.php?action=query&list=categorymembers` |
| Exact runtime proof present | No |
| Game-file proof present | No |

## Card Field Coverage

| Field | Rows With Value | Rows Missing | Notes |
| --- | ---: | ---: | --- |
| `name` / `type` | 113 | 0 | Unique `Infobox VC Card` rows |
| `cost` | 105 | 8 | Missing rows are one character row and seven wild rows |
| `gem slots` | 97 | 16 | Missing rows are mostly evolved cards plus selected stat/temporary rows |
| `text` | 110 | 3 | Exact text still needs UI/game-file proof before implementation |
| `unlocked by` or `unlock` | 95 | 18 | Several default, evolved, temporary, or system rows need taxonomy separation |
| `evointo` | 19 | 94 | Base cards that point to evolution/union targets |
| `crawlertext` | 22 | 91 | Character/Crawler passive text coverage; direct runtime proof still missing |
| `unlockcost` | 12 | 101 | Sparse Inn-cost coverage; do not treat missing as free |
| `crawlerduration` | 20 | 93 | Crawler passive duration field, not always present |

## Card Missing-Cost Rows

| Name | Primary Type | Page |
| --- | --- | --- |
| Divano | character | `Crawlers:Divano` |
| Big Coin Bag | wild | `Crawlers:Big Coin Bag` |
| Clover Petal | wild | `Crawlers:Clover Petal` |
| Coin Purse | wild | `Crawlers:Coin Purse` |
| Little Clover | wild | `Crawlers:Little Clover` |
| Raw Mana | wild | `Crawlers:Raw Mana` |
| Rich Coin Bag | wild | `Crawlers:Rich Coin Bag` |
| Vacuum | wild | `Crawlers:Vacuum` |

## Card Missing-Gem-Slot Rows

| Name | Primary Type | Page |
| --- | --- | --- |
| Bloody Tear | attack | `Crawlers:Bloody Tear` |
| Death Spiral | attack | `Crawlers:Death Spiral` |
| Hellfire | attack | `Crawlers:Hellfire` |
| Holy Wand | attack | `Crawlers:Holy Wand` |
| La Borra | attack | `Crawlers:La Borra` |
| NO FUTURE | attack | `Crawlers:NO FUTURE` |
| Soul Eater | attack | `Crawlers:Soul Eater` |
| Unholy Vespers | attack | `Crawlers:Unholy Vespers` |
| Pummarola | defense | `Crawlers:Pummarola` |
| Candelabrador | stat | `Crawlers:Candelabrador` |
| Candella | stat | `Crawlers:Candella` |
| Candle | stat | `Crawlers:Candle` |
| Duplicator | stat | `Crawlers:Duplicator` |
| Skull O'Maniac | stat | `Crawlers:Skull O'Maniac` |
| Spinach | stat | `Crawlers:Spinach` |
| Shatter | temporary | `Crawlers:Shatter` |

## Card Evolution Target Rows

| Base Card | Official-Wiki Target |
| --- | --- |
| Axe | Death Spiral |
| Cross | Heaven Sword |
| Ebony Wings | Vandalier |
| Eight The Sparrow | Phieraggi |
| Fire Wand | Hellfire |
| Garlic | Soul Eater |
| Gatti Amari | Vicious Hunger |
| King Bible | Unholy Vespers |
| Knife | Thousand Edge |
| Lightning Ring | Thunder Loop |
| Magic Wand | Holy Wand |
| Peachone | Vandalier |
| Pentagram | Gorgeous Moon |
| Phiera Der Tuphello | Phieraggi |
| Runetracer | NO FUTURE |
| Santa Water | La Borra |
| Shadow Pinion | Valkyrie Turner |
| Song of Mana | Mannajja |
| Whip | Bloody Tear |

## Gem Field Coverage

| Field | Rows With Value | Rows Missing | Notes |
| --- | ---: | ---: | --- |
| `name` / `rarity` | 58 | 0 | Unique `Infobox VC Gem` rows |
| `text` | 58 | 0 | Exact effect text still needs UI/game-file proof before implementation |
| `unlocked by` | 58 | 0 | Official-wiki pages all expose an unlock field |
| `demo = Yes` | 13 | 45 | Demo availability is source-level only |
| `demo = No` | 45 | 13 | Direct demo/full comparison still needed |

## Gem Rarity Name Lists

| Rarity | Count | Names |
| --- | ---: | --- |
| Common | 9 | Area; Armor; Double Damage; Increase Mana Cost; Luck; Might; Mug; Reduce Mana Cost; Restore Health |
| Uncommon | 12 | Blue Trigger; Duration; Greed; Growth; Increase Mana Cost; Nduja; Purple Trigger; Quick Draw; Red Trigger; Refund; Retain; Yellow Trigger |
| Rare | 20 | Amount; Bombard; Calcium; Coin Card; Crawler Caller; Destroy; Drain; Draw; Echo; Fireproof; Freeze; Magic Hat; Rainbow; Recycle; Reduce Mana Cost; Remote; Return; Reverse Combo; Triple Damage; Yin Yang |
| Very Rare | 8 | Armor Strike; Copy; Countdown; Easy Combo; Kill Count; Leader; Magnetic; Midas |
| Ultra Rare | 9 | Coin Count; Decimate; Evolution; Free To Play; Mana Rebate; Mild; Uncrackable; Wild; X Mana |

## Gem Duplicate Display Names

| Display Name | Page Rows |
| --- | --- |
| Increase Mana Cost | `Crawlers:Increase Mana Cost (+1)` is Common; `Crawlers:Increase Mana Cost (+2)` is Uncommon |
| Reduce Mana Cost | `Crawlers:Reduce Mana Cost (-1)` is Common; `Crawlers:Reduce Mana Cost (-2)` is Rare |

## Required Follow-Up

- Use the missing-cost and missing-gem-slot lists as a direct UI/game-file capture queue, not as proof that values are absent in game.
- Reconcile official-wiki `evointo` rows against the 17 Steam achievement evolution names and existing secondary recipe conflicts.
- Reconcile duplicated gem display names with in-game reward/collection UI before implementing final IDs.
- Use the value extract for row-level cost, socket, rarity, unlock, and keyword-bucket planning without copying full effect prose.
- Capture exact card and gem text from shipped game UI or game files before using it as implementation data.
