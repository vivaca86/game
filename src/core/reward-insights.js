import { cardRoleSummary } from "./card-roles.js";
import { gemFitHints, gemRoleSummary } from "./gem-roles.js";
import { buildFitHints, buildItemRoleSummary } from "./build-roles.js";
import { canEquipGemToCard, socketCapacity } from "./gems.js";

export function rewardOptionInsight(option = {}, state = {}, index) {
  const base = optionInsightBase(option, state, index);
  const costPenalty = option.cost?.gold ? Math.min(18, Math.ceil(option.cost.gold / 10)) : 0;
  const score = clampScore(base.score - costPenalty);
  const costItem = option.cost?.gold
    ? { tone: "cost", icon: "비", label: "가격", value: `${option.cost.gold}` }
    : null;
  return {
    score,
    label: scoreLabel(score),
    tone: scoreTone(score),
    items: [...base.items, costItem].filter(Boolean).slice(0, 5)
  };
}

export function rewardOptionInsightAudit(state, index, options = []) {
  const missingInsights = [];
  const weakInsights = [];
  const typeCounts = new Map();
  for (const option of options || []) {
    const insight = rewardOptionInsight(option, state, index);
    typeCounts.set(option.type, (typeCounts.get(option.type) || 0) + 1);
    if (insight.items.length === 0) missingInsights.push(option.id || option.title || option.type);
    if (!Number.isFinite(insight.score)) weakInsights.push(option.id || option.title || option.type);
  }
  return {
    missingInsights,
    weakInsights,
    typeCounts: Object.fromEntries([...typeCounts.entries()].sort(([left], [right]) => left.localeCompare(right)))
  };
}

function optionInsightBase(option, state, index) {
  if (option.type === "card") return cardInsight(option, state, index);
  if (option.type === "gem") return gemInsight(option, state, index);
  if (option.type === "relic") return buildItemInsight(option, state, index, "relic");
  if (option.type === "arcana") return buildItemInsight(option, state, index, "arcana");
  if (option.type === "gold") return goldInsight(option, state);
  return {
    score: 40,
    items: [{ tone: "note", icon: "보", label: "보상", value: option.title || "선택" }]
  };
}

function cardInsight(option, state, index) {
  const card = index.cards.get(option.cardId);
  if (!card) return { score: 0, items: [] };
  const deckCards = deckCardsForState(state, index);
  const role = cardRoleSummary(card);
  const roleCount = deckCards.filter((deckCard) => cardRoleSummary(deckCard).key === role.key).length;
  const duplicateCount = (state.deck || []).filter((cardId) => cardId === card.id).length;
  const typeCount = deckCards.filter((deckCard) => deckCard.type === card.type).length;
  const averageCost = deckAverageCost(deckCards);
  const typeFloor = Math.max(2, Math.floor(deckCards.length / 5));
  let score = 48;
  if (roleCount === 0) score += 18;
  else if (roleCount <= 2) score += 10;
  if (duplicateCount === 0) score += 10;
  else score -= Math.min(16, duplicateCount * 8);
  if (card.cost <= averageCost) score += 8;
  if (card.cost >= averageCost + 2) score -= 6;
  if (typeCount < typeFloor) score += 6;
  if (option.upgraded) score += 12;
  return {
    score,
    items: [
      { tone: role.tone, icon: role.icon, label: "역할", value: role.label },
      { tone: duplicateCount === 0 ? "safe" : "note", icon: duplicateCount === 0 ? "신" : "겹", label: "덱", value: duplicateCount === 0 ? "새 카드" : `동명 ${duplicateCount}` },
      { tone: card.cost <= averageCost ? "flow" : "cost", icon: "비", label: "비용", value: `${card.cost}/${averageCost.toFixed(1)}` },
      { tone: typeCount < typeFloor ? "card" : "note", icon: "분", label: "타입", value: `${typeLabels(card.type)} ${typeCount}` },
      option.upgraded ? { tone: "power", icon: "강", label: "강화", value: "즉시" } : null
    ].filter(Boolean)
  };
}

function gemInsight(option, state, index) {
  const gem = index.gems.get(option.gemId);
  if (!gem) return { score: 0, items: [] };
  const role = gemRoleSummary(gem);
  const deckCardIds = [...new Set(state.deck || [])];
  const compatibleCards = deckCardIds
    .map((cardId) => index.cards.get(cardId))
    .filter((card) => card && canEquipGemToCard(gem, card));
  const openSlots = compatibleCards.reduce((sum, card) => {
    const capacity = socketCapacity(state, index, card.id);
    const filled = (state.cardSockets?.[card.id] || []).filter(Boolean).length;
    return sum + Math.max(0, capacity - filled);
  }, 0);
  const hints = gemFitHints(gem).slice(0, 2);
  let score = 50 + Math.min(18, compatibleCards.length * 3) + Math.min(16, openSlots * 4);
  if (compatibleCards.length === 0) score -= 24;
  if (openSlots === 0) score -= 12;
  return {
    score,
    items: [
      { tone: role.tone, icon: role.icon, label: "역할", value: role.label },
      { tone: compatibleCards.length > 0 ? "gem" : "danger", icon: "장", label: "장착", value: `${compatibleCards.length}장` },
      { tone: openSlots > 0 ? "safe" : "note", icon: "홈", label: "빈 소켓", value: `${openSlots}` },
      hints[0] ? { tone: "note", icon: "맞", label: "추천", value: hints.join(" · ") } : null
    ].filter(Boolean)
  };
}

function buildItemInsight(option, state, index, kind) {
  const item = kind === "relic" ? index.relics.get(option.relicId) : index.arcanas.get(option.arcanaId);
  if (!item) return { score: 0, items: [] };
  const role = buildItemRoleSummary(item, kind);
  const ownedIds = [...(state.inventory?.relics || []), ...(state.inventory?.arcanas || [])];
  const ownedRoleCount = ownedIds
    .map((id) => index.relics.get(id) ? buildItemRoleSummary(index.relics.get(id), "relic") : index.arcanas.get(id) ? buildItemRoleSummary(index.arcanas.get(id), "arcana") : null)
    .filter((ownedRole) => ownedRole?.key === role.key).length;
  const hints = buildFitHints(item, kind).slice(0, 2);
  let score = 64 + (ownedRoleCount === 0 ? 12 : 4);
  if (item.rarity === "legendary") score += 8;
  if (item.rarity === "rare") score += 4;
  return {
    score,
    items: [
      { tone: role.tone, icon: role.icon, label: "역할", value: role.label },
      { tone: ownedRoleCount === 0 ? "safe" : "note", icon: "빌", label: "빌드", value: ownedRoleCount === 0 ? "새 축" : `동계열 ${ownedRoleCount}` },
      { tone: "reward", icon: "희", label: "등급", value: rarityLabels(item.rarity) },
      hints[0] ? { tone: "note", icon: "맞", label: "추천", value: hints.join(" · ") } : null
    ].filter(Boolean)
  };
}

function goldInsight(option, state) {
  const amount = option.amount || 0;
  const before = state.player?.gold || 0;
  const after = before + amount;
  return {
    score: before < 80 ? 72 : 48,
    items: [
      { tone: "gold", icon: "별", label: "수급", value: `+${amount}` },
      { tone: "cost", icon: "지", label: "보유", value: `${before}→${after}` },
      { tone: before < 80 ? "safe" : "note", icon: "상", label: "상점", value: before < 80 ? "준비" : "여유" }
    ]
  };
}

function deckCardsForState(state, index) {
  return (state.deck || []).map((cardId) => index.cards.get(cardId)).filter(Boolean);
}

function deckAverageCost(cards) {
  if (!cards.length) return 0;
  return cards.reduce((sum, card) => sum + (card.cost || 0), 0) / cards.length;
}

function scoreLabel(score) {
  if (score >= 75) return "강력 추천";
  if (score >= 58) return "잘 맞음";
  if (score >= 40) return "상황 선택";
  return "낮음";
}

function scoreTone(score) {
  if (score >= 75) return "great";
  if (score >= 58) return "good";
  if (score >= 40) return "ok";
  return "low";
}

function clampScore(score) {
  return Math.max(0, Math.min(99, Math.round(score)));
}

function typeLabels(type) {
  return ({ attack: "공격", guard: "방어", skill: "기술", power: "지속", curse: "방해", temp: "임시" })[type] || type || "카드";
}

function rarityLabels(rarity) {
  return ({ basic: "기본", common: "일반", uncommon: "고급", rare: "희귀", legendary: "전설" })[rarity] || rarity || "일반";
}
