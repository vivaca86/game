export const PROFILE_KEY = "sunny_maze_profile_v1";

const profileCollections = [
  { key: "unlockedCards", dataKey: "cards", label: "카드" },
  { key: "unlockedGems", dataKey: "gems", label: "보석" },
  { key: "unlockedRelics", dataKey: "relics", label: "유물" },
  { key: "unlockedArcanas", dataKey: "arcanas", label: "기운" },
  { key: "unlockedCharacters", dataKey: "characters", label: "캐릭터" },
  { key: "unlockedStages", dataKey: "stages", label: "스테이지" }
];

export function createDefaultProfile(index) {
  const now = new Date().toISOString();
  return reconcileProfile({
    version: 1,
    createdAt: now,
    updatedAt: now,
    unlockedCards: index.data.cards.filter(isStarterCard).map((item) => item.id),
    unlockedGems: index.data.gems.filter(isStarterGem).map((item) => item.id),
    unlockedRelics: index.data.relics.filter(isStarterRelic).map((item) => item.id),
    unlockedArcanas: index.data.arcanas.filter(isStarterArcana).map((item) => item.id),
    unlockedCharacters: index.data.characters.filter(isStarterUnlock).map((item) => item.id),
    unlockedStages: index.data.stages.filter(isStarterUnlock).map((item) => item.id),
    achievements: [],
    clearedStages: [],
    metaUpgrades: [],
    stats: {
      totalRuns: 0,
      wins: 0,
      losses: 0,
      totalGold: 0,
      bestStageOrder: 0
    },
    lastRunSummary: null
  }, index);
}

export function loadProfile(index, storage = globalThis.localStorage) {
  if (!storage) return createDefaultProfile(index);
  const raw = storage.getItem(PROFILE_KEY);
  if (!raw) return createDefaultProfile(index);
  try {
    return reconcileProfile(JSON.parse(raw), index);
  } catch {
    return createDefaultProfile(index);
  }
}

export function saveProfile(profile, storage = globalThis.localStorage) {
  if (!storage || !profile) return false;
  profile.updatedAt = new Date().toISOString();
  storage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return true;
}

export function clearProfile(storage = globalThis.localStorage) {
  if (!storage) return false;
  storage.removeItem(PROFILE_KEY);
  return true;
}

export function applyProfileToRun(state, index, profile) {
  const activeProfile = reconcileProfile(profile || createDefaultProfile(index), index);
  state.profileUnlocks = {
    cards: [...activeProfile.unlockedCards],
    gems: [...activeProfile.unlockedGems],
    relics: [...activeProfile.unlockedRelics],
    arcanas: [...activeProfile.unlockedArcanas],
    characters: [...activeProfile.unlockedCharacters],
    stages: [...activeProfile.unlockedStages]
  };
  state.inventory.unlockedCards = unique([...state.inventory.unlockedCards, ...activeProfile.unlockedCards]);
  state.inventory.unlockedCharacters = unique([...state.inventory.unlockedCharacters, ...activeProfile.unlockedCharacters]);
  state.inventory.unlockedStages = unique([...state.inventory.unlockedStages, ...activeProfile.unlockedStages]);
  state.inventory.achievements = unique([...state.inventory.achievements, ...activeProfile.achievements]);
  state.inventory.metaUpgrades = unique([...(state.inventory.metaUpgrades || []), ...activeProfile.metaUpgrades]);
  return state;
}

export function finalizeRunProfile(state, index, profile) {
  const nextProfile = reconcileProfile(profile || createDefaultProfile(index), index);
  if (state.status.profileFinalized) {
    return { profile: nextProfile, summary: state.resultSummary || nextProfile.lastRunSummary, changed: false };
  }

  const before = snapshotUnlocks(nextProfile);
  const stage = index.stages.get(state.stageId);
  const won = state.phase === "stage_clear";

  if (won && stage) {
    addUnique(nextProfile.clearedStages, stage.id);
    addUnique(nextProfile.unlockedStages, stage.id);
    if (stage.clearRewards?.unlockStageId) addUnique(nextProfile.unlockedStages, stage.clearRewards.unlockStageId);
  }

  mergeRunUnlocks(nextProfile, state);
  applyAchievementRewardsToProfile(nextProfile, index);
  applyStageUnlocksToProfile(nextProfile, index);

  nextProfile.stats.totalRuns += 1;
  if (won) nextProfile.stats.wins += 1;
  else nextProfile.stats.losses += 1;
  nextProfile.stats.totalGold += state.player.gold;
  if (stage) nextProfile.stats.bestStageOrder = Math.max(nextProfile.stats.bestStageOrder, stage.order);

  const summary = createRunSummary(state, index, nextProfile, before, won);
  nextProfile.lastRunSummary = summary;
  nextProfile.updatedAt = new Date().toISOString();
  state.status.profileFinalized = true;
  state.resultSummary = summary;
  return { profile: nextProfile, summary, changed: true };
}

export function isUnlocked(profile, key, id) {
  return profile?.[key]?.includes(id) || false;
}

export function availableIds(profile, key) {
  return [...(profile?.[key] || [])];
}

export function reconcileProfile(profile, index) {
  const fallback = profile && typeof profile === "object" ? profile : {};
  const next = {
    ...fallback,
    version: 1,
    createdAt: fallback.createdAt || new Date().toISOString(),
    updatedAt: fallback.updatedAt || new Date().toISOString(),
    stats: {
      totalRuns: fallback.stats?.totalRuns || 0,
      wins: fallback.stats?.wins || 0,
      losses: fallback.stats?.losses || 0,
      totalGold: fallback.stats?.totalGold || 0,
      bestStageOrder: fallback.stats?.bestStageOrder || 0
    },
    achievements: unique(fallback.achievements || []),
    clearedStages: unique(fallback.clearedStages || []),
    metaUpgrades: unique(fallback.metaUpgrades || []),
    lastRunSummary: fallback.lastRunSummary || null
  };

  for (const collection of profileCollections) {
    next[collection.key] = validIds(fallback[collection.key] || [], index.data[collection.dataKey]);
  }

  mergeDefaults(next, index);
  applyAchievementRewardsToProfile(next, index);
  applyStageUnlocksToProfile(next, index);
  return next;
}

function mergeDefaults(profile, index) {
  for (const card of index.data.cards.filter(isStarterCard)) addUnique(profile.unlockedCards, card.id);
  for (const gem of index.data.gems.filter(isStarterGem)) addUnique(profile.unlockedGems, gem.id);
  for (const relic of index.data.relics.filter(isStarterRelic)) addUnique(profile.unlockedRelics, relic.id);
  for (const arcana of index.data.arcanas.filter(isStarterArcana)) addUnique(profile.unlockedArcanas, arcana.id);
  for (const character of index.data.characters.filter(isStarterUnlock)) addUnique(profile.unlockedCharacters, character.id);
  for (const stage of index.data.stages.filter(isStarterUnlock)) addUnique(profile.unlockedStages, stage.id);
}

function mergeRunUnlocks(profile, state) {
  for (const id of state.inventory.unlockedCards || []) addUnique(profile.unlockedCards, id);
  for (const id of state.inventory.gems || []) addUnique(profile.unlockedGems, id);
  for (const id of state.inventory.relics || []) addUnique(profile.unlockedRelics, id);
  for (const id of state.inventory.arcanas || []) addUnique(profile.unlockedArcanas, id);
  for (const id of state.inventory.unlockedCharacters || []) addUnique(profile.unlockedCharacters, id);
  for (const id of state.inventory.unlockedStages || []) addUnique(profile.unlockedStages, id);
  for (const id of state.inventory.achievements || []) addUnique(profile.achievements, id);
  if (state.inventory.lastMetaReward) addUnique(profile.metaUpgrades, state.inventory.lastMetaReward);
  for (const id of state.inventory.metaUpgrades || []) addUnique(profile.metaUpgrades, id);
}

function applyAchievementRewardsToProfile(profile, index) {
  for (const achievement of index.data.achievements) {
    if (!profile.achievements.includes(achievement.id)) continue;
    const reward = achievement.reward || {};
    if (reward.unlockCardId) addUnique(profile.unlockedCards, reward.unlockCardId);
    if (reward.unlockGemId) addUnique(profile.unlockedGems, reward.unlockGemId);
    if (reward.unlockRelicId) addUnique(profile.unlockedRelics, reward.unlockRelicId);
    if (reward.unlockArcanaId) addUnique(profile.unlockedArcanas, reward.unlockArcanaId);
    if (reward.unlockCharacterId) addUnique(profile.unlockedCharacters, reward.unlockCharacterId);
    if (reward.metaUpgradeId) addUnique(profile.metaUpgrades, reward.metaUpgradeId);
  }
}

function applyStageUnlocksToProfile(profile, index) {
  const cleared = new Set(profile.clearedStages);
  for (const stage of index.data.stages) {
    if (stage.unlock?.type === "stage_clear" && cleared.has(stage.unlock.stageId)) addUnique(profile.unlockedStages, stage.id);
  }
  for (const character of index.data.characters) {
    if (character.unlock?.type === "stage_clear" && cleared.has(character.unlock.stageId)) addUnique(profile.unlockedCharacters, character.id);
  }
  for (const card of index.data.cards) {
    if (["stage_clear", "pool"].includes(card.unlock?.type) && cleared.has(card.unlock.stageId)) addUnique(profile.unlockedCards, card.id);
  }
  for (const gem of index.data.gems) {
    if (gem.unlock?.type === "stage_clear" && cleared.has(gem.unlock.stageId)) addUnique(profile.unlockedGems, gem.id);
  }
  for (const relic of index.data.relics) {
    if (relic.unlock?.type === "stage_clear" && cleared.has(relic.unlock.stageId)) addUnique(profile.unlockedRelics, relic.id);
  }
  for (const arcana of index.data.arcanas) {
    if (arcana.unlock?.type === "stage_clear" && cleared.has(arcana.unlock.stageId)) addUnique(profile.unlockedArcanas, arcana.id);
  }
}

function createRunSummary(state, index, profile, before, won) {
  const stage = index.stages.get(state.stageId);
  return {
    won,
    stageId: state.stageId,
    stageName: stage?.name || state.stageId,
    characterId: state.characterId,
    characterName: index.characters.get(state.characterId)?.name || state.characterId,
    roomsCleared: state.metrics.roomsCleared,
    enemiesDefeated: state.metrics.enemiesDefeated,
    maxChain: state.metrics.maxChain,
    enemyIntentsResolved: state.metrics.enemyIntentsResolved || 0,
    bossPhaseTriggers: state.metrics.bossPhaseTriggers || 0,
    gold: state.player.gold,
    deckSize: state.deck.length,
    gemCount: state.inventory.gemBag.length,
    relicCount: state.inventory.relics.length,
    arcanaCount: state.inventory.arcanas.length,
    achievements: diffNamed(before.achievements, profile.achievements, index.data.achievements, "업적"),
    unlocks: profileCollections.flatMap((collection) =>
      diffNamed(before[collection.key], profile[collection.key], index.data[collection.dataKey], collection.label)
    ),
    metaUpgrades: diffNamed(before.metaUpgrades, profile.metaUpgrades, index.data.metaUpgrades, "마을")
  };
}

function snapshotUnlocks(profile) {
  return {
    unlockedCards: [...profile.unlockedCards],
    unlockedGems: [...profile.unlockedGems],
    unlockedRelics: [...profile.unlockedRelics],
    unlockedArcanas: [...profile.unlockedArcanas],
    unlockedCharacters: [...profile.unlockedCharacters],
    unlockedStages: [...profile.unlockedStages],
    achievements: [...profile.achievements],
    metaUpgrades: [...profile.metaUpgrades]
  };
}

function diffNamed(before, after, rows, label) {
  const previous = new Set(before || []);
  const rowById = new Map(rows.map((row) => [row.id, row]));
  return (after || [])
    .filter((id) => !previous.has(id))
    .map((id) => ({ id, name: rowById.get(id)?.name || id, label }));
}

function isStarterCard(card) {
  return card.unlock?.type === "starter" || card.unlock?.type === "base_pool";
}

function isStarterGem(gem) {
  return gem.unlock?.type === "starter_pool";
}

function isStarterRelic(relic) {
  return !relic.unlock || relic.unlock.type === "starter_pool";
}

function isStarterArcana(arcana) {
  return arcana.unlock?.type === "starter";
}

function isStarterUnlock(item) {
  return item.unlock?.type === "starter";
}

function validIds(ids, rows) {
  const valid = new Set(rows.map((row) => row.id));
  return unique(ids).filter((id) => valid.has(id));
}

function unique(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function addUnique(list, value) {
  if (value && !list.includes(value)) list.push(value);
}
