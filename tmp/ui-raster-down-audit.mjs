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
  for (const port of [4182, 4183, 4184, 4185]) {
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

const defaultDownKey = "ui_down_pressed_stamp_concept";
const targets = [
  { sceneName: "TownScene", underlay: "town_raster_underlay_concept", pathname: "/?debug=1&entry=town&resetSave=1", downX: 1010, downY: 642, downKey: "ui_down_town_expedition_action_concept" },
  { sceneName: "WorldMapScene", underlay: "world_map_raster_underlay_concept", pathname: "/?debug=1&entry=world_map&resetSave=1", downX: 1576, downY: 970, downKey: "ui_down_world_map_play_button_concept" },
  { sceneName: "DungeonScene", underlay: "dungeon_raster_underlay_concept", pathname: "/?debug=1&entry=dungeon&resetSave=1", downX: 1010, downY: 582, downKey: "ui_hover_route_node_concept" },
  { sceneName: "CombatScene", underlay: "combat_raster_underlay_concept", pathname: "/?debug=1&entry=combat&resetSave=1", downX: 540, downY: 836, downKey: "ui_hover_gold_seal_concept" },
  { sceneName: "RewardScene", underlay: "reward_raster_underlay_concept", pathname: "/?debug=1&entry=reward&resetSave=1", downX: 630, downY: 618, downKey: "ui_hover_choice_badge_concept" },
  { sceneName: "EventScene", underlay: "event_raster_underlay_concept", pathname: "/?debug=1&entry=event&resetSave=1", downX: 618, downY: 722, downKey: "ui_hover_choice_badge_concept" },
  { sceneName: "RuneBenchScene", underlay: "rune_bench_raster_underlay_concept", pathname: "/?debug=1&entry=rune_bench&resetSave=1&grantRune=rune_paper_spark", downX: 1010, downY: 742, downKey: "ui_down_runebench_action_rail_concept" },
  { sceneName: "BossScene", underlay: "boss_raster_underlay_concept", pathname: "/?debug=1&entry=boss&resetSave=1", downX: 1718, downY: 930, downKey: "ui_hover_boss_skull_stamp_concept" },
  { sceneName: "ResultScene", underlay: "result_raster_underlay_concept", pathname: "/?debug=1&entry=result&resetSave=1", downX: 1010, downY: 742, downKey: "ui_down_result_action_card_concept" },
  {
    sceneName: "SettingsScene",
    underlay: "settings_raster_underlay_concept",
    pathname: "/?debug=1&entry=town&resetSave=1",
    downX: 840,
    downY: 282,
    downKey: "ui_down_settings_volume_master_concept",
    setup: async (page) => {
      const canvas = page.locator("canvas");
      const box = await canvas.boundingBox();
      await page.mouse.click(box.x + (1010 / 1920) * box.width, box.y + (806 / 1080) * box.height);
    }
  }
];

await mkdir("tmp/ui-quality/down", { recursive: true });

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

  for (const { sceneName, underlay, pathname, downX, downY, setup, downKey = defaultDownKey } of targets) {
    await page.goto(new URL(pathname, baseUrl).href, { waitUntil: "networkidle" });
    if (setup) await setup(page);
    await page.waitForFunction((expectedScene) => {
      const game = window.__paperGame;
      return Boolean(game?.scene?.getScenes?.(true)?.some((scene) => scene.scene?.key === expectedScene));
    }, sceneName, { timeout: 10000 });
    await page.evaluate(() => {
      const overlay = document.getElementById("debug-overlay");
      if (overlay) overlay.style.display = "none";
    });
    const canvas = page.locator("canvas");
    const box = await canvas.boundingBox();
    await page.mouse.move(box.x + (downX / 1920) * box.width, box.y + (downY / 1080) * box.height);
    await page.waitForTimeout(80);
    await page.mouse.down();
    await page.waitForTimeout(120);
    const shot = `tmp/ui-quality/down/${sceneName.replace("Scene", "").toLowerCase()}-down-pressed-v1-1920.png`;
    await canvas.screenshot({ path: shot });
    const stats = await page.evaluate(({ sceneName, underlay, downKey }) => {
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
        hasUnderlay: underlayIndex >= 0,
        textCount: visible.filter((child) => child?.type === "Text" && String(child.text ?? "").trim().length > 0).length,
        visibleRectsAboveUnderlay: rectsAbove.length,
        visibleDownImages: visible.filter((child) => child?.type === "Image" && child.texture?.key === downKey && child.alpha > 0.05).length
      };
    }, { sceneName, underlay, downKey });
    results.push({ ...stats, screenshot: path.resolve(shot) });
    await page.mouse.move(box.x + 8, box.y + 8);
    await page.waitForTimeout(80);
    await page.mouse.up();

    if (!stats.hasUnderlay || stats.textCount !== 0 || stats.visibleRectsAboveUnderlay !== 0 || stats.visibleDownImages !== 1) {
      throw new Error(`${sceneName}: invalid down-state audit ${JSON.stringify(stats)}`);
    }
  }

  console.log(JSON.stringify({ baseUrl, defaultDownKey, results }, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) await server.close();
}
