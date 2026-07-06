# Release Readiness Checklist

Date: 2026-06-01

This checklist is the release target tracker. It must not be softened into "test slice" language.

If a player later asks why cards, relics, stages, characters, UI, sound, or systems are missing, the answer must not be "because only a test set was made." Missing release-scope content is `Not done` until it is implemented, verified, and documented as release-ready.

Allowed states:

- Done
- Not done
- Unclear
- Needs verification
- No source
- Blocked

## Current Data Counts

These counts show existing local data rows only. They are not release completion proof.

| Domain | Current full-data count | Current release judgment |
| --- | ---: | --- |
| Cards | 113 | Not done |
| Gems | 58 | Not done |
| Relics | 16 | Not done |
| Arcanas | 12 | Not done |
| Characters | 23 | Not done |
| Enemies | 60 | Not done |
| Stages | 15 | Not done |
| Events | 10 | Not done |
| Achievements | 161 | Not done |

The current Phaser slice fixture has 10 cards, 3 runes, 1 relic, 1 character, 1 stage, 2 enemies, 1 boss, 1 event, 3 reward pools, and 4 encounter pools. That is useful for foundation verification only and is not enough for release.

`?data=release` now loads the full local catalog into the Phaser runtime through an adapter: 113 cards, 58 gems-as-runes, 16 relics, 12 arcanas, 23 characters, 45 non-boss enemies, 15 bosses, 15 stages, and 10 events. This is runtime connectivity proof only. It is not a release-readiness judgment for those domains.

Release visual candidate coverage now exists for the full local catalog through `docs/asset-manifest.release.v1.json`, `src/data/assetManifest.release.v1.json`, and 363 PNG files under `public/assets/runtime/release`. This is candidate coverage proof only. Final art approval, animation polish, manual readability review, and licensing/originality review remain separate release gates.

## Release Gates

| Gate | Required result | State | Evidence / blocker |
| --- | --- | --- | --- |
| Release target | One coherent PC web card dungeon crawler that can be played as a complete game | Not done | Current work is foundation plus generated full-data coverage |
| Full catalog runtime load | Full local catalog can be selected in Phaser without replacing the verified slice default | Done | `?data=release` smoke verifies `cards=113`, `runesTotal=58`, `relicsTotal=16`, `stagesTotal=15`, `validation=ok`, and first combat card damage |
| Core run loop | Complete start-to-finish run with repeated rooms, boss clear, rewards, failure, retry, and town return | Done | `phaser:smoke` verifies a release `stage_sunny_gate` run from Town through repeated combats, event, elite, rewards, rest/RuneBench, boss, stage-clear reward, Result, and Town return; it also verifies player defeat at 0 HP routes to Result, preserves no completed-stage credit, returns to Town, and can start a new world-map flow |
| Card release batch 1 | First generated card block is converted from family/template rows into distinct release-facing cards with audit coverage | Done | 32 cards across morning/cloud/mint/peach were curated, old template ids were retired and references updated, `cards:release:audit` verifies max repeated effect shape 9 and max repeated suffix 8 |
| Cards | Release-worthy card set with unique roles, effects, UI text, art, upgrade/evolution behavior, and balance | Not done | Release mode loads 113 cards and first batch removes the previous card repetition blockers from `quality:audit:report`; remaining cards, upgrades/evolutions, art, and balance are not release-complete |
| Card art | Every release card has production-ready art or approved shippable candidate art | Not done | Release visual coverage batch 1 provides a distinct candidate PNG and manifest key for all 113 card illustrations; final approval, manual readability review, and polish are not done |
| Gem release batch 1 | First generated gem block is converted from single-template modifiers into distinct multi-effect release-facing socket modifiers with audit coverage | Done | 20 gems across morning/cloud/mint/peach/lavender edge/guard/spark/echo groups were curated; `gems:release:audit` verifies 58 gems, curated batch 20, and max repeated effect shape 9 |
| Gems / runes | Release-worthy socket modifiers with distinct behavior, rarity, restrictions, UI, and balance | Not done | Release mode loads 58 gems-as-runes and batch 1 removes the previous gem repetition blocker from `quality:audit:report`; remaining gem families, UI/icon polish, acquisition pacing, and balance are not release-complete |
| Relics | Release-worthy relic set with effects, acquisition rules, UI, persistence, and balance | Not done | Release mode exposes 16 relic rows; passive execution batches 1-2 prove combat-start block/energy, first expensive card free, one-card retain, after-combat heal, card/rune/elite/stage-clear reward option changes, next-room reveal debug, and gold reward percent in Phaser smoke; remaining relic effects, acquisition rules, UI, persistence edges, and balance are not release-proven |
| Arcanas | Release-worthy arcana system with unlocks, selection UI, effects, and persistence | Not done | Release mode exposes 12 arcana rows; passive execution batches 1-2 prove zero-cost card gold, defense-card damage, five-card damage, three-defense heal, four-color draw, shield carry, and heal-trigger mark in Phaser smoke; remaining arcana effects, unlocks, selection UI, persistence edges, and balance are not release-proven |
| Relic/arcana passive execution batch 1 | First release passive effects mutate combat and reward state instead of being acquisition-only rows | Done | `phaser:smoke` verifies `relic_round_lantern` grants start block 4, `relic_cloud_socks` grants start energy 1, `relic_mint_thermos` heals 4 after combat, `relic_ribbon_box` raises card reward options to 4, `relic_candy_pouch` changes event gold from 24 to 29, `arcana_star_bakery` grants gold on a zero-cost card, and `arcana_cloud_parade` damages the enemy after a defense card |
| Relic/arcana passive execution batch 2 | Additional release passive effects mutate combat, map, and mixed reward state with deterministic Phaser coverage | Done | `phaser:smoke` verifies `relic_sun_cookie` makes the first 2-cost card free, `relic_sleepy_pillow` retains one card through end turn, `relic_bubble_lens` raises rune reward options to 4, `relic_elite_sticker` adds a card option after an elite reward source, `relic_final_picnic` raises stage-clear reward options to 4 and works after an actual boss victory reward transition, `relic_soft_compass` reveals the next room type, `arcana_ribbon_firework` deals damage after five cards, `arcana_mint_rest` heals after three defense cards, `arcana_prism_path` draws after four colors, `arcana_cloud_blanket` carries block to the next turn, and `arcana_sprout_song` marks on healing |
| Characters | 23 characters with selection UI, passives, starter decks, unlocks, portraits/sprites, and balance | Not done | Rows exist; only starter character sprite/portrait path is connected in Phaser slice |
| Stage route release batch 1 | Generated stage route templates are converted into distinct release-facing room patterns with audit and Phaser coverage | Done | 15 stages were curated; `stages:release:audit` verifies `uniqueRoomPatterns=15` and `maxRepeatedRoomPattern=1`; `phaser:smoke` verifies `stage_rainbow_keep` route in `?data=release` |
| Stages | 15 stages with distinct route pacing, background identity, boss/reward links, and unlock flow | Not done | Release mode loads 15 adapted stage routes and batch 1 removes the repeated stage room-pattern blocker from `quality:audit:report`; WorldMap v2 now proves the first clear -> next-stage unlock -> selectable stage path for `stage_sunny_gate` to `stage_lavender_hall`; final background identity, stage-specific mechanics, full unlock flow, boss/reward balance, and all-stage progression are not release-complete |
| Enemy intent release batch 1 | First generated enemy block has distinct intent structures and runtime-covered effects | Done | 32 enemies across early normal, trick, elite, and boss rows were curated; `enemies:release:audit` verifies 60 enemies, curated batch 32, unique batch shapes 20, and max repeated intent shape 7 |
| Enemy identity release batch 2 | Remaining generated enemy rows and boss phase labels are converted into release-facing identities with stricter audit coverage | Done | 28 remaining enemy rows were curated and 8 early boss phase sets were relabeled; `enemies:release:audit` verifies `curatedCoverage=60/60`, `uniqueIntentShapes=37`, `maxRepeatedIntentShape=5`, `specialEffects=7`, `debuffStatuses=2`, and `bossPhaseCoverage=15/15`; `quality:audit:report` no longer reports the enemy generated-coverage blocker |
| Enemies | Normal and elite enemies with unique intent patterns, readable art, rewards, and scaling | Not done | Release mode loads 60 enemy rows and batches 1-2 remove the enemy intent-pattern and generated-coverage blockers from `quality:audit:report`; final enemy art, reward/scaling balance, full encounter pacing, and manual monster-readability review are not release-complete |
| Bosses | Bosses with distinct phases, visuals, rewards, and clear/fail consequences | Not done | One slice boss path is proven; full boss set is not |
| Event release batch 1 | Generated event choice templates are converted into varied release-facing choice, cost, and reward patterns with audit and runtime adapter coverage | Done | 10 events were curated; `events:release:audit` verifies `totalChoices=36`, choice-count distribution `4:6, 3:4`, `choiceRoles=7`, and `risks=4`; `phaser:smoke` verifies `event_bubble_shop` in `?data=release` exposes four adapted choices |
| EventScene execution batch 1 | Event rooms use a dedicated Phaser scene and choices apply cost/reward state changes | Done | `EventScene` renders event art/choices; `phaser:smoke` verifies slice `event_rune_bench`, release `event_bubble_shop` choice 3 starts `enemy_cloud_buddy` combat and changes gold to 104, and choice 4 spends HP, grants `relic_round_lantern`, and changes gold to 92 |
| Events | Event system with varied costs, outcomes, invalid states, repeats, art, and persistence | Not done | Release mode loads 10 adapted events, batch 1 removes the previous event choice-shape blockers, and EventScene batch 1 proves basic choice execution; invalid states, repeat rules, persistence edge cases, event balance, event art approval, and full outcome coverage are not release-complete |
| Town / meta | Town buildings, upgrades, shops, character unlocks, museum/relic/arcana surfaces | Not done | Research notes unresolved UI/cost/persistence proof |
| Progression | Save profile, unlock chain, achievements, long-term growth, and repeated-run state | Not done | Save system gate is now verified, and WorldMap v2 proves one deterministic stage-clear unlock plus selectable next-stage restart in release smoke; unlock pacing, full stage chain rules, long-term growth, achievement surfacing, and repeated-run progression balance are not complete |
| Achievement release batch 1 | Generated room-count filler achievements are converted into release-facing collection and mastery goals with varied rewards and runtime proof | Done | 31 `ach_picnic_goal_*` rows were curated; `achievements:release:audit` verifies `milestoneLike=84/161`, batch triggers across card/gem/relic/arcana collection and chain, and seven reward kinds; `runtime:smoke` verifies curated achievement triggers apply card, gem, relic, arcana, and chain rewards |
| Achievements | Curated achievement set with meaningful triggers and rewards | Not done | Batch 1 removes the previous achievement bulk-trigger blocker from `quality:audit:report`; remaining achievement rows still need full thematic review, UI/goal-surfacing review, reward pacing, and long-run profile balance |
| Save system | Durable production save/load, version migration, reset/delete, failure recovery | Done | `phaser:smoke` verifies mid-combat reload, completed-stage reload, v0/unversioned migration to v1 with invalid-field normalization, corrupt JSON recovery, unsupported future-version reset, clear-result and defeat-result save consistency, debug reset, production save key creation, and Town `저장 초기화` deleting production save back to an initial profile |
| Settings | Audio, display, language, controls, reset, accessibility options | Done | `SettingsScene` exposes Korean language status, master/music/SFX volume controls, standard/high-contrast display mode, large text, reduced motion, Space-confirm control behavior, settings reset, and save reset; `phaser:smoke` verifies settings persistence in localStorage, reload survival, Space-confirm disabled/enabled behavior, and reset back to defaults |
| Input | Keyboard/mouse support across all gameplay and menus with clear feedback | Done | `phaser:smoke` verifies keyboard and mouse/click action paths across Town, WorldMap, Dungeon, Combat, Reward, Event, RuneBench, Boss, and Result, including release event/reward click paths; hover feedback is pixel-checked for shared action buttons, combat cards, Combat/Boss End Turn, Event choices, and RuneBench action |
| UI technical skin path | Primary UI panels, buttons, slots, tooltips, and states use shared runtime helpers and manifest-backed 9-slice assets | Done | Added candidate 9-slice assets for primary/secondary buttons, reward slots, event choice slots, tooltip paper, and the shared panel; current Town/WorldMap/Dungeon/Combat/Reward/Event/RuneBench/Boss/Result/Settings controls route through shared helpers; `phaser:smoke` verifies `uiSkin=button+slot+tooltip`, hover/down feedback, disabled event choice behavior, focus highlights, settings controls, and screenshot coverage |
| UI skin | Art-bible-faithful, concept/source-backed, shippable UI skin across all primary game screens | Not done | The current screen was rejected in manual review on 2026-06-01. Reward/Event/Combat/Boss/Town/WorldMap/Dungeon/RuneBench/Result/Settings now have first-pass source-backed rebuild checkpoints and debug-less screenshots; WorldMap has a second pass proving release unlock/selection screenshots, Dungeon has a second pass proving state-driven current/next/boss-distance/reveal surfacing screenshots, RuneBench has a second pass proving before/after attachment preview screenshots, Town has a second pass proving save/profile-driven expedition-board and progressed-release screenshots, and Result has a second pass proving progress/next-record/collection-delta screenshots after v2-v4 layout defects were rejected. Latest rubric scores are Reward 85/100, Event 85/100, Combat 85/100, WorldMap 86/100, Town 86/100, Dungeon 85/100, RuneBench 85/100, Boss 84/100, Result 86/100, and Settings 84/100. These are internal progress candidates only, not 95-point completion candidates or user-accepted final UI. Missing: final production UI art, final art-bible fidelity, production component states, responsive presentation polish, user acceptance, and final debug-less screenshot acceptance against `docs/ui-visual-quality-rubric.md` |
| Text quality | Korean text fits, is consistent, and does not overlap across release screens | Done | Current Phaser slice/release screens use Korean fixed UI text; `phaser:smoke` now inspects Phaser text objects for scene bounds, severe text overlap, replacement characters, and old English placeholder labels across Town, WorldMap, Dungeon, Combat, Reward, Event, RuneBench, Boss, and Result |
| Release visual coverage batch 1 | Full local catalog has manifest-backed candidate PNG coverage instead of reusing a tiny slice asset set | Done | `assets:generate:release-visuals` generated 363 files; `assets:audit:release-visuals` verifies 363/363 expected assets and files; `assets:audit` verifies 403 total slice+release files with 0 missing and 0 orphan files; `quality:audit:report` reports no current automated quality blockers |
| Visual production | Production asset pipeline and approved final/candidate art for cards, characters, enemies, bosses, stages, UI, VFX | Not done | Release candidate coverage and the UI technical skin path exist, but final art approval, concept/source-backed UI, animation polish, manual readability review, originality/licensing review, and broad visual QA are not complete |
| Animation / VFX | Card use, hit, block, status, reward, boss phase, and UI transitions readable and polished | Not done | Effect path proof exists; final timing/polish is not done |
| Sound / music | Music, SFX, volume settings, mute, and asset licensing/ownership | Not done | Not implemented |
| Balance | Runs are beatable, fail states are fair, builds vary, no dominant broken loops without intent | Not done | No full balance simulation or playtest acceptance |
| Performance | Stable FPS, bundle strategy, asset loading, memory, and browser compatibility | Needs verification | Vite build warns about large JS chunk |
| Build / deploy | Production build, hosted smoke, cache behavior, release notes, versioning | Not done | Local build works; release deploy is not done |
| QA | Manual playtest matrix plus automated smoke for release flows | Not done | Slice smoke exists; release matrix does not |
| Originality / legal | No copied names, text, art, or protected expression; all assets owned or licensed | Needs verification | Originalization rules exist; full content/art review not complete |
| Store readiness | Product page assets, screenshots, trailer/GIF, description, support notes | Not done | Not started |

## Non-Negotiable Reporting Rules

1. Do not describe missing release content as "only missing because this was a test."
2. Do not use full-data counts as proof that cards, relics, characters, stages, or achievements are release-ready.
3. Do not call the game release-ready while any gate above is `Not done`, `Needs verification`, `Unclear`, `No source`, or `Blocked`.
4. A release gate can move to `Done` only after implementation, automated verification where practical, visual/manual inspection where necessary, and a log entry with evidence.

## Immediate Priority

1. Continue release-facing content work beyond the first batches: remaining card/gem/enemy/stage content, full event choice coverage, remaining relic/arcana passives, character systems, upgrade/evolution behavior, reward weighting, and balance still need implementation and verification.
2. Treat `quality:audit:report` as a blocker screen, not a release certificate. It currently reports no automated quality blockers, but release gates remain `Not done` until their implementation and verification evidence is complete.
3. Keep `?data=release` smoke green while each domain is upgraded; do not let the release catalog fall back to slice-only proof.
4. Treat current UI visuals as source-backed progress candidates only. The `UI skin` gate stays `Not done` until the art-bible-faithful visual quality rubric reaches the 95-point completion rule, all primary screens are scored with debug-less screenshot evidence, final production art/state polish is accepted, and user/manual acceptance is recorded.
