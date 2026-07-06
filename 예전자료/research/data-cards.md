# Card Data

Status: `공식 메타데이터 수집 / secondary evolution recipe mapping / secondary full-card catalog mapping / card taxonomy reconciliation / 구현 차이 매핑 완료`

Static unlock data has been collected from guide sources and Steam achievement metadata, but this is not complete original-card data yet. These rows prove that unlock names/conditions exist; they do not prove in-combat behavior, card cost, target rules, cooldown/instant timing, sockets, exact card text, or balance.

Official wiki update: `research/official-wiki-api-crawl.md` now exposes 113 unique `Infobox VC Card` rows across character, attack, defense, stat, mana, wild, and temporary primary types. This is the largest public row-level catalog boundary so far, but it still needs collection UI, game-file, or direct-play proof before implementation.

Generated official wiki card/gem field crawl: [`official-wiki-card-gem-field-crawl.md`](./official-wiki-card-gem-field-crawl.md).
Generated official wiki card/gem value extract: [`official-wiki-card-gem-value-extract.md`](./official-wiki-card-gem-value-extract.md).
Generated card taxonomy reconciliation: [`card-taxonomy-reconciliation.md`](./card-taxonomy-reconciliation.md).
Generated Steam Store appdetails/media crawl: [`steam-store-appdetails-crawl.md`](./steam-store-appdetails-crawl.md).
Generated Steam Store movie frame crawl: [`steam-store-movie-frame-crawl.md`](./steam-store-movie-frame-crawl.md).

## Source Basis

| Source ID | Source | Used For | Current Grade |
| --- | --- | --- | --- |
| SRC-001 | Steam store page | Official core claims: ascending mana combo, Wild stack extension, cards, gems, chests, evolutions, shovel/floor loop | E5 for high-level rules only |
| SRC-004 | Steam Store API appdetails / media crawl | Official Store screenshot card-text candidates including Knife, Garlic, Little Heart, Hellfire, Pasqualina, Armor, Skull O'Maniac, Magic Wand, Wings, and Reverse Combo modifiers | E5 official Store media for visible UI candidates only |
| SRC-145 | Steam Store movie / frame crawl | Official Store movie and inline-video frame candidates including Mana Syphon, Over The Top, Bone, Magic Wand, Garlic, Candella, Holy Wand, Soul Eater, Runetracer, Santa Water, Phiera Der Tuphello, Hellfire, Bracelet, Parm Aegis, Whip, Attractorb, Bracer, NO FUTURE, and trailer-state card modifiers | E5 official Store media for visible UI candidates only |
| SRC-103 | Dexerto weapon card unlocks | 18 weapon-card unlock rows | E1 |
| SRC-104 | Dexerto item card unlocks | 16 item-card unlock rows | E1 |
| SRC-102 | Dexerto cards index | Card page-link boundary for attack, defense, stat boost, mana, wild, temporary, and character links | E1 |
| SRC-102 / SRC-69 | Dexerto evolutions index | 17 named evolution results | E1 |
| SRC-006 | Steam Community achievements page | Official achievement metadata for many card unlocks and all public `Discover ...` evolution achievements | E5 metadata |
| SRC-113 | Pro Game Guides evolution recipes | 17 evolution recipes, alternate ingredients, evolution-station/chest trigger hints, partial evolved-card effect hints | E1 |
| SRC-114 | GameSpot weapon evolutions | 17 evolution combination list and chest-choice context | E1 |
| SRC-115 | KeenGamer weapon evolutions | 17 evolution/union recipes, alternate ingredients, Grim Grimoire hint, ingredient-consumption wording | E1 |
| SRC-117 | VGC weapon evolution guide | Evolution trigger and Grim Grimoire context, recipe/effect hints | E1 |
| SRC-140 | PGG beginner systems crawl | Standard evolution requirements, trigger surfaces, gem-socket warning, `Destroyed after use` item-card warning, Holy Wand/Phieraggi/Vandalier examples, and internal PGG consumption conflict | E1 |
| SRC-127 | FRVR all cards list | Secondary full-card catalog table with cost/effect hints and Wild/temporary rows | E1 |
| SRC-128 | Dexerto Song of Mana individual card page | Sample individual-card schema for category, text, cost, gem slots, and evolution group | E1 |
| SRC-129 | Dexerto non-character card page crawl | 87 individual non-character card pages captured in `research/card-dexerto-page-crawl.md` | E1 |
| SRC-141 | Poncle official release FAQ crawl | Official-account broad `65+ cards` shorthand used only as a count-boundary conflict, not a final catalog table | E5 developer statement via social FAQ |
| SRC-142 | Official wiki API crawl | 113 unique `Infobox VC Card` pages with type breakdown, card fields, and official-wiki evolution/gem-slot context | E5 official wiki / not direct play |
| SRC-146 | Official wiki card/gem value extract | 113 official-wiki card rows with row-level cost, gem-slot, max-slot, demo, evolution-target, unlock-cost, crawler-duration, and keyword-bucket fields | E5 official wiki structured values / not direct play |

## Coverage Counter

| Segment | Known Total | Rows Collected | E2+ | E3+ | E4/E5 | Conflict / Missing |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Weapon unlock tasks | 18 | 18 | metadata partial | 0 | metadata partial | Effects/costs/runtime missing; some Steam public descriptions are vague |
| Item unlock tasks | 17 official metadata candidates | 17 | metadata partial | 0 | metadata partial | Effects/costs/runtime missing; Stone Mask appears in Steam achievements but not the previous Dexerto-derived item table |
| Evolution result rows | 17 | 17 | 17 secondary recipe mappings / 17 metadata names | 0 | 17 metadata names | Recipe ingredients now cross-source mapped, and PGG beginner systems crawl adds socket-block, trigger-surface, `Destroyed after use`, and consumption-conflict hints, but exact Grim Grimoire UI, costs, sockets, trigger, ingredient consumption, and runtime behavior remain missing |
| Full card catalog | 113 official-wiki card infobox rows, 90 official-wiki non-character rows, 87 Dexerto non-character candidates, and official 65+ public shorthand | 52 unlock/evolution rows + 35 Dexerto catalog-only rows + 90 wiki non-character rows + 113 official-wiki total rows | 113 official-wiki rows + 87 individual Dexerto page rows + `research/card-taxonomy-reconciliation.md` + secondary FRVR table + official shorthand boundary | 0 | 0 exact parity | `research/card-taxonomy-reconciliation.md` now separates 87 Dexerto, 90 official-wiki non-character, 113 official-wiki total, 23 character/Crawler, and official 65+ shorthand layers, but exact shipped UI text, whether wiki-only rows are collectible runtime cards, and CON-037 count taxonomy still need UI/direct/game-file proof |
| Wild/special/temporary cards | 15 source-level rows | 9 Wild + 6 Temporary | 15 secondary rows | 0 | 0 | Wild and temporary rows now have source-level names/effect hints, but exact behavior and spawn rules remain unresolved |
| Current implementation gap map | 52 + 35 catalog-only rows | 52 row-mapped + 35 secondary catalog-only | 87 catalog candidates tracked | 0 | 0 exact parity | `research/card-gap-map.md` maps the existing 52 unlock/evolution rows; `research/card-secondary-catalog.md` tracks 35 newly exposed catalog-only rows for later row-level implementation mapping |

## Secondary Full Card Catalog Map

`research/card-secondary-catalog.md` is the working source-level expansion for the Dexerto non-character card catalog, and `research/card-taxonomy-reconciliation.md` is now the count/layer reconciliation for 52 unlock/evolution rows, 87 Dexerto non-character rows, 90 official-wiki non-character rows, 113 official-wiki total rows, and official `65+ cards` shorthand. It keeps the existing 52 unlock/evolution rows intact and adds 35 catalog-only rows exposed by Dexerto and FRVR: six base attack cards, five defense variants, six stat/boost variants, three mana-book variants, nine Wild cards, and six temporary cards.

`research/card-dexerto-page-crawl.md` is the current 87-page Dexerto individual-card crawl baseline, and all 87 Dexerto non-character rows have normalized official-wiki name matches. `research/official-wiki-api-crawl.md` adds a larger official-wiki boundary: 113 unique card infobox rows, split into 23 character, 40 attack, 8 defense, 19 stat, 6 mana, 10 wild, and 7 temporary rows by primary infobox type. `research/card-taxonomy-reconciliation.md` isolates the 3 official-wiki-only non-character rows outside the Dexerto 87 boundary: `Angelo Spietato`, `Crystal Crown`, and `Rich Coin Bag`. `research/official-wiki-card-gem-field-crawl.md` adds card field coverage: 105 rows with `cost`, 97 with `gem slots`, 110 with `text`, 95 with unlock fields, 19 with `evointo`, 22 with `crawlertext`, 12 with `unlockcost`, and 20 with `crawlerduration`. `research/official-wiki-card-gem-value-extract.md` now stores the row-level structural values behind those counts: cost distribution `0`/`1`/`2`/`3`/`4`/`5`/`W`/missing, gem-slot distribution `0`/`1`/`2`/`3`/missing, 19 official-wiki `evointo` rows, and card keyword buckets without copying full effect prose. The wiki crawl also shows that category membership overlaps with primary type, so category totals must be de-duplicated before any final implementation table is built.

The official wiki improves the public catalog boundary, but it does not close card implementation parity. Missing official-wiki `cost` rows are now a direct-capture queue (`Divano`, `Big Coin Bag`, `Clover Petal`, `Coin Purse`, `Little Clover`, `Raw Mana`, `Rich Coin Bag`, and `Vacuum`), and missing official-wiki `gem slots` rows are mostly evolved/stat/temporary rows. `Mana Bomb` now has an official-wiki source-level cost candidate of `5`, and `research/card-taxonomy-reconciliation.md` marks it as the highest-priority Dexerto-vs-wiki field conflict, but it still needs UI/game-file confirmation before implementation. Every row still needs high-resolution UI, direct-play, or game-file confirmation for exact text, mana cost, color/category, gem slots, targeting, timing, unlock state, and runtime behavior.

This does not close card implementation parity. It only narrows the next proof target: every row still needs individual card-page, high-resolution UI, direct-play, or game-file confirmation for exact text, mana cost, color/category, gem slots, targeting, timing, unlock state, and runtime behavior.

`research/pgg-beginner-systems-crawl.md` adds evolution-process evidence only: base-card socket requirements, Evolution Statue/chest/boss reward surfaces, `Destroyed after use` item-card risk, and internal PGG wording conflict around whether standard evolutions consume support items. It should drive the next deck-before/deck-after capture, not implementation.

## Official Store Screenshot Card/Text Candidates

`research/steam-store-appdetails-crawl.md` adds 10 official Store screenshot rows. Readable card/UI candidates include `Knife` (`Deal 50 damage.`), `King Bible` (`Deal 391 damage. Cost+.`), `Garlic` (`Deal 99 damage to 5 enemies. Knockback. Copy.` and `Deal 124 damage to 5 enemies. Knockback. Reverse Combo.`), `Little Heart` (`Heal 1 HP. Destroy. Wild.`), `Hellfire` (`50% knockback chance. Evolved.`), `Pasqualina` (`Increase Hand by 1. (2 Duration) Crawler`), `Armor` (`Add 2 Armor.`), `Skull O'Maniac` (`Increase enemy strength 10%, gain additional XP.`), `Magic Wand` (`Deal 30 damage. Prioritize attackers.`), and `Wings` (`Reduce Mana cost ... cards in hand by 1.` partial). These are official media candidates only; screenshot `SS-09` also shows a `Development Build` marker, so every card text row still needs wiki/game-file/high-resolution video confirmation before implementation.

## Official Store Movie Frame Card/Text Candidates

`research/steam-store-movie-frame-crawl.md` adds a sampled official Store movie layer. Readable card candidates include `Bone` (`Deal 60 damage to multiple enemies.`), `Magic Wand` (`Deal 544 damage. Prioritize attackers.` in one trailer state), `Garlic` (`Deal 96 damage to the front row. Disarm.` and `Deal 34 damage to the front row. Disarm.` in another trailer-state frame), `Candella` (`Projectiles hit 20% more times.`), `Holy Wand` (`Deal 5,301 damage. Prioritize attackers. Evolved.`), the Evolved tooltip (`This Card is more powerful and shiny.`), `Runetracer` (`Bounces to deal more damage.` with several trailer-state damage values), `Santa Water` (`Burns enemies after this turn.`), `Phiera Der Tuphello` (`Deal 5,332 damage.`), `Whip` (`Deal 189 damage to multiple enemies.`), `Attractorb` (`Draw 8 cards.`), `Bracer` (`Increase Hand by 3` with a visible `FREE` marker), and partial `Hellfire`, `Soul Eater`, `Bracelet`, `Parm Aegis`, and `NO FUTURE` text candidates. These values must stay trailer-state candidates until game-file or direct/high-resolution gameplay proof separates level/stat scaling from base card text.

## Weapon Card Unlock Rows

| ID | Original Name | Type | Unlock Condition | Source | Evidence | Runtime Observation | Current Implementation | Gap | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WPN-001 | Song of Mana | weapon | Reach level 30 with Poppea Pecorina | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/sockets/runtime missing | 1차 수집 |
| WPN-002 | Pentagram | weapon | Reach level 35 | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/sockets/runtime missing; character unlock dependency | 1차 수집 |
| WPN-003 | Clock Lancet | weapon/defense-adjacent | Find and play Orologion | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/freeze behavior missing | 1차 수집 |
| WPN-004 | Shadow Pinion | weapon | Reach level 15 with Concetta Caciotta | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/sockets/runtime missing | 1차 수집 |
| WPN-005 | Celestial Dusting | weapon | Reach level 30 with O'Sole Meeo | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/sockets/runtime missing | 1차 수집 |
| WPN-006 | Cross | weapon | Find and play Rosary | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/sockets/runtime missing | 1차 수집 |
| WPN-007 | Gatti Amari | weapon | Reach level 15 with Giovanna Grana | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/sockets/runtime missing | 1차 수집 |
| WPN-008 | Cherry Bomb | weapon | Reach level 15 with Yatta Cavallo | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/sockets/runtime missing | 1차 수집 |
| WPN-009 | Phiera Der Tuphello | weapon | Reach level 20 with Pugnala Provola | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/sockets/runtime missing | 1차 수집 |
| WPN-010 | Eight The Sparrow | weapon | Reach level 15 with Pugnala Provola | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/sockets/runtime missing | 1차 수집 |
| WPN-011 | Bone | weapon | Reach level 5 with Mortaccio | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/bounce behavior missing | 1차 수집 |
| WPN-012 | Lightning Ring | weapon | Defeat 2,500 enemies | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/targeting missing | 1차 수집 |
| WPN-013 | Carrello | weapon | Destroy 5 mine carts | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/stage-object dependency missing | 1차 수집 |
| WPN-014 | Ebony Wings | weapon | Play Peachone once | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/union behavior missing | 1차 수집 |
| WPN-015 | Peachone | weapon | Reach level 25 | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/union behavior missing | 1차 수집 |
| WPN-016 | Garlic | weapon | Pick up 5 Floor Chickens | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/area behavior missing | 1차 수집 |
| WPN-017 | Fire Wand | weapon | Destroy 20 light sources | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/projectile behavior missing | 1차 수집 |
| WPN-018 | Runetracer | weapon | Reach level 10 with Pasqualina Belpaese | SRC-103 | E1 | 미검증 | no direct equivalent | Effect/cost/bounce behavior missing | 1차 수집 |

## Item Card Unlock Rows

| ID | Original Name | Type | Unlock Condition | Source | Evidence | Runtime Observation | Current Implementation | Gap | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ITM-001 | Bracelet | item/attack-adjacent | Reach combo 15+ | SRC-104 | E1 | 미검증 | no direct equivalent | Effect/cost/card role missing | 1차 수집 |
| ITM-002 | Parm Aegis | defense item | Reach combo 12+ | SRC-104 | E1 | 미검증 | no direct equivalent | Armor/defense behavior missing | 1차 수집 |
| ITM-003 | Friendship Amulet | stat/item | Reach combo 7+ | SRC-104 | E1 | 미검증 | no direct equivalent | Crawler/party interaction missing | 1차 수집 |
| ITM-004 | Wings | mana/stat item | Reach level 40 | SRC-104 | E1 | 미검증 | no direct equivalent | Effect/cost/card role missing | 1차 수집 |
| ITM-005 | Candelabrador | stat item | Play Santa Water 3 times | SRC-104 | E1 | 미검증 | no direct equivalent | Area scaling/evolution role missing | 1차 수집 |
| ITM-006 | Clover | stat item | Find and play 10 Little Clover cards | SRC-104 | E1 | 미검증 | no direct equivalent | Luck/wild relation missing | 1차 수집 |
| ITM-017 | Stone Mask | stat/economy item | Steam achievement says `Find and play a Stone Mask` | SRC-006 | E5 metadata | 미검증 | no direct equivalent | Exact card cost/color/effect and whether it belongs in the item-card catalog need UI/direct proof | 공식 메타데이터 수집 / 출처 충돌 |
| ITM-007 | Tirajisu | stat/defense item | Reach level 20 with Krochi Freetto | SRC-104 | E1 | 미검증 | no direct equivalent | Revive/defense behavior missing | 1차 수집 |
| ITM-008 | Duplicator | stat item | Play Magic Wand 25 times | SRC-104 | E1 | 미검증 | no direct equivalent | Projectile/amount behavior missing | 1차 수집 |
| ITM-009 | Skull O'Maniac | stat item | Reach level 30 with Lama Ladonna | SRC-104 | E1 | 미검증 | no direct equivalent | Curse behavior missing | 1차 수집 |
| ITM-010 | Attractorb | stat item | Find and play Vacuum | SRC-104 | E1 | 미검증 | no direct equivalent | Pickup/range behavior missing | 1차 수집 |
| ITM-011 | Pummarola | defense/recovery item | Reach level 10 with Gennaro Belpaese | SRC-104 | E1 | 미검증 | `heartVessel`/`redCup` are original-flavored only | Exact heal behavior missing | 1차 수집 |
| ITM-012 | Empty Tome | mana item | Collect 2 Mana Orbs | SRC-104 | E1 | 미검증 | `blankTome` is original-flavored only | Exact draw/mana/cost behavior missing | 1차 수집 |
| ITM-013 | Bracer | stat item | Play King Bible 99 times | SRC-104 | E1 | 미검증 | `quickBracer` is original-flavored only | Exact stat/evolution role missing | 1차 수집 |
| ITM-014 | Spellbinder | stat item | Play Runetracer 10 times | SRC-104 | E1 | 미검증 | `spellCord` is original-flavored only | Duration/evolution role missing | 1차 수집 |
| ITM-015 | Crown | stat item | Reach level 15 | SRC-104 | E1 | 미검증 | no direct equivalent | Growth/XP behavior missing | 1차 수집 |
| ITM-016 | Hollow Heart | stat/recovery item | Reach level 10 | SRC-104 | E1 | 미검증 | no direct equivalent | Max-health behavior missing | 1차 수집 |

## Evolution Recipe Rows

Steam achievement metadata confirms the 17 public `Discover ...` evolution names, while SRC-113, SRC-114, SRC-115, and SRC-117 now cross-source the recipe candidates. These rows are still not final card parity: exact in-game Grim Grimoire text, mana cost, color, socket count, trigger surface, duplicate handling, ingredient consumption, and runtime behavior need high-resolution video, direct play, or game-file proof.

| ID | Evolution Result | Recipe Candidate | Alternate / Union Notes | Secondary Effect Hint | Recipe Evidence | Runtime Observation | Current Implementation | Gap | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EVO-001 | Bloody Tear | Whip + Hollow Heart | Forever Heart also named by PGG/KeenGamer/VGC | AoE/front-row damage with crit-heal or lifesteal-like behavior | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | `redTear` placeholder | Exact UI text, cost, socket state, healing trigger, and ingredient consumption unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-002 | Death Spiral | Axe + Candle/Candella/Candelabrador | Alternate candle-family ingredients differ by source spelling | Front-row / wide damage with crit chance | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | `spiralCrescent` placeholder | Exact accepted ingredient names, damage, targeting, and evolution trigger unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-003 | Gorgeous Moon | Pentagram + Crown | Crown may be consumed/disappear if played before evolution | Enemy-clear / bonus-EXP style effect; mana cost may increase then reset | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | no direct equivalent | Exact effect, cost cycle, EXP behavior, and Crown consumption rule unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-004 | Heaven Sword | Cross + Clover | no alternate ingredient found in current secondary sources | Crit/projectile upgrade candidate | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | no direct equivalent | Exact projectile count, crit chance, cost, sockets, and targeting unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-005 | Hellfire | Fire Wand / Flame Wand + Spinach | Sprig o' Spinach also named by PGG/KeenGamer/VGC; Fire/Flame naming needs UI proof | Powerful fireballs / knockback candidate | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | `hellBloom` placeholder | Base-card spelling, exact damage, projectile behavior, and knockback unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-006 | Holy Wand | Magic Wand + Tome-family card | Empty Tome, Light Tome, Weighty Tome, Ancient Tome named as valid candidates | Multi-target / attacker-priority projectile candidate | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | `haloRod` placeholder | Accepted Tome variants, cost change, targeting priority, and repeated-fire behavior unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-007 | La Borra | Santa Water + Attractorb | no alternate Attractorb family source found yet | Damage-over-time/burn or stronger Santa Water pool effect | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | `deepRain` placeholder | Exact area pool, burn timing, damage, and Mana Chain scaling unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-008 | Mannajja | Song of Mana + Skull O'Maniac | Skull O'Maniac may disappear if played before evolution | Multi-enemy damage and chance to add mana/Wild cards | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | no direct equivalent | Exact added-card type, chance, cost, curse interaction, and ingredient consumption unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-009 | NO FUTURE | Runetracer + Armor-family card | Armor, Golden Armor, Rainbow Armor, Hero's Armor named as valid candidates | Runetracer bounce plus explosion/burst candidate | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | VID-012 shows a `NO FUTURE` card surface, but exact text/evolution state unreadable | `noTomorrow` placeholder | Accepted Armor variants, explosion trigger, cost, and runtime damage unresolved | 공식 메타데이터 / secondary recipe mapping / Partial E3 surface |
| EVO-010 | Phieraggi | Phiera Der Tuphello + Eight the Sparrow + Tirajisu/Tirajasú | Union recipe; secondary sources say all three cards are consumed | Combined-gun high-damage evolution | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | no direct equivalent | Exact accent/spelling, union UI, consumed-card list, cost, and projectile behavior unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-011 | Soul Eater | Garlic + Pummarola | Pummadora also named by PGG/KeenGamer/VGC | Stronger Garlic-area damage with heal/disarm chance | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | `soulScent` placeholder | Exact aura shape, heal/disarm trigger, accepted ingredient names, and cost unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-012 | Thousand Edge | Knife + Bracer | no alternate ingredient found in current secondary sources | Heavy/front-row or all-enemy damage candidate | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | `thousandShard` placeholder | Exact hit count, target set, cost, sockets, and Bracer mutation unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-013 | Thunder Loop | Lightning Ring / Thunder Ring + Duplicator | GameSpot says Thunder Ring; other rows use Lightning Ring | Lightning attack that can repeat at end of turn | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | no direct equivalent | Base-card naming, repeat timing, damage, and Amount interaction unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-014 | Unholy Vespers | King Bible + Spellbinder | no alternate ingredient found in current secondary sources | Stronger Bible projectiles with knockback candidate | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | `vesperRing` placeholder | Exact duration/projectile count, knockback chance, and cost unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-015 | Valkyrie Turner | Shadow Pinion + Wings | no alternate ingredient found in current secondary sources | Front-row damage and hand-buff candidate | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | no direct equivalent | Exact hand buff, timing, damage, and Wings card role unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-016 | Vandalier | Peachone + Ebony Wings | Union recipe; VGC says no extra item card is required | Bird fusion / burst damage / stop-attack candidate | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | no direct equivalent | Union UI, consumed cards, active-bird interaction, and exact effect unresolved | 공식 메타데이터 / secondary recipe mapping |
| EVO-017 | Vicious Hunger | Gatti Amari + Stone Mask | Stone Mask is also an official achievement-backed item candidate | Higher Gatti damage with chance to turn enemies into coins | SRC-006, SRC-113, SRC-114, SRC-115, SRC-117 | 미검증 | no direct equivalent | Stone Mask catalog membership, coin conversion chance, damage, and Greed/economy interaction unresolved | 공식 메타데이터 / secondary recipe mapping |

## Required Completion

- Extract the full card catalog from game UI or individual card pages, not just unlock tasks.
- Add exact mana cost/color, card text, numeric effects, targeting, socket count, cooldown/instant behavior, tags, unlock, and evolution links.
- Give every card at least E2 static confirmation.
- Give every card E3 video or E4 direct-play evidence for actual behavior.
- Separate Wild, temporary, crawler, weapon, item, stat, mana, defense, and evolved cards.
