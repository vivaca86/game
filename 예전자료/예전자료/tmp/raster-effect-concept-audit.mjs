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

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    return require(`${bundledNodeModules}/playwright`);
  }
}

async function startServer() {
  for (const port of [4181, 4182, 4183, 4184]) {
    try {
      const server = await createServer({
        root: process.cwd(),
        logLevel: "silent",
        server: { host: "127.0.0.1", port, strictPort: true }
      });
      await server.listen();
      return { server, baseUrl: `http://127.0.0.1:${port}/` };
    } catch (error) {
      if (!String(error?.message ?? error).includes("Port")) throw error;
    }
  }
  throw new Error("No free audit port found");
}

const cardCosts = new Map([
  ["card_sun_jab", 1],
  ["card_ribbon_snap", 1],
  ["card_pinpoint_glint", 1],
  ["card_fold_guard", 1],
  ["card_page_step", 1],
  ["card_lamplight_mark", 1],
  ["card_stage_patch", 1],
  ["card_ink_spill", 1],
  ["card_paper_bloom", 2],
  ["card_curtain_call", 2]
]);
const supportCards = new Set(["card_lamplight_mark", "card_stage_patch", "card_page_step", "card_paper_bloom", "card_curtain_call"]);
const damagingCards = new Set(["card_sun_jab", "card_ribbon_snap", "card_pinpoint_glint", "card_ink_spill"]);
const blockingCards = new Set(["card_fold_guard"]);

const executableCandidates = [
  "C:/Users/i/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
];

const cases = [
  {
    label: "combat-paper-slash",
    sceneName: "CombatScene",
    underlay: "combat_raster_underlay_concept",
    effectKey: "effect_paper_slash",
    pathname: "/?debug=1&entry=combat&resetSave=1",
    act: async (page) => {
      await pressAndSettle(page, "Digit1");
      await waitForDebugValue(page, "effect", "effect_paper_slash");
    }
  },
  {
    label: "combat-ink-splash",
    sceneName: "CombatScene",
    underlay: "combat_raster_underlay_concept",
    effectKey: "effect_ink_splash",
    pathname: "/?debug=1&entry=combat&resetSave=1&grantCard=card_lamplight_mark",
    act: async (page) => {
      await pressAndSettle(page, "Digit4");
      await waitForDebugValue(page, "effect", "effect_ink_splash");
    }
  },
  {
    label: "boss-stage-spotlight",
    sceneName: "BossScene",
    underlay: "boss_raster_underlay_concept",
    effectKey: "effect_stage_spotlight",
    pathname: "/?debug=1&entry=boss&resetSave=1",
    act: async (page) => {
      await playUntilDebugValue(page, "bossPhaseTriggered", "true", 80);
      await waitForDebugValue(page, "effect", "effect_stage_spotlight");
    }
  }
];

await mkdir("tmp/ui-quality/effects", { recursive: true });

const { chromium } = loadPlaywright();
let browser;
let server;
let baseUrl;

try {
  ({ server, baseUrl } = await startServer());
  let launchError;
  for (const executablePath of [null, ...executableCandidates]) {
    try {
      browser = await chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true });
      break;
    } catch (error) {
      launchError = error;
    }
  }
  if (!browser) throw launchError;

  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const results = [];

  for (const item of cases) {
    await page.goto(new URL(item.pathname, baseUrl).href, { waitUntil: "networkidle" });
    await waitForScene(page, item.sceneName);
    await item.act(page);
    await hideDebugOverlay(page);
    await page.waitForTimeout(140);

    const canvas = page.locator("canvas");
    const screenshot = path.join("tmp", "ui-quality", "effects", `${item.label}-v1-1920.png`);
    await canvas.screenshot({ path: screenshot });
    const stats = await collectSceneStats(page, item);
    if (!stats.hasUnderlay) throw new Error(`${item.label}: missing raster underlay ${item.underlay}`);
    if (stats.visibleEffectSprites < 1) throw new Error(`${item.label}: missing visible effect sprite ${item.effectKey}`);
    if (stats.textCount !== 0) throw new Error(`${item.label}: visible Text objects above raster path: ${stats.textCount}`);
    if (stats.visibleRectsAboveUnderlay !== 0) {
      throw new Error(`${item.label}: visible Rectangle objects above underlay: ${stats.visibleRectsAboveUnderlay}`);
    }
    results.push({ ...stats, screenshot: path.resolve(screenshot) });
  }

  console.log(JSON.stringify({ baseUrl, results }, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}

async function waitForScene(page, sceneName) {
  await page.waitForSelector("canvas", { timeout: 10000 });
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneName, { timeout: 10000 });
}

async function hideDebugOverlay(page) {
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });
}

async function collectSceneStats(page, { sceneName, underlay, effectKey }) {
  return page.evaluate(({ sceneName, underlay, effectKey }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === sceneName)
      ?? game?.scene?.getScene?.(sceneName);
    const children = scene?.children?.list ?? [];
    const underlayIndex = children.findIndex((child) => child?.type === "Image" && child.texture?.key === underlay);
    const underlayDepth = children[underlayIndex]?.depth ?? 0;
    const visible = children.filter((child) => child?.visible !== false && child?.alpha !== 0);
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
      scene: sceneName,
      effectKey,
      hasUnderlay: underlayIndex >= 0,
      visibleEffectSprites: visible.filter((child) => child?.type === "Sprite" && child.texture?.key === effectKey).length,
      textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay: rectsAbove.length
    };
  }, { sceneName, underlay, effectKey });
}

async function playUntilDebugValue(page, key, value, limit) {
  for (let step = 0; step < limit; step += 1) {
    const state = await getDebugMap(page);
    if (state[key] === value) return state;
    if (state.phase !== "combat" && state.phase !== "boss") {
      throw new Error(`Cannot wait for ${key}=${value} outside combat; phase=${state.phase}`);
    }
    await playUsefulCombatAction(page, state);
  }

  const state = await getDebugMap(page);
  throw new Error(`Did not reach ${key}=${value}; last ${key}=${state[key]}, log=${state.log}`);
}

async function playUsefulCombatAction(page, state) {
  const energy = Number(state.playerEnergy ?? 0);
  const hand = (state.hand ?? "").split(",").filter(Boolean);
  const supportIndex = hand.findIndex((cardId) => supportCards.has(cardId) && (cardCosts.get(cardId) ?? 99) <= energy);
  const attackIndex = hand.findIndex((cardId) => damagingCards.has(cardId) && (cardCosts.get(cardId) ?? 99) <= energy);
  const blockIndex = hand.findIndex((cardId) => blockingCards.has(cardId) && (cardCosts.get(cardId) ?? 99) <= energy);

  if (supportIndex >= 0) {
    await pressAndSettle(page, `Digit${supportIndex + 1}`);
  } else if (attackIndex >= 0) {
    await pressAndSettle(page, `Digit${attackIndex + 1}`);
  } else if (blockIndex >= 0) {
    await pressAndSettle(page, `Digit${blockIndex + 1}`);
  } else {
    await pressAndSettle(page, "KeyE");
  }
}

async function pressAndSettle(page, key) {
  await page.keyboard.press(key);
  await page.waitForTimeout(100);
}

async function waitForDebugValue(page, key, value) {
  await page.waitForFunction(({ key, value }) => {
    const entries = Array.from(document.querySelectorAll("#debug-overlay span"))
      .map((span) => span.textContent ?? "");
    return entries.some((entry) => entry === `${key}=${value}`);
  }, { key, value }, { timeout: 10000 });
}

async function getDebugMap(page) {
  return page.evaluate(() => {
    const entries = Array.from(document.querySelectorAll("#debug-overlay span"))
      .map((span) => span.textContent ?? "");
    const result = {};
    for (const entry of entries) {
      const index = entry.indexOf("=");
      if (index > 0) result[entry.slice(0, index)] = entry.slice(index + 1);
    }
    return result;
  });
}
