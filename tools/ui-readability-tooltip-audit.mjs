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
  for (const port of [4221, 4222, 4223, 4224]) {
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
  throw new Error("No free readability tooltip audit port found");
}

const targets = [
  {
    key: "town",
    sceneName: "TownScene",
    pathname: "/?entry=town&resetSave=1",
    hover: { x: 1010, y: 642 },
    expectedTitle: "탐험 준비"
  },
  {
    key: "worldmap",
    sceneName: "WorldMapScene",
    pathname: "/?entry=world_map&resetSave=1",
    hover: { x: 1576, y: 970 },
    expectedTitle: "던전 진입"
  },
  {
    key: "dungeon",
    sceneName: "DungeonScene",
    pathname: "/?entry=dungeon&resetSave=1",
    hover: { x: 1010, y: 582 },
    expectedTitle: "방 진입"
  },
  {
    key: "combat",
    sceneName: "CombatScene",
    pathname: "/?entry=combat&resetSave=1",
    hover: { x: 540, y: 836 },
    expectedTitleIncludes: "비용"
  },
  {
    key: "reward",
    sceneName: "RewardScene",
    pathname: "/?entry=reward&resetSave=1",
    hover: { x: 528, y: 630 },
    minTitleLength: 2
  },
  {
    key: "event",
    sceneName: "EventScene",
    pathname: "/?entry=event&resetSave=1",
    hover: { x: 530, y: 770 },
    minTitleLength: 2
  },
  {
    key: "runebench",
    sceneName: "RuneBenchScene",
    pathname: "/?entry=rune_bench&resetSave=1&grantRune=rune_paper_spark",
    hover: { x: 1010, y: 742 },
    expectedTitle: "보석 작업"
  },
  {
    key: "boss",
    sceneName: "BossScene",
    pathname: "/?entry=boss&resetSave=1",
    hover: { x: 540, y: 872 },
    expectedTitleIncludes: "비용"
  },
  {
    key: "result",
    sceneName: "ResultScene",
    pathname: "/?entry=result&resetSave=1",
    hover: { x: 1010, y: 742 },
    expectedTitle: "결과 확인"
  },
  {
    key: "settings",
    sceneName: "SettingsScene",
    pathname: "/?entry=town&resetSave=1",
    setup: async (page) => {
      const canvas = page.locator("canvas");
      const box = await canvas.boundingBox();
      if (!box) throw new Error("settings setup: missing canvas");
      await page.mouse.click(box.x + (1010 / 1920) * box.width, box.y + (806 / 1080) * box.height);
    },
    hover: { x: 840, y: 282 },
    expectedTitle: "전체 음량"
  }
];

const viewports = [
  { key: "desktop-1920", suffix: "1920", width: 1920, height: 1080, minWidth: 260, minHeight: 60, maxWidthRatio: 0.42, maxHeightRatio: 0.34, allowLetterbox: false },
  { key: "desktop-1280", suffix: "desktop-1280", width: 1280, height: 720, minWidth: 240, minHeight: 58, maxWidthRatio: 0.48, maxHeightRatio: 0.34, allowLetterbox: false },
  { key: "mobile-390x844", suffix: "mobile-390x844", width: 390, height: 844, minWidth: 210, minHeight: 48, maxWidthRatio: 0.82, maxHeightRatio: 0.5, allowLetterbox: true }
];

await mkdir("tmp/ui-quality/readability-tooltips", { recursive: true });

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

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const target of targets) {
      await page.goto(new URL(target.pathname, baseUrl).href, { waitUntil: "networkidle" });
      if (target.setup) await target.setup(page);
      await waitForScene(page, target.sceneName);
      await page.waitForSelector("canvas", { timeout: 10000 });

      const initial = await page.evaluate(() => {
        const root = document.getElementById("game-readability-tooltip");
        return {
          exists: Boolean(root),
          visible: root?.dataset.visible === "true"
        };
      });
      if (initial.visible) {
        throw new Error(`${target.sceneName}/${viewport.key}: tooltip visible before hover`);
      }

      const canvas = page.locator("canvas");
      const box = await canvas.boundingBox();
      if (!box) throw new Error(`${target.sceneName}/${viewport.key}: missing canvas box`);
      await page.mouse.move(
        box.x + (target.hover.x / 1920) * box.width,
        box.y + (target.hover.y / 1080) * box.height
      );
      await page.waitForSelector("#game-readability-tooltip[data-visible='true']", { timeout: 5000 });

      const auditTarget = {
        expectedTitle: target.expectedTitle,
        expectedTitleIncludes: target.expectedTitleIncludes,
        minTitleLength: target.minTitleLength
      };
      const audit = await page.evaluate(({ target }) => {
        const root = document.getElementById("game-readability-tooltip");
        const canvas = document.querySelector("#game-root canvas");
        if (!root || !canvas) return { ok: false, reason: "missing tooltip or canvas" };
        const rootBox = root.getBoundingClientRect();
        const canvasBox = canvas.getBoundingClientRect();
        const title = root.dataset.title ?? "";
        const body = root.textContent?.replace(/\s+/g, " ").trim() ?? "";
        return {
          ok: true,
          role: root.getAttribute("role"),
          live: root.getAttribute("aria-live"),
          visible: root.dataset.visible === "true",
          scene: root.dataset.scene,
          title,
          body,
          width: rootBox.width,
          height: rootBox.height,
          left: rootBox.left,
          top: rootBox.top,
          canvasWidth: canvasBox.width,
          canvasHeight: canvasBox.height,
          widthRatio: rootBox.width / canvasBox.width,
          heightRatio: rootBox.height / canvasBox.height,
          inViewport: rootBox.left >= 0
            && rootBox.top >= 0
            && rootBox.right <= window.innerWidth
            && rootBox.bottom <= window.innerHeight,
          inCanvas: rootBox.left >= canvasBox.left - 1
            && rootBox.top >= canvasBox.top - 1
            && rootBox.right <= canvasBox.right + 1
            && rootBox.bottom <= canvasBox.bottom + 1,
          overlapsCanvas: !(rootBox.right <= canvasBox.left
            || rootBox.left >= canvasBox.right
            || rootBox.bottom <= canvasBox.top
            || rootBox.top >= canvasBox.bottom),
          pointerEvents: window.getComputedStyle(root).pointerEvents,
          zIndex: Number(window.getComputedStyle(root).zIndex),
          canvasRole: canvas.getAttribute("role") ?? "",
          canvasLabelLength: canvas.getAttribute("aria-label")?.length ?? 0,
          expectedTitle: target.expectedTitle,
          expectedTitleIncludes: target.expectedTitleIncludes,
          minTitleLength: target.minTitleLength ?? 1
        };
      }, { target: auditTarget });

      const titleMatches = target.expectedTitle
        ? audit.title === target.expectedTitle
        : target.expectedTitleIncludes
          ? audit.title.includes(target.expectedTitleIncludes)
          : audit.title.length >= (target.minTitleLength ?? 1);
      if (
        !audit.ok
        || audit.role !== "tooltip"
        || audit.live !== "polite"
        || !audit.visible
        || audit.scene !== target.sceneName
        || !titleMatches
        || audit.title.length < (target.minTitleLength ?? 1)
        || audit.body.length < audit.title.length + 8
        || audit.width < viewport.minWidth
        || audit.height < viewport.minHeight
        || audit.widthRatio > viewport.maxWidthRatio
        || audit.heightRatio > viewport.maxHeightRatio
        || !audit.inViewport
        || (viewport.allowLetterbox ? audit.overlapsCanvas : !audit.inCanvas)
        || audit.pointerEvents !== "none"
        || audit.zIndex < 8
        || audit.canvasRole !== "img"
        || audit.canvasLabelLength < 20
      ) {
        throw new Error(`${target.sceneName}/${viewport.key}: invalid readability tooltip ${JSON.stringify(audit, null, 2)}`);
      }

      const screenshot = path.join("tmp", "ui-quality", "readability-tooltips", `${target.key}-tooltip-v1-${viewport.suffix}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({
        scene: target.sceneName,
        viewport: viewport.key,
        title: audit.title,
        size: `${Math.round(audit.width)}x${Math.round(audit.height)}`,
        canvas: `${Math.round(audit.canvasWidth)}x${Math.round(audit.canvasHeight)}`,
        coverage: `${audit.widthRatio.toFixed(2)}x${audit.heightRatio.toFixed(2)}`,
        screenshot: path.resolve(screenshot)
      });

      await page.mouse.move(4, 4);
    }
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
