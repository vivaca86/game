import type Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { InputAction } from "../../input/actions";
import { persistSave } from "../../save/saveCodec";
import { endTurn, playCardAtIndex } from "../../simulation/systems/combat/combatSystem";
import {
  claimRewardAndAdvance,
  enterCurrentRoom,
  enterDungeon,
  enterWorldMap,
  equipRuneAndAdvance,
  returnToTown
} from "../../simulation/systems/dungeon/dungeonSystem";
import { applyEventChoiceAtIndex, firstAffordableEventChoiceIndex } from "../../simulation/systems/events/eventSystem";
import type { SlicePhase } from "../../simulation/state/runState";
import { sliceRunToSaveRun } from "../../simulation/state/runState";
import { storeBootContext } from "./sceneBridge";

const PHASE_TO_SCENE: Record<SlicePhase, string> = {
  town: "TownScene",
  world_map: "WorldMapScene",
  dungeon: "DungeonScene",
  combat: "CombatScene",
  event: "EventScene",
  reward: "RewardScene",
  rune_bench: "RuneBenchScene",
  boss: "BossScene",
  result: "ResultScene"
};

const CARD_ACTIONS: Partial<Record<InputAction, number>> = {
  card_1: 0,
  card_2: 1,
  card_3: 2,
  card_4: 3,
  card_5: 4
};

export function sceneForPhase(phase: SlicePhase): string {
  return PHASE_TO_SCENE[phase];
}

export function handleSceneAction(
  scene: Phaser.Scene,
  context: BootContext,
  action: InputAction
): void {
  const cardIndex = CARD_ACTIONS[action];

  if (cardIndex !== undefined) {
    if (context.run.phase === "event") {
      applyEventChoiceAtIndex(context.run, context.dataBundle, cardIndex);
    } else if (context.run.phase === "reward") {
      claimRewardAndAdvance(context.run, context.dataBundle, cardIndex);
    } else {
      playCardAtIndex(context.run, context.dataBundle, cardIndex);
    }
  } else if (action === "end_turn") {
    endTurn(context.run, context.dataBundle);
  } else if (action === "confirm") {
    handleConfirm(context);
  } else {
    return;
  }

  syncRunToSave(context);
  persistSave(context.save, { debug: context.runtimeFlags.debug });
  storeBootContext(scene, context);
  scene.scene.start(sceneForPhase(context.run.phase), context);
}

function handleConfirm(context: BootContext): void {
  if (context.run.phase === "town") {
    enterWorldMap(context.run);
  } else if (context.run.phase === "world_map") {
    enterDungeon(context.run);
  } else if (context.run.phase === "dungeon") {
    enterCurrentRoom(context.run, context.dataBundle);
  } else if (context.run.phase === "event") {
    const choiceIndex = firstAffordableEventChoiceIndex(context.run, context.dataBundle);
    if (choiceIndex >= 0) {
      applyEventChoiceAtIndex(context.run, context.dataBundle, choiceIndex);
    }
  } else if (context.run.phase === "reward") {
    claimRewardAndAdvance(context.run, context.dataBundle);
  } else if (context.run.phase === "rune_bench") {
    equipRuneAndAdvance(context.run, context.dataBundle);
  } else if (context.run.phase === "result") {
    returnToTown(context.run);
  }
}

function syncRunToSave(context: BootContext): void {
  context.save.currentRun = sliceRunToSaveRun(context.run);

  for (const stageId of context.run.completedStages) {
    if (!context.save.profile.unlockedStages.includes(stageId)) {
      context.save.profile.unlockedStages.push(stageId);
    }
    if (!context.save.profile.completedStages.includes(stageId)) {
      context.save.profile.completedStages.push(stageId);
    }
    const stageIndex = context.dataBundle.stages.findIndex((stage) => stage.id === stageId);
    const nextStage = stageIndex >= 0 ? context.dataBundle.stages[stageIndex + 1] : undefined;
    if (nextStage && !context.save.profile.unlockedStages.includes(nextStage.id)) {
      context.save.profile.unlockedStages.push(nextStage.id);
    }
  }
}
