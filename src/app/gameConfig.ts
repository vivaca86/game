import Phaser from "phaser";
import { BootScene } from "../phaser/scenes/BootScene";
import { BossScene } from "../phaser/scenes/BossScene";
import { CombatScene } from "../phaser/scenes/CombatScene";
import { DungeonScene } from "../phaser/scenes/DungeonScene";
import { PreloadScene } from "../phaser/scenes/PreloadScene";
import { ResultScene } from "../phaser/scenes/ResultScene";
import { RewardScene } from "../phaser/scenes/RewardScene";
import { RuneBenchScene } from "../phaser/scenes/RuneBenchScene";
import { TownScene } from "../phaser/scenes/TownScene";
import { WorldMapScene } from "../phaser/scenes/WorldMapScene";

export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;

export function buildGameConfig(): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: "game-root",
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#f9f1dc",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: {
      antialias: true,
      pixelArt: false
    },
    scene: [
      BootScene,
      PreloadScene,
      TownScene,
      WorldMapScene,
      DungeonScene,
      CombatScene,
      RewardScene,
      RuneBenchScene,
      BossScene,
      ResultScene
    ]
  };
}
