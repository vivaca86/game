import Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";
import type { AssetManifestEntry } from "../../data/schema";
import { resolveEntryScene } from "../bridge/entryScene";
import { requireBootContext, storeBootContext } from "../bridge/sceneBridge";
import { createPlaceholderTextures } from "../view/placeholderTextures";

export class PreloadScene extends Phaser.Scene {
  private context?: BootContext;

  constructor() {
    super("PreloadScene");
  }

  init(data: BootContext): void {
    this.context = requireBootContext(this, data);
  }

  preload(): void {
    const context = requireBootContext(this, this.context);
    for (const asset of context.assetManifest) {
      queueAssetLoad(this, asset);
    }
  }

  create(data: BootContext): void {
    const context = this.context ?? requireBootContext(this, data);
    const warnings = createPlaceholderTextures(this, context.assetManifest);
    context.preloadWarnings = warnings;
    storeBootContext(this, context);

    if (warnings.length > 0) {
      console.info("Using fallback generated textures for missing runtime assets", warnings);
    }

    this.scene.start(resolveEntryScene(context.run.phase), context);
  }
}

function queueAssetLoad(scene: Phaser.Scene, asset: AssetManifestEntry): void {
  if (asset.type === "spritesheet") {
    const frameWidth = asset.frameSize?.w ?? asset.nativeSize?.w ?? 1;
    const frameHeight = asset.frameSize?.h ?? asset.nativeSize?.h ?? 1;
    scene.load.spritesheet(asset.key, asset.path, { frameWidth, frameHeight });
    return;
  }

  if (asset.type === "image") {
    scene.load.image(asset.key, asset.path);
  }
}
