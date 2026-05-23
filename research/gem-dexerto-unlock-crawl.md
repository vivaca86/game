# Dexerto Gem Unlock Page Crawl

Status: `generated 2026-05-22 / source-level unlock table crawl`

Source URL: https://www.dexerto.com/wikis/vampire-crawlers/all-gems--how-to-unlock/

This file stores the extracted Dexerto all-gems table as a generated source-level artifact. It does not prove exact in-game effects, rarity, socket behavior, card targets, replacement rules, or runtime behavior.

## Crawl Notes

| Check | Result |
| --- | --- |
| Page fetched | 2026-05-22 |
| Tables found | 1 |
| Table headers | `Item`, `How to Get` |
| Data rows extracted | 49 |
| Empty item/unlock rows | 0 |
| Individual gem page links exposed | 0 |
| Stable `/wikis/vampire-crawlers/gems/` index | Not confirmed in this probe |
| Card/character links on page | Present, but not gem-specific pages |

## Boundary Notes

- Dexerto currently exposes a single all-gems unlock table rather than individual gem pages.
- Row 46 is named `X Mana Gem` in the Dexerto table, while Steam achievement metadata names the related row `Mana X Damage Gem`. Preserve both labels until in-game UI, reward popup text, or game files resolve the exact original name and effect.
- This crawl is E1 source-level evidence only. Steam achievement metadata remains the stronger official metadata source for achievement names, but neither source proves runtime effect text or formulas.

## Extracted Rows

| Crawl ID | Dexerto Item | Dexerto How to Get | Notes |
| --- | --- | --- | --- |
| DEX-GEM001 | Nduja Gem | Defeat Nesufritto | Unlock row only |
| DEX-GEM002 | Fireproof Gem | Complete Curd Refinery | Unlock row only |
| DEX-GEM003 | Crawler Caller Gem | Complete Library Sanctum | Unlock row only |
| DEX-GEM004 | Yin Yang Gem | Complete Berserk Wood | Unlock row only |
| DEX-GEM005 | Mana Rebate Gem | Gain 15 Mana in a turn | Unlock row only |
| DEX-GEM006 | Blue Trigger Gem | Play 250 blue cards | Unlock row only |
| DEX-GEM007 | Growth Gem | Play Crown cards 5 times | Unlock row only |
| DEX-GEM008 | Bombard Gem | Play Cherry Bomb cards 50 times | Unlock row only |
| DEX-GEM009 | Calcium Gem | Play Bone cards 99 times | Unlock row only |
| DEX-GEM010 | Countdown Gem | Play Empty Tome cards 321 times | Unlock row only |
| DEX-GEM011 | Copy Gem | Play 1,000 cards | Unlock row only |
| DEX-GEM012 | Decimate Gem | Deal 666,666 damage | Unlock row only |
| DEX-GEM013 | Destroy Gem | Play 100 cards picked up from light sources | Unlock row only |
| DEX-GEM014 | Easy Combo Gem | Reach 5 Combo or above | Unlock row only |
| DEX-GEM015 | Drain Gem | Heal 1,500 HP | Unlock row only |
| DEX-GEM016 | Duration Gem | Play Spellbinder cards 10 times | Unlock row only |
| DEX-GEM017 | Echo Gem | Play 3,000 cards | Unlock row only |
| DEX-GEM018 | Free To Play Gem | Play 200 Free-to-Play cards | Unlock row only |
| DEX-GEM019 | Freeze Gem | Play Clock Lancet card | Unlock row only |
| DEX-GEM020 | Restore Health Gem | Play Pummarola cards 10 times | Unlock row only |
| DEX-GEM021 | Coin Count Gem | Collect 100,000 coins | Unlock row only |
| DEX-GEM022 | Leader Gem | Deal 100,000 damage | Unlock row only |
| DEX-GEM023 | Luck Gem | Play Clover cards 5 times | Unlock row only |
| DEX-GEM024 | Magic Hat Gem | Play Peachone cards 77 times | Unlock row only |
| DEX-GEM025 | Magnetic Gem | Play 2,000 cards | Unlock row only |
| DEX-GEM026 | Mana Cost Gems | Collect 10 Mana Orbs | Unlock row only |
| DEX-GEM027 | Mana Cost Gems 2 | Collect 20 Mana Orbs | Unlock row only |
| DEX-GEM028 | Midas Gem | Collect 5,555 coins | Unlock row only |
| DEX-GEM029 | Purple Trigger Gem | Play purple cards 250 times | Unlock row only |
| DEX-GEM030 | Rainbow Gem | Activate 500 Crawler trigger abilities | Unlock row only |
| DEX-GEM031 | Red Trigger Gem | Play 500 red cards | Unlock row only |
| DEX-GEM032 | Refund Gem | Gain 10 Mana in a turn | Unlock row only |
| DEX-GEM033 | Remote Gem | Destroy 5 Mine Carts | Unlock row only |
| DEX-GEM034 | Retain Gem | Have 7 cards in a Hand | Unlock row only |
| DEX-GEM035 | Return Gem | Play 300 cards | Unlock row only |
| DEX-GEM036 | Reverse Combo Gem | Reach 6 Combo or above | Unlock row only |
| DEX-GEM037 | Kill Count Gem | Defeat a total of 10,000 enemies | Unlock row only |
| DEX-GEM038 | Armor Strike Gem | Gain 15 Armor in a turn | Unlock row only |
| DEX-GEM039 | Recycle Gem | Have 8 cards in a Hand | Unlock row only |
| DEX-GEM040 | Mug Gem | Collect 3,333 coins | Unlock row only |
| DEX-GEM041 | Quick Draw Gem | Reach 30 Deck size | Unlock row only |
| DEX-GEM042 | Coin Card Gem | Find and play 20 Big Coin Bag cards | Unlock row only |
| DEX-GEM043 | Triple Damage Gem | Deal 500,000 damage | Unlock row only |
| DEX-GEM044 | Uncrackable Gem | Defeat The Trickster | Unlock row only |
| DEX-GEM045 | Wild Gem | Play 100 Wild cards | Unlock row only |
| DEX-GEM046 | X Mana Gem | Play purple cards 3,000 times | Name conflicts with Steam `Mana X Damage Gem` |
| DEX-GEM047 | Mild Gem | Complete Gallo Tower with Gallo | Unlock row only |
| DEX-GEM048 | Yellow Trigger Gem | Play 250 yellow cards | Unlock row only |
| DEX-GEM049 | Greed Gem | Play Stone Mask cards 10 times | Unlock row only |

## Required Follow-Up

- Resolve `X Mana Gem` vs `Mana X Damage Gem` from in-game gem UI, reward popup text, or game files.
- Confirm whether the Dexerto 49-row table matches the target Steam build's complete gem catalog.
- Capture exact effect text, rarity, socket targets, replacement/cancel behavior, reward pools, and at least one runtime example per effect family before implementation approval.
