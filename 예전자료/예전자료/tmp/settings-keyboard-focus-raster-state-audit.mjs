import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import Module from "node:module";
import path from "node:path";
import { createServer } from "vite";

const require = createRequire(import.meta.url);
const bundledNodeModules = "C:/Users/i/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const bundledPnpmModules = `${bundledNodeModules}/.pnpm/node_modules`;
process.env.NODE_PATH = [process.env.NODE_PATH, bundledNodeModules, bundledPnpmModules].filter(Boolean).join(";");
Module._initPaths();

const sceneName = "SettingsScene";
const underlayKey = "settings_raster_underlay_concept";
const targets = {
  volumeMaster: { label: "volume-master", hoverKey: "ui_hover_settings_volume_master_concept", downKey: "ui_down_settings_volume_master_concept" },
  volumeMusic: { label: "volume-music", hoverKey: "ui_hover_settings_volume_music_concept", downKey: "ui_down_settings_volume_music_concept" },
  volumeSfx: { label: "volume-sfx", hoverKey: "ui_hover_settings_volume_sfx_concept", downKey: "ui_down_settings_volume_sfx_concept" },
  displayMode: { label: "display-mode", hoverKey: "ui_hover_settings_display_mode_concept", downKey: "ui_down_settings_display_mode_concept" },
  largeText: { label: "large-text", hoverKey: "ui_hover_settings_large_text_concept", downKey: "ui_down_settings_large_text_concept" },
  reducedMotion: { label: "reduced-motion", hoverKey: "ui_hover_settings_reduced_motion_concept", downKey: "ui_down_settings_reduced_motion_concept" },
  spaceConfirm: { label: "space-confirm", hoverKey: "ui_hover_settings_space_confirm_concept", downKey: "ui_down_settings_space_confirm_concept" },
  resetDefaults: { label: "reset-defaults", hoverKey: "ui_hover_settings_reset_defaults_concept", downKey: "ui_down_settings_reset_defaults_concept" },
  resetSave: { label: "reset-save", hoverKey: "ui_hover_settings_reset_save_concept", downKey: "ui_down_settings_reset_save_concept" },
  returnTown: { label: "return-town", hoverKey: "ui_hover_settings_return_button_concept", downKey: "ui_down_settings_return_button_concept" }
};

const hoverKeys = Object.values(targets).map((target) => target.hoverKey);
const downKeys = Object.values(targets).map((target) => target.downKey);

const focusSteps = [
  { key: "ArrowDown", id: "volumeMaster" },
  { key: "ArrowDown", id: "volumeMusic" },
  { key: "ArrowDown", id: "volumeSfx" },
  { key: "ArrowRight", id: "reducedMotion" },
  { key: "ArrowUp", id: "largeText" },
  { key: "ArrowUp", id: "displayMode" },
  { key: "ArrowDown", id: "largeText" },
  { key: "ArrowDown", id: "reducedMotion" },
  { key: "ArrowDown", id: "spaceConfirm" },
  { key: "ArrowRight", id: "resetDefaults" },
  { key: "ArrowUp", id: "resetSave" },
  { key: "ArrowDown", id: "resetDefaults" },
  { key: "ArrowDown", id: "returnTown" }
];

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    return require(`${bundledNodeModules}/playwright`);
  }
}

async function startServer() {
  for (const port of [4212, 4213, 4214, 4215]) {
    try {
      const server = await createServer({
        root: process.cwd(),
        logLevel: "silent",
        server: { host: "127.0.0.1", port, strictPort: true }
      });
      await server.listen();
      return { server, baseUrl: `http://127.0.0.1:${port}/` };
    } catch (error) {
      if (!String(error?.message ?? error).includes("Port")) throw error;
    }
  }
  throw new Error("No free audit port found");
}

async function waitForScene(page, expectedSceneName) {
  await page.waitForFunction((sceneKey) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === sceneKey));
  }, expectedSceneName, { timeout: 10000 });
}

async function openSettings(page, baseUrl) {
  await page.goto(new URL("/?debug=1&entry=town&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, "TownScene");
  await page.waitForSelector("canvas", { timeout: 10000 });
  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("missing canvas");

  await page.mouse.click(box.x + (1010 / 1920) * box.width, box.y + (806 / 1080) * box.height);
  await waitForScene(page, sceneName);
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });
  return { canvas };
}

async function captureStats(page, expectedKey, mode) {
  return page.evaluate(({ sceneName, underlayKey, expectedKey, mode, hoverKeys, downKeys }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === sceneName)
      ?? game?.scene?.getScene?.(sceneName);
    const children = scene?.children?.list ?? [];
    const underlayIndex = children.findIndex((child) => child?.type === "Image" && child.texture?.key === underlayKey);
    const underlayDepth = children[underlayIndex]?.depth ?? 0;
    const visible = children.filter((child) => child?.visible !== false && child?.alpha !== 0);
    const rectsAbove = visible
      .filter((child) => child?.type === "Rectangle")
      .filter((child) => child.depth > underlayDepth || children.indexOf(child) > underlayIndex)
      .filter((child) => {
        const fillAlpha = Number(child?.fillAlpha ?? child?.alpha ?? 1);
        const strokeAlpha = Number(child?.strokeAlpha ?? child?.lineAlpha ?? 0);
        const strokeWidth = Number(child?.lineWidth ?? child?.strokeWidth ?? 0);
        return (child?.isFilled && fillAlpha > 0.02) || (child?.isStroked && strokeWidth > 0 && strokeAlpha > 0.02);
      });
    const keys = mode === "down" ? downKeys : hoverKeys;
    return {
      scene: sceneName,
      hasUnderlay: underlayIndex >= 0,
      visibleExpectedImages: visible.filter((child) => child?.type === "Image" && child.texture?.key === expectedKey && Number(child.alpha ?? 1) > 0.05).length,
      visibleKnownStateImages: visible.filter((child) => child?.type === "Image" && keys.includes(child.texture?.key) && Number(child.alpha ?? 1) > 0.05).length,
      textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay: rectsAbove.length
    };
  }, { sceneName, underlayKey, expectedKey, mode, hoverKeys, downKeys });
}

async function setScenePaused(page, paused) {
  await page.evaluate(({ sceneName, paused }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScene?.(sceneName);
    if (!scene) return;
    scene.time.timeScale = paused ? 0 : 1;
  }, { sceneName, paused });
}

async function readVolumeMaster(page) {
  return page.evaluate(() => {
    const game = window.__paperGame;
    return game?.registry?.get?.("bootContext")?.save?.settings?.volumeMaster;
  });
}

function assertState(label, stats, mode) {
  if (!stats.hasUnderlay) throw new Error(`${label}: missing Settings raster underlay`);
  if (stats.visibleExpectedImages !== 1) throw new Error(`${label}: expected one visible ${mode} image, got ${stats.visibleExpectedImages}`);
  if (stats.visibleKnownStateImages !== 1) throw new Error(`${label}: expected exactly one visible Settings ${mode} state image, got ${stats.visibleKnownStateImages}`);
  if (stats.textCount !== 0) throw new Error(`${label}: visible Phaser text leaked over raster underlay`);
  if (stats.visibleRectsAboveUnderlay !== 0) throw new Error(`${label}: visible rectangle overlay leaked`);
}

await mkdir("tmp/ui-quality/settings-keyboard-focus", { recursive: true });

const { chromium } = loadPlaywright();
const executableCandidates = [
  "C:/Users/i/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
];

let browser;
let server;
let baseUrl;

try {
  ({ server, baseUrl } = await startServer());
  let launchError;
  for (const executablePath of [null, ...executableCandidates]) {
    try {
      browser = await chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true });
      break;
    } catch (error) {
      launchError = error;
    }
  }
  if (!browser) throw launchError;

  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  let opened = await openSettings(page, baseUrl);
  const focusResults = [];
  const capturedLabels = new Set();

  for (const step of focusSteps) {
    const target = targets[step.id];
    await page.keyboard.press(step.key);
    await page.waitForTimeout(70);
    const stats = await captureStats(page, target.hoverKey, "hover");
    assertState(`focus-${target.label}`, stats, "hover");
    const screenshot = `tmp/ui-quality/settings-keyboard-focus/${target.label}-focus-v1-1920.png`;
    if (!capturedLabels.has(target.label)) {
      await opened.canvas.screenshot({ path: screenshot });
      capturedLabels.add(target.label);
    }
    focusResults.push({ key: step.key, label: target.label, screenshot: path.resolve(screenshot), ...stats });
  }

  opened = await openSettings(page, baseUrl);
  const activationTarget = targets.volumeMaster;
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(70);
  assertState("activation-focus-volume-master", await captureStats(page, activationTarget.hoverKey, "hover"), "hover");
  await page.keyboard.down("Enter");
  await page.waitForTimeout(10);
  const downStats = await captureStats(page, activationTarget.downKey, "down");
  assertState("activation-down-volume-master", downStats, "down");
  await setScenePaused(page, true);
  const activationScreenshot = "tmp/ui-quality/settings-keyboard-focus/volume-master-keyboard-activate-down-v1-1920.png";
  await opened.canvas.screenshot({ path: activationScreenshot });
  await setScenePaused(page, false);
  await page.keyboard.up("Enter");
  await page.waitForTimeout(180);
  await waitForScene(page, sceneName);
  const volumeMaster = await readVolumeMaster(page);
  if (volumeMaster !== 0.9) {
    throw new Error(`activation-volume-master: expected volumeMaster=0.9, got ${volumeMaster}`);
  }
  const restoredFocusStats = await captureStats(page, activationTarget.hoverKey, "hover");
  assertState("activation-restored-focus-volume-master", restoredFocusStats, "hover");

  console.log(JSON.stringify({
    ok: true,
    focusResults,
    activationResult: {
      label: activationTarget.label,
      key: "Enter",
      screenshot: path.resolve(activationScreenshot),
      volumeMaster,
      downStats,
      restoredFocusStats
    }
  }, null, 2));
} finally {
  await browser?.close();
  await server?.close();
}
