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

const openCases = [
  { key: "lower-open", seed: { completedCount: 2, currentStageIndex: 1 }, targetIndex: 0 },
  { key: "mid-open", seed: { completedCount: 9, currentStageIndex: 8 }, targetIndex: 7 },
  { key: "boss-open", seed: { completedCount: 14, currentStageIndex: 12 }, targetIndex: 13 }
];

const lockedCases = [
  { key: "sealed-next", seed: { completedCount: 1, currentStageIndex: 1 }, targetIndex: 2 },
  { key: "dormant-mid", seed: { completedCount: 1, currentStageIndex: 1 }, targetIndex: 5 },
  { key: "red-far", seed: { completedCount: 1, currentStageIndex: 1 }, targetIndex: 10 },
  { key: "red-next", seed: { completedCount: 8, currentStageIndex: 8 }, targetIndex: 9 },
  { key: "red-boss", seed: { completedCount: 12, currentStageIndex: 12 }, targetIndex: 13 }
];

const viewports = [
  { key: "desktop-1920", suffix: "1920", width: 1920, height: 1080 },
  { key: "desktop-1280", suffix: "desktop-1280", width: 1280, height: 720 },
  { key: "mobile-390x844", suffix: "mobile-390x844", width: 390, height: 844 }
];

await mkdir("tmp/ui-quality/worldmap-route-interactions", { recursive: true });

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

    for (const auditCase of openCases) {
      const seeded = await seedWorldMapState(page, baseUrl, auditCase);
      const targetNode = stageNodes[auditCase.targetIndex];
      const canvas = page.locator("canvas");
      const box = await canvas.boundingBox();
      if (!box || !targetNode) throw new Error(`${auditCase.key}/${viewport.key}: missing canvas or target node`);

      await page.mouse.move(
        box.x + (targetNode.x / 1920) * box.width,
        box.y + (targetNode.y / 1080) * box.height
      );
      await page.waitForSelector("#game-readability-tooltip[data-visible='true']", { timeout: 5000 });
      const hoverAudit = await readWorldMapRouteInteractionAudit(page, auditCase, seeded);
      assertRouteInteraction(`${auditCase.key}/${viewport.key}/hover`, hoverAudit);
      if (viewport.suffix === "1920") {
        const screenshot = path.join("tmp", "ui-quality", "worldmap-route-interactions", `${auditCase.key}-route-hover-v1-${viewport.suffix}.png`);
        await page.screenshot({ path: screenshot, fullPage: true });
      }
      results.push(resultSummary(auditCase.key, viewport.key, "open-hover", hoverAudit));

      await page.mouse.down();
      await page.waitForTimeout(140);
      const downAudit = await readWorldMapRouteInteractionAudit(page, auditCase, seeded);
      assertRouteInteraction(`${auditCase.key}/${viewport.key}/down`, downAudit);
      if (viewport.suffix === "1920") {
        const screenshot = path.join("tmp", "ui-quality", "worldmap-route-interactions", `${auditCase.key}-route-down-v1-${viewport.suffix}.png`);
        await page.screenshot({ path: screenshot, fullPage: true });
      }
      results.push(resultSummary(auditCase.key, viewport.key, "open-down", downAudit));

      await page.mouse.up();
      await page.mouse.move(4, 4);
    }

    for (const auditCase of lockedCases) {
      const seeded = await seedWorldMapState(page, baseUrl, auditCase);
      const targetNode = stageNodes[auditCase.targetIndex];
      const canvas = page.locator("canvas");
      const box = await canvas.boundingBox();
      if (!box || !targetNode) throw new Error(`${auditCase.key}/${viewport.key}: missing canvas or target node`);

      await page.mouse.move(
        box.x + (targetNode.x / 1920) * box.width,
        box.y + (targetNode.y / 1080) * box.height
      );
      await page.waitForSelector("#game-readability-tooltip[data-visible='true']", { timeout: 5000 });
      const hoverAudit = await readWorldMapRouteInteractionAudit(page, auditCase, seeded);
      assertRouteInteraction(`${auditCase.key}/${viewport.key}/hover`, hoverAudit);
      results.push(resultSummary(auditCase.key, viewport.key, "locked-hover", hoverAudit));

      await page.mouse.click(
        box.x + (targetNode.x / 1920) * box.width,
        box.y + (targetNode.y / 1080) * box.height
      );
      await page.waitForTimeout(180);
      const clickAudit = await readWorldMapRouteInteractionAudit(page, auditCase, seeded);
      assertRouteInteraction(`${auditCase.key}/${viewport.key}/click`, clickAudit);
      if (viewport.suffix === "1920") {
        const screenshot = path.join("tmp", "ui-quality", "worldmap-route-interactions", `${auditCase.key}-route-locked-click-v1-${viewport.suffix}.png`);
        await page.screenshot({ path: screenshot, fullPage: true });
      }
      results.push(resultSummary(auditCase.key, viewport.key, "locked-click", clickAudit));

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
  throw new Error("No free WorldMap route-interaction audit port found");
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

async function seedWorldMapState(page, seedBaseUrl, auditCase) {
  await page.goto(new URL("/?data=release&entry=world_map&resetSave=1", seedBaseUrl).href, { waitUntil: "networkidle" });
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
      log: [...new Set([...(context.save.currentRun.log ?? []), "audit:worldmap_route_interaction"])]
    };
    localStorage.setItem("paper_theater_card_crawler_save_v1", JSON.stringify(context.save));
    return { ok: true, completedStageIds, currentStageId, targetStageId };
  }, { ...auditCase.seed, targetIndex: auditCase.targetIndex });
  if (!seeded.ok) {
    throw new Error(`WorldMap route-interaction seed failed: ${JSON.stringify(seeded)}`);
  }

  await page.goto(new URL("/?data=release&entry=world_map", seedBaseUrl).href, { waitUntil: "networkidle" });
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

async function readWorldMapRouteInteractionAudit(page, auditCase, seeded) {
  return page.evaluate(({ auditCase, seeded, stageNodes }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
      ?? game?.scene?.getScene?.("WorldMapScene");
    const context = scene?.registry?.get?.("bootContext");
    const stages = context?.dataBundle?.stages ?? [];
    const currentStageId = context?.run?.stageId;
    const currentIndex = stages.findIndex((stage) => stage.id === currentStageId);
    const completedStageIds = new Set(context?.save?.profile?.completedStages ?? []);
    const unlockedStageIds = new Set([...(context?.save?.profile?.unlockedStages ?? []), currentStageId]);
    const visible = (scene?.children?.list ?? []).filter((child) => child?.visible !== false && child.alpha !== 0);
    const imageByKey = (key) => visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === key
      && Number(child.alpha ?? 1) > 0.05
    ));

    const routeBaseThreadImages = imageByKey("ui_world_map_route_progress_thread_concept");
    const routeCurrentThreadImages = imageByKey("ui_world_map_route_progress_current_thread_concept");
    const routeLockedThreadImages = imageByKey("ui_world_map_route_locked_thread_concept");
    const routeBaseBeadImages = imageByKey("ui_world_map_route_progress_bead_concept");
    const routeCurrentBeadImages = imageByKey("ui_world_map_route_progress_current_bead_concept");
    const routeLockedBeadImages = imageByKey("ui_world_map_route_locked_bead_concept");
    const routeHoverImages = imageByKey("ui_hover_route_node_concept");
    const underlayImages = imageByKey("world_map_raster_underlay_concept");

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

    return {
      activeScene: game?.scene?.getScenes?.(true)?.[0]?.scene?.key ?? "none",
      currentStageId,
      expectedCurrentStageId: seeded.currentStageId,
      targetStageId: stages[auditCase.targetIndex]?.id,
      expectedTargetStageId: seeded.targetStageId,
      underlayVisible: underlayImages.length === 1,
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
      lockedRouteBeadStyleAtExpectedSegments
    };
  }, { auditCase, seeded, stageNodes });
}

function assertRouteInteraction(label, audit) {
  if (audit.activeScene !== "WorldMapScene") throw new Error(`${label}: expected WorldMapScene, got ${audit.activeScene}`);
  if (audit.currentStageId !== audit.expectedCurrentStageId) {
    throw new Error(`${label}: stage changed unexpectedly ${audit.currentStageId} !== ${audit.expectedCurrentStageId}`);
  }
  if (audit.targetStageId !== audit.expectedTargetStageId) {
    throw new Error(`${label}: target mismatch ${audit.targetStageId} !== ${audit.expectedTargetStageId}`);
  }
  if (!audit.underlayVisible) throw new Error(`${label}: missing world map underlay`);
  if (audit.visibleRouteHoverImages !== 0) {
    throw new Error(`${label}: old route hover image leaked ${audit.visibleRouteHoverImages}`);
  }
  const countFields = [
    ["route base threads", audit.visibleRouteBaseThreads, audit.expectedRouteBaseThreads],
    ["route current threads", audit.visibleRouteCurrentThreads, audit.expectedRouteCurrentThreads],
    ["route base beads", audit.visibleRouteBaseBeads, audit.expectedRouteBaseBeads],
    ["route current beads", audit.visibleRouteCurrentBeads, audit.expectedRouteCurrentBeads],
    ["locked route threads", audit.visibleRouteLockedThreads, audit.expectedRouteLockedThreads],
    ["locked route beads", audit.visibleRouteLockedBeads, audit.expectedRouteLockedBeads]
  ];
  for (const [name, actual, expected] of countFields) {
    if (actual !== expected) throw new Error(`${label}: ${name} count ${actual} !== ${expected}`);
  }
  const placementFields = [
    ["routeThreadsAtExpectedSegments", audit.routeThreadsAtExpectedSegments],
    ["routeThreadStyleAtExpectedSegments", audit.routeThreadStyleAtExpectedSegments],
    ["routeBeadsAtExpectedSegments", audit.routeBeadsAtExpectedSegments],
    ["routeBeadStyleAtExpectedSegments", audit.routeBeadStyleAtExpectedSegments],
    ["lockedRouteThreadsAtExpectedSegments", audit.lockedRouteThreadsAtExpectedSegments],
    ["lockedRouteThreadStyleAtExpectedSegments", audit.lockedRouteThreadStyleAtExpectedSegments],
    ["lockedRouteBeadsAtExpectedSegments", audit.lockedRouteBeadsAtExpectedSegments],
    ["lockedRouteBeadStyleAtExpectedSegments", audit.lockedRouteBeadStyleAtExpectedSegments]
  ];
  for (const [name, ok] of placementFields) {
    if (!ok) throw new Error(`${label}: ${name} failed ${JSON.stringify(audit)}`);
  }
}

function resultSummary(label, viewport, mode, audit) {
  return {
    label,
    viewport,
    mode,
    currentStageId: audit.currentStageId,
    targetStageId: audit.targetStageId,
    routeBaseThreads: `${audit.visibleRouteBaseThreads}/${audit.expectedRouteBaseThreads}`,
    routeCurrentThreads: `${audit.visibleRouteCurrentThreads}/${audit.expectedRouteCurrentThreads}`,
    routeBaseBeads: `${audit.visibleRouteBaseBeads}/${audit.expectedRouteBaseBeads}`,
    routeCurrentBeads: `${audit.visibleRouteCurrentBeads}/${audit.expectedRouteCurrentBeads}`,
    lockedRouteThreads: `${audit.visibleRouteLockedThreads}/${audit.expectedRouteLockedThreads}`,
    lockedRouteBeads: `${audit.visibleRouteLockedBeads}/${audit.expectedRouteLockedBeads}`
  };
}
