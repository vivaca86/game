import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { BossPhase } from "../../data/schema";
import type { InputAction } from "../../input/actions";
import { bindKeyboardActions } from "../../input/bindings";
import { getCurrentRoom } from "../../simulation/state/runState";
import { getActiveIntent, getCombatantData } from "../../simulation/systems/combat/combatSystem";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderCombatFeedbackEffect, renderCombatPanel, renderCombatPlayerStandee, renderCombatTheater } from "./CombatScene";
import { renderActionButton, renderCardHand, renderPaperPanel, renderRasterHoverHitTarget, renderSceneShell, renderTransparentHitTarget, textStyle } from "../view/sceneShell";

const BOSS_RASTER_UNDERLAY_KEY = "boss_raster_underlay_concept";
const BOSS_RASTER_HOVER_STAMP_KEY = "ui_hover_boss_skull_stamp_concept";

export class BossScene extends Phaser.Scene {
  constructor() {
    super("BossScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "보스 전투",
      subtitle: "체력 조건에 따라 페이즈 변화",
      focusLabel: "보스 방",
      chrome: "immersive",
      showImmersiveInfo: false,
      showHand: false,
      showRoute: false,
      onCardClick: (index) => handleSceneAction(this, context, `card_${index + 1}` as InputAction)
    });

    if (hasBossRasterUnderlay(this)) {
      renderBossRasterUnderlayOnly(this);
      renderCombatFeedbackEffect(this, context);
      renderBossRasterCardTargets(this, context, (index) => handleSceneAction(this, context, `card_${index + 1}` as InputAction));
      renderBossRasterEndTurnTarget(this, context);
    } else {
      renderCombatTheater(this, context, true);
      renderBossCommandBoard(this, context);
      renderCombatPanel(this, context, 0x3c3143, 0xf0c36a, "#fff5d7", "#f5c26b");
      renderCombatFeedbackEffect(this, context);
      renderCombatPlayerStandee(this, context);
      renderCardHand(this, context, (index) => handleSceneAction(this, context, `card_${index + 1}` as InputAction));
      renderBossEndTurnButton(this, context);
    }

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action), context.save.settings);
    renderDebugOverlay(context, "BossScene");
  }
}

function hasBossRasterUnderlay(scene: Phaser.Scene): boolean {
  return scene.textures.exists(BOSS_RASTER_UNDERLAY_KEY);
}

function renderBossRasterUnderlayOnly(scene: Phaser.Scene): void {
  scene.add.image(960, 540, BOSS_RASTER_UNDERLAY_KEY)
    .setDisplaySize(1920, 1080)
    .setDepth(0);
}

function renderBossRasterCardTargets(
  scene: Phaser.Scene,
  context: BootContext,
  onCardClick?: (index: number) => void
): void {
  const hand = context.run.hand.length > 0
    ? context.run.hand
    : context.save.currentRun?.hand ?? context.dataBundle.cards.slice(0, 5).map((card) => card.id);
  const cards = hand.slice(0, 5);
  const cardXs = [540, 760, 980, 1200, 1420];
  const cardY = 872;
  const cardWidth = 208;
  const cardHeight = 338;

  cards.forEach((_card, index) => {
    const x = cardXs[index] ?? (540 + index * 220);
    if (onCardClick) {
      renderRasterHoverHitTarget(scene, x, cardY, cardWidth, cardHeight, () => onCardClick(index), {
        hoverKey: BOSS_RASTER_HOVER_STAMP_KEY,
        hoverX: x - 32,
        hoverY: cardY - 44,
        hoverWidth: 122,
        hoverHeight: 122,
        downAlpha: 0.76
      });
    }
  });
}

function renderBossRasterEndTurnTarget(scene: Phaser.Scene, context: BootContext): void {
  const x = 1750;
  const y = 960;
  const width = 292;
  const height = 220;
  renderRasterHoverHitTarget(scene, x, y, width, height, () => handleSceneAction(scene, context, "end_turn"), {
    depth: 22,
    hoverDepth: 24,
    hoverKey: BOSS_RASTER_HOVER_STAMP_KEY,
    hoverX: x - 16,
    hoverY: y - 28,
    hoverWidth: 144,
    hoverHeight: 144,
    downAlpha: 0.76
  });
}

function renderBossRasterTheater(scene: Phaser.Scene, context: BootContext): void {
  const combat = context.run.combat;
  const boss = getCombatantData(context.run, context.dataBundle);
  const character = context.dataBundle.characters.find((item) => item.id === context.run.characterId)
    ?? context.dataBundle.characters[0];
  const model = buildBossCommandModel(context);
  const hp = combat?.enemyHp ?? boss?.maxHp ?? 0;
  const maxHp = combat?.enemyMaxHp ?? boss?.maxHp ?? 0;

  scene.add.image(960, 540, BOSS_RASTER_UNDERLAY_KEY)
    .setDisplaySize(1920, 1080)
    .setDepth(0);

  addBossRasterText(scene, 76, 256, character?.displayNameKo ?? "캐릭터 없음", 26, "#2f211a", true, 230);
  addBossRasterText(scene, 92, 336, `체력 ${context.run.player.hp}/${context.run.player.maxHp}`, 22, "#fff5d7", true, 220);
  addBossRasterText(scene, 92, 396, `기운 ${context.run.player.energy}/${context.run.player.maxEnergy}`, 22, "#fff5d7", true, 220);
  addBossRasterText(scene, 92, 456, `방어 ${context.run.player.block}`, 22, "#fff5d7", true, 220);
  addBossRasterText(scene, 1264, 62, boss?.displayNameKo ?? "보스 없음", 30, "#fff5d7", true, 420);
  addBossRasterText(scene, 1268, 138, `체력 ${hp} / ${maxHp}`, 23, "#fff5d7", true, 300);
  addBossRasterText(scene, 1268, 188, model.intentLabel, 20, "#f5c26b", true, 420);

  addBossRasterText(scene, 1616, 340, model.phaseTitle, 23, "#2f211a", true, 276);
  addBossRasterText(scene, 1616, 382, model.phaseDetail, 16, "#4b372b", true, 276);
  addBossRasterText(scene, 1616, 558, model.rewardTitle, 22, "#2f211a", true, 276);
  addBossRasterText(scene, 1616, 600, model.rewardDetail, 16, "#4b372b", true, 276);

  if (combat?.pendingAttackBonus) {
    addBossRasterText(scene, 660, 642, `다음 공격 보너스 +${combat.pendingAttackBonus}`, 22, "#f5c26b", true, 340);
  }
}

function renderBossRasterCardHand(
  scene: Phaser.Scene,
  context: BootContext,
  onCardClick?: (index: number) => void
): void {
  const hand = context.run.hand.length > 0
    ? context.run.hand
    : context.save.currentRun?.hand ?? context.dataBundle.cards.slice(0, 5).map((card) => card.id);
  const cards = hand
    .map((id) => context.dataBundle.cards.find((card) => card.id === id))
    .filter((card): card is NonNullable<typeof card> => Boolean(card))
    .slice(0, 5);
  const cardXs = [540, 760, 980, 1200, 1420];
  const cardY = 872;
  const cardWidth = 208;
  const cardHeight = 338;

  cards.forEach((card, index) => {
    const x = cardXs[index] ?? (540 + index * 220);
    addBossRasterText(scene, x, 996, card.displayNameKo, 16, "#2f211a", true, 148)
      .setOrigin(0.5, 0)
      .setAlign("center")
      .setDepth(13);
    addBossRasterText(scene, x + 70, 1032, `${card.cost}`, 28, "#2f211a", true, 38)
      .setOrigin(0.5)
      .setDepth(13);

    if (onCardClick) {
      renderTransparentHitTarget(scene, x, cardY, cardWidth, cardHeight, () => onCardClick(index));
    }
  });
}

function renderBossRasterEndTurnButton(scene: Phaser.Scene, context: BootContext): void {
  const x = 1718;
  const y = 930;
  const width = 238;
  const height = 78;
  scene.add.rectangle(x, y, 224, 58, 0xfff1d0, 0.76)
    .setStrokeStyle(3, 0xf0c36a, 0.66)
    .setDepth(12);
  renderTransparentHitTarget(scene, x, y, width, height, () => handleSceneAction(scene, context, "end_turn"), { depth: 22 });

  addBossRasterText(scene, x, y - 16, "턴 종료", 28, "#2f211a", true, width - 42)
    .setOrigin(0.5)
    .setDepth(23);
}

function addBossRasterText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  value: string,
  size: number,
  color: string,
  bold = false,
  wrapWidth?: number
): Phaser.GameObjects.Text {
  const text = scene.add.text(x, y, value, textStyle(size, color, bold))
    .setDepth(12)
    .setShadow(1, 2, "rgba(20, 17, 22, 0.48)", 2);
  if (wrapWidth) {
    text.setWordWrapWidth(wrapWidth);
  }
  return text;
}

function renderBossCommandBoard(scene: Phaser.Scene, context: BootContext): void {
  const model = buildBossCommandModel(context);

  renderPaperPanel(scene, 900, 490, 610, 118, {
    alpha: 0.95,
    tint: 0x5a4a5f,
    fillFallback: 0x4d3a59,
    strokeFallback: 0xf0c36a
  });
  scene.add.rectangle(900, 436, 550, 26, 0x4d3a59, 0.82).setStrokeStyle(2, 0xf0c36a, 0.58);
  scene.add.text(646, 424, "보스 압박판", textStyle(18, "#fff5d7", true));
  scene.add.text(842, 424, model.intentLabel, textStyle(18, "#f5c26b", true)).setWordWrapWidth(310);

  renderBossMiniPanel(scene, 720, 493, 218, "페이즈", model.phaseTitle, model.phaseDetail, model.phaseTriggered);
  renderBossMiniPanel(scene, 1080, 493, 218, "격파 연결", model.rewardTitle, model.rewardDetail, false);
}

function renderBossMiniPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  label: string,
  title: string,
  detail: string,
  danger: boolean
): void {
  scene.add.rectangle(x, y, width, 96, danger ? 0x5b2f40 : 0xfff1d0, danger ? 0.92 : 0.94)
    .setStrokeStyle(3, danger ? 0xffd27a : 0xf0c36a, 0.82);
  scene.add.rectangle(x, y - 38, width - 18, 18, danger ? 0xce5869 : 0x4d3a59, 0.84)
    .setStrokeStyle(1, 0xf0c36a, 0.5);
  scene.add.text(x - width / 2 + 18, y - 46, label, textStyle(13, "#fff5d7", true));
  scene.add.text(x - width / 2 + 18, y - 24, title, textStyle(18, danger ? "#fff5d7" : "#4d3a59", true))
    .setWordWrapWidth(width - 36)
    .setLineSpacing(2);
  scene.add.text(x - width / 2 + 18, y + 31, detail, textStyle(12, danger ? "#ffecb8" : "#805845", true))
    .setWordWrapWidth(width - 36);
}

function buildBossCommandModel(context: BootContext): {
  phaseTriggered: boolean;
  phaseTitle: string;
  phaseDetail: string;
  rewardTitle: string;
  rewardDetail: string;
  intentLabel: string;
} {
  const combat = context.run.combat;
  const boss = getCombatantData(context.run, context.dataBundle);
  const phases = boss && "phases" in boss ? [...boss.phases].sort((a, b) => b.hpRatioAtOrBelow - a.hpRatioAtOrBelow) : [];
  const currentPhase = resolveVisibleBossPhase(phases, combat?.enemyHp ?? boss?.maxHp ?? 1, combat?.enemyMaxHp ?? boss?.maxHp ?? 1);
  const phaseTriggered = combat?.bossPhaseTriggered ?? false;
  const maxHp = Math.max(1, combat?.enemyMaxHp ?? boss?.maxHp ?? 1);
  const hp = Math.max(0, combat?.enemyHp ?? maxHp);
  const thresholdRatio = currentPhase?.hpRatioAtOrBelow ?? 0.5;
  const thresholdHp = Math.max(1, Math.ceil(maxHp * thresholdRatio));
  const hpUntilPhase = Math.max(0, hp - thresholdHp);
  const effectPreview = currentPhase?.effects[0]?.previewKo ?? currentPhase?.displayNameKo ?? "특수 의도 대기";
  const bonus = combat?.pendingAttackBonus ?? 0;
  const activeIntent = getActiveIntent(context.run, context.dataBundle);
  const room = getCurrentRoom(context.dataBundle, context.run);
  const rewardPoolId = room?.rewardPoolId ?? context.dataBundle.stages.find((stage) => stage.id === context.run.stageId)?.rewardPools[0];
  const rewardPool = context.dataBundle.rewardPools.find((pool) => pool.id === rewardPoolId);
  const unlockText = context.dataBundle.stages.find((stage) => stage.id === context.run.stageId)?.unlockId ? "클리어 기록/다음 길" : "스테이지 클리어";

  return {
    phaseTriggered,
    phaseTitle: phaseTriggered ? "페이즈 발동" : hpUntilPhase > 0 ? `임계까지 ${hpUntilPhase}` : "임계 도달",
    phaseDetail: phaseTriggered
      ? `체력 ${hp}/${maxHp} · ${effectPreview}${bonus > 0 ? ` +${bonus}` : ""}`
      : `체력 ${hp}/${maxHp} · ${thresholdHp} 이하`,
    rewardTitle: rewardPool?.displayNameKo ?? "보스 보상",
    rewardDetail: `격파 시 ${unlockText}`,
    intentLabel: `다음 의도 ${compactBossIntent(activeIntent)}`
  };
}

function resolveVisibleBossPhase(phases: BossPhase[], hp: number, maxHp: number): BossPhase | undefined {
  if (phases.length === 0) return undefined;
  const hpRatio = maxHp > 0 ? hp / maxHp : 1;
  return phases.find((phase) => hpRatio > phase.hpRatioAtOrBelow) ?? phases[phases.length - 1];
}

function compactBossIntent(intent: ReturnType<typeof getActiveIntent>): string {
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

function renderBossEndTurnButton(scene: Phaser.Scene, context: BootContext): void {
  renderActionButton(scene, 1630, 708, "턴 종료", () => handleSceneAction(scene, context, "end_turn"), {
    width: 190,
    height: 54,
    focus: true,
    fontSize: 22
  });
}
