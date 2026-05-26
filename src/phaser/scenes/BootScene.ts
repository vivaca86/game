import Phaser from "phaser";
import { getRuntimeFlags } from "../../app/runtimeFlags";
import type { BootContext } from "../../app/bootContext";
import { loadGameData } from "../../data/loadGameData";
import { validateLoadedData } from "../../data/validateLoadedData";
import { createDebugConfig } from "../../debug/debugEntry";
import { hasUsableStoredSave, loadSave, persistSave } from "../../save/saveCodec";
import { createInitialRunState, sliceRunToSaveRun } from "../../simulation/state/runState";
import { storeBootContext } from "../bridge/sceneBridge";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    const runtimeFlags = getRuntimeFlags();
    const loaded = loadGameData();
    const validation = validateLoadedData(loaded.bundle);
    const restoreSavedRun = hasUsableStoredSave(loaded.bundle, { debug: runtimeFlags.debug }) && !runtimeFlags.resetSave;
    const save = loadSave(loaded.bundle, {
      debug: runtimeFlags.debug,
      resetSave: runtimeFlags.resetSave
    });
    const debug = createDebugConfig(runtimeFlags, loaded.bundle);
    const run = createInitialRunState(loaded.bundle, debug, restoreSavedRun ? save.currentRun : undefined);
    save.currentRun = sliceRunToSaveRun(run);

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
    persistSave(save, { debug: runtimeFlags.debug });

    if (!validation.ok) {
      console.error("Slice data validation failed", validation.errors);
    }

    this.scene.start("PreloadScene", context);
  }
}
