import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { bindKeyboardActions } from "../../input/bindings";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell, textStyle } from "../view/sceneShell";

export class RuneBenchScene extends Phaser.Scene {
  constructor() {
    super("RuneBenchScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "Rune Bench",
      subtitle: "first compatible rune is attached by Enter",
      focusLabel: "Socket preview"
    });

    const runeIds = context.run.runes.length > 0 ? context.run.runes : context.dataBundle.runes.slice(0, 1).map((rune) => rune.id);
    runeIds.slice(0, 3).forEach((runeId, index) => {
      const rune = context.dataBundle.runes.find((item) => item.id === runeId);
      this.add.text(1060, 500 + index * 54, rune?.displayNameKo ?? runeId, textStyle(28, "#32415a", true));
    });
    this.add.text(1060, 690, `Equipped: ${Object.keys(context.run.equippedRunes).length}`, textStyle(24, "#805845"));
    this.add.text(1060, 735, "Enter: equip and continue", textStyle(24, "#32415a", true));

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action));
    renderDebugOverlay(context, "RuneBenchScene");
  }
}
