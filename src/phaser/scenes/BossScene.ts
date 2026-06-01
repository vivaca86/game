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
import { renderActionButton, renderCardHand, renderPaperPanel, renderSceneShell, textStyle } from "../view/sceneShell";

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

    renderCombatTheater(this, context, true);
    renderBossCommandBoard(this, context);
    renderCombatPanel(this, context, 0x3c3143, 0xf0c36a, "#fff5d7", "#f5c26b");
    renderCombatFeedbackEffect(this, context);
    renderCombatPlayerStandee(this, context);
    renderCardHand(this, context, (index) => handleSceneAction(this, context, `card_${index + 1}` as InputAction));
    renderBossEndTurnButton(this, context);

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action), context.save.settings);
    renderDebugOverlay(context, "BossScene");
  }
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
  renderActionButton(scene, 1470, 616, "턴 종료", () => handleSceneAction(scene, context, "end_turn"), {
    width: 210,
    height: 58,
    focus: true,
    fontSize: 24
  });
}
