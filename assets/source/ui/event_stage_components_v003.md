# Event Stage Components v003

Date: 2026-06-02

Purpose: third source pass for the Event UI rebuild. This is not final approved production art.

## Changes From v002

- Keeps the v2 event stage, teal ribbon, diorama, and side paper wings.
- Tightens release four-choice cards by separating the bottom cost/result rows into distinct label chips.
- Converts long multi-reward output into compact reward summaries for dense two-column release layouts.
- Keeps slice three-choice cards and release four-choice click areas compatible with existing smoke coordinates.
- Changes the confirm button label to `Enter 첫 선택` so the button describes the keyboard fallback instead of pretending it is the main choice path.

## Current Status

This is candidate source evidence for the Event v3 runtime layout. It improves source traceability and release four-choice readability, but it does not complete the UI skin gate without screenshot scoring, full primary-screen coverage, final art approval, and automated verification.

Final v8 evidence for this pass:

- `tmp/ui-quality/event-1920-debugless-v8.png`
- `tmp/ui-quality/event-1280-debugless-v8.png`
- `tmp/ui-quality/event-release-1920-debugless-v8.png`
- `tmp/ui-quality/event-release-1280-debugless-v8.png`

Verification passed after the label/value spacing fix with `npm.cmd run phaser:smoke`, `npm.cmd run check`, `npm.cmd run data:validate`, `npm.cmd run quality:audit:report`, `npm.cmd run assets:audit`, `npm.cmd run assets:audit:release-visuals`, and `git diff --check`. The Vite large JS chunk warning still remains a separate Performance gate risk.
