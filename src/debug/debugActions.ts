import type { BootContext } from "../app/bootContext";
import { resolveCombatFeedbackEffectKey } from "../simulation/state/combatFeedback";
import { getRevealedNextRoomType } from "../simulation/systems/passives/passiveSystem";
import { getCurrentRoom, getEncounterPoolContentId } from "../simulation/state/runState";

export function createDebugSummary(context: BootContext): string[] {
  const character = context.dataBundle.characters.find((item) => item.id === context.run.characterId)
    ?? context.dataBundle.characters[0];
  const activeStage = context.dataBundle.stages.find((item) => item.id === context.run.stageId)
    ?? context.dataBundle.stages[0];
  const currentRoom = getCurrentRoom(context.dataBundle, context.run);
  const eventRoom = currentRoom?.type === "event"
    ? currentRoom
    : activeStage?.route.find((room) => room.type === "event");
  const activeEventId = getEncounterPoolContentId(context.dataBundle, eventRoom?.encounterPoolId, "event");
  const activeEvent = context.dataBundle.events.find((event) => event.id === activeEventId);
  const eventCostProfile = activeEvent?.choices
    .map((choice) => uniqueProfile(choice.cost?.map((cost) => cost.op), "free"))
    .join("|") ?? "none";
  const eventRewardProfile = activeEvent?.choices
    .map((choice) => uniqueProfile(choice.rewards?.map((reward) => reward.type), "none"))
    .join("|") ?? "none";
  const uiSkinKeys = [
    "ui_button_primary_9slice",
    "ui_button_secondary_9slice",
    "ui_slot_reward_9slice",
    "ui_slot_choice_9slice",
    "ui_tooltip_paper_9slice",
    "ui_panel_paper_9slice"
  ];
  const missingUiSkinKeys = uiSkinKeys.filter((key) => !context.assetManifest.some((asset) => asset.key === key));

  return [
    `entry=${context.entry}`,
    `dataMode=${context.runtimeFlags.dataMode}`,
    `phase=${context.run.phase}`,
    `saveVersion=${context.save.saveVersion}`,
    `savedPhase=${context.save.currentRun?.phase ?? "none"}`,
    `saveCompleted=${context.save.profile.completedStages.join(",") || "none"}`,
    `unlockedStages=${context.save.profile.unlockedStages.join(",") || "none"}`,
    `settingMaster=${Math.round(context.save.settings.volumeMaster * 100)}`,
    `settingMusic=${Math.round(context.save.settings.volumeMusic * 100)}`,
    `settingSfx=${Math.round(context.save.settings.volumeSfx * 100)}`,
    `settingDisplay=${context.save.settings.displayMode}`,
    `settingLargeText=${context.save.settings.largeText ? "true" : "false"}`,
    `settingReducedMotion=${context.save.settings.reducedMotion ? "true" : "false"}`,
    `settingSpaceConfirm=${context.save.settings.spaceConfirm ? "true" : "false"}`,
    `seed=${context.seed}`,
    `stage=${context.run.stageId}`,
    `route=${activeStage?.route.map((room) => room.type).join(">") ?? "none"}`,
    `event=${activeEvent?.id ?? "none"}`,
    `eventChoice=${context.run.lastEventChoiceId ?? "none"}`,
    `eventChoices=${activeEvent?.choices.length ?? 0}`,
    `eventCosts=${eventCostProfile}`,
    `eventRewards=${eventRewardProfile}`,
    `characterSprite=${character?.assetKeys.sprite ?? "none"}`,
    `uiPanel=${context.assetManifest.some((asset) => asset.key === "ui_panel_paper_9slice") ? "ui_panel_paper_9slice" : "none"}`,
    `uiSkin=${missingUiSkinKeys.length === 0 ? "button+slot+tooltip" : `missing:${missingUiSkinKeys.join(",")}`}`,
    `roomIndex=${context.run.roomIndex}`,
    `playerHp=${context.run.player.hp}`,
    `playerGold=${context.run.player.gold}`,
    `playerEnergy=${context.run.player.energy}`,
    `playerBlock=${context.run.player.block}`,
    `playerMark=${context.run.playerMark}`,
    `playerWeak=${context.run.playerWeak}`,
    `nextCardCostPenalty=${context.run.nextCardCostPenalty}`,
    `chain=${context.run.chainCount}`,
    `firstExpensiveFree=${context.run.firstExpensiveCardFreeAvailable ? "true" : "false"}`,
    `guardCardsPlayed=${context.run.guardCardsPlayedThisCombat}`,
    `colorsPlayed=${context.run.colorsPlayedThisTurn.join(",") || "none"}`,
    `revealedRoom=${getRevealedNextRoomType(context.run, context.dataBundle) ?? "none"}`,
    context.run.combat ? `enemy=${context.run.combat.enemyId}` : context.debug.enemyId ? `enemy=${context.debug.enemyId}` : "enemy=none",
    context.run.combat ? `enemyHp=${context.run.combat.enemyHp}` : "enemyHp=none",
    context.run.combat ? `enemyBlock=${context.run.combat.enemyBlock}` : "enemyBlock=none",
    context.run.combat ? `enemyMark=${context.run.combat.enemyMark}` : "enemyMark=none",
    context.run.combat ? `turn=${context.run.combat.turn}` : "turn=none",
    context.run.combat ? `bossPhaseTriggered=${context.run.combat.bossPhaseTriggered}` : "bossPhaseTriggered=none",
    context.run.combat ? `pendingAttackBonus=${context.run.combat.pendingAttackBonus}` : "pendingAttackBonus=none",
    `hand=${context.run.hand.join(",")}`,
    `drawPile=${context.run.drawPile.length}`,
    `discard=${context.run.discard.length}`,
    `rewards=${context.run.offeredRewards.join(",") || "none"}`,
    `runes=${context.run.runes.join(",") || "none"}`,
    `relics=${context.run.relics.join(",") || "none"}`,
    `arcanas=${context.run.arcanas.join(",") || "none"}`,
    `equipped=${Object.entries(context.run.equippedRunes).map(([cardId, runes]) => `${cardId}:${runes.join("+")}`).join(",") || "none"}`,
    context.debug.bossId ? `boss=${context.debug.bossId}` : "boss=none",
    `effect=${resolveCombatFeedbackEffectKey(context.run, context.dataBundle) ?? "none"}`,
    `log=${context.run.log.at(-1) ?? "none"}`,
    `cards=${context.dataBundle.cards.length}`,
    `runesTotal=${context.dataBundle.runes.length}`,
    `relicsTotal=${context.dataBundle.relics.length}`,
    `arcanasTotal=${context.dataBundle.arcanas.length}`,
    `eventsTotal=${context.dataBundle.events.length}`,
    `stagesTotal=${context.dataBundle.stages.length}`,
    `assets=${context.assetManifest.length}`,
    `validation=${context.validation.ok ? "ok" : "error"}`
  ];
}

function uniqueProfile(values: string[] | undefined, fallback: string): string {
  return values?.length ? [...new Set(values)].join("+") : fallback;
}
