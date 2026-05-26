import type { EntryKey } from "../../debug/debugEntry";

const ENTRY_TO_SCENE: Record<EntryKey, string> = {
  town: "TownScene",
  world_map: "WorldMapScene",
  dungeon: "DungeonScene",
  combat: "CombatScene",
  reward: "RewardScene",
  rune_bench: "RuneBenchScene",
  boss: "BossScene",
  result: "ResultScene"
};

export function resolveEntryScene(entry: EntryKey): string {
  return ENTRY_TO_SCENE[entry];
}
