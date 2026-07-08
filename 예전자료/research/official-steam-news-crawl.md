# Official Steam News Crawl

Status: generated 2026-05-22 / official Steam community announcements crawl

This file preserves the official Steam news layer for `Vampire Crawlers: The Turbo Wildcard from Vampire Survivors`.
It keeps only Steam `steam_community_announcements` rows as official evidence. External press/news-feed items returned by the API are ignored here unless they receive their own source rows.

Source pages:

- https://store.steampowered.com/news/app/3265700
- https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=3265700&count=100&maxlength=0

## Crawl Notes

| Field | Value |
| --- | --- |
| Fetched | 2026-05-22 |
| Steam app | `3265700` |
| News items returned by API | 22 |
| Official Community Announcements | 9 |
| External posts not treated as official | 13 |
| Latest official announcement | 2026-04-29 `1 million Crawlers in 1 week` |
| Latest official patch label found | `Hotfix 1.4.1` |
| Direct installed-build proof | No |
| Game-file proof | No |

## Official Announcement Rows

| Row | GID | UTC date | Title | Author | Source-level findings | Remaining proof gap |
| --- | --- | --- | --- | --- | --- | --- |
| STNEWS-001 | `1816849002011923` | 2025-11-20 18:33:52Z | `VAMPIRE CRAWLERS: the turbo wildcard from VAMPIRE SURVIVORS` | `jack_poncle` | Official reveal calls the game a spin-off with deckbuilding, dungeon-crawling/blobber-ish exploration, TurboTurn combat, dungeon maps, treasures, customisations, roguelite elements, a 2026 full-game target, and planned post-launch support. | Marketing/reveal layer only; exact runtime rules, UI labels, and shipped content need later proof. |
| STNEWS-002 | `1818752592135940` | 2025-12-16 14:00:23Z | `Thank you for over 170k wishlist additions!` | `info` | Official post references a gameplay trailer / unedited first dungeon floor footage, TurboTurn battles at the player's preferred speed, later posts about dungeon floors/card and ability customization, min-max/RNG customization, and a planned demo. | Alpha-era post; exact final values and demo/full differences require current-build proof. |
| STNEWS-003 | `1822556746162446` | 2026-01-23 17:17:31Z | `Let's Explore Vampire Crawlers \| Episode 1` | `Virgil Infernas` | Official post says TurboTurn lets inputs stack and resolve accurately at the player's pace; gems customize cards through damage multipliers, weapon evolutions, and logic twists; Steam/Xbox demo was planned for Steam Next Fest on 2026-02-23 with carry-forward progress; full release planned for Steam, Xbox, Nintendo Switch, PS5, and later mobile. | High-level system description only; exact gem effects, evolution rules, save migration, and platform behavior require game-file/direct proof. |
| STNEWS-004 | `1823825466499178` | 2026-02-06 10:39:05Z | `Let's Explore Vampire Crawlers \| Episode 2 and 3` | `Virgil Infernas` | Official post says Combo multiplier increases by playing cards in ascending mana cost; Wildcards bridge gaps and allow long chains; each character has a different starting deck and base stats; progression allows a party of up to 3 characters. | Formula, reset cases, Wild consumption, party UI, prices, and exact roster status remain unverified. |
| STNEWS-005 | `1825093633188454` | 2026-02-20 16:56:08Z | `Let's Explore Vampire Crawlers \| Episode 4 and 5` | `Virgil Infernas` | Official post says Character Cards have immediate effects, then linger with passive color triggers; examples include Poe, Suor Clerici, and Mortaccio reacting to Armor; the Village expands as mechanics unlock, exits to the World Map, stage maps show floor information, and points of interest are interacted with by bumping into them. | Exact Character Card text, color triggers, village building states, stage-map labels, and POI outcomes need UI/direct proof. |
| STNEWS-006 | `1826362059925381` | 2026-03-06 19:18:25Z | `Thank you for playing the Vampire Crawlers Demo!` | `falangher` | Official demo post reports 358k downloads, 274k players, 420k+ wishlists, demo progress carryover into the full game with a fresh-start option, save slots from day one, a boss-fight soft-lock fix target, the demo staying available between then and launch and likely after, and the full game being less forgiving. | Demo/live save behavior, boss fix version, and current demo availability need current platform and build proof. |
| STNEWS-007 | `1827626365754198` | 2026-03-19 16:52:42Z | `Vampire Crawlers is coming April 21st` | `Virgil Infernas` | Official release-date post gives GBP/USD/EUR 9.99 and JPY 1200 launch price, Steam/Nintendo Switch/Xbox/PS5 launch on 2026-04-21, mobile later in 2026, controller support, no cross-save at launch, Steam demo save carryover, full-game fixes/improvements over demo, and a later demo update while keeping the demo downloadable. | Prices and platform availability are time-sensitive; cross-save/demo status and current demo patch need recheck before final capture. |
| STNEWS-008 | `1830163047268999` | 2026-04-21 16:15:33Z | `Vampire Crawlers, the first-ever Vampire Survivors spin-off, is here!` | `Vendetta` | Official launch post says the game launched on Steam, Nintendo Switch, Xbox, and PlayStation; highlights TurboTurn, ascending-mana Combo, Wild cards extending stacks to 10/20/30 and possibly more, deckbuilding progression, power-ups, weapon evolutions, Character Cards/summoned survivors, dungeon treasures, floor progression, points of interest, functioning walls, and demo-feedback fixes in the full version. | Launch feature summary is official, but exact caps, UI text, content membership, and patch-specific behavior still need build/game-file/direct proof. |
| STNEWS-009 | `1831432155565969` | 2026-04-29 18:06:55Z | `1 million Crawlers in 1 week` | `Vendetta` | Official post says 1 million users in the first week and that `Hotfix 1.4.1` was released. Fixes include Gatti Amari scuffle crash, brand-new-player save-slot error if exiting before tutorial load, corrupt-save / later-version-to-earlier-version detection, frame-rate limiting based on monitor refresh rate to reduce resource crashes, Echo gem crash, deleting demo saves still in tutorial when upgrading to full, save integrity around power cuts/unexpected closure, and a two-save-slot achievement-progress wipe case. It also says Endless Mode and QOL work were planned, including easier quit, easier Deck View access, hand sorting, and more languages. | Patch label is official, but the installed build ID/branch/version mapping, later unlisted patches, shipped QOL status, and runtime save behavior remain unresolved. |

## Official System Baseline Added

| Area | What this crawl adds | Still missing |
| --- | --- | --- |
| Version / patch baseline | Latest official announcement in the current Steam News API is 2026-04-29 and names `Hotfix 1.4.1`. | Installed build ID, branch, local version label, and whether later unlisted patches exist. |
| TurboTurn / Combo / Wild | Official rows support queued fast turn resolution, ascending-mana Combo, Wildcards bridging gaps, and launch-post stack examples of 10/20/30 or possibly more. | Exact formula, reset/failure rules, cap, Wild consumption, and turn-continuity edge cases. |
| Character selection / triggers | Official rows support starting decks/base stats, up to 3 party members, Character Card immediate effects, lingering color triggers, and Poe/Clerici/Mortaccio examples. | Full roster UI, purchase costs, exact text, availability, and runtime passive proof. |
| Gems / customization | Official rows support gems as card modifiers/evolution tools and mention an Echo gem crash fix in `Hotfix 1.4.1`. | Exact effects, rarity/pools, socket targets, replacement/cancel flow, and runtime behavior. |
| Dungeon / village / world map | Official rows support village expansion, World Map exit, stage-map floor information, points of interest, treasures, floor progression, and functioning walls. | Exact labels, outcomes, room graph, floor counts, and persistence. |
| Save / demo / platform behavior | Official rows support Steam/Xbox demo carryover, save slots, no launch cross-save, controller support, and `Hotfix 1.4.1` save fixes including tutorial demo-save deletion when upgrading. | Current platform status, local save path/format, Steam Cloud behavior, and exact full-version migration behavior. |
| Roadmap / future content | Official row mentions Endless Mode and QOL work after `Hotfix 1.4.1`. | Do not treat these as shipped until a later patch note, UI, or game files prove them. |

## Capture Targets

- Tie installed build to `Hotfix 1.4.1` or later before final direct-play proof.
- Use `research/steamdb-build-baseline-crawl.md` when checking whether SteamDB public branch build `23012943` corresponds to `Hotfix 1.4.1` or a later build; current public metadata makes it a temporal candidate only.
- Capture first-launch save slots and demo-to-full migration, including the tutorial-demo-save deletion exception.
- Recheck Steam news before final implementation because roadmap, demo, cross-save, platform, and patch state can change.
