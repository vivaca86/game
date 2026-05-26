// Runtime game data types, copied from docs/game-data-types.v1.ts.
// Date: 2026-05-26
// Status: first Phaser scaffold schema.

export type ContentId = string;
export type AssetKey = string;
export type LocaleKey = string;
export type ReferenceRole = string;

export type EvidenceLevel =
  | "none"
  | "source_level"
  | "direct_ui"
  | "runtime_verified"
  | "approved_originalized";

export interface EvidenceInfo {
  level: EvidenceLevel;
  sources: string[];
  notes?: string;
}

export interface BaseContent {
  id: ContentId;
  displayNameKo: string;
  descriptionKo: string;
  tags: string[];
  referenceRole: ReferenceRole;
  evidence: EvidenceInfo;
  notes?: string;
}

export type CardType = "attack" | "defense" | "skill" | "curse" | "event" | "special";
export type Rarity = "starter" | "common" | "rare" | "epic" | "legendary";
export type Timing =
  | "on_play"
  | "on_draw"
  | "turn_start"
  | "turn_end"
  | "combat_start"
  | "combat_end"
  | "room_enter"
  | "reward_offer"
  | "run_start"
  | "run_end";

export interface EffectValue {
  amount?: number;
  percent?: number;
  duration?: number;
  target?: "self" | "front_enemy" | "all_enemies" | "random_enemy" | "card" | "run";
}

export interface GameEffect {
  op: string;
  timing: Timing;
  value: EffectValue;
  condition?: string;
  previewKo?: string;
}

export interface RuneSlotSpec {
  socketType: "attack" | "defense" | "skill" | "any";
  unlockedByDefault: boolean;
}

export interface CardUpgradeSpec {
  upgradedId?: ContentId;
  cost?: number;
  effectChanges: GameEffect[];
}

export interface EvolutionRef {
  evolutionId: ContentId;
  previewResultCardId: ContentId;
}

export interface CardData extends BaseContent {
  type: CardType;
  cost: number;
  rarity: Rarity;
  colorKey?: string;
  effects: GameEffect[];
  runeSlots: RuneSlotSpec[];
  upgrade?: CardUpgradeSpec;
  evolution?: EvolutionRef;
  assetKeys: {
    frame: AssetKey;
    illustration: AssetKey;
    typeIcon: AssetKey;
  };
  balance: {
    role: string;
    powerBand: "starter" | "early" | "mid" | "late" | "boss";
    expectedValue?: number;
    lockState: "draft" | "slice_locked" | "verified";
  };
}

export interface RuneData extends BaseContent {
  socketType: "attack" | "defense" | "skill" | "any";
  rarity: Exclude<Rarity, "starter">;
  effects: GameEffect[];
  validCardTypes: CardType[];
  assetKeys: {
    icon: AssetKey;
  };
  recommendation: {
    bestRoles: string[];
    warning?: string;
  };
}

export interface PassiveContent extends BaseContent {
  rarity: Exclude<Rarity, "starter">;
  effects: GameEffect[];
  unlockId?: ContentId;
  assetKeys: {
    icon: AssetKey;
  };
}

export type RelicData = PassiveContent;

export interface ArcanaData extends PassiveContent {
  slotType: "run_start" | "event_reward" | "boss_reward";
}

export interface CharacterData extends BaseContent {
  maxHp: number;
  startingEnergy: number;
  startingDeck: ContentId[];
  passives: GameEffect[];
  unlockId?: ContentId;
  assetKeys: {
    portrait: AssetKey;
    sprite?: AssetKey;
  };
}

export type RoomType = "combat" | "elite" | "event" | "shop" | "rest" | "reward" | "boss";

export interface RoomSlot {
  id: ContentId;
  type: RoomType;
  encounterPoolId?: ContentId;
  rewardPoolId?: ContentId;
  requiredClear?: boolean;
}

export interface StageData extends BaseContent {
  order: number;
  biomeKey: string;
  route: RoomSlot[];
  bossId: ContentId;
  unlockId?: ContentId;
  rewardPools: ContentId[];
  assetKeys: {
    backgroundSet: AssetKey;
    mapIcon: AssetKey;
  };
}

export type EnemyRole = "attacker" | "defender" | "disruptor" | "summoner" | "hybrid";

export interface EnemyIntent {
  id: ContentId;
  displayNameKo: string;
  telegraphKo: string;
  effects: GameEffect[];
  weight?: number;
}

export interface EnemyData extends BaseContent {
  role: EnemyRole;
  maxHp: number;
  block?: number;
  intents: EnemyIntent[];
  assetKeys: {
    sprite: AssetKey;
    intentIcons: AssetKey[];
  };
}

export interface BossPhase {
  id: ContentId;
  hpRatioAtOrBelow: number;
  displayNameKo: string;
  effects: GameEffect[];
  visualCueKey: AssetKey;
}

export interface BossData extends EnemyData {
  phases: BossPhase[];
}

export interface EventChoice {
  id: ContentId;
  displayNameKo: string;
  descriptionKo: string;
  cost?: GameEffect[];
  rewards?: RewardEntry[];
  nextRoomOverride?: RoomType;
  riskKey?: string;
}

export interface EventData extends BaseContent {
  choices: EventChoice[];
  assetKeys: {
    scene: AssetKey;
  };
}

export type RewardType = "card" | "rune" | "relic" | "arcana" | "currency" | "heal" | "unlock";

export interface RewardEntry {
  id: ContentId;
  type: RewardType;
  contentId?: ContentId;
  amount?: number;
  weight?: number;
}

export interface RewardRule {
  id: ContentId;
  descriptionKo: string;
  condition?: string;
}

export interface RewardPoolData {
  id: ContentId;
  displayNameKo: string;
  entries: RewardEntry[];
  rules: RewardRule[];
}

export interface UnlockTrigger {
  op: string;
  targetId?: ContentId;
  amount?: number;
}

export interface UnlockGrant {
  type:
    | "card"
    | "rune"
    | "relic"
    | "arcana"
    | "character"
    | "stage"
    | "stage_clear"
    | "power_up";
  contentId: ContentId;
}

export interface UnlockData extends BaseContent {
  trigger: UnlockTrigger;
  grants: UnlockGrant[];
}

export interface EvolutionData extends BaseContent {
  fromCardId: ContentId;
  requiredRuneIds?: ContentId[];
  requiredRelicIds?: ContentId[];
  consumesMaterials: boolean;
  resultCardId: ContentId;
}

export interface PowerUpRank {
  rank: number;
  cost: number;
  effects: GameEffect[];
}

export interface PowerUpData extends BaseContent {
  maxRank: number;
  ranks: PowerUpRank[];
  refundable: boolean;
}

export interface AssetManifestEntry {
  key: AssetKey;
  type: "image" | "spritesheet" | "atlas" | "audio" | "font";
  path: string;
  nativeSize?: { w: number; h: number };
  frameSize?: { w: number; h: number };
  anchor?: { x: number; y: number };
  styleKey: "premium_popup_book";
}

export interface ProfileState {
  unlockedCards: ContentId[];
  unlockedRunes: ContentId[];
  unlockedRelics: ContentId[];
  unlockedArcanas: ContentId[];
  unlockedCharacters: ContentId[];
  unlockedStages: ContentId[];
  completedStages: ContentId[];
}

export type SavePhase =
  | "town"
  | "world_map"
  | "dungeon"
  | "combat"
  | "reward"
  | "rune_bench"
  | "boss"
  | "result";

export interface SaveCombatState {
  enemyId: ContentId;
  enemyKind: "enemy" | "boss";
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

export interface RunState {
  runId: string;
  phase: SavePhase;
  characterId: ContentId;
  stageId: ContentId;
  roomIndex: number;
  deck: ContentId[];
  drawPile: ContentId[];
  hand: ContentId[];
  discard: ContentId[];
  playerEnergy: number;
  playerMaxEnergy: number;
  playerBlock: number;
  combat?: SaveCombatState;
  rewardPoolId?: ContentId;
  offeredRewards: ContentId[];
  rewardSourceRoomIndex?: number;
  equippedRunes: Record<ContentId, ContentId[]>;
  runes: ContentId[];
  relics: ContentId[];
  arcanas: ContentId[];
  completedStages: ContentId[];
  nextCardDiscount: number;
  nextCardCostPenalty: number;
  nextDamageReduction: number;
  nextRewardBonus: number;
  chainCount: number;
  log: string[];
  hp: number;
  maxHp: number;
  currency: number;
}

export interface SettingsState {
  language: "ko";
  volumeMaster: number;
  volumeMusic: number;
  volumeSfx: number;
}

export interface SaveData {
  saveVersion: number;
  profile: ProfileState;
  currentRun?: RunState;
  settings: SettingsState;
}

export interface GameDataBundle {
  cards: CardData[];
  runes: RuneData[];
  relics: RelicData[];
  arcanas: ArcanaData[];
  characters: CharacterData[];
  stages: StageData[];
  enemies: EnemyData[];
  bosses: BossData[];
  events: EventData[];
  rewardPools: RewardPoolData[];
  unlocks: UnlockData[];
  evolutions: EvolutionData[];
  powerUps: PowerUpData[];
  assets: AssetManifestEntry[];
}
