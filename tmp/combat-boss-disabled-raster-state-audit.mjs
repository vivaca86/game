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
    label: "combat-disabled-card",
    sceneName: "CombatScene",
    underlayKey: "combat_raster_underlay_concept",
    pathname: "/?debug=1&entry=combat&resetSave=1&handCard=card_stage_patch&handCard=card_paper_bloom&handCard=card_curtain_call",
    clickX: 540,
    clickY: 836,
    lockX: 552,
    lockY: 744,
    lockSize: 88
  },
  {
    label: "boss-disabled-card",
    sceneName: "BossScene",
    underlayKey: "boss_raster_underlay_concept",
    pathname: "/?debug=1&entry=boss&resetSave=1&handCard=card_stage_patch&handCard=card_paper_bloom&handCard=card_curtain_call",
    clickX: 540,
    clickY: 872,
    lockX: 508,
    lockY: 828,
    lockSize: 124
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
  for (const port of [4208, 4209, 4210, 4211]) {
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
  throw new Error("No free disabled combat audit port found");
}

async function waitForScene(page, sceneName) {
  await page.waitForSelector("canvas", { timeout: 20000 });
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneName, { timeout: 20000 });
}

async function openLowEnergyTarget(page, baseUrl, target) {
  await page.goto(new URL(target.pathname, baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, target.sceneName);
  await page.evaluate((sceneName) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScene?.(sceneName);
    const context = scene?.registry?.get?.("bootContext");
    if (!scene || !context?.run?.player) {
      return;
    }
    context.run.player.energy = 0;
    context.save.currentRun = {
      ...context.save.currentRun,
      playerEnergy: 0,
      hand: [...context.run.hand]
    };
    scene.scene.start(sceneName, context);
  }, target.sceneName);
  await waitForScene(page, target.sceneName);
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });
}

async function captureStats(page, target) {
  return page.evaluate(({ target }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === target.sceneName)
      ?? game?.scene?.getScene?.(target.sceneName);
    const context = scene?.registry?.get?.("bootContext");
    const children = scene?.children?.list ?? [];
    const underlayIndex = children.findIndex((child) => child?.type === "Image" && child.texture?.key === target.underlayKey);
    const underlayDepth = children[underlayIndex]?.depth ?? 0;
    const visible = children.filter((child) => child?.visible !== false && child?.alpha !== 0);
    const lockImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_disabled_lock_stamp_concept" && Number(child.alpha ?? 1) > 0.05);
    const hoverImages = visible.filter((child) => child?.type === "Image" && (
      child.texture?.key === "ui_hover_gold_seal_concept"
      || child.texture?.key === "ui_hover_boss_skull_stamp_concept"
    ) && Number(child.alpha ?? 1) > 0.05);
    const rectsAbove = visible
      .filter((child) => child?.type === "Rectangle")
      .filter((child) => child.depth > underlayDepth || children.indexOf(child) > underlayIndex)
      .filter((child) => {
        const fillAlpha = Number(child?.fillAlpha ?? child?.alpha ?? 1);
        const strokeAlpha = Number(child?.strokeAlpha ?? child?.lineAlpha ?? 0);
        const strokeWidth = Number(child?.lineWidth ?? child?.strokeWidth ?? 0);
        return (child?.isFilled && fillAlpha > 0.02) || (child?.isStroked && strokeWidth > 0 && strokeAlpha > 0.02);
      });
    const firstLock = lockImages[0];
    return {
      scene: target.sceneName,
      phase: context?.run?.phase,
      energy: context?.run?.player?.energy,
      hand: context?.run?.hand ?? [],
      log: context?.run?.log ?? [],
      hasUnderlay: underlayIndex >= 0,
      visibleLockImages: lockImages.length,
      lockAtExpectedPosition: Boolean(firstLock)
        && Math.abs(firstLock.x - target.lockX) <= 1
        && Math.abs(firstLock.y - target.lockY) <= 1,
      lockAtExpectedSize: Boolean(firstLock)
        && Math.abs(firstLock.displayWidth - target.lockSize) <= 1
        && Math.abs(firstLock.displayHeight - target.lockSize) <= 1,
      visibleHoverImages: hoverImages.length,
      textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay: rectsAbove.length
    };
  }, { target });
}

function assertInitialState(target, stats) {
  if (!stats.hasUnderlay) throw new Error(`${target.label}: missing raster underlay`);
  if (stats.energy !== 0) throw new Error(`${target.label}: expected energy=0, got ${stats.energy}`);
  if (stats.visibleLockImages < 1) throw new Error(`${target.label}: expected at least one disabled lock image`);
  if (!stats.lockAtExpectedPosition) throw new Error(`${target.label}: lock image was not positioned on the first disabled card`);
  if (!stats.lockAtExpectedSize) throw new Error(`${target.label}: lock image size does not match target card family`);
  if (stats.visibleHoverImages !== 0) throw new Error(`${target.label}: disabled card leaked hover/down image`);
  if (stats.textCount !== 0) throw new Error(`${target.label}: Phaser text leaked over raster underlay`);
  if (stats.visibleRectsAboveUnderlay !== 0) throw new Error(`${target.label}: visible rectangle overlay leaked`);
}

function assertNoBlockedAction(target, beforeStats, afterStats) {
  if (afterStats.phase !== beforeStats.phase) throw new Error(`${target.label}: disabled click changed phase ${beforeStats.phase}->${afterStats.phase}`);
  if (afterStats.energy !== beforeStats.energy) throw new Error(`${target.label}: disabled click changed energy ${beforeStats.energy}->${afterStats.energy}`);
  if (afterStats.hand.length !== beforeStats.hand.length) throw new Error(`${target.label}: disabled click changed hand length`);
  if (afterStats.log.length !== beforeStats.log.length) throw new Error(`${target.label}: disabled click added log entry`);
}

await mkdir("tmp/ui-quality/disabled", { recursive: true });

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
    await openLowEnergyTarget(page, baseUrl, target);
    await canvas.screenshot({ path: `tmp/ui-quality/disabled/${target.label}-v1-1920.png` });
    const initialStats = await captureStats(page, target);
    assertInitialState(target, initialStats);

    const box = await canvas.boundingBox();
    if (!box) throw new Error(`${target.label}: missing canvas box`);
    await page.mouse.click(box.x + (target.clickX / 1920) * box.width, box.y + (target.clickY / 1080) * box.height);
    await page.waitForTimeout(180);
    const clickStats = await captureStats(page, target);
    assertNoBlockedAction(target, initialStats, clickStats);

    await page.keyboard.press("Digit1");
    await page.waitForTimeout(180);
    const keyboardStats = await captureStats(page, target);
    assertNoBlockedAction(target, clickStats, keyboardStats);

    results.push({
      label: target.label,
      screenshot: path.resolve(`tmp/ui-quality/disabled/${target.label}-v1-1920.png`),
      initialStats,
      clickStats,
      keyboardStats
    });
  }

  console.log(JSON.stringify({ ok: true, baseUrl, results }, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}
