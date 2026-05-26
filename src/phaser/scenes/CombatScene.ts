import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { InputAction } from "../../input/actions";
import { bindKeyboardActions } from "../../input/bindings";
import { getActiveIntent, getCombatantData } from "../../simulation/systems/combat/combatSystem";
import { resolveCombatFeedbackEffectKey, resolveCombatFeedbackFrame } from "../../simulation/state/combatFeedback";
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
    renderCombatFeedbackEffect(this, context);
    renderCombatButtons(this, context);
    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action));
    renderDebugOverlay(context, "CombatScene");
  }
}

function renderCombatButtons(scene: Phaser.Scene, context: BootContext): void {
  const button = scene.add.rectangle(1470, 616, 190, 52, 0x32415a, 0.94);
  button.setStrokeStyle(3, 0xf5c26b, 0.95);
  button.setInteractive({ useHandCursor: true });
  button.on("pointerdown", () => handleSceneAction(scene, context, "end_turn"));
  scene.add.text(1400, 600, "End Turn", textStyle(22, "#fff5d7", true));
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
  const intentIconKey = resolveIntentIconKey(context);

  scene.add.rectangle(1380, 535, 420, 230, fill, 0.96).setStrokeStyle(5, stroke, 0.9);
  renderCombatantPortrait(scene, context, fill, stroke);
  scene.add.text(1204, 436, enemy?.displayNameKo ?? "missing enemy", textStyle(34, titleColor, true));
  scene.add.text(1204, 492, `HP ${combat?.enemyHp ?? "-"} / ${combat?.enemyMaxHp ?? "-"}`, textStyle(28, bodyColor, true));
  scene.add.text(1204, 532, `Block ${combat?.enemyBlock ?? 0} / Mark ${combat?.enemyMark ?? 0}`, textStyle(24, bodyColor));

  if (intentIconKey && scene.textures.exists(intentIconKey)) {
    scene.add.circle(1228, 585, 28, fill, 0.74).setStrokeStyle(2, stroke, 0.9);
    scene.add.image(1228, 585, intentIconKey).setDisplaySize(48, 48);
    scene.add.text(1262, 570, `Intent ${intent?.telegraphKo ?? "none"}`, textStyle(23, bodyColor)).setWordWrapWidth(284);
  } else {
    scene.add.text(1204, 572, `Intent ${intent?.telegraphKo ?? "none"}`, textStyle(24, bodyColor));
  }

  scene.add.text(1204, 610, `Turn ${combat?.turn ?? 0}`, textStyle(24, bodyColor));
}

export function renderCombatFeedbackEffect(scene: Phaser.Scene, context: BootContext): void {
  const effectKey = resolveCombatFeedbackEffectKey(context.run, context.dataBundle);
  if (!effectKey || !scene.textures.exists(effectKey)) {
    return;
  }

  const isBoss = context.run.combat?.enemyKind === "boss";
  const frame = resolveCombatFeedbackFrame(context.run);
  const config = effectPlacement(effectKey, isBoss);
  scene.add.sprite(config.x, config.y, effectKey, frame)
    .setDisplaySize(config.size, config.size)
    .setAlpha(config.alpha)
    .setAngle(config.angle)
    .setDepth(5);
}

function renderCombatantPortrait(scene: Phaser.Scene, context: BootContext, fill: number, stroke: number): void {
  const combat = context.run.combat;
  const enemy = getCombatantData(context.run, context.dataBundle);
  const spriteKey = enemy?.assetKeys.sprite;
  if (!combat || !spriteKey || !scene.textures.exists(spriteKey)) {
    return;
  }

  const isBoss = combat.enemyKind === "boss";
  scene.add.circle(1530, isBoss ? 512 : 505, isBoss ? 66 : 58, fill, 0.74).setStrokeStyle(3, stroke, 0.82);
  scene.add.sprite(1530, isBoss ? 575 : 556, spriteKey, 0)
    .setOrigin(0.5, 1)
    .setDisplaySize(isBoss ? 132 : 108, isBoss ? 132 : 108);
}

function resolveIntentIconKey(context: BootContext): string | undefined {
  const combat = context.run.combat;
  const enemy = getCombatantData(context.run, context.dataBundle);
  const iconKeys = enemy?.assetKeys.intentIcons ?? [];
  if (!combat || iconKeys.length === 0) {
    return undefined;
  }
  return iconKeys[combat.intentIndex % iconKeys.length] ?? iconKeys[0];
}

function effectPlacement(effectKey: string, isBoss: boolean): { x: number; y: number; size: number; alpha: number; angle: number } {
  if (effectKey === "effect_paper_slash") {
    return { x: 1500, y: isBoss ? 535 : 518, size: isBoss ? 188 : 166, alpha: 0.94, angle: -12 };
  }

  if (effectKey === "effect_ink_splash") {
    return { x: 1508, y: isBoss ? 536 : 520, size: isBoss ? 186 : 164, alpha: 0.88, angle: 8 };
  }

  return { x: 1530, y: isBoss ? 524 : 508, size: isBoss ? 194 : 168, alpha: 0.82, angle: 0 };
}
