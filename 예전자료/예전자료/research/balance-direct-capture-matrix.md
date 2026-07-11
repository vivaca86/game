# Balance Direct Capture Matrix

Status: `generated 2026-05-22 / direct-proof execution matrix / blocked until app 3265700 or game files are available`

This matrix converts the current balance gap into capture packets. It does not resolve balance by itself. Balance claims still require direct-play captures from the installed game or verified game-file/runtime evidence.

## Evidence Boundary

Current balance rows are storyboard/source-level only. `balance-notes.md` has useful candidates, but VID-002, VID-005, and VID-011 do not contain measured combat intervals, readable cap values, or a verified current-build runtime baseline. Do not tune implementation values or claim parity from those rows alone.

A balance row can move beyond candidate status only when the packet includes:

- App/build baseline, branch, platform, language, and save state.
- Full-resolution video or screenshots with timestamps.
- A repeatable route/stage/character/deck state.
- Measured timing, combat, reward, pressure, and result fields.
- Backfill into `balance-notes.md`, the relevant domain matrix, and any closed `source-conflicts.md` rows.

## Related Files

| File | Use |
| --- | --- |
| [`direct-play-verification.md`](./direct-play-verification.md) DP-301 to DP-304 | Parent balance task list |
| [`balance-notes.md`](./balance-notes.md) | Balance observation table and completion criteria |
| [`remaining-proof-queue.md`](./remaining-proof-queue.md) | Current proof gate and sequencing |
| [`flow-videos.md`](./flow-videos.md) | Video candidates and contamination notes |
| [`card-direct-capture-matrix.md`](./card-direct-capture-matrix.md) | Card order, costs, Wild, evolution, and deck mutation links |
| [`gem-direct-capture-matrix.md`](./gem-direct-capture-matrix.md) | Gem rarity, socket, replacement, and runtime effect links |
| [`character-inn-direct-capture-matrix.md`](./character-inn-direct-capture-matrix.md) | Character, starter deck, passive, and party-state links |
| [`stage-route-direct-capture-matrix.md`](./stage-route-direct-capture-matrix.md) | Stage family, route, floor, boss, clear/failure, and persistence links |
| [`town-powerup-relic-arcana-direct-capture-matrix.md`](./town-powerup-relic-arcana-direct-capture-matrix.md) | Power-Up, relic, Arcana, economy, shop, and Museum links |
| [`event-direct-capture-matrix.md`](./event-direct-capture-matrix.md) | Event/station/chest reward and cost links |
| [`achievement-townhall-direct-capture-matrix.md`](./achievement-townhall-direct-capture-matrix.md) | Unlock, Town Hall, and platform-achievement timing links |
| [`source-conflicts.md`](./source-conflicts.md) | Cap, Wild, gem, Power-Up, Trickster, and overkill conflicts |

## Sampling Targets

| Target | Minimum Direct Samples | Parent Task | Notes |
| --- | ---: | --- | --- |
| Early run pacing | 5 runs | DP-301 | New or stable baseline; capture first combat, reward interval, card-use count, HP pressure |
| Major stage families | 3 runs per family | DP-302 | Compare fight duration, room cadence, boss pressure, and clear/failure state |
| Broken/endgame upper bound | 1 verified run | DP-303 | Must have readable combo/cap/loop/result proof |
| Failure or near-failure pressure | 3 runs | DP-304 | Capture death/near-death cause, result screen, save behavior, and recovery options |
| Repeatability | 2+ repeats of any disputed packet | DP-301 to DP-304 | Repeat with same build/save assumptions or explicitly document differences |

Candidate video queues can guide packet selection but cannot satisfy the packet alone: VID-002 full-route, VID-003 Mad Forest, VID-004 Inlaid Library, VID-005 Library Sanctum, VID-006 Teeny Bridge, VID-007 Dairy Plant, VID-008 Milk Factory failure/restart candidate, VID-009 Gallo Tower, VID-010 Cappella/Ultima late-game, VID-011 broken-build candidate, and VID-012 failure/near-failure candidate.

## Capture Packet Standard

Each packet should record these fields before it can backfill `balance-notes.md`:

| Field | Required Details |
| --- | --- |
| Build baseline | App `3265700`, build ID, branch, timestamp, OS, language, input mode, save slot |
| Run identity | Packet ID, stage, floor/route if visible, character/party, starting deck, unlocked Power-Ups/relics/Arcana |
| Start state | Currency, HP/max HP, level, collection state, selected difficulty/modifier, relevant toggles |
| Timing markers | Run start, first combat, each combat start/end, reward open/close, first gem, first evolution, boss start/end, clear/death |
| Combat metrics | Enemy/boss name if readable, turns/rounds, cards used, mana sequence, max Combo/TurboTurn, damage dealt/taken, healing/defense |
| Reward metrics | Chest/level/event/gem station type, reward count, reroll/skip/cancel, selected reward, deck before/after |
| Pressure metrics | Lowest HP, lethal/near-lethal turn, recovery source, boss pressure, room density, failed chain/reset cause |
| Economy metrics | Coin income, shop spend, Power-Up rank/cost, reroll/respec cost, relic or Arcana purchase/unlock effect |
| Cap and edge metrics | Combo reset/cap, Wild carryover, gem-created Wild, Arcana-modified Wild, overkill/U.U.O./Over The Top behavior |
| Persistence | Result screen, Town Hall/achievement unlocks, save/relaunch state, inventory/collection mutation |
| Source resolution | Which `source-conflicts.md` rows or domain matrix rows are resolved, rejected, or kept open |
| Implementation output | Only after proof: exact value/formula/acceptance test; otherwise mark `do not implement from this packet` |

## Priority Matrix

### P0 - Baseline and Instrumentation

| Packet | Required Capture | Metrics | Done When | Backfill |
| --- | --- | --- | --- | --- |
| BAL-DP-001 | Installed app/build baseline before any run | Build ID, branch, timestamp, OS, language, save slot | Packet is tied to a current build and save state | `direct-play-verification.md` DP-001, `source-index.md` |
| BAL-DP-002 | Fresh or stable save split for balance work | New save, progressed save, unlocked state, relaunch state | Later runs can be attributed to a known progression baseline | `direct-play-verification.md` DP-003, `balance-notes.md` |
| BAL-DP-003 | Timing marker dry run | Start, first combat, reward, boss, clear/failure marker format | The recorder can capture repeatable timing fields without ambiguity | `balance-notes.md` column definitions |
| BAL-DP-004 | HUD and text readability check | HP, level, combo, mana, card costs, rewards, modifiers | Captures are readable enough to avoid thumbnail inference | All balance packets |
| BAL-DP-005 | Route and stage-family naming check | Stage-select label, floor label, route text, modifier text | A run can be mapped to a domain row without guessing | `stage-route-direct-capture-matrix.md` |
| BAL-DP-006 | Backfill template check | Packet evidence path, row IDs, status terms, rejection reason | Failed or unreadable captures have a consistent rejection path | `remaining-proof-queue.md`, `source-conflicts.md` |

### P1 - Early and Full-Run Pacing

| Packet | Required Capture | Metrics | Done When | Backfill |
| --- | --- | --- | --- | --- |
| BAL-DP-007 | Early run sample 1 from new/stable baseline | First combat time, first reward interval, cards/combat, lowest HP | One complete early-run row is measured | DP-301, `balance-notes.md` |
| BAL-DP-008 | Early run sample 2 from same baseline class | Same as BAL-DP-007 | A second comparable early-run row exists | DP-301, `balance-notes.md` |
| BAL-DP-009 | Early run sample 3 from same baseline class | Same as BAL-DP-007 | A third comparable early-run row exists | DP-301, `balance-notes.md` |
| BAL-DP-010 | Early run sample 4 from same baseline class | Same as BAL-DP-007 | A fourth comparable early-run row exists | DP-301, `balance-notes.md` |
| BAL-DP-011 | Early run sample 5 from same baseline class | Same as BAL-DP-007 | Five early samples exist before broad pacing claims | DP-301, `balance-notes.md` |
| BAL-DP-012 | Full-route sanity run candidate | Stage transitions, reward cadence, boss intervals, result time | A full-route row has current-build timing, not only VID-002 storyboard | `flow-videos.md`, `balance-notes.md` |
| BAL-DP-013 | Library/longplay pacing run candidate | Combat intervals, reward surfaces, boss pressure, clear/result | Library Sanctum pacing is measured rather than inferred from VID-005 | `balance-notes.md`, stage matrix |
| BAL-DP-014 | Reward cadence sweep | Level-up/chest/gem/event interval, reroll/skip/cancel usage | Reward frequency and downtime are measured across a visible stretch | card/gem/event matrices |
| BAL-DP-015 | First evolution and first gem timing | First evolution timestamp, ingredient consumption, socket mutation | Early power growth has a direct timing row | card/gem matrices, `balance-notes.md` |

### P2 - Stage-Family Sampling

| Packet | Required Capture | Metrics | Done When | Backfill |
| --- | --- | --- | --- | --- |
| BAL-DP-016 | Forest/open stage family, 3 runs | Fight duration, room cadence, boss pressure, clear/failure | Forest-family timing is comparable across three samples | DP-302, stage matrix |
| BAL-DP-017 | Library/corridor stage family, 3 runs | Same metrics as BAL-DP-016 | Library-family timing is comparable across three samples | DP-302, stage matrix |
| BAL-DP-018 | Factory/plant stage family, 3 runs | Same metrics as BAL-DP-016 plus failure/restart if present | Factory-family timing is comparable across three samples | DP-302, stage matrix |
| BAL-DP-019 | Tower/vertical stage family, 3 runs | Same metrics as BAL-DP-016 | Tower-family timing is comparable across three samples | DP-302, stage matrix |
| BAL-DP-020 | Bridge/narrow route family, 3 runs | Same metrics as BAL-DP-016 plus movement choke points | Bridge-family timing is comparable across three samples | DP-302, stage matrix |
| BAL-DP-021 | Late-game/Cappella/Ultima family, 3 runs | Boss duration, pressure spikes, reward density, result state | Late-game timing is measured instead of relying on VID-010 | DP-302, stage matrix |
| BAL-DP-022 | Boss-pressure comparison pass | Boss start/end, damage taken, recovery, reward/result | Boss pressure can be compared across at least three families | enemy/stage matrices |
| BAL-DP-023 | Event-heavy route comparison pass | Event costs, reward tempo, invalid states, repeat rules | Event impact on pacing is measured and classified | event matrix, `balance-notes.md` |
| BAL-DP-024 | Room cadence repeatability pass | Room entry/exit times and combat density over repeated route | Room cadence has repeatable values or documented variance | stage matrix |
| BAL-DP-025 | Three-runs-per-family aggregation | Mean/range only after samples exist | No aggregate is computed until source rows are complete | `balance-notes.md` summary section |
| BAL-DP-026 | Clear/failure result timing by family | Clear/death screen time, reward grant, save state | Result timing is tied to each family and baseline | DP-304, stage matrix |

### P3 - Systems, Scaling, and Cap Edge Cases

| Packet | Required Capture | Metrics | Done When | Backfill |
| --- | --- | --- | --- | --- |
| BAL-DP-027 | Combo/TurboTurn normal, max, and reset cases | Stack value, reset trigger, cap, turn boundary | CON-004 has direct proof or remains explicitly open | `source-conflicts.md`, DP-103 |
| BAL-DP-028 | Wild normal and failed-chain behavior | Wild generation, consumption, carryover, failed mana gap | Normal Wild behavior is separated from edge cases | CON-005, card matrix |
| BAL-DP-029 | Gem-created and Arcana-modified Wild behavior | Source of Wild, modified count/effect, turn-to-turn state | Wild edge cases are not merged with normal Wild rules | CON-005, gem/arcana rows |
| BAL-DP-030 | Gem rarity and reward-selection behavior | Offered rarity, socket target, replacement/cancel, effect timing | Gem pool and selection pacing are measured | CON-006, gem matrix |
| BAL-DP-031 | Evolution timing and deck mutation | Ingredients, timing, before/after deck, destroyed-after-use state | Evolution speed and deck impact are directly observed | card matrix, `balance-notes.md` |
| BAL-DP-032 | Power-Up rank and shop scaling | Cost, rank, stat delta, refund/respec, run-found split | Power-Up balance effects use UI/game proof | CON-027, CON-038, town matrix |
| BAL-DP-033 | Relic and Arcana scaling pass | Effect activation, modifier stack, unlock route, persistence | Relic/Arcana scaling is tied to a verified run state | CON-020, CON-039, CON-044 |
| BAL-DP-034 | Overkill/U.U.O./Over The Top cap behavior | Overkill number, reward, return zone, cap/reset if visible | Overkill claims are based on readable current-build evidence | CON-020, relic/arcana rows |
| BAL-DP-035 | Trickster or special-boss pressure pass | Boss stats, damage, reward, trigger, route state | Trickster scaling is not inferred from static wiki fields | CON-030, enemy matrix |
| BAL-DP-036 | Economy pacing and recovery pressure | Coin income, spend points, rerolls, healing, defense, HP trough | Economy and survival pressure can be linked to route timing | town/event/card matrices |
| BAL-DP-037 | Damage/healing/defense order pass | Incoming damage, shield/defense, healing, status effects | HP pressure rows can explain why a run survived or failed | enemy/card/gem matrices |

### P4 - Failure, Endgame, Repeatability, and Backfill

| Packet | Required Capture | Metrics | Done When | Backfill |
| --- | --- | --- | --- | --- |
| BAL-DP-038 | Verified broken/endgame build run | Loop condition, combo/cap, deck state, result | DP-303 has at least one readable current-build upper-bound row | `balance-notes.md`, CON-004/005 |
| BAL-DP-039 | Failure/near-failure sample 1 | Cause, HP trough, death/near-death frame, result/save | One failure-pressure row is measured | DP-304, FLOW-021 |
| BAL-DP-040 | Failure/near-failure sample 2 | Same as BAL-DP-039 | Two failure-pressure rows are measured | DP-304, FLOW-021 |
| BAL-DP-041 | Failure/near-failure sample 3 | Same as BAL-DP-039 | Three failure-pressure rows exist before failure claims | DP-304, FLOW-021 |
| BAL-DP-042 | Death/result/save behavior pass | Death screen, rewards kept/lost, town return, relaunch state | Failure state and persistence are classified | direct-play plan, stage matrix |
| BAL-DP-043 | Cross-character repeatability pass | Same route with different character/starter deck/passive | Balance claims note character variance instead of treating all runs as one bucket | character/card matrices |
| BAL-DP-044 | Save-state repeatability pass | Same route before/after unlocks, relaunch, cloud/demo boundary if available | Balance rows are tied to progression state | town/achievement matrices |
| BAL-DP-045 | Video-candidate reconciliation pass | Compare VID-002/003/004/005/006/007/008/009/010/011/012 against direct packets | Storyboard rows are upgraded, rejected, or kept as E3 candidates | `flow-videos.md`, `balance-notes.md` |
| BAL-DP-046 | Source-conflict closure pass | CON-004/005/006/020/027/030/038/039/045 status | Balance-affecting conflicts are closed only with direct proof | `source-conflicts.md` |
| BAL-DP-047 | Balance-notes backfill pass | Every measured row has evidence, metrics, and rejection notes where needed | `balance-notes.md` no longer mixes storyboard and measured rows without labels | `balance-notes.md` |
| BAL-DP-048 | Implementation acceptance-test pass | Formula/value/test names after direct proof exists | Implementation work has row-level acceptance conditions, or remains gated | future tests, `gap-map.md` |

## Stop Conditions

Stop and mark the packet unresolved if any of these occur:

- The installed app/build baseline is unknown.
- HUD numbers or result values are unreadable.
- The footage includes non-Crawlers material and the target frame cannot be isolated.
- A route, character, deck, Power-Up, relic, or Arcana state is unknown but materially affects the metric.
- The packet would require inferring formulas from static stats, thumbnails, trailer edits, or partial storyboards.
- A cap/reset claim depends on a counter that cannot be read frame-by-frame.

Do not implement tuning, formula caps, reward pacing, failure pressure, or upper-bound build behavior from an unresolved packet. Keep implementation parity at `0` for original-accurate balance until direct/current-build proof exists.

## Backfill Order

When a packet is resolved, update in this order:

1. This matrix packet row and/or `direct-play-verification.md` DP-301 to DP-304.
2. [`balance-notes.md`](./balance-notes.md) measured run table.
3. Any directly affected domain matrix: cards, gems, enemies, stages, events, town/meta, achievements.
4. [`source-conflicts.md`](./source-conflicts.md) if a conflict is closed, rejected, or still blocked.
5. Row-level `data-*`, `*-gap-map.md`, and `*-taxonomy-reconciliation.md` files only for proven changes.
6. [`gap-map.md`](./gap-map.md), [`RESEARCH_CHECKLIST.md`](../RESEARCH_CHECKLIST.md), and [`HANDOFF.md`](../HANDOFF.md) only after row-level files are stable.
