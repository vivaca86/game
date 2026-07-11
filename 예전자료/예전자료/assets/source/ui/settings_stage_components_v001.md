# Settings Stage Components v001

Date: 2026-06-02

Purpose: source pass for the Settings UI rebuild. This is not final approved production art.

## Source Direction

- Converts Settings from a standard shell control panel into a paper-theater settings ledger.
- Keeps the smoke-covered control coordinates for volume plus buttons, display/accessibility toggles, reset actions, and `마을로`.
- Separates audio, display/accessibility/control toggles, current save stamp, and bottom destructive/return actions.
- Makes settings feel like part of the in-world paper record system without implying that sound/music assets are complete.
- Shares the Reward, Event, Combat, Boss, Town, WorldMap, Dungeon, RuneBench, and Result paper-stage material language.

## Current Status

This is candidate source evidence only. It does not complete the UI skin gate without debug-less screenshots, scoring, full primary-screen coverage, final art approval, user acceptance, and automated verification.

Evidence for this pass:

- `tmp/ui-quality/settings-1920-debugless-v1.png`
- `tmp/ui-quality/settings-1280-debugless-v1.png`
- `tmp/ui-quality/settings-release-1920-debugless-v1.png`
- `tmp/ui-quality/settings-high-contrast-1920-debugless-v1.png`
- `tmp/ui-quality/settings-1920-debugless-v2.png`
- `tmp/ui-quality/settings-1280-debugless-v2.png`
- `tmp/ui-quality/settings-release-1920-debugless-v2.png`
- `tmp/ui-quality/settings-high-contrast-1920-debugless-v2.png`

Review notes:

- v1 exposed oversized row labels and panel headings that crowded the panel borders.
- v2 reduces label typography and moves headings down while preserving the smoke-covered control coordinates.
- The 1920, 1280, release, and toggled high-contrast captures are debug-less visual evidence.
- The 1280 capture is readable but still compact; it is progress evidence, not final responsive approval.

Verification performed:

- `npx.cmd tsc --noEmit`
- `npm.cmd run phaser:smoke`
- `npm.cmd run check`
- `npm.cmd run data:validate`
- `npm.cmd run quality:audit:report`
- `npm.cmd run assets:audit`
- `npm.cmd run assets:audit:release-visuals`
- `git diff --check`

Known limits:

- This visual pass does not complete music/SFX implementation, sound licensing, full key remapping, or broader accessibility polish.
- This pass preserves the existing smoke click coordinates, but it does not add new audio assets or full key-remap UX.
- The high-contrast capture verifies the visual state, not final accessibility acceptance.
