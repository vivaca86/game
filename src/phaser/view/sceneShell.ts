import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";

interface SceneShellOptions {
  title: string;
  subtitle: string;
  focusLabel: string;
  showHand?: boolean;
  showRoute?: boolean;
  chrome?: "standard" | "immersive";
  showImmersiveInfo?: boolean;
  backgroundKey?: string;
  onCardClick?: (index: number) => void;
}

const UI_PANEL_KEY = "ui_panel_paper_9slice";
const UI_PANEL_SLICE = 48;
const UI_BUTTON_PRIMARY_KEY = "ui_button_primary_9slice";
const UI_BUTTON_SECONDARY_KEY = "ui_button_secondary_9slice";
const UI_SLOT_REWARD_KEY = "ui_slot_reward_9slice";
const UI_SLOT_CHOICE_KEY = "ui_slot_choice_9slice";
const UI_TOOLTIP_KEY = "ui_tooltip_paper_9slice";
const UI_RASTER_DOWN_STAMP_KEY = "ui_down_pressed_stamp_concept";
const UI_RASTER_DISABLED_LOCK_KEY = "ui_disabled_lock_stamp_concept";
const UI_CONTROL_SLICE = 28;
const PAPER_SHADOW = 0x111827;
const PAPER_EDGE = 0x4b2e12;
const PAPER_BRASS = 0xc6a65e;
const PAPER_GOLD = 0xf5c26b;
const PAPER_TEAL = 0x2f6b68;
const PAPER_CORAL = 0xa5483f;

type UiSlotVariant = "reward" | "choice";

interface ActionButtonOptions {
  width?: number;
  height?: number;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  focus?: boolean;
  fontSize?: number;
}

interface UiSlotOptions {
  disabled?: boolean;
  focus?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

interface UiSlotResult {
  surface: Phaser.GameObjects.GameObject;
  overlay: Phaser.GameObjects.Rectangle;
  hitTarget?: Phaser.GameObjects.Rectangle;
}

interface PressFeedbackOptions {
  normalFill?: number;
  normalAlpha?: number;
  hoverFill?: number;
  hoverAlpha?: number;
  downFill?: number;
  downAlpha?: number;
  normalStrokeColor?: number;
  normalStrokeAlpha?: number;
  normalStrokeWidth?: number;
  hoverStrokeColor?: number;
  hoverStrokeAlpha?: number;
  hoverStrokeWidth?: number;
  downStrokeColor?: number;
  downStrokeAlpha?: number;
  downStrokeWidth?: number;
}

interface RasterHoverHitTargetOptions {
  depth?: number;
  hoverDepth?: number;
  downDepth?: number;
  hoverBlendMode?: Phaser.BlendModes;
  downBlendMode?: Phaser.BlendModes;
  useHandCursor?: boolean;
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
  idleAlpha?: number;
}

interface RasterDisabledHitTargetOptions {
  depth?: number;
  disabledDepth?: number;
  disabledKey?: string;
  disabledX?: number;
  disabledY?: number;
  disabledWidth?: number;
  disabledHeight?: number;
  disabledAlpha?: number;
}

export function renderSceneShell(
  scene: Phaser.Scene,
  context: BootContext,
  options: SceneShellOptions
): void {
  const { width, height } = scene.scale;
  const settings = context.save.settings;
  const highContrast = settings.displayMode === "high_contrast";
  const textScale = settings.largeText ? 1.12 : 1;
  scene.sound.volume = settings.volumeMaster;
  scene.cameras.main.setBackgroundColor("#f8efd8");

  renderSceneBackdrop(scene, context, options.backgroundKey);

  if (options.chrome !== "immersive") {
    scene.add.rectangle(width / 2, 80, width, 160, highContrast ? 0x111827 : 0x32415a, highContrast ? 1 : 0.96);
    scene.add.text(72, 42, options.title, {
      fontFamily: "Arial, sans-serif",
      fontSize: `${Math.round(44 * textScale)}px`,
      color: "#fff5d7",
      fontStyle: "bold"
    });
    scene.add.text(74, 101, options.subtitle, {
      fontFamily: "Arial, sans-serif",
      fontSize: `${Math.round(22 * textScale)}px`,
      color: highContrast ? "#ffe08a" : "#f5c26b"
    });
  }

  const stage = context.dataBundle.stages.find((item) => item.id === context.run.stageId)
    ?? context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];
  const character = context.dataBundle.characters.find((item) => item.id === context.run.characterId)
    ?? context.dataBundle.characters[0];
  const validationText = context.validation.ok ? "데이터 정상" : "데이터 오류";

  if (options.chrome === "immersive") {
    if (options.showImmersiveInfo ?? true) {
      renderImmersiveSceneChrome(scene, context, options, textScale, highContrast);
    }
    if (options.showHand) {
      renderCharacterSprite(scene, character);
      renderCardHand(scene, context, options.onCardClick);
    }
    if (options.showRoute ?? false) {
      renderRoute(scene, context);
    }
    return;
  }

  addInfoPill(scene, 1510, 45, validationText, context.validation.ok ? 0x1f8a70 : 0xb94141);
  addInfoPill(scene, 1510, 96, manifestStatusLabel(context.manifestStatus), 0x8d6a2a);

  renderPaperPanel(scene, 360, 338, 600, 330, { alpha: 0.94 });
  scene.add.text(95, 222, options.focusLabel, textStyle(Math.round(32 * textScale), highContrast ? "#111827" : "#32415a", true));
  scene.add.text(95, 279, stage?.displayNameKo ?? "스테이지 없음", textStyle(Math.round(42 * textScale), "#1e2a3e", true));
  scene.add.text(95, 343, character?.displayNameKo ?? "캐릭터 없음", textStyle(Math.round(28 * textScale), highContrast ? "#4b2e12" : "#805845"));
  scene.add.text(95, 399, `상태 ${phaseLabel(context.run.phase)} / 방 ${context.run.roomIndex + 1}`, textStyle(Math.round(24 * textScale), highContrast ? "#4b2e12" : "#805845"));
  scene.add.text(
    95,
    445,
    `체력 ${context.run.player.hp}/${context.run.player.maxHp}  기운 ${context.run.player.energy}/${context.run.player.maxEnergy}  방어 ${context.run.player.block}  골드 ${context.run.player.gold}`,
    textStyle(Math.round(24 * textScale), highContrast ? "#4b2e12" : "#805845")
  );
  renderCharacterPortrait(scene, character);

  if (options.showHand) {
    renderCharacterSprite(scene, character);
  }

  if (options.showHand) {
    renderCardHand(scene, context, options.onCardClick);
  }
  if (options.showRoute ?? true) {
    renderRoute(scene, context);
  }
}

function renderImmersiveSceneChrome(
  scene: Phaser.Scene,
  context: BootContext,
  options: SceneShellOptions,
  textScale: number,
  highContrast: boolean
): void {
  const stage = context.dataBundle.stages.find((item) => item.id === context.run.stageId)
    ?? context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];

  renderPaperPanel(scene, 292, 82, 470, 116, { alpha: 0.92 });
  scene.add.text(82, 43, options.title, textStyle(Math.round(36 * textScale), "#1e2a3e", true));
  scene.add.text(84, 92, options.subtitle, textStyle(Math.round(19 * textScale), highContrast ? "#4b2e12" : "#805845"))
    .setWordWrapWidth(380);

  renderPaperPanel(scene, 292, 984, 470, 92, { alpha: 0.88 });
  scene.add.text(86, 957, stage?.displayNameKo ?? "스테이지 없음", textStyle(Math.round(20 * textScale), "#1e2a3e", true))
    .setWordWrapWidth(400);
  scene.add.text(
    86,
    992,
    `체력 ${context.run.player.hp}/${context.run.player.maxHp}  골드 ${context.run.player.gold}  방 ${context.run.roomIndex + 1}`,
    textStyle(Math.round(18 * textScale), highContrast ? "#4b2e12" : "#805845", true)
  ).setWordWrapWidth(400);
}

export function renderCardHand(
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

  renderCardHandShelf(scene, cards.length);

  cards.forEach((card, index) => {
    const x = 430 + index * 230;
    const y = 790;
    const cardWidth = 190;
    const cardHeight = 278;
    renderCardFace(scene, x, y, cardWidth, cardHeight, card);

    const hoverFrame = scene.add.rectangle(x, y, cardWidth + 10, cardHeight + 10, 0xffffff, 0);
    const hitTarget = scene.add.rectangle(x, y, cardWidth, cardHeight, 0xffffff, 0.001);
    if (onCardClick) {
      hitTarget.setInteractive({ useHandCursor: true });
      attachPressFeedback(hitTarget, hoverFrame, {
        normalFill: 0xffffff,
        normalAlpha: 0,
        hoverFill: 0xffffff,
        hoverAlpha: 0,
        downFill: 0xf5c26b,
        downAlpha: 0.12,
        normalStrokeColor: 0xf5c26b,
        normalStrokeAlpha: 0,
        normalStrokeWidth: 0,
        hoverStrokeColor: 0xf5c26b,
        hoverStrokeAlpha: 0.96,
        hoverStrokeWidth: 5,
        downStrokeColor: 0xfff3b0,
        downStrokeAlpha: 1,
        downStrokeWidth: 6
      });
      hitTarget.on("pointerdown", () => onCardClick(index));
    }
    scene.add.text(x + 56, y - 126, `${index + 1}`, textStyle(19, "#805845", true));
    scene.add.text(x - 77, y - 126, `${card.cost}`, textStyle(34, "#1e2a3e", true));
    scene.add.text(x - 72, y + 4, card.displayNameKo, textStyle(20, "#1e2a3e", true)).setWordWrapWidth(144);
    scene.add.text(x - 72, y + 54, card.descriptionKo, textStyle(13, "#6d5a48")).setWordWrapWidth(146);
  });
}

function renderCardFace(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  card: BootContext["dataBundle"]["cards"][number]
): void {
  const frameKey = card.assetKeys.frame;
  const artKey = card.assetKeys.illustration;
  const iconKey = card.assetKeys.typeIcon;

  scene.add.rectangle(x + 10, y + 14, width, height, PAPER_SHADOW, 0.24).setStrokeStyle(0);

  if (scene.textures.exists(frameKey)) {
    scene.add.image(x, y, frameKey).setDisplaySize(width, height);
  } else {
    const fallback = scene.add.rectangle(x, y, width, height, 0xfffbef, 0.98);
    fallback.setStrokeStyle(4, card.type === "attack" ? 0xce5869 : card.type === "defense" ? 0x5d8d86 : 0x677ab8);
  }

  if (scene.textures.exists(artKey)) {
    scene.add.image(x, y - 50, artKey).setDisplaySize(width - 48, 96);
  }

  if (scene.textures.exists(iconKey)) {
    scene.add.image(x + 58, y - 102, iconKey).setDisplaySize(30, 30);
  }

  addTinyBrassPin(scene, x - width / 2 + 24, y - height / 2 + 24, 0.78);
  addTinyBrassPin(scene, x + width / 2 - 24, y - height / 2 + 24, 0.72);
  scene.add.rectangle(x, y + height / 2 - 18, width - 44, 5, PAPER_GOLD, 0.52);
}

export function renderActionButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  options: ActionButtonOptions = {}
): void {
  const width = options.width ?? 290;
  const height = options.height ?? 58;
  const variant = options.variant ?? "primary";
  const disabled = options.disabled ?? false;
  const key = variant === "primary" ? UI_BUTTON_PRIMARY_KEY : UI_BUTTON_SECONDARY_KEY;
  const labelColor = disabled ? "#8f8179" : variant === "primary" ? "#fff5d7" : "#1e2a3e";

  const surface = renderUiSurface(scene, key, x, y, width, height, UI_CONTROL_SLICE, {
    alpha: disabled ? 0.68 : 0.98,
    fillFallback: variant === "primary" ? 0x32415a : 0xfff8e8,
    strokeFallback: variant === "primary" ? 0xf5c26b : 0xb98c34
  });
  addButtonCapDecor(scene, x, y, width, height, variant, disabled);
  const overlay = scene.add.rectangle(x, y, width, height, 0xffffff, disabled ? 0.2 : 0);
  overlay.setStrokeStyle(options.focus ? 5 : 2, options.focus ? 0xfff3b0 : 0xf5c26b, options.focus ? 0.95 : 0.22);

  if (!disabled) {
    const hitTarget = scene.add.rectangle(x, y, width, height, 0xffffff, 0.001);
    hitTarget.setInteractive({ useHandCursor: true });
    attachPressFeedback(hitTarget, overlay, {
      normalFill: 0xffffff,
      normalAlpha: 0,
      hoverFill: variant === "primary" ? 0xfff3b0 : 0xf5c26b,
      hoverAlpha: variant === "primary" ? 0.2 : 0.18,
      downFill: variant === "primary" ? 0x1e2a3e : 0x32415a,
      downAlpha: variant === "primary" ? 0.24 : 0.18,
      normalStrokeColor: options.focus ? 0xfff3b0 : 0xf5c26b,
      normalStrokeAlpha: options.focus ? 0.95 : 0.22,
      normalStrokeWidth: options.focus ? 5 : 2,
      hoverStrokeColor: 0xfff3b0,
      hoverStrokeAlpha: 1,
      hoverStrokeWidth: options.focus ? 6 : 4,
      downStrokeColor: 0x1e2a3e,
      downStrokeAlpha: 0.9,
      downStrokeWidth: options.focus ? 6 : 4
    });
    hitTarget.on("pointerdown", onClick);
    hitTarget.setDepth(22);
  }

  scene.add.text(x, y, label, textStyle(options.fontSize ?? 22, labelColor, true))
    .setOrigin(0.5)
    .setWordWrapWidth(width - 38)
    .setDepth(23);
  overlay.setDepth(21);
}

export function attachPressFeedback(
  inputTarget: Phaser.GameObjects.Rectangle,
  visualTarget: Phaser.GameObjects.Rectangle = inputTarget,
  options: PressFeedbackOptions = {}
): void {
  const normalFill = options.normalFill ?? 0x32415a;
  const normalAlpha = options.normalAlpha ?? 0.94;
  const hoverFill = options.hoverFill ?? 0x405476;
  const hoverAlpha = options.hoverAlpha ?? 0.98;
  const downFill = options.downFill ?? 0xf5c26b;
  const downAlpha = options.downAlpha ?? 0.92;
  const normalStrokeColor = options.normalStrokeColor ?? 0xf5c26b;
  const normalStrokeAlpha = options.normalStrokeAlpha ?? 0.95;
  const normalStrokeWidth = options.normalStrokeWidth ?? 3;
  const hoverStrokeColor = options.hoverStrokeColor ?? 0xfff3b0;
  const hoverStrokeAlpha = options.hoverStrokeAlpha ?? 1;
  const hoverStrokeWidth = options.hoverStrokeWidth ?? normalStrokeWidth + 1;
  const downStrokeColor = options.downStrokeColor ?? 0x32415a;
  const downStrokeAlpha = options.downStrokeAlpha ?? 0.95;
  const downStrokeWidth = options.downStrokeWidth ?? hoverStrokeWidth;

  const applyState = (fill: number, alpha: number, strokeColor: number, strokeAlpha: number, strokeWidth: number) => {
    visualTarget.setFillStyle(fill, alpha);
    visualTarget.setStrokeStyle(strokeWidth, strokeColor, strokeAlpha);
  };

  inputTarget.on("pointerover", () => applyState(hoverFill, hoverAlpha, hoverStrokeColor, hoverStrokeAlpha, hoverStrokeWidth));
  inputTarget.on("pointerout", () => applyState(normalFill, normalAlpha, normalStrokeColor, normalStrokeAlpha, normalStrokeWidth));
  inputTarget.on("pointerdown", () => applyState(downFill, downAlpha, downStrokeColor, downStrokeAlpha, downStrokeWidth));
  inputTarget.on("pointerup", () => applyState(hoverFill, hoverAlpha, hoverStrokeColor, hoverStrokeAlpha, hoverStrokeWidth));
}

export function renderTransparentHitTarget(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  onClick: () => void,
  options: { depth?: number; useHandCursor?: boolean } = {}
): Phaser.GameObjects.Rectangle {
  const hitTarget = scene.add.rectangle(x, y, width, height, 0xffffff, 0.001).setDepth(options.depth ?? 21);
  hitTarget.setInteractive({ useHandCursor: options.useHandCursor ?? true });
  hitTarget.on("pointerdown", onClick);
  return hitTarget;
}

export function renderRasterDisabledHitTarget(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  options: RasterDisabledHitTargetOptions = {}
): Phaser.GameObjects.Rectangle {
  const disabledKey = options.disabledKey ?? UI_RASTER_DISABLED_LOCK_KEY;
  if (scene.textures.exists(disabledKey)) {
    scene.add.image(options.disabledX ?? x, options.disabledY ?? y, disabledKey)
      .setDisplaySize(options.disabledWidth ?? 112, options.disabledHeight ?? 112)
      .setAlpha(options.disabledAlpha ?? 0.9)
      .setDepth(options.disabledDepth ?? ((options.depth ?? 21) + 1));
  }

  const hitTarget = scene.add.rectangle(x, y, width, height, 0xffffff, 0.001).setDepth(options.depth ?? 21);
  hitTarget.setInteractive({ useHandCursor: false });
  return hitTarget;
}

export function renderRasterHoverHitTarget(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  onClick: () => void,
  options: RasterHoverHitTargetOptions = {}
): Phaser.GameObjects.Rectangle {
  const hoverImage = options.hoverKey && scene.textures.exists(options.hoverKey)
    ? scene.add.image(options.hoverX ?? x, options.hoverY ?? y, options.hoverKey)
      .setDisplaySize(options.hoverWidth ?? width, options.hoverHeight ?? height)
      .setAlpha(options.idleAlpha ?? 0)
      .setDepth(options.hoverDepth ?? ((options.depth ?? 21) + 1))
    : undefined;
  if (hoverImage && options.hoverBlendMode !== undefined) {
    hoverImage.setBlendMode(options.hoverBlendMode);
  }
  const downKey = options.downKey ?? UI_RASTER_DOWN_STAMP_KEY;
  const downImage = scene.textures.exists(downKey)
    ? scene.add.image(options.downX ?? options.hoverX ?? x, options.downY ?? options.hoverY ?? y, downKey)
      .setDisplaySize(options.downWidth ?? options.hoverWidth ?? width, options.downHeight ?? options.hoverHeight ?? height)
      .setAlpha(options.idleAlpha ?? 0)
      .setDepth(options.downDepth ?? options.hoverDepth ?? ((options.depth ?? 21) + 1))
    : undefined;
  if (downImage && options.downBlendMode !== undefined) {
    downImage.setBlendMode(options.downBlendMode);
  }
  const hitTarget = scene.add.rectangle(x, y, width, height, 0xffffff, 0.001).setDepth(options.depth ?? 21);
  hitTarget.setInteractive({ useHandCursor: options.useHandCursor ?? true });
  const idleAlpha = options.idleAlpha ?? 0;
  const showHover = () => {
    downImage?.setAlpha(idleAlpha);
    hoverImage?.setAlpha(options.hoverAlpha ?? 1);
  };
  const showIdle = () => {
    hoverImage?.setAlpha(idleAlpha);
    downImage?.setAlpha(idleAlpha);
  };
  const showDown = () => {
    hoverImage?.setAlpha(idleAlpha);
    downImage?.setAlpha(options.downAlpha ?? 0.86);
    if (!downImage) {
      hoverImage?.setAlpha(options.downAlpha ?? 0.82);
    }
  };
  hitTarget.on("pointerover", showHover);
  hitTarget.on("pointerout", showIdle);
  hitTarget.on("pointerdown", () => {
    showDown();
  });
  hitTarget.on("pointerup", () => {
    showHover();
    onClick();
  });
  hitTarget.on("pointerupoutside", showIdle);
  return hitTarget;
}

export function renderPaperPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  options: { alpha?: number; tint?: number; fillFallback?: number; strokeFallback?: number; depth?: number } = {}
): Phaser.GameObjects.GameObject {
  addPaperDropShadow(scene, x, y, width, height, options.depth);
  addPaperBacking(scene, x, y, width, height, options);

  if (scene.textures.exists(UI_PANEL_KEY)) {
    const panel = scene.add.nineslice(
      x,
      y,
      UI_PANEL_KEY,
      undefined,
      width,
      height,
      UI_PANEL_SLICE,
      UI_PANEL_SLICE,
      UI_PANEL_SLICE,
      UI_PANEL_SLICE
    );
    panel.setAlpha(options.alpha ?? 0.96);
    if (options.tint) {
      panel.setTint(options.tint);
    }
    if (options.depth !== undefined) {
      panel.setDepth(options.depth);
    }
    addPanelEmbellishments(scene, x, y, width, height, options.depth);
    return panel;
  }

  const fallback = scene.add.rectangle(x, y, width, height, options.fillFallback ?? 0xfff8e8, options.alpha ?? 0.94);
  fallback.setStrokeStyle(4, options.strokeFallback ?? 0xc6a65e, 0.95);
  if (options.depth !== undefined) {
    fallback.setDepth(options.depth);
  }
  addPanelEmbellishments(scene, x, y, width, height, options.depth);
  return fallback;
}

export function renderUiSlot(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  variant: UiSlotVariant,
  options: UiSlotOptions = {}
): UiSlotResult {
  const disabled = options.disabled ?? false;
  const key = variant === "reward" ? UI_SLOT_REWARD_KEY : UI_SLOT_CHOICE_KEY;
  const surface = renderUiSurface(scene, key, x, y, width, height, UI_CONTROL_SLICE, {
    alpha: disabled ? 0.7 : 0.98,
    fillFallback: variant === "reward" ? 0xfff6df : 0xfffbef,
    strokeFallback: disabled ? 0x8f8179 : 0xb98c34
  });
  addSlotEmbellishments(scene, x, y, width, height, variant, disabled);
  const overlay = scene.add.rectangle(x, y, width, height, disabled ? 0x8f8179 : 0xffffff, disabled ? 0.18 : 0);
  overlay.setStrokeStyle(options.focus ? 5 : 2, options.focus ? 0xfff3b0 : 0xc6a65e, options.focus ? 0.95 : 0.22);

  const result: UiSlotResult = { surface, overlay };
  if (options.interactive || options.onClick) {
    const hitTarget = scene.add.rectangle(x, y, width, height, 0xffffff, 0.001);
    hitTarget.setInteractive({ useHandCursor: !disabled });
    if (!disabled) {
      attachPressFeedback(hitTarget, overlay, {
        normalFill: 0xffffff,
        normalAlpha: 0,
        hoverFill: 0xfff3b0,
        hoverAlpha: 0.2,
        downFill: 0xf5c26b,
        downAlpha: 0.24,
        normalStrokeColor: options.focus ? 0xfff3b0 : 0xc6a65e,
        normalStrokeAlpha: options.focus ? 0.95 : 0.22,
        normalStrokeWidth: options.focus ? 5 : 2,
        hoverStrokeColor: 0xfff3b0,
        hoverStrokeAlpha: 1,
        hoverStrokeWidth: options.focus ? 6 : 4,
        downStrokeColor: 0x32415a,
        downStrokeAlpha: 0.92,
        downStrokeWidth: options.focus ? 6 : 4
      });
      if (options.onClick) {
        hitTarget.on("pointerdown", options.onClick);
      }
    }
    hitTarget.setDepth(20);
    result.hitTarget = hitTarget;
  }

  return result;
}

export function renderTooltip(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  text: string
): void {
  const surface = renderUiSurface(scene, UI_TOOLTIP_KEY, x, y, width, height, UI_CONTROL_SLICE, {
    alpha: 0.97,
    fillFallback: 0xfff8e8,
    strokeFallback: 0x8d6a2a
  });
  addTooltipNotch(scene, x, y, width, height);
  scene.add.text(x - width / 2 + 28, y - height / 2 + 20, text, textStyle(19, "#4b2e12", true))
    .setWordWrapWidth(width - 56)
    .setDepth(23);
}

export function renderRoute(scene: Phaser.Scene, context: BootContext): void {
  const stage = context.dataBundle.stages.find((item) => item.id === context.run.stageId)
    ?? context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];
  if (!stage) {
    return;
  }

  if (stage.assetKeys.mapIcon && scene.textures.exists(stage.assetKeys.mapIcon)) {
    scene.add.image(1012, 236, stage.assetKeys.mapIcon).setDisplaySize(64, 64);
  }
  scene.add.text(1060, 218, "경로", textStyle(30, "#32415a", true));
  stage.route.slice(0, 5).forEach((room, index) => {
    const x = 1060 + index * 160;
    const fill = room.type === "boss" ? 0xce5869 : room.type === "event" ? 0x6c8fd6 : 0x4f9b75;
    const node = scene.add.circle(x, 320, 54, fill, 0.9);
    node.setStrokeStyle(
      index === context.run.roomIndex ? 8 : 5,
      index === context.run.roomIndex ? 0xf5c26b : 0xffffff,
      0.95
    );
    scene.add.text(x - 48, 390, roomTypeLabel(room.type), textStyle(20, "#32415a", true)).setWordWrapWidth(100, true);
  });
}

export function textStyle(size: number, color: string, bold = false): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: "Arial, sans-serif",
    fontSize: `${size}px`,
    color,
    fontStyle: bold ? "bold" : "normal"
  };
}

function addInfoPill(scene: Phaser.Scene, x: number, y: number, label: string, color: number): void {
  scene.add.rectangle(x + 150, y + 20, 300, 40, color, 0.9).setStrokeStyle(2, 0xffffff, 0.5);
  scene.add.text(x + 16, y + 8, label, textStyle(20, "#fff8e6", true));
}

function renderUiSurface(
  scene: Phaser.Scene,
  key: string,
  x: number,
  y: number,
  width: number,
  height: number,
  slice: number,
  options: { alpha?: number; fillFallback?: number; strokeFallback?: number } = {}
): Phaser.GameObjects.GameObject {
  scene.add.rectangle(x + 7, y + 8, width, height, PAPER_SHADOW, 0.2);

  if (scene.textures.exists(key)) {
    const surface = scene.add.nineslice(
      x,
      y,
      key,
      undefined,
      width,
      height,
      slice,
      slice,
      slice,
      slice
    ).setAlpha(options.alpha ?? 0.98);
    addSurfaceStitching(scene, x, y, width, height);
    return surface;
  }

  const fallback = scene.add.rectangle(x, y, width, height, options.fillFallback ?? 0xfff8e8, options.alpha ?? 0.96);
  fallback.setStrokeStyle(4, options.strokeFallback ?? 0xc6a65e, 0.95);
  addSurfaceStitching(scene, x, y, width, height);
  return fallback;
}

function renderCardHandShelf(scene: Phaser.Scene, cardCount: number): void {
  if (cardCount === 0) {
    return;
  }

  scene.add.rectangle(960, 930, 1300, 86, 0x2d2530, 0.82).setStrokeStyle(3, PAPER_BRASS, 0.34);
  scene.add.rectangle(960, 884, 1200, 16, PAPER_CORAL, 0.62).setStrokeStyle(2, PAPER_GOLD, 0.46);
  scene.add.rectangle(960, 970, 1260, 20, PAPER_EDGE, 0.74);
  scene.add.rectangle(272, 828, 112, 182, 0x1e2a3e, 0.76).setStrokeStyle(4, PAPER_BRASS, 0.5);
  scene.add.rectangle(1648, 828, 112, 182, 0x4b4050, 0.62).setStrokeStyle(4, PAPER_BRASS, 0.44);
  addTinyBrassPin(scene, 220, 746, 0.78);
  addTinyBrassPin(scene, 324, 746, 0.72);
  addTinyBrassPin(scene, 1596, 746, 0.72);
  addTinyBrassPin(scene, 1700, 746, 0.72);
}

function addPaperDropShadow(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  depth?: number
): void {
  const shadow = scene.add.rectangle(x + 10, y + 13, width, height, PAPER_SHADOW, 0.2);
  if (depth !== undefined) {
    shadow.setDepth(depth - 2);
  }
}

function addPaperBacking(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  options: { alpha?: number; tint?: number; fillFallback?: number; depth?: number }
): void {
  const fill = options.fillFallback ?? options.tint ?? 0xfff4df;
  const backing = scene.add.rectangle(x, y, Math.max(12, width - 28), Math.max(12, height - 28), fill, Math.max(0.9, options.alpha ?? 0.96));
  if (options.depth !== undefined) {
    backing.setDepth(options.depth - 1);
  }
}

function addPanelEmbellishments(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  depth?: number
): void {
  const top = y - height / 2;
  const bottom = y + height / 2;
  const left = x - width / 2;
  const right = x + width / 2;
  const decorDepth = depth === undefined ? undefined : depth + 1;
  const topBand = scene.add.rectangle(x, top + 25, Math.max(90, width - 92), 10, PAPER_GOLD, 0.34);
  const bottomBand = scene.add.rectangle(x, bottom - 25, Math.max(90, width - 92), 8, PAPER_EDGE, 0.14);
  setDepth(topBand, decorDepth);
  setDepth(bottomBand, decorDepth);

  addTinyBrassPin(scene, left + 34, top + 34, 0.86, decorDepth);
  addTinyBrassPin(scene, right - 34, top + 34, 0.86, decorDepth);
  addTinyBrassPin(scene, left + 34, bottom - 34, 0.7, decorDepth);
  addTinyBrassPin(scene, right - 34, bottom - 34, 0.7, decorDepth);

  const foldA = scene.add.triangle(right - 54, top + 54, 0, 0, 48, 0, 48, 48, 0xffffff, 0.18)
    .setStrokeStyle(2, PAPER_BRASS, 0.28);
  const foldB = scene.add.triangle(left + 54, bottom - 54, 0, 48, 0, 0, 48, 48, 0x4b2e12, 0.08)
    .setStrokeStyle(2, PAPER_BRASS, 0.22);
  setDepth(foldA, decorDepth);
  setDepth(foldB, decorDepth);

  addStitchMarks(scene, x, top + 46, width - 150, true, 0.22, decorDepth);
  addStitchMarks(scene, x, bottom - 46, width - 150, true, 0.18, decorDepth);
}

function addButtonCapDecor(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  variant: "primary" | "secondary",
  disabled: boolean
): void {
  const ribbonColor = disabled ? 0x8f8179 : variant === "primary" ? PAPER_TEAL : PAPER_GOLD;
  scene.add.rectangle(x, y - height / 2 + 13, width - 48, 5, 0xffffff, variant === "primary" ? 0.22 : 0.34);
  scene.add.rectangle(x, y + height / 2 - 11, width - 54, 5, PAPER_EDGE, 0.18);
  scene.add.triangle(x - width / 2 + 20, y, 0, -14, 20, 0, 0, 14, ribbonColor, 0.8)
    .setStrokeStyle(1, PAPER_BRASS, 0.46);
  scene.add.triangle(x + width / 2 - 20, y, 20, -14, 0, 0, 20, 14, ribbonColor, 0.8)
    .setStrokeStyle(1, PAPER_BRASS, 0.46);
}

function addSlotEmbellishments(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  variant: UiSlotVariant,
  disabled: boolean
): void {
  const accent = disabled ? 0x8f8179 : variant === "reward" ? PAPER_TEAL : PAPER_CORAL;
  const top = y - height / 2;
  const left = x - width / 2;
  const right = x + width / 2;
  scene.add.rectangle(x, top + 26, Math.max(80, width - 76), 8, accent, 0.42).setStrokeStyle(1, PAPER_BRASS, 0.32);
  scene.add.circle(left + 38, y, variant === "reward" ? 20 : 14, accent, 0.38).setStrokeStyle(2, PAPER_BRASS, 0.44);
  scene.add.triangle(right - 36, top + 36, 0, 0, 34, 0, 34, 34, 0xffffff, 0.16);
  addTinyBrassPin(scene, left + 24, top + 24, 0.62);
  addTinyBrassPin(scene, right - 24, top + 24, 0.56);
}

function addTooltipNotch(scene: Phaser.Scene, x: number, y: number, width: number, height: number): void {
  scene.add.triangle(x - width / 2 + 54, y + height / 2 - 1, 0, 0, 34, 0, 17, 18, 0xfff2d0, 0.92)
    .setStrokeStyle(2, PAPER_BRASS, 0.5);
  addTinyBrassPin(scene, x - width / 2 + 24, y - height / 2 + 24, 0.72);
  addTinyBrassPin(scene, x + width / 2 - 24, y - height / 2 + 24, 0.72);
}

function addSurfaceStitching(scene: Phaser.Scene, x: number, y: number, width: number, height: number): void {
  const top = y - height / 2 + 18;
  const bottom = y + height / 2 - 18;
  addStitchMarks(scene, x, top, width - 52, true, 0.2);
  addStitchMarks(scene, x, bottom, width - 52, true, 0.14);
}

function addStitchMarks(
  scene: Phaser.Scene,
  x: number,
  y: number,
  length: number,
  horizontal: boolean,
  alpha: number,
  depth?: number
): void {
  const count = Math.max(4, Math.floor(length / 38));
  const start = -length / 2;
  for (let index = 0; index <= count; index += 1) {
    const offset = start + (length * index) / count;
    const mark = horizontal
      ? scene.add.rectangle(x + offset, y, 12, 2, PAPER_EDGE, alpha)
      : scene.add.rectangle(x, y + offset, 2, 12, PAPER_EDGE, alpha);
    setDepth(mark, depth);
  }
}

function addTinyBrassPin(
  scene: Phaser.Scene,
  x: number,
  y: number,
  alpha = 0.82,
  depth?: number
): void {
  const rim = scene.add.circle(x, y, 11, PAPER_EDGE, alpha * 0.8);
  const pin = scene.add.circle(x, y, 7, PAPER_BRASS, alpha);
  const shine = scene.add.circle(x - 2, y - 2, 2, 0xfff3b0, alpha);
  setDepth(rim, depth);
  setDepth(pin, depth === undefined ? undefined : depth + 1);
  setDepth(shine, depth === undefined ? undefined : depth + 2);
}

function setDepth(object: Phaser.GameObjects.GameObject, depth?: number): void {
  if (depth !== undefined) {
    (object as unknown as { setDepth: (value: number) => void }).setDepth(depth);
  }
}

function phaseLabel(phase: BootContext["run"]["phase"]): string {
  const labels: Record<BootContext["run"]["phase"], string> = {
    town: "마을",
    world_map: "지도",
    dungeon: "던전",
    combat: "전투",
    event: "이벤트",
    reward: "보상",
    rune_bench: "룬 작업대",
    boss: "보스",
    result: "결과"
  };
  return labels[phase] ?? phase;
}

function manifestStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    generated_manifest: "개발 에셋",
    production_candidate_manifest: "후보 에셋",
    release_catalog_adapter: "릴리즈 데이터"
  };
  return labels[status] ?? status;
}

function roomTypeLabel(type: string): string {
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

function renderCharacterPortrait(
  scene: Phaser.Scene,
  character: BootContext["dataBundle"]["characters"][number] | undefined
): void {
  const portraitKey = character?.assetKeys.portrait;
  if (!portraitKey || !scene.textures.exists(portraitKey)) {
    return;
  }

  scene.add.circle(566, 332, 74, 0xfff2d6, 0.82).setStrokeStyle(4, 0xc6a65e, 0.95);
  scene.add.image(566, 332, portraitKey).setDisplaySize(132, 132);
}

function renderCharacterSprite(
  scene: Phaser.Scene,
  character: BootContext["dataBundle"]["characters"][number] | undefined
): void {
  const spriteKey = character?.assetKeys.sprite;
  if (!spriteKey || !scene.textures.exists(spriteKey)) {
    return;
  }

  scene.add.ellipse(914, 626, 148, 28, 0x32415a, 0.16).setDepth(1);
  scene.add.sprite(914, 620, spriteKey, 0)
    .setOrigin(0.5, 1)
    .setDisplaySize(146, 146)
    .setDepth(2);
}

function renderSceneBackdrop(scene: Phaser.Scene, context: BootContext, explicitBackgroundKey?: string): void {
  const { width, height } = scene.scale;
  const stage = context.dataBundle.stages.find((item) => item.id === context.run.stageId)
    ?? context.dataBundle.stages.find((item) => item.id === context.debug.stageId)
    ?? context.dataBundle.stages[0];
  const backgroundKey = explicitBackgroundKey ?? stage?.assetKeys.backgroundSet;

  if (backgroundKey && scene.textures.exists(backgroundKey)) {
    const isSceneSpecific = Boolean(explicitBackgroundKey);
    scene.add.image(width / 2, height / 2, backgroundKey)
      .setDisplaySize(width, height)
      .setAlpha(isSceneSpecific ? 0.64 : 0.68);
    scene.add.rectangle(width / 2, height / 2, width, height, 0xfff4df, isSceneSpecific ? 0.34 : 0.32);
    scene.add.rectangle(width / 2, height / 2, width, height, 0x1e2a3e, isSceneSpecific ? 0.08 : 0.1);
    renderPaperTheaterBackdrop(scene, width, height, isSceneSpecific);
    return;
  }

  scene.add.rectangle(width / 2, height / 2, width, height, 0xf8efd8);
  renderPaperTheaterBackdrop(scene, width, height, false);
}

function renderPaperTheaterBackdrop(scene: Phaser.Scene, width: number, height: number, sceneSpecific: boolean): void {
  const sideAlpha = sceneSpecific ? 0.62 : 0.58;
  scene.add.rectangle(width / 2, height / 2, width, height, 0x142234, 0.12);
  scene.add.rectangle(72, height / 2, 144, height, 0x1e2a3e, sideAlpha);
  scene.add.rectangle(width - 72, height / 2, 144, height, 0x4d3048, sideAlpha * 0.88);
  scene.add.triangle(230, 0, 0, 0, 170, 0, 0, height, 0x25494d, 0.32);
  scene.add.triangle(width - 230, 0, 170, 0, 0, 0, 170, height, 0x5b2f40, 0.28);
  scene.add.rectangle(width / 2, 30, width - 180, 28, PAPER_EDGE, 0.42);
  scene.add.rectangle(width / 2, height - 38, width, 76, 0x1b1720, 0.64);

  const pennants = [
    { x: 210, color: 0x2f6b68, length: 146 },
    { x: 335, color: 0xf7dfae, length: 116 },
    { x: width - 335, color: 0xa5483f, length: 128 },
    { x: width - 210, color: 0x4d3a59, length: 154 }
  ];
  for (const pennant of pennants) {
    scene.add.triangle(pennant.x, 58, -34, 0, 34, 0, 0, pennant.length, pennant.color, 0.58)
      .setStrokeStyle(2, PAPER_BRASS, 0.28);
    addTinyBrassPin(scene, pennant.x, 54, 0.62);
  }
}
