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

const viewports = [
  { key: "desktop-1920", suffix: "1920", width: 1920, height: 1080 },
  { key: "desktop-1280", suffix: "desktop-1280", width: 1280, height: 720 }
];

const screenshotStageIndexes = new Set([0, 4, 8, 13, 14]);
const screenshotDir = "tmp/ui-quality/pc-worldmap-release-state";

await mkdir(screenshotDir, { recursive: true });

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

    for (let currentStageIndex = 0; currentStageIndex < stageNodes.length; currentStageIndex += 1) {
      const seeded = await seedWorldMapState(page, baseUrl, currentStageIndex);
      const audit = await readWorldMapReleaseStateAudit(page, currentStageIndex);
      if (!audit.ok) {
        throw new Error(`${viewport.key}/stage-${currentStageIndex + 1}: WorldMap release-state audit failed ${JSON.stringify(audit, null, 2)}`);
      }

      let screenshot;
      if (screenshotStageIndexes.has(currentStageIndex)) {
        screenshot = path.join(screenshotDir, `stage-${currentStageIndex + 1}-state-v1-${viewport.suffix}.png`);
        await page.locator("canvas").screenshot({ path: screenshot });
      }

      results.push({
        viewport: viewport.key,
        stage: `${currentStageIndex + 1}/${stageNodes.length}`,
        stageId: seeded.currentStageId,
        completed: `${audit.visibleCompletedBadges}/${audit.expectedCompletedBadges}`,
        current: audit.currentMaterial,
        sealed: `${audit.visibleSealedBadges}/${audit.expectedSealedBadges}`,
        dormant: `${audit.visibleDormantBodies}/${audit.expectedDormantBodies}`,
        redLocked: `${audit.visibleLockedBadges}/${audit.expectedLockedBadges}`,
        route: `${audit.visibleRouteThreads}/${audit.expectedRouteThreads}`,
        lockedRoute: `${audit.visibleRouteLockedThreads}/${audit.expectedLockedRouteThreads}`,
        leak: `${audit.visibleTextCount} text, ${audit.visibleRectsAboveUnderlay} rects`,
        aria: audit.canvasAriaOk,
        screenshot: screenshot ? path.resolve(screenshot) : undefined
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
  for (const port of [4280, 4281, 4282, 4283, 4284]) {
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
  throw new Error("No free WorldMap release-state audit port found");
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

async function seedWorldMapState(page, baseUrl, currentStageIndex) {
  await page.goto(new URL("/?data=release&entry=world_map&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, "WorldMapScene");
  const seeded = await page.evaluate((index) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScene?.("WorldMapScene");
    const context = scene?.registry?.get?.("bootContext");
    if (!context?.save?.currentRun) {
      return { ok: false, reason: "missing boot context or current run" };
    }

    const completedStageIds = context.dataBundle.stages.slice(0, index).map((stage) => stage.id);
    const currentStageId = context.dataBundle.stages[index]?.id;
    if (!currentStageId) {
      return { ok: false, reason: `missing stage index ${index}` };
    }

    context.save.profile.completedStages = completedStageIds;
    context.save.profile.unlockedStages = [...new Set([...completedStageIds, currentStageId])];
    context.save.currentRun = {
      ...context.save.currentRun,
      phase: "world_map",
      stageId: currentStageId,
      roomIndex: 0,
      completedStages: completedStageIds,
      log: [...new Set([...(context.save.currentRun.log ?? []), "audit:pc_worldmap_release_state"])]
    };
    localStorage.setItem("paper_theater_card_crawler_save_v1", JSON.stringify(context.save));
    return { ok: true, completedStageIds, currentStageId };
  }, currentStageIndex);

  if (!seeded.ok) {
    throw new Error(`WorldMap release-state seed failed: ${JSON.stringify(seeded)}`);
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

async function readWorldMapReleaseStateAudit(page, currentStageIndex) {
  return page.evaluate(({ expectedCurrentIndex, stageNodes }) => {
    const textureKeys = {
      underlay: "world_map_raster_underlay_concept",
      hoverRoute: "ui_hover_route_node_concept",
      lowerBody: "ui_world_map_lower_node_body_concept",
      lowerFrame: "ui_world_map_lower_node_frame_concept",
      currentMarker: "ui_current_stage_marker_concept",
      currentLockCover: "ui_current_stage_lock_cover_concept",
      currentHalo: "ui_current_stage_halo_concept",
      currentStatus: "ui_current_stage_status_badge_concept",
      currentBody: "ui_current_stage_body_wash_concept",
      currentLateBody: "ui_current_stage_late_body_wash_concept",
      currentFrame: "ui_current_stage_frame_concept",
      currentLateFrame: "ui_current_stage_late_frame_concept",
      completedBody: "ui_completed_stage_body_wash_concept",
      completedLateBody: "ui_completed_stage_late_body_wash_concept",
      completedFrame: "ui_completed_stage_frame_concept",
      completedLateFrame: "ui_completed_stage_late_frame_concept",
      completedBadge: "ui_completed_stage_badge_concept",
      completedLateBadge: "ui_completed_stage_late_badge_concept",
      lockedBody: "ui_locked_stage_body_wash_concept",
      lockedFarBody: "ui_locked_stage_far_body_wash_concept",
      lockedBossBody: "ui_locked_stage_boss_body_wash_concept",
      lockedFrame: "ui_locked_stage_frame_concept",
      lockedFarFrame: "ui_locked_stage_far_frame_concept",
      lockedBossFrame: "ui_locked_stage_boss_frame_concept",
      lockedBadge: "ui_locked_stage_badge_concept",
      sealedBody: "ui_sealed_stage_body_wash_concept",
      sealedMidBody: "ui_sealed_stage_mid_body_wash_concept",
      sealedFrame: "ui_sealed_stage_frame_concept",
      sealedMidFrame: "ui_sealed_stage_mid_frame_concept",
      sealedBadge: "ui_sealed_stage_badge_concept",
      dormantBody: "ui_dormant_stage_body_wash_concept",
      dormantMidBody: "ui_dormant_stage_mid_body_wash_concept",
      dormantFrame: "ui_dormant_stage_frame_concept",
      dormantMidFrame: "ui_dormant_stage_mid_frame_concept",
      routeThread: "ui_world_map_route_progress_thread_concept",
      routeCurrentThread: "ui_world_map_route_progress_current_thread_concept",
      routeLockedThread: "ui_world_map_route_locked_thread_concept",
      routeBead: "ui_world_map_route_progress_bead_concept",
      routeCurrentBead: "ui_world_map_route_progress_current_bead_concept",
      routeLockedBead: "ui_world_map_route_locked_bead_concept"
    };

    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
      ?? game?.scene?.getScene?.("WorldMapScene");
    const context = scene?.registry?.get?.("bootContext");
    const children = scene?.children?.list ?? [];
    const visible = children.filter((child) => child?.visible !== false && child.alpha !== 0);
    const underlayIndex = children.findIndex((child) => (
      child?.type === "Image"
      && child.texture?.key === textureKeys.underlay
      && child.visible !== false
      && child.alpha !== 0
    ));
    const underlayDepth = children[underlayIndex]?.depth ?? 0;
    const stages = context?.dataBundle?.stages ?? [];
    const currentIndex = stages.findIndex((stage) => stage.id === context?.run?.stageId);
    const completedStageIds = new Set(context?.save?.profile?.completedStages ?? []);
    const unlockedStageIds = new Set([...(context?.save?.profile?.unlockedStages ?? []), context?.run?.stageId].filter(Boolean));
    const firstLockedIndex = stages.findIndex((stage) => !unlockedStageIds.has(stage.id));
    const currentNode = stageNodes[currentIndex];

    const images = (key) => visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === key
      && (child.alpha ?? 1) > 0.05
    ));
    const near = (left, right, tolerance = 1) => Math.abs(left - right) <= tolerance;
    const imagesNearNode = (items, node) => items.filter((image) => (
      Math.abs(image.x - node.x) < node.width * 0.72
      && Math.abs(image.y - node.y) < node.height * 0.72
    ));

    const completedIndexes = stages
      .map((stage, index) => ({ stage, index, node: stageNodes[index] }))
      .filter(({ stage, node }) => node && completedStageIds.has(stage.id) && stage.id !== context?.run?.stageId);
    const lockedIndexes = stages
      .map((stage, index) => ({ stage, index, node: stageNodes[index] }))
      .filter(({ stage, index, node }) => node && !unlockedStageIds.has(stage.id) && index >= 9);
    const sealedIndexes = stages
      .map((stage, index) => ({ stage, index, node: stageNodes[index] }))
      .filter(({ stage, index, node }) => node && !unlockedStageIds.has(stage.id) && index === firstLockedIndex && index < 9);
    const dormantIndexes = stages
      .map((stage, index) => ({ stage, index, node: stageNodes[index] }))
      .filter(({ stage, index, node }) => node && !unlockedStageIds.has(stage.id) && index !== firstLockedIndex && index < 9);

    const currentBodyImages = [...images(textureKeys.currentBody), ...images(textureKeys.currentLateBody)];
    const currentFrameImages = [...images(textureKeys.currentFrame), ...images(textureKeys.currentLateFrame)];
    const completedBadgeImages = [...images(textureKeys.completedBadge), ...images(textureKeys.completedLateBadge)];
    const completedBodyImages = [...images(textureKeys.completedBody), ...images(textureKeys.completedLateBody)];
    const completedFrameImages = [...images(textureKeys.completedFrame), ...images(textureKeys.completedLateFrame)];
    const lockedBodyImages = [...images(textureKeys.lockedBody), ...images(textureKeys.lockedFarBody), ...images(textureKeys.lockedBossBody)];
    const lockedFrameImages = [...images(textureKeys.lockedFrame), ...images(textureKeys.lockedFarFrame), ...images(textureKeys.lockedBossFrame)];
    const sealedBodyImages = [...images(textureKeys.sealedBody), ...images(textureKeys.sealedMidBody)];
    const sealedFrameImages = [...images(textureKeys.sealedFrame), ...images(textureKeys.sealedMidFrame)];
    const dormantBodyImages = [...images(textureKeys.dormantBody), ...images(textureKeys.dormantMidBody)];
    const dormantFrameImages = [...images(textureKeys.dormantFrame), ...images(textureKeys.dormantMidFrame)];
    const routeThreadImages = [...images(textureKeys.routeThread), ...images(textureKeys.routeCurrentThread)];
    const routeBeadImages = [...images(textureKeys.routeBead), ...images(textureKeys.routeCurrentBead)];
    const routeLockedThreadImages = images(textureKeys.routeLockedThread);
    const routeLockedBeadImages = images(textureKeys.routeLockedBead);

    const expectedCompletedBase = completedIndexes.filter(({ index }) => index <= 2);
    const expectedCompletedLate = completedIndexes.filter(({ index }) => index > 2);
    const expectedLockedNext = lockedIndexes.filter(({ index }) => index === firstLockedIndex && index < 13);
    const expectedLockedFar = lockedIndexes.filter(({ index }) => index !== firstLockedIndex && index < 13);
    const expectedLockedBoss = lockedIndexes.filter(({ index }) => index >= 13);
    const expectedSealedBase = sealedIndexes.filter(({ index }) => index <= 4);
    const expectedSealedMid = sealedIndexes.filter(({ index }) => index > 4);
    const expectedDormantBase = dormantIndexes.filter(({ index }) => index <= 4);
    const expectedDormantMid = dormantIndexes.filter(({ index }) => index > 4);

    const expectedRouteThreads = [];
    const expectedRouteBeads = [];
    if (currentIndex > 0) {
      for (let index = 0; index < currentIndex; index += 1) {
        const fromStage = stages[index];
        const toStage = stages[index + 1];
        const fromNode = stageNodes[index];
        const toNode = stageNodes[index + 1];
        if (!fromStage || !toStage || !fromNode || !toNode) continue;
        if (!completedStageIds.has(fromStage.id)) continue;
        if (toStage.id !== context?.run?.stageId && !completedStageIds.has(toStage.id)) continue;
        const finalLeg = index === currentIndex - 1;
        const thread = routeThreadPlacement(fromNode, toNode, finalLeg);
        if (thread) expectedRouteThreads.push(thread);
        expectedRouteBeads.push(...routeBeadPlacements(fromNode, toNode, finalLeg));
      }
    }
    const expectedRouteBaseThreads = expectedRouteThreads.filter((placement) => !placement.finalLeg);
    const expectedRouteCurrentThreads = expectedRouteThreads.filter((placement) => placement.finalLeg);
    const expectedRouteBaseBeads = expectedRouteBeads.filter((placement) => !placement.finalLeg);
    const expectedRouteCurrentBeads = expectedRouteBeads.filter((placement) => placement.finalLeg);

    const expectedLockedRouteThreads = [];
    const expectedLockedRouteBeads = [];
    for (let index = currentIndex; index < stages.length - 1; index += 1) {
      const toStage = stages[index + 1];
      const fromNode = stageNodes[index];
      const toNode = stageNodes[index + 1];
      if (!toStage || !fromNode || !toNode || unlockedStageIds.has(toStage.id)) continue;
      const thread = lockedRouteThreadPlacement(fromNode, toNode);
      if (thread) expectedLockedRouteThreads.push(thread);
      expectedLockedRouteBeads.push(...lockedRouteBeadPlacements(fromNode, toNode));
    }

    const lowerNodeBodyImages = images(textureKeys.lowerBody);
    const lowerNodeFrameImages = images(textureKeys.lowerFrame);
    const markerImages = images(textureKeys.currentMarker);
    const currentLockCoverImages = images(textureKeys.currentLockCover);
    const haloImages = images(textureKeys.currentHalo);
    const statusImages = images(textureKeys.currentStatus);

    const expectedLateCurrent = currentIndex > 4;
    const expectedCurrentBodyImages = expectedLateCurrent ? images(textureKeys.currentLateBody) : images(textureKeys.currentBody);
    const expectedCurrentFrameImages = expectedLateCurrent ? images(textureKeys.currentLateFrame) : images(textureKeys.currentFrame);
    const expectedCurrentStatus = currentNode
      ? currentStatusPlacement(currentNode, currentIndex)
      : undefined;
    const expectedCurrentLockCover = currentNode && currentIndex >= 9
      ? currentLockCoverPlacement(currentNode, currentIndex)
      : undefined;
    const markerAtCurrentStage = markerImages.length === 1
      && currentNode
      && near(markerImages[0].x, currentNode.x + 4)
      && near(markerImages[0].y, currentNode.y - Math.max(88, currentNode.height * 0.62));
    const haloAtCurrentStage = haloImages.length === 1
      && currentNode
      && near(haloImages[0].x, currentNode.x + 2)
      && near(haloImages[0].y, currentNode.y + 4);
    const bodyAtCurrentStage = currentBodyImages.length === 1
      && expectedCurrentBodyImages.length === 1
      && currentNode
      && near(expectedCurrentBodyImages[0].x, currentNode.x + currentNode.width * 0.02)
      && near(expectedCurrentBodyImages[0].y, currentNode.y + currentNode.height * 0.04)
      && near(expectedCurrentBodyImages[0].displayWidth, currentNode.width * 1.12)
      && near(expectedCurrentBodyImages[0].displayHeight, currentNode.height * 1.16)
      && (expectedCurrentBodyImages[0].alpha ?? 1) >= 0.64;
    const frameAtCurrentStage = currentFrameImages.length === 1
      && expectedCurrentFrameImages.length === 1
      && currentNode
      && near(expectedCurrentFrameImages[0].x, currentNode.x + currentNode.width * 0.02)
      && near(expectedCurrentFrameImages[0].y, currentNode.y + currentNode.height * 0.01)
      && near(expectedCurrentFrameImages[0].displayWidth, currentNode.width * 1.34)
      && near(expectedCurrentFrameImages[0].displayHeight, currentNode.height * 1.38)
      && (expectedCurrentFrameImages[0].alpha ?? 1) >= 0.88;
    const statusAtCurrentStage = statusImages.length === 1
      && expectedCurrentStatus
      && near(statusImages[0].x, expectedCurrentStatus.x)
      && near(statusImages[0].y, expectedCurrentStatus.y)
      && near(statusImages[0].displayWidth, expectedCurrentStatus.size)
      && near(statusImages[0].displayHeight, expectedCurrentStatus.size);
    const lockCoverAtCurrentStage = currentIndex < 9
      ? currentLockCoverImages.length === 0
      : currentLockCoverImages.length === 1
        && expectedCurrentLockCover
        && near(currentLockCoverImages[0].x, expectedCurrentLockCover.x)
        && near(currentLockCoverImages[0].y, expectedCurrentLockCover.y)
        && near(currentLockCoverImages[0].displayWidth, expectedCurrentLockCover.width)
        && near(currentLockCoverImages[0].displayHeight, expectedCurrentLockCover.height)
        && Number(currentLockCoverImages[0].alpha ?? 1) >= 0.94;

    const currentHasNoCompleted = currentNode && imagesNearNode([...completedBadgeImages, ...completedBodyImages, ...completedFrameImages], currentNode).length === 0;
    const currentHasNoLocked = currentNode && imagesNearNode([
      ...images(textureKeys.lockedBadge),
      ...lockedBodyImages,
      ...lockedFrameImages,
      ...images(textureKeys.sealedBadge),
      ...sealedBodyImages,
      ...sealedFrameImages,
      ...dormantBodyImages,
      ...dormantFrameImages
    ], currentNode).length === 0;
    const completedBadgesAtExpectedNodes = completedIndexes.every(({ node, index }) => {
      const placement = completedBadgePlacement(node, index);
      return imagesNear(completedBadgeImages, placement.x, placement.y, 1).some((image) => (
        near(image.displayWidth, placement.size)
        && near(image.displayHeight, placement.size)
        && Number(image.alpha ?? 1) >= placement.minAlpha
      ));
    });

    const routeHoverImages = images(textureKeys.hoverRoute);
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

    const canvas = document.querySelector("canvas");
    const accessibilitySummary = document.getElementById("game-accessibility-summary");
    const ariaLabel = canvas?.getAttribute("aria-label") ?? "";
    const canvasAriaOk = canvas?.getAttribute("role") === "img"
      && ariaLabel.length > 20
      && Boolean(accessibilitySummary?.textContent?.trim())
      && window.getComputedStyle(accessibilitySummary).position === "fixed";

    const ok = underlayIndex >= 0
      && currentIndex === expectedCurrentIndex
      && currentIndex >= 0
      && markerAtCurrentStage
      && haloAtCurrentStage
      && bodyAtCurrentStage
      && frameAtCurrentStage
      && statusAtCurrentStage
      && lockCoverAtCurrentStage
      && currentHasNoCompleted
      && currentHasNoLocked
      && lowerNodeBodyImages.length === 5
      && lowerNodeFrameImages.length === 5
      && completedBadgeImages.length === completedIndexes.length
      && completedBadgesAtExpectedNodes
      && images(textureKeys.completedBadge).length === expectedCompletedBase.length
      && images(textureKeys.completedLateBadge).length === expectedCompletedLate.length
      && completedBodyImages.length === completedIndexes.length
      && images(textureKeys.completedBody).length === expectedCompletedBase.length
      && images(textureKeys.completedLateBody).length === expectedCompletedLate.length
      && completedFrameImages.length === completedIndexes.length
      && images(textureKeys.completedFrame).length === expectedCompletedBase.length
      && images(textureKeys.completedLateFrame).length === expectedCompletedLate.length
      && images(textureKeys.currentBody).length === (expectedLateCurrent ? 0 : 1)
      && images(textureKeys.currentLateBody).length === (expectedLateCurrent ? 1 : 0)
      && images(textureKeys.currentFrame).length === (expectedLateCurrent ? 0 : 1)
      && images(textureKeys.currentLateFrame).length === (expectedLateCurrent ? 1 : 0)
      && lockedBodyImages.length === lockedIndexes.length
      && images(textureKeys.lockedBody).length === expectedLockedNext.length
      && images(textureKeys.lockedFarBody).length === expectedLockedFar.length
      && images(textureKeys.lockedBossBody).length === expectedLockedBoss.length
      && lockedFrameImages.length === lockedIndexes.length
      && images(textureKeys.lockedFrame).length === expectedLockedNext.length
      && images(textureKeys.lockedFarFrame).length === expectedLockedFar.length
      && images(textureKeys.lockedBossFrame).length === expectedLockedBoss.length
      && images(textureKeys.lockedBadge).length === lockedIndexes.length
      && sealedBodyImages.length === sealedIndexes.length
      && images(textureKeys.sealedBody).length === expectedSealedBase.length
      && images(textureKeys.sealedMidBody).length === expectedSealedMid.length
      && sealedFrameImages.length === sealedIndexes.length
      && images(textureKeys.sealedFrame).length === expectedSealedBase.length
      && images(textureKeys.sealedMidFrame).length === expectedSealedMid.length
      && images(textureKeys.sealedBadge).length === sealedIndexes.length
      && dormantBodyImages.length === dormantIndexes.length
      && images(textureKeys.dormantBody).length === expectedDormantBase.length
      && images(textureKeys.dormantMidBody).length === expectedDormantMid.length
      && dormantFrameImages.length === dormantIndexes.length
      && images(textureKeys.dormantFrame).length === expectedDormantBase.length
      && images(textureKeys.dormantMidFrame).length === expectedDormantMid.length
      && routeThreadImages.length === expectedRouteThreads.length
      && images(textureKeys.routeThread).length === expectedRouteBaseThreads.length
      && images(textureKeys.routeCurrentThread).length === expectedRouteCurrentThreads.length
      && routeBeadImages.length === expectedRouteBeads.length
      && images(textureKeys.routeBead).length === expectedRouteBaseBeads.length
      && images(textureKeys.routeCurrentBead).length === expectedRouteCurrentBeads.length
      && routeLockedThreadImages.length === expectedLockedRouteThreads.length
      && routeLockedBeadImages.length === expectedLockedRouteBeads.length
      && routeHoverImages.length === 0
      && visibleTextCount === 0
      && visibleRectsAboveUnderlay === 0
      && canvasAriaOk;

    return {
      ok,
      activeScene: scene?.scene?.key,
      currentStageId: context?.run?.stageId,
      currentIndex,
      expectedCurrentIndex,
      firstLockedIndex,
      currentMaterial: expectedLateCurrent ? "late" : "base",
      hasUnderlay: underlayIndex >= 0,
      visibleLowerNodeBodies: lowerNodeBodyImages.length,
      expectedLowerNodeBodies: 5,
      visibleLowerNodeFrames: lowerNodeFrameImages.length,
      visibleCurrentMarkerImages: markerImages.length,
      visibleCurrentLockCoverImages: currentLockCoverImages.length,
      expectedCurrentLockCoverImages: currentIndex >= 9 ? 1 : 0,
      markerAtCurrentStage,
      visibleCurrentHaloImages: haloImages.length,
      haloAtCurrentStage,
      visibleCurrentBodyImages: currentBodyImages.length,
      visibleCurrentFrameImages: currentFrameImages.length,
      bodyAtCurrentStage,
      frameAtCurrentStage,
      visibleCurrentStatusImages: statusImages.length,
      statusAtCurrentStage,
      lockCoverAtCurrentStage,
      completedBadgesAtExpectedNodes,
      currentHasNoCompleted,
      currentHasNoLocked,
      visibleCompletedBadges: completedBadgeImages.length,
      expectedCompletedBadges: completedIndexes.length,
      visibleCompletedBaseBadges: images(textureKeys.completedBadge).length,
      expectedCompletedBaseBadges: expectedCompletedBase.length,
      visibleCompletedLateBadges: images(textureKeys.completedLateBadge).length,
      expectedCompletedLateBadges: expectedCompletedLate.length,
      visibleLockedBadges: images(textureKeys.lockedBadge).length,
      expectedLockedBadges: lockedIndexes.length,
      visibleLockedNextBodies: images(textureKeys.lockedBody).length,
      expectedLockedNextBodies: expectedLockedNext.length,
      visibleLockedFarBodies: images(textureKeys.lockedFarBody).length,
      expectedLockedFarBodies: expectedLockedFar.length,
      visibleLockedBossBodies: images(textureKeys.lockedBossBody).length,
      expectedLockedBossBodies: expectedLockedBoss.length,
      visibleSealedBadges: images(textureKeys.sealedBadge).length,
      expectedSealedBadges: sealedIndexes.length,
      visibleSealedBaseBodies: images(textureKeys.sealedBody).length,
      expectedSealedBaseBodies: expectedSealedBase.length,
      visibleSealedMidBodies: images(textureKeys.sealedMidBody).length,
      expectedSealedMidBodies: expectedSealedMid.length,
      visibleDormantBodies: dormantBodyImages.length,
      expectedDormantBodies: dormantIndexes.length,
      visibleDormantBaseBodies: images(textureKeys.dormantBody).length,
      expectedDormantBaseBodies: expectedDormantBase.length,
      visibleDormantMidBodies: images(textureKeys.dormantMidBody).length,
      expectedDormantMidBodies: expectedDormantMid.length,
      visibleRouteThreads: routeThreadImages.length,
      expectedRouteThreads: expectedRouteThreads.length,
      visibleRouteCurrentThreads: images(textureKeys.routeCurrentThread).length,
      expectedRouteCurrentThreads: expectedRouteCurrentThreads.length,
      visibleRouteBeads: routeBeadImages.length,
      expectedRouteBeads: expectedRouteBeads.length,
      visibleRouteCurrentBeads: images(textureKeys.routeCurrentBead).length,
      expectedRouteCurrentBeads: expectedRouteCurrentBeads.length,
      visibleRouteLockedThreads: routeLockedThreadImages.length,
      expectedLockedRouteThreads: expectedLockedRouteThreads.length,
      visibleRouteLockedBeads: routeLockedBeadImages.length,
      expectedLockedRouteBeads: expectedLockedRouteBeads.length,
      visibleRouteHoverImages: routeHoverImages.length,
      visibleTextCount,
      visibleRectsAboveUnderlay,
      canvasAriaOk,
      ariaLabelLength: ariaLabel.length
    };

    function routeThreadPlacement(fromNode, toNode, finalLeg) {
      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      const length = Math.hypot(dx, dy);
      if (length <= 1) return undefined;
      const fromPad = Math.max(fromNode.width, fromNode.height) * 0.43;
      const toPad = Math.max(toNode.width, toNode.height) * 0.43;
      const usableLength = Math.max(0, length - fromPad - toPad);
      if (usableLength < 28) return undefined;
      return { finalLeg };
    }

    function routeBeadPlacements(fromNode, toNode, finalLeg) {
      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      const length = Math.hypot(dx, dy);
      if (length <= 1) return [];
      const fromPad = Math.max(fromNode.width, fromNode.height) * 0.36;
      const toPad = Math.max(toNode.width, toNode.height) * 0.36;
      const usableLength = Math.max(0, length - fromPad - toPad);
      if (usableLength < 24) return [];
      return Array.from({ length: Math.max(1, Math.floor(usableLength / 46)) }, () => ({ finalLeg }));
    }

    function lockedRouteThreadPlacement(fromNode, toNode) {
      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      const length = Math.hypot(dx, dy);
      if (length <= 1) return undefined;
      const fromPad = Math.max(fromNode.width, fromNode.height) * 0.48;
      const toPad = Math.max(toNode.width, toNode.height) * 0.48;
      const usableLength = Math.max(0, length - fromPad - toPad);
      return usableLength < 26 ? undefined : {};
    }

    function lockedRouteBeadPlacements(fromNode, toNode) {
      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      const length = Math.hypot(dx, dy);
      if (length <= 1) return [];
      const fromPad = Math.max(fromNode.width, fromNode.height) * 0.44;
      const toPad = Math.max(toNode.width, toNode.height) * 0.44;
      const usableLength = Math.max(0, length - fromPad - toPad);
      if (usableLength < 34) return [];
      return Array.from({ length: Math.max(1, Math.floor(usableLength / 76)) }, () => ({}));
    }

    function currentStatusPlacement(node, stageIndex) {
      return {
        x: node.x + node.width * 0.1,
        y: node.y + node.height * 0.36,
        size: 72
      };
    }

    function currentLockCoverPlacement(node, stageIndex) {
      const locked = lockedBadgePlacement(node, stageIndex);
      const width = Math.max(locked.size, 78);
      return {
        x: locked.x,
        y: locked.y,
        width,
        height: width * 1.12
      };
    }

    function completedBadgePlacement(node, stageIndex) {
      if (stageIndex >= 9) {
        const locked = lockedBadgePlacement(node, stageIndex);
        return { x: locked.x, y: locked.y, size: Math.max(locked.size, 70), minAlpha: 0.88 };
      }
      if (stageIndex <= 2) {
        return {
          x: node.x + node.width * 0.03,
          y: node.y + node.height * 0.32,
          size: 78,
          minAlpha: 0.94
        };
      }

      const placed = {
        5: { dx: -0.04, dy: 0.43, size: 52, minAlpha: 0.8 },
        6: { dx: 0.2, dy: 0.38, size: 52, minAlpha: 0.8 },
        7: { dx: 0.02, dy: 0.32, size: 44, minAlpha: 0.7 },
        8: { dx: 0.04, dy: 0.36, size: 54, minAlpha: 0.8 }
      }[stageIndex];
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
        size: 60,
        minAlpha: 0.86
      };
    }

    function lockedBadgePlacement(node, stageIndex) {
      const sourceAligned = {
        9: { x: 646, y: 285, size: 70 },
        10: { x: 787, y: 337, size: 70 },
        11: { x: 941, y: 358, size: 70 },
        12: { x: 1068, y: 343, size: 70 },
        13: { x: 1208, y: 232, size: 76 },
        14: { x: 1311, y: 378, size: 76 }
      }[stageIndex];
      if (sourceAligned) return sourceAligned;
      if (stageIndex >= 13) return { x: node.x - node.width * 0.34, y: node.y + node.height * 0.36, size: 76 };
      if (stageIndex >= 11) return { x: node.x - node.width * 0.12, y: node.y + node.height * 0.36, size: 70 };
      return { x: node.x - node.width * 0.06, y: node.y + node.height * 0.36, size: 70 };
    }

    function imagesNear(items, x, y, tolerance = 1) {
      return items.filter((image) => near(image.x, x, tolerance) && near(image.y, y, tolerance));
    }
  }, { expectedCurrentIndex: currentStageIndex, stageNodes });
}
