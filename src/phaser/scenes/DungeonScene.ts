import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell } from "../view/sceneShell";

export class DungeonScene extends Phaser.Scene {
  constructor() {
    super("DungeonScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "등불 현관",
      subtitle: "던전 시야 entry",
      focusLabel: "현재 방"
    });
    renderDebugOverlay(context, "DungeonScene");
  }
}
