# Chef Cat Brisk Grouped Knead v4

## Status

`Implemented, user review required` — v3의 승인 방향 관절 파츠를 그대로 재사용하고, 너무 느렸던 평상시 치대기만 빠른 묶음 리듬으로 다시 구성했다. 키보드 및 빠른 타이핑 전용 모션은 사용자 지시에 따라 다음 단계로 보류했다.

## Scope

- 포함: 좌우 0.45초 간격, 5회씩 두 묶음, 묶음 사이 회복·깜빡임·귀 파닥, 기존 연속 꼬리 살랑.
- 제외: 새 이미지 생성, 새 마스크/파츠 생성, 키보드 입력, 빠른 타이핑 상태, HTML/runtime, 보상·진행 변경.
- 장면 의미: 요리사 고양이가 작업표시줄 위에서 한 덩이 반죽을 지속적으로 치대며 생산 중임을 보여 준다.

## Authoritative rig input

- v3 manifest: `../taskbar-cat-cutout-rig-v3/transparent-rig-manifest.json`
- SHA-256: `68692a3dcbd2389476de291306265b38da072bcba6996c675d1ba64520c85dfe`
- Builder: `scripts/build_transparent_cutout_rig_v4.py`
- v3의 base, head, ears, hat crown, left/right upper arm, left/right forearm/paw, tail, open-eye RGBA 레이어를 바이트 그대로 재사용했다.
- 새 imagegen 호출과 새 전신 프레임 생성은 없다.
- 고양이 메시 변형 레이어는 없다.

각 레이어의 실제 경로와 SHA-256은 `fast-knead-manifest.json`의 `layer_sources`에 기록했다.

## Timing design

- 프레임률: 20fps.
- 길이: 6초, 120프레임, 프레임당 50ms.
- 개별 누름: 0.46초 `예상 → 접촉 → 복귀`.
- 묶음 1: 0.25, 0.70, 1.15, 1.60, 2.05초 — L/R/L/R/L.
- 묶음 2: 3.10, 3.55, 4.00, 4.45, 4.90초 — R/L/R/L/R.
- 묶음 사이: 2.58–2.72초 깜빡임, 2.76초 왼쪽 귀 파닥.
- 마지막 회복: 5.46초 오른쪽 귀 파닥.
- 꼬리: v3와 동일한 3초 주기·±13° 연속 왕복.
- 빠른 반복이 전신 떨림으로 변하지 않도록 v3보다 고개·상완·전완 이동량을 줄이고, 접촉 사슬은 유지했다.

## Outputs

- `chef-cat-fast-knead-motion-128.webp` — 주 128px 투명 WebP.
- `qa/chef-cat-fast-knead-motion-384.webp` — 384px 무손실 투명 검토본.
- `qa/chef-cat-fast-knead-motion-128.png` — 128px APNG.
- `qa/chef-cat-fast-knead-checker-384.gif` — 실제 속도 체커 검토본.
- `qa/fast-knead-contact-sheet.png` — 10회 접촉과 회복 상태표.
- `qa/neutral-light-dark-checker.png` — 투명 가장자리 검토.
- `fast-knead-manifest.json` — 타이밍, 소스 레이어 해시, 출력 해시와 수치 게이트.

## Verification

- 128/384 WebP의 RIFF `ANMF`, APNG, GIF 모두 120프레임 × 50ms = 정확히 6,000ms.
- 모든 출력의 첫/마지막 RGBA 프레임이 동일하다.
- 투명 네 모서리 알파 `0`; 128px 전체 프레임의 최대 보이는 초록 우세 픽셀 `0`.
- 원본 크기 반죽 하단 `(350,1090)–(1010,1140)` 최대 변경 픽셀 `0`.
- 128px APNG에서 원본 고정 영역 내부에 대응하는 `(36,112)–(103,116)` 최대 변경 픽셀 `0`.
- 더 넓은 128px 검사 박스의 y=111 경계에는 Lanczos 축소 영향으로 한 프레임에서 RGB 녹색값 `1` 차이인 픽셀 하나가 있었지만 알파 차이는 `0`이었다. 임계값 완화나 은폐 없이 원본 대응 영역을 다시 계산했다.
- 128px 왼손 접촉 ROI 변화 `687`픽셀, 오른손 접촉 ROI 변화 `440`픽셀, 깜빡임 눈 ROI 변화 `440`픽셀.
- 128px 주 출력, 384px 체커 연속 출력, 밝은/어두운/체커 중립과 접촉표를 실제 속도로 확인했다. 좌우 5회 묶음, 짧은 회복, 연결된 양팔, 한 반죽, 귀/꼬리 경계와 전신 떨림 부재를 검토했다.
- `taskbar-cat-hero-single.html` SHA-256은 작업 전후 모두 `dc21083172c937afec44d4eb319028a8154f9b5e3e268d1005733c612b3e85dc`로 동일하다.
- `scripts/build_transparent_cutout_rig_v4.py` Python 컴파일을 통과했다.

## Remaining limitations

- 사용자 최종 속도 승인이 남아 있다.
- 일반 키보드 접점 피드백은 로컬 런타임에 구현했지만, 빠른 타이핑 burst 모션은 구현하지 않았다.
- Unity import는 변경하지 않았다.
- 이 속도는 승인 전까지 프로젝트 스킬의 보편 규칙으로 승격하지 않고 사용자 검토 후보로 유지한다.

## Local prototype application — 2026-07-10

사용자의 후속 지시 `일단 적용시켜줘봐`에 따라 v4를 로컬 브라우저 프로토타입에 적용했다. 위의 `HTML/runtime 미변경` 기록은 v4 자산 제작 시점의 범위를 설명하며, 현재 상태는 다음과 같다.

- `taskbar-companion.css`: active `ambient-v4`에서 `chef-cat-fast-knead-motion-128.webp`를 표시한다.
- 패널 열림, break/doze, reduced/off, OS reduced-motion에서는 `chef-cat-transparent-neutral-open-eyes.png`로 교체한다. Animated WebP는 CSS `animation-play-state`로 멈출 수 없으므로 이미지 자체를 정지 중립으로 바꾼다.
- `taskbar-widget-core.js`: 런타임 포즈를 `ambient-v4`와 `neutral` 두 상태로 제한한다.
- `app.js`: 구형 baker-v2 key-left/key-right/blink 포즈 전환을 제거했다. 키 종류는 읽거나 저장하지 않으며, 일반 키 입력은 현재 v4를 유지한 채 좌우 접점 피드백만 교대한다. 클릭·휠은 휴식 상태를 깨우는 익명 활동 신호로만 남는다.
- `scripts/build-single.mjs`: WebP Base64 인라인과 v4 해시·128×128·120프레임·6,000ms·루프/루트/크로마 품질 게이트를 추가했다.
- `taskbar-cat-hero-single.html`: v4 WebP, 정지 PNG와 일반 타이핑 피드백을 포함해 재빌드했다. SHA-256 `24f7bd13e5ee33c1acd169ee40f0bbffb27f275218f8148cc4619eee47f036b4`, 16,333,977 bytes.
- 동일한 정지 PNG의 Base64 중복을 막기 위해 CSS 변수로 한 번만 인라인했다. 첫 적용 빌드 20,841,470 bytes에서 최종 16,332,250 bytes로 줄었고 이미지 바이트와 표시 품질은 바뀌지 않았다.
- Node 테스트 `31/31`과 단일 파일 `--check`가 통과했다.

브라우저 정책상 열린 `file:` 탭 제어를 같은 실패 경로로 다시 시도하지 않았다. 실제 페이지 연속 재생은 사용자가 단일 HTML을 새로고침한 뒤 확인해야 하므로 통합 상태는 `Implemented, not live-verified`다.

## Normal typing feedback — 2026-07-10

사용자 피드백 `일반 타이핑에도 뭔가는 있어야지`에 따라 빠른 타이핑 모션보다 앞서 일반 키 입력 피드백을 추가했다.

- 키 입력은 90ms 단위로 합쳐 과도한 점멸과 이벤트 큐를 막는다.
- 수용된 입력마다 좌우 접점이 교대하고, 해당 앞발 아래에 220ms 밀가루 퍼프가 표시된다.
- 작업 티켓은 같은 220ms 동안 `같이 꾹꾹!`으로 바뀌고 테두리가 약하게 빛난다.
- v4 animated WebP는 계속 재생되며 다른 전신 이미지·baker-v2 포즈·전신 흔들기로 교체하지 않는다.
- reaction token의 replace-current 규칙으로 이전 timeout이 새 피드백을 조기에 지우거나 큐로 쌓이지 않는다.
- 키 값, 코드, 텍스트는 읽거나 저장하지 않으며 일반 입력은 보상·작업시간에 영향을 주지 않는다.
- 빠른 타이핑 속도 판정과 전용 관절 burst는 의도적으로 보류했다.

단일 HTML SHA-256은 `24f7bd13e5ee33c1acd169ee40f0bbffb27f275218f8148cc4619eee47f036b4`; Node 테스트는 `31/31`이다. 열린 로컬 `file:` 페이지에서 실제 입력 피드백을 사용자가 확인해야 하므로 상태는 `Implemented, not live-verified`다.
