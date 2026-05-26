import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import { resolveEntryScene } from "../bridge/entryScene";
import { requireBootContext, storeBootContext } from "../bridge/sceneBridge";
import { createPlaceholderTextures } from "../view/placeholderTextures";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  create(data: BootContext): void {
    const context = requireBootContext(this, data);
    const warnings = createPlaceholderTextures(this, context.assetManifest);
    context.preloadWarnings = warnings;
    storeBootContext(this, context);

    if (warnings.length > 0) {
      console.info("Using generated placeholder textures for planned manifest", warnings);
    }

    this.scene.start(resolveEntryScene(context.entry), context);
  }
}
