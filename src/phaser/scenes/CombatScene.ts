import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { InputAction } from "../../input/actions";
import { bindKeyboardActions } from "../../input/bindings";
import { canPlayCardAtIndex, getActiveIntent, getCombatantData } from "../../simulation/systems/combat/combatSystem";
import { resolveCombatFeedbackEffectKey, resolveCombatFeedbackFrame } from "../../simulation/state/combatFeedback";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderCardHand, renderPaperPanel, renderRasterDisabledHitTarget, renderRasterHoverHitTarget, renderSceneShell, setRasterHitTargetHoverState, textStyle, triggerRasterHitTargetDown } from "../view/sceneShell";

const COMBAT_RASTER_UNDERLAY_KEY = "combat_raster_underlay_concept";
const COMBAT_RASTER_HOVER_SEAL_KEY = "ui_hover_gold_seal_concept";
const COMBAT_RASTER_FOCUS_ID_KEY = "combatRasterFocusId";

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

    const rasterUnderlay = hasCombatRasterUnderlay(this, false);
    renderCombatTheater(this, context, false);
    const rasterControls: CombatRasterControls | undefined = rasterUnderlay
      ? { blockedCardActions: {}, controls: [] }
      : undefined;
    if (rasterControls) {
      renderCombatFeedbackEffect(this, context);
      const cardTargets = renderCombatRasterCardHand(this, context, (index) => handleSceneAction(this, context, `card_${index + 1}` as InputAction));
      rasterControls.blockedCardActions = cardTargets.blockedActions;
      rasterControls.controls.push(...cardTargets.controls);
    } else {
      renderCombatFeedbackEffect(this, context);
      renderCombatPanel(this, context, 0xfffbef, 0x8f5b42, "#1e2a3e", "#805845");
      renderCombatPlayerStandee(this, context);
      renderCombatEnemyStandee(this, context);
      renderCardHand(this, context, (index) => handleSceneAction(this, context, `card_${index + 1}` as InputAction));
    }
    const endTurnHitTarget = renderCombatButtons(this, context);
    if (rasterControls) {
      if (endTurnHitTarget) {
        rasterControls.controls.push({
          id: "end_turn",
          x: 1660,
          y: 910,
          hitTarget: endTurnHitTarget,
          activate: () => handleSceneAction(this, context, "end_turn")
        });
      }
    }
    const rasterKeyboardHandler = rasterControls
      ? createCombatRasterKeyboardHandler(this, rasterControls)
      : undefined;
    bindKeyboardActions(this, (action) => {
      if (rasterKeyboardHandler?.(action)) {
        return;
      }
      handleSceneAction(this, context, action);
    }, context.save.settings);
    renderDebugOverlay(context, "CombatScene");
  }
}

interface CombatRasterControls {
  blockedCardActions: Partial<Record<InputAction, boolean>>;
  controls: CombatRasterControl[];
}

interface CombatRasterCardTargets {
  blockedActions: Partial<Record<InputAction, boolean>>;
  controls: CombatRasterControl[];
}

interface CombatRasterControl {
  id: InputAction;
  x: number;
  y: number;
  hitTarget: Phaser.GameObjects.Rectangle;
  activate: () => void;
}

function isCombatRasterBlockedAction(
  controls: CombatRasterControls | undefined,
  action: InputAction
): boolean {
  return Boolean(controls?.blockedCardActions[action]);
}

function createCombatRasterKeyboardHandler(
  scene: Phaser.Scene,
  rasterControls: CombatRasterControls
): (action: InputAction) => boolean {
  const { controls } = rasterControls;
  let focusedIndex = storedCombatFocusIndex(scene, controls);

  const setFocus = (nextIndex: number): void => {
    if (!controls[nextIndex]) return;
    if (focusedIndex >= 0 && focusedIndex !== nextIndex) {
      setRasterHitTargetHoverState(controls[focusedIndex]?.hitTarget, false);
    }
    focusedIndex = nextIndex;
    scene.registry.set(COMBAT_RASTER_FOCUS_ID_KEY, controls[focusedIndex].id);
    setRasterHitTargetHoverState(controls[focusedIndex].hitTarget, true);
  };

  const clearKeyboardFocus = (except?: CombatRasterControl): void => {
    if (focusedIndex < 0 || controls[focusedIndex] === except) return;
    setRasterHitTargetHoverState(controls[focusedIndex].hitTarget, false);
    focusedIndex = -1;
    scene.registry.set(COMBAT_RASTER_FOCUS_ID_KEY, undefined);
  };

  const activateControl = (control: CombatRasterControl): void => {
    scene.registry.set(COMBAT_RASTER_FOCUS_ID_KEY, undefined);
    focusedIndex = -1;
    control.activate();
  };

  const triggerFocusedControl = (control: CombatRasterControl): boolean => {
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
    if (isCombatRasterBlockedAction(rasterControls, action)) {
      return true;
    }
    if (controls.length === 0) return false;

    if (isCombatMoveAction(action)) {
      setFocus(resolveCombatFocusIndex(controls, focusedIndex, action));
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

    const directIndex = controls.findIndex((control) => control.id === action);
    if (directIndex >= 0) {
      setFocus(directIndex);
      return triggerFocusedControl(controls[directIndex]);
    }

    return false;
  };
}

function storedCombatFocusIndex(scene: Phaser.Scene, controls: CombatRasterControl[]): number {
  const storedId = scene.registry.get(COMBAT_RASTER_FOCUS_ID_KEY);
  const storedIndex = controls.findIndex((control) => control.id === storedId);
  return storedIndex >= 0 ? storedIndex : -1;
}

function isCombatMoveAction(action: InputAction): action is "move_up" | "move_down" | "move_left" | "move_right" {
  return action === "move_up" || action === "move_down" || action === "move_left" || action === "move_right";
}

function resolveCombatFocusIndex(
  controls: CombatRasterControl[],
  focusedIndex: number,
  action: "move_up" | "move_down" | "move_left" | "move_right"
): number {
  if (focusedIndex < 0) return 0;
  const current = controls[focusedIndex];
  const candidates = controls
    .map((control, index) => ({ control, index }))
    .filter(({ index }) => index !== focusedIndex)
    .filter(({ control }) => isCombatFocusCandidate(current, control, action));
  if (candidates.length === 0) return focusedIndex;

  candidates.sort((left, right) => combatFocusScore(current, left.control, action) - combatFocusScore(current, right.control, action));
  return candidates[0].index;
}

function isCombatFocusCandidate(
  current: CombatRasterControl,
  candidate: CombatRasterControl,
  action: "move_up" | "move_down" | "move_left" | "move_right"
): boolean {
  if (action === "move_up") return candidate.y < current.y - 8;
  if (action === "move_down") return candidate.y > current.y + 8;
  if (action === "move_left") return candidate.x < current.x - 8;
  return candidate.x > current.x + 8;
}

function combatFocusScore(
  current: CombatRasterControl,
  candidate: CombatRasterControl,
  action: "move_up" | "move_down" | "move_left" | "move_right"
): number {
  const dx = Math.abs(candidate.x - current.x);
  const dy = Math.abs(candidate.y - current.y);
  if (action === "move_up" || action === "move_down") {
    return dy + dx * 0.82;
  }
  return dx + dy * 2.2;
}

function renderCombatButtons(scene: Phaser.Scene, context: BootContext): Phaser.GameObjects.Rectangle | undefined {
  if (hasCombatRasterUnderlay(scene, false)) {
    return renderCombatRasterEndTurnButton(scene, context);
  }

  renderActionButton(scene, 1630, 708, "턴 종료", () => handleSceneAction(scene, context, "end_turn"), {
    width: 190,
    height: 54,
    focus: true,
    fontSize: 22
  });
  return undefined;
}

function hasCombatRasterUnderlay(scene: Phaser.Scene, boss: boolean): boolean {
  return !boss && scene.textures.exists(COMBAT_RASTER_UNDERLAY_KEY);
}

function renderCombatRasterEndTurnButton(scene: Phaser.Scene, context: BootContext): Phaser.GameObjects.Rectangle {
  const x = 1660;
  const y = 910;
  const width = 300;
  const height = 260;
  return renderRasterHoverHitTarget(scene, x, y, width, height, () => handleSceneAction(scene, context, "end_turn"), {
    depth: 22,
    hoverDepth: 24,
    hoverKey: COMBAT_RASTER_HOVER_SEAL_KEY,
    downKey: COMBAT_RASTER_HOVER_SEAL_KEY,
    hoverX: x - 88,
    hoverY: y - 118,
    hoverWidth: 126,
    hoverHeight: 126,
    downX: x - 88,
    downY: y - 118,
    downWidth: 138,
    downHeight: 138,
    downAlpha: 0.94,
    tooltipTitle: "턴 종료",
    tooltipBody: "남은 기운을 정리하고 적의 의도를 처리합니다.",
    tooltipTone: "confirm"
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

  if (hasCombatRasterUnderlay(scene, boss)) {
    scene.add.image(stageX, 540, COMBAT_RASTER_UNDERLAY_KEY)
      .setDisplaySize(1920, 1080)
      .setDepth(0);
    return;
  }

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
  scene.add.rectangle(stageX + 160, stageY + 86, 720, 150, 0x142234, 0.16)
    .setStrokeStyle(2, 0xf5c26b, 0.2);
  [1060, 1226, 1392].forEach((slotX, index) => {
    const alpha = index === 1 ? 0.46 : 0.18;
    scene.add.ellipse(slotX, stageY + 72, 150, 36, 0x1e2a3e, alpha);
    scene.add.rectangle(slotX, stageY + 54, 132, 26, 0xfff1d0, 0.34)
      .setStrokeStyle(2, 0xc6a65e, index === 1 ? 0.48 : 0.2);
  });
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

function renderCombatRasterTopText(scene: Phaser.Scene, context: BootContext): void {
  const stage = context.dataBundle.stages.find((item) => item.id === context.run.stageId)
    ?? context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];
  const character = context.dataBundle.characters.find((item) => item.id === context.run.characterId)
    ?? context.dataBundle.characters[0];
  const combat = context.run.combat;

  addRasterText(scene, 118, 188, character?.displayNameKo ?? "캐릭터 없음", 30, "#2f211a", true, 260);
  addRasterText(scene, 162, 260, `체력 ${context.run.player.hp}/${context.run.player.maxHp}`, 23, "#fff5d7", true, 220);
  addRasterText(scene, 162, 330, `기운 ${context.run.player.energy}/${context.run.player.maxEnergy}`, 23, "#fff5d7", true, 220);
  addRasterText(scene, 162, 402, `방어 ${context.run.player.block}`, 23, "#fff5d7", true, 220);
  addRasterText(scene, 118, 492, `골드 ${context.run.player.gold}`, 23, "#2f211a", true, 245);
  addRasterText(scene, 118, 536, `턴 ${combat?.turn ?? 0}`, 23, "#2f211a", true, 245);
  addRasterText(scene, 118, 580, stage?.displayNameKo ?? "스테이지 없음", 21, "#2f211a", true, 245);

  const route = stage?.route ?? [];
  route.slice(0, 5).forEach((room, index) => {
    const x = 588 + index * 156;
    addRasterText(scene, x, 136, roomTypeKo(room.type), 15, index === context.run.roomIndex ? "#5b2f40" : "#3a2a20", true, 80)
      .setOrigin(0.5, 0)
      .setAlign("center");
  });
}

export function renderCombatRasterCardHand(
  scene: Phaser.Scene,
  context: BootContext,
  onCardClick?: (index: number) => void
): CombatRasterCardTargets {
  const hand = context.run.hand.length > 0
    ? context.run.hand
    : context.save.currentRun?.hand ?? context.dataBundle.cards.slice(0, 5).map((card) => card.id);
  const cards = hand
    .map((id) => context.dataBundle.cards.find((card) => card.id === id))
    .filter((card): card is NonNullable<typeof card> => Boolean(card))
    .slice(0, 5);
  const cardXs = [540, 760, 980, 1200, 1420];
  const cardY = 836;
  const cardWidth = 210;
  const cardHeight = 324;
  const blockedActions: Partial<Record<InputAction, boolean>> = {};
  const controls: CombatRasterControl[] = [];

  cards.forEach((card, index) => {
    const x = cardXs[index] ?? (540 + index * 220);
    const action = `card_${index + 1}` as InputAction;
    const playable = canPlayCardAtIndex(context.run, context.dataBundle, index);
    if (!playable) {
      blockedActions[action] = true;
      renderRasterDisabledHitTarget(scene, x, cardY, cardWidth, cardHeight, {
        depth: 22,
        disabledDepth: 24,
        disabledX: x + 12,
        disabledY: cardY - 92,
        disabledWidth: 88,
        disabledHeight: 88,
        disabledAlpha: 0.9
      });
      return;
    }

    if (onCardClick) {
      const hitTarget = renderRasterHoverHitTarget(scene, x, cardY, cardWidth, cardHeight, () => onCardClick(index), {
        hoverKey: COMBAT_RASTER_HOVER_SEAL_KEY,
        downKey: COMBAT_RASTER_HOVER_SEAL_KEY,
        hoverX: x + 12,
        hoverY: cardY - 92,
        hoverWidth: 82,
        hoverHeight: 82,
        downX: x + 12,
        downY: cardY - 92,
        downWidth: 94,
        downHeight: 94,
        downAlpha: 0.94,
        tooltipTitle: `${card.displayNameKo} · 비용 ${card.cost}`,
        tooltipBody: card.descriptionKo,
        tooltipTone: "choice"
      });
      controls.push({
        id: action,
        x,
        y: cardY,
        hitTarget,
        activate: () => onCardClick(index)
      });
    }
  });
  return { blockedActions, controls };
}

function addRasterText(
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
    .setShadow(1, 2, "rgba(20, 17, 22, 0.45)", 2);
  if (wrapWidth) {
    text.setWordWrapWidth(wrapWidth);
  }
  return text;
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
  const panelX = isBoss ? 1518 : 1532;
  const panelWidth = isBoss ? 394 : 364;
  const left = panelX - panelWidth / 2;

  if (hasCombatRasterUnderlay(scene, isBoss)) {
    renderCombatRasterEnemyInfo(scene, context);
    return;
  }

  renderPaperPanel(scene, panelX, 532, panelWidth, 258, {
    alpha: 0.98,
    tint: fill === 0x3c3143 ? 0x4b4050 : undefined,
    fillFallback: fill,
    strokeFallback: stroke
  });
  scene.add.rectangle(panelX, 424, panelWidth - 46, 30, fill, 0.16).setStrokeStyle(2, stroke, 0.34);
  scene.add.circle(left + 28, 424, 14, 0xf5c26b, 0.95).setStrokeStyle(3, 0x6d4a20, 0.85);
  scene.add.text(left + 50, 412, isBoss ? "보스" : "적", textStyle(18, bodyColor, true));
  scene.add.text(left + 30, 450, enemyName, textStyle(nameFontSize, titleColor, true)).setWordWrapWidth(panelWidth - 132);

  scene.add.rectangle(left + 130, 520, 196, 42, 0xfff8e8, 0.58).setStrokeStyle(2, 0xce5869, 0.62);
  scene.add.text(left + 44, 506, `체력 ${combat?.enemyHp ?? "-"} / ${combat?.enemyMaxHp ?? "-"}`, textStyle(24, bodyColor, true));
  scene.add.rectangle(left + 104, 562, 144, 34, 0xfff8e8, 0.44).setStrokeStyle(2, 0x5d8d86, 0.52);
  scene.add.text(left + 44, 552, `방어 ${combat?.enemyBlock ?? 0}`, textStyle(20, bodyColor, true));
  scene.add.rectangle(left + 262, 562, 122, 34, 0xfff8e8, 0.44).setStrokeStyle(2, 0x8f5b42, 0.52);
  scene.add.text(left + 210, 552, `표식 ${combat?.enemyMark ?? 0}`, textStyle(19, bodyColor, true));

  if (spriteKey && scene.textures.exists(spriteKey)) {
    scene.add.circle(panelX + panelWidth / 2 - 60, isBoss ? 502 : 496, isBoss ? 48 : 40, fill, 0.54).setStrokeStyle(3, stroke, 0.62);
    scene.add.sprite(panelX + panelWidth / 2 - 60, isBoss ? 554 : 542, spriteKey, 0)
      .setOrigin(0.5, 1)
      .setDisplaySize(isBoss ? 92 : 78, isBoss ? 92 : 78);
  }

  scene.add.rectangle(left + 158, 610, panelWidth - 118, 58, 0xfff1d0, 0.58).setStrokeStyle(2, stroke, 0.46);
  if (intentIconKey && scene.textures.exists(intentIconKey)) {
    scene.add.circle(left + 58, 610, 28, fill, 0.76).setStrokeStyle(2, stroke, 0.9);
    scene.add.image(left + 58, 610, intentIconKey).setDisplaySize(48, 48);
  }
  scene.add.text(left + 96, 592, intentText, textStyle(intentFontSize, bodyColor, true))
    .setWordWrapWidth(Math.min(intentWrapWidth, panelWidth - 130));
}

function renderCombatRasterEnemyInfo(
  scene: Phaser.Scene,
  context: BootContext
): void {
  const combat = context.run.combat;
  const enemy = getCombatantData(context.run, context.dataBundle);
  const intent = getActiveIntent(context.run, context.dataBundle);
  const intentIconKey = resolveIntentIconKey(context);
  const enemyName = enemy?.displayNameKo ?? "적 없음";
  const nameFontSize = enemyName.length > 10 ? 24 : enemyName.length > 7 ? 27 : 30;
  const intentText = intent?.telegraphKo ? `의도 ${intent.telegraphKo}` : "";

  addRasterText(scene, 1694, 302, enemyName, Math.min(nameFontSize, 26), "#fff5d7", true, 210)
    .setOrigin(0.5, 0)
    .setAlign("center");
  addRasterText(scene, 1626, 356, `체력 ${combat?.enemyHp ?? "-"} / ${combat?.enemyMaxHp ?? "-"}`, 22, "#fff5d7", true, 226);
  addRasterText(scene, 1626, 416, `방어 ${combat?.enemyBlock ?? 0}`, 22, "#fff5d7", true, 226);
  addRasterText(scene, 1626, 476, `표식 ${combat?.enemyMark ?? 0}`, 22, "#fff5d7", true, 226);
  if (intentIconKey && scene.textures.exists(intentIconKey)) {
    scene.add.image(1594, 538, intentIconKey)
      .setDisplaySize(48, 48)
      .setDepth(12);
  }
  if (intentText) {
    addRasterText(scene, 1654, 586, intentText, 17, "#2f211a", true, 190);
  }
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
  const raster = hasCombatRasterUnderlay(scene, isBoss);
  const baseY = raster ? 654 : isBoss ? 642 : 626;
  const spriteSize = raster ? 178 : isBoss ? 146 : 168;
  const x = raster ? 590 : isBoss ? 768 : 792;

  if (raster) {
    scene.add.ellipse(x, baseY + 8, 198, 34, 0x05070a, 0.28).setDepth(2);
    scene.add.sprite(x, baseY, spriteKey, 0)
      .setOrigin(0.5, 1)
      .setDisplaySize(spriteSize, spriteSize)
      .setDepth(5);
    return;
  }

  scene.add.ellipse(x, baseY + 4, isBoss ? 150 : 172, isBoss ? 30 : 34, 0x32415a, 0.16).setDepth(1);
  scene.add.circle(x, isBoss ? 558 : 530, isBoss ? 72 : 84, 0xfff1d0, 0.28).setStrokeStyle(3, 0xc6a65e, 0.38);
  scene.add.sprite(x, baseY, spriteKey, 0)
    .setOrigin(0.5, 1)
    .setDisplaySize(spriteSize, spriteSize)
    .setDepth(2);
}

export function renderCombatEnemyStandee(scene: Phaser.Scene, context: BootContext): void {
  const combat = context.run.combat;
  const enemy = getCombatantData(context.run, context.dataBundle);
  const spriteKey = enemy?.assetKeys.sprite;
  const isBoss = combat?.enemyKind === "boss";
  const raster = hasCombatRasterUnderlay(scene, isBoss);
  const activeX = raster ? 1178 : isBoss ? 1228 : 1226;
  const baseY = raster ? 666 : isBoss ? 650 : 628;
  const spriteSize = raster ? 198 : isBoss ? 238 : 178;
  const slotXs = isBoss ? [1054, activeX, 1402] : [1060, activeX, 1392];

  if (raster) {
    scene.add.ellipse(activeX, baseY + 8, 220, 40, 0x05070a, 0.3).setDepth(2);
    if (spriteKey && scene.textures.exists(spriteKey)) {
      scene.add.sprite(activeX, baseY, spriteKey, 0)
        .setOrigin(0.5, 1)
        .setDisplaySize(spriteSize, spriteSize)
        .setDepth(5);
    }

    const maxHp = combat?.enemyMaxHp ?? enemy?.maxHp ?? 1;
    const hp = Math.max(0, combat?.enemyHp ?? maxHp);
    const hpRatio = maxHp > 0 ? Math.max(0, Math.min(1, hp / maxHp)) : 1;
    scene.add.rectangle(activeX, baseY + 38, 188, 9, 0x351e1e, 0.72).setDepth(6);
    scene.add.rectangle(activeX - 94 + 94 * hpRatio, baseY + 38, 188 * hpRatio, 7, 0xa5483f, 0.9).setDepth(7);
    return;
  }

  slotXs.forEach((slotX, index) => {
    const active = slotX === activeX;
    scene.add.ellipse(slotX, baseY + 8, active ? 190 : 124, active ? 38 : 24, 0x111827, active ? 0.24 : 0.12)
      .setDepth(active ? 2 : 1);
    scene.add.rectangle(slotX, baseY - 4, active ? 146 : 108, active ? 24 : 18, 0xfff1d0, active ? 0.52 : 0.2)
      .setStrokeStyle(2, active ? 0xc6a65e : 0x8f8179, active ? 0.62 : 0.22)
      .setDepth(active ? 2 : 1);
    if (!active) {
      scene.add.rectangle(slotX, baseY - 68, 74, 82, 0x1e2a3e, 0.1)
        .setStrokeStyle(2, 0xc6a65e, 0.14)
        .setDepth(1);
    } else {
      scene.add.rectangle(slotX, baseY - spriteSize - 28, 162, 34, isBoss ? 0x5b2f40 : 0xa5483f, 0.78)
        .setStrokeStyle(2, 0xf5c26b, 0.58)
        .setDepth(4);
      scene.add.circle(slotX, baseY - spriteSize - 11, 17, 0xfff1d0, 0.92)
        .setStrokeStyle(3, 0xc6a65e, 0.74)
        .setDepth(5);
    }
    if (index === 0 || index === 2) {
      scene.add.circle(slotX, baseY - 78, 8, 0xc6a65e, 0.28).setDepth(2);
    }
  });

  if (spriteKey && scene.textures.exists(spriteKey)) {
    scene.add.sprite(activeX, baseY, spriteKey, 0)
      .setOrigin(0.5, 1)
      .setDisplaySize(spriteSize, spriteSize)
      .setDepth(5);
  }

  const maxHp = combat?.enemyMaxHp ?? enemy?.maxHp ?? 1;
  const hp = Math.max(0, combat?.enemyHp ?? maxHp);
  const hpRatio = maxHp > 0 ? Math.max(0, Math.min(1, hp / maxHp)) : 1;
  scene.add.rectangle(activeX, baseY + 36, 190, 22, 0x1e2a3e, 0.74).setStrokeStyle(2, 0xc6a65e, 0.52).setDepth(6);
  scene.add.rectangle(activeX - 95 + 95 * hpRatio, baseY + 36, 190 * hpRatio, 12, isBoss ? 0xce5869 : 0xa5483f, 0.9).setDepth(7);
  scene.add.text(activeX - 76, baseY + 50, `${hp}/${maxHp}`, textStyle(17, "#fff5d7", true)).setDepth(7);
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
    return { x: isBoss ? 1238 : 1228, y: isBoss ? 530 : 512, size: isBoss ? 218 : 176, alpha: 0.94, angle: -12 };
  }

  if (effectKey === "effect_ink_splash") {
    return { x: isBoss ? 1240 : 1230, y: isBoss ? 536 : 520, size: isBoss ? 214 : 174, alpha: 0.88, angle: 8 };
  }

  return { x: isBoss ? 1098 : 600, y: isBoss ? 472 : 570, size: isBoss ? 286 : 220, alpha: isBoss ? 0.84 : 0.78, angle: -2 };
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
