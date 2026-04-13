import type { RunReport } from '../core/gameState';

export type MetaBonus = 'seed_funding' | 'team_training' | 'marketing_push';

export interface MetaProgress {
  points: number;
  totalRuns: number;
}

const META_KEY = 'studio-balance-meta-v1';

const defaultMeta: MetaProgress = {
  points: 0,
  totalRuns: 0
};

export function loadMetaProgress(): MetaProgress {
  const raw = localStorage.getItem(META_KEY);
  if (!raw) {
    return { ...defaultMeta };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<MetaProgress>;
    if (typeof parsed.points === 'number' && typeof parsed.totalRuns === 'number') {
      return { points: parsed.points, totalRuns: parsed.totalRuns };
    }
  } catch {
    localStorage.removeItem(META_KEY);
  }

  return { ...defaultMeta };
}

export function saveMetaProgress(meta: MetaProgress): void {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

export function awardMetaPoints(meta: MetaProgress, report: RunReport): MetaProgress {
  let gained = 1;
  if (report.tier.includes('중견')) {
    gained += 1;
  }
  if (report.tier.includes('대기업')) {
    gained += 2;
  }
  if (report.tier.includes('글로벌')) {
    gained += 3;
  }

  return {
    points: meta.points + gained,
    totalRuns: meta.totalRuns + 1
  };
}
