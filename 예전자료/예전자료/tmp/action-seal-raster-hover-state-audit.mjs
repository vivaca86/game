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
  for (const port of [4197, 4198, 4199, 4200]) {
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

async function readSceneStats(page, sceneName, underlayKey, hoverKey) {
  return page.evaluate(({ sceneName, underlayKey, hoverKey }) => {
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
      textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay: rectsAbove.length,
      visibleHoverImages: visible.filter((child) => child?.type === "Image" && child.texture?.key === hoverKey && child.alpha > 0.05).length,
      sceneKey: scene?.scene?.key
    };
  }, { sceneName, underlayKey, hoverKey });
}

await mkdir("tmp/ui-quality", { recursive: true });

const { chromium } = loadPlaywright();
const executableCandidates = [
  "C:/Users/i/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
];

const cases = [
  {
    label: "town-confirm",
    sceneName: "TownScene",
    underlayKey: "town_raster_underlay_concept",
    pathname: "/?debug=1&entry=town&resetSave=1",
    hoverX: 1010,
    hoverY: 642,
    screenshot: "tmp/ui-quality/town-raster-action-seal-hover-state-v1-1920.png"
  },
  {
    label: "rune-bench-confirm",
    sceneName: "RuneBenchScene",
    underlayKey: "rune_bench_raster_underlay_concept",
    pathname: "/?debug=1&entry=rune_bench&resetSave=1&grantRune=rune_paper_spark",
    hoverX: 1010,
    hoverY: 742,
    screenshot: "tmp/ui-quality/rune-bench-raster-action-seal-hover-state-v1-1920.png"
  },
  {
    label: "result-confirm",
    sceneName: "ResultScene",
    underlayKey: "result_raster_underlay_concept",
    pathname: "/?debug=1&entry=result&resetSave=1",
    hoverX: 1010,
    hoverY: 742,
    screenshot: "tmp/ui-quality/result-raster-action-seal-hover-state-v1-1920.png"
  },
  {
    label: "settings-control",
    sceneName: "SettingsScene",
    initialSceneName: "TownScene",
    underlayKey: "settings_raster_underlay_concept",
    pathname: "/?debug=1&entry=town&resetSave=1",
    setupClickX: 1010,
    setupClickY: 806,
    hoverX: 840,
    hoverY: 282,
    screenshot: "tmp/ui-quality/settings-raster-action-seal-hover-state-v1-1920.png"
  }
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

  const results = [];
  for (const testCase of cases) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    await page.goto(new URL(testCase.pathname, baseUrl).href, { waitUntil: "networkidle" });
    await page.waitForFunction((sceneName) => {
      const game = window.__paperGame;
      return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === sceneName));
    }, testCase.initialSceneName ?? testCase.sceneName, { timeout: 10000 });
    const canvas = page.locator("canvas");
    const box = await canvas.boundingBox();
    if (!box) throw new Error(`${testCase.label}: missing canvas`);
    if (testCase.setupClickX !== undefined && testCase.setupClickY !== undefined) {
      await page.mouse.click(box.x + (testCase.setupClickX / 1920) * box.width, box.y + (testCase.setupClickY / 1080) * box.height);
      await page.waitForFunction((sceneName) => {
        const game = window.__paperGame;
        return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === sceneName));
      }, testCase.sceneName, { timeout: 10000 });
    }
    await page.evaluate(() => {
      const overlay = document.getElementById("debug-overlay");
      if (overlay) overlay.style.display = "none";
    });

    await page.mouse.move(box.x + 8, box.y + 8);
    await page.waitForTimeout(80);
    const before = await canvas.screenshot();
    await page.mouse.move(box.x + (testCase.hoverX / 1920) * box.width, box.y + (testCase.hoverY / 1080) * box.height);
    await page.waitForTimeout(140);
    const after = await canvas.screenshot({ path: testCase.screenshot });
    const stats = await readSceneStats(page, testCase.sceneName, testCase.underlayKey, "ui_hover_action_seal_concept");
    const delta = countByteDelta(before, after);
    if (!stats.hasUnderlay || stats.textCount !== 0 || stats.visibleRectsAboveUnderlay !== 0 || stats.visibleHoverImages < 1 || delta <= 200) {
      throw new Error(JSON.stringify({ label: testCase.label, screenshot: testCase.screenshot, delta, ...stats }, null, 2));
    }
    results.push({ ...testCase, screenshot: path.resolve(testCase.screenshot), delta, ...stats });
    await page.close();
  }

  console.log(JSON.stringify({ baseUrl, results }, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}
