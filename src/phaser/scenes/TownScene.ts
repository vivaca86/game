import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell, textStyle } from "../view/sceneShell";

export class TownScene extends Phaser.Scene {
  constructor() {
    super("TownScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "종이극장 마을",
      subtitle: "첫 세로 조각 런타임",
      focusLabel: "다음 런"
    });

    const unlocked = context.save.profile.unlockedStages.length;
    const completed = context.save.profile.completedStages.length;
    this.add.text(1060, 500, `열린 무대 ${unlocked}`, textStyle(34, "#32415a", true));
    this.add.text(1060, 555, `클리어 기록 ${completed}`, textStyle(28, "#805845"));
    this.add.text(1060, 635, "debug=1 진입은 별도 overlay에 표시된다.", textStyle(22, "#805845"));
    renderDebugOverlay(context, "TownScene");
  }
}
