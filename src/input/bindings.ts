import type Phaser from "phaser";
import type { InputAction } from "./actions";

export const KEYBOARD_BINDINGS: Record<string, InputAction> = {
  ArrowUp: "move_up",
  ArrowDown: "move_down",
  ArrowLeft: "move_left",
  ArrowRight: "move_right",
  Enter: "confirm",
  Space: "confirm",
  Escape: "cancel",
  KeyP: "pause",
  Digit1: "card_1",
  Digit2: "card_2",
  Digit3: "card_3",
  Digit4: "card_4",
  Digit5: "card_5",
  KeyE: "end_turn",
  Backquote: "toggle_debug"
};

export function bindKeyboardActions(
  scene: Phaser.Scene,
  onAction: (action: InputAction) => void
): void {
  scene.input.keyboard?.removeAllListeners("keydown");
  scene.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
    const action = KEYBOARD_BINDINGS[event.code];
    if (action) {
      onAction(action);
    }
  });
}
