import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { RoomType, StageData } from "../../data/schema";
import { bindKeyboardActions } from "../../input/bindings";
import { clearStoredSave } from "../../save/saveCodec";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderPaperPanel, renderRasterHoverHitTarget, renderSceneShell, renderTooltip, renderUiSlot, textStyle, triggerRasterHitTargetDown } from "../view/sceneShell";

const TOWN_RASTER_UNDERLAY_KEY = "town_raster_underlay_concept";
const TOWN_RASTER_HOVER_ACTION_KEY = "ui_hover_action_seal_concept";
const TOWN_RASTER_EXPEDITION_ACTION_KEYS = {
  hover: "ui_hover_town_expedition_action_concept",
  down: "ui_down_town_expedition_action_concept"
};
const TOWN_RASTER_TOOLBAR_RESET_KEYS = {
  hover: "ui_hover_town_toolbar_reset_concept",
  down: "ui_down_town_toolbar_reset_concept"
};
const TOWN_RASTER_TOOLBAR_SETTINGS_KEYS = {
  hover: "ui_hover_town_toolbar_settings_concept",
  down: "ui_down_town_toolbar_settings_concept"
};

export class TownScene extends Phaser.Scene {
  constructor() {
    super("TownScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "종이극장 마을",
      subtitle: "새 탐험 준비",
      focusLabel: "다음 탐험",
      chrome: "immersive",
      showImmersiveInfo: false,
      showHand: false,
      showRoute: false
    });

    const rasterControls = hasTownRasterUnderlay(this)
      ? renderTownRasterStage(this, context)
      : undefined;
    if (!rasterControls) {
      renderTownTheater(this, context);
    }

    bindKeyboardActions(this, (action) => {
      if (action === "confirm" && triggerRasterHitTargetDown(this, rasterControls?.confirmHitTarget, () => handleSceneAction(this, context, action))) {
        return;
      }
      handleSceneAction(this, context, action);
    }, context.save.settings);
    renderDebugOverlay(context, "TownScene");
  }
}

function hasTownRasterUnderlay(scene: Phaser.Scene): boolean {
  return scene.textures.exists(TOWN_RASTER_UNDERLAY_KEY);
}

interface TownRasterControls {
  confirmHitTarget?: Phaser.GameObjects.Rectangle;
}

function renderTownRasterStage(scene: Phaser.Scene, context: BootContext): TownRasterControls {
  scene.add.image(960, 540, TOWN_RASTER_UNDERLAY_KEY)
    .setDisplaySize(1920, 1080)
    .setDepth(0);

  const confirmHitTarget = renderTownRasterHitTarget(scene, 1010, 642, 330, 66, 0xf5c26b, () => handleSceneAction(scene, context, "confirm"), {
    hoverKey: TOWN_RASTER_EXPEDITION_ACTION_KEYS.hover,
    downKey: TOWN_RASTER_EXPEDITION_ACTION_KEYS.down,
    hoverX: 1048,
    hoverY: 643,
    hoverWidth: 160,
    hoverHeight: 154,
    downX: 1048,
    downY: 643,
    downWidth: 160,
    downHeight: 154,
    hoverAlpha: 0.96,
    downAlpha: 0.88
  });
  renderTownRasterHitTarget(scene, 1010, 724, 330, 58, 0xce5869, () => resetStoredSave(scene, context), {
    hoverKey: "",
    downKey: ""
  });
  renderTownRasterHitTarget(scene, 1010, 806, 330, 58, 0x6c8fd6, () => scene.scene.start("SettingsScene", context), {
    hoverKey: "",
    downKey: ""
  });

  renderTownRasterHitTarget(scene, 1340, 976, 140, 104, 0x6c8fd6, () => scene.scene.start("SettingsScene", context), {
    hoverKey: TOWN_RASTER_TOOLBAR_SETTINGS_KEYS.hover,
    downKey: TOWN_RASTER_TOOLBAR_SETTINGS_KEYS.down,
    hoverX: 1340,
    hoverY: 976,
    hoverWidth: 220,
    hoverHeight: 164,
    downX: 1340,
    downY: 976,
    downWidth: 220,
    downHeight: 164,
    hoverAlpha: 0.96,
    downAlpha: 0.86
  });
  renderTownRasterHitTarget(scene, 514, 976, 140, 104, 0xce5869, () => resetStoredSave(scene, context), {
    hoverKey: TOWN_RASTER_TOOLBAR_RESET_KEYS.hover,
    downKey: TOWN_RASTER_TOOLBAR_RESET_KEYS.down,
    hoverX: 514,
    hoverY: 976,
    hoverWidth: 230,
    hoverHeight: 142,
    downX: 514,
    downY: 976,
    downWidth: 230,
    downHeight: 142,
    hoverAlpha: 0.96,
    downAlpha: 0.86
  });

  return { confirmHitTarget };
}

function renderTownRasterHitTarget(
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
): Phaser.GameObjects.Rectangle {
  const hoverSize = Math.min(104, Math.max(76, Math.min(width, height) * 1.08));
  return renderRasterHoverHitTarget(scene, x, y, width, height, onClick, {
    hoverKey: options.hoverKey ?? TOWN_RASTER_HOVER_ACTION_KEY,
    downKey: options.downKey ?? TOWN_RASTER_HOVER_ACTION_KEY,
    hoverX: options.hoverX ?? x + width * 0.42,
    hoverY: options.hoverY ?? y - height * 0.28,
    hoverWidth: options.hoverWidth ?? hoverSize,
    hoverHeight: options.hoverHeight ?? hoverSize,
    downX: options.downX ?? x + width * 0.42,
    downY: options.downY ?? y - height * 0.28,
    downWidth: options.downWidth ?? hoverSize * 1.12,
    downHeight: options.downHeight ?? hoverSize * 1.12,
    hoverAlpha: options.hoverAlpha,
    downAlpha: options.downAlpha ?? 0.76
  });
}

function renderTownTheater(scene: Phaser.Scene, context: BootContext): void {
  const stage = context.dataBundle.stages.find((item) => item.id === context.run.stageId)
    ?? context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];
  const character = context.dataBundle.characters.find((item) => item.id === context.run.characterId)
    ?? context.dataBundle.characters[0];
  const unlocked = context.save.profile.unlockedStages.length;
  const completed = context.save.profile.completedStages.length;
  const totalStages = context.dataBundle.stages.length;
  const completedLabel = context.save.profile.completedStages.length > 0
    ? context.save.profile.completedStages
      .map((stageId) => getStageLabel(context, stageId))
      .join(", ")
    : "기록 없음";
  const nextUnlockedStage = getNextUnlockedStage(context);
  const nextLockedStage = getNextLockedStage(context);

  scene.add.rectangle(960, 560, 1680, 840, 0xfff7e8, 0.48)
    .setStrokeStyle(6, 0xb98c34, 0.44);
  scene.add.polygon(178, 540, [0, -356, 166, -294, 184, 300, 0, 372, -74, 300, -58, -298], 0x9ec3b8, 0.36)
    .setStrokeStyle(5, 0x5d8d86, 0.55);
  scene.add.polygon(1742, 540, [0, -356, 58, -298, 74, 300, 0, 372, -184, 300, -166, -294], 0xce5869, 0.28)
    .setStrokeStyle(5, 0x9a4653, 0.46);

  renderPaperPanel(scene, 960, 124, 800, 132, { alpha: 0.96 });
  scene.add.rectangle(960, 188, 720, 18, 0xf5c26b, 0.72);
  scene.add.circle(610, 124, 17, 0xc6a65e, 0.9).setStrokeStyle(3, 0xfff3b0, 0.8);
  scene.add.circle(1310, 124, 17, 0xc6a65e, 0.9).setStrokeStyle(3, 0xfff3b0, 0.8);
  scene.add.text(960, 82, "종이극장 마을", textStyle(42, "#1e2a3e", true)).setOrigin(0.5);
  scene.add.text(960, 137, "탐험 전 여권과 지도를 정리하는 접이식 무대", textStyle(22, "#805845", true)).setOrigin(0.5);

  renderVillageDiorama(scene, stage, nextLockedStage);
  renderPlayerPassport(scene, character, context);
  renderExpeditionBoard(scene, context, stage, nextUnlockedStage, nextLockedStage, unlocked, completed, totalStages, completedLabel);

  renderActionButton(scene, 1010, 642, "세계 지도", () => handleSceneAction(scene, context, "confirm"), {
    width: 330,
    height: 66,
    fontSize: 25,
    focus: true
  });
  renderActionButton(scene, 1010, 724, "저장 초기화", () => resetStoredSave(scene, context), {
    width: 330,
    height: 58,
    variant: "secondary",
    fontSize: 22
  });
  renderActionButton(scene, 1010, 806, "설정", () => scene.scene.start("SettingsScene", context), {
    width: 330,
    height: 58,
    variant: "secondary",
    fontSize: 22
  });

  renderTooltip(scene, 1250, 914, 760, 78, "지도문에는 다음 탐험과 저장 기록이 함께 꽂혀 있습니다. 표시된 기록은 현재 저장 데이터 기준입니다.");
}

function renderVillageDiorama(
  scene: Phaser.Scene,
  stage: StageData | undefined,
  nextLockedStage: StageData | undefined
): void {
  renderPaperPanel(scene, 494, 584, 586, 646, { alpha: 0.97 });
  scene.add.text(254, 300, "마을 무대", textStyle(30, "#32415a", true));
  scene.add.text(254, 344, stage?.displayNameKo ?? "스테이지 없음", textStyle(25, "#805845", true)).setWordWrapWidth(410);

  scene.add.ellipse(494, 744, 452, 66, 0x32415a, 0.12);
  scene.add.rectangle(344, 664, 138, 180, 0xf5d58a, 0.88).setStrokeStyle(4, 0xb98c34, 0.78);
  scene.add.triangle(344, 536, 250, 618, 438, 618, 344, 504, 0xce5869, 0.72).setStrokeStyle(4, 0x9a4653, 0.72);
  scene.add.rectangle(494, 610, 172, 238, 0xfffbef, 0.92).setStrokeStyle(5, 0xc6a65e, 0.9);
  scene.add.triangle(494, 442, 382, 520, 606, 520, 494, 392, 0x5d8d86, 0.66).setStrokeStyle(5, 0x3f6f68, 0.66);
  scene.add.rectangle(646, 674, 116, 156, 0xf4c7a1, 0.88).setStrokeStyle(4, 0xb98c34, 0.72);
  scene.add.triangle(646, 560, 560, 620, 732, 620, 646, 522, 0x6c8fd6, 0.58).setStrokeStyle(4, 0x4c659d, 0.6);

  scene.add.rectangle(494, 754, 84, 126, 0x805845, 0.76).setStrokeStyle(3, 0xfff3b0, 0.72);
  scene.add.circle(522, 754, 6, 0xfff3b0, 0.9);
  scene.add.rectangle(342, 706, 42, 52, 0xfff3b0, 0.62).setStrokeStyle(2, 0xb98c34, 0.62);
  scene.add.rectangle(646, 706, 40, 44, 0xfff3b0, 0.62).setStrokeStyle(2, 0xb98c34, 0.62);
  scene.add.text(300, 812, "지도문", textStyle(20, "#32415a", true));
  scene.add.text(456, 812, "여관", textStyle(20, "#32415a", true));
  scene.add.text(610, 812, "공방", textStyle(20, "#32415a", true));
  renderBuildingTag(scene, 342, 640, "지도", "열림");
  renderBuildingTag(scene, 494, 548, "원정", stage ? "준비" : "없음");
  renderBuildingTag(scene, 646, 632, "다음", nextLockedStage ? "봉인" : "완주");
}

function renderPlayerPassport(
  scene: Phaser.Scene,
  character: BootContext["dataBundle"]["characters"][number] | undefined,
  context: BootContext
): void {
  renderPaperPanel(scene, 495, 930, 586, 162, { alpha: 0.94 });
  scene.add.text(236, 872, "탐험 여권", textStyle(25, "#32415a", true));
  if (character?.assetKeys.portrait && scene.textures.exists(character.assetKeys.portrait)) {
    scene.add.circle(314, 944, 54, 0xfff2d6, 0.88).setStrokeStyle(4, 0xc6a65e, 0.95);
    scene.add.image(314, 944, character.assetKeys.portrait).setDisplaySize(96, 96);
  }
  scene.add.text(390, 906, character?.displayNameKo ?? "캐릭터 없음", textStyle(25, "#1e2a3e", true)).setWordWrapWidth(250);
  scene.add.text(
    390,
    952,
    `체력 ${context.run.player.hp}/${context.run.player.maxHp}  골드 ${context.run.player.gold}`,
    textStyle(21, "#805845", true)
  ).setWordWrapWidth(330);
}

function renderExpeditionBoard(
  scene: Phaser.Scene,
  context: BootContext,
  stage: StageData | undefined,
  nextUnlockedStage: StageData | undefined,
  nextLockedStage: StageData | undefined,
  unlocked: number,
  completed: number,
  totalStages: number,
  completedLabel: string
): void {
  renderPaperPanel(scene, 1218, 522, 706, 462, { alpha: 0.97 });
  scene.add.text(912, 318, "탐험 게시판", textStyle(32, "#32415a", true));
  scene.add.text(912, 368, stage?.displayNameKo ?? "스테이지 없음", textStyle(28, "#1e2a3e", true)).setWordWrapWidth(548);

  renderTownStat(scene, 960, 446, "해금", `${unlocked}/${totalStages}`);
  renderTownStat(scene, 1172, 446, "클리어", `${completed}/${totalStages}`);
  renderTownStat(scene, 1384, 446, "남은 장", `${Math.max(0, totalStages - completed)}`);

  const sealedLine = nextLockedStage
    ? `봉인: ${nextLockedStage.displayNameKo}`
    : "봉인 없음";
  scene.add.text(1384, 474, sealedLine, textStyle(12, nextLockedStage ? "#805845" : "#1f8a70", true))
    .setOrigin(0.5, 0)
    .setWordWrapWidth(146);

  renderUiSlot(scene, 1218, 532, 548, 66, "choice", { disabled: true, focus: Boolean(nextUnlockedStage) });
  scene.add.text(982, 510, "다음 원정", textStyle(18, "#1f8a70", true));
  scene.add.text(1102, 508, nextUnlockedStage?.displayNameKo ?? stage?.displayNameKo ?? "스테이지 없음", textStyle(22, "#1e2a3e", true)).setWordWrapWidth(344);
  scene.add.text(1102, 536, getStageProgressLine(context, nextUnlockedStage ?? stage), textStyle(16, "#805845", true)).setWordWrapWidth(344);

  renderUiSlot(scene, 1218, 596, 548, 52, "choice", { disabled: true });
  scene.add.text(980, 580, "완료 인장", textStyle(18, "#32415a", true));
  scene.add.text(1102, 580, completedLabel, textStyle(17, "#805845", true)).setWordWrapWidth(344);

  const route = (nextUnlockedStage ?? stage)?.route.slice(0, 5) ?? [];
  scene.add.text(1210, 616, "첫 경로", textStyle(20, "#32415a", true));
  route.forEach((room, index) => {
    const x = 1228 + index * 74;
    const color = roomColor(room.type);
    scene.add.circle(x, 664, 30, color, 0.86).setStrokeStyle(index === 0 ? 5 : 3, index === 0 ? 0xfff3b0 : 0xffffff, 0.88);
    scene.add.text(x, 656, `${index + 1}`, textStyle(18, "#fff5d7", true)).setOrigin(0.5);
  });
  scene.add.text(1210, 702, route.map((room) => roomTypeLabel(room.type)).join(" > "), textStyle(16, "#805845", true)).setWordWrapWidth(320);
}

function renderTownStat(scene: Phaser.Scene, x: number, y: number, label: string, value: string): void {
  renderUiSlot(scene, x, y, 156, 82, "reward", { disabled: true });
  scene.add.text(x, y - 28, label, textStyle(20, "#805845", true)).setOrigin(0.5);
  scene.add.text(x, y + 3, value, textStyle(33, "#1e2a3e", true)).setOrigin(0.5);
}

function renderBuildingTag(scene: Phaser.Scene, x: number, y: number, label: string, value: string): void {
  scene.add.rectangle(x, y, 92, 42, 0xfff6df, 0.72).setStrokeStyle(3, 0xc6a65e, 0.7);
  scene.add.text(x - 36, y - 15, label, textStyle(13, "#805845", true)).setWordWrapWidth(72);
  scene.add.text(x - 36, y + 4, value, textStyle(15, "#1e2a3e", true)).setWordWrapWidth(72);
}

function getNextUnlockedStage(context: BootContext): StageData | undefined {
  const unlocked = context.save.profile.unlockedStages;
  const completed = new Set(context.save.profile.completedStages);
  return context.dataBundle.stages.find((stage) => unlocked.includes(stage.id) && !completed.has(stage.id))
    ?? context.dataBundle.stages.find((stage) => stage.id === context.run.stageId)
    ?? context.dataBundle.stages[0];
}

function getNextLockedStage(context: BootContext): StageData | undefined {
  const unlocked = new Set(context.save.profile.unlockedStages);
  return context.dataBundle.stages.find((stage) => !unlocked.has(stage.id));
}

function getStageLabel(context: BootContext, stageId: string): string {
  return context.dataBundle.stages.find((stage) => stage.id === stageId)?.displayNameKo ?? stageId;
}

function getStageProgressLine(context: BootContext, stage: StageData | undefined): string {
  if (!stage) return "경로 없음";
  const completed = context.save.profile.completedStages.includes(stage.id);
  const unlocked = context.save.profile.unlockedStages.includes(stage.id);
  if (completed) return "완료된 장 / 다시 정비 가능";
  if (unlocked) return `열린 장 / 방 ${context.run.roomIndex + 1}/${stage.route.length}`;
  return "봉인된 장 / 해금 필요";
}

function roomColor(type: RoomType): number {
  const colors: Record<RoomType, number> = {
    combat: 0x5d8d86,
    elite: 0xce5869,
    event: 0x6c8fd6,
    shop: 0xf5c26b,
    rest: 0x9ec3b8,
    reward: 0xb98c34,
    boss: 0x8d4b7a
  };
  return colors[type];
}

function roomTypeLabel(type: RoomType): string {
  const labels: Record<RoomType, string> = {
    combat: "전투",
    elite: "정예",
    event: "사건",
    shop: "상점",
    rest: "휴식",
    reward: "보상",
    boss: "보스"
  };
  return labels[type];
}

function resetStoredSave(scene: Phaser.Scene, context: BootContext): void {
  clearStoredSave({ debug: context.runtimeFlags.debug });
  scene.scene.start("BootScene");
}
