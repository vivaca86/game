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
const sampleCardRoleCount = await page.locator(".sample-card .card-role-chip").count();
if (sampleCardRoleCount < 3) throw new Error("카드 샘플 역할 칩 표시 실패");
await page.waitForSelector(".setup-preview", { timeout: 10000 });
await page.waitForSelector(".character-portrait", { timeout: 10000 });
await page.waitForSelector(".stage-key-art", { timeout: 10000 });
await page.waitForSelector(".starter-card-strip", { timeout: 10000 });
await page.waitForSelector(".character-passive-chips", { timeout: 10000 });
const starterCardIconCount = await page.locator(".starter-card-pill b").count();
if (starterCardIconCount < 5) throw new Error("시작 카드 타입 아이콘 표시 실패");
const setupPassiveChipCount = await page.locator(".character-preview-card .character-passive-chip").count();
if (setupPassiveChipCount < 2) throw new Error("캐릭터 보조 패시브 칩 표시 실패");
const setupOverflowItems = await page.locator(".setup-preview-card, .character-portrait, .stage-key-art, .character-passive-chip, .starter-card-pill").evaluateAll((elements) => elements
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

async function assertNoCodexOverflow(label) {
  const overflowItems = await page.locator(".codex-entry, .codex-copy, .card-art-codex, .card-role-chip, .gem-role-chip, .gem-fit-list, .build-role-chip, .build-fit-list, .event-role-chip, .event-risk-chip, .event-choice-preview-list, .event-scene-codex, .codex-entry > .gem-icon, .codex-entry > .item-icon, .codex-portrait-slot, .codex-stage .stage-key-art, .codex-enemy .monster-portrait").evaluateAll((elements) => elements
    .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
    .map((element) => element.className));
  if (overflowItems.length > 0) {
    throw new Error(`${label} 도감 UI 넘침: ${overflowItems.slice(0, 4).join(" | ")}`);
  }
}

async function assertCodexVisual(kind, visualSelector, expectedMin, label) {
  await page.selectOption("#codexKindSelect", kind);
  await page.waitForFunction(({ kind: selectedKind, expectedMin: min }) => document.querySelectorAll(`.codex-entry-kind-${selectedKind}`).length >= min, { kind, expectedMin }, { timeout: 10000 });
  await page.waitForSelector(visualSelector, { timeout: 10000 });
  const text = await page.textContent(".codex-panel");
  if (!text?.includes("콘텐츠 도감") || !text.includes(label)) throw new Error(`${label} 도감 핵심 문구 표시 실패`);
  await assertNoCodexOverflow(label);
}

await page.waitForSelector(".codex-panel", { timeout: 10000 });
await page.selectOption("#codexStatusSelect", "all");
await assertCodexVisual("cards", ".codex-kind-cards .card-art-codex", 100, "카드");
const codexCardRoleCount = await page.locator(".codex-kind-cards .card-role-chip").count();
if (codexCardRoleCount < 100) throw new Error("카드 도감 역할 칩 표시 실패");
await page.screenshot({ path: "tmp/codex-panel-desktop.png", fullPage: true });
await assertCodexVisual("gems", '.codex-kind-gems .gem-icon[class*="gem-rarity-"]', 50, "보석");
const codexGemRoleCount = await page.locator(".codex-kind-gems .gem-role-chip").count();
const codexGemFitCount = await page.locator(".codex-kind-gems .gem-fit-list").count();
if (codexGemRoleCount < 50 || codexGemFitCount < 50) throw new Error("보석 도감 역할/추천 칩 표시 실패");
await assertCodexVisual("relics", ".codex-kind-relics .item-icon-relic", 16, "유물");
const codexRelicRoleCount = await page.locator(".codex-kind-relics .build-role-chip").count();
const codexRelicFitCount = await page.locator(".codex-kind-relics .build-fit-list").count();
const codexRelicMarkCount = await page.locator(".codex-kind-relics .item-role-mark").count();
if (codexRelicRoleCount < 16 || codexRelicFitCount < 16 || codexRelicMarkCount < 16) throw new Error("유물 도감 역할/추천/마크 표시 실패");
await assertCodexVisual("arcanas", ".codex-kind-arcanas .item-icon-arcana", 12, "기운");
const codexArcanaRoleCount = await page.locator(".codex-kind-arcanas .build-role-chip").count();
const codexArcanaFitCount = await page.locator(".codex-kind-arcanas .build-fit-list").count();
const codexArcanaMarkCount = await page.locator(".codex-kind-arcanas .item-role-mark").count();
if (codexArcanaRoleCount < 12 || codexArcanaFitCount < 12 || codexArcanaMarkCount < 12) throw new Error("기운 도감 역할/추천/마크 표시 실패");
await assertCodexVisual("characters", ".codex-kind-characters .character-portrait", 20, "캐릭터");
const codexPassiveChipCount = await page.locator(".codex-kind-characters .character-passive-chip").count();
if (codexPassiveChipCount < 46) throw new Error("캐릭터 도감 보조 패시브 칩 표시 실패");
await assertCodexVisual("stages", ".codex-kind-stages .stage-key-art", 15, "스테이지");
await assertCodexVisual("events", ".codex-kind-events .event-scene-codex", 10, "이벤트");
const codexEventRoleCount = await page.locator(".codex-kind-events .event-role-chip").count();
const codexEventRiskCount = await page.locator(".codex-kind-events .event-risk-chip").count();
const codexEventChoicePreviewCount = await page.locator(".codex-kind-events .event-choice-preview").count();
if (codexEventRoleCount < 10 || codexEventRiskCount < 10 || codexEventChoicePreviewCount < 30) throw new Error("이벤트 도감 역할/위험/선택지 표시 실패");
await assertCodexVisual("enemies", ".codex-kind-enemies .monster-portrait", 60, "몬스터");
await page.setViewportSize({ width: 390, height: 820 });
await page.waitForTimeout(120);
const codexMobileColumns = await page.locator(".codex-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
if (codexMobileColumns !== 1) throw new Error("모바일 콘텐츠 도감 1열 반응형 확인 실패");
await assertNoCodexOverflow("모바일");
await page.screenshot({ path: "tmp/codex-panel-mobile.png", fullPage: true });
await page.setViewportSize({ width: 1366, height: 900 });
await page.selectOption("#codexKindSelect", "cards");
await page.selectOption("#codexStatusSelect", "unlocked");
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
  const hand = Array.isArray(snapshot.hand) ? snapshot.hand.filter((cardId) => !["card_temp_dust", "card_sunbean_punch", "card_peach_dash", "card_ribbon_loop"].includes(cardId)) : [];
  snapshot.hand = ["card_temp_dust", "card_sunbean_punch", "card_peach_dash", "card_ribbon_loop", ...hand].slice(0, 5);
  const existingGemBag = Array.isArray(snapshot.inventory?.gemBag)
    ? snapshot.inventory.gemBag.filter((gem) => !["smoke_gem_damage", "smoke_gem_cost"].includes(gem.instanceId))
    : [];
  snapshot.inventory = {
    ...(snapshot.inventory || {}),
    gems: [...new Set([...(snapshot.inventory?.gems || []), "gem_coral_edge", "gem_sky_discount"])],
    gemBag: [
      ...existingGemBag,
      { instanceId: "smoke_gem_cost", gemId: "gem_sky_discount", equippedCardId: "card_sunbean_punch", equippedSlot: 0 },
      { instanceId: "smoke_gem_damage", gemId: "gem_coral_edge", equippedCardId: "card_peach_dash", equippedSlot: 0 }
    ]
  };
  snapshot.cardSockets = {
    ...(snapshot.cardSockets || {}),
    card_sunbean_punch: ["smoke_gem_cost"],
    card_peach_dash: ["smoke_gem_damage"]
  };
  snapshot.player = { ...(snapshot.player || {}), energy: 2, shield: 8 };
  snapshot.status = {
    ...(snapshot.status || {}),
    disruptionsCleared: 0,
    chain: 3,
    playerMarked: 2,
    playerWeak: 1,
    damageReduction: 4,
    retainShield: 5,
    reflectRatio: 0.5,
    nextTurnEnergyPenalty: 1
  };
  if (Array.isArray(snapshot.enemies) && snapshot.enemies[0]) {
    snapshot.enemies[0].hp = Math.min(snapshot.enemies[0].maxHp || 10, 10);
    snapshot.enemies[0].block = 0;
    snapshot.enemies[0].status = { ...(snapshot.enemies[0].status || {}), mark: 2, weak: 1 };
  }
  localStorage.setItem("sunny_maze_run_v1", JSON.stringify(snapshot));
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("#loadRunButton:not(:disabled)", { timeout: 10000 });
await page.click("#loadRunButton");
await page.waitForSelector(".stage-route-panel", { timeout: 10000 });
await page.waitForSelector(".current-room-panel", { timeout: 10000 });
await page.waitForSelector(".current-room-emblem", { timeout: 10000 });
await page.waitForSelector(".current-room-chip", { timeout: 10000 });
await page.waitForSelector(".combat-forecast", { timeout: 10000 });
await page.waitForSelector(".combat-status-board", { timeout: 10000 });
await page.waitForSelector(".combat-status-card.status-card-mark", { timeout: 10000 });
await page.waitForSelector(".combat-status-card.status-card-weak", { timeout: 10000 });
await page.waitForSelector(".combat-status-card.status-card-reflect", { timeout: 10000 });
await page.waitForSelector(".combat-status-card .status-card-meter b", { timeout: 10000 });
await page.waitForSelector(".turn-outcome-panel", { timeout: 10000 });
await page.waitForSelector(".turn-outcome-card", { timeout: 10000 });
await page.waitForSelector(".enemy-pattern-row", { timeout: 10000 });
await page.waitForSelector(".enemy-pattern-chip", { timeout: 10000 });
await page.waitForSelector(".enemy-status-chip.status-mark", { timeout: 10000 });
await page.waitForSelector(".enemy-status-chip.status-weak", { timeout: 10000 });
await page.waitForSelector(".play-card .card-ready-chip.ready", { timeout: 10000 });
await page.waitForSelector(".play-card .card-ready-chip.blocked", { timeout: 10000 });
await page.waitForSelector(".play-card .card-play-cue", { timeout: 10000 });
await page.waitForSelector(".play-card .card-cue-chip.cue-cost", { timeout: 10000 });
await page.waitForSelector(".play-card .card-cue-chip.cue-condition", { timeout: 10000 });
await page.waitForSelector(".play-card .card-cue-chip.cue-gem", { timeout: 10000 });
await page.waitForSelector(".play-card .hand-gem-list", { timeout: 10000 });
await page.waitForSelector(".play-card .hand-gem-chip .gem-icon", { timeout: 10000 });
await page.waitForSelector(".play-card .card-preview-list", { timeout: 10000 });
await page.waitForSelector(".play-card .card-preview-chip.preview-damage", { timeout: 10000 });
await page.waitForSelector(".play-card .card-preview-chip.preview-danger", { timeout: 10000 });
const playableTransition = await page.locator(".play-card.playable").first().evaluate((element) => getComputedStyle(element).transitionProperty);
if (!playableTransition.includes("transform")) throw new Error("사용 가능 카드 반응 전환 스타일 확인 실패");
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
const currentRoomText = await page.textContent(".current-room-panel");
if (!currentRoomText?.includes("현재 방") || !currentRoomText.includes("전투") || !currentRoomText.includes("진행")) {
  throw new Error("현재 방 안내판 핵심 정보 표시 실패");
}
const currentRoomChipCount = await page.locator(".current-room-chip").count();
if (currentRoomChipCount < 4) throw new Error("현재 방 안내 칩 표시 부족");
const currentRoomOverflowItems = await page.locator(".current-room-panel, .current-room-core, .current-room-emblem, .current-room-copy, .current-room-chip").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (currentRoomOverflowItems.length > 0) {
  throw new Error(`현재 방 안내판 UI 넘침: ${currentRoomOverflowItems.slice(0, 4).join(" | ")}`);
}
await page.locator(".current-room-panel").screenshot({ path: "tmp/current-room-panel-desktop.png" });
await page.waitForSelector(".deck-overview", { timeout: 10000 });
await page.waitForSelector(".deck-pile-chip", { timeout: 10000 });
await page.waitForSelector(".deck-type-chip", { timeout: 10000 });
await page.waitForSelector(".deck-cost-chip", { timeout: 10000 });
const deckOverviewText = await page.textContent(".deck-overview");
if (!deckOverviewText?.includes("덱 현황") || !deckOverviewText.includes("평균 비용") || !deckOverviewText.includes("드로우")) {
  throw new Error("덱 현황 요약판 핵심 정보 표시 실패");
}
const deckOverflowItems = await page.locator(".deck-overview, .deck-pile-chip, .deck-type-chip, .deck-cost-chip").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (deckOverflowItems.length > 0) {
  throw new Error(`덱 현황 요약판 UI 넘침: ${deckOverflowItems.slice(0, 4).join(" | ")}`);
}
await page.locator(".deck-overview").screenshot({ path: "tmp/deck-overview-desktop.png" });
const combatForecastText = await page.textContent(".combat-forecast");
if (!combatForecastText?.includes("이번 턴 예고") || (!combatForecastText.includes("예상 피해") && !combatForecastText.includes("피해 없음"))) {
  throw new Error("전투 예고판 표시 실패");
}
if (!combatForecastText.includes("상태판") || !combatForecastText.includes("표식") || !combatForecastText.includes("반사")) {
  throw new Error("전투 상태판 핵심 상태 표시 실패");
}
if (!combatForecastText.includes("턴 종료 예측") || !combatForecastText.includes("체력") || !combatForecastText.includes("다음 기운") || !combatForecastText.includes("연쇄")) {
  throw new Error("턴 종료 예측 패널 표시 실패");
}
const handText = await page.textContent(".hand-row");
if (!handText?.includes("사용 가능") || !handText.includes("기운 1 부족") || !handText.includes("약화 반영") || !handText.includes("처치 드로우")) {
  throw new Error("손패 카드 효과 미리보기 표시 실패");
}
if (!handText.includes("1 비용") || !handText.includes("2 효과") || !handText.includes("조건") || !handText.includes("보석") || !handText.includes("개 적용")) {
  throw new Error("손패 카드 발동 흐름 표시 실패");
}
if (!handText.includes("보석 피해") || !handText.includes("+25%") || !handText.includes("보석 비용") || !handText.includes("현재 0")) {
  throw new Error("손패 장착 보석 효과 표시 실패");
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
await page.waitForSelector(".play-card .card-role-chip", { timeout: 10000 });
await page.waitForSelector(".play-card .card-art-role-mark", { timeout: 10000 });
await page.waitForSelector(".arcana-chip", { timeout: 10000 });
const enemyText = await page.textContent(".enemy-card");
if (!enemyText?.includes("이번") || !enemyText.includes("형")) throw new Error("적 역할/의도 표시 실패");
if (!enemyText.includes("역할") || !enemyText.includes("패턴") || !enemyText.includes("위협")) throw new Error("몬스터 역할/패턴 칩 표시 실패");
const combatOverflowItems = await page.locator(".combat-forecast, .turn-outcome-panel, .turn-outcome-card, .combat-status-card, .status-card-copy, .enemy-pattern-chip, .enemy-status-chip, .disruption-control, .enemy-card, .intent-card, .intent-node, .monster-portrait, .play-card, .card-art, .card-role-chip, .card-art-role-mark, .card-cue-chip, .hand-gem-chip, .card-preview-chip").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (combatOverflowItems.length > 0) {
  throw new Error(`전투 UI 넘침: ${combatOverflowItems.slice(0, 4).join(" | ")}`);
}
await page.locator(".enemy-row").screenshot({ path: "tmp/enemy-pattern-cards-desktop.png" });
await page.locator(".turn-outcome-panel").screenshot({ path: "tmp/turn-outcome-panel-desktop.png" });
await page.locator(".hand-row").screenshot({ path: "tmp/card-use-cue-desktop.png" });
await page.locator(".hand-row").screenshot({ path: "tmp/hand-gem-effects-desktop.png" });
await page.screenshot({ path: "tmp/combat-ui-desktop.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 820 });
await page.waitForTimeout(120);
const currentRoomMobileColumns = await page.locator(".current-room-panel").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
if (currentRoomMobileColumns !== 1) throw new Error("모바일 현재 방 안내판 1열 반응형 확인 실패");
const deckMobileCostColumns = await page.locator(".deck-cost-row").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
if (deckMobileCostColumns !== 2) throw new Error("모바일 덱 비용 곡선 2열 반응형 확인 실패");
const deckMobileOverflow = await page.locator(".deck-overview, .deck-pile-chip, .deck-type-chip, .deck-cost-chip").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (deckMobileOverflow.length > 0) {
  throw new Error(`모바일 덱 현황 요약판 넘침: ${deckMobileOverflow.slice(0, 4).join(" | ")}`);
}
await page.locator(".deck-overview").screenshot({ path: "tmp/deck-overview-mobile.png" });
const combatStatusMobileColumns = await page.locator(".combat-status-board").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
if (combatStatusMobileColumns !== 1) throw new Error("모바일 전투 상태판 1열 반응형 확인 실패");
const combatStatusMobileOverflow = await page.locator(".current-room-panel, .current-room-core, .current-room-chip, .turn-outcome-panel, .turn-outcome-card, .combat-status-card, .status-card-copy, .enemy-pattern-chip, .enemy-status-chip, .card-cue-chip, .hand-gem-chip, .card-preview-chip").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (combatStatusMobileOverflow.length > 0) {
  throw new Error(`모바일 전투 상태판 넘침: ${combatStatusMobileOverflow.slice(0, 4).join(" | ")}`);
}
await page.locator(".current-room-panel").screenshot({ path: "tmp/current-room-panel-mobile.png" });
await page.locator(".turn-outcome-panel").screenshot({ path: "tmp/turn-outcome-panel-mobile.png" });
await page.locator(".enemy-row").screenshot({ path: "tmp/enemy-pattern-cards-mobile.png" });
await page.locator(".hand-row").screenshot({ path: "tmp/card-use-cue-mobile.png" });
await page.locator(".hand-row").screenshot({ path: "tmp/hand-gem-effects-mobile.png" });
await page.screenshot({ path: "tmp/combat-status-mobile.png", fullPage: true });
await page.setViewportSize({ width: 1366, height: 900 });

await page.click('[data-action="cleanse-disruption"]');
await page.waitForFunction(() => {
  const controlGone = !document.querySelector(".disruption-control");
  const clearedChip = [...document.querySelectorAll(".forecast-chip")].some((element) => element.textContent?.includes("정리 1"));
  return controlGone && clearedChip;
}, null, { timeout: 10000 });
await page.waitForSelector(".action-feedback-cleanse", { timeout: 10000 });
const cleanseFeedbackText = await page.textContent(".action-feedback-cleanse");
if (!cleanseFeedbackText?.includes("방해 정리") || !cleanseFeedbackText.includes("먼지 카드")) {
  throw new Error("방해 정리 액션 피드백 표시 실패");
}

const enabledCards = await page.locator(".play-card:not(:disabled)").count();
if (enabledCards === 0) throw new Error("사용 가능한 카드가 없습니다.");
await page.locator(".play-card:not(:disabled)").first().click();
await page.waitForSelector(".action-feedback-card", { timeout: 10000 });
await page.waitForSelector(".action-feedback-card .feedback-stat-damage", { timeout: 10000 });
await page.waitForSelector(".combat-impact-strip", { timeout: 10000 });
await page.waitForSelector(".combat-impact-chip.impact-damage", { timeout: 10000 });
await page.waitForSelector(".combat-impact-chip.impact-gem", { timeout: 10000 });
await page.waitForSelector(".enemy-impact-chip.impact-damage", { timeout: 10000 });
const actionFeedbackText = await page.textContent(".action-feedback-card");
if (!actionFeedbackText?.includes("카드 사용") || !actionFeedbackText.includes("햇콩 펀치")) {
  throw new Error("카드 사용 액션 피드백 표시 실패");
}
const combatImpactText = await page.textContent(".combat-impact-strip");
if (!combatImpactText?.includes("방금 효과") || !combatImpactText.includes("피해") || !combatImpactText.includes("보석")) {
  throw new Error("전투 연출 스트립 표시 실패");
}
const enemyHitCount = await page.locator(".enemy-hit").count();
const remainingEnemyCount = await page.locator(".enemy-card").count();
if (remainingEnemyCount > 0 && enemyHitCount === 0) throw new Error("피격 몬스터 강조 표시 실패");
const actionFeedbackOverflowItems = await page.locator(".action-feedback, .action-feedback-copy, .feedback-stat, .combat-impact-strip, .combat-impact-chip, .enemy-impact-chip, .enemy-hit").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (actionFeedbackOverflowItems.length > 0) {
  throw new Error(`액션 피드백 UI 넘침: ${actionFeedbackOverflowItems.slice(0, 4).join(" | ")}`);
}
await page.locator(".combat-impact-strip").screenshot({ path: "tmp/combat-impact-strip-desktop.png" });
await page.screenshot({ path: "tmp/action-feedback-desktop.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 820 });
await page.waitForTimeout(120);
const actionFeedbackMobileOverflow = await page.locator(".action-feedback, .action-feedback-copy, .feedback-stat, .combat-impact-strip, .combat-impact-chip, .enemy-impact-chip").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (actionFeedbackMobileOverflow.length > 0) {
  throw new Error(`모바일 액션 피드백 UI 넘침: ${actionFeedbackMobileOverflow.slice(0, 4).join(" | ")}`);
}
await page.locator(".combat-impact-strip").screenshot({ path: "tmp/combat-impact-strip-mobile.png" });
await page.screenshot({ path: "tmp/action-feedback-mobile.png", fullPage: true });
await page.setViewportSize({ width: 1366, height: 900 });
await page.click('[data-action="debug-relic"]');
await page.waitForSelector(".relic-chip", { timeout: 10000 });
await page.waitForSelector(".relic-chip .item-icon-relic", { timeout: 10000 });
await page.click('[data-action="debug-arcana"]');
await page.waitForFunction(() => document.querySelectorAll(".arcana-chip").length >= 2, null, { timeout: 10000 });
await page.waitForSelector(".arcana-chip .item-icon-arcana", { timeout: 10000 });
await page.click('[data-action="debug-gem"]');
await page.waitForSelector(".gem-card", { timeout: 10000 });
await page.waitForSelector('.gem-card .gem-icon[class*="gem-rarity-"]', { timeout: 10000 });
await page.waitForSelector(".gem-card .gem-role-chip", { timeout: 10000 });
await page.waitForSelector(".gem-card .gem-fit-list", { timeout: 10000 });
await page.waitForSelector(".gem-option", { timeout: 10000 });
await page.waitForSelector(".gem-option .gem-role-chip", { timeout: 10000 });
await page.waitForSelector(".gem-option .gem-fit-list", { timeout: 10000 });
await page.waitForSelector(".socket-growth-row", { timeout: 10000 });
await page.waitForSelector(".socket-growth-chip", { timeout: 10000 });
await page.waitForSelector(".gem-comparison-chip", { timeout: 10000 });
const socketGrowthText = await page.textContent(".socket-card");
if (!socketGrowthText?.includes("강화") || !socketGrowthText.includes("소켓") || !socketGrowthText.includes("후보")) {
  throw new Error("보석 작업대 카드 성장 상태 표시 실패");
}
const socketComparisonOverflow = await page.locator(".socket-card, .socket-growth-chip, .gem-option, .gem-role-chip, .gem-fit-list, .gem-comparison-chip").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (socketComparisonOverflow.length > 0) {
  throw new Error(`보석 장착 후보 비교 UI 넘침: ${socketComparisonOverflow.slice(0, 4).join(" | ")}`);
}
await page.locator(".socket-card").first().screenshot({ path: "tmp/socket-card-growth-desktop.png" });
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
await page.waitForSelector(".socket-growth-chip", { timeout: 10000 });
await page.setViewportSize({ width: 390, height: 820 });
await page.waitForTimeout(120);
const socketGrowthMobileColumns = await page.locator(".socket-growth-row").first().evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
if (socketGrowthMobileColumns !== 2) throw new Error("모바일 카드 성장 상태 2열 반응형 확인 실패");
const socketGrowthMobileOverflow = await page.locator(".socket-card, .socket-growth-chip, .socket-dot, .effect-chip").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (socketGrowthMobileOverflow.length > 0) {
  throw new Error(`모바일 카드 성장 상태 UI 넘침: ${socketGrowthMobileOverflow.slice(0, 4).join(" | ")}`);
}
await page.locator(".socket-card").first().screenshot({ path: "tmp/socket-card-growth-mobile.png" });
await page.setViewportSize({ width: 1366, height: 900 });

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
await page.waitForSelector(".market-box .choice-impact-chip", { timeout: 10000 });
await page.waitForSelector(".market-box .reward-fit-panel", { timeout: 10000 });
await page.waitForSelector(".market-box .reward-fit-chip", { timeout: 10000 });
await page.waitForSelector(".market-box .reward-preview-card", { timeout: 10000 });
const rewardCardCount = await page.locator(".market-box .reward-kind-card").count();
const rewardCardArtCount = await page.locator(".market-box .reward-kind-card .card-art-preview").count();
if (rewardCardCount > 0 && rewardCardArtCount === 0) throw new Error("보상 카드 미리보기 일러스트 표시 실패");
const rewardRelicOrArcanaCount = await page.locator(".market-box .reward-kind-relic, .market-box .reward-kind-arcana").count();
const rewardItemIconCount = await page.locator(".market-box .reward-kind-relic .item-icon, .market-box .reward-kind-arcana .item-icon").count();
const rewardBuildRoleCount = await page.locator(".market-box .reward-kind-relic .build-role-chip, .market-box .reward-kind-arcana .build-role-chip").count();
const rewardBuildFitCount = await page.locator(".market-box .reward-kind-relic .build-fit-list, .market-box .reward-kind-arcana .build-fit-list").count();
if (rewardRelicOrArcanaCount > 0 && (rewardItemIconCount === 0 || rewardBuildRoleCount === 0 || rewardBuildFitCount === 0)) throw new Error("유물/기운 보상 역할 미리보기 표시 실패");

const marketText = await page.textContent(".market-box");
if (!marketText?.includes("비용") || !marketText.includes("별사탕")) {
  throw new Error("상점/이벤트/보상 비용 표시 확인 실패");
}

const marketImpactChipCount = await page.locator(".market-box .choice-impact-chip").count();
if (marketImpactChipCount < 3) throw new Error("상점/보상 선택지 효과 요약 칩 부족");
const rewardFitPanelCount = await page.locator(".market-box .reward-fit-panel").count();
const rewardFitChipCount = await page.locator(".market-box .reward-fit-chip").count();
if (rewardFitPanelCount < 3 || rewardFitChipCount < 6) throw new Error("상점/보상 추천 신호 칩 부족");

const overflowItems = await page.locator(".market-box, .market-choice, .choice-impact-chip, .reward-fit-panel, .reward-fit-chip, .reward-preview-card, .choice-wallet, .card-art-preview, .build-role-chip, .build-fit-list").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (overflowItems.length > 0) {
  throw new Error(`상점/이벤트/보상 UI 넘침: ${overflowItems.slice(0, 4).join(" | ")}`);
}

await page.locator(".market-choice").first().screenshot({ path: "tmp/choice-impact-market-card.png" });
await page.screenshot({ path: "tmp/market-ui-desktop.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 820 });
await page.waitForTimeout(120);
const mobileColumns = await page.locator(".market-list").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
if (mobileColumns !== 1) throw new Error("모바일 상점/보상 선택지 1열 반응형 확인 실패");
const mobileRouteColumns = await page.locator(".route-node-list").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
if (mobileRouteColumns !== 2) throw new Error("모바일 스테이지 경로 2열 반응형 확인 실패");
const mobileMarketOverflow = await page.locator(".market-box, .market-choice, .choice-impact-chip, .reward-fit-panel, .reward-fit-chip, .reward-preview-card, .choice-wallet, .card-art-preview, .build-role-chip, .build-fit-list").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (mobileMarketOverflow.length > 0) {
  throw new Error(`모바일 상점/이벤트/보상 UI 넘침: ${mobileMarketOverflow.slice(0, 4).join(" | ")}`);
}
await page.screenshot({ path: "tmp/market-ui-mobile.png", fullPage: true });

await page.setViewportSize({ width: 1366, height: 900 });
await page.evaluate(async () => {
  const raw = localStorage.getItem("sunny_maze_run_v1");
  if (!raw) throw new Error("방 완료 검증용 저장 데이터가 없음");
  const snapshot = JSON.parse(raw);
  const stages = await fetch("/src/data/ko/stages.json").then((response) => response.json());
  const stage = stages.find((item) => item.id === snapshot.stageId) || stages[0];
  if (!stage || !Array.isArray(stage.rooms) || stage.rooms.length < 2) throw new Error("방 완료 검증용 스테이지 데이터가 없음");
  const roomIndex = Math.min(1, Math.max(0, stage.rooms.length - 2));
  snapshot.phase = "room_complete";
  snapshot.stageId = stage.id;
  snapshot.roomIndex = roomIndex;
  snapshot.currentRoomType = stage.rooms[roomIndex] || "combat";
  snapshot.pendingReward = null;
  snapshot.pendingEvent = null;
  snapshot.enemies = [];
  snapshot.metrics = {
    ...(snapshot.metrics || {}),
    roomsCleared: roomIndex + 1,
    enemiesDefeated: 4,
    maxChain: 5
  };
  snapshot.status = {
    ...(snapshot.status || {}),
    actionFeedback: {
      id: "smoke_room_complete_feedback",
      kind: "reward",
      tone: "gold",
      icon: "별",
      title: "보상 획득",
      subject: "별사탕 묶음",
      detail: "방금 고른 보상이 다음 방 준비에 반영되었습니다.",
      metrics: [
        { label: "획득", value: "96" },
        { label: "선택", value: "보상" }
      ]
    }
  };
  snapshot.player = { ...(snapshot.player || {}), hp: 48, maxHp: 64, gold: 96 };
  localStorage.setItem("sunny_maze_run_v1", JSON.stringify(snapshot));
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("#loadRunButton:not(:disabled)", { timeout: 10000 });
await page.click("#loadRunButton");
await page.waitForSelector(".room-complete-panel", { timeout: 10000 });
await page.waitForSelector(".room-complete-emblem", { timeout: 10000 });
await page.waitForSelector(".room-complete-card", { timeout: 10000 });
await page.waitForSelector(".next-room-preview", { timeout: 10000 });
await page.waitForSelector(".room-complete-feedback", { timeout: 10000 });
await page.waitForSelector(".room-complete-feedback-icon", { timeout: 10000 });
await page.waitForSelector(".room-complete-feedback-metrics .feedback-stat", { timeout: 10000 });
await page.waitForSelector(".room-advance-btn", { timeout: 10000 });
const roomCompleteText = await page.textContent(".room-complete-panel");
if (!roomCompleteText?.includes("방 완료") || !roomCompleteText.includes("이번 방 성과") || !roomCompleteText.includes("다음 방") || !roomCompleteText.includes("직전 결과")) {
  throw new Error("방 완료 전환 패널 핵심 문구 표시 실패");
}
const roomCompleteProgressWidth = await page.locator(".room-complete-meter i").evaluate((element) => parseFloat(getComputedStyle(element).width));
if (!(roomCompleteProgressWidth > 0)) throw new Error("방 완료 진행 바 표시 실패");
const roomCompleteOverflowItems = await page.locator(".room-complete-panel, .room-complete-head, .room-complete-emblem, .room-complete-card, .next-room-preview, .room-complete-feedback, .room-complete-feedback-copy, .feedback-stat, .room-advance-btn").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (roomCompleteOverflowItems.length > 0) {
  throw new Error(`방 완료 전환 UI 넘침: ${roomCompleteOverflowItems.slice(0, 4).join(" | ")}`);
}
await page.locator(".room-complete-feedback").screenshot({ path: "tmp/room-complete-feedback-card.png" });
await page.screenshot({ path: "tmp/room-complete-desktop.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 820 });
await page.waitForTimeout(120);
const roomCompleteMobileColumns = await page.locator(".room-complete-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
if (roomCompleteMobileColumns !== 1) throw new Error("모바일 방 완료 카드 1열 반응형 확인 실패");
const roomCompleteMobileOverflow = await page.locator(".room-complete-panel, .room-complete-head, .room-complete-emblem, .room-complete-card, .next-room-preview, .room-complete-feedback, .room-complete-feedback-copy, .feedback-stat, .room-advance-btn").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (roomCompleteMobileOverflow.length > 0) {
  throw new Error(`모바일 방 완료 전환 UI 넘침: ${roomCompleteMobileOverflow.slice(0, 4).join(" | ")}`);
}
await page.screenshot({ path: "tmp/room-complete-mobile.png", fullPage: true });

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
await page.waitForSelector(".event-choice .choice-impact-chip", { timeout: 10000 });
await page.waitForSelector(".event-choice .event-role-chip", { timeout: 10000 });
await page.waitForSelector(".event-choice .event-risk-chip", { timeout: 10000 });
await page.waitForSelector(".event-summary-row .event-risk-chip", { timeout: 10000 });
await page.waitForSelector(".event-choice .reward-preview-card", { timeout: 10000 });
const eventText = await page.textContent(".event-box");
if (!eventText?.includes("리본 분수") || !eventText.includes("카드를 강화한다")) throw new Error("이벤트 화면 핵심 문구 표시 실패");
const eventChoiceCount = await page.locator(".event-choice").count();
const eventIconCount = await page.locator(".event-choice .choice-reward-icon").count();
if (eventChoiceCount < 3 || eventIconCount !== eventChoiceCount) throw new Error("이벤트 선택지 아이콘 표시 실패");
const eventImpactChipCount = await page.locator(".event-choice .choice-impact-chip").count();
if (eventImpactChipCount < eventChoiceCount) throw new Error("이벤트 선택지 효과 요약 칩 부족");
const eventRoleChipCount = await page.locator(".event-choice .event-role-chip").count();
const eventRiskChipCount = await page.locator(".event-choice .event-risk-chip").count();
if (eventRoleChipCount < eventChoiceCount || eventRiskChipCount < eventChoiceCount) throw new Error("이벤트 선택지 역할/위험 칩 부족");
const eventOverflowItems = await page.locator(".event-box, .event-head, .event-visual-card, .event-choice, .event-role-chip, .event-risk-chip, .event-choice-count-chip, .choice-reward-icon, .choice-impact-chip, .reward-preview-card, .build-role-chip, .build-fit-list").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (eventOverflowItems.length > 0) {
  throw new Error(`이벤트 UI 넘침: ${eventOverflowItems.slice(0, 4).join(" | ")}`);
}
await page.locator(".event-choice").first().screenshot({ path: "tmp/choice-impact-event-card.png" });
await page.screenshot({ path: "tmp/event-ui-desktop.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 820 });
await page.waitForTimeout(120);
const eventMobileColumns = await page.locator(".market-list").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
if (eventMobileColumns !== 1) throw new Error("모바일 이벤트 선택지 1열 반응형 확인 실패");
const eventMobileOverflowItems = await page.locator(".event-box, .event-head, .event-visual-card, .event-choice, .event-role-chip, .event-risk-chip, .event-choice-count-chip, .choice-reward-icon, .choice-impact-chip, .reward-preview-card").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (eventMobileOverflowItems.length > 0) {
  throw new Error(`모바일 이벤트 UI 넘침: ${eventMobileOverflowItems.slice(0, 4).join(" | ")}`);
}
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
await page.waitForSelector(".boss-phase-head", { timeout: 10000 });
await page.waitForSelector(".boss-phase-meter b", { timeout: 10000 });
await page.waitForSelector(".monster-rank-crown", { timeout: 10000 });
const bossPhaseText = await page.textContent(".boss-phase-panel");
if (!bossPhaseText?.includes("곧 발동") || !bossPhaseText.includes("장벽 +") || !bossPhaseText.includes("페이즈") || !bossPhaseText.includes("체력")) throw new Error("보스 페이즈 예고 표시 실패");
const bossVisualParts = await page.locator(".enemy-rank-boss .monster-face, .enemy-rank-boss .monster-rank-crown, .enemy-rank-boss .monster-eye").count();
if (bossVisualParts < 4) throw new Error("보스 마스코트 초상 구성 실패");
const bossOverflowItems = await page.locator(".enemy-rank-boss, .enemy-pattern-chip, .boss-phase-panel, .boss-phase-head, .boss-phase-step, .monster-portrait").evaluateAll((elements) => elements
  .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
  .map((element) => element.className));
if (bossOverflowItems.length > 0) {
  throw new Error(`보스 패턴 UI 넘침: ${bossOverflowItems.slice(0, 4).join(" | ")}`);
}
await page.locator(".enemy-rank-boss").screenshot({ path: "tmp/boss-pattern-card-desktop.png" });
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
