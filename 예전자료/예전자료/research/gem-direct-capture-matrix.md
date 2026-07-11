# Gem Direct Capture Matrix

Status: `generated 2026-05-22 / direct-proof execution matrix / blocked until app 3265700 or game files are available`

Related files:

- [`direct-play-verification.md`](./direct-play-verification.md) DP-202 and DP-206
- [`remaining-proof-queue.md`](./remaining-proof-queue.md)
- [`gem-taxonomy-reconciliation.md`](./gem-taxonomy-reconciliation.md)
- [`gem-gap-map.md`](./gem-gap-map.md)
- [`gem-dexerto-unlock-crawl.md`](./gem-dexerto-unlock-crawl.md)
- [`official-wiki-card-gem-value-extract.md`](./official-wiki-card-gem-value-extract.md)
- [`card-direct-capture-matrix.md`](./card-direct-capture-matrix.md)
- [`enemy-direct-capture-matrix.md`](./enemy-direct-capture-matrix.md)
- [`source-conflicts.md`](./source-conflicts.md) CON-006, CON-010, CON-025, CON-026, CON-028, CON-029, CON-034, CON-037, CON-042

This matrix turns the gem taxonomy into direct-play, high-resolution video, and game-file capture packets. It is not proof by itself. Gem implementation remains closed until each accepted row has exact shipped name, rarity, effect text, valid socket targets, reward/pool behavior, unlock state, runtime behavior, and acceptance criteria.

## Capture Packet Standard

Every gem packet must include these fields before it can close a row:

| Field | Requirement |
| --- | --- |
| Build baseline | App `3265700`, build id/version, platform, language, timestamp, save state |
| Source layer | Steam achievement row, Dexerto unlock row, official-wiki gem row, Store media candidate, storyboard row, or game-file row |
| Catalog proof | Gem collection UI, Jeweler UI, Blacksmith/Gem Hammer UI, reward UI, save data, or game-file table |
| Display proof | Exact displayed name, rarity, icon/color, effect text, unlock text, socket marker, stack/count marker if shown |
| Socket proof | Valid and invalid card targets, socket count, extra-slot behavior, replacement/cancel path, refund/loss behavior |
| Runtime proof | Trigger timing, formula, target selection, randomization, duration, stacking, turn/encounter boundary, and failure cases |
| Pool proof | Level-up, chest, boss chest, Jeweler/sealing, Gem Hammer/default pool, stage/event reward, and ultra-rare restrictions |
| Unlock proof | Town Hall/achievement progress, unlock popup, collection row, route/stage/enemy trigger, or game-file unlock condition |
| Source resolution | Confirmed, contradicted, unresolved, version difference, internal-only, default-only, hidden, or excluded |
| Implementation output | Exact row data and testable acceptance condition; do not implement from partial packets |

## Priority Order

| Priority | Packet IDs | Reason |
| --- | --- | --- |
| P0 | GEM-DP-001 to GEM-DP-006 | Close the gem-count/catalog boundary before row implementation. |
| P1 | GEM-DP-007 to GEM-DP-017 | Capture the public 49 unlock rows by proof family and exact fields. |
| P2 | GEM-DP-018 to GEM-DP-024 | Resolve 58 official-wiki rows, cost variants, default rows, and naming conflicts. |
| P3 | GEM-DP-025 to GEM-DP-032 | Resolve socketing, Jeweler/Blacksmith, rarity pools, and card interaction rules. |
| P4 | GEM-DP-033 to GEM-DP-041 | Resolve boss/stage linked rows, runtime edge cases, and implementation acceptance. |

## P0 Catalog / Count Boundary

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| GEM-DP-001 | Gem collection count | Official `50+` shorthand vs 49 public unlock rows vs 58 official-wiki rows | Capture collection/Jeweler count, locked rows, filters, hidden rows, completion number, and whether default gems count | CON-025, CON-037, gem-taxonomy count boundary |
| GEM-DP-002 | Public 49 vs wiki 58 membership | 47 direct matches, 2 public bucket rows, 11 wiki rows outside public matches | Capture whether all 58 wiki rows appear in player-facing UI, game files, or only source pages | 49/58 roster split |
| GEM-DP-003 | Game-file gem table index | Official-wiki 58 rows and Dexerto 49 rows | If game files are available, extract gem ids/display strings/rarities/effects/unlocks/pool flags without inferring from page names | Source row-to-file token map |
| GEM-DP-004 | Locked/hidden/default rows | 7 Gem-Hammer/default-style rows and hidden/non-achievement possibilities | Capture default/unlocked rows on fresh save, after Gem Hammer, after Jeweler/Blacksmith access, and after stage progress | Default-vs-unlock boundary |
| GEM-DP-005 | Reward and pool surfaces | Level-up, chest, boss chest, Jeweler, Gem Hammer, stage/event reward | Capture each surface's selectable gem rows, rarity labels, reroll/seal behavior, and excluded rows | Pool taxonomy |
| GEM-DP-006 | Store/media modifier candidates | `FREE`, `Wild Return`, `Wild Amount`, `Cost+`, `Recover` visible candidates | Cross-check official media candidates against current-build tooltip/game files before assigning them to gems/cards/modifiers | Store media validation |

## P1 Public 49 Unlock Row Capture

| Packet ID | Family | Source Rows | Required Capture | Output |
| --- | --- | --- | --- | --- |
| GEM-DP-007 | Stage/route unlock gems | Nduja, Fireproof, Crawler Caller, Yin Yang, Mild | Stage/route clear proof, unlock popup, gem tooltip, reward surface, and runtime sample | Confirmed stage/enemy gem rows |
| GEM-DP-008 | Card-use count gems | Growth, Bombard, Calcium, Countdown, Duration, Freeze, Restore Health, Luck, Magic Hat, Greed | Town Hall/achievement counter, exact card row, unlock popup, gem tooltip, and one socketed runtime sample | Confirmed card-count unlock rows |
| GEM-DP-009 | Color trigger gems | Blue Trigger, Purple Trigger, Red Trigger, Yellow Trigger, Rainbow | Color/category proof for source cards, socket target rules, trigger activation, failed trigger case, and Rainbow all-trigger behavior | Confirmed trigger gem table |
| GEM-DP-010 | Mana and cost gems | Mana Rebate, Refund, Mana Cost Gems, Mana Cost Gems 2, X Mana/Mana X Damage | Gain thresholds, cost-modifier display, cost direction, stacking, refund/rebate timing, and formula proof | Mana/cost gem mapping |
| GEM-DP-011 | Damage and kill-scaling gems | Decimate, Leader, Kill Count, Armor Strike, Triple Damage, Coin Count | Damage formula text, before/after hit samples, HP/armor/coin/kill counter state, cap/rounding proof | Damage formula table |
| GEM-DP-012 | Economy gems | Midas, Mug, Coin Card, Greed, Coin Count | Coin counter state, in-hand/kill/use condition, card generation, coin reward, and economy cap/rounding proof | Economy gem table |
| GEM-DP-013 | Hand/draw/deck gems | Copy, Magnetic, Retain, Return, Recycle, Quick Draw | Hand/deck/discard zones before/after, duplicate/copy target, retain/return timing, deck-size condition | Draw/hand mutation table |
| GEM-DP-014 | Combo and Wild gems | Easy Combo, Reverse Combo, Wild, Mild | Combo threshold, chain continuation, reverse-chain exception, Wild bridge behavior, end-turn carryover, fail states | Combo/Wild rule table |
| GEM-DP-015 | Status/summon/special gems | Drain, Free To Play, Restore Health, Freeze, Crawler Caller, Magic Hat, Remote | Status marker, summon target/count, heal timing, mine-cart object state, Free-to-Play card category | Status/summon table |
| GEM-DP-016 | Light-source and object-linked gems | Destroy, Remote, Coin Card | Light-source pickup proof, mine-cart destroy proof, Big Coin Bag use proof, reward popup, and runtime effect | Object-linked rows |
| GEM-DP-017 | Full public 49 pass | GEM-001 through GEM-049 | Capture every public unlock row's exact tooltip, rarity, unlock, socket targets, pool, and one runtime sample or explicit unresolved reason | Public 49 acceptance matrix |

## P2 Official-Wiki 58 / Variant Reconciliation

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| GEM-DP-018 | 47 public-to-wiki direct matches | `gem-taxonomy-reconciliation.md` direct match rows | Verify exact in-game name/display text for each match and mark source rows confirmed only after UI/file proof | Name-level match upgrade |
| GEM-DP-019 | Public Mana Cost bucket rows | `Mana Cost Gems` and `Mana Cost Gems 2` | Capture whether UI shows two bucket unlock rows, four modifier rows, duplicate display names, or another grouping | CON-010, CON-025 |
| GEM-DP-020 | Cost modifier variant rows | Increase Mana Cost +1/+2; Reduce Mana Cost -1/-2 | Capture exact display name, rarity, unlock text, effect text, socket target, and whether duplicate display names are disambiguated | Duplicate display-name queue |
| GEM-DP-021 | Gem-Hammer/default rows | Amount, Area, Armor, Double Damage, Draw, Evolution, Might | Capture fresh-save absence/presence, Gem Hammer acquisition, default unlock state, reward pool, and whether these count in collection | Default row boundary |
| GEM-DP-022 | Official-wiki-only effect families | Official-wiki 58 rows vs secondary 43-ish effect-family layer | Map each visible effect family to exact row names, variants, rarities, and runtime formulas | Effect-family split |
| GEM-DP-023 | X Mana name conflict | `Mana X Damage Gem` / `X Mana Gem` / `X Mana` | Capture reward popup, gem tooltip, collection row, game-file string, and formula before choosing the final label | CON-034 |
| GEM-DP-024 | Uncrackable/Unbreakable label | Steam/Dexerto/GamerBlurb `Uncrackable`; Nintendo Wire `Unbreakable` | Capture Trickster reward popup, collection row, tooltip, and game-file string | CON-029 |

## P3 Socket / Jeweler / Blacksmith / Pool Rules

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Output |
| --- | --- | --- | --- | --- |
| GEM-DP-025 | Socket eligibility | Card rows with 0/1/2/3/missing slots and all gem families | Try valid and invalid socket targets across attack, defense, stat, mana, wild, temporary, evolved, and Crawler cards | Compatibility matrix |
| GEM-DP-026 | Socket count and extra slots | Gem Hammer, Stardust Anvil, Blacksmith slot claims | Capture base slots, purchased/added slots, max slots, costs, persistence, and invalid full-socket state | Slot upgrade table |
| GEM-DP-027 | Replacement/cancel/refund flow | Existing gem on card, inventory count, cancel path | Capture replacement confirmation, gem loss/refund, cancel behavior, duplicate gem stacking, and save persistence | Mutation/persistence rules |
| GEM-DP-028 | Jeweler rarity controls | Lapidary Loupe/Jeweler rarity adjustment and sealing claims | Capture menu labels, rarity adjustment choices/costs, seal/unseal rules, Luck interaction, and reward-pool impact | Jeweler rules |
| GEM-DP-029 | Rarity and reward pools | Common/Uncommon/Rare/Very Rare/Ultra Rare rows | Capture level-up, normal chest, boss chest, shop/Jeweler, and event reward pools; specifically test ultra-rare restrictions | CON-006 |
| GEM-DP-030 | Stage/event reward integration | Stage clear, boss reward, Trickster reward, special object reward | Capture whether gems are granted directly, added to pool, unlocked only, or socketed immediately | Reward-state taxonomy |
| GEM-DP-031 | Card-gem runtime ordering | Card cost, Wild bridge, trigger color, damage, draw, destroy, temporary card behavior | Capture effect order when card, gem, arcana, combo, and status effects all apply | Runtime order table |
| GEM-DP-032 | Save/load persistence | Socketed cards, inventory gems, sealed gems, unlocked gems, Jeweler settings | Save, reload, run restart, defeat/clear, and profile-level persistence proof | Persistence table |

## P4 Runtime Edge Cases / Implementation Acceptance

| Packet ID | Target | Required Capture | Output |
| --- | --- | --- | --- |
| GEM-DP-033 | Fresh-save baseline | Collection/Jeweler before and after Tutorial/Mad Forest first run | Default gem state and locked-row baseline |
| GEM-DP-034 | Boss-linked gem rows | Nduja/Nesufritto and Uncrackable/Trickster | Enemy identity, fight trigger, reward popup, gem tooltip, runtime sample |
| GEM-DP-035 | Stage-clear gem rows | Fireproof, Crawler Caller, Yin Yang, Mild | Stage-select label, clear condition, unlock popup, exact gem text |
| GEM-DP-036 | Counter threshold exactness | 5/10/15/20/50/77/99/100/200/250/300/500/1000/2000/3000/10000/etc. | Town Hall/achievement tracker values and off-by-one threshold behavior |
| GEM-DP-037 | Formula and stacking suite | Damage, mana, cost, coin, armor, heal, combo, trigger, Wild, draw, return, retain | Formula examples with controlled before/after states and stacked-gem cases |
| GEM-DP-038 | Invalid-state suite | No valid target, insufficient mana, full hand, empty deck, full sockets, sealed rarity, missing unlock, duplicate gem | Failure text, disabled state, refund/cancel, and no-op behavior |
| GEM-DP-039 | Version/build regression check | Hotfix 1.4.1/build `23012943` candidate and installed build state | Confirm installed build/version before accepting any capture as current-build proof |
| GEM-DP-040 | Cross-map backfill pass | Gem, card, enemy, town, stage, event, achievement docs | Update affected evidence rows only after capture packets meet acceptance fields |
| GEM-DP-041 | Implementation acceptance pass | All confirmed gem rows | Exact data row, behavior tests, UI text, unlock condition, socket rule, pool rule, and parity status for later implementation |

## Backfill Instructions

When a gem packet is completed, update these files in order:

1. [`direct-play-verification.md`](./direct-play-verification.md): mark DP-202/DP-206 evidence and build/language/platform.
2. [`gem-taxonomy-reconciliation.md`](./gem-taxonomy-reconciliation.md): change source-layer candidates into confirmed/rejected/internal-only/default-only mappings.
3. [`data-gems.md`](./data-gems.md): add exact gem fields and direct/game-file proof.
4. [`gem-gap-map.md`](./gem-gap-map.md): update parity only after all acceptance fields are proven.
5. [`source-conflicts.md`](./source-conflicts.md): resolve or preserve CON-006, CON-010, CON-025, CON-026, CON-028, CON-029, CON-034, CON-037, and CON-042.
6. [`card-taxonomy-reconciliation.md`](./card-taxonomy-reconciliation.md) and [`card-gap-map.md`](./card-gap-map.md) if socket/card interaction changes card fields.
7. [`enemy-taxonomy-reconciliation.md`](./enemy-taxonomy-reconciliation.md) and [`enemy-direct-capture-matrix.md`](./enemy-direct-capture-matrix.md) for Nesufritto/Trickster-linked rows.
8. [`town-taxonomy-reconciliation.md`](./town-taxonomy-reconciliation.md) if Jeweler/Blacksmith/Gem Hammer menus, costs, or persistence are confirmed.
9. [`stage-taxonomy-reconciliation.md`](./stage-taxonomy-reconciliation.md) if stage-clear gem unlock rows confirm route/stage labels.
10. [`gap-map.md`](./gap-map.md) only after row-level files are updated.
11. Later implementation files only after each row has a testable acceptance condition.

## Stop Conditions

Stop and preserve a row as unresolved when any of these happen:

- The tooltip or gem effect text is unreadable.
- The row appears only in Store/trailer media and not in current-build UI/files.
- A source page gives a name but no shipped UI/game-file membership.
- A gem appears in a reward but rarity, effect text, socket targets, or pool state are not visible.
- A socket interaction is observed without before/after inventory or card-state proof.
- A runtime formula is observed without enough controlled state to calculate it.
- A gem may be internal-only, default-only, hidden, unavailable, or post-launch, but no authoritative marker proves which.

Under those conditions, keep the row as `source-level / capture queue`, not implementation-ready.
