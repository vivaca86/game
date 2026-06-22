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

const viewports = [
  { key: "desktop-1920", suffix: "1920", width: 1920, height: 1080 },
  { key: "desktop-1280", suffix: "desktop-1280", width: 1280, height: 720 }
];

const screenshotDir = "tmp/ui-quality/pc-combat-affordance";

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
    await loadCombat(page);

    const idleAudit = await readCombatAffordanceAudit(page);
    assertIdle(`${viewport.key}/idle`, idleAudit);
    const idleScreenshot = path.join(screenshotDir, `combat-card-idle-v1-${viewport.suffix}.png`);
    await page.locator("canvas").screenshot({ path: idleScreenshot });
    results.push(summary("idle", viewport.key, idleAudit, idleScreenshot));

    await moveScenePoint(page, 540, 836);
    await page.waitForTimeout(140);
    const hoverAudit = await readCombatAffordanceAudit(page);
    assertHover(`${viewport.key}/hover`, hoverAudit);
    const hoverScreenshot = path.join(screenshotDir, `combat-card-hover-v1-${viewport.suffix}.png`);
    await page.locator("canvas").screenshot({ path: hoverScreenshot });
    results.push(summary("hover", viewport.key, hoverAudit, hoverScreenshot));

    await page.mouse.down();
    await page.waitForTimeout(120);
    const downAudit = await readCombatAffordanceAudit(page);
    assertDown(`${viewport.key}/down`, downAudit);
    const downScreenshot = path.join(screenshotDir, `combat-card-down-v1-${viewport.suffix}.png`);
    await page.locator("canvas").screenshot({ path: downScreenshot });
    await moveScenePoint(page, 24, 24);
    await page.mouse.up();
    results.push(summary("down", viewport.key, downAudit, downScreenshot));

    await loadCombat(page);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(120);
    const focusAudit = await readCombatAffordanceAudit(page);
    assertFocus(`${viewport.key}/keyboard-focus`, focusAudit);
    const focusScreenshot = path.join(screenshotDir, `combat-card-keyboard-focus-v1-${viewport.suffix}.png`);
    await page.locator("canvas").screenshot({ path: focusScreenshot });
    results.push(summary("keyboard-focus", viewport.key, focusAudit, focusScreenshot));

    await clickScenePoint(page, 540, 836);
    await page.waitForFunction(() => {
      const scene = window.__paperGame?.scene?.getScene?.("CombatScene");
      const context = scene?.registry?.get?.("bootContext");
      return context?.run?.combat?.enemyHp === 17 && context?.run?.player?.energy === 2 && context?.run?.hand?.length === 4;
    }, null, { timeout: 5000 });
    const clickAudit = await readCombatAffordanceAudit(page);
    assertClick(`${viewport.key}/click`, clickAudit);
    const clickScreenshot = path.join(screenshotDir, `combat-card-after-click-v1-${viewport.suffix}.png`);
    await page.locator("canvas").screenshot({ path: clickScreenshot });
    results.push(summary("click", viewport.key, clickAudit, clickScreenshot));

    await loadCombat(page);
    await forcePlayerEnergy(page, 0);
    const disabledIdleAudit = await readCombatAffordanceAudit(page);
    assertDisabledIdle(`${viewport.key}/disabled-idle`, disabledIdleAudit);
    await moveScenePoint(page, 540, 836);
    await page.waitForTimeout(140);
    const disabledHoverAudit = await readCombatAffordanceAudit(page);
    assertDisabledHover(`${viewport.key}/disabled-hover`, disabledHoverAudit);
    const disabledScreenshot = path.join(screenshotDir, `combat-card-disabled-v1-${viewport.suffix}.png`);
    await page.locator("canvas").screenshot({ path: disabledScreenshot });
    results.push(summary("disabled", viewport.key, disabledHoverAudit, disabledScreenshot));
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
  for (const port of [4290, 4291, 4292, 4293, 4294]) {
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
  throw new Error("No free PC Combat affordance audit port found");
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

async function loadCombat(page) {
  await page.goto(new URL("/?debug=1&entry=combat&resetSave=1", baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, "CombatScene");
  await hideDebugOverlay(page);
}

async function waitForScene(page, sceneName) {
  await page.waitForSelector("canvas", { timeout: 20000 });
  await page.waitForFunction((expectedScene) => {
    return Boolean(window.__paperGame?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneName, { timeout: 20000 });
}

async function hideDebugOverlay(page) {
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });
}

async function forcePlayerEnergy(page, energy) {
  const result = await page.evaluate((nextEnergy) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScene?.("CombatScene");
    const context = scene?.registry?.get?.("bootContext");
    if (!scene || !context?.run?.combat) {
      return { ok: false, reason: "missing combat scene context" };
    }

    context.run.player.energy = nextEnergy;
    scene.scene.restart(context);
    return { ok: true };
  }, energy);
  if (!result.ok) {
    throw new Error(`Could not force combat energy: ${JSON.stringify(result)}`);
  }
  await waitForScene(page, "CombatScene");
  await hideDebugOverlay(page);
  await page.waitForFunction((expectedEnergy) => {
    const scene = window.__paperGame?.scene?.getScene?.("CombatScene");
    const context = scene?.registry?.get?.("bootContext");
    const visible = (scene?.children?.list ?? []).filter((child) => child?.visible !== false && Number(child?.alpha ?? 1) !== 0);
    const imageKeys = visible
      .filter((child) => child?.type === "Image")
      .map((child) => String(child.texture?.key ?? ""));
    const affordanceKeys = imageKeys.filter((key) => key.startsWith("combat_card_affordance_v3_"));
    const blockedAffordances = affordanceKeys.filter((key) => key.includes("_blocked_")).length;

    return context?.run?.player?.energy === expectedEnergy && blockedAffordances >= 4;
  }, energy, { timeout: 5000 });
}

async function readCombatAffordanceAudit(page) {
  return page.evaluate(() => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScene?.("CombatScene");
    const context = scene?.registry?.get?.("bootContext");
    const children = scene?.children?.list ?? [];
    const underlayIndex = children.findIndex((child) => child?.type === "Image" && child.texture?.key === "combat_raster_underlay_concept");
    const underlayDepth = children[underlayIndex]?.depth ?? 0;
    const visible = children.filter((child) => child?.visible !== false && Number(child?.alpha ?? 1) !== 0);
    const images = visible.filter((child) => child?.type === "Image");
    const imageKeys = images.map((child) => String(child.texture?.key ?? ""));
    const allAffordanceKeys = imageKeys.filter((key) => key.startsWith("combat_card_affordance_v3_"));
    const buttonLabelImages = images.filter((child) => child.getData?.("buttonLabelAffordance"));
    const cardActionLabels = images
      .filter((child) => child.getData?.("combatCardAffordance"))
      .map((child) => String(child.getData?.("combatCardActionLabel") ?? ""))
      .filter(Boolean);
    const rectsAboveUnderlay = visible
      .filter((child) => child?.type === "Rectangle")
      .filter((child) => child.depth > underlayDepth || children.indexOf(child) > underlayIndex)
      .filter((child) => {
        const fillAlpha = Number(child?.fillAlpha ?? child?.alpha ?? 1);
        const strokeAlpha = Number(child?.strokeAlpha ?? child?.lineAlpha ?? 0);
        const strokeWidth = Number(child?.lineWidth ?? child?.strokeWidth ?? 0);
        return (child?.isFilled && fillAlpha > 0.01) || (child?.isStroked && strokeWidth > 0 && strokeAlpha > 0.01);
      });

    return {
      hasScene: Boolean(scene),
      hasUnderlay: underlayIndex >= 0,
      aria: document.querySelector("canvas")?.getAttribute("aria-label") ?? "",
      focusId: scene?.registry?.get?.("combatRasterFocusId") ?? null,
      handCount: context?.run?.hand?.length ?? -1,
      enemyHp: context?.run?.combat?.enemyHp ?? null,
      playerEnergy: context?.run?.player?.energy ?? null,
      allAffordances: allAffordanceKeys.length,
      readyAffordances: allAffordanceKeys.filter((key) => key.includes("_ready_")).length,
      blockedAffordances: allAffordanceKeys.filter((key) => key.includes("_blocked_")).length,
      hoverFrames: images.filter((child) => child.texture?.key === "combat_card_hover_frame_v1" && Number(child.alpha ?? 1) > 0.05).length,
      downFrames: images.filter((child) => child.texture?.key === "combat_card_down_frame_v1" && Number(child.alpha ?? 1) > 0.05).length,
      disabledFrames: images.filter((child) => child.texture?.key === "combat_card_disabled_frame_v1" && Number(child.alpha ?? 1) > 0.05).length,
      goldSeals: images.filter((child) => child.texture?.key === "ui_hover_gold_seal_concept" && Number(child.alpha ?? 1) > 0.05).length,
      buttonLabelAffordances: buttonLabelImages.length,
      buttonLabels: buttonLabelImages.map((child) => String(child.getData?.("buttonLabel") ?? "")),
      cardActionLabels,
      readyCardActionLabels: cardActionLabels.filter((label) => label === "사용").length,
      blockedCardActionLabels: cardActionLabels.filter((label) => label === "기운 부족").length,
      visibleTextCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay: rectsAboveUnderlay.length
    };
  });
}

function assertCommon(label, audit) {
  if (!audit.hasScene || !audit.hasUnderlay) throw new Error(`${label}: missing CombatScene underlay ${JSON.stringify(audit)}`);
  if (audit.buttonLabelAffordances < 1 || !audit.buttonLabels.includes("턴 종료")) {
    throw new Error(`${label}: combat end-turn button label missing ${JSON.stringify(audit)}`);
  }
  if (!audit.aria.includes("손패")) throw new Error(`${label}: combat aria summary missing hand count ${JSON.stringify(audit)}`);
  if (audit.visibleTextCount !== 0) throw new Error(`${label}: visible Phaser text leaked over raster underlay ${JSON.stringify(audit)}`);
  if (audit.visibleRectsAboveUnderlay !== 0) throw new Error(`${label}: visible rectangle overlay leaked ${JSON.stringify(audit)}`);
}

function assertIdle(label, audit) {
  assertCommon(label, audit);
  if (audit.allAffordances !== 5 || audit.readyAffordances !== 5 || audit.blockedAffordances !== 0) {
    throw new Error(`${label}: expected five ready combat card affordances ${JSON.stringify(audit)}`);
  }
  if (audit.readyCardActionLabels !== 5) {
    throw new Error(`${label}: expected five visible card action labels ${JSON.stringify(audit)}`);
  }
  if (audit.hoverFrames !== 0 || audit.downFrames !== 0 || audit.disabledFrames !== 0) {
    throw new Error(`${label}: idle state should not show transient card frames ${JSON.stringify(audit)}`);
  }
}

function assertHover(label, audit) {
  assertCommon(label, audit);
  if (audit.hoverFrames < 1 || audit.goldSeals < 1) {
    throw new Error(`${label}: hover did not expose card-wide frame and seal ${JSON.stringify(audit)}`);
  }
}

function assertDown(label, audit) {
  assertCommon(label, audit);
  if (audit.downFrames < 1 || audit.goldSeals < 1) {
    throw new Error(`${label}: down state did not expose card-wide frame and seal ${JSON.stringify(audit)}`);
  }
}

function assertFocus(label, audit) {
  assertCommon(label, audit);
  if (audit.focusId !== "card_1" || audit.hoverFrames < 1) {
    throw new Error(`${label}: keyboard focus did not land on first combat card ${JSON.stringify(audit)}`);
  }
}

function assertClick(label, audit) {
  assertCommon(label, audit);
  if (audit.enemyHp !== 17 || audit.playerEnergy !== 2 || audit.handCount !== 4) {
    throw new Error(`${label}: card click did not change combat state ${JSON.stringify(audit)}`);
  }
}

function assertDisabledIdle(label, audit) {
  assertCommon(label, audit);
  if (audit.blockedAffordances < 4 || audit.readyAffordances > 1) {
    throw new Error(`${label}: expected low-energy disabled card affordances ${JSON.stringify(audit)}`);
  }
  if (audit.blockedCardActionLabels < 4) {
    throw new Error(`${label}: expected low-energy disabled card action labels ${JSON.stringify(audit)}`);
  }
}

function assertDisabledHover(label, audit) {
  assertDisabledIdle(label, audit);
  if (audit.disabledFrames < 1) {
    throw new Error(`${label}: disabled hover did not expose disabled frame ${JSON.stringify(audit)}`);
  }
}

async function moveScenePoint(page, sceneX, sceneY) {
  const canvasBox = await page.locator("canvas").boundingBox();
  if (!canvasBox) throw new Error("Missing Phaser canvas for mouse move");
  await page.mouse.move(
    canvasBox.x + (sceneX / 1920) * canvasBox.width,
    canvasBox.y + (sceneY / 1080) * canvasBox.height
  );
}

async function clickScenePoint(page, sceneX, sceneY) {
  const canvasBox = await page.locator("canvas").boundingBox();
  if (!canvasBox) throw new Error("Missing Phaser canvas for click");
  await page.mouse.click(
    canvasBox.x + (sceneX / 1920) * canvasBox.width,
    canvasBox.y + (sceneY / 1080) * canvasBox.height
  );
  await page.waitForTimeout(160);
}

function summary(state, viewport, audit, screenshot) {
  return {
    state,
    viewport,
    affordances: `${audit.readyAffordances} ready / ${audit.blockedAffordances} blocked`,
    hoverFrames: audit.hoverFrames,
    downFrames: audit.downFrames,
    disabledFrames: audit.disabledFrames,
    buttonLabelAffordances: audit.buttonLabelAffordances,
    cardActionLabels: `${audit.readyCardActionLabels} ready / ${audit.blockedCardActionLabels} blocked`,
    focusId: audit.focusId,
    combat: `hp=${audit.enemyHp}, energy=${audit.playerEnergy}, hand=${audit.handCount}`,
    leak: `${audit.visibleTextCount} text, ${audit.visibleRectsAboveUnderlay} rects`,
    screenshot: path.resolve(screenshot)
  };
}
