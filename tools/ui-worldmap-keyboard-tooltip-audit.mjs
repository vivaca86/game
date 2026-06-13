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

const auditCases = [
  {
    key: "lower-left",
    seed: { completedCount: 1, currentStageIndex: 1 },
    keyPress: "ArrowLeft",
    targetIndex: 0
  },
  {
    key: "late-right",
    seed: { completedCount: 8, currentStageIndex: 8 },
    keyPress: "ArrowRight",
    targetIndex: 7
  },
  {
    key: "boss-up",
    seed: { completedCount: 14, currentStageIndex: 12 },
    keyPress: "ArrowUp",
    targetIndex: 13
  }
];

const viewports = [
  { key: "desktop-1920", suffix: "1920", width: 1920, height: 1080, minWidth: 260, minHeight: 60, maxWidthRatio: 0.42, maxHeightRatio: 0.34, allowLetterbox: false },
  { key: "desktop-1280", suffix: "desktop-1280", width: 1280, height: 720, minWidth: 240, minHeight: 58, maxWidthRatio: 0.48, maxHeightRatio: 0.34, allowLetterbox: false },
  { key: "mobile-390x844", suffix: "mobile-390x844", width: 390, height: 844, minWidth: 210, minHeight: 48, maxWidthRatio: 0.82, maxHeightRatio: 0.5, allowLetterbox: true }
];

await mkdir("tmp/ui-quality/worldmap-keyboard-tooltips", { recursive: true });

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

    for (const auditCase of auditCases) {
      const seeded = await seedWorldMapState(page, baseUrl, auditCase);
      const initial = await readWorldMapKeyboardTooltipAudit(page, auditCase);
      if (initial.tooltip.visible) {
        throw new Error(`${auditCase.key}/${viewport.key}: tooltip visible before keyboard selection`);
      }

      await page.keyboard.press(auditCase.keyPress);
      await page.waitForFunction((expectedStageId) => {
        const game = window.__paperGame;
        const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
          ?? game?.scene?.getScene?.("WorldMapScene");
        const context = scene?.registry?.get?.("bootContext");
        return context?.run?.stageId === expectedStageId;
      }, seeded.targetStageId, { timeout: 10000 });
      await page.waitForSelector("#game-readability-tooltip[data-visible='true']", { timeout: 5000 });

      const audit = await readWorldMapKeyboardTooltipAudit(page, auditCase);
      assertWorldMapKeyboardTooltip(`${auditCase.key}/${viewport.key}`, audit, auditCase, viewport, seeded);

      const screenshot = path.join("tmp", "ui-quality", "worldmap-keyboard-tooltips", `${auditCase.key}-keyboard-tooltip-v1-${viewport.suffix}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({
        label: auditCase.key,
        viewport: viewport.key,
        currentStageId: audit.currentStageId,
        title: audit.tooltip.title,
        size: `${Math.round(audit.tooltip.width)}x${Math.round(audit.tooltip.height)}`,
        currentMarkerImages: audit.visibleCurrentMarkerImages,
        currentHaloImages: audit.currentHaloImages,
        currentBody: audit.visibleCurrentLateBodyImages === 1 ? "late" : "base",
        currentFrame: audit.visibleCurrentLateFrameImages === 1 ? "late" : "base",
        currentStatusImages: audit.visibleCurrentStatusImages,
        routeBaseThreads: audit.visibleRouteBaseThreads,
        routeCurrentThreads: audit.visibleRouteCurrentThreads,
        routeBaseBeads: audit.visibleRouteBaseBeads,
        routeCurrentBeads: audit.visibleRouteCurrentBeads,
        lockedRouteThreads: audit.visibleRouteLockedThreads,
        lockedRouteBeads: audit.visibleRouteLockedBeads,
        screenshot: path.resolve(screenshot)
      });

      await page.mouse.move(4, 4);
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
  throw new Error("No free WorldMap keyboard tooltip audit port found");
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

async function seedWorldMapState(page, baseUrl, auditCase) {
  await page.goto(new URL("/?data=release&entry=world_map&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, "WorldMapScene");
  const seeded = await page.evaluate(({ completedCount, currentStageIndex, targetIndex }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScene?.("WorldMapScene");
    const context = scene?.registry?.get?.("bootContext");
    if (!context?.save?.currentRun) {
      return { ok: false, reason: "missing boot context or current run" };
    }
    const completedStageIds = context.dataBundle.stages.slice(0, completedCount).map((stage) => stage.id);
    const currentStageId = context.dataBundle.stages[currentStageIndex]?.id;
    const targetStageId = context.dataBundle.stages[targetIndex]?.id;
    if (completedStageIds.length !== completedCount || !currentStageId || !targetStageId) {
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
      log: [...new Set([...(context.save.currentRun.log ?? []), "audit:worldmap_keyboard_tooltip"])]
    };
    localStorage.setItem("paper_theater_card_crawler_save_v1", JSON.stringify(context.save));
    return { ok: true, completedStageIds, currentStageId, targetStageId };
  }, { ...auditCase.seed, targetIndex: auditCase.targetIndex });
  if (!seeded.ok) {
    throw new Error(`WorldMap keyboard tooltip seed failed: ${JSON.stringify(seeded)}`);
  }

  await page.goto(new URL("/?data=release&entry=world_map", baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, "WorldMapScene");
  await hideDebugOverlay(page);
  return seeded;
}

async function waitForScene(page, sceneName) {
  await page.waitForSelector("canvas", { timeout: 20000 });
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneName, { timeout: 20000 });
}

async function hideDebugOverlay(page) {
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });
}

async function readWorldMapKeyboardTooltipAudit(page, auditCase) {
  return page.evaluate(({ auditCase, stageNodes }) => {
    const root = document.getElementById("game-readability-tooltip");
    const canvas = document.querySelector("#game-root canvas");
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
      ?? game?.scene?.getScene?.("WorldMapScene");
    const context = scene?.registry?.get?.("bootContext");
    const stages = context?.dataBundle?.stages ?? [];
    const currentStageId = context?.run?.stageId;
    const currentIndex = stages.findIndex((stage) => stage.id === currentStageId);
    const currentNode = stageNodes[currentIndex];
    const targetStage = stages[auditCase.targetIndex];
    const visible = (scene?.children?.list ?? []).filter((child) => child?.visible !== false && child.alpha !== 0);
    const imageByKey = (key) => visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === key
      && Number(child.alpha ?? 1) > 0.05
    ));
    const markerImages = imageByKey("ui_current_stage_marker_concept");
    const currentBaseBodyImages = imageByKey("ui_current_stage_body_wash_concept");
    const currentLateBodyImages = imageByKey("ui_current_stage_late_body_wash_concept");
    const currentBodyImages = [...currentBaseBodyImages, ...currentLateBodyImages];
    const currentBaseFrameImages = imageByKey("ui_current_stage_frame_concept");
    const currentLateFrameImages = imageByKey("ui_current_stage_late_frame_concept");
    const currentFrameImages = [...currentBaseFrameImages, ...currentLateFrameImages];
    const currentHaloImages = imageByKey("ui_current_stage_halo_concept");
    const statusImages = imageByKey("ui_current_stage_status_badge_concept");
    const completedImages = [
      ...imageByKey("ui_completed_stage_badge_concept"),
      ...imageByKey("ui_completed_stage_late_badge_concept")
    ];
    const completedBodyImages = [
      ...imageByKey("ui_completed_stage_body_wash_concept"),
      ...imageByKey("ui_completed_stage_late_body_wash_concept")
    ];
    const completedFrameImages = [
      ...imageByKey("ui_completed_stage_frame_concept"),
      ...imageByKey("ui_completed_stage_late_frame_concept")
    ];
    const lockedBadgeImages = imageByKey("ui_locked_stage_badge_concept");
    const lockedBodyImages = [
      ...imageByKey("ui_locked_stage_body_wash_concept"),
      ...imageByKey("ui_locked_stage_far_body_wash_concept"),
      ...imageByKey("ui_locked_stage_boss_body_wash_concept")
    ];
    const lockedFrameImages = [
      ...imageByKey("ui_locked_stage_frame_concept"),
      ...imageByKey("ui_locked_stage_far_frame_concept"),
      ...imageByKey("ui_locked_stage_boss_frame_concept")
    ];
    const sealedBadgeImages = imageByKey("ui_sealed_stage_badge_concept");
    const sealedBodyImages = [
      ...imageByKey("ui_sealed_stage_body_wash_concept"),
      ...imageByKey("ui_sealed_stage_mid_body_wash_concept")
    ];
    const sealedFrameImages = [
      ...imageByKey("ui_sealed_stage_frame_concept"),
      ...imageByKey("ui_sealed_stage_mid_frame_concept")
    ];
    const dormantBodyImages = [
      ...imageByKey("ui_dormant_stage_body_wash_concept"),
      ...imageByKey("ui_dormant_stage_mid_body_wash_concept")
    ];
    const dormantFrameImages = [
      ...imageByKey("ui_dormant_stage_frame_concept"),
      ...imageByKey("ui_dormant_stage_mid_frame_concept")
    ];
    const routeBaseThreadImages = imageByKey("ui_world_map_route_progress_thread_concept");
    const routeCurrentThreadImages = imageByKey("ui_world_map_route_progress_current_thread_concept");
    const routeLockedThreadImages = imageByKey("ui_world_map_route_locked_thread_concept");
    const routeBaseBeadImages = imageByKey("ui_world_map_route_progress_bead_concept");
    const routeCurrentBeadImages = imageByKey("ui_world_map_route_progress_current_bead_concept");
    const routeLockedBeadImages = imageByKey("ui_world_map_route_locked_bead_concept");
    const routeHoverImages = imageByKey("ui_hover_route_node_concept");
    const visibleTextCount = visible.filter((child) => (
      child?.type === "Text"
      && String(child.text ?? "").trim().length > 0
    )).length;
    const underlayIndex = (scene?.children?.list ?? []).findIndex((child) => (
      child?.type === "Image"
      && child.texture?.key === "world_map_raster_underlay_concept"
      && child.visible !== false
      && child.alpha !== 0
    ));
    const underlayDepth = scene?.children?.list?.[underlayIndex]?.depth ?? 0;
    const visibleRectsAboveUnderlay = visible
      .filter((child) => child?.type === "Rectangle")
      .filter((child) => child.depth > underlayDepth || (scene?.children?.list ?? []).indexOf(child) > underlayIndex)
      .filter((child) => {
        const fillAlpha = Number(child?.fillAlpha ?? child?.alpha ?? 1);
        const strokeAlpha = Number(child?.strokeAlpha ?? child?.lineAlpha ?? 0);
        const strokeWidth = Number(child?.lineWidth ?? child?.strokeWidth ?? 0);
        return (child?.isFilled && fillAlpha > 0.02) || (child?.isStroked && strokeWidth > 0 && strokeAlpha > 0.02);
      }).length;
    const expectedLateCurrent = currentIndex > 4;
    const expectedBodyImages = expectedLateCurrent ? currentLateBodyImages : currentBaseBodyImages;
    const expectedFrameImages = expectedLateCurrent ? currentLateFrameImages : currentBaseFrameImages;
    const markerAtCurrentStage = markerImages.length === 1
      && currentNode
      && Math.abs(markerImages[0].x - (currentNode.x + 4)) <= 1
      && Math.abs(markerImages[0].y - (currentNode.y - Math.max(88, currentNode.height * 0.62))) <= 1
      && Math.abs(markerImages[0].displayWidth - 76) <= 1
      && Math.abs(markerImages[0].displayHeight - 86) <= 1
      && Number(markerImages[0].alpha ?? 1) >= 0.96;
    const haloAtCurrentStage = currentHaloImages.length === 1
      && currentNode
      && Math.abs(currentHaloImages[0].x - (currentNode.x + 2)) <= 1
      && Math.abs(currentHaloImages[0].y - (currentNode.y + 4)) <= 1
      && Math.abs(currentHaloImages[0].displayWidth - currentNode.width * 1.78) <= 1
      && Math.abs(currentHaloImages[0].displayHeight - currentNode.height * 1.9) <= 1
      && Number(currentHaloImages[0].alpha ?? 1) >= 0.72;
    const bodyAtCurrentStage = currentBodyImages.length === 1
      && expectedBodyImages.length === 1
      && (expectedLateCurrent ? currentBaseBodyImages.length === 0 : currentLateBodyImages.length === 0)
      && currentNode
      && Math.abs(expectedBodyImages[0].x - (currentNode.x + currentNode.width * 0.02)) <= 1
      && Math.abs(expectedBodyImages[0].y - (currentNode.y + currentNode.height * 0.04)) <= 1
      && Math.abs(expectedBodyImages[0].displayWidth - currentNode.width * 1.12) <= 1
      && Math.abs(expectedBodyImages[0].displayHeight - currentNode.height * 1.16) <= 1
      && Number(expectedBodyImages[0].alpha ?? 1) >= 0.64;
    const frameAtCurrentStage = currentFrameImages.length === 1
      && expectedFrameImages.length === 1
      && (expectedLateCurrent ? currentBaseFrameImages.length === 0 : currentLateFrameImages.length === 0)
      && currentNode
      && Math.abs(expectedFrameImages[0].x - (currentNode.x + currentNode.width * 0.02)) <= 1
      && Math.abs(expectedFrameImages[0].y - (currentNode.y + currentNode.height * 0.01)) <= 1
      && Math.abs(expectedFrameImages[0].displayWidth - currentNode.width * 1.34) <= 1
      && Math.abs(expectedFrameImages[0].displayHeight - currentNode.height * 1.38) <= 1
      && Number(expectedFrameImages[0].alpha ?? 1) >= 0.88;
    const statusAtCurrentStage = statusImages.length === 1
      && currentNode
      && Math.abs(statusImages[0].x - (currentNode.x + currentNode.width * 0.1)) <= 1
      && Math.abs(statusImages[0].y - (currentNode.y + currentNode.height * 0.36)) <= 1
      && Math.abs(statusImages[0].displayWidth - 72) <= 1
      && Math.abs(statusImages[0].displayHeight - 72) <= 1
      && Number(statusImages[0].alpha ?? 1) >= 0.96;
    const notNearCurrentNode = (image, scale) => !currentNode || (
      Math.abs(image.x - currentNode.x) >= currentNode.width * scale
      || Math.abs(image.y - currentNode.y) >= currentNode.height * scale
    );
    const currentHasNoCompletedBadge = completedImages.every((image) => notNearCurrentNode(image, 0.6));
    const currentHasNoCompletedBody = completedBodyImages.every((image) => notNearCurrentNode(image, 0.72));
    const currentHasNoCompletedFrame = completedFrameImages.every((image) => notNearCurrentNode(image, 0.72));
    const currentHasNoLockedBadge = [...lockedBadgeImages, ...sealedBadgeImages].every((image) => notNearCurrentNode(image, 0.6));
    const currentHasNoLockedBody = lockedBodyImages.every((image) => notNearCurrentNode(image, 0.72));
    const currentHasNoLockedFrame = lockedFrameImages.every((image) => notNearCurrentNode(image, 0.72));
    const currentHasNoSealedBody = sealedBodyImages.every((image) => notNearCurrentNode(image, 0.72));
    const currentHasNoSealedFrame = sealedFrameImages.every((image) => notNearCurrentNode(image, 0.72));
    const currentHasNoDormantBody = dormantBodyImages.every((image) => notNearCurrentNode(image, 0.72));
    const currentHasNoDormantFrame = dormantFrameImages.every((image) => notNearCurrentNode(image, 0.72));
    const log = context?.run?.log ?? [];

    return {
      activeScene: game?.scene?.getScenes?.(true)?.[0]?.scene?.key ?? "none",
      currentStageId,
      currentIndex,
      targetStageId: targetStage?.id,
      targetStageName: targetStage?.displayNameKo,
      expectedLateCurrent,
      underlayVisible: underlayIndex >= 0,
      visibleCurrentMarkerImages: markerImages.length,
      markerAtCurrentStage: Boolean(markerAtCurrentStage),
      currentHaloImages: currentHaloImages.length,
      currentHaloAtCurrentStage: Boolean(haloAtCurrentStage),
      visibleCurrentBodyImages: currentBodyImages.length,
      visibleCurrentBaseBodyImages: currentBaseBodyImages.length,
      visibleCurrentLateBodyImages: currentLateBodyImages.length,
      bodyAtCurrentStage: Boolean(bodyAtCurrentStage),
      visibleCurrentFrameImages: currentFrameImages.length,
      visibleCurrentBaseFrameImages: currentBaseFrameImages.length,
      visibleCurrentLateFrameImages: currentLateFrameImages.length,
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
      currentHasNoDormantFrame,
      visibleRouteBaseThreads: routeBaseThreadImages.length,
      visibleRouteCurrentThreads: routeCurrentThreadImages.length,
      visibleRouteLockedThreads: routeLockedThreadImages.length,
      visibleRouteBaseBeads: routeBaseBeadImages.length,
      visibleRouteCurrentBeads: routeCurrentBeadImages.length,
      visibleRouteLockedBeads: routeLockedBeadImages.length,
      visibleRouteHoverImages: routeHoverImages.length,
      visibleTextCount,
      visibleRectsAboveUnderlay,
      hasStageSelectLog: log.includes(`flow:stage_select:${targetStage?.id}`),
      tooltip: readTooltip(root, canvas)
    };

    function readTooltip(tooltipRoot, canvasNode) {
      if (!tooltipRoot || !canvasNode) {
        return {
          ok: false,
          reason: "missing tooltip or canvas",
          visible: false,
          title: "",
          body: ""
        };
      }
      const rootBox = tooltipRoot.getBoundingClientRect();
      const canvasBox = canvasNode.getBoundingClientRect();
      const style = window.getComputedStyle(tooltipRoot);
      const title = tooltipRoot.querySelector("strong")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
      const body = tooltipRoot.querySelector("span")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
      return {
        ok: true,
        role: tooltipRoot.getAttribute("role"),
        live: tooltipRoot.getAttribute("aria-live"),
        visible: tooltipRoot.dataset.visible === "true",
        scene: tooltipRoot.dataset.scene,
        tone: tooltipRoot.dataset.tone,
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
        canvasRole: canvasNode.getAttribute("role") ?? "",
        canvasLabelLength: canvasNode.getAttribute("aria-label")?.length ?? 0
      };
    }
  }, { auditCase, stageNodes });
}

function assertWorldMapKeyboardTooltip(label, audit, auditCase, viewport, seeded) {
  const tooltip = audit.tooltip;
  if (audit.activeScene !== "WorldMapScene") throw new Error(`${label}: expected WorldMapScene, got ${audit.activeScene}`);
  if (!audit.underlayVisible) throw new Error(`${label}: missing world map raster underlay`);
  if (audit.currentStageId !== seeded.targetStageId) {
    throw new Error(`${label}: expected current stage ${seeded.targetStageId}, got ${audit.currentStageId}`);
  }
  if (audit.targetStageId !== seeded.targetStageId) {
    throw new Error(`${label}: expected target stage ${seeded.targetStageId}, got ${audit.targetStageId}`);
  }
  if (audit.currentIndex !== auditCase.targetIndex) {
    throw new Error(`${label}: expected current index ${auditCase.targetIndex}, got ${audit.currentIndex}`);
  }
  if (!audit.markerAtCurrentStage || audit.visibleCurrentMarkerImages !== 1) {
    throw new Error(`${label}: current marker is not anchored to selected stage ${JSON.stringify({
      visibleCurrentMarkerImages: audit.visibleCurrentMarkerImages,
      markerAtCurrentStage: audit.markerAtCurrentStage
    })}`);
  }
  if (audit.currentHaloImages !== 1 || !audit.currentHaloAtCurrentStage) {
    throw new Error(`${label}: expected exactly one current halo at selected node, got ${JSON.stringify({
      currentHaloImages: audit.currentHaloImages,
      currentHaloAtCurrentStage: audit.currentHaloAtCurrentStage
    })}`);
  }
  if (!audit.bodyAtCurrentStage || audit.visibleCurrentBodyImages !== 1) {
    throw new Error(`${label}: current body is not anchored to selected stage ${JSON.stringify({
      visibleCurrentBodyImages: audit.visibleCurrentBodyImages,
      visibleCurrentBaseBodyImages: audit.visibleCurrentBaseBodyImages,
      visibleCurrentLateBodyImages: audit.visibleCurrentLateBodyImages,
      bodyAtCurrentStage: audit.bodyAtCurrentStage
    })}`);
  }
  if (!audit.frameAtCurrentStage || audit.visibleCurrentFrameImages !== 1) {
    throw new Error(`${label}: current frame is not anchored to selected stage ${JSON.stringify({
      visibleCurrentFrameImages: audit.visibleCurrentFrameImages,
      visibleCurrentBaseFrameImages: audit.visibleCurrentBaseFrameImages,
      visibleCurrentLateFrameImages: audit.visibleCurrentLateFrameImages,
      frameAtCurrentStage: audit.frameAtCurrentStage
    })}`);
  }
  if (!audit.statusAtCurrentStage || audit.visibleCurrentStatusImages !== 1) {
    throw new Error(`${label}: current status badge is not anchored to selected stage ${JSON.stringify({
      visibleCurrentStatusImages: audit.visibleCurrentStatusImages,
      statusAtCurrentStage: audit.statusAtCurrentStage
    })}`);
  }
  if (audit.visibleCurrentBaseBodyImages !== (audit.expectedLateCurrent ? 0 : 1)) {
    throw new Error(`${label}: wrong base current body count ${audit.visibleCurrentBaseBodyImages}`);
  }
  if (audit.visibleCurrentLateBodyImages !== (audit.expectedLateCurrent ? 1 : 0)) {
    throw new Error(`${label}: wrong late current body count ${audit.visibleCurrentLateBodyImages}`);
  }
  if (audit.visibleCurrentBaseFrameImages !== (audit.expectedLateCurrent ? 0 : 1)) {
    throw new Error(`${label}: wrong base current frame count ${audit.visibleCurrentBaseFrameImages}`);
  }
  if (audit.visibleCurrentLateFrameImages !== (audit.expectedLateCurrent ? 1 : 0)) {
    throw new Error(`${label}: wrong late current frame count ${audit.visibleCurrentLateFrameImages}`);
  }
  if (!audit.currentHasNoCompletedBadge
    || !audit.currentHasNoCompletedBody
    || !audit.currentHasNoCompletedFrame
    || !audit.currentHasNoLockedBadge
    || !audit.currentHasNoLockedBody
    || !audit.currentHasNoLockedFrame
    || !audit.currentHasNoSealedBody
    || !audit.currentHasNoSealedFrame
    || !audit.currentHasNoDormantBody
    || !audit.currentHasNoDormantFrame) {
    throw new Error(`${label}: selected stage has conflicting state overlays ${JSON.stringify({
      currentHasNoCompletedBadge: audit.currentHasNoCompletedBadge,
      currentHasNoCompletedBody: audit.currentHasNoCompletedBody,
      currentHasNoCompletedFrame: audit.currentHasNoCompletedFrame,
      currentHasNoLockedBadge: audit.currentHasNoLockedBadge,
      currentHasNoLockedBody: audit.currentHasNoLockedBody,
      currentHasNoLockedFrame: audit.currentHasNoLockedFrame,
      currentHasNoSealedBody: audit.currentHasNoSealedBody,
      currentHasNoSealedFrame: audit.currentHasNoSealedFrame,
      currentHasNoDormantBody: audit.currentHasNoDormantBody,
      currentHasNoDormantFrame: audit.currentHasNoDormantFrame
    })}`);
  }
  const suppressedRouteFields = [
    ["route base threads", audit.visibleRouteBaseThreads],
    ["route current threads", audit.visibleRouteCurrentThreads],
    ["locked route threads", audit.visibleRouteLockedThreads],
    ["route base beads", audit.visibleRouteBaseBeads],
    ["route current beads", audit.visibleRouteCurrentBeads],
    ["locked route beads", audit.visibleRouteLockedBeads],
    ["old route hover images", audit.visibleRouteHoverImages]
  ];
  for (const [name, count] of suppressedRouteFields) {
    if (count !== 0) throw new Error(`${label}: expected keyboard-selected ${name} to be suppressed, got ${count}`);
  }
  if (audit.visibleTextCount !== 0 || audit.visibleRectsAboveUnderlay !== 0) {
    throw new Error(`${label}: unexpected Phaser text/vector leak ${JSON.stringify({
      visibleTextCount: audit.visibleTextCount,
      visibleRectsAboveUnderlay: audit.visibleRectsAboveUnderlay
    })}`);
  }
  if (!audit.hasStageSelectLog) throw new Error(`${label}: missing flow:stage_select log for ${seeded.targetStageId}`);
  if (!tooltip.ok) throw new Error(`${label}: ${tooltip.reason ?? "tooltip audit failed"}`);
  if (tooltip.role !== "tooltip") throw new Error(`${label}: expected role=tooltip, got ${tooltip.role}`);
  if (tooltip.live !== "polite") throw new Error(`${label}: expected aria-live=polite, got ${tooltip.live}`);
  if (!tooltip.visible) throw new Error(`${label}: tooltip is not visible`);
  if (tooltip.scene !== "WorldMapScene") throw new Error(`${label}: expected WorldMapScene tooltip, got ${tooltip.scene}`);
  if (tooltip.tone !== "choice") throw new Error(`${label}: expected choice tone, got ${tooltip.tone}`);
  if (audit.targetStageName && !tooltip.title.includes(audit.targetStageName)) {
    throw new Error(`${label}: tooltip title does not include stage name ${audit.targetStageName}: ${tooltip.title}`);
  }
  if (tooltip.body.length < 12) throw new Error(`${label}: body too short (${tooltip.body.length})`);
  if (tooltip.width < viewport.minWidth || tooltip.height < viewport.minHeight) {
    throw new Error(`${label}: tooltip too small ${tooltip.width}x${tooltip.height}`);
  }
  if (tooltip.widthRatio > viewport.maxWidthRatio || tooltip.heightRatio > viewport.maxHeightRatio) {
    throw new Error(`${label}: tooltip too large ${tooltip.widthRatio.toFixed(2)}x${tooltip.heightRatio.toFixed(2)}`);
  }
  if (!tooltip.inViewport) throw new Error(`${label}: tooltip outside viewport`);
  if (viewport.allowLetterbox ? tooltip.overlapsCanvas : !tooltip.inCanvas) {
    throw new Error(`${label}: unsafe tooltip placement ${JSON.stringify({
      inCanvas: tooltip.inCanvas,
      overlapsCanvas: tooltip.overlapsCanvas,
      viewport: viewport.key
    })}`);
  }
  if (tooltip.pointerEvents !== "none") throw new Error(`${label}: expected pointer-events none, got ${tooltip.pointerEvents}`);
  if (tooltip.zIndex < 8) throw new Error(`${label}: z-index too low ${tooltip.zIndex}`);
  if (tooltip.canvasRole !== "img") throw new Error(`${label}: expected canvas role img, got ${tooltip.canvasRole}`);
  if (tooltip.canvasLabelLength < 20) throw new Error(`${label}: canvas aria-label too short (${tooltip.canvasLabelLength})`);
}
