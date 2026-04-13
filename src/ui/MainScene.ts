import Phaser from 'phaser';
import { initialGameState, type GameState } from '../core/gameState';
import { getEventForTurn } from '../data/events';
import { resolveTurn } from '../systems/turnResolver';

export class MainScene extends Phaser.Scene {
  private state: GameState = structuredClone(initialGameState);
  private uiGroup!: Phaser.GameObjects.Group;

  public constructor() {
    super('MainScene');
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#1d1f27');
    this.uiGroup = this.add.group();
    this.renderTurn();
  }

  private renderTurn(): void {
    this.uiGroup.clear(true, true);

    const left = 40;
    let y = 30;

    this.addLine(`Turn ${this.state.turn} / ${this.state.maxTurns}`, left, y, '#ffd166', 28);
    y += 46;

    const { money, morale, reputation, risk } = this.state.resources;
    this.addLine(`💰 자금 ${money}   🙂 사기 ${morale}   ⭐ 평판 ${reputation}   ⚠️ 리스크 ${risk}`, left, y, '#ffffff', 24);
    y += 52;

    if (this.state.gameOver) {
      this.addLine(`엔딩: ${this.state.ending ?? '알 수 없음'}`, left, y, '#ef476f', 34);
      y += 56;
      this.addLine('R 키로 재시작', left, y, '#ffffff', 24);

      this.input.keyboard?.once('keydown-R', () => {
        this.state = structuredClone(initialGameState);
        this.renderTurn();
      });
      return;
    }

    const event = getEventForTurn(this.state.turn);
    this.addLine(event.title, left, y, '#06d6a0', 30);
    y += 44;
    this.addLine(event.description, left, y, '#f1faee', 22);
    y += 56;

    event.choices.forEach((choice) => {
      const button = this.add
        .text(left, y, `- ${choice.label}`, {
          color: '#8ecae6',
          fontSize: '24px'
        })
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.state = resolveTurn(this.state, choice);
          this.renderTurn();
        })
        .on('pointerover', () => button.setColor('#ffffff'))
        .on('pointerout', () => button.setColor('#8ecae6'));

      this.uiGroup.add(button);
      y += 42;
    });
  }

  private addLine(text: string, x: number, y: number, color: string, fontSize: number): void {
    const line = this.add.text(x, y, text, { color, fontSize: `${fontSize}px` });
    this.uiGroup.add(line);
  }
}
