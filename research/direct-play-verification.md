# Direct Play Verification Plan

Status: `retired from active requirements / updated 2026-05-22 / kept for historical context only`

This file used to track direct-play verification for demo/full runtime evidence. It is no longer the active work track.

## Current User Directive

- Do not directly play, launch-control, or continue manipulating the demo/full game runtime.
- Full app `3265700` direct verification has been removed from active requirements.
- Demo direct-play tasks are historical/demo-scoped only unless the user explicitly resumes them later.
- Continue with non-play work only when useful: evidence-aware schema/import, conflict-safe seed data, and optional game-file proof if explicitly provided/approved.

## Superseding Documents

| Document | Use |
| --- | --- |
| [`remaining-proof-queue.md`](./remaining-proof-queue.md) | Current compact queue after removing full-app direct verification |
| [`non-play-continuation-checkpoint.md`](./non-play-continuation-checkpoint.md) | Latest user directive and non-play work order |
| [`source-only-closeout.md`](./source-only-closeout.md) | Source-only stop rule and current handoff summary |
| [`development-readiness-boundary.md`](./development-readiness-boundary.md) | What can safely be built now |
| [`evidence-aware-schema-plan.md`](./evidence-aware-schema-plan.md) | Implementation-facing schema/import/seed plan |
| [`demo-direct-play-verification.md`](./demo-direct-play-verification.md) | Historical demo-scoped observations only |

## Historical Evidence Boundary

The earlier direct-play plan preserved useful constraints:

- Adjacent-title evidence must not be treated as Vampire Crawlers proof.
- Demo app `4329470` evidence, where already recorded, remains demo-scoped only.
- Public/source-level evidence cannot finalize runtime formulas, UI text, save behavior, balance, or original parity.
- Game-file proof may still be useful in the future if explicitly provided/approved, but playing or launching the game is not active work.

## Removed From Active Requirements

| Former Requirement | Current State |
| --- | --- |
| Full app `3265700` direct install/build verification | Removed from active requirements |
| Full app first launch/save/town/options direct proof | Removed from active requirements |
| Full app direct first dungeon/combat/reward/event proof | Removed from active requirements |
| Balance runs as direct-play research | Removed from active research; future balance is development/tuning work |
| Demo direct-play checklist | Historical only unless explicitly resumed |

## Remaining Work Type

| Item | Current Handling |
| --- | --- |
| UI text finalization | Needs game-file/localization proof, UI evidence if later approved, or explicit implementation choice |
| Balance measurement | Development/tuning work, not public-source research |
| Original-identical implementation | Development/testing target; current implementation parity remains `0` |
| Source conflicts | Preserve as structured conflict IDs, aliases, and evidence flags in implementation data |

Do not use this file to reopen direct-play requirements. Use the superseding documents above for the next work step.
