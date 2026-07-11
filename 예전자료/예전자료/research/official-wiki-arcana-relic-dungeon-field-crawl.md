# Official Wiki Arcana / Relic / Dungeon Field Crawl

Status: `generated 2026-05-22 / official wiki field-coverage crawl`

Source hub: https://vampire.survivors.wiki/w/Crawlers:Wiki

Related crawl: [`official-wiki-api-crawl.md`](./official-wiki-api-crawl.md)

Follow-up value extract: [`official-wiki-arcana-relic-dungeon-value-extract.md`](./official-wiki-arcana-relic-dungeon-value-extract.md)

This file stores field coverage extracted from official-wiki arcana, relic, and dungeon infoboxes. It preserves structure, missing fields, and short route/unlock facts without replacing direct UI, Museum, stage-select, or game-file proof.

## Crawl Notes

| Check | Result |
| --- | --- |
| Page/API fetched | 2026-05-22 |
| Arcana pages parsed | 12 |
| Relic pages parsed | 16 |
| Dungeon pages parsed | 9 after excluding the index and Village |
| API used | `api.php?action=parse` and `api.php?action=query&list=categorymembers` |
| Exact runtime proof present | No |
| Game-file proof present | No |

## Arcana Field Coverage

| Field | Rows With Value | Rows Missing | Notes |
| --- | ---: | ---: | --- |
| `name` | 12 | 0 | Unique `Infobox VC Arcana` rows |
| `text` | 12 | 0 | Exact effect text still needs Fortune Teller UI/game-file proof |
| `unlocked by` | 12 | 0 | Includes the two Polentir-unlocked rows absent from Dexerto's 10-row unlock table |
| `demo` | 0 | 12 | No demo field found in these infoboxes |

## Arcana Unlock Snapshot

| Arcana | Official-Wiki Unlock Field |
| --- | --- |
| And Another | Playing 150 Free-to-Play cards |
| Chain Link | Reaching combo 12 or more |
| Experimental Medicine | Unlocked when taking Polentir |
| Jester's Hat | Playing 150 Wild cards |
| Make a Scene | Activating 1,500 Crawler trigger abilities |
| Mana Syphon | Receiving 15 Mana in a single turn |
| Over The Top | Using crawler/green character cards 100 times |
| Sharp Mind | Using purple/mana cards 100 times |
| Shield Bash | Unlocked when taking Polentir |
| Swollen Fist | Reaching deck size 40 |
| Wild Buff | Playing 250 cards picked up from light sources |
| Your Shield My Liege | Gaining 2,000 Armor |

## Relic Field Coverage

| Field | Rows With Value | Rows Missing | Notes |
| --- | ---: | ---: | --- |
| `name` / `id` | 16 | 0 | Unique `Infobox VC Relic` rows |
| `description` | 16 | 0 | Short source-level description exists for every row |
| `foundin` | 13 | 3 | Blank for `Deck Box`, `Milky Way Map`, and `Rilevatore` |
| `effects` | 12 | 4 | Blank for `Combo Stack`, `Deck Box`, `Ovenkilt`, and `Rilevatore` |

## Relic Found-In Snapshot

| Relic | Official-Wiki `foundin` Field |
| --- | --- |
| Arcana Finder | Library Sanctum |
| Bomba Infernale | Dairy Plant |
| Combo Stack | Tutorial |
| Gem Hammer | Mad Forest |
| Grim Grimoire | Library West Wing |
| Guiding Light | Inlaid Library |
| Lapidary Loupe | Gallo Tower |
| Ovenkilt | Cappella Ultima |
| Overkill | Teeny Bridge |
| Polentir | Fortune Forest |
| Sorceress' Tears | Gallo Tower |
| Stardust Anvil | Teeny Bridge |
| Ultimate Ultra Overkill | Curd Refinery |

## Relic Missing-Field Queues

| Missing Field | Rows |
| --- | --- |
| `foundin` | Deck Box; Milky Way Map; Rilevatore |
| `effects` | Combo Stack; Deck Box; Ovenkilt; Rilevatore |

## Dungeon Field Coverage

| Field | Pages With Value | Pages Missing | Notes |
| --- | ---: | ---: | --- |
| `order` | 9 | 0 | Tutorial is order 0; post-tutorial pages use 2-9 in current wiki fields |
| single `name` | 5 | 4 | Tutorial, Teeny Bridge, Weeny Bridge, Gallo Tower, Meany Bridge |
| multi-version `name1/name2/name3` | 4 | 5 | Mad Forest, Inlaid Library, Dairy Plant, Cappella Magna pages |
| single `floors` | 5 | 4 | Single-name dungeon pages |
| multi-version `floors1/floors2/floors3` | 4 | 5 | Multi-version dungeon pages |
| `demo` | 3 | 6 | Present as `No` on Gallo Tower, Meany Bridge, and Cappella Magna |
| description field | 8 | 1 | Tutorial has blank description fields |

## Dungeon Variant Snapshot

| Page | Order | Names | Floors | Difficulty | Demo Field |
| --- | ---: | --- | --- | --- | --- |
| Tutorial | 0 | Tutorial | 1 | blank | blank |
| Mad Forest | 2 | Mad Forest / Furious Forest / Berserk Wood | 4 / 5 / 5 | 1 / 2 / 3 | blank |
| Inlaid Library | 3 | Inlaid Library / Library West Wing / Library Sanctum | 5 / 5 / 5 | 2 / 3 / 4 | blank |
| Teeny Bridge | 4 | Teeny Bridge | 1 | 3 | blank |
| Dairy Plant | 5 | Dairy Plant / Milk Factory / Curd Refinery | 5 / 5 / 5 | 4 / 5 / 6 | blank |
| Weeny Bridge | 6 | Weeny Bridge | 1 | 5 | blank |
| Gallo Tower | 7 | Gallo Tower | 6 | 6 | No |
| Meany Bridge | 8 | Meany Bridge | 1 | 7 | No |
| Cappella Magna | 9 | Cappella Magna / Cappella Ultima | 5 / 5 | 8 / 9 | No |

## Required Follow-Up

- Verify the 12-arcana unlock/effect fields in Fortune Teller UI or game files, especially the two Polentir rows.
- Use the value extract for row-level arcana unlock, relic found-in, and dungeon order/floor/difficulty planning without copying full effect or description prose into implementation.
- Verify whether relic blank fields mean starting/default rows, non-Museum rows, incomplete wiki data, or another taxonomy.
- Use the relic found-in snapshot as a source-level route queue, but keep GameSpot/PGG conflicts open until relic panels or Museum UI confirm them.
- Use dungeon order/floor/difficulty fields as stage-select capture targets, not as a final biome/stage/floor taxonomy.
