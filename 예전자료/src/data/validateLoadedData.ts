import type { AssetKey, BaseContent, GameDataBundle } from "./schema";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  counts: Record<string, number>;
}

const CONTENT_GROUPS = [
  "cards",
  "runes",
  "relics",
  "arcanas",
  "characters",
  "stages",
  "encounterPools",
  "enemies",
  "bosses",
  "events",
  "rewardPools",
  "unlocks",
  "evolutions",
  "powerUps",
  "assets"
] as const;

export function validateLoadedData(bundle: GameDataBundle): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const counts: Record<string, number> = {};

  for (const group of CONTENT_GROUPS) {
    const value = bundle[group];
    if (!Array.isArray(value)) {
      errors.push(`${group} must be an array`);
      counts[group] = 0;
      continue;
    }

    counts[group] = value.length;
  }

  const assetKeys = new Set(bundle.assets.map((asset) => asset.key));
  const seenAssetKeys = new Set<string>();
  for (const asset of bundle.assets) {
    if (seenAssetKeys.has(asset.key)) {
      errors.push(`Duplicate asset key: ${asset.key}`);
    }
    seenAssetKeys.add(asset.key);

    if (!asset.path.startsWith("assets/runtime/")) {
      errors.push(`Asset path must stay under assets/runtime/: ${asset.key}`);
    }
  }

  validateContent("cards", bundle.cards, errors);
  validateContent("runes", bundle.runes, errors);
  validateContent("characters", bundle.characters, errors);
  validateContent("stages", bundle.stages, errors);
  validateContent("encounterPools", bundle.encounterPools, errors);
  validateContent("enemies", bundle.enemies, errors);
  validateContent("bosses", bundle.bosses, errors);
  validateContent("events", bundle.events, errors);
  validateContent("unlocks", bundle.unlocks, errors);

  const referencedAssetKeys = collectAssetKeys(bundle);
  for (const key of referencedAssetKeys) {
    if (!assetKeys.has(key)) {
      errors.push(`Missing asset manifest key: ${key}`);
    }
  }

  if (bundle.assets.length > 0) {
    warnings.push("asset manifest uses generated development placeholders until final art is approved");
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    counts
  };
}

function validateContent(group: string, items: BaseContent[], errors: string[]): void {
  const seenIds = new Set<string>();

  for (const item of items) {
    if (!item.id) {
      errors.push(`${group} item is missing id`);
    }
    if (seenIds.has(item.id)) {
      errors.push(`${group} has duplicate id: ${item.id}`);
    }
    seenIds.add(item.id);

    if (!item.displayNameKo || !item.descriptionKo) {
      errors.push(`${group}:${item.id} is missing Korean display text`);
    }
    if (!item.referenceRole) {
      errors.push(`${group}:${item.id} is missing referenceRole`);
    }
    if (!item.evidence?.level) {
      errors.push(`${group}:${item.id} is missing evidence level`);
    }
  }
}

function collectAssetKeys(bundle: GameDataBundle): AssetKey[] {
  const keys: AssetKey[] = [];
  const visit = (value: unknown): void => {
    if (typeof value === "string") {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== "object") {
      return;
    }

    const objectValue = value as Record<string, unknown>;
    for (const [key, nestedValue] of Object.entries(objectValue)) {
      if (key === "assetKeys" && nestedValue && typeof nestedValue === "object") {
        Object.values(nestedValue as Record<string, unknown>).forEach((assetValue) => {
          if (typeof assetValue === "string") {
            keys.push(assetValue);
          } else if (Array.isArray(assetValue)) {
            assetValue.forEach((entry) => {
              if (typeof entry === "string") {
                keys.push(entry);
              }
            });
          }
        });
        continue;
      }
      if (key === "visualCueKey" && typeof nestedValue === "string") {
        keys.push(nestedValue);
        continue;
      }
      visit(nestedValue);
    }
  };

  visit(bundle);
  return keys;
}
