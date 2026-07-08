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
  label: "settings-keyboard-cancel",
  sceneName: "SettingsScene",
  underlayKey: "settings_raster_underlay_concept",
  downKey: "ui_down_settings_return_button_concept"
};

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
  throw new Error("No free audit port found");
}

async function waitForScene(page, sceneName) {
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneName, { timeout: 10000 });
}

async function openSettings(page, baseUrl) {
  await page.goto(new URL("/?debug=1&entry=town&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, "TownScene");
  await page.waitForSelector("canvas", { timeout: 10000 });
  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("missing canvas");

  await page.mouse.click(box.x + (1010 / 1920) * box.width, box.y + (806 / 1080) * box.height);
  await waitForScene(page, target.sceneName);
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });
  return { canvas };
}

async function captureStats(page) {
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
  if (stats.visibleDownImages !== 1) throw new Error(`${label}: expected one visible keyboard cancel down image, got ${stats.visibleDownImages}`);
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
  const { canvas } = await openSettings(page, baseUrl);

  await page.keyboard.down("Escape");
  await page.waitForTimeout(10);
  const stats = await captureStats(page);
  assertState(target.label, stats);
  await setScenePaused(page, target.sceneName, true);
  const screenshot = `tmp/ui-quality/keyboard-actions/${target.label}-down-v1-1920.png`;
  await canvas.screenshot({ path: screenshot });
  await setScenePaused(page, target.sceneName, false);
  await page.keyboard.up("Escape");
  await page.waitForTimeout(180);
  await waitForScene(page, "TownScene");

  console.log(JSON.stringify({ ok: true, result: { label: target.label, key: "Escape", screenshot: path.resolve(screenshot), ...stats } }, null, 2));
} finally {
  await browser?.close();
  await server?.close();
}
