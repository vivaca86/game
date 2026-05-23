import { checkAchievements } from "./achievements.js";
import { startCombat } from "./combat.js";
import { healPlayer } from "./card-effects.js";
import { addLog } from "./game-state.js";
import { createNewRun } from "./game-state.js";
import { openReward } from "./rewards.js";
import { ensureGemState } from "./gems.js";
import { initializeRunModifiers, modifiedGoldReward, updateRevealedRoom } from "./run-modifiers.js";
import { applyProfileToRun } from "./profile.js";

export function startRun(index, options = {}) {
  const state = createNewRun(index, options);
  ensureGemState(state);
  applyProfileToRun(state, index, options.profile);
  initializeRunModifiers(state, index);
  enterCurrentRoom(state, index);
  return state;
}

export function enterCurrentRoom(state, index) {
  const stage = index.stages.get(state.stageId);
  updateRevealedRoom(state, index);
  const roomType = stage.rooms[state.roomIndex];
  state.currentRoomType = roomType;
  if (["combat", "elite", "boss"].includes(roomType)) {
    startCombat(state, index, roomType);
    return state;
  }
  if (roomType === "event") {
    const event = index.data.events[(stage.order + state.roomIndex) % index.data.events.length];
    state.pendingEvent = event;
    state.phase = "event";
    addLog(state, `이벤트: ${event.name}`);
    return state;
  }
  if (roomType === "shop" || roomType === "reward") {
    openReward(state, index, roomType);
    return state;
  }
  if (roomType === "rest") {
    healPlayer(state, Math.ceil(state.player.maxHp * 0.2), index);
    state.phase = "room_complete";
    return state;
  }
  state.phase = "room_complete";
  return state;
}

export function advanceRoom(state, index) {
  if (!["room_complete", "reward"].includes(state.phase)) return false;
  const stage = index.stages.get(state.stageId);
  state.roomIndex += 1;
  if (state.roomIndex >= stage.rooms.length) {
    state.phase = "stage_clear";
    if (stage.clearRewards?.gold) state.player.gold += modifiedGoldReward(state, index, stage.clearRewards.gold);
    if (stage.clearRewards?.unlockStageId && !state.inventory.unlockedStages.includes(stage.clearRewards.unlockStageId)) {
      state.inventory.unlockedStages.push(stage.clearRewards.unlockStageId);
    }
    checkAchievements(state, index, "clear_stage", { stageId: stage.id });
    addLog(state, `${stage.name} 클리어`);
    return true;
  }
  enterCurrentRoom(state, index);
  return true;
}
