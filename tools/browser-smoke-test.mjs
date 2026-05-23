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
await page.evaluate(() => {
  localStorage.removeItem("sunny_maze_run_v1");
  localStorage.removeItem("sunny_maze_profile_v1");
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("#startRunButton", { timeout: 10000 });

const title = await page.textContent("h1");
if (title?.trim() !== "햇살 미로단") throw new Error(`제목 확인 실패: ${title}`);
const setupText = await page.textContent("#gameRoot");
if (!setupText?.includes("진행 상황") || !setupText.includes("다음 목표")) throw new Error("프로필 패널 표시 실패");
const profileGoalCards = await page.locator(".goal-card").count();
if (profileGoalCards === 0) throw new Error("프로필 목표 카드 표시 실패");
const lockedStageOptions = await page.locator("#stageSelect option:disabled").count();
if (lockedStageOptions === 0) throw new Error("잠긴 스테이지 표시 실패");

await page.click("#startRunButton");
await page.waitForSelector(".run-board", { timeout: 10000 });
await page.waitForSelector(".play-card", { timeout: 10000 });
await page.waitForSelector(".arcana-chip", { timeout: 10000 });
const enemyText = await page.textContent(".enemy-card");
if (!enemyText?.includes("의도") || !enemyText.includes("형")) throw new Error("적 역할/의도 표시 실패");

const enabledCards = await page.locator(".play-card:not(:disabled)").count();
if (enabledCards === 0) throw new Error("사용 가능한 카드가 없습니다.");
await page.locator(".play-card:not(:disabled)").first().click();
await page.click('[data-action="debug-relic"]');
await page.waitForSelector(".relic-chip", { timeout: 10000 });
await page.click('[data-action="debug-arcana"]');
await page.waitForFunction(() => document.querySelectorAll(".arcana-chip").length >= 2, null, { timeout: 10000 });
await page.click('[data-action="debug-gem"]');
await page.waitForSelector(".gem-card", { timeout: 10000 });
await page.waitForSelector(".gem-option", { timeout: 10000 });
await page.locator('[data-action="equip-gem"]').first().click();
await page.waitForSelector('[data-action="unequip-gem"]', { timeout: 10000 });
await page.click('[data-action="save-run"]');
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("#loadRunButton:not(:disabled)", { timeout: 10000 });
await page.click("#loadRunButton");
await page.waitForSelector('[data-action="unequip-gem"]', { timeout: 10000 });
await page.waitForSelector(".relic-chip", { timeout: 10000 });
await page.waitForFunction(() => document.querySelectorAll(".arcana-chip").length >= 2, null, { timeout: 10000 });
await page.waitForSelector(".socket-card-preview", { timeout: 10000 });
await page.waitForSelector(".equipped-effect-list", { timeout: 10000 });

const runText = await page.textContent("#runRoot");
if (!runText?.includes("체력") || !runText.includes("기운") || !runText.includes("현재 빌드") || !runText.includes("보석 작업대")) {
  throw new Error("전투 상태 표시 확인 실패");
}

if (errors.length > 0) {
  throw new Error(`브라우저 콘솔 오류: ${errors.join(" | ")}`);
}

await browser.close();
console.log("브라우저 스모크 통과");
