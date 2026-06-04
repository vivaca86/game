import assetManifestJson from "./assetManifest.release.v1.json";
import sliceAssetManifestJson from "./assetManifest.slice.v1.json";
import arcanasJson from "./ko/arcanas.json";
import cardsJson from "./ko/cards.json";
import charactersJson from "./ko/characters.json";
import enemiesJson from "./ko/enemies.json";
import eventsJson from "./ko/events.json";
import gemsJson from "./ko/gems.json";
import relicsJson from "./ko/relics.json";
import stagesJson from "./ko/stages.json";
import type {
  ArcanaData,
  AssetManifestEntry,
  BossData,
  BossPhase,
  CardData,
  CardType,
  CharacterData,
  ContentId,
  EncounterPoolData,
  EnemyData,
  EnemyIntent,
  EnemyRole,
  GameDataBundle,
  GameEffect,
  Rarity,
  RelicData,
  RewardEntry,
  RewardPoolData,
  RoomSlot,
  RoomType,
  RuneData
} from "./schema";

interface ManifestEnvelope {
  metadata: {
    id: string;
    status: string;
  };
  assets: AssetManifestEntry[];
}

interface RawEffect {
  op: string;
  amount?: number;
  threshold?: number;
  hits?: number;
  cost?: number;
  minCost?: number;
  ratio?: number;
  rule?: string;
  color?: string;
  hpBelowRatio?: number;
  [key: string]: unknown;
}

interface RawCard {
  id: string;
  name: string;
  type: string;
  rarity: string;
  cost: number;
  color?: string;
  tags?: string[];
  text?: string;
  effects?: RawEffect[];
  sockets?: {
    base?: number;
    max?: number;
  };
  upgrade?: {
    effects?: RawEffect[];
  };
}

interface RawGem {
  id: string;
  name: string;
  rarity: string;
  socketTypes?: string[];
  text?: string;
  effects?: RawEffect[];
}

interface RawPassive {
  id: string;
  name: string;
  rarity: string;
  text?: string;
  effects?: RawEffect[];
}

interface RawCharacter {
  id: string;
  name: string;
  role?: string;
  color?: string;
  maxHp: number;
  energy: number;
  starterDeck?: string[];
  passiveText?: string;
  passiveEffects?: RawEffect[];
}

interface RawStage {
  id: string;
  name: string;
  order: number;
  biome?: string;
  enemyPool?: string[];
  elitePool?: string[];
  bossEnemyId: string;
  rooms?: string[];
}

interface RawIntent {
  type: string;
  amount?: number;
  label?: string;
  effect?: string;
  status?: string;
  cardId?: string;
  enemyId?: string;
  costIncrease?: number;
}

interface RawEnemy {
  id: string;
  name: string;
  rank: "normal" | "elite" | "boss";
  family?: string;
  maxHp: number;
  block?: number;
  intents?: RawIntent[];
  phaseRules?: Array<{
    hpBelowRatio?: number;
    addIntent?: RawIntent;
  }>;
}

interface RawEventChoice {
  label?: string;
  cost?: Record<string, unknown>;
  reward?: Record<string, unknown>;
}

interface RawEvent {
  id: string;
  name: string;
  type?: string;
  text?: string;
  choices?: RawEventChoice[];
}

const manifest = assetManifestJson as ManifestEnvelope;
const sliceManifest = sliceAssetManifestJson as ManifestEnvelope;
const sharedUiRasterAssetKeys = new Set([
  "ui_hover_gold_seal_concept",
  "ui_hover_boss_skull_stamp_concept",
  "ui_hover_route_node_concept",
  "ui_hover_choice_badge_concept",
  "ui_hover_action_seal_concept",
  "ui_down_pressed_stamp_concept",
  "ui_disabled_lock_stamp_concept",
  "ui_hover_world_map_play_button_concept",
  "ui_down_world_map_play_button_concept",
  "ui_current_stage_marker_concept",
  "ui_current_stage_halo_concept",
  "ui_current_stage_status_badge_concept",
  "combat_raster_underlay_concept",
  "boss_raster_underlay_concept",
  "reward_raster_underlay_concept",
  "event_raster_underlay_concept",
  "town_raster_underlay_concept",
  "world_map_raster_underlay_concept",
  "dungeon_raster_underlay_concept",
  "rune_bench_raster_underlay_concept",
  "result_raster_underlay_concept",
  "settings_raster_underlay_concept"
]);
const sharedUiRasterAssets = sliceManifest.assets.filter((asset) => sharedUiRasterAssetKeys.has(asset.key));

export function buildReleaseCatalogBundle(): GameDataBundle {
  const cards = (cardsJson as RawCard[]).map(mapCard);
  const runes = (gemsJson as RawGem[]).map(mapRune);
  const relics = (relicsJson as RawPassive[]).map(mapPassive);
  const arcanas = (arcanasJson as RawPassive[]).map((item, index) => mapArcana(item, index));
  const characters = (charactersJson as RawCharacter[]).map(mapCharacter);
  const rawEnemies = enemiesJson as RawEnemy[];
  const enemies = rawEnemies
    .filter((item) => item.rank !== "boss")
    .map(mapEnemy);
  const bosses = rawEnemies
    .filter((item) => item.rank === "boss")
    .map(mapBoss);
  const events = (eventsJson as RawEvent[]).map(mapEvent);
  const stages = (stagesJson as RawStage[]).map(mapStage);
  const encounterPools = buildEncounterPools(stagesJson as RawStage[], events);
  const rewardPools = buildRewardPools(cards, runes, relics, arcanas);

  return {
    cards,
    runes,
    relics,
    arcanas,
    characters,
    stages,
    encounterPools,
    enemies,
    bosses,
    events,
    rewardPools,
    unlocks: [],
    evolutions: [],
    powerUps: [],
    assets: [
      ...manifest.assets,
      ...sharedUiRasterAssets
    ]
  };
}

function mapCard(raw: RawCard, index: number): CardData {
  const type = normalizeCardType(raw.type);
  return {
    id: raw.id,
    displayNameKo: raw.name,
    descriptionKo: raw.text ?? raw.name,
    tags: raw.tags ?? [],
    referenceRole: "release_catalog_card_adapter",
    evidence: adaptedEvidence("Full card row adapted for runtime loading; not release-approved."),
    type,
    cost: raw.cost,
    rarity: normalizeCardRarity(raw.rarity),
    colorKey: raw.color,
    effects: mapEffects(raw.effects ?? []),
    runeSlots: buildRuneSlots(raw, type),
    upgrade: raw.upgrade?.effects ? {
      effectChanges: mapEffects(raw.upgrade.effects)
    } : undefined,
    assetKeys: {
      frame: frameKeyForCardType(type),
      illustration: releaseAssetKey("card_art", raw.id, "card"),
      typeIcon: typeIconKeyForCardType(type)
    },
    balance: {
      role: raw.tags?.join(",") || type,
      powerBand: raw.rarity === "basic" ? "starter" : "early",
      lockState: "draft"
    }
  };
}

function mapRune(raw: RawGem): RuneData {
  const socketType = normalizeSocketType(raw.socketTypes?.[0]);
  return {
    id: raw.id,
    displayNameKo: raw.name,
    descriptionKo: raw.text ?? raw.name,
    tags: raw.socketTypes ?? [],
    referenceRole: "release_catalog_rune_adapter",
    evidence: adaptedEvidence("Full gem row adapted as runtime rune data; behavior is not release-complete."),
    socketType,
    rarity: normalizePassiveRarity(raw.rarity),
    effects: mapEffects(raw.effects ?? []),
    validCardTypes: validCardTypesForSocket(socketType),
    assetKeys: {
      icon: releaseAssetKey("gem_icon", raw.id, "gem")
    },
    recommendation: {
      bestRoles: raw.socketTypes ?? [socketType]
    }
  };
}

function mapPassive(raw: RawPassive): RelicData {
  return {
    id: raw.id,
    displayNameKo: raw.name,
    descriptionKo: raw.text ?? raw.name,
    tags: [],
    referenceRole: "release_catalog_relic_adapter",
    evidence: adaptedEvidence("Full relic row adapted for runtime data presence; effects are not release-complete."),
    rarity: normalizePassiveRarity(raw.rarity),
    effects: mapEffects(raw.effects ?? []),
    assetKeys: {
      icon: releaseAssetKey("relic_icon", raw.id, "relic")
    }
  };
}

function mapArcana(raw: RawPassive, index: number): ArcanaData {
  const slotTypes: ArcanaData["slotType"][] = ["run_start", "event_reward", "boss_reward"];
  return {
    id: raw.id,
    displayNameKo: raw.name,
    descriptionKo: raw.text ?? raw.name,
    tags: [],
    referenceRole: "release_catalog_arcana_adapter",
    evidence: adaptedEvidence("Full arcana row adapted for runtime data presence; system behavior is not release-complete."),
    rarity: normalizePassiveRarity(raw.rarity),
    effects: mapEffects(raw.effects ?? []),
    slotType: slotTypes[index % slotTypes.length],
    assetKeys: {
      icon: releaseAssetKey("arcana_icon", raw.id, "arcana")
    }
  };
}

function mapCharacter(raw: RawCharacter): CharacterData {
  return {
    id: raw.id,
    displayNameKo: raw.name,
    descriptionKo: raw.passiveText ?? raw.role ?? raw.name,
    tags: [raw.role, raw.color].filter(Boolean) as string[],
    referenceRole: "release_catalog_character_adapter",
    evidence: adaptedEvidence("Full character row adapted for runtime loading; portraits and passives are not release-complete."),
    maxHp: raw.maxHp,
    startingEnergy: raw.energy,
    startingDeck: raw.starterDeck ?? [],
    passives: mapEffects(raw.passiveEffects ?? []),
    assetKeys: {
      portrait: releaseAssetKey("char_portrait", raw.id, "char"),
      sprite: releaseAssetKey("char_sprite", raw.id, "char")
    }
  };
}

function mapStage(raw: RawStage): GameDataBundle["stages"][number] {
  return {
    id: raw.id,
    displayNameKo: raw.name,
    descriptionKo: raw.biome ?? raw.name,
    tags: [raw.biome].filter(Boolean) as string[],
    referenceRole: "release_catalog_stage_adapter",
    evidence: adaptedEvidence("Full stage row adapted into current route schema; pacing is not release-complete."),
    order: raw.order,
    biomeKey: raw.biome ?? raw.id,
    route: mapRooms(raw),
    bossId: raw.bossEnemyId,
    rewardPools: ["reward_pool_release_cards", "reward_pool_release_relics", "reward_pool_release_stage_clear"],
    assetKeys: {
      backgroundSet: releaseAssetKey("stage_bg", raw.id, "stage"),
      mapIcon: releaseAssetKey("stage_map_icon", raw.id, "stage")
    }
  };
}

function mapRooms(stage: RawStage): RoomSlot[] {
  const rooms = stage.rooms && stage.rooms.length > 0
    ? stage.rooms
    : ["combat", "combat", "event", "elite", "reward", "rest", "boss"];

  return rooms.map((rawType, index) => {
    const type = normalizeRoomType(rawType);
    const room: RoomSlot = {
      id: `${stage.id}_room_${index + 1}_${type}`,
      type
    };

    if (type === "combat") {
      room.encounterPoolId = `${stage.id}_combat_pool`;
      room.rewardPoolId = "reward_pool_release_cards";
      room.requiredClear = true;
    } else if (type === "elite") {
      room.encounterPoolId = `${stage.id}_elite_pool`;
      room.rewardPoolId = "reward_pool_release_relics";
      room.requiredClear = true;
    } else if (type === "event") {
      room.encounterPoolId = `${stage.id}_event_pool`;
      room.rewardPoolId = "reward_pool_release_cards";
    } else if (type === "reward") {
      room.rewardPoolId = "reward_pool_release_cards";
    } else if (type === "boss") {
      room.encounterPoolId = `${stage.id}_boss_pool`;
      room.rewardPoolId = "reward_pool_release_stage_clear";
      room.requiredClear = true;
    }

    return room;
  });
}

function buildEncounterPools(rawStages: RawStage[], events: GameDataBundle["events"]): EncounterPoolData[] {
  return rawStages.flatMap((stage) => {
    return [
      makeEncounterPool(
        `${stage.id}_combat_pool`,
        "combat",
        `${stage.name} combat pool`,
        stage.enemyPool ?? []
      ),
      makeEncounterPool(
        `${stage.id}_elite_pool`,
        "elite",
        `${stage.name} elite pool`,
        stage.elitePool ?? []
      ),
      makeEncounterPool(
        `${stage.id}_event_pool`,
        "event",
        `${stage.name} event pool`,
        eventIdsForStage(stage, events)
      ),
      makeEncounterPool(
        `${stage.id}_boss_pool`,
        "boss",
        `${stage.name} boss pool`,
        [stage.bossEnemyId]
      )
    ];
  });
}

function eventIdsForStage(stage: RawStage, events: GameDataBundle["events"]): ContentId[] {
  const eventIds = events.map((event) => event.id);
  if (eventIds.length === 0) return [];
  const start = Math.max(0, stage.order - 1) % eventIds.length;
  return Array.from({ length: Math.min(4, eventIds.length) }, (_, index) => eventIds[(start + index) % eventIds.length]);
}

function makeEncounterPool(
  id: ContentId,
  type: EncounterPoolData["type"],
  displayNameKo: string,
  contentIds: ContentId[]
): EncounterPoolData {
  return {
    id,
    displayNameKo,
    descriptionKo: `${type} entries adapted from release catalog`,
    tags: [type],
    referenceRole: "release_catalog_encounter_pool_adapter",
    evidence: adaptedEvidence("Encounter pool adapted from full stage catalog; weights are provisional."),
    type,
    entries: contentIds.map((contentId) => ({ contentId, weight: 1 })),
    rules: [
      {
        id: `${id}_rule`,
        descriptionKo: "First runtime bridge rule; not final encounter pacing."
      }
    ]
  };
}

function mapEnemy(raw: RawEnemy): EnemyData {
  const intents = (raw.intents ?? []).map((intent, intentIndex) => mapIntent(raw.id, intent, intentIndex));
  return {
    id: raw.id,
    displayNameKo: raw.name,
    descriptionKo: raw.family ?? raw.name,
    tags: [raw.rank, raw.family].filter(Boolean) as string[],
    referenceRole: "release_catalog_enemy_adapter",
    evidence: adaptedEvidence("Full enemy row adapted for runtime combat; intent variety is not release-complete."),
    role: inferEnemyRole(raw.intents ?? []),
    maxHp: raw.maxHp,
    block: raw.block ?? 0,
    intents,
    assetKeys: {
      sprite: releaseAssetKey("enemy_sprite", raw.id, "enemy"),
      intentIcons: intents.map((intent) => iconForIntentId(intent.id))
    }
  };
}

function mapBoss(raw: RawEnemy): BossData {
  const intents = (raw.intents ?? []).map((intent, intentIndex) => mapIntent(raw.id, intent, intentIndex));
  return {
    id: raw.id,
    displayNameKo: raw.name,
    descriptionKo: raw.family ?? raw.name,
    tags: [raw.rank, raw.family].filter(Boolean) as string[],
    referenceRole: "release_catalog_boss_adapter",
    evidence: adaptedEvidence("Full boss row adapted for runtime combat; phase behavior is provisional."),
    role: inferEnemyRole(raw.intents ?? []),
    maxHp: raw.maxHp,
    block: raw.block ?? 0,
    intents,
    assetKeys: {
      sprite: releaseAssetKey("boss_sprite", raw.id, "boss"),
      intentIcons: intents.map((intent) => iconForIntentId(intent.id))
    },
    phases: mapBossPhases(raw)
  };
}

function mapBossPhases(raw: RawEnemy): BossPhase[] {
  const rules = raw.phaseRules && raw.phaseRules.length > 0
    ? raw.phaseRules
    : [{ hpBelowRatio: 0.5, addIntent: { type: "attack", amount: 4, label: "phase" } }];

  return rules.map((rule, index) => ({
    id: `${raw.id}_phase_${index + 1}`,
    hpRatioAtOrBelow: rule.hpBelowRatio ?? 0.5,
    displayNameKo: `${raw.name} phase ${index + 1}`,
    effects: [
      {
        op: "boss_next_attack_bonus",
        timing: "combat_start",
        value: {
          amount: rule.addIntent?.amount ?? 4
        },
        previewKo: rule.addIntent?.label
      }
    ],
    visualCueKey: "effect_stage_spotlight"
  }));
}

function mapIntent(enemyId: ContentId, raw: RawIntent, index: number): EnemyIntent {
  const amount = raw.amount ?? (raw.type === "attack" ? 5 : 1);
  return {
    id: `${enemyId}_intent_${index + 1}_${raw.type}${raw.effect ? `_${raw.effect}` : ""}`,
    displayNameKo: raw.label ?? raw.type,
    telegraphKo: raw.label ?? raw.type,
    effects: effectsForIntent(raw, amount),
    weight: 1
  };
}

function mapEvent(raw: RawEvent): GameDataBundle["events"][number] {
  return {
    id: raw.id,
    displayNameKo: raw.name,
    descriptionKo: raw.text ?? raw.type ?? raw.name,
    tags: [raw.type].filter(Boolean) as string[],
    referenceRole: "release_catalog_event_adapter",
    evidence: adaptedEvidence("Full event row adapted for runtime data presence; choices are not release-complete."),
    choices: (raw.choices ?? []).map((choice, index) => mapEventChoice(raw.id, choice, index)),
    assetKeys: {
      scene: releaseAssetKey("event_scene", raw.id, "event")
    }
  };
}

function mapEventChoice(eventId: ContentId, raw: RawEventChoice, index: number): GameDataBundle["events"][number]["choices"][number] {
  const rewards = mapChoiceRewards(`${eventId}_choice_${index + 1}`, raw.reward);
  return {
    id: `${eventId}_choice_${index + 1}`,
    displayNameKo: raw.label ?? `choice ${index + 1}`,
    descriptionKo: raw.label ?? `choice ${index + 1}`,
    cost: mapChoiceCost(raw.cost),
    rewards,
    eventCombatEnemyId: typeof raw.reward?.combat === "string" ? raw.reward.combat : undefined,
    nextRoomOverride: typeof raw.reward?.combat === "string" ? "combat" : undefined
  };
}

function mapChoiceCost(cost: Record<string, unknown> | undefined): GameEffect[] | undefined {
  if (!cost) return undefined;
  const effects: GameEffect[] = [];
  if (typeof cost.gold === "number") {
    effects.push({
      op: "spend_currency",
      timing: "room_enter",
      value: { amount: cost.gold }
    });
  }
  if (typeof cost.hp === "number") {
    effects.push({
      op: "spend_hp",
      timing: "room_enter",
      value: { amount: cost.hp }
    });
  }
  return effects.length > 0 ? effects : undefined;
}

function mapChoiceRewards(prefix: string, reward: Record<string, unknown> | undefined): RewardEntry[] | undefined {
  if (!reward) return undefined;
  const entries: RewardEntry[] = [];
  addContentPoolRewards(entries, prefix, "card", reward.cardPool);
  addContentPoolRewards(entries, prefix, "rune", reward.gemPool);
  addContentPoolRewards(entries, prefix, "relic", reward.relicPool ?? reward.relic);
  addContentPoolRewards(entries, prefix, "arcana", reward.arcanaPool ?? reward.arcana);
  if (typeof reward.gold === "number") {
    entries.push({
      id: `${prefix}_currency_${entries.length + 1}`,
      type: "currency",
      amount: reward.gold
    });
  }
  if (typeof reward.heal === "number") {
    entries.push({
      id: `${prefix}_heal_${entries.length + 1}`,
      type: "heal",
      amount: reward.heal
    });
  }
  return entries.length > 0 ? entries : undefined;
}

function addContentPoolRewards(
  entries: RewardEntry[],
  prefix: string,
  type: RewardEntry["type"],
  value: unknown
): void {
  const ids = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
  ids.forEach((contentId, index) => {
    if (typeof contentId !== "string") return;
    entries.push({
      id: `${prefix}_${type}_${index + 1}`,
      type,
      contentId,
      weight: 1
    });
  });
}

function buildRewardPools(
  cards: CardData[],
  runes: RuneData[],
  relics: RelicData[],
  arcanas: ArcanaData[]
): RewardPoolData[] {
  return [
    {
      id: "reward_pool_release_cards",
      displayNameKo: "출시 카드 보상",
      entries: cards.map((card, index) => ({
        id: `reward_release_card_${index + 1}`,
        type: "card",
        contentId: card.id,
        weight: 1
      })),
      rules: [
        {
          id: "release_card_rewards_rule",
          descriptionKo: "Full card catalog reward pool; curation and balance are not complete."
        }
      ]
    },
    {
      id: "reward_pool_release_runes",
      displayNameKo: "출시 룬 보상",
      entries: runes.map((rune, index) => ({
        id: `reward_release_rune_${index + 1}`,
        type: "rune",
        contentId: rune.id,
        weight: 1
      })),
      rules: [
        {
          id: "release_rune_rewards_rule",
          descriptionKo: "Full gem catalog adapted as runes; curation and balance are not complete."
        }
      ]
    },
    {
      id: "reward_pool_release_relics",
      displayNameKo: "출시 유물 보상",
      entries: relics.map((relic, index) => ({
        id: `reward_release_relic_${index + 1}`,
        type: "relic",
        contentId: relic.id,
        weight: 1
      })),
      rules: [
        {
          id: "release_relic_rewards_rule",
          descriptionKo: "Full relic catalog reward pool; curation and effects are not complete."
        }
      ]
    },
    {
      id: "reward_pool_release_stage_clear",
      displayNameKo: "스테이지 클리어 보상",
      entries: [
        ...relics.slice(0, 8).map((relic, index) => ({
          id: `reward_release_stage_relic_${index + 1}`,
          type: "relic" as const,
          contentId: relic.id,
          weight: 1
        })),
        ...arcanas.slice(0, 4).map((arcana, index) => ({
          id: `reward_release_stage_arcana_${index + 1}`,
          type: "arcana" as const,
          contentId: arcana.id,
          weight: 1
        }))
      ],
      rules: [
        {
          id: "release_stage_clear_rewards_rule",
          descriptionKo: "Stage clear reward bridge; final unlock flow is not complete."
        }
      ]
    }
  ];
}

function mapEffects(rawEffects: RawEffect[]): GameEffect[] {
  return rawEffects.map((effect) => ({
    op: normalizeEffectOp(effect.op),
    timing: timingForEffect(effect.op),
    value: {
      amount: effect.amount,
      percent: effect.ratio ?? percentFromEffect(effect),
      duration: effect.threshold ?? effect.hits ?? effect.cost,
      minCost: effect.minCost,
      target: targetForEffect(effect.op)
    },
    condition: conditionForEffect(effect),
    previewKo: effect.op
  }));
}

function buildRuneSlots(raw: RawCard, type: CardType): CardData["runeSlots"] {
  const count = Math.max(0, raw.sockets?.base ?? 0);
  const socketType = type === "attack" || type === "defense" || type === "skill" ? type : "any";
  return Array.from({ length: count }, () => ({
    socketType,
    unlockedByDefault: true
  }));
}

function normalizeEffectOp(op: string): string {
  if (op === "damage_bonus_if_cards_played_at_least") return "damage_bonus_if_cards_played_at_least";
  if (op === "damage_bonus_if_chain_at_least") return "damage_bonus_if_chain_at_least";
  if (op === "reduce_next_attack") return "reduce_next_attack";
  return op;
}

function timingForEffect(op: string): GameEffect["timing"] {
  if (op.includes("battle_start") || op.includes("combat_start")) return "combat_start";
  if (op.includes("turn_start")) return "turn_start";
  if (op.includes("turn_end")) return "turn_end";
  if (op.includes("reward")) return "reward_offer";
  if (op.includes("run_start")) return "run_start";
  if (op.includes("run_end")) return "run_end";
  return "on_play";
}

function targetForEffect(op: string): GameEffect["value"]["target"] | undefined {
  if (op.includes("front")) return "front_enemy";
  if (op.includes("all")) return "all_enemies";
  if (op.includes("random")) return "random_enemy";
  if (op.includes("shield") || op.includes("heal")) return "self";
  return undefined;
}

function percentFromEffect(effect: RawEffect): number | undefined {
  if (effect.op.includes("percent") && typeof effect.amount === "number") return effect.amount;
  return undefined;
}

function conditionForEffect(effect: RawEffect): string | undefined {
  if (effect.op === "add_battle_rule" && effect.rule) {
    return [effect.rule, effect.color].filter(Boolean).join(":");
  }
  if (typeof effect.threshold !== "number") return undefined;
  if (effect.op.includes("cards_played")) return `cards_played >= ${effect.threshold}`;
  if (effect.op.includes("chain")) return `chain_count >= ${effect.threshold}`;
  return undefined;
}

function normalizeCardType(type: string): CardType {
  if (type === "attack") return "attack";
  if (type === "guard" || type === "defense") return "defense";
  if (type === "curse" || type === "event" || type === "special") return type;
  return "skill";
}

function normalizeSocketType(type: string | undefined): RuneData["socketType"] {
  if (type === "attack" || type === "skill" || type === "any") return type;
  if (type === "guard" || type === "defense") return "defense";
  return "any";
}

function validCardTypesForSocket(socketType: RuneData["socketType"]): CardType[] {
  if (socketType === "any") return ["attack", "defense", "skill"];
  return [socketType];
}

function normalizeCardRarity(rarity: string): Rarity {
  if (rarity === "basic") return "starter";
  if (rarity === "rare" || rarity === "epic" || rarity === "legendary") return rarity;
  return "common";
}

function normalizePassiveRarity(rarity: string): Exclude<Rarity, "starter"> {
  if (rarity === "rare" || rarity === "epic" || rarity === "legendary") return rarity;
  return "common";
}

function releaseAssetKey(prefix: string, id: string, sourcePrefix: string): string {
  const trimmed = id.startsWith(`${sourcePrefix}_`) ? id.slice(sourcePrefix.length + 1) : id;
  return `${prefix}_${trimmed}`.replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_");
}

function frameKeyForCardType(type: CardType): string {
  if (type === "attack") return "card_frame_attack";
  if (type === "defense") return "card_frame_defense";
  return "card_frame_skill";
}

function typeIconKeyForCardType(type: CardType): string {
  if (type === "attack") return "icon_card_attack";
  if (type === "defense") return "icon_card_defense";
  return "icon_card_skill";
}

function normalizeRoomType(type: string): RoomType {
  if (
    type === "combat"
    || type === "elite"
    || type === "event"
    || type === "shop"
    || type === "rest"
    || type === "reward"
    || type === "boss"
  ) {
    return type;
  }
  return "combat";
}

function inferEnemyRole(intents: RawIntent[]): EnemyRole {
  if (intents.some((intent) => intent.type === "debuff")) return "disruptor";
  if (intents.some((intent) => intent.type === "special")) return "hybrid";
  if (intents.some((intent) => intent.type === "guard") && !intents.some((intent) => intent.type === "attack")) {
    return "defender";
  }
  return "attacker";
}

function effectsForIntent(raw: RawIntent, amount: number): GameEffect[] {
  if (raw.type === "attack") return [enemyEffect("deal_damage_to_player", amount, raw.label)];
  if (raw.type === "guard") return [enemyEffect("gain_enemy_block", amount, raw.label)];
  if (raw.type === "debuff") {
    if (raw.status === "mark") return [enemyEffect("apply_player_mark", amount, raw.label)];
    if (raw.status === "weak") return [enemyEffect("apply_player_weak", amount, raw.label)];
    return [enemyEffect("increase_next_card_cost", amount, raw.label)];
  }

  if (raw.effect === "add_temp_card") {
    return [enemyEffect("add_temp_card_to_discard", amount, raw.label, raw.cardId ?? "card_temp_dust")];
  }
  if (raw.effect === "reduce_energy") return [enemyEffect("increase_next_card_cost", amount, raw.label)];
  if (raw.effect === "fortify_all") return [enemyEffect("gain_enemy_block", amount, raw.label)];
  if (raw.effect === "heal_self") return [enemyEffect("heal_enemy", amount, raw.label)];
  if (raw.effect === "pierce_attack") return [enemyEffect("deal_piercing_damage_to_player", amount, raw.label)];
  if (raw.effect === "chain_down") {
    const effects = [enemyEffect("reduce_player_chain", amount, raw.label)];
    if (raw.costIncrease) effects.push(enemyEffect("increase_next_card_cost", raw.costIncrease, raw.label));
    return effects;
  }
  if (raw.effect === "summon") {
    return [enemyEffect("summon_enemy", amount, raw.label, raw.enemyId)];
  }

  return [enemyEffect("increase_next_card_cost", amount, raw.label)];
}

function enemyEffect(op: string, amount: number, label: string | undefined, condition?: string): GameEffect {
  return {
    op,
    timing: "turn_end",
    value: { amount },
    condition,
    previewKo: label
  };
}

function iconForIntentId(intentId: string): string {
  if (intentId.includes("attack")) return "icon_intent_attack";
  if (intentId.includes("guard")) return "icon_intent_block";
  return "icon_intent_disrupt";
}

function adaptedEvidence(notes: string): { level: "source_level"; sources: string[]; notes: string } {
  return {
    level: "source_level",
    sources: ["src/data/ko"],
    notes
  };
}
