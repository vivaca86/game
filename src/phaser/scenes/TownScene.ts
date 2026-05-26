import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { bindKeyboardActions } from "../../input/bindings";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell, textStyle } from "../view/sceneShell";

export class TownScene extends Phaser.Scene {
  constructor() {
    super("TownScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "Paper Theater Town",
      subtitle: "run foundation entry",
      focusLabel: "Next run"
    });

    const unlocked = context.save.profile.unlockedStages.length;
    const completed = context.save.profile.completedStages.length;
    this.add.text(1060, 500, `Unlocked stages ${unlocked}`, textStyle(34, "#32415a", true));
    this.add.text(1060, 555, `Completed stages ${completed}`, textStyle(28, "#805845"));
    this.add.text(1060, 635, "Enter: World Map", textStyle(24, "#805845", true));

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action));
    renderDebugOverlay(context, "TownScene");
  }
}
