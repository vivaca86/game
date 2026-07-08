# Enemy Taxonomy Reconciliation

Status: `source-level reconciliation artifact / direct UI-game-file proof required / implementation parity 0`
Last updated: 2026-05-22

This artifact reconciles the enemy and boss evidence already present in the GitHub handoff set. It does not inspect local files. Current implementation state is referenced only through the existing GitHub research docs, especially [`enemy-gap-map.md`](./enemy-gap-map.md).

## Purpose

The enemy data currently exists in several different layers that look similar but should not be merged yet. This document keeps those layers separate so the next proof pass can capture the right UI/game-file evidence without accidentally treating source-level rows as finished runtime behavior.

The most important boundary is this: the 9 named enemy/boss unlock targets from Steam achievements are not the same thing as the 132 expanded official-wiki enemy value rows. The 9 rows are public unlock/task metadata. The 132 rows are a broader official-wiki nameplate/stat queue. Both are useful, but neither proves final shipped combat behavior without UI, direct play, high-resolution video, or game-file confirmation.

## Evidence Boundary

| Boundary | Current Rule |
| --- | --- |
| Direct play | Still blocked in the handoff baseline. Do not treat this document as direct-play proof. |
| Official wiki values | Usable as official source-level row values and capture planning, not as installed-build runtime proof. |
| Steam achievements | Usable as official public enemy/boss names and unlock-trigger metadata, not as HP, attack, phase, or reward proof. |
| Secondary guides | Usable for route and conflict planning only. They cannot authorize implementation. |
| Storyboard videos | Usable as partial visual candidates only where the frame is Vampire Crawlers and the timestamp is recorded. |
| Current prototype | Existing GitHub docs report `0` exact enemy parity. This document does not re-audit local code. |
| Implementation | Remains closed until every accepted enemy row has name, stage/floor, spawn trigger, HP/armor, intent, attacks, reward, unlock consequence, and acceptance condition. |

## Source Layers

| Layer | Main Files | What It Proves | What It Does Not Prove |
| --- | --- | --- | --- |
| Official achievement metadata | [`data-achievements.md`](./data-achievements.md), [`data-enemies.md`](./data-enemies.md) | 9 public named enemy/boss unlock targets and trigger wording | Runtime membership, visual mapping, HP, attacks, reward UI, stage/floor |
| Official wiki enemy values | [`official-wiki-enemy-event-powerup-field-crawl.md`](./official-wiki-enemy-event-powerup-field-crawl.md), [`official-wiki-enemy-event-powerup-value-extract.md`](./official-wiki-enemy-event-powerup-value-extract.md) | 128 enemy category rows, 126 enemy infobox pages, 132 expanded value rows, boss flags, dungeon fields, HP/XP/max-hit/resistance/chance fields | Current installed-build parity, in-game display names, spawn tables, encounter order, formulas, event rewards |
| Secondary route/context guides | [`data-enemies.md`](./data-enemies.md), generated secondary crawls | Route hints for Mantichana, Milk Elemental, Giant Enemy Crab, Skeleton/Lion Head/Dragon Shrimp, and stage-end boss loop | Exact stage boss roster, UI labels, combat behavior, unlock persistence |
| Trickster special-source layer | [`enemy-trickster-secondary-crawl.md`](./enemy-trickster-secondary-crawl.md), CON-028 to CON-030 | Card-shatter/card-break trigger hypotheses, reward-name conflict, source-level stat conflict | Exact threshold, card-loss behavior, damage scaling, multi-spawn cap, reward popup |
| Video storyboard layer | VID-003 to VID-012 references in [`data-enemies.md`](./data-enemies.md) and [`enemy-gap-map.md`](./enemy-gap-map.md) | 9 visual boss/elite pressure groups and final-boss-like sequences | Names, HP, stage/floor certainty, kill/result linkage, row mapping |
| Prototype gap layer | [`enemy-gap-map.md`](./enemy-gap-map.md) | Current documented implementation parity is `0`; Skeleton is only placeholder-adjacent | Any exact original-accurate enemy implementation |

## Count Reconciliation

| Count / Row Set | Current Meaning | Reconciliation Rule |
| --- | --- | --- |
| 9 official named enemy/boss unlock targets | Steam achievement-backed names or targets: Mantichana, Dragon Shrimp, Lion Head, Skeleton, Milk Elemental, Gallo, Giant Enemy Crab, Nesufritto, The Trickster | Treat as public unlock metadata. Capture nameplate and runtime behavior before mapping to wiki rows or implementation. |
| 128 official-wiki enemy category rows | Category crawl rows after excluding the index page | Treat as broad taxonomy/page inventory. Two rows are category-only pages, not enemy infoboxes. |
| 126 official-wiki enemy infobox pages | Pages exposing `Infobox VC Enemy` | Treat as source-level value pages, not runtime membership proof. |
| 132 expanded official-wiki value rows | 126 pages expanded after variant splits such as T1-T4 rows | Treat as the main capture queue for names/stats/stages. Do not collapse into a final runtime table yet. |
| 55 boss-flag Yes / 71 boss-flag No pages | Official-wiki page-level boss field split | Use as a capture hint only. It may not match stage-end boss UX, special enemies, or reward logic. |
| 9 video-only boss/elite visual groups | Storyboard-level pressure visuals | Keep separate from named/static rows until readable nameplate or direct mapping exists. |
| 1 final-boss name hypothesis | `The Ender` from community/name hypothesis plus final-boss-like video visuals | Keep separate from official-wiki `EnderEliteP1/P2` rows until direct UI/game-file proof resolves display name and phase identity. |
| 0 exact current implementation parity | Existing GitHub gap map result | Do not implement or claim parity from this reconciliation alone. |

## Conflict Touchpoints

| Conflict ID | Enemy-Relevant Topic | Current Handling |
| --- | --- | --- |
| CON-024 | Character unlock wording: named boss/enemy vs stage clear | Prefer official achievement text as metadata, but verify Town Hall, unlock popup, boss kill, and Inn/roster state before finalizing. |
| CON-028 | Trickster classification and spawn trigger | Treat Trickster as a special card-shatter/card-break enemy separate from fixed stage bosses until direct proof captures the trigger and combat state. |
| CON-029 | Trickster reward label | Use `Uncrackable Gem` as the working official-metadata label, preserve `Unbreakable Gem` as a secondary alias until gem UI proves the display text. |
| CON-030 | Trickster stats and damage scaling | Preserve official-wiki/GamerBlurb 30,000 HP/max-hit 30 source values and Nintendo Wire damage examples as unresolved until direct runtime proof. |
| CON-037 | Official count shorthand vs row-level tables | Treat official shorthand counts and row-level wiki/source tables as different layers. The 132 enemy rows are not final runtime membership proof. |
| CON-041 | O'Sole Dragon Shrimp unlock count | Keep 50-vs-15 Dragon Shrimp conflict open until achievement/Town Hall/character unlock UI or game files resolve it. |

## Named Enemy / Boss Target Mapping

These are mapping candidates only. The right side points to official-wiki rows that are name-similar or route-relevant, not confirmed runtime equivalents.

| Target | Public Source Layer | Candidate Official-Wiki Rows | Current Proof State | Direct Proof Needed |
| --- | --- | --- | --- | --- |
| Mantichana | Steam/Dexerto/PGG metadata and route hints for Mad Forest/Gennaro | No confirmed same-name row in the current value extract; do not merge with `MantisElite` or `ManticoreElite` without proof | Name and route context only | Mad Forest nameplate, HP/intent, boss/elite role, death/result UI, Gennaro unlock consequence |
| Dragon Shrimp | Steam/Dexerto/PGG metadata for O'Sole unlock; Gallo Tower hint | `Dragonshrimp`; `CollosalFlameElite` has `DragonShrimp, Elite` type | Candidate row family only | Gallo Tower encounter with readable name, kill counter before/after, HP/intent, spawn context, O'Sole progress |
| Lion Head | Steam/Dexerto/GAMES.GG/PGG metadata for Cavallo unlock; Inlaid Library hint | `LionHead`; `LionHeadElite` | Candidate row family only | Inlaid Library encounter with readable name, kill counter before/after, HP/intent, spawn context, Cavallo progress |
| Skeleton | Steam/Dexerto/GAMES.GG/PGG metadata for Mortaccio unlock; Mad Forest hint | `Skeleton3`; `Skeleton3 Elite`; `Skeleton2`; `Scarleton` | Candidate row family only; prototype has only superficial placeholder-adjacent concept per gap map | Mad Forest Skeleton encounter, exact count rule, counter UI, HP/attack, normal-vs-elite distinction |
| Milk Elemental | Steam/Dexerto/PGG metadata for Bianca/Ramba; Dairy Plant route hint | `MilkElemental`; `MilkElementalElite` | Candidate row family only | Dairy Plant fight, Dairy/Milk stage boundary, HP/intent, boss role, result UI, Bianca/Ramba unlock consequence |
| Gallo | Steam/Dexerto/VGC/GAMES.GG metadata for Gallo unlock/Gallo Tower | `GalloElite` candidate; keep `Gallotrice` separate unless UI proves relation | Candidate row only | Gallo Tower clear/fight capture, character-vs-boss distinction, unlock popup, Inn/roster state |
| Giant Enemy Crab | Steam/Dexerto/GAMES.GG metadata for Gallo Tower/Meany Bridge gate | `GiantCrabElite`; `GiantCrabElite_Ambush` | Candidate row family only | Gallo Tower crab fight, readable name, phases/attacks, Meany Bridge unlock/result UI |
| Nesufritto | Steam/Dexerto metadata for Nduja Gem unlock | `NesuferitElite` is a spelling-similar candidate only | Candidate row only; spelling/mapping unresolved | Encounter with readable name, Nduja reward popup, stage/floor, HP/intent, unlock persistence |
| The Trickster | Steam/Dexerto metadata for Uncrackable Gem; secondary shatter guides; official-wiki row | `Trickster` with HP 30000, XP 0, boss No, dungeons Any, max-hit 30 | Source-level special row; trigger/reward/damage unresolved | Controlled card crack/break sequence, spawn, combat stats, reward popup, gem UI, multi-spawn/prevented-spawn case |
| The Ender | Community/name hypothesis plus final-boss-like VID-010 sequence | `EnderEliteP1`; `EnderEliteP2` source rows, but display name unresolved | Official-wiki Ender rows exist; `The Ender` display name not directly proved | Final-stage nameplate, phase transition, HP/intent, ending/result, reward/credits linkage |

## Official-Wiki Route Buckets

The rows below are route buckets from the official-wiki value extract. They are useful capture targets, not proof that every row appears exactly this way in the current installed build.

| Route Bucket | Source-Level Rows To Capture |
| --- | --- |
| Tutorial | `Bat_COWARD`; `Bat Tutorial00`; `Bat Tutorial01`; `Bat Tutorial01 DoubleXP`; `Bat Tutorial02`; `Bat Tutorial03`; `Bat Tutorial03-5`; `Bat Tutorial04`; `Bat Tutorial04-5`; `Bat Tutorial05` |
| Mad Forest | `Bat`; `Bat Elite`; `FlowerWall`; `FlowerWall2`; `Ghoul`; `GiantMummy`; `GiantMummy_Elite`; `Guardian_1`; `MantisElite`; `MantisElite_Ambush`; `Skeleton3`; `Skeleton3 Elite`; `TreasureBat Elite`; `VenusElite`; `Werewolf`; `WerewolfElite`; `Zombie`; `Zombie Elite` |
| Inlaid Library | `ApprenticeWitch`; `Ecto`; `EctoElite`; `Ghost`; `GhostElite`; `GhostElite_Ambush`; `Guardian_2`; `HagElite`; `LionHead`; `LionHeadElite`; `MasterWitchElite`; `Mudman`; `MudmanElite`; `NesuferitElite`; `QueenMedusaElite`; `QueenMedusaElite_Ambush`; `ShadeBomb`; `SneakyHead` |
| Teeny Bridge | `BridgeGuardian`; `GiantBat`; `Impefinger`; `Raiju`; `SwordFlint`; `Swordian`; `SwordiLee` |
| Dairy Plant | `ArchonAscia`; `Gallotrice`; `GallotriceElite`; `GiantArmouredKnightElite`; `GiantArmouredKnightElite_Ambush`; `Golem`; `GolemElite`; `Guardian_3`; `LizardElite`; `LizardPawn`; `LostTwinElite`; `Merman`; `MermanElite`; `MermanElite_Ambush`; `MilkElemental`; `MilkElementalElite`; `Minotaur`; `MinotaurElite`; `MinotaurElite_Ambush`; `TritontElite`; `TwinDemon` |
| Gallo Tower | `ArchonSpada`; `CollosalFlameElite`; `DevilElite`; `Dragonshrimp`; `GalloElite`; `Ghiavolo`; `GiantCrabElite`; `GiantCrabElite_Ambush`; `GiantSkulloneElite`; `GiantSkulloneElite_Ambush`; `Guardian_4`; `Harpy`; `HarpyElite`; `ManticoreElite`; `Scarleton`; `Skeleton2`; `Skullino` |
| Cappella Magna | `ArchDemon`; `ArchDemonElite`; `BeastDemon`; `BeastDemonElite`; `BeastDemonElite_Ambush`; `ArchonOro`; `Durga`; `EnderEliteP1`; `EnderEliteP2`; `EyeBallElite`; `EyeBallElite_Ambush`; `FallenAngel`; `FallenAngelElite`; `FallenArchangel`; `FallenThrone`; `GreenKnight`; `GreenKnightElite`; `Guardian_5`; `Kali`; `Succubus`; `SuccubusElite`; `TraineeRedReaper`; `TrinacriaElite` |
| Cross-stage rows | `Bat Glowing-T1/T2/T3/T4`; `GlowingBat Elite-T1/T2/T3/T4` across Mad Forest, Inlaid Library, Dairy Plant, Gallo Tower, and Cappella Magna |
| Any / All | `Drowner` in `Any`; `Trickster` in `Any`; `RedDeath` in `All` |
| Blank dungeon field | `Bat Weak`; `Brazier_Weak`; `MoonAtlantean`; `MudMan_Weak`; `SunAtlantean`; `Werewolf_Weak`; `Zombie_Weak` |

## Video-Only Visual Groups

These groups must stay separate from the official-wiki and achievement-name layers until a readable nameplate, direct play, or game-file row ties them together.

| Visual Group | Current Context | Do Not Merge Until |
| --- | --- | --- |
| Mad Forest large green pressure | Possible boss/elite candidate; Mantichana mapping unresolved | Readable name or result UI appears |
| Inlaid Library large/repeated pressure | Possible boss/elite candidate | Nameplate, HP, and result are captured |
| Teeny Bridge large sword-like object/enemy | Possible boss/elite/stage object | Encounter class and reward are captured |
| Milk Factory constructs/white-object sequence | Multiple possible bosses, elites, or machines | Stage label, encounter names, and result UI are captured |
| Dairy Plant construct/white-object/stone-golem sequence | Possible Milk Elemental adjacency but unproved | Nameplate and Dairy/Milk boundary are captured |
| Gallo Tower bat/serpent/phoenix/golden/skull-winged sequence | Could include Gallo, Giant Crab, elites, or separate bosses | Nameplates and unlock result screens are captured |
| Cappella/Ultima green/black-red/final skeletal sequence | Possible Ender/final-boss phase sequence | Final-stage selected label, nameplate, phase, ending/result are captured |
| Library Sanctum mage/green demon/robed sequence | Possible stage bosses or repeated pressure groups | Nameplates and result state are captured |
| Library-like red robed projectile-storm sequence | Filtered broken-build route only | Stage, enemy name, and kill/result proof are captured |

## Trickster Handling Rules

Trickster is the most important enemy-specific exception because several sources frame it as a special card-shatter enemy rather than a fixed stage boss.

| Topic | Current Source-Level State | Required Proof |
| --- | --- | --- |
| Classification | Official-wiki row says boss `No`; secondary guides describe special boss-like danger; Steam/Dexerto expose defeat/reward metadata | Capture whether the game UI treats it as normal enemy, boss, special enemy, or event consequence |
| Trigger | Secondary guides say repeated card use/card breaking can summon it; wiki field crawl notes a same-card repeated-use shatter route | Controlled sequence with visible card identity, warning/crack state, break/shatter moment, spawn timing |
| Stats | Official-wiki/GamerBlurb source line: HP 30000, max-hit 30, XP 0, Any dungeon; Nintendo Wire gives stage-damage examples | Direct HP/intent/damage in early and late stages, plus armor/defense/order-of-operations proof |
| Multi-spawn | Nintendo Wire says breaking another card after Trickster appears can spawn another | Spawn cap or duplicate-spawn behavior with one controlled attempt |
| Reward | Official metadata supports `Uncrackable Gem`; Nintendo Wire says `Unbreakable Gem` | Reward popup, gem catalog row, exact text/effect, next-run persistence |

## Direct Capture Queue

| Priority | Capture Task | Rows / Conflicts Covered | Exit Criteria |
| --- | --- | --- | --- |
| P0 | Stage boss/nameplate captures for Mad Forest, Dairy Plant, Gallo Tower, Inlaid Library, and Cappella route | Mantichana, Milk Elemental, Gallo, Giant Enemy Crab, Nesufritto, Ender rows, video groups | Readable enemy name, HP/armor, intent, stage/floor, attacks, death/result UI, reward/unlock state |
| P1 | Enemy-kill unlock counter captures | Skeleton, Lion Head, Dragon Shrimp, O'Sole count conflict | Town Hall/unlock counter before and after at least one relevant kill; character unlock popup or roster state |
| P2 | Controlled Trickster capture | CON-028, CON-029, CON-030, Uncrackable/Unbreakable | Card crack/break sequence, spawn, fight, reward popup, gem UI, multi-spawn/prevented-spawn attempt |
| P3 | Final-stage / Ender capture | The Ender hypothesis, `EnderEliteP1/P2`, Cappella/Ultima ambiguity | Selected stage label, final boss display name, phase transition, ending/result, reward/credits linkage |
| P4 | Full official-wiki 132-row reconciliation | 132 expanded rows, 55/71 boss split, blank dungeon rows | Each accepted row has runtime membership status: confirmed, not observed, game-file-only, obsolete, variant, or excluded |
| P5 | Implementation acceptance-condition pass | All enemy rows and prototype gap map | Every implementable row has exact behavior and testable acceptance criteria. Until then parity remains `0`. |

## Implementation Gate

Do not promote any enemy or boss row into final implementation until all of the following are present:

- Exact in-game display name or game-file display token.
- Stage, floor, route, or trigger condition.
- Normal, elite, boss, special, final-boss, event, or hazard classification.
- HP/armor/block, intent label, attack/damage, scaling, and phase behavior.
- Spawn timing and repeat/spawn-weight behavior where relevant.
- Death/result/reward UI, unlock popup, Town Hall progress, or persistence proof.
- Source-conflict decision: resolved, unresolved, version difference, or do-not-infer.
- Current prototype mapping and explicit acceptance condition.

Until those conditions are met, the correct project status for enemies remains: source-level taxonomy improved, direct proof required, current implementation parity `0`.

## Next GitHub Research Updates

- Link this artifact from `HANDOFF.md`, `RESEARCH_CHECKLIST.md`, [`data-enemies.md`](./data-enemies.md), [`enemy-gap-map.md`](./enemy-gap-map.md), and [`gap-map.md`](./gap-map.md).
- Add a short source-conflict note if direct proof later shows that Mantichana maps to a differently named official-wiki row such as a Mantis/Manticore family row.
- When direct play or game files become available, start with [`direct-play-verification.md`](./direct-play-verification.md) DP-001 and then run the P0/P1/P2 capture queue above.
