# Town / Meta Progression Data

Status: `영상 부분 검증`

Town data is mostly inferred from guide descriptions and must not be treated as final until the village UI is captured directly.

Current implementation gap map: [`town-gap-map.md`](./town-gap-map.md).
Generated town taxonomy reconciliation: [`town-taxonomy-reconciliation.md`](./town-taxonomy-reconciliation.md).
Generated Power-Up taxonomy crawl: [`powerup-destructoid-tier-crawl.md`](./powerup-destructoid-tier-crawl.md).
Generated Power-Up taxonomy reconciliation: [`powerup-taxonomy-reconciliation.md`](./powerup-taxonomy-reconciliation.md).
Generated arcana taxonomy reconciliation: [`arcana-taxonomy-reconciliation.md`](./arcana-taxonomy-reconciliation.md).
Generated relic taxonomy reconciliation: [`relic-taxonomy-reconciliation.md`](./relic-taxonomy-reconciliation.md).
Generated PC Gamer upgrade-priority crawl: [`pcgamer-upgrade-priority-crawl.md`](./pcgamer-upgrade-priority-crawl.md).
Generated official wiki arcana/relic/dungeon value extract: [`official-wiki-arcana-relic-dungeon-value-extract.md`](./official-wiki-arcana-relic-dungeon-value-extract.md).
Generated PGG beginner systems crawl: [`pgg-beginner-systems-crawl.md`](./pgg-beginner-systems-crawl.md).
Generated official release FAQ crawl: [`official-release-faq-crawl.md`](./official-release-faq-crawl.md).
Generated official Steam news crawl: [`official-steam-news-crawl.md`](./official-steam-news-crawl.md).
Generated Steam Store appdetails/media crawl: [`steam-store-appdetails-crawl.md`](./steam-store-appdetails-crawl.md).
Generated Steam Store movie frame crawl: [`steam-store-movie-frame-crawl.md`](./steam-store-movie-frame-crawl.md).
Generated official wiki API crawl: [`official-wiki-api-crawl.md`](./official-wiki-api-crawl.md).
Generated official wiki character field crawl: [`official-wiki-character-field-crawl.md`](./official-wiki-character-field-crawl.md).
Generated official wiki character value extract: [`official-wiki-character-value-extract.md`](./official-wiki-character-value-extract.md).
Generated official wiki enemy/event/power-up field crawl: [`official-wiki-enemy-event-powerup-field-crawl.md`](./official-wiki-enemy-event-powerup-field-crawl.md).
Generated official wiki enemy/event/Power-Up value extract: [`official-wiki-enemy-event-powerup-value-extract.md`](./official-wiki-enemy-event-powerup-value-extract.md).

## Source Basis

| Source ID | Source | Used For | Current Grade |
| --- | --- | --- | --- |
| SRC-108-C | GAMES.GG character guide | Gorton Bell Inn purchase flow, party expansion, coffin route context | E1 |
| SRC-118 | Pro Game Guides tier list | 21-Crawler roster and Crawler-card passive context | E1 |
| SRC-119 | VGC all Crawlers unlock guide | Tavern purchase flow and default/available Crawler states | E1 |
| SRC-120 | Destructoid power-ups tier list | Crawler Slot power-up and Luck/power-up context | E1 |
| SRC-135 | Destructoid Power-Up tier crawl | Generated 13 rankable rows and 6 run-found/not-yet-rankable rows for Power-Up Shop planning; reconciled against official-wiki rows in `powerup-taxonomy-reconciliation.md` | E1 |
| SRC-136 | PC Gamer upgrade priority crawl | Generated selected Crawler, Power-Up, Arcana, relic, and village-feature hints for direct-capture planning | E1 |
| SRC-140 | PGG beginner systems crawl | Generated Greed/Might/Blacksmith priority hints and automatic demo-to-full progress carryover claim | E1 |
| SRC-141 | Poncle official release FAQ crawl | Official-account release FAQ: Steam/Xbox demo save carryover, no cross-save at launch, launch/mobile platform context, controller support | E5 developer statement via social FAQ |
| SRC-004 | Steam Store API appdetails / media crawl | Official Store metadata for main app, demo app `4329470`, Steam Cloud, Family Sharing, full controller support, and Store screenshot UI candidates | E5 official Store metadata/media |
| SRC-145 | Steam Store movie / frame crawl | Official Store movie frame SM-257323582 `00:25` captures the exterior sign `THE GORTON BELL`; other movie frames add first-person town/room media candidates | E5 official Store media for visible UI candidates only |
| SRC-143 | Steam official news crawl | Official Steam announcements: launch platforms/prices, controller support, no launch cross-save, demo carryover, save slots, `Hotfix 1.4.1` save fixes, tutorial demo-save deletion during upgrade, and future QOL roadmap notes | E5 official announcement / patch-note metadata |
| SRC-121 | VGC best builds guide | Three-Crawler party examples and Blacksmith extra-gem-slot context | E1 |
| SRC-108-R | GAMES.GG relic guide | Museum toggles, Gem Hammer socket access, Stardust Anvil/Blacksmith extra slots, Fortune Teller, Arcana Finder, relic behavior | E1 |
| SRC-122 | SportsRant gem guide | Gem card-attachment context and broad gem effect families | E1 |
| SRC-123 | GAMES.GG Jeweler guide | Lapidary Loupe/Jeweler unlock, Blacksmith access, gem rarity adjustment, sealing, Luck interaction | E1 |
| SRC-202 | PC Gamer upgrade guide | Early upgrade priorities, selected Power-Up costs/stat hints, Fortune Teller unlock hint, and Stardust Anvil/Blacksmith context | E1 |
| SRC-301/SRC-304 | Reddit community notes | Jeweller/sealing/power-up edge cases | E0-E1 |
| SRC-006 | Steam Community achievements page | Official public metadata for `The Inn`, `Power Ups Shop`, and `Relic Museum` unlock achievements | E5 metadata |
| SRC-142 | Official wiki API and field crawls | Lead/non-lead Crawler party rules, Gorton Bell Inn Disco-mode hint, character `unlockcost` candidates, Divano/MissingN0 character status notes, Blacksmith/Jeweller/Fortune Teller source-level unlock links, official-wiki relic/town rows, 19 Power-Up infobox rows, costs, rank caps, unlock fields, and Mana/Cooldown label conflict | E5 official wiki / not direct play |
| SRC-149 | Official wiki character value extract | Inn and character planning values: 23 character rows, 22 starter deck card/count rows, 22 lead-crawler base-stat rows, 10 numeric / 11 blank / 2 non-numeric `unlockcost` fields, trigger buckets, and Gorton Bell Inn rule flags | E5 official wiki structured values / not direct play |
| SRC-147 | Official wiki arcana/relic/dungeon value extract | Fortune Teller/Museum/stage-select planning values: 12 arcana unlock rows, 16 relic id/found-in rows including `Deck Box`, blank relic field queues, and dungeon variant order/floor/difficulty rows; reconciled in `arcana-taxonomy-reconciliation.md` and `relic-taxonomy-reconciliation.md` | E5 official wiki structured values / not direct play |
| SRC-148 | Official wiki enemy/event/Power-Up value extract | Power-Up Shop planning values: 19 Power-Up id/cost/rank/bonus/unlock rows, cost distribution, `Skip` blank unlock field, and `Mana` page / `Cooldown` infobox name mismatch; reconciled against secondary rankable/run-found rows in `powerup-taxonomy-reconciliation.md` | E5 official wiki structured values / not direct play |

## Town Systems

## Official Wiki Town / Party Snapshot

`research/official-wiki-api-crawl.md` adds source-level town rules that should drive the next direct-capture pass: the lead crawler contributes stats/power-ups and four starter cards, later recruited crawlers add only one attack/spell card and no extra power-ups, and the Gorton Bell Inn can enter a Disco mode after five crawler purchases with a discount while active. `research/official-wiki-character-value-extract.md` adds source-level character `unlockcost` values, starter deck card/count rows, lead-crawler base-stat fields, trigger buckets, and Divano/MissingN0/Imelda/O'Sole rows for direct Inn/Town Hall proof. The same crawl family links Polentir to the Fortune Teller, Stardust Anvil to the Blacksmith, and Lapidary Loupe to the Jeweller. `research/official-wiki-arcana-relic-dungeon-value-extract.md` narrows the Fortune Teller/Museum/stage-select capture queues with 12 arcana rows, 16 relic rows, and 16 dungeon/stage variant rows. `research/arcana-taxonomy-reconciliation.md` narrows Fortune Teller planning to 10 public rows mapped against 12 official-wiki rows, two Polentir rows outside the public table, and unresolved Wild Buff / And Another / Over The Top conflicts. `research/relic-taxonomy-reconciliation.md` narrows Museum capture planning to 15 guide rows mapped against 16 official-wiki rows, `Deck Box` as the wiki-only extra row, and unresolved Rilevatore, Ultimate Ultra Overkill, Guiding Light, and Polentir route conflicts. These still do not prove building UI or persistence.

These are still source-level rules. Exact Inn prices, party-slot behavior, default/paid states, `unlockcost` blank/non-numeric rows, Disco trigger persistence, Blacksmith/Jeweller menus, Fortune Teller selection UI, and save behavior still need high-resolution/direct proof.

Official Store movie note: `research/steam-store-movie-frame-crawl.md` adds official-media support for the Inn exterior. SM-257323582 `00:25` clearly shows a village building sign `THE GORTON BELL`, matching the Gorton Bell Inn naming used by secondary sources and the current town row. It is only exterior/name proof; recruitment, roster, costs, purchase state, and persistence remain unresolved.

## Official Wiki Power-Up Snapshot

`research/official-wiki-enemy-event-powerup-field-crawl.md` adds a source-level 19-row Power-Up infobox table after excluding the `Crawlers:Power Ups` index page, and `research/official-wiki-enemy-event-powerup-value-extract.md` preserves the row-level id/cost/rank/bonus/unlock values. All 19 rows expose `cost`, `max level`, `bonus`, and `max effect`; 18 rows expose an `unlocked by` value, while `Skip` is blank in the current crawl.

| Row | Max Level | Bonus | Max Effect | Cost | Unlock Field |
| --- | ---: | --- | --- | ---: | --- |
| Amount | 3 | +1 | +3 | 1250 | Complete Meany Bridge |
| Area | 5 | +10% | +50% | 850 | Access Power Ups Shop |
| Armor | 3 | +2 | +6 | 1250 | Access Power Ups Shop |
| Banish | 5 | +2 | +10 | 300 | Complete Weeny Bridge |
| Crawler Slot | 2 | +1 | +2 | 3500 | Complete Meany Bridge |
| Curse | 5 | +20% | +100% | 350 | Complete Weeny Bridge |
| Duration | 5 | +1 | +5 | 250 | Access Power Ups Shop |
| Greed | 4 | +25% | +100% | 1000 | Complete Inlaid Library |
| Growth | 5 | +20% | +100% | 750 | Access Power Ups Shop |
| Hand | 2 | +1 | +2 | 2500 | Complete Weeny Bridge |
| Luck | 3 | +25% | +75% | 400 | Access Power Ups Shop |
| Magnet | 1 | +1 | +1 | 2000 | Complete Weeny Bridge |
| Mana page / Cooldown infobox | 2 | +1 | +2 | 3500 | Complete Meany Bridge |
| Max Health | 5 | +10% | +50% | 450 | Access Power Ups Shop |
| Might | 5 | +25% | +125% | 500 | Access Power Ups Shop |
| Recovery | 3 | +1 | +3 | 500 | Access Power Ups Shop |
| Reroll | 5 | +2 | +10 | 200 | Access Power Ups Shop |
| Revival | 1 | +1 | +1 | 4000 | Complete Weeny Bridge |
| Skip | 5 | +2 | +10 | 250 | blank |

The `Crawlers:Mana` page exposing `Infobox Name = Cooldown` and the Reroll cost difference against the PC Gamer crawl remain source conflicts until the Power-Up Shop UI or game files confirm current labels and costs.

`research/powerup-taxonomy-reconciliation.md` narrows the 13-vs-6-vs-19 split without closing it: all 19 Destructoid rows have official-wiki page/name matches, while the classification conflict remains because Destructoid separates 13 rankable rows from 6 run-found/not-yet-rankable rows and the official wiki assigns cost/max-level fields to all 19. It also preserves the official-wiki unlock buckets: 9 rows unlocked by accessing the Power Ups shop, 5 by completing Weeny Bridge, 3 by completing Meany Bridge, 1 by completing Inlaid Library, and `Skip` with a blank unlock field.

`research/town-taxonomy-reconciliation.md` is the working source-layer reconciliation for the town surface. It separates the 8 collected town/meta rows, 3 Steam achievement-backed town rows, Store Gorton Bell exterior proof, Inn values, Power-Up values, Blacksmith/Jeweller/Fortune Teller/Museum dependencies, Town Hall checklist mapping, and save/platform rows into distinct capture queues. It does not close exact building UI, cost/rank, purchase/toggle, save, or persistence parity.

## Secondary Power-Up Shop Map

This is a secondary-source taxonomy only. It should drive direct-capture planning, not implementation, because exact shop rows, rank caps, cost curve, unlock order, refund behavior, and persistence still need UI proof.

| Group | Source-level rows or hints | Evidence | Missing before implementation |
| --- | --- | --- | --- |
| Rankable high-priority upgrades | Crawler Slot, Luck, Recovery; PGG beginner adds Greed and Might as early priorities | SRC-120, SRC-135, SRC-136, SRC-140, SRC-202 | Exact unlock conditions, ranks, full cost curve, stat values per rank, and party-slot persistence |
| Rankable stat/economy/reward upgrades | Armor, Greed, Might, Growth, Amount, Reroll, Area, Duration, Skip, Max Health; PGG beginner gives Greed as 25% per rank and Blacksmith as an early card-slot priority | SRC-120, SRC-135, SRC-136, SRC-140, SRC-202 | Whether every row appears in the permanent shop, exact rank caps, scaling, and UI wording |
| Run-found or not-yet-rankable candidates | Banish, Curse, Hand, Magnet, Mana, Revival | SRC-120, SRC-135 | Whether these are permanent shop rows, run rewards, relic/card effects, or another upgrade class |
| Early cost hints | Recovery first rank 500 coins in PC Gamer and official wiki; Reroll first rank is 250 coins in PC Gamer but 200 in the official wiki value extract; Might/Luck first ranks have conflicting 20% vs 25% source-level hints; refund-button claim without rules; `powerup-taxonomy-reconciliation.md` keeps these as direct-capture targets | SRC-136, SRC-142, SRC-148, SRC-202 | Full cost/rank table, refund/respec UI rules, and whether later patches changed values |

| ID | Building / System | Unlock Condition | Function | Cost Curve | Upgrade Options | Run Impact | UI Evidence | Direct/Video Evidence | Current Implementation | Gap | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TOWN-001 | Gorton Bell Inn / The Inn | Steam achievement `The Inn` says `Crawler Selection Unlocked`; GAMES.GG/VGC say unlocked Crawlers are purchased there after meeting conditions; official wiki character value extract gives source-level `unlockcost` candidates, starter decks, lead-crawler stat rows, trigger buckets, and Disco-mode rules; Store movie frame confirms exterior sign `THE GORTON BELL` | Recruit unlocked Crawlers after paying gold | unknown final; GAMES.GG gives isolated source-level costs for Imelda, Christine, Krochi, and Gallo, while official wiki gives candidates such as Arca 500, Cavallo 750, Concetta 1840, Gallo 5200, Gennaro 600, Imelda 10, MissingN0 6666, Pasqualina 1100, Poe 500, plus non-numeric Christine/Clerici and blank-cost rows | roster purchase; up to three-Crawler party with Power-Up expansion | Controls playable characters/party and Crawler-card passives | VID-009 `00:20`; VID-011 `01:40`; VID-012 `24:50` character/party setup-like screens; SRC-145 SM-257323582 `00:25` exterior sign | VID-009/VID-011/VID-012 storyboard frames only for interior/setup; Store movie exterior name proof only | current project has no equivalent Inn | Full roster purchase flow, default/paid states, exact costs, Divano/MissingN0 availability, O'Sole count, and persistence missing | Partial E3 / E5 metadata / official Store media exterior / secondary roster mapping / official wiki character value extract |
| TOWN-002 | Power-Up Shop | Steam achievement `Power Ups Shop` says `Collect 250 coins`; official wiki field/value crawls expose 19 Power-Up infobox rows with costs/rank caps/unlock fields, but permanent-shop UI still needs proof; `powerup-taxonomy-reconciliation.md` maps all 19 Destructoid rows to official-wiki rows while preserving the 13 rankable vs 6 run-found classification conflict | Permanent upgrades; party expansion mentioned by guide and Crawler Slot source | official wiki source-level table covers 19 rows and costs; PC Gamer conflicts on Reroll 250 vs wiki 200 and Might/Luck 20% vs wiki 25%; refund-button claim per SRC-136/SRC-202 | Official wiki rows: Amount, Area, Armor, Banish, Crawler Slot, Curse, Duration, Greed, Growth, Hand, Luck, Magnet, Mana/Cooldown, Max Health, Might, Recovery, Reroll, Revival, Skip; Destructoid still splits 13 rankable from 6 run-found/not-yet-rankable; reconciliation splits official-wiki unlock buckets into 9 initial-shop, 5 Weeny Bridge, 3 Meany Bridge, 1 Inlaid Library, and 1 blank `Skip` row | Alters run setup, rewards, party size, and unlock conditions | VID-009 `00:00`, `00:10`; VID-010 `68:20`; VID-012 `24:20`, `24:30` shop/power-up-style setup screens | VID-009/VID-010/VID-012 storyboard frames only; exact building/labels/costs unresolved | shallow meta loop only | Full upgrade list/costs/ranks, unlock order, refund/respec rules, run-found vs rankable split, Mana/Cooldown label, Reroll cost, and Crawler Slot rank behavior missing | Partial E3 / E5 metadata / official wiki Power-Up field/value crawl / generated Power-Up taxonomy crawl / Power-Up taxonomy reconciliation / PC Gamer upgrade crawl |
| TOWN-003 | Blacksmith's Workshop | Gem Hammer unlocks gem socket access; Stardust Anvil opens Blacksmith extra-slot purchases according to secondary guides; PC Gamer crawl places Stardust Anvil as a Teeny Bridge reward and Blacksmith unlock; PGG beginner systems crawl recommends Blacksmith for more card gem slots | Purchase/add card gem slots; possibly houses Jeweler entry after Lapidary Loupe | 미확정 | slot upgrades and card slot purchases | Enables deeper gem/evolution builds and socket-heavy decks | SRC-108-R/SRC-121/SRC-123/SRC-136/SRC-140 only | 미검증 | no mature equivalent | Exact building UI, costs, slot limits, valid targets, and persistence missing | secondary Blacksmith slot context / PC Gamer + PGG crawl / needs UI |
| TOWN-004 | Jeweller / Jeweler | Lapidary Loupe in Gallo Tower according to GAMES.GG; guide says Jeweler is accessed through the Blacksmith | View/curate gems, adjust rarity, and seal Ultra Rare gems | sealing cost hint 5,665 coins plus rarity-upgrade costs per SRC-123; full cost table missing | rarity increase/decrease, seal/unseal to verify | Alters reward pool and interacts with Luck-based rarity offers | SRC-123/SRC-122/SRC-303/SRC-304 only | 미검증 | no equivalent | Exact Jeweler UI, rarity tiers, costs, pool math, seal persistence, and refund behavior missing | secondary Jeweler rarity/sealing context / needs UI |
| TOWN-005 | Fortune Teller / Arcana Tent | Polentir relic according to guide; PC Gamer crawl places Polentir in Furious Forest after clearing Mad Forest and says it unlocks Fortune Teller / Arcana; official-wiki value extract says `Fortune Forest`, preserved as `CON-043`; `arcana-taxonomy-reconciliation.md` maps 10 public arcana rows to 12 wiki rows and keeps `Experimental Medicine` / `Shield Bash` as Polentir rows | Arcana access/selection | 미확정 | arcana unlock/selection | Start-build modifier | SRC-136 plus secondary guides only | 미검증 | no mature system | Arcana UI, Polentir panel, unlock route text, unlock flow, row count, default state, and persistence missing | PC Gamer upgrade crawl / arcana taxonomy reconciliation / relic taxonomy reconciliation / 1차 수집 |
| TOWN-006 | Relic Museum / Museum | Steam achievement `Relic Museum` says `Play two dungeons`; guide says relics can be toggled there; `relic-taxonomy-reconciliation.md` preserves the 15 guide rows vs 16 official-wiki rows boundary and `Deck Box` status question | View/toggle relics | no cost known | relic toggles | Can disable run modifiers | 미검증 | 미검증 | no equivalent | Relic persistence/toggle missing, including full row count, `Deck Box`, disabled behavior, and save persistence | E5 metadata / relic taxonomy reconciliation / needs UI |
| TOWN-007 | Town Hall Unlocks / Checklist | guide pages are categorized as Town Hall unlocks | Track unlock tasks | 미확정 | unlock list filters/hide-complete to verify | Guides progression goals | VID-013 `00:00` shows top-level `Unlocks` tab / `Town Hall` building card | VID-013 storyboard frame only; the actual checklist interior is not opened | no equivalent | Full UI, counters, filters, and completed-state behavior missing | Partial E3 |
| TOWN-008 | Demo/save carryover | official/platform context says demo exists; Steam Store appdetails exposes demo app `4329470` as a free Windows-only demo row; PGG beginner systems crawl claims demo progress automatically carries over to the full version; official release FAQ crawl says Steam/Xbox demo save data carries over and cross-save is not available at launch; official Steam news crawl adds save slots, full-version fresh-start option, `Hotfix 1.4.1` save-integrity fixes, and tutorial demo-save deletion during upgrade | Save handoff from demo to full; cross-platform save boundary | 미확정 | 미확정 | Affects baseline if testing demo or comparing Steam/Xbox/mobile; Store categories also expose Steam Cloud on the main app | 미검증 | 미검증 | no equivalent | Version/platform baseline, save-file location, transfer trigger, tutorial demo-save deletion exception, achievement grant, Steam Cloud behavior, cross-save/cloud behavior, and actual transfer behavior missing | official Store appdetails + official FAQ + official Steam news + secondary PGG carryover claim / direct or high-resolution platform audit required |

## Required Completion

- Capture every village building and locked/unlocked state from a fresh save and a progressed save.
- Record costs, upgrade ranks, unlock order, and persistence across runs.
- Verify Blacksmith, Jeweller, Fortune Teller, Museum, Inn, Power-Up Shop, unlock checklist behavior, demo/full save carryover, and no-launch-cross-save boundary from UI/video/direct play or official platform docs.
- Use `research/town-taxonomy-reconciliation.md` before implementation to keep building rows, official metadata, official media, structural values, unlock dependencies, and save/platform layers separate.
