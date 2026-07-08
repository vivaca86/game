# Reward/Event Stage Component Source v001

Date: 2026-06-01

Source sheet:

- `assets/source/ui/reward_event_stage_components_v001.svg`

Purpose:

- Provide source-level UI component evidence for the Reward/Event concept rebuild.
- Keep the visual language traceable instead of treating generated 9-slice assets or Phaser rectangles as final UI by themselves.

Component language:

- Layered warm paper panels with visible thickness.
- Coral and teal stage ribbons.
- Brass pins and hanging thread lines.
- Folded card corners.
- Reward cards with top badges, large art windows, material footer bands, and explicit selection affordance.
- Event choice cards with numeric medallions, cost/reward strips, and disabled-state room.
- Event diorama panels with a separate scene-art window and story text surface.

Runtime mapping:

- `src/phaser/scenes/RewardScene.ts` draws the reward stage, reward cards, pins, ribbons, folded corners, and reward detail labels from this source direction.
- `src/phaser/scenes/EventScene.ts` draws the event stage, diorama, scene-art window, and choice cards from this source direction.
- `src/phaser/view/sceneShell.ts` still provides shared 9-slice panels, buttons, slots, and tooltips.

Status:

- Source-direction evidence only.
- Not final art approval.
- Not licensing/originality completion.
- Not enough to mark `UI skin` as `Done` without the score and screenshot gates in `docs/ui-visual-quality-rubric.md`.
