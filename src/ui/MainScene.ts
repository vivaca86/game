import Phaser from 'phaser';
import { initialGameState, type GameState, type Phase } from '../core/gameState';
import { getEventForTurn } from '../data/events';
import { resolveTurn } from '../systems/turnResolver';

function phaseLabel(phase: Phase): string {
  return phase === 'development' ? '개발 단계' : '라이브 운영 단계';
}

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

    const left = 32;
    let y = 20;

    this.addLine(`Turn ${this.state.turn} / ${this.state.maxTurns}`, left, y, '#ffd166', 26);
    y += 36;
    this.addLine(`Phase: ${phaseLabel(this.state.phase)}`, left, y, '#90e0ef', 22);
    y += 32;

    const { money, morale, reputation, risk } = this.state.resources;
    this.addLine(`💰${money}  🙂${morale}  ⭐${reputation}  ⚠️${risk}`, left, y, '#ffffff', 22);
    y += 32;

    const { progress, quality, stability, hype } = this.state.product;
    this.addLine(`진척 ${progress}%  품질 ${quality}  안정 ${stability}  하이프 ${hype}`, left, y, '#cce3de', 20);
    y += 30;

    if (this.state.phase === 'live') {
      this.addLine(`동접 ${this.state.live.ccu}  턴매출 ${this.state.live.revenue}  누적매출 ${this.state.live.cumulativeRevenue}`, left, y, '#f1fa8c', 20);
      y += 34;
    } else {
      y += 16;
    }

    if (this.state.gameOver) {
      this.addLine(`엔딩: ${this.state.ending ?? '알 수 없음'}`, left, y, '#ef476f', 32);
      y += 48;
      this.addLine('R 키로 재시작', left, y, '#ffffff', 22);

      this.input.keyboard?.once('keydown-R', () => {
        this.state = structuredClone(initialGameState);
        this.renderTurn();
      });
      return;
    }

    const event = getEventForTurn(this.state.turn, this.state.phase);
    this.addLine(event.title, left, y, '#06d6a0', 28);
    y += 38;
    this.addLine(event.description, left, y, '#f1faee', 20);
    y += 44;

    event.choices.forEach((choice) => {
      const button = this.add
        .text(left, y, `- ${choice.label}`, {
          color: '#8ecae6',
          fontSize: '22px'
        })
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.state = resolveTurn(this.state, choice);
          this.renderTurn();
        })
        .on('pointerover', () => button.setColor('#ffffff'))
        .on('pointerout', () => button.setColor('#8ecae6'));

      this.uiGroup.add(button);
      y += 36;
    });
  }

  private addLine(text: string, x: number, y: number, color: string, fontSize: number): void {
    const line = this.add.text(x, y, text, { color, fontSize: `${fontSize}px` });
    this.uiGroup.add(line);
  }
}
