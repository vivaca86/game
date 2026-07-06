# Gem Taxonomy Reconciliation

Status: `generated 2026-05-22 / source-level gem taxonomy reconciliation`

This artifact reconciles the 49 public Steam/Dexerto unlock rows against the 58 official-wiki gem infobox rows. It does not prove final in-game collection membership, exact effect text, valid socket targets, rarity pool behavior, or runtime formulas. Treat it as a capture queue for Jeweler, gem reward, collection UI, and game-file proof.

Primary inputs:

- `research/data-gems.md`
- `research/gem-dexerto-unlock-crawl.md`
- `research/official-wiki-card-gem-value-extract.md`
- `research/source-conflicts.md` CON-025 and CON-034
- Sources: SRC-006, SRC-105, SRC-131, SRC-141, SRC-146

## Reconciliation Snapshot

| Segment | Rows | Notes |
| --- | ---: | --- |
| Public Steam/Dexerto unlock rows | 49 | Achievement/checklist-facing rows tracked as GEM-001 through GEM-049 |
| Official-wiki gem infobox rows | 58 | Source-level wiki catalog rows with rarity/demo/unlock fields |
| Direct public-to-wiki name matches | 47 | Name-level only; not effect/runtime parity |
| Public rows not directly matched to one wiki row | 2 | `Mana Cost Gems` and `Mana Cost Gems 2` are public buckets, not one-to-one wiki names |
| Official-wiki rows not directly matched to a public unlock row | 11 | 7 Gem-Hammer/default rows plus 4 cost-modifier variant rows |
| Implementation parity closed by this file | 0 | Direct UI, game files, or runtime proof still required |

## Working Interpretation

The current source-level arithmetic is:

- 47 public rows match one official-wiki row by normalized name.
- 2 public rows, `Mana Cost Gems` and `Mana Cost Gems 2`, likely represent cost-modifier unlock buckets rather than final display names.
- The official wiki splits that cost-modifier area into 4 rows: `Increase Mana Cost` +1, `Increase Mana Cost` +2, `Reduce Mana Cost` -1, and `Reduce Mana Cost` -2.
- The remaining 7 official-wiki rows are Gem-Hammer/default-style rows not exposed as public unlock achievements in the current 49-row public table: `Amount`, `Area`, `Armor`, `Double Damage`, `Draw`, `Evolution`, and `Might`.

This is a taxonomy hypothesis, not a final roster decision. The official FAQ's `50+ gems` shorthand, the 49 public unlock rows, and the 58 official-wiki infobox rows should stay separate until collection UI, reward UI, Jeweler UI, or game files prove the shipped membership.

## Public 49 Rows vs Official-Wiki Rows

| Public Row | Public Name | Official-Wiki Match | Wiki Rarity / Demo | Mapping Note |
| --- | --- | --- | --- | --- |
| GEM-001 | Nduja Gem | Nduja | Uncommon/Yes | name-level match |
| GEM-002 | Fireproof Gem | Fireproof | Rare/No | name-level match |
| GEM-003 | Crawler Caller Gem | Crawler Caller | Rare/No | name-level match |
| GEM-004 | Yin Yang Gem | Yin Yang | Rare/No | name-level match |
| GEM-005 | Mana Rebate Gem | Mana Rebate | Ultra Rare/Yes | name-level match |
| GEM-006 | Blue Trigger Gem | Blue Trigger | Uncommon/No | name-level match |
| GEM-007 | Growth Gem | Growth | Uncommon/No | name-level match |
| GEM-008 | Bombard Gem | Bombard | Rare/No | name-level match |
| GEM-009 | Calcium Gem | Calcium | Rare/No | name-level match |
| GEM-010 | Countdown Gem | Countdown | Very Rare/No | name-level match |
| GEM-011 | Copy Gem | Copy | Very Rare/No | name-level match |
| GEM-012 | Decimate Gem | Decimate | Ultra Rare/No | name-level match |
| GEM-013 | Destroy Gem | Destroy | Rare/No | name-level match |
| GEM-014 | Easy Combo Gem | Easy Combo | Very Rare/Yes | name-level match |
| GEM-015 | Drain Gem | Drain | Rare/No | name-level match |
| GEM-016 | Duration Gem | Duration | Uncommon/No | name-level match |
| GEM-017 | Echo Gem | Echo | Rare/No | name-level match |
| GEM-018 | Free To Play Gem | Free To Play | Ultra Rare/No | name-level match |
| GEM-019 | Freeze Gem | Freeze | Rare/No | name-level match |
| GEM-020 | Restore Health Gem | Restore Health | Common/No | name-level match |
| GEM-021 | Coin Count Gem | Coin Count | Ultra Rare/No | name-level match |
| GEM-022 | Leader Gem | Leader | Very Rare/No | name-level match |
| GEM-023 | Luck Gem | Luck | Common/No | name-level match |
| GEM-024 | Magic Hat Gem | Magic Hat | Rare/No | name-level match |
| GEM-025 | Magnetic Gem | Magnetic | Very Rare/No | name-level match |
| GEM-026 | Mana Cost Gems | unmatched | unmatched | unresolved public bucket; likely split across Increase/Reduce Mana Cost +1/-1 rows, but UI proof required |
| GEM-027 | Mana Cost Gems 2 | unmatched | unmatched | unresolved public bucket; likely split across Increase/Reduce Mana Cost +2/-2 rows, but UI proof required |
| GEM-028 | Midas Gem | Midas | Very Rare/No | name-level match |
| GEM-029 | Purple Trigger Gem | Purple Trigger | Uncommon/No | name-level match |
| GEM-030 | Rainbow Gem | Rainbow | Rare/No | name-level match |
| GEM-031 | Red Trigger Gem | Red Trigger | Uncommon/No | name-level match |
| GEM-032 | Refund Gem | Refund | Uncommon/No | name-level match |
| GEM-033 | Remote Gem | Remote | Rare/No | name-level match |
| GEM-034 | Retain Gem | Retain | Uncommon/No | name-level match |
| GEM-035 | Return Gem | Return | Rare/Yes | name-level match |
| GEM-036 | Reverse Combo Gem | Reverse Combo | Rare/No | name-level match |
| GEM-037 | Kill Count Gem | Kill Count | Very Rare/No | name-level match |
| GEM-038 | Armor Strike Gem | Armor Strike | Very Rare/No | name-level match |
| GEM-039 | Recycle Gem | Recycle | Rare/No | name-level match |
| GEM-040 | Mug Gem | Mug | Common/No | name-level match |
| GEM-041 | Quick Draw Gem | Quick Draw | Uncommon/Yes | name-level match |
| GEM-042 | Coin Card Gem | Coin Card | Rare/Yes | name-level match |
| GEM-043 | Triple Damage Gem | Triple Damage | Rare/No | name-level match |
| GEM-044 | Uncrackable Gem | Uncrackable | Ultra Rare/No | wiki supports `Uncrackable`; secondary `Unbreakable` remains alias conflict |
| GEM-045 | Wild Gem | Wild | Ultra Rare/No | name-level match |
| GEM-046 | Mana X Damage Gem / X Mana Gem / X Mana | X Mana | Ultra Rare/No | alias match: public `Mana X Damage Gem` / Dexerto `X Mana Gem` vs wiki `X Mana` |
| GEM-047 | Mild Gem | Mild | Ultra Rare/No | name-level match |
| GEM-048 | Yellow Trigger Gem | Yellow Trigger | Uncommon/No | name-level match |
| GEM-049 | Greed Gem | Greed | Uncommon/No | name-level match |

## Official-Wiki Rows Outside Public 49 Direct Matches

| Official-Wiki Row | Rarity | Demo | Unlock Field | Taxonomy Note |
| --- | --- | --- | --- | --- |
| Amount | Rare | Yes | Unlocked when taking the Gem Hammer | Wiki-only/default-style row; no public unlock achievement row found |
| Area | Common | Yes | Unlocked when taking the Gem Hammer | Wiki-only/default-style row; no public unlock achievement row found |
| Armor | Common | Yes | Unlocked when taking the Gem Hammer | Wiki-only/default-style row; no public unlock achievement row found |
| Double Damage | Common | Yes | Unlocked when taking the Gem Hammer | Wiki-only/default-style row; no public unlock achievement row found |
| Draw | Rare | Yes | Unlocked when taking the Gem Hammer | Wiki-only/default-style row; no public unlock achievement row found |
| Evolution | Ultra Rare | Yes | Unlocked when taking the Gem Hammer | Wiki-only/default-style row; likely special evolution gem category; direct UI proof required |
| Might | Common | Yes | Unlocked when taking the Gem Hammer | Wiki-only/default-style row; no public unlock achievement row found |
| Increase Mana Cost | Common | No | Collecting 10 Mana orbs. | Cost-modifier split row; public table only has `Mana Cost Gems` bucket |
| Increase Mana Cost | Uncommon | No | Collecting 20 Mana orbs. | Cost-modifier split row; public table only has `Mana Cost Gems 2` bucket |
| Reduce Mana Cost | Common | No | Collecting 10 Mana orbs. | Cost-modifier split row; public table only has `Mana Cost Gems` bucket |
| Reduce Mana Cost | Rare | No | Collecting 20 Mana orbs. | Cost-modifier split row; public table only has `Mana Cost Gems 2` bucket |

## Direct Proof Queue

- Gem collection/Jeweler UI must confirm whether the 7 Gem-Hammer/default-style rows appear in the player-facing gem roster and how they are unlocked.
- Reward UI or game files must confirm whether `Mana Cost Gems` displays as two public unlock rows, four modifier rows, or a different in-game grouping.
- Exact UI must resolve whether the final display name is `Mana X Damage Gem`, `X Mana Gem`, or `X Mana`.
- Trickster reward UI must resolve `Uncrackable` vs `Unbreakable`.
- Rarity labels, valid socket targets, replacement/cancel flow, and level-up/chest/Jeweler pools remain unproven for all rows.
