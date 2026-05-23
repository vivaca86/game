import { addLog } from "./game-state.js";

export function ensureGemState(state) {
  state.inventory.gems = Array.isArray(state.inventory.gems) ? state.inventory.gems : [];
  state.inventory.gemBag = Array.isArray(state.inventory.gemBag) ? state.inventory.gemBag : [];
  state.cardSockets = state.cardSockets || {};
  state.cardSocketBonuses = state.cardSocketBonuses || {};
  state.nextGemInstanceId = Number.isInteger(state.nextGemInstanceId) ? state.nextGemInstanceId : 1;
  state.inventory.gemBag = state.inventory.gemBag.map((entry) => {
    if (typeof entry === "string") {
      const instance = createGemInstance(state, entry);
      if (!state.inventory.gems.includes(entry)) state.inventory.gems.push(entry);
      return instance;
    }
    return entry;
  });
  Object.entries(state.cardSockets).forEach(([cardId, sockets]) => {
    state.cardSockets[cardId] = (sockets || []).map((value) => value || null);
  });
}

export function grantGem(state, gemId) {
  ensureGemState(state);
  const instance = createGemInstance(state, gemId);
  state.inventory.gemBag.push(instance);
  if (!state.inventory.gems.includes(gemId)) state.inventory.gems.push(gemId);
  if (state.profileUnlocks?.gems && !state.profileUnlocks.gems.includes(gemId)) state.profileUnlocks.gems.push(gemId);
  state.status.gemWorkshopOpen = true;
  return instance;
}

export function openSocketForCard(state, index, cardId) {
  ensureGemState(state);
  const card = index.cards.get(cardId);
  if (!card) return false;
  const current = socketCapacity(state, index, cardId);
  const hasSocketCharge = (state.status.socketBonus || 0) > 0 || (state.status.gemWorkshopCharges || 0) > 0;
  if (current >= card.sockets.max) return false;
  if (!hasSocketCharge) return false;
  state.cardSocketBonuses[cardId] = (state.cardSocketBonuses[cardId] || 0) + 1;
  normalizeCardSockets(state, index, cardId);
  if (state.status.socketBonus > 0) state.status.socketBonus -= 1;
  else if (state.status.gemWorkshopCharges > 0) state.status.gemWorkshopCharges -= 1;
  addLog(state, `${card.name} 소켓이 열렸습니다.`);
  return true;
}

export function equipGemToCard(state, index, gemInstanceId, cardId) {
  ensureGemState(state);
  const gemInstance = state.inventory.gemBag.find((gem) => gem.instanceId === gemInstanceId);
  const card = index.cards.get(cardId);
  const gem = gemInstance ? index.gems.get(gemInstance.gemId) : null;
  if (!gemInstance || !card || !gem || !canEquipGemToCard(gem, card)) return { ok: false, reason: "invalid" };

  unequipGem(state, gemInstance.instanceId);
  const sockets = normalizeCardSockets(state, index, cardId);
  const emptyIndex = sockets.findIndex((value) => !value);
  const slotIndex = emptyIndex >= 0 ? emptyIndex : 0;
  const replacedGemInstanceId = sockets[slotIndex];
  if (replacedGemInstanceId) unequipGem(state, replacedGemInstanceId);
  sockets[slotIndex] = gemInstance.instanceId;
  gemInstance.equippedCardId = cardId;
  gemInstance.equippedSlot = slotIndex;
  addLog(state, `${card.name}에 ${gem.name} 장착`);
  return { ok: true, replacedGemInstanceId };
}

export function unequipGem(state, gemInstanceId) {
  ensureGemState(state);
  const gemInstance = state.inventory.gemBag.find((gem) => gem.instanceId === gemInstanceId);
  if (!gemInstance) return false;
  if (gemInstance.equippedCardId && state.cardSockets[gemInstance.equippedCardId]) {
    state.cardSockets[gemInstance.equippedCardId] = state.cardSockets[gemInstance.equippedCardId].map((value) =>
      value === gemInstanceId ? null : value
    );
  }
  gemInstance.equippedCardId = null;
  gemInstance.equippedSlot = null;
  return true;
}

export function socketCapacity(state, index, cardId) {
  const card = index.cards.get(cardId);
  if (!card?.sockets) return 0;
  return Math.min(card.sockets.max, card.sockets.base + (state.cardSocketBonuses?.[cardId] || 0));
}

export function normalizeCardSockets(state, index, cardId) {
  ensureGemState(state);
  const capacity = socketCapacity(state, index, cardId);
  const sockets = state.cardSockets[cardId] || [];
  while (sockets.length < capacity) sockets.push(null);
  if (sockets.length > capacity) sockets.length = capacity;
  state.cardSockets[cardId] = sockets;
  return sockets;
}

export function equippedGemInstancesForCard(state, index, cardId) {
  const sockets = normalizeCardSockets(state, index, cardId);
  return sockets
    .map((instanceId) => state.inventory.gemBag.find((gem) => gem.instanceId === instanceId) || null)
    .filter(Boolean);
}

export function unequippedGemInstances(state) {
  ensureGemState(state);
  return state.inventory.gemBag.filter((gem) => !gem.equippedCardId);
}

export function gemEffectsForCard(state, index, cardId, op) {
  return equippedGemInstancesForCard(state, index, cardId)
    .flatMap((gemInstance) => index.gems.get(gemInstance.gemId)?.effects || [])
    .filter((effect) => effect.op === op);
}

export function canEquipGemToCard(gem, card) {
  return gem.socketTypes.includes(card.type);
}

export function adjustedCardCost(card, state, index, baseCost) {
  if (!index) return baseCost;
  return gemEffectsForCard(state, index, card.id, "modify_cost").reduce((cost, effect) => {
    const min = Number.isInteger(effect.min) ? effect.min : 0;
    return Math.max(min, cost + effect.amount);
  }, baseCost);
}

export function modifiedDamageAmount(card, state, index, amount) {
  return gemEffectsForCard(state, index, card.id, "modify_damage_percent").reduce((value, effect) => {
    return Math.max(1, Math.ceil(value * (1 + effect.amount / 100)));
  }, amount);
}

export function modifiedShieldAmount(card, state, index, amount) {
  return gemEffectsForCard(state, index, card.id, "modify_shield_percent").reduce((value, effect) => {
    return Math.max(1, Math.ceil(value * (1 + effect.amount / 100)));
  }, amount);
}

export function createScaledGemEchoEffects(effects, ratio) {
  return effects
    .filter((effect) => !effect.op.startsWith("repeat_") && effect.op !== "exhaust_self")
    .map((effect) => {
      const copy = { ...effect };
      if (Number.isFinite(copy.amount)) copy.amount = Math.max(1, Math.ceil(copy.amount * ratio));
      return copy;
    });
}

function createGemInstance(state, gemId) {
  const instance = {
    instanceId: `gem_inst_${state.nextGemInstanceId}`,
    gemId,
    equippedCardId: null,
    equippedSlot: null
  };
  state.nextGemInstanceId += 1;
  return instance;
}
