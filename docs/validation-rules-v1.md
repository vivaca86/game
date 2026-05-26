# 검증 기준 v1

작성일: 2026-05-26

## 상태

- 상태: 세로 조각 기반 검증 기준 및 실행 명령 연결됨
- 기준 타입: `docs/game-data-types.v1.ts`
- 기준 fixture: `docs/vertical-slice-data.fixture.v1.json`
- 기준 manifest: `docs/asset-manifest.slice.v1.json`
- 아직 아님: 본편 전체 콘텐츠 검증, 최종 그래픽 품질 검증, 원작 source/version 확정

## 목적

첫 세로 조각 구현 전에 데이터, 에셋, 원작 대응, 세이브 경계를 무너뜨리지 않기 위한 검사 기준을 고정한다.

## 검증 그룹

| 그룹 | 목적 | 첫 구현 전 상태 |
| --- | --- | --- |
| JSON | fixture와 manifest가 파싱 가능한 JSON인지 확인 | 필수 |
| Schema | 타입 초안의 필수 필드가 데이터에 있는지 확인 | 필수 |
| Reference role | 모든 주요 콘텐츠가 대응표에 연결됐는지 확인 | 필수 |
| Asset key | 데이터가 참조하는 에셋 키가 manifest에 있는지 확인 | 필수 |
| Asset files | planned/runtime manifest 동기화와 실제 runtime 파일 생성 결과 확인 | 에셋 생성 전에는 planned missing 허용, 생성 후 strict 필수 |
| Reward refs | 보상 풀이 참조하는 콘텐츠 ID가 존재하는지 확인 | 필수 |
| Route refs | 스테이지 route가 encounter/event/boss/reward를 찾을 수 있는지 확인 | 필수 |
| Effect text/op | 카드 한글 설명과 실제 effect op/amount가 어긋나지 않는지 확인 | 필수 |
| Save boundary | 세이브 후보가 Phaser 객체 없이 ID와 수치만 갖는지 확인 | 구현 시 필수 |
| Browser smoke | 화면과 상호작용이 체크리스트를 통과하는지 확인 | 구현 후 필수 |

## JSON 검사

필수 조건:

- `docs/vertical-slice-data.fixture.v1.json`은 JSON으로 파싱되어야 한다.
- `docs/asset-manifest.slice.v1.json`은 JSON으로 파싱되어야 한다.
- metadata의 `status`는 `draft_fixture`, `planned_manifest`, `generated_manifest`처럼 완료/승인이 아님을 드러내야 한다.

## 필수 필드 검사

각 콘텐츠의 필수 필드:

```text
id
displayNameKo
descriptionKo
tags
referenceRole
evidence.level
evidence.sources
```

도메인별 필수 필드:

| 도메인 | 추가 필수 필드 |
| --- | --- |
| cards | type, cost, rarity, effects, runeSlots, assetKeys, balance |
| runes | socketType, rarity, effects, validCardTypes, assetKeys, recommendation |
| relics | rarity, effects, assetKeys |
| characters | maxHp, startingEnergy, startingDeck, passives, assetKeys |
| stages | order, biomeKey, route, bossId, rewardPools, assetKeys |
| encounterPools | type, entries, rules |
| enemies | role, maxHp, intents, assetKeys |
| bosses | role, maxHp, intents, phases, assetKeys |
| events | choices, assetKeys |
| rewardPools | entries, rules |
| unlocks | trigger, grants |

## Reference role 검사

필수 조건:

- 모든 주요 콘텐츠의 `referenceRole`은 `docs/reference-role-map-slice-v1.md`에 등장해야 한다.
- `referenceRole`이 없는 fixture 행은 세로 조각 데이터에 넣지 않는다.
- `Needs direct proof` 상태의 값은 `draft`로 취급하고, 최종값처럼 보고하지 않는다.

## Asset key 검사

검사 대상:

- 카드: `assetKeys.frame`, `assetKeys.illustration`, `assetKeys.typeIcon`
- 룬/보석: `assetKeys.icon`
- 유물/아르카나: `assetKeys.icon`
- 캐릭터: `assetKeys.portrait`, `assetKeys.sprite`
- 스테이지: `assetKeys.backgroundSet`, `assetKeys.mapIcon`
- 몬스터/보스: `assetKeys.sprite`, `assetKeys.intentIcons[]`, `phases[].visualCueKey`
- 이벤트: `assetKeys.scene`

필수 조건:

- 모든 asset key는 `docs/asset-manifest.slice.v1.json`의 `assets[].key`에 있어야 한다.
- manifest에 있는 path는 `assets/runtime/` 아래를 가리켜야 한다.
- manifest status가 `planned_manifest`이면 실제 파일 존재를 요구하지 않는다.
- manifest status가 `generated_manifest`이면 개발용 runtime 파일 존재와 크기를 요구하지만, 최종 아트 승인으로 보지 않는다.

## Asset file 검사

필수 조건:

- `docs/asset-manifest.slice.v1.json`과 `src/data/assetManifest.slice.v1.json`의 metadata와 asset entry가 서로 같아야 한다.
- manifest key와 path는 중복될 수 없다.
- manifest path는 브라우저 URL 기준 `assets/runtime/`이고, 저장소의 실제 파일은 `public/assets/runtime/` 아래에 둔다.
- 실제 파일이 존재하면 PNG header 기준 `nativeSize`와 일치해야 한다.
- spritesheet는 `nativeSize`가 `frameSize`로 나누어 떨어져야 한다.
- `assets/runtime/` 아래 실제 이미지 파일이 manifest에 없으면 strict 모드에서 실패한다.
- `planned_manifest` 상태에서는 파일 미존재를 에셋 완료 실패가 아니라 planned missing으로 보고한다.
- `generated_manifest` 상태와 strict 모드는 파일 누락을 실패로 잡는다.

## Reward refs 검사

필수 조건:

- reward entry의 `contentId`는 해당 type의 데이터에 있어야 한다.
- `type: "unlock"`은 `unlocks[].id`를 참조해야 한다.
- `type: "heal"`과 `type: "currency"`는 `contentId` 없이 `amount`를 가질 수 있다.
- reward pool은 빈 `entries`를 가질 수 없다.
- unlock grant의 `type: "stage_clear"`는 `stages[].id`를 참조해야 하며, 새 스테이지 해금이 아니라 진행 상태 변화로 취급한다.

## Route refs 검사

필수 조건:

- stage의 `bossId`는 `bosses[].id`에 있어야 한다.
- route의 `rewardPoolId`는 `rewardPools[].id`에 있어야 한다.
- `type: "combat"`, `"elite"`, `"event"`, `"boss"`의 `encounterPoolId`는 `encounterPools[].id`를 참조해야 한다.
- encounter pool의 `type`은 방 타입과 일치해야 한다.
- combat/elite pool entries는 `enemies[].id`, event pool entries는 `events[].id`, boss pool entries는 `bosses[].id`를 참조해야 한다.
- boss room의 encounter pool은 해당 stage의 `bossId`를 포함해야 한다.

## Smoke checklist 연결

구현 후 아래 문서의 항목 상태를 갱신한다.

- `docs/vertical-slice-smoke-checklist.md`

연결 기준:

| 문서 항목 | 검증 출처 |
| --- | --- |
| DATA-* | fixture, manifest, validation script |
| UI-* | 브라우저 스크린샷 |
| COMBAT-* | 전투 debug state와 로그 |
| LOOP-* | 수동 또는 자동 full-loop smoke |
| VIEW-* | 1920x1080, 1280x720 스크린샷 |

## 현재 검증 명령

Slice fixture 검증:

```powershell
npm run slice:validate
```

Slice card effect text/op 감사:

```powershell
npm run slice:effects
```

Asset manifest/file 감사:

```powershell
npm run assets:generate:dev
npm run assets:audit
```

이 PowerShell 환경에서 `npm.ps1` 실행 정책에 막히면 아래 명령을 사용한다.

```powershell
npm.cmd run slice:validate
npm.cmd run slice:effects
npm.cmd run assets:generate:dev
npm.cmd run assets:audit
npm.cmd run assets:audit:strict
```

PowerShell JSON 파싱 보조:

```powershell
Get-Content docs/vertical-slice-data.fixture.v1.json -Raw | ConvertFrom-Json | Out-Null
Get-Content docs/asset-manifest.slice.v1.json -Raw | ConvertFrom-Json | Out-Null
```

Git whitespace 검사:

```powershell
git diff --check
```

TypeScript 구문 검사:

```powershell
tsc --noEmit --strict --skipLibCheck docs/game-data-types.v1.ts
```

현재 PC에는 `tsc`가 없을 수 있다. 이 경우 타입 컴파일은 `Implemented, not verified`가 아니라 `not verified by compiler`로 보고한다.

## 다음 작업

1. 새 카드/effect op를 추가할 때 `slice:effects` 규칙과 Phaser slice simulation 처리를 함께 갱신한다.
2. 원작 대응 기준은 source/version 확인이 끝날 때까지 별도 검증으로 유지한다.
