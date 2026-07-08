import type {
  ContentId,
  GameDataBundle,
  ProfileState,
  RunState,
  SaveCombatState,
  SaveData,
  SavePhase,
  SettingsState
} from "../data/schema";

export const SAVE_STORAGE_KEY = "paper_theater_card_crawler_save_v1";
export const DEBUG_SAVE_STORAGE_KEY = "paper_theater_card_crawler_debug_save_v1";

const DEFAULT_SETTINGS: SettingsState = {
  language: "ko",
  volumeMaster: 0.8,
  volumeMusic: 0.6,
  volumeSfx: 0.8,
  displayMode: "standard",
  largeText: false,
  reducedMotion: false,
  spaceConfirm: true
};

interface SaveStorageOptions {
  debug: boolean;
  resetSave?: boolean;
}

export function createInitialSave(bundle: GameDataBundle): SaveData {
  const character = bundle.characters[0];
  const stage = bundle.stages[0];
  const deck = [...(character?.startingDeck ?? [])];

  return {
    saveVersion: 1,
    profile: {
      unlockedCards: character?.startingDeck ?? [],
      unlockedRunes: bundle.runes.slice(0, 3).map((rune) => rune.id),
      unlockedRelics: bundle.relics.slice(0, 1).map((relic) => relic.id),
      unlockedArcanas: bundle.arcanas.slice(0, 1).map((arcana) => arcana.id),
      unlockedCharacters: character ? [character.id] : [],
      unlockedStages: stage ? [stage.id] : [],
      completedStages: []
    },
    currentRun: character && stage ? {
      runId: "slice-run-001",
      phase: "town",
      characterId: character.id,
      stageId: stage.id,
      roomIndex: 0,
      deck,
      drawPile: deck.slice(5),
      hand: deck.slice(0, 5),
      discard: [],
      playerEnergy: character.startingEnergy,
      playerMaxEnergy: character.startingEnergy,
      playerBlock: 0,
      offeredRewards: [],
      equippedRunes: {},
      runes: [],
      relics: [],
      arcanas: [],
      completedStages: [],
      lastEventChoiceId: undefined,
      nextCardDiscount: 0,
      nextCardCostPenalty: 0,
      nextDamageReduction: 0,
      nextRewardBonus: 0,
      chainCount: 0,
      firstExpensiveCardFreeAvailable: true,
      guardCardsPlayedThisCombat: 0,
      colorsPlayedThisTurn: [],
      prismPathTriggeredThisTurn: false,
      log: ["boot:town"],
      hp: character.maxHp,
      maxHp: character.maxHp,
      currency: 80
    } : undefined,
    settings: createDefaultSettings()
  };
}

export function createDefaultSettings(): SettingsState {
  return { ...DEFAULT_SETTINGS };
}

export function loadSave(bundle: GameDataBundle, options: SaveStorageOptions): SaveData {
  const storage = getStorage();
  const key = resolveSaveStorageKey(options);

  if (storage && options.resetSave) {
    storage.removeItem(key);
  }

  const raw = storage?.getItem(key);
  const decoded = raw ? decodeSave(raw, bundle) : undefined;
  return decoded ?? createInitialSave(bundle);
}

export function hasUsableStoredSave(
  bundle: GameDataBundle,
  options: Pick<SaveStorageOptions, "debug">
): boolean {
  const storage = getStorage();
  const raw = storage?.getItem(resolveSaveStorageKey(options));
  return Boolean(raw && decodeSave(raw, bundle));
}

export function persistSave(save: SaveData, options: SaveStorageOptions): void {
  const storage = getStorage();
  if (!storage) return;

  const key = resolveSaveStorageKey(options);
  storage.setItem(key, JSON.stringify(normalizeSave(save, createInitialSaveFromSave(save))));
}

export function clearStoredSave(options: Pick<SaveStorageOptions, "debug">): void {
  getStorage()?.removeItem(resolveSaveStorageKey(options));
}

export function resolveSaveStorageKey(options: Pick<SaveStorageOptions, "debug">): string {
  return options.debug ? DEBUG_SAVE_STORAGE_KEY : SAVE_STORAGE_KEY;
}

function decodeSave(raw: string, bundle: GameDataBundle): SaveData | undefined {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return undefined;
    if (!isSupportedSaveVersion(parsed.saveVersion, parsed)) return undefined;

    return normalizeSave(parsed, createInitialSave(bundle));
  } catch {
    return undefined;
  }
}

function isSupportedSaveVersion(version: unknown, record: Record<string, unknown>): boolean {
  if (version === 1) return true;
  if (version === 0 || version === undefined) {
    return Boolean(record.profile || record.currentRun || record.settings);
  }
  return false;
}

function normalizeSave(value: unknown, fallback: SaveData): SaveData {
  const record = isRecord(value) ? value : {};
  return {
    saveVersion: 1,
    profile: normalizeProfile(record.profile, fallback.profile),
    currentRun: normalizeRun(record.currentRun, fallback.currentRun),
    settings: normalizeSettings(record.settings, fallback.settings)
  };
}

function normalizeProfile(value: unknown, fallback: ProfileState): ProfileState {
  const record = isRecord(value) ? value : {};
  return {
    unlockedCards: asStringArray(record.unlockedCards, fallback.unlockedCards),
    unlockedRunes: asStringArray(record.unlockedRunes, fallback.unlockedRunes),
    unlockedRelics: asStringArray(record.unlockedRelics, fallback.unlockedRelics),
    unlockedArcanas: asStringArray(record.unlockedArcanas, fallback.unlockedArcanas),
    unlockedCharacters: asStringArray(record.unlockedCharacters, fallback.unlockedCharacters),
    unlockedStages: asStringArray(record.unlockedStages, fallback.unlockedStages),
    completedStages: asStringArray(record.completedStages, fallback.completedStages)
  };
}

function normalizeRun(value: unknown, fallback: RunState | undefined): RunState | undefined {
  if (!fallback) return undefined;
  const record = isRecord(value) ? value : {};

  return {
    runId: asString(record.runId, fallback.runId),
    phase: asPhase(record.phase, fallback.phase),
    characterId: asString(record.characterId, fallback.characterId),
    stageId: asString(record.stageId, fallback.stageId),
    roomIndex: asNumber(record.roomIndex, fallback.roomIndex),
    deck: asStringArray(record.deck, fallback.deck),
    drawPile: asStringArray(record.drawPile, fallback.drawPile),
    hand: asStringArray(record.hand, fallback.hand),
    discard: asStringArray(record.discard, fallback.discard),
    playerEnergy: asNumber(record.playerEnergy, fallback.playerEnergy),
    playerMaxEnergy: asNumber(record.playerMaxEnergy, fallback.playerMaxEnergy),
    playerBlock: asNumber(record.playerBlock, fallback.playerBlock),
    combat: normalizeCombat(record.combat, fallback.combat),
    rewardPoolId: asOptionalString(record.rewardPoolId, fallback.rewardPoolId),
    offeredRewards: asStringArray(record.offeredRewards, fallback.offeredRewards),
    rewardSourceRoomIndex: asOptionalNumber(record.rewardSourceRoomIndex, fallback.rewardSourceRoomIndex),
    equippedRunes: asStringArrayRecord(record.equippedRunes, fallback.equippedRunes),
    runes: asStringArray(record.runes, fallback.runes),
    relics: asStringArray(record.relics, fallback.relics),
    arcanas: asStringArray(record.arcanas, fallback.arcanas),
    completedStages: asStringArray(record.completedStages, fallback.completedStages),
    lastEventChoiceId: asOptionalString(record.lastEventChoiceId, fallback.lastEventChoiceId),
    nextCardDiscount: asNumber(record.nextCardDiscount, fallback.nextCardDiscount),
    nextCardCostPenalty: asNumber(record.nextCardCostPenalty, fallback.nextCardCostPenalty),
    nextDamageReduction: asNumber(record.nextDamageReduction, fallback.nextDamageReduction),
    nextRewardBonus: asNumber(record.nextRewardBonus, fallback.nextRewardBonus),
    chainCount: asNumber(record.chainCount, fallback.chainCount),
    firstExpensiveCardFreeAvailable: typeof record.firstExpensiveCardFreeAvailable === "boolean"
      ? record.firstExpensiveCardFreeAvailable
      : fallback.firstExpensiveCardFreeAvailable,
    guardCardsPlayedThisCombat: asNumber(record.guardCardsPlayedThisCombat, fallback.guardCardsPlayedThisCombat ?? 0),
    colorsPlayedThisTurn: asStringArray(record.colorsPlayedThisTurn, fallback.colorsPlayedThisTurn ?? []),
    prismPathTriggeredThisTurn: typeof record.prismPathTriggeredThisTurn === "boolean"
      ? record.prismPathTriggeredThisTurn
      : fallback.prismPathTriggeredThisTurn,
    log: asStringArray(record.log, fallback.log),
    hp: asNumber(record.hp, fallback.hp),
    maxHp: asNumber(record.maxHp, fallback.maxHp),
    currency: asNumber(record.currency, fallback.currency)
  };
}

function normalizeCombat(value: unknown, fallback: SaveCombatState | undefined): SaveCombatState | undefined {
  if (!fallback && !isRecord(value)) return undefined;
  const record = isRecord(value) ? value : {};
  const base: SaveCombatState = fallback ?? {
    enemyId: "missing_enemy",
    enemyKind: "enemy",
    enemyHp: 1,
    enemyMaxHp: 1,
    enemyBlock: 0,
    enemyMark: 0,
    intentIndex: 0,
    turn: 1,
    defeated: false,
    bossPhaseTriggered: false,
    pendingAttackBonus: 0
  };

  return {
    enemyId: asString(record.enemyId, base.enemyId),
    enemyKind: record.enemyKind === "boss" ? "boss" : base.enemyKind,
    enemyHp: asNumber(record.enemyHp, base.enemyHp),
    enemyMaxHp: asNumber(record.enemyMaxHp, base.enemyMaxHp),
    enemyBlock: asNumber(record.enemyBlock, base.enemyBlock),
    enemyMark: asNumber(record.enemyMark, base.enemyMark),
    intentIndex: asNumber(record.intentIndex, base.intentIndex),
    turn: asNumber(record.turn, base.turn),
    defeated: typeof record.defeated === "boolean" ? record.defeated : base.defeated,
    bossPhaseTriggered: typeof record.bossPhaseTriggered === "boolean" ? record.bossPhaseTriggered : base.bossPhaseTriggered,
    pendingAttackBonus: asNumber(record.pendingAttackBonus, base.pendingAttackBonus)
  };
}

function normalizeSettings(value: unknown, fallback: SettingsState): SettingsState {
  const record = isRecord(value) ? value : {};
  return {
    language: "ko",
    volumeMaster: asVolume(record.volumeMaster, fallback.volumeMaster),
    volumeMusic: asVolume(record.volumeMusic, fallback.volumeMusic),
    volumeSfx: asVolume(record.volumeSfx, fallback.volumeSfx),
    displayMode: record.displayMode === "high_contrast" ? "high_contrast" : fallback.displayMode,
    largeText: asBoolean(record.largeText, fallback.largeText),
    reducedMotion: asBoolean(record.reducedMotion, fallback.reducedMotion),
    spaceConfirm: asBoolean(record.spaceConfirm, fallback.spaceConfirm)
  };
}

function createInitialSaveFromSave(save: SaveData): SaveData {
  return {
    saveVersion: 1,
    profile: save.profile,
    currentRun: save.currentRun,
    settings: save.settings
  };
}

function getStorage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function asOptionalString(value: unknown, fallback: string | undefined): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asVolume(value: unknown, fallback: number): number {
  const numberValue = asNumber(value, fallback);
  return Math.max(0, Math.min(1, numberValue));
}

function asOptionalNumber(value: unknown, fallback: number | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown, fallback: ContentId[]): ContentId[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [...fallback];
}

function asStringArrayRecord(
  value: unknown,
  fallback: Record<ContentId, ContentId[]>
): Record<ContentId, ContentId[]> {
  const record = isRecord(value) ? value : fallback;
  return Object.fromEntries(
    Object.entries(record)
      .filter(([key]) => typeof key === "string" && key.length > 0)
      .map(([key, runes]) => [key, asStringArray(runes, fallback[key] ?? [])])
  );
}

function asPhase(value: unknown, fallback: SavePhase): SavePhase {
  const phases: SavePhase[] = ["town", "world_map", "dungeon", "combat", "event", "reward", "rune_bench", "boss", "result"];
  return phases.includes(value as SavePhase) ? value as SavePhase : fallback;
}
