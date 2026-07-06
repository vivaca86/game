# Official Wiki Arcana / Relic / Dungeon Value Extract

Status: `generated 2026-05-22 / official wiki value extract / SRC-147`

Source hub: https://vampire.survivors.wiki/w/Crawlers:Wiki

API endpoint used: https://vampire.survivors.wiki/api.php

Related crawl: [`official-wiki-arcana-relic-dungeon-field-crawl.md`](./official-wiki-arcana-relic-dungeon-field-crawl.md).
Related stage reconciliation: [`stage-taxonomy-reconciliation.md`](./stage-taxonomy-reconciliation.md).

Related town reconciliation: [`town-taxonomy-reconciliation.md`](./town-taxonomy-reconciliation.md).

This artifact keeps row-level structural values from official-wiki arcana, relic, and dungeon infoboxes. It does not copy full effect or description prose: effect/description text is represented by presence flags and keyword buckets only. Treat this as official-wiki source-level evidence, not installed-build, Fortune Teller, Museum, stage-select, direct-runtime, save, or game-file proof.

## Crawl Notes

| Check | Result |
| --- | --- |
| Generated | 2026-05-22 |
| Arcana category queried | Category:Crawlers arcana |
| Relic category queried | Category:Crawlers relics |
| Dungeon category queried | Category:Crawlers dungeons |
| Unique `Infobox VC Arcana` rows parsed | 12 |
| Unique `Infobox VC Relic` rows parsed | 16 |
| Dungeon infobox pages parsed | 9 |
| Expanded dungeon/stage variant rows | 16 |
| Full effect/description prose stored here | No; only presence flags and keyword buckets are stored |

## Snapshot Counts

| Segment | Rows | Direct Runtime Proof Here? |
| --- | ---: | --- |
| Arcana infobox rows | 12 | No |
| Relic infobox rows | 16 | No |
| Dungeon infobox pages | 9 | No |
| Expanded dungeon/stage variants | 16 | No |

### Release Field Values

| Field | Value |
| --- | --- |
| Release | 21 April 2026 |

## Implementation-Relevant Queues

| Queue | Rows |
| --- | --- |
| Arcana rows missing official-wiki unlock field | None |
| Relic rows missing official-wiki found-in field | Deck Box; Milky Way Map; Rilevatore |
| Relic rows missing official-wiki effects field | Combo Stack; Deck Box; Ovenkilt; Rilevatore |
| Dungeon rows needing stage-select proof | All expanded variant rows |

## Arcana Value Rows

| Name | Official-Wiki Unlock Field | Text? | Text Keyword Buckets | Description? | Description Keyword Buckets | Release | Page |
| --- | --- | --- | --- | --- | --- | --- | --- |
| And Another | Playing 150 Free-to-Play cards. | yes | cards, cost | yes | cards, cost | 21 April 2026 | Crawlers:And Another |
| Chain Link | Reaching at least a combo of 12 or more. | yes |  | yes |  | 21 April 2026 | Crawlers:Chain Link |
| Experimental Medicine | Unlocked when taking the Polentír | yes | heal | yes | heal | 21 April 2026 | Crawlers:Experimental Medicine |
| Jester's Hat | Playing a total of 150 Wild cards. | yes | cards, wild, floor | yes | cards, deck, wild, floor | 21 April 2026 | Crawlers:Jester's Hat |
| Make a Scene | Activating 1,500 Crawler trigger abilities. | yes | trigger | yes | crawler, trigger, cost | 21 April 2026 | Crawlers:Make a Scene |
| Mana Syphon | Receiving 15 Mana in a single turn. | yes | mana, cards | yes | mana, cards | 21 April 2026 | Crawlers:Mana Syphon |
| Over The Top | Using crawler cards (green character cards) 100 times. | yes | cards, deck, crawler | yes | cards, deck, crawler | 21 April 2026 | Crawlers:Over The Top |
| Sharp Mind | Using purple cards (mana-adding cards) 100 times. | yes | mana | yes | mana | 21 April 2026 | Crawlers:Sharp Mind |
| Shield Bash | Unlocked when taking the Polentír | yes | armor, damage | yes | cards, armor, damage | 21 April 2026 | Crawlers:Shield Bash |
| Swollen Fist | Reaching 40 Deck size. | yes | cards, deck, damage | yes | cards, deck, damage | 21 April 2026 | Crawlers:Swollen Fist |
| Wild Buff | Playing 250 cards picked up from light sources. | yes | cards, combo, light | yes | cards, combo, light | 21 April 2026 | Crawlers:Wild Buff |
| Your Shield My Liege | Gaining 2,000 Armor. | yes | armor | yes | armor | 21 April 2026 | Crawlers:Your Shield My Liege |

## Relic Value Rows

| Name | ID | Official-Wiki Found-In Field | Description? | Description Keyword Buckets | Effects? | Effects Keyword Buckets | Release | Page |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Arcana Finder | RelicConfig_Randomazzo | Library Sanctum | yes | arcana, floor | yes | floor | 21 April 2026 | Crawlers:Arcana Finder |
| Bomba Infernale | RelicConfig_BombaInfernale | Dairy Plant | yes | floor | yes | floor | 21 April 2026 | Crawlers:Bomba Infernale |
| Combo Stack | RelicConfig_PancakeOfPower | Tutorial | yes | mana, cards, combo, cost | no |  | 21 April 2026 | Crawlers:Combo Stack |
| Deck Box | RelicConfig_DeckBox |  | yes | cards, deck | no |  | 21 April 2026 | Crawlers:Deck Box |
| Gem Hammer | RelicConfig_GemHammer | Mad Forest | yes | cards | yes | cards, gem, blacksmith | 21 April 2026 | Crawlers:Gem Hammer |
| Grim Grimoire | RelicConfig_GrimGrimoire | Library West Wing | yes | evolution | yes | evolution | 21 April 2026 | Crawlers:Grim Grimoire |
| Guiding Light | RelicConfig_GuidingLight | Inlaid Library | yes | map, light | yes | map, light | 21 April 2026 | Crawlers:Guiding Light |
| Lapidary Loupe | RelicConfig_Jeweller | Gallo Tower | yes | gem, blacksmith | yes | gem | 21 April 2026 | Crawlers:Lapidary Loupe |
| Milky Way Map | RelicConfig_MilkyWayMap |  | yes | map, boss | yes | map, boss | 21 April 2026 | Crawlers:Milky Way Map |
| Ovenkilt | RelicConfig_Ovenkilt | Cappella Ultima | yes | overkill | no |  | 21 April 2026 | Crawlers:Ovenkilt |
| Overkill | RelicConfig_Overkill | Teeny Bridge | yes | damage | yes | damage | 21 April 2026 | Crawlers:Overkill |
| Polentír | RelicConfig_Polentir | Fortune Forest | yes | arcana | yes | arcana, floor | 21 April 2026 | Crawlers:Polentír |
| Rilevatore | RelicConfig_DamageIndicators |  | yes |  | no |  | 21 April 2026 | Crawlers:Rilevatore |
| Sorceress' Tears | RelicConfig_SorcerersTears | Gallo Tower | yes | map, speed | yes | map, speed, floor | 21 April 2026 | Crawlers:Sorceress' Tears |
| Stardust Anvil | RelicConfig_Blacksmith | Teeny Bridge | yes | blacksmith | yes | cards, gem, blacksmith | 21 April 2026 | Crawlers:Stardust Anvil |
| Ultimate Ultra Overkill | RelicConfig_UltimateOverkill | Curd Refinery | yes | overkill | yes | damage | 21 April 2026 | Crawlers:Ultimate Ultra Overkill |

## Dungeon / Stage Variant Value Rows

| Page | Order | Variant | Name | Floors | Difficulty | Demo | Description? | Description Keyword Buckets | Music? | Release |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| Crawlers:Tutorial | 0 | single | Tutorial | 1 |  |  | no |  | yes | 21 April 2026 |
| Crawlers:Mad Forest | 2 | 3 | Berserk Wood | 5 | 3 |  | yes |  | yes | 21 April 2026 |
| Crawlers:Mad Forest | 2 | 2 | Furious Forest | 5 | 2 |  | yes |  | yes | 21 April 2026 |
| Crawlers:Mad Forest | 2 | 1 | Mad Forest | 4 | 1 |  | yes |  | yes | 21 April 2026 |
| Crawlers:Inlaid Library | 3 | 1 | Inlaid Library | 5 | 2 |  | yes |  | no | 21 April 2026 |
| Crawlers:Inlaid Library | 3 | 3 | Library Sanctum | 5 | 4 |  | yes |  | no | 21 April 2026 |
| Crawlers:Inlaid Library | 3 | 2 | Library West Wing | 5 | 3 |  | yes |  | no | 21 April 2026 |
| Crawlers:Teeny Bridge | 4 | single | Teeny Bridge | 1 | 3 |  | yes |  | yes | 21 April 2026 |
| Crawlers:Dairy Plant | 5 | 3 | Curd Refinery | 5 | 6 |  | yes |  | yes | 21 April 2026 |
| Crawlers:Dairy Plant | 5 | 1 | Dairy Plant | 5 | 4 |  | yes |  | yes | 21 April 2026 |
| Crawlers:Dairy Plant | 5 | 2 | Milk Factory | 5 | 5 |  | yes |  | yes | 21 April 2026 |
| Crawlers:Weeny Bridge | 6 | single | Weeny Bridge | 1 | 5 |  | yes |  | yes | 21 April 2026 |
| Crawlers:Gallo Tower | 7 | single | Gallo Tower | 6 | 6 | No | yes |  | yes | 21 April 2026 |
| Crawlers:Meany Bridge | 8 | single | Meany Bridge | 1 | 7 | No | yes |  | yes | 21 April 2026 |
| Crawlers:Cappella Magna | 9 | 1 | Cappella Magna | 5 | 8 | No | yes |  | yes | 21 April 2026 |
| Crawlers:Cappella Magna | 9 | 2 | Cappella Ultima | 5 | 9 | No | yes |  | yes | 21 April 2026 |

## Required Follow-Up

- Verify the 12 arcana rows in Fortune Teller UI or game files before treating unlock/effect fields as final implementation rules.
- Verify whether `Experimental Medicine` and `Shield Bash` are player-facing default/automatic rows, Polentir-unlocked rows, or a wiki taxonomy layer.
- Verify all 16 relic rows in Museum/relic panels or game files, especially `Deck Box`, blank found-in rows, blank effects rows, and toggle behavior.
- Use the 16 expanded dungeon/stage variant rows as a stage-select capture queue, not as final proof of playable stage taxonomy.
- Keep secondary conflicts open until UI/game-file/direct proof resolves Rilevatore, Guiding Light, Ultimate Ultra Overkill, Arcana Finder/Randomazzo, and Combo Stack/Stash.
