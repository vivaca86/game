import type { TaskbarReefRenderer } from "../render/TaskbarReefRenderer";
import {
  applyInputAction,
  getBubbleSourceRatio,
  type ReefState
} from "../simulation/reefState";

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
    const screenX = pointerEvent
      ? clamp(pointerEvent.clientX / Math.max(1, window.innerWidth), 0, 1)
      : 0.5;
    const x = pointerEvent ? screenX * rect.width : undefined;
    const y = rect.height * getBubbleSourceRatio(state.mode);
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
    dispatch("keyboard", event, event.repeat ? 0.45 : event.key === " " ? 1.25 : 0.9);
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

  const handleWheel = (): void => {
    dispatch("pointerTap", undefined, 0.75);
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerdown", handlePointerDown);
  window.addEventListener("wheel", handleWheel, { passive: true });

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerdown", handlePointerDown);
    window.removeEventListener("wheel", handleWheel);
  };
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));
