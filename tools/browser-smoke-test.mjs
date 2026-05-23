import { createRequire } from "node:module";
import Module from "node:module";

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
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const errors = [];

page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));

await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForSelector("#startRunButton", { timeout: 10000 });

const title = await page.textContent("h1");
if (title?.trim() !== "햇살 미로단") throw new Error(`제목 확인 실패: ${title}`);

await page.click("#startRunButton");
await page.waitForSelector(".run-board", { timeout: 10000 });
await page.waitForSelector(".play-card", { timeout: 10000 });

const enabledCards = await page.locator(".play-card:not(:disabled)").count();
if (enabledCards === 0) throw new Error("사용 가능한 카드가 없습니다.");
await page.locator(".play-card:not(:disabled)").first().click();

const runText = await page.textContent("#runRoot");
if (!runText?.includes("체력") || !runText.includes("기운")) {
  throw new Error("전투 상태 표시 확인 실패");
}

if (errors.length > 0) {
  throw new Error(`브라우저 콘솔 오류: ${errors.join(" | ")}`);
}

await browser.close();
console.log("브라우저 스모크 통과");
