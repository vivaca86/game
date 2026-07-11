# Official Wiki Enemy / Event / Power-Up Value Extract

Status: `generated 2026-05-22 / official wiki value extract / SRC-148`

Source hub: https://vampire.survivors.wiki/w/Crawlers:Wiki

API endpoint used: https://vampire.survivors.wiki/api.php

Related crawl: [`official-wiki-enemy-event-powerup-field-crawl.md`](./official-wiki-enemy-event-powerup-field-crawl.md).

Related town reconciliation: [`town-taxonomy-reconciliation.md`](./town-taxonomy-reconciliation.md).

Related event reconciliation: [`event-taxonomy-reconciliation.md`](./event-taxonomy-reconciliation.md).

This artifact keeps row-level structural values from official-wiki enemy, dungeon-event, and Power-Up pages. It does not copy full article prose: enemy/event/Power-Up article text is represented by row values, presence flags, byte counts, and keyword buckets only. Treat this as official-wiki source-level evidence, not installed-build, combat runtime, Power-Up Shop UI, event-option UI, save, or game-file proof.

## Crawl Notes

| Check | Result |
| --- | --- |
| Generated | 2026-05-22 |
| Enemy category queried | Category:Crawlers enemies |
| Dungeon-event category queried | Category:Crawlers dungeon events |
| Power-Up category queried | Category:Crawlers powerups |
| Enemy category rows after excluding index | 128 |
| Unique enemy infobox pages parsed | 126 |
| Expanded enemy value rows parsed | 132 |
| Dungeon-event category rows parsed | 10 |
| Unique Power-Up infobox rows parsed | 19 |
| Full article/effect prose stored here | No; only row values, presence flags, byte counts, and keyword buckets are stored |

## Snapshot Counts

| Segment | Rows | Direct Runtime Proof Here? |
| --- | ---: | --- |
| Enemy category rows | 128 | No |
| Enemy infobox pages | 126 | No |
| Expanded enemy value rows | 132 | No |
| Dungeon-event category rows | 10 | No |
| Power-Up infobox rows | 19 | No |

### Enemy Boss-Flag Page Counts

| Boss Flag | Infobox Pages |
| --- | ---: |
| No | 71 |
| Yes | 55 |

### Power-Up Cost Distribution

| Cost | Rows |
| ---: | ---: |
| 200 | 1 |
| 250 | 2 |
| 300 | 1 |
| 350 | 1 |
| 400 | 1 |
| 450 | 1 |
| 500 | 2 |
| 750 | 1 |
| 850 | 1 |
| 1000 | 1 |
| 1250 | 2 |
| 2000 | 1 |
| 2500 | 1 |
| 3500 | 2 |
| 4000 | 1 |

## Implementation-Relevant Queues

| Queue | Rows |
| --- | --- |
| Enemy category pages without enemy infobox | Category:Crawlers boss enemies; Category:Crawlers normal enemies |
| Enemy infobox pages missing dungeon field | Bat Weak; Brazier Weak; MoonAtlantean; MudMan Weak; SunAtlantean; Werewolf Weak; Zombie Weak |
| Expanded enemy rows with positive chest-tier field | None |
| Expanded enemy rows with maxhit 30 | EnderEliteP1; Trickster |
| Power-Up rows missing unlock field | Skip |
| Power-Up page-title/name mismatches | Armor (stat) -> Armor; Mana -> Cooldown |
| Dungeon-event pages with common event infobox | None in this crawl |

## Enemy Combat Value Rows

| Page | Variant | Name | HP | XP | Level Scale | Boss | Dungeons | Max Hit | Chest Tier | Difficulty | Types | Release |
| --- | --- | --- | ---: | ---: | ---: | --- | --- | ---: | ---: | ---: | --- | --- |
| ApprenticeWitch | single | ApprenticeWitch | 300 | 6 | 0 | No | Inlaid Library | 4 | 0 | 0.9 | Witch | 21 April 2026 |
| ArchDemon | single | ArchDemon | 2000 | 7 | 0 | No | Cappella Magna | 9 | 0 | 0.75 | ArchDemon | 21 April 2026 |
| ArchDemonElite | single | ArchDemonElite | 66000 | 75 | 0 | Yes | Cappella Magna | 23 | -1 | 4.8 | ArchDemon, Elite | 21 April 2026 |
| ArchonAscia | single | ArchonAscia | 570 | 5 | 0 | No | Dairy Plant | 6 | 0 | 0.8 | Arcon | 21 April 2026 |
| ArchonOro | single | ArchonOro | 600 | 4 | 0 | No | Cappella Magna | 6 | 0 | 0.3 | Arcon | 21 April 2026 |
| ArchonSpada | single | ArchonSpada | 1300 | 7 | 0 | No | Gallo Tower | 8 | 0 | 0.9 | Arcon | 21 April 2026 |
| Bat | single | Bat | 12 | 1 | 0 | No | Mad Forest | 1 | 0 | 0 | Bat | 21 April 2026 |
| Bat COWARD | single | Bat_COWARD | 1 | 1 | 0 | No | Tutorial | 0 | 0 | 1 | Bat | 21 April 2026 |
| Bat Elite | single | Bat Elite | 400 | 30 | 0 | Yes | Mad Forest | 2 | -1 | 1.5 | Bat, Elite | 21 April 2026 |
| Bat Glowing | T1 | Bat Glowing-T1 | 10 | 3 | 1 | No | Mad Forest, Inlaid Library, Dairy Plant, Gallo Tower, Cappella Magna | 1 | 0 | 0 |  | 21 April 2026 |
| Bat Glowing | T2 | Bat Glowing-T2 | 30 | 4 | 1 | No | Mad Forest, Inlaid Library, Dairy Plant, Gallo Tower, Cappella Magna | 2 | 0 | 0 |  | 21 April 2026 |
| Bat Glowing | T3 | Bat Glowing-T3 | 36 | 3 | 1 | No | Mad Forest, Inlaid Library, Dairy Plant, Gallo Tower, Cappella Magna | 8 | 0 | 0 |  | 21 April 2026 |
| Bat Glowing | T4 | Bat Glowing-T4 | 40 | 6 | 1 | No | Mad Forest, Inlaid Library, Dairy Plant, Gallo Tower, Cappella Magna | 9 | 0 | 0 |  | 21 April 2026 |
| Bat Tutorial00 | single | Bat Tutorial00 | 21 | 1 | 0 | No | Tutorial | 0 | 0 | 1 | Bat | 21 April 2026 |
| Bat Tutorial01 | single | Bat Tutorial01 | 3 | 1 | 0 | No | Tutorial | 0 | 0 | 1 | Bat | 21 April 2026 |
| Bat Tutorial01 DoubleXP | single | Bat Tutorial01 DoubleXP | 13 | 2 | 0 | No | Tutorial | 0 | 0 | 1 | Bat | 21 April 2026 |
| Bat Tutorial02 | single | Bat Tutorial02 | 20 | 1 | 0 | No | Tutorial | 0 | 0 | 1 | Bat | 21 April 2026 |
| Bat Tutorial03 | single | Bat Tutorial03 | 38 | 2 | 0 | No | Tutorial | 1 | 0 | 1 | Bat | 21 April 2026 |
| Bat Tutorial03-5 | single | Bat Tutorial03-5 | 38 | 1 | 0 | No | Tutorial | 1 | 0 | 1 | Bat | 21 April 2026 |
| Bat Tutorial04 | single | Bat Tutorial04 | 26 | 3 | 0 | No | Tutorial | 1 | 0 | 1 | Bat | 21 April 2026 |
| Bat Tutorial04-5 | single | Bat Tutorial04-5 | 26 | 4 | 0 | No | Tutorial | 0 | 0 | 1 | Bat | 21 April 2026 |
| Bat Tutorial05 | single | Bat Tutorial05 | 30 | 2 | 0 | No | Tutorial | 1 | 0 | 1 | Bat | 21 April 2026 |
| Bat Weak | single | Bat Weak | 10 | 15 | 0 | No |  | 1 | 0 | 0 | Bat | 21 April 2026 |
| BeastDemon | single | BeastDemon | 1200 | 6 | 0 | No | Cappella Magna | 8 | 0 | 0.6 | DemonBeast | 21 April 2026 |
| BeastDemonElite | single | BeastDemonElite | 50000 | 70 | 0 | Yes | Cappella Magna | 22 | -1 | 0.65 | DemonBeast, Elite | 21 April 2026 |
| BeastDemonElite Ambush | single | BeastDemonElite_Ambush | 50000 | 75 | 0 | Yes | Cappella Magna | 22 | -1 | 0.65 | DemonBeast, Elite | 21 April 2026 |
| Brazier Weak | single | Brazier_Weak | 5 | 0 | 0 | No |  | 0 | 0 | 0 | Brazier | 21 April 2026 |
| BridgeGuardian | single | BridgeGuardian | 400 | 4 | 0 | No | Teeny Bridge | 2 | 0 | 0.3 | Guardian | 21 April 2026 |
| CollosalFlameElite | single | CollosalFlameElite | 20000 | 65 | 0 | Yes | Gallo Tower | 25 | -1 | 3.6 | DragonShrimp, Elite | 21 April 2026 |
| DevilElite | single | DevilElite | 8000 | 50 | 0 | Yes | Gallo Tower | 10 | -1 | 3.4 | Ghiavalo, Elite | 21 April 2026 |
| Dragonshrimp | single | Dragonshrimp | 500 | 5 | 0 | No | Gallo Tower | 6 | 0 | 0.6 | DragonShrimp | 21 April 2026 |
| Drowner | single | Drowner | 4000 | 0 | 1 | No | Any | 11 | 0 | 0 | Drowner | 21 April 2026 |
| Durga | single | Durga | 450 | 3 | 0 | No | Cappella Magna | 5 | 0 | 0.15 | Durga | 21 April 2026 |
| Ecto | single | Ecto | 40 | 2 | 0 | No | Inlaid Library | 1 | 0 | 0.2 | Ecto | 21 April 2026 |
| EctoElite | single | EctoElite | 1000 | 40 | 0 | Yes | Inlaid Library | 8 | -1 | 2 | Ecto, Elite | 21 April 2026 |
| EnderEliteP1 | single | EnderEliteP1 | 225000 | 0 | 0 | Yes | Cappella Magna | 30 | 0 | 4.8 | Ender, Elite | 21 April 2026 |
| EnderEliteP2 | single | EnderEliteP2 | 115000 | 0 | 0 | Yes | Cappella Magna | 6 | 0 | 4.8 | Ender, Elite | 21 April 2026 |
| EyeBallElite | single | EyeBallElite | 28000 | 60 | 0 | Yes | Cappella Magna | 16 | -1 | 4.4 | Eyeball, Elite | 21 April 2026 |
| EyeBallElite Ambush | single | EyeBallElite_Ambush | 28000 | 65 | 0 | Yes | Cappella Magna | 16 | -1 | 4.4 | Eyeball, Elite | 21 April 2026 |
| FallenAngel | single | FallenAngel | 350 | 2 | 0 | No | Cappella Magna | 3 | 0 | 0 | FallenAngel | 21 April 2026 |
| FallenAngelElite | single | FallenAngelElite | 18000 | 55 | 0 | Yes | Cappella Magna | 14 | -1 | 4.4 | FallenAngel, Elite | 21 April 2026 |
| FallenArchangel | single | FallenArchangel | 150 | 2 | 0 | No | Cappella Magna | 7 | 0 | 0.5 | FallenArchangel | 21 April 2026 |
| FallenThrone | single | FallenThrone | 800 | 5 | 0 | No | Cappella Magna | 8 | 0 | 0.45 | FallenThrone | 21 April 2026 |
| FlowerWall | single | FlowerWall | 60 | 4 | 0 | No | Mad Forest | 1 | 0 | 1.5 | Flower | 21 April 2026 |
| FlowerWall2 | single | FlowerWall2 | 200 | 5 | 0 | No | Mad Forest | 4 | 0 | 1 | Flower | 21 April 2026 |
| GalloElite | single | GalloElite | 80000 | 80 | 0 | Yes | Gallo Tower | 22 | -1 | 4 | Gallo, Elite | 21 April 2026 |
| Gallotrice | single | Gallotrice | 1000 | 6 | 0 | No | Dairy Plant | 5 | 0 | 0.9 | Gallotrice | 21 April 2026 |
| GallotriceElite | single | GallotriceElite | 12500 | 70 | 0 | Yes | Dairy Plant | 14 | -1 | 3 | Gallotrice, Elite | 21 April 2026 |
| Ghiavolo | single | Ghiavolo | 440 | 4 | 0 | No | Gallo Tower | 3 | 0 | 0.4 | Ghiavalo | 21 April 2026 |
| Ghost | single | Ghost | 100 | 3 | 0 | No | Inlaid Library | 2 | 0 | 0.4 | Ghost | 21 April 2026 |
| GhostElite | single | GhostElite | 1500 | 45 | 0 | Yes | Inlaid Library | 9 | -1 | 0.4 | Ghost, Elite | 21 April 2026 |
| GhostElite Ambush | single | GhostElite_Ambush | 2200 | 50 | 0 | Yes | Inlaid Library | 12 | -2 | 0.4 | Ghost, Elite | 21 April 2026 |
| Ghoul | single | Ghoul | 40 | 3 | 0 | No | Mad Forest | 2 | 0 | 0.4 | Ghoul | 21 April 2026 |
| GiantArmouredKnightElite | single | GiantArmouredKnightElite | 10000 | 65 | 0 | Yes | Dairy Plant | 16 | -1 | 3 | ArmouredKnight, Elite | 21 April 2026 |
| GiantArmouredKnightElite Ambush | single | GiantArmouredKnightElite_Ambush | 12000 | 70 | 0 | Yes | Dairy Plant | 14 | -2 | 3 | ArmouredKnight, Elite | 21 April 2026 |
| GiantBat | single | GiantBat | 600 | 6 | 0 | No | Teeny Bridge | 6 | 0 | 0.9 | Bat | 21 April 2026 |
| GiantCrabElite | single | GiantCrabElite | 35000 | 70 | 0 | Yes | Gallo Tower | 15 | -1 | 3.8 | Crab, Elite | 21 April 2026 |
| GiantCrabElite Ambush | single | GiantCrabElite_Ambush | 40000 | 75 | 0 | Yes | Gallo Tower | 20 | -1 | 3.8 | Crab, Elite | 21 April 2026 |
| GiantMummy | single | GiantMummy | 300 | 6 | 0 | No | Mad Forest | 4 | 0 | 0.9 | Mummy | 21 April 2026 |
| GiantMummy Elite | single | GiantMummy_Elite | 3000 | 60 | 0 | Yes | Mad Forest | 14 | -1 | 0.9 | Mummy, Elite | 21 April 2026 |
| GiantSkulloneElite | single | GiantSkulloneElite | 14000 | 55 | 0 | Yes | Gallo Tower | 12 | -1 | 3.8 | Skull, Elite | 21 April 2026 |
| GiantSkulloneElite Ambush | single | GiantSkulloneElite_Ambush | 15000 | 60 | 0 | Yes | Gallo Tower | 16 | -2 | 3.8 | Skull, Elite | 21 April 2026 |
| GlowingBat Elite | T1 | GlowingBat Elite-T1 | 100 | 40 | 1 | Yes | Mad Forest, Inlaid Library, Gallo Tower, Dairy Plant, Cappella Magna | 4 | -2 | 1.5 | Bat, Glowing, Elite | 21 April 2026 |
| GlowingBat Elite | T2 | GlowingBat Elite-T2 | 500 | 55 | 1 | Yes | Mad Forest, Inlaid Library, Gallo Tower, Dairy Plant, Cappella Magna | 7 | -2 | 1.5 | Bat, Glowing, Elite | 21 April 2026 |
| GlowingBat Elite | T3 | GlowingBat Elite-T3 | 1000 | 60 | 1 | Yes | Mad Forest, Inlaid Library, Gallo Tower, Dairy Plant, Cappella Magna | 8 | -2 | 1.5 | Bat, Glowing, Elite | 21 April 2026 |
| GlowingBat Elite | T4 | GlowingBat Elite-T4 | 1500 | 75 | 1 | Yes | Mad Forest, Inlaid Library, Gallo Tower, Dairy Plant, Cappella Magna | 13 | -2 | 1.5 | Bat, Glowing, Elite | 21 April 2026 |
| Golem | single | Golem | 420 | 4 | 0 | No | Dairy Plant | 4 | 0 | 0.6 | Golem | 21 April 2026 |
| GolemElite | single | GolemElite | 9000 | 60 | 0 | Yes | Dairy Plant | 10 | -1 | 0.7 | Golem, Elite | 21 April 2026 |
| GreenKnight | single | GreenKnight | 1000 | 3 | 0 | No | Cappella Magna | 20 | 0 | 0.4 | GreenKnight | 21 April 2026 |
| GreenKnightElite | single | GreenKnightElite | 36000 | 65 | 0 | Yes | Cappella Magna | 18 | -1 | 4.6 | GreenKnight, Elite | 21 April 2026 |
| Guardian 1 | single | Guardian_1 | 250 | 0 | 0 | No | Mad Forest | 1 | 0 | 0 | Guardian | 21 April 2026 |
| Guardian 2 | single | Guardian_2 | 400 | 0 | 0 | No | Inlaid Library | 2 | 0 | 0 | Guardian | 21 April 2026 |
| Guardian 3 | single | Guardian_3 | 450 | 0 | 0 | No | Dairy Plant | 4 | 0 | 0 | Guardian | 21 April 2026 |
| Guardian 4 | single | Guardian_4 | 800 | 0 | 0 | No | Gallo Tower. It is also named Guardian4 | 5 | 0 | 0 | Guardian | 21 April 2026 |
| Guardian 5 | single | Guardian_5 | 1000 | 0 | 0 | No | Cappella Magna | 8 | 0 | 0 | Guardian | 21 April 2026 |
| HagElite | single | HagElite | 11000 | 70 | 0 | Yes | Inlaid Library | 10 | -1 | 2.6 | Hag, Elite | 21 April 2026 |
| Harpy | single | Harpy | 700 | 6 | 0 | No | Gallo Tower | 7 | 0 | 0.8 | Harpy | 21 April 2026 |
| HarpyElite | single | HarpyElite | 40000 | 70 | 0 | Yes | Gallo Tower | 12 | -2 | 1.6 | Harpy, Elite | 21 April 2026 |
| Impefinger | single | Impefinger | 150 | 3 | 0 | No | Teeny Bridge | 1 | 0 | 0 | Imp | 21 April 2026 |
| Kali | single | Kali | 1800 | 6 | 0 | No | Cappella Magna | 8 | 0 | 0.2 | Kali | 21 April 2026 |
| LionHead | single | LionHead | 170 | 4 | 0 | No | Inlaid Library | 2 | 0 | 0.6 | LionHead | 21 April 2026 |
| LionHeadElite | single | LionHeadElite | 2000 | 55 | 0 | Yes | Inlaid Library | 10 | -1 | 2.2 | LionHead, Elite | 21 April 2026 |
| LizardElite | single | LizardElite | 6500 | 45 | 0 | Yes | Dairy Plant | 10 | -1 | 2.4 | Lizard, Elite | 21 April 2026 |
| LizardPawn | single | LizardPawn | 240 | 2 | 0 | No | Dairy Plant | 2 | 0 | 0.2 | Lizard | 21 April 2026 |
| LostTwinElite | single | LostTwinElite | 10000 | 65 | 0 | Yes | Dairy Plant | 6 | -2 | 0 | LostTwin, Elite | 21 April 2026 |
| ManticoreElite | single | ManticoreElite | 50000 | 75 | 0 | Yes | Gallo Tower | 22 | -1 | 3.7 | Manticore, Elite | 21 April 2026 |
| MantisElite | single | MantisElite | 1200 | 50 | 0 | Yes | Mad Forest | 12 | -1 | 2 | Mantis, Elite | 21 April 2026 |
| MantisElite Ambush | single | MantisElite_Ambush | 2500 | 55 | 0 | Yes | Mad Forest | 15 | -2 | 2 | Mantis, Elite | 21 April 2026 |
| MasterWitchElite | single | MasterWitchElite | 5500 | 65 | 0 | Yes | Inlaid Library | 16 | -1 | 2.6 | Witch, Elite | 21 April 2026 |
| Merman | single | Merman | 160 | 1 | 0 | No | Dairy Plant | 2 | 0 | 0 | Merman | 21 April 2026 |
| MermanElite | single | MermanElite | 5000 | 40 | 0 | Yes | Dairy Plant | 8 | -1 | 2.4 | Merman, Elite | 21 April 2026 |
| MermanElite Ambush | single | MermanElite_Ambush | 6000 | 45 | 0 | Yes | Dairy Plant | 8 | -2 | 2.4 | Merman, Elite | 21 April 2026 |
| MilkElemental | single | MilkElemental | 100 | 3 | 0 | No | Dairy Plant | 2 | 0 | 0.4 | Elemental | 21 April 2026 |
| MilkElementalElite | single | MilkElementalElite | 6000 | 45 | 0 | Yes | Dairy Plant | 4 | -2 | 2.6 | Elemental, Elite | 21 April 2026 |
| Minotaur | single | Minotaur | 320 | 3 | 0 | No | Dairy Plant | 4 | 0 | 0.4 | Minotaur | 21 April 2026 |
| MinotaurElite | single | MinotaurElite | 7500 | 50 | 0 | Yes | Dairy Plant | 12 | -1 | 2.6 | Minotaur, Elite | 21 April 2026 |
| MinotaurElite Ambush | single | MinotaurElite_Ambush | 8000 | 55 | 0 | Yes | Dairy Plant | 14 | -2 | 2.6 | Minotaur, Elite | 21 April 2026 |
| MoonAtlantean | single | MoonAtlantean | 25000 | 500 | 0 | No |  | 15 | 0 | 0 | Atlantean | 21 April 2026 |
| Mudman | single | Mudman | 20 | 1 | 0 | No | Inlaid Library | 1 | 0 | 0 | Mudman | 21 April 2026 |
| MudMan Weak | single | MudMan_Weak | 20 | 20 | 0 | No |  | 1 | 0 | 0 | Mudman | 21 April 2026 |
| MudmanElite | single | MudmanElite | 750 | 35 | 0 | Yes | Inlaid Library | 6 | -1 | 2 | Mudman, Elite | 21 April 2026 |
| NesuferitElite | single | NesuferitElite | 4000 | 50 | 0 | Yes | Inlaid Library | 14 | -2 | 2 | Nesurferit, Elite | 21 April 2026 |
| QueenMedusaElite | single | QueenMedusaElite | 3500 | 60 | 0 | Yes | Inlaid Library | 14 | -1 | 2.4 | Medusa, Elite | 21 April 2026 |
| QueenMedusaElite Ambush | single | QueenMedusaElite_Ambush | 4200 | 65 | 0 | Yes | Inlaid Library | 14 | -2 | 2.4 | Medusa, Elite | 21 April 2026 |
| Raiju | single | Raiju | 440 | 5 | 0 | No | Teeny Bridge | 5 | 0 | 0.7 | Raiju | 21 April 2026 |
| RedDeath | single | RedDeath | 1000000 | 0 | 0.01 | No | All | 333 | 0 | 0 | RedReaper | 21 April 2026 |
| Scarleton | single | Scarleton | 480 | 4 | 0 | No | Gallo Tower | 3 | 0 | 2.5 | Skeleton | 21 April 2026 |
| ShadeBomb | single | ShadeBomb | 80 | 5 | 0 | No | Inlaid Library | 1 | 0 | 1.6 | Shade | 21 April 2026 |
| Skeleton2 | single | Skeleton2 | 330 | 3 | 0 | No | Gallo Tower | 3 | 0 | 0.2 | Skeleton | 21 April 2026 |
| Skeleton3 | single | Skeleton3 | 25 | 2 | 0 | No | Mad Forest | 1 | 0 | 0.2 | Skeleton | 21 April 2026 |
| Skeleton3 Elite | single | Skeleton3 Elite | 600 | 35 | 0 | Yes | Mad Forest | 4 | -1 | 1.6 | Skeleton, Elite | 21 April 2026 |
| Skullino | single | Skullino | 240 | 2 | 0 | No | Gallo Tower | 2 | 0 | 0 | Skull | 21 April 2026 |
| SneakyHead | single | SneakyHead | 200 | 5 | 0 | No | Inlaid Library | 3 | 0 | 0.8 | SneakyHead | 21 April 2026 |
| Succubus | single | Succubus | 400 | 4 | 0 | No | Cappella Magna | 10 | 0 | 0.2 | Succubus | 21 April 2026 |
| SuccubusElite | single | SuccubusElite | 50000 | 70 | 0 | Yes | Cappella Magna | 25 | -2 | 4.8 | Succubus, Elite | 21 April 2026 |
| SunAtlantean | single | SunAtlantean | 25000 | 500 | 0 | No |  | 15 | 0 | 0 | Atlantean | 21 April 2026 |
| SwordFlint | single | SwordFlint | 30000 | 80 | 0 | Yes | Teeny Bridge | 14 | -2 | 1.8 | Sword, Elite | 21 April 2026 |
| Swordian | single | Swordian | 10000 | 70 | 0 | Yes | Teeny Bridge | 10 | -1 | 1.8 | Sword, Elite | 21 April 2026 |
| SwordiLee | single | SwordiLee | 20000 | 75 | 0 | Yes | Teeny Bridge | 12 | -1 | 1.8 | Sword, Elite | 21 April 2026 |
| TraineeRedReaper | single | TraineeRedReaper | 2400 | 8 | 0 | No | Cappella Magna | 12 | 0 | 0.9 | RedReaper | 21 April 2026 |
| TreasureBat Elite | single | TreasureBat Elite | 800 | 45 | 0 | Yes | Mad Forest | 3 | -2 | 1.8 | Bat, Elite, Treasure | 21 April 2026 |
| Trickster | single | Trickster | 30000 | 0 | 0 | No | Any | 30 | 0 | 0 | Trickster | 21 April 2026 |
| TrinacriaElite | single | TrinacriaElite | 100000 | 80 | 0 | Yes | Cappella Magna | 22 | -1 | 5 | Trinacria, Elite | 21 April 2026 |
| TritontElite | single | TritontElite | 8000 | 75 | 0 | Yes | Dairy Plant | 12 | -1 | 2.8 | Triton, Elite | 21 April 2026 |
| TwinDemon | single | TwinDemon | 300 | 6 | 0 | No | Dairy Plant | 2 | 0 | 2.4 | TwinDemon | 21 April 2026 |
| VenusElite | single | VenusElite | 8000 | 65 | 0 | Yes | Mad Forest | 14 | -1 | 2 | Venus, Elite | 21 April 2026 |
| Werewolf | single | Werewolf | 250 | 5 | 0 | No | Mad Forest | 3 | 0 | 0.8 | Werewolf | 21 April 2026 |
| Werewolf Weak | single | Werewolf_Weak | 50 | 50 | 0 | No |  | 3 | 0 | 0 | Werewolf | 21 April 2026 |
| WerewolfElite | single | WerewolfElite | 2200 | 55 | 0 | Yes | Mad Forest | 13 | -1 | 2.2 | Werewolf, Elite | 21 April 2026 |
| Zombie | single | Zombie | 125 | 4 | 0 | No | Mad Forest | 2 | 0 | 0.6 | Zombie | 21 April 2026 |
| Zombie Elite | single | Zombie Elite | 750 | 40 | 0 | Yes | Mad Forest | 7 | -1 | 1.8 | Zombie, Elite | 21 April 2026 |
| Zombie Weak | single | Zombie_Weak | 30 | 40 | 0 | No |  | 2 | 0 | 0 | Zombie | 21 April 2026 |

## Enemy Resistance / Chance Value Rows

| Page | Variant | Name | Knockback Resist | Disarm Resist | Instakill Resist | Max Armor | Wound Chance | Total Chance |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| ApprenticeWitch | single | ApprenticeWitch | 0 | 0 | 0 | 30 | 0 | 95 |
| ArchDemon | single | ArchDemon | 0 | 0 | 0 | 250 | 0 | 100 |
| ArchDemonElite | single | ArchDemonElite | 70 | 60 | 0.9 | 666 | 0 | 300 |
| ArchonAscia | single | ArchonAscia | 0 | 0 | 0 | 40 | 0 | 100 |
| ArchonOro | single | ArchonOro | 0 | 0 | 0 | 100 | 0 | 70 |
| ArchonSpada | single | ArchonSpada | 0 | 0 | 0 | 250 | 0 | 100 |
| Bat | single | Bat | 0 | 0 | 0 | 0 | 0 | 100 |
| Bat COWARD | single | Bat_COWARD | 0 | 0 | 0 | 0 | 0 | 10 |
| Bat Elite | single | Bat Elite | 60 | 50 | 0.75 | 0 | 0 | 100 |
| Bat Glowing | T1 | Bat Glowing-T1 | 0 | 0 | 0 | 0 | 0 | 100\|types = Bat, Glowing |
| Bat Glowing | T2 | Bat Glowing-T2 | 0 | 0 | 0 | 0 | 0 | 100\|types = Bat, Glowing |
| Bat Glowing | T3 | Bat Glowing-T3 | 0 | 0 | 0 | 0 | 0 | 100\|types = Bat, Glowing |
| Bat Glowing | T4 | Bat Glowing-T4 | 0 | 0 | 0 | 0 | 0 | 100\|types = Bat, Glowing |
| Bat Tutorial00 | single | Bat Tutorial00 | 0 | 0 | 0 | 0 | 0 | 10 |
| Bat Tutorial01 | single | Bat Tutorial01 | 0 | 0 | 0 | 0 | 0 | 10 |
| Bat Tutorial01 DoubleXP | single | Bat Tutorial01 DoubleXP | 0 | 0 | 0 | 0 | 0 | 10 |
| Bat Tutorial02 | single | Bat Tutorial02 | 0 | 0 | 0 | 4 | 0 | 100 |
| Bat Tutorial03 | single | Bat Tutorial03 | 0 | 0 | 0 | 0 | 0 | 100 |
| Bat Tutorial03-5 | single | Bat Tutorial03-5 | 0 | 0 | 0 | 0 | 0 | 100 |
| Bat Tutorial04 | single | Bat Tutorial04 | 0 | 0 | 0 | 0 | 0 | 100 |
| Bat Tutorial04-5 | single | Bat Tutorial04-5 | 0 | 0 | 0 | 0 | 0 | 0 |
| Bat Tutorial05 | single | Bat Tutorial05 | 0 | 0 | 0 | 0 | 0 | 71 |
| Bat Weak | single | Bat Weak | 0 | 0 | 0 | 0 | 0 | 100 |
| BeastDemon | single | BeastDemon | 0 | 0 | 0 | 65 | 0 | 100 |
| BeastDemonElite | single | BeastDemonElite | 70 | 55 | 0.9 | 0 | 0 | 300 |
| BeastDemonElite Ambush | single | BeastDemonElite_Ambush | 60 | 50 | 0.9 | 0 | 0 | 300 |
| Brazier Weak | single | Brazier_Weak | 0 | 0 | 0 | 0 | 0 | 100 |
| BridgeGuardian | single | BridgeGuardian | 20 | 0 | 0.8 | 40 | 0 | 100 |
| CollosalFlameElite | single | CollosalFlameElite | 65 | 55 | 0.8 | 600 | 0 | 300 |
| DevilElite | single | DevilElite | 60 | 50 | 0.8 | 400 | 0 | 200 |
| Dragonshrimp | single | Dragonshrimp | 0 | 0 | 0 | 100 | 0 | 100 |
| Drowner | single | Drowner | 80 | 80 | 0.9 | 0 | 0 | 100 |
| Durga | single | Durga | 0 | 0 | 0 | 0 | 0 | 100 |
| Ecto | single | Ecto | 0 | 0 | 0 | 6 | 0 | 100 |
| EctoElite | single | EctoElite | 65 | 40 | 0.75 | 100 | 0 | 100 |
| EnderEliteP1 | single | EnderEliteP1 | 80 | 60 | 0.99 | 0 | 0 | 300 |
| EnderEliteP2 | single | EnderEliteP2 | 60 | 50 | 0.99 | 0 | 0 | 100 |
| EyeBallElite | single | EyeBallElite | 65 | 50 | 0.85 | 0 | 0 | 300 |
| EyeBallElite Ambush | single | EyeBallElite_Ambush | 65 | 50 | 0.85 | 0 | 0 | 300 |
| FallenAngel | single | FallenAngel | 0 | 0 | 0 | 50 | 0 | 100 |
| FallenAngelElite | single | FallenAngelElite | 60 | 50 | 0.9 | 500 | 0 | 270 |
| FallenArchangel | single | FallenArchangel | 0 | 0 | 0 | 10 | 0 | 100 |
| FallenThrone | single | FallenThrone | 0 | 0 | 0 | 60 | 0 | 100 |
| FlowerWall | single | FlowerWall | 0 | 0 | 0 | 6 | 0 | 100 |
| FlowerWall2 | single | FlowerWall2 | 0 | 0 | 0 | 20 | 0 | 120 |
| GalloElite | single | GalloElite | 80 | 60 | 0.99 | 600 | 0 | 261 |
| Gallotrice | single | Gallotrice | 0 | 0 | 0 | 0 | 0 | 60 |
| GallotriceElite | single | GallotriceElite | 75 | 60 | 0.9 | 0 | 0 | 205 |
| Ghiavolo | single | Ghiavolo | 0 | 0 | 0 | 30 | 0 | 100 |
| Ghost | single | Ghost | 0 | 0 | 0 | 15 | 0 | 100 |
| GhostElite | single | GhostElite | 65 | 55 | 0.85 | 150 | 0 | 100 |
| GhostElite Ambush | single | GhostElite_Ambush | 80 | 50 | 0.85 | 220 | 0 | 100 |
| Ghoul | single | Ghoul | 0 | 0 | 0 | 6 | 0 | 100 |
| GiantArmouredKnightElite | single | GiantArmouredKnightElite | 70 | 60 | 0.85 | 350 | 0 | 300 |
| GiantArmouredKnightElite Ambush | single | GiantArmouredKnightElite_Ambush | 95 | 90 | 0.85 | 250 | 0 | 100 |
| GiantBat | single | GiantBat | 30 | 0 | 0.85 | 30 | 0 | 100 |
| GiantCrabElite | single | GiantCrabElite | 60 | 55 | 0.85 | 600 | 0 | 201 |
| GiantCrabElite Ambush | single | GiantCrabElite_Ambush | 70 | 55 | 0.9 | 300 | 0 | 201 |
| GiantMummy | single | GiantMummy | 50 | 0 | 0 | 50 | 0 | 100 |
| GiantMummy Elite | single | GiantMummy_Elite | 70 | 50 | 0.8 | 360 | 0 | 100 |
| GiantSkulloneElite | single | GiantSkulloneElite | 65 | 50 | 0.75 | 450 | 0 | 200 |
| GiantSkulloneElite Ambush | single | GiantSkulloneElite_Ambush | 85 | 50 | 0.75 | 600 | 0 | 198 |
| GlowingBat Elite | T1 | GlowingBat Elite-T1 | 60 | 50 | 0.75 | 0 | 0 | 100 |
| GlowingBat Elite | T2 | GlowingBat Elite-T2 | 60 | 60 | 0.75 | 0 | 0 | 200 |
| GlowingBat Elite | T3 | GlowingBat Elite-T3 | 60 | 55 | 0.75 | 0 | 0 | 200 |
| GlowingBat Elite | T4 | GlowingBat Elite-T4 | 65 | 55 | 0.75 | 0 | 0 | 200 |
| Golem | single | Golem | 0 | 0 | 0 | 70 | 0 | 100 |
| GolemElite | single | GolemElite | 70 | 55 | 0.9 | 300 | 0 | 190 |
| GreenKnight | single | GreenKnight | 0 | 0 | 0 | 40 | 0 | 100 |
| GreenKnightElite | single | GreenKnightElite | 65 | 55 | 0.9 | 550 | 0 | 300 |
| Guardian 1 | single | Guardian_1 | 60 | 50 | 0.8 | 19 | 0 | 90 |
| Guardian 2 | single | Guardian_2 | 60 | 50 | 0.8 | 30 | 0 | 100 |
| Guardian 3 | single | Guardian_3 | 60 | 50 | 0.8 | 30 | 0 | 100 |
| Guardian 4 | single | Guardian_4 | 60 | 50 | 0.8 | 40 | 0 | 95 |
| Guardian 5 | single | Guardian_5 | 60 | 50 | 0.8 | 60 | 0 | 100 |
| HagElite | single | HagElite | 70 | 50 | 0.85 | 300 | 0 | 265 |
| Harpy | single | Harpy | 0 | 0 | 0 | 120 | 0 | 100 |
| HarpyElite | single | HarpyElite | 80 | 90 | 0.8 | 300 | 0 | 200 |
| Impefinger | single | Impefinger | 15 | 0 | 0.75 | 20 | 0 | 100 |
| Kali | single | Kali | 50 | 25 | 0 | 90 | 0 | 100 |
| LionHead | single | LionHead | 50 | 0 | 0 | 34 | 0 | 100 |
| LionHeadElite | single | LionHeadElite | 65 | 45 | 0.75 | 200 | 0 | 95 |
| LizardElite | single | LizardElite | 65 | 50 | 0.75 | 150 | 0 | 200 |
| LizardPawn | single | LizardPawn | 0 | 0 | 0 | 30 | 0 | 100 |
| LostTwinElite | single | LostTwinElite | 85 | 80 | 0.8 | 666 | 0 | 200 |
| ManticoreElite | single | ManticoreElite | 75 | 90 | 0.85 | 550 | 0 | 290 |
| MantisElite | single | MantisElite | 70 | 55 | 0.8 | 120 | 0 | 100 |
| MantisElite Ambush | single | MantisElite_Ambush | 70 | 55 | 0.8 | 185 | 0 | 100 |
| MasterWitchElite | single | MasterWitchElite | 70 | 50 | 0.8 | 550 | 0 | 100 |
| Merman | single | Merman | 0 | 0 | 0 | 0 | 0 | 100 |
| MermanElite | single | MermanElite | 60 | 50 | 0.75 | 0 | 0 | 285 |
| MermanElite Ambush | single | MermanElite_Ambush | 65 | 55 | 0.75 | 55 | 0 | 100 |
| MilkElemental | single | MilkElemental | 80 | 0 | 0.5 | 30 | 0 | 100 |
| MilkElementalElite | single | MilkElementalElite | 80 | 80 | 0.8 | 250 | 0 | 100 |
| Minotaur | single | Minotaur | 0 | 0 | 0 | 25 | 0 | 100 |
| MinotaurElite | single | MinotaurElite | 65 | 55 | 0.75 | 80 | 0 | 200 |
| MinotaurElite Ambush | single | MinotaurElite_Ambush | 65 | 55 | 0.8 | 300 | 0 | 200 |
| MoonAtlantean | single | MoonAtlantean | 0 | 0 | 0 | 0 | 0 | 100 |
| Mudman | single | Mudman | 0 | 0 | 0 | 4 | 0 | 100 |
| MudMan Weak | single | MudMan_Weak | 0 | 0 | 0 | 1 | 0 | 100 |
| MudmanElite | single | MudmanElite | 60 | 30 | 0.75 | 90 | 0 | 95 |
| NesuferitElite | single | NesuferitElite | 80 | 90 | 0.8 | 200 | 0 | 100 |
| QueenMedusaElite | single | QueenMedusaElite | 70 | 50 | 0.75 | 350 | 0 | 100 |
| QueenMedusaElite Ambush | single | QueenMedusaElite_Ambush | 70 | 50 | 0.75 | 420 | 0 | 100 |
| Raiju | single | Raiju | 20 | 0 | 0.8 | 80 | 0 | 100 |
| RedDeath | single | RedDeath | 99 | 95 | 1 | 0 | 0 | 300 |
| Scarleton | single | Scarleton | 0 | 0 | 0 | 50 | 0 | 100 |
| ShadeBomb | single | ShadeBomb | 0 | 0 | 0 | 0 | 0 | 61 |
| Skeleton2 | single | Skeleton2 | 0 | 0 | 0 | 80 | 0 | 100 |
| Skeleton3 | single | Skeleton3 | 0 | 0 | 0 | 5 | 0 | 100 |
| Skeleton3 Elite | single | Skeleton3 Elite | 65 | 50 | 0.75 | 60 | 0 | 100 |
| Skullino | single | Skullino | 0 | 0 | 0 | 70 | 0 | 100 |
| SneakyHead | single | SneakyHead | 0 | 0 | 0 | 30 | 0 | 100 |
| Succubus | single | Succubus | 0 | 0 | 0 | 30 | 0 | 100 |
| SuccubusElite | single | SuccubusElite | 70 | 60 | 0.9 | 150 | 0 | 300 |
| SunAtlantean | single | SunAtlantean | 0 | 0 | 0 | 0 | 0 | 100 |
| SwordFlint | single | SwordFlint | 70 | 60 | 0.9 | 300 | 0 | 210 |
| Swordian | single | Swordian | 60 | 50 | 0.9 | 0 | 0 | 150 |
| SwordiLee | single | SwordiLee | 65 | 55 | 0.9 | 300 | 0 | 200 |
| TraineeRedReaper | single | TraineeRedReaper | 0 | 0 | 0 | 0 | 0 | 70 |
| TreasureBat Elite | single | TreasureBat Elite | 80 | 60 | 0.75 | 0 | 0 | 100 |
| Trickster | single | Trickster | 95 | 95 | 0.75 | 0 | 0 | 100 |
| TrinacriaElite | single | TrinacriaElite | 80 | 60 | 0.95 | 300 | 0 | 299.97003 |
| TritontElite | single | TritontElite | 80 | 60 | 0.8 | 0 | 0 | 300 |
| TwinDemon | single | TwinDemon | 25 | 0 | 0.6 | 100 | 0 | 90 |
| VenusElite | single | VenusElite | 70 | 50 | 0.8 | 500 | 0 | 200 |
| Werewolf | single | Werewolf | 0 | 0 | 0 | 15 | 0 | 100 |
| Werewolf Weak | single | Werewolf_Weak | 0 | 0 | 0 | 1 | 0 | 100 |
| WerewolfElite | single | WerewolfElite | 70 | 50 | 0.8 | 220 | 0 | 100 |
| Zombie | single | Zombie | 0 | 0 | 0 | 18 | 0 | 100 |
| Zombie Elite | single | Zombie Elite | 65 | 55 | 0.8 | 75 | 0 | 100 |
| Zombie Weak | single | Zombie_Weak | 0 | 0 | 0 | 1 | 0 | 90 |

## Dungeon Event Category Value Rows

| Page | Common Event Infobox? | Wikitext Bytes | Keyword Buckets |
| --- | --- | ---: | --- |
| Abandoned cart | no | 803 | attack, crawler, stat |
| Bat Goblin | no | 169 | crawler |
| Card stat offering table | no | 754 | armor, card, coin, crawler, stat |
| Duplicate offering table | no | 231 | card, crawler, duplicate |
| Evolution statue | no | 1201 | card, chest, coin, crawler, evolution, floor, gem, stat |
| Floor chicken offering table | no | 130 | crawler, floor, heal |
| Light source | no | 130 | crawler, light |
| Mana offering table | no | 121 | crawler, mana |
| Mana statue | no | 113 | crawler, mana, stat |
| Treasure chest | no | 147 | chest, crawler |

## Power-Up Value Rows

| Page | Infobox Name | ID | Max Level | Bonus | Max Effect | Stacking | Cost | Unlock Field | Description Keyword Buckets | Release |
| --- | --- | --- | ---: | --- | --- | --- | ---: | --- | --- | --- |
| Amount | Amount | PowerUp_Amount | 3 | +1 | +3 | Additive | 1250 | Complete Meany Bridge |  | 21 April 2026 |
| Area | Area | PowerUp_Area | 5 | +10% | +50% | Additive | 850 | Accessing Power Ups shop | attack | 21 April 2026 |
| Armor (stat) | Armor | PowerUp_Armor | 3 | +2 | +6 | Additive | 1250 | Accessing Power Ups shop | armor | 21 April 2026 |
| Banish | Banish | PowerUp_Banish | 5 | +2 | +10 | Additive | 300 | Complete Weeny Bridge | card | 21 April 2026 |
| Crawler Slot | Crawler Slot | PowerUp_CharacterSlot | 2 | +1 | +2 | Additive | 3500 | Complete Meany Bridge | crawler | 21 April 2026 |
| Curse | Curse | PowerUp_Curse | 5 | +20% | +100% | Additive | 350 | Complete Weeny Bridge |  | 21 April 2026 |
| Duration | Duration | PowerUp_Duration | 5 | +1 | +5 | Additive | 250 | Accessing Power Ups shop | crawler, stat | 21 April 2026 |
| Greed | Greed | PowerUp_Greed | 4 | +25% | +100% | Additive | 1000 | Complete Inlaid Library | coin | 21 April 2026 |
| Growth | Growth | PowerUp_Growth | 5 | +20% | +100% | Additive | 750 | Accessing Power Ups shop |  | 21 April 2026 |
| Hand | Hand | PowerUp_Speed | 2 | +1 | +2 | Additive | 2500 | Complete Weeny Bridge | card | 21 April 2026 |
| Luck | Luck | PowerUp_Luck | 3 | +25% | +75% | Additive | 400 | Accessing Power Ups shop | stat | 21 April 2026 |
| Magnet | Magnet | PowerUp_Magnet | 1 | +1 | +1 | Additive | 2000 | Complete Weeny Bridge | card | 21 April 2026 |
| Mana | Cooldown | PowerUp_Cooldown | 2 | +1 | +2 | Additive | 3500 | Complete Meany Bridge | mana | 21 April 2026 |
| Max Health | Max Health | PowerUp_MaxHealth | 5 | +10% | +50% | Additive | 450 | Accessing Power Ups shop | heal, stat | 21 April 2026 |
| Might | Might | PowerUp_Might | 5 | +25% | +125% | Additive | 500 | Accessing Power Ups shop | attack | 21 April 2026 |
| Recovery | Recovery | PowerUp_Recovery | 3 | +1 | +3 | Additive | 500 | Accessing Power Ups shop | heal | 21 April 2026 |
| Reroll | Reroll | PowerUp_Reroll | 5 | +2 | +10 | Additive | 200 | Accessing Power Ups shop |  | 21 April 2026 |
| Revival | Revival | PowerUp_Revival | 1 | +1 | +1 | Additive | 4000 | Complete Weeny Bridge |  | 21 April 2026 |
| Skip | Skip | PowerUp_Skip | 5 | +2 | +10 | Additive | 250 |  |  | 21 April 2026 |

## Required Follow-Up

- Treat the 132 expanded enemy value rows as a nameplate/stat capture queue, not as final runtime membership.
- Verify enemy rows with stage/floor UI, combat HUD, game files, or direct runtime proof before implementing HP, XP, max-hit, resistance, or boss behavior.
- Verify the two category-only enemy pages before using them as normal/boss taxonomy.
- Use `event-taxonomy-reconciliation.md` to separate actionable wiki mechanics from sparse label-only pages, then verify the 10 dungeon-event pages in event UI or game files because this crawl finds no common event infobox and no complete option/cost/reward table.
- Verify all 19 Power-Up rows in the Power-Up Shop or game files before treating costs, rank caps, unlocks, or Mana/Cooldown naming as final.
- Keep secondary conflicts open until UI/game-file/direct proof resolves Reroll cost, Might/Luck bonus size, Mana/Cooldown label, Trickster trigger/stat scaling, and official enemy membership.
