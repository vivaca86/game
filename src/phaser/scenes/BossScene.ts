import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { InputAction } from "../../input/actions";
import { bindKeyboardActions } from "../../input/bindings";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderCombatFeedbackEffect, renderCombatPanel } from "./CombatScene";
import { renderSceneShell, textStyle } from "../view/sceneShell";

export class BossScene extends Phaser.Scene {
  constructor() {
    super("BossScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "Boss Combat",
      subtitle: "phase trigger is simulation state",
      focusLabel: "Boss room",
      showHand: true,
      onCardClick: (index) => handleSceneAction(this, context, `card_${index + 1}` as InputAction)
    });

    renderCombatPanel(this, context, 0x3c3143, 0xf0c36a, "#fff5d7", "#f5c26b");
    renderCombatFeedbackEffect(this, context);
    this.add.text(
      95,
      472,
      `Boss phase ${context.run.combat?.bossPhaseTriggered ? "triggered" : "waiting"} / bonus ${context.run.combat?.pendingAttackBonus ?? 0}`,
      textStyle(22, "#805845")
    );
    renderBossEndTurnButton(this, context);

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action));
    renderDebugOverlay(context, "BossScene");
  }
}

function renderBossEndTurnButton(scene: Phaser.Scene, context: BootContext): void {
  const button = scene.add.rectangle(1470, 616, 190, 52, 0x32415a, 0.94);
  button.setStrokeStyle(3, 0xf5c26b, 0.95);
  button.setInteractive({ useHandCursor: true });
  button.on("pointerdown", () => handleSceneAction(scene, context, "end_turn"));
  scene.add.text(1400, 600, "End Turn", textStyle(22, "#fff5d7", true));
}
