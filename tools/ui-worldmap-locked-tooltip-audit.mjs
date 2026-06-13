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

      const screenshot = path.join("tmp", "ui-quality", "worldmap-locked-tooltips", `${auditCase.key}-locked-tooltip-v1-${viewport.suffix}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({
        label: auditCase.key,
        viewport: viewport.key,
        stageId: hoverAudit.targetStageId,
        title: hoverAudit.tooltip.title,
        size: `${Math.round(hoverAudit.tooltip.width)}x${Math.round(hoverAudit.tooltip.height)}`,
        currentStageId: hoverAudit.currentStageId,
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
  return page.evaluate(({ auditCase }) => {
    const root = document.getElementById("game-readability-tooltip");
    const canvas = document.querySelector("#game-root canvas");
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
      ?? game?.scene?.getScene?.("WorldMapScene");
    const context = scene?.registry?.get?.("bootContext");
    const stages = context?.dataBundle?.stages ?? [];
    const currentStageId = context?.run?.stageId;
    const unlockedStageIds = new Set([...(context?.save?.profile?.unlockedStages ?? []), currentStageId]);
    const firstLockedIndex = stages.findIndex((stage) => !unlockedStageIds.has(stage.id));
    const visible = (scene?.children?.list ?? []).filter((child) => child?.visible !== false && child.alpha !== 0);
    const defaultDisabledStampCount = visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === "ui_disabled_lock_stamp_concept"
      && Number(child.alpha ?? 1) > 0.05
    )).length;

    const tooltip = readTooltip(root, canvas);
    return {
      activeScene: game?.scene?.getScenes?.(true)?.[0]?.scene?.key ?? "none",
      currentStageId,
      targetStageId: stages[auditCase.targetIndex]?.id,
      targetStageName: stages[auditCase.targetIndex]?.displayNameKo,
      firstLockedIndex,
      targetUnlocked: unlockedStageIds.has(stages[auditCase.targetIndex]?.id),
      defaultDisabledStampCount,
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
  }, { auditCase });
}

function assertWorldMapLockedTooltip(label, audit, auditCase, viewport, seeded) {
  const tooltip = audit.tooltip;
  if (audit.activeScene !== "WorldMapScene") throw new Error(`${label}: expected WorldMapScene, got ${audit.activeScene}`);
  if (audit.currentStageId !== seeded.currentStageId) {
    throw new Error(`${label}: expected current stage ${seeded.currentStageId}, got ${audit.currentStageId}`);
  }
  if (audit.firstLockedIndex !== auditCase.expectedFirstLockedIndex) {
    throw new Error(`${label}: expected first locked index ${auditCase.expectedFirstLockedIndex}, got ${audit.firstLockedIndex}`);
  }
  if (audit.targetUnlocked) throw new Error(`${label}: target stage unexpectedly unlocked`);
  if (audit.defaultDisabledStampCount !== 0) {
    throw new Error(`${label}: unexpected default disabled stamp images on WorldMap (${audit.defaultDisabledStampCount})`);
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
