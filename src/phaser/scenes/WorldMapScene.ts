import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { StageData } from "../../data/schema";
import type { InputAction } from "../../input/actions";
import { bindKeyboardActions } from "../../input/bindings";
import { persistSave } from "../../save/saveCodec";
import { selectWorldMapStage } from "../../simulation/systems/dungeon/dungeonSystem";
import { sliceRunToSaveRun } from "../../simulation/state/runState";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext, storeBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderPaperPanel, renderRasterHoverHitTarget, renderSceneShell, renderUiSlot, textStyle } from "../view/sceneShell";

const WORLD_MAP_RASTER_UNDERLAY_KEY = "world_map_raster_underlay_concept";
const WORLD_MAP_RASTER_HOVER_NODE_KEY = "ui_current_stage_halo_concept";
const WORLD_MAP_RASTER_HOVER_PLAY_KEY = "ui_hover_world_map_play_button_concept";
const WORLD_MAP_RASTER_DOWN_PLAY_KEY = "ui_down_world_map_play_button_concept";
const WORLD_MAP_RASTER_CURRENT_MARKER_KEY = "ui_current_stage_marker_concept";
const WORLD_MAP_RASTER_CURRENT_BODY_KEY = "ui_current_stage_body_wash_concept";
const WORLD_MAP_RASTER_CURRENT_FRAME_KEY = "ui_current_stage_frame_concept";
const WORLD_MAP_RASTER_CURRENT_HALO_KEY = "ui_current_stage_halo_concept";
const WORLD_MAP_RASTER_CURRENT_STATUS_KEY = "ui_current_stage_status_badge_concept";
const WORLD_MAP_RASTER_COMPLETED_BODY_KEY = "ui_completed_stage_body_wash_concept";
const WORLD_MAP_RASTER_COMPLETED_LATE_BODY_KEY = "ui_completed_stage_late_body_wash_concept";
const WORLD_MAP_RASTER_COMPLETED_FRAME_KEY = "ui_completed_stage_frame_concept";
const WORLD_MAP_RASTER_COMPLETED_LATE_FRAME_KEY = "ui_completed_stage_late_frame_concept";
const WORLD_MAP_RASTER_COMPLETED_BADGE_KEY = "ui_completed_stage_badge_concept";
const WORLD_MAP_RASTER_COMPLETED_LATE_BADGE_KEY = "ui_completed_stage_late_badge_concept";
const WORLD_MAP_RASTER_LOCKED_BODY_KEY = "ui_locked_stage_body_wash_concept";
const WORLD_MAP_RASTER_LOCKED_FRAME_KEY = "ui_locked_stage_frame_concept";
const WORLD_MAP_RASTER_LOCKED_BADGE_KEY = "ui_locked_stage_badge_concept";
const WORLD_MAP_RASTER_SEALED_BODY_KEY = "ui_sealed_stage_body_wash_concept";
const WORLD_MAP_RASTER_SEALED_FRAME_KEY = "ui_sealed_stage_frame_concept";
const WORLD_MAP_RASTER_SEALED_BADGE_KEY = "ui_sealed_stage_badge_concept";
const WORLD_MAP_RASTER_DORMANT_BODY_KEY = "ui_dormant_stage_body_wash_concept";
const WORLD_MAP_RASTER_DORMANT_FRAME_KEY = "ui_dormant_stage_frame_concept";
const WORLD_MAP_RASTER_ROUTE_PROGRESS_THREAD_KEY = "ui_world_map_route_progress_thread_concept";
const WORLD_MAP_RASTER_ROUTE_PROGRESS_BEAD_KEY = "ui_world_map_route_progress_bead_concept";
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
const WORLD_MAP_RASTER_RED_LOCKS: Record<number, { x: number; y: number; size: number }> = {
  9: { x: 646, y: 285, size: 70 },
  10: { x: 787, y: 337, size: 70 },
  11: { x: 941, y: 358, size: 70 },
  12: { x: 1068, y: 343, size: 70 },
  13: { x: 1208, y: 232, size: 76 },
  14: { x: 1311, y: 378, size: 76 }
};
const WORLD_MAP_RASTER_COMPLETED_BADGES: Record<number, { dx: number; dy: number; size: number; alpha: number }> = {
  5: { dx: -0.04, dy: 0.43, size: 52, alpha: 0.82 },
  6: { dx: 0.2, dy: 0.38, size: 52, alpha: 0.82 },
  7: { dx: 0.02, dy: 0.32, size: 44, alpha: 0.72 },
  8: { dx: 0.04, dy: 0.36, size: 54, alpha: 0.82 }
};

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

    bindKeyboardActions(this, (action) => handleWorldMapAction(this, context, action), context.save.settings);
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

  renderWorldMapRouteProgress(scene, context);
  renderWorldMapStageStateBadges(scene, context);
  renderWorldMapRasterHitTarget(scene, 1576, 970, 280, 144, 0xf5c26b, () => handleSceneAction(scene, context, "confirm"));
  renderWorldMapCurrentStageMarker(scene, context);
  renderWorldMapRasterStageNodes(scene, context);
}

function renderWorldMapRouteProgress(scene: Phaser.Scene, context: BootContext): void {
  const hasRouteThread = scene.textures.exists(WORLD_MAP_RASTER_ROUTE_PROGRESS_THREAD_KEY);
  const hasRouteBead = scene.textures.exists(WORLD_MAP_RASTER_ROUTE_PROGRESS_BEAD_KEY);
  if (!hasRouteThread && !hasRouteBead) return;

  const currentStageId = context.run.stageId;
  const currentStageIndex = context.dataBundle.stages.findIndex((stage) => stage.id === currentStageId);
  if (currentStageIndex <= 0) return;

  const completedStageIds = new Set(context.save.profile.completedStages);
  for (let index = 0; index < currentStageIndex; index += 1) {
    const fromStage = context.dataBundle.stages[index];
    const toStage = context.dataBundle.stages[index + 1];
    const fromNode = WORLD_MAP_RASTER_STAGE_NODES[index];
    const toNode = WORLD_MAP_RASTER_STAGE_NODES[index + 1];
    if (!fromStage || !toStage || !fromNode || !toNode) continue;
    if (!completedStageIds.has(fromStage.id)) continue;
    if (toStage.id !== currentStageId && !completedStageIds.has(toStage.id)) continue;

    const finalLeg = index === currentStageIndex - 1;
    if (hasRouteThread) {
      const thread = worldMapRouteThreadPlacement(fromNode, toNode, finalLeg);
      if (thread) {
        scene.add.image(thread.x, thread.y, WORLD_MAP_RASTER_ROUTE_PROGRESS_THREAD_KEY)
          .setDisplaySize(thread.width, thread.height)
          .setRotation(thread.rotation)
          .setAlpha(thread.alpha)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(3.64);
      }
    }

    if (hasRouteBead) {
      worldMapRouteBeadPlacements(fromNode, toNode, finalLeg).forEach((bead) => {
        scene.add.image(bead.x, bead.y, WORLD_MAP_RASTER_ROUTE_PROGRESS_BEAD_KEY)
          .setDisplaySize(bead.size, bead.size)
          .setRotation(bead.rotation)
          .setAlpha(bead.alpha)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(3.82);
      });
    }
  }
}

function worldMapRouteThreadPlacement(
  fromNode: { x: number; y: number; width: number; height: number },
  toNode: { x: number; y: number; width: number; height: number },
  finalLeg: boolean
): { x: number; y: number; rotation: number; width: number; height: number; alpha: number } | undefined {
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const length = Math.hypot(dx, dy);
  if (length <= 1) return undefined;

  const fromPad = Math.max(fromNode.width, fromNode.height) * 0.43;
  const toPad = Math.max(toNode.width, toNode.height) * 0.43;
  const usableLength = Math.max(0, length - fromPad - toPad);
  if (usableLength < 28) return undefined;

  const startProgress = fromPad / length;
  const endProgress = (fromPad + usableLength) / length;
  return {
    x: fromNode.x + dx * ((startProgress + endProgress) * 0.5),
    y: fromNode.y + dy * ((startProgress + endProgress) * 0.5),
    rotation: Math.atan2(dy, dx),
    width: usableLength + (finalLeg ? 18 : 12),
    height: finalLeg ? 30 : 24,
    alpha: finalLeg ? 0.42 : 0.3
  };
}

function worldMapRouteBeadPlacements(
  fromNode: { x: number; y: number; width: number; height: number },
  toNode: { x: number; y: number; width: number; height: number },
  finalLeg: boolean
): Array<{ x: number; y: number; rotation: number; size: number; alpha: number }> {
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const length = Math.hypot(dx, dy);
  if (length <= 1) return [];

  const fromPad = Math.max(fromNode.width, fromNode.height) * 0.36;
  const toPad = Math.max(toNode.width, toNode.height) * 0.36;
  const usableLength = Math.max(0, length - fromPad - toPad);
  if (usableLength < 24) return [];

  const count = Math.max(1, Math.floor(usableLength / 46));
  const rotation = Math.atan2(dy, dx);
  return Array.from({ length: count }, (_, index) => {
    const progress = (fromPad + usableLength * ((index + 1) / (count + 1))) / length;
    return {
      x: fromNode.x + dx * progress,
      y: fromNode.y + dy * progress,
      rotation,
      size: finalLeg ? 44 : 38,
      alpha: finalLeg ? 0.62 : 0.46
    };
  });
}

function renderWorldMapStageStateBadges(scene: Phaser.Scene, context: BootContext): void {
  const currentStageId = context.run.stageId;
  const unlockedStageIds = new Set([...context.save.profile.unlockedStages, currentStageId]);
  const completedStageIds = new Set(context.save.profile.completedStages);
  const firstLockedIndex = context.dataBundle.stages.findIndex((stage) => !unlockedStageIds.has(stage.id));

  context.dataBundle.stages.forEach((stage, index) => {
    const node = WORLD_MAP_RASTER_STAGE_NODES[index];
    if (!node || stage.id === currentStageId) return;

    const completedBadgeKey = worldMapCompletedBadgeKey(scene, index);
    if (completedStageIds.has(stage.id) && completedBadgeKey) {
      const completedBodyKey = worldMapCompletedBodyKey(scene, index);
      if (completedBodyKey) {
        const body = worldMapCompletedBodyPlacement(node, index);
        scene.add.image(body.x, body.y, completedBodyKey)
          .setDisplaySize(body.width, body.height)
          .setAlpha(body.alpha)
          .setDepth(5.12);
      }

      const completedFrameKey = worldMapCompletedFrameKey(scene, index);
      if (completedFrameKey) {
        const frame = worldMapCompletedFramePlacement(node, index);
        scene.add.image(frame.x, frame.y, completedFrameKey)
          .setDisplaySize(frame.width, frame.height)
          .setAlpha(frame.alpha)
          .setDepth(5.35);
      }

      const completed = worldMapCompletedBadgePlacement(node, index);
      scene.add.image(completed.x, completed.y, completedBadgeKey)
        .setDisplaySize(completed.size, completed.size)
        .setAlpha(completed.alpha)
        .setDepth(6);
      return;
    }

    if (!unlockedStageIds.has(stage.id) && shouldUseWorldMapRedLock(index) && scene.textures.exists(WORLD_MAP_RASTER_LOCKED_BADGE_KEY)) {
      const nextLocked = index === firstLockedIndex;
      if (scene.textures.exists(WORLD_MAP_RASTER_LOCKED_BODY_KEY)) {
        const body = worldMapLockedBodyPlacement(node, index, nextLocked);
        scene.add.image(body.x, body.y, WORLD_MAP_RASTER_LOCKED_BODY_KEY)
          .setDisplaySize(body.width, body.height)
          .setAlpha(body.alpha)
          .setDepth(body.depth);
      }

      if (scene.textures.exists(WORLD_MAP_RASTER_LOCKED_FRAME_KEY)) {
        const frame = worldMapLockedFramePlacement(node, index, nextLocked);
        scene.add.image(frame.x, frame.y, WORLD_MAP_RASTER_LOCKED_FRAME_KEY)
          .setDisplaySize(frame.width, frame.height)
          .setAlpha(frame.alpha)
          .setDepth(frame.depth);
      }

      const lock = worldMapLockedBadgePlacement(node, index);
      const size = nextLocked ? Math.max(lock.size, 76) : lock.size;
      scene.add.image(lock.x, lock.y, WORLD_MAP_RASTER_LOCKED_BADGE_KEY)
        .setDisplaySize(size, size)
        .setAlpha(nextLocked ? 0.92 : 0.84)
        .setDepth(nextLocked ? 6 : 5);
      return;
    }

    if (!unlockedStageIds.has(stage.id) && index === firstLockedIndex && scene.textures.exists(WORLD_MAP_RASTER_SEALED_BADGE_KEY)) {
      if (scene.textures.exists(WORLD_MAP_RASTER_SEALED_BODY_KEY)) {
        const body = worldMapSealedBodyPlacement(node);
        scene.add.image(body.x, body.y, WORLD_MAP_RASTER_SEALED_BODY_KEY)
          .setDisplaySize(body.width, body.height)
          .setAlpha(body.alpha)
          .setDepth(5.08);
      }

      if (scene.textures.exists(WORLD_MAP_RASTER_SEALED_FRAME_KEY)) {
        const frame = worldMapSealedFramePlacement(node);
        scene.add.image(frame.x, frame.y, WORLD_MAP_RASTER_SEALED_FRAME_KEY)
          .setDisplaySize(frame.width, frame.height)
          .setAlpha(frame.alpha)
          .setDepth(5.32);
      }

      const sealed = worldMapSealedBadgePlacement(node);
      scene.add.image(sealed.x, sealed.y, WORLD_MAP_RASTER_SEALED_BADGE_KEY)
        .setDisplaySize(60, 60)
        .setAlpha(0.82)
        .setDepth(6);
      return;
    }

    if (!unlockedStageIds.has(stage.id) && index < 9 && scene.textures.exists(WORLD_MAP_RASTER_DORMANT_FRAME_KEY)) {
      if (scene.textures.exists(WORLD_MAP_RASTER_DORMANT_BODY_KEY)) {
        const body = worldMapDormantBodyPlacement(node, index);
        scene.add.image(body.x, body.y, WORLD_MAP_RASTER_DORMANT_BODY_KEY)
          .setDisplaySize(body.width, body.height)
          .setAlpha(body.alpha)
          .setDepth(4.54);
      }

      const frame = worldMapDormantFramePlacement(node, index);
      scene.add.image(frame.x, frame.y, WORLD_MAP_RASTER_DORMANT_FRAME_KEY)
        .setDisplaySize(frame.width, frame.height)
        .setAlpha(frame.alpha)
        .setDepth(4.72);
    }
  });
}

function worldMapCompletedBodyPlacement(
  node: { x: number; y: number; width: number; height: number },
  stageIndex: number
): { x: number; y: number; width: number; height: number; alpha: number } {
  const alpha = stageIndex <= 2 ? 0.62 : stageIndex <= 4 ? 0.54 : 0.46;
  return {
    x: node.x + node.width * 0.02,
    y: node.y + node.height * 0.04,
    width: node.width * 1.12,
    height: node.height * 1.18,
    alpha
  };
}

function worldMapSealedBodyPlacement(
  node: { x: number; y: number; width: number; height: number }
): { x: number; y: number; width: number; height: number; alpha: number } {
  return {
    x: node.x + node.width * 0.01,
    y: node.y + node.height * 0.07,
    width: node.width * 1.1,
    height: node.height * 1.16,
    alpha: 0.5
  };
}

function worldMapSealedFramePlacement(
  node: { x: number; y: number; width: number; height: number }
): { x: number; y: number; width: number; height: number; alpha: number } {
  return {
    x: node.x + node.width * 0.01,
    y: node.y + node.height * 0.05,
    width: node.width * 1.24,
    height: node.height * 1.3,
    alpha: 0.58
  };
}

function worldMapDormantBodyPlacement(
  node: { x: number; y: number; width: number; height: number },
  stageIndex: number
): { x: number; y: number; width: number; height: number; alpha: number } {
  const lowerNode = stageIndex <= 4;
  return {
    x: node.x + node.width * 0.01,
    y: node.y + node.height * (lowerNode ? 0.06 : 0.07),
    width: node.width * (lowerNode ? 1.12 : 1.08),
    height: node.height * (lowerNode ? 1.18 : 1.14),
    alpha: lowerNode ? 0.42 : 0.34
  };
}

function worldMapDormantFramePlacement(
  node: { x: number; y: number; width: number; height: number },
  stageIndex: number
): { x: number; y: number; width: number; height: number; alpha: number } {
  const lowerNode = stageIndex <= 4;
  return {
    x: node.x + node.width * 0.01,
    y: node.y + node.height * (lowerNode ? 0.04 : 0.05),
    width: node.width * (lowerNode ? 1.26 : 1.2),
    height: node.height * (lowerNode ? 1.32 : 1.26),
    alpha: lowerNode ? 0.5 : 0.4
  };
}

function worldMapCompletedFramePlacement(
  node: { x: number; y: number; width: number; height: number },
  stageIndex: number
): { x: number; y: number; width: number; height: number; alpha: number } {
  const alpha = stageIndex <= 2 ? 0.72 : stageIndex <= 4 ? 0.66 : 0.58;
  return {
    x: node.x + node.width * 0.02,
    y: node.y + node.height * 0.02,
    width: node.width * 1.3,
    height: node.height * 1.36,
    alpha
  };
}

function worldMapLockedBodyPlacement(
  node: { x: number; y: number; width: number; height: number },
  stageIndex: number,
  nextLocked: boolean
): { x: number; y: number; width: number; height: number; alpha: number; depth: number } {
  const upperBossNode = stageIndex >= 13;
  return {
    x: node.x + node.width * (upperBossNode ? -0.02 : 0.01),
    y: node.y + node.height * (upperBossNode ? 0.09 : 0.06),
    width: node.width * (upperBossNode ? 1.08 : 1.12),
    height: node.height * (upperBossNode ? 1.1 : 1.18),
    alpha: nextLocked ? 0.56 : 0.42,
    depth: nextLocked ? 5.1 : 4.62
  };
}

function worldMapLockedFramePlacement(
  node: { x: number; y: number; width: number; height: number },
  stageIndex: number,
  nextLocked: boolean
): { x: number; y: number; width: number; height: number; alpha: number; depth: number } {
  const upperBossNode = stageIndex >= 13;
  return {
    x: node.x + node.width * (upperBossNode ? -0.02 : 0.01),
    y: node.y + node.height * (upperBossNode ? 0.08 : 0.05),
    width: node.width * (upperBossNode ? 1.24 : 1.28),
    height: node.height * (upperBossNode ? 1.24 : 1.32),
    alpha: nextLocked ? 0.74 : 0.58,
    depth: nextLocked ? 5.35 : 4.85
  };
}

function worldMapCompletedBadgePlacement(
  node: { x: number; y: number; width: number; height: number },
  stageIndex: number
): { x: number; y: number; size: number; alpha: number } {
  if (stageIndex <= 2) {
    return {
      x: node.x + node.width * 0.03,
      y: node.y + node.height * 0.32,
      size: 78,
      alpha: 0.96
    };
  }

  const placed = WORLD_MAP_RASTER_COMPLETED_BADGES[stageIndex];
  if (placed) {
    return {
      x: node.x + node.width * placed.dx,
      y: node.y + node.height * placed.dy,
      size: placed.size,
      alpha: placed.alpha
    };
  }

  return {
    x: node.x + node.width * 0.02,
    y: node.y + node.height * 0.31,
    size: stageIndex >= 9 ? 64 : 60,
    alpha: 0.88
  };
}

function worldMapCompletedBodyKey(scene: Phaser.Scene, stageIndex: number): string | undefined {
  if (stageIndex > 2 && scene.textures.exists(WORLD_MAP_RASTER_COMPLETED_LATE_BODY_KEY)) {
    return WORLD_MAP_RASTER_COMPLETED_LATE_BODY_KEY;
  }
  if (scene.textures.exists(WORLD_MAP_RASTER_COMPLETED_BODY_KEY)) {
    return WORLD_MAP_RASTER_COMPLETED_BODY_KEY;
  }
  return undefined;
}

function worldMapCompletedFrameKey(scene: Phaser.Scene, stageIndex: number): string | undefined {
  if (stageIndex > 2 && scene.textures.exists(WORLD_MAP_RASTER_COMPLETED_LATE_FRAME_KEY)) {
    return WORLD_MAP_RASTER_COMPLETED_LATE_FRAME_KEY;
  }
  if (scene.textures.exists(WORLD_MAP_RASTER_COMPLETED_FRAME_KEY)) {
    return WORLD_MAP_RASTER_COMPLETED_FRAME_KEY;
  }
  return undefined;
}

function worldMapCompletedBadgeKey(scene: Phaser.Scene, stageIndex: number): string | undefined {
  if (stageIndex > 2 && scene.textures.exists(WORLD_MAP_RASTER_COMPLETED_LATE_BADGE_KEY)) {
    return WORLD_MAP_RASTER_COMPLETED_LATE_BADGE_KEY;
  }
  if (scene.textures.exists(WORLD_MAP_RASTER_COMPLETED_BADGE_KEY)) {
    return WORLD_MAP_RASTER_COMPLETED_BADGE_KEY;
  }
  return undefined;
}

function shouldUseWorldMapRedLock(stageIndex: number): boolean {
  return stageIndex >= 9;
}

function worldMapSealedBadgePlacement(
  node: { x: number; y: number; width: number; height: number }
): { x: number; y: number } {
  return {
    x: node.x + node.width * 0.01,
    y: node.y + node.height * 0.39
  };
}

function worldMapLockedBadgePlacement(
  node: { x: number; y: number; width: number; height: number },
  stageIndex: number
): { x: number; y: number; size: number } {
  const sourceAligned = WORLD_MAP_RASTER_RED_LOCKS[stageIndex];
  if (sourceAligned) return sourceAligned;
  if (stageIndex >= 13) return { x: node.x - node.width * 0.34, y: node.y + node.height * 0.36, size: 76 };
  if (stageIndex >= 11) return { x: node.x - node.width * 0.12, y: node.y + node.height * 0.36, size: 70 };
  return { x: node.x - node.width * 0.06, y: node.y + node.height * 0.36, size: 70 };
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

  if (scene.textures.exists(WORLD_MAP_RASTER_CURRENT_BODY_KEY)) {
    scene.add.image(node.x + node.width * 0.02, node.y + node.height * 0.04, WORLD_MAP_RASTER_CURRENT_BODY_KEY)
      .setDisplaySize(node.width * 1.12, node.height * 1.16)
      .setAlpha(0.66)
      .setDepth(7.15);
  }

  if (scene.textures.exists(WORLD_MAP_RASTER_CURRENT_FRAME_KEY)) {
    scene.add.image(node.x + node.width * 0.02, node.y + node.height * 0.01, WORLD_MAP_RASTER_CURRENT_FRAME_KEY)
      .setDisplaySize(node.width * 1.34, node.height * 1.38)
      .setAlpha(0.9)
      .setDepth(7.3);
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
    downKey: WORLD_MAP_RASTER_HOVER_NODE_KEY,
    hoverX: x + 2,
    hoverY: y + 4,
    downX: x + 2,
    downY: y + 4,
    hoverWidth: width * 2.14,
    hoverHeight: height * 2.28,
    downWidth: width * 1.92,
    downHeight: height * 2.04,
    hoverAlpha: 0.9,
    downAlpha: 0.98,
    hoverDepth: 5.75,
    downDepth: 5.75,
    hoverBlendMode: Phaser.BlendModes.ADD,
    downBlendMode: Phaser.BlendModes.ADD
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

function handleWorldMapAction(scene: Phaser.Scene, context: BootContext, action: InputAction): void {
  const nextStageId = hasWorldMapRasterUnderlay(scene)
    ? resolveKeyboardStageSelection(context, action)
    : undefined;
  if (nextStageId) {
    selectStageAndRestart(scene, context, nextStageId);
    return;
  }

  handleSceneAction(scene, context, action);
}

function resolveKeyboardStageSelection(context: BootContext, action: InputAction): string | undefined {
  if (action !== "move_left" && action !== "move_right" && action !== "move_up" && action !== "move_down") {
    return undefined;
  }

  const currentIndex = context.dataBundle.stages.findIndex((stage) => stage.id === context.run.stageId);
  const currentNode = WORLD_MAP_RASTER_STAGE_NODES[currentIndex];
  if (!currentNode) return undefined;

  const unlockedStageIds = new Set([...context.save.profile.unlockedStages, context.run.stageId]);
  const direction = keyboardStageDirection(action);
  const candidates = context.dataBundle.stages
    .map((stage, index) => ({ stage, index, node: WORLD_MAP_RASTER_STAGE_NODES[index] }))
    .filter(({ stage, index, node }) => index !== currentIndex && node && unlockedStageIds.has(stage.id))
    .map(({ stage, node }) => {
      const dx = node.x - currentNode.x;
      const dy = node.y - currentNode.y;
      const primary = dx * direction.x + dy * direction.y;
      const cross = Math.abs(dx * direction.y - dy * direction.x);
      return {
        stageId: stage.id,
        primary,
        score: primary + cross * 0.72
      };
    })
    .filter((candidate) => candidate.primary > 8)
    .sort((left, right) => left.score - right.score);

  return candidates[0]?.stageId;
}

function keyboardStageDirection(action: Extract<InputAction, "move_left" | "move_right" | "move_up" | "move_down">): { x: number; y: number } {
  if (action === "move_left") return { x: -1, y: 0 };
  if (action === "move_right") return { x: 1, y: 0 };
  if (action === "move_up") return { x: 0, y: -1 };
  return { x: 0, y: 1 };
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
