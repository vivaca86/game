import "./styles/phaser-shell.css";
import { createGame } from "./app/createGame";
import { parseRuntimeFlags, setRuntimeFlags } from "./app/runtimeFlags";

const runtimeFlags = parseRuntimeFlags(window.location.href);
setRuntimeFlags(runtimeFlags);

const game = createGame(runtimeFlags);
(window as Window & { __paperGame?: unknown }).__paperGame = game;

window.addEventListener("beforeunload", () => {
  game.destroy(true);
});
