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
    key: "lower-open",
    seed: { completedCount: 2, currentStageIndex: 1 },
    targetIndex: 0
  },
  {
    key: "mid-open",
    seed: { completedCount: 9, currentStageIndex: 8 },
    targetIndex: 7
  },
  {
    key: "boss-open",
    seed: { completedCount: 14, currentStageIndex: 12 },
    targetIndex: 13
  }
];

const viewports = [
  { key: "desktop-1920", suffix: "1920", width: 1920, height: 1080 },
  { key: "desktop-1280", suffix: "desktop-1280", width: 1280, height: 720 },
  { key: "mobile-390x844", suffix: "mobile-390x844", width: 390, height: 844 },
  { key: "mobile-landscape-844x390", suffix: "mobile-landscape-844x390", width: 844, height: 390 }
];

await mkdir("tmp/ui-quality/worldmap-open-node-selection", { recursive: true });

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
      const targetNode = stageNodes[auditCase.targetIndex];
      if (!targetNode) throw new Error(`${auditCase.key}: missing target node`);

      const canvas = page.locator("canvas");
      const box = await canvas.boundingBox();
      if (!box) throw new Error(`${auditCase.key}/${viewport.key}: missing canvas`);
      const targetX = box.x + (targetNode.x / 1920) * box.width;
      const targetY = box.y + (targetNode.y / 1080) * box.height;

      await page.mouse.click(targetX, targetY);
      await page.waitForFunction((expectedStageId) => {
        const game = window.__paperGame;
        const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
          ?? game?.scene?.getScene?.("WorldMapScene");
        const context = scene?.registry?.get?.("bootContext");
        return context?.run?.stageId === expectedStageId;
      }, seeded.targetStageId, { timeout: 10000 });
      await page.mouse.move(4, 4);
      await page.waitForTimeout(140);

      const selectionAudit = await readWorldMapOpenNodeSelectionAudit(page, auditCase);
      assertWorldMapOpenNodeSelection(`${auditCase.key}/${viewport.key}`, selectionAudit, seeded, auditCase);

      const screenshot = path.join("tmp", "ui-quality", "worldmap-open-node-selection", `${auditCase.key}-open-node-selection-v1-${viewport.suffix}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });

      results.push({
        label: auditCase.key,
        viewport: viewport.key,
        stageId: selectionAudit.currentStageId,
        targetIndex: auditCase.targetIndex,
        lateCurrent: selectionAudit.expectedLateCurrent,
        currentBody: selectionAudit.visibleCurrentLateBodyImages === 1 ? "late" : "base",
        routeBaseThreads: `${selectionAudit.visibleRouteBaseThreads}/${selectionAudit.expectedRouteBaseThreads}`,
        routeCurrentThreads: `${selectionAudit.visibleRouteCurrentThreads}/${selectionAudit.expectedRouteCurrentThreads}`,
        routeBaseBeads: `${selectionAudit.visibleRouteBaseBeads}/${selectionAudit.expectedRouteBaseBeads}`,
        routeCurrentBeads: `${selectionAudit.visibleRouteCurrentBeads}/${selectionAudit.expectedRouteCurrentBeads}`,
        lockedRouteThreads: `${selectionAudit.visibleRouteLockedThreads}/${selectionAudit.expectedRouteLockedThreads}`,
        lockedRouteBeads: `${selectionAudit.visibleRouteLockedBeads}/${selectionAudit.expectedRouteLockedBeads}`,
        screenshot: path.resolve(screenshot)
      });
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
  for (const port of [4265, 4266, 4267, 4268, 4269]) {
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
  throw new Error("No free WorldMap open-node selection audit port found");
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
      log: [...new Set([...(context.save.currentRun.log ?? []), "audit:worldmap_open_node_selection"])]
    };
    localStorage.setItem("paper_theater_card_crawler_save_v1", JSON.stringify(context.save));
    return { ok: true, completedStageIds, currentStageId, targetStageId };
  }, { ...auditCase.seed, targetIndex: auditCase.targetIndex });
  if (!seeded.ok) {
    throw new Error(`WorldMap open-node selection seed failed: ${JSON.stringify(seeded)}`);
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

async function readWorldMapOpenNodeSelectionAudit(page, auditCase) {
  return page.evaluate(({ auditCase, stageNodes }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
      ?? game?.scene?.getScene?.("WorldMapScene");
    const context = scene?.registry?.get?.("bootContext");
    const children = scene?.children?.list ?? [];
    const visible = children.filter((child) => child?.visible !== false && child.alpha !== 0);
    const stages = context?.dataBundle?.stages ?? [];
    const currentStageId = context?.run?.stageId;
    const currentIndex = stages.findIndex((stage) => stage.id === currentStageId);
    const currentNode = stageNodes[currentIndex];
    const targetStage = stages[auditCase.targetIndex];
    const underlayIndex = children.findIndex((child) => (
      child?.type === "Image"
      && child.texture?.key === "world_map_raster_underlay_concept"
      && child.visible !== false
      && child.alpha !== 0
    ));
    const underlayDepth = children[underlayIndex]?.depth ?? 0;
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
    const haloImages = imageByKey("ui_current_stage_halo_concept");
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
    const visibleRectsAboveUnderlay = visible
      .filter((child) => child?.type === "Rectangle")
      .filter((child) => child.depth > underlayDepth || children.indexOf(child) > underlayIndex)
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
    const haloAtCurrentStage = haloImages.length === 1
      && currentNode
      && Math.abs(haloImages[0].x - (currentNode.x + 2)) <= 1
      && Math.abs(haloImages[0].y - (currentNode.y + 4)) <= 1
      && Math.abs(haloImages[0].displayWidth - currentNode.width * 1.78) <= 1
      && Math.abs(haloImages[0].displayHeight - currentNode.height * 1.9) <= 1
      && Number(haloImages[0].alpha ?? 1) >= 0.72;
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
    const completedStageIds = new Set(context?.save?.profile?.completedStages ?? []);
    const unlockedStageIds = new Set([...(context?.save?.profile?.unlockedStages ?? []), currentStageId]);
    const imageAt = (images, x, y) => images.find((image) => Math.abs(image.x - x) <= 1 && Math.abs(image.y - y) <= 1);
    const hasImageAt = (images, x, y) => Boolean(imageAt(images, x, y));
    const rotationOk = (image, rotation) => Math.abs(Number(image?.rotation ?? 0) - rotation) <= 0.015;
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
      const rotation = Math.atan2(dy, dx);
      return Array.from({ length: count }, (_, beadIndex) => {
        const progress = (fromPad + usableLength * ((beadIndex + 1) / (count + 1))) / length;
        return {
          x: fromNode.x + dx * progress,
          y: fromNode.y + dy * progress,
          rotation,
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
        rotation: Math.atan2(dy, dx),
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
      const rotation = Math.atan2(dy, dx);
      return Array.from({ length: count }, (_, beadIndex) => {
        const progress = (fromPad + usableLength * ((beadIndex + 1) / (count + 1))) / length;
        return {
          x: fromNode.x + dx * progress,
          y: fromNode.y + dy * progress,
          rotation,
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
        rotation: Math.atan2(dy, dx),
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
    const routeThreadImagesForPlacement = (placement) => placement.finalLeg ? routeCurrentThreadImages : routeBaseThreadImages;
    const routeBeadImagesForPlacement = (placement) => placement.finalLeg ? routeCurrentBeadImages : routeBaseBeadImages;
    const routeThreadsAtExpectedSegments = expectedRouteThreads.every((placement) => (
      hasImageAt(routeThreadImagesForPlacement(placement), placement.x, placement.y)
    ));
    const routeThreadStyleAtExpectedSegments = expectedRouteThreads.every((placement) => {
      const image = imageAt(routeThreadImagesForPlacement(placement), placement.x, placement.y);
      return image
        && Math.abs(image.displayWidth - placement.width) <= 1
        && Math.abs(image.displayHeight - placement.height) <= 1
        && Number(image.alpha ?? 1) >= placement.minAlpha
        && rotationOk(image, placement.rotation);
    });
    const routeBeadsAtExpectedSegments = expectedRouteBeads.every((placement) => (
      hasImageAt(routeBeadImagesForPlacement(placement), placement.x, placement.y)
    ));
    const routeBeadStyleAtExpectedSegments = expectedRouteBeads.every((placement) => {
      const image = imageAt(routeBeadImagesForPlacement(placement), placement.x, placement.y);
      return image
        && Math.abs(image.displayWidth - placement.size) <= 1
        && Math.abs(image.displayHeight - placement.size) <= 1
        && Number(image.alpha ?? 1) >= placement.minAlpha
        && rotationOk(image, placement.rotation);
    });
    const lockedRouteThreadsAtExpectedSegments = expectedLockedRouteThreads.every((placement) => (
      hasImageAt(routeLockedThreadImages, placement.x, placement.y)
    ));
    const lockedRouteThreadStyleAtExpectedSegments = expectedLockedRouteThreads.every((placement) => {
      const image = imageAt(routeLockedThreadImages, placement.x, placement.y);
      return image
        && Math.abs(image.displayWidth - placement.width) <= 1
        && Math.abs(image.displayHeight - placement.height) <= 1
        && Number(image.alpha ?? 1) >= placement.minAlpha
        && rotationOk(image, placement.rotation);
    });
    const lockedRouteBeadsAtExpectedSegments = expectedLockedRouteBeads.every((placement) => (
      hasImageAt(routeLockedBeadImages, placement.x, placement.y)
    ));
    const lockedRouteBeadStyleAtExpectedSegments = expectedLockedRouteBeads.every((placement) => {
      const image = imageAt(routeLockedBeadImages, placement.x, placement.y);
      return image
        && Math.abs(image.displayWidth - placement.size) <= 1
        && Math.abs(image.displayHeight - placement.size) <= 1
        && Number(image.alpha ?? 1) >= placement.minAlpha
        && rotationOk(image, placement.rotation);
    });
    const tooltip = document.getElementById("game-readability-tooltip");
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
      visibleCurrentHaloImages: haloImages.length,
      haloAtCurrentStage: Boolean(haloAtCurrentStage),
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
      visibleRouteHoverImages: routeHoverImages.length,
      visibleRouteBaseThreads: routeBaseThreadImages.length,
      expectedRouteBaseThreads: expectedRouteBaseThreads.length,
      visibleRouteCurrentThreads: routeCurrentThreadImages.length,
      expectedRouteCurrentThreads: expectedRouteCurrentThreads.length,
      visibleRouteBaseBeads: routeBaseBeadImages.length,
      expectedRouteBaseBeads: expectedRouteBaseBeads.length,
      visibleRouteCurrentBeads: routeCurrentBeadImages.length,
      expectedRouteCurrentBeads: expectedRouteCurrentBeads.length,
      visibleRouteLockedThreads: routeLockedThreadImages.length,
      expectedRouteLockedThreads: expectedLockedRouteThreads.length,
      visibleRouteLockedBeads: routeLockedBeadImages.length,
      expectedRouteLockedBeads: expectedLockedRouteBeads.length,
      routeThreadsAtExpectedSegments,
      routeThreadStyleAtExpectedSegments,
      routeBeadsAtExpectedSegments,
      routeBeadStyleAtExpectedSegments,
      lockedRouteThreadsAtExpectedSegments,
      lockedRouteThreadStyleAtExpectedSegments,
      lockedRouteBeadsAtExpectedSegments,
      lockedRouteBeadStyleAtExpectedSegments,
      visibleTextCount,
      visibleRectsAboveUnderlay,
      tooltipVisible: tooltip?.dataset?.visible === "true",
      hasStageSelectLog: log.includes(`flow:stage_select:${targetStage?.id}`)
    };
  }, { auditCase, stageNodes });
}

function assertWorldMapOpenNodeSelection(label, audit, seeded, auditCase) {
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
  if (!audit.haloAtCurrentStage || audit.visibleCurrentHaloImages !== 1) {
    throw new Error(`${label}: current halo is not anchored to selected stage ${JSON.stringify({
      visibleCurrentHaloImages: audit.visibleCurrentHaloImages,
      haloAtCurrentStage: audit.haloAtCurrentStage
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
  if (audit.visibleRouteHoverImages !== 0) {
    throw new Error(`${label}: old route hover placeholder remains visible (${audit.visibleRouteHoverImages})`);
  }
  const routeCountFields = [
    ["route base threads", audit.visibleRouteBaseThreads, audit.expectedRouteBaseThreads],
    ["route current threads", audit.visibleRouteCurrentThreads, audit.expectedRouteCurrentThreads],
    ["route base beads", audit.visibleRouteBaseBeads, audit.expectedRouteBaseBeads],
    ["route current beads", audit.visibleRouteCurrentBeads, audit.expectedRouteCurrentBeads],
    ["locked route threads", audit.visibleRouteLockedThreads, audit.expectedRouteLockedThreads],
    ["locked route beads", audit.visibleRouteLockedBeads, audit.expectedRouteLockedBeads]
  ];
  for (const [name, actual, expected] of routeCountFields) {
    if (actual !== expected) throw new Error(`${label}: expected ${expected} ${name}, got ${actual}`);
  }
  const routePlacementFields = [
    ["routeThreadsAtExpectedSegments", audit.routeThreadsAtExpectedSegments],
    ["routeThreadStyleAtExpectedSegments", audit.routeThreadStyleAtExpectedSegments],
    ["routeBeadsAtExpectedSegments", audit.routeBeadsAtExpectedSegments],
    ["routeBeadStyleAtExpectedSegments", audit.routeBeadStyleAtExpectedSegments],
    ["lockedRouteThreadsAtExpectedSegments", audit.lockedRouteThreadsAtExpectedSegments],
    ["lockedRouteThreadStyleAtExpectedSegments", audit.lockedRouteThreadStyleAtExpectedSegments],
    ["lockedRouteBeadsAtExpectedSegments", audit.lockedRouteBeadsAtExpectedSegments],
    ["lockedRouteBeadStyleAtExpectedSegments", audit.lockedRouteBeadStyleAtExpectedSegments]
  ];
  for (const [name, ok] of routePlacementFields) {
    if (!ok) throw new Error(`${label}: route placement/style check failed: ${name}`);
  }
  if (audit.visibleTextCount !== 0 || audit.visibleRectsAboveUnderlay !== 0) {
    throw new Error(`${label}: unexpected Phaser text/vector leak ${JSON.stringify({
      visibleTextCount: audit.visibleTextCount,
      visibleRectsAboveUnderlay: audit.visibleRectsAboveUnderlay
    })}`);
  }
  if (audit.tooltipVisible) throw new Error(`${label}: stale readability tooltip remained visible after selection`);
  if (!audit.hasStageSelectLog) throw new Error(`${label}: missing flow:stage_select log for ${seeded.targetStageId}`);
}
