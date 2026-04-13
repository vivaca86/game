import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../data/constants';
import { MainScene } from '../ui/MainScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scene: [MainScene],
  backgroundColor: '#1d1f27'
};
