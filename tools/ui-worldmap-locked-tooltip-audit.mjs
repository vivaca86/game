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
    key: "sealed-next",
    seed: { completedCount: 1, currentStageIndex: 1 },
    targetIndex: 2,
    expectedFirstLockedIndex: 2
  },
  {
    key: "dormant-mid",
    seed: { completedCount: 1, currentStageIndex: 1 },
    targetIndex: 5,
    expectedFirstLockedIndex: 2
  },
  {
    key: "red-far",
    seed: { completedCount: 1, currentStageIndex: 1 },
    targetIndex: 10,
    expectedFirstLockedIndex: 2
  },
  {
    key: "red-next",
    seed: { completedCount: 8, currentStageIndex: 8 },
    targetIndex: 9,
    expectedFirstLockedIndex: 9
  },
  {
    key: "red-boss",
    seed: { completedCount: 12, currentStageIndex: 12 },
    targetIndex: 13,
    expectedFirstLockedIndex: 13
  }
];

const viewports = [
  { key: "desktop-1920", suffix: "1920", width: 1920, height: 1080, minWidth: 260, minHeight: 60, maxWidthRatio: 0.42, maxHeightRatio: 0.34, allowLetterbox: false },
  { key: "desktop-1280", suffix: "desktop-1280", width: 1280, height: 720, minWidth: 240, minHeight: 58, maxWidthRatio: 0.48, maxHeightRatio: 0.34, allowLetterbox: false },
  { key: "mobile-390x844", suffix: "mobile-390x844", width: 390, height: 844, minWidth: 210, minHeight: 48, maxWidthRatio: 0.82, maxHeightRatio: 0.5, allowLetterbox: true }
];

await mkdir("tmp/ui-quality/worldmap-locked-tooltips", { recursive: true });

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
      const seeded = await seedWorldMapState(page, baseUrl, auditCase.seed);
      const targetNode = stageNodes[auditCase.targetIndex];
      if (!targetNode) throw new Error(`${auditCase.key}: missing target node`);

      const initial = await readWorldMapTooltipAudit(page, auditCase);
      if (initial.tooltip.visible) {
        throw new Error(`${auditCase.key}/${viewport.key}: tooltip visible before locked hover`);
      }

      const canvas = page.locator("canvas");
      const box = await canvas.boundingBox();
      if (!box) throw new Error(`${auditCase.key}/${viewport.key}: missing canvas`);
      await page.mouse.move(
        box.x + (targetNode.x / 1920) * box.width,
        box.y + (targetNode.y / 1080) * box.height
      );
      await page.waitForSelector("#game-readability-tooltip[data-visible='true']", { timeout: 5000 });

      const hoverAudit = await readWorldMapTooltipAudit(page, auditCase);
      assertWorldMapLockedTooltip(`${auditCase.key}/${viewport.key}`, hoverAudit, auditCase, viewport, seeded);

      await page.mouse.click(
        box.x + (targetNode.x / 1920) * box.width,
        box.y + (targetNode.y / 1080) * box.height
      );
      await page.waitForTimeout(180);
      const clickAudit = await readWorldMapTooltipAudit(page, auditCase);
      if (clickAudit.activeScene !== "WorldMapScene" || clickAudit.currentStageId !== seeded.currentStageId) {
        throw new Error(`${auditCase.key}/${viewport.key}: locked node click changed scene/stage ${JSON.stringify(clickAudit)}`);
      }
      assertWorldMapLockedTooltip(`${auditCase.key}/${viewport.key}/click`, clickAudit, auditCase, viewport, seeded);

      const screenshot = path.join("tmp", "ui-quality", "worldmap-locked-tooltips", `${auditCase.key}-locked-tooltip-v1-${viewport.suffix}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({
        label: auditCase.key,
        viewport: viewport.key,
        stageId: hoverAudit.targetStageId,
        title: hoverAudit.tooltip.title,
        size: `${Math.round(hoverAudit.tooltip.width)}x${Math.round(hoverAudit.tooltip.height)}`,
        currentStageId: hoverAudit.currentStageId,
        currentMarkerImages: hoverAudit.visibleCurrentMarkerImages,
        currentHaloImages: hoverAudit.visibleCurrentHaloImages,
        currentBody: hoverAudit.visibleCurrentLateBodyImages === 1 ? "late" : "base",
        currentFrame: hoverAudit.visibleCurrentLateFrameImages === 1 ? "late" : "base",
        currentStatusImages: hoverAudit.visibleCurrentStatusImages,
        targetStateFamily: hoverAudit.targetStateFamily,
        targetBody: hoverAudit.targetBodyAtTarget ? "ok" : "missing",
        targetFrame: hoverAudit.targetFrameAtTarget ? "ok" : "missing",
        targetBadge: hoverAudit.targetBadgeAtTarget ? "ok" : "missing",
        firstLockedIndex: hoverAudit.firstLockedIndex,
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
  for (const port of [4245, 4246, 4247, 4248, 4249]) {
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
  throw new Error("No free WorldMap locked tooltip audit port found");
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

async function seedWorldMapState(page, baseUrl, seed) {
  await page.goto(new URL("/?data=release&entry=world_map&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, "WorldMapScene");
  const seeded = await page.evaluate(({ completedCount, currentStageIndex }) => {
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
      log: [...new Set([...(context.save.currentRun.log ?? []), "audit:worldmap_locked_tooltip"])]
    };
    localStorage.setItem("paper_theater_card_crawler_save_v1", JSON.stringify(context.save));
    return { ok: true, completedStageIds, currentStageId };
  }, seed);
  if (!seeded.ok) {
    throw new Error(`WorldMap locked tooltip seed failed: ${JSON.stringify(seeded)}`);
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

async function readWorldMapTooltipAudit(page, auditCase) {
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
    const unlockedStageIds = new Set([...(context?.save?.profile?.unlockedStages ?? []), currentStageId]);
    const firstLockedIndex = stages.findIndex((stage) => !unlockedStageIds.has(stage.id));
    const targetIndex = auditCase.targetIndex;
    const targetNode = stageNodes[targetIndex];
    const visible = (scene?.children?.list ?? []).filter((child) => child?.visible !== false && child.alpha !== 0);
    const children = scene?.children?.list ?? [];
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
    const lockedNextBodyImages = imageByKey("ui_locked_stage_body_wash_concept");
    const lockedFarBodyImages = imageByKey("ui_locked_stage_far_body_wash_concept");
    const lockedBossBodyImages = imageByKey("ui_locked_stage_boss_body_wash_concept");
    const lockedBodyImages = [...lockedNextBodyImages, ...lockedFarBodyImages, ...lockedBossBodyImages];
    const lockedNextFrameImages = imageByKey("ui_locked_stage_frame_concept");
    const lockedFarFrameImages = imageByKey("ui_locked_stage_far_frame_concept");
    const lockedBossFrameImages = imageByKey("ui_locked_stage_boss_frame_concept");
    const lockedFrameImages = [...lockedNextFrameImages, ...lockedFarFrameImages, ...lockedBossFrameImages];
    const sealedBadgeImages = imageByKey("ui_sealed_stage_badge_concept");
    const sealedBaseBodyImages = imageByKey("ui_sealed_stage_body_wash_concept");
    const sealedMidBodyImages = imageByKey("ui_sealed_stage_mid_body_wash_concept");
    const sealedBodyImages = [...sealedBaseBodyImages, ...sealedMidBodyImages];
    const sealedBaseFrameImages = imageByKey("ui_sealed_stage_frame_concept");
    const sealedMidFrameImages = imageByKey("ui_sealed_stage_mid_frame_concept");
    const sealedFrameImages = [...sealedBaseFrameImages, ...sealedMidFrameImages];
    const dormantBaseBodyImages = imageByKey("ui_dormant_stage_body_wash_concept");
    const dormantMidBodyImages = imageByKey("ui_dormant_stage_mid_body_wash_concept");
    const dormantBodyImages = [...dormantBaseBodyImages, ...dormantMidBodyImages];
    const dormantBaseFrameImages = imageByKey("ui_dormant_stage_frame_concept");
    const dormantMidFrameImages = imageByKey("ui_dormant_stage_mid_frame_concept");
    const dormantFrameImages = [...dormantBaseFrameImages, ...dormantMidFrameImages];
    const defaultDisabledStampCount = visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === "ui_disabled_lock_stamp_concept"
      && Number(child.alpha ?? 1) > 0.05
    )).length;
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
    const imageAt = (images, x, y) => images.find((image) => Math.abs(image.x - x) <= 1 && Math.abs(image.y - y) <= 1);
    const nearTargetNode = (image, scale) => targetNode && (
      Math.abs(image.x - targetNode.x) < targetNode.width * scale
      && Math.abs(image.y - targetNode.y) < targetNode.height * scale
    );
    const targetIsSealed = targetIndex === firstLockedIndex && targetIndex < 9;
    const targetIsDormant = targetIndex !== firstLockedIndex && targetIndex < 9;
    const targetIsRedLock = targetIndex >= 9;
    const targetIsRedNext = targetIsRedLock && targetIndex === firstLockedIndex && targetIndex < 13;
    const targetIsRedFar = targetIsRedLock && targetIndex !== firstLockedIndex && targetIndex < 13;
    const targetIsRedBoss = targetIndex >= 13;
    const targetStateFamily = targetIsRedBoss
      ? "red-boss"
      : targetIsRedNext
        ? "red-next"
        : targetIsRedFar
          ? "red-far"
          : targetIsSealed
            ? (targetIndex > 4 ? "sealed-mid" : "sealed-base")
            : targetIsDormant
              ? (targetIndex > 4 ? "dormant-mid" : "dormant-base")
              : "unknown";
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
    const lockedBadgePlacement = (node, stageIndex) => {
      const sourceAligned = {
        9: { x: 646, y: 285, size: 70 },
        10: { x: 787, y: 337, size: 70 },
        11: { x: 941, y: 358, size: 70 },
        12: { x: 1068, y: 343, size: 70 },
        13: { x: 1208, y: 232, size: 76 },
        14: { x: 1311, y: 378, size: 76 }
      }[stageIndex];
      const base = sourceAligned
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
    const sealedBodyPlacement = (node, stageIndex) => {
      const midNode = stageIndex > 4;
      return {
        x: node.x + node.width * 0.01,
        y: node.y + node.height * 0.07,
        width: node.width * (midNode ? 1.08 : 1.1),
        height: node.height * (midNode ? 1.14 : 1.16),
        minAlpha: midNode ? 0.4 : 0.48
      };
    };
    const sealedFramePlacement = (node, stageIndex) => {
      const midNode = stageIndex > 4;
      return {
        x: node.x + node.width * 0.01,
        y: node.y + node.height * 0.05,
        width: node.width * (midNode ? 1.2 : 1.24),
        height: node.height * (midNode ? 1.26 : 1.3),
        minAlpha: midNode ? 0.46 : 0.56
      };
    };
    const sealedBadgePlacement = (node) => ({
      x: node.x + node.width * 0.01,
      y: node.y + node.height * 0.39,
      size: 60,
      minAlpha: 0.8
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
    const targetBodyImages = targetIsRedBoss
      ? lockedBossBodyImages
      : targetIsRedNext
        ? lockedNextBodyImages
        : targetIsRedFar
          ? lockedFarBodyImages
          : targetIsSealed
            ? (targetIndex > 4 ? sealedMidBodyImages : sealedBaseBodyImages)
            : targetIsDormant
              ? (targetIndex > 4 ? dormantMidBodyImages : dormantBaseBodyImages)
              : [];
    const targetFrameImages = targetIsRedBoss
      ? lockedBossFrameImages
      : targetIsRedNext
        ? lockedNextFrameImages
        : targetIsRedFar
          ? lockedFarFrameImages
          : targetIsSealed
            ? (targetIndex > 4 ? sealedMidFrameImages : sealedBaseFrameImages)
            : targetIsDormant
              ? (targetIndex > 4 ? dormantMidFrameImages : dormantBaseFrameImages)
              : [];
    const targetBodyPlacement = targetNode && targetIsRedLock
      ? lockedBodyPlacement(targetNode, targetIndex)
      : targetNode && targetIsSealed
        ? sealedBodyPlacement(targetNode, targetIndex)
        : targetNode && targetIsDormant
          ? dormantBodyPlacement(targetNode, targetIndex)
          : undefined;
    const targetFramePlacement = targetNode && targetIsRedLock
      ? lockedFramePlacement(targetNode, targetIndex)
      : targetNode && targetIsSealed
        ? sealedFramePlacement(targetNode, targetIndex)
        : targetNode && targetIsDormant
          ? dormantFramePlacement(targetNode, targetIndex)
          : undefined;
    const targetBadgePlacement = targetNode && targetIsRedLock
      ? lockedBadgePlacement(targetNode, targetIndex)
      : targetNode && targetIsSealed
        ? sealedBadgePlacement(targetNode)
        : undefined;
    const targetBodyImage = targetBodyPlacement
      ? imageAt(targetBodyImages, targetBodyPlacement.x, targetBodyPlacement.y)
      : undefined;
    const targetFrameImage = targetFramePlacement
      ? imageAt(targetFrameImages, targetFramePlacement.x, targetFramePlacement.y)
      : undefined;
    const targetBadgeImage = targetBadgePlacement
      ? imageAt(targetIsRedLock ? lockedBadgeImages : sealedBadgeImages, targetBadgePlacement.x, targetBadgePlacement.y)
      : undefined;
    const targetBodyAtTarget = Boolean(targetBodyImage);
    const targetFrameAtTarget = Boolean(targetFrameImage);
    const targetBadgeAtTarget = targetIsDormant ? true : Boolean(targetBadgeImage);
    const targetBodyStyleAtTarget = Boolean(targetBodyImage && targetBodyPlacement
      && Math.abs(targetBodyImage.displayWidth - targetBodyPlacement.width) <= 1
      && Math.abs(targetBodyImage.displayHeight - targetBodyPlacement.height) <= 1
      && Number(targetBodyImage.alpha ?? 1) >= targetBodyPlacement.minAlpha);
    const targetFrameStyleAtTarget = Boolean(targetFrameImage && targetFramePlacement
      && Math.abs(targetFrameImage.displayWidth - targetFramePlacement.width) <= 1
      && Math.abs(targetFrameImage.displayHeight - targetFramePlacement.height) <= 1
      && Number(targetFrameImage.alpha ?? 1) >= targetFramePlacement.minAlpha);
    const targetBadgeStyleAtTarget = targetIsDormant || Boolean(targetBadgeImage && targetBadgePlacement
      && Math.abs(targetBadgeImage.displayWidth - targetBadgePlacement.size) <= 1
      && Math.abs(targetBadgeImage.displayHeight - targetBadgePlacement.size) <= 1
      && Number(targetBadgeImage.alpha ?? 1) >= targetBadgePlacement.minAlpha);
    const targetHasNoCurrentStack = [
      ...markerImages,
      ...haloImages,
      ...currentBodyImages,
      ...currentFrameImages,
      ...statusImages
    ].every((image) => !nearTargetNode(image, 0.6));
    const targetHasNoCompletedStack = [
      ...completedImages,
      ...completedBodyImages,
      ...completedFrameImages
    ].every((image) => !nearTargetNode(image, 0.72));
    const targetHasNoWrongRedLockStack = targetIsRedLock || [
      ...lockedBadgeImages,
      ...lockedBodyImages,
      ...lockedFrameImages
    ].every((image) => !nearTargetNode(image, 0.72));
    const targetHasNoWrongSealedStack = targetIsSealed || [
      ...sealedBadgeImages,
      ...sealedBodyImages,
      ...sealedFrameImages
    ].every((image) => !nearTargetNode(image, 0.72));
    const targetHasNoWrongDormantStack = targetIsDormant || [
      ...dormantBodyImages,
      ...dormantFrameImages
    ].every((image) => !nearTargetNode(image, 0.72));

    const tooltip = readTooltip(root, canvas);
    return {
      activeScene: game?.scene?.getScenes?.(true)?.[0]?.scene?.key ?? "none",
      currentStageId,
      currentIndex,
      targetStageId: stages[auditCase.targetIndex]?.id,
      targetStageName: stages[auditCase.targetIndex]?.displayNameKo,
      targetIndex,
      targetStateFamily,
      targetBodyAtTarget,
      targetBodyStyleAtTarget,
      targetFrameAtTarget,
      targetFrameStyleAtTarget,
      targetBadgeAtTarget,
      targetBadgeStyleAtTarget,
      targetHasNoCurrentStack,
      targetHasNoCompletedStack,
      targetHasNoWrongRedLockStack,
      targetHasNoWrongSealedStack,
      targetHasNoWrongDormantStack,
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
      firstLockedIndex,
      targetUnlocked: unlockedStageIds.has(stages[auditCase.targetIndex]?.id),
      defaultDisabledStampCount,
      visibleTextCount,
      visibleRectsAboveUnderlay,
      tooltip
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

function assertWorldMapLockedTooltip(label, audit, auditCase, viewport, seeded) {
  const tooltip = audit.tooltip;
  if (audit.activeScene !== "WorldMapScene") throw new Error(`${label}: expected WorldMapScene, got ${audit.activeScene}`);
  if (!audit.underlayVisible) throw new Error(`${label}: missing world map raster underlay`);
  if (audit.currentStageId !== seeded.currentStageId) {
    throw new Error(`${label}: expected current stage ${seeded.currentStageId}, got ${audit.currentStageId}`);
  }
  if (!audit.markerAtCurrentStage || audit.visibleCurrentMarkerImages !== 1) {
    throw new Error(`${label}: current marker changed during locked-node interaction ${JSON.stringify({
      visibleCurrentMarkerImages: audit.visibleCurrentMarkerImages,
      markerAtCurrentStage: audit.markerAtCurrentStage
    })}`);
  }
  if (!audit.haloAtCurrentStage || audit.visibleCurrentHaloImages !== 1) {
    throw new Error(`${label}: current halo changed during locked-node interaction ${JSON.stringify({
      visibleCurrentHaloImages: audit.visibleCurrentHaloImages,
      haloAtCurrentStage: audit.haloAtCurrentStage
    })}`);
  }
  if (!audit.bodyAtCurrentStage || audit.visibleCurrentBodyImages !== 1) {
    throw new Error(`${label}: current body changed during locked-node interaction ${JSON.stringify({
      visibleCurrentBodyImages: audit.visibleCurrentBodyImages,
      visibleCurrentBaseBodyImages: audit.visibleCurrentBaseBodyImages,
      visibleCurrentLateBodyImages: audit.visibleCurrentLateBodyImages,
      bodyAtCurrentStage: audit.bodyAtCurrentStage
    })}`);
  }
  if (!audit.frameAtCurrentStage || audit.visibleCurrentFrameImages !== 1) {
    throw new Error(`${label}: current frame changed during locked-node interaction ${JSON.stringify({
      visibleCurrentFrameImages: audit.visibleCurrentFrameImages,
      visibleCurrentBaseFrameImages: audit.visibleCurrentBaseFrameImages,
      visibleCurrentLateFrameImages: audit.visibleCurrentLateFrameImages,
      frameAtCurrentStage: audit.frameAtCurrentStage
    })}`);
  }
  if (!audit.statusAtCurrentStage || audit.visibleCurrentStatusImages !== 1) {
    throw new Error(`${label}: current status badge changed during locked-node interaction ${JSON.stringify({
      visibleCurrentStatusImages: audit.visibleCurrentStatusImages,
      statusAtCurrentStage: audit.statusAtCurrentStage
    })}`);
  }
  if (audit.visibleCurrentBaseBodyImages !== (audit.expectedLateCurrent ? 0 : 1)) {
    throw new Error(`${label}: wrong base current body count during locked-node interaction ${audit.visibleCurrentBaseBodyImages}`);
  }
  if (audit.visibleCurrentLateBodyImages !== (audit.expectedLateCurrent ? 1 : 0)) {
    throw new Error(`${label}: wrong late current body count during locked-node interaction ${audit.visibleCurrentLateBodyImages}`);
  }
  if (audit.visibleCurrentBaseFrameImages !== (audit.expectedLateCurrent ? 0 : 1)) {
    throw new Error(`${label}: wrong base current frame count during locked-node interaction ${audit.visibleCurrentBaseFrameImages}`);
  }
  if (audit.visibleCurrentLateFrameImages !== (audit.expectedLateCurrent ? 1 : 0)) {
    throw new Error(`${label}: wrong late current frame count during locked-node interaction ${audit.visibleCurrentLateFrameImages}`);
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
    throw new Error(`${label}: current stage has conflicting state overlays during locked-node interaction ${JSON.stringify({
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
  if (audit.firstLockedIndex !== auditCase.expectedFirstLockedIndex) {
    throw new Error(`${label}: expected first locked index ${auditCase.expectedFirstLockedIndex}, got ${audit.firstLockedIndex}`);
  }
  if (audit.targetUnlocked) throw new Error(`${label}: target stage unexpectedly unlocked`);
  if (audit.targetStateFamily === "unknown") {
    throw new Error(`${label}: unknown locked target state family for index ${audit.targetIndex}`);
  }
  if (!audit.targetBodyAtTarget || !audit.targetBodyStyleAtTarget) {
    throw new Error(`${label}: locked target body missing or incorrectly styled ${JSON.stringify({
      targetStateFamily: audit.targetStateFamily,
      targetBodyAtTarget: audit.targetBodyAtTarget,
      targetBodyStyleAtTarget: audit.targetBodyStyleAtTarget
    })}`);
  }
  if (!audit.targetFrameAtTarget || !audit.targetFrameStyleAtTarget) {
    throw new Error(`${label}: locked target frame missing or incorrectly styled ${JSON.stringify({
      targetStateFamily: audit.targetStateFamily,
      targetFrameAtTarget: audit.targetFrameAtTarget,
      targetFrameStyleAtTarget: audit.targetFrameStyleAtTarget
    })}`);
  }
  if (!audit.targetBadgeAtTarget || !audit.targetBadgeStyleAtTarget) {
    throw new Error(`${label}: locked target badge missing or incorrectly styled ${JSON.stringify({
      targetStateFamily: audit.targetStateFamily,
      targetBadgeAtTarget: audit.targetBadgeAtTarget,
      targetBadgeStyleAtTarget: audit.targetBadgeStyleAtTarget
    })}`);
  }
  if (!audit.targetHasNoCurrentStack
    || !audit.targetHasNoCompletedStack
    || !audit.targetHasNoWrongRedLockStack
    || !audit.targetHasNoWrongSealedStack
    || !audit.targetHasNoWrongDormantStack) {
    throw new Error(`${label}: locked target has conflicting state overlays ${JSON.stringify({
      targetStateFamily: audit.targetStateFamily,
      targetHasNoCurrentStack: audit.targetHasNoCurrentStack,
      targetHasNoCompletedStack: audit.targetHasNoCompletedStack,
      targetHasNoWrongRedLockStack: audit.targetHasNoWrongRedLockStack,
      targetHasNoWrongSealedStack: audit.targetHasNoWrongSealedStack,
      targetHasNoWrongDormantStack: audit.targetHasNoWrongDormantStack
    })}`);
  }
  if (audit.defaultDisabledStampCount !== 0) {
    throw new Error(`${label}: unexpected default disabled stamp images on WorldMap (${audit.defaultDisabledStampCount})`);
  }
  if (audit.visibleTextCount !== 0 || audit.visibleRectsAboveUnderlay !== 0) {
    throw new Error(`${label}: unexpected Phaser text/vector leak ${JSON.stringify({
      visibleTextCount: audit.visibleTextCount,
      visibleRectsAboveUnderlay: audit.visibleRectsAboveUnderlay
    })}`);
  }
  if (!tooltip.ok) throw new Error(`${label}: ${tooltip.reason ?? "tooltip audit failed"}`);
  if (tooltip.role !== "tooltip") throw new Error(`${label}: expected role=tooltip, got ${tooltip.role}`);
  if (tooltip.live !== "polite") throw new Error(`${label}: expected aria-live=polite, got ${tooltip.live}`);
  if (!tooltip.visible) throw new Error(`${label}: tooltip is not visible`);
  if (tooltip.scene !== "WorldMapScene") throw new Error(`${label}: expected WorldMapScene tooltip, got ${tooltip.scene}`);
  if (tooltip.tone !== "danger") throw new Error(`${label}: expected danger tone, got ${tooltip.tone}`);
  if (!tooltip.title.includes("잠김")) throw new Error(`${label}: expected locked title, got ${tooltip.title}`);
  if (audit.targetStageName && !tooltip.title.includes(audit.targetStageName)) {
    throw new Error(`${label}: tooltip title does not include stage name ${audit.targetStageName}: ${tooltip.title}`);
  }
  if (tooltip.body.length < 16) throw new Error(`${label}: body too short (${tooltip.body.length})`);
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
