import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { RewardEntry } from "../../data/schema";
import { bindKeyboardActions } from "../../input/bindings";
import { findRewardEntryById, selectRewardEntries } from "../../simulation/state/runState";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderPaperPanel, renderRasterHoverHitTarget, renderSceneShell, renderTooltip, renderTransparentHitTarget, renderUiSlot, textStyle } from "../view/sceneShell";

const REWARD_ACTIONS = ["card_1", "card_2", "card_3", "card_4", "card_5"] as const;
const REWARD_RASTER_UNDERLAY_KEY = "reward_raster_underlay_concept";
const REWARD_RASTER_HOVER_CHOICE_KEY = "ui_hover_choice_badge_concept";

export class RewardScene extends Phaser.Scene {
  constructor() {
    super("RewardScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "보상",
      subtitle: "숫자 키나 카드 클릭으로 보상을 선택합니다",
      focusLabel: "보상 목록",
      chrome: "immersive",
      showImmersiveInfo: false,
      showRoute: false
    });

    const rewardPool = context.dataBundle.rewardPools.find((item) => item.id === context.run.rewardPoolId)
      ?? context.dataBundle.rewardPools[0];
    const offers = context.run.offeredRewards.length > 0
      ? context.run.offeredRewards
        .map((rewardId) => findRewardEntryById(context.dataBundle, context.run.rewardPoolId, rewardId))
        .filter((entry): entry is RewardEntry => Boolean(entry))
      : selectRewardEntries(
        context.dataBundle,
        context.run.rewardPoolId,
        Math.max(1, context.run.offeredRewards.length)
      );

    if (hasRewardRasterUnderlay(this)) {
      renderRewardRasterStage(this, context, offers.slice(0, 4));
    } else {
      renderRewardStage(this, context, rewardPool?.displayNameKo ?? "보상 목록 없음", offers.slice(0, 4));
    }

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action), context.save.settings);
    renderDebugOverlay(context, "RewardScene");
  }
}

function hasRewardRasterUnderlay(scene: Phaser.Scene): boolean {
  return scene.textures.exists(REWARD_RASTER_UNDERLAY_KEY);
}

function renderRewardRasterStage(
  scene: Phaser.Scene,
  context: BootContext,
  offers: RewardEntry[]
): void {
  scene.add.image(960, 540, REWARD_RASTER_UNDERLAY_KEY)
    .setDisplaySize(1920, 1080)
    .setDepth(0);

  const cardXs = [528, 795, 1062, 1329];
  offers.slice(0, 4).forEach((entry, index) => {
    renderRewardRasterChoice(scene, context, entry, index, cardXs[index] ?? (528 + index * 267), 610);
  });

  renderRewardRasterConfirm(scene, context);
}

function renderRewardRasterChoice(
  scene: Phaser.Scene,
  context: BootContext,
  entry: RewardEntry,
  index: number,
  x: number,
  y: number
): void {
  const action = REWARD_ACTIONS[index];
  renderRasterHoverHitTarget(scene, x, y + 20, 240, 486, () => handleSceneAction(scene, context, action), {
    hoverKey: REWARD_RASTER_HOVER_CHOICE_KEY,
    downKey: REWARD_RASTER_HOVER_CHOICE_KEY,
    hoverX: x,
    hoverY: y - 268,
    hoverWidth: 112,
    hoverHeight: 80,
    downX: x,
    downY: y - 268,
    downWidth: 124,
    downHeight: 88,
    downAlpha: 0.94
  });
}

function renderRewardRasterConfirm(scene: Phaser.Scene, context: BootContext): void {
  const x = 960;
  const y = 908;
  const width = 546;
  const height = 86;
  renderTransparentHitTarget(scene, x, y, width - 30, height - 10, () => handleSceneAction(scene, context, "confirm"));
}

function renderRewardStage(
  scene: Phaser.Scene,
  context: BootContext,
  title: string,
  offers: RewardEntry[]
): void {
  const stageX = 960;
  const stageY = 560;
  drawLayeredPaperStage(scene, stageX, stageY, 1390, 830, 0xa5483f, 0x2f6b68);

  scene.add.text(stageX, stageY - 314, "보상 무대", textStyle(20, "#fff8e6", true))
    .setOrigin(0.5)
    .setLetterSpacing(2);
  scene.add.text(stageX, stageY - 266, title, textStyle(38, "#1e2a3e", true))
    .setWordWrapWidth(900)
    .setOrigin(0.5);
  scene.add.text(stageX, stageY - 220, "하나를 고르면 즉시 획득하고 다음 장면으로 넘어갑니다", textStyle(20, "#6f4c38", true))
    .setOrigin(0.5);
  scene.add.rectangle(stageX + 470, stageY - 268, 188, 42, 0xfff1d0, 0.96)
    .setStrokeStyle(2, 0xc6a65e, 0.72);
  scene.add.text(stageX + 470, stageY - 280, "1-4 / Enter", textStyle(18, "#805845", true))
    .setOrigin(0.5, 0);

  const count = Math.max(1, Math.min(offers.length, 4));
  const cardWidth = count >= 4 ? 292 : 338;
  const cardHeight = count >= 4 ? 438 : 456;
  const spacing = count >= 4 ? 306 : 376;
  const startX = stageX - ((count - 1) * spacing) / 2;

  scene.add.rectangle(stageX, stageY + 65, 1190, 112, 0xf1d79a, 0.2)
    .setStrokeStyle(2, 0xc6a65e, 0.3);
  scene.add.rectangle(stageX, stageY + 318, 1160, 54, 0xffe2ad, 0.88)
    .setStrokeStyle(3, 0xc6a65e, 0.58);

  offers.slice(0, 4).forEach((entry, index) => {
    renderRewardChoiceCard(scene, context, entry, index, startX + index * spacing, stageY + 80, cardWidth, cardHeight);
  });

  renderTooltip(
    scene,
    stageX,
    stageY + 386,
    950,
    66,
    "숫자 키나 보상 카드를 누르면 해당 보상을 받고 다음 방으로 진행합니다."
  );
  renderActionButton(scene, stageX, stageY + 454, "첫 보상 받기", () => handleSceneAction(scene, context, "confirm"), {
    focus: true,
    width: 360,
    fontSize: 24
  });
}

function drawLayeredPaperStage(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  ribbonColor: number,
  curtainColor: number
): void {
  scene.add.rectangle(x, y + 22, width + 64, height + 42, 0x1e2a3e, 0.18);
  renderPaperPanel(scene, x, y, width, height, { alpha: 0.98 });

  scene.add.rectangle(x - width * 0.48, y + 18, 118, height * 0.78, 0xe88f78, 0.18)
    .setStrokeStyle(2, 0x8d6a2a, 0.18);
  scene.add.rectangle(x + width * 0.48, y + 18, 118, height * 0.78, 0xe88f78, 0.18)
    .setStrokeStyle(2, 0x8d6a2a, 0.18);
  for (const side of [-1, 1]) {
    scene.add.triangle(x + side * width * 0.48, y - 124, 0, 0, side * 128, 54, 0, 108, 0xffd9b8, 0.82)
      .setStrokeStyle(3, 0xc6a65e, 0.34);
    scene.add.triangle(x + side * width * 0.48, y + 134, 0, 0, side * 128, 54, 0, 108, 0xffd9b8, 0.72)
      .setStrokeStyle(3, 0xc6a65e, 0.28);
  }

  scene.add.ellipse(x, y - 116, width * 0.78, height * 0.5, curtainColor, 0.22);
  scene.add.ellipse(x, y - 86, width * 0.62, height * 0.34, 0x1f3f46, 0.2);
  scene.add.rectangle(x, y + 32, width * 0.86, height * 0.58, 0xf8eed2, 0.38)
    .setStrokeStyle(2, 0xc6a65e, 0.3);
  scene.add.rectangle(x, y - 284, width * 0.69, 86, ribbonColor, 0.94).setStrokeStyle(4, 0xf5c26b, 0.66);
  scene.add.rectangle(x, y - 234, width * 0.62, 36, 0xfff1d0, 0.9).setStrokeStyle(2, 0xc6a65e, 0.52);
  scene.add.triangle(x - width * 0.41, y - 284, 0, 0, 96, -44, 96, 44, ribbonColor, 0.92)
    .setStrokeStyle(3, 0xf5c26b, 0.55);
  scene.add.triangle(x + width * 0.41, y - 284, 0, -44, 96, 0, 0, 44, ribbonColor, 0.92)
    .setStrokeStyle(3, 0xf5c26b, 0.55);

  scene.add.rectangle(x, y + height * 0.33, width * 0.82, 76, 0xfff1d0, 0.96)
    .setStrokeStyle(3, 0xc6a65e, 0.55);
  scene.add.triangle(x - width * 0.35, y + height * 0.4, 0, 0, width * 0.35, 82, width * 0.1, 12, 0xffe2ad, 0.9);
  scene.add.triangle(x + width * 0.35, y + height * 0.4, 0, 82, width * 0.35, 0, width * 0.1, 12, 0xffe2ad, 0.9);

  for (const pinX of [x - width * 0.44, x + width * 0.44, x - width * 0.18, x + width * 0.18]) {
    scene.add.rectangle(pinX, y - 350, 9, 68, 0x6f7784, 0.74);
    scene.add.circle(pinX, y - 284, 14, 0xf5c26b, 0.98).setStrokeStyle(3, 0x6d4a20, 0.9);
    scene.add.circle(pinX - 4, y - 288, 4, 0xfff3b0, 0.9);
  }

  for (const threadX of [x - width * 0.33, x, x + width * 0.33]) {
    scene.add.rectangle(threadX, y - 182, 3, 164, 0x805845, 0.34);
    scene.add.circle(threadX, y - 96, 8, 0xf5c26b, 0.88).setStrokeStyle(2, 0x6d4a20, 0.62);
  }
}

function renderRewardChoiceCard(
  scene: Phaser.Scene,
  context: BootContext,
  entry: RewardEntry,
  index: number,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const action = REWARD_ACTIONS[index];
  const accent = rewardAccentColor(entry.type);

  scene.add.rectangle(x + 10, y + 14, width, height, 0x1e2a3e, 0.16);
  scene.add.rectangle(x, y + height / 2 + 18, width * 0.72, 22, 0x805845, 0.2);
  renderUiSlot(scene, x, y, width, height, "reward", {
    focus: index === 0,
    interactive: true,
    onClick: () => handleSceneAction(scene, context, action)
  });

  scene.add.rectangle(x, y - height / 2 + 42, width - 34, 54, accent, 0.92)
    .setStrokeStyle(2, 0xf5c26b, 0.5);
  scene.add.rectangle(x, y - height / 2 + 74, width - 44, 14, 0xffe2ad, 0.78);
  scene.add.circle(x - width / 2 + 52, y - height / 2 + 42, 25, 0xfff1d0, 0.98)
    .setStrokeStyle(3, accent, 0.9);
  scene.add.text(x - width / 2 + 52, y - height / 2 + 23, `${index + 1}`, textStyle(25, "#1e2a3e", true))
    .setOrigin(0.5, 0);
  scene.add.text(x - width / 2 + 88, y - height / 2 + 24, rewardTypeLabel(entry.type), textStyle(18, "#fff8e6", true));
  renderRewardIcon(scene, context, entry, x + width / 2 - 50, y - height / 2 + 42);

  renderRewardArt(scene, context, entry, x, y - 78, width - 64, height >= 450 ? 172 : 158);

  scene.add.rectangle(x, y + 78, width - 48, 126, 0xfffbef, 0.9)
    .setStrokeStyle(2, accent, 0.3);
  scene.add.rectangle(x - width / 2 + 30, y + 22, 7, 112, accent, 0.82);
  scene.add.text(x - width / 2 + 48, y + 20, rewardLabel(context, entry), textStyle(width < 310 ? 21 : 23, "#1e2a3e", true))
    .setWordWrapWidth(width - 86);
  scene.add.text(x - width / 2 + 48, y + 88, rewardDetailLabel(entry), textStyle(17, "#5f4938", true))
    .setWordWrapWidth(width - 92);

  scene.add.rectangle(x, y + height / 2 - 44, width - 46, 44, accent, 0.14)
    .setStrokeStyle(2, accent, 0.36);
  scene.add.text(x - width / 2 + 28, y + height / 2 - 55, rewardActionLabel(entry.type), textStyle(18, "#805845", true))
    .setWordWrapWidth(width - 48);
  scene.add.text(x + width / 2 - 92, y + height / 2 - 55, "선택", textStyle(18, "#805845", true));

  scene.add.triangle(x + width / 2 - 42, y - height / 2 + 78, 0, 0, 42, 0, 42, 42, 0xf7dfae, 0.82);
  scene.add.triangle(x - width / 2 + 42, y + height / 2 - 42, 0, 42, 42, 42, 0, 0, 0xf7dfae, 0.62);
  if (index === 0) {
    scene.add.rectangle(x, y - height / 2 - 12, width - 46, 18, 0xfff3b0, 0.86)
      .setStrokeStyle(2, 0xc6a65e, 0.72);
    scene.add.text(x, y - height / 2 - 21, "기본 선택", textStyle(14, "#6f4c38", true)).setOrigin(0.5, 0);
  }
}

function renderRewardArt(
  scene: Phaser.Scene,
  context: BootContext,
  entry: RewardEntry,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const artKey = rewardArtKey(context, entry) ?? rewardIconKey(context, entry);
  scene.add.rectangle(x, y + 7, width + 18, height + 18, 0x1e2a3e, 0.08);
  scene.add.rectangle(x, y, width + 16, height + 16, 0xfff7e6, 0.86)
    .setStrokeStyle(3, rewardAccentColor(entry.type), 0.38);
  scene.add.rectangle(x, y + height * 0.31, width + 10, height * 0.28, 0xe8d8b0, 0.34);

  if (artKey && scene.textures.exists(artKey)) {
    const isCardArt = entry.type === "card";
    const artWidth = isCardArt ? width : Math.min(width, height) * 0.74;
    const artHeight = isCardArt ? height : Math.min(width, height) * 0.74;
    scene.add.image(x, y, artKey).setDisplaySize(artWidth, artHeight);
    return;
  }

  scene.add.circle(x, y, Math.min(width, height) * 0.32, 0xf5c26b, 0.82).setStrokeStyle(3, 0x805845, 0.9);
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

function rewardArtKey(context: BootContext, entry: RewardEntry): string | undefined {
  if (entry.type === "card") {
    return context.dataBundle.cards.find((card) => card.id === entry.contentId)?.assetKeys.illustration;
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
  return displayName ?? `${rewardTypeLabel(entry.type)} ${entry.amount ?? ""}`.trim();
}

function rewardDetailLabel(entry: RewardEntry): string {
  if (entry.type === "currency") return `골드 +${entry.amount ?? 0}`;
  if (entry.type === "heal") return `체력 +${entry.amount ?? 0}`;
  if (entry.type === "unlock") return "새 진행 요소";
  if (entry.type === "card") return "덱에 바로 추가";
  if (entry.type === "rune") return "카드에 장착 가능";
  if (entry.type === "relic") return "획득 즉시 패시브";
  if (entry.type === "arcana") return "런 규칙 강화";
  return "";
}

function rewardActionLabel(type: RewardEntry["type"]): string {
  const labels: Record<RewardEntry["type"], string> = {
    card: "덱에 넣기",
    rune: "룬 보관",
    relic: "유물 획득",
    arcana: "규칙 각인",
    currency: "주머니에 담기",
    heal: "회복 받기",
    unlock: "해금 기록"
  };
  return labels[type] ?? "받기";
}

function rewardTypeLabel(type: RewardEntry["type"]): string {
  const labels: Record<RewardEntry["type"], string> = {
    card: "카드",
    rune: "룬",
    relic: "유물",
    arcana: "아르카나",
    currency: "골드",
    heal: "회복",
    unlock: "해금"
  };
  return labels[type] ?? type;
}

function rewardAccentColor(type: RewardEntry["type"]): number {
  const colors: Record<RewardEntry["type"], number> = {
    card: 0xa5483f,
    rune: 0x2f6b68,
    relic: 0x8d6a2a,
    arcana: 0x4d5f93,
    currency: 0xb98c34,
    heal: 0x4f7d61,
    unlock: 0x805845
  };
  return colors[type] ?? 0x805845;
}
