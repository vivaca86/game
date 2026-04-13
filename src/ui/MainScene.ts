import Phaser from 'phaser';
import { initialGameState, type GameState, type Phase } from '../core/gameState';
import { getEventForTurn, isTutorialTurn } from '../data/events';
import { awardMetaPoints, loadMetaProgress, saveMetaProgress, type MetaBonus, type MetaProgress } from '../systems/metaProgress';
import { clearSave, loadGame, saveGame } from '../systems/saveLoad';
import { applyMetaBonus, buildRunReport, resolveTurn } from '../systems/turnResolver';

function phaseLabel(phase: Phase): string {
  return phase === 'development' ? '개발 단계' : '라이브 운영 단계';
}

export class MainScene extends Phaser.Scene {
  private state: GameState = structuredClone(initialGameState);
  private uiGroup!: Phaser.GameObjects.Group;
  private meta: MetaProgress = loadMetaProgress();
  private rewardApplied = false;
  private bonusApplied = false;

  public constructor() {
    super('MainScene');
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#1d1f27');
    this.uiGroup = this.add.group();
    this.bindGlobalShortcuts();
    this.renderTurn();
  }

  private bindGlobalShortcuts(): void {
    this.input.keyboard?.on('keydown-S', () => {
      saveGame(this.state);
      this.renderTurn('저장 완료');
    });

    this.input.keyboard?.on('keydown-L', () => {
      this.state = loadGame();
      this.renderTurn('불러오기 완료');
    });

    this.input.keyboard?.on('keydown-C', () => {
      clearSave();
      this.renderTurn('저장 데이터 삭제');
    });

    this.input.keyboard?.on('keydown-ONE', () => {
      this.tryApplyMetaBonus('seed_funding');
    });

    this.input.keyboard?.on('keydown-TWO', () => {
      this.tryApplyMetaBonus('team_training');
    });

    this.input.keyboard?.on('keydown-THREE', () => {
      this.tryApplyMetaBonus('marketing_push');
    });
  }

  private tryApplyMetaBonus(bonus: MetaBonus): void {
    if (this.state.gameOver || this.bonusApplied || this.state.turn > 1 || this.meta.points <= 0) {
      return;
    }

    this.meta = {
      ...this.meta,
      points: this.meta.points - 1
    };
    saveMetaProgress(this.meta);

    this.state = applyMetaBonus(this.state, bonus);
    this.bonusApplied = true;
    this.renderTurn('메타 보너스 적용 완료');
  }

  private renderTurn(notice = ''): void {
    this.uiGroup.clear(true, true);

    const left = 32;
    let y = 20;

    this.addLine(`Turn ${this.state.turn} / ${this.state.maxTurns}`, left, y, '#ffd166', 26);
    y += 36;
    this.addLine(`Phase: ${phaseLabel(this.state.phase)}`, left, y, '#90e0ef', 22);
    y += 28;
    this.addLine(`메타 포인트 ${this.meta.points} (런 ${this.meta.totalRuns})`, left, y, '#bde0fe', 20);
    y += 28;

    const { money, morale, reputation, risk } = this.state.resources;
    this.addLine(`💰${money}  🙂${morale}  ⭐${reputation}  ⚠️${risk}`, left, y, '#ffffff', 22);
    y += 32;

    const { progress, quality, stability, hype } = this.state.product;
    this.addLine(`진척 ${progress}%  품질 ${quality}  안정 ${stability}  하이프 ${hype}`, left, y, '#cce3de', 20);
    y += 30;

    this.addLine(`팀 인원 ${this.state.team.headcount}명  숙련도 ${this.state.team.skill}`, left, y, '#e9edc9', 20);
    y += 30;

    if (this.state.phase === 'live') {
      this.addLine(`동접 ${this.state.live.ccu}  턴매출 ${this.state.live.revenue}  누적매출 ${this.state.live.cumulativeRevenue}`, left, y, '#f1fa8c', 20);
      y += 34;
    } else {
      y += 16;
    }

    const settlement = this.state.lastSettlement;
    this.addLine(`정산: 수익 ${settlement.income} / 비용 ${settlement.cost} / 순이익 ${settlement.net}`, left, y, '#ffddd2', 18);
    y += 24;
    this.addLine(settlement.summary, left, y, '#ffc8dd', 16);
    y += 24;

    this.addLine('[S] 저장  [L] 불러오기  [C] 저장삭제', left, y, '#adb5bd', 18);
    y += 24;
    this.addLine('[1] 시드투자  [2] 팀트레이닝  [3] 마케팅푸시 (1턴에만, 1회)', left, y, '#adb5bd', 16);
    y += 30;

    if (notice) {
      this.addLine(notice, left, y, '#80ed99', 18);
      y += 28;
    }

    if (this.state.gameOver) {
      const report = buildRunReport(this.state);

      if (!this.rewardApplied) {
        this.meta = awardMetaPoints(this.meta, report);
        saveMetaProgress(this.meta);
        this.rewardApplied = true;
      }

      this.addLine(`엔딩: ${report.ending}`, left, y, '#ef476f', 30);
      y += 40;
      this.addLine(`티어: ${report.tier}`, left, y, '#f1fa8c', 22);
      y += 28;
      this.addLine(`생존 턴: ${report.turnsSurvived} / 원인: ${report.failureCause}`, left, y, '#ffffff', 20);
      y += 28;
      this.addLine(`최대 동접: ${report.peakCcu} / 누적매출: ${report.cumulativeRevenue}`, left, y, '#ffffff', 20);
      y += 28;
      this.addLine(`최종 품질: ${report.finalQuality}`, left, y, '#ffffff', 20);
      y += 36;
      this.addLine('R 키로 재시작', left, y, '#ffffff', 22);

      this.input.keyboard?.once('keydown-R', () => {
        this.state = structuredClone(initialGameState);
        this.rewardApplied = false;
        this.bonusApplied = false;
        this.renderTurn();
      });
      return;
    }

    const event = getEventForTurn(this.state.turn, this.state.phase);
    if (isTutorialTurn(this.state.turn, this.state.phase)) {
      this.addLine('튜토리얼 턴: 핵심 지표 변화를 익히세요', left, y, '#ffd6a5', 18);
      y += 28;
    }
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
