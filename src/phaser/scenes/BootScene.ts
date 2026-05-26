import Phaser from "phaser";
import { getRuntimeFlags } from "../../app/runtimeFlags";
import type { BootContext } from "../../app/bootContext";
import { loadGameData } from "../../data/loadGameData";
import { validateLoadedData } from "../../data/validateLoadedData";
import { createDebugConfig } from "../../debug/debugEntry";
import { createInitialSave } from "../../save/saveCodec";
import { createInitialRunState } from "../../simulation/state/runState";
import { storeBootContext } from "../bridge/sceneBridge";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    const runtimeFlags = getRuntimeFlags();
    const loaded = loadGameData();
    const validation = validateLoadedData(loaded.bundle);
    const save = createInitialSave(loaded.bundle);
    const debug = createDebugConfig(runtimeFlags, loaded.bundle);
    const run = createInitialRunState(loaded.bundle, debug);
    const context: BootContext = {
      dataBundle: loaded.bundle,
      assetManifest: loaded.bundle.assets,
      manifestStatus: loaded.manifestStatus,
      save,
      run,
      debug,
      runtimeFlags,
      seed: runtimeFlags.seed,
      entry: debug.entry,
      validation,
      preloadWarnings: []
    };

    storeBootContext(this, context);

    if (!validation.ok) {
      console.error("Slice data validation failed", validation.errors);
    }

    this.scene.start("PreloadScene", context);
  }
}
