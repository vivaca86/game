# GameSpot Relic Page Crawl

Status: `generated 2026-05-22 / source-level relic page crawl`

Source URL: https://www.gamespot.com/articles/vampire-crawlers-all-relics-and-where-to-get-them/1100-6539334/

This file stores the extracted GameSpot all-relic page as a generated source-level artifact. It does not prove exact in-game relic panel text, Museum toggle behavior, disabled-relic behavior, save persistence, runtime formulas, or final unlock routes.

## Crawl Notes

| Check | Result |
| --- | --- |
| Page fetched | 2026-05-22 |
| Page title | `Vampire Crawlers - All Relics And Where To Get Them` |
| Published timestamp shown | `April 21, 2026 at 5:16PM PDT` |
| Visible relic data shape | `Relic`, `Description`, `Unlock Stage` |
| Data rows extracted | 15 |
| Empty relic names | 0 |
| Empty descriptions | 0 |
| Empty unlock-stage cells | 1 |
| Individual relic page links exposed inside rows | 0 |
| Toggle context present | Yes, article text says relics can be toggled off/on and hovered over |
| Future-update caveat present | Yes, article says more relics may be added in future updates |

## Boundary Notes

- GameSpot exposes a single all-relic list rather than individual relic pages.
- The page accounts for 15 visible relic rows, matching the working 15-slot relic roster.
- `Rilevatore` is listed as a `Curd Refinery` relic here, which conflicts with GAMES.GG's starting-relic claim.
- `Ultimate Ultra Overkill` has an effect row but no visible unlock-stage value in this page crawl; keep its location unresolved until Museum/UI, high-resolution video, direct play, or game files confirm it.
- GameSpot uses `Combo Stack`, while the VID-001 storyboard appears to read `Combo Stash`. Keep both labels until full-resolution or direct proof resolves the in-game spelling.
- `Randomazzo` is the GameSpot row name, while VID-005 storyboard evidence reads `Arcana Finder` on a relic-found panel. Do not collapse those names without stronger proof.
- `Polentir` is listed as `Furious Forest` here, while the official-wiki value extract lists `Fortune Forest`; `research/relic-taxonomy-reconciliation.md` preserves that route-text conflict.

## Extracted Rows

| Crawl ID | GameSpot Relic | GameSpot Description | GameSpot Unlock Stage | Notes |
| --- | --- | --- | --- | --- |
| GS-REL001 | Stardust Anvil | Unlocks the Blacksmith's Workshop | Teeny Bridge | Unlocks Blacksmith surface; exact UI/costs still need proof |
| GS-REL002 | Bomba Infernale | Vaporizes all enemies on the first floor of any dungeon you've cleared | Dairy Plant | Supports Bomba Infernale effect-family hint; VID-005 panel mapping still unresolved |
| GS-REL003 | Gem Hammer | Allows you to add gems to cards | Mad Forest | Supports socket-access hint; exact gem-station authorization still needs proof |
| GS-REL004 | Grim Grimoire | Adds a list of discovered weapon evolutions/unions to the pause menu | Library West Wing | Supports evolution-reference hint; exact pause-menu UI still needs proof |
| GS-REL005 | Guiding Light | Shows where breakable light sources are located on the map | Inlaid Library | Supports breakable-light map hint; runtime impact still needs proof |
| GS-REL006 | Lapidary Loupe | Allows you to increase/decrease the spawn rate of specific gems or seal them | Gallo Tower | Supports Jeweller/sealing hint; exact building/menu split still needs proof |
| GS-REL007 | Milky Way Map | Shows enemy positions and other information on the map | N/A | Supports starting/no-stage side; fresh-save and Museum proof still required |
| GS-REL008 | Ovenkilt | Triggers overkill on the last enemy of any encounter, but chests no longer grant gold | Cappella Ultima | Supports endgame economy hint; exact reward math still needs proof |
| GS-REL009 | Overkill | Allows you to keep attacking defeated bosses to earn gold | Teeny Bridge | Supports boss-overkill economy hint; cap/formula still needs proof |
| GS-REL010 | Combo Stack | Allows you to play cards in ascending mana cost order to create a combo multiplier | Tutorial | Name conflicts with VID-001 `Combo Stash` reading |
| GS-REL011 | Polentír | Unlocks the Arcana Tent | Furious Forest | Supports Fortune Teller/Arcana access hint; exact spelling/UI still needs proof |
| GS-REL012 | Randomazzo | Adds Arcana events to dungeons | Library Sanctum | Name conflicts with VID-005 `Arcana Finder` panel reading |
| GS-REL013 | Rilevatore | Shows how weapons will affect enemies | Curd Refinery | Location conflicts with GAMES.GG starting-relic claim |
| GS-REL014 | Sorceress' Tears | Increases game speed | Gallo Tower | Supports Hurry/speed hint; exact setting/timing still needs proof |
| GS-REL015 | Ultimate Ultra Overkill | Increases the damage cap to 5,000 for the Overkill relic |  | Visible page text has no unlock-stage value for this row |

## Required Follow-Up

- Resolve `Rilevatore` starting vs `Curd Refinery` from fresh-save/Museum/direct proof.
- Resolve `Ultimate Ultra Overkill` location from Museum/UI, high-resolution video, direct play, or game files.
- Resolve `Polentir` `Furious Forest` vs official-wiki `Fortune Forest` route wording from Museum/UI, high-resolution video, direct play, or game files.
- Resolve `Combo Stack` vs `Combo Stash` and `Randomazzo` vs `Arcana Finder` from full-resolution in-game text.
- Capture exact relic panel text, toggle state, disabled behavior, persistence, and one runtime consequence for each relic before implementation approval.
