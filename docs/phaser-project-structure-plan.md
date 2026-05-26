# Phaser 프로젝트 구조 계획 v1

작성일: 2026-05-26

## 문서 상태

- 상태: 구현 전 구조 확정안
- 기준 문서: `docs/development-foundation.md`, `docs/data-schema-draft.md`, `docs/vertical-slice-acceptance.md`
- 기준 스택: `Phaser 3 + TypeScript + Vite`
- 아직 하지 않은 것: 실제 `src/` 폴더 생성, Phaser/Vite 설치, 런타임 코드 작성, 에셋 생성

이 문서는 첫 구현 착수 전에 폴더 경계, 데이터 위치, Phaser 씬 책임, 디버그 진입 책임을 고정하기 위한 계획이다.

## 목표

첫 Phaser 구현은 기능을 많이 넣는 것이 목표가 아니다. 목표는 세로 조각 fixture를 읽고, 검증된 데이터만으로 아래 흐름을 실행할 수 있는 구조를 만드는 것이다.

```text
마을 -> 월드맵 -> 던전 진입 -> 방 이동 -> 전투 -> 보상 -> 룬 장착 -> 보스전 -> 결과 -> 마을 복귀
```

이 흐름에서 Phaser는 화면, 씬 전환, 입력 연결, 애니메이션, 카메라, 이펙트를 담당한다. 게임 규칙과 저장 가능한 상태는 Phaser 밖의 simulation 계층이 담당한다.

## 확정 원칙

1. Phaser 씬은 게임 상태의 원본이 아니다.
2. 카드 효과, 적 의도, 보상, 룬 장착, 해금, 세이브는 `simulation/`에서 처리한다.
3. Phaser 씬은 simulation 상태를 읽어 화면으로 보여주고, 입력 action을 simulation에 전달한다.
4. 에셋은 파일 경로가 아니라 manifest key로 참조한다.
5. 세이브에는 Phaser 객체, sprite, tween, texture, animation 객체를 넣지 않는다.
6. 텍스트가 많은 HUD, 메뉴, 설정, 디버그 패널은 DOM overlay를 기본값으로 둔다.
7. 디버그 진입은 첫 구현부터 포함한다.

## 제안 폴더 구조

실제 구현 착수 시 아래 구조를 기준으로 생성한다.

```text
src/
  main.ts
  app/
    createGame.ts
    gameConfig.ts
    runtimeFlags.ts
  data/
    schema.ts
    loadGameData.ts
    validateLoadedData.ts
    assetManifest.slice.v1.json
    fixtures/
      vertical-slice.v1.json
  simulation/
    state/
      gameState.ts
      runState.ts
      combatState.ts
      saveState.ts
    systems/
      combat/
      dungeon/
      rewards/
      runes/
      unlocks/
    rules/
      cardEffects.ts
      enemyIntents.ts
      bossPhases.ts
  input/
    actions.ts
    bindings.ts
    inputRouter.ts
  phaser/
    scenes/
      BootScene.ts
      PreloadScene.ts
      TownScene.ts
      WorldMapScene.ts
      DungeonScene.ts
      CombatScene.ts
      RewardScene.ts
      RuneBenchScene.ts
      BossScene.ts
      ResultScene.ts
    bridge/
      sceneBridge.ts
      sceneEvents.ts
    view/
      camera/
      effects/
      sprites/
  ui/
    hud/
    menus/
    overlays/
  debug/
    debugConfig.ts
    debugEntry.ts
    debugActions.ts
    debugOverlayModel.ts
  save/
    saveCodec.ts
    migrations.ts
    storage.ts
```

에셋은 코드 폴더 밖의 런타임 공개 경로에 둔다.

```text
assets/
  runtime/
    characters/
    enemies/
    bosses/
    environments/
    cards/
    ui/
    icons/
    fx/
    audio/
```

## 책임 분리

| 위치 | 책임 | 금지 |
| --- | --- | --- |
| `src/app/` | Phaser 인스턴스 생성, scale, 기본 config, 런타임 flag 파싱 | 카드 효과나 전투 규칙 직접 처리 |
| `src/data/` | schema, fixture, manifest, 로드 후 검증 | Phaser texture나 sprite 보관 |
| `src/simulation/` | 게임 규칙, 턴, 전투, 보상, 룬 장착, 해금, 저장 가능 상태 | Phaser scene, sprite, tween 참조 |
| `src/input/` | 물리 입력을 action으로 변환 | scene별 임의 단축키 중복 |
| `src/phaser/scenes/` | 씬 생명주기, 화면 전환, render orchestration | 규칙의 원본 상태 보관 |
| `src/phaser/bridge/` | scene과 simulation 사이의 단일 통신 경계 | 전역 mutable state 우회 |
| `src/phaser/view/` | sprite, camera, effect helper | 세이브 대상 상태 저장 |
| `src/ui/` | DOM HUD, 메뉴, overlay | simulation을 직접 변경 |
| `src/debug/` | URL debug entry, debug action, overlay model | 최종 게임 UI처럼 포장 |
| `src/save/` | save encode/decode, migration, storage | Phaser 객체 직렬화 |

## 데이터 이관 기준

구현 착수 시 문서의 draft 데이터를 아래 위치로 이관한다.

| 현재 문서 | 구현 위치 |
| --- | --- |
| `docs/game-data-types.v1.ts` | `src/data/schema.ts` |
| `docs/vertical-slice-data.fixture.v1.json` | `src/data/fixtures/vertical-slice.v1.json` |
| `docs/asset-manifest.slice.v1.json` | `src/data/assetManifest.slice.v1.json` |
| `tools/validate-slice-fixture.mjs` | 그대로 유지하고, 필요 시 `src/data/validateLoadedData.ts`와 검증 규칙을 맞춘다 |

문서 fixture와 runtime fixture가 갈라지면 안 된다. 이관 후에는 문서 쪽을 원본으로 계속 둘지, `src/data/`를 원본으로 승격할지 별도 커밋에서 결정한다.

## 씬 목록

| Scene | 책임 | 입력 |
| --- | --- | --- |
| `BootScene` | runtime flag, 데이터/manifest 위치 확인, save 초기화 준비 | 없음 |
| `PreloadScene` | manifest key 기준 에셋 로드, missing asset 처리 | 없음 |
| `TownScene` | 시작 상태, 해금 상태, 다음 run 진입 | confirm, menu |
| `WorldMapScene` | 스테이지 선택, 잠금 상태 표시 | move, confirm, cancel |
| `DungeonScene` | 방 진행, 다음 방 후보, 보스까지 거리 | move, confirm, cancel |
| `CombatScene` | 전투 state 표시, 카드 선택, 적 의도, 로그 | move, confirm, cancel, card slots |
| `RewardScene` | 보상 후보 표시와 선택 결과 반영 | move, confirm, cancel |
| `RuneBenchScene` | 카드 룬 슬롯, 장착 전후 효과 비교 | move, confirm, cancel |
| `BossScene` | 보스 전투, 페이즈 전환, 보스 보상 연결 | combat actions |
| `ResultScene` | 클리어, 해금, 저장, 마을 복귀 | confirm |

`BossScene`은 초기에 `CombatScene`의 renderer를 재사용할 수 있다. 그래도 scene entry와 debug entry는 따로 둔다. 보스전이 일반 전투의 수치만 바꾼 것처럼 보이면 세로 조각 통과 조건을 만족하지 못한다.

## 입력 action 초안

```ts
type InputAction =
  | "move_up"
  | "move_down"
  | "move_left"
  | "move_right"
  | "confirm"
  | "cancel"
  | "pause"
  | "card_1"
  | "card_2"
  | "card_3"
  | "card_4"
  | "card_5"
  | "end_turn"
  | "toggle_debug";
```

물리 입력은 `src/input/bindings.ts`에서만 관리한다. 씬 내부에서 직접 키 이름을 하드코딩하지 않는다.

## 첫 구현 전 수용 기준

- `src/` 생성 전 이 문서와 `docs/phaser-boot-flow-plan.md`, `docs/debug-entry-plan.md`를 먼저 확인한다.
- 첫 구현은 세로 조각 fixture만 로드한다.
- 첫 구현은 `docs/vertical-slice-smoke-checklist.md`의 `PRE-*`, `DATA-*` 항목을 먼저 겨냥한다.
- `npm.cmd run slice:validate`가 통과하지 않으면 구현 완료로 보지 않는다.
- 브라우저 smoke 전까지는 `Implemented, not verified` 또는 더 낮은 상태로 보고한다.
