# Official Wiki API Crawl

Status: `generated 2026-05-22 / official wiki API crawl`

Source hub: https://vampire.survivors.wiki/w/Crawlers:Wiki

Primary page URLs:

- https://vampire.survivors.wiki/w/Crawlers:Cards
- https://vampire.survivors.wiki/w/Crawlers:Characters
- https://vampire.survivors.wiki/w/Crawlers:Gems
- https://vampire.survivors.wiki/w/Crawlers:Evolution
- https://vampire.survivors.wiki/w/Crawlers:Arcanas
- https://vampire.survivors.wiki/w/Crawlers:Dungeons
- https://vampire.survivors.wiki/w/Crawlers:Relics

Follow-up value extracts:

- [`official-wiki-card-gem-value-extract.md`](./official-wiki-card-gem-value-extract.md)
- [`gem-taxonomy-reconciliation.md`](./gem-taxonomy-reconciliation.md)
- [`official-wiki-character-value-extract.md`](./official-wiki-character-value-extract.md)
- [`official-wiki-arcana-relic-dungeon-value-extract.md`](./official-wiki-arcana-relic-dungeon-value-extract.md)
- [`official-wiki-enemy-event-powerup-value-extract.md`](./official-wiki-enemy-event-powerup-value-extract.md)

This file stores selected claims and row-count boundaries from the MediaWiki API behind the Crawlers namespace. Treat it as official-wiki evidence, but not as direct runtime, local build, save-file, or game-file proof.

## Crawl Notes

| Check | Result |
| --- | --- |
| Page/API fetched | 2026-05-22 |
| Hub page fetched | `Crawlers:Wiki` |
| Hub authority claim | The hub presents itself as the official Vampire Crawlers wiki |
| API used | `api.php?action=parse` and `api.php?action=query&list=categorymembers` |
| Card infobox pages parsed | 113 unique `Infobox VC Card` pages |
| Gem infobox pages parsed | 58 `Infobox VC Gem` pages |
| Arcana infobox pages parsed | 12 `Infobox VC Arcana` pages |
| Character card pages parsed | 23 `type = character` card rows |
| Relic infobox pages parsed | 16 `Infobox VC Relic` pages |
| Dungeon category pages parsed | 9 dungeon pages after excluding the index and Village |
| Exact in-game UI proof present | No |
| Game-file proof present | No |
| Runtime verification present | No |

## Boundary Notes

- Wiki categories include index pages and some cross-category memberships. The card count below uses unique pages with `Infobox VC Card` and the infobox `type` field where possible.
- The official wiki currently exposes larger row-level surfaces than prior secondary guide tables. Do not collapse those into final implementation totals until the in-game collection UI, stage-select UI, Town Hall, Museum, or game files confirm the same taxonomy.
- The crawl was taken from live wiki/API pages. If the wiki changes, rerun this crawl before using a row as final patch data.
- This source can upgrade several count boundaries and exact text candidates, but it does not remove the direct-play blocker in `direct-play-verification.md`.

## Extracted Rows

| Crawl ID | Topic | Source-Level Claim | Missing Before Implementation |
| --- | --- | --- | --- |
| OWIKI-001 | Wiki authority | The Crawlers hub is presented as the official wiki for Vampire Crawlers | Confirm target patch/build and decide whether wiki text or shipped game files win when they disagree |
| OWIKI-002 | Card catalog | Unique card pages with `Infobox VC Card` total 113 rows: 23 character, 40 attack, 8 defense, 19 stat, 6 mana, 10 wild, and 7 temporary by infobox `type` | Collection UI/game-file proof for final card membership, hidden rows, category overlaps, costs, sockets, and runtime behavior |
| OWIKI-003 | Card category overlap | Category membership is wider than primary infobox type for some rows; e.g. Wild category membership includes cross-listed pages beyond the 10 primary wild cards | Do not sum category membership columns as final total without de-duplicating by page and type |
| OWIKI-004 | Character roster | The character-card category exposes 23 actual character pages after excluding index pages: Antonio, Arca, Cavallo, Christine, Clerici, Concetta, Divano, Dommario, Gallo, Gennaro, Giovanna, Imelda, Krochi, Lama, MissingN0, Mortaccio, O'Sole, Pasqualina, Poe, Poppea, Porta, Pugnala, and Ramba | Exact character-select slots, public/hidden status, purchase costs, availability, aliases, and combat passive proof |
| OWIKI-005 | Character party rules | The Characters page says the lead/main crawler contributes stats and four starter-deck cards, while later recruited crawlers add only one attack/spell card and no extra power-ups | Fresh/progressed Inn UI, actual party slot behavior, starter-deck before/after capture, and passive runtime proof |
| OWIKI-006 | Character Disco mode | The Characters page describes a Disco mode chance after five crawlers are purchased, with a purchase discount while active | Exact trigger chance, discount display, repeatability, costs, and persistence require UI/direct proof |
| OWIKI-007 | Gem catalog | `Infobox VC Gem` pages total 58 rows with rarity split: 9 Common, 12 Uncommon, 20 Rare, 8 Very Rare, and 9 Ultra Rare | Resolve 49 Steam/Dexerto unlock rows vs 58 wiki rows vs 50+ official shorthand, and verify exact in-game gem collection UI |
| OWIKI-008 | Gem level-up rarity weights | The Gems page gives level-up weights: Common 60, Uncommon 30, Rare 20, Very Rare 2, Ultra Rare 0; Luck factors are 0, 0.1, 0.25, 0.5, and 0 respectively | Confirm current build formula, Luck application, reward-pool exclusions, and whether UI text exposes the same values |
| OWIKI-009 | Gem chest rarity weights | The Gems page gives chest rarity pools: Tier 1 can award Common/Uncommon/Rare, Tier 2 Rare/Very Rare, Tier 3 Very Rare/Ultra Rare, with weights 100/80/50/60/40 by row | Confirm chest-tier labels, boss/miniboss chest mapping, Evolution gem exception, and current patch values |
| OWIKI-010 | Evolution gem behavior | The Evolution page says eligible evolutions require a matching card combination, a free slot on the primary card, consume primary/secondary cards into the evolved card, inherit remaining primary-card gems, and lose secondary/tertiary-card gems | Direct deck-before/deck-after proof, Grim Grimoire text, duplicate-card behavior, and socket-blocked failure UI |
| OWIKI-011 | Arcana roster | The arcana category exposes 12 `Infobox VC Arcana` rows, including `Experimental Medicine` and `Shield Bash`; both are marked as unlocked when taking Polentir | Fortune Teller UI, default/automatic state, exact effect text, equip limits, and runtime proof for every arcana |
| OWIKI-012 | Relic roster | The relic category exposes 16 `Infobox VC Relic` rows, adding `Deck Box` to the previously tracked 15-row public guide boundary | Museum/UI proof, starting-state proof for blank-location rows, and conflict resolution against 15-row secondary guide lists |
| OWIKI-013 | Relic locations | Official-wiki relic locations resolve several source conflicts at source level: Guiding Light in Inlaid Library, Ultimate Ultra Overkill in Curd Refinery, Bomba Infernale in Dairy Plant, Polentir in Fortune Forest, and Stardust Anvil/Overkill in Teeny Bridge; Deck Box, Milky Way Map, and Rilevatore have blank `foundin` fields | Direct relic panel/Museum proof still required before overwriting all route/location conflicts |
| OWIKI-014 | Dungeon structure | The dungeon category exposes Tutorial plus eight post-tutorial dungeon pages; multi-version pages produce 16 named dungeon/stage variants when `name1/name2/name3` and single `name` fields are expanded | Stage-select/world-map UI must still separate biome, dungeon, stage/difficulty variant, floor count, unlock row, and clear condition |

## Card Count Snapshot

| Primary Infobox Type | Count |
| --- | ---: |
| character | 23 |
| attack | 40 |
| defense | 8 |
| stat | 19 |
| mana | 6 |
| wild | 10 |
| temporary | 7 |
| Unique card infobox pages | 113 |

## Gem Rarity Snapshot

| Rarity | Infobox Rows |
| --- | ---: |
| Common | 9 |
| Uncommon | 12 |
| Rare | 20 |
| Very Rare | 8 |
| Ultra Rare | 9 |
| Total | 58 |

## Gem Rarity Weights

### Level-Up Rewards

| Rarity | Weight | Luck Factor |
| --- | ---: | ---: |
| Common | 60 | 0 |
| Uncommon | 30 | 0.1 |
| Rare | 20 | 0.25 |
| Very Rare | 2 | 0.5 |
| Ultra Rare | 0 | 0 |

### Treasure Chests

| Rarity | Treasure Chest Type(s) Found In | Weight |
| --- | --- | ---: |
| Common | Tier 1 | 100 |
| Uncommon | Tier 1 | 80 |
| Rare | Tier 1 and Tier 2 | 50 |
| Very Rare | Tier 2 and Tier 3 | 60 |
| Ultra Rare | Tier 3 | 40 |

## Arcana Snapshot

| Count | Names |
| ---: | --- |
| 12 | And Another; Chain Link; Experimental Medicine; Jester's Hat; Make a Scene; Mana Syphon; Over The Top; Sharp Mind; Shield Bash; Swollen Fist; Wild Buff; Your Shield My Liege |

## Relic Snapshot

| Count | Names |
| ---: | --- |
| 16 | Arcana Finder; Bomba Infernale; Combo Stack; Deck Box; Gem Hammer; Grim Grimoire; Guiding Light; Lapidary Loupe; Milky Way Map; Ovenkilt; Overkill; Polentir; Rilevatore; Sorceress' Tears; Stardust Anvil; Ultimate Ultra Overkill |

## Dungeon Variant Snapshot

| Page | Order | Variant Names | Floors |
| --- | ---: | --- | --- |
| Tutorial | 0 | Tutorial | 1 |
| Mad Forest | 2 | Mad Forest / Furious Forest / Berserk Wood | 4 / 5 / 5 |
| Inlaid Library | 3 | Inlaid Library / Library West Wing / Library Sanctum | 5 / 5 / 5 |
| Teeny Bridge | 4 | Teeny Bridge | 1 |
| Dairy Plant | 5 | Dairy Plant / Milk Factory / Curd Refinery | 5 / 5 / 5 |
| Weeny Bridge | 6 | Weeny Bridge | 1 |
| Gallo Tower | 7 | Gallo Tower | 6 |
| Meany Bridge | 8 | Meany Bridge | 1 |
| Cappella Magna | 9 | Cappella Magna / Cappella Ultima | 5 / 5 |

## Required Follow-Up

- Use this crawl to update count conflicts, not to authorize original-system implementation.
- Reconcile wiki 113 card rows with Dexerto 87 non-character pages, Steam achievement unlock rows, and the official 65+ shorthand.
- Reconcile wiki 58 gem rows with 49 Steam/Dexerto unlock rows, 43 effect-family rows, and the official 50+ shorthand.
- Reconcile wiki 23 character rows with 20 public achievement rows, 21/22 secondary roster claims, and the official 20+ shorthand.
- Reconcile wiki 16 relic rows with the previous 15-row GameSpot/GAMES.GG boundary and direct Museum proof.
- Capture high-resolution/direct-play UI or game-file proof for exact values, text, costs, effects, formulas, unlock states, and persistence.
