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
const UI_CONTROL_SLICE = 28;

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

export function renderPaperPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  options: { alpha?: number; tint?: number; fillFallback?: number; strokeFallback?: number; depth?: number } = {}
): Phaser.GameObjects.GameObject {
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
    return panel;
  }

  const fallback = scene.add.rectangle(x, y, width, height, options.fillFallback ?? 0xfff8e8, options.alpha ?? 0.94);
  fallback.setStrokeStyle(4, options.strokeFallback ?? 0xc6a65e, 0.95);
  if (options.depth !== undefined) {
    fallback.setDepth(options.depth);
  }
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
  if (scene.textures.exists(key)) {
    return scene.add.nineslice(
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
  }

  const fallback = scene.add.rectangle(x, y, width, height, options.fillFallback ?? 0xfff8e8, options.alpha ?? 0.96);
  fallback.setStrokeStyle(4, options.strokeFallback ?? 0xc6a65e, 0.95);
  return fallback;
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
      .setAlpha(isSceneSpecific ? 0.7 : 0.84);
    scene.add.rectangle(width / 2, height / 2, width, height, 0xfff4df, isSceneSpecific ? 0.34 : 0.28);
    return;
  }

  scene.add.rectangle(width / 2, height / 2, width, height, 0xf8efd8);
}
