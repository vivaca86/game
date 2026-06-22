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

const selectedCase = {
  key: "keyboard-selected-unlocked",
  seed: { completedCount: 1, currentStageIndex: 1 },
  keyPress: "ArrowLeft",
  targetIndex: 0
};

const lockedCase = {
  key: "keyboard-disabled-locked",
  seed: { completedCount: 1, currentStageIndex: 1 },
  keyPress: "ArrowRight",
  targetIndex: 2
};

await mkdir("tmp/ui-quality/pc-worldmap-keyboard", { recursive: true });

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

    const selectedSeed = await seedWorldMapState(page, selectedCase);
    await page.keyboard.press(selectedCase.keyPress);
    await page.waitForFunction((expectedStageId) => {
      const game = window.__paperGame;
      const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
        ?? game?.scene?.getScene?.("WorldMapScene");
      const context = scene?.registry?.get?.("bootContext");
      return context?.run?.stageId === expectedStageId;
    }, selectedSeed.targetStageId, { timeout: 10000 });
    await page.waitForSelector("#game-readability-tooltip[data-visible='true']", { timeout: 5000 });
    const selectedAudit = await readWorldMapState(page, selectedCase);
    assertSelectedState(`${selectedCase.key}/${viewport.key}`, selectedAudit, selectedSeed);
    const selectedScreenshot = path.join("tmp", "ui-quality", "pc-worldmap-keyboard", `${selectedCase.key}-v1-${viewport.suffix}.png`);
    await page.screenshot({ path: selectedScreenshot, fullPage: true });
    results.push(resultSummary(selectedCase.key, viewport.key, selectedAudit, selectedScreenshot));

    const lockedSeed = await seedWorldMapState(page, lockedCase);
    await page.keyboard.press(lockedCase.keyPress);
    await page.waitForSelector("#game-readability-tooltip[data-visible='true']", { timeout: 5000 });
    await page.waitForTimeout(80);
    const lockedAudit = await readWorldMapState(page, lockedCase);
    assertLockedState(`${lockedCase.key}/${viewport.key}`, lockedAudit, lockedSeed);
    const lockedScreenshot = path.join("tmp", "ui-quality", "pc-worldmap-keyboard", `${lockedCase.key}-v1-${viewport.suffix}.png`);
    await page.screenshot({ path: lockedScreenshot, fullPage: true });
    results.push(resultSummary(lockedCase.key, viewport.key, lockedAudit, lockedScreenshot));

    const confirmSeed = await seedWorldMapState(page, {
      key: "keyboard-confirm-play",
      seed: { completedCount: 1, currentStageIndex: 1 },
      targetIndex: 1
    });
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => {
      const game = window.__paperGame;
      const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
        ?? game?.scene?.getScene?.("WorldMapScene");
      const visible = (scene?.children?.list ?? []).filter((child) => child?.visible !== false && child.alpha !== 0);
      const playDownImages = visible.filter((child) => (
        child?.type === "Image"
        && child.texture?.key === "ui_down_world_map_play_button_concept"
        && Number(child.alpha ?? 1) > 0.05
      ));
      return game?.registry?.get?.("worldMapRasterFocusId") === "playButton" && playDownImages.length === 1;
    }, null, { timeout: 1000 });
    const confirmDownAudit = await readWorldMapState(page, { key: "keyboard-confirm-play", targetIndex: 1 });
    assertConfirmDown(`${confirmDownAudit.key}/${viewport.key}`, confirmDownAudit, confirmSeed);
    const confirmScreenshot = path.join("tmp", "ui-quality", "pc-worldmap-keyboard", `keyboard-confirm-play-down-v1-${viewport.suffix}.png`);
    await page.screenshot({ path: confirmScreenshot, fullPage: true });
    await page.waitForFunction(() => {
      const game = window.__paperGame;
      return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === "DungeonScene"));
    }, null, { timeout: 5000 });
    results.push(resultSummary("keyboard-confirm-play", viewport.key, confirmDownAudit, confirmScreenshot));
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
  for (const port of [4270, 4271, 4272, 4273, 4274]) {
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
  throw new Error("No free PC WorldMap keyboard audit port found");
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

async function seedWorldMapState(page, auditCase) {
  await page.goto(new URL("/?data=release&entry=world_map&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, "WorldMapScene");
  const seeded = await page.evaluate(({ completedCount, currentStageIndex, targetIndex }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
      ?? game?.scene?.getScene?.("WorldMapScene");
    const context = scene?.registry?.get?.("bootContext");
    if (!context?.save?.currentRun) return { ok: false, reason: "missing world map context" };

    const completedStageIds = context.dataBundle.stages.slice(0, completedCount).map((stage) => stage.id);
    const currentStageId = context.dataBundle.stages[currentStageIndex]?.id;
    const targetStageId = context.dataBundle.stages[targetIndex]?.id;
    if (!currentStageId || !targetStageId || completedStageIds.length !== completedCount) {
      return { ok: false, reason: "missing release stage ids" };
    }

    context.save.profile.completedStages = completedStageIds;
    context.save.profile.unlockedStages = [...new Set([...completedStageIds, currentStageId])];
    context.save.currentRun = {
      ...context.save.currentRun,
      phase: "world_map",
      stageId: currentStageId,
      roomIndex: 0,
      completedStages: completedStageIds,
      log: [...new Set([...(context.save.currentRun.log ?? []), "audit:pc_worldmap_keyboard"])]
    };
    localStorage.setItem("paper_theater_card_crawler_save_v1", JSON.stringify(context.save));
    return { ok: true, completedStageIds, currentStageId, targetStageId };
  }, { ...auditCase.seed, targetIndex: auditCase.targetIndex });
  if (!seeded.ok) throw new Error(`WorldMap PC keyboard seed failed: ${JSON.stringify(seeded)}`);

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

async function readWorldMapState(page, auditCase) {
  return page.evaluate(({ auditCase, stageNodes }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === "WorldMapScene")
      ?? game?.scene?.getScene?.("WorldMapScene");
    const context = scene?.registry?.get?.("bootContext");
    const visible = (scene?.children?.list ?? []).filter((child) => child?.visible !== false && child.alpha !== 0);
    const imageByKey = (key) => visible.filter((child) => (
      child?.type === "Image"
      && child.texture?.key === key
      && Number(child.alpha ?? 1) > 0.05
    ));
    const tooltip = document.getElementById("game-readability-tooltip");
    const currentMarkerImages = imageByKey("ui_current_stage_marker_concept");
    const currentBodyImages = [
      ...imageByKey("ui_current_stage_body_wash_concept"),
      ...imageByKey("ui_current_stage_late_body_wash_concept")
    ];
    const currentFrameImages = [
      ...imageByKey("ui_current_stage_frame_concept"),
      ...imageByKey("ui_current_stage_late_frame_concept")
    ];
    const currentStatusImages = imageByKey("ui_current_stage_status_badge_concept");
    const currentHaloImages = imageByKey("ui_current_stage_halo_concept");
    const playDownImages = imageByKey("ui_down_world_map_play_button_concept");
    const targetStage = context?.dataBundle?.stages?.[auditCase.targetIndex];
    const targetNode = stageNodes[auditCase.targetIndex];
    const focusHaloImages = targetNode
      ? currentHaloImages.filter((image) => (
        Math.abs(Number(image.x) - (targetNode.x + 2)) <= 1
        && Math.abs(Number(image.y) - (targetNode.y + 4)) <= 1
      ))
      : [];
    return {
      key: auditCase.key,
      activeScene: game?.scene?.getScenes?.(true)?.[0]?.scene?.key ?? "none",
      currentStageId: context?.run?.stageId,
      targetStageId: targetStage?.id,
      focusValue: game?.registry?.get?.("worldMapRasterFocusId"),
      visibleCurrentMarkerImages: currentMarkerImages.length,
      visibleCurrentBodyImages: currentBodyImages.length,
      visibleCurrentFrameImages: currentFrameImages.length,
      visibleCurrentStatusImages: currentStatusImages.length,
      visibleKeyboardFocusHaloImages: currentHaloImages.length,
      visibleTargetFocusHaloImages: focusHaloImages.length,
      visiblePlayDownImages: playDownImages.length,
      tooltip: {
        visible: tooltip?.dataset?.visible === "true",
        scene: tooltip?.dataset?.scene ?? "",
        tone: tooltip?.dataset?.tone ?? "",
        title: tooltip?.querySelector("strong")?.textContent?.replace(/\s+/g, " ").trim() ?? "",
        body: tooltip?.querySelector("span")?.textContent?.replace(/\s+/g, " ").trim() ?? ""
      }
    };
  }, { auditCase, stageNodes });
}

function assertSelectedState(label, audit, seeded) {
  if (audit.activeScene !== "WorldMapScene") throw new Error(`${label}: expected WorldMapScene, got ${audit.activeScene}`);
  if (audit.currentStageId !== seeded.targetStageId) {
    throw new Error(`${label}: expected selected current stage ${seeded.targetStageId}, got ${audit.currentStageId}`);
  }
  if (audit.focusValue !== `stage:${seeded.targetStageId}`) {
    throw new Error(`${label}: expected stage focus registry, got ${audit.focusValue}`);
  }
  if (audit.tooltip.tone !== "choice" || !audit.tooltip.visible) {
    throw new Error(`${label}: expected visible choice tooltip ${JSON.stringify(audit.tooltip)}`);
  }
  assertCurrentStack(label, audit);
}

function assertLockedState(label, audit, seeded) {
  if (audit.activeScene !== "WorldMapScene") throw new Error(`${label}: expected WorldMapScene, got ${audit.activeScene}`);
  if (audit.currentStageId !== seeded.currentStageId) {
    throw new Error(`${label}: locked keyboard navigation changed current stage ${seeded.currentStageId}->${audit.currentStageId}`);
  }
  if (audit.focusValue !== `locked:${seeded.targetStageId}`) {
    throw new Error(`${label}: expected locked focus registry, got ${audit.focusValue}`);
  }
  if (audit.tooltip.tone !== "danger" || !audit.tooltip.visible) {
    throw new Error(`${label}: expected visible danger tooltip ${JSON.stringify(audit.tooltip)}`);
  }
  if (audit.visibleKeyboardFocusHaloImages < 2) {
    throw new Error(`${label}: expected current halo plus keyboard locked-node halo, got ${audit.visibleKeyboardFocusHaloImages}`);
  }
  assertCurrentStack(label, audit);
}

function assertConfirmDown(label, audit, seeded) {
  if (audit.activeScene !== "WorldMapScene") throw new Error(`${label}: expected WorldMapScene during down-state capture, got ${audit.activeScene}`);
  if (audit.currentStageId !== seeded.currentStageId) {
    throw new Error(`${label}: confirm down changed stage too early ${seeded.currentStageId}->${audit.currentStageId}`);
  }
  if (audit.focusValue !== "playButton") throw new Error(`${label}: expected playButton focus, got ${audit.focusValue}`);
  if (audit.visiblePlayDownImages !== 1) throw new Error(`${label}: expected one play down image, got ${audit.visiblePlayDownImages}`);
  if (audit.tooltip.tone !== "confirm" || !audit.tooltip.visible) {
    throw new Error(`${label}: expected visible confirm tooltip ${JSON.stringify(audit.tooltip)}`);
  }
}

function assertCurrentStack(label, audit) {
  if (audit.visibleCurrentMarkerImages !== 1
    || audit.visibleCurrentBodyImages !== 1
    || audit.visibleCurrentFrameImages !== 1
    || audit.visibleCurrentStatusImages !== 1) {
    throw new Error(`${label}: expected exactly one current marker/body/frame/status stack ${JSON.stringify({
      marker: audit.visibleCurrentMarkerImages,
      body: audit.visibleCurrentBodyImages,
      frame: audit.visibleCurrentFrameImages,
      status: audit.visibleCurrentStatusImages
    })}`);
  }
}

function resultSummary(label, viewport, audit, screenshot) {
  return {
    label,
    viewport,
    scene: audit.activeScene,
    currentStageId: audit.currentStageId,
    focusValue: audit.focusValue,
    tooltipTone: audit.tooltip.tone,
    currentStack: `${audit.visibleCurrentMarkerImages}/${audit.visibleCurrentBodyImages}/${audit.visibleCurrentFrameImages}/${audit.visibleCurrentStatusImages}`,
    playDown: audit.visiblePlayDownImages,
    screenshot: path.resolve(screenshot)
  };
}
