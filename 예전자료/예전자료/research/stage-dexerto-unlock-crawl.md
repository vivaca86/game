# Dexerto Stage Unlock Page Crawl

Status: `generated 2026-05-22 / source-level unlock table crawl`

Source URL: https://www.dexerto.com/wikis/vampire-crawlers/all-stages--how-to-unlock/

This file stores the extracted Dexerto all-stages table as a generated source-level artifact. It does not prove the full playable-stage roster, exact world-map UI, route branches, boss names, floor counts, rewards, clear consequences, or persistence. The 13-row Dexerto boundary is reconciled against Steam, VID-002, official FAQ, and official-wiki layers in [`stage-taxonomy-reconciliation.md`](./stage-taxonomy-reconciliation.md).

## Crawl Notes

| Check | Result |
| --- | --- |
| Page fetched | 2026-05-22 |
| Tables found | 1 |
| Table headers | `Item`, `How to Get` |
| Data rows extracted | 13 |
| Empty item/unlock rows | 0 |
| Individual stage page links exposed | 0 |
| `Mad Forest` as Dexerto item row | No |
| `Milk Factory` as Dexerto item row | No |
| `Milk Factory` present in condition text | Yes |
| `Cappella` spelling present | Yes |
| `Capella` spelling present | No |

## Boundary Notes

- Dexerto currently exposes a single all-stages unlock table rather than individual stage pages.
- Dexerto's table supports the 13 unlock-row side of the 13/14/15/16 stage conflict.
- `Mad Forest` is not an item row in the Dexerto table and remains a likely default/start stage candidate from other sources and video metadata.
- `Milk Factory` is not an item row in the Dexerto table, but appears as the unlock condition for `Curd Refinery`; Steam achievement metadata separately exposes `Unlock Milk Factory`.
- Dexerto uses `Cappella` spelling for `Cappella Magna` and `Cappella Ultima`; the separate VID-002 `Capella Ultima` spelling remains a video-metadata conflict until high-resolution in-game UI resolves it.

## Extracted Rows

| Crawl ID | Dexerto Item | Dexerto How to Get | Notes |
| --- | --- | --- | --- |
| DEX-STG001 | Cappella Ultima | Complete Cappella Magna | Unlock row only |
| DEX-STG002 | Cappella Magna | Complete Meany Bridge | Unlock row only |
| DEX-STG003 | Curd Refinery | Complete Milk Factory | Mentions Milk Factory as prerequisite, not as item row |
| DEX-STG004 | Meany Bridge | Defeat the Giant Enemy Crab in Gallo Tower | Boss-gated unlock row |
| DEX-STG005 | Gallo Tower | Complete Weeny Bridge | Unlock row only |
| DEX-STG006 | Weeny Bridge | Reach Level 15 in Dairy Plant | Unlock row only |
| DEX-STG007 | Library Sanctum | Complete Library West Wing | Unlock row only |
| DEX-STG008 | Berserk Wood | Complete Furious Forest | Unlock row only |
| DEX-STG009 | Dairy Plant | Complete Teeny Bridge | Unlock row only |
| DEX-STG010 | Teeny Bridge | Reach Level 15 in Inlaid Library | Unlock row only |
| DEX-STG011 | Library West Wing | Complete Inlaid Library | Unlock row only |
| DEX-STG012 | Furious Forest | Complete Mad Forest | Mentions Mad Forest as prerequisite, not as item row |
| DEX-STG013 | Inlaid Library | Reach Level 10 in Mad Forest | Mentions Mad Forest as prerequisite, not as item row |

## Required Follow-Up

- Verify the full playable-stage roster from world-map/stage-select UI or game files, especially whether `Mad Forest` and `Milk Factory` are default, implicit, omitted, or separately tracked rows.
- Resolve the 13 Dexerto rows vs 14 Steam progression achievement rows vs 15 VID-002 chaptered stage candidates.
- Resolve `Cappella` vs `Capella` spelling from high-resolution stage-select UI or game files.
- Capture per-stage entry, boss, clear reward, unlock result, failure state, and persistence proof before implementation approval.
