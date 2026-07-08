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

const targets = [
  {
    label: "town",
    sceneName: "TownScene",
    underlayKey: "town_raster_underlay_concept",
    focusRegistryKey: "townRasterFocusId",
    pathname: "/?debug=1&entry=town&resetSave=1",
    controls: {
      expedition: {
        label: "town-expedition",
        hoverKey: "ui_hover_town_expedition_action_concept",
        downKey: "ui_down_town_expedition_action_concept",
        x: 1048,
        y: 643,
        width: 160,
        height: 154
      },
      toolbarSettings: {
        label: "town-toolbar-settings",
        hoverKey: "ui_hover_town_toolbar_settings_concept",
        downKey: "ui_down_town_toolbar_settings_concept",
        x: 1340,
        y: 976,
        width: 220,
        height: 164
      },
      toolbarReset: {
        label: "town-toolbar-reset",
        hoverKey: "ui_hover_town_toolbar_reset_concept",
        downKey: "ui_down_town_toolbar_reset_concept",
        x: 514,
        y: 976,
        width: 230,
        height: 142
      }
    },
    focusSteps: [
      { key: "ArrowDown", id: "expedition" },
      { key: "ArrowDown", id: "toolbarSettings" },
      { key: "ArrowLeft", id: "toolbarReset" }
    ],
    activation: {
      keys: ["ArrowDown", "ArrowDown"],
      id: "toolbarSettings",
      nextSceneName: "SettingsScene"
    }
  },
  {
    label: "runebench",
    sceneName: "RuneBenchScene",
    underlayKey: "rune_bench_raster_underlay_concept",
    focusRegistryKey: "runeBenchRasterFocusId",
    pathname: "/?debug=1&entry=rune_bench&resetSave=1&grantRune=rune_paper_spark",
    controls: {
      actionRail: {
        label: "runebench-action-rail",
        hoverKey: "ui_hover_runebench_action_rail_concept",
        downKey: "ui_down_runebench_action_rail_concept",
        x: 1062,
        y: 714,
        width: 540,
        height: 112
      },
      confirmButton: {
        label: "runebench-confirm-button",
        hoverKey: "ui_hover_runebench_confirm_button_concept",
        downKey: "ui_down_runebench_confirm_button_concept",
        x: 1644,
        y: 968,
        width: 330,
        height: 122
      }
    },
    focusSteps: [
      { key: "ArrowDown", id: "actionRail" },
      { key: "ArrowDown", id: "confirmButton" }
    ],
    activation: {
      keys: ["ArrowDown", "ArrowDown"],
      id: "confirmButton",
      expectPhaseChange: true
    }
  },
  {
    label: "result",
    sceneName: "ResultScene",
    underlayKey: "result_raster_underlay_concept",
    focusRegistryKey: "resultRasterFocusId",
    pathname: "/?debug=1&entry=result&resetSave=1",
    controls: {
      actionCard: {
        label: "result-action-card",
        hoverKey: "ui_hover_result_action_card_concept",
        downKey: "ui_down_result_action_card_concept",
        x: 1170,
        y: 704,
        width: 300,
        height: 128
      },
      returnButton: {
        label: "result-return-button",
        hoverKey: "ui_hover_result_return_button_concept",
        downKey: "ui_down_result_return_button_concept",
        x: 960,
        y: 940,
        width: 440,
        height: 146
      }
    },
    focusSteps: [
      { key: "ArrowDown", id: "actionCard" },
      { key: "ArrowDown", id: "returnButton" }
    ],
    activation: {
      keys: ["ArrowDown", "ArrowDown"],
      id: "returnButton",
      nextSceneName: "TownScene"
    }
  }
];

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    return require(`${bundledNodeModules}/playwright`);
  }
}

async function startServer() {
  for (const port of [4220, 4221, 4222, 4223]) {
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

async function waitForScene(page, sceneName) {
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneName, { timeout: 10000 });
}

async function openTarget(page, baseUrl, target) {
  await page.goto(new URL(target.pathname, baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, target.sceneName);
  await page.waitForSelector("canvas", { timeout: 10000 });
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });
  return { canvas: page.locator("canvas") };
}

async function captureStats(page, target, control, mode) {
  return page.evaluate(({ target, control, mode }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === target.sceneName)
      ?? game?.scene?.getScene?.(target.sceneName);
    const children = scene?.children?.list ?? [];
    const underlayIndex = children.findIndex((child) => child?.type === "Image" && child.texture?.key === target.underlayKey);
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
    const expectedKey = mode === "down" ? control.downKey : control.hoverKey;
    const knownKeys = Object.values(target.controls).map((item) => mode === "down" ? item.downKey : item.hoverKey);
    const visibleStateImages = visible
      .filter((child) => child?.type === "Image" && child.texture?.key === expectedKey && Number(child.alpha ?? 1) > 0.05)
      .map((child) => ({
        x: Number(child.x),
        y: Number(child.y),
        displayWidth: Number(child.displayWidth),
        displayHeight: Number(child.displayHeight),
        alpha: Number(child.alpha ?? 1)
      }));

    return {
      scene: target.sceneName,
      hasUnderlay: underlayIndex >= 0,
      focusId: game?.registry?.get?.(target.focusRegistryKey),
      visibleExpectedImages: visibleStateImages.length,
      visibleKnownStateImages: visible.filter((child) => child?.type === "Image" && knownKeys.includes(child.texture?.key) && Number(child.alpha ?? 1) > 0.05).length,
      visibleStateImages,
      textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay: rectsAbove.length
    };
  }, { target, control, mode });
}

async function readPhase(page) {
  return page.evaluate(() => window.__paperGame?.registry?.get?.("bootContext")?.run?.phase);
}

async function setScenePaused(page, sceneName, paused) {
  await page.evaluate(({ sceneName, paused }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScene?.(sceneName);
    if (!scene) return;
    scene.time.timeScale = paused ? 0 : 1;
  }, { sceneName, paused });
}

function assertState(label, stats, target, control, expectedId, mode) {
  if (!stats.hasUnderlay) throw new Error(`${label}: missing raster underlay`);
  if (stats.focusId !== expectedId) throw new Error(`${label}: expected focus ${expectedId}, got ${stats.focusId}`);
  if (stats.visibleExpectedImages !== 1) throw new Error(`${label}: expected one visible ${mode} image, got ${stats.visibleExpectedImages}`);
  if (stats.visibleKnownStateImages !== 1) throw new Error(`${label}: expected exactly one visible ${mode} state image, got ${stats.visibleKnownStateImages}`);
  if (stats.textCount !== 0) throw new Error(`${label}: visible Phaser text leaked over raster underlay`);
  if (stats.visibleRectsAboveUnderlay !== 0) throw new Error(`${label}: visible rectangle overlay leaked`);

  const [image] = stats.visibleStateImages;
  const maxDelta = 5;
  if (Math.abs(image.x - control.x) > maxDelta || Math.abs(image.y - control.y) > maxDelta) {
    throw new Error(`${label}: state image anchored at (${image.x}, ${image.y}), expected (${control.x}, ${control.y})`);
  }
  if (Math.abs(image.displayWidth - control.width) > maxDelta || Math.abs(image.displayHeight - control.height) > maxDelta) {
    throw new Error(`${label}: state image size ${image.displayWidth}x${image.displayHeight}, expected ${control.width}x${control.height}`);
  }
}

await mkdir("tmp/ui-quality/utility-keyboard-focus", { recursive: true });

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
  const results = [];

  for (const target of targets) {
    let opened = await openTarget(page, baseUrl, target);
    for (const step of target.focusSteps) {
      const control = target.controls[step.id];
      await page.keyboard.press(step.key);
      await page.waitForTimeout(70);
      const stats = await captureStats(page, target, control, "hover");
      assertState(`${control.label}-focus`, stats, target, control, step.id, "hover");
      const screenshot = `tmp/ui-quality/utility-keyboard-focus/${control.label}-focus-v1-1920.png`;
      await opened.canvas.screenshot({ path: screenshot });
      results.push({ label: `${control.label}-focus`, screenshot: path.resolve(screenshot), stats });
    }

    opened = await openTarget(page, baseUrl, target);
    const beforePhase = await readPhase(page);
    for (const key of target.activation.keys) {
      await page.keyboard.press(key);
      await page.waitForTimeout(70);
    }
    const activationControl = target.controls[target.activation.id];
    const focusStats = await captureStats(page, target, activationControl, "hover");
    assertState(`${activationControl.label}-activation-focus`, focusStats, target, activationControl, target.activation.id, "hover");
    await page.keyboard.down("Enter");
    await page.waitForTimeout(10);
    const downStats = await captureStats(page, target, activationControl, "down");
    assertState(`${activationControl.label}-activation-down`, downStats, target, activationControl, target.activation.id, "down");
    await setScenePaused(page, target.sceneName, true);
    const downScreenshot = `tmp/ui-quality/utility-keyboard-focus/${activationControl.label}-keyboard-activate-down-v1-1920.png`;
    await opened.canvas.screenshot({ path: downScreenshot });
    await setScenePaused(page, target.sceneName, false);
    await page.keyboard.up("Enter");
    await page.waitForTimeout(1000);

    if (target.activation.nextSceneName) {
      await waitForScene(page, target.activation.nextSceneName);
    }
    const afterPhase = await readPhase(page);
    if (target.activation.expectPhaseChange && afterPhase === beforePhase) {
      throw new Error(`${activationControl.label}-activation: expected phase to change from ${beforePhase}`);
    }
    results.push({
      label: `${activationControl.label}-activation`,
      screenshot: path.resolve(downScreenshot),
      beforePhase,
      afterPhase,
      focusStats,
      downStats
    });
  }

  console.log(JSON.stringify({ ok: true, results }, null, 2));
} finally {
  await browser?.close();
  await server?.close();
}
