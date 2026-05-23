import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createGameIndex, assertRuntimeData } from "../src/core/data-loader.js";
import { cleanseDisruption, playCard, endTurn } from "../src/core/combat.js";
import { startRun, advanceRoom } from "../src/core/progression.js";
import { applyEventChoice, applyRewardOption } from "../src/core/rewards.js";
import { cardCost } from "../src/core/card-effects.js";
import { equipGemToCard, grantGem, openSocketForCard, socketCapacity } from "../src/core/gems.js";
import { createSaveSnapshot, restoreRunState } from "../src/core/persistence.js";
import { createRewardOptions } from "../src/core/rewards.js";
import { grantArcana, grantRelic } from "../src/core/run-modifiers.js";
import { createDefaultProfile, finalizeRunProfile } from "../src/core/profile.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "ko");
const readJson = async (fileName) => JSON.parse(await readFile(path.join(dataDir, fileName), "utf8"));

const data = {
  targets: await readJson("content-targets.json"),
  strings: await readJson("strings.json"),
  cards: await readJson("cards.json"),
  gems: await readJson("gems.json"),
  relics: await readJson("relics.json"),
  arcanas: await readJson("arcanas.json"),
  characters: await readJson("characters.json"),
  enemies: await readJson("enemies.json"),
  stages: await readJson("stages.json"),
  events: await readJson("events.json"),
  metaUpgrades: await readJson("meta-upgrades.json"),
  achievements: await readJson("achievements.json")
};

const index = createGameIndex(data);
assertRuntimeData(data, index);

let profile = createDefaultProfile(index);
if (profile.unlockedStages.includes("stage_lavender_hall")) throw new Error("초기 스테이지 잠금 검증 실패");
if (!profile.unlockedCharacters.includes("char_haru")) throw new Error("초기 캐릭터 해금 검증 실패");
profile.unlockedArcanas.push("arcana_bubble_luck");

const state = startRun(index, {
  characterId: "char_haru",
  stageId: "stage_sunny_gate",
  seed: 20260523,
  profile
});
state.player.maxHp = 999;
state.player.hp = 999;

const interactionState = startRun(index, {
  characterId: "char_haru",
  stageId: "stage_sunny_gate",
  seed: 20260525,
  profile
});
interactionState.player.maxHp = 999;
interactionState.player.hp = 999;
interactionState.player.energy = 20;
const promiseCard = index.cards.get("card_morning_promise");
const matchingColorCard = data.cards.find((card) => card.color === promiseCard.color && card.id !== promiseCard.id && !["curse", "temp"].includes(card.type));
interactionState.hand = [promiseCard.id, matchingColorCard.id];
const ruleShieldBefore = interactionState.player.shield;
if (!playCard(interactionState, index, 0)) throw new Error("전투 규칙 카드 사용 실패");
if (!interactionState.battleRules.some((rule) => rule.rule === "shield_on_color_play")) throw new Error("전투 규칙 등록 실패");
if (interactionState.player.shield <= ruleShieldBefore) throw new Error("전투 규칙 즉시 발동 실패");
const shieldAfterPromise = interactionState.player.shield;
if (!playCard(interactionState, index, 0)) throw new Error("전투 규칙 후속 카드 사용 실패");
if (interactionState.player.shield <= shieldAfterPromise) throw new Error("전투 규칙 후속 발동 실패");
if ((interactionState.status.battleRuleTriggers || 0) < 2) throw new Error("전투 규칙 발동 횟수 기록 실패");

const reflectState = startRun(index, {
  characterId: "char_haru",
  stageId: "stage_sunny_gate",
  seed: 20260526,
  profile
});
reflectState.player.maxHp = 999;
reflectState.player.hp = 999;
reflectState.player.energy = 20;
reflectState.hand = ["card_round_mirror"];
reflectState.enemies[0].hp = 120;
reflectState.enemies[0].maxHp = 120;
reflectState.enemies[0].block = 0;
reflectState.enemies[0].intents = [{ type: "attack", amount: 30, label: "테스트 공격" }];
const reflectEnemyHpBefore = reflectState.enemies[0].hp;
if (!playCard(reflectState, index, 0)) throw new Error("반사 카드 사용 실패");
if ((reflectState.status.reflectRatio || 0) <= 0) throw new Error("반사 상태 등록 실패");
endTurn(reflectState, index);
if (reflectState.enemies[0]?.hp >= reflectEnemyHpBefore) throw new Error("반사 피해 적용 실패");
if ((reflectState.status.reflectRatio || 0) !== 0) throw new Error("반사 상태 턴 종료 초기화 실패");

const markState = startRun(index, {
  characterId: "char_haru",
  stageId: "stage_sunny_gate",
  seed: 20260527,
  profile
});
markState.player.maxHp = 999;
markState.player.hp = 999;
markState.player.energy = 20;
markState.hand = ["card_paper_charm", "card_sunbean_punch"];
markState.enemies[0].hp = 100;
markState.enemies[0].maxHp = 100;
markState.enemies[0].block = 0;
if (!playCard(markState, index, 0)) throw new Error("표식 카드 사용 실패");
if ((markState.enemies[0].status.mark || 0) !== 2) throw new Error("표식 누적 실패");
const markedHpBefore = markState.enemies[0].hp;
if (!playCard(markState, index, 0)) throw new Error("표식 피해 카드 사용 실패");
const markedDamage = markedHpBefore - markState.enemies[0].hp;
if (markedDamage <= 11) throw new Error(`표식 피해 보너스 실패: ${markedDamage}`);
if ((markState.enemies[0].status.mark || 0) !== 1) throw new Error("표식 소모 실패");

const disruptionState = startRun(index, {
  characterId: "char_haru",
  stageId: "stage_sunny_gate",
  seed: 20260528,
  profile
});
disruptionState.player.energy = 1;
disruptionState.hand = ["card_temp_dust", "card_sunbean_punch"];
const disruptionEnergyBefore = disruptionState.player.energy;
if (!cleanseDisruption(disruptionState, index)) throw new Error("방해 카드 정리 실패");
if (disruptionState.hand.includes("card_temp_dust")) throw new Error("방해 카드 손패 제거 실패");
if (!disruptionState.exhaustPile.includes("card_temp_dust")) throw new Error("방해 카드 소멸 더미 이동 실패");
if (disruptionState.player.energy !== disruptionEnergyBefore - 1) throw new Error("방해 카드 정리 비용 실패");
if (disruptionState.status.chain) throw new Error("방해 카드 정리가 연쇄를 올리면 안 됩니다");
if ((disruptionState.status.disruptionsCleared || 0) !== 1) throw new Error("방해 카드 정리 기록 실패");
if (disruptionState.player.energy !== 0 || disruptionState.hand.some((cardId) => ["card_temp_dust"].includes(cardId))) throw new Error("방해 카드 정리 후 상태 검증 실패");

const curseState = startRun(index, {
  characterId: "char_haru",
  stageId: "stage_sunny_gate",
  seed: 20260529,
  profile
});
curseState.player.energy = 1;
curseState.hand = ["card_temp_sleepy"];
if (cleanseDisruption(curseState, index)) throw new Error("저주 카드 저비용 정리 차단 실패");
curseState.player.energy = 2;
if (!cleanseDisruption(curseState, index)) throw new Error("저주 카드 정리 실패");
if (curseState.player.energy !== 0) throw new Error("저주 카드 정리 비용 실패");

const firstCardId = state.deck[0];
const firstCard = index.cards.get(firstCardId);
const discountGem = grantGem(state, "gem_sky_discount");
const equipResult = equipGemToCard(state, index, discountGem.instanceId, firstCardId);
if (!equipResult.ok) throw new Error("보석 장착 검증 실패");
if (socketCapacity(state, index, firstCardId) < 1) throw new Error("카드 소켓 검증 실패");
if (cardCost(firstCard, state, index) > Math.max(0, firstCard.cost - 1)) throw new Error("보석 비용 감소 검증 실패");
if (!state.inventory.arcanas.includes("arcana_picnic_rhythm")) throw new Error("시작 기운 지급 검증 실패");
if (!grantRelic(state, index, "relic_ribbon_box")) throw new Error("유물 지급 검증 실패");
if (!grantArcana(state, index, "arcana_star_bakery")) throw new Error("기운 지급 검증 실패");
const rewardOptions = createRewardOptions(state, index, "reward");
if (rewardOptions.filter((option) => option.type === "card").length < 4) throw new Error("유물 카드 보상 증가 검증 실패");
if (!rewardOptions.some((option) => option.type === "relic")) throw new Error("유물 보상 선택지 검증 실패");
if (!rewardOptions.some((option) => option.type === "arcana")) throw new Error("기운 보상 선택지 검증 실패");

const socketTestCardId = state.deck.find((cardId) => {
  const card = index.cards.get(cardId);
  return socketCapacity(state, index, cardId) < card.sockets.max;
});
if (!socketTestCardId) throw new Error("소켓 확장 대상 검증 실패");
const beforeSocketCapacity = socketCapacity(state, index, socketTestCardId);
if (openSocketForCard(state, index, socketTestCardId)) throw new Error("소켓 충전 없는 확장 차단 검증 실패");
state.status.gemWorkshopCharges = 1;
if (!openSocketForCard(state, index, socketTestCardId)) throw new Error("소켓 확장 검증 실패");
if (socketCapacity(state, index, socketTestCardId) !== beforeSocketCapacity + 1) throw new Error("소켓 수 증가 검증 실패");
if ((state.status.gemWorkshopCharges || 0) !== 0) throw new Error("소켓 충전 소비 검증 실패");

let safety = 0;
while (state.phase !== "stage_clear" && state.phase !== "defeat" && safety < 240) {
  safety += 1;
  if (state.phase === "combat") {
    const playableIndex = state.hand.findIndex((cardId) => {
      const card = index.cards.get(cardId);
      return card && cardCost(card, state, index) <= state.player.energy;
    });
    if (playableIndex >= 0) playCard(state, index, playableIndex);
    else endTurn(state, index);
    continue;
  }
  if (state.phase === "event") {
    applyEventChoice(state, index, 0);
    continue;
  }
  if (state.phase === "reward") {
    applyRewardOption(state, index, state.pendingReward.options[0].id);
    continue;
  }
  if (state.phase === "room_complete") {
    advanceRoom(state, index);
    continue;
  }
}

if (state.phase !== "stage_clear") {
  throw new Error(`런타임 스모크 실패: phase=${state.phase}, safety=${safety}`);
}
if (state.metrics.roomsCleared < 4) {
  throw new Error(`방 진행 검증 실패: ${state.metrics.roomsCleared}`);
}
if (state.inventory.unlockedCards.length <= 5) {
  throw new Error("보상 카드 획득 검증 실패");
}
if (state.inventory.achievements.length === 0) {
  throw new Error("업적 보상 연결 검증 실패");
}
if ((state.metrics.enemyIntentsResolved || 0) <= 0) throw new Error("적 의도 처리 검증 실패");
if ((state.metrics.bossPhaseTriggers || 0) <= 0) throw new Error("보스 페이즈 검증 실패");
const profileResult = finalizeRunProfile(state, index, profile);
profile = profileResult.profile;
if (!profile.clearedStages.includes("stage_sunny_gate")) throw new Error("프로필 스테이지 클리어 기록 실패");
if (!profile.unlockedStages.includes("stage_lavender_hall")) throw new Error("프로필 다음 스테이지 해금 실패");
if (!profile.unlockedCharacters.includes("char_riri")) throw new Error("프로필 스테이지 캐릭터 해금 실패");
if (!state.resultSummary?.unlocks?.length) throw new Error("런 결과 신규 해금 요약 실패");
if (!profile.achievements.includes("ach_character_01")) throw new Error("캐릭터 해금 업적 기록 실패");
if (!profile.unlockedCharacters.includes("char_duri")) throw new Error("캐릭터 해금 업적 보상 실패");
if (!profile.unlockedGems.includes("gem_sprout_edge")) throw new Error("연쇄 캐릭터 업적 보상 실패");
const nextRun = startRun(index, {
  characterId: "char_haru",
  stageId: "stage_lavender_hall",
  seed: 20260524,
  profile
});
if (nextRun.stageId !== "stage_lavender_hall") throw new Error("해금 스테이지 새 런 시작 실패");
if (!nextRun.enemies.some((enemy) => enemy.role && enemy.intents.length >= 3)) throw new Error("적 역할/추가 패턴 검증 실패");

const familyIntentLabels = new Set();
const familyRoles = new Set();
let ribbonCostIncreaseSeen = false;
for (const stage of data.stages) {
  for (let seedOffset = 0; seedOffset < 8; seedOffset += 1) {
    const probe = startRun(index, {
      characterId: "char_haru",
      stageId: stage.id,
      seed: 20260700 + stage.order * 10 + seedOffset,
      profile
    });
    if (probe.phase !== "combat") continue;
    probe.enemies.forEach((enemy) => {
      if (enemy.role) familyRoles.add(enemy.role);
      if (enemy.family === "리본" && enemy.intents.some((intent) => intent.effect === "chain_down" && intent.costIncrease > 0)) {
        ribbonCostIncreaseSeen = true;
      }
      enemy.intents.forEach((intent) => familyIntentLabels.add(intent.label));
    });
  }
}
const expectedFamilyLabels = ["몽실 숨기", "부적 표식", "새싹 돋기", "리본 헝클기", "방울 먼지", "프리즘 관통", "장난감 먼지", "쿠키 방패"];
expectedFamilyLabels.forEach((label) => {
  if (!familyIntentLabels.has(label)) throw new Error(`가족별 몬스터 특수 의도 누락: ${label}`);
});
if (familyRoles.size < 8) throw new Error(`몬스터 역할 차별화 부족: ${familyRoles.size}`);
if (!ribbonCostIncreaseSeen) throw new Error("리본 계열 다음 카드 비용 압박 검증 실패");
const snapshot = createSaveSnapshot(state);
const restored = restoreRunState(snapshot, index);
if (!restored?.inventory?.gemBag?.length) throw new Error("저장 보석 보관함 복원 실패");
if (!Object.keys(restored.cardSockets || {}).length) throw new Error("저장 장착 보석 복원 실패");
if (!restored.inventory.relics.includes("relic_ribbon_box")) throw new Error("저장 유물 복원 실패");
if (!restored.inventory.arcanas.includes("arcana_star_bakery")) throw new Error("저장 기운 복원 실패");
if (!restored.resultSummary?.unlocks?.length) throw new Error("저장 런 결과 복원 실패");

console.log("런타임 스모크 통과");
console.log(`phase=${state.phase}, rooms=${state.metrics.roomsCleared}, cards=${state.inventory.unlockedCards.length}, gems=${state.inventory.gemBag.length}, achievements=${state.inventory.achievements.length}, intents=${state.metrics.enemyIntentsResolved}, bossPhases=${state.metrics.bossPhaseTriggers}, profileStages=${profile.unlockedStages.length}, gold=${state.player.gold}`);
