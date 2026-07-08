import type { RuntimeFlags } from "../app/runtimeFlags";
import type { GameDataBundle } from "../data/schema";

export type EntryKey =
  | "town"
  | "world_map"
  | "dungeon"
  | "combat"
  | "event"
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
  enemyHp?: number;
  bossId?: string;
  playerHp?: number;
  rewardPoolId?: string;
  showLog: boolean;
  resetSave: boolean;
  grants: {
    cards: string[];
    runes: string[];
    relics: string[];
    arcanas: string[];
  };
  handCards: string[];
}

export function createDebugConfig(flags: RuntimeFlags, bundle: GameDataBundle): DebugConfig {
  const stage = bundle.stages.find((item) => item.id === flags.stageId) ?? bundle.stages[0];
  const firstCombatRoom = stage?.route.find((room) => room.type === "combat");
  const firstEventRoom = stage?.route.find((room) => room.type === "event");
  const firstRuneBenchRoom = stage?.route.find((room) => room.type === "rest") ?? firstEventRoom;
  const firstBossRoom = stage?.route.find((room) => room.type === "boss");
  const rewardPool =
    bundle.rewardPools.find((item) => item.id === flags.rewardPoolId) ?? bundle.rewardPools[0];

  return {
    enabled: flags.debug,
    entry: flags.entry,
    stageId: stage?.id ?? "missing_stage",
    roomId: flags.roomId ?? (
      flags.entry === "boss"
        ? firstBossRoom?.id
        : flags.entry === "event"
          ? firstEventRoom?.id
          : flags.entry === "rune_bench"
            ? firstRuneBenchRoom?.id
            : firstCombatRoom?.id
    ),
    enemyId: flags.enemyId,
    enemyHp: flags.enemyHp,
    bossId: flags.bossId,
    playerHp: flags.playerHp,
    rewardPoolId: flags.rewardPoolId ?? rewardPool?.id,
    showLog: flags.showLog,
    resetSave: flags.resetSave,
    grants: {
      cards: flags.grantCardIds,
      runes: flags.grantRuneIds,
      relics: flags.grantRelicIds,
      arcanas: flags.grantArcanaIds
    },
    handCards: flags.handCardIds
  };
}
