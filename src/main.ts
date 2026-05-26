import "./styles/phaser-shell.css";
import { createGame } from "./app/createGame";
import { parseRuntimeFlags, setRuntimeFlags } from "./app/runtimeFlags";

const runtimeFlags = parseRuntimeFlags(window.location.href);
setRuntimeFlags(runtimeFlags);

const game = createGame(runtimeFlags);

window.addEventListener("beforeunload", () => {
  game.destroy(true);
});
