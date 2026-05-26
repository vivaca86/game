import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell, textStyle } from "../view/sceneShell";

export class RuneBenchScene extends Phaser.Scene {
  constructor() {
    super("RuneBenchScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "룬 작업대",
      subtitle: "rune bench entry",
      focusLabel: "장착 후보"
    });

    context.dataBundle.runes.slice(0, 3).forEach((rune, index) => {
      this.add.text(1060, 500 + index * 54, rune.displayNameKo, textStyle(28, "#32415a", true));
    });

    renderDebugOverlay(context, "RuneBenchScene");
  }
}
