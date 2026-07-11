import type Phaser from "phaser";
import type { BootContext } from "../../app/bootContext";

const BOOT_CONTEXT_KEY = "bootContext";

export function storeBootContext(scene: Phaser.Scene, context: BootContext): void {
  scene.registry.set(BOOT_CONTEXT_KEY, context);
}

export function requireBootContext(scene: Phaser.Scene, data?: unknown): BootContext {
  const fromData = data as BootContext | undefined;
  if (fromData?.dataBundle) {
    storeBootContext(scene, fromData);
    return fromData;
  }

  const context = scene.registry.get(BOOT_CONTEXT_KEY) as BootContext | undefined;
  if (!context) {
    throw new Error("BootContext is missing. BootScene must run before gameplay scenes.");
  }

  return context;
}
