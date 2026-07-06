# Official Wiki Card / Gem Value Extract

Status: `generated 2026-05-22 / official wiki value extract`

Source hub: https://vampire.survivors.wiki/w/Crawlers:Wiki

API endpoint used: https://vampire.survivors.wiki/api.php

Related crawls: [`official-wiki-api-crawl.md`](./official-wiki-api-crawl.md), [`official-wiki-card-gem-field-crawl.md`](./official-wiki-card-gem-field-crawl.md).

Related reconciliation: [`card-taxonomy-reconciliation.md`](./card-taxonomy-reconciliation.md), [`gem-taxonomy-reconciliation.md`](./gem-taxonomy-reconciliation.md).

This artifact keeps row-level numeric and structural values from official-wiki infoboxes. It deliberately avoids copying full card/gem effect prose into the repository: effect text is represented by presence and keyword buckets only. Treat this as official-wiki source-level evidence, not installed-build, direct-runtime, save, or game-file proof.

## Crawl Notes

| Check | Result |
| --- | --- |
| Generated | 2026-05-22 |
| Card categories queried | Crawlers character cards; Crawlers attack cards; Crawlers defense cards; Crawlers stat boost cards; Crawlers mana cards; Crawlers wild cards; Crawlers temporary cards |
| Gem categories queried | Crawlers gems |
| Unique `Infobox VC Card` rows parsed | 113 |
| Unique `Infobox VC Gem` rows parsed | 58 |
| Full effect text stored here | No; only `textPresent` and keyword buckets are stored |

## Snapshot Counts

### Card Types

| Type | Rows |
| --- | ---: |
| attack | 40 |
| character | 23 |
| defense | 8 |
| mana | 6 |
| stat | 19 |
| temporary | 7 |
| wild | 10 |

### Card Cost Distribution

| Cost | Rows |
| --- | ---: |
| 1 | 31 |
| 2 | 21 |
| 3 | 13 |
| 4 | 5 |
| 5 | 5 |
| (missing) | 8 |
| 0 | 23 |
| W | 7 |

### Card Gem-Slot Distribution

| Gem Slots | Rows |
| --- | ---: |
| (missing) | 16 |
| 0 | 55 |
| 1 | 34 |
| 2 | 7 |
| 3 | 1 |

### Gem Rarity Distribution

| Rarity | Rows |
| --- | ---: |
| Common | 9 |
| Rare | 20 |
| Ultra Rare | 9 |
| Uncommon | 12 |
| Very Rare | 8 |

## Implementation-Relevant Queues

### Card Rows Missing Wiki Cost

| Name | Type | Page |
| --- | --- | --- |
| Big Coin Bag | wild | Crawlers:Big Coin Bag |
| Clover Petal | wild | Crawlers:Clover Petal |
| Coin Purse | wild | Crawlers:Coin Purse |
| Divano | character | Crawlers:Divano |
| Little Clover | wild | Crawlers:Little Clover |
| Raw Mana | wild | Crawlers:Raw Mana |
| Rich Coin Bag | wild | Crawlers:Rich Coin Bag |
| Vacuum | wild | Crawlers:Vacuum |

### Card Rows Missing Wiki Gem Slots

| Name | Type | Cost | Page |
| --- | --- | --- | --- |
| Bloody Tear | attack | 2 | Crawlers:Bloody Tear |
| Candelabrador | stat | 2 | Crawlers:Candelabrador |
| Candella | stat | 1 | Crawlers:Candella |
| Candle | stat | 0 | Crawlers:Candle |
| Death Spiral | attack | 3 | Crawlers:Death Spiral |
| Duplicator | stat | 1 | Crawlers:Duplicator |
| Hellfire | attack | 3 | Crawlers:Hellfire |
| Holy Wand | attack | 2 | Crawlers:Holy Wand |
| La Borra | attack | 4 | Crawlers:La Borra |
| NO FUTURE | attack | 3 | Crawlers:NO FUTURE |
| Pummarola | defense | 1 | Crawlers:Pummarola |
| Shatter | temporary | 0 | Crawlers:Shatter |
| Skull O'Maniac | stat | 0 | Crawlers:Skull O'Maniac |
| Soul Eater | attack | 3 | Crawlers:Soul Eater |
| Spinach | stat | 1 | Crawlers:Spinach |
| Unholy Vespers | attack | 2 | Crawlers:Unholy Vespers |

### Official-Wiki Evolution Target Rows

| Base Card | Type | Cost | Gem Slots | Evolves Into | Required Group |
| --- | --- | --- | --- | --- | --- |
| Axe | attack | 2 | 1 | Death Spiral | Candle |
| Cross | attack | 2 | 1 | Heaven Sword | Clover |
| Ebony Wings | attack | 4 | 2 | Vandalier | Peachone |
| Eight The Sparrow | attack | 2 | 1 | Phieraggi | Tirajisú |
| Fire Wand | attack | 1 | 1 | Hellfire | Spinach |
| Garlic | attack | 1 | 1 | Soul Eater | Pummarola |
| Gatti Amari | attack | 1 | 1 | Vicious Hunger | Stone Mask |
| King Bible | attack | 1 | 1 | Unholy Vespers | Spellbinder |
| Knife | attack | 0 | 1 | Thousand Edge | Bracer |
| Lightning Ring | attack | 2 | 1 | Thunder Loop | Duplicator |
| Magic Wand | attack | 0 | 1 | Holy Wand | Empty Tome |
| Peachone | attack | 3 | 2 | Vandalier | Ebony Wings |
| Pentagram | attack | 5 | 2 | Gorgeous Moon | Crown |
| Phiera Der Tuphello | attack | 3 | 1 | Phieraggi | Tirajisú |
| Runetracer | attack | 1 | 1 | NO FUTURE | Armor |
| Santa Water | attack | 3 | 1 | La Borra | Attractorb |
| Shadow Pinion | attack | 3 | 1 | Valkyrie Turner | Wings |
| Song of Mana | mana | 4 | 1 | Mannajja | Skull O'Maniac |
| Whip | attack | 0 | 1 | Bloody Tear | Hollow Heart |

### Duplicate Gem Display Names

| Display Name | Official-Wiki Page Rows |
| --- | --- |
| Increase Mana Cost | Crawlers:Increase Mana Cost (+1) (Common); Crawlers:Increase Mana Cost (+2) (Uncommon) |
| Reduce Mana Cost | Crawlers:Reduce Mana Cost (-1) (Common); Crawlers:Reduce Mana Cost (-2) (Rare) |

## Card Value Rows

| Name | Type | Cost | Gem Slots | Max Gem Slots | Demo | Evo Target | Evo Group | Unlock Cost | Crawler Duration | Text? | Text Keyword Buckets | Page |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ancient Tome | mana | 3 | 3 | 3 | Yes |  |  |  |  | yes | mana | Crawlers:Ancient Tome |
| Angelo Spietato | temporary | 5 | 0 |  | No |  |  |  |  | yes | heal, retain, destroy | Crawlers:Angelo Spietato |
| Antonio | character | 0 | 0 |  | Yes |  |  | 0 | 5 | yes | armor, crawler | Crawlers:Antonio |
| Arca | character | 0 | 0 |  | Yes |  |  | 500 | 5 | yes | mana, crawler | Crawlers:Arca |
| Armor | defense | 0 | 0 | 1 | Yes |  |  |  |  | yes | armor | Crawlers:Armor |
| Attractorb | stat | 1 | 0 |  | Yes |  |  |  |  | yes | draw, cards | Crawlers:Attractorb |
| Axe | attack | 2 | 1 |  | Yes | Death Spiral | Candle |  |  | yes | damage, knockback | Crawlers:Axe |
| Big Coin Bag | wild |  | 0 |  | Yes |  |  |  |  | yes | coin, destroy | Crawlers:Big Coin Bag |
| Bloody Tear | attack | 2 |  |  | Yes |  |  |  |  | yes | damage, heal | Crawlers:Bloody Tear |
| Bone | attack | 0 | 1 |  | No |  |  |  |  | yes | damage | Crawlers:Bone |
| Bracelet | attack | W | 0 |  | No |  |  |  |  | yes | damage | Crawlers:Bracelet |
| Bracer | stat | 0 | 1 | 2 | Yes |  |  |  |  | yes |  | Crawlers:Bracer |
| Candelabrador | stat | 2 |  |  | Yes |  |  |  |  | yes | damage | Crawlers:Candelabrador |
| Candella | stat | 1 |  |  | Yes |  |  |  |  | yes | damage, area | Crawlers:Candella |
| Candle | stat | 0 |  |  | Yes |  |  |  |  | yes | damage, area | Crawlers:Candle |
| Carréllo | attack | 2 | 2 |  | No |  |  |  |  | yes | damage, knockback | Crawlers:Carréllo |
| Cavallo | character | 0 | 0 |  | No |  |  | 750 | 2 | yes | duration, crawler | Crawlers:Cavallo |
| Celestial Dusting | attack | 2 | 2 |  | No |  |  |  |  | yes | damage | Crawlers:Celestial Dusting |
| Cherry Bomb | attack | 1 | 1 | 2 | No |  |  |  |  | yes | damage, xp | Crawlers:Cherry Bomb |
| Christine | character | 0 | 0 |  | No |  |  | N/A | 3 | yes | mana, cost, cards, duration, crawler | Crawlers:Christine |
| Clerici | character | 0 | 0 |  | No |  |  | No | 6 | yes | heal, crawler | Crawlers:Clerici |
| Clock Lancet | defense | 3 | 1 |  | No |  |  |  |  | yes | freeze | Crawlers:Clock Lancet |
| Clover | stat | 2 | 1 | 2 | No |  |  |  |  | yes | luck | Crawlers:Clover |
| Clover Petal | wild |  | 0 | 1 | Yes |  |  |  |  | yes | draw, cards, luck, destroy | Crawlers:Clover Petal |
| Coin Purse | wild |  | 0 |  | Yes |  |  |  |  | yes | draw, cards, coin, destroy | Crawlers:Coin Purse |
| Concetta | character | 1 | 0 |  | No |  |  | 1840 | 10 | yes | damage, area, crawler | Crawlers:Concetta |
| Confuse | temporary | 0 | 0 |  | No |  |  |  |  | yes | mana, cost | Crawlers:Confuse |
| Cross | attack | 2 | 1 |  | No | Heaven Sword | Clover |  |  | yes | damage | Crawlers:Cross |
| Crown | stat | 1 | 0 |  | Yes |  |  |  |  | yes | xp, destroy | Crawlers:Crown |
| Crystal Crown | stat | 2 | 1 | 2 | No |  |  |  |  | yes | xp, destroy | Crawlers:Crystal Crown |
| Cursed Lancet | temporary | 0 | 0 |  | No |  |  |  |  | yes | mana, cost, draw, cards, freeze | Crawlers:Cursed Lancet |
| Death Spiral | attack | 3 |  |  | Yes |  |  |  |  | yes | damage | Crawlers:Death Spiral |
| Divano | character |  | 0 |  | No |  |  |  |  | no |  | Crawlers:Divano |
| Dommario | character | 1 | 0 |  | No |  |  |  | 7 | yes | trigger, duration, crawler | Crawlers:Dommario |
| Du-Duplicator | stat | 2 | 1 | 2 | Yes |  |  |  |  | yes |  | Crawlers:Du-Duplicator |
| Duplicator | stat | 1 |  |  | Yes |  |  |  |  | yes | amount | Crawlers:Duplicator |
| Ebony Wings | attack | 4 | 2 |  | No | Vandalier | Peachone |  |  | yes | damage | Crawlers:Ebony Wings |
| Eight The Sparrow | attack | 2 | 1 |  | No | Phieraggi | Tirajisú |  |  | yes | damage | Crawlers:Eight The Sparrow |
| Empty Tome | mana | 0 | 0 | 1 | Yes |  |  |  |  | yes | mana | Crawlers:Empty Tome |
| Fire Wand | attack | 1 | 1 | 2 | Yes | Hellfire | Spinach |  |  | yes | damage | Crawlers:Fire Wand |
| Forever Heart | stat | 2 | 1 |  | Yes |  |  |  |  | yes | heal | Crawlers:Forever Heart |
| Friendship Amulet | stat | W | 0 |  | No |  |  |  |  | yes | combo | Crawlers:Friendship Amulet |
| Gallo | character | 1 | 0 |  | No |  |  | 5200 | 8 | yes | coin, crawler | Crawlers:Gallo |
| Garlic | attack | 1 | 1 | 2 | Yes | Soul Eater | Pummarola |  |  | yes | damage, disarm | Crawlers:Garlic |
| Gatti Amari | attack | 1 | 1 | 2 | No | Vicious Hunger | Stone Mask |  |  | yes | damage | Crawlers:Gatti Amari |
| Gennaro | character | 1 | 0 |  | Yes |  |  | 600 | 5 | yes | crawler | Crawlers:Gennaro |
| Giovanna | character | 1 | 0 |  | No |  |  |  | 6 | yes | luck, crawler | Crawlers:Giovanna |
| Golden Armor | defense | 1 | 0 | 2 | Yes |  |  |  |  | yes | armor | Crawlers:Golden Armor |
| Gorgeous Moon | attack | 1 | 2 |  | No |  |  |  |  | yes |  | Crawlers:Gorgeous Moon |
| Heaven Sword | attack | 3 | 1 |  | No |  |  |  |  | yes | damage | Crawlers:Heaven Sword |
| Hellfire | attack | 3 |  |  | Yes |  |  |  |  | yes | damage, knockback | Crawlers:Hellfire |
| Hero's Armor | defense | 3 | 0 |  | Yes |  |  |  |  | yes | armor | Crawlers:Hero's Armor |
| Hollow Heart | stat | 1 | 0 |  | Yes |  |  |  |  | yes | heal, destroy | Crawlers:Hollow Heart |
| Holy Wand | attack | 2 |  |  | Yes |  |  |  |  | yes | damage | Crawlers:Holy Wand |
| Imelda | character | 0 | 0 |  | Yes |  |  | 10 | 5 | yes | xp, crawler | Crawlers:Imelda |
| Junk | temporary | 1 | 0 |  | Yes |  |  |  |  | yes | draw, cards, destroy | Crawlers:Junk |
| King Bible | attack | 1 | 1 | 2 | Yes | Unholy Vespers | Spellbinder |  |  | yes | damage, knockback | Crawlers:King Bible |
| Knife | attack | 0 | 1 | 2 | Yes | Thousand Edge | Bracer |  |  | yes | damage | Crawlers:Knife |
| Krochi | character | 1 | 0 |  | No |  |  |  | 10 | yes | crawler | Crawlers:Krochi |
| La Borra | attack | 4 |  |  | Yes |  |  |  |  | yes | damage, burn | Crawlers:La Borra |
| Lama | character | 1 | 0 |  | No |  |  |  | 5 | yes | damage, crawler | Crawlers:Lama |
| Light Tome | mana | 1 | 1 | 2 | Yes |  |  |  |  | yes | mana | Crawlers:Light Tome |
| Lightning Ring | attack | 2 | 1 |  | No | Thunder Loop | Duplicator |  |  | yes | damage | Crawlers:Lightning Ring |
| Little Clover | wild |  | 0 | 1 | Yes |  |  |  |  | yes | luck, destroy | Crawlers:Little Clover |
| Little Heart | wild | W | 0 |  | No |  |  |  |  | yes | heal, destroy | Crawlers:Little Heart |
| Magic Wand | attack | 0 | 1 | 2 | Yes | Holy Wand | Empty Tome |  |  | yes | damage | Crawlers:Magic Wand |
| Mana Bomb | temporary | 5 | 0 |  | No |  |  |  |  | yes | damage, mana | Crawlers:Mana Bomb |
| Mannajja | attack | 5 | 1 |  | No |  |  |  |  | yes | damage, mana | Crawlers:Mannajja |
| MissingN0 | character | 0 | 0 |  | No |  |  | 6666 | 170 | yes | armor, crawler | Crawlers:MissingN0 |
| Mortaccio | character | 0 | 0 |  | No |  |  |  | 7 | yes | amount, crawler | Crawlers:Mortaccio |
| Muddle | temporary | 0 | 0 |  | Yes |  |  |  |  | yes | trigger, crawler | Crawlers:Muddle |
| NO FUTURE | attack | 3 |  |  | Yes |  |  |  |  | yes | damage, xp | Crawlers:NO FUTURE |
| O'Sole | character | 1 | 0 |  | No |  |  |  | 4 | yes | amount, crawler | Crawlers:O'Sole |
| Orologion | wild | W | 0 |  | No |  |  |  |  | yes | freeze, destroy | Crawlers:Orologion |
| Parm Aegis | defense | W | 0 |  | No |  |  |  |  | yes | armor | Crawlers:Parm Aegis |
| Pasqualina | character | 1 | 0 |  | Yes |  |  | 1100 | 2 | yes | damage, area, crawler | Crawlers:Pasqualina |
| Peachone | attack | 3 | 2 |  | Yes | Vandalier | Ebony Wings |  |  | yes | damage | Crawlers:Peachone |
| Pentagram | attack | 5 | 2 |  | No | Gorgeous Moon | Crown |  |  | yes |  | Crawlers:Pentagram |
| Phiera Der Tuphello | attack | 3 | 1 |  | No | Phieraggi | Tirajisú |  |  | yes | damage | Crawlers:Phiera Der Tuphello |
| Phieraggi | attack | 4 | 1 |  | No |  |  |  |  | yes | damage | Crawlers:Phieraggi |
| Poe | character | 1 | 0 |  | Yes |  |  | 500 | 3 | yes | damage, area, crawler | Crawlers:Poe |
| Poppea | character | 1 | 0 |  | No |  |  |  | 9 | yes | crawler | Crawlers:Poppea |
| Porta | character | 0 | 0 |  | No |  |  |  |  | yes | duration, crawler | Crawlers:Porta |
| Pugnala | character | 1 | 0 |  | No |  |  |  | 3 | yes | damage, crawler | Crawlers:Pugnala |
| Pummadora | defense | 2 | 0 | 2 | Yes |  |  |  |  | yes | heal | Crawlers:Pummadora |
| Pummarola | defense | 1 |  |  | Yes |  |  |  |  | yes | heal | Crawlers:Pummarola |
| Rainbow Armor | defense | 2 | 0 |  | Yes |  |  |  |  | yes | armor | Crawlers:Rainbow Armor |
| Ramba | character | 1 | 0 |  | No |  |  |  |  | yes | amount, crawler | Crawlers:Ramba |
| Raw Mana | wild |  | 0 |  | No |  |  |  |  | yes | mana, destroy | Crawlers:Raw Mana |
| Rich Coin Bag | wild |  | 0 |  | No |  |  |  |  | no |  | Crawlers:Rich Coin Bag |
| Rosary | wild | W | 0 |  | No |  |  |  |  | yes | destroy | Crawlers:Rosary |
| Runetracer | attack | 1 | 1 | 2 | Yes | NO FUTURE | Armor |  |  | yes | damage | Crawlers:Runetracer |
| Santa Water | attack | 3 | 1 |  | Yes | La Borra | Attractorb |  |  | yes | damage, burn | Crawlers:Santa Water |
| Shadow Pinion | attack | 3 | 1 |  | No | Valkyrie Turner | Wings |  |  | yes | damage, trigger | Crawlers:Shadow Pinion |
| Shatter | temporary | 0 |  |  |  |  |  |  |  | no |  | Crawlers:Shatter |
| Skull O'Maniac | stat | 0 |  |  | No |  |  |  |  | yes | xp | Crawlers:Skull O'Maniac |
| Song of Mana | mana | 4 | 1 |  | No | Mannajja | Skull O'Maniac |  |  | yes | damage, mana | Crawlers:Song of Mana |
| Soul Eater | attack | 3 |  |  | Yes |  |  |  |  | yes | damage, heal, disarm | Crawlers:Soul Eater |
| Spellbinder | stat | 0 | 0 |  | Yes |  |  |  |  | yes | trigger, duration, crawler | Crawlers:Spellbinder |
| Spinach | stat | 1 |  |  | Yes |  |  |  |  | yes | damage | Crawlers:Spinach |
| Sprig o' Spinach | stat | 2 | 1 |  | Yes |  |  |  |  | yes | damage | Crawlers:Sprig o' Spinach |
| Stone Mask | stat | 1 | 0 |  | Yes |  |  |  |  | yes | coin, destroy | Crawlers:Stone Mask |
| Thousand Edge | attack | 3 | 1 |  | Yes |  |  |  |  | yes | damage | Crawlers:Thousand Edge |
| Thunder Loop | attack | 4 | 1 |  | No |  |  |  |  | yes | damage | Crawlers:Thunder Loop |
| Tirajisú | stat | 2 | 0 |  | No |  |  |  |  | yes | destroy | Crawlers:Tirajisú |
| Unholy Vespers | attack | 2 |  |  | Yes |  |  |  |  | yes | damage, knockback | Crawlers:Unholy Vespers |
| Vacuum | wild |  | 0 | 1 | Yes |  |  |  |  | yes | draw, cards, destroy | Crawlers:Vacuum |
| Valkyrie Turner | attack | 2 | 1 |  | No |  |  |  |  | yes | damage | Crawlers:Valkyrie Turner |
| Vandalier | attack | 5 | 1 |  | No |  |  |  |  | yes | damage, knockback | Crawlers:Vandalier |
| Vicious Hunger | attack | 2 | 1 |  | No |  |  |  |  | yes | damage, coin | Crawlers:Vicious Hunger |
| Weighty Tome | mana | 2 | 2 | 3 | Yes |  |  |  |  | yes | mana | Crawlers:Weighty Tome |
| Whip | attack | 0 | 1 | 2 | Yes | Bloody Tear | Hollow Heart |  |  | yes | damage | Crawlers:Whip |
| Wings | mana | W | 0 |  | No |  |  |  |  | yes | mana, cost, cards | Crawlers:Wings |

## Gem Value Rows

| Name | Rarity | Demo | Unlocked By | Text? | Text Keyword Buckets | Page |
| --- | --- | --- | --- | --- | --- | --- |
| Amount | Rare | Yes | Unlocked when taking the Gem Hammer | yes | amount | Crawlers:Amount (gem) |
| Area | Common | Yes | Unlocked when taking the Gem Hammer | yes | area | Crawlers:Area (gem) |
| Armor | Common | Yes | Unlocked when taking the Gem Hammer | yes | armor | Crawlers:Armor (gem) |
| Armor Strike | Very Rare | No | Gaining 15 Armor in a turn. | yes | damage, armor | Crawlers:Armor Strike |
| Blue Trigger | Uncommon | No | Playing 250 blue cards. | yes | trigger | Crawlers:Blue Trigger |
| Bombard | Rare | No | Playing Cherry Bomb 50 times. | yes |  | Crawlers:Bombard |
| Calcium | Rare | No | Playing Bone 99 times. | yes | damage | Crawlers:Calcium |
| Coin Card | Rare | Yes | Finding and playing 20 Big Coin Bags. | yes | cards, coin | Crawlers:Coin Card |
| Coin Count | Ultra Rare | No | Collecting 100,000 coins. | yes | damage, coin | Crawlers:Coin Count |
| Copy | Very Rare | No | Playing 1,000 cards. | yes | cards | Crawlers:Copy |
| Countdown | Very Rare | No | Playing Empty Tome 321 times. | yes | mana, cost | Crawlers:Countdown |
| Crawler Caller | Rare | No | Completing Library Sanctum. | yes | crawler | Crawlers:Crawler Caller |
| Decimate | Ultra Rare | No | Dealing 666,666 damage. | yes | damage, heal | Crawlers:Decimate |
| Destroy | Rare | No | Playing 100 cards picked up from light sources. | yes | cards, coin, burn | Crawlers:Destroy |
| Double Damage | Common | Yes | Unlocked when taking the Gem Hammer | yes |  | Crawlers:Double Damage |
| Drain | Rare | No | Healing 1,500 HP. | yes | heal, cards | Crawlers:Drain |
| Draw | Rare | Yes | Unlocked when taking the Gem Hammer | yes | draw, cards | Crawlers:Draw |
| Duration | Uncommon | No | Playing Spellbinder 10 times. | yes | duration | Crawlers:Duration (gem) |
| Easy Combo | Very Rare | Yes | Reaching 5 Combo or above. | yes | combo, cards | Crawlers:Easy Combo |
| Echo | Rare | No | Playing 3,000 cards. | yes | cards | Crawlers:Echo |
| Evolution | Ultra Rare | Yes | Unlocked when taking the Gem Hammer | yes | cards, evolve | Crawlers:Evolution |
| Fireproof | Rare | No | Completing Curd Refinery. | yes | destroy | Crawlers:Fireproof |
| Free To Play | Ultra Rare | No | Playing 200 Free-to-Play cards. | yes | mana, cards | Crawlers:Free To Play |
| Freeze | Rare | No | Playing Clock Lancet. | yes | freeze | Crawlers:Freeze |
| Greed | Uncommon | No | Playing Stone Mask 10 times. | yes |  | Crawlers:Greed (gem) |
| Growth | Uncommon | No | Playing Crown 5 times. | yes |  | Crawlers:Growth (gem) |
| Increase Mana Cost | Common | No | Collecting 10 Mana orbs. | yes | mana, cost | Crawlers:Increase Mana Cost (+1) |
| Increase Mana Cost | Uncommon | No | Collecting 20 Mana orbs. | yes | mana, cost | Crawlers:Increase Mana Cost (+2) |
| Kill Count | Very Rare | No | Defeating a total of 10,000 enemies. | yes | damage | Crawlers:Kill Count |
| Leader | Very Rare | No | Dealing 100,000 damage. | yes | damage, cards | Crawlers:Leader |
| Luck | Common | No | Playing Clover 5 times. | yes | luck | Crawlers:Luck (gem) |
| Magic Hat | Rare | No | Playing Peachone 77 times. | yes |  | Crawlers:Magic Hat |
| Magnetic | Very Rare | No | Playing 2,000 cards. | yes | draw, cards | Crawlers:Magnetic |
| Mana Rebate | Ultra Rare | Yes | Gaining 15 Mana in a turn. | yes | mana, cards | Crawlers:Mana Rebate |
| Midas | Very Rare | No | Collecting 5,555 coins. | yes | cards, coin | Crawlers:Midas |
| Might | Common | Yes | Unlocked when taking the Gem Hammer | yes |  | Crawlers:Might (gem) |
| Mild | Ultra Rare | No | Completing Gallo Tower with Gallo. | yes | combo | Crawlers:Mild |
| Mug | Common | No | Collecting 3,333 coins. | yes | cards, coin | Crawlers:Mug |
| Nduja | Uncommon | Yes | Defeating Nesufritto. | yes | damage | Crawlers:Nduja |
| Purple Trigger | Uncommon | No | Playing purple cards 250 times. | yes | trigger | Crawlers:Purple Trigger |
| Quick Draw | Uncommon | Yes | Reaching 30 Deck size. | yes | draw, cards | Crawlers:Quick Draw |
| Rainbow | Rare | No | Activating 500 Crawler trigger abilities. | yes | trigger | Crawlers:Rainbow |
| Recycle | Rare | No | Having 8 cards in a Hand. | yes | cards | Crawlers:Recycle |
| Red Trigger | Uncommon | No | Playing 500 red cards. | yes | trigger | Crawlers:Red Trigger |
| Reduce Mana Cost | Common | No | Collecting 10 Mana orbs. | yes | mana, cost | Crawlers:Reduce Mana Cost (-1) |
| Reduce Mana Cost | Rare | No | Collecting 20 Mana orbs. | yes | mana, cost | Crawlers:Reduce Mana Cost (-2) |
| Refund | Uncommon | No | Gaining 10 Mana in a turn. | yes | mana | Crawlers:Refund |
| Remote | Rare | No | Destroying 5 Mine Carts. | yes |  | Crawlers:Remote |
| Restore Health | Common | No | Playing Pummarola 10 times. | yes | heal | Crawlers:Restore Health |
| Retain | Uncommon | No | Having 7 cards in a Hand. | yes | draw, cards | Crawlers:Retain |
| Return | Rare | Yes | Playing 300 cards. | yes | return | Crawlers:Return |
| Reverse Combo | Rare | No | Reaching 6 Combo or above. | yes | combo, cards | Crawlers:Reverse Combo |
| Triple Damage | Rare | No | Dealing 500,000 damage. | yes |  | Crawlers:Triple Damage |
| Uncrackable | Ultra Rare | No | Defeating The Trickster. | yes | cards, shatter | Crawlers:Uncrackable |
| Wild | Ultra Rare | No | Playing 100 Wild cards. | yes | wild, cards | Crawlers:Wild |
| X Mana | Ultra Rare | No | Playing purple cards 3,000 times. | yes | mana, cost | Crawlers:X Mana |
| Yellow Trigger | Uncommon | No | Playing 250 yellow cards. | yes | trigger | Crawlers:Yellow Trigger |
| Yin Yang | Rare | No | Completing Berserk Wood. | yes | mana, draw, cards | Crawlers:Yin Yang |

## Required Follow-Up

- Reconcile these official-wiki cost/socket rows with Store screenshot/movie values and Dexerto individual pages before implementation.
- Treat missing wiki values as a capture queue, not proof of missing runtime values.
- Resolve whether duplicate display-name gems are presented as duplicate names in-game or disambiguated by UI rarity/cost markers.
- Capture shipped UI/game-file text before copying exact effect prose into implementation.
