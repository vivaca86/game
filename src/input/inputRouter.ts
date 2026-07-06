import type { TaskbarReefRenderer } from "../render/TaskbarReefRenderer";
import { applyInputAction, type ReefState } from "../simulation/reefState";

interface InputRouterOptions {
  reefElement: HTMLElement;
  state: ReefState;
  renderer: TaskbarReefRenderer;
  onStateChange: () => void;
}

export const connectInputRouter = ({
  reefElement,
  state,
  renderer,
  onStateChange
}: InputRouterOptions): (() => void) => {
  let lastPointerMove = 0;

  const dispatch = (
    kind: "keyboard" | "pointerMove" | "pointerTap" | "capture",
    event?: KeyboardEvent | PointerEvent,
    intensity = 1
  ): void => {
    const rect = reefElement.getBoundingClientRect();
    const pointerEvent = event instanceof PointerEvent ? event : undefined;
    const x = pointerEvent ? pointerEvent.clientX - rect.left : undefined;
    const y = pointerEvent ? pointerEvent.clientY - rect.top : undefined;
    const action = {
      kind,
      at: performance.now(),
      intensity,
      x,
      y,
      key: event instanceof KeyboardEvent ? event.key : undefined
    };

    // Unity port note: this is the one browser-specific input translation layer.
    // Porting should map Unity Input System events into the same action payloads.
    applyInputAction(state, action);
    renderer.pushInput(action);
    onStateChange();
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) {
      return;
    }
    dispatch("keyboard", event, event.key === " " ? 1.25 : 0.9);
  };

  const handlePointerMove = (event: PointerEvent): void => {
    const now = performance.now();
    if (now - lastPointerMove < 55) {
      return;
    }
    lastPointerMove = now;
    dispatch("pointerMove", event, 0.55);
  };

  const handlePointerDown = (event: PointerEvent): void => {
    dispatch("pointerTap", event, 1.15);
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("pointermove", handlePointerMove);
  reefElement.addEventListener("pointerdown", handlePointerDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("pointermove", handlePointerMove);
    reefElement.removeEventListener("pointerdown", handlePointerDown);
  };
};

