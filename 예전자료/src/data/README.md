# 데이터 구조

이 폴더는 새 카드 던전 게임의 콘텐츠와 한글 문구를 보관한다.

- `ko/strings.json`: UI, 버튼, 도움말, 알림 문구
- `ko/cards.json`: 카드
- `ko/gems.json`: 보석과 카드 소켓 효과
- `ko/relics.json`: 런 중 획득하는 유물
- `ko/arcanas.json`: 런 규칙을 크게 바꾸는 기운
- `ko/characters.json`: 플레이어 캐릭터
- `ko/enemies.json`: 일반 몬스터, 정예, 보스
- `ko/stages.json`: 스테이지와 방 구성
- `ko/events.json`: 이벤트 방과 선택지
- `ko/meta-upgrades.json`: 마을, 영구 성장, 해금
- `ko/achievements.json`: 업적과 보상 연결
- `ko/content-targets.json`: 전체 콘텐츠 규모 목표

현재 파일은 풀 규모 콘텐츠 골격이며, 전투 코어와 프로필/해금/보상 흐름에서 직접 읽는다.
