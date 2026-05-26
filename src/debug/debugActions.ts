import type { BootContext } from "../app/bootContext";

export function createDebugSummary(context: BootContext): string[] {
  return [
    `entry=${context.entry}`,
    `seed=${context.seed}`,
    `stage=${context.debug.stageId}`,
    context.debug.roomId ? `room=${context.debug.roomId}` : "room=none",
    context.debug.enemyId ? `enemy=${context.debug.enemyId}` : "enemy=none",
    context.debug.bossId ? `boss=${context.debug.bossId}` : "boss=none",
    `cards=${context.dataBundle.cards.length}`,
    `assets=${context.assetManifest.length}`,
    `validation=${context.validation.ok ? "ok" : "error"}`
  ];
}
