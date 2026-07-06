# Dexerto Card Page Crawl

Status: `individual card-page crawl complete / E1 source-level only / direct UI still required`
Last updated: 2026-05-22

This generated research table captures the non-character card pages linked from the Dexerto Vampire Crawlers card index. It is not direct gameplay proof and does not authorize implementation parity by itself.

Related reconciliation: [`card-taxonomy-reconciliation.md`](./card-taxonomy-reconciliation.md) now compares these 87 Dexerto non-character rows against 90 official-wiki non-character rows, 113 official-wiki total card rows, and official `65+ cards` shorthand.

## Source Basis

| Source ID | Source | Use | Grade |
| --- | --- | --- | --- |
| SRC-102 | Dexerto card index | 87 non-character page-link boundary and page URLs | E1 |
| SRC-129 | Dexerto non-character individual card pages crawl | category, type, mana cost, gem slots, short text, release, evolution target, and evo group fields where present | E1 |

## Crawl Coverage

| Metric | Count | Notes |
| --- | ---: | --- |
| Pages crawled | 87 | attack:40, defense:8, mana:6, stat-boost:18, temporary:6, wild:9 |
| Crawl errors | 0 | Nonzero means page needs manual retry |
| Missing mana cost after W fallback | 1 | Mana Bomb remains unknown in the crawled page data |
| Missing gem-slot field | 48 | Many Wild, Temporary, and evolved-card pages do not expose a gem-slot row |
| Official-wiki name matches | 87 | Name-level matches only; not runtime or collection UI parity |

## Page Rows

| ID | Name | Path | Type | Mana Cost | Gem Slots | Text | Evolves Into | Evo Group | Release | URL | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DEX-C001 | Axe | attack | Attack | 2 | 1 | Deal 45 damage to multiple enemies with a chance to Knockback. | Death Spiral | Death Spiral + Candelabrador + Candella + Candle | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/axe/ | Dexerto page E1 / direct UI required |
| DEX-C002 | Bloody Tear | attack | Attack | 2 |  | Deal 40 damage to multiple enemies. On Crit: Heal 3. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/bloody-tear/ | Dexerto page E1 / direct UI required |
| DEX-C003 | Bone | attack | Attack | 0 | 1 | Deal 3 damage to multiple enemies. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/bone/ | Dexerto page E1 / direct UI required |
| DEX-C004 | Bracelet | attack | Attack | W |  | Deal 100 damage. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/bracelet/ | Dexerto page E1 / direct UI required |
| DEX-C005 | Carréllo | attack | Attack | 2 | 2 | Deal 45 damage to multiple enemies with a chance to Knockback. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/carr-llo/ | Dexerto page E1 / direct UI required |
| DEX-C006 | Celestial Dusting | attack | Attack | 2 | 2 | Deal 35 damage. Little Heart. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/celestial-dusting/ | Dexerto page E1 / direct UI required |
| DEX-C007 | Cherry Bomb | attack | Attack | 1 | 1 | Deal 18 damage. Chance to explode. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/cherry-bomb/ | Dexerto page E1 / direct UI required |
| DEX-C008 | Cross | attack | Attack | 2 | 1 | Deal 80 damage. | Heaven Sword | Clover | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/cross/ | Dexerto page E1 / direct UI required |
| DEX-C009 | Death Spiral | attack | Attack | 3 |  | Deal 160 damage to the front row. Crit. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/death-spiral/ | Dexerto page E1 / direct UI required |
| DEX-C010 | Ebony Wings | attack | Attack | 4 | 2 | Deal 140 damage. Bombards enemies after every turn. | Vandalier |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/ebony-wings/ | Dexerto page E1 / direct UI required |
| DEX-C011 | Eight The Sparrow | attack | Attack | 2 | 1 | Deal 35 damage. | Phieraggi | Phieraggi | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/eight-the-sparrow/ | Dexerto page E1 / direct UI required |
| DEX-C012 | Fire Wand | attack | Attack | 1 | 1 | Deal 45 damage. | Hellfire | Hellfire + Spinach + Sprig o' Spinach | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/fire-wand/ | Dexerto page E1 / direct UI required |
| DEX-C013 | Garlic | attack | Attack | 1 | 1 | Deal 10 damage to the front row. Disarm. | Soul Eater | Soul Eater + Pummadora + Pummarola | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/garlic/ | Dexerto page E1 / direct UI required |
| DEX-C014 | Gatti Amari | attack | Attack | 1 | 1 | Deal 25 damage. Chance to Scuffle. | Vicious Hunger | Vicious Hunger + Stone Mask | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/gatti-amari/ | Dexerto page E1 / direct UI required |
| DEX-C015 | Gorgeous Moon | attack | Attack | 1 | 2 | Erase* 1 enemy. Moonrise. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/gorgeous-moon/ | Dexerto page E1 / direct UI required |
| DEX-C016 | Heaven Sword | attack | Attack | 3 | 1 | Deal 100 damage. Crit |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/heaven-sword/ | Dexerto page E1 / direct UI required |
| DEX-C017 | Hellfire | attack | Attack | 3 |  | Deal 225 damage with a chance to Knockback. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/hellfire/ | Dexerto page E1 / direct UI required |
| DEX-C018 | Holy Wand | attack | Attack | 2 |  | Deal 150 damage. Prioritize attackers. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/holy-wand/ | Dexerto page E1 / direct UI required |
| DEX-C019 | King Bible | attack | Attack | 1 | 1 | Deal 40 damage with a chance to Knockback. | Unholy Vespers | Unholy Vespers + Spellbinder | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/king-bible/ | Dexerto page E1 / direct UI required |
| DEX-C020 | Knife | attack | Attack | 0 | 1 | Deal 40 damage. Crit. | Thousand Edge | Thousand Edge + Bracer | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/knife/ | Dexerto page E1 / direct UI required |
| DEX-C021 | La Borra | attack | Attack | 4 |  | Deal 150 damage. Burns enemies after every turn. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/la-borra/ | Dexerto page E1 / direct UI required |
| DEX-C022 | Lightning Ring | attack | Attack | 2 | 1 | Deal 125 damage. | Thunder Loop | Du-Duplicator + Duplicator | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/lightning-ring/ | Dexerto page E1 / direct UI required |
| DEX-C023 | Magic Wand | attack | Attack | 0 | 1 | Deal 30 damage. Prioritize attackers. | Holy Wand | Holy Wand + Ancient Tome + Empty Tome + Light Tome + Weighty Tome + <div cla | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/magic-wand/ | Dexerto page E1 / direct UI required |
| DEX-C024 | Mannajja | attack | Attack | 5 | 1 | Deal 79 damage to multiple enemies. Raw Mana*. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/mannajja/ | Dexerto page E1 / direct UI required |
| DEX-C025 | NO FUTURE | attack | Attack | 3 |  | Deal 15 damage. Bounces and explodes. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/no-future/ | Dexerto page E1 / direct UI required |
| DEX-C026 | Peachone | attack | Attack | 3 | 2 | Deal 100 damage. Bombards enemies after every turn. | Vandalier | Vandalier | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/peachone/ | Dexerto page E1 / direct UI required |
| DEX-C027 | Pentagram | attack | Attack | 5 | 2 | Erase 8 rows. Countdown. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/pentagram/ | Dexerto page E1 / direct UI required |
| DEX-C028 | Phiera Der Tuphello | attack | Attack | 3 | 1 | Deal 70 damage. | Phieraggi |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/phiera-der-tuphello/ | Dexerto page E1 / direct UI required |
| DEX-C029 | Phieraggi | attack | Attack | 4 | 1 | Deal 350 damage. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/phieraggi/ | Dexerto page E1 / direct UI required |
| DEX-C030 | Runetracer | attack | Attack | 1 | 1 | Deal 15 damage. Bounces to deal more damage. | NO FUTURE | NO FUTURE + Armor + Golden Armor + Hero's Armor + Rainbow Armor + <div | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/runetracer/ | Dexerto page E1 / direct UI required |
| DEX-C031 | Santa Water | attack | Attack | 3 | 1 | Deal 60 damage. Burns enemies after this turn. | La Borra | La Borra + Attractorb | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/santa-water/ | Dexerto page E1 / direct UI required |
| DEX-C032 | Shadow Pinion | attack | Attack | 3 | 1 | Deal 90 damage. Retrigger. | Valkyrie Turner | Valkyrie Turner + Wings + Wings | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/shadow-pinion/ | Dexerto page E1 / direct UI required |
| DEX-C033 | Soul Eater | attack | Attack | 3 |  | Deal 100 damage to the front row. Heal 3. Disarm*. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/soul-eater/ | Dexerto page E1 / direct UI required |
| DEX-C034 | Thousand Edge | attack | Attack | 3 | 1 | Deal 180 damage. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/thousand-edge/ | Dexerto page E1 / direct UI required |
| DEX-C035 | Thunder Loop | attack | Attack | 4 | 1 | Deal 150 damage. Attacks again at the end of the turn. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/thunder-loop/ | Dexerto page E1 / direct UI required |
| DEX-C036 | Unholy Vespers | attack | Attack | 2 |  | Deal 120 damage with a chance to Knockback. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/unholy-vespers/ | Dexerto page E1 / direct UI required |
| DEX-C037 | Valkyrie Turner | attack | Attack | 2 | 1 | Deal 25 damage to the front row. Valkyrie's Inferno. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/valkyrie-turner/ | Dexerto page E1 / direct UI required |
| DEX-C038 | Vandalier | attack | Attack | 5 | 1 | Deal 500 damage with a chance to Knockback. Big Bird. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/vandalier/ | Dexerto page E1 / direct UI required |
| DEX-C039 | Vicious Hunger | attack | Attack | 2 | 1 | Deal 50 damage. May turn enemies into coins. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/vicious-hunger/ | Dexerto page E1 / direct UI required |
| DEX-C040 | Whip | attack | Attack | 0 | 1 | Deal 8 damage to multiple enemies. | Bloody Tear | Bloody Tear + Forever Heart + Hollow Heart | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/attack/whip/ | Dexerto page E1 / direct UI required |
| DEX-C041 | Armor | defense | Defense | 0 |  | Add 2 Armor. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/defense/armor/ | Dexerto page E1 / direct UI required |
| DEX-C042 | Clock Lancet | defense | Defense | 3 | 1 | Apply 1 Freeze. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/defense/clock-lancet/ | Dexerto page E1 / direct UI required |
| DEX-C043 | Golden Armor | defense | Defense | 1 |  | Add 4 Armor. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/defense/golden-armor/ | Dexerto page E1 / direct UI required |
| DEX-C044 | Hero's Armor | defense | Defense | 3 |  | Add 8 Armor. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/defense/hero-s-armor/ | Dexerto page E1 / direct UI required |
| DEX-C045 | Parm Aegis | defense | Defense | W |  | Add 1 Armor. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/defense/parm-aegis/ | Dexerto page E1 / direct UI required |
| DEX-C046 | Pummadora | defense | Defense | 2 |  | Recovery: Heal 4 after encounter. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/defense/pummadora/ | Dexerto page E1 / direct UI required |
| DEX-C047 | Pummarola | defense | Defense | 1 |  | Recovery: Heal 2 after encounter. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/defense/pummarola/ | Dexerto page E1 / direct UI required |
| DEX-C048 | Rainbow Armor | defense | Defense | 2 |  | Add 6 Armor. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/defense/rainbow-armor/ | Dexerto page E1 / direct UI required |
| DEX-C049 | Ancient Tome | mana | Mana | 3 | 3 | Add 4 Mana. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/mana/ancient-tome/ | Dexerto page E1 / direct UI required |
| DEX-C050 | Empty Tome | mana | Mana | 0 |  | Add 1 Mana. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/mana/empty-tome/ | Dexerto page E1 / direct UI required |
| DEX-C051 | Light Tome | mana | Mana | 1 | 1 | Add 2 Mana. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/mana/light-tome/ | Dexerto page E1 / direct UI required |
| DEX-C052 | Song of Mana | mana | Mana | 4 | 1 | Deal 10 damage to multiple enemies. Raw Mana. Mana Scaling. | Mannajja | Mannajja + Skull O'Maniac | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/mana/song-of-mana/ | Dexerto page E1 / direct UI required |
| DEX-C053 | Weighty Tome | mana | Mana | 2 | 2 | Add 3 Mana. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/mana/weighty-tome/ | Dexerto page E1 / direct UI required |
| DEX-C054 | Wings | mana | Wild | W |  | Reduce Mana cost of next card played by 1 |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/mana/wings/ | Dexerto page E1 / direct UI required |
| DEX-C055 | Attractorb | stat-boost | Stat Boost | 1 |  | Draw 1 card. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/attractorb/ | Dexerto page E1 / direct UI required |
| DEX-C056 | Bracer | stat-boost | Stat Boost | 0 | 1 | Hand: Increase Hand by 1. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/bracer/ | Dexerto page E1 / direct UI required |
| DEX-C057 | Candelabrador | stat-boost | Stat Boost | 2 |  | Attacks deal 15% splash damage. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/candelabrador/ | Dexerto page E1 / direct UI required |
| DEX-C058 | Candella | stat-boost | Stat Boost | 1 |  | Area: Attacks deal 10% splash damage. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/candella/ | Dexerto page E1 / direct UI required |
| DEX-C059 | Candle | stat-boost | Stat Boost | 0 |  | Area: Attacks deal 5% splash damage. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/candle/ | Dexerto page E1 / direct UI required |
| DEX-C060 | Clover | stat-boost | Stat Boost | 2 |  | Add 10% Luck. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/clover/ | Dexerto page E1 / direct UI required |
| DEX-C061 | Crown | stat-boost | Stat Boost | 1 |  | Growth: Gain 15% XP Growth. Destroy. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/crown/ | Dexerto page E1 / direct UI required |
| DEX-C062 | Du-Duplicator | stat-boost | Stat Boost | 2 |  | Fires 2 more projectiles. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/du-duplicator/ | Dexerto page E1 / direct UI required |
| DEX-C063 | Duplicator | stat-boost | Stat Boost | 1 |  | Amount: Fire 1 more projectile. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/duplicator/ | Dexerto page E1 / direct UI required |
| DEX-C064 | Forever Heart | stat-boost | Stat Boost | 2 | 1 | Gain 1 Max Health. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/forever-heart/ | Dexerto page E1 / direct UI required |
| DEX-C065 | Friendship Amulet | stat-boost | Stat Boost | W |  | Increases Combo. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/friendship-amulet/ | Dexerto page E1 / direct UI required |
| DEX-C066 | Hollow Heart | stat-boost | Stat Boost | 1 |  | Gain 3 Max Health. Destroy. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/hollow-heart/ | Dexerto page E1 / direct UI required |
| DEX-C067 | Skull O'Maniac | stat-boost | Stat Boost | 0 |  | Increase enemy strength 10%, gain additional XP. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/skull-o-maniac/ | Dexerto page E1 / direct UI required |
| DEX-C068 | Spellbinder | stat-boost | Stat Boost | 0 |  | Duration: Crawlers trigger 2 more abilities before leaving. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/spellbinder/ | Dexerto page E1 / direct UI required |
| DEX-C069 | Spinach | stat-boost | Stat Boost | 1 |  | Might: Deal 10% more damage. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/spinach/ | Dexerto page E1 / direct UI required |
| DEX-C070 | Sprig o' Spinach | stat-boost | Stat Boost | 2 | 1 | Deal 20% more damage. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/sprig-o-spinach/ | Dexerto page E1 / direct UI required |
| DEX-C071 | Stone Mask | stat-boost | Stat Boost | 1 |  | Greed: Gain 10% more coins. Destroy. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/stone-mask/ | Dexerto page E1 / direct UI required |
| DEX-C072 | Tirajisú | stat-boost | Stat Boost | 2 |  | Revival: Gain 10% Revival. Destroy. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/stat-boost/tirajis/ | Dexerto page E1 / direct UI required |
| DEX-C073 | Confuse | temporary | Temporary | 0 |  | Mana costs are randomized. Temporary. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/temporary/confuse/ | Dexerto page E1 / direct UI required |
| DEX-C074 | Cursed Lancet | temporary | Temporary | 0 |  | Freeze the next card drawn and increase its Mana cost. Temporary. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/temporary/cursed-lancet/ | Dexerto page E1 / direct UI required |
| DEX-C075 | Junk | temporary | Temporary | 1 |  | Destroy on use. Draw 1 card. Temporary. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/temporary/junk/ | Dexerto page E1 / direct UI required |
| DEX-C076 | Mana Bomb | temporary | Temporary |  |  | Mana Bomb in Vampire Crawlers Guides - Complete guide and information. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/temporary/mana-bomb/ | Dexerto page E1 / direct UI required |
| DEX-C077 | Muddle | temporary | Temporary | 0 |  | Crawler trigger types are randomized. Temporary. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/temporary/muddle/ | Dexerto page E1 / direct UI required |
| DEX-C078 | Shatter | temporary | Temporary | 0 |  | Shatter in Vampire Crawlers Guides - Complete guide and information. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/temporary/shatter/ | Dexerto page E1 / direct UI required |
| DEX-C079 | Big Coin Bag | wild | Wild | W |  | Add 25 coins. Destroy. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/wild/big-coin-bag/ | Dexerto page E1 / direct UI required |
| DEX-C080 | Clover Petal | wild | Wild | W |  | Add 5% Luck. Draw 1 card. Destroy. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/wild/clover-petal/ | Dexerto page E1 / direct UI required |
| DEX-C081 | Coin Purse | wild | Wild | W |  | Add 10 coins. Draw 1 card. Destroy. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/wild/coin-purse/ | Dexerto page E1 / direct UI required |
| DEX-C082 | Little Clover | wild | Wild | W |  | Add 10% Luck. Destroy. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/wild/little-clover/ | Dexerto page E1 / direct UI required |
| DEX-C083 | Little Heart | wild | Wild | W |  | Heal 1. Destroy. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/wild/little-heart/ | Dexerto page E1 / direct UI required |
| DEX-C084 | Orologion | wild | Wild | W |  | Apply 1 Freeze to the front row. Destroy. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/wild/orologion/ | Dexerto page E1 / direct UI required |
| DEX-C085 | Raw Mana | wild | Wild | W |  | Add 3 Mana. Destroy. Temporary. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/wild/raw-mana/ | Dexerto page E1 / direct UI required |
| DEX-C086 | Rosary | wild | Wild | W |  | Kill 1 row. Destroy. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/wild/rosary/ | Dexerto page E1 / direct UI required |
| DEX-C087 | Vacuum | wild | Wild | W |  | Draw 1 Card. Destroy. |  |  | 21 April 2026 | https://www.dexerto.com/wikis/vampire-crawlers/cards/wild/vacuum/ | Dexerto page E1 / direct UI required |

## Required Completion

- Confirm every crawled field against high-resolution in-game UI, direct play, or game files before treating it as final.
- Keep the 3 official-wiki-only non-character rows in `research/card-taxonomy-reconciliation.md` separate until shipped UI or game files prove whether they belong to the player-facing card catalog.
- Resolve missing mana cost and missing gem-slot fields from game UI or files; do not infer them from neighboring rows unless a source says so.
- Merge rows into `card-gap-map.md` only after exact current implementation parity and acceptance tests are defined.
