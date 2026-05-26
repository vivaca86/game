# 데이터 스키마 초안 v1

작성일: 2026-05-26

## 상태

- 상태: 초안
- 기준 문서: `docs/development-foundation.md`
- 기준 엔진: `Phaser 3 + TypeScript + Vite`
- 목적: 구현 전에 데이터 경계, 공통 필드, 검증 단위를 고정한다.
- 아직 아님: 최종 JSON Schema, 실제 런타임 타입, 전체 콘텐츠 입력, 원작 95% 대응 판정

## 원칙

- 게임 규칙 데이터는 렌더러와 분리한다.
- Phaser 씬은 데이터를 읽어 표현하지만, 데이터의 원본이 되지 않는다.
- 게임에 보이는 문구는 한글 표시 필드나 locale 계층에서 관리한다.
- 내부 ID, 파일명, 타입 키는 영어 snake_case를 쓴다.
- 모든 주요 데이터는 원작의 기능적 역할을 추적하는 `referenceRole`을 가진다.
- 원작 이름, 원작 문구, 원작 그래픽을 직접 복제하지 않는다.
- 근거 수준이 낮은 값은 구현 확정값처럼 쓰지 않는다.

## 증거와 승인 상태

각 주요 콘텐츠는 아래 필드를 가진다.

```ts
evidence: {
  level: "none" | "source_level" | "direct_ui" | "runtime_verified" | "approved_originalized";
  sources: string[];
  notes?: string;
}
```

- `none`: 아직 근거가 없다.
- `source_level`: 조사 문서나 외부 자료에 근거가 있으나 직접 UI/런타임 증거는 아니다.
- `direct_ui`: 원작 UI, 영상 프레임, 스크린샷, 게임 파일 등 플레이어 표면 증거가 있다.
- `runtime_verified`: 우리 구현에서 데이터가 실제 동작까지 검증됐다.
- `approved_originalized`: 원작 기능 역할은 유지하면서 이름, 그래픽, 문구가 독자 IP로 승인됐다.

## 공통 필드

```ts
type ContentId = string;
type AssetKey = string;
type LocaleKey = string;

interface BaseContent {
  id: ContentId;
  displayNameKo: string;
  descriptionKo: string;
  tags: string[];
  referenceRole: string;
  evidence: EvidenceInfo;
  notes?: string;
}
```

공통 규칙:

- `id`: 영어 snake_case, 파일명과 독립적으로 유지
- `displayNameKo`: 게임 표시 이름
- `descriptionKo`: 게임 표시 설명
- `tags`: 검색, 필터, 밸런스, 보상 풀에 쓰는 분류 키
- `referenceRole`: 원작의 기능적 대응 역할
- `evidence`: 근거와 승인 상태
- `notes`: 임시 판단, 보류, 리스크

## 카드

```ts
interface CardData extends BaseContent {
  type: "attack" | "defense" | "skill" | "curse" | "event" | "special";
  cost: number;
  rarity: "starter" | "common" | "rare" | "epic" | "legendary";
  colorKey?: string;
  effects: CardEffect[];
  runeSlots: RuneSlotSpec[];
  upgrade?: CardUpgradeSpec;
  evolution?: EvolutionRef;
  assetKeys: {
    frame: AssetKey;
    illustration: AssetKey;
    typeIcon: AssetKey;
  };
  balance: {
    role: string;
    powerBand: "starter" | "early" | "mid" | "late" | "boss";
    expectedValue?: number;
  };
}
```

카드 검증 규칙:

- 비용, 타입, 효과가 비어 있으면 안 된다.
- 한글 설명과 실제 `effects`가 어긋나면 실패한다.
- 모든 카드는 최소 하나의 전투 또는 보상 역할을 가져야 한다.
- `referenceRole` 없는 카드는 세로 조각에 넣지 않는다.

## 룬과 보석

```ts
interface RuneData extends BaseContent {
  socketType: "attack" | "defense" | "skill" | "any";
  rarity: "common" | "rare" | "epic" | "legendary";
  effects: RuneEffect[];
  validCardTypes: CardData["type"][];
  assetKeys: {
    icon: AssetKey;
  };
  recommendation: {
    bestRoles: string[];
    warning?: string;
  };
}
```

룬/보석 검증 규칙:

- 장착 가능 카드 타입이 명시되어야 한다.
- 효과가 카드 사용 시점, 턴 시작, 피격, 보상 등 어느 타이밍에 발동하는지 분명해야 한다.
- 추천 장착 역할이 없으면 보상 선택 UI에 올리지 않는다.

## 유물과 아르카나

```ts
interface RelicData extends BaseContent {
  rarity: "common" | "rare" | "epic" | "legendary";
  effects: PassiveEffect[];
  unlockId?: ContentId;
  assetKeys: { icon: AssetKey };
}

interface ArcanaData extends BaseContent {
  slotType: "run_start" | "event_reward" | "boss_reward";
  effects: PassiveEffect[];
  unlockId?: ContentId;
  assetKeys: { icon: AssetKey };
}
```

검증 규칙:

- 패시브 효과는 저장 가능한 상태와 런타임 계산 위치를 가져야 한다.
- 토글, 선택 제한, 중복 획득 가능 여부를 명시한다.
- 원작 증거가 source-level뿐이면 최종 수치로 고정하지 않는다.

## 캐릭터

```ts
interface CharacterData extends BaseContent {
  maxHp: number;
  startingEnergy: number;
  startingDeck: ContentId[];
  passives: PassiveEffect[];
  unlockId?: ContentId;
  assetKeys: {
    portrait: AssetKey;
    sprite?: AssetKey;
  };
}
```

검증 규칙:

- 시작 덱의 모든 카드 ID가 존재해야 한다.
- 캐릭터마다 플레이 이유가 되는 패시브 또는 시작 덱 차이가 있어야 한다.
- 표시 문구와 실제 패시브 효과가 일치해야 한다.

## 스테이지와 방

```ts
interface StageData extends BaseContent {
  order: number;
  biomeKey: string;
  route: RoomSlot[];
  bossId: ContentId;
  unlockId?: ContentId;
  rewardPools: ContentId[];
  assetKeys: {
    backgroundSet: AssetKey;
    mapIcon: AssetKey;
  };
}

interface RoomSlot {
  id: ContentId;
  type: "combat" | "elite" | "event" | "shop" | "rest" | "reward" | "boss";
  encounterPoolId?: ContentId;
  rewardPoolId?: ContentId;
}
```

검증 규칙:

- 스테이지는 최소 전투, 보상, 보스 흐름을 가져야 한다.
- 방 타입별 UI와 보상 풀이 연결되어야 한다.
- 1차 세로 조각에서는 한 스테이지라도 마을 복귀까지 닫힌 루프가 필요하다.

## 몬스터와 보스

```ts
interface EnemyData extends BaseContent {
  role: "attacker" | "defender" | "disruptor" | "summoner" | "hybrid";
  maxHp: number;
  block?: number;
  intents: EnemyIntent[];
  assetKeys: {
    sprite: AssetKey;
    intentIcons: AssetKey[];
  };
}

interface BossData extends EnemyData {
  phases: BossPhase[];
}
```

검증 규칙:

- 의도는 플레이어가 다음 행동을 판단할 수 있게 표시되어야 한다.
- 보스는 일반 몬스터보다 큰 실루엣과 페이즈 변화를 가져야 한다.
- 수치만 다른 몬스터를 고유 몬스터처럼 등록하지 않는다.

## 이벤트와 보상 풀

```ts
interface EventData extends BaseContent {
  choices: EventChoice[];
  assetKeys: {
    scene: AssetKey;
  };
}

interface RewardPoolData {
  id: ContentId;
  displayNameKo: string;
  entries: RewardEntry[];
  rules: RewardRule[];
}
```

검증 규칙:

- 이벤트 선택지는 비용, 위험, 보상이 모두 보여야 한다.
- 보상 풀은 카드, 룬/보석, 유물, 아르카나, 재화 중 어떤 축을 주는지 명확해야 한다.
- 선택 후 결과가 전투, 장착, 해금, 마을 복귀 중 어디로 이어지는지 표시한다.

## 해금, 진화, 파워업

```ts
interface UnlockData extends BaseContent {
  trigger: UnlockTrigger;
  grants: UnlockGrant[];
}

interface EvolutionData extends BaseContent {
  fromCardId: ContentId;
  requiredRuneIds?: ContentId[];
  requiredRelicIds?: ContentId[];
  resultCardId: ContentId;
}

interface PowerUpData extends BaseContent {
  maxRank: number;
  ranks: PowerUpRank[];
}
```

검증 규칙:

- 해금 조건은 저장 데이터에서 재계산 가능해야 한다.
- 진화는 재료 소모 여부, 카드 대체 방식, UI 표시 규칙을 가진다.
- 파워업은 비용, 랭크, 환불/초기화 가능 여부를 명시한다.

## 세이브 경계

```ts
interface SaveData {
  saveVersion: number;
  profile: ProfileState;
  currentRun?: RunState;
  settings: SettingsState;
}
```

세이브 원칙:

- 세이브에는 Phaser 오브젝트, 이미지 객체, 애니메이션 객체를 넣지 않는다.
- 세이브는 ID, 수치, 선택 상태, 해금 상태만 가진다.
- `saveVersion`을 통해 마이그레이션 가능하게 만든다.
- 디버그 세이브와 실제 세이브를 구분한다.

## 에셋 매니페스트

```ts
interface AssetManifestEntry {
  key: AssetKey;
  type: "image" | "spritesheet" | "atlas" | "audio" | "font";
  path: string;
  nativeSize?: { w: number; h: number };
  frameSize?: { w: number; h: number };
  anchor?: { x: number; y: number };
  styleKey: "premium_popup_book";
}
```

검증 규칙:

- 데이터가 참조하는 모든 `assetKeys`는 매니페스트에 있어야 한다.
- 런타임 에셋과 참고 이미지 경로가 섞이면 실패한다.
- 텍스트는 이미지에 굽지 않는다.

## 작성된 후속 산출물

1. `docs/game-data-types.v1.ts`: 복사 가능한 TypeScript 타입 초안
2. `docs/vertical-slice-content-candidates.md`: 세로 조각 최소 콘텐츠 후보

## 다음 작업

1. `docs/game-data-types.v1.ts`를 실제 프로젝트 생성 시 `src/data/schema.ts` 또는 동등한 위치로 옮긴다.
2. 각 데이터 그룹별 최소 샘플 1개를 작성한다.
3. `referenceRole` 누락 검사 규칙을 만든다.
4. 에셋 매니페스트와 데이터 참조 검증 스크립트를 설계한다.
5. 세로 조각 후보 데이터를 fixture로 만든다.
