# Dexerto Arcana Unlock Page Crawl

Status: `generated 2026-05-22 / source-level unlock table crawl`

Source URL: https://www.dexerto.com/wikis/vampire-crawlers/all-arcana--how-to-unlock/

This file stores the extracted Dexerto all-arcana table as a generated source-level artifact. It does not prove the full arcana roster, exact Fortune Teller UI, start-of-run selection, effect text, runtime formulas, or whether default/automatic arcanas are present in the target build.

## Crawl Notes

| Check | Result |
| --- | --- |
| Page fetched | 2026-05-22 |
| Tables found | 1 |
| Table headers | `Item`, `How to Get` |
| Data rows extracted | 10 |
| Empty item/unlock rows | 0 |
| Individual arcana page links exposed | 0 |
| `Experimental Medicine` present on Dexerto page | No |
| `Shield Bash` present on Dexerto page | No |

## Boundary Notes

- Dexerto currently exposes a single all-arcana unlock table rather than individual arcana pages.
- Dexerto's table supports the 10 public unlock-row side of the 10-vs-12 arcana conflict.
- `Experimental Medicine` and `Shield Bash` are not present on the Dexerto page; they remain secondary automatic/default candidates from other sources until Fortune Teller UI or game files confirm them.
- `Wild Buff Arcana` is listed as 200 light-source cards here, while the official-wiki value extract lists 250; `research/arcana-taxonomy-reconciliation.md` preserves that count conflict.
- This crawl is E1 source-level evidence only. Steam achievement metadata remains stronger official metadata for the 10 public achievement-backed rows.

## Extracted Rows

| Crawl ID | Dexerto Item | Dexerto How to Get | Notes |
| --- | --- | --- | --- |
| DEX-ARC001 | Wild Buff Arcana | Play 200 cards picked up from light sources | Unlock row only |
| DEX-ARC002 | Jester's Hat Arcana | Play 150 Wild cards | Unlock row only |
| DEX-ARC003 | Chain Link Arcana | Reach 12 Combo or above | Unlock row only |
| DEX-ARC004 | Your Shield My Liege Arcana | Gain 2,000 Armor | Unlock row only |
| DEX-ARC005 | Swollen Fist Arcana | Reach 40 Deck size | Unlock row only |
| DEX-ARC006 | And Another Arcana | Play 150 Free-to-Play cards | Supports the 150-count side of CON-019 |
| DEX-ARC007 | Make a Scene Arcana | Activate 1,500 Crawler trigger abilities | Unlock row only |
| DEX-ARC008 | Over The Top Arcana | Play Crawler cards 100 times | Unlock row only |
| DEX-ARC009 | Sharp Mind Arcana | Play purple cards 100 times | Unlock row only |
| DEX-ARC010 | Mana Syphon Arcana | Gain 15 Mana in a turn | Unlock row only |

## Required Follow-Up

- Verify the full arcana roster from Fortune Teller UI or game files, especially whether `Experimental Medicine` and `Shield Bash` are automatic/default arcanas.
- Resolve `Wild Buff` 200 vs official-wiki 250 light-source cards with in-game tracker, Town Hall, or game-file proof.
- Resolve the `And Another` 150-vs-500 unlock-count conflict with in-game tracker, Town Hall, or achievement proof.
- Capture exact effect text, selection limits, locked/unlocked states, Arcana Finder chest behavior, and runtime examples before implementation approval.
