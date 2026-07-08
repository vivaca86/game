import type { ContentId } from "../../data/schema";

export type CombatantKind = "enemy" | "boss";

export interface SliceCombatState {
  enemyId: ContentId;
  enemyKind: CombatantKind;
  enemyHp: number;
  enemyMaxHp: number;
  enemyBlock: number;
  enemyMark: number;
  intentIndex: number;
  turn: number;
  defeated: boolean;
  bossPhaseTriggered: boolean;
  pendingAttackBonus: number;
}
