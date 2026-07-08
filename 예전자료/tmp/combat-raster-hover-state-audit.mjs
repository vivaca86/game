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

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    return require(`${bundledNodeModules}/playwright`);
  }
}

async function startServer() {
  for (const port of [4181, 4182, 4183, 4184]) {
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

function countByteDelta(left, right) {
  const length = Math.min(left.length, right.length);
  let delta = Math.abs(left.length - right.length);
  for (let index = 0; index < length; index += 1) {
    if (left[index] !== right[index]) delta += 1;
  }
  return delta;
}

await mkdir("tmp/ui-quality", { recursive: true });

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
  await page.goto(new URL("/?debug=1&entry=combat&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await page.waitForFunction(() => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === "CombatScene"));
  }, null, { timeout: 10000 });
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });

  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + 8, box.y + 8);
  await page.waitForTimeout(80);
  const before = await canvas.screenshot();
  await page.mouse.move(box.x + (540 / 1920) * box.width, box.y + (836 / 1080) * box.height);
  await page.waitForTimeout(140);
  const after = await canvas.screenshot({ path: "tmp/ui-quality/combat-raster-card-hover-state-v1-1920.png" });

  const stats = await page.evaluate(() => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "CombatScene")
      ?? game?.scene?.getScene?.("CombatScene");
    const children = scene?.children?.list ?? [];
    const underlayIndex = children.findIndex((child) => child?.type === "Image" && child.texture?.key === "combat_raster_underlay_concept");
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
      textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay: rectsAbove.length,
      visibleHoverImages: visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_hover_gold_seal_concept" && child.alpha > 0.05).length,
      sceneKey: scene?.scene?.key
    };
  });
  const delta = countByteDelta(before, after);
  if (!stats.hasUnderlay || stats.textCount !== 0 || stats.visibleRectsAboveUnderlay !== 0 || stats.visibleHoverImages < 1 || delta <= 200) {
    throw new Error(JSON.stringify({ ...stats, delta }, null, 2));
  }

  await page.mouse.click(box.x + (540 / 1920) * box.width, box.y + (836 / 1080) * box.height);
  await page.waitForFunction(() => {
    const overlay = document.querySelector("#debug-overlay");
    return overlay?.textContent?.includes("enemyHp=17") && overlay?.textContent?.includes("playerEnergy=2");
  }, null, { timeout: 10000 });

  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });
  await page.mouse.move(box.x + 8, box.y + 8);
  await page.waitForTimeout(80);
  const beforeEndTurn = await canvas.screenshot();
  await page.mouse.move(box.x + (1660 / 1920) * box.width, box.y + (910 / 1080) * box.height);
  await page.waitForTimeout(140);
  const afterEndTurn = await canvas.screenshot({ path: "tmp/ui-quality/combat-raster-end-turn-hover-state-v1-1920.png" });
  const endTurnStats = await page.evaluate(() => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "CombatScene")
      ?? game?.scene?.getScene?.("CombatScene");
    const children = scene?.children?.list ?? [];
    const visible = children.filter((child) => child?.visible !== false && child?.alpha !== 0);
    return {
      visibleHoverImages: visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_hover_gold_seal_concept" && child.alpha > 0.05).length
    };
  });
  const endTurnDelta = countByteDelta(beforeEndTurn, afterEndTurn);
  if (endTurnStats.visibleHoverImages < 1 || endTurnDelta <= 200) {
    throw new Error(JSON.stringify({ endTurnStats, endTurnDelta }, null, 2));
  }
  await page.mouse.click(box.x + (1660 / 1920) * box.width, box.y + (910 / 1080) * box.height);
  await page.waitForFunction(() => {
    const overlay = document.querySelector("#debug-overlay");
    return overlay?.textContent?.includes("playerHp=36") && overlay?.textContent?.includes("turn=2");
  }, null, { timeout: 10000 });
  console.log(JSON.stringify({
    baseUrl,
    cardScreenshot: path.resolve("tmp/ui-quality/combat-raster-card-hover-state-v1-1920.png"),
    endTurnScreenshot: path.resolve("tmp/ui-quality/combat-raster-end-turn-hover-state-v1-1920.png"),
    delta,
    endTurnDelta,
    ...stats
  }, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}
