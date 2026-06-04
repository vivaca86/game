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
  for (const port of [4181, 4182, 4183, 4184]) {
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
  throw new Error("No free disabled raster audit port found");
}

const { chromium } = loadPlaywright();
const executableCandidates = [
  "C:/Users/i/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
];

await mkdir("tmp/ui-quality/disabled", { recursive: true });

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
  await page.goto(
    new URL("/?data=release&entry=event&resetSave=1&stage=stage_sunny_gate&playerHp=1", baseUrl).href,
    { waitUntil: "networkidle" }
  );
  await page.waitForSelector("canvas", { timeout: 10000 });
  await page.waitForFunction(() => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === "EventScene"));
  }, null, { timeout: 10000 });

  const canvas = page.locator("canvas");
  await canvas.screenshot({ path: "tmp/ui-quality/disabled/event-disabled-raster-v1-1920.png" });

  const initialAudit = await page.evaluate(() => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "EventScene")
      ?? game?.scene?.getScene?.("EventScene");
    if (!scene) {
      return { ok: false, reason: "EventScene is not active" };
    }

    const children = scene.children?.list ?? [];
    const underlayIndex = children.findIndex((child) => (
      child?.type === "Image"
      && child.texture?.key === "event_raster_underlay_concept"
      && child.visible !== false
      && child.alpha !== 0
    ));
    const underlayDepth = children[underlayIndex]?.depth ?? 0;
    const visible = children.filter((child) => child?.visible !== false && child.alpha !== 0);
    const visibleLockImages = visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === "ui_disabled_lock_stamp_concept"
      && (child.alpha ?? 1) > 0.05
    ));
    const visibleTextCount = visible.filter((child) => (
      child?.type === "Text"
      && String(child.text ?? "").trim().length > 0
    )).length;
    const visibleRectsAboveUnderlay = visible
      .filter((child) => child?.type === "Rectangle")
      .filter((child) => child.depth > underlayDepth || children.indexOf(child) > underlayIndex)
      .filter((child) => {
        const fillAlpha = Number(child?.fillAlpha ?? child?.alpha ?? 1);
        const strokeAlpha = Number(child?.strokeAlpha ?? child?.lineAlpha ?? 0);
        const strokeWidth = Number(child?.lineWidth ?? child?.strokeWidth ?? 0);
        return (child?.isFilled && fillAlpha > 0.02) || (child?.isStroked && strokeWidth > 0 && strokeAlpha > 0.02);
      }).length;

    if (underlayIndex < 0) {
      return { ok: false, reason: "event raster underlay is not visible" };
    }
    if (visibleLockImages.length < 1) {
      return { ok: false, reason: "disabled lock raster image is not visible" };
    }
    if (visibleTextCount !== 0) {
      return { ok: false, reason: `visible text objects remain over raster event scene: ${visibleTextCount}` };
    }
    if (visibleRectsAboveUnderlay !== 0) {
      return { ok: false, reason: `visible rectangle overlays remain over raster event scene: ${visibleRectsAboveUnderlay}` };
    }

    return {
      ok: true,
      hasUnderlay: true,
      visibleLockImages: visibleLockImages.length,
      visibleTextCount,
      visibleRectsAboveUnderlay,
      lockBounds: visibleLockImages.map((image) => {
        const bounds = image.getBounds();
        return {
          x: Math.round(bounds.x),
          y: Math.round(bounds.y),
          w: Math.round(bounds.width),
          h: Math.round(bounds.height)
        };
      })
    };
  });
  if (!initialAudit.ok) {
    throw new Error(initialAudit.reason);
  }

  const canvasBox = await canvas.boundingBox();
  await page.mouse.click(canvasBox.x + (1450 / 1920) * canvasBox.width, canvasBox.y + (848 / 1080) * canvasBox.height);
  await page.waitForTimeout(180);

  const clickAudit = await page.evaluate(() => {
    const game = window.__paperGame;
    const activeScenes = game?.scene?.getScenes?.(true)?.map((scene) => scene.scene?.key) ?? [];
    return {
      ok: activeScenes.includes("EventScene"),
      activeScenes
    };
  });
  if (!clickAudit.ok) {
    throw new Error(`Disabled event choice advanced unexpectedly: activeScenes=${clickAudit.activeScenes.join(",")}`);
  }

  console.log(JSON.stringify({
    baseUrl,
    screenshot: path.resolve("tmp/ui-quality/disabled/event-disabled-raster-v1-1920.png"),
    initialAudit,
    clickAudit
  }, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}
