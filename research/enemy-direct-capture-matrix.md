# Enemy Direct Capture Matrix

Status: `generated 2026-05-22 / direct-proof execution matrix / blocked until app 3265700 or game files are available`

Related files:

- [`direct-play-verification.md`](./direct-play-verification.md) DP-105 and DP-208
- [`enemy-taxonomy-reconciliation.md`](./enemy-taxonomy-reconciliation.md)
- [`data-enemies.md`](./data-enemies.md)
- [`enemy-gap-map.md`](./enemy-gap-map.md)
- [`official-wiki-enemy-event-powerup-value-extract.md`](./official-wiki-enemy-event-powerup-value-extract.md)
- [`source-conflicts.md`](./source-conflicts.md) CON-024, CON-028, CON-029, CON-030, CON-037, CON-041

This matrix turns the enemy taxonomy into an execution checklist for the next direct-play, high-resolution video, or game-file proof pass. It is not direct proof by itself. It assumes the current project boundary: no enemy/boss row is implementation-ready until name, stage/floor, trigger, combat behavior, reward/unlock consequence, and conflict status are all proven.

## Capture Packet Standard

Every enemy/boss capture packet must include these fields before it can close a row:

| Field | Requirement |
| --- | --- |
| Build baseline | App `3265700`, build id or game version, platform, language, timestamp, save state |
| Route state | Stage selected, floor/room if shown, party/character, run modifiers, relevant relics/arcana/gems |
| Name proof | Readable enemy nameplate, HUD row, combat log, file token, or result/unlock text |
| Combat proof | HP/armor/block, intent label, attack/damage, status effects, scaling context, phase transition if any |
| Trigger proof | Spawn trigger, room type, boss slot, event consequence, kill-counter target, or card-shatter condition |
| Result proof | Death animation/state, reward popup, unlock popup, Town Hall counter, roster/shop/stage state, persistence after return/relaunch if relevant |
| Source resolution | Which source layer was confirmed, contradicted, or left unresolved |
| Implementation output | Acceptance condition and target data row for later implementation; do not implement from partial packets |

## Priority Order

| Priority | Packet IDs | Reason |
| --- | --- | --- |
| P0 | ENM-DP-001 to ENM-DP-006 | These close named boss/stage progression gates and final-boss identity candidates. |
| P1 | ENM-DP-007 to ENM-DP-009 | These close enemy-kill counter rows and character unlock-count conflicts. |
| P2 | ENM-DP-010 to ENM-DP-012 | These close Trickster, the highest-risk special enemy/source conflict cluster. |
| P3 | ENM-DP-013 to ENM-DP-018 | These map video-only boss/elite groups to named or official-wiki rows. |
| P4 | ENM-DP-019 to ENM-DP-024 | These reconcile the 132 official-wiki rows and blank/variant rows against runtime/game-file membership. |

## P0 Named Boss / Progression Capture

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| ENM-DP-001 | Mantichana | Steam/Dexerto/PGG route hint; Mad Forest/Gennaro | Fresh or progressed route to Mad Forest boss slot, readable name/HP/intent, attacks, defeat result, Gennaro unlock/Town Hall/Inn state | ENM-C01, CON-024, possible Mantichana-vs-Mantis/Manticore mapping |
| ENM-DP-002 | Milk Elemental | Steam/Dexerto/PGG; Dairy Plant/Bianca-Ramba route | Dairy Plant route with selected stage label, boss/elite encounter, readable name/HP/intent, attacks, defeat result, Bianca/Ramba unlock state, Dairy-vs-Milk route note | ENM-C05, CON-024, Dairy Plant/Milk Factory boundary |
| ENM-DP-003 | Giant Enemy Crab | Steam/Dexerto/GAMES.GG; Gallo Tower/Meany Bridge gate | Gallo Tower boss/gate route, crab nameplate, HP/intent, phases, attacks, defeat result, Meany Bridge unlock/stage-select state | ENM-C07, Gallo Tower clear-vs-crab-kill boundary |
| ENM-DP-004 | Gallo | Steam/Dexerto/VGC/GAMES.GG; Gallo unlock/Gallo Tower | Capture whether `Gallo` is a boss, character unlock, route result, or both; include nameplate if fought, unlock popup, Inn/roster state, and any Gallo Tower clear result | ENM-C06, CON-024, Gallo character-vs-boss distinction |
| ENM-DP-005 | Nesufritto | Steam/Dexerto Nduja Gem unlock; wiki candidate `NesuferitElite` only as spelling-similar | Capture route/stage/floor, readable name, HP/intent, attacks, defeat, Nduja reward popup/gem catalog state | ENM-C08, Nesufritto-vs-NesuferitElite spelling/mapping |
| ENM-DP-006 | Ender / final boss | VID-010 final-boss-like sequence; official-wiki `EnderEliteP1/P2`; community `The Ender` hypothesis | Capture selected final-stage label, boss display name, phase 1/phase 2 or file-token mapping, HP/intent, attacks, ending/result/credits, reward/unlock state | ENM-C10, EnderEliteP1/P2, `The Ender` display-name hypothesis, Cappella/Ultima ambiguity |

## P1 Enemy-Kill Counter Capture

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| ENM-DP-007 | Skeleton | Steam/Dexerto Mortaccio unlock; wiki candidates `Skeleton3`, `Skeleton3 Elite`, `Skeleton2`, `Scarleton` | Before/after Town Hall or character unlock counter, Mad Forest encounter nameplate, normal-vs-elite distinction, HP/intent, kill count increment, final unlock popup | ENM-C04, Skeleton row-family mapping, placeholder-adjacent local row remains non-parity until proven |
| ENM-DP-008 | Lion Head | Steam/Dexerto Cavallo unlock; wiki `LionHead`, `LionHeadElite` | Before/after counter, Inlaid Library encounter, readable name, normal-vs-elite distinction, HP/intent, kill count increment, Cavallo unlock state | ENM-C03, LionHead/LionHeadElite mapping |
| ENM-DP-009 | Dragon Shrimp | Steam/Dexerto O'Sole unlock; wiki `Dragonshrimp` and DragonShrimp elite type; CON-041 count split | Before/after counter, Gallo Tower encounter, readable name, normal-vs-elite distinction, HP/intent, kill count increment, O'Sole unlock state; capture whether target count is 50, 15, or another value | ENM-C02, CON-041, Dragonshrimp/DragonShrimp type mapping |

## P2 Trickster Special Capture

| Packet ID | Target | Source-Layer Starting Point | Required Capture | Closes / Updates |
| --- | --- | --- | --- | --- |
| ENM-DP-010 | Trickster trigger | Steam/Dexerto defeat metadata; GamerBlurb/Nintendo Wire shatter route; official-wiki row says `boss = No`, `dungeons = Any` | Controlled low-pressure route with repeated same-card use, visible card identity, crack/warning state, break/shatter moment, spawn timing, affected card/deck mutation | CON-028, Trickster class, trigger threshold, card-loss behavior |
| ENM-DP-011 | Trickster combat | Official-wiki/GamerBlurb HP 30000/max-hit 30; Nintendo Wire damage examples | Capture early-stage and late-stage Trickster HP/intent/damage, armor/defense order, attacks, scaling, death state, whether boss UI appears | CON-030, Trickster source stat conflict |
| ENM-DP-012 | Trickster reward and multi-spawn | Steam/Dexerto/GamerBlurb `Uncrackable`; Nintendo Wire `Unbreakable`; multi-spawn claim | Defeat popup, gem catalog row, exact gem text/effect, next-run persistence, one second-card-break while Trickster is present or proof that duplicate spawn is blocked | CON-029, CON-028, reward label/effect, multi-spawn cap |

## P3 Video-Only Group Mapping

| Packet ID | Visual Group | Required Capture | Possible Rows To Compare | Output |
| --- | --- | --- | --- | --- |
| ENM-DP-013 | Mad Forest large green pressure | Full-resolution Mad Forest boss/elite route and result | Mantichana, MantisElite, MantisElite_Ambush, VenusElite, WerewolfElite | Confirm named mapping or keep as separate visual group |
| ENM-DP-014 | Inlaid Library large/repeated pressure | Full-resolution Inlaid Library pressure encounters and result | LionHeadElite, EctoElite, GhostElite, HagElite, MasterWitchElite, NesuferitElite, QueenMedusaElite | Confirm nameplate mapping or split multiple groups |
| ENM-DP-015 | Teeny Bridge large sword-like object/enemy | Full-resolution Teeny Bridge encounter and stage result | SwordFlint, Swordian, SwordiLee, BridgeGuardian, Raiju | Confirm boss/elite/object class |
| ENM-DP-016 | Dairy/Milk construct sequences | Separate Dairy Plant and Milk Factory selected-stage labels, encounter names, results | MilkElementalElite, GolemElite, GiantArmouredKnightElite, LostTwinElite, stage-specific machines if game files expose them | Resolve Milk Elemental adjacency and Dairy/Milk boundary |
| ENM-DP-017 | Gallo Tower bat/serpent/phoenix/golden/skull-winged sequence | Full-resolution tower route, each large encounter, result/unlock screens | GalloElite, GiantCrabElite, HarpyElite, ManticoreElite, GiantSkulloneElite, CollosalFlameElite | Map tower visual groups to named rows |
| ENM-DP-018 | Cappella/Library Sanctum robed/final groups | Full-resolution selected stage labels, nameplates, phase/result screens | EnderEliteP1/P2, ArchDemonElite, BeastDemonElite, TrinacriaElite, SuccubusElite, Library Sanctum unknown rows | Split final boss, elite, and route-specific pressure groups |

## P4 Official-Wiki 132-Row Reconciliation

| Packet ID | Scope | Required Capture / File Proof | Output Status Values |
| --- | --- | --- | --- |
| ENM-DP-019 | Stage normal-enemy membership | For each stage bucket in `enemy-taxonomy-reconciliation.md`, capture at least one readable nameplate or game-file spawn table for each normal enemy row | `confirmed-runtime`, `game-file-only`, `not-observed`, `obsolete-or-unused`, `variant-only`, `excluded` |
| ENM-DP-020 | Elite/boss flag reconciliation | Compare official-wiki `boss = Yes/No` to in-game UI role, boss slot, rewards, chest/clear result, and phase behavior | Same status values plus `role-conflict` when wiki flag and UI role differ |
| ENM-DP-021 | Variant rows and T1-T4 rows | Capture `Bat Glowing` and `GlowingBat Elite` tiers or game-file definitions; determine whether variants are player-visible names, scaling tiers, or internal rows | Variant classification and player-facing display rule |
| ENM-DP-022 | Any/All/blank dungeon rows | Capture or locate `Trickster`, `Drowner`, `RedDeath`, weak rows, Atlanteans, and blank dungeon fields | Route rule, special trigger, unused/internal marker, or global enemy class |
| ENM-DP-023 | Resistance/chance fields | Use game files or controlled runtime to verify max armor, wound chance, total chance, knockback/disarm/instakill resist where visible/derivable | Combat formula queue; do not implement invisible fields without file proof |
| ENM-DP-024 | Reward/XP/chest fields | Verify XP, chest tier, clear reward, boss chest, kill reward, and unlock linkage for representative normal/elite/boss rows | Reward taxonomy and implementation acceptance criteria |

## Backfill Instructions

When a packet is completed, update these files in order:

1. [`direct-play-verification.md`](./direct-play-verification.md): mark the relevant DP task evidence and build/language/platform.
2. [`data-enemies.md`](./data-enemies.md): move the enemy row from source-level candidate to timestamped/direct/game-file proof.
3. [`enemy-gap-map.md`](./enemy-gap-map.md): update current parity only if all acceptance fields are proven.
4. [`enemy-taxonomy-reconciliation.md`](./enemy-taxonomy-reconciliation.md): change candidate mappings into confirmed mappings or explicitly rejected mappings.
5. [`source-conflicts.md`](./source-conflicts.md): resolve or preserve CON-024, CON-028, CON-029, CON-030, CON-037, and CON-041.
6. [`gap-map.md`](./gap-map.md): update the enemy/boss area only after the row-level files are updated.
7. Later implementation files: only after a packet has a testable acceptance condition.

## Stop Conditions

Stop and preserve evidence as unresolved when any of these happen:

- The nameplate is unreadable.
- The video/frame may contain non-Crawlers footage or trailer-only/development-build material.
- The stage label, selected route, or save state is unknown and affects interpretation.
- A source row is name-similar but not proven to be the same row.
- The capture proves a reward but not the combat trigger, or proves a name but not the unlock consequence.
- A wiki/game-file row appears internal-only or unused but no authoritative marker proves it.

Under those stop conditions, keep the row as `source-level / capture queue`, not implementation-ready.
