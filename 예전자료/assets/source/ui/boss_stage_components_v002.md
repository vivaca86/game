# Boss Stage Components v002

Date: 2026-06-02

Purpose: second source pass for the Boss UI rebuild. This is not final approved production art.

## Source Direction

- Adds a boss-specific pressure board instead of relying on a thin phase badge.
- Shows the current/next phase threshold, the phase effect preview, the current HP meter, and the threshold pin.
- Adds a clear reward-link card so the boss screen communicates that boss defeat leads to the boss reward pool and stage clear or next-route progress.
- Keeps the Combat v3 paper-theater family, five-card hand, enemy intent ledger, and End Turn coordinate family intact.
- Lowers the boss-screen player standee slightly so the pressure board has readable space above the hand shelf.

## Acceptance Criteria For This Pass

- Slice boss 1920x1080 screenshot shows phase threshold, active intent, reward link, five-card hand, and End Turn without text overlap.
- Slice boss 1280x720 screenshot keeps those same critical elements readable.
- Release boss screenshot proves the board works with a full-catalog boss name, HP value, phase label, and reward pool.
- A phase-triggered screenshot proves the board changes from countdown/threshold state to triggered state.
- This pass may raise the Boss UI score, but it must not be called final UI completion unless the full 95-point UI gate is met.

## Current Status

Candidate source evidence only. Final production boss art, boss animation, all-boss phase balance, sound/VFX polish, user acceptance, and 95-point UI completion remain not done.
