# Gem Data

Status: `official metadata collected / Dexerto unlock-table crawl / official wiki API crawl / official wiki value extract / gem taxonomy reconciliation / secondary effect-family mapping / current implementation gap-mapped`

Dexerto and Steam achievement metadata provide 49 gem unlock rows. The official wiki API crawl exposes a larger 58-row gem infobox catalog with rarity and reward-pool weights, and the official wiki field/value crawls confirm all 58 gem pages expose `text` and `unlocked by` fields while preserving row-level rarity/demo/unlock/keyword buckets. The official Steam news crawl adds high-level gem-as-card-modifier/evolution context and confirms Echo gem as a shipped patch-fix target, but not its exact behavior. Destructoid and SportsRant provide a separate effect-family layer, but some effect labels do not map cleanly to the unlock labels. This table separates `Unlock Evidence`, `Effect Evidence`, rarity/pool evidence, and runtime proof instead of merging them prematurely.

Generated official wiki card/gem field crawl: [`official-wiki-card-gem-field-crawl.md`](./official-wiki-card-gem-field-crawl.md).
Generated official wiki card/gem value extract: [`official-wiki-card-gem-value-extract.md`](./official-wiki-card-gem-value-extract.md).
Generated gem taxonomy reconciliation: [`gem-taxonomy-reconciliation.md`](./gem-taxonomy-reconciliation.md).
Generated official Steam news crawl: [`official-steam-news-crawl.md`](./official-steam-news-crawl.md).
Generated Steam Store appdetails/media crawl: [`steam-store-appdetails-crawl.md`](./steam-store-appdetails-crawl.md).
Generated Steam Store movie frame crawl: [`steam-store-movie-frame-crawl.md`](./steam-store-movie-frame-crawl.md).

## Source Basis

| Source ID | Source | Used For | Current Grade |
| --- | --- | --- | --- |
| SRC-105 | Dexerto gem unlock list | 49 unlock rows | E1 |
| SRC-131 | Dexerto gem unlock table crawl | Generated 49-row `Item` / `How to Get` extraction and page-boundary note | E1 |
| SRC-205 | Destructoid gem effects article | Gem effect names, short behavior descriptions, and card-modifier context | E1 |
| SRC-122 | SportsRant gem guide | Major gem effect-family taxonomy and card-attachment context | E1 |
| SRC-123 | GAMES.GG Jeweler guide | Jeweler rarity/sealing context and Luck interaction | E1 |
| SRC-138 | GamerBlurb Trickster page crawl | Generated `Uncrackable Gem` anti-shatter reward context from Trickster defeat | E1 |
| SRC-139 | Nintendo Wire Trickster page crawl | Generated `Unbreakable Gem` reward-label conflict and anti-break description | E1 |
| SRC-001 | Steam store page | Official claim that gems augment cards and chests can provide gems | E5 for high-level rule only |
| SRC-004 | Steam Store API appdetails / media crawl | Official Store screenshot `SS-08` captures the `Choose a Gem` screen, rarity labels, reroll/skip/banish counters, and three readable gem effect candidates | E5 official Store media for visible UI candidates only |
| SRC-145 | Steam Store movie / frame crawl | Official Store movie frames expose card modifier text candidates such as `FREE`, `Wild Return`, `Wild Amount`, `Cost+`, `Recover`, and high-card/combo surfaces that may come from gems or other modifiers | E5 official Store media for visible UI candidates only |
| SRC-141 | Poncle official release FAQ crawl | Official-account broad `50+ gems` shorthand used only as count-boundary context | E5 developer statement via social FAQ |
| SRC-142 | Official wiki API crawl | 58 gem infobox rows, rarity split, level-up/chest rarity weights, and Evolution gem behavior | E5 official wiki / not direct play |
| SRC-146 | Official wiki card/gem value extract | 58 official-wiki gem rows with row-level display name, rarity, demo flag, unlock field, text-presence, and keyword buckets; confirms duplicate cost-gem display-name rows | E5 official wiki structured values / not direct play |
| SRC-143 | Steam official news crawl | Official gem card-customization/evolution context and `Hotfix 1.4.1` Echo gem crash-fix note | E5 official announcement / patch-note metadata |
| SRC-303 / SRC-304 | Reddit gem rarity and sealing discussions | Rarity/pool/sealing hypotheses | E0-E1 |
| SRC-006 | Steam Community achievements page | 49 public gem achievement names/descriptions and unlock percentages | E5 metadata |

## Coverage Counter

| Segment | Known Total | Rows Collected | E2+ | E3+ | E4/E5 | Conflict / Missing |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Gem unlock rows / catalog rows | 49 unlock rows plus official 50+ shorthand plus 58 official-wiki infobox rows | 49 unlock rows + 58 wiki rows | 49 metadata + 49 Dexerto crawl rows + official shorthand boundary + official wiki catalog boundary/value extract + taxonomy reconciliation | 0 | 49 metadata + 58 official-wiki rows | `research/gem-taxonomy-reconciliation.md` maps 47 public rows directly to wiki rows, isolates 2 public `Mana Cost` buckets, and separates 11 wiki-only/cost-variant rows; Steam descriptions are often vague, Dexerto row 46 uses `X Mana Gem`, Steam ACH-159 uses `Mana X Damage Gem`, and the official-wiki value extract exposes `X Mana`; UI/game-file confirmation is still required |
| Gem effects | 49 unlock rows / 43 visible effect-family labels plus variants | 43 effect-family labels + 49 unlock rows | major families cross-source | 0 | 0 | 49-to-43 mapping and variant naming unresolved |
| Gem rarity/pools | 58 official-wiki rows with rarity split and pool weights | 58 wiki rows + level-up/chest rarity tables | official wiki rarity and pool tables + secondary rarity controls | 0 | official wiki only | Exact current-build formula, Luck math, chest-tier mapping, Evolution exception, and runtime pool behavior still need gameplay/direct evidence |
| Socket/attachment behavior | 미확정 | secondary card-attachment and Blacksmith/Jeweler context | card attachment cross-source | 0 | 0 | Needs exact UI/runtime evidence for targets, replacement, cancel, and persistence |
| Current implementation gap map | 49 | 49 | 49 mapped | 0 | 0 exact parity | `research/gem-gap-map.md` maps every collected gem row to current prototype surfaces; all remain unapproved for original parity |

## Official Wiki Rarity / Pool Snapshot

`research/official-wiki-api-crawl.md` adds a row-level official-wiki boundary that is larger than the Steam/Dexerto unlock table: 58 gem infobox rows with a rarity split of 9 Common, 12 Uncommon, 20 Rare, 8 Very Rare, and 9 Ultra Rare. It also preserves level-up weights (Common 60, Uncommon 30, Rare 20, Very Rare 2, Ultra Rare 0) and treasure-chest rarity weights (Common 100, Uncommon 80, Rare 50, Very Rare 60, Ultra Rare 40 across Tier 1-3 chest pools). `research/official-wiki-card-gem-field-crawl.md` confirms all 58 gem rows have `text` and `unlocked by` fields, and `research/official-wiki-card-gem-value-extract.md` stores each row's rarity/demo/unlock/keyword buckets. The value extract preserves two duplicate display-name boundaries: `Increase Mana Cost` (+1/+2) and `Reduce Mana Cost` (-1/-2), and it exposes the official-wiki display name `X Mana` as an Ultra Rare row.

`research/gem-taxonomy-reconciliation.md` narrows the 49-vs-58-vs-50+ count conflict without closing it: 47 public Steam/Dexerto rows match official-wiki names directly; public `Mana Cost Gems` / `Mana Cost Gems 2` remain unmatched buckets; the official wiki adds 7 Gem-Hammer/default-style rows (`Amount`, `Area`, `Armor`, `Double Damage`, `Draw`, `Evolution`, `Might`) and 4 cost-modifier rows (`Increase Mana Cost` +1/+2 and `Reduce Mana Cost` -1/-2). This improves rarity/pool planning but does not close direct proof. The next verification still needs current-build UI/game-file confirmation for the count boundary, exact gem text, valid card targets, chest-tier labels, Luck formula, Evolution gem exceptions, socket replacement/cancel behavior, and runtime effects.

## Secondary Effect-Family Map

This section is a source-level planning aid only. It does not replace per-gem UI proof, because the 49 unlock rows and the visible effect-family list are not a clean one-to-one table yet.

| Family | Effect labels currently supported by secondary sources | Evidence | Still missing before implementation |
| --- | --- | --- | --- |
| Damage/stat scaling | Amount, Area, Might, Double Damage, Triple Damage, Decimate, Nduja, Kill Count, Leader, Armor Strike | SRC-205, SRC-122 | Exact row mapping for Amount/Area/Might variants, formulas, stacking, target selection, and stat timing |
| Mana/cost/card flow | Draw, Copy, Echo, Magnetic, Quick Draw, Retain, Return, Recycle, Countdown, Refund, Mana Rebate, Reduce Mana Cost -1/-2, Increase Mana Cost +1/+2 | SRC-205, SRC-122 | Which unlock rows map to each cost variant, draw timing, hand/discard zones, and refund/rebate edge cases |
| Trigger/combo/color | Purple Trigger, Yellow Trigger, Rainbow, Easy Combo, Reverse Combo, Wild, Yin Yang | SRC-205, SRC-122 | Blue/Red trigger exact effect text, color-trigger stacking, combo exception rules, and Yin/Yang row split |
| Utility/status/healing | Armor, Freeze, Drain, Healing/Restore Health, Duration, Destroy, Evolution | SRC-205, SRC-122 | Whether Healing is a standalone family or only Restore Health/Drain wording, valid targets, encounter-end timing, and evolution socket rules |
| Economy/summon | Coin Card, Greed, Midas, Mug, Magic Hat, Crawler Caller, Bombard | SRC-205, SRC-122 | Coin-shard/card behavior, in-hand conditions, summon timing, bomb runtime, and economy formulas |
| Open label gaps | Fireproof, Calcium, Free To Play, Coin Count, Luck, Remote, Uncrackable, X Mana / Mana X Damage, Mild, Blue Trigger, Red Trigger | SRC-006, SRC-105, SRC-131, partial SRC-205/SRC-122 context | Exact in-game gem effect text and whether each is a unique effect, a renamed family, or a source-label mismatch |

## Official Store Screenshot Gem Candidates

`research/steam-store-appdetails-crawl.md` adds one high-resolution official Store media row for the gem-choice UI: `SS-08` shows `Choose a Gem`, rarity labels `Normal`, `Polished`, and `Normal`, the buttons `Reroll 0 Left`, `Skip 0 Left`, `Banish 0 Left`, `Leave`, and `Cash Out`, plus three readable effect candidates: `Earns money when the card kills an enemy.`, `When the card is drawn, it stays in Hand until used.`, and `Increases Area stat.` This is useful for UI wording and effect-family capture only; the screenshot does not expose final gem names and cannot resolve rarity pools, valid targets, socket replacement, or runtime behavior by itself.

## Official Store Movie Modifier Candidates

`research/steam-store-movie-frame-crawl.md` adds official movie frames with visible modifier words on cards and stacks, including `FREE`, `Wild Return`, `Wild Amount`, `Cost+`, and `Recover`. These are useful for the gem/effect-family capture queue, especially Free, Return, Amount, and cost-modifier families. The frames do not prove whether a visible modifier comes from a gem, an Arcana, a temporary card, a level/stat state, or another source, so no gem row is closed by this evidence alone.

## Gem Unlock Rows

| ID | Original Name | Unlock Condition | Effect Mapping | Runtime Effect | Valid Card Types | Rarity / Pool | Evidence | Current Implementation | Gap | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GEM-001 | Nduja Gem | Defeat Nesufritto | Destructoid has Nduja effect label | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Effect/rules missing | 1차 수집 |
| GEM-002 | Fireproof Gem | Complete Curd Refinery | no direct effect label found yet | 미검증 | 미확정 | 미확정 | SRC-105 E1 | no direct equivalent | Effect/rules missing | 1차 수집 |
| GEM-003 | Crawler Caller Gem | Complete Library Sanctum | Crawler Caller | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Crawler hand summon behavior missing | 1차 수집 |
| GEM-004 | Yin Yang Gem | Complete Berserk Wood | Yin Yang | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Even/odd mana behavior needs verification | 1차 수집 |
| GEM-005 | Mana Rebate Gem | Gain 15 mana in a turn | Mana Rebate | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Exact refund condition missing | 1차 수집 |
| GEM-006 | Blue Trigger Gem | Play 250 blue cards | Blue Trigger is not in Destructoid excerpt; color trigger family implied | 미검증 | 미확정 | 미확정 | SRC-105 E1 | no direct equivalent | Trigger behavior missing | 1차 수집 |
| GEM-007 | Growth Gem | Play Crown 5 times | Growth | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Growth stat effect missing | 1차 수집 |
| GEM-008 | Bombard Gem | Play Cherry Bomb 50 times | Bombard | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Bomb behavior missing | 1차 수집 |
| GEM-009 | Calcium Gem | Play Bone 99 times | no direct effect label found yet | 미검증 | 미확정 | 미확정 | SRC-105 E1 | no direct equivalent | Effect/rules missing | 1차 수집 |
| GEM-010 | Countdown Gem | Play Empty Tome 321 times | Countdown | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Cost reduction timing missing | 1차 수집 |
| GEM-011 | Copy Gem | Play 1,000 cards | Copy | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Copy timing missing | 1차 수집 |
| GEM-012 | Decimate Gem | Deal 666,666 damage | Decimate | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Percent-health damage rules missing | 1차 수집 |
| GEM-013 | Destroy Gem | Play 100 cards picked up from light sources | Destroy | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Card destruction/coin return missing | 1차 수집 |
| GEM-014 | Easy Combo Gem | Reach combo 5+ | Easy Combo | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Combo benefit rules missing | 1차 수집 |
| GEM-015 | Drain Gem | Heal 1,500 HP | Drain | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Kill-heal trigger missing | 1차 수집 |
| GEM-016 | Duration Gem | Play Spellbinder 10 times | Duration | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Duration stat missing | 1차 수집 |
| GEM-017 | Echo Gem | Play 3,000 cards | Echo | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1, SRC-143 E5 hotfix metadata | `echoGem` placeholder | Exact replay target/order missing; `Hotfix 1.4.1` confirms a shipped Echo gem crash fix only | 1차 수집 / official Steam news |
| GEM-018 | Free To Play Gem | Play 200 Free-to-Play cards | no direct effect label found yet | 미검증 | 미확정 | 미확정 | SRC-105 E1 | no direct equivalent | Free-to-play card definition missing | 1차 수집 |
| GEM-019 | Freeze Gem | Play Clock Lancet | Freeze | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Enemy freeze/status behavior missing | 1차 수집 |
| GEM-020 | Restore Health Gem | Play Pummarola 10 times | Restore Health | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Encounter-end heal behavior missing | 1차 수집 |
| GEM-021 | Coin Count Gem | Collect 100,000 coins | Coin-count style damage not directly matched in excerpt | 미검증 | 미확정 | 미확정 | SRC-105 E1 | no direct equivalent | Economy-scaling behavior missing | 1차 수집 |
| GEM-022 | Leader Gem | Deal 100,000 damage | Leader | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | In-hand damage boost rules missing | 1차 수집 |
| GEM-023 | Luck Gem | Play Clover 5 times | no direct effect label found; likely Luck stat | 미검증 | 미확정 | 미확정 | SRC-105 E1 | no direct equivalent | Luck behavior missing | 1차 수집 |
| GEM-024 | Magic Hat Gem | Play Peachone 77 times | Magic Hat | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Dove summon behavior missing | 1차 수집 |
| GEM-025 | Magnetic Gem | Play 2,000 cards | Magnetic | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Same-card draw behavior missing | 1차 수집 |
| GEM-026 | Mana Cost Gems | Collect 10 Mana Orbs | Reduce/Increase cost mapping unresolved | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | `flowGem` placeholder | Which cost modifier unclear | 출처 충돌 |
| GEM-027 | Mana Cost Gems 2 | Collect 20 Mana Orbs | Reduce/Increase cost mapping unresolved | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Which cost modifier unclear | 출처 충돌 |
| GEM-028 | Midas Gem | Collect 5,555 coins | Midas | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Coin gain while in hand missing | 1차 수집 |
| GEM-029 | Purple Trigger Gem | Play 250 purple cards | Purple Trigger | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Trigger behavior missing | 1차 수집 |
| GEM-030 | Rainbow Gem | Activate 500 Crawler trigger abilities | Rainbow | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | All-trigger behavior missing | 1차 수집 |
| GEM-031 | Red Trigger Gem | Play 500 red cards | no direct effect label found; color trigger family implied | 미검증 | 미확정 | 미확정 | SRC-105 E1 | no direct equivalent | Trigger behavior missing | 1차 수집 |
| GEM-032 | Refund Gem | Gain 10 mana in a turn | Refund | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Mana refund amount/timing missing | 1차 수집 |
| GEM-033 | Remote Gem | Destroy 5 mine carts | no direct effect label found yet | 미검증 | 미확정 | 미확정 | SRC-105 E1 | no direct equivalent | Effect/rules missing | 1차 수집 |
| GEM-034 | Retain Gem | Have 7 cards in hand | Retain | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Hand-retain timing missing | 1차 수집 |
| GEM-035 | Return Gem | Play 300 cards | Return | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Return-to-hand timing missing | 1차 수집 |
| GEM-036 | Reverse Combo Gem | Reach combo 6+ | Reverse Combo | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Combo-breaking exception missing | 1차 수집 |
| GEM-037 | Kill Count Gem | Defeat 10,000 enemies total | Kill Count | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Damage formula missing | 1차 수집 |
| GEM-038 | Armor Strike Gem | Gain 15 armor in a turn | Armor Strike | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Armor-to-damage formula missing | 1차 수집 |
| GEM-039 | Recycle Gem | Have 8 cards in hand | Recycle | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Discard-skip behavior missing | 1차 수집 |
| GEM-040 | Mug Gem | Collect 3,333 coins | Mug | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Kill-coin trigger missing | 1차 수집 |
| GEM-041 | Quick Draw Gem | Reach deck size 30 | Quick Draw | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Opening-hand priority missing | 1차 수집 |
| GEM-042 | Coin Card Gem | Find and play 20 Big Coin Bag cards | Coin Card | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Coin shard behavior missing | 1차 수집 |
| GEM-043 | Triple Damage Gem | Deal 500,000 damage | Triple Damage | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Multiplier stacking missing | 1차 수집 |
| GEM-044 | Uncrackable Gem | Defeat The Trickster | secondary guides and generated Trickster crawl describe anti-card-break reward family; Nintendo Wire uses `Unbreakable` alias | 미검증 | 미확정 | 미확정 | SRC-006 E5 metadata, SRC-105 E1, SRC-126 E1, SRC-138 E1, SRC-139 E1 | no direct equivalent | Effect text, alias, anti-shatter rule, and Trickster unlock proof missing | 출처 충돌 |
| GEM-045 | Wild Gem | Play 100 Wild cards | Wild | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | `linkGem` placeholder | Exact Wild conversion/chain behavior missing | 1차 수집 |
| GEM-046 | Mana X Damage Gem / X Mana Gem / X Mana | Dexerto table says `X Mana Gem` and `Play purple cards 3,000 times`; Steam achievement says `Mana X Damage Gem` and `Play lots and lots and lots of purple cards`; official-wiki value extract exposes `X Mana` as an Ultra Rare row with a 3,000-purple-card unlock | official-wiki keyword bucket is mana/cost only; exact effect text not stored here | 미검증 | 미확정 | Ultra Rare source-level candidate | SRC-105 E1, SRC-131 E1, SRC-006 E5 metadata, SRC-146 E5 source-level, CON-034 | no direct equivalent | X-mana/damage behavior and exact in-game display name need direct proof | 출처 충돌 / official wiki value candidate |
| GEM-047 | Mild Gem | Complete Gallo Tower with Gallo | no direct effect label found yet | 미검증 | 미확정 | 미확정 | SRC-105 E1 | no direct equivalent | Effect/rules missing | 1차 수집 |
| GEM-048 | Yellow Trigger Gem | Play 250 yellow cards | Yellow Trigger | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Trigger behavior missing | 1차 수집 |
| GEM-049 | Greed Gem | Play Stone Mask 10 times | Greed | 미검증 | 미확정 | 미확정 | SRC-105 E1, SRC-205 E1 | no direct equivalent | Greed stat/economy behavior missing | 1차 수집 |

## Required Completion

- Resolve Dexerto unlock labels against Destructoid effect labels and in-game names.
- Resolve `X Mana` / `X Mana Gem` vs Steam `Mana X Damage Gem` before choosing a final row name or formula.
- Add rarity, level-up pool, chest pool, boss-chest pool, sealing/unsealing, socket restrictions, and replacement rules.
- Verify every gem's actual attachment behavior with video or direct play.
- Confirm whether the 49 Steam/Dexerto unlock rows, 58 official-wiki gem rows, and 50+ official FAQ shorthand are different taxonomies or a patch/source drift; start from `research/gem-taxonomy-reconciliation.md`'s 47 direct matches, 2 public cost buckets, and 11 wiki-only/cost-variant rows.
