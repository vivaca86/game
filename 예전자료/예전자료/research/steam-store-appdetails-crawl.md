# Steam Store Appdetails / Media Crawl

Status: `official Store API/media baseline`
Generated: 2026-05-22

This crawl preserves the current official Steam Store API metadata and Store media rows for `Vampire Crawlers: The Turbo Wildcard from Vampire Survivors`.

Sources:

- Main app API: https://store.steampowered.com/api/appdetails?appids=3265700&cc=us&l=en
- Movie-only API: https://store.steampowered.com/api/appdetails?appids=3265700&cc=us&l=en&filters=movies
- Demo app API: https://store.steampowered.com/api/appdetails?appids=4329470&cc=us&l=en
- Store page: https://store.steampowered.com/app/3265700/Vampire_Crawlers/

## Evidence Boundary

- This is official Store metadata/media evidence, not direct installed-build or direct runtime proof.
- API values that can change over time, such as recommendations, review counts, price, screenshots, and movies, should be treated as a dated 2026-05-22 snapshot.
- Store screenshots can support visible UI candidates and exact text only where the image is readable. They do not prove current runtime behavior, save behavior, build version, formulas, drop rates, or patch membership.
- Screenshot `SS-09` includes a visible `Development Build` marker, so the media set can contain pre-release or staged capture material.

## Main App API Snapshot

| Field | Value |
| --- | --- |
| App ID | `3265700` |
| API success | `true` |
| Name | `Vampire Crawlers: The Turbo Wildcard from Vampire Survivors` |
| Type | `game` |
| Required age | `0` |
| Release date | `Apr 21, 2026`; `coming_soon=false` |
| Developers | `poncle`; `Nosebleed Interactive` |
| Publisher | `poncle` |
| Platforms | Windows `true`; macOS `true`; Linux `false` |
| Controller support | `full` |
| Categories | `Single-player`; `Steam Achievements`; `Full controller support`; `Steam Cloud`; `Family Sharing` |
| Genres | `Action`; `Indie`; `Strategy` |
| Achievements | `161` |
| Supported languages | English, French, Italian, German, Spanish - Spain, Japanese, Portuguese - Brazil, Russian, Simplified Chinese, Traditional Chinese, Korean, Polish |
| Price overview | `$9.99`, no discount in the 2026-05-22 `cc=us` API response |
| Recommendations total | `15647` in the 2026-05-22 API response |
| Demo row | App `4329470` |
| Screenshots | `10` |
| Movies | `4` |

## Demo App API Snapshot

| Field | Value |
| --- | --- |
| App ID | `4329470` |
| API success | `true` |
| Name | `Vampire Crawlers: The Turbo Wildcard from Vampire Survivors Demo` |
| Type | `demo` |
| Is free | `true` |
| Release date | `Feb 23, 2026`; `coming_soon=false` |
| Developers | `poncle` |
| Publisher | `poncle` |
| Platforms | Windows `true`; macOS `false`; Linux `false` |
| Controller support | `full` |
| Categories | `Single-player`; `Game demo`; `Full controller support` |
| Supported languages | English, French, Italian, German, Spanish - Spain, Japanese, Korean, Polish, Portuguese - Brazil, Russian, Simplified Chinese, Traditional Chinese |
| Screenshots / movies | `0` screenshots; `0` movies |

## Store Media Rows

| Media | API Rows | Snapshot Notes |
| --- | ---: | --- |
| Main app screenshots | 10 | All `path_full` screenshot URLs in the 2026-05-22 API response share Steam CDN query marker `t=1776925935`. |
| Demo screenshots | 0 | The demo appdetails response exposes no screenshot rows. |
| Main app movies | 4 | API exposes movie IDs, names, highlight flags, and thumbnail URLs; `webm` and `mp4` fields were null in the fetched object. |
| Demo movies | 0 | The demo appdetails response exposes no movie rows. |

Follow-up movie frame crawl: [`steam-store-movie-frame-crawl.md`](./steam-store-movie-frame-crawl.md) uses the Store movie-only API (`filters=movies`) and Store-page inline MP4 assets to preserve HLS/DASH stream URLs, observed durations, sampled frame notes, and official-media card/event/Arcana/town candidates as `SRC-145`.

### Movie Rows

| Movie ID | Name | Highlight | Thumbnail Marker |
| ---: | --- | --- | --- |
| `257250926` | `Vampire Crawlers - First Gameplay` | `true` | `t=1765907820` |
| `257323582` | `Vampire Crawlers - Launch ` | `true` | `t=1776787516` |
| `257228176` | `Vampire Crawlers - Announce` | `true` | `t=1763662187` |
| `257306012` | `Vampire Crawlers - Launch Date Announcement` | `false` | `t=1773928804` |

## Official Screenshot Visual Rows

These rows are official Store screenshot observations. They should feed UI/card/gem capture queues, but they remain weaker than high-resolution gameplay video or direct game files for final rule text.

| ID | Visible Surface | Readable / High-Confidence Text | Use | Limits |
| --- | --- | --- | --- | --- |
| SS-00 | First-person outdoor lane and first combat card | `Lv 1`; HP `50/50`; mana `2`; `Knife`; `Deal 50 damage.` | Confirms official first-person lane framing, HP/mana HUD, and a single-card combat candidate. | Does not prove first-run state, build, or runtime formula. |
| SS-01 | Library combat with side counters and combo wheel | `Lv 21`; `Axe`; `King Bible`; `Deal 391 damage. Cost+.`; `Play All`; `End Turn`; `Eight the Sparr...` | Confirms combat hand layout, Play All/End Turn buttons, card costs, combo/multiplier surface, and side status/crawler slots. | Some `Axe` text and right-side label are partly obscured. |
| SS-02 | Large hand / high-card combat state | `Lv 15`; `Garlic`; `Deal 99 damage to 5 enemies. Knockback. Copy.`; visible `FREE` and `W` card markers | Confirms large-hand state, `Copy` modifier, Wild/Free-like card markers, and high mana pool candidate. | Many hand cards are too small or occluded for exact text. |
| SS-03 | Overkill reward burst | `ULTRA... OVERKILL`; `$5000`; combo/multiplier `x40`; `Little Heart`; `Heal 1 HP. Destroy. Wild.` | Confirms overkill/economy display and Destroy/Wild card text candidate. | Explosion occludes background and several card details. |
| SS-04 | Evolved-card combat | `Hellfire`; `Deal ... damage with 50% knockback chance. Evolved.`; `Pasqualina`; `Increase Hand by 1. (2 Duration) Crawler`; `Armor`; `Add 2 Armor.`; `Garlic`; `Area 2x` | Confirms evolved card panel, Crawler card, armor card, area/gem-like modifier, and hand-size effect candidate. | Hellfire damage number and some card text are obscured. |
| SS-05 | Event / spend-card room | `Spend a card to restore HP.`; `Leave`; `Skull O'Maniac`; `Increase enemy strength 10%, gain additional XP.` | Confirms event room option framing and Skull O'Maniac card text candidate. | Does not prove event cost/result/repeat rules. |
| SS-06 | First-person movement / minimap | `Lv 1`; HP `50/50`; mana `2`; movement arrows; minimap with route marker | Confirms official first-person movement UI, directional control panel, and minimap surface. | No card/rule text present. |
| SS-07 | Library combat with enemy intent/shield | `Lv 6`; `Whip`; `Spinach`; `Magic Wand`; `Deal 30 damage. Prioritize attackers.`; `Play All`; `End Turn` | Confirms enemy intent/shield icons, attacker-priority text candidate, and standard combat buttons. | Whip/Spinach text partly hidden. |
| SS-08 | Gem choice screen | `Choose a Gem`; rarity labels `Normal`, `Polished`, `Normal`; `Earns money when the card kills an enemy.`; `When the card is drawn, it stays in Hand until used.`; `Increases Area stat.`; `Reroll 0 Left`; `Skip 0 Left`; `Banish 0 Left`; `Leave`; `Cash Out` | Confirms gem choice UI, rarity labels, reroll/skip/banish counters, and three readable gem effect candidates. | Visible cards do not expose final in-game gem names. |
| SS-09 | Card-duplicate event/reward screen | `Choose a card to duplicate.`; `Garlic`; `Deal 124 damage to 5 enemies. Knockback. Reverse Combo.`; `Leave`; `Reroll 6 Left`; visible `Development Build` marker | Confirms duplicate-card UI, reroll count, Reverse Combo modifier, and development-build caveat. | Development-build marker prevents treating this as final shipped UI without cross-check. |

## Capture Targets Added By This Crawl

- Use the Store API demo row `4329470` when auditing demo/full save carryover, supported platforms, and demo media gaps.
- Use Store categories as official platform-feature metadata: `Steam Cloud`, `Family Sharing`, `Full controller support`, and `Game demo` for the demo app.
- Use screenshots `SS-00`, `SS-06`, and `SS-07` to refine first-person movement/combat UI candidates.
- Use screenshots `SS-01` through `SS-04` and `SS-09` as high-resolution card-text candidates only; confirm against official wiki/game-file/high-resolution video before implementation.
- Use screenshot `SS-08` as the current best official-media gem-choice UI candidate, while keeping exact gem names and runtime behavior unresolved.
- Use `research/steam-store-movie-frame-crawl.md` for the next official-media movie layer: it adds `Mana Syphon`, `Over The Top`, `Spend a card to gain Mana.`, `THE GORTON BELL`, `Holy Wand`, `Phiera Der Tuphello`, `Bracer`, `Attractorb`, and additional evolved-card/frame candidates, but still does not prove current runtime formulas or patch membership.
