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
  for (const port of [4211, 4212, 4213, 4214]) {
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
  throw new Error("No free responsive audit port found");
}

const viewports = [
  { label: "desktop-1920", width: 1920, height: 1080 },
  { label: "desktop-1280", width: 1280, height: 720 },
  { label: "mobile-390x844", width: 390, height: 844 },
  { label: "mobile-landscape-844x390", width: 844, height: 390 }
];

const targets = [
  { key: "town", sceneName: "TownScene", underlay: "town_raster_underlay_concept", pathname: "/?entry=town&resetSave=1" },
  { key: "worldmap", sceneName: "WorldMapScene", underlay: "world_map_raster_underlay_concept", pathname: "/?entry=world_map&resetSave=1" },
  { key: "dungeon", sceneName: "DungeonScene", underlay: "dungeon_raster_underlay_concept", pathname: "/?entry=dungeon&resetSave=1" },
  { key: "combat", sceneName: "CombatScene", underlay: "combat_raster_underlay_concept", pathname: "/?entry=combat&resetSave=1" },
  { key: "reward", sceneName: "RewardScene", underlay: "reward_raster_underlay_concept", pathname: "/?entry=reward&resetSave=1" },
  { key: "event", sceneName: "EventScene", underlay: "event_raster_underlay_concept", pathname: "/?entry=event&resetSave=1" },
  {
    key: "runebench",
    sceneName: "RuneBenchScene",
    underlay: "rune_bench_raster_underlay_concept",
    pathname: "/?entry=rune_bench&resetSave=1&grantRune=rune_paper_spark"
  },
  { key: "boss", sceneName: "BossScene", underlay: "boss_raster_underlay_concept", pathname: "/?entry=boss&resetSave=1" },
  { key: "result", sceneName: "ResultScene", underlay: "result_raster_underlay_concept", pathname: "/?entry=result&resetSave=1" },
  {
    key: "settings",
    sceneName: "SettingsScene",
    underlay: "settings_raster_underlay_concept",
    pathname: "/?entry=town&resetSave=1",
    setup: async (page) => {
      const canvas = page.locator("canvas");
      const box = await canvas.boundingBox();
      if (!box) throw new Error("settings setup: missing canvas");
      await page.mouse.click(box.x + (1010 / 1920) * box.width, box.y + (806 / 1080) * box.height);
    }
  }
];

await mkdir("tmp/ui-quality/responsive", { recursive: true });

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

  const results = [];
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      isMobile: viewport.width < 600
    });

    for (const target of targets) {
      await page.goto(new URL(target.pathname, baseUrl).href, { waitUntil: "networkidle" });
      if (target.setup) await target.setup(page);
      await waitForScene(page, target.sceneName);
      await page.waitForSelector("#game-accessibility-summary", { timeout: 10000 });
      const screenshot = path.join("tmp", "ui-quality", "responsive", `${target.key}-${viewport.label}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });

      const audit = await page.evaluate(({ target, viewport }) => {
        const canvas = document.querySelector("#game-root canvas");
        const debugOverlay = document.getElementById("debug-overlay");
        const accessibilityRoot = document.getElementById("game-accessibility-summary");
        const game = window.__paperGame;
        const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === target.sceneName)
          ?? game?.scene?.getScene?.(target.sceneName);
        const children = scene?.children?.list ?? [];
        const underlayIndex = children.findIndex((child) => child?.type === "Image" && child.texture?.key === target.underlay);
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

        const canvasBox = canvas?.getBoundingClientRect();
        const expectedWidth = Math.min(viewport.width, viewport.height * (16 / 9));
        const expectedHeight = expectedWidth * (9 / 16);
        const accessibilityBox = accessibilityRoot?.getBoundingClientRect();
        return {
          scene: target.sceneName,
          hasCanvas: Boolean(canvasBox),
          canvasRole: canvas?.getAttribute("role") ?? "",
          canvasLabelLength: canvas?.getAttribute("aria-label")?.length ?? 0,
          canvasX: canvasBox?.x ?? 0,
          canvasY: canvasBox?.y ?? 0,
          canvasWidth: canvasBox?.width ?? 0,
          canvasHeight: canvasBox?.height ?? 0,
          expectedWidth,
          expectedHeight,
          fitsViewport: Boolean(
            canvasBox
            && canvasBox.x >= -1
            && canvasBox.y >= -1
            && canvasBox.right <= viewport.width + 1
            && canvasBox.bottom <= viewport.height + 1
          ),
          sizeMatchesFit: Boolean(
            canvasBox
            && Math.abs(canvasBox.width - expectedWidth) <= 2
            && Math.abs(canvasBox.height - expectedHeight) <= 2
          ),
          hasUnderlay: underlayIndex >= 0,
          visibleTextCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
          visibleRectsAboveUnderlay: rectsAbove.length,
          debugOverlayVisible: debugOverlay?.dataset.visible === "true" || debugOverlay?.style.display !== "",
          accessibilityScene: accessibilityRoot?.dataset.scene ?? "",
          accessibilityHidden: Boolean(
            accessibilityBox
            && accessibilityBox.width <= 2
            && accessibilityBox.height <= 2
            && window.getComputedStyle(accessibilityRoot).position === "fixed"
          )
        };
      }, {
        target: {
          key: target.key,
          sceneName: target.sceneName,
          underlay: target.underlay
        },
        viewport
      });

      if (!audit.hasCanvas || audit.canvasRole !== "img" || audit.canvasLabelLength < 20) {
        throw new Error(`${target.sceneName}/${viewport.label}: canvas accessibility mismatch ${JSON.stringify(audit)}`);
      }
      if (!audit.fitsViewport || !audit.sizeMatchesFit) {
        throw new Error(`${target.sceneName}/${viewport.label}: canvas does not fit viewport ${JSON.stringify(audit)}`);
      }
      if (!audit.hasUnderlay || audit.visibleTextCount !== 0 || audit.visibleRectsAboveUnderlay !== 0) {
        throw new Error(`${target.sceneName}/${viewport.label}: raster layer leak ${JSON.stringify(audit)}`);
      }
      if (audit.debugOverlayVisible || audit.accessibilityScene !== target.sceneName || !audit.accessibilityHidden) {
        throw new Error(`${target.sceneName}/${viewport.label}: DOM overlay mismatch ${JSON.stringify(audit)}`);
      }

      results.push({
        scene: target.sceneName,
        viewport: viewport.label,
        canvas: `${Math.round(audit.canvasWidth)}x${Math.round(audit.canvasHeight)}`,
        screenshot: path.resolve(screenshot)
      });
    }

    await page.close();
  }

  console.log(JSON.stringify({ ok: true, baseUrl, results }, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}

async function waitForScene(page, sceneName) {
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneName, { timeout: 10000 });
}
