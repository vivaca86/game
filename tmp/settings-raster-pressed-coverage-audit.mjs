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
  for (const port of [4205, 4206, 4207, 4208]) {
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

async function readSceneStats(page, expectedDownKey) {
  return page.evaluate((downKey) => {
    const sceneName = "SettingsScene";
    const underlayKey = "settings_raster_underlay_concept";
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === sceneName)
      ?? game?.scene?.getScene?.(sceneName);
    const children = scene?.children?.list ?? [];
    const underlayIndex = children.findIndex((child) => child?.type === "Image" && child.texture?.key === underlayKey);
    const underlayDepth = children[underlayIndex]?.depth ?? 0;
    const visible = children.filter((child) => child?.visible !== false && child?.alpha !== 0);
    const visibleRectsAboveUnderlay = visible
      .filter((child) => child?.type === "Rectangle")
      .filter((child) => child.depth > underlayDepth || children.indexOf(child) > underlayIndex)
      .filter((child) => {
        const fillAlpha = Number(child?.fillAlpha ?? child?.alpha ?? 1);
        const strokeAlpha = Number(child?.strokeAlpha ?? child?.lineAlpha ?? 0);
        const strokeWidth = Number(child?.lineWidth ?? child?.strokeWidth ?? 0);
        return (child?.isFilled && fillAlpha > 0.02) || (child?.isStroked && strokeWidth > 0 && strokeAlpha > 0.02);
      })
      .length;
    return {
      hasUnderlay: underlayIndex >= 0,
      textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay,
      visibleDownImages: visible.filter((child) => child?.type === "Image" && child.texture?.key === downKey && child.alpha > 0.05).length,
      sceneKey: scene?.scene?.key
    };
  }, expectedDownKey);
}

await mkdir("tmp/ui-quality/settings-pressed-coverage", { recursive: true });

const { chromium } = loadPlaywright();
const executableCandidates = [
  "C:/Users/i/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
];

const targets = [
  { label: "volume-master", x: 840, y: 282 },
  { label: "volume-music", x: 840, y: 372 },
  { label: "volume-sfx", x: 840, y: 462 },
  { label: "display-mode", x: 1360, y: 282 },
  { label: "large-text", x: 1360, y: 372 },
  { label: "reduced-motion", x: 1360, y: 462 },
  { label: "space-confirm", x: 1360, y: 640 },
  { label: "reset-save", x: 1626, y: 520 },
  { label: "reset-defaults", x: 1626, y: 696 },
  { label: "return-town", x: 1688, y: 958, downKey: "ui_down_settings_return_button_concept" }
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
  await page.goto(new URL("/?debug=1&entry=town&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas", { timeout: 10000 });
  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("missing canvas");

  await page.mouse.click(box.x + (1010 / 1920) * box.width, box.y + (806 / 1080) * box.height);
  await page.waitForFunction(() => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === "SettingsScene"));
  }, null, { timeout: 10000 });
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });

  const results = [];
  for (const target of targets) {
    await page.mouse.move(box.x + 8, box.y + 8);
    await page.waitForTimeout(80);
    const before = await canvas.screenshot();
    await page.mouse.move(box.x + (target.x / 1920) * box.width, box.y + (target.y / 1080) * box.height);
    await page.waitForTimeout(80);
    await page.mouse.down();
    await page.waitForTimeout(140);
    const screenshot = `tmp/ui-quality/settings-pressed-coverage/${target.label}-v1-1920.png`;
    const after = await canvas.screenshot({ path: screenshot });
    const stats = await readSceneStats(page, target.downKey ?? "ui_hover_action_seal_concept");
    const delta = countByteDelta(before, after);
    await page.mouse.move(box.x + 8, box.y + 8);
    await page.waitForTimeout(80);
    await page.mouse.up();

    if (!stats.hasUnderlay || stats.textCount !== 0 || stats.visibleRectsAboveUnderlay !== 0 || stats.visibleDownImages !== 1 || delta <= 200) {
      throw new Error(JSON.stringify({ label: target.label, screenshot, delta, ...stats }, null, 2));
    }
    results.push({ ...target, screenshot: path.resolve(screenshot), delta, ...stats });
  }

  console.log(JSON.stringify({ baseUrl, results }, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}
