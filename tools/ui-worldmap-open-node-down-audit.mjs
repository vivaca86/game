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
  { key: "desktop-1920", suffix: "1920", width: 1920, height: 1080, minWidth: 260, minHeight: 60, maxWidthRatio: 0.42, maxHeightRatio: 0.34, allowLetterbox: false },
  { key: "desktop-1280", suffix: "desktop-1280", width: 1280, height: 720, minWidth: 240, minHeight: 58, maxWidthRatio: 0.48, maxHeightRatio: 0.34, allowLetterbox: false },
  { key: "mobile-390x844", suffix: "mobile-390x844", width: 390, height: 844, minWidth: 210, minHeight: 48, maxWidthRatio: 0.82, maxHeightRatio: 0.5, allowLetterbox: true }
];

await mkdir("tmp/ui-quality/worldmap-open-node-down", { recursive: true });

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

      await page.mouse.move(targetX, targetY);
      await page.waitForSelector("#game-readability-tooltip[data-visible='true']", { timeout: 5000 });
      await page.mouse.down();
      await page.waitForTimeout(80);

      const downAudit = await readWorldMapOpenNodeDownAudit(page, auditCase);
      assertWorldMapOpenNodeDown(`${auditCase.key}/${viewport.key}`, downAudit, auditCase, viewport, seeded);

      const screenshot = path.join("tmp", "ui-quality", "worldmap-open-node-down", `${auditCase.key}-open-node-down-v1-${viewport.suffix}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });

      await page.mouse.up();
      await page.waitForFunction((expectedStageId) => {
        const game = window.__paperGame;
        const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
          ?? game?.scene?.getScene?.("WorldMapScene");
        const context = scene?.registry?.get?.("bootContext");
        return context?.run?.stageId === expectedStageId;
      }, seeded.targetStageId, { timeout: 10000 });

      results.push({
        label: auditCase.key,
        viewport: viewport.key,
        stageId: downAudit.targetStageId,
        title: downAudit.tooltip.title,
        downDisplay: `${Math.round(downAudit.downHalo.width)}x${Math.round(downAudit.downHalo.height)}`,
        downAlpha: Number(downAudit.downHalo.alpha.toFixed(2)),
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
  throw new Error("No free WorldMap open-node down audit port found");
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
      log: [...new Set([...(context.save.currentRun.log ?? []), "audit:worldmap_open_node_down"])]
    };
    localStorage.setItem("paper_theater_card_crawler_save_v1", JSON.stringify(context.save));
    return { ok: true, completedStageIds, currentStageId, targetStageId };
  }, { ...auditCase.seed, targetIndex: auditCase.targetIndex });
  if (!seeded.ok) {
    throw new Error(`WorldMap open-node down seed failed: ${JSON.stringify(seeded)}`);
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

async function readWorldMapOpenNodeDownAudit(page, auditCase) {
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
    const targetNode = stageNodes[auditCase.targetIndex];
    const unlockedStageIds = new Set([...(context?.save?.profile?.unlockedStages ?? []), currentStageId]);
    const visible = (scene?.children?.list ?? []).filter((child) => child?.visible !== false && child.alpha !== 0);
    const haloImages = visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === "ui_current_stage_halo_concept"
      && Number(child.alpha ?? 1) > 0.05
    ));
    const downHalo = haloImages.find((image) => (
      targetNode
      && Math.abs(image.x - (targetNode.x + 2)) <= 1
      && Math.abs(image.y - (targetNode.y + 4)) <= 1
    ));
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

    return {
      activeScene: game?.scene?.getScenes?.(true)?.[0]?.scene?.key ?? "none",
      currentStageId,
      targetStageId: targetStage?.id,
      targetStageName: targetStage?.displayNameKo,
      targetUnlocked: unlockedStageIds.has(targetStage?.id),
      visibleHaloImages: haloImages.length,
      currentHaloAtCurrentStage: Boolean(currentNode) && haloImages.some((image) => (
        Math.abs(image.x - (currentNode.x + 2)) <= 1
        && Math.abs(image.y - (currentNode.y + 4)) <= 1
      )),
      downHalo: downHalo
        ? { x: downHalo.x, y: downHalo.y, width: downHalo.displayWidth, height: downHalo.displayHeight, alpha: Number(downHalo.alpha ?? 1) }
        : { x: 0, y: 0, width: 0, height: 0, alpha: 0 },
      expectedDown: targetNode
        ? { width: targetNode.width * 1.92, height: targetNode.height * 2.04 }
        : { width: 0, height: 0 },
      visibleTextCount,
      visibleRectsAboveUnderlay,
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

function assertWorldMapOpenNodeDown(label, audit, auditCase, viewport, seeded) {
  const tooltip = audit.tooltip;
  if (audit.activeScene !== "WorldMapScene") throw new Error(`${label}: expected WorldMapScene, got ${audit.activeScene}`);
  if (audit.currentStageId !== seeded.currentStageId) {
    throw new Error(`${label}: expected current stage ${seeded.currentStageId}, got ${audit.currentStageId}`);
  }
  if (audit.targetStageId !== seeded.targetStageId) {
    throw new Error(`${label}: expected target stage ${seeded.targetStageId}, got ${audit.targetStageId}`);
  }
  if (!audit.targetUnlocked) throw new Error(`${label}: target stage is not unlocked`);
  if (audit.visibleHaloImages !== 2 || !audit.currentHaloAtCurrentStage) {
    throw new Error(`${label}: expected current halo plus down halo, got ${JSON.stringify({
      visibleHaloImages: audit.visibleHaloImages,
      currentHaloAtCurrentStage: audit.currentHaloAtCurrentStage
    })}`);
  }
  if (Math.abs(audit.downHalo.width - audit.expectedDown.width) > 1 || Math.abs(audit.downHalo.height - audit.expectedDown.height) > 1) {
    throw new Error(`${label}: down halo has wrong size ${JSON.stringify({
      actual: audit.downHalo,
      expected: audit.expectedDown
    })}`);
  }
  if (audit.downHalo.alpha < 0.94) {
    throw new Error(`${label}: down halo alpha too low ${audit.downHalo.alpha}`);
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
