import type { RuntimeFlags } from "../app/runtimeFlags";
import type { GameDataBundle } from "../data/schema";

export type EntryKey =
  | "town"
  | "world_map"
  | "dungeon"
  | "combat"
  | "reward"
  | "rune_bench"
  | "boss"
  | "result";

export interface DebugConfig {
  enabled: boolean;
  entry: EntryKey;
  stageId: string;
  roomId?: string;
  enemyId?: string;
  bossId?: string;
  rewardPoolId?: string;
  showLog: boolean;
  resetSave: boolean;
  grants: {
    cards: string[];
    runes: string[];
    relics: string[];
  };
}

export function createDebugConfig(flags: RuntimeFlags, bundle: GameDataBundle): DebugConfig {
  const stage = bundle.stages.find((item) => item.id === flags.stageId) ?? bundle.stages[0];
  const firstCombatRoom = stage?.route.find((room) => room.type === "combat");
  const firstBossRoom = stage?.route.find((room) => room.type === "boss");
  const rewardPool =
    bundle.rewardPools.find((item) => item.id === flags.rewardPoolId) ?? bundle.rewardPools[0];

  return {
    enabled: flags.debug,
    entry: flags.entry,
    stageId: stage?.id ?? "missing_stage",
    roomId: flags.roomId ?? (flags.entry === "boss" ? firstBossRoom?.id : firstCombatRoom?.id),
    enemyId: flags.enemyId,
    bossId: flags.bossId,
    rewardPoolId: flags.rewardPoolId ?? rewardPool?.id,
    showLog: flags.showLog,
    resetSave: flags.resetSave,
    grants: {
      cards: flags.grantCardIds,
      runes: flags.grantRuneIds,
      relics: flags.grantRelicIds
    }
  };
}
