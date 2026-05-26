import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixturePaths = [
  path.join(rootDir, "docs", "vertical-slice-data.fixture.v1.json"),
  path.join(rootDir, "src", "data", "fixtures", "vertical-slice.v1.json")
];
const combatSystemPath = path.join(rootDir, "src", "simulation", "systems", "combat", "combatSystem.ts");

const errors = [];
const warnings = [];

const cardEffectRules = {
  deal_damage: checkDealDamage,
  conditional_bonus_damage: checkConditionalBonusDamage,
  gain_block: checkGainBlock,
  apply_mark: checkApplyMark,
  draw_cards: checkDrawCards,
  discount_next_card: checkDiscountNextCard,
  heal: checkHeal,
  reduce_next_damage: checkReduceNextDamage,
  increase_next_card_reward_options: checkRewardOptions
};

const runtimeHandledCardOps = new Set();

for (const match of (await readFile(combatSystemPath, "utf8")).matchAll(/effect\.op === "([^"]+)"/g)) {
  runtimeHandledCardOps.add(match[1]);
}

const fixtures = await Promise.all(fixturePaths.map(readFixture));
const [docFixture, runtimeFixture] = fixtures;

if (docFixture && runtimeFixture) {
  compareCardEffects(docFixture, runtimeFixture);
}

for (const fixture of fixtures.filter(Boolean)) {
  auditFixtureCards(fixture);
}

warnings.forEach((message) => console.warn(`Warning: ${message}`));

if (errors.length > 0) {
  errors.forEach((message) => console.error(`Error: ${message}`));
  process.exit(1);
}

console.log(`Slice effect audit OK: files=${fixtures.filter(Boolean).length}, cards=${docFixture?.data.cards.length ?? 0}`);

async function readFixture(filePath) {
  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    return { filePath, data: parsed.data ?? {} };
  } catch (error) {
    errors.push(`${relative(filePath)}: JSON parse failed: ${error.message}`);
    return undefined;
  }
}

function compareCardEffects(doc, runtime) {
  const runtimeCards = new Map((runtime.data.cards ?? []).map((card) => [card.id, card]));
  for (const card of doc.data.cards ?? []) {
    const runtimeCard = runtimeCards.get(card.id);
    if (!runtimeCard) {
      errors.push(`runtime fixture missing card from docs fixture: ${card.id}`);
      continue;
    }

    const docShape = cardShape(card);
    const runtimeShape = cardShape(runtimeCard);
    if (JSON.stringify(docShape) !== JSON.stringify(runtimeShape)) {
      errors.push(`docs/runtime fixture card effect text drift: ${card.id}`);
    }
  }
}

function cardShape(card) {
  return {
    descriptionKo: card.descriptionKo,
    effects: card.effects
  };
}

function auditFixtureCards(fixture) {
  for (const card of fixture.data.cards ?? []) {
    const label = `${relative(fixture.filePath)} cards/${card.id}`;
    const description = normalize(card.descriptionKo ?? "");

    if (description.includes("후보")) {
      errors.push(`${label}: descriptionKo still contains draft marker "후보" for implemented card effects`);
    }

    if (!Array.isArray(card.effects) || card.effects.length === 0) {
      errors.push(`${label}: effects must be non-empty`);
      continue;
    }

    const ops = new Set(card.effects.map((effect) => effect.op));
    for (const effect of card.effects) {
      if (!cardEffectRules[effect.op]) {
        errors.push(`${label}: unknown card effect op "${effect.op}"`);
        continue;
      }
      if (!runtimeHandledCardOps.has(effect.op)) {
        errors.push(`${label}: card effect op is not handled by Phaser slice simulation: ${effect.op}`);
      }
      cardEffectRules[effect.op](label, card, effect);
    }

    checkDescriptionDoesNotPromiseMissingOps(label, description, ops);
  }
}

function checkDealDamage(label, card, effect) {
  const text = normalize(card.descriptionKo);
  const amount = effectAmount(label, effect);
  requireIncludes(label, text, "피해", effect.op);
  requireAmount(label, text, amount, effect.op);

  if (effect.value?.target === "front_enemy") {
    requireIncludes(label, text, "앞의 적", effect.op);
  } else if (effect.value?.target === "all_enemies") {
    requireIncludes(label, text, "모든 적", effect.op);
  } else {
    errors.push(`${label}: deal_damage target must be front_enemy or all_enemies`);
  }
}

function checkConditionalBonusDamage(label, card, effect) {
  const text = normalize(card.descriptionKo);
  const amount = effectAmount(label, effect);
  const threshold = Number(effect.condition?.match(/chain_count\s*>=\s*(\d+)/)?.[1]);

  requireIncludes(label, text, "연쇄", effect.op);
  if (Number.isFinite(threshold)) {
    requireAmount(label, text, threshold, `${effect.op} condition`);
  } else {
    errors.push(`${label}: conditional_bonus_damage needs chain_count >= N condition`);
  }
  requireIncludes(label, text, "피해", effect.op);
  requireSignedAmount(label, text, amount, effect.op);
}

function checkGainBlock(label, card, effect) {
  const text = normalize(card.descriptionKo);
  const amount = effectAmount(label, effect);
  requireIncludes(label, text, "보호막", effect.op);
  requireAmount(label, text, amount, effect.op);
}

function checkApplyMark(label, card, effect) {
  const text = normalize(card.descriptionKo);
  const amount = effectAmount(label, effect);
  requireIncludes(label, text, "표식", effect.op);
  requireAmount(label, text, amount, effect.op);
}

function checkDrawCards(label, card, effect) {
  const text = normalize(card.descriptionKo);
  const amount = effectAmount(label, effect);
  requireIncludes(label, text, "카드", effect.op);
  requireOneOf(label, text, ["뽑", "드로우"], effect.op);
  requireAmount(label, text, amount, effect.op);
}

function checkDiscountNextCard(label, card, effect) {
  const text = normalize(card.descriptionKo);
  const amount = effectAmount(label, effect);
  requireIncludes(label, text, "비용", effect.op);
  requireSignedAmount(label, text, -amount, effect.op);
}

function checkHeal(label, card, effect) {
  const text = normalize(card.descriptionKo);
  const amount = effectAmount(label, effect);
  requireOneOf(label, text, ["HP", "회복"], effect.op);
  requireAmount(label, text, amount, effect.op);
  if (effect.condition) {
    errors.push(`${label}: heal condition "${effect.condition}" is not represented by current slice runtime`);
  }
}

function checkReduceNextDamage(label, card, effect) {
  const text = normalize(card.descriptionKo);
  const amount = effectAmount(label, effect);
  requireIncludes(label, text, "다음 피해", effect.op);
  requireOneOf(label, text, ["줄", "-"], effect.op);
  requireAmount(label, text, amount, effect.op);
}

function checkRewardOptions(label, card, effect) {
  const text = normalize(card.descriptionKo);
  const amount = effectAmount(label, effect);
  requireIncludes(label, text, "보상", effect.op);
  requireIncludes(label, text, "선택지", effect.op);
  requireSignedAmount(label, text, amount, effect.op);
}

function checkDescriptionDoesNotPromiseMissingOps(label, text, ops) {
  const promises = [
    { key: "표식", op: "apply_mark" },
    { key: "보호막", op: "gain_block" },
    { key: "회복", op: "heal" },
    { key: "보상 선택지", op: "increase_next_card_reward_options" }
  ];

  for (const promise of promises) {
    if (text.includes(promise.key) && !ops.has(promise.op)) {
      errors.push(`${label}: description mentions "${promise.key}" but effects do not include ${promise.op}`);
    }
  }

  if (text.includes("비용 -") && !ops.has("discount_next_card")) {
    errors.push(`${label}: description mentions cost reduction but effects do not include discount_next_card`);
  }
  if (text.includes("다음 피해") && text.includes("줄") && !ops.has("reduce_next_damage")) {
    errors.push(`${label}: description mentions damage reduction but effects do not include reduce_next_damage`);
  }
}

function effectAmount(label, effect) {
  const amount = effect.value?.amount;
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    errors.push(`${label}: ${effect.op} needs numeric value.amount`);
    return 0;
  }
  return amount;
}

function requireIncludes(label, text, token, context) {
  if (!text.includes(token)) {
    errors.push(`${label}: descriptionKo missing "${token}" for ${context}`);
  }
}

function requireOneOf(label, text, tokens, context) {
  if (!tokens.some((token) => text.includes(token))) {
    errors.push(`${label}: descriptionKo missing one of ${tokens.map((token) => `"${token}"`).join(", ")} for ${context}`);
  }
}

function requireAmount(label, text, amount, context) {
  if (!text.includes(String(amount))) {
    errors.push(`${label}: descriptionKo missing amount ${amount} for ${context}`);
  }
}

function requireSignedAmount(label, text, amount, context) {
  const signText = amount > 0 ? `+${amount}` : `${amount}`;
  if (!text.includes(signText) && !text.includes(String(Math.abs(amount)))) {
    errors.push(`${label}: descriptionKo missing signed amount ${signText} for ${context}`);
  }
}

function normalize(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function relative(filePath) {
  return path.relative(rootDir, filePath).replaceAll("\\", "/");
}
