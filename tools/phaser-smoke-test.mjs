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

try {
  await checkPage("/", "TownScene", false);
  await checkPage("/?debug=1&entry=combat", "CombatScene", true);
  await checkPage("/?debug=1&entry=boss", "BossScene", true);
  console.log("Phaser smoke OK");
} finally {
  await browser.close();
}

async function checkPage(pathname, expectedScene, expectDebugOverlay) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(new URL(pathname, baseUrl).href, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas", { timeout: 10000 });
  await page.waitForFunction(() => {
    const canvas = document.querySelector("canvas");
    return Boolean(canvas && canvas.width >= 1280 && canvas.height >= 720);
  }, null, { timeout: 10000 });

  if (expectDebugOverlay) {
    await page.waitForFunction(
      (sceneName) => document.querySelector("#debug-overlay")?.textContent?.includes(sceneName),
      expectedScene,
      { timeout: 10000 }
    );
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

  if (errors.length > 0) {
    throw new Error(`${expectedScene}: browser errors: ${errors.join(" | ")}`);
  }

  await page.close();
}
