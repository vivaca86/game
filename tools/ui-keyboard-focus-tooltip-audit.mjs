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
    key: "town",
    sceneName: "TownScene",
    pathname: "/?entry=town&resetSave=1",
    focusKeys: ["ArrowDown"],
    focusRegistryKey: "townRasterFocusId",
    expectedFocusValue: "expedition"
  },
  {
    key: "dungeon",
    sceneName: "DungeonScene",
    pathname: "/?entry=dungeon&resetSave=1",
    focusKeys: ["ArrowDown"],
    focusRegistryKey: "dungeonRasterFocusId",
    expectedFocusValue: "room_node"
  },
  {
    key: "combat",
    sceneName: "CombatScene",
    pathname: "/?entry=combat&resetSave=1",
    focusKeys: ["ArrowDown"],
    focusRegistryKey: "combatRasterFocusId",
    expectedFocusValue: "card_1"
  },
  {
    key: "reward",
    sceneName: "RewardScene",
    pathname: "/?entry=reward&resetSave=1",
    focusKeys: ["ArrowDown"],
    focusRegistryKey: "rewardRasterFocusIndex",
    expectedFocusValue: 0
  },
  {
    key: "event",
    sceneName: "EventScene",
    pathname: "/?data=release&entry=event&resetSave=1&stage=stage_sunny_gate",
    focusKeys: ["ArrowDown"],
    focusRegistryKey: "eventRasterFocusIndex",
    expectedFocusValue: 0
  },
  {
    key: "runebench",
    sceneName: "RuneBenchScene",
    pathname: "/?entry=rune_bench&resetSave=1&grantRune=rune_paper_spark",
    focusKeys: ["ArrowDown"],
    focusRegistryKey: "runeBenchRasterFocusId",
    expectedFocusValue: "actionRail"
  },
  {
    key: "boss",
    sceneName: "BossScene",
    pathname: "/?entry=boss&resetSave=1",
    focusKeys: ["ArrowDown"],
    focusRegistryKey: "bossRasterFocusId",
    expectedFocusValue: "card_1"
  },
  {
    key: "result",
    sceneName: "ResultScene",
    pathname: "/?entry=result&resetSave=1",
    focusKeys: ["ArrowDown"],
    focusRegistryKey: "resultRasterFocusId",
    expectedFocusValue: "actionCard"
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
    focusKeys: ["ArrowDown"],
    focusRegistryKey: "settingsRasterFocusId",
    expectedFocusValue: "volumeMaster"
  }
];

const viewports = [
  { key: "desktop-1920", suffix: "1920", width: 1920, height: 1080, minWidth: 260, minHeight: 60, maxWidthRatio: 0.42, maxHeightRatio: 0.34, allowLetterbox: false },
  { key: "desktop-1280", suffix: "desktop-1280", width: 1280, height: 720, minWidth: 240, minHeight: 58, maxWidthRatio: 0.48, maxHeightRatio: 0.34, allowLetterbox: false },
  { key: "mobile-390x844", suffix: "mobile-390x844", width: 390, height: 844, minWidth: 210, minHeight: 48, maxWidthRatio: 0.82, maxHeightRatio: 0.5, allowLetterbox: true }
];

await mkdir("tmp/ui-quality/focus-tooltips", { recursive: true });

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
  browser = await launchBrowser();

  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const results = [];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const target of targets) {
      await page.goto(new URL(target.pathname, baseUrl).href, { waitUntil: "networkidle" });
      await page.waitForSelector("canvas", { timeout: 10000 });
      if (target.setup) await target.setup(page);
      await waitForScene(page, target.sceneName);
      await hideDebugOverlay(page);

      const initial = await readTooltip(page);
      if (initial.visible) {
        throw new Error(`${target.key}/${viewport.key}: tooltip visible before keyboard focus`);
      }

      for (const key of target.focusKeys) {
        await page.keyboard.press(key);
        await page.waitForTimeout(90);
      }

      await page.waitForSelector("#game-readability-tooltip[data-visible='true']", { timeout: 5000 });
      const audit = await readTooltip(page, target.focusRegistryKey);
      assertTooltip(`${target.key}/${viewport.key}`, audit, target, viewport);

      const screenshot = path.join("tmp", "ui-quality", "focus-tooltips", `${target.key}-focus-tooltip-v1-${viewport.suffix}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({
        scene: target.sceneName,
        viewport: viewport.key,
        focusValue: audit.focusValue,
        titleLength: audit.title.length,
        bodyLength: audit.body.length,
        size: `${Math.round(audit.width)}x${Math.round(audit.height)}`,
        screenshot: path.resolve(screenshot)
      });

      await page.mouse.move(4, 4);
      await page.keyboard.press("Escape").catch(() => undefined);
    }
  }

  console.log(JSON.stringify({ ok: true, baseUrl, results }, null, 2));
} finally {
  await browser?.close();
  await server?.close();
}

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    return require(`${bundledNodeModules}/playwright`);
  }
}

async function startServer() {
  for (const port of [4240, 4241, 4242, 4243, 4244]) {
    try {
      const viteServer = await createServer({
        root: process.cwd(),
        logLevel: "silent",
        server: { host: "127.0.0.1", port, strictPort: true }
      });
      await viteServer.listen();
      return { server: viteServer, baseUrl: `http://127.0.0.1:${port}/` };
    } catch (error) {
      if (!String(error?.message ?? error).includes("Port")) throw error;
    }
  }
  throw new Error("No free keyboard focus tooltip audit port found");
}

async function launchBrowser() {
  let launchError;
  for (const executablePath of [null, ...executableCandidates]) {
    try {
      return await chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true });
    } catch (error) {
      launchError = error;
    }
  }
  throw launchError;
}

async function waitForScene(page, sceneName) {
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneName, { timeout: 10000 });
}

async function hideDebugOverlay(page) {
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });
}

async function readTooltip(page, focusRegistryKey) {
  return page.evaluate(({ focusRegistryKey }) => {
    const root = document.getElementById("game-readability-tooltip");
    const canvas = document.querySelector("#game-root canvas");
    const game = window.__paperGame;
    if (!root || !canvas) {
      return {
        ok: false,
        reason: "missing tooltip or canvas",
        visible: false,
        title: "",
        body: "",
        focusValue: undefined
      };
    }
    const rootBox = root.getBoundingClientRect();
    const canvasBox = canvas.getBoundingClientRect();
    const style = window.getComputedStyle(root);
    const title = root.querySelector("strong")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const body = root.querySelector("span")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    return {
      ok: true,
      role: root.getAttribute("role"),
      live: root.getAttribute("aria-live"),
      visible: root.dataset.visible === "true",
      scene: root.dataset.scene,
      tone: root.dataset.tone,
      title,
      body,
      width: rootBox.width,
      height: rootBox.height,
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
      pointerEvents: style.pointerEvents,
      zIndex: Number(style.zIndex),
      canvasRole: canvas.getAttribute("role") ?? "",
      canvasLabelLength: canvas.getAttribute("aria-label")?.length ?? 0,
      focusValue: focusRegistryKey ? game?.registry?.get?.(focusRegistryKey) : undefined
    };
  }, { focusRegistryKey });
}

function assertTooltip(label, audit, target, viewport) {
  if (!audit.ok) throw new Error(`${label}: ${audit.reason ?? "tooltip audit failed"}`);
  if (audit.role !== "tooltip") throw new Error(`${label}: expected role=tooltip, got ${audit.role}`);
  if (audit.live !== "polite") throw new Error(`${label}: expected aria-live=polite, got ${audit.live}`);
  if (!audit.visible) throw new Error(`${label}: tooltip is not visible`);
  if (audit.scene !== target.sceneName) throw new Error(`${label}: expected scene ${target.sceneName}, got ${audit.scene}`);
  if (audit.focusValue !== target.expectedFocusValue) {
    throw new Error(`${label}: expected focus ${target.expectedFocusValue}, got ${audit.focusValue}`);
  }
  if (!["default", "confirm", "choice", "danger"].includes(audit.tone)) {
    throw new Error(`${label}: unexpected tooltip tone ${audit.tone}`);
  }
  if (audit.title.length < 2) throw new Error(`${label}: title too short (${audit.title.length})`);
  if (audit.body.length < 6) throw new Error(`${label}: body too short (${audit.body.length})`);
  if (audit.width < viewport.minWidth || audit.height < viewport.minHeight) {
    throw new Error(`${label}: tooltip too small ${audit.width}x${audit.height}`);
  }
  if (audit.widthRatio > viewport.maxWidthRatio || audit.heightRatio > viewport.maxHeightRatio) {
    throw new Error(`${label}: tooltip too large ${audit.widthRatio.toFixed(2)}x${audit.heightRatio.toFixed(2)}`);
  }
  if (!audit.inViewport) throw new Error(`${label}: tooltip outside viewport`);
  if (viewport.allowLetterbox ? audit.overlapsCanvas : !audit.inCanvas) {
    throw new Error(`${label}: unsafe tooltip placement ${JSON.stringify({
      inCanvas: audit.inCanvas,
      overlapsCanvas: audit.overlapsCanvas,
      viewport: viewport.key
    })}`);
  }
  if (audit.pointerEvents !== "none") throw new Error(`${label}: expected pointer-events none, got ${audit.pointerEvents}`);
  if (audit.zIndex < 8) throw new Error(`${label}: z-index too low ${audit.zIndex}`);
  if (audit.canvasRole !== "img") throw new Error(`${label}: expected canvas role img, got ${audit.canvasRole}`);
  if (audit.canvasLabelLength < 20) throw new Error(`${label}: canvas aria-label too short (${audit.canvasLabelLength})`);
}
