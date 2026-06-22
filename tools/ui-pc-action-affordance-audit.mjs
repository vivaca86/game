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

const targets = [
  {
    key: "town",
    sceneName: "TownScene",
    pathname: "/?debug=1&entry=town&resetSave=1",
    underlayKey: "town_raster_underlay_concept",
    minIdleAffordances: 5,
    minButtonLabelAffordances: 5
  },
  {
    key: "worldmap",
    sceneName: "WorldMapScene",
    pathname: "/?debug=1&entry=world_map&resetSave=1",
    underlayKey: "world_map_raster_underlay_concept",
    minIdleAffordances: 1,
    minButtonLabelAffordances: 1
  },
  {
    key: "dungeon",
    sceneName: "DungeonScene",
    pathname: "/?debug=1&entry=dungeon&resetSave=1",
    underlayKey: "dungeon_raster_underlay_concept",
    minIdleAffordances: 2,
    minButtonLabelAffordances: 2
  },
  {
    key: "combat",
    sceneName: "CombatScene",
    pathname: "/?debug=1&entry=combat&resetSave=1",
    underlayKey: "combat_raster_underlay_concept",
    minIdleAffordances: 1,
    minCardAffordances: 5,
    minButtonLabelAffordances: 1
  },
  {
    key: "reward",
    sceneName: "RewardScene",
    pathname: "/?debug=1&entry=reward&resetSave=1",
    underlayKey: "reward_raster_underlay_concept",
    minIdleAffordances: 1,
    minChoiceInfoAffordances: 1
  },
  {
    key: "event",
    sceneName: "EventScene",
    pathname: "/?debug=1&data=release&entry=event&resetSave=1&stage=stage_sunny_gate",
    underlayKey: "event_raster_underlay_concept",
    minIdleAffordances: 1,
    minChoiceInfoAffordances: 1
  },
  {
    key: "rune-bench",
    sceneName: "RuneBenchScene",
    pathname: "/?debug=1&entry=rune_bench&resetSave=1&grantRune=rune_paper_spark",
    underlayKey: "rune_bench_raster_underlay_concept",
    minIdleAffordances: 2,
    minButtonLabelAffordances: 2
  },
  {
    key: "boss",
    sceneName: "BossScene",
    pathname: "/?debug=1&entry=boss&resetSave=1",
    underlayKey: "boss_raster_underlay_concept",
    minIdleAffordances: 1,
    minCardAffordances: 5,
    minButtonLabelAffordances: 1
  },
  {
    key: "result",
    sceneName: "ResultScene",
    pathname: "/?debug=1&entry=result&resetSave=1&grantRelic=relic_brass_bookmark",
    underlayKey: "result_raster_underlay_concept",
    minIdleAffordances: 2,
    minButtonLabelAffordances: 2
  },
  {
    key: "settings",
    sceneName: "SettingsScene",
    pathname: "/?debug=1&entry=town&resetSave=1",
    underlayKey: "settings_raster_underlay_concept",
    minIdleAffordances: 10,
    minButtonLabelAffordances: 10,
    setup: async (page) => {
      await waitForScene(page, "TownScene");
      await hideDebugOverlay(page);
      await clickScenePoint(page, 1340, 976);
    }
  }
];

const screenshotDir = "tmp/ui-quality/pc-action-affordance";

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

    for (const target of targets) {
      await page.goto(new URL(target.pathname, baseUrl).href, { waitUntil: "networkidle" });
      if (target.setup) {
        await target.setup(page);
      }
      await waitForScene(page, target.sceneName);
      await hideDebugOverlay(page);
      await page.waitForFunction((expected) => {
        const game = window.__paperGame;
        const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === expected.sceneName)
          ?? game?.scene?.getScene?.(expected.sceneName);
        const visible = (scene?.children?.list ?? []).filter((child) => child?.visible !== false && Number(child?.alpha ?? 1) > 0.05);
        const idleAffordances = visible.filter((child) => child?.type === "Image" && child.getData?.("rasterIdleAffordance"));
        const cardAffordances = visible.filter((child) => (
          child?.type === "Image"
          && String(child.texture?.key ?? "").startsWith("combat_card_affordance_v2_")
        ));
        const choiceInfoAffordances = visible.filter((child) => child?.type === "Image" && child.getData?.("choiceInfoAffordance"));
        const buttonLabelAffordances = visible.filter((child) => child?.type === "Image" && child.getData?.("buttonLabelAffordance"));
        return idleAffordances.length >= expected.minIdleAffordances
          && cardAffordances.length >= expected.minCardAffordances
          && choiceInfoAffordances.length >= expected.minChoiceInfoAffordances
          && buttonLabelAffordances.length >= expected.minButtonLabelAffordances;
      }, {
        sceneName: target.sceneName,
        minIdleAffordances: target.minIdleAffordances,
        minCardAffordances: target.minCardAffordances ?? 0,
        minChoiceInfoAffordances: target.minChoiceInfoAffordances ?? 0,
        minButtonLabelAffordances: target.minButtonLabelAffordances ?? 0
      }, { timeout: 10000 });

      const audit = await readActionAffordanceAudit(page, {
        sceneName: target.sceneName,
        underlayKey: target.underlayKey
      });
      assertActionAffordance(`${target.key}/${viewport.key}`, audit, target);
      const screenshot = path.join(screenshotDir, `${target.key}-idle-v1-${viewport.suffix}.png`);
      await page.locator("canvas").screenshot({ path: screenshot });
      results.push(summary(target, viewport, audit, screenshot));
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
  for (const port of [4300, 4301, 4302, 4303, 4304]) {
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
  throw new Error("No free PC action affordance audit port found");
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

async function clickScenePoint(page, sceneX, sceneY) {
  const canvasBox = await page.locator("canvas").boundingBox();
  if (!canvasBox) throw new Error("Missing Phaser canvas for click");
  await page.mouse.click(
    canvasBox.x + (sceneX / 1920) * canvasBox.width,
    canvasBox.y + (sceneY / 1080) * canvasBox.height
  );
  await page.waitForTimeout(180);
}

async function readActionAffordanceAudit(page, target) {
  return page.evaluate((expected) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === expected.sceneName)
      ?? game?.scene?.getScene?.(expected.sceneName);
    const children = scene?.children?.list ?? [];
    const underlayIndex = children.findIndex((child) => (
      child?.type === "Image"
      && child.texture?.key === expected.underlayKey
      && child.visible !== false
      && Number(child.alpha ?? 1) > 0.05
    ));
    const underlayDepth = children[underlayIndex]?.depth ?? 0;
    const visible = children.filter((child) => child?.visible !== false && Number(child?.alpha ?? 1) > 0.05);
    const images = visible.filter((child) => child?.type === "Image");
    const idleImages = images.filter((child) => child.getData?.("rasterIdleAffordance"));
    const cardAffordanceImages = images.filter((child) => String(child.texture?.key ?? "").startsWith("combat_card_affordance_v2_"));
    const choiceInfoImages = images.filter((child) => child.getData?.("choiceInfoAffordance"));
    const buttonLabelImages = images.filter((child) => child.getData?.("buttonLabelAffordance"));
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
      sceneName: scene?.scene?.key ?? null,
      underlayKey: expected.underlayKey,
      idleAffordances: idleImages.length,
      idleKeys: idleImages.map((child) => String(child.texture?.key ?? "")),
      cardAffordances: cardAffordanceImages.length,
      readyCardAffordances: cardAffordanceImages.filter((child) => String(child.texture?.key ?? "").includes("_ready_")).length,
      blockedCardAffordances: cardAffordanceImages.filter((child) => String(child.texture?.key ?? "").includes("_blocked_")).length,
      choiceInfoAffordances: choiceInfoImages.length,
      choiceInfoKeys: choiceInfoImages.map((child) => String(child.texture?.key ?? "")),
      buttonLabelAffordances: buttonLabelImages.length,
      buttonLabels: buttonLabelImages.map((child) => String(child.getData?.("buttonLabel") ?? "")),
      visibleTextCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay: rectsAboveUnderlay.length,
      canvasAriaLength: document.querySelector("#game-root canvas")?.getAttribute("aria-label")?.length ?? 0
    };
  }, target);
}

function assertActionAffordance(label, audit, target) {
  if (!audit.hasScene || audit.sceneName !== target.sceneName) {
    throw new Error(`${label}: missing expected scene ${JSON.stringify(audit)}`);
  }
  if (!audit.hasUnderlay) {
    throw new Error(`${label}: missing raster underlay ${target.underlayKey} ${JSON.stringify(audit)}`);
  }
  if (audit.idleAffordances < target.minIdleAffordances) {
    throw new Error(`${label}: expected at least ${target.minIdleAffordances} visible idle affordances ${JSON.stringify(audit)}`);
  }
  if (audit.cardAffordances < (target.minCardAffordances ?? 0)) {
    throw new Error(`${label}: expected combat card affordances ${JSON.stringify(audit)}`);
  }
  if (audit.choiceInfoAffordances < (target.minChoiceInfoAffordances ?? 0)) {
    throw new Error(`${label}: expected choice info affordances ${JSON.stringify(audit)}`);
  }
  if (audit.buttonLabelAffordances < (target.minButtonLabelAffordances ?? 0)) {
    throw new Error(`${label}: expected button label affordances ${JSON.stringify(audit)}`);
  }
  if (audit.visibleTextCount !== 0) {
    throw new Error(`${label}: visible Phaser text leaked over raster underlay ${JSON.stringify(audit)}`);
  }
  if (audit.visibleRectsAboveUnderlay !== 0) {
    throw new Error(`${label}: visible rectangle overlay leaked ${JSON.stringify(audit)}`);
  }
  if (audit.canvasAriaLength < 20) {
    throw new Error(`${label}: canvas aria summary is too short ${JSON.stringify(audit)}`);
  }
}

function summary(target, viewport, audit, screenshot) {
  return {
    scene: target.sceneName,
    viewport: viewport.key,
    idleAffordances: audit.idleAffordances,
    cardAffordances: `${audit.readyCardAffordances} ready / ${audit.blockedCardAffordances} blocked`,
    choiceInfoAffordances: audit.choiceInfoAffordances,
    buttonLabelAffordances: audit.buttonLabelAffordances,
    leak: `${audit.visibleTextCount} text, ${audit.visibleRectsAboveUnderlay} rects`,
    ariaLength: audit.canvasAriaLength,
    screenshot: path.resolve(screenshot)
  };
}
