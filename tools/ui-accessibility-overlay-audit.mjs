import { createRequire } from "node:module";
import Module from "node:module";
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
  for (const port of [4201, 4202, 4203, 4204]) {
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
  throw new Error("No free accessibility audit port found");
}

const targets = [
  { sceneName: "TownScene", title: "마을", pathname: "/?entry=town&resetSave=1" },
  { sceneName: "WorldMapScene", title: "세계 지도", pathname: "/?entry=world_map&resetSave=1" },
  { sceneName: "DungeonScene", title: "던전 경로", pathname: "/?entry=dungeon&resetSave=1" },
  { sceneName: "CombatScene", title: "전투", pathname: "/?entry=combat&resetSave=1" },
  { sceneName: "RewardScene", title: "보상", pathname: "/?entry=reward&resetSave=1" },
  { sceneName: "EventScene", title: "이벤트", pathname: "/?entry=event&resetSave=1" },
  { sceneName: "RuneBenchScene", title: "보석 작업대", pathname: "/?entry=rune_bench&resetSave=1&grantRune=rune_paper_spark" },
  { sceneName: "BossScene", title: "보스 전투", pathname: "/?entry=boss&resetSave=1" },
  { sceneName: "ResultScene", title: "결과", pathname: "/?entry=result&resetSave=1" },
  {
    sceneName: "SettingsScene",
    title: "설정",
    pathname: "/?entry=town&resetSave=1",
    setup: async (page) => {
      const canvas = page.locator("canvas");
      const box = await canvas.boundingBox();
      if (!box) throw new Error("SettingsScene setup: missing canvas");
      await page.mouse.click(box.x + (1010 / 1920) * box.width, box.y + (806 / 1080) * box.height);
    }
  }
];

const viewports = [
  { key: "desktop-1920", width: 1920, height: 1080 },
  { key: "desktop-1280", width: 1280, height: 720 },
  { key: "mobile-390x844", width: 390, height: 844 },
  { key: "mobile-landscape-844x390", width: 844, height: 390 }
];

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

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const results = [];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const target of targets) {
      await page.goto(new URL(target.pathname, baseUrl).href, { waitUntil: "networkidle" });
      if (target.setup) await target.setup(page);
      await page.waitForFunction((expectedScene) => {
        const game = window.__paperGame;
        return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
      }, target.sceneName, { timeout: 10000 });
      await page.waitForSelector("#game-accessibility-summary", { timeout: 10000 });
      await page.waitForFunction(() => {
        const canvas = document.querySelector("#game-root canvas");
        return Boolean(canvas?.getAttribute("aria-label"));
      }, { timeout: 10000 });

      const audit = await page.evaluate(() => {
        const root = document.getElementById("game-accessibility-summary");
        const canvas = document.querySelector("#game-root canvas");
        if (!root || !canvas) return { ok: false, reason: "missing root or canvas" };

        const rootStyle = window.getComputedStyle(root);
        const rootBox = root.getBoundingClientRect();
        const rootLabel = root.getAttribute("aria-label") ?? "";
        const canvasLabel = canvas.getAttribute("aria-label") ?? "";
        const childText = root.textContent ?? "";
        return {
          ok: true,
          scene: root.dataset.scene,
          title: root.dataset.title,
          role: root.getAttribute("role"),
          live: root.getAttribute("aria-live"),
          atomic: root.getAttribute("aria-atomic"),
          canvasRole: canvas.getAttribute("role"),
          rootLabel,
          canvasLabel,
          childText,
          rootWidth: rootBox.width,
          rootHeight: rootBox.height,
          position: rootStyle.position,
          clipPath: rootStyle.clipPath
        };
      });

      if (
        !audit.ok
        || audit.scene !== target.sceneName
        || audit.title !== target.title
        || audit.role !== "status"
        || audit.live !== "polite"
        || audit.atomic !== "true"
        || audit.canvasRole !== "img"
        || audit.rootLabel !== audit.canvasLabel
        || !audit.rootLabel.includes(target.title)
        || !audit.childText.includes(target.title)
        || audit.rootWidth > 2
        || audit.rootHeight > 2
        || audit.position !== "fixed"
        || !audit.clipPath.includes("inset")
      ) {
        throw new Error(`${target.sceneName}/${viewport.key}: invalid accessibility overlay ${JSON.stringify(audit, null, 2)}`);
      }

      results.push({
        scene: target.sceneName,
        viewport: viewport.key,
        title: target.title,
        labelLength: audit.rootLabel.length,
        hiddenBox: `${audit.rootWidth}x${audit.rootHeight}`
      });
    }
  }

  console.log(JSON.stringify({ ok: true, baseUrl, results }, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}
