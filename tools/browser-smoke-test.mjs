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
const setupRoomChips = await page.locator(".stage-room-strip .room-mini").count();
if (setupRoomChips === 0) throw new Error("스테이지 방 구성 칩 표시 실패");

await page.click("#startRunButton");
await page.waitForSelector(".run-board", { timeout: 10000 });
await page.waitForSelector(".stage-route-panel", { timeout: 10000 });
await page.waitForSelector(".route-node.active", { timeout: 10000 });
await page.waitForSelector(".route-node.room-boss", { timeout: 10000 });
await page.waitForSelector(".combat-forecast", { timeout: 10000 });
await page.waitForSelector(".monster-portrait", { timeout: 10000 });
await page.waitForSelector(".intent-card", { timeout: 10000 });
await page.waitForSelector(".intent-timeline .intent-node.current", { timeout: 10000 });
const routeText = await page.textContent(".stage-route-panel");
if (!routeText?.includes("스테이지 경로") || !routeText.includes("현재 방") || !routeText.includes("보스")) {
  throw new Error("스테이지 경로판 표시 실패");
}
const combatForecastText = await page.textContent(".combat-forecast");
if (!combatForecastText?.includes("이번 턴 예고") || (!combatForecastText.includes("예상 피해") && !combatForecastText.includes("피해 없음"))) {
  throw new Error("전투 예고판 표시 실패");
}
const intentNodeCount = await page.locator(".intent-node").count();
if (intentNodeCount < 2) throw new Error("몬스터 의도 타임라인 표시 실패");
const routeNodeCount = await page.locator(".route-node").count();
if (routeNodeCount < 7) throw new Error(`스테이지 경로 노드 부족: ${routeNodeCount}`);
const routeOverflowItems = await page.locator(".stage-route-panel, .route-node, .route-next-card").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (routeOverflowItems.length > 0) {
  throw new Error(`스테이지 경로 UI 넘침: ${routeOverflowItems.slice(0, 4).join(" | ")}`);
}
await page.screenshot({ path: "tmp/stage-route-desktop.png", fullPage: true });
await page.waitForSelector(".play-card", { timeout: 10000 });
await page.waitForSelector(".arcana-chip", { timeout: 10000 });
const enemyText = await page.textContent(".enemy-card");
if (!enemyText?.includes("이번") || !enemyText.includes("형")) throw new Error("적 역할/의도 표시 실패");
const combatOverflowItems = await page.locator(".combat-forecast, .enemy-card, .intent-card, .intent-node, .monster-portrait").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (combatOverflowItems.length > 0) {
  throw new Error(`전투 UI 넘침: ${combatOverflowItems.slice(0, 4).join(" | ")}`);
}
await page.screenshot({ path: "tmp/combat-ui-desktop.png", fullPage: true });

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

async function clickFirstIfExists(selector) {
  const locator = page.locator(selector);
  if ((await locator.count()) === 0) return false;
  await locator.first().click();
  await page.waitForTimeout(60);
  return true;
}

async function advanceUntilMarketBox() {
  for (let step = 0; step < 160; step += 1) {
    if ((await page.locator(".market-box").count()) > 0) return;
    if ((await page.locator(".result-panel").count()) > 0) break;
    if (await clickFirstIfExists(".play-card:not(:disabled)")) continue;
    if (await clickFirstIfExists('[data-action="end-turn"]')) continue;
    if (await clickFirstIfExists('[data-action="advance"]')) continue;
    await page.waitForTimeout(80);
  }
  throw new Error("상점/이벤트/보상 화면 진입 실패");
}

await advanceUntilMarketBox();
await page.waitForSelector(".market-box .choice-wallet", { timeout: 10000 });
await page.waitForSelector(".market-box .choice-cost", { timeout: 10000 });
await page.waitForSelector(".market-box .reward-preview-card", { timeout: 10000 });

const marketText = await page.textContent(".market-box");
if (!marketText?.includes("비용") || !marketText.includes("별사탕")) {
  throw new Error("상점/이벤트/보상 비용 표시 확인 실패");
}

const overflowItems = await page.locator(".market-box, .market-choice, .reward-preview-card, .choice-wallet").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (overflowItems.length > 0) {
  throw new Error(`상점/이벤트/보상 UI 넘침: ${overflowItems.slice(0, 4).join(" | ")}`);
}

await page.screenshot({ path: "tmp/market-ui-desktop.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 820 });
await page.waitForTimeout(120);
const mobileColumns = await page.locator(".market-list").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
if (mobileColumns !== 1) throw new Error("모바일 상점/보상 선택지 1열 반응형 확인 실패");
const mobileRouteColumns = await page.locator(".route-node-list").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
if (mobileRouteColumns !== 2) throw new Error("모바일 스테이지 경로 2열 반응형 확인 실패");
await page.screenshot({ path: "tmp/market-ui-mobile.png", fullPage: true });

if (errors.length > 0) {
  throw new Error(`브라우저 콘솔 오류: ${errors.join(" | ")}`);
}

await browser.close();
console.log("브라우저 스모크 통과");
