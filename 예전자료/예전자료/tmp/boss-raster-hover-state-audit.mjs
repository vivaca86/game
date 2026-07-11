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
  for (const port of [4185, 4186, 4187, 4188]) {
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
  await page.goto(new URL("/?debug=1&entry=boss&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await page.waitForFunction(() => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === "BossScene"));
  }, null, { timeout: 10000 });

  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  const auditHover = async (sceneX, sceneY, screenshot) => {
    await page.evaluate(() => {
      const overlay = document.getElementById("debug-overlay");
      if (overlay) overlay.style.display = "none";
    });
    await page.mouse.move(box.x + 8, box.y + 8);
    await page.waitForTimeout(80);
    const before = await canvas.screenshot();
    await page.mouse.move(box.x + (sceneX / 1920) * box.width, box.y + (sceneY / 1080) * box.height);
    await page.waitForTimeout(140);
    const after = await canvas.screenshot({ path: screenshot });
    const stats = await page.evaluate(() => {
      const game = window.__paperGame;
      const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "BossScene")
        ?? game?.scene?.getScene?.("BossScene");
      const children = scene?.children?.list ?? [];
      const underlayIndex = children.findIndex((child) => child?.type === "Image" && child.texture?.key === "boss_raster_underlay_concept");
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
        visibleHoverImages: visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_hover_boss_skull_stamp_concept" && child.alpha > 0.05).length,
        sceneKey: scene?.scene?.key
      };
    });
    const delta = countByteDelta(before, after);
    if (!stats.hasUnderlay || stats.textCount !== 0 || stats.visibleRectsAboveUnderlay !== 0 || stats.visibleHoverImages < 1 || delta <= 200) {
      throw new Error(JSON.stringify({ screenshot, delta, ...stats }, null, 2));
    }
    return { screenshot: path.resolve(screenshot), delta, ...stats };
  };

  const cardStats = await auditHover(540, 872, "tmp/ui-quality/boss-raster-card-hover-state-v1-1920.png");
  const readDebugMap = () => page.evaluate(() => {
    const entries = Array.from(document.querySelectorAll("#debug-overlay span"))
      .map((span) => span.textContent ?? "")
      .map((item) => {
        const index = item.indexOf("=");
        return index >= 0 ? [item.slice(0, index), item.slice(index + 1)] : [item, ""];
      });
    return Object.fromEntries(entries);
  });
  const initial = await readDebugMap();
  await page.mouse.click(box.x + (540 / 1920) * box.width, box.y + (872 / 1080) * box.height);
  await page.waitForFunction(([initialEnemyHp, initialEnergy]) => {
    const entries = Array.from(document.querySelectorAll("#debug-overlay span"))
      .map((span) => span.textContent ?? "")
      .map((item) => {
        const index = item.indexOf("=");
        return index >= 0 ? [item.slice(0, index), item.slice(index + 1)] : [item, ""];
      });
    const current = Object.fromEntries(entries);
    return current.enemyHp !== initialEnemyHp || current.playerEnergy !== initialEnergy || String(current.log ?? "").includes("card");
  }, [initial.enemyHp, initial.playerEnergy], { timeout: 10000 });

  const endTurnStats = await auditHover(1750, 960, "tmp/ui-quality/boss-raster-end-turn-hover-state-v1-1920.png");
  await page.mouse.click(box.x + (1750 / 1920) * box.width, box.y + (960 / 1080) * box.height);
  await page.waitForFunction(() => {
    const overlay = document.querySelector("#debug-overlay");
    return overlay?.textContent?.includes("turn=2");
  }, null, { timeout: 10000 });

  console.log(JSON.stringify({
    baseUrl,
    card: cardStats,
    endTurn: endTurnStats
  }, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}
