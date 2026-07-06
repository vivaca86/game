# Reward Stage Component Source v002

Date: 2026-06-01

Source sheet:

- `assets/source/ui/reward_stage_components_v002.svg`

Purpose:

- Record the Reward-specific source direction for the fifth rebuild pass.
- Separate the Reward scene from the earlier shared Reward/Event source sheet so the screen can be judged on its own material language.

Component language:

- Centered prize-stage header with a separate small input badge.
- Side paper wings and folded paper flaps to make the scene read as a popup-book stage instead of a flat menu.
- Reward shelf and prize pedestals under the selectable cards.
- Reward cards with top type ribbon, numbered medallion, icon stamp, matted art window, description well, footer action strip, folded corners, and a default-selection tag.
- Type-specific accent color remains visible, but the paper material and hierarchy carry the main read.

Runtime mapping:

- `src/phaser/scenes/RewardScene.ts` maps this sheet into Phaser shapes and shared 9-slice slots.
- `renderRewardStage` draws the centered stage header, input badge, shelf, and tooltip/action area.
- `renderRewardChoiceCard` draws the top ribbon, medallion, icon stamp, matted art window, text well, footer action, folded corners, and default-selection tag.

Status:

- Source-direction evidence for a stronger Reward pass.
- Not final art approval.
- Not licensing/originality completion.
- Not enough to mark `UI skin` as `Done` without the score and screenshot gates in `docs/ui-visual-quality-rubric.md`.
