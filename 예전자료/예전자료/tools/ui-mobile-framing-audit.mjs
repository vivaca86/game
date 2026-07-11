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
  { key: "town", sceneName: "TownScene", pathname: "/?entry=town&resetSave=1" },
  { key: "worldmap", sceneName: "WorldMapScene", pathname: "/?entry=world_map&resetSave=1" },
  { key: "dungeon", sceneName: "DungeonScene", pathname: "/?entry=dungeon&resetSave=1" },
  { key: "combat", sceneName: "CombatScene", pathname: "/?entry=combat&resetSave=1" },
  { key: "reward", sceneName: "RewardScene", pathname: "/?entry=reward&resetSave=1" },
  { key: "event", sceneName: "EventScene", pathname: "/?entry=event&resetSave=1" },
  {
    key: "runebench",
    sceneName: "RuneBenchScene",
    pathname: "/?entry=rune_bench&resetSave=1&grantRune=rune_paper_spark"
  },
  { key: "boss", sceneName: "BossScene", pathname: "/?entry=boss&resetSave=1" },
  { key: "result", sceneName: "ResultScene", pathname: "/?entry=result&resetSave=1" },
  {
    key: "settings",
    sceneName: "SettingsScene",
    pathname: "/?entry=town&resetSave=1",
    setup: async (page) => {
      const canvas = page.locator("canvas");
      const box = await canvas.boundingBox();
      if (!box) throw new Error("settings setup: missing canvas");
      await page.mouse.click(box.x + (1010 / 1920) * box.width, box.y + (806 / 1080) * box.height);
    }
  }
];

const viewports = [
  { key: "mobile-390x844", suffix: "mobile-390x844", width: 390, height: 844, expectVisible: true },
  { key: "desktop-1920", suffix: "desktop-1920", width: 1920, height: 1080, expectVisible: false },
  { key: "desktop-1280", suffix: "desktop-1280", width: 1280, height: 720, expectVisible: false },
  { key: "mobile-landscape-844x390", suffix: "mobile-landscape-844x390", width: 844, height: 390, expectVisible: false }
];

await mkdir("tmp/ui-quality/mobile-framing", { recursive: true });

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

  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const results = [];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const target of targets) {
      await page.goto(new URL(target.pathname, baseUrl).href, { waitUntil: "networkidle" });
      if (target.setup) await target.setup(page);
      await waitForScene(page, target.sceneName);
      await page.waitForSelector("#game-mobile-framing-cue", { state: "attached", timeout: 10000 });
      if (viewport.expectVisible) {
        await page.waitForSelector("#game-mobile-framing-cue[data-visible='true']", { timeout: 10000 });
      }
      await page.waitForTimeout(220);

      const audit = await readCue(page);
      assertCue(`${target.key}/${viewport.key}`, audit, target, viewport);

      const screenshot = path.join("tmp", "ui-quality", "mobile-framing", `${target.key}-framing-v1-${viewport.suffix}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({
        scene: target.sceneName,
        viewport: viewport.key,
        visible: audit.visible,
        canvas: `${Math.round(audit.canvasWidth)}x${Math.round(audit.canvasHeight)}`,
        zone: audit.zone,
        screenshot: path.resolve(screenshot)
      });
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(new URL("/?entry=combat&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, "CombatScene");
  await page.waitForSelector("#game-mobile-framing-cue[data-visible='true']", { timeout: 10000 });
  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("tooltip suppression: missing canvas box");
  await page.mouse.move(box.x + (540 / 1920) * box.width, box.y + (836 / 1080) * box.height);
  await page.waitForSelector("#game-readability-tooltip[data-visible='true']", { timeout: 5000 });
  const suppression = await page.evaluate(() => {
    const cue = document.getElementById("game-mobile-framing-cue");
    const tooltip = document.getElementById("game-readability-tooltip");
    const cueStyle = cue ? window.getComputedStyle(cue) : undefined;
    const tooltipStyle = tooltip ? window.getComputedStyle(tooltip) : undefined;
    return {
      cueVisible: cue?.dataset.visible === "true",
      cueSuppressed: cue?.dataset.suppressed === "true",
      cueAriaHidden: cue?.getAttribute("aria-hidden") ?? "",
      cueOpacity: cueStyle ? Number(cueStyle.opacity) : -1,
      cueVisibility: cueStyle?.visibility ?? "",
      tooltipVisible: tooltip?.dataset.visible === "true",
      tooltipZIndex: tooltipStyle ? Number(tooltipStyle.zIndex) : -1,
      cueZIndex: cueStyle ? Number(cueStyle.zIndex) : -1
    };
  });
  if (
    !suppression.cueVisible
    || !suppression.cueSuppressed
    || suppression.cueAriaHidden !== "true"
    || suppression.cueOpacity > 0.05
    || suppression.cueVisibility !== "hidden"
    || !suppression.tooltipVisible
    || suppression.tooltipZIndex <= suppression.cueZIndex
  ) {
    throw new Error(`tooltip suppression failed ${JSON.stringify(suppression, null, 2)}`);
  }
  const suppressionScreenshot = path.join("tmp", "ui-quality", "mobile-framing", "combat-tooltip-suppresses-framing-v1-mobile-390x844.png");
  await page.screenshot({ path: suppressionScreenshot, fullPage: true });

  console.log(JSON.stringify({
    ok: true,
    baseUrl,
    results,
    suppression: {
      ...suppression,
      screenshot: path.resolve(suppressionScreenshot)
    }
  }, null, 2));
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
  for (const port of [4250, 4251, 4252, 4253, 4254]) {
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
  throw new Error("No free mobile framing audit port found");
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

async function readCue(page) {
  return page.evaluate(() => {
    const cue = document.getElementById("game-mobile-framing-cue");
    const canvas = document.querySelector("#game-root canvas");
    if (!cue || !canvas) {
      return {
        ok: false,
        reason: "missing cue or canvas",
        visible: false
      };
    }

    const cueBox = cue.getBoundingClientRect();
    const canvasBox = canvas.getBoundingClientRect();
    const style = window.getComputedStyle(cue);
    const text = cue.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const overlapsCanvas = !(cueBox.right <= canvasBox.left
      || cueBox.left >= canvasBox.right
      || cueBox.bottom <= canvasBox.top
      || cueBox.top >= canvasBox.bottom);
    return {
      ok: true,
      visible: cue.dataset.visible === "true" && style.visibility !== "hidden" && Number(style.opacity) > 0.5,
      datasetVisible: cue.dataset.visible ?? "",
      suppressed: cue.dataset.suppressed ?? "",
      role: cue.getAttribute("role") ?? "",
      live: cue.getAttribute("aria-live") ?? "",
      atomic: cue.getAttribute("aria-atomic") ?? "",
      ariaHidden: cue.getAttribute("aria-hidden") ?? "",
      scene: cue.dataset.scene ?? "",
      zone: cue.dataset.zone ?? "",
      textLength: text.length,
      width: cueBox.width,
      height: cueBox.height,
      left: cueBox.left,
      top: cueBox.top,
      inViewport: cueBox.left >= 0
        && cueBox.top >= 0
        && cueBox.right <= window.innerWidth
        && cueBox.bottom <= window.innerHeight,
      overlapsCanvas,
      canvasX: canvasBox.x,
      canvasY: canvasBox.y,
      canvasWidth: canvasBox.width,
      canvasHeight: canvasBox.height,
      canvasBottom: canvasBox.bottom,
      topLetterbox: canvasBox.top,
      bottomLetterbox: window.innerHeight - canvasBox.bottom,
      pointerEvents: style.pointerEvents,
      zIndex: Number(style.zIndex),
      opacity: Number(style.opacity),
      visibility: style.visibility
    };
  });
}

function assertCue(label, audit, target, viewport) {
  if (!audit.ok) throw new Error(`${label}: ${audit.reason ?? "cue audit failed"}`);
  if (audit.role !== "status") throw new Error(`${label}: expected role=status, got ${audit.role}`);
  if (audit.live !== "polite") throw new Error(`${label}: expected aria-live=polite, got ${audit.live}`);
  if (audit.atomic !== "true") throw new Error(`${label}: expected aria-atomic=true, got ${audit.atomic}`);
  if (audit.scene !== target.sceneName) throw new Error(`${label}: expected scene ${target.sceneName}, got ${audit.scene}`);
  if (audit.pointerEvents !== "none") throw new Error(`${label}: expected pointer-events none, got ${audit.pointerEvents}`);
  if (audit.zIndex !== 8) throw new Error(`${label}: expected z-index 8, got ${audit.zIndex}`);

  if (!viewport.expectVisible) {
    if (audit.datasetVisible !== "false" || audit.visible || audit.ariaHidden !== "true") {
      throw new Error(`${label}: cue should be hidden ${JSON.stringify(audit, null, 2)}`);
    }
    return;
  }

  if (!audit.visible || audit.datasetVisible !== "true") {
    throw new Error(`${label}: cue should be visible ${JSON.stringify(audit, null, 2)}`);
  }
  if (audit.suppressed !== "false" || audit.ariaHidden !== "false") {
    throw new Error(`${label}: cue suppression/aria mismatch ${JSON.stringify(audit, null, 2)}`);
  }
  if (audit.textLength < 18) throw new Error(`${label}: cue text is too short (${audit.textLength})`);
  if (audit.width < 240 || audit.width > audit.canvasWidth + 1) {
    throw new Error(`${label}: cue width unsafe ${JSON.stringify(audit, null, 2)}`);
  }
  if (audit.height < 54 || audit.height > 120) {
    throw new Error(`${label}: cue height unsafe ${JSON.stringify(audit, null, 2)}`);
  }
  if (!audit.inViewport || audit.overlapsCanvas) {
    throw new Error(`${label}: cue placement unsafe ${JSON.stringify(audit, null, 2)}`);
  }
  if (audit.canvasWidth > 392 || audit.canvasHeight < 216 || audit.canvasHeight > 222) {
    throw new Error(`${label}: unexpected mobile canvas size ${JSON.stringify(audit, null, 2)}`);
  }
  const inTopLetterbox = audit.zone === "top" && audit.top + audit.height <= audit.canvasY - 10;
  const inBottomLetterbox = audit.zone === "bottom" && audit.top >= audit.canvasBottom + 10;
  if (!inTopLetterbox && !inBottomLetterbox) {
    throw new Error(`${label}: cue not inside portrait letterbox ${JSON.stringify(audit, null, 2)}`);
  }
}
