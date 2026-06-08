import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { SettingsState } from "../../data/schema";
import { bindKeyboardActions } from "../../input/bindings";
import { clearStoredSave, createDefaultSettings, persistSave } from "../../save/saveCodec";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { requireBootContext, storeBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderPaperPanel, renderRasterHoverHitTarget, renderSceneShell, renderTooltip, renderUiSlot, textStyle } from "../view/sceneShell";

type SettingsMutation = (settings: SettingsState) => void;
const SETTINGS_RASTER_UNDERLAY_KEY = "settings_raster_underlay_concept";
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

    if (hasSettingsRasterUnderlay(this)) {
      renderSettingsRasterStage(this, context);
    } else {
      renderSettingsPanel(this, context);
    }
    bindKeyboardActions(this, (action) => {
      if (action === "cancel") {
        this.scene.start("TownScene", context);
      }
    }, context.save.settings);
    renderDebugOverlay(context, "SettingsScene");
  }
}

function hasSettingsRasterUnderlay(scene: Phaser.Scene): boolean {
  return scene.textures.exists(SETTINGS_RASTER_UNDERLAY_KEY);
}

function renderSettingsRasterStage(scene: Phaser.Scene, context: BootContext): void {
  scene.add.image(960, 540, SETTINGS_RASTER_UNDERLAY_KEY)
    .setDisplaySize(1920, 1080)
    .setDepth(0);

  renderSettingsRasterHitTarget(scene, 840, 282, 380, 58, 0xf5c26b, () => updateSettings(scene, context, (next) => {
    next.volumeMaster = stepVolume(next.volumeMaster, 0.1);
  }), settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.volumeMaster, 716, 271, 540, 64));
  renderSettingsRasterHitTarget(scene, 840, 372, 380, 58, 0xf5c26b, () => updateSettings(scene, context, (next) => {
    next.volumeMusic = stepVolume(next.volumeMusic, 0.1);
  }), settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.volumeMusic, 716, 363, 540, 64));
  renderSettingsRasterHitTarget(scene, 840, 462, 380, 58, 0xf5c26b, () => updateSettings(scene, context, (next) => {
    next.volumeSfx = stepVolume(next.volumeSfx, 0.1);
  }), settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.volumeSfx, 716, 455, 540, 64));
  renderSettingsRasterHitTarget(scene, 1360, 282, 340, 62, 0x5eead4, () => updateSettings(scene, context, (next) => {
    next.displayMode = next.displayMode === "high_contrast" ? "standard" : "high_contrast";
  }), settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.displayMode, 1311, 271, 492, 64));
  renderSettingsRasterHitTarget(scene, 1360, 372, 300, 62, 0x5eead4, () => updateSettings(scene, context, (next) => {
    next.largeText = !next.largeText;
  }), settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.largeText, 1311, 363, 492, 64));
  renderSettingsRasterHitTarget(scene, 1360, 462, 300, 62, 0x5eead4, () => updateSettings(scene, context, (next) => {
    next.reducedMotion = !next.reducedMotion;
  }), settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.reducedMotion, 1311, 455, 492, 64));
  renderSettingsRasterHitTarget(scene, 1360, 640, 320, 62, 0x5eead4, () => updateSettings(scene, context, (next) => {
    next.spaceConfirm = !next.spaceConfirm;
  }), settingsControlStateOptions(SETTINGS_RASTER_CONTROL_STATE_KEYS.spaceConfirm, 1311, 639, 492, 64));
  renderSettingsRasterHitTarget(scene, 1626, 696, 300, 150, 0xf5c26b, () => resetSettings(scene, context), {
    hoverKey: SETTINGS_RASTER_HOVER_RESET_DEFAULTS_KEY,
    downKey: SETTINGS_RASTER_DOWN_RESET_DEFAULTS_KEY,
    stampX: 1626,
    stampY: 696,
    stampWidth: 330,
    stampHeight: 150,
    hoverAlpha: 0.94,
    downAlpha: 0.92
  });
  renderSettingsRasterHitTarget(scene, 1626, 520, 300, 150, 0xce5869, () => resetStoredSave(scene, context), {
    hoverKey: SETTINGS_RASTER_HOVER_RESET_SAVE_KEY,
    downKey: SETTINGS_RASTER_DOWN_RESET_SAVE_KEY,
    stampX: 1626,
    stampY: 520,
    stampWidth: 330,
    stampHeight: 150,
    hoverAlpha: 0.94,
    downAlpha: 0.92
  });
  renderSettingsRasterHitTarget(scene, 1688, 958, 330, 170, 0x5eead4, () => scene.scene.start("TownScene", context), {
    hoverKey: SETTINGS_RASTER_HOVER_RETURN_KEY,
    downKey: SETTINGS_RASTER_DOWN_RETURN_KEY,
    stampX: 1688,
    stampY: 958,
    stampWidth: 330,
    stampHeight: 170,
    hoverAlpha: 0.96,
    downAlpha: 0.94
  });
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
  } = {}
): void {
  const largeTarget = width >= 180 || height >= 80;
  const hoverSize = options.stampSize ?? (largeTarget ? 94 : 68);
  const stampX = options.stampX ?? (largeTarget ? x + width * 0.36 : x + width * 0.34);
  const stampY = options.stampY ?? (largeTarget ? y - height * 0.22 : y - height * 0.18);
  renderRasterHoverHitTarget(scene, x, y, width, height, onClick, {
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
    downAlpha: options.downAlpha ?? 0.76
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
