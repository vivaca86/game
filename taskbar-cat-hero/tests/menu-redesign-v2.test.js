const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("menu redesign v2 keeps rejected menu-v1 raster art out of the prototype", () => {
  const html = read("prototypes/menu-redesign-v2/index.html");
  const css = read("prototypes/menu-redesign-v2/styles.css");
  const source = `${html}\n${css}`;

  assert.doesNotMatch(source, /assets\/menu-v1\//);
  assert.match(source, /taskbar-cat-cutout-rig-v4\/chef-cat-transparent-neutral-open-eyes\.png/);
  assert.doesNotMatch(source, /<progress\b|class="[^"]*progress/);
});

test("menu redesign v2 exposes three distinct directions and one primary home action", () => {
  const html = read("prototypes/menu-redesign-v2/index.html");

  assert.equal((html.match(/data-direction="[abc]"/g) || []).length, 3);
  assert.match(html, /A · 고양이 홈/);
  assert.match(html, /B · 하루 계획표/);
  assert.match(html, /C · 식당 공간/);
  assert.equal((html.match(/class="primary-action"/g) || []).length, 1);
  assert.match(html, /작업표시줄 반영/);
  assert.match(html, /수확 → 요리 → 작업표시줄 변화/);
});

test("recommended direction reduces the primary navigation to four purposeful views", () => {
  const html = read("prototypes/menu-redesign-v2/index.html");
  const nav = html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)?.[0] || "";

  assert.equal((nav.match(/class="nav-item/g) || []).length, 4);
  for (const label of ["오늘", "주방", "농장", "고양이"]) assert.match(nav, new RegExp(`>${label}<`));
  for (const rejected of ["assets/menu-v1", "UP", "받기"]) assert.doesNotMatch(nav, new RegExp(rejected));
});

test("prototype interactions are bounded and communicate a taskbar consequence", () => {
  const script = read("prototypes/menu-redesign-v2/prototype.js");

  assert.match(script, /selectDirection/);
  assert.match(script, /selectView/);
  assert.match(script, /#startAction/);
  assert.match(script, /#taskbarResult/);
  assert.match(script, /작업표시줄 고양이/);
  assert.doesNotMatch(script, /localStorage|fetch\(|XMLHttpRequest|innerHTML/);
});

test("control-state lab defines a complete intentional game-control family", () => {
  const html = read("prototypes/menu-redesign-v2/control-states.html");
  const css = read("prototypes/menu-redesign-v2/styles.css");

  for (const state of ["DEFAULT", "HOVER", "FOCUS", "PRESSED", "DISABLED", "READY / CLAIM"]) {
    assert.match(html, new RegExp(state.replace(" / ", " \/ ")));
  }
  assert.match(css, /\.primary-action:hover/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.primary-action:disabled/);
  assert.match(css, /\.primary-action\.is-ready/);
  assert.match(html, /준비됨/);
  assert.match(html, /비어 있음/);
  assert.doesNotMatch(html, /<progress\b/);
});

test("prototype manifest traces the approved anchor and every deterministic QA output", () => {
  const manifest = JSON.parse(read("prototypes/menu-redesign-v2/prototype-manifest.json"));

  assert.equal(manifest.status, "prototype_not_production_approved");
  assert.equal(manifest.rejected_menu_v1_raster_references, 0);
  assert.match(manifest.character_anchor.path, /taskbar-cat-cutout-rig-v4\/chef-cat-transparent-neutral-open-eyes\.png/);
  assert.equal(manifest.character_anchor.sha256.length, 64);
  assert.equal(manifest.outputs.length, 4);
  for (const output of manifest.outputs) {
    assert.equal(output.sha256.length, 64);
    assert.equal(output.size[0], 1280);
  }
});

test("prototype ids and accessibility landmarks remain unambiguous", () => {
  const html = read("prototypes/menu-redesign-v2/index.html");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);

  assert.equal(new Set(ids).size, ids.length);
  assert.match(html, /role="tablist"/);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-label="관리창 주요 메뉴"/);
  assert.match(html, /alt="한 덩이 반죽 앞에 있는 요리사 고양이 모모"/);
});
