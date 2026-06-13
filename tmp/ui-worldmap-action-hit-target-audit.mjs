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
    const currentBaseBodyImages = visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === "ui_current_stage_body_wash_concept"
      && (child.alpha ?? 1) > 0.05
    ));
    const currentLateBodyImages = visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === "ui_current_stage_late_body_wash_concept"
      && (child.alpha ?? 1) > 0.05
    ));
    const bodyImages = [...currentBaseBodyImages, ...currentLateBodyImages];
    const currentBaseFrameImages = visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === "ui_current_stage_frame_concept"
      && (child.alpha ?? 1) > 0.05
    ));
    const currentLateFrameImages = visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === "ui_current_stage_late_frame_concept"
      && (child.alpha ?? 1) > 0.05
    ));
    const frameImages = [...currentBaseFrameImages, ...currentLateFrameImages];
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
    const expectedLateCurrent = currentStageIndex > 4;
    const expectedCurrentBodyImages = expectedLateCurrent ? currentLateBodyImages : currentBaseBodyImages;
    const expectedCurrentFrameImages = expectedLateCurrent ? currentLateFrameImages : currentBaseFrameImages;
    const bodyAtCurrentStage = bodyImages.length === 1
      && expectedCurrentBodyImages.length === 1
      && (expectedLateCurrent ? currentBaseBodyImages.length === 0 : currentLateBodyImages.length === 0)
      && expectedNode
      && Math.abs(expectedCurrentBodyImages[0].x - (expectedNode.x + expectedNode.width * 0.02)) <= 1
      && Math.abs(expectedCurrentBodyImages[0].y - (expectedNode.y + expectedNode.height * 0.04)) <= 1
      && Math.abs(expectedCurrentBodyImages[0].displayWidth - expectedNode.width * 1.12) <= 1
      && Math.abs(expectedCurrentBodyImages[0].displayHeight - expectedNode.height * 1.16) <= 1
      && (expectedCurrentBodyImages[0].alpha ?? 1) >= 0.64;
    const frameAtCurrentStage = frameImages.length === 1
      && expectedCurrentFrameImages.length === 1
      && (expectedLateCurrent ? currentBaseFrameImages.length === 0 : currentLateFrameImages.length === 0)
      && expectedNode
      && Math.abs(expectedCurrentFrameImages[0].x - (expectedNode.x + expectedNode.width * 0.02)) <= 1
      && Math.abs(expectedCurrentFrameImages[0].y - (expectedNode.y + expectedNode.height * 0.01)) <= 1
      && Math.abs(expectedCurrentFrameImages[0].displayWidth - expectedNode.width * 1.34) <= 1
      && Math.abs(expectedCurrentFrameImages[0].displayHeight - expectedNode.height * 1.38) <= 1
      && (expectedCurrentFrameImages[0].alpha ?? 1) >= 0.88;
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
      ok: underlayIndex >= 0 && visiblePlayImages === 1 && visibleRouteImages === 0 && markerAtCurrentStage && haloAtCurrentStage && bodyAtCurrentStage && frameAtCurrentStage && statusAtCurrentStage && visibleTextCount === 0 && visibleRectsAboveUnderlay === 0,
      hasUnderlay: underlayIndex >= 0,
      visiblePlayImages,
      visibleRouteImages,
      currentStageId: context?.run?.stageId,
      visibleCurrentMarkerImages: markerImages.length,
      markerAtCurrentStage: Boolean(markerAtCurrentStage),
      visibleCurrentHaloImages: haloImages.length,
      haloAtCurrentStage: Boolean(haloAtCurrentStage),
      visibleCurrentBodyImages: bodyImages.length,
      visibleCurrentBaseBodyImages: currentBaseBodyImages.length,
      visibleCurrentLateBodyImages: currentLateBodyImages.length,
      bodyAtCurrentStage: Boolean(bodyAtCurrentStage),
      visibleCurrentFrameImages: frameImages.length,
      visibleCurrentBaseFrameImages: currentBaseFrameImages.length,
      visibleCurrentLateFrameImages: currentLateFrameImages.length,
      frameAtCurrentStage: Boolean(frameAtCurrentStage),
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
      { label: "stage4topMarkerScar", x: 1022, y: 512, maxCyanDominance: 18, maxRedDominance: 30 },
      { label: "stage4statusScar", x: 1075, y: 641, maxCyanDominance: 18, maxRedDominance: 30 },
      { label: "stage4routeDots", x: 940, y: 503 },
      { label: "stage5body", x: 1176, y: 540 },
      { label: "stage5lowerSeal", x: 1180, y: 592 },
      { label: "stage5route", x: 1114, y: 568 },
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
      ok: samples.every((sample) => (
        sample.greenDominance < (sample.maxGreenDominance ?? 24)
        && sample.cyanDominance < (sample.maxCyanDominance ?? 28)
        && sample.redDominance < (sample.maxRedDominance ?? 42)
      )),
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
      const currentBaseBodyImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_current_stage_body_wash_concept" && (child.alpha ?? 1) > 0.05);
      const currentLateBodyImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_current_stage_late_body_wash_concept" && (child.alpha ?? 1) > 0.05);
      const bodyImages = [...currentBaseBodyImages, ...currentLateBodyImages];
      const currentBaseFrameImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_current_stage_frame_concept" && (child.alpha ?? 1) > 0.05);
      const currentLateFrameImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_current_stage_late_frame_concept" && (child.alpha ?? 1) > 0.05);
      const frameImages = [...currentBaseFrameImages, ...currentLateFrameImages];
      const haloImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_current_stage_halo_concept" && (child.alpha ?? 1) > 0.05);
      const statusImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_current_stage_status_badge_concept" && (child.alpha ?? 1) > 0.05);
      const completedBaseImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_completed_stage_badge_concept" && (child.alpha ?? 1) > 0.05);
      const completedLateImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_completed_stage_late_badge_concept" && (child.alpha ?? 1) > 0.05);
      const completedImages = [...completedBaseImages, ...completedLateImages];
      const completedBaseBodyImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_completed_stage_body_wash_concept" && (child.alpha ?? 1) > 0.05);
      const completedLateBodyImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_completed_stage_late_body_wash_concept" && (child.alpha ?? 1) > 0.05);
      const completedBodyImages = [...completedBaseBodyImages, ...completedLateBodyImages];
      const completedBaseFrameImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_completed_stage_frame_concept" && (child.alpha ?? 1) > 0.05);
      const completedLateFrameImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_completed_stage_late_frame_concept" && (child.alpha ?? 1) > 0.05);
      const completedFrameImages = [...completedBaseFrameImages, ...completedLateFrameImages];
      const lockedNextBodyImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_locked_stage_body_wash_concept" && (child.alpha ?? 1) > 0.05);
      const lockedFarBodyImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_locked_stage_far_body_wash_concept" && (child.alpha ?? 1) > 0.05);
      const lockedBodyImages = [...lockedNextBodyImages, ...lockedFarBodyImages];
      const sealedBodyImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_sealed_stage_body_wash_concept" && (child.alpha ?? 1) > 0.05);
      const sealedFrameImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_sealed_stage_frame_concept" && (child.alpha ?? 1) > 0.05);
      const dormantBaseBodyImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_dormant_stage_body_wash_concept" && (child.alpha ?? 1) > 0.05);
      const dormantMidBodyImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_dormant_stage_mid_body_wash_concept" && (child.alpha ?? 1) > 0.05);
      const dormantBodyImages = [...dormantBaseBodyImages, ...dormantMidBodyImages];
      const dormantBaseFrameImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_dormant_stage_frame_concept" && (child.alpha ?? 1) > 0.05);
      const dormantMidFrameImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_dormant_stage_mid_frame_concept" && (child.alpha ?? 1) > 0.05);
      const dormantFrameImages = [...dormantBaseFrameImages, ...dormantMidFrameImages];
      const routeBaseThreadImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_world_map_route_progress_thread_concept" && (child.alpha ?? 1) > 0.05);
      const routeCurrentThreadImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_world_map_route_progress_current_thread_concept" && (child.alpha ?? 1) > 0.05);
      const routeLockedThreadImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_world_map_route_locked_thread_concept" && (child.alpha ?? 1) > 0.05);
      const routeThreadImages = [...routeBaseThreadImages, ...routeCurrentThreadImages];
      const routeBaseBeadImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_world_map_route_progress_bead_concept" && (child.alpha ?? 1) > 0.05);
      const routeCurrentBeadImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_world_map_route_progress_current_bead_concept" && (child.alpha ?? 1) > 0.05);
      const routeLockedBeadImages = visible.filter((child) => child?.type === "Image" && child.texture?.key === "ui_world_map_route_locked_bead_concept" && (child.alpha ?? 1) > 0.05);
      const routeBeadImages = [...routeBaseBeadImages, ...routeCurrentBeadImages];
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
      const expectedLateCurrent = currentIndex > 4;
      const expectedCurrentBodyImages = expectedLateCurrent ? currentLateBodyImages : currentBaseBodyImages;
      const expectedCurrentFrameImages = expectedLateCurrent ? currentLateFrameImages : currentBaseFrameImages;
      const bodyAtSelectedStage = bodyImages.length === 1
        && expectedCurrentBodyImages.length === 1
        && (expectedLateCurrent ? currentBaseBodyImages.length === 0 : currentLateBodyImages.length === 0)
        && currentNode
        && Math.abs(expectedCurrentBodyImages[0].x - (currentNode.x + currentNode.width * 0.02)) <= 1
        && Math.abs(expectedCurrentBodyImages[0].y - (currentNode.y + currentNode.height * 0.04)) <= 1
        && Math.abs(expectedCurrentBodyImages[0].displayWidth - currentNode.width * 1.12) <= 1
        && Math.abs(expectedCurrentBodyImages[0].displayHeight - currentNode.height * 1.16) <= 1
        && (expectedCurrentBodyImages[0].alpha ?? 1) >= 0.64;
      const frameAtSelectedStage = frameImages.length === 1
        && expectedCurrentFrameImages.length === 1
        && (expectedLateCurrent ? currentBaseFrameImages.length === 0 : currentLateFrameImages.length === 0)
        && currentNode
        && Math.abs(expectedCurrentFrameImages[0].x - (currentNode.x + currentNode.width * 0.02)) <= 1
        && Math.abs(expectedCurrentFrameImages[0].y - (currentNode.y + currentNode.height * 0.01)) <= 1
        && Math.abs(expectedCurrentFrameImages[0].displayWidth - currentNode.width * 1.34) <= 1
        && Math.abs(expectedCurrentFrameImages[0].displayHeight - currentNode.height * 1.38) <= 1
        && (expectedCurrentFrameImages[0].alpha ?? 1) >= 0.88;
      const statusAtSelectedStage = statusImages.length === 1
        && currentNode
        && Math.abs(statusImages[0].x - (currentNode.x + currentNode.width * 0.1)) <= 1
        && Math.abs(statusImages[0].y - (currentNode.y + currentNode.height * 0.36)) <= 1;
      const selectedStageHasNoCompletedBadge = !currentNode || !completedImages.some((image) => (
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.6
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.6
      ));
      const selectedStageHasNoCompletedBody = !currentNode || completedBodyImages.every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const selectedStageHasNoCompletedFrame = !currentNode || !completedFrameImages.some((image) => (
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const selectedStageHasNoLockedBody = !currentNode || lockedBodyImages.every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const selectedStageHasNoSealedBody = !currentNode || sealedBodyImages.every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const selectedStageHasNoSealedFrame = !currentNode || sealedFrameImages.every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const selectedStageHasNoDormantBody = !currentNode || dormantBodyImages.every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const selectedStageHasNoDormantFrame = !currentNode || dormantFrameImages.every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const log = context?.run?.log ?? [];
      return {
        ok: underlayIndex >= 0
          && currentStageId === expectedStageId
          && markerAtSelectedStage
          && haloAtSelectedStage
          && bodyAtSelectedStage
          && frameAtSelectedStage
          && statusAtSelectedStage
          && selectedStageHasNoCompletedBadge
          && selectedStageHasNoCompletedBody
          && selectedStageHasNoCompletedFrame
          && selectedStageHasNoLockedBody
          && selectedStageHasNoSealedBody
          && selectedStageHasNoSealedFrame
          && selectedStageHasNoDormantBody
          && selectedStageHasNoDormantFrame
          && routeThreadImages.length === 0
          && routeBeadImages.length === 0
          && routeLockedThreadImages.length === 0
          && routeLockedBeadImages.length === 0
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
        visibleCurrentBodyImages: bodyImages.length,
        visibleCurrentBaseBodyImages: currentBaseBodyImages.length,
        visibleCurrentLateBodyImages: currentLateBodyImages.length,
        bodyAtSelectedStage: Boolean(bodyAtSelectedStage),
        visibleCurrentFrameImages: frameImages.length,
        visibleCurrentBaseFrameImages: currentBaseFrameImages.length,
        visibleCurrentLateFrameImages: currentLateFrameImages.length,
        frameAtSelectedStage: Boolean(frameAtSelectedStage),
        visibleCurrentStatusImages: statusImages.length,
        statusAtSelectedStage: Boolean(statusAtSelectedStage),
        selectedStageHasNoCompletedBadge,
        selectedStageHasNoCompletedBody,
        selectedStageHasNoCompletedFrame,
        selectedStageHasNoLockedBody,
        selectedStageHasNoSealedBody,
        selectedStageHasNoSealedFrame,
        selectedStageHasNoDormantBody,
        selectedStageHasNoDormantFrame,
        visibleRouteThreads: routeThreadImages.length,
        visibleRouteBeads: routeBeadImages.length,
        visibleRouteLockedThreads: routeLockedThreadImages.length,
        visibleRouteLockedBeads: routeLockedBeadImages.length,
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
      const completedBaseImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_completed_stage_badge_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const completedLateImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_completed_stage_late_badge_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const completedImages = [...completedBaseImages, ...completedLateImages];
      const completedBaseBodyImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_completed_stage_body_wash_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const completedLateBodyImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_completed_stage_late_body_wash_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const completedBodyImages = [...completedBaseBodyImages, ...completedLateBodyImages];
      const completedBaseFrameImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_completed_stage_frame_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const completedLateFrameImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_completed_stage_late_frame_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const completedFrameImages = [...completedBaseFrameImages, ...completedLateFrameImages];
      const lockedImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_locked_stage_badge_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const lockedNextBodyImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_locked_stage_body_wash_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const lockedFarBodyImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_locked_stage_far_body_wash_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const lockedBodyImages = [...lockedNextBodyImages, ...lockedFarBodyImages];
      const lockedNextFrameImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_locked_stage_frame_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const lockedFarFrameImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_locked_stage_far_frame_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const lockedFrameImages = [...lockedNextFrameImages, ...lockedFarFrameImages];
      const sealedImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_sealed_stage_badge_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const sealedBodyImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_sealed_stage_body_wash_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const sealedFrameImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_sealed_stage_frame_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const dormantBaseBodyImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_dormant_stage_body_wash_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const dormantMidBodyImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_dormant_stage_mid_body_wash_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const dormantBodyImages = [...dormantBaseBodyImages, ...dormantMidBodyImages];
      const dormantBaseFrameImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_dormant_stage_frame_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const dormantMidFrameImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_dormant_stage_mid_frame_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const dormantFrameImages = [...dormantBaseFrameImages, ...dormantMidFrameImages];
      const routeBaseThreadImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_world_map_route_progress_thread_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const routeCurrentThreadImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_world_map_route_progress_current_thread_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const routeLockedThreadImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_world_map_route_locked_thread_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const routeThreadImages = [...routeBaseThreadImages, ...routeCurrentThreadImages];
      const routeBaseBeadImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_world_map_route_progress_bead_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const routeCurrentBeadImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_world_map_route_progress_current_bead_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const routeLockedBeadImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_world_map_route_locked_bead_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const routeBeadImages = [...routeBaseBeadImages, ...routeCurrentBeadImages];
      const markerImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_current_stage_marker_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const currentBaseBodyImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_current_stage_body_wash_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const currentLateBodyImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_current_stage_late_body_wash_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const currentBodyImages = [...currentBaseBodyImages, ...currentLateBodyImages];
      const currentBaseFrameImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_current_stage_frame_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const currentLateFrameImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_current_stage_late_frame_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const frameImages = [...currentBaseFrameImages, ...currentLateFrameImages];
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
      const lowerNodeBodyImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_world_map_lower_node_body_concept"
        && (child.alpha ?? 1) > 0.05
      ));
      const lowerNodeFrameImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_world_map_lower_node_frame_concept"
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
        .map((stage, index) => ({ stage, node: stageNodes[index], index }))
        .filter(({ stage, node }) => node && stage.id !== currentStageId && completedStageIds.has(stage.id));
      const expectedCompletedBase = expectedCompleted.filter(({ index }) => index <= 2);
      const expectedCompletedLate = expectedCompleted.filter(({ index }) => index > 2);
      const expectedLocked = stages
        .map((stage, index) => ({ stage, node: stageNodes[index], index }))
        .filter(({ stage, node, index }) => node && !unlockedStageIds.has(stage.id) && index >= 9);
      const expectedLockedNext = expectedLocked.filter(({ index }) => index === firstLockedIndex);
      const expectedLockedFar = expectedLocked.filter(({ index }) => index !== firstLockedIndex);
      const expectedSealed = stages
        .map((stage, index) => ({ stage, node: stageNodes[index] }))
        .filter(({ stage, node }, index) => node && !unlockedStageIds.has(stage.id) && index < 9 && index === firstLockedIndex);
      const expectedDormant = stages
        .map((stage, index) => ({ stage, node: stageNodes[index], index }))
        .filter(({ stage, node, index }) => node && !unlockedStageIds.has(stage.id) && index < 9 && index !== firstLockedIndex);
      const expectedDormantBase = expectedDormant.filter(({ index }) => index <= 4);
      const expectedDormantMid = expectedDormant.filter(({ index }) => index > 4);
      const imageAt = (images, x, y) => images.find((image) => Math.abs(image.x - x) <= 1 && Math.abs(image.y - y) <= 1);
      const hasImageAt = (images, x, y) => Boolean(imageAt(images, x, y));
      const routeBeadPlacements = (fromNode, toNode, finalLeg) => {
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const length = Math.hypot(dx, dy);
        if (length <= 1) return [];
        const fromPad = Math.max(fromNode.width, fromNode.height) * 0.36;
        const toPad = Math.max(toNode.width, toNode.height) * 0.36;
        const usableLength = Math.max(0, length - fromPad - toPad);
        if (usableLength < 24) return [];
        const count = Math.max(1, Math.floor(usableLength / 46));
        return Array.from({ length: count }, (_, beadIndex) => {
          const progress = (fromPad + usableLength * ((beadIndex + 1) / (count + 1))) / length;
          return {
            x: fromNode.x + dx * progress,
            y: fromNode.y + dy * progress,
            finalLeg,
            size: finalLeg ? 44 : 38,
            minAlpha: finalLeg ? 0.6 : 0.44
          };
        });
      };
      const routeThreadPlacement = (fromNode, toNode, finalLeg) => {
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const length = Math.hypot(dx, dy);
        if (length <= 1) return undefined;
        const fromPad = Math.max(fromNode.width, fromNode.height) * 0.43;
        const toPad = Math.max(toNode.width, toNode.height) * 0.43;
        const usableLength = Math.max(0, length - fromPad - toPad);
        if (usableLength < 28) return undefined;
        const startProgress = fromPad / length;
        const endProgress = (fromPad + usableLength) / length;
        return {
          x: fromNode.x + dx * ((startProgress + endProgress) * 0.5),
          y: fromNode.y + dy * ((startProgress + endProgress) * 0.5),
          finalLeg,
          width: usableLength + (finalLeg ? 18 : 12),
          height: finalLeg ? 30 : 24,
          minAlpha: finalLeg ? 0.4 : 0.28
        };
      };
      const lockedRouteBeadPlacements = (fromNode, toNode) => {
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const length = Math.hypot(dx, dy);
        if (length <= 1) return [];
        const fromPad = Math.max(fromNode.width, fromNode.height) * 0.44;
        const toPad = Math.max(toNode.width, toNode.height) * 0.44;
        const usableLength = Math.max(0, length - fromPad - toPad);
        if (usableLength < 34) return [];
        const count = Math.max(1, Math.floor(usableLength / 76));
        return Array.from({ length: count }, (_, beadIndex) => {
          const progress = (fromPad + usableLength * ((beadIndex + 1) / (count + 1))) / length;
          return {
            x: fromNode.x + dx * progress,
            y: fromNode.y + dy * progress,
            size: 30,
            minAlpha: 0.32
          };
        });
      };
      const lockedRouteThreadPlacement = (fromNode, toNode) => {
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const length = Math.hypot(dx, dy);
        if (length <= 1) return undefined;
        const fromPad = Math.max(fromNode.width, fromNode.height) * 0.48;
        const toPad = Math.max(toNode.width, toNode.height) * 0.48;
        const usableLength = Math.max(0, length - fromPad - toPad);
        if (usableLength < 26) return undefined;
        const startProgress = fromPad / length;
        const endProgress = (fromPad + usableLength) / length;
        return {
          x: fromNode.x + dx * ((startProgress + endProgress) * 0.5),
          y: fromNode.y + dy * ((startProgress + endProgress) * 0.5),
          width: usableLength + 8,
          height: 18,
          minAlpha: 0.24
        };
      };
      const expectedRouteThreads = [];
      const expectedRouteBeads = [];
      for (let routeIndex = 0; routeIndex < currentIndex; routeIndex += 1) {
        const fromStage = stages[routeIndex];
        const toStage = stages[routeIndex + 1];
        const fromNode = stageNodes[routeIndex];
        const toNode = stageNodes[routeIndex + 1];
        if (!fromStage || !toStage || !fromNode || !toNode) continue;
        if (!completedStageIds.has(fromStage.id)) continue;
        if (toStage.id !== currentStageId && !completedStageIds.has(toStage.id)) continue;
        const finalLeg = routeIndex === currentIndex - 1;
        const thread = routeThreadPlacement(fromNode, toNode, finalLeg);
        if (thread) expectedRouteThreads.push(thread);
        expectedRouteBeads.push(...routeBeadPlacements(fromNode, toNode, finalLeg));
      }
      const expectedLockedRouteThreads = [];
      const expectedLockedRouteBeads = [];
      for (let routeIndex = currentIndex; routeIndex < stages.length - 1; routeIndex += 1) {
        const toStage = stages[routeIndex + 1];
        const fromNode = stageNodes[routeIndex];
        const toNode = stageNodes[routeIndex + 1];
        if (!toStage || !fromNode || !toNode || unlockedStageIds.has(toStage.id)) continue;
        const thread = lockedRouteThreadPlacement(fromNode, toNode);
        if (thread) expectedLockedRouteThreads.push(thread);
        expectedLockedRouteBeads.push(...lockedRouteBeadPlacements(fromNode, toNode));
      }
      const expectedRouteBaseThreads = expectedRouteThreads.filter((placement) => !placement.finalLeg);
      const expectedRouteCurrentThreads = expectedRouteThreads.filter((placement) => placement.finalLeg);
      const expectedRouteBaseBeads = expectedRouteBeads.filter((placement) => !placement.finalLeg);
      const expectedRouteCurrentBeads = expectedRouteBeads.filter((placement) => placement.finalLeg);
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
      const currentBodyPlacement = (node) => ({
        x: node.x + node.width * 0.02,
        y: node.y + node.height * 0.04,
        width: node.width * 1.12,
        height: node.height * 1.16,
        minAlpha: 0.64
      });
      const lowerNodeBodyPlacement = (node, stageIndex) => {
        const largerSourceNode = stageIndex === 3;
        return {
          x: node.x + node.width * 0.02,
          y: node.y + node.height * (largerSourceNode ? 0.05 : 0.04),
          width: node.width * (largerSourceNode ? 1.08 : 1.14),
          height: node.height * (largerSourceNode ? 1.14 : 1.2),
          minAlpha: largerSourceNode ? 0.42 : 0.48
        };
      };
      const lowerNodeFramePlacement = (node, stageIndex) => {
        const largerSourceNode = stageIndex === 3;
        return {
          x: node.x + node.width * 0.02,
          y: node.y + node.height * (largerSourceNode ? 0.03 : 0.02),
          width: node.width * (largerSourceNode ? 1.18 : 1.28),
          height: node.height * (largerSourceNode ? 1.24 : 1.34),
          minAlpha: largerSourceNode ? 0.46 : 0.54
        };
      };
      const completedBodyPlacement = (node, stageIndex) => ({
        x: node.x + node.width * 0.02,
        y: node.y + node.height * 0.04,
        width: node.width * 1.12,
        height: node.height * 1.18,
        minAlpha: stageIndex <= 2 ? 0.6 : stageIndex <= 4 ? 0.52 : 0.44
      });
      const completedFramePlacement = (node, stageIndex) => ({
        x: node.x + node.width * 0.02,
        y: node.y + node.height * 0.02,
        width: node.width * 1.3,
        height: node.height * 1.36,
        minAlpha: stageIndex <= 2 ? 0.7 : stageIndex <= 4 ? 0.64 : 0.56
      });
      const lockedFramePlacement = (node, stageIndex) => {
        const nextLocked = stageIndex === firstLockedIndex;
        const upperBossNode = stageIndex >= 13;
        return {
          x: node.x + node.width * (upperBossNode ? -0.02 : 0.01),
          y: node.y + node.height * (upperBossNode ? 0.08 : 0.05),
          width: node.width * (upperBossNode ? 1.24 : 1.28),
          height: node.height * (upperBossNode ? 1.24 : 1.32),
          minAlpha: nextLocked ? 0.72 : 0.56
        };
      };
      const lockedBodyPlacement = (node, stageIndex) => {
        const nextLocked = stageIndex === firstLockedIndex;
        const upperBossNode = stageIndex >= 13;
        return {
          x: node.x + node.width * (upperBossNode ? -0.02 : 0.01),
          y: node.y + node.height * (upperBossNode ? 0.09 : 0.06),
          width: node.width * (upperBossNode ? 1.08 : 1.12),
          height: node.height * (upperBossNode ? 1.1 : 1.18),
          minAlpha: nextLocked ? 0.54 : 0.4
        };
      };
      const sealedBodyPlacement = (node) => ({
        x: node.x + node.width * 0.01,
        y: node.y + node.height * 0.07,
        width: node.width * 1.1,
        height: node.height * 1.16,
        minAlpha: 0.48
      });
      const sealedFramePlacement = (node) => ({
        x: node.x + node.width * 0.01,
        y: node.y + node.height * 0.05,
        width: node.width * 1.24,
        height: node.height * 1.3,
        minAlpha: 0.56
      });
      const dormantBodyPlacement = (node, stageIndex) => {
        const lowerNode = stageIndex <= 4;
        return {
          x: node.x + node.width * 0.01,
          y: node.y + node.height * (lowerNode ? 0.06 : 0.07),
          width: node.width * (lowerNode ? 1.12 : 1.08),
          height: node.height * (lowerNode ? 1.18 : 1.14),
          minAlpha: lowerNode ? 0.4 : 0.32
        };
      };
      const dormantFramePlacement = (node, stageIndex) => {
        const lowerNode = stageIndex <= 4;
        return {
          x: node.x + node.width * 0.01,
          y: node.y + node.height * (lowerNode ? 0.04 : 0.05),
          width: node.width * (lowerNode ? 1.26 : 1.2),
          height: node.height * (lowerNode ? 1.32 : 1.26),
          minAlpha: lowerNode ? 0.48 : 0.38
        };
      };
      const dormantBodyImagesForIndex = (stageIndex) => stageIndex > 4 ? dormantMidBodyImages : dormantBaseBodyImages;
      const dormantFrameImagesForIndex = (stageIndex) => stageIndex > 4 ? dormantMidFrameImages : dormantBaseFrameImages;
      const lockedBodyImagesForIndex = (stageIndex) => stageIndex === firstLockedIndex ? lockedNextBodyImages : lockedFarBodyImages;
      const lockedFrameImagesForIndex = (stageIndex) => stageIndex === firstLockedIndex ? lockedNextFrameImages : lockedFarFrameImages;
      const sealedBadgePlacement = (node) => ({
        x: node.x + node.width * 0.01,
        y: node.y + node.height * 0.39
      });
      const completedBadgeImagesForIndex = (stageIndex) => stageIndex > 2 ? completedLateImages : completedBaseImages;
      const completedBodyImagesForIndex = (stageIndex) => stageIndex > 2 ? completedLateBodyImages : completedBaseBodyImages;
      const completedFrameImagesForIndex = (stageIndex) => stageIndex > 2 ? completedLateFrameImages : completedBaseFrameImages;
      const expectedLowerNodeBodies = stageNodes
        .slice(0, 5)
        .map((node, index) => ({ node, index }));
      const lowerNodeBodiesAtExpectedNodes = expectedLowerNodeBodies.every(({ node, index }) => {
        const placement = lowerNodeBodyPlacement(node, index);
        return hasImageAt(lowerNodeBodyImages, placement.x, placement.y);
      });
      const lowerNodeBodyStyleAtExpectedNodes = expectedLowerNodeBodies.every(({ node, index }) => {
        const placement = lowerNodeBodyPlacement(node, index);
        const image = imageAt(lowerNodeBodyImages, placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.width) <= 1
          && Math.abs(image.displayHeight - placement.height) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const lowerNodeFramesAtExpectedNodes = expectedLowerNodeBodies.every(({ node, index }) => {
        const placement = lowerNodeFramePlacement(node, index);
        return hasImageAt(lowerNodeFrameImages, placement.x, placement.y);
      });
      const lowerNodeFrameStyleAtExpectedNodes = expectedLowerNodeBodies.every(({ node, index }) => {
        const placement = lowerNodeFramePlacement(node, index);
        const image = imageAt(lowerNodeFrameImages, placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.width) <= 1
          && Math.abs(image.displayHeight - placement.height) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const completedAtExpectedNodes = expectedCompleted.every(({ node, index }) => (
        hasImageAt(completedBadgeImagesForIndex(index), completedBadgePlacement(node, index).x, completedBadgePlacement(node, index).y)
      ));
      const completedStyleAtExpectedNodes = expectedCompleted.every(({ node, index }) => {
        const placement = completedBadgePlacement(node, index);
        const image = imageAt(completedBadgeImagesForIndex(index), placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.size) <= 1
          && Math.abs(image.displayHeight - placement.size) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const completedBodiesAtExpectedNodes = expectedCompleted.every(({ node, index }) => (
        hasImageAt(completedBodyImagesForIndex(index), completedBodyPlacement(node, index).x, completedBodyPlacement(node, index).y)
      ));
      const completedBodyStyleAtExpectedNodes = expectedCompleted.every(({ node, index }) => {
        const placement = completedBodyPlacement(node, index);
        const image = imageAt(completedBodyImagesForIndex(index), placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.width) <= 1
          && Math.abs(image.displayHeight - placement.height) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const completedFramesAtExpectedNodes = expectedCompleted.every(({ node, index }) => (
        hasImageAt(completedFrameImagesForIndex(index), completedFramePlacement(node, index).x, completedFramePlacement(node, index).y)
      ));
      const completedFrameStyleAtExpectedNodes = expectedCompleted.every(({ node, index }) => {
        const placement = completedFramePlacement(node, index);
        const image = imageAt(completedFrameImagesForIndex(index), placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.width) <= 1
          && Math.abs(image.displayHeight - placement.height) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const lockedBodiesAtExpectedNodes = expectedLocked.every(({ node, stage }) => {
        const stageIndex = stages.findIndex((candidate) => candidate.id === stage.id);
        const placement = lockedBodyPlacement(node, stageIndex);
        return hasImageAt(lockedBodyImagesForIndex(stageIndex), placement.x, placement.y);
      });
      const lockedBodyStyleAtExpectedNodes = expectedLocked.every(({ node, stage }) => {
        const stageIndex = stages.findIndex((candidate) => candidate.id === stage.id);
        const placement = lockedBodyPlacement(node, stageIndex);
        const image = imageAt(lockedBodyImagesForIndex(stageIndex), placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.width) <= 1
          && Math.abs(image.displayHeight - placement.height) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const lockedFramesAtExpectedNodes = expectedLocked.every(({ node, stage }) => {
        const stageIndex = stages.findIndex((candidate) => candidate.id === stage.id);
        const placement = lockedFramePlacement(node, stageIndex);
        return hasImageAt(lockedFrameImagesForIndex(stageIndex), placement.x, placement.y);
      });
      const lockedFrameStyleAtExpectedNodes = expectedLocked.every(({ node, stage }) => {
        const stageIndex = stages.findIndex((candidate) => candidate.id === stage.id);
        const placement = lockedFramePlacement(node, stageIndex);
        const image = imageAt(lockedFrameImagesForIndex(stageIndex), placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.width) <= 1
          && Math.abs(image.displayHeight - placement.height) <= 1
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
        hasImageAt(sealedImages, sealedBadgePlacement(node).x, sealedBadgePlacement(node).y)
      ));
      const sealedStyleAtExpectedNodes = expectedSealed.every(({ node }) => {
        const image = imageAt(sealedImages, sealedBadgePlacement(node).x, sealedBadgePlacement(node).y);
        return image
          && Math.abs(image.displayWidth - 60) <= 1
          && Math.abs(image.displayHeight - 60) <= 1
          && (image.alpha ?? 1) >= 0.8;
      });
      const sealedBodiesAtExpectedNodes = expectedSealed.every(({ node }) => (
        hasImageAt(sealedBodyImages, sealedBodyPlacement(node).x, sealedBodyPlacement(node).y)
      ));
      const sealedBodyStyleAtExpectedNodes = expectedSealed.every(({ node }) => {
        const placement = sealedBodyPlacement(node);
        const image = imageAt(sealedBodyImages, placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.width) <= 1
          && Math.abs(image.displayHeight - placement.height) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const sealedFramesAtExpectedNodes = expectedSealed.every(({ node }) => (
        hasImageAt(sealedFrameImages, sealedFramePlacement(node).x, sealedFramePlacement(node).y)
      ));
      const sealedFrameStyleAtExpectedNodes = expectedSealed.every(({ node }) => {
        const placement = sealedFramePlacement(node);
        const image = imageAt(sealedFrameImages, placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.width) <= 1
          && Math.abs(image.displayHeight - placement.height) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const dormantBodiesAtExpectedNodes = expectedDormant.every(({ node, index }) => (
        hasImageAt(dormantBodyImagesForIndex(index), dormantBodyPlacement(node, index).x, dormantBodyPlacement(node, index).y)
      ));
      const dormantBodyStyleAtExpectedNodes = expectedDormant.every(({ node, index }) => {
        const placement = dormantBodyPlacement(node, index);
        const image = imageAt(dormantBodyImagesForIndex(index), placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.width) <= 1
          && Math.abs(image.displayHeight - placement.height) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const dormantFramesAtExpectedNodes = expectedDormant.every(({ node, index }) => (
        hasImageAt(dormantFrameImagesForIndex(index), dormantFramePlacement(node, index).x, dormantFramePlacement(node, index).y)
      ));
      const dormantFrameStyleAtExpectedNodes = expectedDormant.every(({ node, index }) => {
        const placement = dormantFramePlacement(node, index);
        const image = imageAt(dormantFrameImagesForIndex(index), placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.width) <= 1
          && Math.abs(image.displayHeight - placement.height) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const routeThreadImagesForPlacement = (placement) => placement.finalLeg ? routeCurrentThreadImages : routeBaseThreadImages;
      const routeBeadImagesForPlacement = (placement) => placement.finalLeg ? routeCurrentBeadImages : routeBaseBeadImages;
      const routeBeadsAtExpectedSegments = expectedRouteBeads.every((placement) => (
        hasImageAt(routeBeadImagesForPlacement(placement), placement.x, placement.y)
      ));
      const routeBeadStyleAtExpectedSegments = expectedRouteBeads.every((placement) => {
        const image = imageAt(routeBeadImagesForPlacement(placement), placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.size) <= 1
          && Math.abs(image.displayHeight - placement.size) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const routeThreadsAtExpectedSegments = expectedRouteThreads.every((placement) => (
        hasImageAt(routeThreadImagesForPlacement(placement), placement.x, placement.y)
      ));
      const routeThreadStyleAtExpectedSegments = expectedRouteThreads.every((placement) => {
        const image = imageAt(routeThreadImagesForPlacement(placement), placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.width) <= 1
          && Math.abs(image.displayHeight - placement.height) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const lockedRouteBeadsAtExpectedSegments = expectedLockedRouteBeads.every((placement) => (
        hasImageAt(routeLockedBeadImages, placement.x, placement.y)
      ));
      const lockedRouteBeadStyleAtExpectedSegments = expectedLockedRouteBeads.every((placement) => {
        const image = imageAt(routeLockedBeadImages, placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.size) <= 1
          && Math.abs(image.displayHeight - placement.size) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const lockedRouteThreadsAtExpectedSegments = expectedLockedRouteThreads.every((placement) => (
        hasImageAt(routeLockedThreadImages, placement.x, placement.y)
      ));
      const lockedRouteThreadStyleAtExpectedSegments = expectedLockedRouteThreads.every((placement) => {
        const image = imageAt(routeLockedThreadImages, placement.x, placement.y);
        return image
          && Math.abs(image.displayWidth - placement.width) <= 1
          && Math.abs(image.displayHeight - placement.height) <= 1
          && (image.alpha ?? 1) >= placement.minAlpha;
      });
      const markerAtCurrentStage = markerImages.length === 1
        && expectedMarker
        && Math.abs(markerImages[0].x - expectedMarker.x) <= 1
        && Math.abs(markerImages[0].y - expectedMarker.y) <= 1;
      const haloAtCurrentStage = haloImages.length === 1
        && currentNode
        && Math.abs(haloImages[0].x - (currentNode.x + 2)) <= 1
        && Math.abs(haloImages[0].y - (currentNode.y + 4)) <= 1;
      const expectedLateCurrent = currentIndex > 4;
      const expectedCurrentBodyImages = expectedLateCurrent ? currentLateBodyImages : currentBaseBodyImages;
      const expectedCurrentFrameImages = expectedLateCurrent ? currentLateFrameImages : currentBaseFrameImages;
      const bodyAtCurrentStage = currentBodyImages.length === 1
        && expectedCurrentBodyImages.length === 1
        && (expectedLateCurrent ? currentBaseBodyImages.length === 0 : currentLateBodyImages.length === 0)
        && currentNode
        && Math.abs(expectedCurrentBodyImages[0].x - currentBodyPlacement(currentNode).x) <= 1
        && Math.abs(expectedCurrentBodyImages[0].y - currentBodyPlacement(currentNode).y) <= 1
        && Math.abs(expectedCurrentBodyImages[0].displayWidth - currentBodyPlacement(currentNode).width) <= 1
        && Math.abs(expectedCurrentBodyImages[0].displayHeight - currentBodyPlacement(currentNode).height) <= 1
        && (expectedCurrentBodyImages[0].alpha ?? 1) >= currentBodyPlacement(currentNode).minAlpha;
      const frameAtCurrentStage = frameImages.length === 1
        && expectedCurrentFrameImages.length === 1
        && (expectedLateCurrent ? currentBaseFrameImages.length === 0 : currentLateFrameImages.length === 0)
        && currentNode
        && Math.abs(expectedCurrentFrameImages[0].x - (currentNode.x + currentNode.width * 0.02)) <= 1
        && Math.abs(expectedCurrentFrameImages[0].y - (currentNode.y + currentNode.height * 0.01)) <= 1
        && Math.abs(expectedCurrentFrameImages[0].displayWidth - currentNode.width * 1.34) <= 1
        && Math.abs(expectedCurrentFrameImages[0].displayHeight - currentNode.height * 1.38) <= 1
        && (expectedCurrentFrameImages[0].alpha ?? 1) >= 0.88;
      const statusAtCurrentStage = statusImages.length === 1
        && currentNode
        && Math.abs(statusImages[0].x - (currentNode.x + currentNode.width * 0.1)) <= 1
        && Math.abs(statusImages[0].y - (currentNode.y + currentNode.height * 0.36)) <= 1;
      const currentHasNoCompletedBadge = !currentNode || !completedImages.some((image) => (
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.6
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.6
      ));
      const currentHasNoCompletedBody = !currentNode || completedBodyImages.every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const currentHasNoCompletedFrame = !currentNode || !completedFrameImages.some((image) => (
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const currentHasNoLockedBadge = !currentNode || [...lockedImages, ...sealedImages].every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.6
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.6
      ));
      const currentHasNoLockedBody = !currentNode || lockedBodyImages.every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const currentHasNoLockedFrame = !currentNode || lockedFrameImages.every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const currentHasNoSealedBody = !currentNode || sealedBodyImages.every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const currentHasNoSealedFrame = !currentNode || sealedFrameImages.every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const currentHasNoDormantBody = !currentNode || dormantBodyImages.every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));
      const currentHasNoDormantFrame = !currentNode || dormantFrameImages.every((image) => !(
        Math.abs(image.x - currentNode.x) < currentNode.width * 0.72
        && Math.abs(image.y - currentNode.y) < currentNode.height * 0.72
      ));

      return {
        ok: lowerNodeBodyImages.length === expectedLowerNodeBodies.length
          && lowerNodeBodiesAtExpectedNodes
          && lowerNodeBodyStyleAtExpectedNodes
          && lowerNodeFrameImages.length === expectedLowerNodeBodies.length
          && lowerNodeFramesAtExpectedNodes
          && lowerNodeFrameStyleAtExpectedNodes
          && completedImages.length === expectedCompleted.length
          && completedBaseImages.length === expectedCompletedBase.length
          && completedLateImages.length === expectedCompletedLate.length
          && routeThreadImages.length === expectedRouteThreads.length
          && routeBaseThreadImages.length === expectedRouteBaseThreads.length
          && routeCurrentThreadImages.length === expectedRouteCurrentThreads.length
          && routeBeadImages.length === expectedRouteBeads.length
          && routeBaseBeadImages.length === expectedRouteBaseBeads.length
          && routeCurrentBeadImages.length === expectedRouteCurrentBeads.length
          && routeLockedThreadImages.length === expectedLockedRouteThreads.length
          && routeLockedBeadImages.length === expectedLockedRouteBeads.length
          && completedBodyImages.length === expectedCompleted.length
          && completedBaseBodyImages.length === expectedCompletedBase.length
          && completedLateBodyImages.length === expectedCompletedLate.length
          && completedFrameImages.length === expectedCompleted.length
          && completedBaseFrameImages.length === expectedCompletedBase.length
          && completedLateFrameImages.length === expectedCompletedLate.length
          && currentBodyImages.length === 1
          && currentBaseBodyImages.length === (expectedLateCurrent ? 0 : 1)
          && currentLateBodyImages.length === (expectedLateCurrent ? 1 : 0)
          && currentBaseFrameImages.length === (expectedLateCurrent ? 0 : 1)
          && currentLateFrameImages.length === (expectedLateCurrent ? 1 : 0)
          && lockedBodyImages.length === expectedLocked.length
          && lockedNextBodyImages.length === expectedLockedNext.length
          && lockedFarBodyImages.length === expectedLockedFar.length
          && lockedFrameImages.length === expectedLocked.length
          && lockedNextFrameImages.length === expectedLockedNext.length
          && lockedFarFrameImages.length === expectedLockedFar.length
          && lockedImages.length === expectedLocked.length
          && sealedBodyImages.length === expectedSealed.length
          && sealedFrameImages.length === expectedSealed.length
          && sealedImages.length === expectedSealed.length
          && dormantBodyImages.length === expectedDormant.length
          && dormantBaseBodyImages.length === expectedDormantBase.length
          && dormantMidBodyImages.length === expectedDormantMid.length
          && dormantFrameImages.length === expectedDormant.length
          && dormantBaseFrameImages.length === expectedDormantBase.length
          && dormantMidFrameImages.length === expectedDormantMid.length
          && completedAtExpectedNodes
          && completedStyleAtExpectedNodes
          && completedBodiesAtExpectedNodes
          && completedBodyStyleAtExpectedNodes
          && completedFramesAtExpectedNodes
          && completedFrameStyleAtExpectedNodes
          && lockedBodiesAtExpectedNodes
          && lockedBodyStyleAtExpectedNodes
          && lockedFramesAtExpectedNodes
          && lockedFrameStyleAtExpectedNodes
          && lockedAtExpectedNodes
          && lockedStyleAtExpectedNodes
          && sealedBodiesAtExpectedNodes
          && sealedBodyStyleAtExpectedNodes
          && sealedFramesAtExpectedNodes
          && sealedFrameStyleAtExpectedNodes
          && sealedAtExpectedNodes
          && sealedStyleAtExpectedNodes
          && dormantBodiesAtExpectedNodes
          && dormantBodyStyleAtExpectedNodes
          && dormantFramesAtExpectedNodes
          && dormantFrameStyleAtExpectedNodes
          && routeThreadsAtExpectedSegments
          && routeThreadStyleAtExpectedSegments
          && routeBeadsAtExpectedSegments
          && routeBeadStyleAtExpectedSegments
          && lockedRouteThreadsAtExpectedSegments
          && lockedRouteThreadStyleAtExpectedSegments
          && lockedRouteBeadsAtExpectedSegments
          && lockedRouteBeadStyleAtExpectedSegments
          && markerAtCurrentStage
          && haloAtCurrentStage
          && bodyAtCurrentStage
          && frameAtCurrentStage
          && statusAtCurrentStage
          && currentHasNoCompletedBadge
          && currentHasNoCompletedBody
          && currentHasNoCompletedFrame
          && currentHasNoLockedBadge
          && currentHasNoLockedBody
          && currentHasNoLockedFrame
          && currentHasNoSealedBody
          && currentHasNoSealedFrame
          && currentHasNoDormantBody
          && currentHasNoDormantFrame,
        currentStageId,
        completedStageIds: [...completedStageIds],
        unlockedStageIds: [...unlockedStageIds],
        visibleLowerNodeBodies: lowerNodeBodyImages.length,
        expectedLowerNodeBodies: expectedLowerNodeBodies.length,
        lowerNodeBodiesAtExpectedNodes,
        lowerNodeBodyStyleAtExpectedNodes,
        visibleLowerNodeFrames: lowerNodeFrameImages.length,
        expectedLowerNodeFrames: expectedLowerNodeBodies.length,
        lowerNodeFramesAtExpectedNodes,
        lowerNodeFrameStyleAtExpectedNodes,
        visibleRouteThreads: routeThreadImages.length,
        expectedRouteThreads: expectedRouteThreads.length,
        visibleRouteBaseThreads: routeBaseThreadImages.length,
        expectedRouteBaseThreads: expectedRouteBaseThreads.length,
        visibleRouteCurrentThreads: routeCurrentThreadImages.length,
        expectedRouteCurrentThreads: expectedRouteCurrentThreads.length,
        routeThreadsAtExpectedSegments,
        routeThreadStyleAtExpectedSegments,
        visibleRouteLockedThreads: routeLockedThreadImages.length,
        expectedRouteLockedThreads: expectedLockedRouteThreads.length,
        lockedRouteThreadsAtExpectedSegments,
        lockedRouteThreadStyleAtExpectedSegments,
        visibleRouteBeads: routeBeadImages.length,
        expectedRouteBeads: expectedRouteBeads.length,
        visibleRouteBaseBeads: routeBaseBeadImages.length,
        expectedRouteBaseBeads: expectedRouteBaseBeads.length,
        visibleRouteCurrentBeads: routeCurrentBeadImages.length,
        expectedRouteCurrentBeads: expectedRouteCurrentBeads.length,
        routeBeadsAtExpectedSegments,
        routeBeadStyleAtExpectedSegments,
        visibleRouteLockedBeads: routeLockedBeadImages.length,
        expectedRouteLockedBeads: expectedLockedRouteBeads.length,
        lockedRouteBeadsAtExpectedSegments,
        lockedRouteBeadStyleAtExpectedSegments,
        visibleCompletedBadges: completedImages.length,
        visibleCompletedBaseBadges: completedBaseImages.length,
        visibleCompletedLateBadges: completedLateImages.length,
        expectedCompletedBadges: expectedCompleted.length,
        expectedCompletedBaseBadges: expectedCompletedBase.length,
        expectedCompletedLateBadges: expectedCompletedLate.length,
        completedAtExpectedNodes,
        completedStyleAtExpectedNodes,
        visibleCompletedBodies: completedBodyImages.length,
        expectedCompletedBodies: expectedCompleted.length,
        visibleCompletedBaseBodies: completedBaseBodyImages.length,
        expectedCompletedBaseBodies: expectedCompletedBase.length,
        visibleCompletedLateBodies: completedLateBodyImages.length,
        expectedCompletedLateBodies: expectedCompletedLate.length,
        completedBodiesAtExpectedNodes,
        completedBodyStyleAtExpectedNodes,
        visibleCompletedFrames: completedFrameImages.length,
        expectedCompletedFrames: expectedCompleted.length,
        visibleCompletedBaseFrames: completedBaseFrameImages.length,
        expectedCompletedBaseFrames: expectedCompletedBase.length,
        visibleCompletedLateFrames: completedLateFrameImages.length,
        expectedCompletedLateFrames: expectedCompletedLate.length,
        completedFramesAtExpectedNodes,
        completedFrameStyleAtExpectedNodes,
        visibleLockedBodies: lockedBodyImages.length,
        expectedLockedBodies: expectedLocked.length,
        visibleLockedNextBodies: lockedNextBodyImages.length,
        expectedLockedNextBodies: expectedLockedNext.length,
        visibleLockedFarBodies: lockedFarBodyImages.length,
        expectedLockedFarBodies: expectedLockedFar.length,
        lockedBodiesAtExpectedNodes,
        lockedBodyStyleAtExpectedNodes,
        visibleLockedFrames: lockedFrameImages.length,
        expectedLockedFrames: expectedLocked.length,
        visibleLockedNextFrames: lockedNextFrameImages.length,
        expectedLockedNextFrames: expectedLockedNext.length,
        visibleLockedFarFrames: lockedFarFrameImages.length,
        expectedLockedFarFrames: expectedLockedFar.length,
        lockedFramesAtExpectedNodes,
        lockedFrameStyleAtExpectedNodes,
        visibleLockedBadges: lockedImages.length,
        expectedLockedBadges: expectedLocked.length,
        lockedAtExpectedNodes,
        lockedStyleAtExpectedNodes,
        visibleSealedBodies: sealedBodyImages.length,
        expectedSealedBodies: expectedSealed.length,
        sealedBodiesAtExpectedNodes,
        sealedBodyStyleAtExpectedNodes,
        visibleSealedFrames: sealedFrameImages.length,
        expectedSealedFrames: expectedSealed.length,
        sealedFramesAtExpectedNodes,
        sealedFrameStyleAtExpectedNodes,
        visibleSealedBadges: sealedImages.length,
        expectedSealedBadges: expectedSealed.length,
        sealedAtExpectedNodes,
        sealedStyleAtExpectedNodes,
        visibleDormantBodies: dormantBodyImages.length,
        expectedDormantBodies: expectedDormant.length,
        visibleDormantBaseBodies: dormantBaseBodyImages.length,
        expectedDormantBaseBodies: expectedDormantBase.length,
        visibleDormantMidBodies: dormantMidBodyImages.length,
        expectedDormantMidBodies: expectedDormantMid.length,
        dormantBodiesAtExpectedNodes,
        dormantBodyStyleAtExpectedNodes,
        visibleDormantFrames: dormantFrameImages.length,
        expectedDormantFrames: expectedDormant.length,
        visibleDormantBaseFrames: dormantBaseFrameImages.length,
        expectedDormantBaseFrames: expectedDormantBase.length,
        visibleDormantMidFrames: dormantMidFrameImages.length,
        expectedDormantMidFrames: expectedDormantMid.length,
        dormantFramesAtExpectedNodes,
        dormantFrameStyleAtExpectedNodes,
        visibleCurrentMarkerImages: markerImages.length,
        markerAtCurrentStage: Boolean(markerAtCurrentStage),
        visibleCurrentHaloImages: haloImages.length,
        haloAtCurrentStage: Boolean(haloAtCurrentStage),
        visibleCurrentBodyImages: currentBodyImages.length,
        visibleCurrentBaseBodyImages: currentBaseBodyImages.length,
        expectedCurrentBaseBodyImages: expectedLateCurrent ? 0 : 1,
        visibleCurrentLateBodyImages: currentLateBodyImages.length,
        expectedCurrentLateBodyImages: expectedLateCurrent ? 1 : 0,
        bodyAtCurrentStage: Boolean(bodyAtCurrentStage),
        visibleCurrentFrameImages: frameImages.length,
        visibleCurrentBaseFrameImages: currentBaseFrameImages.length,
        expectedCurrentBaseFrameImages: expectedLateCurrent ? 0 : 1,
        visibleCurrentLateFrameImages: currentLateFrameImages.length,
        expectedCurrentLateFrameImages: expectedLateCurrent ? 1 : 0,
        frameAtCurrentStage: Boolean(frameAtCurrentStage),
        visibleCurrentStatusImages: statusImages.length,
        statusAtCurrentStage: Boolean(statusAtCurrentStage),
        currentHasNoCompletedBadge,
        currentHasNoCompletedBody,
        currentHasNoCompletedFrame,
        currentHasNoLockedBadge,
        currentHasNoLockedBody,
        currentHasNoLockedFrame,
        currentHasNoSealedBody,
        currentHasNoSealedFrame,
        currentHasNoDormantBody,
        currentHasNoDormantFrame
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
