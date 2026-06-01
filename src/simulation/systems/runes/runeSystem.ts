import type { CardData, GameDataBundle, RuneData } from "../../../data/schema";
import { getCard, pushRunLog, type SliceRunState } from "../../state/runState";

export function ensureRuneBenchGrant(run: SliceRunState, bundle: GameDataBundle): void {
  if (run.runes.length > 0 || !bundle.runes[0]) return;
  run.runes.push(bundle.runes[0].id);
  pushRunLog(run, `rune:bench_grant:${bundle.runes[0].id}`);
}

export function equipFirstRune(run: SliceRunState, bundle: GameDataBundle): boolean {
  ensureRuneBenchGrant(run, bundle);

  for (const runeId of run.runes) {
    const rune = bundle.runes.find((item) => item.id === runeId);
    if (!rune) continue;
    const targetCard = findRuneTarget(run, bundle, rune);
    if (!targetCard) continue;

    const equipped = run.equippedRunes[targetCard.id] ?? [];
    if (equipped.includes(rune.id)) continue;
    run.equippedRunes[targetCard.id] = [...equipped, rune.id];
    pushRunLog(run, `rune:equip:${rune.id}->${targetCard.id}`);
    return true;
  }

  pushRunLog(run, "rune:equip:none");
  return false;
}

export function getAttachedRuneBonus(
  run: SliceRunState,
  bundle: GameDataBundle,
  cardId: string,
  bonusOp: "modify_attached_card_damage" | "modify_attached_card_block"
): number {
  return getAttachedRuneEffects(run, bundle, cardId, bonusOp)
    .reduce((total, effect) => total + (effect.value.amount ?? 0), 0);
}

export function getAttachedRuneEffects(
  run: SliceRunState,
  bundle: GameDataBundle,
  cardId: string,
  op: string
): RuneData["effects"] {
  return (run.equippedRunes[cardId] ?? [])
    .flatMap((runeId) => bundle.runes.find((item) => item.id === runeId)?.effects ?? [])
    .filter((effect) => effect.op === op);
}

export function getAttachedRuneModifiedAmount(
  run: SliceRunState,
  bundle: GameDataBundle,
  cardId: string,
  baseAmount: number,
  kind: "damage" | "block"
): number {
  const legacyOp = kind === "damage" ? "modify_attached_card_damage" : "modify_attached_card_block";
  const percentOp = kind === "damage" ? "modify_damage_percent" : "modify_shield_percent";
  const flatAmount = baseAmount + getAttachedRuneBonus(run, bundle, cardId, legacyOp);

  return getAttachedRuneEffects(run, bundle, cardId, percentOp).reduce((value, effect) => {
    const percent = effect.value.amount ?? effect.value.percent ?? 0;
    return Math.max(1, Math.ceil(value * (1 + percent / 100)));
  }, flatAmount);
}

export function getAttachedRuneModifiedCost(
  run: SliceRunState,
  bundle: GameDataBundle,
  cardId: string,
  baseCost: number
): number {
  return getAttachedRuneEffects(run, bundle, cardId, "modify_cost").reduce((cost, effect) => {
    return Math.max(0, cost + (effect.value.amount ?? 0));
  }, baseCost);
}

function findRuneTarget(
  run: SliceRunState,
  bundle: GameDataBundle,
  rune: RuneData
): CardData | undefined {
  for (const cardId of run.deck) {
    const card = getCard(bundle, cardId);
    if (!card || !rune.validCardTypes.includes(card.type)) continue;
    if ((run.equippedRunes[card.id] ?? []).includes(rune.id)) continue;
    if (card.runeSlots.length === 0) return card;
    if (card.runeSlots.some((slot) => slot.unlockedByDefault && slotMatches(slot.socketType, rune.socketType))) {
      return card;
    }
  }

  return undefined;
}

function slotMatches(slotType: string, runeType: string): boolean {
  return slotType === "any" || runeType === "any" || slotType === runeType;
}
