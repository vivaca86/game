import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createGameIndex, assertRuntimeData } from "../src/core/data-loader.js";
import { playCard, endTurn } from "../src/core/combat.js";
import { startRun, advanceRoom } from "../src/core/progression.js";
import { applyEventChoice, applyRewardOption } from "../src/core/rewards.js";
import { cardCost } from "../src/core/card-effects.js";

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

let safety = 0;
while (state.phase !== "stage_clear" && state.phase !== "defeat" && safety < 240) {
  safety += 1;
  if (state.phase === "combat") {
    const playableIndex = state.hand.findIndex((cardId) => {
      const card = index.cards.get(cardId);
      return card && cardCost(card, state) <= state.player.energy;
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

console.log("런타임 스모크 통과");
console.log(`phase=${state.phase}, rooms=${state.metrics.roomsCleared}, cards=${state.inventory.unlockedCards.length}, achievements=${state.inventory.achievements.length}, gold=${state.player.gold}`);
