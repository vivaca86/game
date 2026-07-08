import type { EventChoice, EventData, GameDataBundle, GameEffect } from "../../../data/schema";
import { startCombatWithEnemyId } from "../combat/combatSystem";
import { grantRewardEntry } from "../rewards/rewardSystem";
import {
  getCurrentRoom,
  getEncounterPoolContentId,
  getStage,
  pushRunLog,
  type SliceRunState
} from "../../state/runState";

export function getCurrentEvent(bundle: GameDataBundle, run: SliceRunState): EventData | undefined {
  const room = getCurrentRoom(bundle, run);
  const eventId = getEncounterPoolContentId(bundle, room?.encounterPoolId, "event");
  return bundle.events.find((event) => event.id === eventId);
}

export function firstAffordableEventChoiceIndex(run: SliceRunState, bundle: GameDataBundle): number {
  const event = getCurrentEvent(bundle, run);
  if (!event) return -1;
  return event.choices.findIndex((choice) => canPayEventChoice(run, choice));
}

export function canPayEventChoice(run: SliceRunState, choice: EventChoice): boolean {
  return (choice.cost ?? []).every((effect) => canPayEventCost(run, effect));
}

export function applyEventChoiceAtIndex(run: SliceRunState, bundle: GameDataBundle, index: number): boolean {
  if (run.phase !== "event") return false;

  const event = getCurrentEvent(bundle, run);
  const choice = event?.choices[index];
  if (!event || !choice) {
    pushRunLog(run, `event:missing_choice:${index + 1}`);
    return false;
  }

  if (!canPayEventChoice(run, choice)) {
    pushRunLog(run, `event:blocked:${choice.id}`);
    return false;
  }

  for (const cost of choice.cost ?? []) {
    payEventCost(run, cost);
  }

  const hasRuneReward = (choice.rewards ?? []).some((reward) => reward.type === "rune");
  for (const reward of choice.rewards ?? []) {
    grantRewardEntry(run, bundle, reward, "event");
  }

  run.lastEventChoiceId = choice.id;
  pushRunLog(run, `event:choice:${choice.id}`);

  if (choice.eventCombatEnemyId) {
    startCombatWithEnemyId(run, bundle, choice.eventCombatEnemyId);
    return true;
  }

  if (hasRuneReward) {
    run.phase = "rune_bench";
    pushRunLog(run, `flow:rune_bench:${event.id}`);
    return true;
  }

  advancePastEvent(run, bundle);
  return true;
}

function canPayEventCost(run: SliceRunState, effect: GameEffect): boolean {
  const amount = effect.value.amount ?? 0;
  if (effect.op === "spend_currency") return run.player.gold >= amount;
  if (effect.op === "spend_hp") return run.player.hp > amount;
  return true;
}

function payEventCost(run: SliceRunState, effect: GameEffect): void {
  const amount = effect.value.amount ?? 0;
  if (effect.op === "spend_currency") {
    run.player.gold = Math.max(0, run.player.gold - amount);
    pushRunLog(run, `event:cost:gold:${amount}`);
  } else if (effect.op === "spend_hp") {
    run.player.hp = Math.max(1, run.player.hp - amount);
    pushRunLog(run, `event:cost:hp:${amount}`);
  }
}

function advancePastEvent(run: SliceRunState, bundle: GameDataBundle): void {
  const routeLength = getStage(bundle, run)?.route.length ?? 1;
  run.roomIndex = Math.min(run.roomIndex + 1, Math.max(0, routeLength - 1));
  run.phase = "dungeon";
  pushRunLog(run, `flow:event_complete:${run.roomIndex}`);
}
