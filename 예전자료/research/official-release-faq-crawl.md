# Official Release FAQ Crawl

Status: `generated 2026-05-22 / official-developer-social FAQ crawl`

Source URL: https://www.reddit.com/r/VampireCrawlers/comments/1sgpdsc/vampire_crawlers_official_release_faqs/

This file stores selected claims from the `poncle_Official` Reddit release FAQ and nearby official-account replies. Treat it as developer FAQ evidence, but not as in-game UI, game-file, or direct-play proof.

## Crawl Notes

| Check | Result |
| --- | --- |
| Page fetched | 2026-05-22 |
| Post title | `Vampire Crawlers Official Release FAQs` |
| Author shown | `poncle_Official` |
| Post age shown | `1mo ago` |
| FAQ rows extracted | 9 |
| Official-account reply rows extracted | 3 |
| Exact in-game UI proof present | No |
| Game-file proof present | No |
| Runtime verification present | No |

## Boundary Notes

- This is a public Reddit page, but the author shown is `poncle_Official`. Store it separately from ordinary community anecdotes.
- The post is pre-release or launch-window communication. Current platform/store pages can supersede platform availability or pricing details.
- The content-count rows are broad public shorthand. They do not replace exact in-game collection/UI counts.
- Demo save carryover is official-account evidence, but still needs local save-file/direct install verification before closing `TOWN-008`.

## Extracted FAQ Rows

| Crawl ID | Topic | Source-Level Claim | Missing Before Implementation |
| --- | --- | --- | --- |
| OFAQ-001 | Release date | The FAQ gives April 21, 2026 as the release date | Current store metadata agrees, but installed build/branch still needs direct local proof |
| OFAQ-002 | Price baseline | The FAQ gives GBP/USD/EUR/JPY base prices and a regional-pricing list | Current store region and platform pricing may differ; do not use for UI unless storefront-specific |
| OFAQ-003 | Completion estimate | The FAQ says the game takes about 20-30 hours to complete, longer for every unlock | Balance planning only; no direct pacing, completion-state, or 100% route proof |
| OFAQ-004 | Launch platforms | The FAQ lists Steam, Nintendo Switch, Xbox, and PlayStation as launch platforms | Platform-specific UI/save/build differences still need direct or official platform proof |
| OFAQ-005 | Mobile timing | Mobile versions are described as planned later in 2026 | Future/mobile-only behavior must be excluded from PC baseline until released and verified |
| OFAQ-006 | Controller support | Controller support is stated as included | Exact button prompts, remapping, defaults, and input persistence still need UI proof |
| OFAQ-007 | Cross-save | Cross-save between different platforms is described as not available at launch, with mobile-port work being investigated | Exact platform-account behavior, Steam Cloud, and later-patch changes still need verification |
| OFAQ-008 | Demo save carryover | The FAQ says demo save data carries over on Steam or Xbox; an official-account reply also confirms Xbox demo carryover | Local demo/full save-file path, transfer trigger, achievements granted, and failure cases still need direct audit |
| OFAQ-009 | Demo availability | The FAQ says the demo remains available on Steam and Xbox and is planned to be updated later | Current demo availability, demo branch/build, and changed behavior need platform proof |

## Extracted Official Reply Rows

| Crawl ID | Topic | Source-Level Claim | Missing Before Implementation |
| --- | --- | --- | --- |
| OFAQ-010 | Public content-count shorthand | An official-account reply gives broad counts: 65+ cards, 20+ characters, 50+ gems, 12 arcana, and 6 biomes | Exact card/gem/character membership, hidden rows, non-achievement rows, and final UI counts |
| OFAQ-011 | Biome / dungeon / floor structure | An official-account reply says there are 6 biomes, each with a few dungeons, and several floors inside each dungeon | Exact stage-select grouping, dungeon count, floor count per dungeon, route graph, and stage-vs-biome terminology |
| OFAQ-012 | Count precision boundary | The same reply says exact map/level numbers were not available to hand | Do not use official shorthand as exact total; resolve with stage-select UI or game files |

## Required Follow-Up

- Use `OFAQ-010` as a minimum/shorthand count boundary, not a final table count.
- Capture stage-select UI to distinguish biomes, dungeons, stages, and floors.
- Audit Steam/Xbox demo-to-full save carryover from an installed demo/full pair or official platform save documentation.
- Verify controller prompts, remapping, and cross-save/cloud behavior from current build UI or platform documentation.
