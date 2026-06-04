import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { StageData } from "../../data/schema";
import { bindKeyboardActions } from "../../input/bindings";
import { persistSave } from "../../save/saveCodec";
import { selectWorldMapStage } from "../../simulation/systems/dungeon/dungeonSystem";
import { sliceRunToSaveRun } from "../../simulation/state/runState";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext, storeBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderPaperPanel, renderRasterHoverHitTarget, renderSceneShell, renderUiSlot, textStyle } from "../view/sceneShell";

const WORLD_MAP_RASTER_UNDERLAY_KEY = "world_map_raster_underlay_concept";
const WORLD_MAP_RASTER_HOVER_NODE_KEY = "ui_hover_route_node_concept";
const WORLD_MAP_RASTER_HOVER_PLAY_KEY = "ui_hover_world_map_play_button_concept";
const WORLD_MAP_RASTER_DOWN_PLAY_KEY = "ui_down_world_map_play_button_concept";
const WORLD_MAP_RASTER_CURRENT_MARKER_KEY = "ui_current_stage_marker_concept";
const WORLD_MAP_RASTER_CURRENT_HALO_KEY = "ui_current_stage_halo_concept";
const WORLD_MAP_RASTER_CURRENT_STATUS_KEY = "ui_current_stage_status_badge_concept";
const WORLD_MAP_RASTER_STAGE_NODES: Array<{ x: number; y: number; width: number; height: number }> = [
  { x: 586, y: 760, width: 150, height: 150 },
  { x: 808, y: 756, width: 150, height: 150 },
  { x: 1000, y: 744, width: 150, height: 150 },
  { x: 1168, y: 704, width: 164, height: 164 },
  { x: 1328, y: 574, width: 150, height: 150 },
  { x: 1168, y: 462, width: 142, height: 142 },
  { x: 914, y: 486, width: 142, height: 142 },
  { x: 760, y: 496, width: 142, height: 142 },
  { x: 606, y: 486, width: 142, height: 142 },
  { x: 648, y: 264, width: 150, height: 150 },
  { x: 790, y: 304, width: 142, height: 142 },
  { x: 960, y: 304, width: 142, height: 142 },
  { x: 1094, y: 304, width: 142, height: 142 },
  { x: 1252, y: 166, width: 170, height: 170 },
  { x: 1378, y: 306, width: 170, height: 170 }
];

interface StageMapRow {
  stage: StageData;
  unlocked: boolean;
  current: boolean;
  completed: boolean;
  nextLocked: boolean;
}

export class WorldMapScene extends Phaser.Scene {
  constructor() {
    super("WorldMapScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "세계 지도",
      subtitle: "펼친 경로",
      focusLabel: "현재 지도",
      chrome: "immersive",
      showImmersiveInfo: false,
      showHand: false,
      showRoute: false
    });

    if (hasWorldMapRasterUnderlay(this)) {
      renderWorldMapRasterStage(this, context);
    } else {
      renderWorldMapTheater(this, context);
    }

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action), context.save.settings);
    renderDebugOverlay(context, "WorldMapScene");
  }
}

function hasWorldMapRasterUnderlay(scene: Phaser.Scene): boolean {
  return scene.textures.exists(WORLD_MAP_RASTER_UNDERLAY_KEY);
}

function renderWorldMapRasterStage(scene: Phaser.Scene, context: BootContext): void {
  scene.add.image(960, 540, WORLD_MAP_RASTER_UNDERLAY_KEY)
    .setDisplaySize(1920, 1080)
    .setDepth(0);

  renderWorldMapRasterHitTarget(scene, 1576, 970, 280, 144, 0xf5c26b, () => handleSceneAction(scene, context, "confirm"));
  renderWorldMapCurrentStageMarker(scene, context);
  renderWorldMapRasterStageNodes(scene, context);
}

function renderWorldMapCurrentStageMarker(scene: Phaser.Scene, context: BootContext): void {
  const currentStageIndex = context.dataBundle.stages.findIndex((stage) => stage.id === context.run.stageId);
  const node = WORLD_MAP_RASTER_STAGE_NODES[currentStageIndex];
  if (!node) return;

  if (scene.textures.exists(WORLD_MAP_RASTER_CURRENT_HALO_KEY)) {
    scene.add.image(node.x + 2, node.y + 4, WORLD_MAP_RASTER_CURRENT_HALO_KEY)
      .setDisplaySize(node.width * 1.78, node.height * 1.9)
      .setAlpha(0.76)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(7);
  }

  if (scene.textures.exists(WORLD_MAP_RASTER_CURRENT_MARKER_KEY)) {
    scene.add.image(node.x + 4, node.y - Math.max(88, node.height * 0.62), WORLD_MAP_RASTER_CURRENT_MARKER_KEY)
      .setDisplaySize(76, 86)
      .setAlpha(0.98)
      .setDepth(8);
  }

  if (scene.textures.exists(WORLD_MAP_RASTER_CURRENT_STATUS_KEY)) {
    scene.add.image(node.x + node.width * 0.1, node.y + node.height * 0.36, WORLD_MAP_RASTER_CURRENT_STATUS_KEY)
      .setDisplaySize(72, 72)
      .setAlpha(0.98)
      .setDepth(8);
  }
}

function renderWorldMapRasterStageNodes(scene: Phaser.Scene, context: BootContext): void {
  const unlockedStageIds = new Set([...context.save.profile.unlockedStages, context.run.stageId]);
  context.dataBundle.stages.forEach((stage, index) => {
    const node = WORLD_MAP_RASTER_STAGE_NODES[index];
    if (!node || !unlockedStageIds.has(stage.id)) return;
    renderWorldMapRasterNodeHitTarget(
      scene,
      node.x,
      node.y,
      node.width,
      node.height,
      0x5eead4,
      () => selectStageAndRestart(scene, context, stage.id)
    );
  });
}

function renderWorldMapRasterNodeHitTarget(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  _accent: number,
  onClick: () => void
): void {
  renderRasterHoverHitTarget(scene, x, y, width, height, onClick, {
    hoverKey: WORLD_MAP_RASTER_HOVER_NODE_KEY,
    hoverX: x + 72,
    hoverY: y - 62,
    hoverWidth: 88,
    hoverHeight: 88,
    downAlpha: 0.76
  });
}

function renderWorldMapRasterHitTarget(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  _accent: number,
  onClick: () => void
): void {
  renderRasterHoverHitTarget(scene, x, y, width, height, onClick, {
    hoverKey: WORLD_MAP_RASTER_HOVER_PLAY_KEY,
    downKey: WORLD_MAP_RASTER_DOWN_PLAY_KEY,
    hoverX: x,
    hoverY: y,
    downX: x,
    downY: y,
    hoverWidth: width,
    hoverHeight: height,
    downWidth: width,
    downHeight: height,
    hoverAlpha: 0.96,
    downAlpha: 0.94
  });
}

function renderWorldMapTheater(scene: Phaser.Scene, context: BootContext): void {
  const stage = context.dataBundle.stages.find((item) => item.id === context.run.stageId)
    ?? context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];
  const completed = new Set(context.save.profile.completedStages);
  const stageRows = buildStageMapRows(context, stage, completed);

  scene.add.rectangle(960, 560, 1680, 840, 0xfff8e8, 0.5)
    .setStrokeStyle(6, 0xb98c34, 0.42);
  scene.add.polygon(170, 540, [0, -352, 168, -284, 190, 308, 0, 376, -80, 306, -62, -294], 0x6c8fd6, 0.26)
    .setStrokeStyle(5, 0x4c659d, 0.48);
  scene.add.polygon(1750, 540, [0, -352, 62, -294, 80, 306, 0, 376, -190, 308, -168, -284], 0x5d8d86, 0.28)
    .setStrokeStyle(5, 0x3f6f68, 0.5);

  renderPaperPanel(scene, 960, 126, 800, 132, { alpha: 0.96 });
  scene.add.circle(610, 126, 17, 0xc6a65e, 0.9).setStrokeStyle(3, 0xfff3b0, 0.8);
  scene.add.circle(1310, 126, 17, 0xc6a65e, 0.9).setStrokeStyle(3, 0xfff3b0, 0.8);
  scene.add.rectangle(960, 190, 720, 18, 0xf5c26b, 0.7);
  scene.add.text(960, 82, "세계 지도", textStyle(42, "#1e2a3e", true)).setOrigin(0.5);
  scene.add.text(960, 137, "마을에서 펼쳐 든 현재 탐험 경로", textStyle(22, "#805845", true)).setOrigin(0.5);

  renderUnlockedMapLedger(scene, context, stageRows);
  renderFoldedRouteMap(scene, stage, context.run.roomIndex);
  renderStageDetailLedger(scene, context, stage, completed.has(stage?.id ?? ""));

  renderActionButton(scene, 1576, 970, "던전으로", () => handleSceneAction(scene, context, "confirm"), {
    width: 280,
    height: 78,
    fontSize: 25,
    focus: true
  });
}

function renderUnlockedMapLedger(
  scene: Phaser.Scene,
  context: BootContext,
  rows: StageMapRow[]
): void {
  renderPaperPanel(scene, 430, 602, 486, 610, { alpha: 0.96 });
  scene.add.text(236, 332, "지도 서랍", textStyle(31, "#32415a", true));
  scene.add.text(236, 378, "해금된 지도와 다음 목적지", textStyle(20, "#805845", true));

  rows.forEach((row, index) => {
    const y = 438 + index * 68;
    const selectable = row.unlocked && !row.current;
    renderUiSlot(scene, 430, y, 372, 54, "choice", {
      disabled: !row.unlocked,
      focus: row.current,
      interactive: selectable,
      onClick: selectable ? () => selectStageAndRestart(scene, context, row.stage.id) : undefined
    });
    if (row.stage.assetKeys.mapIcon && scene.textures.exists(row.stage.assetKeys.mapIcon)) {
      scene.add.image(278, y, row.stage.assetKeys.mapIcon).setDisplaySize(34, 34);
    } else {
      scene.add.circle(278, y, 16, row.current ? 0xf5c26b : row.unlocked ? 0x5d8d86 : 0x8f8179, 0.8);
    }
    scene.add.text(318, y - 18, row.stage.displayNameKo, textStyle(18, row.unlocked ? "#1e2a3e" : "#6d5a48", true)).setWordWrapWidth(198);
    scene.add.text(318, y + 7, stageRowStatus(row), textStyle(15, row.completed ? "#1f8a70" : "#805845", true));
  });

  scene.add.rectangle(430, 854, 354, 70, 0xfff6df, 0.42).setStrokeStyle(3, 0xc6a65e, 0.5);
  scene.add.text(274, 833, "잠긴 지도는 클리어 기록으로 열립니다.", textStyle(18, "#805845", true)).setWordWrapWidth(300);
}

function renderFoldedRouteMap(
  scene: Phaser.Scene,
  stage: BootContext["dataBundle"]["stages"][number] | undefined,
  roomIndex: number
): void {
  renderPaperPanel(scene, 1040, 632, 820, 642, { alpha: 0.97 });
  scene.add.text(690, 336, "펼친 지도", textStyle(32, "#32415a", true));
  scene.add.text(690, 384, stage?.displayNameKo ?? "스테이지 없음", textStyle(28, "#1e2a3e", true)).setWordWrapWidth(560);

  const mapKey = stage?.assetKeys.mapIcon;
  if (mapKey && scene.textures.exists(mapKey)) {
    scene.add.circle(1424, 378, 58, 0xfff2d6, 0.78).setStrokeStyle(4, 0xc6a65e, 0.9);
    scene.add.image(1424, 378, mapKey).setDisplaySize(82, 82);
  }

  drawFoldLines(scene);
  renderRoutePath(scene, stage?.route ?? [], roomIndex);
}

function renderStageDetailLedger(
  scene: Phaser.Scene,
  context: BootContext,
  stage: BootContext["dataBundle"]["stages"][number] | undefined,
  isCompleted: boolean
): void {
  renderPaperPanel(scene, 1484, 800, 382, 240, { alpha: 0.95 });
  scene.add.text(1322, 706, "지도 기록", textStyle(27, "#32415a", true));
  scene.add.text(1322, 752, `상태 ${isCompleted ? "클리어" : "탐험 전"}`, textStyle(22, isCompleted ? "#1f8a70" : "#805845", true));
  scene.add.text(1322, 792, `방 수 ${stage?.route.length ?? 0}`, textStyle(21, "#805845", true));
  scene.add.text(1322, 832, `해금 ${context.save.profile.unlockedStages.length}/${context.dataBundle.stages.length}`, textStyle(18, "#805845", true));
  scene.add.text(1322, 866, "클리어하면 다음 지도가 열립니다.", textStyle(16, "#805845", true)).setWordWrapWidth(292);
}

function buildStageMapRows(
  context: BootContext,
  currentStage: StageData | undefined,
  completed: Set<string>
): StageMapRow[] {
  const unlocked = new Set(context.save.profile.unlockedStages);
  if (currentStage) unlocked.add(currentStage.id);

  const firstLockedIndex = context.dataBundle.stages.findIndex((stage) => !unlocked.has(stage.id));
  const desiredIds = [
    ...context.dataBundle.stages.filter((stage) => unlocked.has(stage.id)).map((stage) => stage.id),
    ...(firstLockedIndex >= 0 ? [context.dataBundle.stages[firstLockedIndex].id] : []),
    ...(currentStage ? [currentStage.id] : [])
  ];
  const uniqueIds = [...new Set(desiredIds)];

  return uniqueIds
    .map((id) => {
      const stage = context.dataBundle.stages.find((item) => item.id === id);
      if (!stage) return undefined;
      return {
        stage,
        unlocked: unlocked.has(stage.id),
        current: stage.id === currentStage?.id,
        completed: completed.has(stage.id),
        nextLocked: firstLockedIndex >= 0 && context.dataBundle.stages[firstLockedIndex]?.id === stage.id && !unlocked.has(stage.id)
      };
    })
    .filter((row): row is StageMapRow => Boolean(row))
    .slice(0, 6);
}

function selectStageAndRestart(scene: Phaser.Scene, context: BootContext, stageId: string): void {
  if (!selectWorldMapStage(context.run, context.dataBundle, stageId)) return;
  context.save.currentRun = sliceRunToSaveRun(context.run);
  persistSave(context.save, { debug: context.runtimeFlags.debug });
  storeBootContext(scene, context);
  scene.scene.start("WorldMapScene", context);
}

function stageRowStatus(row: StageMapRow): string {
  if (row.current) return row.completed ? "현재 / 완료" : "현재";
  if (row.completed) return "클리어";
  if (row.unlocked) return "선택";
  if (row.nextLocked) return "다음 잠김";
  return "잠김";
}

function drawFoldLines(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics();
  graphics.lineStyle(5, 0xc6a65e, 0.22);
  graphics.beginPath();
  graphics.moveTo(826, 448);
  graphics.lineTo(826, 820);
  graphics.moveTo(1052, 448);
  graphics.lineTo(1052, 820);
  graphics.moveTo(1278, 448);
  graphics.lineTo(1278, 820);
  graphics.strokePath();
  graphics.lineStyle(3, 0xffffff, 0.34);
  graphics.beginPath();
  graphics.moveTo(640, 514);
  graphics.lineTo(1460, 514);
  graphics.moveTo(640, 706);
  graphics.lineTo(1460, 706);
  graphics.strokePath();
}

function renderRoutePath(scene: Phaser.Scene, route: NonNullable<BootContext["dataBundle"]["stages"][number]>["route"], roomIndex: number): void {
  const positions = [
    { x: 692, y: 704 },
    { x: 820, y: 638 },
    { x: 948, y: 714 },
    { x: 1076, y: 648 },
    { x: 1204, y: 724 },
    { x: 1076, y: 808 },
    { x: 948, y: 808 },
    { x: 820, y: 808 },
    { x: 692, y: 808 }
  ];
  const nodes = route.slice(0, positions.length);
  const graphics = scene.add.graphics();
  graphics.lineStyle(8, 0x8d6a2a, 0.58);
  for (let index = 0; index < nodes.length - 1; index += 1) {
    graphics.beginPath();
    graphics.moveTo(positions[index].x, positions[index].y);
    graphics.lineTo(positions[index + 1].x, positions[index + 1].y);
    graphics.strokePath();
  }

  nodes.forEach((room, index) => {
    const position = positions[index];
    const color = roomColor(room.type);
    const active = index === roomIndex;
    scene.add.circle(position.x, position.y, active ? 48 : 40, color, active ? 0.96 : 0.84)
      .setStrokeStyle(active ? 7 : 4, active ? 0xfff3b0 : 0xffffff, 0.9);
    scene.add.text(position.x, position.y - 10, `${index + 1}`, textStyle(21, "#fff5d7", true)).setOrigin(0.5);
    scene.add.text(position.x - 42, position.y + 48, roomTypeLabel(room.type), textStyle(17, "#32415a", true)).setWordWrapWidth(84, true);
  });
}

function roomColor(type: string): number {
  const colors: Record<string, number> = {
    combat: 0x5d8d86,
    elite: 0xce5869,
    event: 0x6c8fd6,
    shop: 0xf5c26b,
    rest: 0x9ec3b8,
    reward: 0xb98c34,
    boss: 0x8d4b7a
  };
  return colors[type] ?? 0x5d8d86;
}

function roomTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    combat: "전투",
    elite: "정예",
    event: "사건",
    shop: "상점",
    rest: "휴식",
    reward: "보상",
    boss: "보스"
  };
  return labels[type] ?? type;
}
