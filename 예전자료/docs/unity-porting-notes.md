# Unity Porting Notes

This prototype keeps browser-specific code isolated so the same game logic can move to Unity later.

- `src/simulation/reefState.ts`: renderer-agnostic state, tuning values, input reactions, and discovery thresholds.
- `src/input/inputRouter.ts`: browser input mapping only. In Unity, map Input System events into the same action payloads.
- `src/render/TaskbarReefRenderer.ts`: canvas renderer only. In Unity, this becomes a camera/canvas layer with sprite renderers and particle systems.
- `public/assets/abyssrium-desk`: first-pass production assets for the taskbar reef background and aquatic visitors.

The taskbar MVP target is a 56px compact reef bar that can expand on demand without hiding the work screen.

