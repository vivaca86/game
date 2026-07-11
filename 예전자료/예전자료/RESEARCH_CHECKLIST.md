# Vampire Crawlers 전수조사 체크리스트

최종 갱신: 2026-05-22

## 2026-05-22 Secondary Proof Notes

- Event taxonomy reconciliation now has a separate source-level artifact: `research/event-taxonomy-reconciliation.md` compares 11 event/encounter candidates, 10 official-wiki dungeon-event pages, official Store event/station media, storyboard event surfaces, and the current prototype event pool. It separates official-wiki page names, 4 actionable wiki mechanic pages, 6 sparse label-only pages, Store media UI candidates, storyboard route candidates, cross-system card/gem/evolution/Power-Up layers, and prototype-only local events. It does not close option text, costs, rewards, invalid states, repeat rules, persistence, event-vs-station boundaries, or implementation parity proof.
- Town taxonomy reconciliation now has a separate source-level artifact: `research/town-taxonomy-reconciliation.md` compares 8 town/meta rows, 3 Steam achievement-backed town rows, Store Gorton Bell exterior proof, character/Inn values, 19 Power-Up rows, relic/arcana building dependencies, and save/platform evidence. It separates building rows, official metadata, official media, structural values, unlock dependencies, and save/platform layers. It does not close fresh/progressed village UI, Inn prices, Power-Up Shop rows, Blacksmith/Jeweller menus, Fortune Teller/Museum membership, Town Hall checklist mapping, demo carryover, Steam Cloud/cross-save, or persistence proof.
- Character taxonomy reconciliation now has a separate source-level artifact: `research/character-taxonomy-reconciliation.md` compares the 20 public character unlock-style rows, 21 secondary playable-roster claims, 22 Dexerto individual character pages, 23 official-wiki character rows, and official `20+ characters` shorthand. It narrows the split to public unlock rows, Imelda as the extra default/early secondary candidate, MissingN0 as a hidden/page-row candidate, and Divano as an official-wiki-only/unavailable candidate. It does not close character-select UI, Inn UI, purchase costs, default state, hidden slots, starter decks, trigger colors, lead/follower rules, passive formulas, or runtime proof.
- Card taxonomy reconciliation now has a separate source-level artifact: `research/card-taxonomy-reconciliation.md` compares the existing 52 unlock/evolution rows, 87 Dexerto non-character card pages, 90 official-wiki non-character rows, 113 official-wiki total card rows, and official `65+ cards` shorthand. It narrows the split to 87 Dexerto rows with official-wiki name matches, 3 official-wiki-only non-character rows (`Angelo Spietato`, `Crystal Crown`, `Rich Coin Bag`), and 23 character/Crawler rows kept separate until collection UI proof. It does not close card collection UI, exact text, costs, gem slots, targeting, Grim Grimoire, deck mutation, Wild/Temporary runtime, or implementation parity proof.
- Stage taxonomy reconciliation now has a separate source-level artifact: `research/stage-taxonomy-reconciliation.md` compares the 13 Dexerto stage unlock rows, 14 Steam progression achievement rows, 15 VID-002 non-tutorial stage candidates, official 6-biome shorthand, 9 official-wiki dungeon pages, and 16 official-wiki dungeon/stage variants including `Tutorial`. It preserves `Mad Forest` as a default/base-stage capture target, `Milk Factory` as an official playable/unlockable candidate despite Dexerto omission, and the `Cappella`/`Capella` spelling conflict. It does not close stage-select UI, route graph, boss/reward, floor-transition, clear/failure, or persistence proof.
- Arcana taxonomy reconciliation now has a separate source-level artifact: `research/arcana-taxonomy-reconciliation.md` compares the 10 public Steam/Dexerto arcana unlock rows against the 12 official-wiki arcana rows and secondary 12-arcana roster claims. It narrows the split to 10 normalized public-to-wiki matches and 2 official-wiki rows outside the public unlock table (`Experimental Medicine` and `Shield Bash`), while preserving Wild Buff 200 vs 250, And Another 150 vs 500, and Over The Top return-zone conflicts. It does not close Fortune Teller UI, default state, equip limit, Arcana Finder chest, effect text, or runtime proof.
- Relic taxonomy reconciliation now has a separate source-level artifact: `research/relic-taxonomy-reconciliation.md` compares the 15 visible GameSpot/guide relic rows against the 16 official-wiki relic rows. It narrows the split to 15 guide rows mapped to official-wiki rows by name or alias, 14 direct same-display-name matches, `Randomazzo` mapped to official-wiki `Arcana Finder` through `RelicConfig_Randomazzo`, and `Deck Box` as the wiki-only 16th row. It keeps blank `foundin`/`effects` queues, Rilevatore, Ultimate Ultra Overkill, Guiding Light, Polentir, Combo Stack/Stash, and Arcana Finder/Randomazzo as direct-proof targets; it does not close Museum UI, toggle, persistence, or runtime proof.
- Power-Up taxonomy reconciliation now has a separate source-level artifact: `research/powerup-taxonomy-reconciliation.md` compares 13 Destructoid rankable rows, 6 Destructoid run-found/not-yet-rankable rows, selected PC Gamer hints, and 19 official-wiki Power-Up rows. It narrows the split to 19 direct Destructoid-to-wiki page/name matches plus unresolved class, cost, and label conflicts: 13 rankable vs 6 run-found, Reroll 200 vs 250, Might/Luck 25% vs 20%, and Mana/Cooldown. It does not close Power-Up Shop UI, buy/refund, unlock, or persistence proof.
- Official wiki character value extract now has a separate source-level artifact: `research/official-wiki-character-value-extract.md` adds `SRC-149` and preserves 23 character infobox rows, 22 starter-deck card/count rows, 22 lead-crawler base-stat rows, 10 numeric / 11 blank / 2 non-numeric `unlockcost` fields, card play cost distribution, trigger buckets, demo flags, Gorton Bell Inn rule flags, and Divano/MissingN0/Imelda/O'Sole capture targets. It narrows character-select, Inn, party, and passive planning only; shipped UI/game-file/direct proof is still required.
- Gem taxonomy reconciliation now has a separate source-level artifact: `research/gem-taxonomy-reconciliation.md` compares 49 public Steam/Dexerto unlock rows against 58 official-wiki gem rows. It narrows the count conflict to 47 direct public-to-wiki name matches, 2 public `Mana Cost` bucket rows, 7 Gem-Hammer/default-style wiki rows, and 4 cost-modifier variant wiki rows. It does not close exact gem UI, effect text, socket, rarity pool, or runtime proof.
- Steam Store movie frame crawl now has a separate official Store artifact: `research/steam-store-movie-frame-crawl.md` samples four Store HLS movies and three Store-page inline MP4 extras, adds `SRC-145`, and preserves visible candidates such as `Mana Syphon`, `Over The Top`, `Spend a card to gain Mana.`, `THE GORTON BELL`, evolved-card frames, Wild/Free/modifier words, and marketing-only/rejected trailer frames. It narrows high-resolution UI/static-data capture queues only; Store movie frames are not installed-build or runtime proof.
- Official wiki card/gem value extract now has a separate source-level artifact: `research/official-wiki-card-gem-value-extract.md` adds `SRC-146` and preserves row-level official-wiki structural values for 113 card rows and 58 gem rows, including card costs, gem slots, max slots, evolution targets, Crawler durations, gem rarities, unlock fields, duplicate cost-gem display names, and `X Mana` as a wiki-side name candidate. It narrows static value planning only; shipped UI/game-file/direct proof is still required.
- Official wiki arcana/relic/dungeon value extract now has a separate source-level artifact: `research/official-wiki-arcana-relic-dungeon-value-extract.md` adds `SRC-147` and preserves row-level official-wiki values for 12 arcana rows, 16 relic rows, and 16 expanded dungeon/stage variants, including arcana unlock fields, relic id/found-in fields, blank relic field queues, dungeon order/floor/difficulty/demo fields, and keyword buckets without full effect prose. It narrows Fortune Teller, Museum, and stage-select planning only; shipped UI/game-file/direct proof is still required.
- Official wiki enemy/event/Power-Up value extract now has a separate source-level artifact: `research/official-wiki-enemy-event-powerup-value-extract.md` adds `SRC-148` and preserves 126 enemy infobox pages expanded into 132 enemy value rows, 10 dungeon-event category rows, and 19 Power-Up id/cost/rank/bonus/unlock rows. It narrows combat, event, and Power-Up Shop planning only; shipped UI/game-file/direct proof is still required.
- Steam Store appdetails/media crawl now has a separate official Store artifact: `research/steam-store-appdetails-crawl.md` preserves main app `3265700`, demo app `4329470`, release/platform/developer/publisher/category/language/achievement metadata, Steam Cloud/Family Sharing/full controller support, 10 official screenshots, 4 movie rows, and Store screenshot UI/card/gem observations. It updates `SRC-004`; Store media remains a visible-UI candidate layer, not installed-build or runtime proof.
- SteamDB build baseline crawl now has a separate metadata artifact: `research/steamdb-build-baseline-crawl.md` preserves public branch build `23012943`, its 2026-04-29 build / 2026-04-30 update timestamps, depot IDs/sizes, launch build `22813976`, Steam Deck tested build `22813976`, and SteamDB's note that build `23012943` has no official patch notes available. It adds `SRC-144` and tightens `CON-042`; direct install/build/version proof is still required before treating `23012943` as `Hotfix 1.4.1`.
- Official Steam news crawl now has a separate source-level artifact: `research/official-steam-news-crawl.md` preserves 9 official Community Announcements through 2026-04-29, launch platform/price/demo/cross-save claims, TurboTurn/Combo/Wild/character/gem/village high-level system descriptions, and official `Hotfix 1.4.1` notes for save integrity, Echo gem, Gatti Amari, frame-rate limiting, and tutorial demo-save migration. It adds `SRC-143` and `CON-042`; direct install/build mapping and UI/game-file proof are still required before implementation.
- Official wiki API crawl now has a separate source-level artifact: `research/official-wiki-api-crawl.md` preserves the Crawlers official wiki/API row boundaries for 113 card infobox rows, 58 gems, 12 arcanas, 23 character rows, 16 relic rows, 9 dungeon pages / 16 named variants, gem rarity weights, and Evolution gem behavior. It adds `SRC-142` and tightens `CON-002`, `CON-003`, `CON-011`, `CON-025`, `CON-031`, and `CON-037`; direct UI/game-file proof is still required before implementation.
- Official wiki card/gem field crawl now has a separate source-level artifact: `research/official-wiki-card-gem-field-crawl.md` preserves card field coverage for 113 infobox pages, missing card cost/socket queues, 19 official-wiki `evointo` rows, gem field coverage for 58 rows, rarity name lists, and duplicated cost-gem display names. It narrows the next static-data capture queue without closing runtime parity.
- Official wiki arcana/relic/dungeon field crawl now has a separate source-level artifact: `research/official-wiki-arcana-relic-dungeon-field-crawl.md` preserves 12 arcana unlock fields, 16 relic field-coverage rows, relic blank `foundin`/`effects` queues, and 9 dungeon order/floor/difficulty rows. It narrows Fortune Teller, Museum, and stage-select capture queues without closing runtime parity.
- Official wiki enemy/event/power-up field crawl now has a separate source-level artifact: `research/official-wiki-enemy-event-powerup-field-crawl.md` preserves enemy/event/Power-Up field coverage, a source-level Trickster row, 10 dungeon-event category pages, and 19 Power-Up infobox rows with costs, max levels, bonus fields, and unlock fields. It adds `CON-038` and `CON-039`, tightens `CON-027`, `CON-028`, and `CON-030`, and narrows enemy, event, and Power-Up direct-capture queues without closing runtime parity.
- Official wiki character field crawl now has a separate source-level artifact: `research/official-wiki-character-field-crawl.md` preserves 23 character field rows, 22 starter-deck templates, 20 `crawlerduration` rows, 12 `unlockcost` candidates, demo flags, Divano unavailable notes, MissingN0 hidden-row support, and O'Sole's Dragon Shrimp count conflict. It adds `CON-040` and `CON-041` and narrows character/Inn direct-capture queues without closing runtime parity.
- Card rows now have a secondary full-catalog layer, an individual-page crawl, and a taxonomy reconciliation: Dexerto/FRVR expose 87 non-character card candidates, `research/card-secondary-catalog.md` tracks 35 catalog-only rows beyond the existing 52 unlock/evolution rows, `research/card-dexerto-page-crawl.md` stores all 87 Dexerto page rows, and `research/card-taxonomy-reconciliation.md` separates 87 Dexerto, 90 official-wiki non-character, 113 official-wiki total, and official 65+ shorthand layers. This improves catalog boundaries only; UI/game-file text, missing socket fields, targeting, and runtime behavior still need direct proof.
- PGG beginner systems crawl now has a separate source-level artifact: `research/pgg-beginner-systems-crawl.md` preserves evolution trigger/socket/deck-mutation hints, `Destroyed after use` item-card risk, Guiding Light route conflict, Greed/Might/Blacksmith priority hints, and demo carryover claim. It does not close direct UI, save, or runtime proof.
- Official release FAQ crawl now has a separate developer-social artifact: `research/official-release-faq-crawl.md` preserves `poncle_Official` release FAQ rows, Steam/Xbox demo carryover, no-launch-cross-save boundary, broad 65+ cards / 20+ characters / 50+ gems / 12 arcana / 6 biomes shorthand, and the few-dungeons/several-floors structure claim. It does not replace collection UI, stage-select UI, game files, or direct save proof.
- Character rows now have an individual-page crawl, taxonomy reconciliation, and PC Gamer priority hints: `research/character-dexerto-page-crawl.md` stores 22 Dexerto character page rows with Crawler-card cost, duration, trigger text, and starter-deck links, `research/character-taxonomy-reconciliation.md` separates 20 public, 21 secondary playable, 22 Dexerto, 23 official-wiki, and official 20+ shorthand layers, while `research/pcgamer-upgrade-priority-crawl.md` adds Pasqualina/Gennaro/Imelda planning hints. This improves starter/passive and priority-capture mapping only; purchase prices, availability, UI text, trigger-color display, and runtime proof remain unresolved.
- Gem rows now have a generated Dexerto unlock-table crawl: `research/gem-dexerto-unlock-crawl.md` stores the single 49-row `Item` / `How to Get` table and confirms that no individual gem-page links are exposed in the current page. This adds a new unresolved name conflict: Dexerto row 46 says `X Mana Gem`, while Steam ACH-159 says `Mana X Damage Gem`.
- Arcana rows now have a generated Dexerto unlock-table crawl: `research/arcana-dexerto-unlock-crawl.md` stores the single 10-row `Item` / `How to Get` table and confirms that `Experimental Medicine` and `Shield Bash` are absent from the current Dexerto page. This supports the 10-public-unlock side of the 10-vs-12 boundary only; Fortune Teller UI or game files still need to verify the two automatic/default rows.
- Stage rows now have a generated Dexerto unlock-table crawl: `research/stage-dexerto-unlock-crawl.md` stores the single 13-row `Item` / `How to Get` table and confirms that `Mad Forest` and `Milk Factory` are not Dexerto item rows, though both appear in prerequisite text. This sharpens the 13 Dexerto rows vs 14 Steam progression rows vs 15 video-stage candidates conflict.
- Relic rows now have generated GameSpot and PC Gamer crawls: `research/relic-gamespot-page-crawl.md` stores 15 visible `Relic` / `Description` / `Unlock Stage` rows, confirms toggle-off context, preserves `Rilevatore` as `Curd Refinery`, and records a blank visible unlock-stage value for `Ultimate Ultra Overkill`; `research/pcgamer-upgrade-priority-crawl.md` adds selected route hints for Combo Stack, Gem Hammer, Polentir, Grim Grimoire, and Stardust Anvil.
- Gem rows remain 49 unlock tasks from Steam/Dexerto, but the latest public-source pass adds a separate 43 effect-family/variant layer from Destructoid and SportsRant, and the generated Trickster crawl preserves the `Uncrackable` / `Unbreakable` reward-label conflict for GEM-044. This improves effect taxonomy only; exact Jeweler UI text, row-to-effect mapping, valid card targets, runtime formulas, rarity pools, reward labels, and socket behavior still need video/direct proof.
- Town/meta rows now include a taxonomy reconciliation and secondary Blacksmith/Jeweler context: `research/town-taxonomy-reconciliation.md` separates building rows, official metadata, official media, structural values, unlock dependencies, and save/platform layers, while Gem Hammer/Stardust Anvil/Blacksmith cover socket access and extra slots and Lapidary Loupe/Jeweler covers rarity adjustment, sealing, and Luck interaction. Exact costs, menus, persistence, and pool math remain unresolved.
- Power-Up Shop rows now have generated Destructoid and PC Gamer crawls plus a reconciliation layer: `research/powerup-destructoid-tier-crawl.md` preserves 13 rankable rows and 6 run-found/not-yet-rankable rows, `research/pcgamer-upgrade-priority-crawl.md` preserves selected Recovery/Reroll/Might/Luck cost/stat hints, refund-button claim, Polentir/Fortune Teller hints, Over The Top top-of-deck wording, and Stardust Anvil/Blacksmith context, and `research/powerup-taxonomy-reconciliation.md` maps all 19 Destructoid rows to official-wiki rows while preserving class/cost/label conflicts. Exact UI rows, rank caps, full costs, unlock order, refund rules, and persistence remain unresolved.
- Enemy/boss rows now have `research/enemy-gap-map.md` and `research/enemy-trickster-secondary-crawl.md`: 9 official named enemy/boss unlock targets, 1 final-boss name hypothesis, and 9 video-only visual groups are mapped against the current prototype with `0` exact parity. Trickster has generated secondary shatter-trigger/stat/damage/reward boundaries, but exact HP, damage scaling, reward label, spawn threshold, and runtime proof remain unresolved.
- New unresolved conflicts: `CON-025` tracks 49 unlock rows vs 58 official-wiki gem rows vs the effect-family layer, `CON-026` tracks Blacksmith/Jeweler responsibility split, `CON-027` tracks permanent rankable Power-Ups vs run-found candidates, `CON-034` tracks `X Mana` / `X Mana Gem` vs `Mana X Damage Gem`, `CON-035` tracks the blank GameSpot `Ultimate Ultra Overkill` location boundary, `CON-036` tracks Guiding Light's Inlaid-Library-vs-Mad-Forest route conflict, and `CON-037` tracks official count shorthand vs row-level tables.
- Enemy/boss conflicts now include generated Trickster crawl support: `CON-028` tracks Trickster as a special shatter/card-break enemy rather than a fixed stage boss, `CON-029` tracks Uncrackable vs Unbreakable reward naming, and `CON-030` tracks conflicting Trickster stat/damage hints.

## 목적

이 문서는 Vampire Crawlers를 시스템, 콘텐츠, 데이터, 실제 플레이 흐름, 밸런스, UI 흐름까지 역기획하기 위한 완료 판정표다.

이 체크리스트가 채워지기 전에는 다음 표현을 사용하지 않는다.

- `완벽 조사 완료`
- `전체 데이터 수집 완료`
- `95% 동일`
- `원작과 동일`
- `개발 착수 가능`

사용 가능한 상태 표현은 아래로 제한한다.

- `미시작`
- `조사중`
- `1차 수집`
- `교차검증 필요`
- `영상 검증 필요`
- `영상 로그 시작`
- `영상 부분 검증`
- `화면 선별 통과`
- `영상 검증 완료`
- `게임 내 직접검증 완료`
- `공식 메타데이터 수집`
- `출처 충돌`
- `근거 부족`
- `기준선 승인 대기`

## 완료 판정 규칙

`완벽 조사 완료`라고 말하려면 아래 조건이 전부 참이어야 한다.

- 조사 대상 게임 버전, 플랫폼, 패치 날짜가 고정되어 있다.
- 모든 정적 데이터 항목이 `게임 내 직접검증 완료` 또는 `공식/신뢰 출처 + 영상 검증 완료` 상태다.
- 모든 실제 플레이 흐름 항목이 타임스탬프 기반 영상 로그로 검증되어 있다.
- 모든 고유 카드, 캐릭터, 젬, 아르카나, 스테이지, 보스, 마을 건물, 이벤트가 총량 대비 100% 추적되고 있다.
- 모든 고유 시스템 규칙은 정상 사례, 실패 사례, 예외 사례가 최소 1회 이상 관찰되어 있다.
- 출처 충돌 항목은 `해결`, `미해결`, `버전 차이`, `추정 금지` 중 하나로 판정되어 있다.
- 현재 프로젝트와 원작의 1:1 차이표가 작성되어 있다.
- 사용자가 조사 기준선과 미해결 항목을 승인했다.

## 완전성 카운터

조사 중에는 아래 카운터를 계속 갱신한다. `총량 미확정` 상태는 완료로 볼 수 없다.

| 영역 | 알려진 총량 | 조사 행 수 | E2 이상 | E3 이상 | E4/E5 | 충돌/미확정 | 완료율 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 카드 | 113 official-wiki card infobox rows plus 90 official-wiki non-character rows, 87 Dexerto non-character candidates, and official 65+ shorthand | 52 row-mapped + 35 Dexerto catalog-only + 90 wiki non-character + 113 wiki total rows | 113 official-wiki rows / value extract / field coverage crawl / 87 Dexerto page rows / card taxonomy reconciliation / metadata partial / 17 secondary evolution recipe mappings / PGG systems crawl / official release FAQ shorthand | 0 | metadata partial + official wiki | 35 card unlock achievements + 17 evolution rows remain mapped in `research/card-gap-map.md`; `research/card-secondary-catalog.md` adds 35 catalog-only rows, `research/card-dexerto-page-crawl.md` stores 87 individual page rows, `research/card-taxonomy-reconciliation.md` separates 87 Dexerto, 90 official-wiki non-character, 113 official-wiki total, 23 character/Crawler, and official 65+ shorthand layers; runtime and final count taxonomy 미확정 | 공식 메타데이터 수집 / secondary evolution recipe mapping / secondary full-card catalog mapping / individual page crawl / official wiki API crawl / official wiki field/value crawl / card taxonomy reconciliation / PGG beginner systems crawl / official FAQ shorthand / 구현 차이 매핑 완료 |
| 무기 카드 | 18 unlock tasks | 18 | 0 | 0 | 0 | `research/card-gap-map.md` maps 18/18 weapon unlock rows; 효과/실사용 미확정 | 1차 수집 / 구현 차이 매핑 완료 |
| 아이템 카드 | 17 official metadata candidates | 17 | metadata partial | 0 | metadata partial | Stone Mask added from Steam achievement metadata; `research/card-gap-map.md` maps 17/17 item/stat rows; 효과/실사용 미확정 | 공식 메타데이터 수집 / 1차 수집 / 구현 차이 매핑 완료 |
| Wild/특수 카드 | 15 secondary rows | 15 catalog-only | 15 secondary rows | 0 | 0 | `research/card-secondary-catalog.md` tracks 9 Wild and 6 Temporary candidates; exact spawn rules, chain behavior, crack/shatter behavior, and runtime effects remain unresolved | secondary catalog mapped / 조사중 |
| 캐릭터/크롤러 | 23 official-wiki rows plus 22 Dexerto page rows, 21 secondary playable-roster claims, 20 public unlock rows, and official 20+ shorthand | 23 wiki rows + 22 Dexerto rows + 20 public unlock rows | 23 official-wiki rows + character field/value coverage / 22 Dexerto page rows / character taxonomy reconciliation / 21 secondary partial / 20 metadata + PC Gamer priority hints + official release FAQ shorthand | 0 | 20 metadata + official wiki | Steam achievements support 20 public character unlock-style rows; `research/character-dexerto-page-crawl.md` exposes 22 page rows including Imelda and MissingN0, `research/character-taxonomy-reconciliation.md` separates 20 public, 21 secondary playable, 22 Dexerto, 23 official-wiki, and official 20+ layers, `research/official-wiki-character-value-extract.md` preserves 22 starter-deck card/count rows, 22 base-stat rows, trigger buckets, and 10 numeric / 11 blank / 2 non-numeric `unlockcost` fields, and `research/character-gap-map.md` maps 22/22 current implementation gaps with 0 exact parity; purchase/availability/runtime and count taxonomy unresolved | 공식 메타데이터 수집 / secondary roster-passive mapping / individual character-page crawl / character taxonomy reconciliation / official wiki API crawl / official wiki character field/value crawl / PC Gamer upgrade crawl / official FAQ shorthand / 출처 충돌 / 구현 차이 매핑 완료 |
| 젬 | 58 official-wiki gem rows plus 49 unlock tasks and official 50+ shorthand | 58 wiki rows + 49 unlock rows | 58 official-wiki rows + rarity weights + field/value coverage crawl + taxonomy reconciliation / 49 metadata + 49 Dexerto crawl rows + official release FAQ shorthand | 0 | 49 metadata + official wiki | Steam achievements account for 49 gem names; `research/gem-dexerto-unlock-crawl.md` stores the 49-row Dexerto unlock table; `research/official-wiki-api-crawl.md` stores 58 wiki gem rows and rarity/pool weights; `research/official-wiki-card-gem-field-crawl.md` confirms all 58 wiki gem rows expose text/unlock fields; `research/official-wiki-card-gem-value-extract.md` records 58 rarity/demo/unlock/keyword rows, duplicate cost-gem display names, and `X Mana` as the official-wiki-side label; `research/gem-taxonomy-reconciliation.md` narrows the 49-vs-58 boundary to 47 direct matches, 2 public cost buckets, 7 Gem-Hammer/default-style wiki rows, and 4 cost-modifier variant wiki rows; `research/gem-gap-map.md` maps 49/49 current implementation gaps with 0 exact parity; exact UI/game-file taxonomy, `X Mana`/`X Mana Gem` vs `Mana X Damage Gem`, effect mapping, rarity, and runtime remain unresolved | 공식 메타데이터 수집 / Dexerto unlock-table crawl / official wiki API crawl / official wiki field/value crawl / gem taxonomy reconciliation / official FAQ shorthand / 구현 차이 매핑 완료 |
| 아르카나 | 12 official-wiki rows plus official 12 shorthand | 12 | 12 official-wiki rows + field/value coverage + arcana taxonomy reconciliation / 10 Dexerto crawl rows / 12 secondary / 10 metadata + PC Gamer crawl hints + official release FAQ shorthand | 0 | 10 metadata + official wiki | Working source-level resolution: `research/arcana-dexerto-unlock-crawl.md` supports 10 public achievement unlock rows, `research/official-wiki-api-crawl.md` supports 12 rows including `Experimental Medicine` and `Shield Bash`, `research/official-wiki-arcana-relic-dungeon-field-crawl.md` confirms all 12 wiki rows expose unlock/text fields, `research/official-wiki-arcana-relic-dungeon-value-extract.md` preserves unlock fields and keyword buckets, `research/arcana-taxonomy-reconciliation.md` maps all 10 public rows to wiki rows and preserves Wild Buff / And Another / Over The Top conflicts, and `research/pcgamer-upgrade-priority-crawl.md` adds Polentir/Fortune Teller hints; `research/arcana-gap-map.md` maps 12/12 current implementation gaps with 0 exact parity; exact Fortune Teller UI/effects still missing | 공식 메타데이터 수집 / Dexerto unlock-table crawl / official wiki API crawl / official wiki field/value crawl / arcana taxonomy reconciliation / PC Gamer upgrade crawl / official FAQ shorthand / 교차검증 필요 / 구현 차이 매핑 완료 |
| Stages | Total conflict plus official 6-biome shorthand and 16 official-wiki dungeon variants including `Tutorial` | 15 non-tutorial candidates + 16 wiki variants | 13 Dexerto crawl rows / 14 metadata / 15 VID-002 candidates / stage taxonomy reconciliation / official 6-biome FAQ shorthand / official-wiki dungeon field/value crawl | 15 partial | 14 metadata + official wiki | `research/stage-dexerto-unlock-crawl.md` confirms 13 Dexerto rows with no `Mad Forest` or `Milk Factory` item rows; `research/stage-taxonomy-reconciliation.md` separates 13 Dexerto rows, 14 Steam progression rows, 15 non-tutorial candidates, 9 official-wiki dungeon pages, and 16 wiki variants including `Tutorial`; Steam achievements support 14 progression unlock rows plus VID-002 15 chapter candidates; `research/official-wiki-arcana-relic-dungeon-field-crawl.md` preserves 9 dungeon pages with order/floor/difficulty fields and `research/official-wiki-arcana-relic-dungeon-value-extract.md` preserves 16 named variant rows; boss/reward fields, biome/dungeon/stage/floor/tutorial taxonomy, Milk Factory row status, and Cappella/Capella spelling unresolved | Dexerto unlock-table crawl / stage taxonomy reconciliation / official wiki field/value crawl / official FAQ shorthand / Partial E3 / E5 metadata / 구현 차이 매핑 완료 |
| Bosses | Total unknown plus 132 expanded official-wiki enemy value rows | 9 named metadata + 9 video candidates + 1 final-boss name hypothesis + 132 wiki enemy value rows | selected secondary context + generated Trickster crawl + official wiki enemy field/value crawl | 9 partial | 9 metadata + official wiki | Steam achievements confirm 9 named enemy/boss unlock targets; `research/enemy-gap-map.md` maps all named/video rows to current implementation gaps with 0 exact parity; `research/enemy-trickster-secondary-crawl.md` preserves Trickster shatter/stat/damage/reward conflicts; `research/official-wiki-enemy-event-powerup-value-extract.md` adds 126 enemy infobox pages expanded into 132 enemy value rows and source-level Trickster fields; names still not mapped to video boss frames, HP/patterns/roles/rewards unresolved | 공식 메타데이터 수집 / official wiki enemy field/value crawl / secondary boss-context mapping / generated Trickster crawl / Partial E3 / 구현 차이 매핑 완료 |
| 적 | 총량 미확정 plus 132 expanded official-wiki enemy value rows | 9 named metadata rows + 9 visual groups + 1 final-boss name hypothesis + 132 wiki enemy value rows | selected secondary context + generated Trickster crawl + official wiki enemy field/value crawl | 9 partial | 9 metadata + official wiki | `research/enemy-gap-map.md` now maps named and video-only rows with 0 exact parity; `research/enemy-trickster-secondary-crawl.md` preserves special-boss trigger/reward conflicts; `research/official-wiki-enemy-event-powerup-value-extract.md` adds 128 enemy category rows / 126 infobox pages / 132 expanded value rows; normal enemy roster membership, behavior, spawn weights, and kill-counter rules still need UI/game-file/direct proof | 공식 메타데이터 수집 / official wiki enemy field/value crawl / secondary boss-context mapping / generated Trickster crawl / 영상 부분 검증 / 구현 차이 매핑 완료 |
| Relics / power-ups | 16 official-wiki relic rows vs 15 guide rows plus 19 official-wiki Power-Up rows | 16 wiki relic rows + 15 guide relic rows + 19 wiki Power-Up rows | 16 official-wiki relic rows + field/value coverage + relic taxonomy reconciliation + 19 Power-Up value rows + Power-Up taxonomy reconciliation + 15 secondary + GameSpot page crawl + PC Gamer route hints + PGG systems crawl / 13 metadata | 5 partial | 13 metadata + official wiki | 13 achievement-backed relic names + 2 non-achievement relic rows account for the old 15-slot guide boundary; `research/official-wiki-api-crawl.md` adds `Deck Box` as a 16th wiki row, `research/official-wiki-arcana-relic-dungeon-field-crawl.md` records blank relic fields, `research/official-wiki-arcana-relic-dungeon-value-extract.md` preserves id/found-in/presence/keyword rows, `research/relic-taxonomy-reconciliation.md` maps 15 guide rows to 16 official-wiki rows and keeps `Deck Box`, `Randomazzo`/`Arcana Finder`, Rilevatore, Ultimate Ultra Overkill, Guiding Light, and Polentir as proof targets, `research/official-wiki-enemy-event-powerup-value-extract.md` adds 19 Power-Up id/cost/rank/bonus/unlock fields plus Reroll and Mana/Cooldown conflicts, and `research/powerup-taxonomy-reconciliation.md` narrows 13 rankable + 6 run-found vs 19 wiki rows to 19 direct source-level matches with unresolved shop-class proof; exact effects/toggles/persistence, Power-Up Shop UI, and the 15-vs-16 boundary remain unresolved | 공식 메타데이터 수집 / official wiki API crawl / official wiki field/value crawl / official wiki Power-Up field/value crawl / relic taxonomy reconciliation / Power-Up taxonomy reconciliation / GameSpot page crawl / PC Gamer upgrade crawl / PGG beginner systems crawl / Partial E3 / 교차검증 필요 / 구현 차이 매핑 완료 |
| Events | Total unknown plus 10 official-wiki dungeon-event pages | 10 candidate + EVT-TBD + 10 wiki event pages | official wiki category/value rows + event taxonomy reconciliation | 10 partial | official wiki | `research/event-gap-map.md` maps 10 classified candidates plus the unclassified event-set row with 0 exact parity; `research/event-taxonomy-reconciliation.md` separates the 10 official-wiki event pages into 4 actionable source-level mechanic pages and 6 sparse label-only pages while keeping Store media/storyboard/prototype layers separate; option text, costs, rewards, invalid states, persistence, repeat rules, event-vs-station boundaries, and video/UI mapping remain unresolved | Partial E3 / official wiki event category value crawl / event taxonomy reconciliation / 구현 차이 매핑 완료 |
| 마을 건물/업그레이드 | 총량 미확정 plus 19 official-wiki Power-Up rows and official-wiki character `unlockcost` candidates | 8 town/meta rows + 19 wiki Power-Up rows + 23 wiki character rows | 3 metadata + town taxonomy reconciliation + secondary Inn/Power-Up context + Destructoid crawl + Power-Up taxonomy reconciliation + PC Gamer crawl + official wiki character/Power-Up field/value crawls + PGG systems crawl + official release FAQ crawl | 2 partial | 3 metadata + official wiki | The Inn/Power Ups Shop/Relic Museum official metadata plus storyboard surfaces; `research/town-taxonomy-reconciliation.md` separates building rows, official metadata, official media, structural values, unlock dependencies, and save/platform layers; secondary, official-social, and official-wiki sources add Tavern/Gorton Bell Inn purchase, official-wiki character value rows with 10 numeric / 11 blank / 2 non-numeric `unlockcost` fields, 22 starter decks, lead/follower party rule flags, up-to-three-Crawler party, generated Power-Up rankable/run-found taxonomy, `research/powerup-taxonomy-reconciliation.md` 19 direct Destructoid-to-wiki matches plus unresolved 13/6 classification, Reroll/Might/Luck/Mana conflicts, 19 Power-Up infobox rows, Crawler Slot, selected PC Gamer cost/stat/refund hints, PGG Greed/Might/Blacksmith priority hints, demo carryover claim, official Steam/Xbox demo carryover and no-launch-cross-save boundary, and Blacksmith/Fortune Teller route hints; exact building UI/costs/ranks/save/cross-save behavior still 미확정 | 공식 메타데이터 수집 / town taxonomy reconciliation / Destructoid Power-Up crawl / Power-Up taxonomy reconciliation / PC Gamer upgrade crawl / official wiki character field/value crawl / official wiki Power-Up field/value crawl / PGG beginner systems crawl / official release FAQ crawl / 영상 부분 검증 / 구현 차이 매핑 완료 |
| UI 화면 | 17 tracked | 17 | 0 | 13 partial | 0 | VID-013 adds settings/control/town-menu partial proof; exact text/transition/defaults 미확정 | Partial E3 |
| Actual play flow | 24 | 19 partial | 0 | 19 partial | 0 | VID-001/VID-002/VID-003/VID-004/VID-005/VID-006/VID-007/VID-008/VID-009/VID-010/VID-011/VID-012 partially confirmed; VID-013 confirms UI/options only | Video log started |
| 업적/해금 | 161 Steam achievements | 161 | 161 | 0 | 161 metadata | Domain/table mapping and per-achievement current implementation gap map complete; Town Hall UI, unlock popup, reward linkage still missing | 공식 메타데이터 수집 / 구현 차이 매핑 완료 |

## 추정 금지 규칙

- 출처가 없는 항목은 `미확정`으로 둔다.
- 다른 Vampire Survivors 계열 지식으로 Vampire Crawlers 규칙을 채우지 않는다.
- Vampire Survivors 스크린샷/영상은 같은 회사/계열 맥락이어도 Vampire Crawlers 증거로 계산하지 않는다.
- 게임 내 이름과 효과가 확인되기 전에는 임시 작업명을 원작 데이터로 취급하지 않는다.
- 영상에서 보이지 않는 수치는 추정하지 않고 `영상상 수치 미확인`으로 남긴다.
- 현재 구현이 이미 존재해도 원작 검증 전에는 원작과 같다고 판단하지 않는다.

## 증거 등급

| 등급 | 이름 | 사용 조건 | 완료 판정 사용 |
| --- | --- | --- | --- |
| E0 | 주장/메모 | 출처 없는 기억, 댓글, 요약 | 불가 |
| E1 | 단일 2차 출처 | 위키, 가이드, 기사 1개 | 1차 수집만 가능 |
| E2 | 교차 출처 | 서로 다른 출처 2개 이상이 일치 | 교차검증 가능 |
| E3 | 영상 검증 | 플레이 영상에서 타임스탬프와 UI/수치 확인 | 흐름 완료 가능 |
| E4 | 게임 내 직접검증 | 직접 플레이, 스크린샷, 저장 데이터, 반복 재현 | 최종 완료 가능 |
| E5 | 공식/게임 파일 | 공식 페이지, 패치 노트, 게임 내 텍스트/데이터 | 최종 완료 가능 |

모든 조사 행은 최소한 `증거 등급`, `출처 URL 또는 파일`, `확인 위치`, `검증자 메모`, `현재 상태`를 가져야 한다.

## 공통 조사 행 템플릿

모든 표는 이 필드를 기본으로 가진다.

| 필드 | 설명 |
| --- | --- |
| ID | 고유 식별자 |
| 원문 이름 | 게임 내 원문 |
| 한국어 작업명 | 현재 프로젝트에 대응시킬 작업명 |
| 분류 | 카드, 캐릭터, 젬, 아르카나, 스테이지, UI 등 |
| 버전/플랫폼 | 확인한 게임 버전과 플랫폼 |
| 원작 데이터 | 수치, 효과, 조건, 텍스트 |
| 실제 플레이 관찰 | 영상/직접 플레이에서 확인한 동작 |
| 출처 1 | URL, 문서, 영상, 타임스탬프 |
| 출처 2 | 교차검증 출처 |
| 충돌 여부 | 없음, 있음, 버전 차이, 미확정 |
| 증거 등급 | E0-E5 |
| 현재 상태 | 상태 표현 중 하나 |
| 현재 구현 위치 | 우리 프로젝트 파일/함수/데이터 |
| 현재 구현 차이 | 빠진 점, 다른 점, 추정 구현 |
| 구현 필요도 | 필수, 중요, 보류, 제외 |
| 완료 조건 | 이 행을 완료로 볼 조건 |

## 0. 조사 기준선

| 체크 | 필수 확인 내용 | 상태 |
| --- | --- | --- |
| 게임 버전 | 조사 기준 게임 버전, 빌드, 패치 날짜 | Partial E5/E2: `research/steam-store-appdetails-crawl.md` confirms app `3265700`, title `Vampire Crawlers: The Turbo Wildcard from Vampire Survivors`, release date Apr 21, 2026, and demo app `4329470`; `research/official-steam-news-crawl.md` captures official `Hotfix 1.4.1` on 2026-04-29; `research/steamdb-build-baseline-crawl.md` reports public branch build `23012943` built 2026-04-29 / updated 2026-04-30 but no official patch notes for that SteamDB build; local app is not installed, so exact verified local build/patch remains unresolved |
| 플랫폼 | Steam/PC, Steam Deck, 기타 플랫폼 차이 | Partial E5/E2: `research/steam-store-appdetails-crawl.md` confirms Windows and Mac for the main app, Windows-only demo app `4329470`, full controller support, Steam Cloud, and Family Sharing; official Steam news confirms launch on Steam, Nintendo Switch, Xbox, and PlayStation, controller support, no launch cross-save, and later mobile target; SteamDB metadata lists Windows/Linux depot `3265701`, macOS depot `3265702`, and Steam Deck test build `22813976`; runtime/platform differences still need direct verification |
| 저장 슬롯 | 새 게임, 이어하기, 삭제, 리셋 방법 | Blocked: local Steam install audit on 2026-05-21 found no `appmanifest_3265700.acf`; requires direct play after install |
| 난이도/모드 | 기본 난이도, 챌린지, 해금 모드 여부 | 미시작 |
| 언어 | 원문 언어, 번역 차이, UI 텍스트 기준 언어 | Partial E5/E3: `research/steam-store-appdetails-crawl.md` lists 12 main-app languages including Korean; current video logs and Store media use English UI as the text baseline unless separately marked |
| 조사 범위 | 본편만인지, 패치/시크릿/엔드게임 포함인지 | Partial baseline: Steam PC/Mac main game, visible unlock/endgame routes, current public footage, official release FAQ, official wiki, and official Steam news through `Hotfix 1.4.1`; demo/beta/patch-specific/secret-only claims remain excluded unless directly verified, and roadmap/QOL notes are not treated as shipped without later patch/UI/game-file proof |
| 완료 정의 | 사용자가 승인한 `완벽 조사` 범위 | 기준선 승인 대기 |

## 1. 실제 플레이 전체 흐름

게임의 실제 플레이 흐름은 정적 데이터보다 우선한다. 아래 흐름이 영상 또는 직접 플레이로 이어져야 한다.

| 흐름 ID | 흐름 | 반드시 기록할 것 | 상태 |
| --- | --- | --- | --- |
| FLOW-001 | 첫 실행 | 타이틀, 설정, 시작 버튼, 저장 생성, 첫 안내 | 미시작 |
| FLOW-002 | 마을 진입 | 이용 가능한 건물, 잠긴 건물, 초기 재화, 안내 문구 | 부분 E3: VID-001 `03:00`, `03:10` |
| FLOW-003 | Run setup | Character select, stage select, Arcana/power-up availability | Partial E3: VID-001 `03:50`, VID-002 chapter route frames across all 15 stages, VID-008 `00:00`, `05:10`, `14:10`, VID-009 `00:00`-`00:30`; detailed selection conditions unresolved |
| FLOW-004 | 던전 입장 | 시야, 방향, 미니맵, 시작 위치, 첫 조작 | 부분 E3: VID-001 `00:10` |
| FLOW-005 | 이동 | 전진, 좌회전, 우회전, 뒤돌기, 벽 충돌, 상호작용 거리 | 부분 E3: VID-001 `01:10`, 조작/충돌 규칙 미확정 |
| FLOW-006 | 전투 진입 | 적 표시, 카드 표시, 자동 사용 조건, 전투 시작 타이밍 | 부분 E3: VID-001 `00:40` |
| FLOW-007 | 카드 자동 사용 | 손패 순서, 마나 순서, 사용 간격, 사용 불가 카드 처리 | 미시작 |
| FLOW-008 | 마나 체인 | 0-1-2-3 순서, 배율 증가, 체인 유지/초기화 조건 | 미시작 |
| FLOW-009 | Wild 카드 | Wild가 체인을 잇는 방식, 소모/미소모, 예외 케이스 | 미시작 |
| FLOW-010 | 적 행동 | 적 공격 타이밍, 다중 적 순서, 보스 패턴, 상태 변화 | 미시작 |
| FLOW-011 | 방어/회복 | 방어 지속 시간, 피해 차감 순서, 회복 제한, 초과 회복 | 미시작 |
| FLOW-012 | 전투 종료 | 보상 발생, 카드 회수, HP/방어 유지, 다음 이동 가능 시점 | 미시작 |
| FLOW-013 | Level-up | XP gain, level-up popup, choice count, post-choice flow | Partial E3: VID-001 `00:20`, `04:20`, VID-010 `02:20`, VID-011 `06:10`, `15:50`; curve/reward pool unresolved |
| FLOW-014 | Chest/reward | Spawn condition, reward type, open UI, combat handling | Partial E3 candidates: VID-001 `02:50`, VID-007 `16:20`, `17:50`, `21:30`, VID-009 `12:30`, `23:50`, VID-010 `26:00`, `66:20`; reward type/trigger unresolved |
| FLOW-015 | Gem station | Socket UI, apply condition, replace/cancel, socket result | Partial E3: VID-003 `02:00`, `07:00`, VID-007 `03:00`, `06:40`, `08:40`, `08:50`, VID-008 `07:00`, `19:10`, `25:10`, `25:30`, `29:20`, VID-009 `01:40`, `07:30`, `15:30`, `15:40`, `33:00`, VID-010 `01:10`, `03:40`, `10:30`, `33:10`, `37:50`, `45:00`, VID-005 `05:50`, VID-011 `22:50`; result unresolved |
| FLOW-016 | 카드 진화 | 요구 카드/젬/조건, 진화 UI, 진화 후 덱 변화 | 미시작 |
| FLOW-017 | Event | Choices, cost, reward, failure/penalty, repeat rule | Partial E3 candidates: VID-004 `04:40`, `23:20`, VID-005 `16:20`, `18:50`, VID-007 `07:30`, `14:40`, `18:50`, VID-008 `03:50`, `21:30`, VID-009 `10:10`, VID-010 `35:20`, `50:40`, `53:40`, `55:20`, `57:20`; event class/result unresolved |
| FLOW-018 | Elite | Entry condition, combat pressure, reward difference, persistent display | Partial E3 candidates: VID-004 `15:10`, `18:00`, VID-007 `02:10`, `12:40`, `15:40`, VID-008 `12:40`, `18:40`, `28:30`, VID-009 `04:50`, `06:10`, `11:50`, `23:30`, VID-010 `08:20`, `23:10`, `39:50`, `48:30`, `58:30`, VID-005 `10:00`, `23:30`, `27:30`, `31:40`, VID-011 `29:50`, `30:00`; boss/elite split unresolved |
| FLOW-019 | Boss | Boss spawn, phase pattern, clear reward, next-floor link | Partial E3 candidates: VID-006 `15:10`, VID-007 `04:30`, `15:40`, VID-008 `24:00`, `29:00`, VID-009 `31:30`, `40:30`, `43:50`, VID-010 `61:20`, `62:40`, `64:50`, VID-005 `31:40`, VID-011 `30:00`; boss identity/reward unresolved |
| FLOW-020 | 삽/층 이동 | 삽 등장 조건, 내려가기 확인, 이전 층 복귀 가능 여부 | 부분 E3 후보: VID-009 `15:50`, `34:40`, loading/층전환/편집 구분 미확정 |
| FLOW-021 | Failure / near-failure | Death UI, reward summary, save, town return, near-failure pressure | Partial E3: VID-008 `05:00` Game Over; VID-012 `00:00`-`23:50` low-HP near-failure pressure ending in success; death cause/save unresolved |
| FLOW-022 | Success/clear | Final boss/floor clear, ending/summary, unlocks, town return | Partial E3 candidates: VID-003 `16:40`, VID-004 `25:30`, VID-006 `16:40`, VID-007 `21:50`, `22:00`, VID-008 `13:10`, VID-009 `46:20`, VID-010 `66:50`, VID-002 `08:16:22`, VID-005 `32:30`; success/summary fields unresolved |
| FLOW-023 | Repeated-run persistence | Whether unlocks/growth appear on later runs | Partial E3 candidates: VID-009 `46:30`, VID-010 `68:20`, VID-002 full-route start/end context; town return/save reflection unresolved |
| FLOW-024 | Endgame | Late stages, final boss, ending, credits, late reward | Partial E3: VID-010 `61:20`-`68:20`; VID-011 `20:20`-`30:00` adds filtered broken-build/high-card upper-bound candidate visuals without result proof; VID-002 `07:12:23`-`08:16:22` adds final-stage/extras context; boss name/trigger/unlock/formulas/persistence unresolved |

## 2. 영상 검증 표본

각 영상은 `VIDEO_LOG_TEMPLATE` 형식으로 별도 행을 만든다.

| 표본 | 반드시 필요한 영상 | 최소 완료 조건 | 상태 |
| --- | --- | --- | --- |
| V-001 | 완전 첫 런 또는 첫 클리어 | 튜토리얼, 첫 전투, 첫 보상, 첫 사망/클리어 | 부분 E3 로그 시작: VID-001 `00:10`-`04:20` |
| V-002 | Mad Forest 계열 초반 런 | 초반 기준 카드/적/보상 리듬 | 영상 부분 검증: VID-003 전구간 storyboard 로그 |
| V-003 | Inlaid Library 계열 런 | 직선형/특수 스테이지 리듬 | 영상 부분 검증: VID-004 전구간 storyboard 로그 |
| V-004 | Teeny Bridge 또는 전투 집중형 런 | 좁은 맵, 전투 빈도, 위험도 | 영상 부분 검증: VID-006 전구간 storyboard 로그 |
| V-005 | Dairy Plant/Milk Factory 중반 런 | 중반 압박, 보상/진화 흐름 | 영상 부분 검증: VID-007/VID-008 전구간 storyboard 로그 |
| V-006 | Gallo Tower 런 | 세로/탑형 진행 리듬, 적 패턴 | 영상 부분 검증: VID-009 전구간 storyboard 로그 |
| V-007 | Cappella/Ultima late run | Late difficulty, boss, endgame reward | Partial E3: VID-010 full storyboard log, including `61:20`-`68:20` ending/completion/credits/unlock candidate |
| V-008 | 사기/무한 빌드 런 | 체인, 젬, 카드, 캐릭터 조합의 상한 | Partial E3: VID-011 filtered storyboard log; Vampire Survivors/trailer/ad/outro frames rejected; exact caps/formulas/result still unresolved |
| V-009 | Failed or near-failed run | Damage pressure, recovery shortage, death or near-death cause | Partial E3: VID-012 full storyboard log confirms low-HP near-failure pressure and success/result, but not an actual Game Over |
| V-010 | 각 캐릭터 대표 런 | 캐릭터별 시작 덱/트리거/빌드 역할 | 조사중 |
| V-011 | All-stage representative clips | Entry, boss, reward, and floor structure for every stage | Partial E3: VID-002 full-game route cross-checks all 15 chaptered stage entries; boss/reward/floor details still unresolved |
| V-012 | UI/마을 전용 영상 | 건물, 상점, 해금, 비용, 재화 흐름 | Partial E3: VID-013 full storyboard log confirms Town Hall/Systems/World Map entry surfaces, Gameplay/Sound/Accessibility/Input settings, and unsaved-changes modal; exact labels/costs/defaults still unresolved |

## 2-A. 실플레이 전수 범위

아래 범위는 대표 표본이 아니라 전수 확인 대상이다.

| 범위 | 전수 확인 조건 | 상태 |
| --- | --- | --- |
| 모든 스테이지 입장 | 각 스테이지의 입장 UI, 시작 위치, 주요 규칙, 첫 전투를 확인 | 미시작 |
| 모든 스테이지 클리어 | 각 스테이지의 보스, 클리어 보상, 다음 해금 연결을 확인 | 미시작 |
| 모든 캐릭터 시작 | 각 캐릭터의 시작 덱, 패시브 텍스트, 구매/구출 조건을 확인 | 미시작 |
| 모든 캐릭터 발동 | 각 캐릭터 패시브가 실제 전투에서 발동하는 사례를 확인 | 미시작 |
| 모든 카드 실제 사용 | 각 카드가 전투에서 사용되는 순간, 수치, 대상, 이펙트를 확인 | 미시작 |
| 모든 젬 실제 장착 | 각 젬의 장착 가능 카드, 효과 적용, 예외를 확인 | 미시작 |
| 모든 진화 실제 발생 | 각 진화의 조건 충족, UI, 결과 카드, 덱 변화를 확인 | 미시작 |
| 모든 아르카나 실제 적용 | 선택 전/후 빌드 영향과 수치 변화를 확인 | 미시작 |
| 모든 마을 건물 사용 | 건물별 구매, 업그레이드, 잠금 해제, 비용 변화를 확인 | 미시작 |
| 모든 이벤트 선택지 | 이벤트별 모든 선택지와 결과를 확인 | 미시작 |
| 모든 실패 유형 | 전투 사망, 런 포기, 잘못된 빌드, 자원 부족 상황을 확인 | 미시작 |
| 모든 보상 유형 | 레벨업, 상자, 엘리트, 보스, 이벤트, 젬 스테이션 보상을 확인 | 미시작 |

### VIDEO_LOG_TEMPLATE

| 필드 | 기록 |
| --- | --- |
| 영상 ID |  |
| URL/파일 |  |
| 길이 |  |
| 게임 버전/날짜 |  |
| 스테이지 |  |
| 캐릭터 |  |
| 시작 덱/아르카나/파워업 |  |
| 결과 | 클리어, 사망, 중단 |
| 주요 타임스탬프 | `00:00`, `02:15` 형식 |
| 보상 등장 | 횟수와 시간 |
| 레벨업 | 시간, 선택지, 선택 결과 |
| 상자 | 시간, 보상 |
| 젬/소켓 | 시간, 장착 대상, 효과 |
| 진화 | 시간, 조건, 결과 |
| 보스 | 시간, 패턴, 피해 압박 |
| 사망/위기 | HP 변화, 원인 |
| UI 관찰 | 화면, 버튼, 팝업, 텍스트 |
| 현재 구현 차이 | 우리 프로젝트와 다른 점 |
| 미확정 | 추가 검증 필요 항목 |

## 3. 정적 데이터 전수조사

| 영역 | 필수 필드 | 완료 조건 | 상태 |
| --- | --- | --- | --- |
| 카드 전체 | 이름, 타입, 색/마나, 비용, 효과, 수치, 타겟, 쿨다운/즉시성, 태그, 소켓, 언락, 진화, UI 텍스트 | 전체 카드가 게임 내/영상/교차 출처로 검증 | 공식 메타데이터 수집 / secondary full-card catalog mapping / card taxonomy reconciliation / individual page crawl / PGG beginner systems crawl / official FAQ shorthand / 구현 차이 매핑 완료: `research/card-gap-map.md` maps 52 collected unlock/evolution candidates, `research/card-secondary-catalog.md` tracks 35 catalog-only rows, `research/card-dexerto-page-crawl.md` stores 87 page rows, `research/card-taxonomy-reconciliation.md` separates 87 Dexerto / 90 official-wiki non-character / 113 official-wiki total / official 65+ layers, and 0 rows have exact original parity |
| 무기 카드 | 공격 방식, 대상 수, 투사체/범위, 스케일링, 진화 대상 | 모든 무기 카드 실제 사용 확인 | 1차 수집 / 구현 차이 매핑 완료 |
| 아이템 카드 | 방어, 회복, 버프, 디버프, 경제, 유틸 효과 | 모든 아이템 카드 실제 사용 확인 | 공식 메타데이터 수집 / 1차 수집 / 구현 차이 매핑 완료 |
| Wild 카드 | 비용, 색상, 체인 연결, 사용 우선순위, 예외 케이스 | 일반/체인 실패/다중 Wild 영상 검증 | secondary catalog mapped / 조사중: 9 Wild and 6 Temporary candidates now tracked in `research/card-secondary-catalog.md`; runtime unresolved |
| 카드 언락 | 조건, 해금 위치, 마을 표시, 해금 후 등장 풀 | 전체 언락 조건 교차검증 | 1차 수집 |
| 카드 진화 | 재료, 젬, 소켓, 조건, 결과 카드, 중복 가능성 | 모든 진화 실제 UI 또는 영상 검증 | 1차 수집 |
| 캐릭터 | 이름, 구매/구출 조건, 가격, 시작 덱, 패시브, 발동 색/조건, 역할 | 전체 캐릭터 목록과 대표 플레이 검증 | 공식 메타데이터 수집 / individual character-page crawl / character taxonomy reconciliation / official wiki character field/value crawl / official FAQ shorthand / 출처 충돌 / 구현 차이 매핑 완료: `research/character-gap-map.md` maps all 20 unlock rows plus Imelda/MissingN0 conflict rows, `research/character-dexerto-page-crawl.md` stores 22 page rows, `research/character-taxonomy-reconciliation.md` separates 20/21/22/23/20+ layers, and `research/official-wiki-character-value-extract.md` preserves starter decks, base stats, trigger buckets, Divano/MissingN0/Imelda/O'Sole targets, and `unlockcost` fields; 0 rows have exact original parity |
| 젬 | 49종 여부, 효과, 희귀도, 언락, 장착 가능 카드, 중첩, 교체, 강화 | 전체 젬 실제 효과/출처 검증 | 공식 메타데이터 수집 / official FAQ shorthand / gem taxonomy reconciliation / 구현 차이 매핑 완료: `research/gem-gap-map.md` maps all 49 collected gem rows against current prototype gems, `research/gem-taxonomy-reconciliation.md` maps 47 public-to-wiki matches plus cost/default-row exceptions, and `research/official-release-faq-crawl.md` preserves the official 50+ shorthand boundary; 0 rows have exact original parity |
| 아르카나 | 총량, 이름, 효과, 언락, 런 시작 선택, 빌드 영향 | 총량 충돌 해결 + 실제 선택 흐름 검증 | 공식 메타데이터 수집 / official FAQ shorthand / 교차검증 필요 / 구현 차이 매핑 완료: `research/arcana-gap-map.md` maps 10 official unlock rows plus 2 automatic/default secondary rows and `research/official-release-faq-crawl.md` preserves the official 12-arcana shorthand; 0 rows have exact original parity |
| 유물/파워업 | 이름, 위치, 효과, 해금, 중첩, 전투/마을 영향 | 전체 목록과 획득 흐름 검증 | 공식 메타데이터 수집 / GameSpot page crawl / PGG beginner systems crawl / 영상 부분 검증 / 교차검증 필요 / 구현 차이 매핑 완료: `research/relic-gamespot-page-crawl.md` stores 15 visible rows, `research/pgg-beginner-systems-crawl.md` adds Guiding Light and Grim Grimoire route hints, `research/relic-gap-map.md` maps all 15 collected relic rows; secondary effects exist for all 15; 0 rows have exact original parity |
| 스테이지 | 이름, 순서, 해금, 보스, 층 수, 특수 규칙, 보상, 난이도 | 총량 충돌 해결 + 각 스테이지 영상 확인 | 출처 충돌 / Dexerto unlock-table crawl / official FAQ shorthand / 영상 부분 검증 / 구현 차이 매핑 완료: `research/stage-dexerto-unlock-crawl.md` stores the 13-row Dexerto table, `research/official-release-faq-crawl.md` preserves the 6-biome/few-dungeons/several-floors boundary, and `research/stage-gap-map.md` maps all 15 stage candidates against current prototype floors; 0 rows have exact original parity |
| 적 | 일반/엘리트/보스, HP, 공격, 패턴, 상태, 보상 | 각 스테이지별 적 등장 검증 | 공식 메타데이터 수집 / secondary boss-context mapping / generated Trickster crawl / 영상 부분 검증 / 구현 차이 매핑 완료: `research/enemy-gap-map.md` maps 9 named metadata rows, 9 visual groups, and 1 final-boss hypothesis with 0 exact original parity; `research/enemy-trickster-secondary-crawl.md` preserves Trickster trigger/stat/reward boundaries |
| 보스 | 이름, 스테이지, HP/패턴, 페이즈, 보상, 해금 영향 | 모든 보스 전투 영상 검증 | 공식 메타데이터 수집 / secondary boss-context mapping / generated Trickster crawl / 영상 부분 검증 / 구현 차이 매핑 완료: Steam achievements confirm named enemy targets, `research/enemy-gap-map.md` maps all named/video rows, and HP/pattern/reward/name-to-video proof remains unresolved |
| 이벤트 | 발생 위치, 선택지, 비용, 보상, 실패, 반복 가능성 | 모든 이벤트 선택지 검증 | 영상 부분 검증 / official wiki event category value crawl / event taxonomy reconciliation / 구현 차이 매핑 완료: `research/event-gap-map.md` maps 10 classified event candidates plus EVT-TBD, `research/event-taxonomy-reconciliation.md` separates 4 actionable source-level mechanic pages from 6 sparse label-only pages, and `research/official-wiki-enemy-event-powerup-value-extract.md` keeps the 10 event page-name queue; 0 rows have exact original parity |
| 마을 건물 | 여관, 타운홀, 파워업 상점, 블랙스미스, 주얼러, 점술가 | 건물별 기능/비용/해금 순서 검증 | 공식 메타데이터 수집 / town taxonomy reconciliation / official wiki character field/value crawl / official release FAQ crawl / 영상 부분 검증 / 구현 차이 매핑 완료: `research/town-gap-map.md` maps 8 town/meta rows, `research/town-taxonomy-reconciliation.md` separates building rows, official metadata, official media, structural values, unlock dependencies, and save/platform layers, `research/official-wiki-character-value-extract.md` adds Inn `unlockcost` candidates, 22 starter decks, lead/follower rule flags, and character availability capture targets, and `research/official-release-faq-crawl.md` preserves Steam/Xbox demo carryover plus no-launch-cross-save boundaries; 0 rows have exact original parity |
| 경제 | 골드, XP, 재화, 가격 곡선, 보상량, 영구 성장 비용 | 표본 런과 직접검증으로 수치화 | 미시작 |
| 업적/해금 | 업적명, 조건, 보상, 게임 내 표시 | 전체 업적/해금 연결 검증 | 공식 메타데이터 수집 / 구현 차이 매핑 완료: Steam Community achievements page fetched 2026-05-21 exposes 161 achievement rows in `research/data-achievements.md`; all rows are mapped to a research domain/table and `research/achievement-gap-map.md`; still needs Town Hall/in-game popup/reward mapping |

## 4. 규칙/시스템 전수조사

| 시스템 | 반드시 밝혀야 할 질문 | 완료 조건 | 상태 |
| --- | --- | --- | --- |
| 카드 사용 순서 | 자동 사용 순서가 손패 위치, 비용, 색, 랜덤 중 무엇인지 | 반복 영상/직접검증 | 미시작 |
| 마나 체인 | 어떤 비용 순서가 유효한지, 최대 배율, 실패 조건 | 정상/실패/예외 케이스 영상 | 미시작 |
| Wild 예외 | Wild가 어떤 비용으로 간주되는지, 체인 유지/초기화 여부 | 다중 사례 검증 | 미시작 |
| 드로우/손패 | 손패 수, 보충 타이밍, 버림/덱 순환, 전투 후 처리 | 전투 전/중/후 영상 | 미시작 |
| 피해 계산 | 기본 피해, 배율, 방어, 저항, 치명타, 상태 이상 순서 | 수치 로그 검증 | 미시작 |
| 방어 계산 | 방어 지속, 턴/방/전투 간 유지, 초과 피해 처리 | 영상/직접검증 | 미시작 |
| 회복 | 회복 상한, 전투 중/후 회복, 재생 효과 | 영상/직접검증 | 미시작 |
| 상태 이상 | 독, 화상, 빙결, 취약, 버프 등 존재 여부와 tick 순서 | 실제 사례 확인 | 미시작 |
| 적 턴 | 적 공격 주기, 경고 UI, 다중 적 처리, 보스 페이즈 | 반복 전투 검증 | 미시작 |
| XP/레벨 | XP 지급량, 레벨 곡선, 선택지 수, 레벨업 보상 풀 | 여러 런 수치화 | 영상 부분 검증 |
| 보상 빈도 | 방/상자/엘리트/보스/이벤트별 보상 빈도 | 타임스탬프 통계 | 미시작 |
| 젬 장착 | 슬롯 개수, 조건, 장착/교체/제거, 효과 적용 순서 | UI와 실제 효과 검증 | 영상 부분 검증 |
| 진화 | 진화 우선순위, 중복, 실패 조건, 진화 후 카드 변환 | 모든 진화 사례 | 미시작 |
| 마을 성장 | 영구 성장 저장, 비용 증가, 해금 순서, 반복 런 반영 | 새 런 전후 비교 | 미시작 |
| 저장/로드 | 저장 타이밍, 런 중 종료, 사망 후 저장, 해금 보존 | 직접검증 | 미시작 |

## 5. 실제 플레이 밸런스 조사

밸런스는 단순 수치가 아니라 시간 흐름으로 기록한다.

| 지표 | 기록 방법 | 최소 표본 | 상태 |
| --- | --- | --- | --- |
| 첫 전투 시간 | 런 시작부터 첫 전투 진입까지 | 5런 이상 | 미시작 |
| 방당 평균 전투 시간 | 전투 시작-종료 타임스탬프 | 스테이지별 3런 이상 | 미시작 |
| 방당 카드 사용 수 | 전투당 사용 카드 수와 체인 배율 | 스테이지별 3런 이상 | 미시작 |
| HP 압박 | 전투별 HP 변화, 최저 HP, 회복 빈도 | 성공/실패 런 포함 | 미시작 |
| 보상 간격 | 레벨업/상자/젬/이벤트/진화 간격 | 풀런 5개 이상 | 영상 로그 시작 |
| 진화 도달 시간 | 첫 진화까지 시간/방/레벨 | 빌드별 3회 이상 | 미시작 |
| 빌드 완성 시점 | 주요 카드/젬/아르카나 조합 완성 | 대표 빌드별 1회 이상 | 미시작 |
| 실패 원인 | 사망/위기 원인 분류 | 실패 런 3개 이상 | 영상 부분 검증 |
| 사기 빌드 상한 | 무한/고배율/고방어 루프 발생 조건 | 사기 런 1개 이상 | Partial E3: VID-011 high-card/high-counter broken-build candidate; exact cap/formula/direct result still unresolved |
| Late-game difficulty | Late-stage damage/reward/boss pressure | 3+ late runs | Partial E3: VID-010 `61:20`-`68:20`; VID-011 adds broken-build pressure visuals; VID-012 adds Library Sanctum pressure but still needs more late-run samples and exact values |

## 6. UI/UX 화면 전수조사

| 화면 | 필수 캡처/기록 | 상태 |
| --- | --- | --- |
| 타이틀 | 버튼, 옵션, 저장 슬롯, 접근성 | 미시작 |
| 마을 | 건물 배치, 잠금 표시, 재화, 툴팁 | 영상 부분 검증 |
| 캐릭터 선택 | 카드/패시브/가격/언락 표시 | 영상 부분 검증 |
| 스테이지 선택 | 스테이지 목록, 잠금, 보상, 난이도 | 영상 부분 검증 |
| 아르카나 선택 | 선택 가능 수, 효과 설명, 잠금 | 미시작 |
| 던전 화면 | 시야, 방향, 미니맵, 상호작용 버튼 | 영상 부분 검증 |
| 전투 화면 | 적, HP, 카드, 체인, 배율, 상태 표시 | 영상 부분 검증 |
| 레벨업 | 선택지 개수, 카드/효과 표시, 스킵 여부 | 영상 부분 검증 |
| 상자 | 보상 공개 방식, 애니메이션, 확인 버튼 | 영상 부분 검증 |
| 젬 장착 | 카드 선택, 슬롯 표시, 교체/취소 | 영상 부분 검증 |
| 진화 | 조건 표시, 결과 카드, 확인 흐름 | 미시작 |
| 이벤트 | 선택지, 비용, 결과 피드백 | 영상 부분 검증 |
| 보스/층 이동 | 보스 클리어, 삽, 다음 층 확인 | 영상 부분 검증 |
| 런 종료 | 결과, 보상, 해금, 통계, 마을 복귀 | 영상 부분 검증 |
| 도감/컬렉션 | 카드, 젬, 캐릭터, 업적, 미발견 표시 | 미시작 |
| 설정 | 사운드, 해상도, 조작, 언어 | 영상 부분 검증 |

## 7. 현재 프로젝트 1:1 비교표

조사 완료 전에도 현재 구현과 원작의 차이를 계속 기록한다.

| 원작 영역 | 원작 확인 상태 | 현재 파일 | 현재 구현 | 차이 | 우선순위 | 구현 승인 |
| --- | --- | --- | --- | --- | --- | --- |
| 카드 데이터 | 공식 메타데이터 수집 / secondary evolution recipe mapping / secondary full-card catalog mapping / card taxonomy reconciliation / individual page crawl / PGG beginner systems crawl / official FAQ shorthand / 구현 차이 매핑 완료 | `research/card-gap-map.md`, `research/card-secondary-catalog.md`, `research/card-dexerto-page-crawl.md`, `research/card-taxonomy-reconciliation.md`, `research/pgg-beginner-systems-crawl.md`, `research/official-release-faq-crawl.md`, `src/content/crawler-clone.js`, `src/rules/cards.js`, `src/rules/card-effects.js` | 30 prototype cards; 52 collected unlock/evolution rows mapped, 35 catalog-only rows tracked, 87 individual Dexerto page rows captured, 90 official-wiki non-character rows and 113 official-wiki total rows separated, PGG source-level evolution/socket/deck-mutation hints preserved, and official 65+ shorthand captured with current 1:1 implemented `0` | 원작 87/90/113 card catalog exact UI/game-file proof, official 65+ vs page-row count taxonomy, missing socket fields, 타겟, 진화 레시피, `Destroyed after use`, socket-blocked evolution, 런타임 동작 대응 없음 | 필수 | 대기 |
| 마나 체인 | 일부 수집 | `src/rules/turboturn.js` | 0-1-2-3, 배율 | Wild 예외 미검증 | 필수 | 대기 |
| 던전 흐름 | 일부 수집 | `src/rules/crawler-dungeon.js` | 1인칭 격자 | 스테이지/보상 리듬 미검증 | 필수 | 대기 |
| 스테이지 체인 | 출처 충돌 / Dexerto unlock-table crawl / official FAQ shorthand / 영상 부분 검증 / 구현 차이 매핑 완료 | `research/data-stages.md`, `research/stage-dexerto-unlock-crawl.md`, `research/official-release-faq-crawl.md`, `research/stage-gap-map.md`, `src/content/crawler-clone.js`, `src/rules/crawler-dungeon.js` | 3 prototype floors; 15 collected original stage candidates all mapped with current 1:1 implemented `0`; Dexerto crawl covers 13 unlock rows only and official FAQ crawl adds 6-biome/few-dungeons/several-floors shorthand | 원작 15 스테이지 월드맵, biome/dungeon/stage/floor taxonomy, 락 그래프, 스테이지 카드, 보스, 보상, 클리어/실패/지속성 대응 없음 | 필수 | 대기 |
| 젬/소켓 | 공식 메타데이터 수집 / Dexerto unlock-table crawl / official wiki field/value crawl / gem taxonomy reconciliation / official FAQ shorthand / 구현 차이 매핑 완료 | `research/data-gems.md`, `research/gem-dexerto-unlock-crawl.md`, `research/gem-taxonomy-reconciliation.md`, `research/official-wiki-api-crawl.md`, `research/official-wiki-card-gem-field-crawl.md`, `research/official-wiki-card-gem-value-extract.md`, `research/official-release-faq-crawl.md`, `research/gem-gap-map.md`, `src/content/crawler-clone.js`, `src/rules/crawler-dungeon.js` | 5 crawler-clone prototype gems; 49 collected original gem rows all mapped with current 1:1 implemented `0`; official wiki value extract adds 58 source-level gem rows; taxonomy reconciliation narrows these to 47 direct matches, 2 public cost buckets, 7 Gem-Hammer/default-style wiki rows, and 4 cost-modifier variant wiki rows; official FAQ crawl adds 50+ shorthand | 원작 exact UI/game-file 49/58/50+ 젬 count taxonomy, 효과, 희귀도, 보상 풀, 장착 가능 카드, 교체/취소, 예외, 런타임 동작 대응 없음; `X Mana` / `X Mana Gem` vs `Mana X Damage Gem` naming unresolved | 필수 | 대기 |
| 아르카나 | 공식 메타데이터 수집 / Dexerto unlock-table crawl / official wiki field/value crawl / PC Gamer upgrade crawl / official FAQ shorthand / 교차검증 필요 / 구현 차이 매핑 완료 | `research/data-arcana.md`, `research/arcana-dexerto-unlock-crawl.md`, `research/official-wiki-arcana-relic-dungeon-field-crawl.md`, `research/official-wiki-arcana-relic-dungeon-value-extract.md`, `research/pcgamer-upgrade-priority-crawl.md`, `research/official-release-faq-crawl.md`, `research/arcana-gap-map.md`, `src/rules/crawler-dungeon.js`, `src/rules/turboturn.js` | shallow `state.crawl.arcana` array and local arcana-adjacent events only; 12 source-level candidate rows all mapped with current 1:1 implemented `0`; official wiki value extract adds 12 unlock/keyword rows and official FAQ crawl adds 12-arcana shorthand | 원작 Fortune Teller, 시작 선택, automatic/default row proof, 효과 텍스트, Arcana Finder chest, 런타임 빌드 영향 대응 없음; generated Dexerto table covers only 10 unlock rows and PC Gamer/official FAQ remain source-level hints only | 필수 | 대기 |
| 캐릭터 | 공식 메타데이터 수집 / secondary roster-passive mapping / individual character-page crawl / character taxonomy reconciliation / official wiki character field/value crawl / PC Gamer upgrade crawl / official FAQ shorthand / 출처 충돌 / 구현 차이 매핑 완료 | `research/character-gap-map.md`, `research/character-dexerto-page-crawl.md`, `research/character-taxonomy-reconciliation.md`, `research/official-wiki-character-field-crawl.md`, `research/official-wiki-character-value-extract.md`, `research/pcgamer-upgrade-priority-crawl.md`, `research/official-release-faq-crawl.md`, `src/content/crawler-clone.js`, `src/rules/crawler-dungeon.js` | 4 custom prototype characters; 22 collected original/conflict rows all mapped with current 1:1 implemented `0`; `character-taxonomy-reconciliation.md` separates 20 public unlock rows, 21 secondary playable rows, 22 Dexerto page rows, 23 official-wiki rows, and official 20+ shorthand; official wiki value extract adds starter decks, base stats, trigger buckets, `unlockcost` candidates, and Divano/MissingN0/Imelda/O'Sole notes | 원작 정확 purchase price, availability, UI text, trigger-color display, Inn/선택 UI, 20+/20/21/22/23 count taxonomy, Divano/MissingN0/Imelda/O'Sole resolution, lead/follower deck proof, 런타임 패시브 대응 없음 | 필수 | 대기 |
| 유물/파워업 | 공식 메타데이터 수집 / GameSpot page crawl / PC Gamer upgrade crawl / PGG beginner systems crawl / 영상 부분 검증 / 교차검증 필요 / 구현 차이 매핑 완료 | `research/relic-gap-map.md`, `research/relic-gamespot-page-crawl.md`, `research/pcgamer-upgrade-priority-crawl.md`, `research/pgg-beginner-systems-crawl.md`, `src/content/crawler-clone.js`, `src/content/expansion.js`, `src/rules/progression.js`, `src/rules/crawler-dungeon.js` | prototype relic pool and local map/combo/gem/arcana-adjacent helpers; 15 collected relic rows all mapped with current 1:1 implemented `0`; PC Gamer crawl and PGG systems crawl add selected route hints only | 원작 15 유물 exact UI text, Rilevatore location, Ultimate Ultra Overkill location, Guiding Light location, Museum 토글, disabled behavior, 지속성, 런타임 결과 대응 없음 | 필수 | 대기 |
| 마을 | 공식 메타데이터 수집 / town taxonomy reconciliation / Destructoid Power-Up crawl / Power-Up taxonomy reconciliation / PC Gamer upgrade crawl / PGG beginner systems crawl / official release FAQ crawl / official wiki character field/value crawl / official wiki Power-Up field/value crawl / 영상 부분 검증 / 구현 차이 매핑 완료 | `research/town-gap-map.md`, `research/town-taxonomy-reconciliation.md`, `research/official-wiki-character-field-crawl.md`, `research/official-wiki-character-value-extract.md`, `research/powerup-destructoid-tier-crawl.md`, `research/powerup-taxonomy-reconciliation.md`, `research/pcgamer-upgrade-priority-crawl.md`, `research/pgg-beginner-systems-crawl.md`, `research/official-release-faq-crawl.md`, `research/official-wiki-enemy-event-powerup-field-crawl.md`, `research/official-wiki-enemy-event-powerup-value-extract.md`, `src/rules/crawler-dungeon.js`, `src/rules/progression.js`, UI files | 얕은 성장, run-local shop, prototype party state only; 8 town/meta rows all mapped with current 1:1 implemented `0`; `town-taxonomy-reconciliation.md` separates building row, metadata, media, structural value, unlock-dependency, and save/platform layers; official wiki character value extract adds Inn `unlockcost` candidates, 22 starter decks, lead/follower rule flags, and Divano/MissingN0/Imelda/O'Sole capture targets; Power-Up crawls store 13 rankable and 6 run-found/not-yet-rankable candidates plus 19 official-wiki Power-Up id/cost/rank/bonus/unlock rows; `powerup-taxonomy-reconciliation.md` maps all 19 Destructoid rows to official-wiki rows while preserving rankable/run-found, Reroll, Might/Luck, and Mana/Cooldown conflicts; PC Gamer crawl stores selected cost/stat/refund and Blacksmith/Fortune Teller route hints, PGG systems crawl stores Greed/Might/Blacksmith plus demo-carryover hints, and official FAQ crawl stores Steam/Xbox demo carryover plus no-cross-save boundary | Inn, character costs/availability, Power-Up Shop, Mana/Cooldown label, Reroll cost, Might/Luck values, Blacksmith, Jeweller, Fortune Teller, Relic Museum, Town Hall, demo carryover, cross-save/cloud, 비용/해금/지속성 대응 없음 | 필수 | 대기 |
| 이벤트 | 영상 부분 검증 / official wiki event category value crawl / event taxonomy reconciliation / 구현 차이 매핑 완료 | `research/event-gap-map.md`, `research/event-taxonomy-reconciliation.md`, `research/official-wiki-enemy-event-powerup-field-crawl.md`, `research/official-wiki-enemy-event-powerup-value-extract.md`, `src/content/crawler-clone.js`, `src/content/balance.js`, `src/content/expansion.js`, `src/rules/crawler-dungeon.js` | prototype event pool and local gem station/reward handlers; 10 candidates plus EVT-TBD mapped with current 1:1 implemented `0`; event taxonomy reconciliation separates 4 actionable wiki mechanic pages, 6 sparse label-only pages, Store media, storyboard candidates, and prototype-only event layers | 원작 이벤트 방 이름, 선택지, 비용, 보상, 실패/무효 상태, 반복 규칙, 지속성, event-vs-station 경계 대응 없음 | 필수 | 대기 |
| Enemies/bosses | 공식 메타데이터 수집 / official wiki enemy field/value crawl / secondary boss-context mapping / generated Trickster crawl / 영상 부분 검증 / 구현 차이 매핑 완료 | `research/enemy-gap-map.md`, `research/data-enemies.md`, `research/enemy-trickster-secondary-crawl.md`, `research/official-wiki-enemy-event-powerup-field-crawl.md`, `research/official-wiki-enemy-event-powerup-value-extract.md`, `src/content/crawler-clone.js`, `src/content/balance.js`, `src/content/expansion.js`, `src/rules/enemies.js` | custom local enemies, elites, and boss variants only; 9 official named enemy/boss unlock targets, 9 video visual groups, 1 final-boss hypothesis, and 132 official-wiki enemy value rows mapped with current 1:1 implemented `0`; generated crawls preserve Trickster trigger/stat/reward conflicts | original nameplates, HP/intent/attack patterns, boss phases, Trickster trigger, reward/unlock linkage, official-wiki enemy membership, and final-boss identity missing | 필수 | 대기 |
| 업적/해금 | 공식 메타데이터 수집 / 구현 차이 매핑 완료 | `research/achievement-gap-map.md` | 별도 업적/해금 시스템 없음; 161개 모두 current 1:1 implemented `0` | Steam 161 업적/Town Hall 체크리스트/언락 팝업/보상 지속성 대응 없음 | 중요 | 대기 |
| 밸런스 | 미검증 | QA 리포트 | 자체 자동 QA | 원작 리듬 검증 전 | 필수 | 대기 |

## 8. 조사 산출물

완벽 조사를 주장하려면 아래 파일 또는 표가 있어야 한다.

| 산출물 | 내용 | 상태 |
| --- | --- | --- |
| `research/data-cards.md` | 전체 카드 원작 데이터 | 공식 메타데이터 수집 / secondary evolution recipe mapping / secondary full-card catalog mapping / card taxonomy reconciliation / official FAQ shorthand / 구현 차이 매핑 완료 |
| `research/data-characters.md` | 전체 캐릭터/시작 덱/트리거 | 공식 메타데이터 수집 / individual character-page crawl / official wiki character field/value crawl / PC Gamer upgrade crawl / official FAQ shorthand / 출처 충돌 / 구현 차이 매핑 완료 |
| `research/data-gems.md` | 전체 젬/소켓/효과 | 1차 수집 / Dexerto unlock-table crawl / gem taxonomy reconciliation / official FAQ shorthand / 구현 차이 매핑 완료 |
| `research/data-arcana.md` | 전체 아르카나/언락/효과 | 공식 메타데이터 수집 / Dexerto unlock-table crawl / PC Gamer upgrade crawl / official FAQ shorthand / 교차검증 필요 / 구현 차이 매핑 완료 |
| `research/data-stages.md` | 전체 스테이지/보스/보상 | 출처 충돌 / Dexerto unlock-table crawl / official FAQ shorthand / 영상 부분 검증 / 구현 차이 매핑 완료 |
| `research/data-town.md` | 마을 건물/비용/해금 | 공식 메타데이터 수집 / Destructoid Power-Up crawl / PC Gamer upgrade crawl / official wiki character field/value crawl / official release FAQ crawl / town taxonomy reconciliation / 영상 부분 검증 / 구현 차이 매핑 완료 |
| `research/town-taxonomy-reconciliation.md` | Town/building/source-layer split | source-level reconciliation complete / direct UI-save proof still required / 원작 대응 구현 0 |
| `research/data-relics.md` | 유물/파워업/영구 토글 | 공식 메타데이터 수집 / GameSpot page crawl / PC Gamer upgrade crawl / 영상 부분 검증 / 교차검증 필요 / 구현 차이 매핑 완료 |
| `research/data-enemies.md` | 적/엘리트/보스/최종보스 | 공식 메타데이터 수집 / secondary boss-context mapping / generated Trickster crawl / 영상 부분 검증 / 구현 차이 매핑 완료 |
| `research/data-events.md` | 이벤트/상호작용/선택지 | 영상 부분 검증 / event taxonomy reconciliation / 구현 차이 매핑 완료 |
| `research/data-achievements.md` | Steam 공식 업적/해금 161개와 도메인 매핑 | 공식 메타데이터 수집 / 도메인 매핑 완료 |
| `research/achievement-gap-map.md` | Steam 업적 161개별 현재 구현 대응/부재 표 | 구현 차이 매핑 완료 / 원작 대응 구현 0 |
| `research/card-gap-map.md` | 카드/진화 52개 후보별 현재 구현 대응/부재 표 | 구현 차이 매핑 완료 / 원작 대응 구현 0 |
| `research/card-secondary-catalog.md` | 35 catalog-only card rows and 87 non-character source-level boundary | secondary catalog mapping / 원작 대응 구현 0 |
| `research/card-dexerto-page-crawl.md` | 87 Dexerto non-character individual card-page rows | individual page crawl complete / E1 source-level / 원작 대응 구현 0 |
| `research/card-taxonomy-reconciliation.md` | 52 unlock/evolution rows, 87 Dexerto non-character rows, 90 official-wiki non-character rows, 113 official-wiki total rows, and official 65+ shorthand | source-level reconciliation complete / direct UI proof still required / 원작 대응 구현 0 |
| `research/gem-dexerto-unlock-crawl.md` | 49 Dexerto gem unlock-table rows plus no-individual-gem-page boundary | unlock table crawl complete / E1 source-level / 원작 대응 구현 0 |
| `research/gem-taxonomy-reconciliation.md` | 49 public gem rows vs 58 official-wiki gem rows reconciliation, including 47 direct matches, 2 public cost buckets, 7 Gem-Hammer/default-style rows, and 4 cost-modifier variant rows | source-level reconciliation complete / 원작 대응 구현 0 |
| `research/gem-gap-map.md` | 젬 49개별 현재 구현 대응/부재 표 | 구현 차이 매핑 완료 / 원작 대응 구현 0 |
| `research/stage-dexerto-unlock-crawl.md` | 13 Dexerto stage unlock-table rows plus no-individual-stage-page boundary | unlock table crawl complete / E1 source-level / 원작 대응 구현 0 |
| `research/stage-gap-map.md` | 스테이지 15개 후보별 현재 구현 대응/부재 표 | 구현 차이 매핑 완료 / 원작 대응 구현 0 |
| `research/character-gap-map.md` | 캐릭터/크롤러 22개 후보별 현재 구현 대응/부재 표 | 구현 차이 매핑 완료 / 원작 대응 구현 0 |
| `research/character-dexerto-page-crawl.md` | 22 Dexerto character individual page rows | individual page crawl complete / E1 source-level / 원작 대응 구현 0 |
| `research/character-taxonomy-reconciliation.md` | 20 public unlock rows, 21 secondary playable-roster claims, 22 Dexerto page rows, 23 official-wiki rows, and official 20+ shorthand | source-level reconciliation complete / direct UI proof still required / 원작 대응 구현 0 |
| `research/official-wiki-character-field-crawl.md` | 23 official-wiki character field rows, 22 starter-deck templates, `unlockcost` candidates, Divano/MissingN0 notes, and O'Sole count conflict | official wiki character field crawl complete / E5 source-level / 원작 대응 구현 0 |
| `research/official-wiki-character-value-extract.md` | Official wiki character value extract for 23 character rows, 22 starter-deck card/count rows, 22 lead-crawler base-stat rows, trigger buckets, and 10 numeric / 11 blank / 2 non-numeric `unlockcost` fields | official wiki value extract complete / E5 source-level / 원작 대응 구현 0 |
| `research/arcana-dexerto-unlock-crawl.md` | 10 Dexerto arcana unlock-table rows plus no-individual-arcana-page boundary | unlock table crawl complete / E1 source-level / 원작 대응 구현 0 |
| `research/relic-gamespot-page-crawl.md` | 15 GameSpot relic rows plus toggle context, Rilevatore location boundary, and blank Ultimate Ultra Overkill unlock-stage boundary | page crawl complete / E1 source-level / 원작 대응 구현 0 |
| `research/relic-gap-map.md` | 유물/파워업 15개 후보별 현재 구현 대응/부재 표 | 구현 차이 매핑 완료 / 원작 대응 구현 0 |
| `research/arcana-gap-map.md` | 아르카나 10개 공식 행과 2개 automatic/default secondary rows별 현재 구현 대응/부재 표 | 구현 차이 매핑 완료 / 원작 대응 구현 0 |
| `research/powerup-destructoid-tier-crawl.md` | 13 rankable Power-Up rows plus 6 run-found/not-yet-rankable rows from Destructoid | page crawl complete / E1 source-level / 원작 대응 구현 0 |
| `research/powerup-taxonomy-reconciliation.md` | 13 Destructoid rankable rows plus 6 run-found rows reconciled against 19 official-wiki Power-Up rows and selected PC Gamer hints | source-level reconciliation complete / direct UI proof still required / 원작 대응 구현 0 |
| `research/pcgamer-upgrade-priority-crawl.md` | PC Gamer selected Crawler, Power-Up, Arcana, relic, and village-feature hints with cost/stat/refund boundaries | page crawl complete / E1 source-level / 원작 대응 구현 0 |
| `research/pgg-beginner-systems-crawl.md` | PGG beginner system, evolution, Guiding Light, village-priority, and demo-carryover source-level rows | page crawl complete / E1 source-level / 원작 대응 구현 0 |
| `research/official-release-faq-crawl.md` | poncle official release FAQ rows, demo carryover, no-launch-cross-save, content-count shorthand, and biome/dungeon/floor structure boundary | page crawl complete / E5 developer-social statement / 원작 대응 구현 0 |
| `research/official-steam-news-crawl.md` | Steam official Community Announcements through 2026-04-29, `Hotfix 1.4.1`, platform/demo/save/cross-save baseline, and high-level TurboTurn/Combo/Wild/character/gem/village claims | official Steam news crawl complete / E5 announcement metadata / 원작 대응 구현 0 |
| `research/steamdb-build-baseline-crawl.md` | SteamDB public branch build `23012943`, depot IDs/sizes, build/update timestamps, launch build `22813976`, Steam Deck tested build `22813976`, and `Hotfix 1.4.1` mapping limits | SteamDB metadata crawl complete / E2 metadata / 원작 대응 구현 0 |
| `research/steam-store-movie-frame-crawl.md` | Steam Store movie/frame snapshot for the four official Store HLS movies and three Store-page inline MP4 extras, including Arcana/Fortune Teller-like, Mana offering table, Gorton Bell exterior, combat/card/evolved-card, modifier, boss/elite, and rejected/marketing-only frame observations | official Store movie media crawl complete / E5 visible-media candidates / 원작 대응 구현 0 |
| `research/steam-store-appdetails-crawl.md` | Steam Store API/appdetails and official media snapshot for main app `3265700`, demo app `4329470`, Store categories, supported languages, achievements, screenshots, movies, and screenshot UI/card/gem candidates | official Store metadata/media crawl complete / E5 Store metadata and visible-media candidates / 원작 대응 구현 0 |
| `research/official-wiki-api-crawl.md` | Crawlers official wiki/API row boundaries: 113 card infobox rows, 58 gem rows, 12 arcana rows, 23 character rows, 16 relic rows, 9 dungeon pages / 16 named variants, gem rarity weights, and Evolution gem behavior | official wiki API crawl complete / E5 source-level / 원작 대응 구현 0 |
| `research/official-wiki-card-gem-field-crawl.md` | Official wiki card/gem field coverage, missing cost/socket queues, 19 `evointo` rows, 58 gem field rows, rarity lists, and duplicate cost-gem display names | official wiki field crawl complete / E5 source-level / 원작 대응 구현 0 |
| `research/official-wiki-card-gem-value-extract.md` | Official wiki card/gem value extract for 113 card rows and 58 gem rows, preserving structural cost/socket/evolution/rarity/unlock/keyword buckets without full effect prose | official wiki value extract complete / E5 source-level / 원작 대응 구현 0 |
| `research/official-wiki-arcana-relic-dungeon-field-crawl.md` | Official wiki arcana/relic/dungeon field coverage: 12 arcana unlock/text fields, 16 relic field rows, relic blank queues, and 9 dungeon order/floor/difficulty rows | official wiki field crawl complete / E5 source-level / 원작 대응 구현 0 |
| `research/official-wiki-arcana-relic-dungeon-value-extract.md` | Official wiki arcana/relic/dungeon value extract for 12 arcana rows, 16 relic rows, and 16 expanded dungeon/stage variant rows, preserving structural unlock/found-in/order/floor/difficulty/keyword values without full effect prose | official wiki value extract complete / E5 source-level / 원작 대응 구현 0 |
| `research/official-wiki-enemy-event-powerup-field-crawl.md` | Official wiki enemy/event/Power-Up field coverage: enemy field rows, Trickster row, 10 dungeon-event pages, 19 Power-Up rows | official wiki field crawl complete / E5 source-level / 원작 대응 구현 0 |
| `research/official-wiki-enemy-event-powerup-value-extract.md` | Official wiki enemy/event/Power-Up value extract for 126 enemy infobox pages expanded into 132 enemy value rows, 10 dungeon-event category rows, and 19 Power-Up id/cost/rank/bonus/unlock rows | official wiki value extract complete / E5 source-level / 원작 대응 구현 0 |
| `research/town-gap-map.md` | 마을/메타 8개 행별 현재 구현 대응/부재 표 | 구현 차이 매핑 완료 / 원작 대응 구현 0 |
| `research/event-gap-map.md` | 이벤트 후보 10개와 EVT-TBD별 현재 구현 대응/부재 표 | 구현 차이 매핑 완료 / 원작 대응 구현 0 |
| `research/event-taxonomy-reconciliation.md` | 이벤트 공식 위키 page layer, Store media, storyboard 후보, prototype layer 분리 | source-level reconciliation complete / direct UI-game-file proof still required / 원작 대응 구현 0 |
| `research/enemy-trickster-secondary-crawl.md` | PGG/GamerBlurb/Nintendo Wire enemy and Trickster trigger/stat/reward source-level rows | page crawl complete / E1 source-level / 원작 대응 구현 0 |
| `research/enemy-gap-map.md` | enemy/boss named rows, video visual groups, and final-boss hypothesis별 현재 구현 대응/부재 표 | 구현 차이 매핑 완료 / 원작 대응 구현 0 |
| `research/ui-screens.md` | UI 화면/캡처/전환 | 영상 부분 검증 |
| `research/systems-rules.md` | 규칙/예외/실패 케이스 | 영상 부분 검증 |
| `research/flow-videos.md` | 모든 영상 타임스탬프 로그 | 영상 로그 시작 |
| `research/balance-notes.md` | 런별 수치/리듬/압박 | 미시작 |
| `research/source-conflicts.md` | 출처 충돌과 판정 | 1차 수집 |
| `research/source-index.md` | 모든 출처, 신뢰도, 사용 범위 | 1차 수집 |
| `research/gap-map.md` | 원작 vs 현재 구현 1:1 차이 | 조사중 / 영상 부분 검증 / 핵심 행 단위 gap-map 갱신 |
| `research/direct-play-verification.md` | 직접 플레이/E4 검증 작업표와 현재 설치 차단 사유 | Blocked: app `3265700` not installed locally |

## 9. 구현 착수 게이트

아래가 전부 `예`가 되기 전에는 시스템/콘텐츠 구현을 시작하지 않는다.

| 게이트 | 예/아니오 | 메모 |
| --- | --- | --- |
| 조사 기준 버전이 고정되었는가 | 아니오 | 공식/SteamDB 메타데이터는 기록했지만 로컬 설치 빌드 직접검증이 아직 없음 |
| 전수조사 표 범위를 사용자가 승인했는가 | 아니오 |  |
| 정적 데이터 표가 최소 E2 이상으로 채워졌는가 | 아니오 |  |
| 실제 플레이 흐름이 E3 이상으로 검증되었는가 | 아니오 |  |
| 출처 충돌표가 작성되었는가 | 아니오 |  |
| 현재 구현 차이표가 작성되었는가 | 아니오 | `gap-map.md`, `achievement-gap-map.md`, `card-gap-map.md`, `card-secondary-catalog.md`, `card-dexerto-page-crawl.md`, `gem-dexerto-unlock-crawl.md`, `gem-taxonomy-reconciliation.md`, `gem-gap-map.md`, `stage-dexerto-unlock-crawl.md`, `stage-gap-map.md`, `character-gap-map.md`, `character-dexerto-page-crawl.md`, `official-wiki-character-field-crawl.md`, `official-wiki-character-value-extract.md`, `arcana-dexerto-unlock-crawl.md`, `relic-gamespot-page-crawl.md`, `relic-gap-map.md`, `arcana-gap-map.md`, `powerup-destructoid-tier-crawl.md`, `pcgamer-upgrade-priority-crawl.md`, `pgg-beginner-systems-crawl.md`, `official-release-faq-crawl.md`, `official-steam-news-crawl.md`, `steamdb-build-baseline-crawl.md`, `steam-store-appdetails-crawl.md`, `steam-store-movie-frame-crawl.md`, `official-wiki-api-crawl.md`, `official-wiki-card-gem-field-crawl.md`, `official-wiki-card-gem-value-extract.md`, `official-wiki-arcana-relic-dungeon-field-crawl.md`, `official-wiki-arcana-relic-dungeon-value-extract.md`, `official-wiki-enemy-event-powerup-field-crawl.md`, `official-wiki-enemy-event-powerup-value-extract.md`, `town-gap-map.md`, `event-gap-map.md`, `enemy-trickster-secondary-crawl.md`, `enemy-gap-map.md`가 있으나 direct-play/E4 proof, exact runtime values, source-conflict resolution, and user baseline approval are still missing |
| 구현 우선순위가 승인되었는가 | 아니오 |  |
