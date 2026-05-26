import type { GameDataBundle, RewardEntry } from "../../../data/schema";
import {
  getCurrentRoom,
  pushRunLog,
  selectRewardEntries,
  type SliceRunState
} from "../../state/runState";

export function prepareRewardOffer(
  run: SliceRunState,
  bundle: GameDataBundle,
  rewardPoolId: string | undefined,
  baseCount = 3
): void {
  const count = baseCount + run.nextRewardBonus;
  run.rewardPoolId = rewardPoolId ?? getCurrentRoom(bundle, run)?.rewardPoolId ?? bundle.rewardPools[0]?.id;
  run.offeredRewards = selectRewardEntries(bundle, run.rewardPoolId, count).map((entry) => entry.id);
  run.nextRewardBonus = 0;
  pushRunLog(run, `reward:offer:${run.rewardPoolId}:${run.offeredRewards.join(",")}`);
}

export function claimFirstReward(run: SliceRunState, bundle: GameDataBundle): RewardEntry | undefined {
  const entry = selectRewardEntries(bundle, run.rewardPoolId, Math.max(1, run.offeredRewards.length))
    .find((reward) => reward.id === run.offeredRewards[0]);

  if (!entry) {
    pushRunLog(run, "reward:missing");
    return undefined;
  }

  if (entry.type === "card" && entry.contentId) {
    run.deck.push(entry.contentId);
    run.discard.push(entry.contentId);
    pushRunLog(run, `reward:card:${entry.contentId}`);
  } else if (entry.type === "rune" && entry.contentId) {
    if (!run.runes.includes(entry.contentId)) run.runes.push(entry.contentId);
    pushRunLog(run, `reward:rune:${entry.contentId}`);
  } else if (entry.type === "relic" && entry.contentId) {
    if (!run.relics.includes(entry.contentId)) run.relics.push(entry.contentId);
    pushRunLog(run, `reward:relic:${entry.contentId}`);
  } else if (entry.type === "arcana" && entry.contentId) {
    if (!run.arcanas.includes(entry.contentId)) run.arcanas.push(entry.contentId);
    pushRunLog(run, `reward:arcana:${entry.contentId}`);
  } else if (entry.type === "currency") {
    pushRunLog(run, `reward:currency:${entry.amount ?? 0}`);
  } else if (entry.type === "heal") {
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + (entry.amount ?? 0));
    pushRunLog(run, `reward:heal:${entry.amount ?? 0}`);
  } else if (entry.type === "unlock" && entry.contentId) {
    pushRunLog(run, `reward:unlock:${entry.contentId}`);
  }

  run.offeredRewards = [];
  return entry;
}

