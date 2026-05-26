import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell, textStyle } from "../view/sceneShell";

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "결과",
      subtitle: "마을 복귀 entry",
      focusLabel: "해금 상태"
    });

    context.dataBundle.unlocks.slice(0, 2).forEach((unlock, index) => {
      this.add.text(1060, 500 + index * 54, unlock.displayNameKo, textStyle(28, "#32415a", true));
    });

    renderDebugOverlay(context, "ResultScene");
  }
}
