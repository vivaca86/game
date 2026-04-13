import Phaser from 'phaser';
import { gameConfig } from './gameConfig';

let game: Phaser.Game | undefined;

export function bootstrapGame(): Phaser.Game {
  if (!game) {
    game = new Phaser.Game(gameConfig);
  }

  return game;
}
