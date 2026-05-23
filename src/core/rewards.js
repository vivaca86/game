import { checkAchievements } from "./achievements.js";
import { addLog, addToDeck } from "./game-state.js";
import { healPlayer } from "./card-effects.js";

export function createRewardOptions(state, index, source = "combat") {
  const stage = index.stages.get(state.stageId);
  const cardPool = index.data.cards.filter((card) => !["curse", "temp"].includes(card.type));
  const cardOptionCount = 3 + (state.status.nextCardRewardBonus || 0);
  const options = [];
  for (let i = 0; i < cardOptionCount; i += 1) {
    const card = state.rng.pick(cardPool);
    options.push({
      id: `card:${card.id}:${i}`,
      type: "card",
      title: card.name,
      description: card.text,
      cardId: card.id
    });
  }
  options.push({
    id: `gold:${source}`,
    type: "gold",
    title: "별사탕",
    description: `별사탕 ${state.rng.int(18, 35 + stage.order * 4)}개를 얻습니다.`,
    amount: state.rng.int(18, 35 + stage.order * 4)
  });
  if (["elite", "boss", "reward"].includes(source)) {
    const gem = state.rng.pick(index.data.gems);
    const relic = state.rng.pick(index.data.relics);
    options.push({ id: `gem:${gem.id}`, type: "gem", title: gem.name, description: gem.text, gemId: gem.id });
    options.push({ id: `relic:${relic.id}`, type: "relic", title: relic.name, description: relic.text, relicId: relic.id });
  }
  return options.slice(0, source === "boss" ? 5 : 4);
}

export function openReward(state, index, source = "combat") {
  state.pendingReward = {
    source,
    rerolls: source === "boss" ? 2 : 1,
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

  if (option.type === "card") {
    addToDeck(state, option.cardId);
    addLog(state, `카드 획득: ${index.cards.get(option.cardId).name}`);
    checkAchievements(state, index, "collect_cards");
  }
  if (option.type === "gold") {
    state.player.gold += option.amount;
    addLog(state, `별사탕 ${option.amount} 획득`);
  }
  if (option.type === "gem") {
    state.inventory.gems.push(option.gemId);
    addLog(state, `보석 획득: ${index.gems.get(option.gemId).name}`);
    checkAchievements(state, index, "collect_gems");
  }
  if (option.type === "relic") {
    state.inventory.relics.push(option.relicId);
    addLog(state, `유물 획득: ${index.relics.get(option.relicId).name}`);
    checkAchievements(state, index, "collect_relics");
  }

  state.pendingReward = null;
  state.phase = "room_complete";
  return true;
}

export function applyEventChoice(state, index, choiceIndex) {
  const event = state.pendingEvent;
  const choice = event?.choices?.[choiceIndex];
  if (!choice) return false;
  payCost(state, choice.cost || {});
  grantRewardPayload(state, index, choice.reward || {});
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

function grantRewardPayload(state, index, reward) {
  if (reward.gold) state.player.gold += reward.gold;
  if (reward.heal) healPlayer(state, reward.heal);
  if (reward.cardPool?.length) addToDeck(state, state.rng.pick(reward.cardPool));
  if (reward.gemPool?.length) state.inventory.gems.push(state.rng.pick(reward.gemPool));
  if (reward.relicPool?.length) state.inventory.relics.push(state.rng.pick(reward.relicPool));
  if (reward.upgradeRandomCard) {
    const cardId = state.rng.pick(state.deck);
    if (cardId && !state.upgradedCards.includes(cardId)) state.upgradedCards.push(cardId);
  }
  if (reward.openGemSocket) state.status.openedGemSocket = true;
  if (reward.combat) {
    const enemy = index.enemies.get(reward.combat);
    if (enemy) state.status.eventCombatEnemyId = enemy.id;
  }
}
