import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell, textStyle } from "../view/sceneShell";

export class BossScene extends Phaser.Scene {
  constructor() {
    super("BossScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "보스전",
      subtitle: "boss debug entry",
      focusLabel: "보스 무대"
    });

    const boss = context.dataBundle.bosses.find((item) => item.id === context.debug.bossId)
      ?? context.dataBundle.bosses[0];
    if (boss) {
      this.add.rectangle(1380, 560, 420, 280, 0x3c3143, 0.94).setStrokeStyle(6, 0xf0c36a, 0.95);
      this.add.text(1210, 455, boss.displayNameKo, textStyle(36, "#fff5d7", true));
      this.add.text(1210, 520, `HP ${boss.maxHp}`, textStyle(28, "#f5c26b"));
      boss.phases.slice(0, 2).forEach((phase, index) => {
        this.add.text(1210, 580 + index * 42, phase.displayNameKo, textStyle(23, "#fff5d7"));
      });
    }

    renderDebugOverlay(context, "BossScene");
  }
}
