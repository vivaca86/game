import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { InputAction } from "../../input/actions";
import { bindKeyboardActions } from "../../input/bindings";
import { getActiveIntent, getCombatantData } from "../../simulation/systems/combat/combatSystem";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell, textStyle } from "../view/sceneShell";

export class CombatScene extends Phaser.Scene {
  constructor() {
    super("CombatScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "Card Combat",
      subtitle: "1-5 play cards / E end turn",
      focusLabel: "Combat state",
      showHand: true,
      onCardClick: (index) => handleSceneAction(this, context, `card_${index + 1}` as InputAction)
    });

    renderCombatPanel(this, context, 0xfffbef, 0x8f5b42, "#1e2a3e", "#805845");
    renderCombatButtons(this, context);
    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action));
    renderDebugOverlay(context, "CombatScene");
  }
}

function renderCombatButtons(scene: Phaser.Scene, context: BootContext): void {
  const button = scene.add.rectangle(1380, 638, 220, 52, 0x32415a, 0.94);
  button.setStrokeStyle(3, 0xf5c26b, 0.95);
  button.setInteractive({ useHandCursor: true });
  button.on("pointerdown", () => handleSceneAction(scene, context, "end_turn"));
  scene.add.text(1294, 622, "End Turn", textStyle(22, "#fff5d7", true));
}

export function renderCombatPanel(
  scene: Phaser.Scene,
  context: BootContext,
  fill: number,
  stroke: number,
  titleColor: string,
  bodyColor: string
): void {
  const combat = context.run.combat;
  const enemy = getCombatantData(context.run, context.dataBundle);
  const intent = getActiveIntent(context.run, context.dataBundle);

  scene.add.rectangle(1380, 535, 420, 230, fill, 0.96).setStrokeStyle(5, stroke, 0.9);
  scene.add.text(1204, 436, enemy?.displayNameKo ?? "missing enemy", textStyle(34, titleColor, true));
  scene.add.text(1204, 492, `HP ${combat?.enemyHp ?? "-"} / ${combat?.enemyMaxHp ?? "-"}`, textStyle(28, bodyColor, true));
  scene.add.text(1204, 532, `Block ${combat?.enemyBlock ?? 0}`, textStyle(24, bodyColor));
  scene.add.text(1204, 572, `Intent ${intent?.telegraphKo ?? "none"}`, textStyle(24, bodyColor));
  scene.add.text(1204, 610, `Turn ${combat?.turn ?? 0}`, textStyle(24, bodyColor));
}
