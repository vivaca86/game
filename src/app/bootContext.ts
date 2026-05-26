import type { RuntimeFlags } from "./runtimeFlags";
import type { DebugConfig, EntryKey } from "../debug/debugEntry";
import type { AssetManifestEntry, GameDataBundle, SaveData } from "../data/schema";
import type { ValidationResult } from "../data/validateLoadedData";
import type { SliceRunState } from "../simulation/state/runState";

export interface BootContext {
  dataBundle: GameDataBundle;
  assetManifest: AssetManifestEntry[];
  manifestStatus: string;
  save: SaveData;
  run: SliceRunState;
  debug: DebugConfig;
  runtimeFlags: RuntimeFlags;
  seed: string;
  entry: EntryKey;
  validation: ValidationResult;
  preloadWarnings: string[];
}
