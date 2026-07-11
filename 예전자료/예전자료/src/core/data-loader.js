export const dataFiles = {
  targets: "src/data/ko/content-targets.json",
  strings: "src/data/ko/strings.json",
  cards: "src/data/ko/cards.json",
  gems: "src/data/ko/gems.json",
  relics: "src/data/ko/relics.json",
  arcanas: "src/data/ko/arcanas.json",
  characters: "src/data/ko/characters.json",
  enemies: "src/data/ko/enemies.json",
  stages: "src/data/ko/stages.json",
  events: "src/data/ko/events.json",
  metaUpgrades: "src/data/ko/meta-upgrades.json",
  achievements: "src/data/ko/achievements.json"
};

export async function loadGameData({ fetcher = fetch, basePath = "" } = {}) {
  const entries = await Promise.all(
    Object.entries(dataFiles).map(async ([key, relativePath]) => {
      const response = await fetcher(`${basePath}${relativePath}`);
      if (!response.ok) throw new Error(`${relativePath} 로딩 실패`);
      return [key, await response.json()];
    })
  );
  const data = Object.fromEntries(entries);
  const index = createGameIndex(data);
  assertRuntimeData(data, index);
  return { data, index };
}

export function createGameIndex(data) {
  return {
    data,
    cards: mapById(data.cards),
    gems: mapById(data.gems),
    relics: mapById(data.relics),
    arcanas: mapById(data.arcanas),
    characters: mapById(data.characters),
    enemies: mapById(data.enemies),
    stages: mapById(data.stages),
    events: mapById(data.events),
    metaUpgrades: mapById(data.metaUpgrades),
    achievements: mapById(data.achievements)
  };
}

export function assertRuntimeData(data, index) {
  const targets = data.targets.targets;
  const exactCounts = {
    cards: data.cards.length,
    gems: data.gems.length,
    characters: data.characters.length,
    stages: data.stages.length,
    relics: data.relics.length,
    arcanas: data.arcanas.length,
    events: data.events.length,
    achievements: data.achievements.length
  };
  Object.entries(exactCounts).forEach(([key, count]) => {
    if (targets[key] !== count) {
      throw new Error(`${key} 수량 불일치: ${count}/${targets[key]}`);
    }
  });

  data.characters.forEach((character) => {
    character.starterDeck.forEach((cardId) => requireId(index.cards, cardId, `${character.name} 시작 덱`));
  });
  data.stages.forEach((stage) => {
    stage.enemyPool.forEach((enemyId) => requireId(index.enemies, enemyId, `${stage.name} 일반 몬스터`));
    stage.elitePool.forEach((enemyId) => requireId(index.enemies, enemyId, `${stage.name} 정예 몬스터`));
    requireId(index.enemies, stage.bossEnemyId, `${stage.name} 보스`);
  });
}

function mapById(rows) {
  return new Map(rows.map((row) => [row.id, row]));
}

function requireId(map, id, label) {
  if (!map.has(id)) throw new Error(`${label}: ${id} 참조가 없습니다.`);
}
