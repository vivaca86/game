import type { GameDataBundle } from "../../data/schema";
import type { SliceRunState } from "./runState";

const CARD_FEEDBACK_EFFECTS: Record<string, string> = {
  card_sun_jab: "effect_paper_slash",
  card_ribbon_snap: "effect_paper_slash",
  card_pinpoint_glint: "effect_paper_slash",
  card_ink_spill: "effect_ink_splash",
  card_lamplight_mark: "effect_ink_splash",
  card_fold_guard: "effect_stage_spotlight",
  card_page_step: "effect_stage_spotlight",
  card_stage_patch: "effect_stage_spotlight",
  card_paper_bloom: "effect_stage_spotlight",
  card_curtain_call: "effect_stage_spotlight"
};

export function resolveCombatFeedbackEffectKey(
  run: SliceRunState,
  bundle: GameDataBundle
): string | undefined {
  if (!run.combat || (run.phase !== "combat" && run.phase !== "boss")) {
    return undefined;
  }

  const latest = run.log.at(-1);
  if (!latest || !isFeedbackLog(latest)) {
    return undefined;
  }

  const recent = run.log.slice(-6).reverse();
  const phaseLog = recent.find((entry) => entry.startsWith("boss:phase:"));
  if (phaseLog) {
    const phaseId = phaseLog.replace("boss:phase:", "");
    const boss = bundle.bosses.find((item) => item.id === run.combat?.enemyId);
    return boss?.phases.find((phase) => phase.id === phaseId)?.visualCueKey ?? "effect_stage_spotlight";
  }

  const cardId = findRecentPlayedCardId(recent);
  if (cardId && CARD_FEEDBACK_EFFECTS[cardId]) {
    return CARD_FEEDBACK_EFFECTS[cardId];
  }

  if (recent.some((entry) => entry.startsWith("enemy:mark") || entry.startsWith("card:cost_penalty_next"))) {
    return "effect_ink_splash";
  }

  if (recent.some((entry) => entry.startsWith("enemy:damage"))) {
    return "effect_paper_slash";
  }

  return undefined;
}

export function resolveCombatFeedbackFrame(run: SliceRunState): number {
  return Math.max(0, (run.log.length - 1) % 16);
}

function findRecentPlayedCardId(logEntries: string[]): string | undefined {
  const cardLog = logEntries.find((entry) => entry.startsWith("card:play:"));
  if (!cardLog) {
    return undefined;
  }

  return cardLog.split(":")[2];
}

function isFeedbackLog(entry: string): boolean {
  return entry.startsWith("boss:phase:")
    || entry.startsWith("enemy:damage")
    || entry.startsWith("enemy:mark")
    || entry.startsWith("player:block")
    || entry.startsWith("player:heal")
    || entry.startsWith("player:reduce_next_damage")
    || entry.startsWith("card:discount_next")
    || entry.startsWith("card:cost_penalty_next")
    || entry.startsWith("reward:bonus_options")
    || entry.startsWith("draw:");
}
