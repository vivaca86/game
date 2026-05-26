import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { bindKeyboardActions } from "../../input/bindings";
import { selectRewardEntries } from "../../simulation/state/runState";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderSceneShell, textStyle } from "../view/sceneShell";

export class RewardScene extends Phaser.Scene {
  constructor() {
    super("RewardScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "Reward",
      subtitle: "first option is claimed by Enter",
      focusLabel: "Reward pool"
    });

    const rewardPool = context.dataBundle.rewardPools.find((item) => item.id === context.run.rewardPoolId)
      ?? context.dataBundle.rewardPools[0];
    const offers = selectRewardEntries(
      context.dataBundle,
      context.run.rewardPoolId,
      Math.max(1, context.run.offeredRewards.length)
    ).filter((entry) => context.run.offeredRewards.length === 0 || context.run.offeredRewards.includes(entry.id));

    this.add.text(1060, 500, rewardPool?.displayNameKo ?? "missing reward pool", textStyle(34, "#32415a", true));
    offers.slice(0, 4).forEach((entry, index) => {
      this.add.text(1060, 560 + index * 42, `${index + 1}. ${entry.type}: ${entry.contentId ?? entry.amount}`, textStyle(23, "#805845"));
    });
    renderActionButton(this, 1010, 742, "Claim Reward", () => handleSceneAction(this, context, "confirm"));

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action));
    renderDebugOverlay(context, "RewardScene");
  }
}
