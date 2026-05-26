import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { bindKeyboardActions } from "../../input/bindings";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell, textStyle } from "../view/sceneShell";

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "Result",
      subtitle: "clear state returns to town",
      focusLabel: "Run result"
    });

    this.add.text(1060, 500, `Cleared: ${context.run.completedStages.join(",") || "none"}`, textStyle(28, "#32415a", true));
    this.add.text(1060, 560, `Saved clears: ${context.save.profile.completedStages.length}`, textStyle(24, "#805845"));
    this.add.text(1060, 735, "Enter: return to town", textStyle(24, "#32415a", true));

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action));
    renderDebugOverlay(context, "ResultScene");
  }
}
