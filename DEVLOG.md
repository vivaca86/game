# 개발일지

## 2026-05-22 - Event taxonomy reconciliation

- Added `research/event-taxonomy-reconciliation.md`, derived from the 11 collected event/encounter candidates, 10 official-wiki dungeon-event pages, official Store event/station media, and storyboard event surfaces.
- Preserved the current source-level split: official-wiki page names, actionable wiki mechanics, sparse label-only event pages, Store media UI candidates, storyboard route candidates, cross-system card/gem/evolution/Power-Up layers, and prototype-only local events.
- Kept option text, costs, rewards, invalid states, repeat rules, persistence, event-vs-station boundaries, and exact implementation parity at `0` until shipped UI, game files, or direct runtime proof confirm them.

## 2026-05-22 - Town taxonomy reconciliation

- Added `research/town-taxonomy-reconciliation.md`, derived from the 8 town/meta rows, 3 Steam achievement-backed town rows, Store Gorton Bell exterior proof, character/Inn values, Power-Up values, relic/arcana building dependencies, and official save/platform evidence.
- Preserved the current source-level split: building row layer, official metadata layer, official media layer, structural value layer, unlock-dependency layer, and save/platform layer.
- Kept Inn prices, Power-Up Shop class/cost/rank rows, Blacksmith/Jeweller split, Fortune Teller/Museum membership, Town Hall checklist mapping, demo carryover, Steam Cloud/cross-save behavior, and exact implementation parity at `0` until shipped UI, game files, save audits, or runtime proof confirm them.

## 2026-05-22 - Character taxonomy reconciliation

- Added `research/character-taxonomy-reconciliation.md`, derived from the 20 public character unlock-style rows, 21 secondary playable-roster claims, 22 Dexerto individual character pages, 23 official-wiki character rows, and official `20+ characters` shorthand.
- Preserved the current source-level split: public unlock rows are achievement/checklist-facing, the 21-row secondary roster treats Imelda as the extra default/early candidate, Dexerto's 22 pages add Imelda and MissingN0, and the official wiki's 23 rows add Divano outside the Dexerto boundary.
- Kept Imelda default/paid state, MissingN0 hidden status, Divano unavailable/wiki-only membership, Crawler-card cost vs Inn purchase price, O'Sole's Dragon Shrimp count, lead/follower deck rules, and exact implementation parity at `0` until shipped UI, game files, or runtime proof confirm the roster.

## 2026-05-22 - Card taxonomy reconciliation

- Added `research/card-taxonomy-reconciliation.md`, derived from the 52 existing unlock/evolution rows, 87 Dexerto non-character card pages, 90 official-wiki non-character rows, 113 official-wiki total card rows, and official `65+ cards` shorthand.
- Preserved the current source-level split: 35 unlock-style rows plus 17 evolution result rows are not the full catalog; all 87 Dexerto non-character page rows match official-wiki names; the official wiki adds `Angelo Spietato`, `Crystal Crown`, and `Rich Coin Bag` outside the Dexerto 87-page boundary; and the 113-row official-wiki total includes 23 character/Crawler card rows.
- Kept `Mana Bomb` cost, missing Wild/character costs, missing gem-slot rows, character-card catalog membership, and exact implementation parity at `0` until shipped UI, game files, or direct runtime proof confirm the player-facing card collection.

## 2026-05-22 - Stage taxonomy reconciliation

- Added `research/stage-taxonomy-reconciliation.md`, derived from the 13 Dexerto stage unlock rows, 14 Steam progression achievement rows, 15 VID-002 non-tutorial stage candidates, official 6-biome shorthand, and 16 official-wiki dungeon/stage variant rows.
- Preserved the current source-level split: 13 unlock-table rows, 14 Steam progression rows, 15 non-tutorial playable-stage candidates, 9 official-wiki dungeon pages, and 16 official-wiki expanded variants including `Tutorial`.
- Kept `Mad Forest` as a default/base-stage capture target, `Milk Factory` as an official playable/unlockable candidate despite Dexerto omission, `Cappella`/`Capella` spelling unresolved, and exact implementation parity at `0`.

## 2026-05-22 - Arcana taxonomy reconciliation

- Added `research/arcana-taxonomy-reconciliation.md`, derived from the 10 public Steam/Dexerto arcana unlock rows, 12 official-wiki arcana value rows, secondary 12-arcana roster claims, and official Store movie selection-surface candidates.
- Preserved the current source-level split: 10 normalized public-to-wiki matches, 2 official-wiki rows outside the public unlock table (`Experimental Medicine` and `Shield Bash`), and `0` implementation parity.
- Added the `Wild Buff` 200-vs-250 light-source-card count conflict, while preserving `And Another` 150-vs-500 and `Over The Top` return-zone conflicts for Fortune Teller/UI/game-file proof.

## 2026-05-22 - Relic taxonomy reconciliation

- Added `research/relic-taxonomy-reconciliation.md`, derived from the 15 visible GameSpot/guide relic rows and 16 official-wiki relic value rows.
- Preserved the current source-level split: 15 guide rows map to official-wiki rows by name or alias, 14 are direct same-display-name matches, `Randomazzo` maps to official-wiki `Arcana Finder` through `RelicConfig_Randomazzo`, and `Deck Box` remains the official-wiki-only 16th row outside the visible GameSpot boundary.
- Added the Polentir `Furious Forest` vs official-wiki `Fortune Forest` route conflict, then updated relic, Museum, direct-play, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - Power-Up taxonomy reconciliation

- Added `research/powerup-taxonomy-reconciliation.md`, derived from the 13 Destructoid rankable Power-Up rows, 6 Destructoid run-found/not-yet-rankable rows, selected PC Gamer cost/stat hints, and 19 official-wiki Power-Up value rows.
- Preserved the current source-level split: 19 Destructoid-to-wiki page/name matches, 13 secondary rankable rows, 6 secondary run-found rows that still have official-wiki cost/rank fields, 9 initial-shop wiki rows, 5 Weeny Bridge rows, 3 Meany Bridge rows, 1 Inlaid Library row, and 1 blank `Skip` unlock field.
- Updated town, conflict, direct-play, gap-map, checklist, and handoff docs; exact Power-Up Shop UI parity remains `0`.

## 2026-05-22 - Gem taxonomy reconciliation

- Added `research/gem-taxonomy-reconciliation.md`, derived from the 49 public Steam/Dexerto gem unlock rows and 58 official-wiki gem value rows.
- Preserved the current source-level split: 47 direct public-to-wiki name matches, 2 public `Mana Cost` bucket rows, 7 Gem-Hammer/default-style official-wiki rows, and 4 official-wiki cost-modifier variant rows.
- Updated gem, conflict, direct-play, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - Official wiki character value extract

- Added `research/official-wiki-character-value-extract.md`, generated from the Crawlers official wiki API for character-card rows.
- Preserved 23 character rows, 22 starter-deck card/count rows, 22 lead-crawler base-stat rows, 10 numeric / 11 blank / 2 non-numeric `unlockcost` fields, trigger buckets, Gorton Bell Inn rule flags, and Divano/MissingN0/Imelda/O'Sole exception targets.
- Added `SRC-149` and updated character, town, conflict, direct-play, system-rule, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - Official wiki enemy/event/Power-Up value extract

- Added `research/official-wiki-enemy-event-powerup-value-extract.md`, generated from the Crawlers official wiki API for enemy, dungeon-event, and Power-Up category rows.
- Preserved 126 enemy infobox pages expanded into 132 enemy value rows with HP, XP, boss, dungeon, max-hit, resistance/chance fields, plus 10 dungeon-event category rows and 19 Power-Up id/cost/rank/bonus/unlock rows.
- Added `SRC-148` and updated enemy, event, town, conflict, direct-play, system-rule, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - Official wiki arcana/relic/dungeon value extract

- Added `research/official-wiki-arcana-relic-dungeon-value-extract.md`, generated from the Crawlers official wiki API for arcana, relic, and dungeon infobox rows.
- Preserved 12 arcana unlock/keyword rows, 16 relic id/found-in/presence/keyword rows, blank relic `foundin`/`effects` queues, and 16 expanded dungeon/stage variant rows with order, floors, difficulty, and demo fields.
- Added `SRC-147` and updated arcana, relic, stage, conflict, direct-play, system-rule, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - Official wiki card/gem value extract

- Added `research/official-wiki-card-gem-value-extract.md`, generated from the Crawlers official wiki API for card and gem infobox rows.
- Preserved 113 card structural rows and 58 gem structural rows: card cost, gem-slot, max-slot, demo, evolution, unlock-cost, Crawler-duration, gem rarity/demo/unlock, duplicate cost-gem display-name rows, and `X Mana` as the wiki-side label candidate.
- Added `SRC-146` and updated card, gem, conflict, direct-play, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - Steam Store movie frame crawl

- Added `research/steam-store-movie-frame-crawl.md`, generated from the official Steam Store movie-only appdetails API and Store-page inline MP4 assets.
- Preserved HLS/DASH URL availability, observed durations for four Store movies and three inline extras, sampled frame observations, and visible candidates for `Mana Syphon`, `Over The Top`, `Spend a card to gain Mana.`, `THE GORTON BELL`, evolved cards, Wild/Free/modifier words, and rejected/marketing-only trailer frames.
- Added `SRC-145` and updated card, gem, arcana, event, town, UI, system-rule, gap-map, checklist, and handoff docs; Store movie frames remain candidate media only, and exact implementation parity remains `0`.

## 2026-05-22 - Steam Store appdetails media crawl

- Added `research/steam-store-appdetails-crawl.md`, generated from the official Steam Store appdetails API for main app `3265700`, demo app `4329470`, and official Store media rows.
- Preserved release/platform/developer/publisher/category/language/achievement metadata, Steam Cloud/Family Sharing/full controller support, demo-app boundaries, 10 official screenshots, 4 movie rows, and high-resolution screenshot observations for visible UI/card/gem candidates.
- Updated `SRC-004`, direct-play, card, gem, town, UI, system-rule, gap-map, checklist, and handoff docs; Store media remains a candidate layer only, and exact implementation parity remains `0`.

## 2026-05-22 - SteamDB build baseline crawl

- Added `research/steamdb-build-baseline-crawl.md`, generated from SteamDB depot/build/patchnote metadata pages for app `3265700`.
- Preserved public branch build `23012943`, 2026-04-29 build / 2026-04-30 update timestamps, depot IDs/sizes, launch build `22813976`, Steam Deck tested build `22813976`, and the SteamDB note that build `23012943` has no official patch notes available.
- Added `SRC-144`, tightened `CON-042`, and updated direct-play, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - Official Steam news crawl

- Added `research/official-steam-news-crawl.md`, generated from the official Steam News API and Steam news hub for app `3265700`.
- Preserved 9 official Community Announcements through 2026-04-29, including launch platform/demo/cross-save claims, TurboTurn/Combo/Wild/character/gem/village high-level system descriptions, and official `Hotfix 1.4.1` notes for save integrity, Echo gem, Gatti Amari, frame-rate limiting, and tutorial demo-save migration.
- Added `SRC-143` and `CON-042`, then updated town, character, gem, system-rule, source-conflict, direct-play, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - Official wiki character field crawl

- Added `research/official-wiki-character-field-crawl.md`, generated from official-wiki character category/infobox pages and the Characters page rule text.
- Preserved 23 character field rows, 22 starter-deck templates, 20 `crawlerduration` rows, 12 `unlockcost` candidates, demo flags, Divano unavailable notes, MissingN0 hidden-row support, and O'Sole's Dragon Shrimp count conflict.
- Updated `SRC-142`, character, town, conflict, direct-play, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - Official wiki enemy/event/power-up field crawl

- Added `research/official-wiki-enemy-event-powerup-field-crawl.md`, generated from official-wiki enemy, dungeon-event, and Power-Up category/infobox pages.
- Preserved enemy/event/Power-Up field coverage, a source-level Trickster row, 10 dungeon-event category pages, and 19 Power-Up infobox rows with costs, max levels, bonus fields, and unlock fields.
- Updated `SRC-142`, enemy, event, town, conflict, direct-play, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - Official wiki arcana/relic/dungeon field crawl

- Added `research/official-wiki-arcana-relic-dungeon-field-crawl.md`, generated from official-wiki arcana, relic, and dungeon infobox pages.
- Preserved 12 arcana unlock/text field rows, 16 relic field rows, relic blank `foundin` and `effects` queues, and 9 dungeon order/floor/difficulty rows across 16 named variants.
- Updated `SRC-142`, arcana, relic, stage, direct-play, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - Official wiki card/gem field crawl

- Added `research/official-wiki-card-gem-field-crawl.md`, generated from official-wiki individual card and gem infobox pages.
- Preserved card field coverage for 113 pages, missing `cost` rows, missing `gem slots` rows, 19 `evointo` rows, gem field coverage for all 58 wiki gem rows, rarity name lists, and duplicate cost-gem display-name boundaries.
- Updated `SRC-142`, `data-cards.md`, `data-gems.md`, `direct-play-verification.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md`; exact implementation parity remains `0`.

## 2026-05-22 - Official wiki API crawl

- Added `research/official-wiki-api-crawl.md`, generated from the Crawlers official wiki hub, MediaWiki parse API, and categorymember API.
- Preserved source-level boundaries for 113 card infobox rows, 58 gem rows with rarity/pool weights, 12 arcana rows, 23 character-card rows, 16 relic rows including `Deck Box`, 9 dungeon pages / 16 named variants, and Evolution gem behavior.
- Added `SRC-142`, tightened `CON-002`, `CON-003`, `CON-011`, `CON-025`, `CON-031`, and `CON-037`, then updated card, gem, character, arcana, stage, relic, town, direct-play, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - Official release FAQ crawl

- Added `research/official-release-faq-crawl.md`, generated from the Poncle official Reddit release FAQ and nearby official-account replies.
- Preserved release/platform/pricing/completion/controller context, Steam/Xbox demo carryover, no cross-save at launch, content-count shorthand, and 6-biome/few-dungeons/several-floors structure boundaries.
- Added `SRC-141`, extended `CON-001`, added `CON-037`, and updated card, gem, character, arcana, stage, town, system-rule, direct-play, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - PGG beginner systems crawl

- Added `research/pgg-beginner-systems-crawl.md`, generated from the Pro Game Guides beginner page.
- Preserved source-level dungeon loop, combo/evolution/socket/deck-mutation, `Destroyed after use`, Guiding Light route, Greed/Might/Blacksmith priority, and demo carryover rows.
- Added `SRC-140`, tightened `CON-021`, added `CON-036`, and updated card, relic, town, system-rule, direct-play, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - Enemy Trickster secondary crawl

- Added `research/enemy-trickster-secondary-crawl.md`, generated from PGG beginner, GamerBlurb Trickster, and Nintendo Wire Trickster pages.
- Preserved source-level boss-loop, Mantichana, Milk Elemental, Trickster shatter/card-break trigger, candidate stat line, stage-damage examples, multi-spawn warning, and `Uncrackable` / `Unbreakable` reward-label conflict rows.
- Added `SRC-137`, `SRC-138`, and `SRC-139`, then updated enemy, system-rule, conflict, direct-play, gap-map, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - PC Gamer upgrade priority crawl

- Added `research/pcgamer-upgrade-priority-crawl.md`, generated from the PC Gamer upgrade-priority article, with selected Crawler priority, Power-Up hint, Arcana hint, and relic/village-feature rows.
- Confirmed source-level hints for Recovery 500 coins, Reroll 250 coins, Might/Luck 20% first-rank claims, a refund-button claim, Polentir/Fortune Teller route context, Over The Top top-of-deck wording, and Stardust Anvil/Blacksmith context, while preserving the lack of a full shop table, full cost curve, rank caps, or refund rules.
- Added `SRC-136` and updated `CON-020`, character, town, arcana, relic, gap-map, direct-play, checklist, and handoff docs; exact implementation parity remains `0`.

## 2026-05-22 - GameSpot relic page crawl

- Added `research/relic-gamespot-page-crawl.md`, generated from the GameSpot all-relics page, with 15 visible `Relic` / `Description` / `Unlock Stage` rows.
- Confirmed the current GameSpot page exposes a single all-relic list rather than individual relic pages, includes toggle-off context, lists `Rilevatore` as `Curd Refinery`, and leaves the visible `Ultimate Ultra Overkill` unlock-stage value blank.
- Added `SRC-134` and `CON-035`, then updated `CON-011`, `CON-012`, and `CON-018` so relic roster, naming, and location boundaries are explicit.
- Updated `research/data-relics.md`, `research/relic-gap-map.md`, `research/gap-map.md`, `research/direct-play-verification.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md`; exact implementation parity remains `0`.

## 2026-05-22 - Destructoid Power-Up tier crawl

- Added `research/powerup-destructoid-tier-crawl.md`, generated from the Destructoid Power Ups tier page, with 13 rankable rows and 6 run-found/not-yet-rankable rows.
- Confirmed the page separates S/A/B rankable Power Ups from Banish, Curse, Hand, Magnet, Mana, and Revival as run-found rows where the author did not find a coin-rank option.
- Added `SRC-135` and updated `CON-027`, `research/data-town.md`, `research/town-gap-map.md`, `research/gap-map.md`, `research/direct-play-verification.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md`; exact Power-Up Shop UI parity remains `0`.

## 2026-05-22 - Dexerto stage unlock table crawl

- Added `research/stage-dexerto-unlock-crawl.md`, generated from the Dexerto all-stages page, with 13 `Item` / `How to Get` rows and no crawl errors.
- Confirmed the current Dexerto all-stages page exposes a single unlock table rather than individual stage pages, and that `Mad Forest` and `Milk Factory` are not item rows even though both appear in prerequisite text.
- Added `SRC-133` and updated `CON-001`, `CON-009`, and `CON-015` so the 13 Dexerto rows vs 14 Steam progression rows vs 15 video-stage candidates boundary is explicit.
- Updated `research/data-stages.md`, `research/stage-gap-map.md`, `research/gap-map.md`, `research/direct-play-verification.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md`; exact implementation parity remains `0`.

## 2026-05-22 - Dexerto arcana unlock table crawl

- Added `research/arcana-dexerto-unlock-crawl.md`, generated from the Dexerto all-arcana page, with 10 `Item` / `How to Get` rows and no crawl errors.
- Confirmed the current Dexerto all-arcana page exposes a single unlock table rather than individual arcana pages, and that `Experimental Medicine` / `Shield Bash` are not present on that page.
- Updated `SRC-132`, `CON-003`, and `CON-019` so the 10-public-unlock vs 12-total source boundary is explicit instead of hidden in prose.
- Updated `research/data-arcana.md`, `research/arcana-gap-map.md`, `research/gap-map.md`, `research/direct-play-verification.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md`; exact implementation parity remains `0`.

## 2026-05-22 - Dexerto gem unlock table crawl

- Added `research/gem-dexerto-unlock-crawl.md`, generated from the Dexerto all-gems page, with 49 `Item` / `How to Get` rows and no crawl errors.
- Confirmed the current Dexerto all-gems page exposes a single unlock table rather than individual gem pages, so exact effects, rarity, socket behavior, and runtime proof still require high-resolution UI, direct play, or game files.
- Added `SRC-131` and `CON-034` to preserve the new `X Mana Gem` vs Steam `Mana X Damage Gem` name conflict instead of collapsing it into one guessed label.
- Updated `research/data-gems.md`, `research/gem-gap-map.md`, `research/gap-map.md`, `research/direct-play-verification.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md`; exact implementation parity remains `0`.

## 2026-05-22 - Dexerto character page crawl

- Added `research/character-dexerto-page-crawl.md`, generated from 22 Dexerto character pages, with Crawler-card mana cost, duration, short effect text, trigger text, starter deck links, release date, and URL.
- Updated `research/data-characters.md`, `research/character-gap-map.md`, `research/gap-map.md`, `research/direct-play-verification.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md` so character proof now has the same individual-page crawl layer as card proof.
- Updated character conflicts to include the Dexerto page-row evidence while preserving the 20/21/22 roster conflict and adding `CON-033` to separate Crawler-card mana cost from Inn purchase price.
- Exact original parity remains `0`; purchase prices, availability state, character-select/Inn UI, trigger-color display, and runtime passive behavior still need direct UI/game-file proof.

## 2026-05-22 - Secondary card catalog boundary

- Added FRVR all-cards and Dexerto individual-card/index evidence to `research/source-index.md` as source-level card catalog inputs.
- Added `research/card-secondary-catalog.md` to track the 35 catalog-only non-character card rows needed to reconcile the existing 52 unlock/evolution rows with the 87 Dexerto non-character card-page boundary.
- Added `research/card-dexerto-page-crawl.md`, generated from all 87 Dexerto non-character individual card pages, with no crawl errors and `Mana Bomb` as the only missing mana-cost field after W-card fallback.
- Added `CON-031` for unlock/evolution rows vs full card catalog and `CON-032` for FRVR vs Dexerto catalog boundary differences.
- Updated `research/data-cards.md`, `research/card-gap-map.md`, `research/gap-map.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md`; exact implementation parity remains `0` until individual card pages, game UI, direct play, or game files confirm exact text/cost/socket/runtime data.

## 2026-05-22 - Enemy and boss gap-map proof refinement

- Added PGG beginner, GamerBlurb Trickster, and Nintendo Wire Trickster sources to `research/source-index.md` and used them only as secondary proof.
- Updated `research/data-enemies.md` with secondary boss/stage context for Mantichana, Milk Elemental, Giant Enemy Crab, Skeleton, Lion Head, Dragon Shrimp, and The Trickster.
- Added `research/enemy-gap-map.md` to map 9 official named enemy/boss unlock targets, 1 final-boss name hypothesis, and 9 video-only boss/elite visual groups against the current prototype; exact original parity remains `0`.
- Updated `research/direct-play-verification.md`, `research/gap-map.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md` so enemy/boss parity now has the same row-level proof gate as the other domains.
- Added `CON-028` for Trickster classification/spawn trigger, `CON-029` for Uncrackable vs Unbreakable reward naming, and `CON-030` for conflicting Trickster stat/damage-scaling hints.

## 2026-05-22 - Gem effect-family and Jeweler source-level proof refinement

- Added SportsRant gem and GAMES.GG Jeweler sources to `research/source-index.md` and used them only as secondary proof.
- Updated `research/data-gems.md` with a source-level 43 effect-family/variant map alongside the 49 Steam/Dexerto unlock rows, keeping exact row-to-effect mapping, formulas, socket rules, rarity pools, and runtime proof unresolved.
- Updated `research/gem-gap-map.md`, `research/systems-rules.md`, `research/gap-map.md`, `research/data-achievements.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md` so the gem proof layer is represented without changing implementation approval.
- Updated `research/data-town.md` and `research/town-gap-map.md` with secondary Blacksmith/Jeweler context for socket access, extra gem slots, rarity adjustment, sealing, and Luck interaction.
- Added secondary Power-Up Shop taxonomy and selected early cost/stat hints from Destructoid and PC Gamer, while keeping exact shop UI, rank caps, full costs, unlock order, refund behavior, and persistence unresolved.
- Refined `CON-006` and `CON-010`, then added `CON-025` for 49 unlock rows vs 43 effect-family/variant rows, `CON-026` for the Blacksmith/Jeweler responsibility split, and `CON-027` for rankable Power-Ups vs run-found candidates.

## 2026-05-22 - Character roster and passive source-level proof refinement

- Added PGG, VGC, and Destructoid character/power-up/build sources to `research/source-index.md` and used them only as secondary proof.
- Updated `research/data-characters.md` with source-level starting weapon/passive/color-trigger hints for the 20 public character rows plus Imelda, while keeping MissingN0 as a separate hidden-row claim.
- Updated `research/data-town.md`, `research/character-gap-map.md`, `research/direct-play-verification.md`, `research/gap-map.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md` with Gorton Bell Inn/Tavern purchase context, Crawler Slot/up-to-three-Crawler context, and selected source-level cost hints.
- Refined `CON-002`, `CON-007`, and `CON-008`, then added `CON-023` for Imelda default/first-run/paid-state ambiguity and `CON-024` for boss-vs-stage-clear character unlock wording.

## 2026-05-22 - Evolution recipe source-level proof refinement

- Added Pro Game Guides, GameSpot, KeenGamer, and VGC evolution/stat sources to `research/source-index.md` and used them only as secondary proof.
- Updated `research/data-cards.md` so all 17 Steam-metadata evolution rows now carry source-level recipe candidates, alternate ingredients, and partial effect hints.
- Updated `research/card-gap-map.md`, `research/systems-rules.md`, `research/direct-play-verification.md`, `research/gap-map.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md` to reflect recipe progress while keeping exact current implementation parity at `0`.
- Added `CON-021` for evolution ingredient-consumption ambiguity and `CON-022` for recipe/card-name aliases that still need Grim Grimoire, game UI, or direct-play proof.

## 2026-05-22 - Arcana and relic source-level proof refinement

- Added GameSpot, GAMES.GG Arcana, and NeonLightsMedia sources to `research/source-index.md` and used them only as secondary proof, not final direct UI evidence.
- Updated `research/data-arcana.md` and `research/arcana-gap-map.md` with a working 12-row source-level roster: 10 Steam/Dexerto public unlock rows plus `Experimental Medicine` and `Shield Bash` as automatic/default candidates.
- Updated `research/data-relics.md` and `research/relic-gap-map.md` with secondary effect/location hints for all 15 relic rows, while preserving Rilevatore, Combo Stack/Stash, Arcana Finder/Randomazzo, and Bomba panel conflicts.
- Backfilled the new conflicts and direct-verification requirements into `source-conflicts.md`, `direct-play-verification.md`, `gap-map.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md`; exact implementation parity remains `0`.

## 2026-05-22 - Remaining research implementation gap maps

- Added `research/relic-gap-map.md` to map all 15 collected relic/power-up rows against the current prototype relic, map, combo, gem, and arcana-adjacent surfaces; exact original parity remains `0`.
- Added `research/arcana-gap-map.md` to map the 10 official arcana unlock rows plus 2 automatic/default secondary rows; exact original parity remains `0`, and Fortune Teller/direct proof is still required.
- Added `research/town-gap-map.md` for 8 town/meta rows and `research/event-gap-map.md` for 10 classified event candidates plus `EVT-TBD`; both maps show `0` exact original parity rows.
- Linked the new maps from the related `data-*.md` tables, `research/gap-map.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md`; implementation remains gated off until high-resolution/direct-play proof and user baseline approval.

## 2026-05-21 - Session handoff closeout

- Updated `HANDOFF.md` so another PC can resume from `main` without prior thread context.
- Recorded the latest research expansion commits: achievement, gem, stage, character, and enemy metadata/gap maps.
- Marked the next concrete work as `card-gap-map.md` first, then relic, arcana, town, and event gap maps.
- Preserved the current gate status: the active research goal is not complete, direct-play/E4 is blocked by missing local app `3265700`, and implementation remains disallowed until the checklist and user approval gates are satisfied.

## 2026-05-21 - Per-card implementation gap map

- Added `research/card-gap-map.md` to map 18 weapon unlock rows, 17 item/stat rows including Stone Mask, and 17 evolution result rows against the current prototype implementation.
- Audited `src/content/crawler-clone.js`, `src/rules/cards.js`, `src/rules/card-effects.js`, and `src/rules/crawler-dungeon.js`: the prototype has 30 local/original-flavored cards, but 0 exact Vampire Crawlers card or evolution parity rows.
- Marked 13 rows as placeholder-adjacent only: Pummarola, Empty Tome, Bracer, Spellbinder, and 9 prototype evolution concepts.
- Linked the new map from `data-cards.md`, `gap-map.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md`; next gap-map target is relics, then arcana.

## 2026-05-21 - Per-gem implementation gap map

- Added `research/gem-gap-map.md` to map all 49 collected gem rows against the current prototype implementation.
- Audited `src/content/crawler-clone.js`, `src/rules/crawler-dungeon.js`, `src/content/growth.js`, and `src/rules/growth.js`: the prototype has 5 crawler-clone gems and 5 separate generic growth gems, but 0 exact Vampire Crawlers gem parity rows.
- Marked only Echo, Mana Cost, and Wild as placeholder-adjacent concepts; all still need exact original effect text, socket target rules, rarity/pools, replacement/cancel behavior, runtime effects, and direct/video proof.
- Linked the new map from `data-gems.md`, `gap-map.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md`.

## 2026-05-21 - Per-stage implementation gap map

- Added `research/stage-gap-map.md` to map all 15 playable-stage candidates against the current prototype implementation.
- Audited `src/content/crawler-clone.js`, `src/rules/crawler-dungeon.js`, and `src/ui/hud.js`: the prototype has 3 floor placeholders and no original 15-stage world map, lock graph, stage cards, boss/reward persistence, or per-stage clear/failure consequences.
- Marked only Mad Forest, Inlaid Library, and Teeny Bridge as placeholder-adjacent concepts; all 15 rows remain 0 exact original parity.
- Linked the new map from `data-stages.md`, `gap-map.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md`.

## 2026-05-21 - Per-character implementation gap map

- Added `research/character-gap-map.md` to map the 20 official/public character unlock-style rows plus Imelda and MissingN0 conflict rows against the current prototype implementation.
- Audited `src/content/crawler-clone.js` and `src/rules/crawler-dungeon.js`: the prototype has 4 custom characters and trigger logic, but no verified original roster, Inn/select costs, starting decks, passive text, trigger colors, or passive runtime parity.
- Kept Imelda and MissingN0 as separate unresolved rows until character-select UI or direct game proof resolves default/hidden/placeholder status.
- Linked the new map from `data-characters.md`, `gap-map.md`, `RESEARCH_CHECKLIST.md`, and `HANDOFF.md`.

## 2026-05-21 - Enemy and boss achievement metadata

- Upgraded `research/data-enemies.md` with Steam achievement metadata for 9 named enemy/boss unlock targets: Mantichana, Dragon Shrimp, Lion Head, Skeleton, Milk Elemental, Gallo, Giant Enemy Crab, Nesufritto, and The Trickster.
- Kept `The Ender` as a Reddit/name-hypothesis only; VID-010 has final-boss-like visuals but no readable name proof.
- Updated checklist counters, gap map, handoff, and relevant achievement-gap rows so enemy-target achievements now link to `data-enemies.md`.
- Preserved the evidence boundary: official name/trigger metadata does not prove HP, phase, reward, stage placement, or mapping to storyboard boss frames.

## 2026-05-21 - Per-achievement implementation gap map

- Added `research/achievement-gap-map.md` to connect all 161 Steam achievement rows to current prototype surfaces and missing original-proof requirements.
- Audited current implementation surfaces in `src/content/crawler-clone.js`, `src/rules/crawler-dungeon.js`, `src/rules/progression.js`, and UI files; all 161 achievement rows remain `0` current 1:1 implemented because the prototype lacks a Steam/Town Hall achievement mirror, original unlock popups, reward persistence mapping, and direct proof.
- Linked the new gap map from the checklist, global gap map, direct-play verification plan, handoff, and achievement data notes.

## 2026-05-21 - Achievement domain mapping and Stone Mask gap

- Added a metadata-level domain map for all 161 Steam achievement rows: 35 card unlocks, 17 evolutions, 49 gems, 20 characters, 14 stage progression rows, 13 relics, 10 arcana, and 3 town/meta rows.
- Updated the checklist and gap map to distinguish `official metadata collected` from actual Town Hall/unlock-popup/direct-play proof.
- Found a new card-table gap from the achievement sweep: `Stone Mask` appears as an official Steam achievement, raising tracked card unlock-style rows from 34 to 35.
- Added `Stone Mask` to `research/data-cards.md` as an official metadata item-card candidate and recorded `CON-017` for the Dexerto-derived card count mismatch.

## 2026-05-21 - Steam achievement metadata sweep

- Fetched the Steam Community achievements page for app `3265700` and added `research/data-achievements.md` with all 161 public achievement names, descriptions, and global unlock percentages.
- Added `SRC-006` as E5 metadata in the source index, with the caveat that achievement text is not direct proof of in-game Town Hall UI, reward timing, or runtime behavior.
- Backfilled achievement metadata into the stage, character, arcana, gem, relic, town, source-conflict, checklist, gap-map, and direct-play verification notes.
- Upgraded several unresolved rows conservatively: `Unlock Milk Factory` now has official metadata support, `Bomba Infernale` is an official relic name, 49 gem achievement names are accounted for, and 13 achievement-backed relic names plus 2 non-achievement relic rows account for the claimed 15 relic slots.

## 2026-05-21 - Direct-play verification blocker and evidence boundary

- Tightened the evidence boundary after the user correction: Vampire Survivors screenshots or footage do not count as Vampire Crawlers proof, even from the same company/series context.
- Audited the local Steam install path and found Steam present, but app `3265700` is not installed: no `appmanifest_3265700.acf`, active library app list only contains `228980`, and `steamapps/common` has no Vampire Crawlers directory.
- Added `research/direct-play-verification.md` to capture the E4/E5 blocker, exact install/build baseline tasks, first-launch/save-slot tasks, actual-flow direct-capture tasks, static-data capture tasks, and balance sampling tasks.
- Recorded SteamDB as E2 metadata only: public branch build `23012943`, Steam Deck test build `22813976`, Windows/Linux depot `3265701`, macOS depot `3265702`, and Steam Cloud/storage config still need direct install/runtime proof before they can close checklist rows.

## 2026-05-21 - VID-013 UI/options storyboard log

- Logged the full 00:52 VID-013 UI/options candidate through YouTube storyboard frames at 1-second cadence and added a partial E3 timestamp log to `flow-videos.md`.
- Usable evidence covers Town Hall/Unlocks, Systems/Options, World Map entry panels, Gameplay/Sound/Accessibility/Input settings, an unsaved-changes modal, and focus movement across setting rows.
- Rejected the black transition and Shacknews logo/outro frames as non-gameplay material; no Vampire Survivors contamination was present in the usable UI segment.
- Backfilled VID-013 into source index, town/menu data, UI screen inventory, systems/options rules, gap map, checklist, and handoff notes. The current VID-001-VID-013 queue no longer has a screened-only video.

## 2026-05-21 - Official baseline metadata partial lock

- Fetched official Steam Store API appdetails for app `3265700` and recorded a partial E5 baseline in `RESEARCH_CHECKLIST.md` and `source-index.md`.
- Confirmed app title, release date Apr 21, 2026, developers `poncle` and `Nosebleed Interactive`, publisher `poncle`, Windows/Mac platforms, full controller support, 161 achievements, and supported languages including Korean.
- Kept exact build/patch number, Steam Deck/runtime differences, save-slot behavior, difficulty/mode details, and final user approval as unresolved.

## 2026-05-21 - VID-005 Library Sanctum longplay storyboard log

- Logged the full 32:42 VID-005 Library Sanctum/coffin-route candidate through YouTube storyboard frames at 10-second cadence and added a partial E3 timestamp log to `flow-videos.md`.
- Usable evidence covers Library Sanctum exploration/combat, `Arcana Finder`, a Bomba-like relic-found candidate, `Insert Gem into a Card`, the `No valid cards available` exception, an activate/recruit-crawler event, repeated boss/elite pressure, and a late `New Unlocks` boundary.
- Kept this as storyboard-level evidence only: exact boss names, relic effects, costs, card requirements, reward fields, unlocks, and persistence still need high-resolution video or direct play.
- Updated source, stage, relic, event, enemy, UI, system, balance, gap, checklist, and handoff rows.

## 2026-05-21 - VID-002 full-game route storyboard log

- Logged the 08:18:44 VID-002 full-game walkthrough through level-3 YouTube storyboards using 5-minute overview sheets plus chapter-start checks.
- Cross-checked YouTube description chapters against storyboard frames for all 15 stage entries: Mad Forest, Furious Forest, Berserk Wood, Inlaid Library, Library West Wing, Library Sanctum, Teeny Bridge, Dairy Plant, Milk Factory, Curd Refinery, Weeny Bridge, Gallo Tower, Meany Bridge, Cappella Magna, and Capella/Capella Ultima.
- Upgraded the stage table from 8 partial stage videos to 15 partial storyboard-confirmed stage candidates, while keeping boss names, rewards, floor counts, exact unlock conditions, evolution frames, and result fields unresolved.
- Backfilled VID-002 into flow, source, stage, UI, systems, events, balance, conflicts, gap-map, checklist, devlog, and handoff notes.

## 2026-05-21 - VID-011 filtered broken-build storyboard log

- Logged the full 31:18 VID-011 broken-build candidate through YouTube storyboard frames at 10-second cadence and added a filtered partial E3 timestamp log to `flow-videos.md`.
- Explicitly rejected Vampire Survivors/top-down quote footage, the announcement-trailer frame, stock/ad/creator cutaways, and outro/run-stats overlay material; these rows are audit notes only and do not count as Vampire Crawlers evidence.
- Usable evidence now covers town/party/stage setup, library-like combat, large hand/high-counter broken-build pressure, `Insert Gem into a Card`, and a late red robed boss/elite candidate, while exact stage label, formulas, caps, values, boss identity, and run result remain unresolved.
- Backfilled VID-011 into source index, flow coverage, UI/system/enemy/event/town/balance/gap/checklist rows, and added a source-conflict note for contamination and stage ambiguity.

## 2026-05-21 - VID-012 Library Sanctum pressure storyboard log

- Logged the full 25:48 VID-012 Library Sanctum candidate through YouTube storyboard frames at 10-second cadence and added a partial E3 timestamp log to `flow-videos.md`.
- Classified it conservatively as near-failure pressure, not confirmed death: the run shows low-HP pressure, `NO FUTURE`, repeated level-up screens, gem choice, `Insert Gem into a Card`, permanent-stat card sacrifice, mage/green demon boss-like pressure, overkill/maximum-overkill, result screen, `New Unlocks`, town/shop return, character/inn setup, and stage-map return.
- Backfilled VID-012 evidence into Library Sanctum stage data, event/enemy/town/UI/system rows, checklist counters, and gap-map notes.

## 2026-05-21 - VID-010 Cappella Ultima storyboard log

- Logged the full 01:08:30 VID-010 Cappella/Ultima late-game candidate through YouTube storyboard frames at 10-second cadence and added a partial E3 timestamp log to `flow-videos.md`.
- Observed stage/world-map route context, cathedral/chapel entry, repeated level-up screens, `Insert Gem into a Card`, card-sacrifice/color-lock, duplicate-card station, recruit/shop-like event, multiple boss/elite candidates, `MAXIMUM OVERKILL` and ultra-tier overkill, final-boss-like presentation, `VAMPIRE CRAWLERS` ending/title, `Ovenkilt` relic-found, `STAGE COMPLETED`, credits, `New Unlocks`, and post-run shop/town return.
- Kept the stage label conservative: STG-014 is route context only, while STG-015 gets the endgame partial evidence because the storyboard route/map text is not high-resolution enough to prove the exact selected stage.
- Backfilled VID-010 evidence into `data-events.md`, `data-enemies.md`, `ui-screens.md`, `systems-rules.md`, `gap-map.md`, and `RESEARCH_CHECKLIST.md`.
- Kept the user correction explicit: Vampire Survivors footage, even from the same company or series family, is not Vampire Crawlers evidence.

## 2026-05-19 - 새 카드 크롤러 프로토타입 마무리

### 오늘 목표

- 카드가 매 턴 전부 갈려 전략성이 약해지는 문제를 줄인다.
- 게임 화면, 카드, HUD, 보상/덱/히스토리 화면의 톤앤매너를 하나로 맞춘다.
- 카드 수와 카드 효과를 늘려 반복 플레이의 선택지를 만든다.
- 메인 캐릭터의 idle/attack 모션 품질을 확인 가능한 수준까지 끌어올린다.
- 다른 PC에서도 이어서 확인할 수 있도록 원격 저장소에 올릴 준비를 끝낸다.

### 진행 내용

- 턴 종료 시 손에 남은 카드는 유지하고 빈 자리만 새 카드로 보충하도록 전투 흐름을 조정했다.
- 카드 효과 처리를 `src/rules/card-effects.js`로 분리해 전투 흐름과 카드별 효과 로직을 나눴다.
- 카드풀 확장, 역할 기반 카드 밸런스, 보상 추천/역할 리포트, 손패 유지 QA 리포트를 추가했다.
- 보상 선택, 덱/히스토리/런 요약 계열 화면도 게임 화면과 비슷한 어두운 온실 UI 톤으로 정리했다.
- 카드 프레임과 카드 일러스트 톤을 기존 UI에 더 맞게 재정리했다.
- 새 배경/몬스터/보스 에셋 등록 구조를 정리하고 런타임 이미지 매니페스트를 확장했다.
- 메인 캐릭터 공격용 8프레임 스프라이트 시트를 추가했다.
- 공격 모션은 v2c에서 램프 빛 연출을 만들고, v3a에서 준비 동작, 전진 착시, 적 피격 타이밍을 보강했다.
- Browser 실제 클릭 테스트 기준으로 공격 모션 v3a는 약 87점 수준으로 판단했다.

### 검증

- `node --check src/systems/feedback.js`
- `node --check src/visual/board.js`
- `git diff --check`
- 브라우저 실제 공격 카드 클릭 테스트
- 콘솔 에러 0개 확인

### 현재 확인 URL

- 로컬: `http://127.0.0.1:5199/index.html?verify=player-attack-v3a&verifyRoom=5`
- 배포 후: `https://vivaca86.github.io/game/?v=player-attack-v3a`

### 다음 작업 메모

- 90점 이상을 목표로 하려면 공격 8프레임 원화 자체를 다시 잡아야 한다.
- 핵심 보강 포인트는 앞발 디딤, 무게중심 이동, 램프 타격 프레임, 회수 동작이다.
- hit/guard/cast/victory/enter 모션은 현재 시스템 기반은 있으나, 공격처럼 실제 프레임 에셋으로 확장하는 편이 좋다.
- 카드풀은 더 늘릴 수 있지만, 다음 단계에서는 역할별 덱 archetype과 적 패턴이 같이 맞물려야 한다.

## 2026-05-19 - 플레이어 공격 스프라이트 v4 보강

### 목표

- 기존 공격 8프레임 시트를 버리지 않고, 런타임에서 더 강한 타격감이 읽히도록 보강한다.
- 앞발 디딤, 무게중심 이동, 램프 타격 프레임, 회수 동작을 우선 개선한다.

### 진행 내용

- `player-guide-attack-real-v2.png`를 추가해 v1 시트를 기준으로 프레임별 오프셋, 램프 글로우, 타격 스파크를 보강했다.
- `sprite.player.attack.v2` 런타임 키를 추가하고 플레이어 공격 시트의 활성 키로 연결했다.
- 공격 카드 모션 시간을 760ms로 늘리고, 타격 프레임 4를 더 오래 잡도록 재생 타임라인을 조정했다.
- v1은 fallback 비교용으로 유지했다.

### 확인 URL

- 로컬: `http://127.0.0.1:5199/index.html?verify=player-attack-v4&verifyRoom=5`

## 2026-05-20 - 플레이어 공격 스프라이트 v5 후보

### 목표

- v4의 약 87점 수준 공격 모션에서 부족했던 앞발 디딤, 무게중심 이동, 램프 타격 프레임, 회수 동작을 더 읽히게 만든다.
- 기존 v1/v2 공격 스트립은 fallback으로 보존하고, 새 후보는 별도 v3 에셋으로 연결한다.

### 진행 내용

- `player-guide-attack-real-v3.png`를 추가해 v2 스트립을 기준으로 프레임별 체중 이동, 예비동작, 전진 착시, 램프 타격 프레임을 더 강하게 보정했다.
- `sprite.player.attack.v3` 런타임 키를 추가하고 플레이어 공격 시트의 활성 키로 연결했다.
- 공격 카드 모션 시간을 840ms로 늘리고, 타격 프레임 4의 체류 구간을 더 길게 잡았다.
- v1/v2는 fallback 및 비교용으로 유지했다.
- QA용 `verifyAttack=1` 자동 공격과 `verifyAttackPose=0.54` 고정 포즈 검증 경로를 추가했다.

### 검증

- `verifyAttackPose=0.54`에서 램프 타격 프레임이 고정 표시되는 것을 확인했다.
- `verifyAttack=1` 실제 카드 사용 흐름 600ms 지점에서 전진 자세, 램프 빔, 적 피격 이펙트가 같은 타이밍에 잡히는 것을 확인했다.

### 확인 URL

- 로컬: `http://127.0.0.1:5199/index.html?verify=player-attack-v5&verifyRoom=5&verifyAttack=1`
- 포즈 고정: `http://127.0.0.1:5199/index.html?verifyRoom=5&verifyAttackPose=0.54`

## 2026-05-20 - 플레이어 공격 스프라이트 v6 크기 정규화

### 목표

- v5 후보에서 1~4프레임으로 갈수록 캐릭터 본체가 커져 보이던 scale popping을 제거한다.
- 공격감은 캐릭터 확대가 아니라 전진 위치, 팔/램프 도달, 임팩트 이펙트로만 읽히게 한다.

### 진행 내용

- `player-guide-attack-real-v4.png`를 추가해 v3 스트립의 프레임별 확대/축소 보정을 bottom-center anchor 기준으로 역보정했다.
- `sprite.player.attack.v4` 런타임 키를 추가하고 플레이어 공격 시트의 활성 키로 연결했다.
- v1/v2/v3는 fallback 및 비교용으로 유지했다.

### 확인 URL

- 로컬: `http://127.0.0.1:5199/index.html?verify=player-attack-v6&verifyRoom=5&verifyAttack=1`
- 포즈 고정: `http://127.0.0.1:5199/index.html?verifyRoom=5&verifyAttackPose=0.54`

## 2026-05-20 - 플레이어 공격 스프라이트 v7 램프 연속성

### 목표

- v6에서 남은 0/1/7프레임 왼손 램프 착시와 2프레임 램프 누락을 줄인다.
- 램프가 같은 손에서 준비, 전진, 타격, 회수되는 흐름으로 읽히게 만든다.

### 진행 내용

- `player-guide-attack-real-v5.png`를 추가해 v4 정규화 스트립을 기반으로 램프 연속성 패스를 만들었다.
- 스트립 내부 프레임은 `[2, 2, 2, 3, 4, 5, 6, 6]` 소스 흐름으로 재배치하고, 준비 3프레임은 크기 변화 없이 위치만 `-10/-5/0px` 전진하게 했다.
- 2프레임 계열 준비 자세에는 램프가 사라져 보이지 않도록 소형 램프/핸들 보강을 추가했다.
- `sprite.player.attack.v5` 런타임 키를 추가하고 활성 공격 시트로 연결했다.

### 확인 URL

- 로컬: `http://127.0.0.1:5199/index.html?verify=player-attack-v7&verifyRoom=5&verifyAttack=1`
- 포즈 고정: `http://127.0.0.1:5199/index.html?verifyRoom=5&verifyAttackPose=0.54`

## 2026-05-20 - 게임 흐름/밸런스 1차 점검

### 목표

- 공격 모션 통과 후 카드/전투/경로 흐름의 첫 밸런스 기준선을 다시 잡는다.
- 플레이어가 보는 카드 설명과 실제 효과 수치가 어긋나는 문제를 먼저 정리한다.
- 자동 플레이 QA가 턴 수뿐 아니라 액션 밀도와 저압박 장기전도 볼 수 있게 한다.

### 진행 내용

- 기본 카드 설명을 실제 `balance.cards` 수치와 맞췄다.
- 상점 노드 전투 진입 보호막을 3에서 5로 올려, 상점이 전투형 준비 노드로 읽히도록 안정성을 조금 보강했다.
- `actPlaytestReport()`에 평균 액션/턴, 최대 방 액션 수, 저압박 장기전 목록을 추가했다.

### 검증

- 브라우저 런타임 QA 통과.
- 자동 플레이 5개 시나리오 클리어율 100%, 평균 피해 18.2, 평균 턴 26.0.
- 새 흐름 지표: 평균 4.28장/턴, 최대 방 액션 38, 저압박 장기전 1건.

### 다음 작업 메모

- 현재 밸런스는 실패 위험보다 액션 밀도/저압박 장기전 쪽이 더 큰 과제다.
- 다음 패스는 defense/event 경로의 10턴 무피해 장기전을 줄이는 방향이 좋다.
- 프리즘 잉크를 비용 1로 올리는 실험은 클리어율이 무너져 폐기했다.

## 2026-05-20 - 성장/보물/진화 루프 1차 구현

### 목표

- 전투 목적을 단순 방 클리어가 아니라 XP, 레벨업, 카드 강화, 젬 장착, 카드 진화로 이어지는 런 성장으로 바꾼다.
- 엘리트/보스 리스크 보상을 카드 1장 추가가 아니라 젬/진화 젬 같은 핵심 엔진 부품으로 만든다.
- 기존 정적 HTML 클래식 스크립트 구조를 유지하면서 콘텐츠와 규칙 파일을 분리한다.

### 진행 내용

- `src/content/growth.js`를 추가해 XP 보상, 5종 카드 젬, 3종 진화 조합 데이터를 분리했다.
- `src/rules/growth.js`를 추가해 XP 지급, 레벨업 대기, 성장 보상 선택, 젬 장착, 카드 진화, 성장 QA 리포트를 담당하게 했다.
- 방 클리어 시 `성장 보상 -> 카드 보상 -> 경로 선택` 순서로 이어지도록 전투 흐름을 연결했다.
- 엘리트는 카드 젬 + 진화 젬을, 보스는 진화 젬 + 카드 젬을 지급하도록 했다.
- 상점에 젬 보급 선택지를 추가했다.
- HUD에 LV/XP 표시를 추가하고, 손패/덱/도감 카드에 강화/젬/진화 표시가 보이도록 했다.
- 자동 QA가 레벨업/보물 선택 화면에서 멈추지 않도록 성장 선택 로직을 추가했다.

### 검증

- `node --check` 통과: growth/cards/combat/progression/card-effects/history/hud/ui/debug/qa.
- 브라우저 QA 통과: clearRate 100%, 평균 피해 15.0, 평균 턴 21.0, 평균 레벨 4.4, 성장 선택 19회.
- 레벨업 보상 오버레이 스크린샷 확인: 옵션 3개 표시, 가로 오버플로우 없음.

## 2026-05-20 - 1인칭 카드 크롤러 전환

### 목표

- 이전 정적 카드 크롤러 전투 루프를 1인칭 격자 던전 크롤러 덱빌더 구조로 교체한다.
- 프로젝트 스킨, 이름, 콘셉트는 다르게 유지하되 기준 게임의 기계적 구성을 최대한 가깝게 맞춘다.
- 이후 카드, 젬, 층, 보상, 캐릭터 발동을 독립적으로 조정할 수 있도록 콘텐츠와 시스템을 분리한다.

### 진행 내용

- `src/content/crawler-clone.js`를 추가해 크롤러 모드 카드, 젬, 진화, 캐릭터, 적, 이벤트, 유물, 참고 출처 메모를 분리했다.
- `src/rules/turboturn.js`를 추가해 0-1-2-3 마나 연쇄, 만능 카드 연결, x2/x3/x4/x5 배율, 전부 사용 순서를 구현했다.
- `src/rules/crawler-dungeon.js`를 추가해 1인칭 격자 층, 상자, 부술 물체, 젬 스테이션, 이벤트, 엘리트, 보스, 삽 하강, 이전 층 복귀 불가, 젬 장착, 무기 진화를 구현했다.
- 전투, 카드 효과, HUD, 손패 렌더링, 보드 렌더링, QA 리포트, 디버그 내보내기를 크롤러 모드로 다시 연결했다.
- 자동 플레이에서 실제 0-1-2-3 연쇄가 나오도록 시작 덱, 손패 수, 에너지를 조정했다.

### 검증

- `node --check` 통과: 크롤러 콘텐츠/규칙, 마나 연쇄, 카드 효과, QA 리포트, 디버그 부트, 관련 UI 파일.
- 브라우저 QA 통과: `balanceLockReport` true, `actPlaytestReport` true.
- 유사도 리포트 통과: 평균 96, 전투 96, 카드 96, 던전 96, 보상 95, 캐릭터 95, 비주얼 95, 통합 시스템 100.
- 자동 크롤: 클리어율 100%, 최대 콤보 x120, 평균 피해 33.3, 평균 레벨 8, 진화/젬 장착 확인.
- 비주얼 스모크 확인 완료.

## 2026-05-21 - 현재 크롤러 메인 반영 준비

### 목표

- 현재 1인칭 카드 크롤러를 `main` 기본 진입 버전으로 고정한다.
- 화면에 보이는 영어 표기를 한글로 정리하고, 손패 5장 기준으로 플레이 화면을 다시 맞춘다.
- 좌회전/우회전이 눈으로 읽히도록 미니맵 회전과 방향 피드백을 보강한다.

### 진행 내용

- HUD, 카드 규칙줄, 보상/휴식/덱 문구, 상태 칩, 접근성 라벨의 영어 표기를 한글로 정리했다.
- 손패 수를 5장으로 맞추고 PC/태블릿 보드 영역을 넓혔다.
- 미니맵을 플레이어 중심 회전형으로 바꾸고, 회전 직후 `좌회전/우회전/뒤돌기` 라벨과 방향 토스트가 보이게 했다.
- `README.md`의 메인 설명을 정적 HTML 카드 크롤러 기준으로 갱신했다.

### 검증

- `node --check` 통과: `crawler-clone.js`, `expansion.js`, `crawler-dungeon.js`, `turboturn.js`, `progression.js`, `enemies.js`, `cards.js`, `hud.js`.
- 헤드리스 Edge 브라우저 QA 통과: 화면 영어 잔여 0건, 손패 5장, `1층` 표기, 보드 `877x474`, 좌회전 토스트/미니맵 라벨 확인.
- 리포트 통과: 마나 연쇄, 크롤러 시스템, 유사도, 맵, 자동 크롤 플레이테스트 전부 pass.

## 2026-05-21 - 인수인계 메모 정리

- 현재 본류는 Phaser/오피스 프로젝트가 아니라 정적 HTML 1인칭 카드 크롤러다.
- `HANDOFF.md`에 현재 구현 상태, 원작 조사 신뢰도, 미완료 항목, 영상 분석 방식, 다음 작업 순서를 별도로 정리했다.
- Vampire Crawlers 유사도 95% 목표는 아직 달성 상태가 아니며, 정적 데이터/영상 흐름/밸런스 검증이 끝나기 전에는 "완벽 조사" 또는 "95% 동일"이라고 말하면 안 된다.
- 다른 PC에서 이어받을 때는 먼저 `HANDOFF.md`의 체크리스트를 기준으로 조사 완료 여부를 판단해야 한다.

## 2026-05-21 - 전수조사 체크리스트 기준선 작성

- `RESEARCH_CHECKLIST.md`를 추가해 Vampire Crawlers 전수조사의 완료 판정 기준을 문서화했다.
- 정적 데이터뿐 아니라 실제 플레이 흐름, 영상 검증, UI 흐름, 밸런스 지표, 현재 구현과의 1:1 차이표까지 조사 범위에 포함했다.
- 모든 조사 행은 증거 등급, 출처, 타임스탬프 또는 게임 내 확인 위치, 출처 충돌 여부, 현재 구현 차이를 갖도록 기준을 잡았다.
- 구현 착수 전에는 조사 기준 버전, 전수 범위, 영상 검증, 출처 충돌표, 구현 우선순위가 사용자 승인 상태여야 한다.

## 2026-05-21 - 전수조사 산출물 1차 수집

- `research/data-cards.md`, `data-characters.md`, `data-gems.md`, `data-arcana.md`, `data-stages.md`, `data-town.md`, `data-relics.md`를 실제 행이 있는 조사표로 확장했다.
- 적/보스, 이벤트, UI 화면, 시스템 규칙 누락을 막기 위해 `data-enemies.md`, `data-events.md`, `ui-screens.md`, `systems-rules.md`를 추가했다.
- Dexerto, Steam, GAMES.GG, Destructoid, Reddit 후보 출처를 `source-index.md`에 묶고, 캐릭터 수/스테이지 수/아르카나 수/젬 효과명/유물 총량 충돌을 `source-conflicts.md`에 정리했다.
- YouTube 검색으로 13개 영상 후보를 `flow-videos.md`에 고정했다. 아직 타임스탬프 로그가 아니므로 E3 검증은 시작 전이다.
- `gap-map.md`를 현재 구현과 원작 조사표의 1:1 차이 기준으로 재작성했다. 현재 상태에서는 원작 시스템 구현 착수는 여전히 금지다.

## 2026-05-21 - 영상 오분류 정정 및 VID-001 부분 로그

- 기존 `VID-001` 후보는 Vampire Survivors 화면이어서 Vampire Crawlers 증거로 사용할 수 없다고 판정하고 `VID-001-R` 폐기 항목으로 분리했다.
- 같은 회사/계열 영상이어도 Vampire Crawlers UI/플레이가 보이지 않으면 E3 증거로 계산하지 않는 스크리닝 규칙을 `flow-videos.md`에 명시했다.
- 대체 `VID-001`로 `O0Xwtxt19Ow`를 넣고, YouTube 스토리보드 10초 간격 프레임으로 `00:10`-`04:20` 초반 흐름을 부분 E3 로그화했다.
- `VID-002`-`VID-013`도 스토리보드 초반 2보드로 화면 선별을 끝냈고, 모두 Vampire Crawlers 화면이 확인되었다. 단, `VID-011`은 광고/창작자 삽입 프레임이 섞여 있어 로그 작성 시 비게임 프레임을 필터링해야 한다.
- 확인된 범위는 1인칭 던전 시야, 레벨업 보상, `Combo Stash` 유물 패널, 전투 화면, 마을/Inn, Unlocks, Settings, Stage Map 일부다.
- `Combo Stack` 가이드명과 영상상 `Combo Stash` 표기가 충돌하므로 `CON-012`로 분리했다.
- 이 로그는 작은 글자/수식/정확한 비용/엣지 케이스를 확정하지 않는다. 풀해상도 영상 또는 직접 플레이 검증이 계속 필요하다.

## 2026-05-21 - VID-003 Mad Forest 전구간 스토리보드 로그

- `VID-003` Mad Forest LongPlay Guide의 17:09 전구간을 10초 간격 스토리보드로 확인하고 `flow-videos.md`에 부분 E3 로그를 추가했다.
- 확인된 범위는 Mad Forest 입장/초반 전투, 반복 레벨업, gem/reward UI, locked interaction 후보, 중후반 압박, run result/summary 화면이다.
- `data-stages.md`의 Mad Forest 행, `ui-screens.md`의 Gem station/Run end, `systems-rules.md`의 Gems/sockets를 부분 검증으로 올렸다.
- 아직 적/보스 이름, 보상 트리거, gem 장착 결과, 성공/실패 정산 필드는 확정하지 않았다.

## 2026-05-21 - VID-004 Inlaid Library 전구간 스토리보드 로그

- `VID-004` Inlaid Library Longplay Guide의 25:41 전구간을 10초 간격 스토리보드로 확인하고 `flow-videos.md`에 부분 E3 로그를 추가했다.
- 확인된 범위는 Inlaid Library 입장/탐색, 초기 보상, 반복 gem UI, chest/reward 후보, locked interaction, event/shop 후보, 대형 적 압박, unlock/result 후보 화면이다.
- `data-stages.md`의 Inlaid Library 행, `data-events.md`의 event/shop 후보 2행, `ui-screens.md`의 chest/gem/reward 관련 행, `systems-rules.md`의 XP/reward와 gems/sockets 행을 갱신했다.
- 아직 이벤트명, 비용, 보스/엘리트 구분, 보상 원인, clear/death 결과는 확정하지 않았다.

## 2026-05-21 - VID-006 Teeny Bridge 전구간 스토리보드 로그

- `VID-006` Teeny Bridge Longplay Guide의 16:56 전구간을 10초 간격 스토리보드로 확인하고 `flow-videos.md`에 부분 E3 로그를 추가했다.
- 확인된 범위는 좁은 다리형 전장, 높은 적 밀도, 반복 레벨업/gem UI, card-sacrifice/color-lock 후보, 큰 검 형태 보스/엘리트 후보, 결과 화면이다.
- `data-stages.md`의 Teeny Bridge 행, `data-events.md`의 color-lock/card-sacrifice 후보, `ui-screens.md`의 boss/run-end/gem 관련 행, `systems-rules.md`의 XP/reward와 gems/sockets 행을 갱신했다.
- 아직 보스명, 카드 희생 조건, 성공/실패 결과, 보상/해금 항목은 확정하지 않았다.

## 2026-05-21 - VID-008 Milk Factory 전구간 스토리보드 로그

- `VID-008` Milk Factory 후보 영상의 30:53 전구간을 10초 간격 스토리보드로 확인하고 `flow-videos.md`에 부분 E3 로그를 추가했다.
- 확인된 범위는 Milk Factory/공장형 던전 진입, Game Over 실패 화면, 스테이지 재선택/재시작, 반복 레벨업, gem 선택, `Insert Gem into a Card` 계열 카드 삽입 UI, `Experimental Machine` 후보, 보스/엘리트형 대형 적, `OVERKILL` 피드백, 결과 화면이다.
- `data-stages.md`의 Milk Factory 행, `data-enemies.md`의 영상 전용 보스/엘리트 후보, `data-events.md`의 machine/card-insertion 후보, `ui-screens.md`의 stage map/combat/gem/boss/run-end 행, `systems-rules.md`의 XP/reward, gems/sockets, economy 행을 갱신했다.
- Milk Factory가 Dexerto 스테이지 언락 행에 빠진 이유, 보스 정체, gem socket 규칙, 실패 정산/저장, clear/death 판정은 아직 확정하지 않았다.

## 2026-05-21 - VID-007 Dairy Plant 전구간 스토리보드 로그

- `VID-007` Dairy Plant 후보 영상의 22:12 전구간을 10초 간격 스토리보드로 확인하고 `flow-videos.md`에 부분 E3 로그를 추가했다.
- 초반 창작자 로고와 후반 구독 화면은 gameplay 증거에서 제외했고, 나머지 구간에서 Dairy/factory 계열 Crawlers 전투/탐색/보상 UI를 확인했다.
- 확인된 범위는 Dairy Plant 입장, 반복 레벨업, gem 선택, `Insert Gem into a Card`, arcade/event 후보, `Choose a card to duplicate` 후보, 보스/엘리트형 대형 적, `OVERKILL`, chest/reward, 결과 화면, `New Unlocks` 패널이다.
- `data-stages.md`의 Dairy Plant 행, `data-enemies.md`의 Dairy Plant 보스/엘리트 후보, `data-events.md`의 duplicate-card 후보, `ui-screens.md`의 chest/gem/boss/run-end 행, `systems-rules.md`의 relic/economy/gem 행을 갱신했다.
- 아직 duplicate-card 비용/결과, arcade 객체 규칙, 보스 정체, clear/death 판정, unlock 이름과 보존 여부는 확정하지 않았다.

## 2026-05-21 - VID-009 Gallo Tower 전구간 스토리보드 로그

- `VID-009` Gallo Tower 후보 영상의 46:27 전구간을 10초 간격 스토리보드로 확인하고 `flow-videos.md`에 부분 E3 로그를 추가했다.
- 확인된 범위는 town/shop/character setup, Gallo Tower stage map, tower/castle 입장, 반복 레벨업, gem 선택, `Insert Gem into a Card`, arcade 후보, loading/층전환 후보, 복수의 보스/엘리트 후보, `OVERKILL`/`MAXIMUM OVERKILL`, chest/reward, `New Unlocks`, town return 화면이다.
- `data-stages.md`의 Gallo Tower 행, `data-town.md`의 Inn/Power-Up Shop 후보, `data-enemies.md`의 Gallo Tower 보스/엘리트 후보, `data-events.md`의 arcade 후보, `ui-screens.md`의 setup/chest/gem/boss/run-end 행, `systems-rules.md`의 relic/economy/gem 행을 갱신했다.
- 아직 보스명, Gallo/Giant Enemy Crab 매핑, loading이 실제 층전환인지 편집인지, unlock 이름, town return 이후 저장/반영 여부는 확정하지 않았다.
