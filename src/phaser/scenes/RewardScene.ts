import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { RewardEntry } from "../../data/schema";
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
      const y = 560 + index * 52;
      renderRewardIcon(this, context, entry, 1038, y + 13);
      this.add.text(1076, y, `${index + 1}. ${rewardLabel(context, entry)}`, textStyle(23, "#805845"));
    });
    renderActionButton(this, 1010, 742, "Claim Reward", () => handleSceneAction(this, context, "confirm"));

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action));
    renderDebugOverlay(context, "RewardScene");
  }
}

function renderRewardIcon(
  scene: Phaser.Scene,
  context: BootContext,
  entry: RewardEntry,
  x: number,
  y: number
): void {
  const key = rewardIconKey(context, entry);
  if (key && scene.textures.exists(key)) {
    scene.add.image(x, y, key).setDisplaySize(36, 36);
    return;
  }

  scene.add.circle(x, y, 18, 0xf5c26b, 0.82).setStrokeStyle(2, 0x805845, 0.9);
}

function rewardIconKey(context: BootContext, entry: RewardEntry): string | undefined {
  if (entry.type === "card") {
    return context.dataBundle.cards.find((card) => card.id === entry.contentId)?.assetKeys.typeIcon;
  }
  if (entry.type === "rune") {
    return context.dataBundle.runes.find((rune) => rune.id === entry.contentId)?.assetKeys.icon;
  }
  if (entry.type === "relic") {
    return context.dataBundle.relics.find((relic) => relic.id === entry.contentId)?.assetKeys.icon;
  }
  if (entry.type === "arcana") {
    return context.dataBundle.arcanas.find((arcana) => arcana.id === entry.contentId)?.assetKeys.icon;
  }
  return undefined;
}

function rewardLabel(context: BootContext, entry: RewardEntry): string {
  const displayName = context.dataBundle.cards.find((card) => card.id === entry.contentId)?.displayNameKo
    ?? context.dataBundle.runes.find((rune) => rune.id === entry.contentId)?.displayNameKo
    ?? context.dataBundle.relics.find((relic) => relic.id === entry.contentId)?.displayNameKo
    ?? context.dataBundle.arcanas.find((arcana) => arcana.id === entry.contentId)?.displayNameKo;
  return `${entry.type}: ${displayName ?? entry.contentId ?? entry.amount ?? "reward"}`;
}
