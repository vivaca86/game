import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_TITLE, GAME_WIDTH } from '../data/constants';

export class MainScene extends Phaser.Scene {
  public constructor() {
    super('MainScene');
  }

  public create(): void {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_TITLE, {
        color: '#ffffff',
        fontSize: '48px'
      })
      .setOrigin(0.5);

    this.cameras.main.setBackgroundColor('#1d1f27');
  }
}
