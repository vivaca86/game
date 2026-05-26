import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { bindKeyboardActions } from "../../input/bindings";
import { getCurrentRoom, getEncounterPoolContentId, getStage } from "../../simulation/state/runState";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { handleSceneAction } from "../bridge/sceneActions";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderActionButton, renderSceneShell, textStyle } from "../view/sceneShell";

export class RuneBenchScene extends Phaser.Scene {
  constructor() {
    super("RuneBenchScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "Rune Bench",
      subtitle: "first compatible rune is attached by Enter",
      focusLabel: "Socket preview",
      backgroundKey: resolveRuneBenchBackgroundKey(context)
    });

    const runeIds = context.run.runes.length > 0 ? context.run.runes : context.dataBundle.runes.slice(0, 1).map((rune) => rune.id);
    runeIds.slice(0, 3).forEach((runeId, index) => {
      const rune = context.dataBundle.runes.find((item) => item.id === runeId);
      const y = 500 + index * 54;
      if (rune?.assetKeys.icon && this.textures.exists(rune.assetKeys.icon)) {
        this.add.image(1032, y + 18, rune.assetKeys.icon).setDisplaySize(44, 44);
      }
      this.add.text(1072, y, rune?.displayNameKo ?? runeId, textStyle(28, "#32415a", true));
    });
    this.add.text(1060, 664, `Equipped: ${Object.keys(context.run.equippedRunes).length}`, textStyle(24, "#805845"));
    renderActionButton(this, 1010, 742, "Equip Rune", () => handleSceneAction(this, context, "confirm"));

    bindKeyboardActions(this, (action) => handleSceneAction(this, context, action));
    renderDebugOverlay(context, "RuneBenchScene");
  }
}

function resolveRuneBenchBackgroundKey(context: BootContext): string | undefined {
  const currentRoom = getCurrentRoom(context.dataBundle, context.run);
  const room = currentRoom?.type === "event"
    ? currentRoom
    : getStage(context.dataBundle, context.run)?.route.find((item) => item.type === "event");
  const eventId = getEncounterPoolContentId(context.dataBundle, room?.encounterPoolId, "event");
  return context.dataBundle.events.find((event) => event.id === eventId)?.assetKeys.scene;
}
