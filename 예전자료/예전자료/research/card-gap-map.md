# Card Implementation Gap Map

Status: `official metadata collected / secondary evolution recipe mapping / secondary full-card catalog mapping / card taxonomy reconciliation / official wiki value extract / official Store movie text candidates / row-level current implementation gap-mapped`
Last updated: 2026-05-22

This file maps collected Vampire Crawlers card and evolution candidates against the current prototype implementation. It is intentionally conservative: a prototype card with a similar role, ingredient, or resulting concept is not counted as original-accurate until original name, mana cost, color, card text, sockets, targeting, unlock, evolution recipe, and runtime behavior are verified from game UI, video, direct play, or game files.

## Source Basis

| Source ID | Source | Use | Grade |
| --- | --- | --- | --- |
| SRC-006 | Steam Community achievements page | Official public achievement metadata for many card unlocks and all public `Discover ...` evolution achievements | E5 metadata |
| SRC-103 | Dexerto weapon card unlocks | 18 weapon-card unlock rows | E1 |
| SRC-104 | Dexerto item card unlocks | 16 guide item-card unlock rows | E1 |
| SRC-102 / SRC-69 | Dexerto card/evolution indexes | Category presence and 17 evolution result names | E1 |
| SRC-113/SRC-114/SRC-115/SRC-117 | PGG, GameSpot, KeenGamer, and VGC evolution guides | 17 secondary recipe mappings, alternate ingredient hints, and evolution trigger/Grim Grimoire context | E1/E2 source-level where guide claims agree |
| SRC-140 | PGG beginner systems crawl | Evolution requirements, socket-block warning, trigger surfaces, `Destroyed after use` item-card risk, and internal standard-evolution consumption conflict | E1 |
| SRC-127 | FRVR all cards list | Secondary full-card catalog table with cost/effect hints and Wild/temporary rows | E1 |
| SRC-128 | Dexerto Song of Mana individual card page | One-card individual page schema sample for exact category, text, cost, gem slots, and evolution fields | E1 |
| SRC-129 | Dexerto non-character card page crawl | 87 individual card-page rows stored in `research/card-dexerto-page-crawl.md` | E1 |
| SRC-141 | Poncle official release FAQ crawl | Official-account broad `65+ cards` shorthand used as count-boundary conflict context | E5 developer statement via social FAQ |
| SRC-146 | Official wiki card/gem value extract | Row-level official-wiki cost, gem-slot, max-slot, demo, evolution-target, unlock-cost, crawler-duration, and keyword-bucket fields for 113 card infobox rows | E5 official wiki structured values / not direct play |
| SRC-145 | Steam Store movie frame crawl | Official Store movie/frame candidates for readable card costs/text, evolved-card tooltip, Arcana-related card/event surfaces, and rejected marketing-only frames | E5 official media candidate |
| derived | Card taxonomy reconciliation | `research/card-taxonomy-reconciliation.md` separates 52 unlock/evolution rows, 87 Dexerto non-character rows, 90 official-wiki non-character rows, 113 official-wiki total rows, 23 character/Crawler rows, and official `65+ cards` shorthand | Source-level reconciliation / not direct play |
| VID-001/002/003/004/005/006/007/008/009/010/011/012 | Storyboard gameplay videos | Partial reward/card-use/evolution-adjacent surfaces | E3 partial |
| local implementation audit | `src/content/crawler-clone.js`, `src/rules/cards.js`, `src/rules/card-effects.js`, `src/rules/crawler-dungeon.js` | Current prototype card data and runtime behavior | Local implementation evidence |

## Coverage Counter

| Segment | Rows | Current exact 1:1 implemented | Placeholder-adjacent rows | Current status |
| --- | ---: | ---: | ---: | --- |
| Weapon unlock rows | 18 | 0 | 0 | Unlock names/conditions collected; exact original cost/effect/runtime missing |
| Item/stat/mana unlock rows | 17 | 0 | 4 | 16 guide item rows plus Stone Mask official metadata row; only Pummarola, Empty Tome, Bracer, and Spellbinder have prototype-adjacent current cards |
| Evolution result rows | 17 | 0 | 9 | 17 Steam metadata names now have secondary source-level recipe mappings; PGG beginner systems crawl adds socket-block, trigger-surface, `Destroyed after use`, and consumption-conflict hints; current prototype has 9 original-flavored evolutions but no verified original UI/effect/deck-mutation parity |
| Total row-mapped unlock/evolution candidates | 52 | 0 | 13 | Existing row map covers 35 unlock-style rows plus 17 evolution rows |
| Secondary full non-character catalog candidates | 87 Dexerto non-character rows plus 90 official-wiki non-character rows, official 65+ shorthand, and 113 official-wiki total card rows | 0 | 13 within the existing 52 only | `research/card-secondary-catalog.md` adds 35 catalog-only rows, `research/card-dexerto-page-crawl.md` captures 87 individual page rows, and `research/card-taxonomy-reconciliation.md` separates 87 Dexerto matches, 3 official-wiki-only non-character rows, 23 character/Crawler rows, and official count shorthand; all need direct UI/game-file proof before final parity |
| Wild/special/temporary rows | 15 secondary rows | 0 | 0 | Source-level names/effect hints now exist for 9 Wild and 6 Temporary rows, but behavior and spawn rules remain unresolved |
| Current crawler-clone prototype cards | 30 | 0 | 13 | 10 weapons, 9 items, 1 wild, 9 evolved, 1 character/engine card; all are prototype-local |

## Secondary Catalog Expansion

`research/card-secondary-catalog.md` tracks the wider public-source catalog boundary that was not represented by unlock rows alone, and `research/card-dexerto-page-crawl.md` stores the 87 individual card-page crawl. `research/card-taxonomy-reconciliation.md` now reconciles those rows against the 90 official-wiki non-character rows, the 113 official-wiki total card rows, and official `65+ cards` shorthand while keeping 23 character/Crawler rows separate. `research/official-wiki-card-gem-value-extract.md` adds official-wiki structural values for all 113 card rows: cost, gem slots, max slots, demo flag, evolution target/group, unlock cost, Crawler duration, and keyword buckets without copying full effect prose. `research/pgg-beginner-systems-crawl.md` adds process-level evolution/socket/deck-mutation hints only. `research/steam-store-movie-frame-crawl.md` adds official Store movie-frame text candidates, including exact-looking card costs/effects and evolved-card tooltip snippets, but trailer-state numbers are still candidates until reconciled against UI, files, or direct capture. The current implementation gap map remains exact-parity `0`: the newly exposed rows, Store frame values, and evolution-process hints are source-level candidates, not implementation-approved content.

## Current Prototype Surface

| Surface | Current behavior | Why it is not final parity |
| --- | --- | --- |
| `crawlerCloneConfig.cards` | Defines 30 prototype cards with local names, costs, colors, categories, sockets, text, and numeric effects | Original card list, costs, colors, texts, socket counts, targeting, and exact effects are not verified |
| `crawlerCloneConfig.evolutions` | Defines 9 prototype recipes using local base/ingredient/result ids | Original recipes, ingredients, evolution UI, and resulting card behavior are not verified |
| `cards.js` / `cardCost()` / `cardNumbers()` | Applies prototype costs, upgrades, gem deltas, and numeric card profiles | Original timing, auto-use order, cost exceptions, and balance formulas are unknown |
| `card-effects.js` / `applyGenericCardEffects()` | Applies generic damage, shield, heal, draw, mana, burn, echo, and trigger effects | Original per-card targeting/projectile/status behavior is missing |
| `crawler-dungeon.js` reward/evolution flow | Drafts prototype cards, sockets gems, and evolves prototype recipes at reward/station surfaces | Original card reward pools, rerolls/skips, valid evolution conditions, and deck mutation rules remain unresolved |

## Per-Card Gap Rows

| ID | Original candidate | Collected unlock/proof | Current implementation surface | Parity | Current gap | Required proof |
| --- | --- | --- | --- | --- | --- | --- |
| WPN-001 | Song of Mana | Reach level 30 with Poppea Pecorina | No direct equivalent | No | Cost, color, area/line behavior, sockets, and runtime targeting missing | Card catalog UI plus in-combat use and unlock proof |
| WPN-002 | Pentagram | Reach level 35; also character dependency for Christine | No direct equivalent | No | Destroy/clear behavior, cost, sockets, and unlock dependency missing | Card text, use result, unlock popup, and Christine dependency proof |
| WPN-003 | Clock Lancet | Find and play Orologion | No direct equivalent | No | Freeze/status timing, targeting, cost, sockets missing | Orologion pickup/use plus frozen enemy proof |
| WPN-004 | Shadow Pinion | Reach level 15 with Concetta Caciotta | No direct equivalent | No | Movement/placement/projectile behavior missing | Card UI and runtime path/targeting proof |
| WPN-005 | Celestial Dusting | Reach level 30 with O'Sole Meeo | No direct equivalent | No | Targeting, summon/projectile, cost, sockets missing | Card UI plus representative combat proof |
| WPN-006 | Cross | Find and play Rosary | No direct equivalent | No | Projectile/return targeting, cost, sockets missing | Rosary pickup/use and Cross runtime proof |
| WPN-007 | Gatti Amari | Reach level 15 with Giovanna Grana | No direct equivalent | No | Cat/random behavior, cost, sockets, evolution relation missing | Card text and multi-use combat proof |
| WPN-008 | Cherry Bomb | Reach level 15 with Yatta Cavallo | No direct equivalent | No | Bomb/bounce/explosion behavior missing | Card text plus explosion runtime proof |
| WPN-009 | Phiera Der Tuphello | Reach level 20 with Pugnala Provola | No direct equivalent | No | Projectile direction, paired-union behavior, cost, sockets missing | Card UI, use proof, and Phieraggi relation proof |
| WPN-010 | Eight The Sparrow | Reach level 15 with Pugnala Provola | No direct equivalent | No | Projectile direction, paired-union behavior, cost, sockets missing | Card UI, use proof, and Phieraggi relation proof |
| WPN-011 | Bone | Reach level 5 with Mortaccio | No direct equivalent | No | Bounce behavior, target priority, cost, sockets missing | Card use proof with bounce/path evidence |
| WPN-012 | Lightning Ring | Defeat 2,500 enemies | No direct equivalent | No | Strike targeting, enemy-count unlock, cost, sockets missing | Enemy-count unlock plus lightning target proof |
| WPN-013 | Carrello | Destroy 5 mine carts | No direct equivalent | No | Mine-cart dependency and card behavior missing | Mine-cart proof plus Carrello use proof |
| WPN-014 | Ebony Wings | Play Peachone once | No direct equivalent | No | Bird/summon/union behavior missing | Peachone dependency and Ebony Wings runtime proof |
| WPN-015 | Peachone | Reach level 25 | No direct equivalent | No | Bird/summon/union behavior missing | Card UI, repeated use, and Vandalier relation proof |
| WPN-016 | Garlic | Pick up 5 Floor Chickens | No direct equivalent | No | Area aura, chicken pickup unlock, cost, sockets missing | Pickup counter and aura combat proof |
| WPN-017 | Fire Wand | Destroy 20 light sources | No direct equivalent | No | Fire projectile targeting, cost, sockets missing | Light-source counter and card runtime proof |
| WPN-018 | Runetracer | Reach level 10 with Pasqualina Belpaese | No direct equivalent | No | Bounce/path behavior and NO FUTURE relation missing | Card text, bounce runtime, and evolution proof |
| ITM-001 | Bracelet | Reach combo 15+ | No direct equivalent | No | Attack-adjacent role, cost, effect, sockets missing | Combo unlock plus card use proof |
| ITM-002 | Parm Aegis | Reach combo 12+ | No direct equivalent | No | Armor/defense effect, cost, sockets missing | Combo unlock plus armor behavior proof |
| ITM-003 | Friendship Amulet | Reach combo 7+ | No direct equivalent | No | Crawler/party interaction and trigger rules missing | Combo unlock plus party/crawler effect proof |
| ITM-004 | Wings | Reach level 40 | No direct equivalent | No | Mana/stat effect, cost, role missing | Level unlock plus effect text/runtime proof |
| ITM-005 | Candelabrador | Play Santa Water 3 times | No direct equivalent | No | Area scaling/evolution ingredient role missing | Santa Water dependency and stat-effect proof |
| ITM-006 | Clover | Find and play 10 Little Clover cards | No direct equivalent | No | Luck/wild relation, cost, role missing | Clover card text and reward/trigger effect proof |
| ITM-017 | Stone Mask | Steam achievement says `Find and play a Stone Mask` | No direct equivalent | No | Exact catalog membership, cost, color, and economy effect missing | In-game Stone Mask card UI and use proof |
| ITM-007 | Tirajisu | Reach level 20 with Krochi Freetto | No direct equivalent | No | Revive/defense behavior missing | Unlock proof plus death/revive or card-use proof |
| ITM-008 | Duplicator | Play Magic Wand 25 times | No direct equivalent | No | Projectile/amount behavior and evolution role missing | Magic Wand dependency and amount/runtime proof |
| ITM-009 | Skull O'Maniac | Reach level 30 with Lama Ladonna | No direct equivalent | No | Curse behavior and stat effect missing | Curse stat UI and card runtime/progression proof |
| ITM-010 | Attractorb | Find and play Vacuum | No direct equivalent | No | Pickup/range behavior missing | Vacuum proof plus pickup/range effect proof |
| ITM-011 | Pummarola | Reach level 10 with Gennaro Belpaese | `heartVessel`/`redCup` recovery concepts only | Placeholder only | Exact heal behavior, cost, color, and Soul Eater relation missing | Pummarola card UI and repeated healing proof |
| ITM-012 | Empty Tome | Collect 2 Mana Orbs | `blankTome` draw/engine concept only | Placeholder only | Exact draw/mana/cost behavior and Holy Wand relation missing | Empty Tome card UI plus cost/draw proof |
| ITM-013 | Bracer | Play King Bible 99 times | `quickBracer` speed/engine concept only | Placeholder only | Exact stat effect and Thousand Edge relation missing | Bracer UI plus before/after stat/runtime proof |
| ITM-014 | Spellbinder | Play Runetracer 10 times | `spellCord` duration concept only | Placeholder only | Exact duration effect and Unholy Vespers relation missing | Spellbinder UI plus duration comparison proof |
| ITM-015 | Crown | Reach level 15 | No direct equivalent | No | Growth/XP behavior missing | XP stat/effect proof and unlock proof |
| ITM-016 | Hollow Heart | Reach level 10 | No direct equivalent | No | Max-health behavior and Bloody Tear relation missing | Max HP before/after proof and card UI |
| EVO-001 | Bloody Tear | `Discover Bloody Tear`; secondary recipe Whip + Hollow Heart / Forever Heart | `redTear` placeholder | Placeholder only | Recipe is source-level mapped, but exact UI text, cost, socket state, crit-heal trigger, and ingredient consumption unresolved | Grim Grimoire/evolution UI plus before/after deck and runtime healing proof |
| EVO-002 | Death Spiral | `Discover Death Spiral`; secondary recipe Axe + Candle/Candella/Candelabrador | `spiralCrescent` placeholder | Placeholder only | Recipe is source-level mapped, but accepted candle-family names, damage, crit, targeting, and trigger unresolved | Grim Grimoire/evolution UI plus runtime effect proof |
| EVO-003 | Gorgeous Moon | `Discover Gorgeous Moon`; secondary recipe Pentagram + Crown | No direct equivalent | No | Recipe is source-level mapped; result/effect/cost-cycle/EXP behavior and Crown consumption unresolved | Evolution UI and resulting card proof |
| EVO-004 | Heaven Sword | `Discover Heaven Sword`; secondary recipe Cross + Clover | No direct equivalent | No | Recipe is source-level mapped; projectile count, crit chance, cost, sockets, and targeting unresolved | Evolution UI and resulting card proof |
| EVO-005 | Hellfire | `Discover Hellfire`; secondary recipe Fire/Flame Wand + Spinach / Sprig o' Spinach | `hellBloom` placeholder | Placeholder only | Recipe is source-level mapped; Fire/Flame naming, fireball damage, pierce/knockback, and cost unresolved | Evolution UI plus Hellfire card use proof |
| EVO-006 | Holy Wand | `Discover Holy Wand`; secondary recipe Magic Wand + Tome-family card | `haloRod` placeholder | Placeholder only | Recipe is source-level mapped; accepted Tome variants, attacker priority, cost, and repeated-fire behavior unresolved | Evolution UI plus repeated-fire proof |
| EVO-007 | La Borra | `Discover La Borra`; secondary recipe Santa Water + Attractorb | `deepRain` placeholder | Placeholder only | Recipe is source-level mapped; area-pool, burn timing, damage, and Mana Chain scaling unresolved | Evolution UI plus area-pool runtime proof |
| EVO-008 | Mannajja | `Discover Mannajja`; secondary recipe Song of Mana + Skull O'Maniac | No direct equivalent | No | Recipe is source-level mapped; added-card type, chance, damage, curse interaction, and Skull O'Maniac consumption unresolved | Evolution UI and resulting card proof |
| EVO-009 | NO FUTURE | `Discover NO FUTURE`; secondary recipe Runetracer + Armor-family card; VID-012 surface | `noTomorrow` placeholder | Placeholder only | Recipe is source-level mapped; accepted Armor variants, bounce/explosion trigger, cost, and runtime damage unresolved | Evolution UI plus NO FUTURE runtime proof |
| EVO-010 | Phieraggi | `Discover Phieraggi`; secondary union recipe Phiera Der Tuphello + Eight the Sparrow + Tirajisu/Tirajasú | No direct equivalent | No | Union recipe is source-level mapped; exact spelling/accent, union UI, consumed-card list, cost, and projectile behavior unresolved | Paired weapon union UI and runtime proof |
| EVO-011 | Soul Eater | `Discover Soul Eater`; secondary recipe Garlic + Pummarola / Pummadora | `soulScent` placeholder | Placeholder only | Recipe is source-level mapped; aura shape, heal/disarm trigger, accepted ingredient name, and cost unresolved | Evolution UI plus healing/aura proof |
| EVO-012 | Thousand Edge | `Discover Thousand Edge`; secondary recipe Knife + Bracer | `thousandShard` placeholder | Placeholder only | Recipe is source-level mapped; hit count, target set, cost, sockets, and Bracer mutation unresolved | Evolution UI plus rapid-hit runtime proof |
| EVO-013 | Thunder Loop | `Discover Thunder Loop`; secondary recipe Lightning/Thunder Ring + Duplicator | No direct equivalent | No | Recipe is source-level mapped; Lightning/Thunder naming, repeat timing, damage, and Amount interaction unresolved | Evolution UI and resulting card proof |
| EVO-014 | Unholy Vespers | `Discover Unholy Vespers`; secondary recipe King Bible + Spellbinder | `vesperRing` placeholder | Placeholder only | Recipe is source-level mapped; projectile count, duration behavior, knockback chance, and cost unresolved | Evolution UI plus persistent-orbit runtime proof |
| EVO-015 | Valkyrie Turner | `Discover Valkyrie Turner`; secondary recipe Shadow Pinion + Wings | No direct equivalent | No | Recipe is source-level mapped; hand buff, front-row damage, timing, and Wings card role unresolved | Evolution UI and resulting card proof |
| EVO-016 | Vandalier | `Discover Vandalier`; secondary union recipe Peachone + Ebony Wings | No direct equivalent | No | Union recipe is source-level mapped; consumed cards, active-bird interaction, stop-attack behavior, and exact effect unresolved | Union UI plus bird/evolved card proof |
| EVO-017 | Vicious Hunger | `Discover Vicious Hunger`; secondary recipe Gatti Amari + Stone Mask | No direct equivalent | No | Recipe is source-level mapped; Stone Mask catalog membership, coin conversion chance, damage, and economy interaction unresolved | Evolution UI plus resulting card proof |

## Required Completion

- Extract the complete original card catalog from game UI, game files, or high-trust individual card pages; unlock rows alone are not the full catalog.
- For every confirmed card, record exact name, type/category, color, mana cost, socket count, card text, numeric effect, targeting, timing, unlock condition, and runtime behavior.
- For every evolution, verify base card, ingredient card, any socket/gem requirement, UI trigger, result card, duplicate handling, and before/after deck mutation.
- Add row-level video or direct-play proof for each card family: weapon, item/stat, mana, defense, wild/special, temporary, crawler cards, and evolved cards.
- Keep implementation approval closed until every row has exact current file/function parity and a testable acceptance condition.
