# Taskbar Cat Rest Motion v1 Provenance

## Purpose

Prototype-only long-idle doze and startled-wake states for the approved 2D chef-cat kneading one dough. These files are for local/IP-holder review and Unity handoff planning; they are not Steam shipping-rights approval.

## Sources And Method

- Art, clean plate, rigid layers and pivots: `assets/taskbar-cat-cutout-rig-v3/`.
- Exact wake return target: `assets/taskbar-cat-cutout-rig-v3/chef-cat-transparent-neutral-open-eyes.png`, SHA-256 `5ac0cffea0fd560a386b5b511dc67d03ddfdf051647abe93bb29014ce1eda2a9`.
- Builder: `scripts/build_rest_motion_v1.py`.
- No full-body pose was generated and no flat-image mesh or whole-sprite CSS wobble was used. The fixed base, body, arms and dough remain registered. Only head, both ears, hat crown and tail rotate/translate around documented v3 pivots.
- The 1254×1254 source layers remain the masters. The runtime WebPs are 128×128 canvases displayed by CSS at 112×112; downsizing for display does not replace or degrade the master.

## Runtime Outputs

- `chef-cat-doze-128.webp`: 80 frames, 50ms/frame, 4,000ms loop, two calm nods, closed eyes, bounded ear/hat/tail follow-through, exact first/last seam.
- `chef-cat-wake-startle-128.webp`: 20 frames, 50ms/frame, 1,000ms one-shot, deep doze entry, eye-open/head/ear/hat recoil, exact approved-neutral ending.
- Full output hashes, pivots, metrics and Unity state notes: `rest-motion-manifest.json`.
- Current SHA-256 values: doze `5a48415867e6c8f23e2235f60126daa0e657044c8d75951cde2255f98ebfc39b`; wake `a7b740c19b4eaa1771f7e2eb16bb634e23bdaddf55d0f177a286958fcccb8ba4`.

## Unity Handoff

- Enter `DozeLoop` after 300 seconds without anonymous activity pulses.
- On the first resumed key/click/wheel pulse, clear the short input-intensity buffer and enter `WakeStartle` for 1,000ms. Give the one-shot priority so dense input cannot restart, truncate or queue over it.
- Exit to the exact registered neutral, then resume the ambient kneading state. Restart the inactivity clock from the wake-triggering activity.
- Keep root motion disabled. Recreate head, ear, hat and tail curves from the documented pivots; do not import the 128px WebP as the art master.
- Reduced/off motion and management-panel ownership use the approved static neutral instead of animated WebP playback.

## Verification Status

- Doze first/last identical; wake final frame equals the approved neutral; fixed dough-root changes are zero; all runtime corners remain transparent.
- Static light/dark QA was inspected at the actual 112px display size and automated state/asset/build gates pass.
- A real unaccelerated 300-second idle run, repeated live doze cycles and key/click/wheel wake playback in the user's open `file:` page are still required. Status: `Implemented, not live-verified`.
