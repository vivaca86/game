# Official Wiki Enemy / Event / Power-Up Field Crawl

Status: `generated 2026-05-22 / official wiki field-coverage crawl`

Source hub: https://vampire.survivors.wiki/w/Crawlers:Wiki

Follow-up value extract: [`official-wiki-enemy-event-powerup-value-extract.md`](./official-wiki-enemy-event-powerup-value-extract.md).

Related event reconciliation: [`event-taxonomy-reconciliation.md`](./event-taxonomy-reconciliation.md).

This file stores field coverage extracted from official-wiki enemy, dungeon-event, and Power-Up category pages. It is source-level official-wiki evidence only; enemy stats, event behavior, shop costs, and unlocks still need shipped UI/game-file or direct-play proof before implementation.

## Crawl Notes

| Check | Result |
| --- | --- |
| Page/API fetched | 2026-05-22 |
| Enemy category rows parsed | 128 after excluding `Crawlers:Enemies` |
| Enemy infobox pages found | 126 |
| Expanded enemy value rows in follow-up extract | 132 |
| Dungeon-event category rows found | 10 |
| Power-Up rows parsed | 19 after excluding `Crawlers:Power Ups` |
| Power-Up infobox rows found | 19 |
| API used | `api.php?action=parse` and `api.php?action=query&list=categorymembers` |
| Exact runtime proof present | No |
| Game-file proof present | No |

## Enemy Field Coverage

| Field | Rows With Value | Rows Missing | Notes |
| --- | ---: | ---: | --- |
| `Infobox VC Enemy` | 126 | 2 | Two category taxonomy pages need manual audit before treating as enemy rows; follow-up value extract expands two multi-variant pages into 132 rows |
| `hp` / `hpN` | 126 | 2 | Numeric source-level field, not direct runtime proof |
| `xp` / `xpN` | 126 | 2 | Numeric source-level field, not direct runtime proof |
| `boss` | 126 | 2 | Category includes two taxonomy pages without enemy infobox rows |
| `dungeons` | 119 | 9 | Rows without dungeon fields need route/UI proof |
| `boss = Yes` | 55 | 73 | Official-wiki boss flag, not final encounter taxonomy |
| `boss = No` | 71 | 57 | Includes Trickster despite its special-boss role in guides |
| positive `chesttier` | 0 | 128 | Current wiki category query did not expose positive chest-tier rows |

## Trickster Source-Level Row

| Field | Official-Wiki Value |
| --- | --- |
| `hp` | 30000 |
| `boss` | No |
| `dungeons` | Any |
| `maxhit` | 30 |
| `difficulty` | 0 |
| `xp` | 0 |
| `types` | Trickster |
| Source-level trigger note | Same card played five times in a single turn shatters and summons Trickster |
| Source-level reward note | Full game unlocks the Uncrackable gem |

## Dungeon Event Category Rows

| Count | Event Pages |
| ---: | --- |
| 10 | Abandoned cart; Bat Goblin; Card stat offering table; Duplicate offering table; Evolution statue; Floor chicken offering table; Light source; Mana offering table; Mana statue; Treasure chest |

## Power-Up Field Coverage

| Field | Rows With Value | Rows Missing | Notes |
| --- | ---: | ---: | --- |
| `Infobox VC Powerup` | 19 | 0 | Category excludes `Crawlers:Power Ups` index page |
| `cost` | 19 | 0 | Treat as source-level shop baseline until direct UI proof |
| `max level` | 19 | 0 | Treat as source-level shop baseline until direct UI proof |
| `bonus` / `max effect` | 19 | 0 | Treat as source-level values until direct UI proof |
| `unlocked by` | 18 | 1 | `Skip` has a blank unlock field in the current crawl |

## Power-Up Infobox Rows

| Page | Infobox Name | Max Level | Bonus | Max Effect | Cost | Unlock Field |
| --- | --- | ---: | --- | --- | ---: | --- |
| `Crawlers:Amount` | Amount | 3 | +1 | +3 | 1250 | Complete Meany Bridge |
| `Crawlers:Area` | Area | 5 | +10% | +50% | 850 | Access Power Ups Shop |
| `Crawlers:Armor (stat)` | Armor | 3 | +2 | +6 | 1250 | Access Power Ups Shop |
| `Crawlers:Banish` | Banish | 5 | +2 | +10 | 300 | Complete Weeny Bridge |
| `Crawlers:Crawler Slot` | Crawler Slot | 2 | +1 | +2 | 3500 | Complete Meany Bridge |
| `Crawlers:Curse` | Curse | 5 | +20% | +100% | 350 | Complete Weeny Bridge |
| `Crawlers:Duration` | Duration | 5 | +1 | +5 | 250 | Access Power Ups Shop |
| `Crawlers:Greed` | Greed | 4 | +25% | +100% | 1000 | Complete Inlaid Library |
| `Crawlers:Growth` | Growth | 5 | +20% | +100% | 750 | Access Power Ups Shop |
| `Crawlers:Hand` | Hand | 2 | +1 | +2 | 2500 | Complete Weeny Bridge |
| `Crawlers:Luck` | Luck | 3 | +25% | +75% | 400 | Access Power Ups Shop |
| `Crawlers:Magnet` | Magnet | 1 | +1 | +1 | 2000 | Complete Weeny Bridge |
| `Crawlers:Mana` | Cooldown | 2 | +1 | +2 | 3500 | Complete Meany Bridge |
| `Crawlers:Max Health` | Max Health | 5 | +10% | +50% | 450 | Access Power Ups Shop |
| `Crawlers:Might` | Might | 5 | +25% | +125% | 500 | Access Power Ups Shop |
| `Crawlers:Recovery` | Recovery | 3 | +1 | +3 | 500 | Access Power Ups Shop |
| `Crawlers:Reroll` | Reroll | 5 | +2 | +10 | 200 | Access Power Ups Shop |
| `Crawlers:Revival` | Revival | 1 | +1 | +1 | 4000 | Complete Weeny Bridge |
| `Crawlers:Skip` | Skip | 5 | +2 | +10 | 250 | blank |

## Source-Level Conflicts / Capture Targets

- The official-wiki `Crawlers:Mana` page exposes the Power-Up infobox name `Cooldown`; keep `Mana` and `Cooldown` separate until the Power-Up Shop UI confirms the displayed label.
- The wiki Power-Up costs differ from earlier PC Gamer source hints for at least Reroll (`200` here vs `250` in the PC Gamer crawl), so cost rows remain source conflicts until UI/game-file proof.
- The follow-up value extract preserves 126 enemy infobox pages expanded into 132 enemy value rows; the wiki enemy category is much larger than the 9 Steam-achievement enemy/boss targets and the current video-only boss groups, so use it as a route/nameplate capture queue, not as a final enemy implementation table.
- Dungeon event pages currently have no common infobox in this crawl, so exact option text, cost, reward, and repeat rules still need direct UI/game-file proof. Use `event-taxonomy-reconciliation.md` to separate actionable wiki mechanics from sparse label-only event pages before assigning parity.
