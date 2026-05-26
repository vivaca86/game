import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import Module from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmpDir = path.join(rootDir, "tmp");
await mkdir(tmpDir, { recursive: true });

const { chromium } = loadPlaywright();
const executableCandidates = [
  "C:/Users/i/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
];

let browser;
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

const baseUrl = process.env.PHASER_SMOKE_URL || "http://127.0.0.1:5173/";
const damagingCards = new Set([
  "card_sun_jab",
  "card_ribbon_snap",
  "card_ink_spill",
  "card_pinpoint_glint"
]);
const cardCosts = new Map([
  ["card_sun_jab", 1],
  ["card_fold_guard", 1],
  ["card_page_step", 0],
  ["card_ribbon_snap", 1],
  ["card_lamplight_mark", 1],
  ["card_stage_patch", 2],
  ["card_ink_spill", 2],
  ["card_paper_bloom", 1],
  ["card_pinpoint_glint", 0],
  ["card_curtain_call", 2]
]);

try {
  await checkPage("/", "TownScene", false);
  await checkPage("/?debug=1&entry=combat&resetSave=1", "CombatScene", true);
  await checkPage("/?debug=1&entry=boss&resetSave=1", "BossScene", true);
  await checkViewScreenshots();
  await checkClickableControls();
  await checkSaveReload();
  await checkCombatActions();
  await checkSceneFlowAndRuneEffect();
  await checkBossResultFlow();
  console.log("Phaser smoke OK");
} finally {
  await browser.close();
}

async function checkPage(pathname, expectedScene, expectDebugOverlay) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = bindErrorCapture(page);

  await page.goto(new URL(pathname, baseUrl).href, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas", { timeout: 10000 });
  await page.waitForFunction(() => {
    const canvas = document.querySelector("canvas");
    return Boolean(canvas && canvas.width >= 1280 && canvas.height >= 720);
  }, null, { timeout: 10000 });

  if (expectDebugOverlay) {
    await waitForDebugScene(page, expectedScene);
  }

  const canvasBox = await page.locator("canvas").boundingBox();
  if (!canvasBox || canvasBox.width < 1000 || canvasBox.height < 560) {
    throw new Error(`${expectedScene}: canvas size is too small`);
  }

  const screenshot = await page.locator("canvas").screenshot({
    path: path.join(tmpDir, `phaser-${expectedScene}.png`)
  });
  if (screenshot.length < 10000) {
    throw new Error(`${expectedScene}: screenshot looks empty`);
  }

  assertNoBrowserErrors(expectedScene, errors);
  await page.close();
}

async function checkViewScreenshots() {
  const viewCases = [
    {
      pathname: "/?debug=1&entry=town&resetSave=1",
      scene: "TownScene",
      requiredState: { phase: "town", savedPhase: "town" }
    },
    {
      pathname: "/?debug=1&entry=dungeon&resetSave=1",
      scene: "DungeonScene",
      requiredState: { phase: "dungeon" }
    },
    {
      pathname: "/?debug=1&entry=combat&resetSave=1",
      scene: "CombatScene",
      requiredState: { phase: "combat", enemyHp: "24", playerEnergy: "3" },
      assertHandCount: 5,
      assertOverlayCombatSafe: true
    },
    {
      pathname: "/?debug=1&entry=reward&resetSave=1",
      scene: "RewardScene",
      requiredState: { phase: "reward" },
      minRewardCount: 3
    },
    {
      pathname: "/?debug=1&entry=rune_bench&resetSave=1",
      scene: "RuneBenchScene",
      requiredState: { phase: "rune_bench" },
      minRuneCount: 1
    },
    {
      pathname: "/?debug=1&entry=boss&resetSave=1",
      scene: "BossScene",
      requiredState: { phase: "boss", enemyHp: "64" },
      assertHandCount: 5,
      assertOverlayCombatSafe: true
    }
  ];

  for (const viewCase of viewCases) {
    await withDebugPageAtViewport(
      viewCase.pathname,
      viewCase.scene,
      { width: 1920, height: 1080 },
      async (page) => {
        await assertCanvasFitsViewport(page, viewCase.scene, 1920, 1080);

        for (const [key, value] of Object.entries(viewCase.requiredState ?? {})) {
          await waitForDebugValue(page, key, value);
        }
        const state = await getDebugMap(page);
        if (viewCase.assertHandCount) {
          const cardsInHand = (state.hand ?? "").split(",").filter(Boolean);
          if (cardsInHand.length !== viewCase.assertHandCount) {
            throw new Error(`${viewCase.scene}: expected ${viewCase.assertHandCount} cards, got ${cardsInHand.length}`);
          }
        }
        if (viewCase.minRewardCount) {
          const rewards = (state.rewards ?? "").split(",").filter((item) => item && item !== "none");
          if (rewards.length < viewCase.minRewardCount) {
            throw new Error(`${viewCase.scene}: expected at least ${viewCase.minRewardCount} rewards, got ${rewards.length}`);
          }
        }
        if (viewCase.minRuneCount) {
          const runes = (state.runes ?? "").split(",").filter((item) => item && item !== "none");
          if (runes.length < viewCase.minRuneCount) {
            throw new Error(`${viewCase.scene}: expected at least ${viewCase.minRuneCount} rune, got ${runes.length}`);
          }
        }

        if (viewCase.assertOverlayCombatSafe) {
          await assertDebugOverlayAvoidsCombatAreas(page, viewCase.scene);
        }

        const screenshot = await page.screenshot({
          path: path.join(tmpDir, `phaser-1920-${viewCase.scene}.png`),
          fullPage: false
        });
        if (screenshot.length < 20000) {
          throw new Error(`${viewCase.scene}: 1920 screenshot looks empty`);
        }
      }
    );
  }

  const overlaySafeCases = [
    { pathname: "/?debug=1&entry=combat&resetSave=1", scene: "CombatScene" },
    { pathname: "/?debug=1&entry=boss&resetSave=1", scene: "BossScene" }
  ];
  const overlayViewports = [
    { label: "1280", viewport: { width: 1280, height: 720 } },
    { label: "1080", viewport: { width: 1080, height: 918 } }
  ];

  for (const overlayCase of overlaySafeCases) {
    for (const overlayViewport of overlayViewports) {
      await withDebugPageAtViewport(
        overlayCase.pathname,
        overlayCase.scene,
        overlayViewport.viewport,
        async (page) => {
          await assertDebugOverlayAvoidsCombatAreas(page, `${overlayCase.scene} ${overlayViewport.label}`);
          const screenshot = await page.screenshot({
            path: path.join(tmpDir, `phaser-overlay-${overlayViewport.label}-${overlayCase.scene}.png`),
            fullPage: false
          });
          if (screenshot.length < 15000) {
            throw new Error(`${overlayCase.scene} ${overlayViewport.label}: overlay screenshot looks empty`);
          }
        }
      );
    }
  }
}

async function checkCombatActions() {
  await withDebugPage("/?debug=1&entry=combat&resetSave=1", "CombatScene", async (page) => {
    await pressAndSettle(page, "Digit1");
    await waitForDebugValue(page, "enemyHp", "17");
    await waitForDebugValue(page, "playerEnergy", "2");
  });

  await withDebugPage("/?debug=1&entry=combat&resetSave=1", "CombatScene", async (page) => {
    await pressAndSettle(page, "Digit2");
    await waitForDebugValue(page, "playerBlock", "6");
    await waitForDebugValue(page, "playerEnergy", "2");
  });

  await withDebugPage("/?debug=1&entry=combat&resetSave=1", "CombatScene", async (page) => {
    await pressAndSettle(page, "Digit3");
    await waitForDebugValue(page, "discard", "1");
    await waitForDebugValue(page, "drawPile", "0");
    const state = await getDebugMap(page);
    if (!state.hand?.includes("card_fold_guard")) {
      throw new Error("CombatScene: draw card did not update hand");
    }
  });

  await withDebugPage("/?debug=1&entry=combat&resetSave=1", "CombatScene", async (page) => {
    await pressAndSettle(page, "KeyE");
    await waitForDebugValue(page, "playerHp", "36");
    await waitForDebugValue(page, "turn", "2");
  });

  await withDebugPage("/?debug=1&entry=combat&resetSave=1&grantCard=card_lamplight_mark", "CombatScene", async (page) => {
    await pressAndSettle(page, "Digit4");
    await waitForDebugValue(page, "enemyMark", "2");
    await pressAndSettle(page, "Digit1");
    await waitForDebugValue(page, "enemyMark", "0");
    await waitForDebugValue(page, "enemyHp", "15");
  });
}

async function checkClickableControls() {
  await withDebugPage("/?debug=1&entry=town&resetSave=1", "TownScene", async (page) => {
    await clickScenePoint(page, 1010, 642);
    await waitForDebugValue(page, "phase", "world_map");

    await clickScenePoint(page, 1010, 512);
    await waitForDebugValue(page, "phase", "dungeon");

    await clickScenePoint(page, 1010, 582);
    await waitForDebugValue(page, "phase", "combat");

    await clickScenePoint(page, 430, 790);
    await waitForDebugValue(page, "enemyHp", "17");
    await waitForDebugValue(page, "playerEnergy", "2");

    await clickScenePoint(page, 1380, 638);
    await waitForDebugValue(page, "playerHp", "36");
    await waitForDebugValue(page, "turn", "2");
  });
}

async function checkSaveReload() {
  await withDebugPage("/?debug=1&entry=town&resetSave=1", "TownScene", async (page) => {
    await clickScenePoint(page, 1010, 642);
    await waitForDebugValue(page, "phase", "world_map");
    await clickScenePoint(page, 1010, 512);
    await waitForDebugValue(page, "phase", "dungeon");
    await clickScenePoint(page, 1010, 582);
    await waitForDebugValue(page, "phase", "combat");
    await clickScenePoint(page, 430, 790);
    await waitForDebugValue(page, "enemyHp", "17");

    validateSaveSnapshot(await readDebugSave(page), "mid-combat save");

    await page.goto(new URL("/?debug=1&entry=town", baseUrl).href, { waitUntil: "networkidle" });
    await waitForDebugScene(page, "CombatScene");
    await waitForDebugValue(page, "phase", "combat");
    await waitForDebugValue(page, "enemyHp", "17");
    await waitForDebugValue(page, "playerEnergy", "2");
    await waitForDebugValue(page, "savedPhase", "combat");
  });

  await withDebugPage("/?debug=1&entry=boss&resetSave=1", "BossScene", async (page) => {
    await playUntilDebugValue(page, "bossPhaseTriggered", "true", 80);
    await playUntilPhase(page, ["result"], 120);
    await pressAndSettle(page, "Enter");
    await waitForDebugValue(page, "phase", "town");
    await waitForDebugValue(page, "saveCompleted", "stage_lantern_foyer");

    validateSaveSnapshot(await readDebugSave(page), "completed-stage save");

    await page.goto(new URL("/?debug=1&entry=town", baseUrl).href, { waitUntil: "networkidle" });
    await waitForDebugScene(page, "TownScene");
    await waitForDebugValue(page, "phase", "town");
    await waitForDebugValue(page, "saveCompleted", "stage_lantern_foyer");
  });
}

async function checkSceneFlowAndRuneEffect() {
  await withDebugPage("/?debug=1&entry=town&resetSave=1", "TownScene", async (page) => {
    await playUntilPhase(page, ["combat"], 8);
    await playUntilPhase(page, ["reward"], 40);
    await pressAndSettle(page, "Enter");
    await waitForDebugValue(page, "phase", "rune_bench");
    await pressAndSettle(page, "Enter");
    await waitForDebugValue(page, "phase", "combat");
    await waitForDebugText(page, "equipped=card_sun_jab:rune_paper_spark");
    await pressAndSettle(page, "Digit1");
    await waitForDebugValue(page, "enemyHp", "9");
  });
}

async function checkBossResultFlow() {
  await withDebugPage("/?debug=1&entry=boss&resetSave=1", "BossScene", async (page) => {
    await playUntilDebugValue(page, "bossPhaseTriggered", "true", 80);
    await playUntilPhase(page, ["result"], 120);
    await waitForDebugValue(page, "phase", "result");
    await pressAndSettle(page, "Enter");
    await waitForDebugValue(page, "phase", "town");
  });
}

async function withDebugPage(pathname, expectedScene, action) {
  await withDebugPageAtViewport(pathname, expectedScene, { width: 1280, height: 720 }, action);
}

async function withDebugPageAtViewport(pathname, expectedScene, viewport, action) {
  const page = await browser.newPage({ viewport });
  const errors = bindErrorCapture(page);
  try {
    await page.goto(new URL(pathname, baseUrl).href, { waitUntil: "networkidle" });
    await page.waitForSelector("canvas", { timeout: 10000 });
    await waitForDebugScene(page, expectedScene);
    await action(page);
    assertNoBrowserErrors(expectedScene, errors);
  } finally {
    await page.close();
  }
}

async function playUntilDebugValue(page, key, value, limit) {
  for (let step = 0; step < limit; step += 1) {
    const state = await getDebugMap(page);
    if (state[key] === value) {
      return state;
    }
    if (state.phase !== "combat" && state.phase !== "boss") {
      throw new Error(`Cannot wait for ${key}=${value} outside combat; phase=${state.phase}`);
    }
    await playUsefulCombatAction(page, state);
  }

  const state = await getDebugMap(page);
  throw new Error(`Did not reach ${key}=${value}; last ${key}=${state[key]}, log=${state.log}`);
}

async function playUntilPhase(page, targetPhases, limit) {
  for (let step = 0; step < limit; step += 1) {
    const state = await getDebugMap(page);
    if (targetPhases.includes(state.phase)) {
      return state;
    }

    if (state.phase === "town" || state.phase === "world_map" || state.phase === "dungeon" || state.phase === "reward" || state.phase === "rune_bench") {
      await pressAndSettle(page, "Enter");
    } else if (state.phase === "combat" || state.phase === "boss") {
      await playUsefulCombatAction(page, state);
    } else {
      throw new Error(`Unexpected phase while waiting: ${state.phase}`);
    }
  }

  const state = await getDebugMap(page);
  throw new Error(`Did not reach ${targetPhases.join(" or ")}; last phase=${state.phase}, log=${state.log}`);
}

async function playUsefulCombatAction(page, state) {
  const energy = Number(state.playerEnergy ?? 0);
  const hand = (state.hand ?? "").split(",").filter(Boolean);
  const pageStepIndex = hand.findIndex((cardId) => cardId === "card_page_step");
  const attackIndex = hand.findIndex((cardId) => damagingCards.has(cardId) && (cardCosts.get(cardId) ?? 99) <= energy);
  const blockIndex = hand.findIndex((cardId) => cardId === "card_fold_guard" && (cardCosts.get(cardId) ?? 99) <= energy);

  if (pageStepIndex >= 0) {
    await pressAndSettle(page, `Digit${pageStepIndex + 1}`);
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
  await page.waitForTimeout(80);
}

async function clickScenePoint(page, sceneX, sceneY) {
  const canvasBox = await page.locator("canvas").boundingBox();
  if (!canvasBox) {
    throw new Error("Missing Phaser canvas for click smoke");
  }

  await page.mouse.click(
    canvasBox.x + (sceneX / 1920) * canvasBox.width,
    canvasBox.y + (sceneY / 1080) * canvasBox.height
  );
  await page.waitForTimeout(120);
}

async function assertCanvasFitsViewport(page, label, minWidth, minHeight) {
  const canvasBox = await page.locator("canvas").boundingBox();
  if (!canvasBox) {
    throw new Error(`${label}: missing canvas`);
  }

  if (canvasBox.width < minWidth || canvasBox.height < minHeight) {
    throw new Error(`${label}: expected ${minWidth}x${minHeight} canvas, got ${canvasBox.width}x${canvasBox.height}`);
  }
}

async function assertDebugOverlayAvoidsCombatAreas(page, label) {
  const result = await page.evaluate(() => {
    const overlay = document.querySelector("#debug-overlay");
    const canvas = document.querySelector("canvas");
    if (!overlay || !canvas) {
      return { ok: false, reason: "missing overlay or canvas" };
    }

    const overlayRect = overlay.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const sceneToViewport = (rect) => ({
      left: canvasRect.left + (rect.left / 1920) * canvasRect.width,
      right: canvasRect.left + (rect.right / 1920) * canvasRect.width,
      top: canvasRect.top + (rect.top / 1080) * canvasRect.height,
      bottom: canvasRect.top + (rect.bottom / 1080) * canvasRect.height
    });
    const intersects = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
    const criticalAreas = [
      { name: "five-card hand", rect: sceneToViewport({ left: 320, top: 650, right: 1510, bottom: 930 }) },
      { name: "enemy intent panel", rect: sceneToViewport({ left: 1165, top: 430, right: 1605, bottom: 780 }) }
    ];
    const overlap = criticalAreas.find((area) => intersects(overlayRect, area.rect));

    return overlap
      ? { ok: false, reason: `overlaps ${overlap.name}` }
      : { ok: true, reason: "safe" };
  });

  if (!result.ok) {
    throw new Error(`${label}: debug overlay ${result.reason}`);
  }
}

async function waitForDebugScene(page, sceneName) {
  await page.waitForFunction(
    (expected) => document.querySelector("#debug-overlay")?.textContent?.includes(expected),
    sceneName,
    { timeout: 10000 }
  );
}

async function waitForDebugValue(page, key, value) {
  await page.waitForFunction(
    ([expectedKey, expectedValue]) => {
      const spans = Array.from(document.querySelectorAll("#debug-overlay span"));
      return spans.some((span) => span.textContent === `${expectedKey}=${expectedValue}`);
    },
    [key, value],
    { timeout: 10000 }
  );
}

async function waitForDebugText(page, text) {
  await page.waitForFunction(
    (expected) => document.querySelector("#debug-overlay")?.textContent?.includes(expected),
    text,
    { timeout: 10000 }
  );
}

async function getDebugMap(page) {
  return page.evaluate(() => {
    const entries = Array.from(document.querySelectorAll("#debug-overlay span"))
      .map((span) => span.textContent ?? "")
      .map((item) => {
        const index = item.indexOf("=");
        return index >= 0 ? [item.slice(0, index), item.slice(index + 1)] : [item, ""];
      });
    return Object.fromEntries(entries);
  });
}

async function readDebugSave(page) {
  return page.evaluate(() => {
    const raw = localStorage.getItem("paper_theater_card_crawler_debug_save_v1");
    return raw ? JSON.parse(raw) : null;
  });
}

function validateSaveSnapshot(save, label) {
  if (!save || typeof save !== "object") {
    throw new Error(`${label}: missing saved JSON`);
  }
  if (save.saveVersion !== 1) {
    throw new Error(`${label}: missing saveVersion=1`);
  }
  if (!save.profile || !save.currentRun || !save.settings) {
    throw new Error(`${label}: missing save sections`);
  }

  const forbiddenKeys = new Set(["scene", "sys", "game", "registry", "textures", "cache", "anims"]);
  const keys = collectObjectKeys(save);
  const forbidden = keys.find((key) => forbiddenKeys.has(key));
  if (forbidden) {
    throw new Error(`${label}: save contains renderer key ${forbidden}`);
  }
}

function collectObjectKeys(value, keys = []) {
  if (!value || typeof value !== "object") return keys;
  if (Array.isArray(value)) {
    value.forEach((item) => collectObjectKeys(item, keys));
    return keys;
  }

  for (const [key, child] of Object.entries(value)) {
    keys.push(key);
    collectObjectKeys(child, keys);
  }
  return keys;
}

function bindErrorCapture(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

function assertNoBrowserErrors(sceneName, errors) {
  if (errors.length > 0) {
    throw new Error(`${sceneName}: browser errors: ${errors.join(" | ")}`);
  }
}
