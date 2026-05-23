export const BALANCE = Object.freeze({
  rewards: {
    goldMin: 14,
    goldMaxBase: 26,
    goldMaxPerStage: 3,
    stageClearGoldRate: 0.72,
    restHealRate: 0.35,
    achievementGoldRate: 0.08,
    achievementGoldCap: 30,
    combatGemChancePercent: 7,
    shopCosts: {
      card: { base: 34, perStage: 5 },
      gem: { base: 54, perStage: 6 },
      relic: { base: 78, perStage: 8 },
      arcana: { base: 92, perStage: 9 }
    }
  },
  enemies: {
    hpMultiplier: {
      normal: 0.82,
      elite: 0.72,
      boss: 0.48
    },
    hpPerStage: {
      normal: 1,
      elite: 3,
      boss: 4
    },
    intentMultiplier: {
      attack: {
        normal: 0.9,
        elite: 0.85,
        boss: 0.75
      },
      guard: {
        normal: 0.9,
        elite: 0.85,
        boss: 0.8
      }
    },
    attackStageStep: 4,
    blockStageStep: 5,
    bossPhaseBlockPerStage: 1,
    lateReliefStart: 6,
    lateReliefPerStage: 0.06,
    lateReliefFloor: 0.65
  }
});

export function rewardGoldRange(stageOrder = 1) {
  return {
    min: BALANCE.rewards.goldMin,
    max: BALANCE.rewards.goldMaxBase + stageOrder * BALANCE.rewards.goldMaxPerStage
  };
}

export function shopCost(type, stageOrder = 1) {
  const cost = BALANCE.rewards.shopCosts[type];
  if (!cost) return 0;
  return cost.base + stageOrder * cost.perStage;
}

export function stageClearGold(amount) {
  return Math.ceil((amount || 0) * BALANCE.rewards.stageClearGoldRate);
}

export function achievementGoldReward(amount) {
  if (!amount) return 0;
  return Math.min(BALANCE.rewards.achievementGoldCap, Math.ceil(amount * BALANCE.rewards.achievementGoldRate));
}

export function enemyMaxHp(baseHp, rank, stageOrder = 1) {
  const key = rank === "boss" ? "boss" : rank === "elite" ? "elite" : "normal";
  const scaledBase = Math.ceil((baseHp || 1) * BALANCE.enemies.hpMultiplier[key] * lateStageRelief(stageOrder));
  return scaledBase + enemyHpBonus(rank, stageOrder);
}

export function enemyHpBonus(rank, stageOrder = 1) {
  const key = rank === "boss" ? "boss" : rank === "elite" ? "elite" : "normal";
  return Math.max(0, stageOrder - 1) * BALANCE.enemies.hpPerStage[key];
}

export function enemyAttackBonus(stageOrder = 1, roomType = "combat") {
  return Math.floor(Math.max(0, stageOrder - 1) / BALANCE.enemies.attackStageStep) + (roomType === "boss" && stageOrder >= 6 ? 1 : 0);
}

export function enemyIntentAmount(rank, kind, amount, stageOrder = 1) {
  const key = rank === "boss" ? "boss" : rank === "elite" ? "elite" : "normal";
  const multiplier = BALANCE.enemies.intentMultiplier[kind]?.[key] || 1;
  return Math.max(1, Math.ceil((amount || 0) * multiplier * lateStageRelief(stageOrder)));
}

export function enemyBlockBonus(stageOrder = 1, rankBonus = 0) {
  return Math.floor((stageOrder + rankBonus) / BALANCE.enemies.blockStageStep);
}

export function bossPhaseBlock(stageOrder = 1) {
  return Math.max(4, Math.ceil(stageOrder * BALANCE.enemies.bossPhaseBlockPerStage));
}

function lateStageRelief(stageOrder = 1) {
  const over = Math.max(0, stageOrder - BALANCE.enemies.lateReliefStart);
  return Math.max(BALANCE.enemies.lateReliefFloor, 1 - over * BALANCE.enemies.lateReliefPerStage);
}
