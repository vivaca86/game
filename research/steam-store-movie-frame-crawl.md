# Steam Store Movie Frame Crawl

Status: `official Store movie/frame candidate baseline`
Generated: 2026-05-22

This crawl preserves a frame-level pass over the official Steam Store movie rows and Store-page inline media for `Vampire Crawlers: The Turbo Wildcard from Vampire Survivors`.

Sources:

- Store movie API: https://store.steampowered.com/api/appdetails?appids=3265700&cc=us&l=en&filters=movies
- Store page: https://store.steampowered.com/app/3265700/Vampire_Crawlers/
- Main Store API baseline: https://store.steampowered.com/api/appdetails?appids=3265700&cc=us&l=en

## Evidence Boundary

- This is official Store media evidence, not direct installed-build, direct runtime, game-file, save, or patch-membership proof.
- Store trailers can contain marketing captions, cinematic footage, adjacent Vampire Survivors material, and edited gameplay. Only frames that visibly show Vampire Crawlers first-person UI/gameplay should feed gameplay/UI rows.
- Trailer captions such as price jokes, release-date cards, and comic callouts are preserved as Store marketing evidence only. They are not in-game UI unless the frame also shows a game UI element.
- Frame text is recorded only when readable at 1280x720. Partial or ambiguous strings stay marked as partial candidates.
- The previous Store appdetails crawl recorded movie IDs, names, thumbnail markers, and screenshot observations. This crawl adds the `filters=movies` streaming URLs and sampled frame observations.

## Capture Method

Official HLS movie streams and Store-page inline MP4 assets were opened in a browser video element, seeked to fixed timestamps, and captured at a 1280x720 viewport.

| Media | Sampling |
| --- | --- |
| Main Store HLS movies | 5-second cadence |
| Store-page inline MP4 extras | 2-second cadence |
| Frame use | Text/UI candidates only; no runtime formula or patch proof |

## Media Inventory

| ID | Store Name / Asset | Source URL Type | Duration Observed | Sampled Frames | Notes |
| --- | --- | --- | ---: | ---: | --- |
| SM-257250926 | `Vampire Crawlers - First Gameplay` | HLS from `filters=movies` | about `65.5s` | 14 | Highest-value official frame source for card, event, Arcana/Fortune Teller-like, combat, and town exterior candidates. |
| SM-257323582 | `Vampire Crawlers - Launch ` | HLS from `filters=movies` | about `74.6s` | 13 | Confirms Gorton Bell exterior, stage/combat/boss surfaces, and Runetracer/Empty Tome card candidates. |
| SM-257228176 | `Vampire Crawlers - Announce` | HLS from `filters=movies` | about `93.6s` | 13 | Mixed cinematic/adjacent-series/trailer material; only later first-person UI frames are usable for Crawlers data. |
| SM-257306012 | `Vampire Crawlers - Launch Date Announcement` | HLS from `filters=movies` | about `52.4s` | 13 | Mostly release/price marketing captions with a few first-person gameplay snippets; captions are marketing, not in-game UI. |
| SM-EXTRA-A299 | Store page inline `a299aff2...` | Store-page MP4 extra | about `8.3s` | 5 | Short combat loop with readable Whip, Attractorb, Bracer, Runetracer, and hand/combo surfaces. |
| SM-EXTRA-B86E | Store page inline `b86e75e...` | Store-page MP4 extra | about `5.5s` | 5 | Short library combat loop with NO FUTURE and mixed card hand candidates. |
| SM-EXTRA-90F4 | Store page inline `90f4b5...` | Store-page MP4 extra | about `2.5s` | 5 | Library exploration loop; useful for movement/minimap only. |

## Usable Frame Observations

| Frame | Visible Surface | Readable / High-Confidence Text | Use | Limits |
| --- | --- | --- | --- | --- |
| SM-257250926 `00:00`-`00:10` | Forest movement and early combat | `Lv 1` to `Lv 3`; HP `50/50`; mana `2`; first-person directional controls and minimap | Confirms official Store movie uses first-person movement/combat UI matching screenshot baseline. | No exact event/rule text. |
| SM-257250926 `00:30` | Arcana/Fortune Teller-like selection room | `Mana Syphon`; `Increase Mana every 100 cards.`; `Over The Top`; `When a Crawler leaves, put them at the top of your Deck.`; `Equip`; `Confirm`; partial tabs `Wild Buff` and `Your Shield My Liege` | Strongest current official-media proof for Arcana selection text and Over The Top return-zone wording. | Does not prove unlock state, Fortune Teller entry, one-arcana limit, or runtime behavior. |
| SM-257250926 `00:35` | Mana offering table / spend-card event | `Spend a card to gain Mana.`; `Leave`; `Bone`; `Deal 60 damage to multiple enemies.`; `Magic Wand`; `Deal 544 damage. Prioritize attackers.`; `Garlic`; `Deal 96 damage to the front row. Disarm.`; `Candella`; `Projectiles hit 20% more times.`; `Runetracer`; `Armor`; `Empty Tome`; `Duplicator` | Adds official-media event text and high-resolution card-text candidates for Bone, Magic Wand, Garlic, Candella, and visible support cards. | It does not prove repeat rules, exact reward, or final current-build card values. |
| SM-257250926 `00:45` | Late combat with evolved cards | `Holy Wand`; `Deal 5,301 damage. Prioritize attackers. Evolved.`; tooltip `Evolved: This Card is more powerful and shiny.`; `Soul Eater` partial `Deal 27,000 damage to the front row. Heal 3. Disarm*? Evolved.`; `Runetracer`; `Deal 1,224 damage. Bounces to deal more damage.`; `Santa Water`; `Deal 2,652 damage. Burns enemies after this turn.`; `Candella` partial | Adds official-media evolved-card and tooltip candidates for Holy Wand, Soul Eater, Runetracer, Santa Water, and Evolved keyword help text. | Values appear trailer-state/build-specific; exact formulas and current build still need game-file/direct proof. |
| SM-257250926 `00:50` | Library combat / large enemy group | `Phiera Der Tuphello`; `Deal 5,332 damage.`; partial `Eight The Sparrow`; right-side queued card stack includes repeated `Friendship Amulet`; combo wheel `x7` visible | Adds official-media Phiera Der Tuphello candidate and high-card/stack surface. | Eight The Sparrow text is mostly obscured. |
| SM-257250926 `00:55` | Boss/elite visual | Large robed/red library enemy; combo wheel visible | Supports boss/elite visual queue for name mapping. | No readable boss name or reward. |
| SM-257323582 `00:25` | Village/town exterior | Building sign `THE GORTON BELL` | Official Store movie support for Gorton Bell Inn exterior naming. | Exterior only; no recruitment roster, price, purchase, or party UI. |
| SM-257323582 `00:45` | Combat hand | `Runetracer`; `Deal 150 damage. Bounces to deal more damage.`; `Empty Tome` partial `Add 1 Mana...` | Confirms Runetracer base text candidate at a different value than late-game trailer frame. | Empty Tome text is cropped; value differences show trailer-state scaling. |
| SM-257323582 `00:55` | Boss/elite visual | Large robed enemy on ritual circle; combo wheel `x1` | Adds official Store boss/elite visual candidate. | No name, HP, phase, reward, or stage label. |
| SM-257228176 `00:45`-`01:00` | First-person gameplay after mixed trailer material | Usable frames include forest/library first-person UI, `Hellfire`, `Bracelet`, `Parm Aegis`, `Coin Purse`, `Bloody Tear`, `Shadow Pinion`, `Golden Armor`, and large-hand combat candidates | Adds Store-trailer card-name candidates beyond still screenshots. | Earlier cinematic/top-down/adjacent-series frames are not Crawlers gameplay proof. Several card texts are partial. |
| SM-257228176 `00:55` | Library combat with Hellfire | `Hellfire`; `Deal 2,??? damage with 50% Knockback chance. Evolved.`; `Pasqualina`; `Increase Hand by 1. (2 Duration) Crawler`; `Armor`; `Add 2 Armor.`; `Runetracer` partial with `Cost+` / `Recover` visible | Cross-checks Store screenshot Hellfire/Pasqualina/Armor candidates and adds a different readable combat state. | Hellfire damage number is partly occluded. |
| SM-257228176 `01:00` | High-card / broken-build hand | `Bracelet`; `Deal 3,300 damage. Wild Return.`; `Parm Aegis`; `Add 40 Armor. Wild Amount.`; visible queued names include `Whip`, `Golden Armor`, `Bloody Tear`, `Shadow Pinion`, `Coin Purse` | Adds official-media Wild modifier candidates and high-card upper-bound visuals. | Hand is crowded; some card names/texts remain partial. |
| SM-257306012 `00:25` | Gameplay with trailer caption | Marketing caption `Edible Vampire Repeller`; visible repeated `Garlic`; text candidate `Deal 34 damage to the front row. Disarm.` | Supports Garlic base text candidate at a low-value trailer state. | Caption is marketing text, not in-game UI. |
| SM-257306012 `00:40` | Relic/interaction trailer callout | Marketing caption `A Hammer`; `300000 EUROS`; visible rope/hammer-like object | Preserves Store marketing object/callout candidate for later event/relic review. | Joke caption and euro amount are not in-game UI proof. |
| SM-EXTRA-A299 `00:00` | Combat hand | `Whip`; `Deal 189 damage to multiple enemies.`; `Attractorb`; `Draw 8 cards.`; `Armor`; `Add 2 Armor.`; `Knife`; `Runetracer`; `Fire Wand` partial | Adds readable Store-page inline-video card candidates. | Short loop only; no runtime proof. |
| SM-EXTRA-A299 `00:04` | Combat hand / modifier state | `Bracer`; `Increase Hand by 3`; visible `FREE`; right-side `Runetracer`; `Deal 360 damage. Bounces to deal more damage.`; combo wheel `x2` | Adds Bracer, Free marker, and Runetracer modifier candidates. | Does not prove how Free or hand increase was generated. |
| SM-EXTRA-B86E `00:00` | Library combat hand | `NO FUTURE`; `Clover`; `Whip`; `Carrello`; `Cherry Bomb`; partial NO FUTURE text ending in `Bounces and explode. Evolved.` | Adds NO FUTURE and mixed card-name candidates. | NO FUTURE text is partially obscured. |
| SM-EXTRA-90F4 `00:00`-`00:02` | Library exploration | `Lv 3`; HP `60/60`; mana `2`; first-person movement controls and minimap | Confirms Store-page inline-video movement/minimap surface. | No card/event text. |

## Rejected / Marketing-Only Frame Notes

| Frame Range | Reason |
| --- | --- |
| SM-257228176 `00:00`-`00:30` | Cinematic and adjacent-series framing, including `What's next for VAMPIRE SURVIVORS?`; not direct Crawlers gameplay/UI proof. |
| SM-257228176 `00:35`-`00:40` | Top-down Vampire Survivors-like material appears; preserve as trailer audit only, not Vampire Crawlers gameplay proof. |
| SM-257306012 `00:05`-`00:20`, `00:45`-end | Release-date, price, and platform marketing cards; useful for Store trailer audit only. |
| SM-257306012 overlay captions | Comic captions such as `Floor Chicken`, `A Hammer`, and `300000 EUROS` are trailer overlay text unless matched later to in-game UI/game files. |

## Capture Targets Added By This Crawl

- Use SM-257250926 `00:30` as the next high-resolution Arcana/Fortune Teller proof target for `Mana Syphon`, `Over The Top`, `Wild Buff`, and `Your Shield My Liege`.
- Use SM-257250926 `00:35` as a high-resolution Mana offering table/event proof target: confirm `Spend a card to gain Mana.`, exact card sacrifice result, and repeat rules.
- Use SM-257250926 `00:45`, SM-257228176 `00:55`, and SM-EXTRA-B86E `00:00` to cross-check evolved-card texts for Holy Wand, Hellfire, Soul Eater, NO FUTURE, and related ingredient cards.
- Use SM-257323582 `00:25` as official-media support for the `THE GORTON BELL` exterior while keeping Inn purchase/party details unresolved.
- Use SM-EXTRA-A299 `00:00` and `00:04` to refine low/mid-level Whip, Attractorb, Bracer, Runetracer, and Free-marker text candidates.
- Keep trailer-state numeric values separate from final implementation values until game files, high-resolution unedited gameplay, or direct play prove current-build formulas.
