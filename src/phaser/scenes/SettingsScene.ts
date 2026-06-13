import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { SettingsState } from "../../data/schema";
import type { InputAction } from "../../input/actions";
import { bindKeyboardActions } from "../../input/bindings";
import { clearStoredSave, createDefaultSettings, persistSave } from "../../save/saveCodec";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { requireBootContext, storeBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderPaperPanel, renderRasterHoverHitTarget, renderSceneShell, renderTooltip, renderUiSlot, setRasterHitTargetHoverState, textStyle, triggerRasterHitTargetDown } from "../view/sceneShell";

type SettingsMutation = (settings: SettingsState) => void;
type SettingsRasterControlId =
  | "volumeMaster"
  | "volumeMusic"
  | "volumeSfx"
  | "displayMode"
  | "largeText"
  | "reducedMotion"
  | "spaceConfirm"
  | "resetSave"
  | "resetDefaults"
  | "returnTown";

const SETTINGS_RASTER_UNDERLAY_KEY = "settings_raster_underlay_concept";
const SETTINGS_RASTER_FOCUS_ID_KEY = "settingsRasterFocusId";
const SETTINGS_RASTER_HOVER_ACTION_KEY = "ui_hover_action_seal_concept";
const SETTINGS_RASTER_HOVER_RETURN_KEY = "ui_hover_settings_return_button_concept";
const SETTINGS_RASTER_DOWN_RETURN_KEY = "ui_down_settings_return_button_concept";
const SETTINGS_RASTER_HOVER_RESET_SAVE_KEY = "ui_hover_settings_reset_save_concept";
const SETTINGS_RASTER_DOWN_RESET_SAVE_KEY = "ui_down_settings_reset_save_concept";
const SETTINGS_RASTER_HOVER_RESET_DEFAULTS_KEY = "ui_hover_settings_reset_defaults_concept";
const SETTINGS_RASTER_DOWN_RESET_DEFAULTS_KEY = "ui_down_settings_reset_defaults_concept";
const SETTINGS_RASTER_CONTROL_STATE_KEYS = {
  volumeMaster: { hover: "ui_hover_settings_volume_master_concept", down: "ui_down_settings_volume_master_concept" },
  volumeMusic: { hover: "ui_hover_settings_volume_music_concept", down: "ui_down_settings_volume_music_concept" },
  volumeSfx: { hover: "ui_hover_settings_volume_sfx_concept", down: "ui_down_settings_volume_sfx_concept" },
  displayMode: { hover: "ui_hover_settings_display_mode_concept", down: "ui_down_settings_display_mode_concept" },
  largeText: { hover: "ui_hover_settings_large_text_concept", down: "ui_down_settings_large_text_concept" },
  reducedMotion: { hover: "ui_hover_settings_reduced_motion_concept", down: "ui_down_settings_reduced_motion_concept" },
  spaceConfirm: { hover: "ui_hover_settings_space_confirm_concept", down: "ui_down_settings_space_confirm_concept" }
} as const;

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super("SettingsScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "설정",
      subtitle: "플레이 환경 조정",
      focusLabel: "현재 설정",
      chrome: "immersive",
      showImmersiveInfo: false,
      showHand: false,
      showRoute: false
    });

    const rasterControls = hasSettingsRasterUnderlay(this)
      ? renderSettingsRasterStage(this, context)
      : undefined;
    if (!rasterControls) {
      renderSettingsPanel(this, context);
    }
    const handleRasterKeyboardAction = rasterControls
      ? createSettingsRasterKeyboardHandler(this, rasterControls)
      : undefined;
    bindKeyboardActions(this, (action) => {
      if (handleRasterKeyboardAction?.(action)) {
        return;
      }
      if (action === "cancel") {
        this.scene.start("TownScene", context);
      }
    }, context.save.settings);
    renderDebugOverlay(context, "SettingsScene");
  }
}

interface SettingsRasterControls {
  controls: SettingsRasterControl[];
  returnHitTarget?: Phaser.GameObjects.Rectangle;
}

interface SettingsRasterControl {
  id: SettingsRasterControlId;
  x: number;
  y: number;
  hitTarget: Phaser.GameObjects.Rectangle;
  activate: () => void;
}

function hasSettingsRasterUnderlay(scene: Phaser.Scene): boolean {
  return scene.textures.exists(SETTINGS_RASTER_UNDERLAY_KEY);
}

function renderSettingsRasterStage(scene: Phaser.Scene, context: BootContext): SettingsRasterControls {
  scene.add.image(960, 540, SETTINGS_RASTER_UNDERLAY_KEY)
    .setDisplaySize(1920, 1080)
    .setDepth(0);

  const controls: SettingsRasterControl[] = [];
  const addControl = (
    id: SettingsRasterControlId,
    x: number,
    y: number,
    width: number,
    height: number,
    accent: number,
    onActivate: () => void,
    options?: Parameters<typeof renderSettingsRasterHitTarget>[7]
  ): Phaser.GameObjects.Rectangle => {
    const activate = () => {
      scene.registry.set(SETTINGS_RASTER_FOCUS_ID_KEY, id);
      onActivate();
    };
    const hitTarget = renderSettingsRasterHitTarget(scene, x, y, width, height, accent, activate, options);
    controls.push({ id, x, y, hitTarget, activate });
    return hitTarget;
  };

  addControl("volumeMaster", 840, 282, 380, 58, 0xf5c26b, () => updateSettings(scene, context, (next) => {
    next.volumeMaster = stepVolume(next.volumeMaster, 0.1);
  }), {
    ...settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.volumeMaster, 716, 271, 540, 64),
    tooltipTitle: "전체 음량",
    tooltipBody: `현재 ${Math.round(context.save.settings.volumeMaster * 100)}%입니다.`
  });
  addControl("volumeMusic", 840, 372, 380, 58, 0xf5c26b, () => updateSettings(scene, context, (next) => {
    next.volumeMusic = stepVolume(next.volumeMusic, 0.1);
  }), {
    ...settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.volumeMusic, 716, 363, 540, 64),
    tooltipTitle: "음악 음량",
    tooltipBody: `현재 ${Math.round(context.save.settings.volumeMusic * 100)}%입니다.`
  });
  addControl("volumeSfx", 840, 462, 380, 58, 0xf5c26b, () => updateSettings(scene, context, (next) => {
    next.volumeSfx = stepVolume(next.volumeSfx, 0.1);
  }), {
    ...settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.volumeSfx, 716, 455, 540, 64),
    tooltipTitle: "효과음 음량",
    tooltipBody: `현재 ${Math.round(context.save.settings.volumeSfx * 100)}%입니다.`
  });
  addControl("displayMode", 1360, 282, 340, 62, 0x5eead4, () => updateSettings(scene, context, (next) => {
    next.displayMode = next.displayMode === "high_contrast" ? "standard" : "high_contrast";
  }), {
    ...settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.displayMode, 1311, 271, 492, 64),
    tooltipTitle: "표시 모드",
    tooltipBody: `현재 ${context.save.settings.displayMode === "high_contrast" ? "고대비" : "기본"} 모드입니다.`
  });
  addControl("largeText", 1360, 372, 300, 62, 0x5eead4, () => updateSettings(scene, context, (next) => {
    next.largeText = !next.largeText;
  }), {
    ...settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.largeText, 1311, 363, 492, 64),
    tooltipTitle: "큰 글자",
    tooltipBody: `현재 ${context.save.settings.largeText ? "켜짐" : "꺼짐"} 상태입니다.`
  });
  addControl("reducedMotion", 1360, 462, 300, 62, 0x5eead4, () => updateSettings(scene, context, (next) => {
    next.reducedMotion = !next.reducedMotion;
  }), {
    ...settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.reducedMotion, 1311, 455, 492, 64),
    tooltipTitle: "모션 줄이기",
    tooltipBody: `현재 ${context.save.settings.reducedMotion ? "켜짐" : "꺼짐"} 상태입니다.`
  });
  addControl("spaceConfirm", 1360, 640, 320, 62, 0x5eead4, () => updateSettings(scene, context, (next) => {
    next.spaceConfirm = !next.spaceConfirm;
  }), {
    ...settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.spaceConfirm, 1311, 639, 492, 64),
    tooltipTitle: "Space 확인",
    tooltipBody: `현재 ${context.save.settings.spaceConfirm ? "Space와 Enter" : "Enter"}로 확인합니다.`
  });
  addControl("resetDefaults", 1626, 696, 300, 150, 0xf5c26b, () => resetSettings(scene, context), {
    hoverKey: SETTINGS_RASTER_HOVER_RESET_DEFAULTS_KEY,
    downKey: SETTINGS_RASTER_DOWN_RESET_DEFAULTS_KEY,
    stampX: 1626,
    stampY: 696,
    stampWidth: 330,
    stampHeight: 150,
    hoverAlpha: 0.94,
    downAlpha: 0.92,
    tooltipTitle: "설정 기본값",
    tooltipBody: "소리와 표시 설정을 기본값으로 되돌립니다.",
    tooltipTone: "danger"
  });
  addControl("resetSave", 1626, 520, 300, 150, 0xce5869, () => {
    scene.registry.set(SETTINGS_RASTER_FOCUS_ID_KEY, undefined);
    resetStoredSave(scene, context);
  }, {
    hoverKey: SETTINGS_RASTER_HOVER_RESET_SAVE_KEY,
    downKey: SETTINGS_RASTER_DOWN_RESET_SAVE_KEY,
    stampX: 1626,
    stampY: 520,
    stampWidth: 330,
    stampHeight: 150,
    hoverAlpha: 0.94,
    downAlpha: 0.92,
    tooltipTitle: "저장 데이터 초기화",
    tooltipBody: "현재 저장된 탐험과 진행 데이터를 지웁니다.",
    tooltipTone: "danger"
  });
  const returnHitTarget = addControl("returnTown", 1688, 958, 330, 170, 0x5eead4, () => {
    scene.registry.set(SETTINGS_RASTER_FOCUS_ID_KEY, undefined);
    scene.scene.start("TownScene", context);
  }, {
    hoverKey: SETTINGS_RASTER_HOVER_RETURN_KEY,
    downKey: SETTINGS_RASTER_DOWN_RETURN_KEY,
    stampX: 1688,
    stampY: 958,
    stampWidth: 330,
    stampHeight: 170,
    hoverAlpha: 0.96,
    downAlpha: 0.94,
    tooltipTitle: "마을로 돌아가기",
    tooltipBody: "변경한 설정을 유지한 채 마을 화면으로 이동합니다.",
    tooltipTone: "confirm"
  });
  return { controls, returnHitTarget };
}

function createSettingsRasterKeyboardHandler(
  scene: Phaser.Scene,
  rasterControls: SettingsRasterControls
): (action: InputAction) => boolean {
  const { controls } = rasterControls;
  let focusedIndex = controls.findIndex((control) => control.id === scene.registry.get(SETTINGS_RASTER_FOCUS_ID_KEY));

  const setFocus = (nextIndex: number): void => {
    if (!controls[nextIndex]) return;
    if (focusedIndex >= 0 && focusedIndex !== nextIndex) {
      setRasterHitTargetHoverState(controls[focusedIndex]?.hitTarget, false);
    }
    focusedIndex = nextIndex;
    scene.registry.set(SETTINGS_RASTER_FOCUS_ID_KEY, controls[focusedIndex].id);
    setRasterHitTargetHoverState(controls[focusedIndex].hitTarget, true);
  };

  const clearKeyboardFocus = (except?: SettingsRasterControl): void => {
    if (focusedIndex < 0 || controls[focusedIndex] === except) return;
    setRasterHitTargetHoverState(controls[focusedIndex].hitTarget, false);
    focusedIndex = -1;
    scene.registry.set(SETTINGS_RASTER_FOCUS_ID_KEY, undefined);
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
    if (isSettingsMoveAction(action)) {
      setFocus(resolveSettingsFocusIndex(controls, focusedIndex, action));
      return true;
    }

    if (action === "confirm") {
      if (focusedIndex < 0) {
        setFocus(0);
      }
      const focusedControl = controls[focusedIndex];
      if (!focusedControl) return true;
      if (triggerRasterHitTargetDown(scene, focusedControl.hitTarget, focusedControl.activate)) {
        return true;
      }
      focusedControl.activate();
      return true;
    }

    if (action === "cancel") {
      scene.registry.set(SETTINGS_RASTER_FOCUS_ID_KEY, undefined);
      const returnControl = controls.find((control) => control.id === "returnTown");
      const returnHitTarget = returnControl?.hitTarget ?? rasterControls.returnHitTarget;
      const activateReturn = returnControl?.activate ?? (() => scene.scene.start("TownScene"));
      if (triggerRasterHitTargetDown(scene, returnHitTarget, activateReturn)) {
        return true;
      }
      activateReturn();
      return true;
    }

    return false;
  };
}

function isSettingsMoveAction(action: InputAction): action is "move_up" | "move_down" | "move_left" | "move_right" {
  return action === "move_up" || action === "move_down" || action === "move_left" || action === "move_right";
}

function resolveSettingsFocusIndex(
  controls: SettingsRasterControl[],
  focusedIndex: number,
  action: "move_up" | "move_down" | "move_left" | "move_right"
): number {
  if (focusedIndex < 0) return 0;
  const current = controls[focusedIndex];
  const candidates = controls
    .map((control, index) => ({ control, index }))
    .filter(({ index }) => index !== focusedIndex)
    .filter(({ control }) => isSettingsFocusCandidate(current, control, action));
  if (candidates.length === 0) return focusedIndex;

  candidates.sort((left, right) => settingsFocusScore(current, left.control, action) - settingsFocusScore(current, right.control, action));
  return candidates[0].index;
}

function isSettingsFocusCandidate(
  current: SettingsRasterControl,
  candidate: SettingsRasterControl,
  action: "move_up" | "move_down" | "move_left" | "move_right"
): boolean {
  if (action === "move_up") return candidate.y < current.y - 8;
  if (action === "move_down") return candidate.y > current.y + 8;
  if (action === "move_left") return candidate.x < current.x - 8;
  return candidate.x > current.x + 8;
}

function settingsFocusScore(
  current: SettingsRasterControl,
  candidate: SettingsRasterControl,
  action: "move_up" | "move_down" | "move_left" | "move_right"
): number {
  const dx = Math.abs(candidate.x - current.x);
  const dy = Math.abs(candidate.y - current.y);
  if (action === "move_up" || action === "move_down") {
    return dy + dx * 0.82;
  }
  return dx + dy * 2.2;
}

function settingsControlStateOptions(
  keys: { hover: string; down: string },
  stampX: number,
  stampY: number,
  stampWidth: number,
  stampHeight: number
): {
  hoverKey: string;
  downKey: string;
  stampX: number;
  stampY: number;
  stampWidth: number;
  stampHeight: number;
  hoverAlpha: number;
  downAlpha: number;
} {
  return {
    hoverKey: keys.hover,
    downKey: keys.down,
    stampX,
    stampY,
    stampWidth,
    stampHeight,
    hoverAlpha: 0.96,
    downAlpha: 0.92
  };
}

function renderSettingsRasterHitTarget(
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
    stampX?: number;
    stampY?: number;
    stampSize?: number;
    stampWidth?: number;
    stampHeight?: number;
    hoverAlpha?: number;
    downAlpha?: number;
    tooltipTitle?: string;
    tooltipBody?: string;
    tooltipTone?: "default" | "confirm" | "choice" | "danger";
  } = {}
): Phaser.GameObjects.Rectangle {
  const largeTarget = width >= 180 || height >= 80;
  const hoverSize = options.stampSize ?? (largeTarget ? 94 : 68);
  const stampX = options.stampX ?? (largeTarget ? x + width * 0.36 : x + width * 0.34);
  const stampY = options.stampY ?? (largeTarget ? y - height * 0.22 : y - height * 0.18);
  return renderRasterHoverHitTarget(scene, x, y, width, height, onClick, {
    hoverKey: options.hoverKey ?? SETTINGS_RASTER_HOVER_ACTION_KEY,
    downKey: options.downKey ?? SETTINGS_RASTER_HOVER_ACTION_KEY,
    hoverX: stampX,
    hoverY: stampY,
    hoverWidth: options.stampWidth ?? hoverSize,
    hoverHeight: options.stampHeight ?? hoverSize,
    downX: stampX,
    downY: stampY,
    downWidth: options.stampWidth ?? hoverSize * 1.12,
    downHeight: options.stampHeight ?? hoverSize * 1.12,
    hoverAlpha: options.hoverAlpha,
    downAlpha: options.downAlpha ?? 0.76,
    tooltipTitle: options.tooltipTitle,
    tooltipBody: options.tooltipBody,
    tooltipTone: options.tooltipTone
  });
}

function renderSettingsPanel(scene: Phaser.Scene, context: BootContext): void {
  const settings = context.save.settings;
  renderSettingsStage(scene, context);

  renderPaperPanel(scene, 990, 638, 560, 430, { alpha: 0.96 });
  renderPaperPanel(scene, 1450, 638, 560, 430, { alpha: 0.96 });
  scene.add.text(760, 440, "오디오", textStyle(28, "#32415a", true));
  scene.add.text(760, 476, "마을 기록장에 저장되는 소리 값", textStyle(17, "#805845", true));
  scene.add.text(1220, 440, "표시 / 접근성 / 조작", textStyle(28, "#32415a", true));
  scene.add.text(1220, 476, "읽기와 입력 방식을 고르는 설정", textStyle(17, "#805845", true));

  renderLockedRow(scene, 760, 530, "언어", "한국어");
  renderNumberRow(scene, 760, 595, "전체 음량", percent(settings.volumeMaster),
    () => updateSettings(scene, context, (next) => { next.volumeMaster = stepVolume(next.volumeMaster, -0.1); }),
    () => updateSettings(scene, context, (next) => { next.volumeMaster = stepVolume(next.volumeMaster, 0.1); }));
  renderNumberRow(scene, 760, 660, "음악 음량", percent(settings.volumeMusic),
    () => updateSettings(scene, context, (next) => { next.volumeMusic = stepVolume(next.volumeMusic, -0.1); }),
    () => updateSettings(scene, context, (next) => { next.volumeMusic = stepVolume(next.volumeMusic, 0.1); }));
  renderNumberRow(scene, 760, 725, "효과음 음량", percent(settings.volumeSfx),
    () => updateSettings(scene, context, (next) => { next.volumeSfx = stepVolume(next.volumeSfx, -0.1); }),
    () => updateSettings(scene, context, (next) => { next.volumeSfx = stepVolume(next.volumeSfx, 0.1); }));

  renderToggleRow(scene, 1220, 530, "표시 모드", settings.displayMode === "high_contrast" ? "고대비" : "표준",
    () => updateSettings(scene, context, (next) => {
      next.displayMode = next.displayMode === "high_contrast" ? "standard" : "high_contrast";
    }));
  renderToggleRow(scene, 1220, 595, "큰 글자", onOff(settings.largeText),
    () => updateSettings(scene, context, (next) => { next.largeText = !next.largeText; }));
  renderToggleRow(scene, 1220, 660, "모션 줄임", onOff(settings.reducedMotion),
    () => updateSettings(scene, context, (next) => { next.reducedMotion = !next.reducedMotion; }));
  renderToggleRow(scene, 1220, 725, "스페이스 확인", onOff(settings.spaceConfirm),
    () => updateSettings(scene, context, (next) => { next.spaceConfirm = !next.spaceConfirm; }));

  renderSettingsStamp(scene, context);
  renderTooltip(scene, 1220, 816, 820, 70, "변경한 설정은 즉시 저장됩니다. 회색 항목은 현재 고정된 출시 후보 옵션입니다.");
  renderActionButton(scene, 820, 900, "설정 초기화", () => resetSettings(scene, context));
  renderActionButton(scene, 1160, 900, "저장 초기화", () => resetStoredSave(scene, context));
  renderActionButton(scene, 1500, 900, "마을로", () => scene.scene.start("TownScene", context));
}

function renderSettingsStage(scene: Phaser.Scene, context: BootContext): void {
  const settings = context.save.settings;
  scene.add.rectangle(960, 560, 1680, 840, 0xfff8e8, 0.44)
    .setStrokeStyle(6, 0xb98c34, 0.34);
  scene.add.polygon(168, 550, [0, -352, 168, -286, 190, 306, 0, 376, -82, 306, -58, -292], 0x6c8fd6, 0.2)
    .setStrokeStyle(5, 0x4c659d, 0.38);
  scene.add.polygon(1752, 550, [0, -352, 58, -292, 82, 306, 0, 376, -190, 306, -168, -286], 0x5d8d86, 0.2)
    .setStrokeStyle(5, 0x3f6f68, 0.38);
  scene.add.rectangle(960, 520, 1200, 370, 0xfff6df, 0.22).setStrokeStyle(5, 0xc6a65e, 0.3);
  scene.add.line(0, 0, 960, 340, 960, 870, 0x8d6a2a, 0.22).setLineWidth(4);
  scene.add.line(0, 0, 640, 356, 1240, 856, 0x8d6a2a, 0.18).setLineWidth(4);
  scene.add.line(0, 0, 1280, 356, 700, 856, 0x8d6a2a, 0.18).setLineWidth(4);

  renderPaperPanel(scene, 960, 126, 800, 132, { alpha: 0.96 });
  scene.add.circle(610, 126, 17, 0xc6a65e, 0.9).setStrokeStyle(3, 0xfff3b0, 0.8);
  scene.add.circle(1310, 126, 17, 0xc6a65e, 0.9).setStrokeStyle(3, 0xfff3b0, 0.8);
  scene.add.rectangle(960, 190, 720, 18, 0xf5c26b, 0.68);
  scene.add.text(960, 82, "설정", textStyle(42, "#1e2a3e", true)).setOrigin(0.5);
  scene.add.text(
    960,
    137,
    `소리 ${percent(settings.volumeMaster)} / 표시 ${settings.displayMode === "high_contrast" ? "고대비" : "표준"} / 확인 ${onOff(settings.spaceConfirm)}`,
    textStyle(22, "#805845", true)
  ).setOrigin(0.5);

  [365, 595, 1325, 1555].forEach((x, index) => {
    scene.add.line(0, 0, x, 132, x, 310, 0x6a7b8e, 0.36).setLineWidth(5);
    scene.add.rectangle(x, 260, 58, 88, index % 2 === 0 ? 0xfff3b0 : 0xe8e7b8, 0.72)
      .setStrokeStyle(5, 0xb4b0a8, 0.72);
  });
}

function renderSettingsStamp(scene: Phaser.Scene, context: BootContext): void {
  const settings = context.save.settings;
  renderPaperPanel(scene, 420, 638, 360, 430, { alpha: 0.94 });
  scene.add.text(274, 440, "저장 표식", textStyle(28, "#32415a", true));
  scene.add.text(274, 476, "현재 적용 중인 값", textStyle(17, "#805845", true));

  const chips = [
    `전체 ${percent(settings.volumeMaster)}`,
    `음악 ${percent(settings.volumeMusic)}`,
    `효과 ${percent(settings.volumeSfx)}`,
    `글자 ${onOff(settings.largeText)}`,
    `모션 ${onOff(settings.reducedMotion)}`
  ];
  chips.forEach((label, index) => {
    const y = 522 + index * 52;
    scene.add.rectangle(420, y, 270, 38, 0xfff6df, 0.5).setStrokeStyle(3, 0xc6a65e, 0.42);
    scene.add.text(300, y - 13, label, textStyle(17, "#805845", true)).setWordWrapWidth(240);
  });

  scene.add.rectangle(420, 804, 270, 72, 0xfff6df, 0.44).setStrokeStyle(3, 0xc6a65e, 0.5);
  scene.add.text(300, 780, "아직 소리 자산은 출시 게이트가 아닙니다.", textStyle(18, "#805845", true)).setWordWrapWidth(240);
}

function renderLockedRow(scene: Phaser.Scene, x: number, y: number, label: string, value: string): void {
  renderUiSlot(scene, x + 230, y, 460, 54, "choice", { disabled: true });
  scene.add.text(x + 22, y - 14, label, textStyle(20, "#1e2a3e", true));
  scene.add.text(x + 210, y - 14, value, textStyle(20, "#805845", true));
}

function renderNumberRow(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  value: string,
  onMinus: () => void,
  onPlus: () => void
): void {
  renderUiSlot(scene, x + 230, y, 460, 54, "choice");
  scene.add.text(x + 22, y - 14, label, textStyle(20, "#1e2a3e", true));
  scene.add.text(x + 210, y - 14, value, textStyle(20, "#805845", true));
  renderSmallButton(scene, x + 312, y, "-", onMinus);
  renderSmallButton(scene, x + 386, y, "+", onPlus);
}

function renderToggleRow(scene: Phaser.Scene, x: number, y: number, label: string, value: string, onToggle: () => void): void {
  renderUiSlot(scene, x + 230, y, 460, 54, "choice");
  scene.add.text(x + 22, y - 14, label, textStyle(20, "#1e2a3e", true));
  scene.add.text(x + 250, y - 14, value, textStyle(20, "#805845", true));
  renderSmallButton(scene, x + 390, y, "변경", onToggle, 96);
}

function renderSmallButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  width = 58
): void {
  renderActionButton(scene, x, y, label, onClick, {
    width,
    height: 48,
    variant: "secondary",
    fontSize: 19
  });
}

function updateSettings(scene: Phaser.Scene, context: BootContext, mutate: SettingsMutation): void {
  mutate(context.save.settings);
  scene.sound.volume = context.save.settings.volumeMaster;
  persistSave(context.save, { debug: context.runtimeFlags.debug });
  storeBootContext(scene, context);
  scene.scene.start("SettingsScene", context);
}

function resetSettings(scene: Phaser.Scene, context: BootContext): void {
  context.save.settings = createDefaultSettings();
  persistSave(context.save, { debug: context.runtimeFlags.debug });
  storeBootContext(scene, context);
  scene.scene.start("SettingsScene", context);
}

function resetStoredSave(scene: Phaser.Scene, context: BootContext): void {
  clearStoredSave({ debug: context.runtimeFlags.debug });
  scene.scene.start("BootScene");
}

function stepVolume(value: number, delta: number): number {
  return Math.max(0, Math.min(1, Math.round((value + delta) * 10) / 10));
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function onOff(value: boolean): string {
  return value ? "켜짐" : "꺼짐";
}
