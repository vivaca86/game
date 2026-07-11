# Town / Meta Progression Taxonomy Reconciliation

Status: `generated 2026-05-22 / source-level town and building taxonomy reconciliation`

This artifact reconciles the collected town/meta rows, official Steam achievement metadata, official Store media, official wiki structural value extracts, Power-Up taxonomy, character/Inn values, relic/arcana building dependencies, and save/platform evidence. It does not prove the shipped village UI, building labels, exact costs, locked states, purchase flows, save migration, or persistence. Treat it as a capture queue for fresh-save village UI, progressed village UI, high-resolution video, game files, and platform save proof.

Primary inputs:

- `research/data-town.md`
- `research/town-gap-map.md`
- `research/data-achievements.md`
- `research/achievement-gap-map.md`
- `research/character-taxonomy-reconciliation.md`
- `research/official-wiki-character-value-extract.md`
- `research/powerup-taxonomy-reconciliation.md`
- `research/official-wiki-enemy-event-powerup-value-extract.md`
- `research/arcana-taxonomy-reconciliation.md`
- `research/relic-taxonomy-reconciliation.md`
- `research/official-wiki-arcana-relic-dungeon-value-extract.md`
- `research/gem-taxonomy-reconciliation.md`
- `research/pcgamer-upgrade-priority-crawl.md`
- `research/pgg-beginner-systems-crawl.md`
- `research/steam-store-appdetails-crawl.md`
- `research/steam-store-movie-frame-crawl.md`
- `research/official-release-faq-crawl.md`
- `research/official-steam-news-crawl.md`
- `research/steamdb-build-baseline-crawl.md`
- `research/source-conflicts.md` CON-006, CON-026, CON-027, CON-038, CON-039, CON-040, and CON-043
- Sources: SRC-004, SRC-006, SRC-108-C, SRC-108-R, SRC-119, SRC-120, SRC-121, SRC-122, SRC-123, SRC-135, SRC-136, SRC-140, SRC-141, SRC-142, SRC-143, SRC-145, SRC-147, SRC-148, SRC-149, SRC-202, SRC-301, and SRC-304

## Reconciliation Snapshot

| Segment | Rows / Count | Notes |
| --- | ---: | --- |
| Collected town/meta rows | 8 | Inn, Power-Up Shop, Blacksmith, Jeweller, Fortune Teller, Museum, Town Hall, and demo/save carryover |
| Steam achievement-backed town/meta unlock rows | 3 | `The Inn`, `Power Ups Shop`, and `Relic Museum` are public metadata rows only |
| Official Store village exterior name proof | 1 | Store movie frame SM-257323582 `00:25` shows `THE GORTON BELL` |
| Official-wiki character rows feeding Inn | 23 | Source-level character/card rows only; see character taxonomy for 20/21/22/23 split |
| Official-wiki starter-deck rows feeding Inn | 22 | Divano remains outside starter-deck proof |
| Official-wiki numeric / blank / non-numeric Inn `unlockcost` fields | 10 / 11 / 2 | Purchase-cost candidates only, not shipped Inn UI |
| Official-wiki party rule flags | 4 | Purchase/equip, lead deck/stat rule, follower deck rule, Disco discount rule |
| Official-wiki Power-Up rows | 19 | Cost/rank/unlock values exist at source level |
| Secondary Power-Up class split | 13 / 6 | 13 rankable vs 6 run-found/not-yet-rankable rows; class still unproven |
| Official-wiki Power-Up unlock buckets | 5 | Initial shop, Weeny Bridge, Meany Bridge, Inlaid Library, and blank `Skip` |
| Relic rows feeding town buildings | 16 | Includes Gem Hammer, Stardust Anvil, Lapidary Loupe, Polentir, Arcana Finder, and Deck Box queues |
| Arcana rows feeding Fortune Teller | 12 | 10 public rows plus 2 Polentir/default official-wiki rows |
| Official Store/platform rows feeding save audit | 2 apps | Main app `3265700` and demo app `4329470` |
| Current implementation parity closed by this file | 0 | Direct UI, game files, or runtime/save proof still required |

## Working Interpretation

The town data is not a single roster. It should be split into evidence layers:

- Building row layer: the 8 collected town/meta rows name expected surfaces, but do not prove exact UI membership.
- Official metadata layer: Steam achievements confirm selected unlock concepts, while Store metadata confirms platform features and a demo app.
- Official media layer: Store movies can prove visible exterior or UI candidates only where text is readable, such as `THE GORTON BELL`.
- Structural value layer: official wiki rows provide Inn, Power-Up, relic, arcana, character, and dungeon values, but not shipped building UI.
- Unlock-dependency layer: relics such as Gem Hammer, Stardust Anvil, Lapidary Loupe, Polentir, and Arcana Finder point to building functions and routes.
- Save/platform layer: official FAQ, Steam news, Store appdetails, and SteamDB metadata define demo/full, cross-save, Steam Cloud, save-slot, and build-baseline proof targets.

Do not implement a final village hub from this file alone. Each building still needs at least one player-facing UI proof path: fresh-save state, progressed-save state, exact label, locked/unlocked state, cost, purchase/toggle behavior, and persistence.

## Building / System Layer Reconciliation

| Row | Current Source-Layer Evidence | Current Treatment | Direct-Proof Need |
| --- | --- | --- | --- |
| Gorton Bell Inn / The Inn | Steam achievement metadata, secondary Tavern/Gorton Bell Inn purchase flow, official Store `THE GORTON BELL` exterior, 23 official-wiki character rows, 22 starter decks, `unlockcost` candidates, lead/follower rules, and Disco mode | Inn is the character purchase/equip layer, but character membership and costs remain source-level only | Fresh/progressed Inn UI, exact roster, prices, locked states, default/paid rows, party slots, deck-before/deck-after, Disco discount, and persistence |
| Power-Up Shop | Steam achievement metadata, Destructoid 13 rankable + 6 run-found rows, official-wiki 19 cost/rank/unlock rows, PC Gamer selected cost/stat/refund hints, and Power-Up taxonomy reconciliation | Treat as a class conflict: permanent shop, run-found rewards, and wiki page rows must stay separate | Shop UI with all rows, lock gates, costs, ranks, buy/max states, refund/respec rules, run-found classification, and save persistence |
| Blacksmith's Workshop | Gem Hammer and Stardust Anvil point to socket access and extra gem-slot purchases; PGG/PC Gamer prioritize Blacksmith card-slot work | Treat as socket/slot-purchase layer, separate from Jeweller rarity/seal layer | Unlock panel, building menu, valid card targets, slot cap, prices, purchase flow, socket-blocked evolution behavior, and persistence |
| Jeweller / Jeweler | Lapidary Loupe/Jeweller rows, GAMES.GG Jeweler guide, gem rarity/sealing claims, Luck interaction, and gem taxonomy rows | Treat as rarity/sealing/pool-control layer, not the same as Blacksmith slot purchase | Building entry, gem list, rarity change, seal/unseal, costs, Luck/pool interaction, refund/cancel, and persistence |
| Fortune Teller / Arcana Tent | Polentir route claims, official-wiki 12 arcana rows, 10 public arcana rows, 2 Polentir/default rows, Store movie Arcana-like selection frame | Treat as Arcana access/selection layer; do not finalize 10 vs 12 membership without UI/files | Polentir panel, exact building label, Arcana list, locks, default rows, start-run equip flow, row count, and effect text |
| Relic Museum / Museum | Steam achievement metadata, guide toggle claims, official-wiki 16 relic rows, relic taxonomy reconciliation, Deck Box queue, blank relic fields | Treat as relic list/toggle/persistence layer; 15 guide vs 16 wiki boundary remains open | Museum list, source/location text, toggle on/off, disabled behavior, Deck Box status, next-run comparison, and save persistence |
| Town Hall Unlocks / Checklist | VID-013 top-level Town Hall/Unlocks surface, Steam 161 achievements, achievement gap map, guide checklist references | Treat as unlock-tracking layer, separate from Steam platform achievements until UI proves mapping | Town Hall interior, counters, filters, completed/locked rows, reward linkage, achievement mapping, and unlock-popup text |
| Demo/save/platform carryover | Store main app and demo app metadata, official FAQ demo carryover/no-cross-save, official Steam news save slots and `Hotfix 1.4.1` save fixes, SteamDB build candidate | Treat as platform/save baseline, not a village building | Installed build, save slots, demo/full migration, tutorial-demo-save deletion exception, Steam Cloud behavior, cross-platform boundary, and achievement grant behavior |

## Cross-System Conflict Queue

| Conflict / Boundary | Rows | Current Treatment |
| --- | --- | --- |
| Inn purchase cost vs Crawler-card cost | Character/Inn rows | Use `character-taxonomy-reconciliation.md` for roster layers; use Inn UI/files before committing prices |
| Power-Up permanent shop vs run-found rewards | Power-Up rows | Use `powerup-taxonomy-reconciliation.md`; do not make all 19 permanent shop rows without UI/files |
| Blacksmith vs Jeweller responsibility | Gem socket, extra slot, rarity, and sealing rows | Keep socket/slot purchase separate from rarity/sealing until building menus prove labels and flow |
| Fortune Teller 10 vs 12 Arcana boundary | Arcana rows | Keep public unlock rows, Polentir/default rows, and official-wiki rows separate until Fortune Teller UI/files |
| Museum 15 vs 16 Relic boundary | Relic rows | Keep `Deck Box`, blank field rows, and guide/wiki split open until Museum UI/files |
| Polentir route text | Fortune Teller / Polentir | Preserve Furious Forest, Fortune Forest, and after-Mad-Forest hints until panel or game files settle wording |
| Demo carryover vs cross-save/cloud | Save/platform rows | Keep Steam/Xbox demo carryover, no-launch-cross-save, Steam Cloud, and build ID as separate proof targets |

## Direct Proof Queue

- Capture fresh-save village state before any run: building labels, locks, currency, guidance, and available tabs.
- Capture progressed village states after The Inn, Power-Up Shop, Relic Museum, Blacksmith, Jeweller, Fortune Teller, Town Hall, and stage-map unlocks.
- Enter the Gorton Bell Inn and record the exact roster, lock states, prices, party-slot behavior, character card/deck previews, and Disco discount state.
- Enter Power-Up Shop at fresh, Weeny Bridge, Meany Bridge, and Inlaid Library progress points; record rows, costs, ranks, lock text, refund/respec, and max-rank states.
- Trigger or find run-reward screens for Banish, Curse, Hand, Magnet, Mana/Cooldown, and Revival to classify them against permanent Power-Up rows.
- Use Gem Hammer/Stardust Anvil proof to capture Blacksmith socket access, extra slot purchases, valid targets, costs, and deck persistence.
- Use Lapidary Loupe/Jeweller proof to capture rarity adjustment, seal/unseal, Luck interaction, pool behavior, and save persistence.
- Use Polentir/Arcana Finder proof to capture Fortune Teller entry, Arcana list, start-selection flow, default/automatic rows, and exact effect text.
- Use Relic Museum UI to resolve 15 vs 16 relic rows, Deck Box status, blank field rows, toggles, disabled behavior, and next-run effects.
- Open Town Hall/Unlocks and map several locked, completed, and newly completed rows against Steam achievements and unlock popups.
- Audit app `3265700` and demo app `4329470` installs or official platform documentation for save slots, demo carryover, tutorial-demo-save deletion, achievement migration, Steam Cloud, and no-launch-cross-save behavior.
- Keep current implementation parity at `0` until every confirmed town row has an exact local feature target and a testable acceptance condition.
