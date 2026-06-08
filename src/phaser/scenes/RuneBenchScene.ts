import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { CardData, RuneData } from "../../data/schema";
import { bindKeyboardActions } from "../../input/bindings";
import { getCurrentRoom, getEncounterPoolContentId, getStage } from "../../simulation/state/runState";
import { getAttachedRuneModifiedAmount, getAttachedRuneModifiedCost } from "../../simulation/systems/runes/runeSystem";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderPaperPanel, renderRasterHoverHitTarget, renderSceneShell, renderUiSlot, textStyle } from "../view/sceneShell";

const RUNE_BENCH_RASTER_UNDERLAY_KEY = "rune_bench_raster_underlay_concept";
const RUNE_BENCH_RASTER_HOVER_ACTION_KEY = "ui_hover_action_seal_concept";
const RUNE_BENCH_RASTER_ACTION_RAIL_KEYS = {
  hover: "ui_hover_runebench_action_rail_concept",
  down: "ui_down_runebench_action_rail_concept"
};
const RUNE_BENCH_RASTER_CONFIRM_BUTTON_KEYS = {
  hover: "ui_hover_runebench_confirm_button_concept",
  down: "ui_down_runebench_confirm_button_concept"
};

export class RuneBenchScene extends Phaser.Scene {
  constructor() {
    super("RuneBenchScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "룬 작업대",
      subtitle: "소켓 조율",
      focusLabel: "소켓 미리보기",
      backgroundKey: resolveRuneBenchBackgroundKey(context),
      chrome: "immersive",
      showImmersiveInfo: false,
      showHand: false,
      showRoute: false
    });

    if (hasRuneBenchRasterUnderlay(this)) {
      renderRuneBenchRasterStage(this, context);
    } else {
      renderRuneBenchTheater(this, context);
    }

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action), context.save.settings);
    renderDebugOverlay(context, "RuneBenchScene");
  }
}

function hasRuneBenchRasterUnderlay(scene: Phaser.Scene): boolean {
  return scene.textures.exists(RUNE_BENCH_RASTER_UNDERLAY_KEY);
}

function renderRuneBenchRasterStage(scene: Phaser.Scene, context: BootContext): void {
  scene.add.image(960, 540, RUNE_BENCH_RASTER_UNDERLAY_KEY)
    .setDisplaySize(1920, 1080)
    .setDepth(0);

  renderRuneBenchRasterHitTarget(scene, 1010, 742, 330, 66, 0xf5c26b, () => handleSceneAction(scene, context, "confirm"), {
    hoverKey: RUNE_BENCH_RASTER_ACTION_RAIL_KEYS.hover,
    downKey: RUNE_BENCH_RASTER_ACTION_RAIL_KEYS.down,
    hoverX: 1062,
    hoverY: 714,
    hoverWidth: 540,
    hoverHeight: 112,
    downX: 1062,
    downY: 714,
    downWidth: 540,
    downHeight: 112,
    hoverAlpha: 0.92,
    downAlpha: 0.84
  });
  renderRuneBenchRasterHitTarget(scene, 1660, 984, 250, 102, 0x5eead4, () => handleSceneAction(scene, context, "confirm"), {
    hoverKey: RUNE_BENCH_RASTER_CONFIRM_BUTTON_KEYS.hover,
    downKey: RUNE_BENCH_RASTER_CONFIRM_BUTTON_KEYS.down,
    hoverX: 1644,
    hoverY: 968,
    hoverWidth: 330,
    hoverHeight: 122,
    downX: 1644,
    downY: 968,
    downWidth: 330,
    downHeight: 122,
    hoverAlpha: 0.96,
    downAlpha: 0.88
  });
}

function renderRuneBenchRasterHitTarget(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  _accent: number,
  onClick: () => void,
  options: {
    hoverKey?: string;
    downKey?: string;
    hoverX?: number;
    hoverY?: number;
    downX?: number;
    downY?: number;
    hoverWidth?: number;
    hoverHeight?: number;
    downWidth?: number;
    downHeight?: number;
    hoverAlpha?: number;
    downAlpha?: number;
  } = {}
): void {
  const hoverSize = Math.min(108, Math.max(80, Math.min(width, height) * 1.12));
  renderRasterHoverHitTarget(scene, x, y, width, height, onClick, {
    hoverKey: options.hoverKey ?? RUNE_BENCH_RASTER_HOVER_ACTION_KEY,
    downKey: options.downKey ?? RUNE_BENCH_RASTER_HOVER_ACTION_KEY,
    hoverX: options.hoverX ?? x + width * 0.38,
    hoverY: options.hoverY ?? y - height * 0.24,
    hoverWidth: options.hoverWidth ?? hoverSize,
    hoverHeight: options.hoverHeight ?? hoverSize,
    downX: options.downX ?? x + width * 0.38,
    downY: options.downY ?? y - height * 0.24,
    downWidth: options.downWidth ?? hoverSize * 1.12,
    downHeight: options.downHeight ?? hoverSize * 1.12,
    hoverAlpha: options.hoverAlpha,
    downAlpha: options.downAlpha ?? 0.76
  });
}

interface RunePreviewStats {
  cost: number;
  damage?: number;
  block?: number;
}

interface RuneEquipPreview {
  before: RunePreviewStats;
  after: RunePreviewStats;
  changeLine: string;
  compatibilityLine: string;
  socketLine: string;
  recommendationLine: string;
}

function renderRuneBenchTheater(scene: Phaser.Scene, context: BootContext): void {
  const stage = getStage(context.dataBundle, context.run);
  const runeIds = context.run.runes.length > 0
    ? context.run.runes
    : context.dataBundle.runes.slice(0, 1).map((rune) => rune.id);
  const runes = runeIds
    .map((id) => context.dataBundle.runes.find((rune) => rune.id === id))
    .filter((rune): rune is RuneData => Boolean(rune))
    .slice(0, 4);
  const selectedRune = runes[0] ?? context.dataBundle.runes[0];
  const targetCard = selectedRune ? findRuneTargetPreview(context, selectedRune) : undefined;
  const equippedCount = Object.values(context.run.equippedRunes).reduce((total, item) => total + item.length, 0);
  const preview = selectedRune && targetCard ? buildRuneEquipPreview(context, selectedRune, targetCard) : undefined;

  scene.add.rectangle(960, 560, 1680, 840, 0xfff8e8, 0.42)
    .setStrokeStyle(6, 0xb98c34, 0.32);
  scene.add.polygon(168, 550, [0, -352, 168, -286, 190, 306, 0, 376, -82, 306, -58, -292], 0x6c8fd6, 0.2)
    .setStrokeStyle(5, 0x4c659d, 0.38);
  scene.add.polygon(1752, 550, [0, -352, 58, -292, 82, 306, 0, 376, -190, 306, -168, -286], 0x5d8d86, 0.2)
    .setStrokeStyle(5, 0x3f6f68, 0.38);

  renderPaperPanel(scene, 960, 126, 800, 132, { alpha: 0.96 });
  scene.add.circle(610, 126, 17, 0xc6a65e, 0.9).setStrokeStyle(3, 0xfff3b0, 0.8);
  scene.add.circle(1310, 126, 17, 0xc6a65e, 0.9).setStrokeStyle(3, 0xfff3b0, 0.8);
  scene.add.rectangle(960, 190, 720, 18, 0xf5c26b, 0.68);
  scene.add.text(960, 82, "룬 작업대", textStyle(42, "#1e2a3e", true)).setOrigin(0.5);
  scene.add.text(960, 137, `${stage?.displayNameKo ?? "스테이지 없음"} / 보유 룬 ${runes.length} / 장착 ${equippedCount}`, textStyle(22, "#805845", true))
    .setOrigin(0.5);

  renderRuneInventory(scene, context, runes, selectedRune);
  renderRuneWorkbench(scene, context, selectedRune, targetCard, preview);
  renderRuneLedger(scene, context, selectedRune, targetCard, equippedCount, preview);

  renderActionButton(scene, 1010, 742, "룬 장착", () => handleSceneAction(scene, context, "confirm"), {
    width: 330,
    height: 66,
    fontSize: 25,
    focus: true
  });
}

function renderRuneInventory(
  scene: Phaser.Scene,
  context: BootContext,
  runes: RuneData[],
  selectedRune: RuneData | undefined
): void {
  renderPaperPanel(scene, 430, 620, 486, 596, { alpha: 0.96 });
  scene.add.text(236, 358, "보유 룬", textStyle(31, "#32415a", true));
  scene.add.text(236, 404, "지금 조율할 수정 조각", textStyle(20, "#805845", true));

  const visibleRunes = runes.length > 0 ? runes : context.dataBundle.runes.slice(0, 1);
  visibleRunes.slice(0, 4).forEach((rune, index) => {
    const y = 482 + index * 92;
    renderUiSlot(scene, 430, y, 360, 74, "choice", { disabled: true, focus: rune.id === selectedRune?.id });
    if (rune.assetKeys.icon && scene.textures.exists(rune.assetKeys.icon)) {
      scene.add.image(286, y, rune.assetKeys.icon).setDisplaySize(46, 46);
    } else {
      scene.add.circle(286, y, 23, runeColor(rune.socketType), 0.9).setStrokeStyle(3, 0xfff3b0, 0.8);
    }
    scene.add.text(324, y - 26, rune.displayNameKo, textStyle(19, "#1e2a3e", true)).setWordWrapWidth(206);
    scene.add.text(324, y + 3, `${socketTypeLabel(rune.socketType)} / ${rarityLabel(rune.rarity)}`, textStyle(16, "#805845", true)).setWordWrapWidth(212);
  });

  scene.add.rectangle(430, 840, 354, 92, 0xfff6df, 0.42).setStrokeStyle(3, 0xc6a65e, 0.5);
  scene.add.text(274, 812, "확인하면 첫 호환 카드에 선택 룬을 장착합니다.", textStyle(18, "#805845", true)).setWordWrapWidth(306);
}

function renderRuneWorkbench(
  scene: Phaser.Scene,
  context: BootContext,
  selectedRune: RuneData | undefined,
  targetCard: CardData | undefined,
  preview: RuneEquipPreview | undefined
): void {
  renderPaperPanel(scene, 1040, 616, 860, 600, { alpha: 0.96 });
  scene.add.text(690, 352, "종이 조율대", textStyle(32, "#32415a", true));
  scene.add.text(690, 398, selectedRune ? selectedRune.displayNameKo : "장착할 룬 없음", textStyle(26, "#1e2a3e", true))
    .setWordWrapWidth(340);

  scene.add.rectangle(1040, 668, 640, 216, 0xfff2d6, 0.62).setStrokeStyle(5, 0xc6a65e, 0.6);
  scene.add.polygon(1040, 650, [-320, 82, -210, -70, 210, -70, 320, 82], 0x32415a, 0.08)
    .setStrokeStyle(5, 0x8d6a2a, 0.34);
  scene.add.rectangle(1040, 472, 560, 54, 0xfff6df, 0.6).setStrokeStyle(3, 0xc6a65e, 0.44);
  scene.add.text(790, 454, selectedRune ? effectSummary(selectedRune) : "조율 가능한 룬이 없습니다.", textStyle(18, "#805845", true))
    .setWordWrapWidth(500);

  renderTargetCard(scene, 760, 642, targetCard);
  renderRuneStone(scene, 1228, 620, selectedRune);

  scene.add.line(0, 0, 984, 616, 1098, 616, 0x8d6a2a, 0.62).setLineWidth(6);
  scene.add.line(0, 0, 1098, 616, 1148, 620, 0x8d6a2a, 0.46).setLineWidth(5);
  scene.add.circle(1038, 616, 18, 0xf5c26b, 0.9).setStrokeStyle(3, 0xfff3b0, 0.9);
  renderStatPreviewCard(scene, 1006, 550, "장착 전", preview?.before, false);
  renderStatPreviewCard(scene, 1006, 660, "장착 후", preview?.after, true);

  const targetText = targetCard && preview
    ? `${preview.compatibilityLine} / ${preview.socketLine}`
    : targetCard
      ? `${targetCard.displayNameKo} / ${cardTypeLabel(targetCard.type)}`
    : "호환 카드 없음";
  scene.add.rectangle(1040, 836, 520, 66, 0xfff6df, 0.48).setStrokeStyle(3, 0xc6a65e, 0.5);
  scene.add.text(804, 810, "호환 근거", textStyle(15, "#1f8a70", true)).setWordWrapWidth(472);
  scene.add.text(804, 834, targetText, textStyle(18, "#805845", true)).setWordWrapWidth(472);
}

function renderRuneLedger(
  scene: Phaser.Scene,
  context: BootContext,
  selectedRune: RuneData | undefined,
  targetCard: CardData | undefined,
  equippedCount: number,
  preview: RuneEquipPreview | undefined
): void {
  renderPaperPanel(scene, 1480, 620, 386, 596, { alpha: 0.95 });
  scene.add.text(1320, 358, "조율 기록", textStyle(31, "#32415a", true));
  scene.add.text(1320, 404, "덱에 새겨진 룬", textStyle(20, "#805845", true));

  const rows = [
    { label: "보유", value: `${context.run.runes.length}` },
    { label: "장착", value: `${equippedCount}` },
    { label: "소켓", value: selectedRune ? socketTypeLabel(selectedRune.socketType) : "없음" },
    { label: "대상", value: targetCard ? targetCard.displayNameKo : "없음" },
    { label: "변화", value: preview?.changeLine ?? "변화 없음" }
  ];
  rows.forEach((row, index) => {
    const y = 462 + index * 62;
    renderUiSlot(scene, 1480, y, 292, 50, "choice", { disabled: true, focus: index === 1 || index === 4 });
    scene.add.text(1352, y - 14, row.label, textStyle(16, "#805845", true)).setWordWrapWidth(70);
    scene.add.text(1430, y - 15, row.value, textStyle(18, "#1e2a3e", true)).setWordWrapWidth(168);
  });

  scene.add.rectangle(1480, 782, 302, 62, 0xfff6df, 0.38).setStrokeStyle(3, 0xc6a65e, 0.46);
  scene.add.text(1342, 764, preview?.recommendationLine ?? "추천 근거 없음", textStyle(17, "#805845", true)).setWordWrapWidth(260);

  scene.add.rectangle(1480, 840, 302, 82, 0xfff6df, 0.38).setStrokeStyle(3, 0xc6a65e, 0.5);
  scene.add.text(1342, 816, "장착 후 다음 방으로 이동합니다.", textStyle(18, "#805845", true)).setWordWrapWidth(260);
}

function renderStatPreviewCard(
  scene: Phaser.Scene,
  x: number,
  y: number,
  title: string,
  stats: RunePreviewStats | undefined,
  focus: boolean
): void {
  scene.add.rectangle(x, y, 180, 84, 0xfff6df, focus ? 0.78 : 0.58)
    .setStrokeStyle(focus ? 4 : 3, focus ? 0xf5c26b : 0xc6a65e, focus ? 0.76 : 0.48);
  scene.add.text(x - 70, y - 34, title, textStyle(15, focus ? "#1f8a70" : "#805845", true)).setWordWrapWidth(140);
  const lines = stats ? statLines(stats) : ["정보 없음"];
  lines.slice(0, 3).forEach((line, index) => {
    scene.add.text(x - 70, y - 12 + index * 20, line, textStyle(16, "#1e2a3e", true)).setWordWrapWidth(140);
  });
}

function renderTargetCard(scene: Phaser.Scene, x: number, y: number, card: CardData | undefined): void {
  scene.add.rectangle(x, y, 210, 292, 0xfffbef, 0.92).setStrokeStyle(5, 0x8d6a2a, 0.72);
  if (!card) {
    scene.add.text(x - 76, y - 18, "호환 카드 없음", textStyle(20, "#805845", true)).setWordWrapWidth(152);
    return;
  }
  if (scene.textures.exists(card.assetKeys.frame)) {
    scene.add.image(x, y, card.assetKeys.frame).setDisplaySize(210, 292);
  }
  if (scene.textures.exists(card.assetKeys.illustration)) {
    scene.add.image(x, y - 46, card.assetKeys.illustration).setDisplaySize(154, 100);
  }
  scene.add.text(x - 78, y - 126, `${card.cost}`, textStyle(32, "#1e2a3e", true));
  scene.add.text(x - 76, y + 18, card.displayNameKo, textStyle(19, "#1e2a3e", true)).setWordWrapWidth(150);
  scene.add.text(x - 76, y + 68, card.descriptionKo, textStyle(13, "#6d5a48")).setWordWrapWidth(152);
}

function renderRuneStone(scene: Phaser.Scene, x: number, y: number, rune: RuneData | undefined): void {
  scene.add.circle(x, y, 82, rune ? runeColor(rune.socketType) : 0x8f8179, 0.86).setStrokeStyle(7, 0xfff3b0, 0.78);
  scene.add.circle(x - 28, y - 30, 20, 0xfff6df, 0.42);
  scene.add.circle(x + 22, y + 18, 13, 0x32415a, 0.2);
  if (!rune) {
    scene.add.text(x - 52, y - 13, "룬 없음", textStyle(20, "#fff5d7", true)).setWordWrapWidth(104);
    return;
  }
  if (rune.assetKeys.icon && scene.textures.exists(rune.assetKeys.icon)) {
    scene.add.image(x, y - 4, rune.assetKeys.icon).setDisplaySize(84, 84);
  }
  scene.add.text(x - 72, y + 76, socketTypeLabel(rune.socketType), textStyle(18, "#805845", true)).setWordWrapWidth(144);
}

function buildRuneEquipPreview(context: BootContext, rune: RuneData, card: CardData): RuneEquipPreview {
  const before = getCurrentRuneStats(context, card);
  const after = applyRuneToPreview(before, rune);
  const changeLine = getChangeLine(before, after, rune);
  const socketLine = getSocketLine(card, rune);
  const compatibilityLine = `${cardTypeLabel(card.type)} 카드 호환`;
  const recommendationLine = getRecommendationLine(card, rune);

  return {
    before,
    after,
    changeLine,
    compatibilityLine,
    socketLine,
    recommendationLine
  };
}

function getCurrentRuneStats(context: BootContext, card: CardData): RunePreviewStats {
  const baseDamage = getPrimaryEffectAmount(card, "damage");
  const baseBlock = getPrimaryEffectAmount(card, "block");
  return {
    cost: getAttachedRuneModifiedCost(context.run, context.dataBundle, card.id, card.cost),
    damage: baseDamage === undefined
      ? undefined
      : getAttachedRuneModifiedAmount(context.run, context.dataBundle, card.id, baseDamage, "damage"),
    block: baseBlock === undefined
      ? undefined
      : getAttachedRuneModifiedAmount(context.run, context.dataBundle, card.id, baseBlock, "block")
  };
}

function applyRuneToPreview(stats: RunePreviewStats, rune: RuneData): RunePreviewStats {
  const next: RunePreviewStats = { ...stats };
  rune.effects.forEach((effect) => {
    const amount = effect.value.amount ?? effect.value.percent ?? 0;
    if (effect.op === "modify_attached_card_damage" && next.damage !== undefined) {
      next.damage = Math.max(1, next.damage + amount);
    }
    if (effect.op === "modify_damage_percent" && next.damage !== undefined) {
      next.damage = Math.max(1, Math.ceil(next.damage * (1 + amount / 100)));
    }
    if (effect.op === "modify_attached_card_block" && next.block !== undefined) {
      next.block = Math.max(0, next.block + amount);
    }
    if (effect.op === "modify_shield_percent" && next.block !== undefined) {
      next.block = Math.max(0, Math.ceil(next.block * (1 + amount / 100)));
    }
    if (effect.op === "modify_cost") {
      next.cost = Math.max(0, next.cost + amount);
    }
  });
  return next;
}

function getPrimaryEffectAmount(card: CardData, kind: "damage" | "block"): number | undefined {
  const damageOps = new Set(["deal_damage", "damage_front", "damage_all", "damage_random"]);
  const blockOps = new Set(["gain_block", "gain_shield"]);
  const matchingOps = kind === "damage" ? damageOps : blockOps;
  const effect = card.effects.find((item) => matchingOps.has(item.op));
  return effect?.value.amount;
}

function getChangeLine(before: RunePreviewStats, after: RunePreviewStats, rune: RuneData): string {
  if (before.damage !== after.damage && before.damage !== undefined && after.damage !== undefined) {
    return `피해 ${before.damage} -> ${after.damage}`;
  }
  if (before.block !== after.block && before.block !== undefined && after.block !== undefined) {
    return `방어 ${before.block} -> ${after.block}`;
  }
  if (before.cost !== after.cost) {
    return `비용 ${before.cost} -> ${after.cost}`;
  }
  return effectSummary(rune).replace(" 카드 조율 / ", " / ");
}

function getSocketLine(card: CardData, rune: RuneData): string {
  if (card.runeSlots.length === 0) return "빈 소켓 허용";
  const slot = card.runeSlots.find((item) => item.unlockedByDefault && (item.socketType === "any" || rune.socketType === "any" || item.socketType === rune.socketType));
  return slot ? `${socketTypeLabel(slot.socketType)} 일치` : "소켓 잠김";
}

function getRecommendationLine(card: CardData, rune: RuneData): string {
  const roleMatched = rune.recommendation.bestRoles.some((role) => card.balance.role.includes(role) || role.includes(card.balance.role));
  if (roleMatched) return "추천 역할과 맞는 조율입니다.";
  if (rune.recommendation.warning) return rune.recommendation.warning;
  return `${rarityLabel(rune.rarity)} 룬 / ${powerBandLabel(card.balance.powerBand)} 카드`;
}

function statLines(stats: RunePreviewStats): string[] {
  const lines = [`비용 ${stats.cost}`];
  if (stats.damage !== undefined) lines.push(`피해 ${stats.damage}`);
  if (stats.block !== undefined) lines.push(`방어 ${stats.block}`);
  if (lines.length === 1) lines.push("효과형 카드");
  return lines;
}

function findRuneTargetPreview(context: BootContext, rune: RuneData): CardData | undefined {
  for (const cardId of context.run.deck) {
    const card = context.dataBundle.cards.find((item) => item.id === cardId);
    if (!card || !rune.validCardTypes.includes(card.type)) continue;
    if ((context.run.equippedRunes[card.id] ?? []).includes(rune.id)) continue;
    if (card.runeSlots.length === 0) return card;
    if (card.runeSlots.some((slot) => slot.socketType === "any" || rune.socketType === "any" || slot.socketType === rune.socketType)) {
      return card;
    }
  }
  return undefined;
}

function effectSummary(rune: RuneData): string {
  const effect = rune.effects[0];
  if (!effect) return "특수 효과 없음";
  const amount = effect.value.amount ?? effect.value.percent;
  const signed = amount === undefined ? "" : amount > 0 ? `+${amount}` : `${amount}`;
  const labelByOp: Record<string, string> = {
    modify_attached_card_damage: `피해 ${signed}`,
    modify_damage_percent: `피해 ${signed}%`,
    modify_attached_card_block: `방어 ${signed}`,
    modify_shield_percent: `방어 ${signed}%`,
    modify_cost: `비용 ${signed}`,
    heal_on_play: `사용 시 회복 ${signed}`,
    echo_basic_effect: "기본 효과 메아리"
  };
  return `${socketTypeLabel(rune.socketType)} 카드 조율 / ${labelByOp[effect.op] ?? "특수 조율 효과"}`;
}

function runeColor(type: string): number {
  const colors: Record<string, number> = {
    attack: 0xce5869,
    defense: 0x5d8d86,
    skill: 0x6c8fd6,
    any: 0xb98c34
  };
  return colors[type] ?? 0xb98c34;
}

function socketTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    attack: "공격 소켓",
    defense: "방어 소켓",
    skill: "기술 소켓",
    any: "공용 소켓"
  };
  return labels[type] ?? type;
}

function cardTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    attack: "공격",
    defense: "방어",
    skill: "기술"
  };
  return labels[type] ?? type;
}

function rarityLabel(rarity: string): string {
  const labels: Record<string, string> = {
    common: "일반",
    uncommon: "고급",
    rare: "희귀"
  };
  return labels[rarity] ?? rarity;
}

function powerBandLabel(powerBand: string): string {
  const labels: Record<string, string> = {
    starter: "기본",
    early: "초반",
    mid: "중반",
    late: "후반",
    boss: "보스"
  };
  return labels[powerBand] ?? powerBand;
}

function resolveRuneBenchBackgroundKey(context: BootContext): string | undefined {
  const currentRoom = getCurrentRoom(context.dataBundle, context.run);
  const room = currentRoom?.type === "event"
    ? currentRoom
    : getStage(context.dataBundle, context.run)?.route.find((item) => item.type === "event");
  const eventId = getEncounterPoolContentId(context.dataBundle, room?.encounterPoolId, "event");
  return context.dataBundle.events.find((event) => event.id === eventId)?.assetKeys.scene;
}
