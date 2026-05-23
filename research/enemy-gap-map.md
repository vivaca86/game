# Enemy / Boss Implementation Gap Map

Status: `official metadata collected / official wiki value extract / secondary boss-context mapping / partial video proof / row-level current implementation gap-mapped`
Last updated: 2026-05-22

This file maps each collected Vampire Crawlers enemy or boss candidate against the current prototype implementation. It is intentionally conservative: a local enemy silhouette, local boss, or similar name is not counted as original-accurate until the original enemy name, stage/floor, HP, attacks, phases, rewards, spawn trigger, and unlock consequence are verified from game UI, video, direct play, or game files.

## Source Basis

| Source ID | Source | Use | Grade |
| --- | --- | --- | --- |
| SRC-006 | Steam Community achievements page | Official public enemy/boss achievement names and trigger text | E5 metadata |
| SRC-105 | Dexerto gem unlock list | Nesufritto and Trickster gem-unlock contexts | E1 |
| SRC-107 | Dexerto stage unlock list | Giant Enemy Crab / Meany Bridge gate context | E1 |
| SRC-108 | GAMES.GG stage guide | Giant Enemy Crab / Gallo Tower gate and stage reward context | E1 |
| SRC-108-C | GAMES.GG character guide | Enemy-kill and boss/character unlock contexts | E1 |
| SRC-118 | Pro Game Guides tier list | Enemy-kill/stage hints for character unlock rows | E1 |
| SRC-119 | VGC all Crawlers unlock guide | Character unlock wording and Gallo/MissingN0-related context | E1 |
| SRC-124 | Pro Game Guides beginner guide | Mantichana/Milk Elemental stage hints and boss-end loop context | E1 |
| SRC-125 | GamerBlurb Trickster guide | Trickster shatter trigger, non-stage-boss classification, candidate stat line, reward context | E1 |
| SRC-126 | Nintendo Wire Trickster guide | Trickster card-break trigger, any-stage spawn, damage examples, multi-spawn warning, reward-label conflict | E1 |
| SRC-137 | PGG beginner enemy-route crawl | Generated boss-loop, Mantichana, and Milk Elemental route hints | E1 |
| SRC-138 | GamerBlurb Trickster page crawl | Generated card-shatter trigger, non-stage-boss classification, candidate stat line, and Uncrackable reward context | E1 |
| SRC-139 | Nintendo Wire Trickster page crawl | Generated card-break trigger, any-stage spawn, damage examples, multi-spawn warning, and reward-label conflict | E1 |
| SRC-142 | Official wiki enemy/event/Power-Up field crawl | Enemy/event/Power-Up field coverage and source-level Trickster row | E5 official wiki / not direct play |
| SRC-148 | Official wiki enemy/event/Power-Up value extract | 126 enemy infobox pages expanded into 132 enemy value rows with HP, XP, boss, dungeon, max-hit, resistance/chance fields | E5 official wiki structured values / not direct play |
| VID-003/004/005/006/007/008/009/010/011/012 | Storyboard gameplay videos | Partial boss/elite visual pressure candidates | E3 partial |
| local implementation audit | `src/content/crawler-clone.js`, `src/content/balance.js`, `src/content/expansion.js`, `src/rules/enemies.js`, `src/rules/crawler-dungeon.js`, `src/ui/hud.js` | Current prototype enemy, elite, boss, phase, and HUD behavior | Local implementation evidence |

## Coverage Counter

| Segment | Rows | Current exact 1:1 implemented | Placeholder-adjacent rows | Current status |
| --- | ---: | ---: | ---: | --- |
| Official named enemy/boss unlock targets | 9 | 0 | 1 | Steam metadata names are collected and selected stage/enemy contexts now have secondary/generated-crawl support; only Skeleton has a superficial local `bone` placeholder-adjacent concept |
| Official-wiki expanded enemy value rows | 132 | 0 | 0 | Official-wiki value extract gives source-level HP, XP, boss, dungeon, max-hit, resistance/chance fields for 126 infobox pages expanded into 132 rows; runtime membership and UI still need proof |
| Unverified final boss names | 1 | 0 | 0 | `The Ender` remains a community/name hypothesis tied only to final-boss-like video visuals |
| Video-only boss/elite candidates | 9 | 0 | 0 | Storyboard-level visuals exist, but no readable nameplate or direct mapping to named rows exists |
| Current prototype enemy kinds | 15 local enemy kinds plus 3 local boss variants | 0 | 1 | Prototype enemy names, roles, HP, attacks, boss phases, and floor routing are local/original-flavored rather than verified Vampire Crawlers data |

## Current Prototype Surface

| Surface | Current behavior | Why it is not final parity |
| --- | --- | --- |
| `balance.enemies` in `crawler-clone.js` | Defines local enemies such as `종이 박쥐`, `분필 뼈병사`, `램프꽃`, `책장 기사`, `보랏빛 사신`, and a generic boss profile | Names, stats, roles, and attacks do not match confirmed Vampire Crawlers enemy/boss rows |
| `applyContentExpansion()` in `expansion.js` | Adds local enemies and elites such as `태엽 수선공`, `유리 파편령`, `뿌리 화덕`, `엘리트 꽃관`, and others | These improve prototype variety but are not verified original enemies |
| `balance.bossVariants` | Local boss variants `온실 심장`, `뿌리 왕관`, and `프리즘 파수꾼` | No source maps these to Mantichana, Milk Elemental, Giant Enemy Crab, Gallo, Nesufritto, Trickster, or a final boss |
| `createEnemies()` | Spawns local room enemies, a generic local elite, or one local boss based on prototype room/floor state | Original per-stage/floor enemy tables, special spawn triggers, and named boss ordering are unknown |
| `hitEnemy()` boss phase logic | Local boss enrages below half HP and changes intent | Original boss phases, armor, HP thresholds, and warnings are unverified |
| `crawlerFloorTemplate()` / boss objects | Uses generic `elite` and `boss` map objects and spawns a shovel after boss defeat | Original dungeon/floor boss placement, clear rewards, and stage-unlock consequences are not implemented |
| HUD enemy list | Displays local enemy name, intent, HP, and block | Original HUD layout and exact enemy stats/intent labels still need direct proof |

## Named Enemy / Boss Gap Rows

| ID | Original enemy/boss | Collected proof | Current implementation surface | Parity | Current gap | Required proof |
| --- | --- | --- | --- | --- | --- | --- |
| ENM-C01 | Mantichana | Steam/Dexerto/PGG tie it to Gennaro unlock and Mad Forest boss context; generated PGG crawl preserves the route hint | No direct equivalent | No | HP, attacks, stage/floor, boss/normal classification, reward, and clear consequence missing | Mad Forest fight with readable name/HP/intent and unlock/result proof |
| ENM-C02 | Dragon Shrimp | Steam/Dexerto name it for O'Sole unlock; PGG gives Gallo Tower source-level hint | No direct equivalent | No | Spawn stage/floor, count requirement, behavior, and kill-counter proof missing | Gallo Tower or verified source capture showing Dragon Shrimp name, count progress, and combat behavior |
| ENM-C03 | Lion Head | Steam/Dexerto name it for Cavallo unlock; GAMES.GG/PGG point to Inlaid Library context | No direct equivalent | No | Spawn stage/floor, count requirement, behavior, and kill-counter proof missing | Inlaid Library capture showing Lion Head name, count progress, and combat behavior |
| ENM-C04 | Skeleton | Steam/Dexerto name it for Mortaccio unlock; GAMES.GG/PGG point to Mad Forest farming context | `bone` / `분필 뼈병사` is a superficial placeholder-adjacent local enemy | Placeholder only | Original Skeleton appearance, exact count, HP/attack, stage, and kill-counter proof missing | Mad Forest Skeleton encounter plus Town Hall/unlock counter proof |
| ENM-C05 | Milk Elemental | Steam/Dexerto/PGG tie it to Ramba/Bianca and Dairy Plant boss context; generated PGG crawl preserves the Dairy/Milk route hint | No direct equivalent | No | Dairy Plant/Milk Factory route relation, stage/floor, boss behavior, reward, and unlock popup missing | Dairy Plant fight with name/HP/intent, result, and Bianca/Ramba unlock proof |
| ENM-C06 | Gallo | Steam/Dexerto/VGC/GAMES.GG tie it to Gallo unlock/Gallo Tower context; Mild Gem also references Gallo Tower with Gallo | No direct equivalent | No | Character-vs-boss distinction, fight trigger, phases, reward, and Inn state missing | Gallo Tower clear/fight capture, Gallo unlock popup, and Inn/roster verification |
| ENM-C07 | Giant Enemy Crab | Steam/Dexerto/GAMES.GG tie it to Gallo Tower and Meany Bridge access | No direct equivalent | No | Fight placement, whether Gallo Tower clear differs from crab kill, HP/pattern, and stage-unlock result missing | Gallo Tower crab fight plus Meany Bridge unlock proof |
| ENM-C08 | Nesufritto | Steam/Dexerto tie it to Nduja Gem unlock | No direct equivalent | No | Stage/floor, trigger, HP/pattern, reward popup, and Nduja effect linkage missing | Encounter capture with name/HP/intent and Nduja Gem unlock proof |
| ENM-C09 | The Trickster | Steam/Dexerto tie it to Uncrackable Gem; GamerBlurb/Nintendo Wire and the generated crawl say repeated card use/card shatter summons it rather than a fixed stage-boss slot; official-wiki value extract preserves HP 30000, boss No, dungeons Any, maxhit 30, XP 0, and resistance/chance fields | No direct equivalent | No | Crack/break threshold, spawn timing, HP/damage scaling, multi-spawn behavior, reward label, and unlock popup missing | Direct or high-resolution capture of card crack/break, Trickster spawn, fight stats, reward, and next-run gem state |
| ENM-C10 | The Ender | Reddit/name hypothesis plus VID-010 final-boss-like visual sequence | No direct equivalent | No | Trusted name, stage label, HP/phases, ending trigger, reward, and credits linkage missing | Direct or high-resolution final-stage boss capture with readable name/result |

## Video-Only Boss / Elite Gap Rows

| ID | Visual candidate | Collected proof | Current implementation surface | Parity | Current gap | Required proof |
| --- | --- | --- | --- | --- | --- | --- |
| ENM-V01 | Large green enemy / boss-like pressure | VID-003 Mad Forest storyboard | No direct equivalent | No | Name, HP, phase, reward, and Mantichana mapping unresolved | Full-resolution Mad Forest boss/elite frame and result |
| ENM-V02 | Large library enemy / repeated pressure | VID-004 Inlaid Library storyboard | No direct equivalent | No | Name, HP, attack pattern, and boss/elite classification unresolved | Full-resolution Inlaid Library combat/nameplate proof |
| ENM-V03 | Large sword-like bridge enemy/object | VID-006 Teeny Bridge storyboard | No direct equivalent | No | Name, HP, phase, reward, and stage-clear relation unresolved | Full-resolution Teeny Bridge boss/elite proof |
| ENM-V04 | Milk Factory construct / white-object / gray construct sequence | VID-008 Milk Factory storyboard | No direct equivalent | No | Whether these are bosses, elites, machines, or repeated enemies is unresolved | Full-resolution Milk Factory encounter and result proof |
| ENM-V05 | Dairy Plant construct / white-object / stone-golem sequence | VID-007 Dairy Plant storyboard | No direct equivalent | No | Whether these map to Milk Elemental, machines, elites, or repeated variants is unresolved | Full-resolution Dairy Plant nameplate/fight proof |
| ENM-V06 | Gallo Tower bat / serpent / phoenix / golden / skull-winged sequence | VID-009 Gallo Tower storyboard | No direct equivalent | No | Mapping to Gallo, Giant Enemy Crab, separate elites, or stage bosses unresolved | Full-resolution Gallo Tower boss/elite sequence proof |
| ENM-V07 | Cappella/Ultima green / black-red / final skeletal-figure sequence | VID-010 Cappella/Ultima storyboard | No direct equivalent | No | Mapping to final boss, The Ender, Reaper-like enemies, or phase sequence unresolved | Full-resolution final-stage boss/name/result proof |
| ENM-V08 | Library Sanctum mage / green demon / robed pressure sequence | VID-005 and VID-012 Library Sanctum storyboards | No direct equivalent | No | Mapping to stage bosses, elites, repeated pressure groups, or named enemies unresolved | Full-resolution Library Sanctum boss/elite proof |
| ENM-V09 | Library-like red robed boss / projectile-storm pressure sequence | VID-011 filtered broken-build storyboard | No direct equivalent | No | Whether this is a stage boss, elite, or incomplete route segment is unresolved | Full-resolution filtered route with name/result proof |

## Required Completion

- Capture every normal enemy, elite, boss, special boss, and final boss with readable name, HP/armor, intent, attacks, stage/floor, spawn trigger, and reward.
- Use the 132 expanded official-wiki enemy value rows as the broad nameplate/stat capture queue, without treating those rows as final runtime membership.
- For enemy-kill unlock rows, capture the Town Hall/unlock counter before and after at least one relevant kill.
- For bosses, capture normal turn behavior, at least one failure/pressure case, phase changes, death/result UI, and linked unlock/reward state.
- For Trickster, capture the card crack/break trigger, one controlled spawn, one multi-spawn or prevented-spawn case, reward label, and Uncrackable/Unbreakable naming resolution.
- Keep implementation approval closed until every enemy row has a testable acceptance condition and the local prototype surfaces are mapped to exact original behavior.
