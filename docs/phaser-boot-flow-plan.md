# Phaser 부트 플로우 계획 v1

작성일: 2026-05-26

## 문서 상태

- 상태: 구현 전 부트 순서 확정안
- 기준 구조: `docs/phaser-project-structure-plan.md`
- 아직 하지 않은 것: 실제 Phaser 앱 생성, 브라우저 실행, asset preload 구현

## 목표

첫 런타임은 데이터를 조용히 무시하고 빈 화면을 띄우면 안 된다. 부트 단계에서 fixture, manifest, debug entry, save boundary가 확인되어야 한다.

## 부트 순서

```text
main.ts
  -> parseRuntimeFlags()
  -> createGame()
  -> BootScene
  -> PreloadScene
  -> entry scene 선택
```

## 단계별 책임

### 1. `main.ts`

- DOM mount 지점을 확인한다.
- URL query를 읽어 `runtimeFlags`로 변환한다.
- `createGame(runtimeFlags)`를 호출한다.
- 직접 데이터나 Phaser scene state를 만들지 않는다.

### 2. `createGame.ts`

- Phaser config를 만든다.
- 기준 해상도는 `1920x1080`, 최소 검증 해상도는 `1280x720`로 둔다.
- scale mode와 canvas parent를 고정한다.
- scene 배열은 `BootScene`, `PreloadScene`, 실제 entry scenes 순서로 등록한다.
- debug flag는 config data 또는 registry에 넣되 save에 넣지 않는다.

### 3. `BootScene`

`BootScene`은 화면을 예쁘게 만드는 씬이 아니라 실패를 빨리 드러내는 씬이다.

필수 작업:

- fixture와 manifest 위치 확인
- `validateLoadedData` 실행
- save codec 초기화
- debug config 생성
- seed 결정
- 시작 entry 결정
- boot context 생성

부트 context 초안:

```ts
interface BootContext {
  dataBundle: GameDataBundle;
  assetManifest: AssetManifestEntry[];
  save: SaveData;
  debug: DebugConfig;
  seed: string;
  entry: DebugEntry | NormalEntry;
}
```

`BootContext`에는 Phaser sprite, texture, tween, scene 인스턴스를 넣지 않는다.

### 4. `PreloadScene`

`PreloadScene`은 manifest key 기준으로만 로드한다.

필수 작업:

- `assets[].key` 중복 검사
- `assets[].path`가 `assets/runtime/` 아래인지 검사
- `type`별 Phaser loader 호출 분리
- 누락 에셋 처리 정책 적용
- preload 완료 후 entry scene으로 이동

누락 에셋 정책:

| 모드 | 처리 |
| --- | --- |
| 일반 모드 | 누락 에셋이 있으면 부트 실패로 보고한다. |
| debug 모드 | 누락 에셋에 한해 fallback placeholder를 만들 수 있다. 다만 화면과 로그에 fallback임을 남긴다. |

`generated_manifest`는 개발용 placeholder 파일이 있다는 뜻이지 최종 에셋 완료가 아니다. placeholder가 보인 상태를 아트 통과로 말하지 않는다.

### 5. Entry scene 선택

일반 실행의 기본 entry는 `TownScene`이다.

debug 실행은 `docs/debug-entry-plan.md`의 query를 따른다.

```text
?debug=1&entry=combat&stage=stage_lantern_foyer&seed=dev-001
```

## 정상 흐름

```text
TownScene
  -> WorldMapScene
  -> DungeonScene
  -> CombatScene
  -> RewardScene
  -> RuneBenchScene
  -> BossScene
  -> ResultScene
  -> TownScene
```

첫 구현에서 모든 scene이 완성 UI일 필요는 없다. 다만 scene entry, state handoff, debug entry가 끊기면 세로 조각 구현으로 보지 않는다.

## 실패 처리

아래 상황은 조용히 넘어가지 않는다.

- JSON parse 실패
- fixture 필수 그룹 누락
- `referenceRole` 누락
- manifest key 누락
- stage route가 없는 content id 참조
- save decode 실패
- debug entry가 없는 stage, room, card, rune, boss를 참조
- 에셋 누락을 일반 모드에서 조용히 숨김

실패 시에는 console error와 debug/error overlay에 같은 원인을 남긴다.

## 검증 연결

첫 구현 전후 검증은 아래 순서로 연결한다.

1. `npm.cmd run slice:validate`
2. JSON parse 보조 검사
3. Vite/Phaser dev server 실행
4. `?debug=1&entry=town`
5. `?debug=1&entry=combat`
6. `?debug=1&entry=boss`
7. 1920x1080과 1280x720 screenshot 확인

현재 문서 작업에서는 3번 이후를 실행하지 않는다. 아직 실제 Phaser 앱이 없기 때문이다.
