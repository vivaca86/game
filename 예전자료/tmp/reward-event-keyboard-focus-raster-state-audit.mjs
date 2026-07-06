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

const choiceStateKey = "ui_hover_choice_badge_concept";
const targets = [
  {
    label: "reward-choice-2",
    sceneName: "RewardScene",
    underlayKey: "reward_raster_underlay_concept",
    focusRegistryKey: "rewardRasterFocusIndex",
    pathname: "/?debug=1&entry=reward&resetSave=1",
    expectedFocusIndex: 1,
    expectedX: 795,
    expectedY: 342,
    focusScreenshot: "tmp/ui-quality/keyboard-focus/reward-choice-2-focus-v1-1920.png",
    downScreenshot: "tmp/ui-quality/keyboard-focus/reward-choice-2-keyboard-activate-down-v1-1920.png"
  },
  {
    label: "event-choice-2",
    sceneName: "EventScene",
    underlayKey: "event_raster_underlay_concept",
    focusRegistryKey: "eventRasterFocusIndex",
    pathname: "/?debug=1&data=release&entry=event&resetSave=1&stage=stage_sunny_gate",
    expectedFocusIndex: 1,
    expectedX: 803,
    expectedY: 592,
    focusScreenshot: "tmp/ui-quality/keyboard-focus/event-choice-2-focus-v1-1920.png",
    downScreenshot: "tmp/ui-quality/keyboard-focus/event-choice-2-keyboard-activate-down-v1-1920.png"
  }
];

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    return require(`${bundledNodeModules}/playwright`);
  }
}

async function startServer() {
  for (const port of [4216, 4217, 4218, 4219]) {
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

async function waitForScene(page, sceneName) {
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
  }, sceneName, { timeout: 10000 });
}

async function openTarget(page, baseUrl, target) {
  await page.goto(new URL(target.pathname, baseUrl).href, { waitUntil: "networkidle" });
  await waitForScene(page, target.sceneName);
  await page.waitForSelector("canvas", { timeout: 10000 });
  await page.evaluate(() => {
    const overlay = document.getElementById("debug-overlay");
    if (overlay) overlay.style.display = "none";
  });
  return { canvas: page.locator("canvas") };
}

async function captureStats(page, target) {
  return page.evaluate(({ target, choiceStateKey }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScenes?.(true)?.find((candidate) => candidate.scene?.key === target.sceneName)
      ?? game?.scene?.getScene?.(target.sceneName);
    const children = scene?.children?.list ?? [];
    const underlayIndex = children.findIndex((child) => child?.type === "Image" && child.texture?.key === target.underlayKey);
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
    const visibleStateImages = visible
      .filter((child) => child?.type === "Image" && child.texture?.key === choiceStateKey && Number(child.alpha ?? 1) > 0.05)
      .map((child) => ({
        x: Number(child.x),
        y: Number(child.y),
        displayWidth: Number(child.displayWidth),
        displayHeight: Number(child.displayHeight),
        alpha: Number(child.alpha ?? 1)
      }));

    return {
      scene: target.sceneName,
      hasUnderlay: underlayIndex >= 0,
      focusIndex: game?.registry?.get?.(target.focusRegistryKey),
      visibleStateImages,
      textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
      visibleRectsAboveUnderlay: rectsAbove.length
    };
  }, { target, choiceStateKey });
}

async function setScenePaused(page, sceneName, paused) {
  await page.evaluate(({ sceneName, paused }) => {
    const game = window.__paperGame;
    const scene = game?.scene?.getScene?.(sceneName);
    if (!scene) return;
    scene.time.timeScale = paused ? 0 : 1;
  }, { sceneName, paused });
}

async function focusSecondChoice(page) {
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(70);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(70);
}

function assertChoiceState(label, stats, target, mode) {
  if (!stats.hasUnderlay) throw new Error(`${label}: missing raster underlay`);
  if (stats.focusIndex !== target.expectedFocusIndex) {
    throw new Error(`${label}: expected focus index ${target.expectedFocusIndex}, got ${stats.focusIndex}`);
  }
  if (stats.visibleStateImages.length !== 1) {
    throw new Error(`${label}: expected exactly one visible choice state image, got ${stats.visibleStateImages.length}`);
  }
  if (stats.textCount !== 0) throw new Error(`${label}: visible Phaser text leaked over raster underlay`);
  if (stats.visibleRectsAboveUnderlay !== 0) throw new Error(`${label}: visible rectangle overlay leaked`);

  const [image] = stats.visibleStateImages;
  const maxDelta = 4;
  if (Math.abs(image.x - target.expectedX) > maxDelta || Math.abs(image.y - target.expectedY) > maxDelta) {
    throw new Error(`${label}: state image anchored at (${image.x}, ${image.y}), expected (${target.expectedX}, ${target.expectedY})`);
  }
  if (mode === "hover" && (image.displayWidth < 108 || image.displayWidth > 116 || image.displayHeight < 76 || image.displayHeight > 84)) {
    throw new Error(`${label}: expected hover badge size near 112x80, got ${image.displayWidth}x${image.displayHeight}`);
  }
  if (mode === "down" && (image.displayWidth < 120 || image.displayWidth > 128 || image.displayHeight < 84 || image.displayHeight > 92)) {
    throw new Error(`${label}: expected down badge size near 124x88, got ${image.displayWidth}x${image.displayHeight}`);
  }
}

async function readExpectedReward(page) {
  return page.evaluate(() => {
    const context = window.__paperGame?.registry?.get?.("bootContext");
    const rewardId = context?.run?.offeredRewards?.[1];
    const primaryPool = context?.dataBundle?.rewardPools?.find((pool) => pool.id === context?.run?.rewardPoolId)
      ?? context?.dataBundle?.rewardPools?.[0];
    const entry = primaryPool?.entries?.find((candidate) => candidate.id === rewardId)
      ?? context?.dataBundle?.rewardPools?.flatMap((pool) => pool.entries ?? [])?.find((candidate) => candidate.id === rewardId);
    if (!entry) return undefined;
    const beforeLogLength = context.run.log.length;
    return {
      rewardId,
      entry,
      beforeLogLength,
      before: snapshotRun(context.run)
    };

    function snapshotRun(run) {
      return {
        deck: [...run.deck],
        discard: [...run.discard],
        runes: [...run.runes],
        relics: [...run.relics],
        arcanas: [...run.arcanas],
        gold: run.player.gold,
        hp: run.player.hp,
        log: [...run.log]
      };
    }
  });
}

async function assertRewardApplied(page, expected) {
  if (!expected) throw new Error("reward-choice-2: missing second reward entry");
  const after = await page.evaluate(() => {
    const run = window.__paperGame?.registry?.get?.("bootContext")?.run;
    return {
      phase: run?.phase,
      deck: [...(run?.deck ?? [])],
      discard: [...(run?.discard ?? [])],
      runes: [...(run?.runes ?? [])],
      relics: [...(run?.relics ?? [])],
      arcanas: [...(run?.arcanas ?? [])],
      gold: run?.player?.gold,
      hp: run?.player?.hp,
      log: [...(run?.log ?? [])]
    };
  });
  const newLog = after.log.slice(expected.beforeLogLength);
  const entry = expected.entry;
  const contentId = entry.contentId;
  const countBefore = (items, id) => items.filter((item) => item === id).length;

  if (entry.type === "card" && contentId) {
    const beforeCount = countBefore(expected.before.deck, contentId);
    const afterCount = countBefore(after.deck, contentId);
    if (afterCount <= beforeCount) {
      throw new Error(`reward-choice-2: expected second reward card ${contentId} to be added; phase=${after.phase}; beforeCount=${beforeCount}; afterCount=${afterCount}; newLog=${newLog.join("|")}`);
    }
    return after;
  }
  if (entry.type === "rune" && contentId) {
    if (!after.runes.includes(contentId)) throw new Error(`reward-choice-2: expected second reward rune ${contentId}`);
    return after;
  }
  if (entry.type === "relic" && contentId) {
    if (!after.relics.includes(contentId)) throw new Error(`reward-choice-2: expected second reward relic ${contentId}`);
    return after;
  }
  if (entry.type === "arcana" && contentId) {
    if (!after.arcanas.includes(contentId)) throw new Error(`reward-choice-2: expected second reward arcana ${contentId}`);
    return after;
  }
  if (entry.type === "currency") {
    if (!(after.gold > expected.before.gold) && !newLog.some((item) => item.startsWith("reward:currency:"))) {
      throw new Error("reward-choice-2: expected second reward currency grant");
    }
    return after;
  }
  if (entry.type === "heal") {
    if (!(after.hp > expected.before.hp) && !newLog.some((item) => item.startsWith("reward:heal:"))) {
      throw new Error("reward-choice-2: expected second reward heal grant");
    }
    return after;
  }
  if (entry.type === "unlock" && contentId) {
    if (!newLog.includes(`reward:unlock:${contentId}`)) throw new Error(`reward-choice-2: expected second reward unlock ${contentId}`);
    return after;
  }

  throw new Error(`reward-choice-2: unsupported reward type ${entry.type}`);
}

async function readExpectedEventChoice(page) {
  return page.evaluate(() => {
    const context = window.__paperGame?.registry?.get?.("bootContext");
    const run = context?.run;
    const room = context?.dataBundle?.stages
      ?.find((stage) => stage.id === run?.stageId)
      ?.route?.[run?.roomIndex];
    const poolId = room?.encounterPoolId;
    const eventPool = context?.dataBundle?.encounterPools
      ?.find((pool) => pool.id === poolId && pool.type === "event");
    const eventId = eventPool?.entries?.[0]?.contentId;
    const event = context?.dataBundle?.events?.find((candidate) => candidate.id === eventId);
    const affordable = (event?.choices ?? [])
      .map((choice, index) => ({ choice, index }))
      .filter(({ choice }) => canPay(choice, run));
    const target = affordable[1];
    return target ? { eventId: event.id, choiceId: target.choice.id, choiceIndex: target.index } : undefined;

    function canPay(choice, activeRun) {
      return (choice.cost ?? []).every((effect) => {
        const amount = effect.value?.amount ?? 0;
        if (effect.op === "spend_currency") return activeRun.player.gold >= amount;
        if (effect.op === "spend_hp") return activeRun.player.hp > amount;
        return true;
      });
    }
  });
}

async function assertEventChoiceApplied(page, expected) {
  if (!expected) throw new Error("event-choice-2: missing second affordable event choice");
  const after = await page.evaluate(() => {
    const run = window.__paperGame?.registry?.get?.("bootContext")?.run;
    return {
      phase: run?.phase,
      lastEventChoiceId: run?.lastEventChoiceId,
      log: [...(run?.log ?? [])]
    };
  });
  if (after.lastEventChoiceId !== expected.choiceId) {
    throw new Error(`event-choice-2: expected ${expected.choiceId}, got ${after.lastEventChoiceId}`);
  }
  return after;
}

await mkdir("tmp/ui-quality/keyboard-focus", { recursive: true });

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

  for (const target of targets) {
    const opened = await openTarget(page, baseUrl, target);
    const expectedAction = target.sceneName === "RewardScene"
      ? await readExpectedReward(page)
      : await readExpectedEventChoice(page);

    await focusSecondChoice(page);
    const focusStats = await captureStats(page, target);
    assertChoiceState(`${target.label}-focus`, focusStats, target, "hover");
    await opened.canvas.screenshot({ path: target.focusScreenshot });

    await page.keyboard.down("Enter");
    await page.waitForTimeout(10);
    const downStats = await captureStats(page, target);
    assertChoiceState(`${target.label}-down`, downStats, target, "down");
    await setScenePaused(page, target.sceneName, true);
    await opened.canvas.screenshot({ path: target.downScreenshot });
    await setScenePaused(page, target.sceneName, false);
    await page.keyboard.up("Enter");
    await page.waitForTimeout(1000);

    const actionResult = target.sceneName === "RewardScene"
      ? await assertRewardApplied(page, expectedAction)
      : await assertEventChoiceApplied(page, expectedAction);

    results.push({
      label: target.label,
      focusScreenshot: path.resolve(target.focusScreenshot),
      downScreenshot: path.resolve(target.downScreenshot),
      expectedAction,
      actionResult,
      focusStats,
      downStats
    });
  }

  console.log(JSON.stringify({ ok: true, results }, null, 2));
} finally {
  await browser?.close();
  await server?.close();
}
