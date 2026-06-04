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
  for (const port of [4186, 4187, 4188, 4189]) {
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
  throw new Error("No free WorldMap audit port found");
}

const { chromium } = loadPlaywright();
const executableCandidates = [
  "C:/Users/i/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
];

await mkdir("tmp/ui-quality/worldmap", { recursive: true });

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
  await page.goto(new URL("/?entry=world_map&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, "WorldMapScene");

  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("missing canvas");

  await page.mouse.click(box.x + (1010 / 1920) * box.width, box.y + (512 / 1080) * box.height);
  await page.waitForTimeout(180);
  const oldCenterClickScene = await activeSceneKey(page);
  if (oldCenterClickScene !== "WorldMapScene") {
    throw new Error(`old center confirm coordinate still advances unexpectedly: scene=${oldCenterClickScene}`);
  }

  await page.mouse.move(box.x + (1576 / 1920) * box.width, box.y + (970 / 1080) * box.height);
  await page.waitForTimeout(140);
  await canvas.screenshot({ path: "tmp/ui-quality/worldmap/worldmap-play-button-action-hover-v1-1920.png" });
  const hoverAudit = await page.evaluate(() => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
      ?? game?.scene?.getScene?.("WorldMapScene");
    const context = scene?.registry?.get?.("bootContext");
    const children = scene?.children?.list ?? [];
    const underlayIndex = children.findIndex((child) => (
      child?.type === "Image"
      && child.texture?.key === "world_map_raster_underlay_concept"
      && child.visible !== false
      && child.alpha !== 0
    ));
    const underlayDepth = children[underlayIndex]?.depth ?? 0;
    const visible = children.filter((child) => child?.visible !== false && child.alpha !== 0);
    const visiblePlayImages = visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === "ui_hover_world_map_play_button_concept"
      && (child.alpha ?? 1) > 0.05
    )).length;
    const visibleRouteImages = visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === "ui_hover_route_node_concept"
      && (child.alpha ?? 1) > 0.05
    )).length;
    const stageNodes = [
      { x: 586, y: 760, width: 150, height: 150 },
      { x: 808, y: 756, width: 150, height: 150 },
      { x: 1000, y: 744, width: 150, height: 150 },
      { x: 1168, y: 704, width: 164, height: 164 },
      { x: 1328, y: 574, width: 150, height: 150 },
      { x: 1168, y: 462, width: 142, height: 142 },
      { x: 914, y: 486, width: 142, height: 142 },
      { x: 760, y: 496, width: 142, height: 142 },
      { x: 606, y: 486, width: 142, height: 142 },
      { x: 648, y: 264, width: 150, height: 150 },
      { x: 790, y: 304, width: 142, height: 142 },
      { x: 960, y: 304, width: 142, height: 142 },
      { x: 1094, y: 304, width: 142, height: 142 },
      { x: 1252, y: 166, width: 170, height: 170 },
      { x: 1378, y: 306, width: 170, height: 170 }
    ];
    const currentStageIndex = (context?.dataBundle?.stages ?? [])
      .findIndex((stage) => stage.id === context?.run?.stageId);
    const expectedNode = stageNodes[currentStageIndex];
    const expectedMarker = expectedNode
      ? {
        x: expectedNode.x + 4,
        y: expectedNode.y - Math.max(88, expectedNode.height * 0.62)
      }
      : undefined;
    const markerImages = visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === "ui_current_stage_marker_concept"
      && (child.alpha ?? 1) > 0.05
    ));
    const haloImages = visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === "ui_current_stage_halo_concept"
      && (child.alpha ?? 1) > 0.05
    ));
    const statusImages = visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === "ui_current_stage_status_badge_concept"
      && (child.alpha ?? 1) > 0.05
    ));
    const markerAtCurrentStage = markerImages.length === 1
      && expectedMarker
      && Math.abs(markerImages[0].x - expectedMarker.x) <= 1
      && Math.abs(markerImages[0].y - expectedMarker.y) <= 1;
    const haloAtCurrentStage = haloImages.length === 1
      && expectedNode
      && Math.abs(haloImages[0].x - (expectedNode.x + 2)) <= 1
      && Math.abs(haloImages[0].y - (expectedNode.y + 4)) <= 1;
    const statusAtCurrentStage = statusImages.length === 1
      && expectedNode
      && Math.abs(statusImages[0].x - (expectedNode.x + expectedNode.width * 0.1)) <= 1
      && Math.abs(statusImages[0].y - (expectedNode.y + expectedNode.height * 0.36)) <= 1;
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
    return {
      ok: underlayIndex >= 0 && visiblePlayImages === 1 && visibleRouteImages === 0 && markerAtCurrentStage && haloAtCurrentStage && statusAtCurrentStage && visibleTextCount === 0 && visibleRectsAboveUnderlay === 0,
      hasUnderlay: underlayIndex >= 0,
      visiblePlayImages,
      visibleRouteImages,
      currentStageId: context?.run?.stageId,
      visibleCurrentMarkerImages: markerImages.length,
      markerAtCurrentStage: Boolean(markerAtCurrentStage),
      visibleCurrentHaloImages: haloImages.length,
      haloAtCurrentStage: Boolean(haloAtCurrentStage),
      visibleCurrentStatusImages: statusImages.length,
      statusAtCurrentStage: Boolean(statusAtCurrentStage),
      visibleTextCount,
      visibleRectsAboveUnderlay
    };
  });
  if (!hoverAudit.ok) {
    throw new Error(`WorldMap play-button hover audit failed: ${JSON.stringify(hoverAudit)}`);
  }
  const neutralizedUnderlayAudit = await page.evaluate(() => {
    const game = window.__paperGame;
    const texture = game?.textures?.get?.("world_map_raster_underlay_concept");
    const sourceImage = texture?.getSourceImage?.();
    if (!sourceImage) {
      return { ok: false, reason: "missing world_map_raster_underlay_concept source image" };
    }
    const canvas = document.createElement("canvas");
    canvas.width = sourceImage.width;
    canvas.height = sourceImage.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      return { ok: false, reason: "missing 2d context" };
    }
    context.drawImage(sourceImage, 0, 0);
    const samples = [
      { label: "node1check", x: 510, y: 705 },
      { label: "node2check", x: 704, y: 700 },
      { label: "node3check", x: 872, y: 690 },
      { label: "stage4diamond", x: 1022, y: 512 }
    ].map((sample) => {
      const data = context.getImageData(sample.x, sample.y, 1, 1).data;
      const r = data[0];
      const g = data[1];
      const b = data[2];
      return {
        ...sample,
        rgb: [r, g, b],
        greenDominance: g - Math.max(r, b),
        cyanDominance: (g + b) / 2 - r
      };
    });
    return {
      ok: samples.every((sample) => sample.greenDominance < 24 && sample.cyanDominance < 28),
      samples
    };
  });
  if (!neutralizedUnderlayAudit.ok) {
    throw new Error(`WorldMap neutralized underlay audit failed: ${JSON.stringify(neutralizedUnderlayAudit)}`);
  }

  await page.mouse.click(box.x + (1576 / 1920) * box.width, box.y + (970 / 1080) * box.height);
  await waitForScene(page, "DungeonScene");

  console.log(JSON.stringify({
    baseUrl,
    screenshot: path.resolve("tmp/ui-quality/worldmap/worldmap-play-button-action-hover-v1-1920.png"),
    oldCenterClickScene,
    hoverAudit,
    neutralizedUnderlayAudit,
    finalScene: await activeSceneKey(page)
  }, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}

async function waitForScene(page, sceneKey) {
  await page.waitForSelector("canvas", { timeout: 10000 });
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneKey, { timeout: 10000 });
}

async function activeSceneKey(page) {
  return page.evaluate(() => {
    const game = window.__paperGame;
    return game?.scene?.getScenes?.(true)?.[0]?.scene?.key ?? "none";
  });
}
