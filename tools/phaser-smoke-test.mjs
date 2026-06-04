import { appendFile, mkdir } from "node:fs/promises";
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
const productionSaveKey = "paper_theater_card_crawler_save_v1";
const shouldLogSmokeProgress = process.env.PHASER_SMOKE_PROGRESS === "1";
const smokeProgressFile = process.env.PHASER_SMOKE_PROGRESS_FILE;
const rasterOnlySceneUnderlays = {
  BossScene: "boss_raster_underlay_concept",
  CombatScene: "combat_raster_underlay_concept",
  DungeonScene: "dungeon_raster_underlay_concept",
  EventScene: "event_raster_underlay_concept",
  RuneBenchScene: "rune_bench_raster_underlay_concept",
  ResultScene: "result_raster_underlay_concept",
  RewardScene: "reward_raster_underlay_concept",
  SettingsScene: "settings_raster_underlay_concept",
  TownScene: "town_raster_underlay_concept",
  WorldMapScene: "world_map_raster_underlay_concept"
};
const rasterDownPressedImageKey = "ui_down_pressed_stamp_concept";
const rasterDisabledImageKey = "ui_disabled_lock_stamp_concept";

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
  "card_pinpoint_glint",
  "card_sunbean_punch",
  "card_morning_daybreak",
  "card_mint_leafjab"
]);
const supportCards = new Set([
  "card_page_step",
  "card_mint_spark",
  "card_morning_breakfast"
]);
const blockingCards = new Set([
  "card_fold_guard",
  "card_cloud_cushion",
  "card_sprout_guard",
  "card_peach_softguard"
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
  ["card_curtain_call", 2],
  ["card_sunbean_punch", 1],
  ["card_morning_daybreak", 2],
  ["card_cloud_cushion", 1],
  ["card_mint_spark", 0],
  ["card_morning_parcel", 2],
  ["card_sprout_guard", 2],
  ["card_morning_breakfast", 0],
  ["card_peach_softguard", 1],
  ["card_mint_leafjab", 1]
]);

try {
  await runSmokeStep("checkPage TownScene", () => checkPage("/", "TownScene", false));
  await runSmokeStep("checkPage CombatScene", () => checkPage("/?debug=1&entry=combat&resetSave=1", "CombatScene", true));
  await runSmokeStep("checkPage BossScene", () => checkPage("/?debug=1&entry=boss&resetSave=1", "BossScene", true));
  await runSmokeStep("checkViewScreenshots", checkViewScreenshots);
  await runSmokeStep("checkClickableControls", checkClickableControls);
  await runSmokeStep("checkFullInputCoverage", checkFullInputCoverage);
  await runSmokeStep("checkSettingsSurface", checkSettingsSurface);
  await runSmokeStep("checkUiSkinStates", checkUiSkinStates);
  await runSmokeStep("checkSaveReload", checkSaveReload);
  await runSmokeStep("checkProductionSaveReset", checkProductionSaveReset);
  await runSmokeStep("checkCombatActions", checkCombatActions);
  await runSmokeStep("checkReleaseCatalogMode", checkReleaseCatalogMode);
  await runSmokeStep("checkReleaseGemRuneEffect", checkReleaseGemRuneEffect);
  await runSmokeStep("checkReleaseEnemyIntentBatch", checkReleaseEnemyIntentBatch);
  await runSmokeStep("checkReleaseStageRouteBatch", checkReleaseStageRouteBatch);
  await runSmokeStep("checkReleaseEventBatch", checkReleaseEventBatch);
  await runSmokeStep("checkReleasePassiveBatch", checkReleasePassiveBatch);
  await runSmokeStep("checkCoreRunLoop", checkCoreRunLoop);
  await runSmokeStep("checkSceneFlowAndRuneEffect", checkSceneFlowAndRuneEffect);
  await runSmokeStep("checkBossResultFlow", checkBossResultFlow);
  console.log("Phaser smoke OK");
} finally {
  await browser.close();
}

async function runSmokeStep(label, action) {
  await logSmokeProgress(label);
  await action();
}

async function logSmokeProgress(label) {
  if (shouldLogSmokeProgress) console.log(`[smoke] ${label}`);
  if (smokeProgressFile) await appendFile(smokeProgressFile, `[smoke] ${label}\n`, "utf8");
}

async function checkPage(pathname, expectedScene, expectDebugOverlay) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = bindErrorCapture(page);
  const assetResponses = [];
  page.on("response", (response) => {
    if (response.url().includes("/assets/runtime/")) {
      assetResponses.push({ url: response.url(), status: response.status() });
    }
  });

  await page.goto(new URL(pathname, baseUrl).href, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas", { timeout: 10000 });
  await page.waitForFunction(() => {
    const canvas = document.querySelector("canvas");
    return Boolean(canvas && canvas.width >= 1280 && canvas.height >= 720);
  }, null, { timeout: 10000 });

  if (expectDebugOverlay) {
    await waitForDebugScene(page, expectedScene);
  }
  await assertSceneTextLayout(page, expectedScene);

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
  if (expectedScene === "TownScene") {
    assertRuntimeAssetsLoaded(assetResponses);
  }
  await page.close();
}

function assertRuntimeAssetsLoaded(assetResponses) {
  if (assetResponses.length < 35) {
    throw new Error(`runtime asset preload count too low: ${assetResponses.length}/35`);
  }

  const badResponse = assetResponses.find((response) => response.status < 200 || response.status >= 400);
  if (badResponse) {
    throw new Error(`runtime asset preload failed: ${badResponse.status} ${badResponse.url}`);
  }
}

async function checkViewScreenshots() {
  const viewCases = [
    {
      pathname: "/?debug=1&entry=town&resetSave=1",
      scene: "TownScene",
      requiredState: { phase: "town", savedPhase: "town" },
      assertUiSkin: true
    },
    {
      pathname: "/?debug=1&entry=dungeon&resetSave=1",
      scene: "DungeonScene",
      requiredState: { phase: "dungeon" },
      assertUiSkin: true
    },
    {
      pathname: "/?debug=1&entry=combat&resetSave=1",
      scene: "CombatScene",
      requiredState: { phase: "combat", enemyHp: "24", playerEnergy: "3" },
      assertHandCount: 5,
      assertCharacterSprite: true,
      assertUiPanel: true,
      assertUiSkin: true,
      assertOverlayCombatSafe: true
    },
    {
      pathname: "/?debug=1&entry=reward&resetSave=1",
      scene: "RewardScene",
      requiredState: { phase: "reward" },
      minRewardCount: 3,
      assertUiSkin: true
    },
    {
      pathname: "/?debug=1&entry=event&resetSave=1",
      scene: "EventScene",
      requiredState: { phase: "event", event: "event_rune_bench" },
      minEventChoiceCount: 3,
      assertUiSkin: true
    },
    {
      pathname: "/?debug=1&entry=rune_bench&resetSave=1",
      scene: "RuneBenchScene",
      requiredState: { phase: "rune_bench" },
      minRuneCount: 1,
      assertUiSkin: true
    },
    {
      pathname: "/?debug=1&entry=boss&resetSave=1",
      scene: "BossScene",
      requiredState: { phase: "boss", enemyHp: "64" },
      assertHandCount: 5,
      assertCharacterSprite: true,
      assertUiPanel: true,
      assertUiSkin: true,
      assertOverlayCombatSafe: true
    },
    {
      pathname: "/?debug=1&entry=result&resetSave=1&grantRelic=relic_brass_bookmark",
      scene: "ResultScene",
      requiredState: { phase: "result" },
      minRelicCount: 1,
      assertUiSkin: true
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
        if (viewCase.minEventChoiceCount) {
          const count = Number(state.eventChoices ?? 0);
          if (count < viewCase.minEventChoiceCount) {
            throw new Error(`${viewCase.scene}: expected at least ${viewCase.minEventChoiceCount} event choices, got ${count}`);
          }
        }
        if (viewCase.minRuneCount) {
          const runes = (state.runes ?? "").split(",").filter((item) => item && item !== "none");
          if (runes.length < viewCase.minRuneCount) {
            throw new Error(`${viewCase.scene}: expected at least ${viewCase.minRuneCount} rune, got ${runes.length}`);
          }
        }
        if (viewCase.minRelicCount) {
          const relics = (state.relics ?? "").split(",").filter((item) => item && item !== "none");
          if (relics.length < viewCase.minRelicCount) {
            throw new Error(`${viewCase.scene}: expected at least ${viewCase.minRelicCount} relic, got ${relics.length}`);
          }
        }

        if (viewCase.assertOverlayCombatSafe) {
          await assertDebugOverlayAvoidsCombatAreas(page, viewCase.scene);
        }
        if (viewCase.assertCharacterSprite) {
          await waitForDebugValue(page, "characterSprite", "char_mina_pagehand_sprite");
          await captureCharacterSpriteScreenshot(page, viewCase.scene);
        }
        if (viewCase.assertUiPanel) {
          await waitForDebugValue(page, "uiPanel", "ui_panel_paper_9slice");
          await captureUiPanelScreenshot(page, viewCase.scene);
        }
        if (viewCase.assertUiSkin) {
          await waitForDebugValue(page, "uiSkin", "button+slot+tooltip");
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
    await waitForDebugValue(page, "effect", "effect_paper_slash");
    await captureEffectScreenshot(page, "paper-slash");
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
    await waitForDebugValue(page, "effect", "effect_ink_splash");
    await captureEffectScreenshot(page, "ink-splash");
    await pressAndSettle(page, "Digit1");
    await waitForDebugValue(page, "enemyMark", "0");
    await waitForDebugValue(page, "enemyHp", "15");
  });
}

async function checkReleaseCatalogMode() {
  await withDebugPage("/?debug=1&data=release&entry=combat&resetSave=1", "CombatScene", async (page) => {
    await waitForDebugValue(page, "dataMode", "release");
    await waitForDebugValue(page, "cards", "113");
    await waitForDebugValue(page, "runesTotal", "58");
    await waitForDebugValue(page, "relicsTotal", "16");
    await waitForDebugValue(page, "stagesTotal", "15");
    await waitForDebugValue(page, "validation", "ok");
    await waitForDebugValue(page, "enemy", "enemy_cloud_buddy");
    await waitForDebugValue(page, "enemyHp", "22");
    await waitForDebugText(page, "hand=card_sunbean_punch,card_morning_daybreak,card_cloud_cushion,card_mint_spark,card_morning_parcel");

    await pressAndSettle(page, "Digit1");
    await waitForDebugValue(page, "enemyHp", "14");
    await waitForDebugValue(page, "playerEnergy", "2");

    const screenshot = await page.screenshot({
      path: path.join(tmpDir, "phaser-release-catalog-combat.png"),
      fullPage: false
    });
    if (screenshot.length < 15000) {
      throw new Error("Release catalog combat screenshot looks empty");
    }
  });
}

async function checkClickableControls() {
  await withDebugPage("/?debug=1&entry=town&resetSave=1", "TownScene", async (page) => {
    await assertHoverUsesRasterImageOnly(page, 1010, 642, "town-action-button", "ui_hover_action_seal_concept", "TownScene");
    await clickScenePoint(page, 1010, 642);
    await waitForDebugValue(page, "phase", "world_map");

    await assertHoverUsesRasterImageOnly(page, 1576, 970, "world-map-confirm", "ui_hover_world_map_play_button_concept", "WorldMapScene", "ui_down_world_map_play_button_concept");
    await clickScenePoint(page, 1576, 970);
    await waitForDebugValue(page, "phase", "dungeon");

    await assertHoverUsesRasterImageOnly(page, 1010, 582, "dungeon-confirm", "ui_hover_route_node_concept", "DungeonScene");
    await clickScenePoint(page, 1010, 582);
    await waitForDebugValue(page, "phase", "combat");

    await assertHoverUsesRasterImageOnly(page, 540, 836, "combat-card", "ui_hover_gold_seal_concept");
    await clickScenePoint(page, 540, 836);
    await waitForDebugValue(page, "enemyHp", "17");
    await waitForDebugValue(page, "playerEnergy", "2");

    await assertHoverUsesRasterImageOnly(page, 1660, 910, "combat-end-turn", "ui_hover_gold_seal_concept");
    await clickScenePoint(page, 1660, 910);
    await waitForDebugValue(page, "playerHp", "36");
    await waitForDebugValue(page, "turn", "2");
  });
}

async function checkFullInputCoverage() {
  await withDebugPage("/?debug=1&entry=reward&resetSave=1", "RewardScene", async (page) => {
    await assertHoverUsesRasterImageOnly(page, 630, 618, "reward-choice-card", "ui_hover_choice_badge_concept", "RewardScene");
    await clickScenePoint(page, 630, 618);
    await waitForDebugValue(page, "phase", "event");
  });

  await withDebugPage("/?debug=1&entry=event&resetSave=1", "EventScene", async (page) => {
    await assertHoverUsesRasterImageOnly(page, 618, 722, "event-choice", "ui_hover_choice_badge_concept", "EventScene");
    await clickScenePoint(page, 618, 722);
    await waitForDebugValue(page, "phase", "rune_bench");
  });

  await withDebugPage("/?debug=1&entry=rune_bench&resetSave=1&grantRune=rune_paper_spark", "RuneBenchScene", async (page) => {
    await assertHoverUsesRasterImageOnly(page, 1010, 742, "rune-bench-action", "ui_hover_action_seal_concept", "RuneBenchScene");
    await clickScenePoint(page, 1010, 742);
    await waitForDebugValue(page, "phase", "combat");
    await waitForDebugText(page, "equipped=card_sun_jab:rune_paper_spark");
  });

  await withDebugPage("/?debug=1&entry=boss&resetSave=1", "BossScene", async (page) => {
    await assertHoverUsesRasterImageOnly(page, 1750, 960, "boss-end-turn", "ui_hover_boss_skull_stamp_concept", "BossScene");
    await clickScenePoint(page, 1750, 960);
    await waitForDebugValue(page, "turn", "2");
  });

  await withDebugPage("/?debug=1&entry=result&resetSave=1", "ResultScene", async (page) => {
    await assertHoverUsesRasterImageOnly(page, 1010, 742, "result-confirm", "ui_hover_action_seal_concept", "ResultScene");
    await clickScenePoint(page, 1010, 742);
    await waitForDebugValue(page, "phase", "town");
  });

  await withDebugPage("/?debug=1&data=release&entry=event&resetSave=1&stage=stage_sunny_gate", "EventScene", async (page) => {
    await clickScenePoint(page, 1145, 866);
    await waitForDebugValue(page, "phase", "combat");
    await waitForDebugValue(page, "eventChoice", "event_bubble_shop_choice_3");
  });

  await withDebugPage("/?debug=1&data=release&entry=reward&resetSave=1&rewardPool=reward_pool_release_cards", "RewardScene", async (page) => {
    await clickScenePoint(page, 630, 618);
    const state = await getDebugMap(page);
    if (state.phase !== "combat" && state.phase !== "event" && state.phase !== "dungeon" && state.phase !== "rune_bench") {
      throw new Error(`Release reward click did not advance to a playable phase: phase=${state.phase}`);
    }
  });
}

async function checkSettingsSurface() {
  await withDebugPage("/?debug=1&entry=town&resetSave=1", "TownScene", async (page) => {
    await clickScenePoint(page, 1010, 806);
    await waitForDebugScene(page, "SettingsScene");
    await assertSceneTextLayout(page, "SettingsScene");
    await waitForDebugValue(page, "settingMaster", "80");
    await waitForDebugValue(page, "settingMusic", "60");
    await waitForDebugValue(page, "settingSfx", "80");
    await waitForDebugValue(page, "settingDisplay", "standard");
    await waitForDebugValue(page, "settingLargeText", "false");
    await waitForDebugValue(page, "settingReducedMotion", "false");
    await waitForDebugValue(page, "settingSpaceConfirm", "true");

    await clickScenePoint(page, 840, 282);
    await waitForDebugValue(page, "settingMaster", "90");
    await clickScenePoint(page, 840, 372);
    await waitForDebugValue(page, "settingMusic", "70");
    await clickScenePoint(page, 840, 462);
    await waitForDebugValue(page, "settingSfx", "90");
    await clickScenePoint(page, 1360, 282);
    await waitForDebugValue(page, "settingDisplay", "high_contrast");
    await clickScenePoint(page, 1360, 372);
    await waitForDebugValue(page, "settingLargeText", "true");
    await clickScenePoint(page, 1360, 462);
    await waitForDebugValue(page, "settingReducedMotion", "true");
    await clickScenePoint(page, 1360, 640);
    await waitForDebugValue(page, "settingSpaceConfirm", "false");

    const changedSave = await readDebugSave(page);
    validateSaveSnapshot(changedSave, "settings changed save");
    if (
      changedSave.settings.volumeMaster !== 0.9
      || changedSave.settings.volumeMusic !== 0.7
      || changedSave.settings.volumeSfx !== 0.9
      || changedSave.settings.displayMode !== "high_contrast"
      || changedSave.settings.largeText !== true
      || changedSave.settings.reducedMotion !== true
      || changedSave.settings.spaceConfirm !== false
    ) {
      throw new Error(`settings did not persist expected values: ${JSON.stringify(changedSave.settings)}`);
    }

    await page.goto(new URL("/?debug=1&entry=town", baseUrl).href, { waitUntil: "networkidle" });
    await waitForDebugScene(page, "TownScene");
    await waitForDebugValue(page, "settingDisplay", "high_contrast");
    await waitForDebugValue(page, "settingSpaceConfirm", "false");
    await pressAndSettle(page, "Space");
    const afterSpace = await getDebugMap(page);
    if (afterSpace.phase !== "town") {
      throw new Error(`Space confirm setting did not block Space on Town: phase=${afterSpace.phase}`);
    }

    await clickScenePoint(page, 1010, 806);
    await waitForDebugScene(page, "SettingsScene");
    await clickScenePoint(page, 1626, 696);
    await waitForDebugValue(page, "settingMaster", "80");
    await waitForDebugValue(page, "settingDisplay", "standard");
    await waitForDebugValue(page, "settingSpaceConfirm", "true");
    await clickScenePoint(page, 1570, 890);
    await waitForDebugScene(page, "TownScene");
    await pressAndSettle(page, "Space");
    await waitForDebugValue(page, "phase", "world_map");
  });
}

async function checkUiSkinStates() {
  await withDebugPage("/?debug=1&entry=town&resetSave=1", "TownScene", async (page) => {
    await clickScenePoint(page, 1010, 806);
    await waitForDebugScene(page, "SettingsScene");
    await assertSceneTextLayout(page, "SettingsScene");
    await waitForDebugValue(page, "uiSkin", "button+slot+tooltip");
    const settingsHoverTargets = [
      { x: 840, y: 282, label: "settings-volume-master" },
      { x: 840, y: 372, label: "settings-volume-music" },
      { x: 840, y: 462, label: "settings-volume-sfx" },
      { x: 1360, y: 282, label: "settings-display-mode" },
      { x: 1360, y: 372, label: "settings-large-text" },
      { x: 1360, y: 462, label: "settings-reduced-motion" },
      { x: 1360, y: 640, label: "settings-space-confirm" },
      { x: 1626, y: 696, label: "settings-reset-defaults" },
      { x: 1626, y: 520, label: "settings-reset-save" },
      { x: 1570, y: 890, label: "settings-return-town" }
    ];
    for (const target of settingsHoverTargets) {
      await assertHoverUsesRasterImageOnly(
        page,
        target.x,
        target.y,
        target.label,
        "ui_hover_action_seal_concept",
        "SettingsScene"
      );
    }
    await captureUiSkinScreenshot(page, "settings-controls");
  });

  await withDebugPage("/?debug=1&data=release&entry=event&resetSave=1&stage=stage_sunny_gate&playerHp=1", "EventScene", async (page) => {
    await waitForDebugValue(page, "uiSkin", "button+slot+tooltip");
    await waitForDebugValue(page, "event", "event_bubble_shop");
    await waitForDebugValue(page, "playerHp", "1");
    await assertRasterImageVisibleOnly(page, "event-disabled-choice", rasterDisabledImageKey, "EventScene");
    await captureUiSkinScreenshot(page, "event-disabled-choice");
    await clickScenePoint(page, 1450, 848);
    await page.waitForTimeout(180);
    const state = await getDebugMap(page);
    if (state.phase !== "event" || state.eventChoice !== "none") {
      throw new Error(`Disabled event choice should not advance: phase=${state.phase}, eventChoice=${state.eventChoice}`);
    }
  });
}

async function checkSaveReload() {
  await withDebugPage("/?debug=1&entry=town&resetSave=1", "TownScene", async (page) => {
    await clickScenePoint(page, 1010, 642);
    await waitForDebugValue(page, "phase", "world_map");
    await clickScenePoint(page, 1576, 970);
    await waitForDebugValue(page, "phase", "dungeon");
    await clickScenePoint(page, 1010, 582);
    await waitForDebugValue(page, "phase", "combat");
    await clickScenePoint(page, 540, 836);
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

    await clickScenePoint(page, 1010, 724);
    await waitForDebugScene(page, "TownScene");
    await waitForDebugValue(page, "phase", "town");
    await waitForDebugValue(page, "saveCompleted", "none");
    const resetSave = await readDebugSave(page);
    validateSaveSnapshot(resetSave, "user reset save");
    if (resetSave.currentRun.phase !== "town" || resetSave.profile.completedStages.length !== 0) {
      throw new Error(`user reset did not restore an initial save: phase=${resetSave.currentRun.phase}, completed=${resetSave.profile.completedStages.join(",")}`);
    }
  });

  await withDebugPage("/?debug=1&entry=combat&resetSave=1", "CombatScene", async (page) => {
    await clickScenePoint(page, 540, 836);
    await waitForDebugValue(page, "enemyHp", "17");
    const originalSave = await readDebugSave(page);
    validateSaveSnapshot(originalSave, "legacy migration source save");

    const legacySave = {
      ...originalSave,
      saveVersion: 0,
      currentRun: {
        ...originalSave.currentRun,
        playerEnergy: "bad-energy",
        colorsPlayedThisTurn: "bad-colors",
        prismPathTriggeredThisTurn: "bad-prism"
      },
      settings: {
        ...originalSave.settings,
        volumeMaster: "loud"
      }
    };
    await writeDebugSave(page, legacySave);
    await page.goto(new URL("/?debug=1&entry=town", baseUrl).href, { waitUntil: "networkidle" });
    await waitForDebugScene(page, "CombatScene");
    await waitForDebugValue(page, "phase", "combat");
    await waitForDebugValue(page, "enemyHp", "17");
    await waitForDebugValue(page, "saveVersion", "1");
    const migratedSave = await readDebugSave(page);
    validateSaveSnapshot(migratedSave, "legacy migrated save");
    if (migratedSave.currentRun.playerEnergy !== 3 || migratedSave.currentRun.colorsPlayedThisTurn.length !== 0 || migratedSave.settings.volumeMaster !== 0.8) {
      throw new Error(`legacy migrated save did not normalize invalid fields: ${JSON.stringify({
        playerEnergy: migratedSave.currentRun.playerEnergy,
        colorsPlayedThisTurn: migratedSave.currentRun.colorsPlayedThisTurn,
        volumeMaster: migratedSave.settings.volumeMaster
      })}`);
    }
  });

  await withPreloadedDebugStorage("not valid json", "/?debug=1&entry=town", "TownScene", async (page) => {
    await waitForDebugValue(page, "phase", "town");
    await waitForDebugValue(page, "saveVersion", "1");
    await waitForDebugValue(page, "saveCompleted", "none");
    validateSaveSnapshot(await readDebugSave(page), "corrupt recovered save");
  });

  await withPreloadedDebugStorage(
    JSON.stringify({ saveVersion: 999, profile: { completedStages: ["should_not_survive"] } }),
    "/?debug=1&entry=town",
    "TownScene",
    async (page) => {
      await waitForDebugValue(page, "phase", "town");
      await waitForDebugValue(page, "saveCompleted", "none");
      validateSaveSnapshot(await readDebugSave(page), "future-version recovered save");
    }
  );

  await withDebugPage("/?debug=1&entry=boss&resetSave=1&enemyHp=8&handCard=card_sun_jab&handCard=card_sun_jab&handCard=card_sun_jab&handCard=card_fold_guard&handCard=card_page_step", "BossScene", async (page) => {
    await playUntilPhase(page, ["reward"], 20);
    await waitForDebugValue(page, "phase", "reward");
    await pressAndSettle(page, "Enter");
    await waitForDebugValue(page, "phase", "result");
    await waitForDebugValue(page, "saveCompleted", "stage_lantern_foyer");
    const clearedSave = await readDebugSave(page);
    validateSaveSnapshot(clearedSave, "clear result save");
    if (!clearedSave.currentRun.completedStages.includes("stage_lantern_foyer") || !clearedSave.profile.completedStages.includes("stage_lantern_foyer")) {
      throw new Error("clear result save did not persist completed stage in run and profile");
    }
  });

  await withDebugPage("/?debug=1&entry=combat&resetSave=1&playerHp=1", "CombatScene", async (page) => {
    await pressAndSettle(page, "KeyE");
    await waitForDebugValue(page, "phase", "result");
    await waitForDebugValue(page, "playerHp", "0");
    await waitForDebugValue(page, "saveCompleted", "none");
    const defeatSave = await readDebugSave(page);
    validateSaveSnapshot(defeatSave, "defeat result save");
    if (defeatSave.currentRun.phase !== "result" || defeatSave.currentRun.hp !== 0 || defeatSave.profile.completedStages.length !== 0) {
      throw new Error(`defeat result save is inconsistent: phase=${defeatSave.currentRun.phase}, hp=${defeatSave.currentRun.hp}, completed=${defeatSave.profile.completedStages.join(",")}`);
    }
  });
}

async function checkProductionSaveReset() {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = bindErrorCapture(page);
  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForSelector("canvas", { timeout: 10000 });
    await assertSceneTextLayout(page, "TownScene");

    const productionSave = await readProductionSave(page);
    validateSaveSnapshot(productionSave, "production initial save");
    productionSave.profile.completedStages = ["stage_lantern_foyer"];
    await writeProductionSave(page, productionSave);
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await assertSceneTextLayout(page, "TownScene");
    const seededSave = await readProductionSave(page);
    if (!seededSave.profile.completedStages.includes("stage_lantern_foyer")) {
      throw new Error("production seeded save did not reload before reset");
    }

    await clickScenePoint(page, 1010, 724);
    await page.waitForFunction(
      (saveKey) => {
        const raw = localStorage.getItem(saveKey);
        if (!raw) return false;
        const save = JSON.parse(raw);
        return save?.currentRun?.phase === "town" && save?.profile?.completedStages?.length === 0;
      },
      productionSaveKey,
      { timeout: 10000 }
    );
    validateSaveSnapshot(await readProductionSave(page), "production reset save");
    assertNoBrowserErrors("production save reset", errors);
  } finally {
    await page.close();
  }
}

async function checkReleaseGemRuneEffect() {
  await withDebugPage(
    "/?debug=1&data=release&entry=rune_bench&resetSave=1&room=stage_sunny_gate_room_1_combat&grantRune=gem_morning_edge",
    "RuneBenchScene",
    async (page) => {
      await waitForDebugValue(page, "dataMode", "release");
      await waitForDebugValue(page, "runesTotal", "58");
      await pressAndSettle(page, "Enter");
      await waitForDebugValue(page, "phase", "combat");
      await waitForDebugText(page, "equipped=card_sunbean_punch:gem_morning_edge");
      await pressAndSettle(page, "Digit1");
      await waitForDebugValue(page, "enemyHp", "12");
    }
  );
}

async function checkReleaseEnemyIntentBatch() {
  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&enemy=enemy_cloud_trick",
    "CombatScene",
    async (page) => {
      await waitForDebugValue(page, "dataMode", "release");
      await waitForDebugValue(page, "enemy", "enemy_cloud_trick");
      await pressAndSettle(page, "KeyE");
      await waitForDebugValue(page, "playerMark", "1");
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&enemy=enemy_ribbon_buddy",
    "CombatScene",
    async (page) => {
      await waitForDebugValue(page, "dataMode", "release");
      await waitForDebugValue(page, "enemy", "enemy_ribbon_buddy");
      await pressAndSettle(page, "KeyE");
      await waitForDebugValue(page, "nextCardCostPenalty", "1");
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&enemy=enemy_prism_trick",
    "CombatScene",
    async (page) => {
      await waitForDebugValue(page, "dataMode", "release");
      await waitForDebugValue(page, "enemy", "enemy_prism_trick");
      await pressAndSettle(page, "KeyE");
      await waitForDebugValue(page, "playerWeak", "1");
    }
  );
}

async function checkReleaseStageRouteBatch() {
  await withDebugPage(
    "/?debug=1&data=release&entry=dungeon&resetSave=1&stage=stage_rainbow_keep",
    "DungeonScene",
    async (page) => {
      await waitForDebugValue(page, "dataMode", "release");
      await waitForDebugValue(page, "stage", "stage_rainbow_keep");
      await waitForDebugText(page, "route=combat>elite>event>combat>shop>rest>elite>reward>event>rest>boss");
    }
  );
}

async function checkReleaseEventBatch() {
  await logSmokeProgress("checkReleaseEventBatch first event page");
  await withDebugPage(
    "/?debug=1&data=release&entry=event&resetSave=1&stage=stage_sunny_gate",
    "EventScene",
    async (page) => {
      await logSmokeProgress("checkReleaseEventBatch first page metadata");
      await waitForDebugValue(page, "dataMode", "release");
      await waitForDebugValue(page, "eventsTotal", "10");
      await waitForDebugValue(page, "phase", "event");
      await waitForDebugValue(page, "event", "event_bubble_shop");
      await waitForDebugValue(page, "eventChoices", "4");
      await waitForDebugText(page, "eventCosts=spend_currency|spend_currency|free|spend_hp");
      await waitForDebugText(page, "eventRewards=card|rune+heal|currency|relic+currency");
      await logSmokeProgress("checkReleaseEventBatch first page screenshot");
      await captureEventScreenshot(page, "release-bubble-shop");
      await logSmokeProgress("checkReleaseEventBatch first page choose Digit3");
      await pressAndSettle(page, "Digit3");
      await waitForDebugValue(page, "phase", "combat");
      await waitForDebugValue(page, "eventChoice", "event_bubble_shop_choice_3");
      await waitForDebugValue(page, "enemy", "enemy_cloud_buddy");
      await waitForDebugValue(page, "playerGold", "104");
    }
  );

  await logSmokeProgress("checkReleaseEventBatch second event page");
  await withDebugPage(
    "/?debug=1&data=release&entry=event&resetSave=1&stage=stage_sunny_gate",
    "EventScene",
    async (page) => {
      await logSmokeProgress("checkReleaseEventBatch second page metadata");
      await waitForDebugValue(page, "event", "event_bubble_shop");
      await logSmokeProgress("checkReleaseEventBatch second page choose Digit4");
      await pressAndSettle(page, "Digit4");
      await waitForDebugValue(page, "eventChoice", "event_bubble_shop_choice_4");
      await waitForDebugValue(page, "playerHp", "60");
      await waitForDebugValue(page, "playerGold", "92");
      await waitForDebugText(page, "relics=relic_round_lantern");
    }
  );
}

async function checkReleasePassiveBatch() {
  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&grantRelic=relic_round_lantern&grantRelic=relic_cloud_socks",
    "CombatScene",
    async (page) => {
      await waitForDebugValue(page, "dataMode", "release");
      await waitForDebugValue(page, "playerBlock", "4");
      await waitForDebugValue(page, "playerEnergy", "4");
      await waitForDebugText(page, "relics=relic_round_lantern,relic_cloud_socks");
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=reward&resetSave=1&rewardPool=reward_pool_release_cards&grantRelic=relic_ribbon_box",
    "RewardScene",
    async (page) => {
      await waitForDebugValue(page, "dataMode", "release");
      const state = await getDebugMap(page);
      const rewards = (state.rewards ?? "").split(",").filter((item) => item && item !== "none");
      if (rewards.length < 4) {
        throw new Error(`Release passive reward option count failed: expected 4, got ${rewards.length}`);
      }
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=event&resetSave=1&stage=stage_sunny_gate&grantRelic=relic_candy_pouch",
    "EventScene",
    async (page) => {
      await waitForDebugValue(page, "event", "event_bubble_shop");
      await pressAndSettle(page, "Digit3");
      await waitForDebugValue(page, "phase", "combat");
      await waitForDebugValue(page, "playerGold", "109");
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&playerHp=60&enemyHp=8&grantRelic=relic_mint_thermos",
    "CombatScene",
    async (page) => {
      await waitForDebugValue(page, "playerHp", "60");
      await waitForDebugValue(page, "enemyHp", "8");
      await pressAndSettle(page, "Digit1");
      await waitForDebugValue(page, "phase", "reward");
      await waitForDebugValue(page, "playerHp", "64");
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&grantArcana=arcana_star_bakery",
    "CombatScene",
    async (page) => {
      await waitForDebugText(page, "arcanas=arcana_star_bakery");
      await pressAndSettle(page, "Digit4");
      await waitForDebugValue(page, "playerGold", "82");
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&grantArcana=arcana_cloud_parade",
    "CombatScene",
    async (page) => {
      await waitForDebugText(page, "arcanas=arcana_cloud_parade");
      await pressAndSettle(page, "Digit3");
      await waitForDebugValue(page, "playerBlock", "7");
      await waitForDebugValue(page, "enemyHp", "20");
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&grantRelic=relic_sun_cookie",
    "CombatScene",
    async (page) => {
      await waitForDebugText(page, "relics=relic_sun_cookie");
      await pressAndSettle(page, "Digit2");
      await waitForDebugValue(page, "enemyHp", "16");
      await waitForDebugValue(page, "playerEnergy", "3");
      await waitForDebugValue(page, "firstExpensiveFree", "false");
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&grantRelic=relic_sleepy_pillow&handCard=card_sunbean_punch&handCard=card_morning_daybreak&handCard=card_cloud_cushion&handCard=card_mint_spark&handCard=card_morning_parcel&grantCard=card_sprout_guard&grantCard=card_morning_breakfast&grantCard=card_peach_softguard&grantCard=card_mint_leafjab",
    "CombatScene",
    async (page) => {
      await pressAndSettle(page, "KeyE");
      await waitForDebugValue(page, "turn", "2");
      const state = await getDebugMap(page);
      const hand = (state.hand ?? "").split(",").filter(Boolean);
      if (hand[0] !== "card_sunbean_punch" || !hand.includes("card_sprout_guard")) {
        throw new Error(`Release retain relic failed: hand=${state.hand}`);
      }
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=reward&resetSave=1&rewardPool=reward_pool_release_runes&grantRelic=relic_bubble_lens",
    "RewardScene",
    async (page) => {
      const state = await getDebugMap(page);
      const rewards = (state.rewards ?? "").split(",").filter((item) => item && item !== "none");
      if (rewards.length < 4) {
        throw new Error(`Release gem reward option count failed: expected 4, got ${rewards.length}`);
      }
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=reward&resetSave=1&stage=stage_rainbow_keep&room=stage_rainbow_keep_room_2_elite&rewardPool=reward_pool_release_relics&grantRelic=relic_elite_sticker",
    "RewardScene",
    async (page) => {
      const state = await getDebugMap(page);
      const rewards = (state.rewards ?? "").split(",").filter((item) => item && item !== "none");
      if (rewards.length < 4 || !rewards.some((rewardId) => rewardId.startsWith("reward_release_card_"))) {
        throw new Error(`Release elite sticker card supplement failed: rewards=${state.rewards}`);
      }
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=reward&resetSave=1&rewardPool=reward_pool_release_stage_clear&grantRelic=relic_final_picnic",
    "RewardScene",
    async (page) => {
      const state = await getDebugMap(page);
      const rewards = (state.rewards ?? "").split(",").filter((item) => item && item !== "none");
      if (rewards.length < 4) {
        throw new Error(`Release boss reward bonus failed: expected 4, got ${rewards.length}`);
      }
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=boss&resetSave=1&enemyHp=8&grantRelic=relic_final_picnic&handCard=card_sunbean_punch&handCard=card_sunbean_punch&handCard=card_sunbean_punch&handCard=card_cloud_cushion&handCard=card_mint_spark",
    "BossScene",
    async (page) => {
      await playUntilPhase(page, ["reward"], 10);
      await waitForDebugValue(page, "phase", "reward");
      const state = await getDebugMap(page);
      const rewards = (state.rewards ?? "").split(",").filter((item) => item && item !== "none");
      if (rewards.length < 4) {
        throw new Error(`Release boss victory reward bonus failed: expected 4, got ${rewards.length}`);
      }
      await pressAndSettle(page, "Enter");
      await waitForDebugValue(page, "phase", "result");
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=dungeon&resetSave=1&stage=stage_rainbow_keep&grantRelic=relic_soft_compass",
    "DungeonScene",
    async (page) => {
      await waitForDebugValue(page, "revealedRoom", "elite");
      await captureDungeonScreenshot(page, "release-soft-compass");
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&enemyHp=22&grantArcana=arcana_ribbon_firework&handCard=card_mint_spark&handCard=card_mint_spark&handCard=card_mint_spark&handCard=card_mint_spark&handCard=card_mint_spark",
    "CombatScene",
    async (page) => {
      for (let index = 0; index < 5; index += 1) {
        await pressAndSettle(page, "Digit1");
      }
      await waitForDebugValue(page, "enemyHp", "12");
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&playerHp=60&grantArcana=arcana_mint_rest&handCard=card_cloud_cushion&handCard=card_cloud_cushion&handCard=card_cloud_cushion&handCard=card_mint_spark&handCard=card_morning_breakfast",
    "CombatScene",
    async (page) => {
      await pressAndSettle(page, "Digit1");
      await pressAndSettle(page, "Digit1");
      await pressAndSettle(page, "Digit1");
      await waitForDebugValue(page, "guardCardsPlayed", "3");
      await waitForDebugValue(page, "playerHp", "63");
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&grantArcana=arcana_prism_path&handCard=card_sunbean_punch&handCard=card_cloud_cushion&handCard=card_mint_spark&handCard=card_peach_softguard&handCard=card_morning_breakfast&grantCard=card_sprout_guard",
    "CombatScene",
    async (page) => {
      await pressAndSettle(page, "Digit1");
      await pressAndSettle(page, "Digit1");
      await pressAndSettle(page, "Digit1");
      await pressAndSettle(page, "Digit1");
      await waitForDebugValue(page, "colorsPlayed", "coral,sky,mint,peach");
      const state = await getDebugMap(page);
      const hand = (state.hand ?? "").split(",").filter(Boolean);
      if (hand.length < 4 || !hand.includes("card_morning_parcel")) {
        throw new Error(`Release prism path draw failed: hand=${state.hand}`);
      }
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&grantArcana=arcana_cloud_blanket",
    "CombatScene",
    async (page) => {
      await pressAndSettle(page, "Digit3");
      await pressAndSettle(page, "KeyE");
      await waitForDebugValue(page, "turn", "2");
      await waitForDebugValue(page, "playerBlock", "2");
    }
  );

  await withDebugPage(
    "/?debug=1&data=release&entry=combat&resetSave=1&playerHp=40&grantArcana=arcana_sprout_song&handCard=card_morning_breakfast&handCard=card_sunbean_punch&handCard=card_cloud_cushion&handCard=card_mint_spark&handCard=card_morning_parcel",
    "CombatScene",
    async (page) => {
      await pressAndSettle(page, "Digit1");
      await waitForDebugValue(page, "playerHp", "42");
      await waitForDebugValue(page, "enemyMark", "1");
    }
  );
}

async function checkSceneFlowAndRuneEffect() {
  await withDebugPage("/?debug=1&entry=town&resetSave=1", "TownScene", async (page) => {
    await playUntilPhase(page, ["combat"], 8);
    await playUntilPhase(page, ["reward"], 40);
    await pressAndSettle(page, "Enter");
    await waitForDebugValue(page, "phase", "event");
    await waitForDebugValue(page, "event", "event_rune_bench");
    await pressAndSettle(page, "Enter");
    await waitForDebugValue(page, "phase", "rune_bench");
    await pressAndSettle(page, "Enter");
    await waitForDebugValue(page, "phase", "combat");
    await waitForDebugText(page, "equipped=card_sun_jab:rune_paper_spark");
    await pressAndSettle(page, "Digit1");
    await waitForDebugValue(page, "enemyHp", "9");
  });
}

async function checkCoreRunLoop() {
  await withDebugPage(
    "/?debug=1&data=release&entry=town&resetSave=1&stage=stage_sunny_gate&grantCard=card_mint_leafjab&grantCard=card_morning_breakfast&grantCard=card_peach_softguard",
    "TownScene",
    async (page) => {
      await waitForDebugValue(page, "dataMode", "release");
      await waitForDebugText(page, "route=combat>combat>event>elite>reward>rest>boss");
      const visited = await playTrackingUntilPhase(page, ["result"], 260);
      const finalState = await getDebugMap(page);
      const combatVisits = visited.filter((item) => item.phase === "combat").length;
      const rewardVisits = visited.filter((item) => item.phase === "reward").length;
      const maxRoomIndex = Math.max(...visited.map((item) => Number(item.roomIndex ?? 0)));

      if (combatVisits < 3 || rewardVisits < 3 || !visited.some((item) => item.phase === "event") || !visited.some((item) => item.phase === "rune_bench") || !visited.some((item) => item.phase === "boss")) {
        throw new Error(`Release run loop missed required phases: ${visited.map((item) => `${item.phase}@${item.roomIndex}`).join(">")}`);
      }
      if (maxRoomIndex < 6) {
        throw new Error(`Release run loop did not reach the boss room: maxRoomIndex=${maxRoomIndex}`);
      }
      if (finalState.phase !== "result" || finalState.playerHp === "0" || finalState.saveCompleted !== "stage_sunny_gate") {
        throw new Error(`Release run loop did not finish as a stage clear: phase=${finalState.phase}, hp=${finalState.playerHp}, saveCompleted=${finalState.saveCompleted}`);
      }
      await waitForDebugText(page, "unlockedStages=stage_sunny_gate,stage_lavender_hall");

      await pressAndSettle(page, "Enter");
      await waitForDebugValue(page, "phase", "town");
      await waitForDebugValue(page, "saveCompleted", "stage_sunny_gate");
      await waitForDebugText(page, "unlockedStages=stage_sunny_gate,stage_lavender_hall");
      await pressAndSettle(page, "Enter");
      await waitForDebugValue(page, "phase", "world_map");
      await clickScenePoint(page, 808, 756);
      await waitForDebugValue(page, "stage", "stage_lavender_hall");
      await waitForDebugText(page, "log=flow:stage_select:stage_lavender_hall");
    }
  );

  await withDebugPage("/?debug=1&entry=combat&resetSave=1&playerHp=1", "CombatScene", async (page) => {
    await waitForDebugValue(page, "playerHp", "1");
    await pressAndSettle(page, "KeyE");
    await waitForDebugValue(page, "phase", "result");
    await waitForDebugValue(page, "playerHp", "0");
    await waitForDebugText(page, "log=combat:defeat:");
    await waitForDebugValue(page, "saveCompleted", "none");
    await pressAndSettle(page, "Enter");
    await waitForDebugValue(page, "phase", "town");
    await waitForDebugValue(page, "saveCompleted", "none");
    await pressAndSettle(page, "Enter");
    await waitForDebugValue(page, "phase", "world_map");
  });
}

async function checkBossResultFlow() {
  await withDebugPage("/?debug=1&entry=boss&resetSave=1", "BossScene", async (page) => {
    await playUntilDebugValue(page, "bossPhaseTriggered", "true", 80);
    await waitForDebugValue(page, "effect", "effect_stage_spotlight");
    await captureEffectScreenshot(page, "stage-spotlight");
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
    await assertSceneTextLayout(page, expectedScene);
    await action(page);
    assertNoBrowserErrors(expectedScene, errors);
  } finally {
    await page.close();
  }
}

async function withPreloadedDebugStorage(rawSave, pathname, expectedScene, action) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = bindErrorCapture(page);
  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate((raw) => {
      localStorage.setItem("paper_theater_card_crawler_debug_save_v1", raw);
    }, rawSave);
    await page.goto(new URL(pathname, baseUrl).href, { waitUntil: "networkidle" });
    await page.waitForSelector("canvas", { timeout: 10000 });
    await waitForDebugScene(page, expectedScene);
    await assertSceneTextLayout(page, expectedScene);
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

    if (state.phase === "town" || state.phase === "world_map" || state.phase === "dungeon" || state.phase === "event" || state.phase === "reward" || state.phase === "rune_bench") {
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

async function playTrackingUntilPhase(page, targetPhases, limit) {
  const visited = [];
  for (let step = 0; step < limit; step += 1) {
    const state = await getDebugMap(page);
    visited.push({ phase: state.phase, roomIndex: state.roomIndex, log: state.log });
    if (targetPhases.includes(state.phase)) {
      return visited;
    }

    if (state.phase === "town" || state.phase === "world_map" || state.phase === "dungeon" || state.phase === "event" || state.phase === "reward" || state.phase === "rune_bench") {
      await pressAndSettle(page, "Enter");
    } else if (state.phase === "combat" || state.phase === "boss") {
      await playUsefulCombatAction(page, state);
    } else {
      throw new Error(`Unexpected phase while tracking: ${state.phase}`);
    }
  }

  const state = await getDebugMap(page);
  throw new Error(`Did not reach ${targetPhases.join(" or ")}; last phase=${state.phase}, log=${state.log}, visited=${visited.map((item) => `${item.phase}@${item.roomIndex}`).join(">")}`);
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
  await page.waitForTimeout(80);
}

async function captureEffectScreenshot(page, label) {
  const screenshot = await page.screenshot({
    path: path.join(tmpDir, `phaser-effect-${label}.png`),
    fullPage: false
  });
  if (screenshot.length < 15000) {
    throw new Error(`Effect screenshot ${label} looks empty`);
  }
}

async function captureCharacterSpriteScreenshot(page, label) {
  const screenshot = await page.screenshot({
    path: path.join(tmpDir, `phaser-character-sprite-${label}.png`),
    fullPage: false
  });
  if (screenshot.length < 20000) {
    throw new Error(`${label}: character sprite screenshot looks empty`);
  }
}

async function captureUiPanelScreenshot(page, label) {
  const screenshot = await page.screenshot({
    path: path.join(tmpDir, `phaser-ui-panel-${label}.png`),
    fullPage: false
  });
  if (screenshot.length < 20000) {
    throw new Error(`${label}: UI panel screenshot looks empty`);
  }
}

async function captureUiSkinScreenshot(page, label) {
  const screenshot = await page.screenshot({
    path: path.join(tmpDir, `phaser-ui-skin-${label}.png`),
    fullPage: false
  });
  if (screenshot.length < 20000) {
    throw new Error(`${label}: UI skin screenshot looks empty`);
  }
}

async function captureEventScreenshot(page, label) {
  const screenshot = await page.screenshot({
    path: path.join(tmpDir, `phaser-event-${label}.png`),
    fullPage: false
  });
  if (screenshot.length < 20000) {
    throw new Error(`${label}: event screenshot looks empty`);
  }
}

async function captureDungeonScreenshot(page, label) {
  const screenshot = await page.screenshot({
    path: path.join(tmpDir, `phaser-dungeon-${label}.png`),
    fullPage: false
  });
  if (screenshot.length < 20000) {
    throw new Error(`${label}: dungeon screenshot looks empty`);
  }
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

async function assertHoverKeepsCanvasStable(page, sceneX, sceneY, label) {
  const canvas = page.locator("canvas");
  const canvasBox = await canvas.boundingBox();
  if (!canvasBox) {
    throw new Error(`${label}: missing Phaser canvas for hover smoke`);
  }

  await page.mouse.move(canvasBox.x + 8, canvasBox.y + 8);
  await page.waitForTimeout(80);
  const before = await canvas.screenshot();

  await page.mouse.move(
    canvasBox.x + (sceneX / 1920) * canvasBox.width,
    canvasBox.y + (sceneY / 1080) * canvasBox.height
  );
  await page.waitForTimeout(120);
  const after = await canvas.screenshot({
    path: path.join(tmpDir, `phaser-hover-${label}.png`)
  });
  const delta = countByteDelta(before, after);
  if (delta > 200) {
    throw new Error(`${label}: raster hover drew visible overlay; byteDelta=${delta}`);
  }
}

async function assertHoverUsesRasterImageOnly(page, sceneX, sceneY, label, expectedImageKey, sceneName = "CombatScene", expectedDownImageKey = rasterDownPressedImageKey) {
  const canvas = page.locator("canvas");
  const canvasBox = await canvas.boundingBox();
  if (!canvasBox) {
    throw new Error(`${label}: missing Phaser canvas for raster hover smoke`);
  }

  await page.mouse.move(canvasBox.x + 8, canvasBox.y + 8);
  await page.waitForTimeout(80);
  const before = await canvas.screenshot();

  await page.mouse.move(
    canvasBox.x + (sceneX / 1920) * canvasBox.width,
    canvasBox.y + (sceneY / 1080) * canvasBox.height
  );
  await page.waitForTimeout(120);
  const after = await canvas.screenshot({
    path: path.join(tmpDir, `phaser-hover-${label}.png`)
  });
  const delta = countByteDelta(before, after);
  if (delta <= 200) {
    throw new Error(`${label}: raster hover image did not visibly change canvas; byteDelta=${delta}`);
  }

  const audit = await page.evaluate(({ expectedImageKey, rasterOnlySceneUnderlays, sceneName }) => {
    const game = window.__paperGame;
    const activeScene = game?.scene?.getScenes?.(true)?.find((scene) => scene.scene?.key === sceneName)
      ?? game?.scene?.getScene?.(sceneName);
    if (!activeScene) {
      return { ok: false, reason: `${sceneName} is not available for raster hover audit` };
    }

    const underlayKey = rasterOnlySceneUnderlays[sceneName];
    const underlayDepth = Math.max(
      -1,
      ...activeScene.children.list
        .filter((item) => item?.type === "Image" && item.texture?.key === underlayKey && item.visible !== false && item.alpha !== 0)
        .map((item) => item.depth ?? 0)
    );
    const underlayIndex = activeScene.children.list.findIndex((item) => (
      item?.type === "Image" && item.texture?.key === underlayKey && item.visible !== false && item.alpha !== 0
    ));
    const visibleTextCount = activeScene.children.list
      .filter((item) => item?.type === "Text" && item.visible !== false && item.alpha !== 0 && String(item.text ?? "").trim().length > 0)
      .length;
    const visibleRectsAboveUnderlay = activeScene.children.list
      .filter((item) => {
        const fillAlpha = Number(item?.fillAlpha ?? item?.alpha ?? 1);
        const strokeAlpha = Number(item?.strokeAlpha ?? item?.lineAlpha ?? 0);
        const strokeWidth = Number(item?.lineWidth ?? item?.strokeWidth ?? 0);
        return item?.type === "Rectangle"
          && item.visible !== false
          && ((item.depth ?? 0) > underlayDepth || activeScene.children.list.indexOf(item) > underlayIndex)
          && (
            (item?.isFilled && fillAlpha > 0.01)
            || (item?.isStroked && strokeWidth > 0 && strokeAlpha > 0.01)
          );
      })
      .length;
    const hoverImages = activeScene.children.list
      .filter((item) => item?.type === "Image" && item.texture?.key === expectedImageKey && item.visible !== false && (item.alpha ?? 1) > 0.05)
      .length;

    if (underlayDepth < 0) {
      return { ok: false, reason: `${sceneName} raster underlay is not visible` };
    }
    if (hoverImages < 1) {
      return { ok: false, reason: `${expectedImageKey} is not visible on hover` };
    }
    if (visibleTextCount !== 0) {
      return { ok: false, reason: `${sceneName} hover exposed visible text objects: ${visibleTextCount}` };
    }
    if (visibleRectsAboveUnderlay !== 0) {
      return { ok: false, reason: `${sceneName} hover exposed visible rectangles above underlay: ${visibleRectsAboveUnderlay}` };
    }

    return { ok: true, reason: "ok", hoverImages, visibleTextCount, visibleRectsAboveUnderlay };
  }, { expectedImageKey, rasterOnlySceneUnderlays, sceneName });

  if (!audit.ok) {
    throw new Error(`${label}: ${audit.reason}`);
  }

  await page.mouse.down();
  await page.waitForTimeout(120);
  const downAfter = await canvas.screenshot({
    path: path.join(tmpDir, `phaser-down-${label}.png`)
  });
  const downDelta = countByteDelta(before, downAfter);
  if (downDelta <= 200) {
    throw new Error(`${label}: raster down image did not visibly change canvas; byteDelta=${downDelta}`);
  }

  const downAudit = await page.evaluate(({ expectedImageKey, rasterOnlySceneUnderlays, sceneName }) => {
    const game = window.__paperGame;
    const activeScene = game?.scene?.getScenes?.(true)?.find((scene) => scene.scene?.key === sceneName)
      ?? game?.scene?.getScene?.(sceneName);
    if (!activeScene) {
      return { ok: false, reason: `${sceneName} is not available for raster down audit` };
    }

    const underlayKey = rasterOnlySceneUnderlays[sceneName];
    const underlayDepth = Math.max(
      -1,
      ...activeScene.children.list
        .filter((item) => item?.type === "Image" && item.texture?.key === underlayKey && item.visible !== false && item.alpha !== 0)
        .map((item) => item.depth ?? 0)
    );
    const underlayIndex = activeScene.children.list.findIndex((item) => (
      item?.type === "Image" && item.texture?.key === underlayKey && item.visible !== false && item.alpha !== 0
    ));
    const visibleTextCount = activeScene.children.list
      .filter((item) => item?.type === "Text" && item.visible !== false && item.alpha !== 0 && String(item.text ?? "").trim().length > 0)
      .length;
    const visibleRectsAboveUnderlay = activeScene.children.list
      .filter((item) => {
        const fillAlpha = Number(item?.fillAlpha ?? item?.alpha ?? 1);
        const strokeAlpha = Number(item?.strokeAlpha ?? item?.lineAlpha ?? 0);
        const strokeWidth = Number(item?.lineWidth ?? item?.strokeWidth ?? 0);
        return item?.type === "Rectangle"
          && item.visible !== false
          && ((item.depth ?? 0) > underlayDepth || activeScene.children.list.indexOf(item) > underlayIndex)
          && (
            (item?.isFilled && fillAlpha > 0.01)
            || (item?.isStroked && strokeWidth > 0 && strokeAlpha > 0.01)
          );
      })
      .length;
    const downImages = activeScene.children.list
      .filter((item) => item?.type === "Image" && item.texture?.key === expectedImageKey && item.visible !== false && (item.alpha ?? 1) > 0.05)
      .length;

    if (underlayDepth < 0) {
      return { ok: false, reason: `${sceneName} raster underlay is not visible` };
    }
    if (downImages < 1) {
      return { ok: false, reason: `${expectedImageKey} is not visible on down` };
    }
    if (visibleTextCount !== 0) {
      return { ok: false, reason: `${sceneName} down exposed visible text objects: ${visibleTextCount}` };
    }
    if (visibleRectsAboveUnderlay !== 0) {
      return { ok: false, reason: `${sceneName} down exposed visible rectangles above underlay: ${visibleRectsAboveUnderlay}` };
    }

    return { ok: true, reason: "ok", downImages, visibleTextCount, visibleRectsAboveUnderlay };
  }, { expectedImageKey: expectedDownImageKey, rasterOnlySceneUnderlays, sceneName });

  await page.mouse.move(canvasBox.x + 8, canvasBox.y + 8);
  await page.waitForTimeout(80);
  await page.mouse.up();

  if (!downAudit.ok) {
    throw new Error(`${label}: ${downAudit.reason}`);
  }
}

async function assertRasterImageVisibleOnly(page, label, expectedImageKey, sceneName) {
  const audit = await page.evaluate(({ expectedImageKey, rasterOnlySceneUnderlays, sceneName }) => {
    const game = window.__paperGame;
    const activeScene = game?.scene?.getScenes?.(true)?.find((scene) => scene.scene?.key === sceneName)
      ?? game?.scene?.getScene?.(sceneName);
    if (!activeScene) {
      return { ok: false, reason: `${sceneName} is not available for raster image audit` };
    }

    const underlayKey = rasterOnlySceneUnderlays[sceneName];
    const underlayDepth = Math.max(
      -1,
      ...activeScene.children.list
        .filter((item) => item?.type === "Image" && item.texture?.key === underlayKey && item.visible !== false && item.alpha !== 0)
        .map((item) => item.depth ?? 0)
    );
    const underlayIndex = activeScene.children.list.findIndex((item) => (
      item?.type === "Image" && item.texture?.key === underlayKey && item.visible !== false && item.alpha !== 0
    ));
    const visibleTextCount = activeScene.children.list
      .filter((item) => item?.type === "Text" && item.visible !== false && item.alpha !== 0 && String(item.text ?? "").trim().length > 0)
      .length;
    const visibleRectsAboveUnderlay = activeScene.children.list
      .filter((item) => {
        const fillAlpha = Number(item?.fillAlpha ?? item?.alpha ?? 1);
        const strokeAlpha = Number(item?.strokeAlpha ?? item?.lineAlpha ?? 0);
        const strokeWidth = Number(item?.lineWidth ?? item?.strokeWidth ?? 0);
        return item?.type === "Rectangle"
          && item.visible !== false
          && ((item.depth ?? 0) > underlayDepth || activeScene.children.list.indexOf(item) > underlayIndex)
          && (
            (item?.isFilled && fillAlpha > 0.01)
            || (item?.isStroked && strokeWidth > 0 && strokeAlpha > 0.01)
          );
      })
      .length;
    const visibleImages = activeScene.children.list
      .filter((item) => item?.type === "Image" && item.texture?.key === expectedImageKey && item.visible !== false && (item.alpha ?? 1) > 0.05)
      .length;

    if (underlayDepth < 0) {
      return { ok: false, reason: `${sceneName} raster underlay is not visible` };
    }
    if (visibleImages < 1) {
      return { ok: false, reason: `${expectedImageKey} is not visible` };
    }
    if (visibleTextCount !== 0) {
      return { ok: false, reason: `${sceneName} exposed visible text objects: ${visibleTextCount}` };
    }
    if (visibleRectsAboveUnderlay !== 0) {
      return { ok: false, reason: `${sceneName} exposed visible rectangles above underlay: ${visibleRectsAboveUnderlay}` };
    }

    return { ok: true, reason: "ok", visibleImages, visibleTextCount, visibleRectsAboveUnderlay };
  }, { expectedImageKey, rasterOnlySceneUnderlays, sceneName });

  if (!audit.ok) {
    throw new Error(`${label}: ${audit.reason}`);
  }
}

function countByteDelta(left, right) {
  const length = Math.min(left.length, right.length);
  let delta = Math.abs(left.length - right.length);
  for (let index = 0; index < length; index += 1) {
    if (left[index] !== right[index]) {
      delta += 1;
    }
  }
  return delta;
}

async function assertSceneTextLayout(page, sceneName) {
  await page.waitForFunction(() => Boolean(window.__paperGame), null, { timeout: 10000 });
  await page.waitForFunction((expectedScene) => {
    const game = window.__paperGame;
    const activeScene = game?.scene?.getScenes?.(true)?.find((scene) => scene.scene?.key === expectedScene);
    return Boolean(activeScene && activeScene.children?.list?.length > 0);
  }, sceneName, { timeout: 10000 });
  const result = await page.evaluate(({ expectedScene, rasterOnlySceneUnderlays }) => {
    const game = window.__paperGame;
    const activeScene = game?.scene?.getScenes?.(true)?.find((scene) => scene.scene?.key === expectedScene)
      ?? game?.scene?.getScene?.(expectedScene);
    if (!activeScene) {
      return { ok: false, reason: `${expectedScene}: scene is not available for text layout audit`, texts: [] };
    }

    const width = activeScene.scale.width;
    const height = activeScene.scale.height;
    const rasterUnderlayKey = rasterOnlySceneUnderlays[expectedScene];
    const hasRasterOnlyUnderlay = Boolean(
      rasterUnderlayKey
      && activeScene.textures.exists(rasterUnderlayKey)
      && activeScene.children.list.some((item) => (
        item?.type === "Image"
        && item.texture?.key === rasterUnderlayKey
        && item.visible !== false
        && item.alpha !== 0
      ))
    );
    const texts = activeScene.children.list
      .filter((item) => item?.type === "Text" && item.visible !== false && item.alpha !== 0)
      .map((item, index) => {
        const bounds = item.getBounds();
        return {
          index,
          text: String(item.text ?? ""),
          x: bounds.x,
          y: bounds.y,
          right: bounds.right,
          bottom: bounds.bottom,
          width: bounds.width,
          height: bounds.height
        };
      })
      .filter((item) => item.text.trim().length > 0 && item.width > 0 && item.height > 0);

    const issues = [];
    if (texts.length < 5 && !(texts.length === 0 && hasRasterOnlyUnderlay)) {
      issues.push(`${expectedScene}: too few visible text objects for layout audit: ${texts.length}`);
    }
    for (const text of texts) {
      if (/[�]/.test(text.text)) {
        issues.push(`${expectedScene}: replacement character in "${text.text}"`);
      }
      if (/\b(World Map|Dungeon|Reward|Event|Rune Bench|End Turn|Claim Reward|Choose First|Equip Rune|Return Town|Unlocked|Completed|Cleared|Saved clears|Relics|Intent|Block|Turn|Gold|Free|Heal)\b/.test(text.text)) {
        issues.push(`${expectedScene}: visible English placeholder text remains "${text.text}"`);
      }
      if (text.x < -2 || text.y < -2 || text.right > width + 2 || text.bottom > height + 2) {
        issues.push(`${expectedScene}: text out of scene bounds "${text.text}" bounds=${Math.round(text.x)},${Math.round(text.y)},${Math.round(text.right)},${Math.round(text.bottom)}`);
      }
    }

    for (let leftIndex = 0; leftIndex < texts.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < texts.length; rightIndex += 1) {
        const left = texts[leftIndex];
        const right = texts[rightIndex];
        const overlapWidth = Math.max(0, Math.min(left.right, right.right) - Math.max(left.x, right.x));
        const overlapHeight = Math.max(0, Math.min(left.bottom, right.bottom) - Math.max(left.y, right.y));
        const overlapArea = overlapWidth * overlapHeight;
        if (overlapArea <= 120) continue;

        const leftArea = left.width * left.height;
        const rightArea = right.width * right.height;
        const ratio = overlapArea / Math.max(1, Math.min(leftArea, rightArea));
        if (ratio > 0.22) {
          issues.push(`${expectedScene}: text overlap "${left.text}" with "${right.text}" ratio=${ratio.toFixed(2)}`);
        }
      }
    }

    return { ok: issues.length === 0, reason: issues.slice(0, 6).join("; "), texts };
  }, { expectedScene: sceneName, rasterOnlySceneUnderlays });

  if (!result.ok) {
    throw new Error(result.reason);
  }
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

async function readProductionSave(page) {
  return page.evaluate((saveKey) => {
    const raw = localStorage.getItem(saveKey);
    return raw ? JSON.parse(raw) : null;
  }, productionSaveKey);
}

async function writeDebugSave(page, save) {
  await page.evaluate((value) => {
    localStorage.setItem("paper_theater_card_crawler_debug_save_v1", JSON.stringify(value));
  }, save);
}

async function writeProductionSave(page, save) {
  await page.evaluate(([saveKey, value]) => {
    localStorage.setItem(saveKey, JSON.stringify(value));
  }, [productionSaveKey, save]);
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
  if (
    typeof save.settings.volumeMaster !== "number"
    || typeof save.settings.volumeMusic !== "number"
    || typeof save.settings.volumeSfx !== "number"
    || (save.settings.displayMode !== "standard" && save.settings.displayMode !== "high_contrast")
    || typeof save.settings.largeText !== "boolean"
    || typeof save.settings.reducedMotion !== "boolean"
    || typeof save.settings.spaceConfirm !== "boolean"
  ) {
    throw new Error(`${label}: invalid settings shape ${JSON.stringify(save.settings)}`);
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
