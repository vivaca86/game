import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { RoomSlot, RoomType } from "../../data/schema";
import type { InputAction } from "../../input/actions";
import { bindKeyboardActions } from "../../input/bindings";
import { getCurrentRoom, getEncounterPoolContentId, getStage } from "../../simulation/state/runState";
import { getRevealedNextRoomType } from "../../simulation/systems/passives/passiveSystem";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderPaperPanel, renderRasterHoverHitTarget, renderSceneShell, renderUiSlot, setRasterHitTargetHoverState, textStyle, triggerRasterHitTargetDown } from "../view/sceneShell";

const DUNGEON_RASTER_UNDERLAY_KEY = "dungeon_raster_underlay_concept";
const DUNGEON_RASTER_HOVER_NODE_KEY = "ui_hover_route_node_concept";
const DUNGEON_RASTER_FOCUS_ID_KEY = "dungeonRasterFocusId";

export class DungeonScene extends Phaser.Scene {
  constructor() {
    super("DungeonScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    const room = getCurrentRoom(context.dataBundle, context.run);
    renderSceneShell(this, context, {
      title: "던전",
      subtitle: "방 경로",
      focusLabel: "현재 방",
      chrome: "immersive",
      showImmersiveInfo: false,
      showHand: false,
      showRoute: false
    });

    const rasterControls = hasDungeonRasterUnderlay(this)
      ? renderDungeonRasterStage(this, context)
      : undefined;
    if (!rasterControls) {
      renderDungeonTheater(this, context, room);
    }

    const rasterKeyboardHandler = rasterControls
      ? createDungeonRasterKeyboardHandler(this, rasterControls)
      : undefined;
    bindKeyboardActions(this, (action) => {
      if (rasterKeyboardHandler?.(action)) {
        return;
      }
      handleSceneAction(this, context, action);
    }, context.save.settings);
    renderDebugOverlay(context, "DungeonScene");
  }
}

interface DungeonRasterControls {
  controls: DungeonRasterControl[];
}

interface DungeonRasterControl {
  id: "room_node" | "bottom_confirm";
  x: number;
  y: number;
  hitTarget: Phaser.GameObjects.Rectangle;
  activate: () => void;
}

function hasDungeonRasterUnderlay(scene: Phaser.Scene): boolean {
  return scene.textures.exists(DUNGEON_RASTER_UNDERLAY_KEY);
}

function renderDungeonRasterStage(
  scene: Phaser.Scene,
  context: BootContext
): DungeonRasterControls {
  scene.add.image(960, 540, DUNGEON_RASTER_UNDERLAY_KEY)
    .setDisplaySize(1920, 1080)
    .setDepth(0);

  const roomNodeHitTarget = renderDungeonRasterHitTarget(scene, 1010, 582, 330, 66, 0xf5c26b, () => handleSceneAction(scene, context, "confirm"));
  const bottomConfirmHitTarget = renderDungeonRasterHitTarget(scene, 960, 962, 390, 106, 0xf5c26b, () => handleSceneAction(scene, context, "confirm"));
  return {
    controls: [
      {
        id: "room_node",
        x: 1010,
        y: 582,
        hitTarget: roomNodeHitTarget,
        activate: () => handleSceneAction(scene, context, "confirm")
      },
      {
        id: "bottom_confirm",
        x: 960,
        y: 962,
        hitTarget: bottomConfirmHitTarget,
        activate: () => handleSceneAction(scene, context, "confirm")
      }
    ]
  };
}

function createDungeonRasterKeyboardHandler(
  scene: Phaser.Scene,
  rasterControls: DungeonRasterControls
): (action: InputAction) => boolean {
  const { controls } = rasterControls;
  let focusedIndex = storedDungeonFocusIndex(scene, controls);

  const setFocus = (nextIndex: number): void => {
    if (!controls[nextIndex]) return;
    if (focusedIndex >= 0 && focusedIndex !== nextIndex) {
      setRasterHitTargetHoverState(controls[focusedIndex]?.hitTarget, false);
    }
    focusedIndex = nextIndex;
    scene.registry.set(DUNGEON_RASTER_FOCUS_ID_KEY, controls[focusedIndex].id);
    setRasterHitTargetHoverState(controls[focusedIndex].hitTarget, true);
  };

  const clearKeyboardFocus = (except?: DungeonRasterControl): void => {
    if (focusedIndex < 0 || controls[focusedIndex] === except) return;
    setRasterHitTargetHoverState(controls[focusedIndex].hitTarget, false);
    focusedIndex = -1;
    scene.registry.set(DUNGEON_RASTER_FOCUS_ID_KEY, undefined);
  };

  const activateControl = (control: DungeonRasterControl): void => {
    scene.registry.set(DUNGEON_RASTER_FOCUS_ID_KEY, undefined);
    focusedIndex = -1;
    control.activate();
  };

  const triggerFocusedControl = (control: DungeonRasterControl): boolean => {
    if (triggerRasterHitTargetDown(scene, control.hitTarget, () => activateControl(control))) {
      return true;
    }
    activateControl(control);
    return true;
  };

  controls.forEach((control) => {
    control.hitTarget.on("pointerover", () => clearKeyboardFocus(control));
    control.hitTarget.on("pointerout", () => {
      if (focusedIndex >= 0 && controls[focusedIndex] === control) {
        setRasterHitTargetHoverState(control.hitTarget, true);
      }
    });
  });

  if (focusedIndex >= 0) {
    setRasterHitTargetHoverState(controls[focusedIndex].hitTarget, true);
  }

  return (action: InputAction): boolean => {
    if (controls.length === 0) return false;

    if (isDungeonMoveAction(action)) {
      setFocus(resolveDungeonFocusIndex(controls, focusedIndex, action));
      return true;
    }

    if (action === "confirm") {
      if (focusedIndex < 0) {
        setFocus(0);
      }
      const focusedControl = controls[focusedIndex];
      if (!focusedControl) return true;
      return triggerFocusedControl(focusedControl);
    }

    return false;
  };
}

function storedDungeonFocusIndex(scene: Phaser.Scene, controls: DungeonRasterControl[]): number {
  const storedId = scene.registry.get(DUNGEON_RASTER_FOCUS_ID_KEY);
  const storedIndex = controls.findIndex((control) => control.id === storedId);
  return storedIndex >= 0 ? storedIndex : -1;
}

function isDungeonMoveAction(action: InputAction): action is "move_up" | "move_down" | "move_left" | "move_right" {
  return action === "move_up" || action === "move_down" || action === "move_left" || action === "move_right";
}

function resolveDungeonFocusIndex(
  controls: DungeonRasterControl[],
  focusedIndex: number,
  action: "move_up" | "move_down" | "move_left" | "move_right"
): number {
  if (focusedIndex < 0) return 0;
  if (action === "move_left" || action === "move_right") return focusedIndex;
  const current = controls[focusedIndex];
  const candidates = controls
    .map((control, index) => ({ control, index }))
    .filter(({ index }) => index !== focusedIndex)
    .filter(({ control }) => action === "move_up" ? control.y < current.y - 8 : control.y > current.y + 8);
  if (candidates.length === 0) return focusedIndex;

  candidates.sort((left, right) => Math.abs(left.control.y - current.y) - Math.abs(right.control.y - current.y));
  return candidates[0].index;
}

function renderDungeonRasterHitTarget(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  _accent: number,
  onClick: () => void
): Phaser.GameObjects.Rectangle {
  const hoverSize = Math.min(132, Math.max(96, Math.min(width, height) * 1.12));
  return renderRasterHoverHitTarget(scene, x, y, width, height, onClick, {
    hoverKey: DUNGEON_RASTER_HOVER_NODE_KEY,
    downKey: DUNGEON_RASTER_HOVER_NODE_KEY,
    hoverX: x,
    hoverY: y,
    hoverWidth: hoverSize,
    hoverHeight: hoverSize,
    downX: x,
    downY: y,
    downWidth: hoverSize * 1.1,
    downHeight: hoverSize * 1.1,
    downAlpha: 0.82
  });
}

function renderDungeonTheater(
  scene: Phaser.Scene,
  context: BootContext,
  room: ReturnType<typeof getCurrentRoom>
): void {
  const stage = getStage(context.dataBundle, context.run);
  const route = stage?.route ?? [];
  const currentIndex = Math.max(0, context.run.roomIndex);
  const nextRoom = route[currentIndex + 1];
  const revealedNextRoomType = getRevealedNextRoomType(context.run, context.dataBundle);
  const bossDistance = getBossDistance(route, currentIndex);

  scene.add.rectangle(960, 560, 1680, 840, 0xfff8e8, 0.44)
    .setStrokeStyle(6, 0xb98c34, 0.36);
  scene.add.polygon(168, 550, [0, -352, 168, -286, 190, 306, 0, 376, -82, 306, -58, -292], 0x5d8d86, 0.22)
    .setStrokeStyle(5, 0x3f6f68, 0.42);
  scene.add.polygon(1752, 550, [0, -352, 58, -292, 82, 306, 0, 376, -190, 306, -168, -286], 0x6c8fd6, 0.22)
    .setStrokeStyle(5, 0x4c659d, 0.42);

  renderPaperPanel(scene, 960, 126, 800, 132, { alpha: 0.96 });
  scene.add.circle(610, 126, 17, 0xc6a65e, 0.9).setStrokeStyle(3, 0xfff3b0, 0.8);
  scene.add.circle(1310, 126, 17, 0xc6a65e, 0.9).setStrokeStyle(3, 0xfff3b0, 0.8);
  scene.add.rectangle(960, 190, 720, 18, 0xf5c26b, 0.7);
  scene.add.text(960, 82, "던전 시야", textStyle(42, "#1e2a3e", true)).setOrigin(0.5);
  scene.add.text(960, 137, `${stage?.displayNameKo ?? "스테이지 없음"} / 방 ${currentIndex + 1} / ${route.length || 1}`, textStyle(22, "#805845", true))
    .setOrigin(0.5);

  renderDungeonLedger(scene, context, room, nextRoom, revealedNextRoomType, bossDistance);
  renderDungeonView(scene, context, room, nextRoom, revealedNextRoomType, bossDistance);
  renderDungeonRouteRail(scene, route, currentIndex);

  renderActionButton(scene, 1010, 582, "방 입장", () => handleSceneAction(scene, context, "confirm"), {
    width: 330,
    height: 66,
    fontSize: 25,
    focus: true
  });
}

function renderDungeonLedger(
  scene: Phaser.Scene,
  context: BootContext,
  room: ReturnType<typeof getCurrentRoom>,
  nextRoom: ReturnType<typeof getCurrentRoom>,
  revealedNextRoomType: RoomType | undefined,
  bossDistance: number | undefined
): void {
  renderPaperPanel(scene, 430, 620, 486, 596, { alpha: 0.96 });
  scene.add.text(236, 358, "탐험 기록", textStyle(31, "#32415a", true));
  scene.add.text(236, 404, "문 앞에서 읽은 진행 단서", textStyle(20, "#805845", true));

  const nextIntel = getNextIntelLabel(nextRoom, revealedNextRoomType);
  const bossText = bossDistance === undefined ? "보스 표식 없음" : bossDistance <= 0 ? "보스 문 앞" : `${bossDistance}칸 남음`;

  const rows = [
    { label: "현재", value: room ? roomTypeLabel(room.type) : "방 없음" },
    { label: "문 표식", value: room ? roomLeadText(room.type) : "경로 없음" },
    { label: "다음", value: nextIntel },
    { label: "보스까지", value: bossText },
    { label: "자원", value: `HP ${context.run.player.hp}/${context.run.player.maxHp} / 골드 ${context.run.player.gold}` }
  ];
  rows.forEach((row, index) => {
    const y = 462 + index * 63;
    renderUiSlot(scene, 430, y, 360, 52, "choice", { disabled: true, focus: index === 0 || (index === 2 && Boolean(revealedNextRoomType)) });
    scene.add.text(282, y - 14, row.label, textStyle(16, "#805845", true)).setWordWrapWidth(86);
    scene.add.text(382, y - 16, row.value, textStyle(19, "#1e2a3e", true)).setWordWrapWidth(206);
  });

  scene.add.rectangle(430, 840, 354, 92, 0xfff6df, 0.42).setStrokeStyle(3, 0xc6a65e, 0.5);
  const nextLabel = revealedNextRoomType
    ? `나침반이 다음 ${roomTypeLabel(revealedNextRoomType)} 표식을 드러냈습니다.`
    : nextRoom
      ? "다음 방 표식은 문 뒤에 봉인되어 있습니다."
      : "이 경로의 끝에 가까워졌습니다.";
  scene.add.text(274, 812, nextLabel, textStyle(17, revealedNextRoomType ? "#1f8a70" : "#805845", true)).setWordWrapWidth(306);
}

function renderDungeonView(
  scene: Phaser.Scene,
  context: BootContext,
  room: ReturnType<typeof getCurrentRoom>,
  nextRoom: ReturnType<typeof getCurrentRoom>,
  revealedNextRoomType: RoomType | undefined,
  bossDistance: number | undefined
): void {
  renderPaperPanel(scene, 1040, 616, 860, 600, { alpha: 0.96 });
  scene.add.text(690, 352, "종이 회랑", textStyle(32, "#32415a", true));
  scene.add.text(690, 398, room ? roomTypeLabel(room.type) : "방 없음", textStyle(28, "#1e2a3e", true));
  scene.add.text(1212, 398, bossDistance === undefined ? "경로 미확인" : bossDistance <= 0 ? "보스 문" : `보스까지 ${bossDistance}칸`, textStyle(20, "#805845", true))
    .setOrigin(0.5);

  const roomFill = roomColor(room?.type ?? "combat");
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x32415a, 0.1);
  graphics.fillPoints([
    new Phaser.Geom.Point(660, 780),
    new Phaser.Geom.Point(1420, 780),
    new Phaser.Geom.Point(1248, 456),
    new Phaser.Geom.Point(832, 456)
  ], true);
  graphics.lineStyle(6, 0x8d6a2a, 0.34);
  graphics.strokePoints([
    new Phaser.Geom.Point(660, 780),
    new Phaser.Geom.Point(1420, 780),
    new Phaser.Geom.Point(1248, 456),
    new Phaser.Geom.Point(832, 456),
    new Phaser.Geom.Point(660, 780)
  ], true);
  graphics.fillStyle(0xf5c26b, 0.14);
  graphics.fillPoints([
    new Phaser.Geom.Point(820, 780),
    new Phaser.Geom.Point(1260, 780),
    new Phaser.Geom.Point(1162, 614),
    new Phaser.Geom.Point(918, 614)
  ], true);

  scene.add.polygon(740, 612, [0, -154, 174, -96, 134, 168, -42, 196, -82, -86], 0x6c8fd6, 0.22)
    .setStrokeStyle(4, 0x4c659d, 0.42);
  scene.add.polygon(1340, 612, [0, -154, 82, -86, 42, 196, -134, 168, -174, -96], 0x5d8d86, 0.22)
    .setStrokeStyle(4, 0x3f6f68, 0.42);

  scene.add.rectangle(1040, 610, 340, 238, 0xfff2d6, 0.88)
    .setStrokeStyle(6, 0x8d6a2a, 0.82);
  scene.add.rectangle(1040, 476, 262, 38, 0xfff6df, 0.72)
    .setStrokeStyle(3, 0xc6a65e, 0.58);
  scene.add.text(1040, 465, "현재 문", textStyle(18, "#805845", true)).setOrigin(0.5);
  scene.add.rectangle(1040, 610, 218, 150, roomFill, 0.86)
    .setStrokeStyle(5, 0xfff3b0, 0.72);
  scene.add.circle(940, 610, 12, 0xf5c26b, 0.95).setStrokeStyle(2, 0x805845, 0.7);
  scene.add.circle(1140, 610, 12, 0xf5c26b, 0.95).setStrokeStyle(2, 0x805845, 0.7);
  scene.add.text(1040, 522, `${context.run.roomIndex + 1}`, textStyle(30, "#fff5d7", true)).setOrigin(0.5);
  scene.add.text(1040, 642, room ? roomTypeLabel(room.type) : "방 없음", textStyle(24, "#fff5d7", true)).setOrigin(0.5);

  const encounterName = getRoomEncounterName(context, room);
  renderRoomIntelCard(scene, 800, 740, "현재 표식", encounterName, room?.type, true);
  renderRoomIntelCard(scene, 1140, 740, revealedNextRoomType ? "다음 공개" : "다음 봉인", getNextIntelLabel(nextRoom, revealedNextRoomType), revealedNextRoomType ?? nextRoom?.type, Boolean(revealedNextRoomType));
  scene.add.rectangle(1040, 838, 520, 48, 0xfff6df, 0.5).setStrokeStyle(3, 0xc6a65e, 0.42);
  scene.add.text(804, 824, room ? `${roomTypeLabel(room.type)} 표식은 버튼으로 확정됩니다.` : "경로를 찾지 못했습니다.", textStyle(17, "#805845", true)).setWordWrapWidth(472);
}

function renderDungeonRouteRail(
  scene: Phaser.Scene,
  route: NonNullable<ReturnType<typeof getStage>>["route"],
  currentIndex: number
): void {
  renderPaperPanel(scene, 1480, 620, 386, 596, { alpha: 0.95 });
  scene.add.text(1320, 358, "방 경로", textStyle(31, "#32415a", true));
  scene.add.text(1320, 404, "지금 열린 회랑", textStyle(20, "#805845", true));

  const maxVisible = 6;
  const start = Math.max(0, Math.min(currentIndex - 2, Math.max(0, route.length - maxVisible)));
  const visible = route.slice(start, start + maxVisible);
  visible.forEach((room, index) => {
    const routeIndex = start + index;
    const y = 474 + index * 56;
    const active = routeIndex === currentIndex;
    const state = roomRouteState(routeIndex, currentIndex);
    const color = roomColor(room.type);
    scene.add.circle(1350, y, active ? 24 : 18, color, active ? 0.96 : 0.78)
      .setStrokeStyle(active ? 5 : 3, active ? 0xfff3b0 : 0xffffff, 0.9);
    scene.add.text(1342, y - 13, `${routeIndex + 1}`, textStyle(active ? 17 : 14, "#fff5d7", true));
    scene.add.text(1390, y - 15, roomTypeLabel(room.type), textStyle(active ? 20 : 17, active ? "#1e2a3e" : "#805845", true))
      .setWordWrapWidth(94);
    scene.add.text(1506, y - 12, state, textStyle(15, active ? "#1f8a70" : routeIndex < currentIndex ? "#8d6a2a" : "#805845", true))
      .setWordWrapWidth(74);
    if (index < visible.length - 1) {
      scene.add.rectangle(1350, y + 28, 5, 24, 0x8d6a2a, 0.42);
    }
  });

  scene.add.rectangle(1480, 840, 302, 82, 0xfff6df, 0.38).setStrokeStyle(3, 0xc6a65e, 0.5);
  scene.add.text(1342, 816, "확인 키 또는 버튼으로 문을 엽니다.", textStyle(18, "#805845", true)).setWordWrapWidth(260);
}

function renderRoomIntelCard(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  value: string,
  type: RoomType | undefined,
  active: boolean
): void {
  scene.add.rectangle(x, y, 300, 72, 0xfff6df, active ? 0.74 : 0.46)
    .setStrokeStyle(active ? 4 : 3, active ? 0xf5c26b : 0xc6a65e, active ? 0.75 : 0.44);
  scene.add.circle(x - 118, y, 18, roomColor(type ?? "combat"), active ? 0.92 : 0.58)
    .setStrokeStyle(3, active ? 0xfff3b0 : 0xffffff, 0.75);
  scene.add.text(x - 92, y - 25, label, textStyle(15, active ? "#1f8a70" : "#805845", true));
  scene.add.text(x - 92, y - 3, value, textStyle(17, "#1e2a3e", true)).setWordWrapWidth(210);
}

function getNextIntelLabel(
  nextRoom: ReturnType<typeof getCurrentRoom>,
  revealedNextRoomType: RoomType | undefined
): string {
  if (revealedNextRoomType) return `${roomTypeLabel(revealedNextRoomType)} 공개`;
  if (nextRoom) return "봉인된 다음 방";
  return "스테이지 끝";
}

function getBossDistance(
  route: RoomSlot[],
  currentIndex: number
): number | undefined {
  const bossIndex = route.findIndex((room, index) => index >= currentIndex && room.type === "boss");
  if (bossIndex < 0) return undefined;
  return Math.max(0, bossIndex - currentIndex);
}

function roomRouteState(routeIndex: number, currentIndex: number): string {
  if (routeIndex < currentIndex) return "완료";
  if (routeIndex === currentIndex) return "현재";
  if (routeIndex === currentIndex + 1) return "다음";
  return "대기";
}

function getRoomEncounterName(context: BootContext, room: ReturnType<typeof getCurrentRoom>): string {
  if (!room) return "경로를 찾지 못했습니다.";
  if (room.type === "combat" || room.type === "elite") {
    const enemyId = getEncounterPoolContentId(context.dataBundle, room.encounterPoolId, room.type);
    const enemy = context.dataBundle.enemies.find((item) => item.id === enemyId);
    return enemy ? `${roomTypeLabel(room.type)} 표식 / ${enemy.displayNameKo}` : `${roomTypeLabel(room.type)} 표식`;
  }
  if (room.type === "boss") {
    const bossId = getEncounterPoolContentId(context.dataBundle, room.encounterPoolId, "boss") ?? getStage(context.dataBundle, context.run)?.bossId;
    const boss = context.dataBundle.bosses.find((item) => item.id === bossId);
    return boss ? `보스 문 / ${boss.displayNameKo}` : "보스 문";
  }
  if (room.type === "event") {
    const eventId = getEncounterPoolContentId(context.dataBundle, room.encounterPoolId, "event");
    const event = context.dataBundle.events.find((item) => item.id === eventId);
    return event ? `사건 표식 / ${event.displayNameKo}` : "사건 표식";
  }
  if (room.type === "rest") return "휴식 표식 / 룬 작업대";
  if (room.type === "reward") return "보상 표식 / 묶음 상자";
  if (room.type === "shop") return "상점 표식 / 임시 거래대";
  return `${roomTypeLabel(room.type)} 표식`;
}

function roomLeadText(type: string): string {
  const labels: Record<string, string> = {
    combat: "정면 전투 준비",
    elite: "강한 적의 기척",
    event: "선택의 무대",
    shop: "거래 표식",
    rest: "정비 가능한 방",
    reward: "보상 묶음",
    boss: "막 뒤의 보스"
  };
  return labels[type] ?? "알 수 없는 표식";
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
