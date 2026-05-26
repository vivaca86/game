import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell, textStyle } from "../view/sceneShell";

export class RewardScene extends Phaser.Scene {
  constructor() {
    super("RewardScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "보상 선택",
      subtitle: "reward pool entry",
      focusLabel: "보상 풀"
    });

    const rewardPool = context.dataBundle.rewardPools.find((item) => item.id === context.debug.rewardPoolId)
      ?? context.dataBundle.rewardPools[0];
    if (rewardPool) {
      this.add.text(1060, 500, rewardPool.displayNameKo, textStyle(34, "#32415a", true));
      rewardPool.entries.slice(0, 3).forEach((entry, index) => {
        this.add.text(1060, 560 + index * 44, `${entry.type}: ${entry.contentId ?? entry.amount}`, textStyle(24, "#805845"));
      });
    }

    renderDebugOverlay(context, "RewardScene");
  }
}
