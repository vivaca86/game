import type { GameDataBundle, SaveData } from "../data/schema";

export function createInitialSave(bundle: GameDataBundle): SaveData {
  const character = bundle.characters[0];
  const stage = bundle.stages[0];

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
      characterId: character.id,
      stageId: stage.id,
      roomIndex: 0,
      deck: character.startingDeck,
      hand: character.startingDeck.slice(0, 5),
      discard: [],
      equippedRunes: {},
      relics: [],
      arcanas: [],
      hp: character.maxHp,
      maxHp: character.maxHp,
      currency: 0
    } : undefined,
    settings: {
      language: "ko",
      volumeMaster: 0.8,
      volumeMusic: 0.6,
      volumeSfx: 0.8
    }
  };
}
