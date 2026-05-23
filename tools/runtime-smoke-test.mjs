import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createGameIndex, assertRuntimeData } from "../src/core/data-loader.js";
import { playCard, endTurn } from "../src/core/combat.js";
import { startRun, advanceRoom } from "../src/core/progression.js";
import { applyEventChoice, applyRewardOption } from "../src/core/rewards.js";
import { cardCost } from "../src/core/card-effects.js";
import { equipGemToCard, grantGem, openSocketForCard, socketCapacity } from "../src/core/gems.js";
import { createSaveSnapshot, restoreRunState } from "../src/core/persistence.js";
import { createRewardOptions } from "../src/core/rewards.js";
import { grantArcana, grantRelic } from "../src/core/run-modifiers.js";

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

const state = startRun(index, {
  characterId: "char_haru",
  stageId: "stage_sunny_gate",
  seed: 20260523
});
state.player.maxHp = 999;
state.player.hp = 999;

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
const snapshot = createSaveSnapshot(state);
const restored = restoreRunState(snapshot, index);
if (!restored?.inventory?.gemBag?.length) throw new Error("저장 보석 보관함 복원 실패");
if (!Object.keys(restored.cardSockets || {}).length) throw new Error("저장 장착 보석 복원 실패");
if (!restored.inventory.relics.includes("relic_ribbon_box")) throw new Error("저장 유물 복원 실패");
if (!restored.inventory.arcanas.includes("arcana_star_bakery")) throw new Error("저장 기운 복원 실패");

console.log("런타임 스모크 통과");
console.log(`phase=${state.phase}, rooms=${state.metrics.roomsCleared}, cards=${state.inventory.unlockedCards.length}, gems=${state.inventory.gemBag.length}, achievements=${state.inventory.achievements.length}, gold=${state.player.gold}`);
