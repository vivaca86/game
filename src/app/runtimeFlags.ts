import type { EntryKey } from "../debug/debugEntry";

export interface RuntimeFlags {
  debug: boolean;
  entry: EntryKey;
  stageId?: string;
  roomId?: string;
  enemyId?: string;
  bossId?: string;
  seed: string;
  deckPreset: string;
  grantCardIds: string[];
  grantRuneIds: string[];
  grantRelicIds: string[];
  rewardPoolId?: string;
  resetSave: boolean;
  showLog: boolean;
}

let activeRuntimeFlags: RuntimeFlags | undefined;

export function parseRuntimeFlags(href: string): RuntimeFlags {
  const url = new URL(href);
  const params = url.searchParams;
  const debug = params.get("debug") === "1" || params.get("debug") === "true";
  const entry = normalizeEntry(params.get("entry"), debug);

  return {
    debug,
    entry,
    stageId: optionalParam(params, "stage"),
    roomId: optionalParam(params, "room"),
    enemyId: optionalParam(params, "enemy"),
    bossId: optionalParam(params, "boss"),
    seed: params.get("seed") || "dev-001",
    deckPreset: params.get("deck") || "starter",
    grantCardIds: params.getAll("grantCard"),
    grantRuneIds: params.getAll("grantRune"),
    grantRelicIds: params.getAll("grantRelic"),
    rewardPoolId: optionalParam(params, "rewardPool"),
    resetSave: params.get("resetSave") === "1",
    showLog: params.get("showLog") === "1"
  };
}

export function setRuntimeFlags(flags: RuntimeFlags): void {
  activeRuntimeFlags = flags;
}

export function getRuntimeFlags(): RuntimeFlags {
  if (!activeRuntimeFlags) {
    activeRuntimeFlags = parseRuntimeFlags(window.location.href);
  }

  return activeRuntimeFlags;
}

function normalizeEntry(value: string | null, debug: boolean): EntryKey {
  const allowed: EntryKey[] = [
    "town",
    "world_map",
    "dungeon",
    "combat",
    "reward",
    "rune_bench",
    "boss",
    "result"
  ];

  if (value && allowed.includes(value as EntryKey)) {
    return value as EntryKey;
  }

  return debug ? "town" : "town";
}

function optionalParam(params: URLSearchParams, key: string): string | undefined {
  return params.get(key) || undefined;
}
