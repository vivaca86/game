import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { renderDebugOverlay } from "../../ui/overlays/debugOverlay";
import { requireBootContext } from "../bridge/sceneBridge";
import { renderSceneShell } from "../view/sceneShell";

export class WorldMapScene extends Phaser.Scene {
  constructor() {
    super("WorldMapScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    renderSceneShell(this, context, {
      title: "월드맵",
      subtitle: "스테이지 선택 entry",
      focusLabel: "열린 스테이지"
    });
    renderDebugOverlay(context, "WorldMapScene");
  }
}
