import fixtureJson from "./fixtures/vertical-slice.v1.json";
import assetManifestJson from "./assetManifest.slice.v1.json";
import type { AssetManifestEntry, GameDataBundle } from "./schema";

interface FixtureEnvelope {
  metadata: {
    id: string;
    status: string;
  };
  data: Omit<GameDataBundle, "assets">;
}

interface ManifestEnvelope {
  metadata: {
    id: string;
    status: string;
  };
  assets: AssetManifestEntry[];
}

export interface LoadedGameData {
  bundle: GameDataBundle;
  manifestStatus: string;
}

export function loadGameData(): LoadedGameData {
  const fixture = fixtureJson as FixtureEnvelope;
  const manifest = assetManifestJson as ManifestEnvelope;

  return {
    bundle: {
      ...fixture.data,
      assets: manifest.assets
    },
    manifestStatus: manifest.metadata.status
  };
}
