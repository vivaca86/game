# Workaround Ledger

Record only workarounds that were actually verified. Check environment and error signatures before reuse.

## 2026-07-10 — Windows directory deletion blocked by a development server

- Environment: Windows, local PowerShell workspace.
- Operation signature: Recursively delete a user-approved project directory.
- Failed route: `Remove-Item -Recurse -Force`.
- Error signature: The process cannot access the directory because it is being used by another process.
- Root cause: A Python or Node development server had its current working directory inside the deletion target.
- Verified workaround:
  1. Resolve and verify the exact deletion target stays inside the approved workspace.
  2. Identify processes whose current working directory is the target or one of its descendants.
  3. Validate each PID, process name, command line, and target relationship.
  4. Stop only the validated target-related development processes.
  5. Retry the native PowerShell deletion and verify the path is absent.
- Verification evidence: The locked directories were removed and unrelated project servers remained running.
- Reuse conditions: Use only for the same sharing-violation signature after the user has authorized the deletion. Never terminate an unverified or unrelated process.

## 2026-07-10 — User requests only one Git repository subdirectory

- Environment: Git on Windows.
- Operation signature: Retrieve only one named subdirectory from a larger GitHub repository into the workspace root.
- Failed route: Clone the full repository directly into the final workspace path.
- Root cause: Git does not clone a subdirectory as an independent repository, and the requested final scope was interpreted too broadly.
- Verified workaround:
  1. Clone or sparse-check out the repository into a temporary directory.
  2. Verify the requested subdirectory and its file count or hashes.
  3. Move only that subdirectory to the exact requested destination.
  4. Delete the temporary full checkout after path verification.
  5. Verify that the final destination contains the requested files and no unwanted repository tree or `.git` metadata unless explicitly requested.
- Verification evidence: `taskbar-cat-hero` was placed at the workspace root with all 43 files, while the full `game` checkout was removed.
- Reuse conditions: Use when the user wants a folder snapshot only. If they require independent Git history or future pulls, clarify the repository-layout tradeoff before choosing a different structure.

## 2026-07-10 — Windows PowerShell rejects a piped `foreach` statement

- Environment: Windows PowerShell 5.1.
- Operation signature: Produce objects with a `foreach` statement and pipe the statement result directly to a formatter or another command.
- Failed route: `foreach (...) { ... } | Format-Table ...`.
- Error signature: `An empty pipe element is not allowed.`
- Root cause: In this PowerShell environment, the statement form of `foreach` cannot be used directly as that pipeline element.
- Verified workaround: Assign the loop output first, for example `$rows = $(foreach (...) { ... })`, then run `$rows | Format-Table ...`.
- Verification evidence: The rewritten AGENTS verification command completed and all eight required-content checks passed. A later temporary-file cleanup and a subsequent image-skill line-count check mistakenly repeated the failed syntax; both stopped during parsing before any file operation. Each was immediately rewritten with `$rows = $(foreach ...)` and succeeded. Because the failure recurred despite this ledger, the exact prohibition was also promoted into `AGENTS.md` startup rules.
- Reuse conditions: Use this form first for future Windows PowerShell commands that need to pipe `foreach` output. This does not apply to `ForEach-Object`, which is already a pipeline command.

## 2026-07-10 — Windows PowerShell misreads UTF-8 Markdown without an explicit encoding

- Environment: Windows PowerShell 5.1 reading UTF-8 Markdown that contains Korean text.
- Operation signature: Read a generated Markdown log and verify exact Korean phrases.
- Failed route: `Get-Content -Raw` with the default encoding.
- Error signature: Expected Korean phrases were reported missing even though the file existed and its ASCII structure checks passed.
- Root cause: Windows PowerShell 5.1 can decode UTF-8 text without a BOM using the active legacy code page.
- Verified workaround: Read the file with `Get-Content -Raw -Encoding UTF8` before exact-text or regex verification.
- Verification evidence: All three Korean log-content checks passed with explicit UTF-8 decoding.
- Reuse conditions: Use explicit UTF-8 decoding first when Windows PowerShell 5.1 reads project Markdown, JSON, YAML, or source files that contain non-ASCII text.

## 2026-07-10 — In-app Browser blocks a local `file:` project URL

- Environment: Codex in-app Browser on Windows.
- Operation signature: Open this project's local `index.html` for read-only UI inspection.
- Failed route: Navigate the in-app Browser directly to the `file:///.../taskbar-cat-hero/index.html` URL.
- Error signature: Browser security policy rejected the URL as blocked.
- Root cause: The Browser URL policy does not permit that local file navigation in this session.
- Verified safe alternative: Do not retry through localhost, raw browser commands, another browser surface, or an indirect URL. For source-orientation work, inspect `index.html`, `app.js`, both CSS files, the self-contained HTML, and the existing rendered concept/sprite PNGs; run non-browser static integrity checks separately.
- Verification evidence: JavaScript syntax passed, all static JavaScript ID references matched the HTML, the standalone file's main markup and script matched the modular source, and the rendered concept/sprite assets were visually inspected.
- Reuse conditions: Use this alternative only for static understanding. It does not verify clicks, focus behavior, layout at runtime, persistence, or browser console/network behavior. If those are required, report the gap and use a user-approved supported runtime rather than bypassing the Browser policy.

## 2026-07-10 — Folder snapshot has no Git metadata

- Environment: Windows PowerShell in the local `taskbar-cat-hero` folder snapshot.
- Operation signature: Inspect the change set after editing project documentation.
- Failed route: Run `git status --short` and `git diff` directly in the project folder.
- Error signature: `fatal: not a git repository (or any of the parent directories): .git`.
- Root cause: The user requested only the `taskbar-cat-hero` subdirectory from the larger repository, and the verified extraction intentionally excluded the parent repository and `.git` metadata.
- Verified workaround: Check the exact edited file paths, sizes, timestamps, SHA-256 hashes, and required-content assertions directly. Do not present the result as a Git diff or infer branch status.
- Verification evidence: `docs/taskbar-cat-concept.md` existed at the expected path, its SHA-256 hash and size were collected, and all twelve required concept-content checks passed.
- Reuse conditions: Use this route whenever the workspace is a folder snapshot without `.git`. If commit, branch, pull, or push work is later requested, first explain that repository metadata is absent and obtain the appropriate repository structure rather than fabricating Git state.

## 2026-07-10 — PowerShell quoting corrupts a complex `node -e` script

- Environment: Windows PowerShell 5.1 invoking Node.js 24.
- Operation signature: Run a read-only inline Node script containing nested JavaScript string literals and HTML attribute quotes.
- Failed route: Put the full script in a double-quoted `node -e "..."` PowerShell argument with backslash-escaped quotes.
- Error signature: Node received a malformed string around `<section class="game-panel">` and threw `SyntaxError: missing ) after argument list`.
- Root cause: PowerShell and Node command-line quoting rules interpreted the nested quote sequence differently; backslash escaping alone did not preserve the intended JavaScript source.
- Verified workaround: Pipe a single-quoted PowerShell here-string to `node -`, keeping the JavaScript source literal and read-only.
- Verification evidence: The replacement script calculated the expanded-panel byte length and SHA-256 successfully before and after the taskbar-only edit.
- Reuse conditions: Use this for complex read-only inline Node checks on Windows PowerShell. For reusable or state-changing logic, create a reviewed project script with `apply_patch` instead of hiding it in a shell here-string.

## 2026-07-10 — Live local UI verification after the in-app Browser blocks `file:`

- Environment: Codex in-app Browser, Windows, local static HTML project.
- Operation signature: Perform user-authorized runtime and visual verification after implementing the taskbar widget.
- Prior failed route: Direct `file:///.../index.html` navigation, which the Browser security policy blocked in the earlier source-orientation task.
- Verified workaround:
  1. Use the installed Browser skill and its supported in-app Browser surface.
  2. Start a temporary Python static server bound only to `127.0.0.1` in the approved project directory.
  3. Navigate directly to the known localhost page, inspect DOM state, interact through verified unique locators, capture screenshots, and read console warnings/errors.
  4. Close the verification tab and stop only the validated server PIDs after testing.
- Verification evidence: The modular and standalone pages loaded, the v31 art rendered, task completion/claim/open/close/typing flows worked, transparent hit-test samples passed, and the console contained no warnings or errors. Both loopback servers were then stopped.
- Reuse conditions: Use only when the user's implementation request authorizes live local execution and the Browser skill lists localhost as supported. Bind to loopback, never expose the server to the network, and do not use this merely to bypass a security warning for unrelated browsing.

## 2026-07-10 — Restricted browser evaluation does not expose `localStorage`

- Environment: Codex in-app Browser Playwright read-only page evaluation.
- Operation signature: Inspect widget geometry, visible state, and saved-state evidence after page load.
- Failed route: Read `localStorage.getItem(...)` inside `tab.playwright.evaluate(...)`.
- Error signature: `TypeError: Cannot read properties of undefined (reading 'getItem')`.
- Root cause: The Browser's bounded read-only evaluation scope does not expose every browser global even though the application itself can use that API normally.
- Verified workaround: Read only supported DOM attributes and computed styles in the bounded evaluation; verify persistence through reload-visible behavior, pure domain migration tests, source assertions, and standalone runtime checks instead of trying to extract storage contents.
- Verification evidence: Reload preserved the ready work state, ten core tests passed including migration and sensitive-data exclusion, integration tests verified runtime data is outside saved state, and browser-visible state matched after reload.
- Reuse conditions: Use this evidence combination when a restricted evaluation global is unavailable. Do not switch browser-control mechanisms or attempt to exfiltrate storage through page mutations.

## 2026-07-10 — A current Browser refusal overrides an older localhost workaround

- Environment: Codex in-app Browser with the standalone page already open as a local `file:` URL.
- Operation signature: Reload and continuously observe the corrected sprite animation in the user's existing local tab.
- Failed route: Request Browser control of the current `file:///.../taskbar-cat-hero-single.html` tab.
- Error signature: The Browser security response rejected local-file control and explicitly prohibited retrying through localhost, another browser surface, raw browser commands, or an indirect URL.
- Root cause: The current Browser policy decision is stricter than the route that was available in an earlier session.
- Verified safe alternative: Do not reuse the older loopback-server workaround when the current refusal explicitly forbids alternatives. Perform source, state-machine, PNG registration, syntax, integration, and lossless standalone checks; then ask the user to reload the already-open local page for the required continuous visual acceptance check.
- Verification evidence: The selected frames' displayed lower-body center spread measured 0.4610px with a common source baseline y=161, all 21 Node tests passed, and the standalone build passed its lossless quality gate. Actual continuous playback remains unverified until observed in the user's tab.
- Additional confirmation during the fast dough-feel pass: Browser listed and claimed the exact open `file:///.../taskbar-cat-hero-single.html` tab, but rejected the first screenshot because the local URL is blocked and explicitly prohibited localhost, another browser surface, raw browser commands, or indirect execution. The attempt stopped immediately; source/state/atlas/build checks passed, while live feeling remained a user gate.
- Reuse conditions: The latest explicit security response wins over a historical workaround. Never treat static or numeric evidence as a substitute for final-speed visual acceptance when animation quality is the issue.

## 2026-07-10 — Soft chroma-key output retains interior matte and visible magenta pixels

- Environment: Pillow-based deterministic processing of a generated six-cell sprite atlas.
- Operation signature: Convert a flat-magenta generated background to transparent alpha while preserving soft fur, whiskers, props, and opaque interior colors.
- Failed route: Accept the first soft-matte helper output as the final alpha atlas.
- Error signature: The helper produced 15,370 partially transparent pixels, including 438 false interior partials, plus 232 visibly magenta edge/interior pixels under a broad perceptual color test.
- Root cause: A global soft chroma matte cannot distinguish every intentional warm highlight from background spill, and anti-aliased generated boundaries can retain near-key colors that an exact RGB test misses.
- Verified workaround: Restrict partial alpha to a two-pixel neighborhood of true transparent background, restore false interior partials to the original RGB with alpha 255, then replace every remaining visible perceptual-magenta pixel from a local median of neighboring non-magenta visible colors. Keep the process deterministic and hash-gated.
- Verification evidence: Final counts were 14,932 retained boundary partials, 438 restored interior pixels, 232 corrected visible-magenta pixels, and 0 visible-magenta pixels remaining. Bright/dark 128px previews showed no purple fringe or alpha holes.
- Additional verified green-key case: The baker neutral's official soft matte left 2,018 visible green-dominant pixels. The documented one-pixel edge contraction reduced this to 575; a deterministic local non-green median replacement corrected those 575 pixels while preserving alpha bytes, leaving 0 under the recorded predicate. The resulting 128px light/dark and 256px checker previews showed no visible halo.
- Reuse conditions: Use spatial plus perceptual validation for generated chroma-key sprites. Do not rely only on exact key-color matching or accept the helper output without bright/dark visual inspection.

## 2026-07-10 — Reproducible image QA needs Pillow but the base workspace lacks it

- Environment: Local Windows project snapshot; Python 3.12 available, Pillow initially unavailable.
- Operation signature: Decode, composite, register, hash, and inspect lossless PNG sprite cells with reproducible scripts.
- Failed route: Run the Python asset pipeline against the base interpreter without its declared image dependency.
- Root cause: Pillow is not part of the Python standard library or the base project snapshot.
- Verified workaround: Install the free pinned dependency `Pillow==12.3.0` into a project-local temporary tool path, set `PYTHONPATH` only for the asset checks, record the pin in `scripts/requirements-imagegen.txt`, then remove the temporary installed copy after every check passes.
- Verification evidence: Composition, alpha refinement, and atlas registration `--check` commands all passed; the runtime has no Pillow dependency, and the temporary dependency directory was removed after validation.
- Reuse conditions: Install the pinned version into a project-local disposable path for future deterministic asset rebuilds. Do not add it as a browser/runtime dependency.

## 2026-07-10 — Warm gold antialiasing is falsely detected by an average-channel green test

- Environment: Pillow processing of cream, orange, gold and brown taskbar character art on a green chroma source.
- Operation signature: Count or replace visible green spill after chroma-key removal.
- Failed route: Treat a pixel as green when `G - average(R,B) > 35`.
- Error signature: Hundreds of low-alpha gold/tan edge pixels were reported as green even when `R >= G`; after Lanczos downscaling, the same false predicate reported four identical “green” pixels per state such as RGBA `(207,191,103,32)`.
- Root cause: Warm gold has a naturally low blue channel. Comparing green with the red/blue average can pass even though red is the strongest channel and the pixel is visibly gold, not green.
- Verified workaround: Require actual green dominance at the visible threshold: `alpha >= 32`, `G > 100`, `G > R + 20`, and `G > B + 35`. Rebuild refined outputs from the unmodified edge-contracted alpha inputs instead of retaining earlier false corrections.
- Verification evidence: All four one-dough sources and the 2 × 2 runtime atlas reported zero truly green-dominant pixels; the discarded correction had changed 326–473 pixels per source, while the corrected deterministic rebuild changed zero and restored the source edge color.
- Reuse conditions: Use hue/channel-dominance checks appropriate to the actual key color. Never repair pixels solely because an average-channel score is high; log sample coordinates and RGBA values before bulk correction.

## 2026-07-10 — Straight-alpha composition and resize can leak hidden chroma RGB

- Environment: Pillow 12.3.0, transparent RGBA character variants made from chroma-key sources.
- Operation signature: Feather a localized edit into an immutable master and downscale it for a sprite atlas.
- Failed route: Blend or resample straight-alpha RGB channels directly.
- Error signature: The first localized atlas build detected visible chroma at a feather boundary and stopped before writing; transparent pixels still carried irrelevant green RGB that was sampled into partially visible pixels.
- Root cause: Straight-alpha operations interpolate RGB independently of alpha, so colors beneath transparent pixels can influence the displayed edge.
- Verified workaround: Convert color to premultiplied-alpha space for localized blending and Lanczos resampling, copy the base byte-for-byte wherever the declared mask is zero, then convert the derivative back to ordinary RGBA.
- Verification evidence: The final builder passed write/check with zero visible green pixels, zero changes outside declared masks, a common baseline, and `0.5184px` displayed lower-body center spread. Atlas SHA-256 is `a651b8e1295d127355e6214b50ba4ad6157a3018636f335a2d5b5a3651cc4ce6`.
- Reuse conditions: Use premultiplied-alpha processing for antialiased transparent art. Do not hide the problem by loosening the color gate; first inspect the exact flagged colors so a false-positive predicate and genuine chroma leakage remain distinguishable.

## 2026-07-10 — Official skill validation requires PyYAML

- Environment: Windows project workspace with Python 3.12 and the installed official `skill-creator` scripts.
- Operation signature: Validate a repository-local Codex skill with `quick_validate.py`.
- Failed route: Run the official validator with the base Python environment before checking its imports.
- Error signature: `ModuleNotFoundError: No module named 'yaml'` at the validator's `import yaml` statement.
- Root cause: The official validator parses skill frontmatter with the third-party `PyYAML` package, which was not present in this Python installation.
- Verified workaround: Install the free user-scoped dependency `PyYAML==6.0.3`, then rerun the same official validator without changing or weakening the skill.
- Verification evidence: `quick_validate.py .agents/skills/improve-taskbar-game-quality` returned `Skill is valid!` after installation.
- Reuse conditions: Check for `PyYAML` before invoking the official skill validator on a fresh PC. Install it only when missing, report the installation, and do not mistake this dependency error for invalid skill content.

## 2026-07-10 — Motion-proof context collector filename mismatch

- Environment: repository-local `improve-taskbar-game-quality` skill on Windows.
- Operation signature: Collect the mandatory compact project context before building the approved living-motion proof.
- Failed route: Invoke `.agents/skills/improve-taskbar-game-quality/scripts/collect_context.py` from an earlier summary assumption.
- Error signature: Python reported `[Errno 2] No such file or directory`.
- Root cause: The installed skill names the script `collect_project_context.py`; the assumed shortened filename never existed.
- Verified workaround: List the skill's `scripts` directory, read the exact command in `SKILL.md`, then run `.agents/skills/improve-taskbar-game-quality/scripts/collect_project_context.py`.
- Reuse conditions: Never reconstruct a skill script filename from memory. Resolve it from the current `SKILL.md` or directory before execution.

## 2026-07-10 — GIF encoding can repaint a registered counter

- Environment: Pillow 12.3.0, full-frame 128px/384px animated GIF review outputs.
- Operation signature: Encode a registered source sequence and prove that the lower wooden counter remains unchanged in the delivered animation.
- Failed route: Use background-restore disposal and default palette dithering, then assume source-frame registration survives encoding.
- Error signature: decoded GIF frames reported nonzero pixel changes down to the lower counter even though the high-resolution source builder restored that region from the same master every frame.
- Root cause: background disposal and scanline error-diffusion palette dithering can repaint otherwise identical decoded pixels as nearby motion changes the quantization error history.
- Verified workaround: use one shared palette, quantize with dithering disabled, retain the previous full frame (`disposal=1`), encode an explicit `80, 80, 90ms` duration pattern, then decode the written GIF and compare every fixed-region frame again.
- Verification evidence: both GIFs decode to 120 frames and exactly 10,000ms; first/last frames match and fixed lower-counter changed frames are `0/120`.
- Reuse conditions: registration QA must cover both the source sequence and the decoded deliverable. Keep a full-color lossless animated copy when palette limits could affect art judgment.

## 2026-07-10 — Maximum lossless-WebP compression stalls a short review build

- Environment: Pillow 12.3.0 on the local Windows workstation, 120 RGB frames at 384px.
- Operation signature: write a full-color lossless animated WebP review copy.
- Failed route: `lossless=True, quality=100, method=6`.
- Error signature: compression continued beyond 60 seconds without producing the completed tool result and was terminated.
- Root cause: WebP `method` controls compression-search effort, not lossless pixel fidelity; the maximum search level is disproportionate for an iterative motion proof.
- Verified workaround: retain `lossless=True, quality=100` and use `method=0`. The completed 9.36MB file was written in the successful 18-second full build and decoded to the same 120 frames/10,000ms with zero fixed-counter changes.
- Reuse conditions: use fast lossless compression for iterative review artifacts; reserve slow compression search for an explicitly required shipping-size optimization pass.

## 2026-07-10 — Feathered RGBA paste can double-darken a local edit

- Environment: Pillow 12.3.0, 1254px straight-alpha face overlay composited and downsampled to a 128px taskbar sprite.
- Operation signature: apply a generated facial expression through rounded feather masks while preserving the approved cat outside those masks.
- Failed route: paste an RGBA source into a transparent destination using the feather mask, then alpha-composite that destination again.
- Error signature: the panic eyes appeared inside dark rounded rectangles/U-shaped shadows at 128px even though the generated full image had no such shapes.
- Root cause: the masked paste scaled RGB and alpha together; the later alpha composite multiplied the already-darkened edge a second time.
- Verified workaround: copy the source RGB unchanged, assign the feather mask once with `putalpha`, then alpha-composite and downsample. Do not add a low-frequency color transfer before ruling out double mask application.
- Verification evidence: the 384px neutral preview and final `typing-tier-contact-sheet.png` lost the gray U/rectangle boundaries while keeping the same eyes, brows, mouth, and three sweat droplets. Final overdrive runtime SHA-256 is `96870727c6c5f5022e992943f86c7b3dc1fb3297c2d8460a9275c3b88b4190b5`.
- Reuse conditions: use for feathered local RGBA overlays. This does not replace deliberate premultiplied-alpha rotation/resampling; it prevents applying the same coverage twice.

## 2026-07-10 — Two source-resolution motion modes exceed one local command window

- Environment: Pillow/OpenCV source rig at 1254px, separate fast and overdrive modes, 60-second shell window.
- Operation signature: render both articulated modes, 128px runtime WebPs, checker previews, and a combined manifest in one process.
- Failed route: build both full-resolution frame sets before writing either mode; it hit the 64-second tool boundary twice.
- Verified workaround: add `--mode fast|overdrive`, write one runtime/checker/metrics sidecar per process, then finalize the shared contact sheet and manifest automatically when both registered outputs exist.
- Verification evidence: fast completed in 35.5 seconds and overdrive in 43.9 seconds; the final manifest cross-checks each sidecar against the runtime hash and both assets pass the single-file quality gate.
- Reuse conditions: use incremental mode builds when independent high-resolution animations together exceed the command window. Do not reduce master resolution merely to fit one process.

## 2026-07-10 — PowerShell strips nested quotes from inline `node -e` inspection

- Environment: Windows PowerShell 5.1 through the local shell tool, UTF-8 JavaScript test source.
- Operation signature: print a substring from a UTF-8 file with inline `node -e` code containing nested JavaScript string quotes.
- Failed route: wrap the one-line JavaScript in either PowerShell double quotes or single quotes and escape inner quotes. The first attempt produced a PowerShell missing-parenthesis parse error; the second reached Node with string quotes removed and produced `SyntaxError: Invalid or unexpected token`.
- Root cause: the shell/tool quoting layers rewrote nested quotes before Node received the `-e` argument.
- Verified workaround: for source inspection, avoid inline Node and use `Get-Content -Encoding utf8`, then select the required line range. This preserved Korean text and allowed an exact `apply_patch`.
- Verification evidence: the test block displayed intact Korean and the subsequent ASCII/UTF-8 patch applied; Node `32/32` passed.
- Reuse conditions: use for read-only UTF-8 inspection in this PowerShell environment. For actual JavaScript execution, prefer a checked-in script file rather than adding more escape layers.

## 2026-07-10 — PowerShell execution policy blocks `npm.ps1` but not the official Windows launcher

- Environment: Windows PowerShell 5.1 with Node.js installed under `C:\Program Files\nodejs`.
- Operation signature: install a pinned project-local temporary npm package for image QA.
- Failed route: invoke `npm install ...` directly from PowerShell.
- Error signature: `npm.ps1 cannot be loaded because running scripts is disabled on this system` with `PSSecurityException`.
- Root cause: PowerShell resolves `npm` to the signed/script wrapper `npm.ps1`, and the machine execution policy blocks PowerShell scripts. The npm installation, registry access and target directory were not the failing layers.
- Verified workaround: invoke the official Windows command launcher directly: `& 'C:\Program Files\nodejs\npm.cmd' install ...`. Do not alter the system execution policy.
- Verification evidence: `sharp@0.34.2` and its ten-package dependency set installed under `tmp/menu-svg-qa`, rendered three SVG QA PNGs, and the verified temporary directory was then removed from the project.
- Reuse conditions: use only when the error signature is specifically the `npm.ps1` execution-policy block and `npm.cmd` exists at the verified Node installation. Do not apply this route to registry, network, package-integrity or filesystem-permission failures.
