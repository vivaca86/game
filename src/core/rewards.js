import { checkAchievements } from "./achievements.js";
import { addLog, addToDeck } from "./game-state.js";
import { healPlayer } from "./card-effects.js";
import { grantGem } from "./gems.js";
import { rewardGoldRange, shopCost } from "./balance.js";
import {
  adjustedRewardCost,
  cardRewardOptionCount,
  gemRewardOptionCount,
  grantArcana,
  grantRelic,
  modifiedGoldReward,
  rewardRerolls,
  shouldAddCombatGemReward,
  upgradedFirstCardReward
} from "./run-modifiers.js";

export function createRewardOptions(state, index, source = "combat") {
  const stage = index.stages.get(state.stageId);
  const cardPool = unlockedPool(state, index, "cards").filter((card) => !["curse", "temp"].includes(card.type));
  const cardOptionCount = cardRewardOptionCount(state, index, source, 3);
  const options = [];
  for (let i = 0; i < cardOptionCount; i += 1) {
    const card = state.rng.pick(cardPool);
    const upgraded = upgradedFirstCardReward(state, index, i);
    options.push({
      id: `card:${card.id}:${i}`,
      type: "card",
      title: card.name,
      description: upgraded ? `${card.text} · 강화 예정` : card.text,
      cardId: card.id,
      upgraded,
      cost: source === "shop" ? adjustedRewardCost(state, index, { gold: shopCost("card", stage.order) }, { source, type: "card" }) : null
    });
  }
  if (source !== "shop") {
    const goldRange = rewardGoldRange(stage.order);
    const goldAmount = modifiedGoldReward(state, index, state.rng.int(goldRange.min, goldRange.max));
    options.push({
      id: `gold:${source}`,
      type: "gold",
      title: "별사탕",
      description: `별사탕 ${goldAmount}개를 얻습니다.`,
      amount: goldAmount
    });
  }
  const guaranteedSpecialReward = ["elite", "boss", "reward", "shop"].includes(source);
  const combatGemReward = !guaranteedSpecialReward && shouldAddCombatGemReward(state, index);
  const hasSpecialReward = guaranteedSpecialReward || combatGemReward;
  if (hasSpecialReward) {
    const gemOptions = gemRewardOptionCount(state, index, source, guaranteedSpecialReward || combatGemReward ? 1 : 0);
    for (let i = 0; i < gemOptions; i += 1) {
      const gem = state.rng.pick(unlockedPool(state, index, "gems"));
      options.push({
        id: `gem:${gem.id}:${i}`,
        type: "gem",
        title: gem.name,
        description: gem.text,
        gemId: gem.id,
        cost: source === "shop" ? adjustedRewardCost(state, index, { gold: shopCost("gem", stage.order) }, { source, type: "gem" }) : null
      });
    }
    const availableRelics = unlockedPool(state, index, "relics").filter((relic) => !state.inventory.relics.includes(relic.id));
    const relic = state.rng.pick(availableRelics);
    if (relic) {
      options.push({
        id: `relic:${relic.id}`,
        type: "relic",
        title: relic.name,
        description: relic.text,
        relicId: relic.id,
        cost: source === "shop" ? adjustedRewardCost(state, index, { gold: shopCost("relic", stage.order) }, { source, type: "relic" }) : null
      });
    }
    const availableArcanas = unlockedPool(state, index, "arcanas").filter((arcana) => !state.inventory.arcanas.includes(arcana.id));
    const arcana = state.rng.pick(availableArcanas);
    if (arcana && source !== "combat") {
      options.push({
        id: `arcana:${arcana.id}`,
        type: "arcana",
        title: arcana.name,
        description: arcana.text,
        arcanaId: arcana.id,
        cost: source === "shop" ? adjustedRewardCost(state, index, { gold: shopCost("arcana", stage.order) }, { source, type: "arcana" }) : null
      });
    }
  }
  return options;
}

function unlockedPool(state, index, key) {
  const runKeys = {
    cards: "unlockedCards",
    gems: "gems",
    relics: "relics",
    arcanas: "arcanas"
  };
  const ids = [...(state.profileUnlocks?.[key] || []), ...(state.inventory?.[runKeys[key]] || [])];
  const rows = index.data[key] || [];
  if (ids.length === 0) return rows;
  const allowed = new Set(ids);
  const filtered = rows.filter((item) => allowed.has(item.id));
  return filtered.length > 0 ? filtered : rows;
}

export function openReward(state, index, source = "combat") {
  state.pendingReward = {
    source,
    rerolls: rewardRerolls(state, index, source),
    options: createRewardOptions(state, index, source)
  };
  state.phase = "reward";
}

export function rerollReward(state, index) {
  if (!state.pendingReward || state.pendingReward.rerolls <= 0) return false;
  state.pendingReward.rerolls -= 1;
  state.pendingReward.options = createRewardOptions(state, index, state.pendingReward.source);
  addLog(state, "보상을 다시 보았습니다.");
  return true;
}

export function applyRewardOption(state, index, optionId) {
  const reward = state.pendingReward;
  if (!reward) return false;
  const option = reward.options.find((item) => item.id === optionId);
  if (!option) return false;
  if (option.cost && !canPayCost(state, option.cost)) return false;
  if (option.cost) payCost(state, option.cost);

  if (option.type === "card") {
    addToDeck(state, option.cardId);
    if (option.upgraded && !state.upgradedCards.includes(option.cardId)) state.upgradedCards.push(option.cardId);
    addLog(state, `카드 획득: ${index.cards.get(option.cardId).name}`);
    checkAchievements(state, index, "collect_cards");
  }
  if (option.type === "gold") {
    state.player.gold += option.amount;
    addLog(state, `별사탕 ${option.amount} 획득`);
  }
  if (option.type === "gem") {
    grantGem(state, option.gemId);
    addLog(state, `보석 획득: ${index.gems.get(option.gemId).name}`);
    checkAchievements(state, index, "collect_gems");
  }
  if (option.type === "relic") {
    grantRelic(state, index, option.relicId);
    checkAchievements(state, index, "collect_relics");
  }
  if (option.type === "arcana") {
    grantArcana(state, index, option.arcanaId);
    checkAchievements(state, index, "collect_arcanas");
  }

  state.pendingReward = null;
  state.phase = "room_complete";
  return true;
}

export function applyEventChoice(state, index, choiceIndex) {
  const event = state.pendingEvent;
  const choice = event?.choices?.[choiceIndex];
  if (!choice) return false;
  const cost = adjustedRewardCost(state, index, choice.cost || {}, { source: event.type, reward: choice.reward || {} });
  if (!canPayCost(state, cost)) return false;
  payCost(state, cost);
  grantRewardPayload(state, index, choice.reward || {});
  if (event.id === "event_gem_bench") {
    state.status.gemWorkshopOpen = true;
    state.status.gemWorkshopCharges = (state.status.gemWorkshopCharges || 0) + 1;
    addLog(state, "보석 작업대가 열렸습니다.");
  }
  checkAchievements(state, index, "complete_event", { eventId: event.id });
  state.pendingEvent = null;
  state.phase = "room_complete";
  addLog(state, `이벤트 선택: ${choice.label}`);
  return true;
}

function payCost(state, cost) {
  if (cost.gold) state.player.gold = Math.max(0, state.player.gold - cost.gold);
  if (cost.hp) state.player.hp = Math.max(1, state.player.hp - cost.hp);
}

function canPayCost(state, cost) {
  if (cost.gold && state.player.gold < cost.gold) return false;
  if (cost.hp && state.player.hp <= cost.hp) return false;
  return true;
}

function grantRewardPayload(state, index, reward) {
  if (reward.gold) state.player.gold += modifiedGoldReward(state, index, reward.gold);
  if (reward.heal) healPlayer(state, reward.heal, index);
  if (reward.cardPool?.length) addToDeck(state, state.rng.pick(reward.cardPool));
  if (reward.gemPool?.length) {
    grantGem(state, state.rng.pick(reward.gemPool));
    checkAchievements(state, index, "collect_gems");
  }
  if (reward.relicPool?.length) {
    grantRelic(state, index, state.rng.pick(reward.relicPool));
    checkAchievements(state, index, "collect_relics");
  }
  if (reward.arcanaPool?.length) {
    grantArcana(state, index, state.rng.pick(reward.arcanaPool));
    checkAchievements(state, index, "collect_arcanas");
  }
  if (reward.upgradeRandomCard) {
    const cardId = state.rng.pick(state.deck);
    if (cardId && !state.upgradedCards.includes(cardId)) state.upgradedCards.push(cardId);
  }
  if (reward.openGemSocket) {
    state.status.openedGemSocket = true;
    state.status.gemWorkshopOpen = true;
    state.status.gemWorkshopCharges = (state.status.gemWorkshopCharges || 0) + 1;
  }
  if (reward.combat) {
    const enemy = index.enemies.get(reward.combat);
    if (enemy) state.status.eventCombatEnemyId = enemy.id;
  }
}
