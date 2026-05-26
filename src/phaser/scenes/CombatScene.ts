import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
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
      focusLabel: "Combat state"
    });

    renderCombatPanel(this, context, 0xfffbef, 0x8f5b42, "#1e2a3e", "#805845");
    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action));
    renderDebugOverlay(context, "CombatScene");
  }
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

  scene.add.rectangle(1380, 560, 420, 290, fill, 0.96).setStrokeStyle(5, stroke, 0.9);
  scene.add.text(1204, 442, enemy?.displayNameKo ?? "missing enemy", textStyle(34, titleColor, true));
  scene.add.text(1204, 500, `HP ${combat?.enemyHp ?? "-"} / ${combat?.enemyMaxHp ?? "-"}`, textStyle(28, bodyColor, true));
  scene.add.text(1204, 542, `Block ${combat?.enemyBlock ?? 0}`, textStyle(24, bodyColor));
  scene.add.text(1204, 584, `Intent ${intent?.telegraphKo ?? "none"}`, textStyle(24, bodyColor));
  scene.add.text(1204, 626, `Turn ${combat?.turn ?? 0}`, textStyle(24, bodyColor));
  scene.add.text(1204, 685, `Last: ${context.run.log.at(-1) ?? "none"}`, textStyle(20, bodyColor)).setWordWrapWidth(350);
}
