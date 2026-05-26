import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { bindKeyboardActions } from "../../input/bindings";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell, textStyle } from "../view/sceneShell";

export class WorldMapScene extends Phaser.Scene {
  constructor() {
    super("WorldMapScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "World Map",
      subtitle: "stage route entry",
      focusLabel: "Selected stage"
    });

    this.add.text(1060, 500, "Enter: Dungeon", textStyle(28, "#32415a", true));
    this.add.text(1060, 552, "Route nodes are driven by fixture data.", textStyle(22, "#805845"));

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action));
    renderDebugOverlay(context, "WorldMapScene");
  }
}
