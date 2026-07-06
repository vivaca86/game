import { checkAchievements } from "./achievements.js";
import { applyCardEffects, cardCost } from "./card-effects.js";
import { addLog, drawCards } from "./game-state.js";
import { openReward } from "./rewards.js";
import { ensureGemState, equippedGemInstancesForCard } from "./gems.js";
import { setActionFeedback } from "./action-feedback.js";
import { bossPhaseBlock, enemyAttackBonus, enemyBlockBonus, enemyIntentAmount, enemyMaxHp } from "./balance.js";
import {
  afterCardPlayedModifiers,
  afterCombatCompleteModifiers,
  afterPlayerDamagedModifiers,
  applyBattleStartModifiers,
  consumeChainPreserve,
  discardHandWithModifiers,
  nextTurnShieldWithModifiers,
  resetTurnModifierState
} from "./run-modifiers.js";

let enemyInstanceSeq = 1;

export function startCombat(state, index, roomType = "combat", options = {}) {
  ensureGemState(state);
  const stage = index.stages.get(state.stageId);
  const sourcePool = Array.isArray(options.enemyIds) && options.enemyIds.length > 0
    ? options.enemyIds
    : roomType === "boss"
    ? [stage.bossEnemyId]
    : roomType === "elite"
      ? stage.elitePool
      : stage.enemyPool;
  const count = options.enemyIds?.length || (roomType === "combat" ? Math.min(2, sourcePool.length) : 1);
  state.enemies = selectEnemyIds(sourcePool, count, state)
    .map((enemyId) => createEnemyInstance(index.enemies.get(enemyId), stage, roomType))
    .filter(Boolean);
  state.phase = "combat";
  state.currentRoomType = roomType;
  state.battleRules = [];
  state.turn = 1;
  state.status.chain = 0;
  state.status.previousCard = null;
  state.status.battleRuleTriggers = 0;
  state.status.reflectRatio = 0;
  state.player.shield = 0;
  state.player.energy = state.player.maxEnergy;
  state.metrics.cardsPlayedThisTurn = 0;
  state.metrics.cardsPlayedThisCombat = 0;
  state.metrics.enemyIntentsResolved = state.metrics.enemyIntentsResolved || 0;
  state.metrics.bossPhaseTriggers = state.metrics.bossPhaseTriggers || 0;
  applyBattleStartModifiers(state, index);
  addLog(state, `${options.label || roomLabel(roomType)} 시작`);
}

export function playCard(state, index, handIndex) {
  if (state.phase !== "combat") return false;
  const cardId = state.hand[handIndex];
  const card = index.cards.get(cardId);
  if (!card) return false;
  const cost = cardCost(card, state, index);
  if (cost > state.player.energy) {
    addLog(state, "기운이 부족합니다.");
    return false;
  }

  state.hand.splice(handIndex, 1);
  state.player.energy -= cost;
  state.status.nextCardDiscount = 0;
  state.status.nextCardCostIncrease = 0;
  state.metrics.cardsPlayedThisTurn += 1;
  state.metrics.cardsPlayedThisCombat += 1;
  state.status.chain = (state.status.chain || 0) + 1;
  state.metrics.maxChain = Math.max(state.metrics.maxChain, state.status.chain);
  const context = {
    cardId,
    cost,
    killedThisPlay: false,
    exhaustSelf: false,
    feedback: {
      damage: 0,
      blocked: 0,
      shield: 0,
      draw: 0,
      energy: 0,
      healed: 0,
      marks: 0,
      defeated: 0,
      targetInstanceIds: [],
      targetNames: []
    }
  };
  const enemiesBefore = state.enemies.length;
  applyCardEffects({ card, state, index, context });
  context.killedThisPlay = context.killedThisPlay || state.enemies.length < enemiesBefore;
  afterCardPlayedModifiers({ state, index, card, context, cost });
  applyEnemyPhaseRules(state, index);

  if (context.killedThisPlay) {
    for (const rank of new Set(context.killedEnemyRanks || [])) {
      checkAchievements(state, index, "defeat_rank", { rank });
    }
    for (const enemyId of context.killedEnemyIds || []) {
      checkAchievements(state, index, "defeat_enemy", { enemyId });
      checkAchievements(state, index, "defeat_enemy_count", { enemyId });
    }
  }
  if (context.exhaustSelf || card.type === "temp" || card.type === "curse") state.exhaustPile.push(cardId);
  else state.discardPile.push(cardId);

  state.status.previousCard = { id: card.id, cost };
  setCardActionFeedback(state, index, card, context);
  checkAchievements(state, index, "reach_chain");
  if (state.enemies.length === 0) completeCombat(state, index);
  return true;
}

export function cleanseDisruption(state, index) {
  if (state.phase !== "combat") return false;
  const disruptions = state.hand
    .map((cardId, handIndex) => ({ cardId, card: index.cards.get(cardId), handIndex }))
    .filter((item) => item.card && ["curse", "temp"].includes(item.card.type));
  if (disruptions.length === 0) {
    addLog(state, "정리할 방해 카드가 없습니다.");
    return false;
  }
  const target = disruptions.find((item) => state.player.energy >= disruptionCleanseCost(item.card)) || disruptions[0];
  const { cardId, card, handIndex } = target;
  const cost = disruptionCleanseCost(card);
  if (state.player.energy < cost) {
    addLog(state, `방해 정리에는 기운 ${cost}이 필요합니다.`);
    return false;
  }
  state.player.energy -= cost;
  state.hand.splice(handIndex, 1);
  state.exhaustPile.push(cardId);
  state.status.disruptionsCleared = (state.status.disruptionsCleared || 0) + 1;
  setActionFeedback(state, {
    kind: "cleanse",
    tone: "trick",
    icon: "정",
    title: "방해 정리",
    subject: card.name,
    detail: `기운 ${cost}을 써서 이번 전투에서 제외했습니다.`,
    metrics: [{ label: "정리", value: state.status.disruptionsCleared }]
  });
  addLog(state, `방해 정리: ${card.name}`);
  return true;
}

export function endTurn(state, index) {
  if (state.phase !== "combat") return false;
  const incoming = { normalDamage: 0, piercingDamage: 0 };
  state.enemies.forEach((enemy) => {
    const intent = nextIntent(enemy, state.turn);
    resolveEnemyIntent(state, index, enemy, intent, incoming);
  });
  const markBonus = state.status.playerMarked > 0 ? Math.ceil(incoming.normalDamage * Math.min(0.5, state.status.playerMarked * 0.15)) : 0;
  const incomingDamage = incoming.normalDamage + markBonus;
  const reduced = Math.max(0, incomingDamage - (state.status.damageReduction || 0));
  const blocked = Math.min(state.player.shield, reduced);
  const damage = Math.max(0, reduced - blocked) + incoming.piercingDamage;
  const remainingShield = Math.max(0, state.player.shield - blocked);
  state.player.shield = nextTurnShieldWithModifiers(state, index, remainingShield, state.status.retainShield || 0);
  state.player.hp = Math.max(0, state.player.hp - damage);
  state.status.damageTakenThisCombat = (state.status.damageTakenThisCombat || 0) + damage;
  afterPlayerDamagedModifiers(state, index, damage);
  if (damage > 0 && state.status.reflectRatio > 0) {
    reflectDamage(state, index, Math.ceil(damage * state.status.reflectRatio));
  }
  state.status.reflectRatio = 0;
  addLog(state, damage > 0 ? `피해 ${damage} 받음` : "공격을 막았습니다.");
  setEnemyTurnFeedback(state, { damage, blocked, piercing: incoming.piercingDamage, markBonus });

  discardHandWithModifiers(state, index);
  state.turn += 1;
  state.player.energy = Math.max(1, state.player.maxEnergy - (state.status.nextTurnEnergyPenalty || 0));
  state.status.nextTurnEnergyPenalty = 0;
  state.status.damageReduction = 0;
  state.status.retainShield = 0;
  tickPlayerDebuffs(state);
  state.metrics.cardsPlayedThisTurn = 0;
  if (state.status.preserveNextChain) state.status.preserveNextChain = false;
  else if (!consumeChainPreserve(state, index)) state.status.chain = 0;
  resetTurnModifierState(state);
  drawCards(state, 5);

  if (state.player.hp <= 0) {
    state.phase = "defeat";
    addLog(state, "탐험 실패");
    return true;
  }
  if (state.enemies.length === 0) {
    completeCombat(state, index);
  }
  return true;
}

function setCardActionFeedback(state, index, card, context) {
  const feedback = context.feedback || {};
  const metrics = [
    feedback.damage > 0 ? { label: "피해", value: feedback.damage } : null,
    feedback.blocked > 0 ? { label: "차단", value: feedback.blocked } : null,
    feedback.shield > 0 ? { label: "보호막", value: feedback.shield } : null,
    feedback.draw > 0 ? { label: "드로우", value: feedback.draw } : null,
    feedback.energy > 0 ? { label: "기운", value: `+${feedback.energy}` } : null,
    feedback.healed > 0 ? { label: "회복", value: feedback.healed } : null,
    feedback.marks > 0 ? { label: "표식", value: feedback.marks } : null,
    feedback.defeated > 0 ? { label: "처치", value: feedback.defeated } : null
  ].filter(Boolean);
  const targetNames = [...new Set(feedback.targetNames || [])].slice(0, 2);
  const gemEvents = equippedGemInstancesForCard(state, index, card.id)
    .map((instance) => {
      const gem = index.gems.get(instance.gemId);
      return gem ? { name: gem.name, summary: gemFeedbackSummary(gem) } : null;
    })
    .filter(Boolean);
  setActionFeedback(state, {
    kind: "card",
    tone: card.type,
    icon: cardFeedbackIcon(card.type),
    title: "카드 사용",
    subject: card.name,
    detail: targetNames.length > 0 ? `${targetNames.join(", ")}에게 효과 적용` : `${card.type === "guard" ? "방어 흐름" : "카드 효과"} 발동`,
    metrics,
    targetInstanceIds: feedback.targetInstanceIds || [],
    targetEvents: feedback.targetEvents || [],
    selfEvents: cardSelfFeedbackEvents(feedback),
    gemEvents
  });
}

function setEnemyTurnFeedback(state, { damage, blocked, piercing, markBonus }) {
  setActionFeedback(state, {
    kind: "enemy",
    tone: damage > 0 ? "danger" : "guard",
    icon: damage > 0 ? "피" : "막",
    title: "적 차례",
    subject: damage > 0 ? `피해 ${damage}` : "공격 방어",
    detail: damage > 0 ? "적 의도를 처리했습니다." : "보호막과 효과로 피해를 막았습니다.",
    metrics: [
      damage > 0 ? { label: "피해", value: damage } : null,
      { label: "차단", value: blocked },
      piercing > 0 ? { label: "관통", value: piercing } : null,
      markBonus > 0 ? { label: "표식", value: `+${markBonus}` } : null
    ].filter(Boolean),
    selfEvents: [
      damage > 0 ? { tone: "damage", label: "플레이어", value: `피해 -${damage}` } : null,
      blocked > 0 ? { tone: "guard", label: "보호막", value: `차단 ${blocked}` } : null,
      piercing > 0 ? { tone: "damage", label: "관통", value: `-${piercing}` } : null
    ].filter(Boolean)
  });
}

function cardSelfFeedbackEvents(feedback) {
  return [
    feedback.shield > 0 ? { tone: "guard", label: "플레이어", value: `보호막 +${feedback.shield}` } : null,
    feedback.healed > 0 ? { tone: "heal", label: "플레이어", value: `회복 +${feedback.healed}` } : null,
    feedback.draw > 0 ? { tone: "flow", label: "손패", value: `드로우 +${feedback.draw}` } : null,
    feedback.energy > 0 ? { tone: "flow", label: "기운", value: `+${feedback.energy}` } : null,
    feedback.marks > 0 ? { tone: "status", label: "표식", value: `+${feedback.marks}` } : null
  ].filter(Boolean);
}

function gemFeedbackSummary(gem) {
  const effect = gem.effects?.[0];
  if (!effect) return gem.text || "효과";
  if (effect.op === "modify_damage_percent") return `피해 +${effect.amount}%`;
  if (effect.op === "modify_shield_percent") return `보호막 +${effect.amount}%`;
  if (effect.op === "modify_cost") return `비용 ${effect.amount}`;
  if (effect.op === "heal_on_play") return `회복 +${effect.amount}`;
  if (effect.op === "apply_mark_on_play") return `표식 +${effect.amount}`;
  if (effect.op === "echo_basic_effect") return `메아리 ${Math.round(effect.ratio * 100)}%`;
  if (effect.op === "splash_damage") return `주변 ${Math.round(effect.ratio * 100)}%`;
  if (effect.op === "preserve_chain") return "연쇄 유지";
  if (effect.op === "bridge_next_color_bonus") return "다음 색 연결";
  return gem.text || "효과";
}

function cardFeedbackIcon(type) {
  return ({ attack: "공", guard: "방", skill: "기", power: "지", temp: "방", curse: "저" })[type] || "카";
}

export function nextIntent(enemy, turn) {
  return enemy.intents[(turn - 1) % enemy.intents.length];
}

export function intentDetail(intent) {
  if (!intent) return "";
  if (intent.type === "attack") return `피해 ${intent.amount}`;
  if (intent.type === "guard") return `방어 ${intent.amount}`;
  if (intent.type === "debuff" && intent.status === "mark") return `표식 ${intent.amount || 1}`;
  if (intent.type === "debuff" && intent.status === "weak") return `약화 ${intent.amount || 1}`;
  if (intent.effect === "add_temp_card") return `방해 카드 ${intent.amount || 1}장`;
  if (intent.effect === "reduce_energy") return `다음 턴 기운 -${intent.amount || 1}`;
  if (intent.effect === "fortify_all") return `모두 방어 ${intent.amount || 0}`;
  if (intent.effect === "heal_self") return `체력 회복 ${intent.amount || 0}`;
  if (intent.effect === "pierce_attack") return `관통 피해 ${intent.amount || 0}`;
  if (intent.effect === "chain_down") {
    const parts = [`연쇄 -${intent.amount || 1}`];
    if (intent.costIncrease) parts.push(`다음 비용 +${intent.costIncrease}`);
    return parts.join(" · ");
  }
  if (intent.effect === "summon") return "친구 호출";
  return intent.label || intent.type;
}

export function disruptionCleanseCost(card) {
  if (!card || !["curse", "temp"].includes(card.type)) return 0;
  return card.type === "curse" ? 2 : 1;
}

function completeCombat(state, index) {
  const source = state.currentRoomType;
  state.metrics.roomsCleared += 1;
  checkAchievements(state, index, "room_clear", { stageId: state.stageId });
  if (source === "elite") checkAchievements(state, index, "defeat_rank", { rank: "elite" });
  if (source === "boss") {
    const stage = index.stages.get(state.stageId);
    checkAchievements(state, index, "defeat_enemy", { enemyId: stage.bossEnemyId });
    checkAchievements(state, index, "clear_stage", { stageId: state.stageId });
  }
  afterCombatCompleteModifiers(state, index, source);
  openReward(state, index, source);
}

function selectEnemyIds(sourcePool, count, state) {
  const pool = [...sourcePool];
  const result = [];
  while (pool.length > 0 && result.length < count) {
    const index = Math.floor(state.rng.next() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
}

function createEnemyInstance(enemy, stage, roomType = "combat") {
  if (!enemy) return null;
  const stageOrder = stage?.order || 1;
  const rankBonus = enemy.rank === "boss" ? 2 : enemy.rank === "elite" ? 1 : 0;
  const maxHp = enemyMaxHp(enemy.maxHp, enemy.rank, stageOrder);
  const blockBonus = enemyBlockBonus(stageOrder, rankBonus);
  return {
    ...structuredClone(enemy),
    maxHp,
    hp: maxHp,
    block: (enemy.block || 0) + blockBonus,
    instanceId: `enemy_${enemyInstanceSeq++}`,
    status: {},
    role: enemyRole(enemy, stageOrder, roomType),
    intents: buildEnemyIntents(enemy, stageOrder, roomType),
    phaseRulesTriggered: []
  };
}

function buildEnemyIntents(enemy, stageOrder, roomType) {
  const attackBonus = enemyAttackBonus(stageOrder, roomType);
  const blockBonus = enemyBlockBonus(stageOrder - 1);
  const baseIntents = enemy.intents.map((intent) => {
    const next = { ...intent };
    if (next.type === "attack" || next.effect === "pierce_attack") next.amount = enemyIntentAmount(enemy.rank, "attack", (next.amount || 0) + attackBonus, stageOrder);
    if (next.type === "guard" || next.effect === "fortify_all") next.amount = enemyIntentAmount(enemy.rank, "guard", (next.amount || 0) + blockBonus, stageOrder);
    return next;
  });
  const extra = extraIntentFor(enemy, stageOrder, roomType);
  return extra ? [...baseIntents, extra] : baseIntents;
}

function extraIntentFor(enemy, stageOrder, roomType) {
  if (roomType === "boss") {
    return bossIntentFor(stageOrder);
  }
  if (enemy.rank === "elite") {
    const familyIntent = familyIntentFor(enemy.family, stageOrder, enemy.id.includes("_trick"));
    return familyIntent || (stageOrder % 2 === 0
      ? { type: "special", effect: "fortify_all", amount: 4 + Math.floor(stageOrder / 2), label: "대장 응원" }
      : { type: "special", effect: "pierce_attack", amount: 4 + Math.floor(stageOrder / 2), label: "틈새 장난" });
  }
  return familyIntentFor(enemy.family, stageOrder, enemy.id.includes("_trick")) || fallbackIntentFor(enemy, stageOrder);
}

function familyIntentFor(family, stageOrder, isTrick) {
  const guard = 3 + Math.floor(stageOrder / 2);
  const pierce = 2 + Math.floor(stageOrder / 4) + (stageOrder < 8 ? 1 : 0);
  const heal = 5 + stageOrder;
  const chainDown = isTrick ? 3 : 2;
  const chainCostIncrease = stageOrder >= 6 ? 1 : 0;
  const intents = {
    "구름": { type: "special", effect: "fortify_all", amount: guard, label: "몽실 숨기" },
    "부적": { type: "debuff", status: isTrick ? "weak" : "mark", amount: 1, label: isTrick ? "종이 흔들기" : "부적 표식" },
    "새싹": { type: "special", effect: "heal_self", amount: heal, label: "새싹 돋기" },
    "등불": { type: "debuff", status: "mark", amount: 1, label: "반짝 표식" },
    "별사탕": { type: "special", effect: "reduce_energy", amount: 1, label: "달콤한 현기증" },
    "리본": { type: "special", effect: "chain_down", amount: chainDown, costIncrease: chainCostIncrease, label: "리본 헝클기" },
    "방울": { type: "special", effect: "add_temp_card", amount: 1, cardId: "card_temp_dust", label: "방울 먼지" },
    "말랑": { type: "special", effect: "fortify_all", amount: guard + 1, label: "말랑 쿠션" },
    "프리즘": { type: "special", effect: "pierce_attack", amount: pierce + 1, label: "프리즘 관통" },
    "달빛": { type: "debuff", status: "weak", amount: 1, label: "달빛 졸음" },
    "복숭아": { type: "special", effect: "pierce_attack", amount: pierce, label: "복숭아 콕" },
    "장난감": { type: "special", effect: "add_temp_card", amount: 1, cardId: "card_temp_dust", label: "장난감 먼지" },
    "잎사귀": { type: "special", effect: "heal_self", amount: heal + 2, label: "잎사귀 회복" },
    "별빛": { type: "debuff", status: "mark", amount: 1, label: "별빛 조준" },
    "쿠키": { type: "special", effect: isTrick ? "reduce_energy" : "fortify_all", amount: isTrick ? 1 : guard, label: isTrick ? "쿠키 유혹" : "쿠키 방패" }
  };
  return intents[family] || null;
}

function fallbackIntentFor(enemy, stageOrder) {
  const familyPattern = stageOrder % 6;
  if (enemy.id.includes("_trick")) {
    const effects = [
      { type: "debuff", status: "mark", amount: 1, label: "콕 집기" },
      { type: "special", effect: "add_temp_card", amount: 1, cardId: "card_temp_dust", label: "먼지 넣기" },
      { type: "debuff", status: "weak", amount: 1, label: "힘 빼기" },
      { type: "special", effect: "reduce_energy", amount: 1, label: "기운 흔들기" },
      { type: "special", effect: "chain_down", amount: 2, label: "연쇄 흔들기" },
      { type: "special", effect: "heal_self", amount: 6 + stageOrder, label: "간식 먹기" }
    ];
    return effects[familyPattern];
  }
  if (familyPattern === 1) return { type: "special", effect: "fortify_all", amount: 3 + Math.floor(stageOrder / 2), label: "함께 숨기" };
  if (familyPattern === 3) return { type: "special", effect: "pierce_attack", amount: 3 + Math.floor(stageOrder / 3), label: "살짝 콕" };
  if (familyPattern === 5) return { type: "special", effect: "heal_self", amount: 5 + stageOrder, label: "숨 고르기" };
  return null;
}

function bossIntentFor(stageOrder) {
  const pattern = (stageOrder - 1) % 5;
  if (pattern === 0) return { type: "special", effect: "summon", label: "친구 부르기" };
  if (pattern === 1) return { type: "debuff", status: "weak", amount: 1, label: "왕방울 압박" };
  if (pattern === 2) return { type: "special", effect: "chain_down", amount: 4, label: "연쇄 흔들기" };
  if (pattern === 3) return { type: "special", effect: "pierce_attack", amount: 8 + stageOrder, label: "반짝 관통" };
  return { type: "special", effect: "fortify_all", amount: 10 + stageOrder, label: "왕방울 장벽" };
}

function enemyRole(enemy, stageOrder, roomType) {
  if (enemy.rank === "boss") return ["호출형 보스", "압박형 보스", "연쇄 방해 보스", "관통형 보스", "장벽형 보스"][(stageOrder - 1) % 5];
  const familyRole = familyRoleFor(enemy.family);
  if (enemy.rank === "elite") return `${familyRole || (stageOrder % 2 === 0 ? "방어" : "관통")} 정예`;
  if (enemy.id.includes("_trick")) return `${familyRole || "방해"} 장난형`;
  return familyRole || (stageOrder % 3 === 0 ? "회복형" : stageOrder % 2 === 0 ? "방어형" : "공격형");
}

function familyRoleFor(family) {
  return ({
    "구름": "장벽형",
    "부적": "표식형",
    "새싹": "회복형",
    "등불": "표식형",
    "별사탕": "기운 방해형",
    "리본": "연쇄 방해형",
    "방울": "방해형",
    "말랑": "장벽형",
    "프리즘": "관통형",
    "달빛": "약화형",
    "복숭아": "관통형",
    "장난감": "방해형",
    "잎사귀": "회복형",
    "별빛": "표식형",
    "쿠키": "장벽형"
  })[family] || "";
}

function resolveEnemyIntent(state, index, enemy, intent, incoming) {
  if (!enemy || !intent) return;
  state.metrics.enemyIntentsResolved = (state.metrics.enemyIntentsResolved || 0) + 1;
  if (intent.type === "attack") {
    incoming.normalDamage += intent.amount || 0;
    return;
  }
  if (intent.type === "guard") {
    enemy.block = (enemy.block || 0) + (intent.amount || 0);
    return;
  }
  if (intent.type === "debuff") {
    applyPlayerDebuff(state, intent);
    return;
  }
  if (intent.type === "special") {
    resolveSpecialIntent(state, index, enemy, intent, incoming);
  }
}

function resolveSpecialIntent(state, index, enemy, intent, incoming) {
  if (intent.effect === "add_temp_card") {
    const amount = intent.amount || 1;
    for (let count = 0; count < amount; count += 1) state.discardPile.push(intent.cardId || "card_temp_dust");
    addLog(state, `${enemy.name}: 방해 카드 ${amount}장`);
  }
  if (intent.effect === "reduce_energy") {
    state.status.nextTurnEnergyPenalty = Math.max(state.status.nextTurnEnergyPenalty || 0, intent.amount || 1);
    addLog(state, `${enemy.name}: 다음 턴 기운 -${intent.amount || 1}`);
  }
  if (intent.effect === "fortify_all") {
    state.enemies.forEach((target) => {
      target.block = (target.block || 0) + (intent.amount || 0);
    });
    addLog(state, `${enemy.name}: 모두 방어 ${intent.amount || 0}`);
  }
  if (intent.effect === "heal_self") {
    const before = enemy.hp;
    enemy.hp = Math.min(enemy.maxHp, enemy.hp + (intent.amount || 0));
    addLog(state, `${enemy.name}: 체력 ${enemy.hp - before} 회복`);
  }
  if (intent.effect === "pierce_attack") {
    incoming.piercingDamage += intent.amount || 0;
    addLog(state, `${enemy.name}: 보호막 관통 ${intent.amount || 0}`);
  }
  if (intent.effect === "chain_down") {
    state.status.chain = Math.max(0, (state.status.chain || 0) - (intent.amount || 1));
    if (intent.costIncrease) {
      state.status.nextCardCostIncrease = Math.max(state.status.nextCardCostIncrease || 0, intent.costIncrease);
    }
    addLog(state, `${enemy.name}: 연쇄 ${intent.amount || 1} 감소`);
  }
  if (intent.effect === "summon") {
    summonEnemy(state, index, intent.enemyId, enemy.name);
  }
}

function applyPlayerDebuff(state, intent) {
  if (intent.status === "mark") {
    state.status.playerMarked = (state.status.playerMarked || 0) + (intent.amount || 1);
    addLog(state, `표식 ${intent.amount || 1} 받음`);
    return;
  }
  if (intent.status === "weak") {
    state.status.playerWeak = (state.status.playerWeak || 0) + (intent.amount || 1);
    addLog(state, `약화 ${intent.amount || 1} 받음`);
    return;
  }
  state.status.nextCardCostIncrease = Math.max(state.status.nextCardCostIncrease || 0, intent.amount || 1);
}

function tickPlayerDebuffs(state) {
  if (state.status.playerMarked > 0) state.status.playerMarked -= 1;
  if (state.status.playerWeak > 0) state.status.playerWeak -= 1;
}

function applyEnemyPhaseRules(state, index) {
  const stage = index.stages.get(state.stageId);
  for (const enemy of [...state.enemies]) {
    if (!enemy.phaseRules?.length || enemy.hp <= 0) continue;
    enemy.phaseRulesTriggered = enemy.phaseRulesTriggered || [];
    enemy.phaseRules.forEach((rule, ruleIndex) => {
      if (enemy.phaseRulesTriggered.includes(ruleIndex)) return;
      if (enemy.hp / enemy.maxHp > rule.hpBelowRatio) return;
      enemy.phaseRulesTriggered.push(ruleIndex);
      state.metrics.bossPhaseTriggers = (state.metrics.bossPhaseTriggers || 0) + 1;
      if (rule.addIntent?.effect === "summon") {
        summonEnemy(state, index, rule.addIntent.enemyId, enemy.name);
      } else if (rule.addIntent) {
        resolveSpecialIntent(state, index, enemy, rule.addIntent, { normalDamage: 0, piercingDamage: 0 });
      }
      enemy.block = (enemy.block || 0) + bossPhaseBlock(stage?.order || 1);
      addLog(state, `${enemy.name}: 페이즈 변화`);
    });
  }
}

function summonEnemy(state, index, enemyId, sourceName) {
  if (state.enemies.length >= 3) return false;
  const stage = index.stages.get(state.stageId);
  const fallbackPool = stage?.enemyPool || [];
  const selectedId = enemyId || fallbackPool[Math.min(fallbackPool.length - 1, state.enemies.length)] || fallbackPool[0];
  const summoned = createEnemyInstance(index.enemies.get(selectedId), stage, "combat");
  if (!summoned) return false;
  state.enemies.push(summoned);
  addLog(state, `${sourceName}: ${summoned.name} 호출`);
  return true;
}

function reflectDamage(state, index, amount) {
  if (amount <= 0) return;
  const enemy = state.enemies[0];
  if (!enemy) return;
  let incoming = amount;
  const blocked = Math.min(enemy.block || 0, incoming);
  enemy.block = Math.max(0, (enemy.block || 0) - blocked);
  incoming -= blocked;
  if (incoming <= 0) {
    addLog(state, `동글 거울막: ${enemy.name} 방어 흔들기`);
    return;
  }
  enemy.hp = Math.max(0, enemy.hp - incoming);
  addLog(state, `동글 거울막: ${enemy.name}에게 반사 피해 ${incoming}`);
  if (enemy.hp > 0) return;
  state.metrics.enemiesDefeated += 1;
  state.metrics.defeatedEnemyCounts = state.metrics.defeatedEnemyCounts || {};
  state.metrics.defeatedEnemyCounts[enemy.id] = (state.metrics.defeatedEnemyCounts[enemy.id] || 0) + 1;
  if (enemy.rank === "elite") state.metrics.elitesDefeated += 1;
  checkAchievements(state, index, "defeat_enemy", { enemyId: enemy.id });
  checkAchievements(state, index, "defeat_enemy_count", { enemyId: enemy.id });
  checkAchievements(state, index, "defeat_rank", { rank: enemy.rank });
  state.enemies = state.enemies.filter((target) => target.instanceId !== enemy.instanceId);
}

function roomLabel(roomType) {
  return ({ combat: "전투", elite: "정예 전투", boss: "보스 전투" })[roomType] || "전투";
}
