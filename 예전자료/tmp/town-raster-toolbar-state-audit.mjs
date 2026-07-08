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

const sceneName = "TownScene";
const underlayKey = "town_raster_underlay_concept";
const sharedActionSealKey = "ui_hover_action_seal_concept";

const toolbarTargets = [
  {
    label: "toolbar-reset",
    x: 514,
    y: 976,
    hoverKey: "ui_hover_town_toolbar_reset_concept",
    downKey: "ui_down_town_toolbar_reset_concept"
  },
  {
    label: "toolbar-settings",
    x: 1340,
    y: 976,
    hoverKey: "ui_hover_town_toolbar_settings_concept",
    downKey: "ui_down_town_toolbar_settings_concept"
  }
];

const legacyTargets = [
  { label: "legacy-reset", x: 1010, y: 724 },
  { label: "legacy-settings", x: 1010, y: 806 }
];

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    return require(`${bundledNodeModules}/playwright`);
  }
}

async function startServer() {
  for (const port of [4192, 4193, 4194, 4195]) {
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

function pointInCanvas(box, x, y) {
  return {
    x: box.x + (x / 1920) * box.width,
    y: box.y + (y / 1080) * box.height
  };
}

async function openTown(page, baseUrl) {
  await page.goto(new URL("/?debug=1&entry=town&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneName, { timeout: 10000 });
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });
}

async function captureStats(page, expectedKey) {
  return page.evaluate(({ sceneName, underlayKey, expectedKey, sharedActionSealKey }) => {
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
    return {
      hasUnderlay: underlayIndex >= 0,
      expectedImages: visible.filter((child) => child?.type === "Image" && child.texture?.key === expectedKey && Number(child.alpha ?? 1) > 0.05).length,
      sharedActionSeals: visible.filter((child) => child?.type === "Image" && child.texture?.key === sharedActionSealKey && Number(child.alpha ?? 1) > 0.05).length,
      textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay: rectsAbove.length
    };
  }, { sceneName, underlayKey, expectedKey, sharedActionSealKey });
}

function assertToolbarStats(label, stats) {
  if (!stats.hasUnderlay) throw new Error(`${label}: missing town raster underlay`);
  if (stats.expectedImages !== 1) throw new Error(`${label}: expected one visible state image, got ${stats.expectedImages}`);
  if (stats.sharedActionSeals !== 0) throw new Error(`${label}: shared action seal leaked`);
  if (stats.textCount !== 0) throw new Error(`${label}: visible Phaser text leaked over raster underlay`);
  if (stats.visibleRectsAboveUnderlay !== 0) throw new Error(`${label}: visible rectangle overlay leaked`);
}

function assertLegacyStats(label, stats) {
  if (!stats.hasUnderlay) throw new Error(`${label}: missing town raster underlay`);
  if (stats.sharedActionSeals !== 0) throw new Error(`${label}: legacy target still shows shared action seal`);
  if (stats.textCount !== 0) throw new Error(`${label}: visible Phaser text leaked over raster underlay`);
  if (stats.visibleRectsAboveUnderlay !== 0) throw new Error(`${label}: visible rectangle overlay leaked`);
}

await mkdir("tmp/ui-quality/town-toolbar", { recursive: true });

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

  for (const target of toolbarTargets) {
    await openTown(page, baseUrl);
    const box = await canvas.boundingBox();
    const point = pointInCanvas(box, target.x, target.y);
    await page.mouse.move(point.x, point.y);
    await page.waitForTimeout(120);
    await canvas.screenshot({ path: `tmp/ui-quality/town-toolbar/${target.label}-hover-v1-1920.png` });
    const hoverStats = await captureStats(page, target.hoverKey);
    assertToolbarStats(`${target.label}-hover`, hoverStats);
    results.push({ label: `${target.label}-hover`, ...hoverStats });

    await page.mouse.down();
    await page.waitForTimeout(120);
    await canvas.screenshot({ path: `tmp/ui-quality/town-toolbar/${target.label}-down-v1-1920.png` });
    const downStats = await captureStats(page, target.downKey);
    assertToolbarStats(`${target.label}-down`, downStats);
    results.push({ label: `${target.label}-down`, ...downStats });
    await page.mouse.move(40, 40);
    await page.mouse.up();
  }

  for (const target of legacyTargets) {
    await openTown(page, baseUrl);
    const box = await canvas.boundingBox();
    const point = pointInCanvas(box, target.x, target.y);
    await page.mouse.move(point.x, point.y);
    await page.waitForTimeout(120);
    await canvas.screenshot({ path: `tmp/ui-quality/town-toolbar/${target.label}-no-shared-seal-v1-1920.png` });
    const stats = await captureStats(page, sharedActionSealKey);
    assertLegacyStats(target.label, stats);
    results.push({ label: target.label, ...stats });
  }

  console.log(JSON.stringify({ ok: true, results }, null, 2));
} finally {
  await browser?.close();
  await server?.close();
}
