import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { InputAction } from "../../input/actions";
import { bindKeyboardActions } from "../../input/bindings";
import { getActiveIntent, getCombatantData } from "../../simulation/systems/combat/combatSystem";
import { resolveCombatFeedbackEffectKey, resolveCombatFeedbackFrame } from "../../simulation/state/combatFeedback";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderCardHand, renderPaperPanel, renderSceneShell, textStyle } from "../view/sceneShell";

export class CombatScene extends Phaser.Scene {
  constructor() {
    super("CombatScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "카드 전투",
      subtitle: "1-5 카드 사용 / E 턴 종료",
      focusLabel: "전투 상태",
      chrome: "immersive",
      showImmersiveInfo: false,
      showHand: false,
      showRoute: false,
      onCardClick: (index) => handleSceneAction(this, context, `card_${index + 1}` as InputAction)
    });

    renderCombatTheater(this, context, false);
    renderCombatPanel(this, context, 0xfffbef, 0x8f5b42, "#1e2a3e", "#805845");
    renderCombatFeedbackEffect(this, context);
    renderCombatPlayerStandee(this, context);
    renderCardHand(this, context, (index) => handleSceneAction(this, context, `card_${index + 1}` as InputAction));
    renderCombatButtons(this, context);
    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action), context.save.settings);
    renderDebugOverlay(context, "CombatScene");
  }
}

function renderCombatButtons(scene: Phaser.Scene, context: BootContext): void {
  renderActionButton(scene, 1470, 616, "턴 종료", () => handleSceneAction(scene, context, "end_turn"), {
    width: 210,
    height: 58,
    focus: true,
    fontSize: 24
  });
}

export function renderCombatTheater(scene: Phaser.Scene, context: BootContext, boss: boolean): void {
  const stage = context.dataBundle.stages.find((item) => item.id === context.run.stageId)
    ?? context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];
  const combat = context.run.combat;
  const stageX = 960;
  const stageY = 530;
  const accent = boss ? 0x3c3143 : 0xa5483f;
  const ribbon = boss ? 0x4d3a59 : 0xa5483f;

  scene.add.rectangle(stageX, stageY + 48, 1500, 680, 0x1e2a3e, 0.14);
  renderPaperPanel(scene, stageX, stageY, 1460, 650, { alpha: 0.88 });
  scene.add.rectangle(308, stageY + 62, 72, 560, accent, 0.12).setStrokeStyle(2, 0xc6a65e, 0.28);
  scene.add.rectangle(1612, stageY + 62, 72, 560, accent, 0.12).setStrokeStyle(2, 0xc6a65e, 0.28);
  [364, 596, 1324, 1556].forEach((x) => {
    scene.add.rectangle(x, stageY - 284, 10, 178, 0x32415a, 0.42);
    scene.add.circle(x, stageY - 188, 18, 0xfff1d0, 0.62).setStrokeStyle(3, 0xc6a65e, 0.55);
  });
  scene.add.ellipse(stageX, stageY - 12, 990, 360, boss ? 0x3c3143 : 0x2f6b68, boss ? 0.18 : 0.16);
  scene.add.ellipse(stageX, stageY + 48, 740, 240, 0xf5c26b, 0.11);
  scene.add.rectangle(960, 650, 1220, 120, accent, boss ? 0.1 : 0.08)
    .setStrokeStyle(2, 0xc6a65e, 0.24);
  scene.add.rectangle(960, 714, 1260, 8, 0x805845, 0.18);
  scene.add.rectangle(960, 928, 1260, 58, 0xfff1d0, 0.62)
    .setStrokeStyle(2, 0xc6a65e, 0.35);

  renderCombatStagePolish(scene, context, boss, accent, ribbon);

  if (combat?.pendingAttackBonus && !boss) {
    scene.add.text(748, 604, `다음 공격 보너스 +${combat.pendingAttackBonus}`, textStyle(22, "#a5483f", true));
  }
}

function renderCombatStagePolish(
  scene: Phaser.Scene,
  context: BootContext,
  boss: boolean,
  accent: number,
  ribbon: number
): void {
  const stageX = 960;
  const stageY = 530;
  const combat = context.run.combat;
  const stage = context.dataBundle.stages.find((item) => item.id === context.run.stageId)
    ?? context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];
  const route = stage?.route ?? [];

  scene.add.rectangle(stageX, stageY - 266, 960, 88, ribbon, 0.95).setStrokeStyle(5, 0xf5c26b, 0.64);
  scene.add.triangle(stageX - 544, stageY - 266, 0, 0, 94, -48, 94, 48, ribbon, 0.92)
    .setStrokeStyle(3, 0xf5c26b, 0.58);
  scene.add.triangle(stageX + 544, stageY - 266, 0, -48, 94, 0, 0, 48, ribbon, 0.92)
    .setStrokeStyle(3, 0xf5c26b, 0.58);
  scene.add.text(stageX - 386, stageY - 302, boss ? "보스 전투" : "카드 전투", textStyle(42, boss ? "#fff5d7" : "#1e2a3e", true));
  scene.add.text(stageX - 386, stageY - 248, "1-5 카드 사용 / E 턴 종료", textStyle(20, boss ? "#f5c26b" : "#5f4938", true));
  scene.add.rectangle(stageX + 350, stageY - 267, 210, 44, 0xfff1d0, 0.96).setStrokeStyle(2, 0xc6a65e, 0.62);
  scene.add.text(stageX + 350, stageY - 281, `턴 ${combat?.turn ?? 0}`, textStyle(21, "#805845", true)).setOrigin(0.5, 0);

  renderPlayerStatusLedger(scene, context, 356, 535);

  renderPaperPanel(scene, 960, 365, 720, 134, { alpha: 0.97 });
  scene.add.rectangle(960, 323, 650, 24, 0xffe2ad, 0.82).setStrokeStyle(2, 0xc6a65e, 0.44);
  scene.add.text(672, 311, "경로", textStyle(23, "#1e2a3e", true));
  scene.add.rectangle(990, 366, 470, 8, 0xc6a65e, 0.6);
  route.slice(0, 5).forEach((room, index) => {
    const x = 760 + index * 115;
    const fill = room.type === "boss" ? 0xce5869 : room.type === "event" ? 0x6c8fd6 : room.type === "reward" ? 0xb98c34 : 0x4f9b75;
    scene.add.circle(x, 366, 30, fill, 0.95)
      .setStrokeStyle(index === context.run.roomIndex ? 6 : 3, index === context.run.roomIndex ? 0xf5c26b : 0xffffff, 0.95);
    scene.add.rectangle(x, 408, 82, 24, 0xfff8e8, 0.74).setStrokeStyle(1, 0xc6a65e, 0.34);
    scene.add.text(x, 398, roomTypeKo(room.type), textStyle(14, "#32415a", true))
      .setOrigin(0.5, 0)
      .setWordWrapWidth(80)
      .setAlign("center");
  });

  scene.add.rectangle(stageX, 590, 580, 78, 0xfff1d0, 0.42).setStrokeStyle(2, 0xc6a65e, 0.42);
  scene.add.rectangle(stageX, 590, 430, 24, 0xf7dfae, 0.58);
  scene.add.circle(778, 590, 29, 0xfff8e8, 0.96).setStrokeStyle(3, 0xc6a65e, 0.62);
  scene.add.text(778, 576, `${combat?.turn ?? 0}`, textStyle(23, "#1e2a3e", true)).setOrigin(0.5, 0);
  scene.add.text(820, 573, "행동", textStyle(19, "#805845", true));
  scene.add.text(1014, 573, "의도 확인", textStyle(19, "#805845", true));
  scene.add.triangle(1138, 590, 0, -20, 46, 0, 0, 20, accent, 0.4);
}

function renderPlayerStatusLedger(scene: Phaser.Scene, context: BootContext, x: number, y: number): void {
  const characterName = context.dataBundle.characters.find((item) => item.id === context.run.characterId)?.displayNameKo ?? "캐릭터 없음";

  renderPaperPanel(scene, x, y, 470, 180, { alpha: 0.97 });
  scene.add.rectangle(x, y - 62, 430, 28, 0xffe2ad, 0.82).setStrokeStyle(2, 0xc6a65e, 0.44);
  scene.add.circle(x - 202, y - 45, 15, 0xf5c26b, 0.95).setStrokeStyle(3, 0x6d4a20, 0.9);
  scene.add.text(x - 188, y - 62, "플레이어", textStyle(19, "#805845", true));
  scene.add.text(x - 202, y - 25, characterName, textStyle(29, "#1e2a3e", true)).setWordWrapWidth(310);
  scene.add.rectangle(x + 156, y - 24, 106, 34, 0xfff1d0, 0.92).setStrokeStyle(2, 0xc6a65e, 0.56);
  scene.add.text(x + 106, y - 36, `골드 ${context.run.player.gold}`, textStyle(17, "#805845", true));
  renderCombatStatTag(scene, x - 142, y + 50, 134, "체력", `${context.run.player.hp}/${context.run.player.maxHp}`, 0xce5869);
  renderCombatStatTag(scene, x, y + 50, 134, "기운", `${context.run.player.energy}/${context.run.player.maxEnergy}`, 0xf5c26b);
  renderCombatStatTag(scene, x + 142, y + 50, 134, "방어", `${context.run.player.block}`, 0x5d8d86);
}

function renderCombatStatTag(scene: Phaser.Scene, x: number, y: number, width: number, label: string, value: string, color: number): void {
  scene.add.rectangle(x, y, width, 38, 0xfff8e8, 0.8).setStrokeStyle(2, color, 0.78);
  scene.add.circle(x - width / 2 + 18, y, 10, color, 0.82).setStrokeStyle(2, 0xffffff, 0.62);
  scene.add.text(x - width / 2 + 34, y - 11, `${label} ${value}`, textStyle(17, "#4b2e12", true))
    .setWordWrapWidth(width - 42);
}

export function renderCombatPanel(
  scene: Phaser.Scene,
  context: BootContext,
  fill: number,
  stroke: number,
  titleColor: string,
  bodyColor: string
): void {
  renderEnemyIntentLedger(scene, context, fill, stroke, titleColor, bodyColor);
}

function renderEnemyIntentLedger(
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
  const spriteKey = enemy?.assetKeys.sprite;
  const isBoss = combat?.enemyKind === "boss";
  const enemyName = enemy?.displayNameKo ?? "적 없음";
  const nameFontSize = enemyName.length > 10 ? 27 : enemyName.length > 7 ? 29 : 32;
  const intentFontSize = isBoss ? 19 : 22;
  const intentWrapWidth = isBoss ? 104 : 238;
  const intentLabel = isBoss ? compactBossIntentLabel(intent) : (intent?.telegraphKo ?? "없음");
  const intentText = isBoss ? intentLabel : `의도 ${intentLabel}`;

  renderPaperPanel(scene, 1380, 532, 456, 258, {
    alpha: 0.98,
    tint: fill === 0x3c3143 ? 0x4b4050 : undefined,
    fillFallback: fill,
    strokeFallback: stroke
  });
  scene.add.rectangle(1380, 424, 410, 30, fill, 0.16).setStrokeStyle(2, stroke, 0.34);
  scene.add.circle(1202, 424, 14, 0xf5c26b, 0.95).setStrokeStyle(3, 0x6d4a20, 0.85);
  scene.add.text(1224, 412, isBoss ? "보스" : "적", textStyle(18, bodyColor, true));
  scene.add.text(1204, 450, enemyName, textStyle(nameFontSize, titleColor, true)).setWordWrapWidth(300);

  scene.add.rectangle(1302, 520, 196, 42, 0xfff8e8, 0.58).setStrokeStyle(2, 0xce5869, 0.62);
  scene.add.text(1216, 506, `체력 ${combat?.enemyHp ?? "-"} / ${combat?.enemyMaxHp ?? "-"}`, textStyle(24, bodyColor, true));
  scene.add.rectangle(1276, 562, 144, 34, 0xfff8e8, 0.44).setStrokeStyle(2, 0x5d8d86, 0.52);
  scene.add.text(1216, 552, `방어 ${combat?.enemyBlock ?? 0}`, textStyle(20, bodyColor, true));
  scene.add.rectangle(1446, 562, 144, 34, 0xfff8e8, 0.44).setStrokeStyle(2, 0x8f5b42, 0.52);
  scene.add.text(1386, 552, `표식 ${combat?.enemyMark ?? 0}`, textStyle(20, bodyColor, true));

  if (spriteKey && scene.textures.exists(spriteKey)) {
    scene.add.circle(1530, isBoss ? 502 : 496, isBoss ? 70 : 62, fill, 0.74).setStrokeStyle(3, stroke, 0.82);
    scene.add.sprite(1530, isBoss ? 574 : 552, spriteKey, 0)
      .setOrigin(0.5, 1)
      .setDisplaySize(isBoss ? 138 : 114, isBoss ? 138 : 114);
  }

  scene.add.rectangle(1320, 610, 236, 58, 0xfff1d0, 0.58).setStrokeStyle(2, stroke, 0.46);
  if (intentIconKey && scene.textures.exists(intentIconKey)) {
    scene.add.circle(1228, 610, 28, fill, 0.76).setStrokeStyle(2, stroke, 0.9);
    scene.add.image(1228, 610, intentIconKey).setDisplaySize(48, 48);
  }
  scene.add.text(1264, 592, intentText, textStyle(intentFontSize, bodyColor, true))
    .setWordWrapWidth(intentWrapWidth);
}

function compactBossIntentLabel(intent: ReturnType<typeof getActiveIntent>): string {
  const effect = intent?.effects[0];
  const amount = effect?.value.amount ?? 0;
  if (!effect) return intent?.telegraphKo ?? "없음";

  const labels: Record<string, string> = {
    deal_damage_to_player: `공격 ${amount}`,
    deal_piercing_damage_to_player: `관통 ${amount}`,
    gain_enemy_block: `방어 ${amount}`,
    heal_enemy: `회복 ${amount}`,
    apply_player_mark: `표식 ${amount}`,
    apply_player_weak: `약화 ${amount}`,
    add_temp_card_to_discard: "먼지 추가",
    increase_next_card_cost: `비용 +${amount}`,
    reduce_player_chain: `연쇄 -${amount}`,
    summon_enemy: "소환"
  };

  return labels[effect.op] ?? intent?.telegraphKo ?? "없음";
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

export function renderCombatPlayerStandee(scene: Phaser.Scene, context: BootContext): void {
  const character = context.dataBundle.characters.find((item) => item.id === context.run.characterId)
    ?? context.dataBundle.characters[0];
  const spriteKey = character?.assetKeys.sprite;
  if (!spriteKey || !scene.textures.exists(spriteKey)) {
    return;
  }

  const isBoss = context.run.combat?.enemyKind === "boss";
  const baseY = isBoss ? 642 : 626;
  const spriteSize = isBoss ? 146 : 168;

  scene.add.ellipse(910, baseY + 4, isBoss ? 150 : 172, isBoss ? 30 : 34, 0x32415a, 0.16).setDepth(1);
  scene.add.circle(910, isBoss ? 558 : 530, isBoss ? 72 : 84, 0xfff1d0, 0.28).setStrokeStyle(3, 0xc6a65e, 0.38);
  scene.add.sprite(910, baseY, spriteKey, 0)
    .setOrigin(0.5, 1)
    .setDisplaySize(spriteSize, spriteSize)
    .setDepth(2);
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

function roomTypeKo(type: string): string {
  const labels: Record<string, string> = {
    combat: "전투",
    elite: "정예",
    event: "이벤트",
    shop: "상점",
    rest: "휴식",
    reward: "보상",
    boss: "보스"
  };
  return labels[type] ?? type;
}
