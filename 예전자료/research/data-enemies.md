# Enemy / Boss Data

Status: `official metadata collected / official wiki value extract / secondary boss-context mapping / partial video proof / current implementation gap-mapped`

This table tracks normal enemies, elites, bosses, final bosses, and special hazards. Steam achievement metadata now confirms several enemy/boss names and unlock contexts, but there is still not enough verified runtime data to finalize HP, attacks, phases, rewards, or exact stage placement.

Generated Trickster / enemy secondary crawl: [`enemy-trickster-secondary-crawl.md`](./enemy-trickster-secondary-crawl.md).
Generated official wiki enemy/event/power-up field crawl: [`official-wiki-enemy-event-powerup-field-crawl.md`](./official-wiki-enemy-event-powerup-field-crawl.md).
Generated official wiki enemy/event/Power-Up value extract: [`official-wiki-enemy-event-powerup-value-extract.md`](./official-wiki-enemy-event-powerup-value-extract.md).

## Source Basis

| Source ID | Source | Used For | Current Grade |
| --- | --- | --- | --- |
| SRC-006 | Steam Community achievements page | Official public enemy/boss names and unlock-trigger text exposed through achievements | E5 metadata |
| SRC-159 | Dexerto character unlocks | Character unlock conditions that name enemies/bosses | E1 |
| SRC-105 | Dexerto gem unlock list | Gem unlock conditions that name bosses/enemies | E1 |
| SRC-107 / SRC-108 | Stage guides | Stage gate and boss-context hints | E1 |
| SRC-108-C | GAMES.GG character guide | Enemy-kill and coffin-route character unlock context | E1 |
| SRC-118 | Pro Game Guides tier list | Character unlock enemy/stage hints | E1 |
| SRC-124 | Pro Game Guides beginner guide | Mantichana/Milk Elemental boss-stage hints and boss-end loop context | E1 |
| SRC-125 | GamerBlurb Trickster guide | Trickster shatter-trigger and candidate stat/reward context | E1 |
| SRC-126 | Nintendo Wire Trickster guide | Trickster card-break trigger, any-stage spawn, damage-scaling examples, and reward-label conflict | E1 |
| SRC-137 | PGG beginner enemy-route crawl | Generated dungeon boss-loop, Mantichana, and Milk Elemental route hints | E1 |
| SRC-138 | GamerBlurb Trickster page crawl | Generated card-shatter trigger, non-stage-boss classification, candidate stat line, and Uncrackable reward context | E1 |
| SRC-139 | Nintendo Wire Trickster page crawl | Generated card-break trigger, any-stage spawn, damage examples, multi-spawn warning, and Unbreakable reward-label conflict | E1 |
| SRC-142 | Official wiki enemy/event/power-up field crawl | 128 enemy category rows, enemy field coverage, boss-flag field coverage, dungeon-field coverage, and source-level Trickster row | E5 official wiki / not direct play |
| SRC-148 | Official wiki enemy/event/Power-Up value extract | 126 enemy infobox pages expanded into 132 enemy value rows with HP, XP, boss, dungeon, max-hit, resistance/chance fields; 10 event pages; 19 Power-Up value rows | E5 official wiki structured values / not direct play |
| VID-003 to VID-012 | Storyboard video logs | Visual boss/elite pressure candidates | E3 partial |

## Coverage Counter

| Segment | Known Total | Rows Collected | E2+ | E3+ | E4/E5 | Conflict / Missing |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Official named enemy/boss unlock targets | 9 | 9 | selected secondary context | 0 | 9 metadata | Names and trigger text only; no HP/pattern/reward proof |
| Official wiki enemy category rows | 128 category rows / 126 enemy infobox pages / 132 expanded value rows | 132 expanded rows | official wiki source-level values | 0 | official wiki | Category/page taxonomy, dungeon routing, boss-role taxonomy, variant rows, and runtime behavior still need direct proof |
| Unverified final boss names | unknown | 1 candidate | 0 | 1 visual partial | 0 | `The Ender` is Reddit/name-hypothesis only |
| Video-only boss/elite candidates | unknown | 9 visual groups | 0 | 9 partial | 0 | Names and mapping to static rows unresolved |
| Current implementation gap map | 19 tracked rows | 19 mapped | 0 exact | 0 | 0 exact parity | `research/enemy-gap-map.md` maps static and video-only enemy/boss rows to current prototype surfaces |

## Official Wiki Enemy Snapshot

`research/official-wiki-enemy-event-powerup-field-crawl.md` adds a broader official-wiki enemy queue, and `research/official-wiki-enemy-event-powerup-value-extract.md` preserves the row-level values: 128 category rows after excluding the index page, 126 pages with `Infobox VC Enemy`, 132 expanded enemy value rows after T1-T4 variants are split, 71 pages flagged `boss = No`, 55 pages flagged `boss = Yes`, 7 enemy infobox pages with blank dungeon fields, and 2 category taxonomy pages without enemy infoboxes. Treat this as a nameplate/stat capture queue only; the category is much larger than the 9 Steam achievement enemy/boss targets and the current video-only boss groups.

The same crawl adds a source-level Trickster row: `hp` 30000, `boss` No, `dungeons` Any, `maxhit` 30, `difficulty` 0, `xp` 0, and `types` Trickster. Its trigger/reward notes still need direct runtime proof before any stats or behavior are implemented.

## Secondary Enemy / Boss Context Map

This is a planning map only. It improves where to look during direct capture, but it does not prove HP, attack patterns, rewards, phase logic, or exact stage placement.

| Context | Source-level support | Evidence | Still missing before implementation |
| --- | --- | --- | --- |
| Stage-end boss loop | Dungeons end with a boss fight, then a clear returns rewards to the Village | SRC-124, SRC-137 | Exact per-stage boss roster, floor count, clear UI, reward order, and persistence |
| Mantichana | Mad Forest boss tied to Gennaro unlock | SRC-006, SRC-159, SRC-124, SRC-137 | Nameplate/fight proof, HP, attacks, reward, and whether it can appear outside the boss slot |
| Skeleton / Lion Head / Dragon Shrimp | Character unlock enemy-kill targets; secondary sources place Skeletons in Mad Forest, Lion Heads in Inlaid Library, Dragon Shrimps in Gallo Tower | SRC-006, SRC-108-C, SRC-118 | Exact normal-enemy rows, spawn weights, counting rules, and kill-counter UI |
| Milk Elemental | Dairy Plant boss tied to Bianca Ramba unlock | SRC-006, SRC-118, SRC-124, SRC-137 | Fight proof, stage/floor, attacks, reward, and Milk Factory/Dairy route confusion |
| Giant Enemy Crab | Gallo Tower boss/gate tied to Meany Bridge access | SRC-006, SRC-107, SRC-108 | Fight proof, whether Gallo Tower clear alone differs from crab kill, and unlock-result UI |
| Gallo | Character/boss candidate tied to Gallo Tower clear and Gallo recruitment | SRC-006, SRC-108-C, SRC-119 | Character-vs-boss distinction, fight proof, reward, and post-clear Inn state |
| Nesufritto | Nduja Gem unlock target | SRC-006, SRC-105 | Stage/floor, fight trigger, behavior, reward popup, and Nduja effect linkage |
| The Trickster | Special shatter/card-break enemy, not a fixed normal stage boss according to secondary guides; generated crawls preserve candidate stats, official-wiki source-level Trickster fields, damage examples, multi-spawn, and reward-label conflict | SRC-006, SRC-105, SRC-125, SRC-126, SRC-138, SRC-139, SRC-142, SRC-148 | Exact crack/break threshold, HP/damage scaling, multi-spawn behavior, reward label, and direct unlock proof |

## Candidate Names From Static Sources

| ID | Name | Type | Stage / Context | Source | Runtime Evidence | Current Implementation | Gap | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ENM-C01 | Mantichana | boss/enemy candidate | Mad Forest; Gennaro unlock condition; PGG crawl stores boss-route hint | SRC-006 ACH-022; SRC-159; SRC-124; SRC-137 | 미검증 | no direct equivalent | HP/pattern/location missing | E5 metadata / secondary stage context / needs runtime proof |
| ENM-C02 | Dragon Shrimp | enemy candidate | O'Sole unlock condition; Gallo Tower source-level hint | SRC-006 ACH-122; SRC-159; SRC-118 | 미검증 | no direct equivalent | Appearance/counting rules missing | E5 metadata / secondary stage context / needs runtime proof |
| ENM-C03 | Lion Head | enemy candidate | Cavallo unlock condition; Inlaid Library source-level hint | SRC-006 ACH-075; SRC-159; SRC-108-C; SRC-118 | 미검증 | no direct equivalent | Stage and behavior missing | E5 metadata / secondary stage context / needs runtime proof |
| ENM-C04 | Skeleton | enemy candidate | Mortaccio unlock condition; Mad Forest source-level farming hint | SRC-006 ACH-132; SRC-159; SRC-108-C; SRC-118 | 미검증 | prototype `bone`/`분필 뼈병사` only | Original HP/pattern/stage missing | E5 metadata / placeholder-adjacent only |
| ENM-C05 | Milk Elemental | boss/enemy candidate | Ramba/Bianca unlock condition; Dairy Plant source-level boss hint; PGG crawl stores Dairy/Milk route context | SRC-006 ACH-082; SRC-159; SRC-118; SRC-124; SRC-137 | 미검증 | no direct equivalent | Stage/floor, boss behavior, reward, and Dairy/Milk route relation missing | E5 metadata / secondary stage context / needs runtime proof |
| ENM-C06 | Gallo | boss/character candidate | Gallo unlock condition; Gallo Tower source-level context; Mild Gem achievement also requires completing Gallo Tower with Gallo | SRC-006 ACH-136, ACH-160; SRC-159; SRC-108-C; SRC-119 | 미검증 | no direct equivalent | Boss phases/reward and character/boss distinction missing | E5 metadata / needs runtime proof |
| ENM-C07 | Giant Enemy Crab | boss candidate | Gallo Tower / Meany Bridge unlock gate | SRC-006 ACH-129; SRC-107, SRC-108 | 미검증 | no direct equivalent | Boss phases, reward, and whether Gallo Tower clear alone differs from crab kill missing | E5 metadata / secondary gate context / needs runtime proof |
| ENM-C08 | Nesufritto | boss/enemy candidate | Nduja Gem unlock; Curd Refinery context still needs direct proof | SRC-006 ACH-025; SRC-105 | 미검증 | no direct equivalent | Stage/behavior missing | E5 metadata / needs runtime proof |
| ENM-C09 | The Trickster | special shatter boss/enemy candidate | Uncrackable Gem unlock; secondary guides and generated crawls say card shatter/repeated card use can summon it in any stage rather than a fixed stage-boss slot; official wiki value extract adds source-level `hp` 30000, `boss` No, `dungeons` Any, `maxhit` 30, `xp` 0, and resistance/chance fields | SRC-006 ACH-149; SRC-105; SRC-125; SRC-126; SRC-138; SRC-139; SRC-142; SRC-148 | 미검증 | no direct equivalent | Exact crack threshold, spawn timing, HP/damage scaling, multi-Trickster behavior, reward label, and unlock popup missing | E5 metadata / official wiki source-level values / generated Trickster crawl / needs runtime proof |
| ENM-C10 | The Ender | final boss candidate | Reddit Cappella Ultima thread / VID-010 final-boss-like sequence | SRC-305; VID-010 `61:20`-`64:50` | video shows final-boss-like sequence but name unreadable | no direct equivalent | Needs trusted name/source, phase, HP, reward, and trigger proof | Insufficient name proof / Partial E3 visuals |

## Video-Only Enemy / Boss Candidates

These rows are visually observed candidates only. They must not be merged with named static-source bosses until a readable nameplate, guide match, or direct-play confirmation ties them together.

| ID | Visual Candidate | Type | Stage / Context | Evidence | Current Implementation | Gap | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ENM-V01 | Large green enemy / boss-like pressure | boss/elite candidate | Mad Forest late run | VID-003 `13:10` storyboard frame | no direct equivalent | Name, HP, phase, reward, and whether it is Mantichana unresolved | 영상 부분 검증 |
| ENM-V02 | Large library enemy / repeated pressure | boss/elite candidate | Inlaid Library mid/late run | VID-004 `15:10`, `18:00` storyboard frames | no direct equivalent | Name, HP, attack pattern, and boss/elite classification unresolved | 영상 부분 검증 |
| ENM-V03 | Large sword-like bridge enemy/object | boss/elite candidate | Teeny Bridge late run | VID-006 `15:10` storyboard frame | no direct equivalent | Name, HP, phase, reward, and stage-clear relation unresolved | 영상 부분 검증 |
| ENM-V04 | Milk Factory construct / white-object / gray construct sequence | boss/elite candidates | Milk Factory mid/late run | VID-008 `12:40`, `18:40`, `24:00`, `24:50`, `28:30`, `29:00` storyboard frames | no direct equivalent | Whether these are repeated bosses, elites, machines, or separate enemies is unresolved | 영상 부분 검증 |
| ENM-V05 | Dairy Plant construct / white-object / stone-golem sequence | boss/elite candidates | Dairy Plant mid/late run | VID-007 `02:10`, `04:30`, `04:50`, `12:40`, `15:40` storyboard frames | no direct equivalent | Whether these are named bosses, elites, machines, or repeated enemy variants is unresolved | 영상 부분 검증 |
| ENM-V06 | Gallo Tower bat / serpent / phoenix / golden / skull-winged sequence | boss/elite candidates | Gallo Tower mid/late run | VID-009 `04:50`, `06:10`, `11:50`, `23:30`, `31:30`, `32:50`, `40:30`, `43:50`, `45:50` storyboard frames | no direct equivalent | Whether these map to Gallo, Giant Enemy Crab, separate elites, or stage bosses is unresolved | 영상 부분 검증 |
| ENM-V07 | Cappella/Ultima green / black-red / final skeletal-figure sequence | boss/elite/final-boss candidates | Cappella/Ultima late and ending route | VID-010 `08:20`, `23:10`, `39:50`, `48:30`, `58:30`, `61:20`, `62:40`, `64:50` storyboard frames | no direct equivalent | Whether these are separate elites, stage bosses, final phases, or The Ender-linked sequence is unresolved | Partial E3 |
| ENM-V08 | Library Sanctum mage / green demon / robed pressure sequence | boss/elite candidates | Library Sanctum near-failure and longplay routes | VID-005 `10:00`, `23:30`, `27:30`, `31:40`; VID-012 `09:50`, `12:50`, `21:50`, `23:20`, `23:40` storyboard frames | no direct equivalent | Whether these are stage bosses, elites, repeated pressure groups, or separate named enemies is unresolved | Partial E3 |
| ENM-V09 | Library-like red robed boss / projectile-storm pressure sequence | boss/elite candidates | VID-011 broken-build route | VID-011 `29:50`, `30:00` storyboard frames after contaminated frames were filtered out | no direct equivalent | Whether this is a stage boss, elite, or outro-adjacent cut without confirmed kill/result is unresolved | Partial E3 |

## Required Completion

- For every stage, log normal enemies, elites, bosses, HP/armor, attacks, warning UI, phases, rewards, and unlock effects.
- Separate guide-derived names from video/direct-play confirmed enemies.
- Every boss must have at least one timestamped fight log.
- Use the 132 expanded official-wiki enemy value rows as a route/nameplate/stat checklist, but do not collapse them into the implementation table until UI, combat logs, or game files confirm membership and behavior.
