import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell, textStyle } from "../view/sceneShell";

export class CombatScene extends Phaser.Scene {
  constructor() {
    super("CombatScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "카드 전투",
      subtitle: "debug combat entry",
      focusLabel: "전투 대상"
    });

    const enemy = context.dataBundle.enemies.find((item) => item.id === context.debug.enemyId)
      ?? context.dataBundle.enemies[0];
    if (enemy) {
      this.add.rectangle(1380, 560, 360, 250, 0xfffbef, 0.96).setStrokeStyle(5, 0x8f5b42, 0.9);
      this.add.text(1230, 465, enemy.displayNameKo, textStyle(34, "#1e2a3e", true));
      this.add.text(1230, 525, `HP ${enemy.maxHp}`, textStyle(28, "#805845"));
      this.add.text(1230, 585, enemy.intents[0]?.telegraphKo ?? "의도 없음", textStyle(24, "#805845"));
    }

    renderDebugOverlay(context, "CombatScene");
  }
}
