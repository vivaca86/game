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
  return (run.equippedRunes[cardId] ?? []).reduce((total, runeId) => {
    const rune = bundle.runes.find((item) => item.id === runeId);
    const amount = rune?.effects
      .filter((effect) => effect.op === bonusOp)
      .reduce((sum, effect) => sum + (effect.value.amount ?? 0), 0) ?? 0;
    return total + amount;
  }, 0);
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

