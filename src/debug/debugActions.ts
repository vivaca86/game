import type { BootContext } from "../app/bootContext";
import { resolveCombatFeedbackEffectKey } from "../simulation/state/combatFeedback";

export function createDebugSummary(context: BootContext): string[] {
  return [
    `entry=${context.entry}`,
    `phase=${context.run.phase}`,
    `saveVersion=${context.save.saveVersion}`,
    `savedPhase=${context.save.currentRun?.phase ?? "none"}`,
    `saveCompleted=${context.save.profile.completedStages.join(",") || "none"}`,
    `seed=${context.seed}`,
    `stage=${context.run.stageId}`,
    `roomIndex=${context.run.roomIndex}`,
    `playerHp=${context.run.player.hp}`,
    `playerEnergy=${context.run.player.energy}`,
    `playerBlock=${context.run.player.block}`,
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
    `equipped=${Object.entries(context.run.equippedRunes).map(([cardId, runes]) => `${cardId}:${runes.join("+")}`).join(",") || "none"}`,
    context.debug.bossId ? `boss=${context.debug.bossId}` : "boss=none",
    `effect=${resolveCombatFeedbackEffectKey(context.run, context.dataBundle) ?? "none"}`,
    `log=${context.run.log.at(-1) ?? "none"}`,
    `cards=${context.dataBundle.cards.length}`,
    `assets=${context.assetManifest.length}`,
    `validation=${context.validation.ok ? "ok" : "error"}`
  ];
}
