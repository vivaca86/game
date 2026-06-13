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

const targets = [
  {
    key: "event-disabled-choice",
    sceneName: "EventScene",
    underlayKey: "event_raster_underlay_concept",
    pathname: "/?data=release&entry=event&resetSave=1&stage=stage_sunny_gate&playerHp=1",
    x: 1450,
    y: 848,
    expectedLockImages: 1,
    keyboardBlockedKey: null
  },
  {
    key: "combat-disabled-card",
    sceneName: "CombatScene",
    underlayKey: "combat_raster_underlay_concept",
    pathname: "/?entry=combat&resetSave=1&handCard=card_stage_patch&handCard=card_paper_bloom&handCard=card_curtain_call",
    x: 540,
    y: 836,
    expectedLockImages: 1,
    expectedFirstLock: { x: 552, y: 744, size: 88 },
    keyboardBlockedKey: "Digit1",
    setup: setLowEnergy
  },
  {
    key: "boss-disabled-card",
    sceneName: "BossScene",
    underlayKey: "boss_raster_underlay_concept",
    pathname: "/?entry=boss&resetSave=1&handCard=card_stage_patch&handCard=card_paper_bloom&handCard=card_curtain_call",
    x: 540,
    y: 872,
    expectedLockImages: 1,
    expectedFirstLock: { x: 508, y: 828, size: 124 },
    keyboardBlockedKey: "Digit1",
    setup: setLowEnergy
  }
];

const viewports = [
  { key: "desktop-1920", suffix: "1920", width: 1920, height: 1080, minWidth: 260, minHeight: 60, maxWidthRatio: 0.42, maxHeightRatio: 0.34, allowLetterbox: false },
  { key: "desktop-1280", suffix: "desktop-1280", width: 1280, height: 720, minWidth: 240, minHeight: 58, maxWidthRatio: 0.48, maxHeightRatio: 0.34, allowLetterbox: false },
  { key: "mobile-390x844", suffix: "mobile-390x844", width: 390, height: 844, minWidth: 210, minHeight: 48, maxWidthRatio: 0.82, maxHeightRatio: 0.5, allowLetterbox: true }
];

await mkdir("tmp/ui-quality/disabled-readability", { recursive: true });

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

    for (const target of targets) {
      await openTarget(page, target);
      const canvas = page.locator("canvas");
      const box = await canvas.boundingBox();
      if (!box) throw new Error(`${target.key}/${viewport.key}: missing canvas`);

      const initial = await readDisabledState(page, target);
      assertInitialState(`${target.key}/${viewport.key}`, initial, target);

      await page.mouse.move(box.x + (target.x / 1920) * box.width, box.y + (target.y / 1080) * box.height);
      await page.waitForSelector("#game-readability-tooltip[data-visible='true']", { timeout: 5000 });
      const tooltip = await readTooltip(page, target.focusRegistryKey);
      assertTooltip(`${target.key}/${viewport.key}`, tooltip, target, viewport);

      const screenshot = path.join("tmp", "ui-quality", "disabled-readability", `${target.key}-tooltip-v1-${viewport.suffix}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });

      await page.mouse.click(box.x + (target.x / 1920) * box.width, box.y + (target.y / 1080) * box.height);
      await page.waitForTimeout(180);
      const afterClick = await readDisabledState(page, target);
      assertBlocked(`${target.key}/${viewport.key}/click`, initial, afterClick);

      let afterKeyboard = null;
      if (target.keyboardBlockedKey) {
        await page.keyboard.press(target.keyboardBlockedKey);
        await page.waitForTimeout(180);
        afterKeyboard = await readDisabledState(page, target);
        assertBlocked(`${target.key}/${viewport.key}/keyboard`, afterClick, afterKeyboard);
      }

      results.push({
        label: target.key,
        viewport: viewport.key,
        lockImages: initial.lockImages.length,
        title: tooltip.title,
        size: `${Math.round(tooltip.width)}x${Math.round(tooltip.height)}`,
        phase: initial.phase,
        afterClickPhase: afterClick.phase,
        afterKeyboardPhase: afterKeyboard?.phase,
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
  for (const port of [4255, 4256, 4257, 4258, 4259]) {
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
  throw new Error("No free disabled readability audit port found");
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

async function openTarget(page, target) {
  await page.goto(new URL(target.pathname, baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, target.sceneName);
  if (target.setup) {
    await target.setup(page, target);
    await waitForScene(page, target.sceneName);
  }
  await hideDebugOverlay(page);
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

async function setLowEnergy(page, target) {
  await page.evaluate((sceneName) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScene?.(sceneName);
    const context = scene?.registry?.get?.("bootContext");
    if (!scene || !context?.run?.player) return;
    context.run.player.energy = 0;
    context.save.currentRun = {
      ...context.save.currentRun,
      playerEnergy: 0,
      hand: [...context.run.hand]
    };
    scene.scene.start(sceneName, context);
  }, target.sceneName);
}

async function readDisabledState(page, target) {
  const auditTarget = {
    sceneName: target.sceneName,
    underlayKey: target.underlayKey
  };
  return page.evaluate(({ target }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === target.sceneName)
      ?? game?.scene?.getScene?.(target.sceneName);
    const context = scene?.registry?.get?.("bootContext");
    const children = scene?.children?.list ?? [];
    const underlayIndex = children.findIndex((child) => child?.type === "Image"
      && child.texture?.key === target.underlayKey
      && child.visible !== false
      && child.alpha !== 0);
    const underlayDepth = children[underlayIndex]?.depth ?? 0;
    const visible = children.filter((child) => child?.visible !== false && child.alpha !== 0);
    const lockImages = visible
      .filter((child) => child?.type === "Image"
        && child.texture?.key === "ui_disabled_lock_stamp_concept"
        && Number(child.alpha ?? 1) > 0.05)
      .map((image) => ({
        x: Number(image.x),
        y: Number(image.y),
        displayWidth: Number(image.displayWidth),
        displayHeight: Number(image.displayHeight),
        alpha: Number(image.alpha ?? 1)
      }));
    const hoverImages = visible.filter((child) => child?.type === "Image" && [
      "ui_hover_choice_badge_concept",
      "ui_hover_gold_seal_concept",
      "ui_hover_boss_skull_stamp_concept"
    ].includes(child.texture?.key) && Number(child.alpha ?? 1) > 0.05);
    const rectsAbove = visible
      .filter((child) => child?.type === "Rectangle")
      .filter((child) => child.depth > underlayDepth || children.indexOf(child) > underlayIndex)
      .filter((child) => {
        const fillAlpha = Number(child?.fillAlpha ?? child?.alpha ?? 1);
        const strokeAlpha = Number(child?.strokeAlpha ?? child?.lineAlpha ?? 0);
        const strokeWidth = Number(child?.lineWidth ?? child?.strokeWidth ?? 0);
        return (child?.isFilled && fillAlpha > 0.02) || (child?.isStroked && strokeWidth > 0 && strokeAlpha > 0.02);
      });
    return {
      activeScenes: game?.scene?.getScenes?.(true)?.map((candidate) => candidate.scene?.key) ?? [],
      hasUnderlay: underlayIndex >= 0,
      phase: context?.run?.phase,
      energy: context?.run?.player?.energy,
      handLength: context?.run?.hand?.length ?? 0,
      logLength: context?.run?.log?.length ?? 0,
      lastEventChoiceId: context?.run?.lastEventChoiceId,
      lockImages,
      hoverImages: hoverImages.length,
      textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay: rectsAbove.length
    };
  }, { target: auditTarget });
}

async function readTooltip(page) {
  return page.evaluate(() => {
    const root = document.getElementById("game-readability-tooltip");
    const canvas = document.querySelector("#game-root canvas");
    if (!root || !canvas) {
      return {
        ok: false,
        reason: "missing tooltip or canvas",
        visible: false,
        title: "",
        body: ""
      };
    }
    const rootBox = root.getBoundingClientRect();
    const canvasBox = canvas.getBoundingClientRect();
    const style = window.getComputedStyle(root);
    const title = root.querySelector("strong")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const body = root.querySelector("span")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    return {
      ok: true,
      role: root.getAttribute("role"),
      live: root.getAttribute("aria-live"),
      visible: root.dataset.visible === "true",
      scene: root.dataset.scene,
      tone: root.dataset.tone,
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
      canvasRole: canvas.getAttribute("role") ?? "",
      canvasLabelLength: canvas.getAttribute("aria-label")?.length ?? 0
    };
  });
}

function assertInitialState(label, state, target) {
  if (!state.activeScenes.includes(target.sceneName)) {
    throw new Error(`${label}: expected active ${target.sceneName}, got ${state.activeScenes.join(",")}`);
  }
  if (!state.hasUnderlay) throw new Error(`${label}: missing raster underlay`);
  if (state.lockImages.length < target.expectedLockImages) {
    throw new Error(`${label}: expected at least ${target.expectedLockImages} lock images, got ${state.lockImages.length}`);
  }
  if (target.expectedFirstLock) {
    const [firstLock] = state.lockImages;
    if (!firstLock
      || Math.abs(firstLock.x - target.expectedFirstLock.x) > 1
      || Math.abs(firstLock.y - target.expectedFirstLock.y) > 1
      || Math.abs(firstLock.displayWidth - target.expectedFirstLock.size) > 1
      || Math.abs(firstLock.displayHeight - target.expectedFirstLock.size) > 1) {
      throw new Error(`${label}: disabled lock is not aligned to expected card ${JSON.stringify({ firstLock, expected: target.expectedFirstLock })}`);
    }
  }
  if (state.hoverImages !== 0) throw new Error(`${label}: disabled target leaked hover/down state images`);
  if (state.textCount !== 0) throw new Error(`${label}: visible Phaser text leaked over raster underlay`);
  if (state.visibleRectsAboveUnderlay !== 0) throw new Error(`${label}: visible rectangle overlay leaked`);
}

function assertTooltip(label, tooltip, target, viewport) {
  if (!tooltip.ok) throw new Error(`${label}: ${tooltip.reason ?? "tooltip audit failed"}`);
  if (tooltip.role !== "tooltip") throw new Error(`${label}: expected role=tooltip, got ${tooltip.role}`);
  if (tooltip.live !== "polite") throw new Error(`${label}: expected aria-live=polite, got ${tooltip.live}`);
  if (!tooltip.visible) throw new Error(`${label}: tooltip is not visible`);
  if (tooltip.scene !== target.sceneName) throw new Error(`${label}: expected tooltip scene ${target.sceneName}, got ${tooltip.scene}`);
  if (tooltip.tone !== "danger") throw new Error(`${label}: expected danger tone, got ${tooltip.tone}`);
  if (tooltip.title.length < 3) throw new Error(`${label}: tooltip title too short (${tooltip.title.length})`);
  if (tooltip.body.length < 8) throw new Error(`${label}: tooltip body too short (${tooltip.body.length})`);
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

function assertBlocked(label, before, after) {
  if (after.phase !== before.phase) throw new Error(`${label}: blocked action changed phase ${before.phase}->${after.phase}`);
  if (after.energy !== before.energy) throw new Error(`${label}: blocked action changed energy ${before.energy}->${after.energy}`);
  if (after.handLength !== before.handLength) throw new Error(`${label}: blocked action changed hand length`);
  if (after.logLength !== before.logLength) throw new Error(`${label}: blocked action added log entries`);
  if (after.lastEventChoiceId !== before.lastEventChoiceId) {
    throw new Error(`${label}: blocked action changed lastEventChoiceId ${before.lastEventChoiceId}->${after.lastEventChoiceId}`);
  }
}
