import { createRng, shuffle } from "./random.js";

export function createNewRun(index, options = {}) {
  const character = index.characters.get(options.characterId) || index.data.characters[0];
  const stage = index.stages.get(options.stageId) || index.data.stages[0];
  const rng = createRng(options.seed || Date.now());
  const startingDeck = [...character.starterDeck];
  const state = {
    seed: options.seed || Date.now(),
    rng,
    phase: "ready",
    turn: 1,
    roomIndex: 0,
    currentRoomType: null,
    characterId: character.id,
    stageId: stage.id,
    player: {
      hp: character.maxHp,
      maxHp: character.maxHp,
      energy: character.energy,
      maxEnergy: character.energy,
      shield: 0,
      gold: 0
    },
    deck: startingDeck,
    drawPile: shuffle(startingDeck, rng),
    discardPile: [],
    exhaustPile: [],
    hand: [],
    enemies: [],
    inventory: {
      gems: [],
      relics: [],
      arcanas: [],
      unlockedCards: [...new Set(startingDeck)],
      unlockedCharacters: [character.id],
      unlockedStages: [stage.id],
      achievements: []
    },
    upgradedCards: [],
    battleRules: [],
    status: {},
    metrics: {
      cardsPlayedThisTurn: 0,
      cardsPlayedThisCombat: 0,
      maxChain: 0,
      enemiesDefeated: 0,
      elitesDefeated: 0,
      roomsCleared: 0
    },
    pendingReward: null,
    pendingEvent: null,
    log: []
  };
  drawCards(state, 5);
  return state;
}

export function drawCards(state, count) {
  for (let index = 0; index < count; index += 1) {
    if (state.drawPile.length === 0) {
      if (state.discardPile.length === 0) return;
      state.drawPile = shuffle(state.discardPile, state.rng);
      state.discardPile = [];
    }
    const cardId = state.drawPile.shift();
    if (cardId) state.hand.push(cardId);
  }
}

export function discardHand(state) {
  state.discardPile.push(...state.hand);
  state.hand = [];
}

export function addLog(state, message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 8);
}

export function addToDeck(state, cardId) {
  state.deck.push(cardId);
  state.discardPile.push(cardId);
  if (!state.inventory.unlockedCards.includes(cardId)) state.inventory.unlockedCards.push(cardId);
}
