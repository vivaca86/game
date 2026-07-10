# Taskbar Cat Awake Idle v1 Provenance

## Purpose

Prototype-only awake-idle states between keyboard-driven kneading and the existing five-minute doze. The user explicitly directed that the cat must stop kneading when input stops. These assets are for local/IP-holder review and Unity handoff planning, not Steam shipping-rights approval.

## Sources And Method

- Approved rigid layers and pivots: `assets/taskbar-cat-cutout-rig-v3/`.
- Exact neutral/resting-paw target: `assets/taskbar-cat-cutout-rig-v3/chef-cat-transparent-neutral-open-eyes.png`, SHA-256 `5ac0cffea0fd560a386b5b511dc67d03ddfdf051647abe93bb29014ce1eda2a9`.
- Builder: `scripts/build_awake_idle_v1.py`.
- The fixed body, both front paws and the one-piece dough are unchanged. Only the documented head, ears, hat crown, tail and open-eye layer move. Sniff semantics use an almost vertical head approach, two nose-local squash pulses, and one short dough-to-nose scent curl per pulse; no speech bubble is used.
- No new full-body pose generation, flat-image mesh, whole-sprite CSS wobble, tool, or hand-to-mouth action is used.
- The 1254×1254 layers remain the art masters. Runtime WebPs use a 128×128 canvas displayed at 112×112.

## Runtime Outputs

- `chef-cat-idle-alert-128.webp`: 8,000ms calm loop. Slow tail sway, one blink and one one-sided ear response do not overlap.
- `chef-cat-idle-attention-128.webp`: 1,200ms one-shot for click/wheel attention. It does not start kneading.
- `chef-cat-idle-sniff-128.webp`: 3,000ms one-shot. The head approaches the dough, performs two nose-local sniffs, then returns to exact neutral; paws and dough stay fixed.
- `chef-cat-idle-sleepy-128.webp`: 8,000ms pre-doze loop with slower tail, long eye close and one bounded head dip.
- Full hashes, source/decoded frame counts, durations, timeline and Unity policy: `awake-idle-manifest.json`.

Current SHA-256 values:

- alert: `e797e82a13358e57aff682b62bd57e3d105730a279338931c6473f3ea0a259bf`
- attention: `9d1eab71e43488ba6ebbeffa55b835b804810ad75abad5c75d6f9303719509c1`
- sniff: `eda608432abcd062201bc0483ab209d2b4b2d2da5ffb85499dece7f01371f797`
- sleepy: `4360c3448a42f25a74041176e9b9f41d83107c81a77019585e7ba8048e4cad59`

## Browser And Unity State Contract

- Initial/no-input state is `AlertIdle`; it must never enter kneading merely because the page loaded.
- A keyboard pulse starts or extends `Work` for 1,200ms. Normal/fast/overdrive reactions remain anonymous and never affect reward or duration.
- Alert idle lasts to 45,000ms, curious idle to 180,000ms, sleepy idle to 300,000ms, then the registered doze state begins.
- Only curious idle may schedule sniff. Intervals rotate through 18,000/26,000/22,000ms. Ambient events use replace-current arbitration and never queue or overlap.
- Click/wheel uses the attention one-shot and resets the inactivity clock without starting kneading.
- Keyboard after doze plays the protected wake state, then gets the existing 1,200ms work hold. Pointer after doze wakes into awake idle without kneading.
- Unity should reproduce these rules with an ephemeral activity adapter, monotonic clock and Animator state machine. Root motion stays disabled.

## Verification Status

- All four outputs keep the fixed dough root at zero changed pixels, retain transparent corners, contain zero visible green-dominant pixels and return to the same neutral seam.
- Written WebP durations are 8,000/1,200/3,000/8,000ms. Attention decodes to 22 WebP frames because identical holds are coalesced; total timing remains exact and is registered separately from its 24 source samples.
- Static light/dark QA was inspected at the actual 112px display size. Continuous browser playback remains a separate user-review gate.
- Windows global input and Unity Animator/C# adapters are not implemented in this browser prototype.
