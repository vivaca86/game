import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { bindKeyboardActions } from "../../input/bindings";
import { getCurrentRoom } from "../../simulation/state/runState";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell, textStyle } from "../view/sceneShell";

export class DungeonScene extends Phaser.Scene {
  constructor() {
    super("DungeonScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    const room = getCurrentRoom(context.dataBundle, context.run);
    renderSceneShell(this, context, {
      title: "Lantern Foyer",
      subtitle: "dungeon route",
      focusLabel: "Current room"
    });

    this.add.text(1060, 500, room ? `${room.id} / ${room.type}` : "missing room", textStyle(30, "#32415a", true));
    this.add.text(1060, 560, "Enter: enter room", textStyle(24, "#805845", true));

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action));
    renderDebugOverlay(context, "DungeonScene");
  }
}
