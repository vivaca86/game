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
  for (const port of [4177, 4178, 4179, 4180]) {
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

const scenes = [
  {
    scene: "RewardScene",
    underlay: "reward_raster_underlay_concept",
    path: "/?debug=1&entry=reward&resetSave=1",
    shot: "tmp/ui-quality/reward-raster-textless-v1-1920.png"
  },
  {
    scene: "EventScene",
    underlay: "event_raster_underlay_concept",
    path: "/?debug=1&entry=event&resetSave=1",
    shot: "tmp/ui-quality/event-raster-textless-v1-1920.png"
  },
  {
    scene: "TownScene",
    underlay: "town_raster_underlay_concept",
    path: "/?debug=1&entry=town&resetSave=1",
    shot: "tmp/ui-quality/town-raster-textless-v1-1920.png"
  }
];

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
  const results = [];

  for (const item of scenes) {
    await page.goto(new URL(item.path, baseUrl).href, { waitUntil: "networkidle" });
    await page.waitForFunction((sceneName) => {
      const game = window.__paperGame;
      return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === sceneName));
    }, item.scene, { timeout: 10000 });
    await page.evaluate(() => {
      const overlay = document.getElementById("debug-overlay");
      if (overlay) overlay.style.display = "none";
    });
    await page.locator("canvas").screenshot({ path: item.shot });
    const stats = await page.evaluate(({ sceneName, underlay }) => {
      const game = window.__paperGame;
      const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === sceneName)
        ?? game?.scene?.getScene?.(sceneName);
      const children = scene?.children?.list ?? [];
      const visible = children.filter((child) => child?.visible !== false && child?.alpha !== 0);
      const rectAlpha = (child) => Number(child?.fillAlpha ?? child?.alpha ?? 1);
      const strokeAlpha = (child) => Number(child?.strokeAlpha ?? child?.lineAlpha ?? 0);
      const underlayIndex = children.findIndex((child) => child?.type === "Image" && child.texture?.key === underlay);
      const underlayDepth = children[underlayIndex]?.depth ?? 0;
      const rectDetails = visible
        .filter((child) => child?.type === "Rectangle")
        .map((child) => ({
          depth: child.depth ?? 0,
          afterUnderlay: children.indexOf(child) > underlayIndex,
          fillAlpha: rectAlpha(child),
          strokeAlpha: strokeAlpha(child),
          strokeWidth: Number(child?.lineWidth ?? child?.strokeWidth ?? 0),
          isFilled: Boolean(child?.isFilled),
          isStroked: Boolean(child?.isStroked),
          x: Math.round(child.x ?? 0),
          y: Math.round(child.y ?? 0),
          width: Math.round(child.width ?? 0),
          height: Math.round(child.height ?? 0)
        }));
      const isActuallyVisibleRect = (child) => (
        (child.isFilled && child.fillAlpha > 0.02)
        || (child.isStroked && child.strokeWidth > 0 && child.strokeAlpha > 0.02)
      );
      return {
        scene: sceneName,
        underlay,
        hasUnderlay: visible.some((child) => child?.type === "Image" && child.texture?.key === underlay),
        textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
        visibleRectCount: visible.filter((child) => child?.type === "Rectangle" && rectAlpha(child) > 0.02).length,
        transparentRectCount: visible.filter((child) => child?.type === "Rectangle" && rectAlpha(child) <= 0.02).length,
        visibleRectsAboveUnderlay: rectDetails.filter((child) => (
          (child.depth > underlayDepth || child.afterUnderlay)
          && isActuallyVisibleRect(child)
        )).length,
        rectDetails,
        imageKeys: visible
          .filter((child) => child?.type === "Image")
          .map((child) => child.texture?.key)
          .filter(Boolean)
      };
    }, { sceneName: item.scene, underlay: item.underlay });
    results.push({ ...stats, screenshot: path.resolve(item.shot) });
  }

  console.log(JSON.stringify({ baseUrl, results }, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}
