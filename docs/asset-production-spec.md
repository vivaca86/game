# 에셋 제작 규격 v1

작성일: 2026-05-26

## 상태

- 상태: 1차 확정안
- 기준 엔진: `Phaser 3 + TypeScript + Vite`
- 기준 그래픽풍: `프리미엄 팝업북 판타지 카드 크롤러`
- 기준 화면: `1920x1080`, 16:9
- 원칙: 원화와 런타임 조립 에셋을 분리한다.

## 폴더 구조

```text
assets/
  refs/
  concepts/
  source/
  runtime/
    backgrounds/
    characters/
    monsters/
    bosses/
    cards/
    ui/
    icons/
    effects/
    animation/
  atlases/
  audio/
```

- `refs`: 참고자료, 원작 분석, 무드보드
- `concepts`: 시안, 키아트, 방향성 이미지
- `source`: 원본 PSD, 대형 PNG, 생성 원본
- `runtime`: 게임에서 직접 로드하는 정규화 에셋
- `atlases`: 패킹된 스프라이트 아틀라스
- `audio`: 사운드와 음악

## 공통 제작 원칙

- 통짜 화면 이미지를 게임에 붙이지 않는다.
- 텍스트는 이미지에 굽지 않고 Phaser 또는 DOM overlay에서 렌더링한다.
- 모든 런타임 에셋은 영어 snake_case 파일명을 사용한다.
- 모든 주요 에셋은 ID, 경로, 크기, 앵커, 스타일 키를 메타데이터로 가진다.
- 생성 원본과 게임용 런타임 파일은 분리한다.
- 원본은 가능하면 런타임 기준의 2배 해상도로 만든다.

## 카드 규격

- 표시 기준: `300x440`
- 원본 제작 기준: `600x880`
- 카드 일러스트 영역 원본: `520x360`
- 카드 아이콘 원본: `128x128`
- 카드 비용/타입 아이콘 원본: `96x96`

카드는 아래 조각으로 조립한다.

```text
card_frame_attack.png
card_frame_defense.png
card_frame_skill.png
card_cost_orb.png
card_type_attack.png
card_art_card_sun_jab.png
```

카드명, 비용 숫자, 효과 설명, 상태 문구는 이미지에 굽지 않는다.

## 몬스터와 보스 규격

일반 몬스터:

- 원본 제작: `1024x1024`
- 런타임 기준: `768x768`
- 배경: 투명 PNG
- 앵커: bottom-center, `{ x: 0.5, y: 1.0 }`
- 안전 여백: 상하좌우 8-10%

보스:

- 원본 제작: `1536x1536`
- 런타임 기준: `1100x1100`
- 배경: 투명 PNG
- 앵커: bottom-center, `{ x: 0.5, y: 1.0 }`
- 일반 몬스터 대비 화면 체감 크기: 1.25-1.5배

## 애니메이션 프레임 규격

일반 몬스터:

```text
idle: 4 frames
attack: 6 frames
hit: 3 frames
death: 6 frames
```

보스:

```text
idle: 6 frames
attack: 8 frames
hit: 3 frames
phase: 8 frames
death: 10 frames
```

플레이어 공격과 카드 사용:

```text
card_use: 8 frames
slash: 6 frames
impact: 5 frames
paper_burst: 6 frames
ink_splash: 6 frames
```

## 배경 규격

- 원본 제작: `3840x2160`
- 런타임 기준: `1920x1080`
- 화면비: 16:9
- 몬스터가 올라갈 중앙 공간을 비워 둔다.
- 팝업북 깊이를 위해 레이어를 분리한다.

예시:

```text
bg_stage_forest_back.png
bg_stage_forest_mid.png
bg_stage_forest_front.png
bg_stage_forest_floor.png
bg_stage_forest_props.png
```

## UI 규격

UI는 재사용 가능한 조각으로 만든다.

```text
panel_paper_9slice.png
button_primary_9slice.png
button_danger_9slice.png
tooltip_paper_9slice.png
slot_rune_empty.png
slot_rune_filled.png
```

- 패널은 9-slice를 기본으로 한다.
- 버튼은 `normal`, `hover`, `pressed`, `disabled` 상태를 가진다.
- 한글 렌더링을 위해 텍스트 여백을 넉넉히 둔다.
- UI 질감은 종이, 양피지, 황동 고정핀, 스티커, 유리종이 토큰을 기준으로 한다.

## 룬/보석/유물/아르카나 아이콘

- 원본 제작: `512x512`
- 런타임 사용 크기: `128x128`, `64x64`, `32x32`
- 배경: 투명 PNG
- 작은 크기에서도 실루엣이 읽혀야 한다.

시각 언어:

- 룬/보석: 스티커 + 유리종이 토큰
- 유물: 종이 무대 소품
- 아르카나: 팝업북 장면 카드 또는 운명 페이지

## 이펙트 규격

기본 이펙트 세트:

```text
paper_slash
paper_tear
folded_burst
ink_splash
sticker_spark
stage_spotlight
rune_glow
heal_paper_bloom
```

- 프레임 원본: `512x512` 또는 `1024x1024`
- 배경: 투명 PNG
- 런타임에서는 atlas로 묶는다.
- 실사 파티클보다 종이, 잉크, 접힘, 스티커, 무대 조명 언어를 우선한다.

## 파일명 규칙

전부 영어 snake_case를 사용한다.

```text
{category}_{id}_{state?}_{frame?}_v{version}.png
```

예시:

```text
card_art_sun_jab_v001.png
monster_paper_guardian_idle_0001_v001.png
boss_stage_lion_attack_0003_v001.png
effect_paper_slash_0001_v001.png
ui_panel_paper_9slice_v001.png
```

## 에셋 메타데이터 예시

```json
{
  "id": "monster_paper_guardian",
  "type": "monster",
  "path": "assets/runtime/monsters/monster_paper_guardian.png",
  "anchor": { "x": 0.5, "y": 1.0 },
  "nativeSize": { "w": 768, "h": 768 },
  "sourceSize": { "w": 1024, "h": 1024 },
  "animationSets": ["idle", "attack", "hit", "death"],
  "styleKey": "premium_popup_book",
  "notes": ""
}
```

## 다음 필요 작업

1. 색상 코드와 타입별 UI 세부 규칙 보강
2. 에셋 메타데이터 스키마 작성
3. Phaser atlas 패킹 방식 결정
4. 첫 카드/몬스터/배경/이펙트 샘플 제작
5. 에셋 검증 스크립트 설계
