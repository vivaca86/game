import type { GameDataBundle } from "../../../data/schema";
import { startCombatForCurrentRoom } from "../combat/combatSystem";
import { claimFirstReward, prepareRewardOffer } from "../rewards/rewardSystem";
import { ensureRuneBenchGrant, equipFirstRune } from "../runes/runeSystem";
import {
  getCurrentRoom,
  getEncounterPoolContentId,
  getStage,
  pushRunLog,
  type SliceRunState
} from "../../state/runState";

export function enterWorldMap(run: SliceRunState): void {
  run.phase = "world_map";
  pushRunLog(run, "flow:world_map");
}

export function enterDungeon(run: SliceRunState): void {
  run.phase = "dungeon";
  run.roomIndex = Math.max(0, run.roomIndex);
  pushRunLog(run, "flow:dungeon");
}

export function enterCurrentRoom(run: SliceRunState, bundle: GameDataBundle): void {
  const room = getCurrentRoom(bundle, run);
  if (!room) {
    run.phase = "result";
    pushRunLog(run, "flow:missing_room_result");
    return;
  }

  if (room.type === "combat" || room.type === "elite" || room.type === "boss") {
    startCombatForCurrentRoom(run, bundle);
  } else if (room.type === "reward") {
    run.phase = "reward";
    prepareRewardOffer(run, bundle, room.rewardPoolId ?? getStage(bundle, run)?.rewardPools[0], 3);
    pushRunLog(run, `flow:reward:${room.id}`);
  } else if (room.type === "event" || room.type === "rest") {
    const eventId = room.type === "event"
      ? getEncounterPoolContentId(bundle, room.encounterPoolId, "event")
      : undefined;
    run.phase = "rune_bench";
    ensureRuneBenchGrant(run, bundle);
    pushRunLog(run, `flow:rune_bench:${eventId ?? room.id}`);
  } else {
    run.phase = "dungeon";
    pushRunLog(run, `flow:room_placeholder:${room.id}`);
  }
}

export function claimRewardAndAdvance(run: SliceRunState, bundle: GameDataBundle): void {
  claimFirstReward(run, bundle);
  const stage = getStage(bundle, run);
  const route = stage?.route ?? [];
  let nextIndex = (run.rewardSourceRoomIndex ?? run.roomIndex) + 1;

  while (route[nextIndex]?.type === "reward") {
    nextIndex += 1;
  }

  run.rewardSourceRoomIndex = undefined;
  run.roomIndex = Math.min(nextIndex, Math.max(0, route.length - 1));
  enterCurrentRoom(run, bundle);
}

export function equipRuneAndAdvance(run: SliceRunState, bundle: GameDataBundle): void {
  equipFirstRune(run, bundle);
  const stage = getStage(bundle, run);
  const routeLength = stage?.route.length ?? 1;
  run.roomIndex = Math.min(run.roomIndex + 1, Math.max(0, routeLength - 1));
  enterCurrentRoom(run, bundle);
}

export function returnToTown(run: SliceRunState): void {
  run.phase = "town";
  run.roomIndex = 0;
  run.combat = undefined;
  run.rewardPoolId = undefined;
  run.offeredRewards = [];
  run.rewardSourceRoomIndex = undefined;
  pushRunLog(run, "flow:town_return");
}
