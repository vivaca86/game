import Phaser from "phaser";
import { buildGameConfig } from "./gameConfig";
import type { RuntimeFlags } from "./runtimeFlags";

export function createGame(runtimeFlags: RuntimeFlags): Phaser.Game {
  const config = buildGameConfig();
  const game = new Phaser.Game(config);

  game.registry.set("runtimeFlags", runtimeFlags);

  return game;
}
