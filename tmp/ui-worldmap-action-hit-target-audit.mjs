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
      { label: "stage4diamond", x: 1022, y: 512 },
      { label: "node1body", x: 510, y: 662 },
      { label: "node2body", x: 704, y: 658 },
      { label: "node3plateUpper", x: 873, y: 631 },
      { label: "node3body", x: 872, y: 648 },
      { label: "stage4body", x: 1018, y: 604 },
      { label: "stage4routeDots", x: 940, y: 503 },
      { label: "stage5body", x: 1328, y: 574 },
      { label: "stage5route", x: 1238, y: 536 },
      { label: "stage10lock", x: 563, y: 248 },
      { label: "stage11lock", x: 686, y: 294 },
      { label: "stage12lock", x: 819, y: 312 },
      { label: "stage13lock", x: 930, y: 299 },
      { label: "stage14lock", x: 1052, y: 202 },
      { label: "stage15lock", x: 1142, y: 329 }
    ].map((sample) => {
      const data = context.getImageData(sample.x, sample.y, 1, 1).data;
      const r = data[0];
      const g = data[1];
      const b = data[2];
      return {
        ...sample,
        rgb: [r, g, b],
        greenDominance: g - Math.max(r, b),
        cyanDominance: (g + b) / 2 - r,
        redDominance: r - Math.max(g, b)
      };
    });
    return {
      ok: samples.every((sample) => sample.greenDominance < 24 && sample.cyanDominance < 28 && sample.redDominance < 42),
      samples
    };
  });
  if (!neutralizedUnderlayAudit.ok) {
    throw new Error(`WorldMap neutralized underlay audit failed: ${JSON.stringify(neutralizedUnderlayAudit)}`);
  }

  const stateAudit = await runStateOverlayAudit(browser, baseUrl, {
    completedCount: 1,
    currentStageIndex: 1,
    logEntry: "audit:worldmap_state_overlays",
    screenshot: "tmp/ui-quality/worldmap/worldmap-state-overlays-v1-1920.png"
  });
  const progressStateAudit = await runStateOverlayAudit(browser, baseUrl, {
    completedCount: 3,
    currentStageIndex: 3,
    logEntry: "audit:worldmap_progress_stage4",
    screenshot: "tmp/ui-quality/worldmap/worldmap-progress-current-stage4-v1-1920.png"
  });
  const lateLockStateAudit = await runStateOverlayAudit(browser, baseUrl, {
    completedCount: 8,
    currentStageIndex: 8,
    logEntry: "audit:worldmap_late_lock_stage10",
    screenshot: "tmp/ui-quality/worldmap/worldmap-progress-current-stage9-v1-1920.png"
  });
  const keyboardStageSelectAudit = await runKeyboardStageSelectAudit(browser, baseUrl);

  await page.mouse.click(box.x + (1576 / 1920) * box.width, box.y + (970 / 1080) * box.height);
  await waitForScene(page, "DungeonScene");

  console.log(JSON.stringify({
    baseUrl,
    screenshot: path.resolve("tmp/ui-quality/worldmap/worldmap-play-button-action-hover-v1-1920.png"),
    stateScreenshot: path.resolve("tmp/ui-quality/worldmap/worldmap-state-overlays-v1-1920.png"),
    progressStateScreenshot: path.resolve("tmp/ui-quality/worldmap/worldmap-progress-current-stage4-v1-1920.png"),
    lateLockStateScreenshot: path.resolve("tmp/ui-quality/worldmap/worldmap-progress-current-stage9-v1-1920.png"),
    oldCenterClickScene,
    hoverAudit,
    neutralizedUnderlayAudit,
    stateAudit,
    progressStateAudit,
    lateLockStateAudit,
    keyboardStageSelectAudit,
    finalScene: await activeSceneKey(page)
  }, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}

async function waitForScene(page, sceneKey) {
  await page.waitForSelector("canvas", { timeout: 20000 });
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneKey, { timeout: 20000 });
}

async function activeSceneKey(page) {
  return page.evaluate(() => {
    const game = window.__paperGame;
    return game?.scene?.getScenes?.(true)?.[0]?.scene?.key ?? "none";
  });
}

async function runKeyboardStageSelectAudit(browser, baseUrl) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  try {
    await page.goto(new URL("/?data=release&entry=world_map&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
    await waitForScene(page, "WorldMapScene");
    const seeded = await page.evaluate(() => {
      const game = window.__paperGame;
      const scene = game?.scene?.getScene?.("WorldMapScene");
      const context = scene?.registry?.get?.("bootContext");
      const stages = context?.dataBundle?.stages ?? [];
      if (!context?.save?.currentRun || stages.length < 2) {
        return { ok: false, reason: "missing boot context or stages" };
      }

      const completedStageId = stages[0].id;
      const currentStageId = stages[1].id;
      context.save.profile.completedStages = [completedStageId];
      context.save.profile.unlockedStages = [completedStageId, currentStageId];
      context.save.currentRun = {
        ...context.save.currentRun,
        phase: "world_map",
        stageId: currentStageId,
        roomIndex: 0,
        completedStages: [completedStageId],
        log: [...new Set([...(context.save.currentRun.log ?? []), "audit:worldmap_keyboard_stage2"])]
      };
      localStorage.setItem("paper_theater_card_crawler_save_v1", JSON.stringify(context.save));
      return { ok: true, completedStageId, currentStageId };
    });
    if (!seeded.ok) {
      throw new Error(`WorldMap keyboard seed failed: ${JSON.stringify(seeded)}`);
    }

    await page.goto(new URL("/?data=release&entry=world_map", baseUrl).href, { waitUntil: "networkidle" });
    await waitForScene(page, "WorldMapScene");
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(220);
    await page.waitForFunction((expectedStageId) => {
      const game = window.__paperGame;
      const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
        ?? game?.scene?.getScene?.("WorldMapScene");
      const context = scene?.registry?.get?.("bootContext");
      return context?.run?.stageId === expectedStageId;
    }, seeded.completedStageId, { timeout: 10000 });
    await page.locator("canvas").screenshot({ path: "tmp/ui-quality/worldmap/worldmap-keyboard-stage-select-v1-1920.png" });

    const audit = await page.evaluate((expectedStageId) => {
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
      const stages = context?.dataBundle?.stages ?? [];
      const currentStageId = context?.run?.stageId;
      const currentIndex = stages.findIndex((stage) => stage.id === currentStageId);
      const currentNode = stageNodes[currentIndex];
      const markerImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_current_stage_marker_concept" && (child.alpha ?? 1) > 0.05);
      const haloImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_current_stage_halo_concept" && (child.alpha ?? 1) > 0.05);
      const statusImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_current_stage_status_badge_concept" && (child.alpha ?? 1) > 0.05);
      const completedImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_completed_stage_badge_concept" && (child.alpha ?? 1) > 0.05);
      const routeHoverImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_hover_route_node_concept" && (child.alpha ?? 1) > 0.05);
      const visibleTextCount = visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length;
      const visibleRectsAboveUnderlay = visible
        .filter((child) => child?.type === "Rectangle")
        .filter((child) => child.depth > underlayDepth || children.indexOf(child) > underlayIndex)
        .filter((child) => {
          const fillAlpha = Number(child?.fillAlpha ?? child?.alpha ?? 1);
          const strokeAlpha = Number(child?.strokeAlpha ?? child?.lineAlpha ?? 0);
          const strokeWidth = Number(child?.lineWidth ?? child?.strokeWidth ?? 0);
          return (child?.isFilled && fillAlpha > 0.02) || (child?.isStroked && strokeWidth > 0 && strokeAlpha > 0.02);
        }).length;
      const markerAtSelectedStage = markerImages.length === 1
        && currentNode
        && Math.abs(markerImages[0].x - (currentNode.x + 4)) <= 1
        && Math.abs(markerImages[0].y - (currentNode.y - Math.max(88, currentNode.height * 0.62))) <= 1;
      const haloAtSelectedStage = haloImages.length === 1
        && currentNode
        && Math.abs(haloImages[0].x - (currentNode.x + 2)) <= 1
        && Math.abs(haloImages[0].y - (currentNode.y + 4)) <= 1;
      const statusAtSelectedStage = statusImages.length === 1
        && currentNode
        && Math.abs(statusImages[0].x - (currentNode.x + currentNode.width * 0.1)) <= 1
        && Math.abs(statusImages[0].y - (currentNode.y + currentNode.height * 0.36)) <= 1;
      const selectedStageHasNoCompletedBadge = !currentNode || !completedImages.some((image) => (
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.6
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.6
      ));
      const log = context?.run?.log ?? [];
      return {
        ok: underlayIndex >= 0
          && currentStageId === expectedStageId
          && markerAtSelectedStage
          && haloAtSelectedStage
          && statusAtSelectedStage
          && selectedStageHasNoCompletedBadge
          && routeHoverImages.length === 0
          && visibleTextCount === 0
          && visibleRectsAboveUnderlay === 0
          && log.includes(`flow:stage_select:${expectedStageId}`),
        currentStageId,
        expectedStageId,
        visibleCurrentMarkerImages: markerImages.length,
        markerAtSelectedStage: Boolean(markerAtSelectedStage),
        visibleCurrentHaloImages: haloImages.length,
        haloAtSelectedStage: Boolean(haloAtSelectedStage),
        visibleCurrentStatusImages: statusImages.length,
        statusAtSelectedStage: Boolean(statusAtSelectedStage),
        selectedStageHasNoCompletedBadge,
        visibleRouteHoverImages: routeHoverImages.length,
        visibleTextCount,
        visibleRectsAboveUnderlay,
        hasStageSelectLog: log.includes(`flow:stage_select:${expectedStageId}`)
      };
    }, seeded.completedStageId);
    if (!audit.ok) {
      throw new Error(`WorldMap keyboard stage-select audit failed: ${JSON.stringify(audit)}`);
    }
    return {
      screenshot: path.resolve("tmp/ui-quality/worldmap/worldmap-keyboard-stage-select-v1-1920.png"),
      ...audit
    };
  } finally {
    await page.close();
  }
}

async function runStateOverlayAudit(browser, baseUrl, auditCase) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  try {
    await page.goto(new URL("/?data=release&entry=world_map&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
    await waitForScene(page, "WorldMapScene");
    const seeded = await page.evaluate(({ completedCount, currentStageIndex, logEntry }) => {
      const game = window.__paperGame;
      const scene = game?.scene?.getScene?.("WorldMapScene");
      const context = scene?.registry?.get?.("bootContext");
      if (!context?.save?.currentRun) {
        return { ok: false, reason: "missing boot context or current run" };
      }
      const completedStageIds = context.dataBundle.stages.slice(0, completedCount).map((stage) => stage.id);
      const currentStageId = context.dataBundle.stages[currentStageIndex]?.id;
      if (completedStageIds.length !== completedCount || !currentStageId) {
        return { ok: false, reason: "missing release stages" };
      }

      context.save.profile.completedStages = completedStageIds;
      context.save.profile.unlockedStages = [...new Set([...completedStageIds, currentStageId])];
      context.save.currentRun = {
        ...context.save.currentRun,
        phase: "world_map",
        stageId: currentStageId,
        roomIndex: 0,
        completedStages: completedStageIds,
        log: [...new Set([...(context.save.currentRun.log ?? []), logEntry])]
      };
      localStorage.setItem("paper_theater_card_crawler_save_v1", JSON.stringify(context.save));
      return { ok: true, completedStageIds, currentStageId };
    }, auditCase);
    if (!seeded.ok) {
      throw new Error(`WorldMap state overlay seed failed: ${JSON.stringify(seeded)}`);
    }

    await page.goto(new URL("/?data=release&entry=world_map", baseUrl).href, { waitUntil: "networkidle" });
    await waitForScene(page, "WorldMapScene");
    await page.locator("canvas").screenshot({ path: auditCase.screenshot });

    const stateAudit = await page.evaluate(() => {
      const game = window.__paperGame;
      const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
        ?? game?.scene?.getScene?.("WorldMapScene");
      const context = scene?.registry?.get?.("bootContext");
      const visible = (scene?.children?.list ?? []).filter((child) => child?.visible !== false && child.alpha !== 0);
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
      const stages = context?.dataBundle?.stages ?? [];
      const currentStageId = context?.run?.stageId;
      const unlockedStageIds = new Set([...(context?.save?.profile?.unlockedStages ?? []), currentStageId]);
      const completedStageIds = new Set(context?.save?.profile?.completedStages ?? []);
      const firstLockedIndex = stages.findIndex((stage) => !unlockedStageIds.has(stage.id));
      const completedImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_completed_stage_badge_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const lockedImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_locked_stage_badge_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const sealedImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_sealed_stage_badge_concept"
        && (child.alpha ?? 1) > 0.05
      ));
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
      const currentIndex = stages.findIndex((stage) => stage.id === currentStageId);
      const currentNode = stageNodes[currentIndex];
      const expectedMarker = currentNode
        ? {
          x: currentNode.x + 4,
          y: currentNode.y - Math.max(88, currentNode.height * 0.62)
        }
        : undefined;
      const expectedCompleted = stages
        .map((stage, index) => ({ stage, node: stageNodes[index] }))
        .filter(({ stage, node }) => node && stage.id !== currentStageId && completedStageIds.has(stage.id));
      const expectedLocked = stages
        .map((stage, index) => ({ stage, node: stageNodes[index], index }))
        .filter(({ stage, node, index }) => node && !unlockedStageIds.has(stage.id) && index >= 9);
      const expectedSealed = stages
        .map((stage, index) => ({ stage, node: stageNodes[index] }))
        .filter(({ stage, node }, index) => node && !unlockedStageIds.has(stage.id) && index < 9 && index === firstLockedIndex);
      const imageAt = (images, x, y) => images.find((image) => Math.abs(image.x - x) <= 1 && Math.abs(image.y - y) <= 1);
      const hasImageAt = (images, x, y) => Boolean(imageAt(images, x, y));
      const lockedBadgePlacement = (node, stageIndex) => {
        const sourceAlignedLocks = {
          9: { x: 646, y: 285, size: 70 },
          10: { x: 787, y: 337, size: 70 },
          11: { x: 941, y: 358, size: 70 },
          12: { x: 1068, y: 343, size: 70 },
          13: { x: 1208, y: 232, size: 76 },
          14: { x: 1311, y: 378, size: 76 }
        };
        const base = sourceAlignedLocks[stageIndex]
          ?? (stageIndex >= 13
            ? { x: node.x - node.width * 0.34, y: node.y + node.height * 0.36, size: 76 }
            : stageIndex >= 11
            ? { x: node.x - node.width * 0.12, y: node.y + node.height * 0.36, size: 70 }
            : { x: node.x - node.width * 0.06, y: node.y + node.height * 0.36, size: 70 });
        const nextLocked = stageIndex === firstLockedIndex;
        return {
          ...base,
          size: nextLocked ? Math.max(base.size, 76) : base.size,
          minAlpha: nextLocked ? 0.9 : 0.82
        };
      };
      const completedBadgePlacement = (node, stageIndex) => {
        if (stageIndex <= 2) {
          return {
            x: node.x + node.width * 0.03,
            y: node.y + node.height * 0.32,
            size: 78,
            minAlpha: 0.94
          };
        }
        const midRoutePlacements = {
          5: { dx: -0.04, dy: 0.43, size: 52, minAlpha: 0.8 },
          6: { dx: 0.2, dy: 0.38, size: 52, minAlpha: 0.8 },
          7: { dx: 0.02, dy: 0.32, size: 44, minAlpha: 0.7 },
          8: { dx: 0.04, dy: 0.36, size: 54, minAlpha: 0.8 }
        };
        const placed = midRoutePlacements[stageIndex];
        if (placed) {
          return {
            x: node.x + node.width * placed.dx,
            y: node.y + node.height * placed.dy,
            size: placed.size,
            minAlpha: placed.minAlpha
          };
        }
        return {
          x: node.x + node.width * 0.02,
          y: node.y + node.height * 0.31,
          size: stageIndex >= 9 ? 64 : 60,
          minAlpha: 0.86
        };
      };
      const completedAtExpectedNodes = expectedCompleted.every(({ node }) => (
        hasImageAt(completedImages, completedBadgePlacement(node, stageNodes.indexOf(node)).x, completedBadgePlacement(node, stageNodes.indexOf(node)).y)
      ));
      const completedStyleAtExpectedNodes = expectedCompleted.every(({ node }) => {
        const placement = completedBadgePlacement(node, stageNodes.indexOf(node));
        const image = imageAt(completedImages, placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.size) <= 1
          && Math.abs(image.displayHeight - placement.size) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const lockedAtExpectedNodes = expectedLocked.every(({ node, stage }) => {
        const placement = lockedBadgePlacement(node, stages.findIndex((candidate) => candidate.id === stage.id));
        return hasImageAt(lockedImages, placement.x, placement.y);
      });
      const lockedStyleAtExpectedNodes = expectedLocked.every(({ node, stage }) => {
        const placement = lockedBadgePlacement(node, stages.findIndex((candidate) => candidate.id === stage.id));
        const image = imageAt(lockedImages, placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.size) <= 1
          && Math.abs(image.displayHeight - placement.size) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const sealedAtExpectedNodes = expectedSealed.every(({ node }) => (
        hasImageAt(sealedImages, node.x + node.width * 0.01, node.y + node.height * 0.39)
      ));
      const sealedStyleAtExpectedNodes = expectedSealed.every(({ node }) => {
        const image = imageAt(sealedImages, node.x + node.width * 0.01, node.y + node.height * 0.39);
        return image
          && Math.abs(image.displayWidth - 60) <= 1
          && Math.abs(image.displayHeight - 60) <= 1
          && (image.alpha ?? 1) >= 0.8;
      });
      const markerAtCurrentStage = markerImages.length === 1
        && expectedMarker
        && Math.abs(markerImages[0].x - expectedMarker.x) <= 1
        && Math.abs(markerImages[0].y - expectedMarker.y) <= 1;
      const haloAtCurrentStage = haloImages.length === 1
        && currentNode
        && Math.abs(haloImages[0].x - (currentNode.x + 2)) <= 1
        && Math.abs(haloImages[0].y - (currentNode.y + 4)) <= 1;
      const statusAtCurrentStage = statusImages.length === 1
        && currentNode
        && Math.abs(statusImages[0].x - (currentNode.x + currentNode.width * 0.1)) <= 1
        && Math.abs(statusImages[0].y - (currentNode.y + currentNode.height * 0.36)) <= 1;
      const currentHasNoCompletedBadge = !currentNode || !completedImages.some((image) => (
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.6
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.6
      ));
      const currentHasNoLockedBadge = !currentNode || [...lockedImages, ...sealedImages].every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.6
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.6
      ));

      return {
        ok: completedImages.length === expectedCompleted.length
          && lockedImages.length === expectedLocked.length
          && sealedImages.length === expectedSealed.length
          && completedAtExpectedNodes
          && completedStyleAtExpectedNodes
          && lockedAtExpectedNodes
          && lockedStyleAtExpectedNodes
          && sealedAtExpectedNodes
          && sealedStyleAtExpectedNodes
          && markerAtCurrentStage
          && haloAtCurrentStage
          && statusAtCurrentStage
          && currentHasNoCompletedBadge
          && currentHasNoLockedBadge,
        currentStageId,
        completedStageIds: [...completedStageIds],
        unlockedStageIds: [...unlockedStageIds],
        visibleCompletedBadges: completedImages.length,
        expectedCompletedBadges: expectedCompleted.length,
        completedAtExpectedNodes,
        completedStyleAtExpectedNodes,
        visibleLockedBadges: lockedImages.length,
        expectedLockedBadges: expectedLocked.length,
        lockedAtExpectedNodes,
        lockedStyleAtExpectedNodes,
        visibleSealedBadges: sealedImages.length,
        expectedSealedBadges: expectedSealed.length,
        sealedAtExpectedNodes,
        sealedStyleAtExpectedNodes,
        visibleCurrentMarkerImages: markerImages.length,
        markerAtCurrentStage: Boolean(markerAtCurrentStage),
        visibleCurrentHaloImages: haloImages.length,
        haloAtCurrentStage: Boolean(haloAtCurrentStage),
        visibleCurrentStatusImages: statusImages.length,
        statusAtCurrentStage: Boolean(statusAtCurrentStage),
        currentHasNoCompletedBadge,
        currentHasNoLockedBadge
      };
    });
    if (!stateAudit.ok) {
      throw new Error(`WorldMap state overlay audit failed: ${JSON.stringify(stateAudit)}`);
    }
    return stateAudit;
  } finally {
    await page.close();
  }
}
