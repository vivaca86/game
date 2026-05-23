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
await page.waitForSelector(".profile-stat-meter", { timeout: 10000 });
await page.waitForSelector(".achievement-badge", { timeout: 10000 });
await page.waitForSelector(".goal-progress-meter", { timeout: 10000 });
await page.waitForSelector(".unlock-icon", { timeout: 10000 });
const lockedStageOptions = await page.locator("#stageSelect option:disabled").count();
if (lockedStageOptions === 0) throw new Error("잠긴 스테이지 표시 실패");
const setupRoomChips = await page.locator(".stage-room-strip .room-mini").count();
if (setupRoomChips === 0) throw new Error("스테이지 방 구성 칩 표시 실패");
const sampleCardArtCount = await page.locator(".sample-card .card-art-sample").count();
if (sampleCardArtCount < 3) throw new Error("카드 샘플 일러스트 표시 실패");
await page.waitForSelector(".setup-preview", { timeout: 10000 });
await page.waitForSelector(".character-portrait", { timeout: 10000 });
await page.waitForSelector(".stage-key-art", { timeout: 10000 });
await page.waitForSelector(".starter-card-strip", { timeout: 10000 });
const setupOverflowItems = await page.locator(".setup-preview-card, .character-portrait, .stage-key-art").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (setupOverflowItems.length > 0) {
  throw new Error(`선택 미리보기 UI 넘침: ${setupOverflowItems.slice(0, 4).join(" | ")}`);
}
const moruEnabled = await page.locator('#characterSelect option[value="char_moru"]:not(:disabled)').count();
if (moruEnabled > 0) {
  await page.selectOption("#characterSelect", "char_moru");
  await page.waitForFunction(() => document.querySelector("#setupPreview")?.textContent?.includes("모루"), null, { timeout: 10000 });
}
await page.screenshot({ path: "tmp/setup-preview-desktop.png", fullPage: true });

await page.click("#startRunButton");
await page.waitForSelector(".run-board", { timeout: 10000 });
await page.waitForSelector(".stage-route-panel", { timeout: 10000 });
await page.waitForSelector(".route-node.active", { timeout: 10000 });
await page.waitForSelector(".route-node.room-boss", { timeout: 10000 });
await page.waitForSelector(".combat-forecast", { timeout: 10000 });
await page.waitForSelector(".monster-portrait", { timeout: 10000 });
await page.waitForSelector(".monster-face", { timeout: 10000 });
await page.waitForSelector(".intent-card", { timeout: 10000 });
await page.waitForSelector(".intent-timeline .intent-node.current", { timeout: 10000 });
await page.evaluate(() => {
  const raw = localStorage.getItem("sunny_maze_run_v1");
  if (!raw) throw new Error("저장된 탐험 스냅샷 없음");
  const snapshot = JSON.parse(raw);
  const hand = Array.isArray(snapshot.hand) ? snapshot.hand.filter((cardId) => cardId !== "card_temp_dust") : [];
  snapshot.hand = ["card_temp_dust", ...hand];
  snapshot.player = { ...(snapshot.player || {}), energy: Math.max(snapshot.player?.energy || 0, 3) };
  snapshot.status = { ...(snapshot.status || {}), disruptionsCleared: 0 };
  localStorage.setItem("sunny_maze_run_v1", JSON.stringify(snapshot));
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("#loadRunButton:not(:disabled)", { timeout: 10000 });
await page.click("#loadRunButton");
await page.waitForSelector(".stage-route-panel", { timeout: 10000 });
await page.waitForSelector(".combat-forecast", { timeout: 10000 });
await page.waitForSelector(".disruption-control", { timeout: 10000 });
await page.waitForSelector(".play-card.card-type-temp", { timeout: 10000 });
const disruptionText = await page.textContent(".disruption-control");
if (!disruptionText?.includes("방해 대응") || !disruptionText.includes("정리 · 기운 1")) {
  throw new Error("방해 카드 정리 UI 표시 실패");
}
const disruptionCardBorderStyle = await page.locator(".play-card.card-type-temp").first().evaluate((element) => getComputedStyle(element).borderStyle);
if (!disruptionCardBorderStyle.includes("dashed")) throw new Error("방해 카드 프레임 구분 실패");
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
const monsterFaceParts = await page.locator(".monster-face, .monster-eye, .monster-mouth").count();
if (monsterFaceParts < 4) throw new Error("마스코트 몬스터 초상 구성 실패");
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
await page.waitForSelector(".play-card .card-art-hand", { timeout: 10000 });
await page.waitForSelector(".arcana-chip", { timeout: 10000 });
const enemyText = await page.textContent(".enemy-card");
if (!enemyText?.includes("이번") || !enemyText.includes("형")) throw new Error("적 역할/의도 표시 실패");
const combatOverflowItems = await page.locator(".combat-forecast, .disruption-control, .enemy-card, .intent-card, .intent-node, .monster-portrait, .play-card, .card-art").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (combatOverflowItems.length > 0) {
  throw new Error(`전투 UI 넘침: ${combatOverflowItems.slice(0, 4).join(" | ")}`);
}
await page.screenshot({ path: "tmp/combat-ui-desktop.png", fullPage: true });

await page.click('[data-action="cleanse-disruption"]');
await page.waitForFunction(() => {
  const controlGone = !document.querySelector(".disruption-control");
  const clearedChip = [...document.querySelectorAll(".forecast-chip")].some((element) => element.textContent?.includes("정리 1"));
  return controlGone && clearedChip;
}, null, { timeout: 10000 });

const enabledCards = await page.locator(".play-card:not(:disabled)").count();
if (enabledCards === 0) throw new Error("사용 가능한 카드가 없습니다.");
await page.locator(".play-card:not(:disabled)").first().click();
await page.click('[data-action="debug-relic"]');
await page.waitForSelector(".relic-chip", { timeout: 10000 });
await page.waitForSelector(".relic-chip .item-icon-relic", { timeout: 10000 });
await page.click('[data-action="debug-arcana"]');
await page.waitForFunction(() => document.querySelectorAll(".arcana-chip").length >= 2, null, { timeout: 10000 });
await page.waitForSelector(".arcana-chip .item-icon-arcana", { timeout: 10000 });
await page.click('[data-action="debug-gem"]');
await page.waitForSelector(".gem-card", { timeout: 10000 });
await page.waitForSelector('.gem-card .gem-icon[class*="gem-rarity-"]', { timeout: 10000 });
await page.waitForSelector(".gem-option", { timeout: 10000 });
await page.locator('[data-action="equip-gem"]').first().click();
await page.waitForSelector('[data-action="unequip-gem"]', { timeout: 10000 });
await page.click('[data-action="save-run"]');
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("#loadRunButton:not(:disabled)", { timeout: 10000 });
await page.click("#loadRunButton");
await page.waitForSelector('[data-action="unequip-gem"]', { timeout: 10000 });
await page.waitForSelector(".relic-chip", { timeout: 10000 });
await page.waitForSelector(".relic-chip .item-icon-relic", { timeout: 10000 });
await page.waitForFunction(() => document.querySelectorAll(".arcana-chip").length >= 2, null, { timeout: 10000 });
await page.waitForSelector(".arcana-chip .item-icon-arcana", { timeout: 10000 });
await page.waitForSelector(".socket-card-preview", { timeout: 10000 });
await page.waitForSelector(".equipped-effect-list", { timeout: 10000 });
await page.waitForSelector(".socket-card .card-art-socket", { timeout: 10000 });

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
const rewardCardCount = await page.locator(".market-box .reward-kind-card").count();
const rewardCardArtCount = await page.locator(".market-box .reward-kind-card .card-art-preview").count();
if (rewardCardCount > 0 && rewardCardArtCount === 0) throw new Error("보상 카드 미리보기 일러스트 표시 실패");
const rewardRelicOrArcanaCount = await page.locator(".market-box .reward-kind-relic, .market-box .reward-kind-arcana").count();
const rewardItemIconCount = await page.locator(".market-box .reward-kind-relic .item-icon, .market-box .reward-kind-arcana .item-icon").count();
if (rewardRelicOrArcanaCount > 0 && rewardItemIconCount === 0) throw new Error("유물/기운 보상 아이콘 표시 실패");

const marketText = await page.textContent(".market-box");
if (!marketText?.includes("비용") || !marketText.includes("별사탕")) {
  throw new Error("상점/이벤트/보상 비용 표시 확인 실패");
}

const overflowItems = await page.locator(".market-box, .market-choice, .reward-preview-card, .choice-wallet, .card-art-preview").evaluateAll((elements) => elements
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

await page.setViewportSize({ width: 1366, height: 900 });
await page.evaluate(async () => {
  const raw = localStorage.getItem("sunny_maze_run_v1");
  if (!raw) throw new Error("이벤트 검증용 저장 스냅샷 없음");
  const snapshot = JSON.parse(raw);
  const events = await fetch("/src/data/ko/events.json").then((response) => response.json());
  const event = events.find((item) => item.id === "event_ribbon_fountain") || events[0];
  if (!event) throw new Error("이벤트 검증용 데이터 없음");
  snapshot.phase = "event";
  snapshot.currentRoomType = "event";
  snapshot.pendingReward = null;
  snapshot.pendingEvent = structuredClone(event);
  snapshot.player = { ...(snapshot.player || {}), hp: 54, maxHp: 64, gold: 82 };
  localStorage.setItem("sunny_maze_run_v1", JSON.stringify(snapshot));
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("#loadRunButton:not(:disabled)", { timeout: 10000 });
await page.click("#loadRunButton");
await page.waitForSelector(".event-box", { timeout: 10000 });
await page.waitForSelector(".event-scene", { timeout: 10000 });
await page.waitForSelector(".choice-reward-icon", { timeout: 10000 });
await page.waitForSelector(".event-choice .reward-preview-card", { timeout: 10000 });
const eventText = await page.textContent(".event-box");
if (!eventText?.includes("리본 분수") || !eventText.includes("카드를 강화한다")) throw new Error("이벤트 화면 핵심 문구 표시 실패");
const eventChoiceCount = await page.locator(".event-choice").count();
const eventIconCount = await page.locator(".event-choice .choice-reward-icon").count();
if (eventChoiceCount < 3 || eventIconCount !== eventChoiceCount) throw new Error("이벤트 선택지 아이콘 표시 실패");
const eventOverflowItems = await page.locator(".event-box, .event-head, .event-visual-card, .event-choice, .choice-reward-icon").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (eventOverflowItems.length > 0) {
  throw new Error(`이벤트 UI 넘침: ${eventOverflowItems.slice(0, 4).join(" | ")}`);
}
await page.screenshot({ path: "tmp/event-ui-desktop.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 820 });
await page.waitForTimeout(120);
const eventMobileColumns = await page.locator(".market-list").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
if (eventMobileColumns !== 1) throw new Error("모바일 이벤트 선택지 1열 반응형 확인 실패");
await page.screenshot({ path: "tmp/event-ui-mobile.png", fullPage: true });

await page.setViewportSize({ width: 1366, height: 900 });
await page.evaluate(async () => {
  const raw = localStorage.getItem("sunny_maze_run_v1");
  if (!raw) throw new Error("보스 검증용 저장 스냅샷 없음");
  const snapshot = JSON.parse(raw);
  const [stages, enemies] = await Promise.all([
    fetch("/src/data/ko/stages.json").then((response) => response.json()),
    fetch("/src/data/ko/enemies.json").then((response) => response.json())
  ]);
  const stage = stages.find((item) => item.order === 1) || stages[0];
  const boss = enemies.find((enemy) => enemy.id === stage.bossEnemyId) || enemies.find((enemy) => enemy.rank === "boss");
  if (!stage || !boss) throw new Error("보스 검증 데이터 없음");
  const bossRoomIndex = Array.isArray(stage.rooms) ? stage.rooms.findIndex((room) => room === "boss") : -1;
  snapshot.phase = "combat";
  snapshot.stageId = stage.id;
  snapshot.currentRoomType = "boss";
  snapshot.roomIndex = bossRoomIndex >= 0 ? bossRoomIndex : 0;
  snapshot.turn = 1;
  snapshot.pendingReward = null;
  snapshot.pendingEvent = null;
  snapshot.player = { ...(snapshot.player || {}), energy: 3, maxEnergy: 3, shield: 0 };
  snapshot.hand = Array.isArray(snapshot.hand) && snapshot.hand.length > 0 ? snapshot.hand.slice(0, 5) : ["card_sunbean_punch"];
  snapshot.enemies = [{
    ...structuredClone(boss),
    maxHp: boss.maxHp,
    hp: Math.floor(boss.maxHp * 0.45),
    block: boss.block || 0,
    instanceId: "boss_visual_check",
    status: { mark: 2 },
    role: "호출형 보스",
    intents: structuredClone(boss.intents || []),
    phaseRules: structuredClone(boss.phaseRules || []),
    phaseRulesTriggered: []
  }];
  localStorage.setItem("sunny_maze_run_v1", JSON.stringify(snapshot));
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("#loadRunButton:not(:disabled)", { timeout: 10000 });
await page.click("#loadRunButton");
await page.waitForSelector(".enemy-card.enemy-rank-boss", { timeout: 10000 });
await page.waitForSelector(".boss-phase-panel", { timeout: 10000 });
await page.waitForSelector(".monster-rank-crown", { timeout: 10000 });
const bossPhaseText = await page.textContent(".boss-phase-panel");
if (!bossPhaseText?.includes("곧 발동") || !bossPhaseText.includes("장벽 +")) throw new Error("보스 페이즈 예고 표시 실패");
const bossVisualParts = await page.locator(".enemy-rank-boss .monster-face, .enemy-rank-boss .monster-rank-crown, .enemy-rank-boss .monster-eye").count();
if (bossVisualParts < 4) throw new Error("보스 마스코트 초상 구성 실패");
const bossOverflowItems = await page.locator(".enemy-rank-boss, .boss-phase-panel, .monster-portrait").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (bossOverflowItems.length > 0) {
  throw new Error(`보스 패턴 UI 넘침: ${bossOverflowItems.slice(0, 4).join(" | ")}`);
}
await page.screenshot({ path: "tmp/boss-phase-desktop.png", fullPage: true });

await page.evaluate(() => {
  const raw = localStorage.getItem("sunny_maze_run_v1");
  if (!raw) throw new Error("결과 화면 검증용 저장 스냅샷 없음");
  const snapshot = JSON.parse(raw);
  snapshot.phase = "stage_clear";
  snapshot.metrics = {
    ...(snapshot.metrics || {}),
    roomsCleared: 9,
    enemiesDefeated: 12,
    maxChain: 6,
    enemyIntentsResolved: 14,
    bossPhaseTriggers: 2
  };
  snapshot.status = { ...(snapshot.status || {}), profileFinalized: true };
  snapshot.player = { ...(snapshot.player || {}), gold: 126 };
  snapshot.deck = Array.isArray(snapshot.deck) && snapshot.deck.length > 0 ? snapshot.deck : ["card_sunbean_punch", "card_cloud_guard"];
  snapshot.inventory = {
    ...(snapshot.inventory || {}),
    gemBag: [
      { instanceId: "result_gem_1", gemId: "gem_coral_edge" },
      { instanceId: "result_gem_2", gemId: "gem_mint_breeze" },
      { instanceId: "result_gem_3", gemId: "gem_lavender_echo" }
    ]
  };
  snapshot.resultSummary = {
    won: true,
    stageName: "햇살 현관",
    characterName: "하루",
    roomsCleared: 9,
    enemiesDefeated: 12,
    maxChain: 6,
    enemyIntentsResolved: 14,
    bossPhaseTriggers: 2,
    gold: 126,
    deckSize: snapshot.deck.length,
    gemCount: 3,
    unlocks: [
      { label: "스테이지", name: "라벤더 복도" },
      { label: "카드", name: "별사탕 충전" },
      { label: "보석", name: "민트 방울" }
    ],
    achievements: [{ label: "업적", name: "첫 소풍 완료" }],
    metaUpgrades: [{ label: "마을", name: "작은 공방" }]
  };
  localStorage.setItem("sunny_maze_run_v1", JSON.stringify(snapshot));
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("#loadRunButton:not(:disabled)", { timeout: 10000 });
await page.click("#loadRunButton");
try {
  await page.waitForSelector(".result-panel", { timeout: 10000 });
} catch (error) {
  const rootText = await page.textContent("#runRoot").catch(() => "");
  throw new Error(`결과 화면 진입 실패: ${rootText?.slice(0, 240) || "runRoot 비어 있음"} | ${errors.join(" | ") || error.message}`);
}
const resultPanelClass = await page.locator(".result-panel").first().getAttribute("class");
if (!resultPanelClass?.includes("result-panel-victory")) throw new Error(`결과 화면 클리어 톤 클래스 실패: ${resultPanelClass}`);
await page.waitForSelector(".result-emblem", { timeout: 10000 });
await page.waitForSelector(".result-stat-icon", { timeout: 10000 });
await page.waitForSelector(".result-stat-meter", { timeout: 10000 });
await page.waitForSelector(".result-unlock-chip", { timeout: 10000 });
await page.waitForSelector(".result-unlock-chip .unlock-icon", { timeout: 10000 });
const resultText = await page.textContent(".result-panel");
if (!resultText?.includes("스테이지 클리어") || !resultText.includes("새로 열린 것") || !resultText.includes("라벤더 복도")) {
  throw new Error("결과 화면 핵심 문구 표시 실패");
}
const resultStatCount = await page.locator(".result-stat").count();
if (resultStatCount !== 8) throw new Error(`결과 화면 통계 카드 수 실패: ${resultStatCount}`);
const resultUnlockCount = await page.locator(".result-unlock-chip").count();
if (resultUnlockCount < 5) throw new Error(`결과 화면 해금 칩 수 실패: ${resultUnlockCount}`);
const resultOverflowItems = await page.locator(".result-panel, .result-stat, .result-title-wrap, .result-unlock-chip").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (resultOverflowItems.length > 0) {
  throw new Error(`결과 화면 UI 넘침: ${resultOverflowItems.slice(0, 4).join(" | ")}`);
}
await page.screenshot({ path: "tmp/result-panel-desktop.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 820 });
await page.waitForTimeout(120);
const resultMobileColumns = await page.locator(".result-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
if (resultMobileColumns !== 1) throw new Error("모바일 결과 통계 1열 반응형 확인 실패");
await page.screenshot({ path: "tmp/result-panel-mobile.png", fullPage: true });
await page.setViewportSize({ width: 1366, height: 900 });

if (errors.length > 0) {
  throw new Error(`브라우저 콘솔 오류: ${errors.join(" | ")}`);
}

await browser.close();
console.log("브라우저 스모크 통과");
