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

const target = {
  label: "dungeon",
  sceneName: "DungeonScene",
  underlayKey: "dungeon_raster_underlay_concept",
  focusRegistryKey: "dungeonRasterFocusId",
  pathname: "/?debug=1&entry=dungeon&resetSave=1",
  stateKey: "ui_hover_route_node_concept",
  controls: {
    roomNode: {
      label: "dungeon-room-node",
      id: "room_node",
      x: 1010,
      y: 582,
      hoverWidth: 96,
      hoverHeight: 96,
      downWidth: 105.6,
      downHeight: 105.6
    },
    bottomConfirm: {
      label: "dungeon-bottom-confirm",
      id: "bottom_confirm",
      x: 960,
      y: 962,
      hoverWidth: 118.72,
      hoverHeight: 118.72,
      downWidth: 130.592,
      downHeight: 130.592
    }
  },
  focusSteps: [
    { key: "ArrowDown", id: "roomNode" },
    { key: "ArrowDown", id: "bottomConfirm" }
  ],
  activation: {
    keys: ["ArrowDown", "ArrowDown"],
    id: "bottomConfirm"
  }
};

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    return require(`${bundledNodeModules}/playwright`);
  }
}

async function startServer() {
  for (const port of [4228, 4229, 4230, 4231]) {
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
  throw new Error("No free Dungeon keyboard focus audit port found");
}

async function waitForScene(page, sceneName) {
  await page.waitForSelector("canvas", { timeout: 20000 });
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneName, { timeout: 20000 });
}

async function openTarget(page, baseUrl) {
  await page.goto(new URL(target.pathname, baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, target.sceneName);
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });
  return { canvas: page.locator("canvas") };
}

async function captureStats(page) {
  return page.evaluate(({ target }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === target.sceneName)
      ?? game?.scene?.getScene?.(target.sceneName);
    const context = scene?.registry?.get?.("bootContext");
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
    const visibleStateImages = visible
      .filter((child) => child?.type === "Image" && child.texture?.key === target.stateKey && Number(child.alpha ?? 1) > 0.05)
      .map((child) => ({
        x: Number(child.x),
        y: Number(child.y),
        displayWidth: Number(child.displayWidth),
        displayHeight: Number(child.displayHeight),
        alpha: Number(child.alpha ?? 1)
      }));

    return {
      scene: target.sceneName,
      phase: context?.run?.phase,
      logLength: context?.run?.log?.length ?? 0,
      logTail: context?.run?.log?.slice?.(-8) ?? [],
      hasUnderlay: underlayIndex >= 0,
      focusId: game?.registry?.get?.(target.focusRegistryKey),
      visibleStateImages,
      textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay: rectsAbove.length
    };
  }, { target });
}

async function readRunState(page) {
  return page.evaluate(() => {
    const context = window.__paperGame?.registry?.get?.("bootContext");
    const activeScenes = window.__paperGame?.scene?.getScenes?.(true)?.map((scene) => scene.scene?.key) ?? [];
    return {
      phase: context?.run?.phase,
      logLength: context?.run?.log?.length ?? 0,
      logTail: context?.run?.log?.slice?.(-8) ?? [],
      activeScenes
    };
  });
}

async function setScenePaused(page, paused) {
  await page.evaluate(({ sceneName, paused }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScene?.(sceneName);
    if (!scene) return;
    scene.time.timeScale = paused ? 0 : 1;
  }, { sceneName: target.sceneName, paused });
}

function assertState(label, stats, control, mode) {
  if (!stats.hasUnderlay) throw new Error(`${label}: missing raster underlay`);
  if (stats.focusId !== control.id) throw new Error(`${label}: expected focus ${control.id}, got ${stats.focusId}`);
  if (stats.visibleStateImages.length !== 1) {
    throw new Error(`${label}: expected exactly one visible route-node state image, got ${stats.visibleStateImages.length}`);
  }
  if (stats.textCount !== 0) throw new Error(`${label}: visible Phaser text leaked over raster underlay`);
  if (stats.visibleRectsAboveUnderlay !== 0) throw new Error(`${label}: visible rectangle overlay leaked`);

  const [image] = stats.visibleStateImages;
  const expectedWidth = mode === "down" ? control.downWidth : control.hoverWidth;
  const expectedHeight = mode === "down" ? control.downHeight : control.hoverHeight;
  const maxDelta = 5;
  if (Math.abs(image.x - control.x) > maxDelta || Math.abs(image.y - control.y) > maxDelta) {
    throw new Error(`${label}: state image anchored at (${image.x}, ${image.y}), expected (${control.x}, ${control.y})`);
  }
  if (Math.abs(image.displayWidth - expectedWidth) > maxDelta || Math.abs(image.displayHeight - expectedHeight) > maxDelta) {
    throw new Error(`${label}: state image size ${image.displayWidth}x${image.displayHeight}, expected ${expectedWidth}x${expectedHeight}`);
  }
}

function assertActivation(beforeStats, afterState) {
  if (afterState.phase === beforeStats.phase && afterState.logLength <= beforeStats.logLength) {
    throw new Error(`dungeon-bottom-confirm-activation: expected focused confirm to enter a room; before=${JSON.stringify(beforeStats)}, after=${JSON.stringify(afterState)}`);
  }
  if (!["combat", "event", "reward", "rune_bench", "boss", "result"].includes(afterState.phase)) {
    throw new Error(`dungeon-bottom-confirm-activation: unexpected post-confirm phase ${afterState.phase}`);
  }
}

await mkdir("tmp/ui-quality/dungeon-keyboard-focus", { recursive: true });

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
  let opened = await openTarget(page, baseUrl);
  const results = [];

  for (const step of target.focusSteps) {
    const control = target.controls[step.id];
    await page.keyboard.press(step.key);
    await page.waitForTimeout(70);
    const stats = await captureStats(page);
    assertState(`${control.label}-focus`, stats, control, "hover");
    const screenshot = `tmp/ui-quality/dungeon-keyboard-focus/${control.label}-focus-v1-1920.png`;
    await opened.canvas.screenshot({ path: screenshot });
    results.push({ label: `${control.label}-focus`, screenshot: path.resolve(screenshot), stats });
  }

  opened = await openTarget(page, baseUrl);
  for (const key of target.activation.keys) {
    await page.keyboard.press(key);
    await page.waitForTimeout(70);
  }
  const activationControl = target.controls[target.activation.id];
  const focusStats = await captureStats(page);
  assertState(`${activationControl.label}-activation-focus`, focusStats, activationControl, "hover");
  await page.keyboard.down("Enter");
  await page.waitForTimeout(10);
  const downStats = await captureStats(page);
  assertState(`${activationControl.label}-activation-down`, downStats, activationControl, "down");
  await setScenePaused(page, true);
  const downScreenshot = `tmp/ui-quality/dungeon-keyboard-focus/${activationControl.label}-keyboard-activate-down-v1-1920.png`;
  await opened.canvas.screenshot({ path: downScreenshot });
  await setScenePaused(page, false);
  await page.keyboard.up("Enter");
  await page.waitForTimeout(1000);
  const afterState = await readRunState(page);
  assertActivation(focusStats, afterState);
  results.push({
    label: `${activationControl.label}-activation`,
    screenshot: path.resolve(downScreenshot),
    focusStats,
    downStats,
    afterState
  });

  console.log(JSON.stringify({ ok: true, baseUrl, results }, null, 2));
} finally {
  await browser?.close();
  await server?.close();
}
