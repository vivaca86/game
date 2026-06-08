import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { EventChoice, EventData, RewardEntry } from "../../data/schema";
import type { InputAction } from "../../input/actions";
import { bindKeyboardActions } from "../../input/bindings";
import { canPayEventChoice, getCurrentEvent } from "../../simulation/systems/events/eventSystem";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderPaperPanel, renderRasterDisabledHitTarget, renderRasterHoverHitTarget, renderSceneShell, renderUiSlot, setRasterHitTargetHoverState, textStyle, triggerRasterHitTargetDown } from "../view/sceneShell";

const CHOICE_ACTIONS = ["card_1", "card_2", "card_3", "card_4", "card_5"] as const;
const EVENT_RASTER_UNDERLAY_KEY = "event_raster_underlay_concept";
const EVENT_RASTER_HOVER_CHOICE_KEY = "ui_hover_choice_badge_concept";
const EVENT_RASTER_FOCUS_INDEX_KEY = "eventRasterFocusIndex";

export class EventScene extends Phaser.Scene {
  constructor() {
    super("EventScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    const event = getCurrentEvent(context.dataBundle, context.run);
    renderSceneShell(this, context, {
      title: "이벤트",
      subtitle: "상황을 읽고 선택지를 고릅니다",
      focusLabel: "이벤트 방",
      backgroundKey: event?.assetKeys.scene,
      chrome: "immersive",
      showImmersiveInfo: false,
      showRoute: false
    });

    const rasterControls = hasEventRasterUnderlay(this)
      ? renderEventRasterStage(this, context, event)
      : undefined;
    if (!rasterControls) {
      renderEventStage(this, context, event);
      renderActionButton(this, 960, 1052, "Enter 첫 선택", () => handleSceneAction(this, context, "confirm"), {
        focus: true,
        width: 300,
        height: 44,
        fontSize: 20
      });
    }

    const handleRasterKeyboardAction = rasterControls
      ? createEventRasterKeyboardHandler(this, context, rasterControls)
      : undefined;
    bindKeyboardActions(this, (action) => {
      if (handleRasterKeyboardAction?.(action)) {
        return;
      }
      handleSceneAction(this, context, action);
    }, context.save.settings);
    renderDebugOverlay(context, "EventScene");
  }
}

interface EventRasterControls {
  choices: EventRasterChoiceControl[];
  confirmHitTarget?: Phaser.GameObjects.Rectangle;
}

interface EventRasterChoiceControl {
  index: number;
  action: (typeof CHOICE_ACTIONS)[number];
  x: number;
  y: number;
  hitTarget: Phaser.GameObjects.Rectangle;
}

function hasEventRasterUnderlay(scene: Phaser.Scene): boolean {
  return scene.textures.exists(EVENT_RASTER_UNDERLAY_KEY);
}

function renderEventRasterStage(
  scene: Phaser.Scene,
  context: BootContext,
  event: EventData | undefined
): EventRasterControls {
  scene.add.image(960, 540, EVENT_RASTER_UNDERLAY_KEY)
    .setDisplaySize(1920, 1080)
    .setDepth(0);

  let confirmHitTarget: Phaser.GameObjects.Rectangle | undefined;
  const choices: EventRasterChoiceControl[] = [];
  const cardXs = [530, 835, 1145, 1450];
  (event?.choices ?? []).slice(0, 4).forEach((choice, index) => {
    const action = CHOICE_ACTIONS[index];
    if (!action) return;
    const x = cardXs[index] ?? (530 + index * 305);
    const y = 770;
    const hitTarget = renderEventRasterChoice(scene, context, choice, action, x, y);
    if (hitTarget) {
      choices.push({ index, action, x, y, hitTarget });
    }
    confirmHitTarget ??= hitTarget;
  });
  return { choices, confirmHitTarget };
}

function renderEventRasterChoice(
  scene: Phaser.Scene,
  context: BootContext,
  choice: EventChoice,
  action: EventRasterChoiceControl["action"],
  x: number,
  y: number
): Phaser.GameObjects.Rectangle | undefined {
  const affordable = canPayEventChoice(context.run, choice);
  const badgeX = x - 32;

  if (!affordable) {
    renderRasterDisabledHitTarget(scene, x, y, 276, 430, {
      disabledX: badgeX,
      disabledY: y - 178,
      disabledWidth: 112,
      disabledHeight: 112,
      disabledAlpha: 0.92
    });
    return undefined;
  }

  return renderRasterHoverHitTarget(scene, x, y, 276, 430, () => {
    if (affordable && action) handleSceneAction(scene, context, action);
  }, {
    hoverKey: EVENT_RASTER_HOVER_CHOICE_KEY,
    downKey: EVENT_RASTER_HOVER_CHOICE_KEY,
    hoverX: badgeX,
    hoverY: y - 178,
    hoverWidth: 112,
    hoverHeight: 80,
    downX: badgeX,
    downY: y - 178,
    downWidth: 124,
    downHeight: 88,
    downAlpha: 0.94
  });
}

function createEventRasterKeyboardHandler(
  scene: Phaser.Scene,
  context: BootContext,
  rasterControls: EventRasterControls
): (action: InputAction) => boolean {
  const { choices } = rasterControls;
  let focusedIndex = storedEventFocusIndex(scene, choices.length);

  const setFocus = (nextIndex: number): void => {
    if (!choices[nextIndex]) return;
    if (focusedIndex >= 0 && focusedIndex !== nextIndex) {
      setRasterHitTargetHoverState(choices[focusedIndex]?.hitTarget, false);
    }
    focusedIndex = nextIndex;
    scene.registry.set(EVENT_RASTER_FOCUS_INDEX_KEY, focusedIndex);
    setRasterHitTargetHoverState(choices[focusedIndex].hitTarget, true);
  };

  const clearKeyboardFocus = (except?: EventRasterChoiceControl): void => {
    if (focusedIndex < 0 || choices[focusedIndex] === except) return;
    setRasterHitTargetHoverState(choices[focusedIndex].hitTarget, false);
    focusedIndex = -1;
    scene.registry.set(EVENT_RASTER_FOCUS_INDEX_KEY, undefined);
  };

  const activateControl = (control: EventRasterChoiceControl): void => {
    scene.registry.set(EVENT_RASTER_FOCUS_INDEX_KEY, undefined);
    handleSceneAction(scene, context, control.action);
  };

  const triggerFocusedControl = (control: EventRasterChoiceControl): boolean => {
    if (triggerRasterHitTargetDown(scene, control.hitTarget, () => activateControl(control))) {
      return true;
    }
    activateControl(control);
    return true;
  };

  choices.forEach((control) => {
    control.hitTarget.on("pointerover", () => clearKeyboardFocus(control));
    control.hitTarget.on("pointerout", () => {
      if (focusedIndex >= 0 && choices[focusedIndex] === control) {
        setRasterHitTargetHoverState(control.hitTarget, true);
      }
    });
  });

  if (focusedIndex >= 0) {
    setRasterHitTargetHoverState(choices[focusedIndex].hitTarget, true);
  }

  return (action: InputAction): boolean => {
    if (choices.length === 0) return false;

    if (isEventMoveAction(action)) {
      setFocus(resolveEventFocusIndex(choices, focusedIndex, action));
      return true;
    }

    if (action === "confirm") {
      if (focusedIndex < 0) {
        setFocus(0);
      }
      const focusedControl = choices[focusedIndex];
      if (!focusedControl) return true;
      return triggerFocusedControl(focusedControl);
    }

    const directIndex = choices.findIndex((control) => control.action === action);
    if (directIndex >= 0) {
      setFocus(directIndex);
      return triggerFocusedControl(choices[directIndex]);
    }

    return false;
  };
}

function storedEventFocusIndex(scene: Phaser.Scene, choicesLength: number): number {
  const storedIndex = Number(scene.registry.get(EVENT_RASTER_FOCUS_INDEX_KEY));
  return Number.isInteger(storedIndex) && storedIndex >= 0 && storedIndex < choicesLength ? storedIndex : -1;
}

function isEventMoveAction(action: InputAction): action is "move_up" | "move_down" | "move_left" | "move_right" {
  return action === "move_up" || action === "move_down" || action === "move_left" || action === "move_right";
}

function resolveEventFocusIndex(
  choices: EventRasterChoiceControl[],
  focusedIndex: number,
  action: "move_up" | "move_down" | "move_left" | "move_right"
): number {
  if (focusedIndex < 0) return 0;
  const current = choices[focusedIndex];
  const candidates = choices
    .map((control, index) => ({ control, index }))
    .filter(({ index }) => index !== focusedIndex)
    .filter(({ control }) => isEventFocusCandidate(current, control, action));
  if (candidates.length === 0) return focusedIndex;

  candidates.sort((left, right) => eventFocusScore(current, left.control, action) - eventFocusScore(current, right.control, action));
  return candidates[0].index;
}

function isEventFocusCandidate(
  current: EventRasterChoiceControl,
  candidate: EventRasterChoiceControl,
  action: "move_up" | "move_down" | "move_left" | "move_right"
): boolean {
  if (action === "move_up") return candidate.y < current.y - 8;
  if (action === "move_down") return candidate.y > current.y + 8;
  if (action === "move_left") return candidate.x < current.x - 8;
  return candidate.x > current.x + 8;
}

function eventFocusScore(
  current: EventRasterChoiceControl,
  candidate: EventRasterChoiceControl,
  action: "move_up" | "move_down" | "move_left" | "move_right"
): number {
  const dx = Math.abs(candidate.x - current.x);
  const dy = Math.abs(candidate.y - current.y);
  if (action === "move_up" || action === "move_down") {
    return dy + dx * 0.82;
  }
  return dx + dy * 2.2;
}

function renderEventStage(
  scene: Phaser.Scene,
  context: BootContext,
  event: EventData | undefined
): void {
  const stageX = 960;
  const stageY = 560;
  drawLayeredEventStage(scene, stageX, stageY, 1340, 820);

  scene.add.text(stageX - 420, stageY - 294, event?.displayNameKo ?? "이벤트 없음", textStyle(40, "#1e2a3e", true))
    .setWordWrapWidth(840);
  scene.add.text(stageX - 416, stageY - 246, "낯선 장면 앞에서 선택을 고른다", textStyle(20, "#d9f0df", true))
    .setWordWrapWidth(780);

  scene.add.circle(stageX + 428, stageY - 262, 46, 0xfff1d0, 0.96).setStrokeStyle(4, 0xb98c34, 0.9);
  scene.add.text(stageX + 386, stageY - 279, `G ${context.run.player.gold}`, textStyle(23, "#805845", true))
    .setWordWrapWidth(82)
    .setAlign("center");

  renderEventDiorama(scene, event, stageX, stageY - 70, 1020, 260);

  (event?.choices ?? []).slice(0, 5).forEach((choice, index) => {
    renderChoice(scene, context, choice, index, event?.choices.length ?? 0);
  });
}

function drawLayeredEventStage(scene: Phaser.Scene, x: number, y: number, width: number, height: number): void {
  scene.add.rectangle(x, y + 18, width + 54, height + 34, 0x1e2a3e, 0.18);
  renderPaperPanel(scene, x, y, width, height, { alpha: 0.98 });

  scene.add.ellipse(x, y - 120, width * 0.76, height * 0.48, 0x2f6b68, 0.24);
  scene.add.ellipse(x, y - 92, width * 0.6, height * 0.34, 0x1f3f46, 0.23);
  scene.add.rectangle(x - width * 0.47, y + 42, 72, height * 0.58, 0x2f6b68, 0.11)
    .setStrokeStyle(2, 0xc6a65e, 0.28);
  scene.add.rectangle(x + width * 0.47, y + 42, 72, height * 0.58, 0x2f6b68, 0.11)
    .setStrokeStyle(2, 0xc6a65e, 0.28);
  scene.add.rectangle(x, y - 262, width * 0.72, 88, 0x2f6b68, 0.94).setStrokeStyle(4, 0xf5c26b, 0.65);
  scene.add.triangle(x - width * 0.42, y - 262, 0, 0, 90, -44, 90, 44, 0x2f6b68, 0.92)
    .setStrokeStyle(3, 0xf5c26b, 0.55);
  scene.add.triangle(x + width * 0.42, y - 262, 0, -44, 90, 0, 0, 44, 0x2f6b68, 0.92)
    .setStrokeStyle(3, 0xf5c26b, 0.55);

  scene.add.rectangle(x, y - 60, width * 0.8, 286, 0xfff5df, 0.58)
    .setStrokeStyle(3, 0xc6a65e, 0.42);
  scene.add.rectangle(x, y + 302, width * 0.86, 104, 0xfff1d0, 0.86)
    .setStrokeStyle(3, 0xc6a65e, 0.55);
  scene.add.rectangle(x, y + 358, width * 0.82, 12, 0x805845, 0.16);

  for (const pinX of [x - width * 0.44, x + width * 0.44, x - width * 0.18, x + width * 0.18]) {
    scene.add.circle(pinX, y - 262, 14, 0xf5c26b, 0.98).setStrokeStyle(3, 0x6d4a20, 0.9);
    scene.add.circle(pinX - 4, y - 266, 4, 0xfff3b0, 0.9);
  }

  for (const railY of [y - 188, y - 130, y - 72]) {
    scene.add.rectangle(x, railY, width * 0.86, 4, 0x805845, 0.22);
  }
}

function renderEventDiorama(
  scene: Phaser.Scene,
  event: EventData | undefined,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  renderPaperPanel(scene, x, y, width, height, { alpha: 0.92 });
  const sceneKey = event?.assetKeys.scene;
  const imageX = x - width / 2 + 220;
  const textX = x - width / 2 + 426;

  scene.add.rectangle(imageX, y, 330, height - 46, 0xe4dcc4, 0.78)
    .setStrokeStyle(4, 0xb98c34, 0.5);
  if (sceneKey && scene.textures.exists(sceneKey)) {
    scene.add.image(imageX, y, sceneKey).setDisplaySize(314, height - 62);
  } else {
    scene.add.ellipse(imageX, y, 250, height - 74, 0x2f6b68, 0.3);
    scene.add.circle(imageX, y + 18, 58, 0xf5c26b, 0.6);
  }

  scene.add.rectangle(textX + 258, y, 540, height - 54, 0xfff8e8, 0.9)
    .setStrokeStyle(3, 0xc6a65e, 0.42);
  scene.add.rectangle(textX + 258, y - 94, 540, 42, 0x2f6b68, 0.12)
    .setStrokeStyle(2, 0x2f6b68, 0.18);
  scene.add.text(textX, y - 104, "장면 기록", textStyle(18, "#2f6b68", true));
  scene.add.text(textX, y - 78, event?.descriptionKo ?? "이벤트 데이터가 없습니다.", textStyle(24, "#4b2e12", true))
    .setWordWrapWidth(512);
  scene.add.text(textX, y + 66, "작은 장치가 딸깍이며 다음 장면을 기다린다.", textStyle(18, "#805845", true))
    .setWordWrapWidth(500);
}

function renderChoice(
  scene: Phaser.Scene,
  context: BootContext,
  choice: EventChoice,
  index: number,
  choiceCount: number
): void {
  const stageX = 960;
  const stageY = 590;
  const affordable = canPayEventChoice(context.run, choice);
  const action = CHOICE_ACTIONS[index];
  const twoColumn = choiceCount >= 4;
  const cardWidth = twoColumn ? 510 : 430;
  const cardHeight = twoColumn ? 182 : 248;
  const column = twoColumn ? index % 2 : index;
  const row = twoColumn ? Math.floor(index / 2) : 0;
  const x = twoColumn ? stageX - 270 + column * 540 : stageX - ((choiceCount - 1) * 440) / 2 + column * 440;
  const y = twoColumn ? stageY + 154 + row * 194 : stageY + 220;

  renderUiSlot(scene, x, y, cardWidth, cardHeight, "choice", {
    disabled: !affordable,
    focus: index === 0,
    interactive: Boolean(action),
    onClick: () => {
      if (affordable && action) handleSceneAction(scene, context, action);
    }
  });

  const accent = affordable ? 0x2f6b68 : 0x8f8179;
  scene.add.rectangle(x, y - cardHeight / 2 + 34, cardWidth - 30, 58, affordable ? 0x2f6b68 : 0x8f8179, affordable ? 0.16 : 0.12)
    .setStrokeStyle(2, accent, affordable ? 0.26 : 0.18);
  scene.add.rectangle(x, y - cardHeight / 2 + 62, cardWidth - 42, 8, affordable ? 0xf5c26b : 0x8f8179, affordable ? 0.55 : 0.22);
  scene.add.circle(x - cardWidth / 2 + 38, y - cardHeight / 2 + 36, 23, 0xfff1d0, 0.98)
    .setStrokeStyle(3, accent, 0.86);
  scene.add.text(x - cardWidth / 2 + 28, y - cardHeight / 2 + 17, `${index + 1}`, textStyle(25, "#1e2a3e", true));
  scene.add.text(x - cardWidth / 2 + 74, y - cardHeight / 2 + 19, choice.displayNameKo, textStyle(23, affordable ? "#1e2a3e" : "#7d6f69", true))
    .setWordWrapWidth(cardWidth - 108);

  scene.add.rectangle(x, y + (twoColumn ? -6 : -10), cardWidth - 58, twoColumn ? 44 : 66, 0xfffbef, affordable ? 0.56 : 0.34)
    .setStrokeStyle(1, 0xc6a65e, affordable ? 0.18 : 0.1);
  scene.add.text(x - cardWidth / 2 + 34, y + (twoColumn ? -26 : -36), choice.descriptionKo, textStyle(twoColumn ? 15 : 17, affordable ? "#5f4938" : "#8f8179"))
    .setWordWrapWidth(cardWidth - 68);
  scene.add.rectangle(x, y + cardHeight / 2 - 60, cardWidth - 56, 64, 0xfff1d0, affordable ? 0.76 : 0.42)
    .setStrokeStyle(2, accent, affordable ? 0.38 : 0.18);
  scene.add.rectangle(x - cardWidth / 2 + 88, y + cardHeight / 2 - 68, 92, 28, 0xfffbef, affordable ? 0.72 : 0.36)
    .setStrokeStyle(2, accent, affordable ? 0.28 : 0.16);
  scene.add.rectangle(x - cardWidth / 2 + 88, y + cardHeight / 2 - 36, 92, 28, 0xfffbef, affordable ? 0.72 : 0.36)
    .setStrokeStyle(2, accent, affordable ? 0.28 : 0.16);
  scene.add.text(x - cardWidth / 2 + 48, y + cardHeight / 2 - 80, "비용", textStyle(15, affordable ? "#805845" : "#8f8179", true));
  scene.add.text(x - cardWidth / 2 + 146, y + cardHeight / 2 - 80, costLabel(choice), textStyle(17, affordable ? "#805845" : "#8f8179", true))
    .setWordWrapWidth(cardWidth - 286);
  scene.add.text(x - cardWidth / 2 + 48, y + cardHeight / 2 - 48, "결과", textStyle(15, affordable ? "#2f6b68" : "#8f8179", true));
  scene.add.text(x - cardWidth / 2 + 146, y + cardHeight / 2 - 48, rewardLabel(context, choice.rewards ?? [], twoColumn), textStyle(twoColumn ? 15 : 16, affordable ? "#1e2a3e" : "#8f8179", true))
    .setWordWrapWidth(cardWidth - 286);
  scene.add.rectangle(x + cardWidth / 2 - 92, y + cardHeight / 2 - 68, 86, 48, affordable ? 0xfffbef : 0xf1e4d4, affordable ? 0.72 : 0.42)
    .setStrokeStyle(2, accent, affordable ? 0.28 : 0.16);
  scene.add.text(x + cardWidth / 2 - 122, y + cardHeight / 2 - 82, affordable ? "선택" : "잠김", textStyle(17, affordable ? "#2f6b68" : "#8f8179", true))
    .setWordWrapWidth(74)
    .setAlign("center");

  if (!affordable) {
    scene.add.text(x + cardWidth / 2 - 112, y + cardHeight / 2 - 45, "조건 부족", textStyle(15, "#8f8179", true));
  }

  scene.add.triangle(x + cardWidth / 2 - 42, y - cardHeight / 2 + 42, 0, 0, 42, 0, 42, 42, 0xf7dfae, affordable ? 0.8 : 0.44);
}

function costLabel(choice: EventChoice): string {
  const costs = (choice.cost ?? []).map((effect) => {
    const amount = effect.value.amount ?? 0;
    if (effect.op === "spend_currency") return `골드 -${amount}`;
    if (effect.op === "spend_hp") return `체력 -${amount}`;
    return effect.op;
  });
  return costs.length > 0 ? costs.join(", ") : "무료";
}

function rewardLabel(context: BootContext, rewards: RewardEntry[], compact = false): string {
  if (rewards.length === 0) return "효과";
  if (compact || rewards.length > 2) {
    return compactRewardLabel(rewards);
  }
  return rewards.map((reward) => {
    const name = context.dataBundle.cards.find((item) => item.id === reward.contentId)?.displayNameKo
      ?? context.dataBundle.runes.find((item) => item.id === reward.contentId)?.displayNameKo
      ?? context.dataBundle.relics.find((item) => item.id === reward.contentId)?.displayNameKo
      ?? context.dataBundle.arcanas.find((item) => item.id === reward.contentId)?.displayNameKo;
    if (reward.type === "currency") return `골드 +${reward.amount ?? 0}`;
    if (reward.type === "heal") return `회복 +${reward.amount ?? 0}`;
    return `${rewardTypeLabel(reward.type)} ${name ?? reward.contentId ?? ""}`.trim();
  }).join(", ");
}

function compactRewardLabel(rewards: RewardEntry[]): string {
  const counts = new Map<RewardEntry["type"], number>();
  let currency = 0;
  let heal = 0;
  rewards.forEach((reward) => {
    if (reward.type === "currency") {
      currency += reward.amount ?? 0;
    } else if (reward.type === "heal") {
      heal += reward.amount ?? 0;
    } else {
      counts.set(reward.type, (counts.get(reward.type) ?? 0) + 1);
    }
  });

  const parts: string[] = [];
  (["card", "rune", "relic", "arcana", "unlock"] as const).forEach((type) => {
    const count = counts.get(type);
    if (!count) return;
    const label = rewardTypeLabel(type);
    parts.push(count > 1 ? `${label} ${count}` : label);
  });
  if (heal > 0) parts.push(`회복 +${heal}`);
  if (currency > 0) parts.push(`골드 +${currency}`);
  return parts.length > 0 ? parts.join(" / ") : "효과";
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
