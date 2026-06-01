import type { GameDataBundle, RewardEntry } from "../../../data/schema";
import {
  getPassiveAdjustedRewardOfferCount,
  getPassiveSupplementalRewardEntries,
  modifyCurrencyRewardAmount
} from "../passives/passiveSystem";
import {
  findRewardEntryById,
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
  run.rewardPoolId = rewardPoolId ?? getCurrentRoom(bundle, run)?.rewardPoolId ?? bundle.rewardPools[0]?.id;
  const count = getPassiveAdjustedRewardOfferCount(run, bundle, run.rewardPoolId, baseCount + run.nextRewardBonus);
  const baseEntries = selectRewardEntries(bundle, run.rewardPoolId, count);
  const supplementalEntries = getPassiveSupplementalRewardEntries(run, bundle, run.rewardPoolId, baseEntries);
  run.offeredRewards = [...baseEntries, ...supplementalEntries].map((entry) => entry.id);
  run.nextRewardBonus = 0;
  pushRunLog(run, `reward:offer:${run.rewardPoolId}:${run.offeredRewards.join(",")}`);
}

export function claimFirstReward(run: SliceRunState, bundle: GameDataBundle): RewardEntry | undefined {
  return claimRewardAtIndex(run, bundle, 0);
}

export function claimRewardAtIndex(
  run: SliceRunState,
  bundle: GameDataBundle,
  rewardIndex: number
): RewardEntry | undefined {
  const entry = findRewardEntryById(bundle, run.rewardPoolId, run.offeredRewards[rewardIndex]);

  if (!entry) {
    pushRunLog(run, "reward:missing");
    return undefined;
  }

  grantRewardEntry(run, bundle, entry, "reward");

  run.offeredRewards = [];
  return entry;
}

export function grantRewardEntry(
  run: SliceRunState,
  bundle: GameDataBundle,
  entry: RewardEntry,
  source: "reward" | "event" = "reward"
): void {
  const prefix = source === "event" ? "event_reward" : "reward";

  if (entry.type === "card" && entry.contentId) {
    run.deck.push(entry.contentId);
    run.discard.push(entry.contentId);
    pushRunLog(run, `${prefix}:card:${entry.contentId}`);
  } else if (entry.type === "rune" && entry.contentId) {
    if (!run.runes.includes(entry.contentId)) run.runes.push(entry.contentId);
    pushRunLog(run, `${prefix}:rune:${entry.contentId}`);
  } else if (entry.type === "relic" && entry.contentId) {
    if (!run.relics.includes(entry.contentId)) run.relics.push(entry.contentId);
    pushRunLog(run, `${prefix}:relic:${entry.contentId}`);
  } else if (entry.type === "arcana" && entry.contentId) {
    if (!run.arcanas.includes(entry.contentId)) run.arcanas.push(entry.contentId);
    pushRunLog(run, `${prefix}:arcana:${entry.contentId}`);
  } else if (entry.type === "currency") {
    const amount = modifyCurrencyRewardAmount(run, bundle, entry.amount ?? 0);
    run.player.gold += amount;
    pushRunLog(run, `${prefix}:currency:${amount}`);
  } else if (entry.type === "heal") {
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + (entry.amount ?? 0));
    pushRunLog(run, `${prefix}:heal:${entry.amount ?? 0}`);
  } else if (entry.type === "unlock" && entry.contentId) {
    pushRunLog(run, `${prefix}:unlock:${entry.contentId}`);
  }
}
