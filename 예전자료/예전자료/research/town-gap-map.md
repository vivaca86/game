# Town / Meta Progression Implementation Gap Map

Status: `official metadata collected / partial video and Store movie proof / official wiki value extracts / arcana, relic, and Power-Up taxonomy reconciliations / secondary Inn-Power-Up-Blacksmith-Jeweler context / row-level current implementation gap-mapped`
Last updated: 2026-05-22

This file maps each collected Vampire Crawlers town or meta-progression row against the current prototype implementation. It is intentionally conservative: a run shop, a party array, or a local unlock flag is not counted as town parity until the original building UI, cost/state, unlock order, persistence, and cross-run effect are verified.

## Source Basis

| Source ID | Source | Use | Grade |
| --- | --- | --- | --- |
| SRC-006 | Steam Community achievements page | Official public metadata for The Inn, Power Ups Shop, and Relic Museum | E5 metadata |
| SRC-108-C | GAMES.GG character guide | Inn purchase flow, party expansion, coffin route context | E1 |
| SRC-118 | Pro Game Guides tier list | 21-Crawler roster and Crawler-card passive context | E1 |
| SRC-119 | VGC all Crawlers unlock guide | Tavern purchase flow and default/available Crawler states | E1 |
| SRC-120 | Destructoid power-ups tier list | Crawler Slot power-up and Luck/power-up context | E1 |
| SRC-135 | Destructoid Power-Up tier crawl | Generated 13 rankable rows and 6 run-found/not-yet-rankable rows for Power-Up Shop planning; reconciled against official-wiki rows in `powerup-taxonomy-reconciliation.md` | E1 |
| SRC-136 | PC Gamer upgrade priority crawl | Generated selected Power-Up costs/stat hints, refund-button claim, Polentir/Fortune Teller, and Stardust Anvil/Blacksmith route hints | E1 |
| SRC-140 | PGG beginner systems crawl | Generated Greed/Might/Blacksmith priority hints and automatic demo-to-full progress carryover claim | E1 |
| SRC-141 | Poncle official release FAQ crawl | Official-account Steam/Xbox demo save carryover, no-launch-cross-save, platform, mobile, and controller-support claims | E5 developer statement via social FAQ |
| SRC-121 | VGC best builds guide | Three-Crawler party examples and Blacksmith extra-gem-slot context | E1 |
| SRC-108-R | GAMES.GG relic guide | Museum toggles, Gem Hammer socket access, Stardust Anvil/Blacksmith extra slots, Fortune Teller, Arcana Finder, relic behavior | E1 |
| SRC-122 | SportsRant gem guide | Gem card-attachment context and broad effect-family taxonomy | E1 |
| SRC-123 | GAMES.GG Jeweler guide | Lapidary Loupe/Jeweler unlock, Blacksmith access, rarity adjustment, sealing, and Luck interaction | E1 |
| SRC-202 | PC Gamer upgrade guide | Early upgrade priorities, selected Power-Up costs/stat hints, Fortune Teller hint, and Stardust Anvil/Blacksmith context | E1 |
| VID-009/010/011/012/013 | Storyboard videos | Shop, character/party, Town Hall/Unlocks, settings, stage-map return surfaces | E3 partial |
| SRC-145 | Steam Store movie frame crawl | Official Store movie/frame candidates for Gorton Bell exterior signage and town/media surfaces | E5 official media candidate |
| SRC-149 | Official wiki character value extract | Gorton Bell Inn planning values: 23 character rows, 22 starter deck rows, 22 lead-crawler base-stat rows, trigger buckets, `unlockcost` candidates, and Disco-mode rule flags | E5 official wiki structured values / not direct play |
| SRC-147 | Official wiki arcana/relic/dungeon value extract | Fortune Teller/Museum/stage-select planning values: 12 arcana rows, 16 relic rows, blank relic field queues, and 16 dungeon/stage variant rows; reconciled in `arcana-taxonomy-reconciliation.md` and `relic-taxonomy-reconciliation.md` | E5 official wiki structured values / not direct play |
| SRC-148 | Official wiki enemy/event/Power-Up value extract | Power-Up Shop planning values: 19 Power-Up id/cost/rank/bonus/unlock rows, `Skip` blank unlock field, and Mana/Cooldown mismatch; cross-mapped in `powerup-taxonomy-reconciliation.md` | E5 official wiki structured values / not direct play |
| derived | Town taxonomy reconciliation | `research/town-taxonomy-reconciliation.md` separates building rows, official metadata, official media, structural values, unlock dependencies, and save/platform layers | Source-level reconciliation / not direct play |
| local implementation audit | `src/rules/crawler-dungeon.js`, `src/content/crawler-clone.js`, `src/rules/progression.js`, UI files | Current prototype town/meta-adjacent behavior | Local implementation evidence |

## Coverage Counter

| Segment | Rows | Current exact 1:1 implemented | Placeholder-adjacent rows | Current status |
| --- | ---: | ---: | ---: | --- |
| Collected town/meta rows | 8 | 0 | 2 | Inn and Power-Up Shop have shallow prototype-adjacent surfaces only; `research/town-taxonomy-reconciliation.md` separates the town building row layer, official metadata, official media, structural values, unlock dependencies, and save/platform layer; secondary sources add purchase/party-slot, generated Power-Up row taxonomy, Power-Up taxonomy reconciliation, arcana taxonomy reconciliation for Fortune Teller planning, relic taxonomy reconciliation for Museum row-count planning, selected PC Gamer cost/stat/refund hints, PGG Greed/Might/Blacksmith priority hints, official FAQ demo/cross-save/platform boundary, Blacksmith extra-slot, Fortune Teller route hints, Jeweler rarity/sealing context, demo carryover claim, official wiki value extracts for Inn/character, Fortune Teller/Museum/stage-select, and Power-Up Shop planning, and official Store movie Gorton Bell exterior signage but not exact UI parity |
| Steam achievement-backed town/meta rows | 3 | 0 | 2 | Official metadata names exist, but building UI, costs, and persistence are missing |
| Current town hub implementation | unknown original total | 0 | 0 | The prototype starts runs directly and has no original village hub parity |
| Persistent economy / building upgrades | unknown original total | 0 | 1 | Local shop/growth surfaces are run-local or prototype-only |

## Current Prototype Surface

| Surface | Current behavior | Why it is not final parity |
| --- | --- | --- |
| `startCrawlerRun()` / crawler state | Starts a run directly in the prototype crawler | Original town hub, building selection, save-slot flow, and world-map transition are missing |
| `unlockedCharacters` / `party` | Stores local custom character ids and a shallow party list | No original Inn roster, prices, rescue/purchase flow, starting decks, or persistence proof |
| `showNodeChoices("shop")` / generic shop rewards | Offers run-local card/gem/reward choices | Not the permanent Power-Up Shop, Blacksmith, Jeweller, or town economy |
| `state.ownedRelics` / prototype relic flow | Stores local relic ids in memory | No Relic Museum list, toggle state, disabled behavior, or cross-run persistence parity |
| UI screens | Current app has self-contained prototype panels | No exact Town Hall checklist, building cards, unlock counters, costs, filters, or completed-state behavior |

## Per-Town Gap Rows

| ID | Building / system | Collected proof | Current implementation surface | Parity | Current gap | Required proof |
| --- | --- | --- | --- | --- | --- | --- |
| TOWN-001 | Gorton Bell Inn / The Inn | Steam achievement says `Crawler Selection Unlocked`; GAMES.GG/VGC describe Tavern/Gorton Bell Inn recruitment after unlock; official wiki character value extract preserves 23 character rows, 22 starter decks, 22 base-stat rows, trigger buckets, `unlockcost` candidates, and Disco-mode rule flags; VID-009/011/012 show character/party setup-like surfaces; SRC-145 Store movie frame shows exterior sign `THE GORTON BELL` | `unlockedCharacters` / `party` are placeholder-adjacent | Placeholder only | Building entry, exact roster, prices, default/paid state, rescue/purchase flow, selected party, and persistence missing | Fresh/progressed village UI, Inn interior, purchase, party change, deck before/after, and save carryover |
| TOWN-002 | Power-Up Shop | Steam achievement says `Collect 250 coins`; Destructoid/PC Gamer provide secondary rankable candidates and selected early cost/stat hints; `powerup-destructoid-tier-crawl.md` preserves 13 rankable rows and 6 run-found/not-yet-rankable rows; `powerup-taxonomy-reconciliation.md` maps all 19 Destructoid rows to official-wiki rows while preserving the 13 rankable vs 6 run-found classification conflict and official-wiki unlock buckets; `pcgamer-upgrade-priority-crawl.md` preserves Recovery 500 coins, Reroll 250 coins, Might/Luck 20%, and a refund-button claim without rules; official wiki value extract preserves 19 Power-Up id/cost/rank/bonus/unlock rows, Reroll 200, Might/Luck 25%, `Skip` blank unlock, and Mana/Cooldown mismatch; Destructoid/GAMES.GG/VGC describe Crawler Slot/up-to-three-Crawler party context; VID-009/010/012 show shop/power-up-style setup screens | Generic run shop / shallow meta loop is placeholder-adjacent | Placeholder only | Permanent upgrade list, ranks, full costs, unlock order, Crawler Slot behavior, run-found vs rankable split, refund/respec behavior, and persistence missing | Shop UI with all rows, costs, buy flow, refund/respec case, party-slot before/after, before/after stat or setup proof |
| TOWN-003 | Blacksmith's Workshop | GAMES.GG ties Gem Hammer to socket access and Stardust Anvil to Blacksmith card gem-slot purchases; PC Gamer crawl places Stardust Anvil as a Teeny Bridge reward that unlocks Blacksmith card gem-slot purchases; PGG beginner systems crawl recommends Blacksmith for more gem slots; VGC adds extra-gem-slot build context | Prototype gem socket flow only | No | Building unlock, slot purchase UI, costs, affected card state, slot limits, valid targets, and persistence missing | Gem Hammer/Stardust Anvil unlock proof plus Blacksmith UI and card-slot purchase proof |
| TOWN-004 | Jeweller / Jeweler | GAMES.GG Jeweler guide ties Lapidary Loupe to Jeweler access through the Blacksmith, rarity adjustment, Ultra Rare sealing, Luck interaction, and a sealing cost hint | No direct equivalent | No | Building entry, gem view/seal functions, rarity tiers, costs, pool math, refund behavior, and persistence unknown | Direct UI or reliable high-resolution footage of Jeweler behavior, including one rarity change and one seal/unseal case |
| TOWN-005 | Fortune Teller / Arcana Tent | Guides tie it to Polentir and Arcana access; PC Gamer crawl places Polentir in Furious Forest after clearing Mad Forest and says it unlocks Fortune Teller / Arcana; official wiki value extract preserves 12 arcana rows, Polentir-unlocked `Experimental Medicine` / `Shield Bash` rows, and `Fortune Forest` as a conflicting Polentir found-in value tracked in `CON-043`; `arcana-taxonomy-reconciliation.md` maps 10 public rows to 12 wiki rows and preserves Wild Buff / And Another / Over The Top proof queues | `state.crawl.arcana` is not mature system | No | Building unlock, Polentir route text, arcana list, row count, locks, start selection, default/automatic row state, and persistence missing | Polentir unlock plus Fortune Teller UI and start-run selection proof |
| TOWN-006 | Relic Museum / Museum | Steam achievement says `Play two dungeons`; guide says relics can be toggled; official wiki value extract preserves 16 relic rows, including `Deck Box`, blank found-in rows, and blank effects rows; `relic-taxonomy-reconciliation.md` maps 15 guide rows against 16 wiki rows and keeps `Deck Box` as the wiki-only extra row | No direct equivalent | No | Relic list, 15-vs-16 roster boundary, `Deck Box` status, toggles, disabled behavior, costs/state, and persistence missing | Museum UI, toggle on/off, next-run effect comparison, and save proof |
| TOWN-007 | Town Hall Unlocks / Checklist | VID-013 shows top-level Unlocks/Town Hall surface | No direct equivalent | No | Checklist interior, counters, filters, completed state, reward linkage, and Steam achievement mapping missing | Town Hall interior footage/direct capture with several completed and locked rows |
| TOWN-008 | Demo/save carryover | Platform context hints demo/full-save concerns; PGG beginner systems crawl says demo progress carries into the full version automatically; official release FAQ crawl says Steam/Xbox demo save data carries over and cross-save is not available at launch | No direct equivalent | No | Demo baseline, save handoff, version/platform behavior, save-file location, achievement grant, cross-save/cloud behavior, and exclusion boundary unresolved | Direct install/save audit or official documentation for demo carryover behavior |

## Required Completion

- Capture fresh-save and progressed-save village states for every building.
- Record unlock order, costs, ranks, locked/unlocked labels, currencies, persistence, and cross-run effects.
- Verify Inn, Power-Up Shop, Blacksmith, Jeweller, Fortune Teller, Relic Museum, Town Hall checklist, demo/full-save boundaries, and no-launch-cross-save boundary from direct play, high-resolution video, official platform documentation, or game files.
- Use `research/town-taxonomy-reconciliation.md` to keep building rows, metadata, media, structural values, unlock dependencies, and save/platform rows separate before assigning implementation parity.
- Keep implementation approval closed until town rows have acceptance conditions tied to the final system split.
