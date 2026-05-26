import type Phaser from "phaser";
import type { AssetManifestEntry } from "../../data/schema";

export function createPlaceholderTextures(
  scene: Phaser.Scene,
  assets: AssetManifestEntry[]
): string[] {
  const warnings: string[] = [];

  for (const asset of assets) {
    if (scene.textures.exists(asset.key)) {
      continue;
    }

    const width = Math.min(asset.nativeSize?.w ?? asset.frameSize?.w ?? 220, 320);
    const height = Math.min(asset.nativeSize?.h ?? asset.frameSize?.h ?? 160, 240);
    const graphics = scene.add.graphics();
    const color = hashColor(asset.key);
    graphics.fillStyle(0xfbf2d6, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.lineStyle(8, color, 1);
    graphics.strokeRoundedRect(4, 4, width - 8, height - 8, 18);
    graphics.fillStyle(color, 0.18);
    graphics.fillRoundedRect(18, 18, width - 36, height - 36, 14);
    graphics.generateTexture(asset.key, width, height);
    graphics.destroy();
    warnings.push(`placeholder:${asset.key}`);
  }

  return warnings;
}

function hashColor(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) & 0xffffff;
  }

  return 0x445566 ^ hash;
}
