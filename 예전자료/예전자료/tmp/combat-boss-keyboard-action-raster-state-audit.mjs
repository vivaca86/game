import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import Module from "node:module";
import { createServer } from "vite";

const require = createRequire(import.meta.url);
const bundledNodeModules = "C:/Users/i/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const bundledPnpmModules = `${bundledNodeModules}/.pnpm/node_modules`;
process.env.NODE_PATH = [process.env.NODE_PATH, bundledNodeModules, bundledPnpmModules].filter(Boolean).join(";");
Module._initPaths();

const targets = [
  {
    label: "combat-keyboard-card",
    sceneName: "CombatScene",
    underlayKey: "combat_raster_underlay_concept",
    pathname: "/?debug=1&entry=combat&resetSave=1",
    key: "Digit1",
    downKey: "ui_hover_gold_seal_concept"
  },
  {
    label: "combat-keyboard-end-turn",
    sceneName: "CombatScene",
    underlayKey: "combat_raster_underlay_concept",
    pathname: "/?debug=1&entry=combat&resetSave=1",
    key: "KeyE",
    downKey: "ui_hover_gold_seal_concept"
  },
  {
    label: "boss-keyboard-card",
    sceneName: "BossScene",
    underlayKey: "boss_raster_underlay_concept",
    pathname: "/?debug=1&entry=boss&resetSave=1",
    key: "Digit1",
    downKey: "ui_hover_boss_skull_stamp_concept"
  },
  {
    label: "boss-keyboard-end-turn",
    sceneName: "BossScene",
    underlayKey: "boss_raster_underlay_concept",
    pathname: "/?debug=1&entry=boss&resetSave=1",
    key: "KeyE",
    downKey: "ui_hover_boss_skull_stamp_concept"
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
  for (const port of [4204, 4205, 4206, 4207]) {
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

async function openTarget(page, baseUrl, target) {
  await page.goto(new URL(target.pathname, baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, target.sceneName);
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });
}

async function waitForScene(page, sceneName) {
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneName, { timeout: 10000 });
}

async function captureStats(page, target) {
  return page.evaluate(({ target }) => {
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
    return {
      scene: target.sceneName,
      hasUnderlay: underlayIndex >= 0,
      visibleDownImages: visible.filter((child) => child?.type === "Image" && child.texture?.key === target.downKey && Number(child.alpha ?? 1) > 0.05).length,
      textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay: rectsAbove.length
    };
  }, { target });
}

async function setScenePaused(page, sceneName, paused) {
  await page.evaluate(({ sceneName, paused }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScene?.(sceneName);
    if (!scene) return;
    scene.time.timeScale = paused ? 0 : 1;
  }, { sceneName, paused });
}

function assertState(label, stats) {
  if (!stats.hasUnderlay) throw new Error(`${label}: missing raster underlay`);
  if (stats.visibleDownImages !== 1) throw new Error(`${label}: expected one visible keyboard action down image, got ${stats.visibleDownImages}`);
  if (stats.textCount !== 0) throw new Error(`${label}: visible Phaser text leaked over raster underlay`);
  if (stats.visibleRectsAboveUnderlay !== 0) throw new Error(`${label}: visible rectangle overlay leaked`);
}

await mkdir("tmp/ui-quality/keyboard-actions", { recursive: true });

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
  const canvas = page.locator("canvas");
  const results = [];

  for (const target of targets) {
    await openTarget(page, baseUrl, target);
    await page.keyboard.down(target.key);
    await page.waitForTimeout(10);
    const stats = await captureStats(page, target);
    assertState(target.label, stats);
    await setScenePaused(page, target.sceneName, true);
    await canvas.screenshot({ path: `tmp/ui-quality/keyboard-actions/${target.label}-down-v1-1920.png` });
    await setScenePaused(page, target.sceneName, false);
    await page.keyboard.up(target.key);
    await page.waitForTimeout(220);
    results.push({ label: target.label, key: target.key, ...stats });
  }

  console.log(JSON.stringify({ ok: true, results }, null, 2));
} finally {
  await browser?.close();
  await server?.close();
}
