# Abyssrium Desk Handoff For Next Worker

Last updated: 2026-07-06
Current GitHub repo: https://github.com/vivaca86/game
Latest verified app behavior commit: `375271b Add living corallite volcano effects`

## 1. What This Project Is

This is an Abyssrium-inspired Windows desktop companion prototype. The first MVP is a taskbar-like reef strip that can sit on the real Windows desktop, expand/collapse, react to global keyboard and mouse activity, and later be ported to Unity more easily.

The user is aiming for a Steam-quality direction eventually, not a quick placeholder. The current build is still a web/Electron prototype, but implementation choices intentionally keep simulation, input, and rendering separated for a later Unity port.

## 2. Current Delivered Build

There are two ways to run it:

- Browser/dev mock: `npm run dev -- --port 4173`, then open `http://127.0.0.1:4173/`
- Real desktop overlay: run `Abyssrium Desk.exe` from the packaged build

Current packaged build paths on this PC:

- `C:\Users\i\Desktop\AbyssriumDesk-win-x64\Abyssrium Desk.exe`
- `C:\Users\i\Desktop\AbyssriumDesk-win-x64.zip`
- Source-generated release: `C:\a\game\release\AbyssriumDesk-win-x64.zip`

The handoff zip requested by the user is generated separately with this top-level structure:

```text
code/
game/
```

`code/` contains the source project for continuing development.
`game/` contains the packaged playable Windows build with `Abyssrium Desk.exe`.

The clean handoff package intentionally excludes unrelated older repository material such as `예전자료/`, `.git/`, `node_modules/`, generated `dist/`, generated `release/`, and test artifacts. It only includes files needed to continue the current Abyssrium Desk prototype.

## 3. User Direction And Quality Rules

The user explicitly set these working rules:

- If a needed tool/library is missing, install it instead of giving up.
- Look for better plugins/tools when they can improve quality, but do not use paid/cost-incurring options.
- The IP is Abyssrium and the work is intended for the IP holder, so asset research/reference gathering should optimize quality rather than over-filtering.
- "Good enough" is not acceptable. A rough vector placeholder or low-quality visual is not considered complete.
- The final goal is Steam, even though the current work is web/Electron. Keep Unity porting in mind and leave useful comments where logic should map to Unity.

## 4. Conversation And Development Timeline

1. Repository organization:
   - The user had a `game` repo under GitHub user `vivaca86`.
   - The Abyssrium PPT file was originally inside an `어비스리움` folder by mistake.
   - The PPT was moved to the repo root.
   - Old surrounding files were moved into `예전자료/`.
   - Final repo root was intended to show the PPT plus `예전자료/`.
   - For the clean handoff zip, those old surrounding files are excluded because they are not needed for the current Abyssrium Desk implementation.

2. Initial target:
   - The PPT described a taskbar game.
   - First implementation target became a taskbar reef implementation.
   - Second target was keyboard/mouse input causing bubble interactions.

3. Early UI feedback:
   - User rejected text labels, gauge, icon marks, and generic ocean styling.
   - User emphasized Abyssrium identity is the central volcano/corallite face, not just any sea background.
   - UI was reduced to canvas-only reef without visible instructional text or meters.

4. Interaction feedback:
   - Fish should not follow only the mouse inside the reef.
   - Desktop keyboard/mouse actions should globally trigger reef reactions.
   - Screen/camera should not move when clicking/typing.
   - Bubbles should originate from the lower reef, not from the middle.
   - Bottom ripple/wave under bubbles was later removed entirely.

5. Desktop overlay work:
   - Electron desktop overlay was added.
   - Compact mode is 640x56 by default.
   - Expanded mode is full work-area width minus margins, height 252.
   - Click compact to expand, click expanded to collapse.
   - Dragging the reef moves the overlay; moving more than 6px becomes a drag instead of a click.
   - Rounded corners were removed in desktop mode because transparent rounded corners showed blank rectangular gaps on the real desktop.
   - Tray menu exists for expand/collapse, reset position, and quit. Some Korean tray labels are currently mojibake in source and should be cleaned up later.

6. Packaging fixes:
   - Vite base path was fixed for packaged Electron assets.
   - Desktop package script creates `release/AbyssriumDesk-win-x64/` and `release/AbyssriumDesk-win-x64.zip`.
   - Other PCs can run the packaged exe without installing Node.js.

7. Visual iteration:
   - Compact crop was stabilized so the corallite face appears consistently across different desktop resolutions.
   - Expanded bubble origin was moved below the visual bottom so bubbles no longer appear to spawn in the air.
   - Fish direction was fixed because sprites faced left by default and initially looked like they were swimming backward.
   - Fish animation was iterated several times:
     - First: simple floating static sprites.
     - Then: tail/body split animation.
     - Then: segmented body-wave deformation.
     - Then: smoothing to reduce loop jumps and choppy movement.
   - Central corallite volcano was given subtle life:
     - breathing glow
     - crater glint
     - faint vent current
     - occasional small motes

## 5. Current Architecture

This is a Vite + TypeScript + Electron app. There is no React.

Key files:

- `src/main.ts`
  - Boots the app.

- `src/ui/app.ts`
  - Builds the DOM.
  - Creates the reef canvas.
  - Handles compact/expanded click behavior.
  - Handles desktop drag gestures.
  - Exposes a dev-only debug object at `window.__abyssriumDeskDebug`.

- `src/simulation/reefState.ts`
  - Renderer-agnostic state and tuning values.
  - Important values:
    - `compactHeightPx: 56`
    - `expandedHeightPx: 252`
    - `compactCameraWidthPx: 640`
    - `compactBubbleSourceRatio: 0.91`
    - `expandedBubbleSourceRatio: 1.03`
  - Contains Unity port notes. Keep this file browser-independent where possible.
  - Some Korean strings in this file are currently mojibake and not visible in the UI. Fix later if visible discovery/log UI returns.

- `src/input/inputRouter.ts`
  - Converts browser or desktop input into `InputAction` payloads.
  - In Electron desktop mode, global input comes from `window.abyssriumDesktop.onGlobalInput`.
  - In browser mock mode, local keyboard/pointer events are used.

- `src/render/TaskbarReefRenderer.ts`
  - Canvas renderer for background, fish, bubbles, glass overlay, corallite effects.
  - Main visual work lives here.
  - Uses source-image coordinate mapping for the central corallite so effects stay aligned when compact/expanded crops change.
  - Fish use segmented slice deformation for swimming. This is intentionally commented for future Unity sprite mesh/spline deformation.

- `src/styles/app.css`
  - Browser mock and desktop overlay styling.
  - Desktop surface should remain minimal and not show work-window/taskbar mock UI.

- `desktop/main.cjs`
  - Electron main process.
  - Creates frameless transparent always-on-top overlay.
  - Manages compact/expanded window bounds.
  - Provides tray menu.
  - Uses `uiohook-napi` for global keyboard/mouse input.

- `desktop/preload.cjs`
  - Exposes safe Electron bridge APIs into the browser context.

- `desktop/package-win.cjs`
  - Copies Electron runtime, app files, and runtime dependencies into `release/AbyssriumDesk-win-x64`.
  - Creates `release/AbyssriumDesk-win-x64.zip`.

- `public/assets/abyssrium-desk/`
  - Current bitmap assets:
    - `reef-taskbar-bg.png`
    - `fish-sprites.png`
    - small icon assets from earlier iterations

- `tests/taskbar.spec.ts`
  - Playwright smoke tests for render, input, expanded/collapsed behavior, and desktop surface basics.

## 6. Current Behavior

Compact mode:

- 56px tall.
- 640px camera width cap for consistent face crop.
- Shows the central corallite face and fish.
- Can be dragged in desktop mode.
- Click opens expanded mode.

Expanded mode:

- 252px tall.
- Uses nearly full work area width.
- Click anywhere collapses.
- Shows wider reef, animated fish, bubbles, and central corallite life effects.

Input reactions:

- Keyboard input creates bubble bursts.
- Mouse clicks/wheel create bubble bursts.
- Mouse movement creates lighter bubble streams.
- Bubble source is intentionally from the lower reef. Expanded mode starts slightly below the canvas so bubbles rise from the bottom, not mid-air.
- The removed bottom ripple should stay removed unless the user asks for a new ground effect.

Fish:

- Sprites face left in the source sheet.
- Code flips them only when swimming right.
- Movement is intentionally subtle; overly jerky motion was rejected.
- Do not return to static floating images.

Corallite:

- The central volcano/corallite is the IP identity.
- Current effect is subtle, not arcade-like:
  - breathing aura around the crater
  - thin glint moving around crater rim
  - faint vent current
  - occasional motes

## 7. Important User Preferences

The user has repeatedly rejected:

- Visible explanatory text inside the reef UI.
- Generic dashboard/card UI.
- Gauge bars, random icons, and decorative marks.
- Camera/window movement caused by keyboard or mouse input.
- Bubbles spawning from mid-screen.
- Fish that look like fixed images floating.
- Fish that swim backward.
- Overly rough visual shortcuts.

The user likes or accepted:

- Real desktop overlay behavior.
- Compact and expanded modes.
- Global input reaction.
- Dragging the overlay.
- Better fish movement after smoothing.
- Keeping the central corallite visible as the main identity.

## 8. Run, Test, Package

Install once:

```powershell
npm install
```

Run browser mock:

```powershell
npm run dev -- --port 4173
```

Run real desktop overlay from source:

```powershell
npm run desktop:dev
```

Build and smoke test:

```powershell
npm run build
npm run test:smoke
```

Package portable Windows build:

```powershell
npm run desktop:pack
```

Result:

```text
release/AbyssriumDesk-win-x64/Abyssrium Desk.exe
release/AbyssriumDesk-win-x64.zip
```

Packaged build does not require Node.js on the target PC.

## 9. Known Issues / Next Good Tasks

- Fix mojibake Korean strings in:
  - `desktop/main.cjs` tray menu labels
  - `src/simulation/reefState.ts` hidden visitor/discovery strings
- Add a small settings/debug panel only for development, not visible in production.
- Replace current generated/reference assets with official IP-approved assets when available.
- Consider a proper fish animation asset pipeline:
  - sprite sheets with multiple frames
  - mesh deformation
  - Unity 2D Animation bones
- Add performance profiling if fish count increases. Current segmented canvas drawing is fine for a few fish, but could become expensive with many creatures.
- Consider signed installer or packaging flow for real distribution. Current build is portable/unsigned.
- Keep UI text out of the reef unless the user explicitly asks. The current direction is visual companion, not information panel.

## 10. Suggested Claude Prompt

Give Claude this first:

```text
Read HANDOFF_FOR_NEXT_WORKER.md first. This is an Abyssrium Desk taskbar companion prototype. Preserve the user's quality bar: no placeholder UI, no visible explanation text, no gauges/icons, no camera movement on input, and keep Unity porting in mind. Before changing visuals, inspect src/render/TaskbarReefRenderer.ts, src/simulation/reefState.ts, src/input/inputRouter.ts, src/ui/app.ts, and desktop/main.cjs. After changes, run npm run build and npm run test:smoke, then package with npm run desktop:pack if the desktop build is affected.
```
