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

const { chromium } = loadPlaywright();
const executableCandidates = [
  "C:/Users/i/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
];

await mkdir("tmp/ui-quality/settings-preferences", { recursive: true });

let browser;
let server;
let baseUrl;

try {
  ({ server, baseUrl } = await startServer());
  browser = await launchBrowser();

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  await page.goto(new URL("/?entry=town&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, "TownScene");
  await virtualClick(page, 1010, 806);
  await waitForScene(page, "SettingsScene");
  await page.waitForTimeout(200);
  await virtualClick(page, 1360, 372);
  await page.waitForTimeout(260);
  await waitForScene(page, "SettingsScene");
  await virtualClick(page, 1360, 462);
  await page.waitForTimeout(260);
  await waitForScene(page, "SettingsScene");

  await page.mouse.move(4, 4);
  await page.waitForTimeout(80);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(120);
  await page.waitForSelector("#game-readability-tooltip[data-visible='true']", { timeout: 5000 });
  const tooltip = await readTooltip(page);
  assertTooltip("settings tooltip", tooltip);
  const tooltipScreenshot = path.join("tmp", "ui-quality", "settings-preferences", "settings-large-text-reduced-motion-tooltip-v1-1280.png");
  await page.screenshot({ path: tooltipScreenshot, fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(new URL("/?entry=town", baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, "TownScene");
  await page.waitForSelector("#game-mobile-framing-cue[data-visible='true']", { timeout: 10000 });
  await page.waitForTimeout(240);
  const cue = await readMobileCue(page);
  assertMobileCue("mobile framing cue", cue);
  const cueScreenshot = path.join("tmp", "ui-quality", "settings-preferences", "mobile-large-text-reduced-motion-cue-v1-390x844.png");
  await page.screenshot({ path: cueScreenshot, fullPage: true });

  console.log(JSON.stringify({
    ok: true,
    baseUrl,
    tooltip: {
      size: `${Math.round(tooltip.width)}x${Math.round(tooltip.height)}`,
      fontSize: tooltip.fontSize,
      strongFontSize: tooltip.strongFontSize,
      transitionProperty: tooltip.transitionProperty,
      screenshot: path.resolve(tooltipScreenshot)
    },
    mobileCue: {
      size: `${Math.round(cue.width)}x${Math.round(cue.height)}`,
      fontSize: cue.fontSize,
      strongFontSize: cue.strongFontSize,
      transitionProperty: cue.transitionProperty,
      screenshot: path.resolve(cueScreenshot)
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
  for (const port of [4260, 4261, 4262, 4263, 4264]) {
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
  throw new Error("No free settings preferences overlay audit port found");
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

async function virtualClick(page, x, y) {
  const point = await virtualPoint(page, x, y);
  await page.mouse.click(point.x, point.y);
}

async function virtualMove(page, x, y) {
  const point = await virtualPoint(page, x, y);
  await page.mouse.move(point.x, point.y);
}

async function virtualPoint(page, x, y) {
  const box = await page.locator("canvas").boundingBox();
  if (!box) throw new Error("missing canvas box");
  return {
    x: box.x + (x / 1920) * box.width,
    y: box.y + (y / 1080) * box.height
  };
}

async function readTooltip(page) {
  return page.evaluate(() => {
    const root = document.getElementById("game-readability-tooltip");
    const canvas = document.querySelector("#game-root canvas");
    if (!root || !canvas) return { ok: false, reason: "missing tooltip or canvas" };
    const rootBox = root.getBoundingClientRect();
    const canvasBox = canvas.getBoundingClientRect();
    const style = window.getComputedStyle(root);
    const strong = root.querySelector("strong");
    const strongStyle = strong ? window.getComputedStyle(strong) : undefined;
    return {
      ok: true,
      visible: root.dataset.visible === "true",
      scene: root.dataset.scene ?? "",
      largeText: root.dataset.largeText ?? "",
      reducedMotion: root.dataset.reducedMotion ?? "",
      width: rootBox.width,
      height: rootBox.height,
      inViewport: rootBox.left >= 0
        && rootBox.top >= 0
        && rootBox.right <= window.innerWidth
        && rootBox.bottom <= window.innerHeight,
      inCanvas: rootBox.left >= canvasBox.left - 1
        && rootBox.top >= canvasBox.top - 1
        && rootBox.right <= canvasBox.right + 1
        && rootBox.bottom <= canvasBox.bottom + 1,
      pointerEvents: style.pointerEvents,
      fontSize: Number.parseFloat(style.fontSize),
      strongFontSize: Number.parseFloat(strongStyle?.fontSize ?? "0"),
      lineHeight: Number.parseFloat(style.lineHeight),
      transitionProperty: style.transitionProperty,
      transitionDuration: style.transitionDuration,
      transform: style.transform,
      textLength: root.textContent?.replace(/\s+/g, " ").trim().length ?? 0
    };
  });
}

function assertTooltip(label, audit) {
  if (!audit.ok) throw new Error(`${label}: ${audit.reason ?? "tooltip audit failed"}`);
  if (!audit.visible || audit.scene !== "SettingsScene") throw new Error(`${label}: invalid visibility/scene ${JSON.stringify(audit, null, 2)}`);
  if (audit.largeText !== "true" || audit.reducedMotion !== "true") {
    throw new Error(`${label}: preferences not reflected ${JSON.stringify(audit, null, 2)}`);
  }
  if (audit.fontSize < 15.5 || audit.strongFontSize < 16.5 || audit.lineHeight < 21) {
    throw new Error(`${label}: large text sizing not applied ${JSON.stringify(audit, null, 2)}`);
  }
  if (audit.transitionProperty !== "none" || audit.transitionDuration !== "0s") {
    throw new Error(`${label}: reduced motion not applied ${JSON.stringify(audit, null, 2)}`);
  }
  if (audit.width < 260 || audit.height < 70 || !audit.inViewport || !audit.inCanvas || audit.pointerEvents !== "none") {
    throw new Error(`${label}: unsafe placement ${JSON.stringify(audit, null, 2)}`);
  }
  if (audit.textLength < 16) throw new Error(`${label}: tooltip text too short ${JSON.stringify(audit, null, 2)}`);
}

async function readMobileCue(page) {
  return page.evaluate(() => {
    const cue = document.getElementById("game-mobile-framing-cue");
    const canvas = document.querySelector("#game-root canvas");
    if (!cue || !canvas) return { ok: false, reason: "missing cue or canvas" };
    const cueBox = cue.getBoundingClientRect();
    const canvasBox = canvas.getBoundingClientRect();
    const style = window.getComputedStyle(cue);
    const strong = cue.querySelector("strong");
    const strongStyle = strong ? window.getComputedStyle(strong) : undefined;
    const overlapsCanvas = !(cueBox.right <= canvasBox.left
      || cueBox.left >= canvasBox.right
      || cueBox.bottom <= canvasBox.top
      || cueBox.top >= canvasBox.bottom);
    return {
      ok: true,
      visible: cue.dataset.visible === "true" && style.visibility !== "hidden" && Number(style.opacity) > 0.5,
      suppressed: cue.dataset.suppressed ?? "",
      ariaHidden: cue.getAttribute("aria-hidden") ?? "",
      scene: cue.dataset.scene ?? "",
      zone: cue.dataset.zone ?? "",
      largeText: cue.dataset.largeText ?? "",
      reducedMotion: cue.dataset.reducedMotion ?? "",
      width: cueBox.width,
      height: cueBox.height,
      inViewport: cueBox.left >= 0
        && cueBox.top >= 0
        && cueBox.right <= window.innerWidth
        && cueBox.bottom <= window.innerHeight,
      overlapsCanvas,
      pointerEvents: style.pointerEvents,
      fontSize: Number.parseFloat(style.fontSize),
      strongFontSize: Number.parseFloat(strongStyle?.fontSize ?? "0"),
      lineHeight: Number.parseFloat(style.lineHeight),
      transitionProperty: style.transitionProperty,
      transitionDuration: style.transitionDuration,
      textLength: cue.textContent?.replace(/\s+/g, " ").trim().length ?? 0
    };
  });
}

function assertMobileCue(label, audit) {
  if (!audit.ok) throw new Error(`${label}: ${audit.reason ?? "cue audit failed"}`);
  if (!audit.visible || audit.scene !== "TownScene" || audit.suppressed !== "false" || audit.ariaHidden !== "false") {
    throw new Error(`${label}: invalid visibility/scene ${JSON.stringify(audit, null, 2)}`);
  }
  if (audit.largeText !== "true" || audit.reducedMotion !== "true") {
    throw new Error(`${label}: preferences not reflected ${JSON.stringify(audit, null, 2)}`);
  }
  if (audit.fontSize < 14.5 || audit.strongFontSize < 15.5 || audit.lineHeight < 19) {
    throw new Error(`${label}: large text sizing not applied ${JSON.stringify(audit, null, 2)}`);
  }
  if (audit.transitionProperty !== "none" || audit.transitionDuration !== "0s") {
    throw new Error(`${label}: reduced motion not applied ${JSON.stringify(audit, null, 2)}`);
  }
  if (audit.width < 250 || audit.height < 62 || audit.height > 132 || !audit.inViewport || audit.overlapsCanvas || audit.pointerEvents !== "none") {
    throw new Error(`${label}: unsafe placement ${JSON.stringify(audit, null, 2)}`);
  }
  if (audit.textLength < 18) throw new Error(`${label}: cue text too short ${JSON.stringify(audit, null, 2)}`);
}
