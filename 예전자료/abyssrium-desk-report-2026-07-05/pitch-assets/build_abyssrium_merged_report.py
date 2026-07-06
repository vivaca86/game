from __future__ import annotations

import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "abyssrium-desk-merged-report"
OUT.mkdir(exist_ok=True)

CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
HTML = OUT / "slides.html"
PPTX = Path(r"C:\Users\i\Downloads\Abyssrium_Desk_merged_report.pptx")

MVP_DEFAULT = "../abyssrium-desk-mvp-default.png"
MVP_EXPANDED = "../abyssrium-desk-mvp-expanded.png"


SLIDES = [
    f"""
    <section class="slide cover">
      <div class="cover-copy">
        <div class="kicker light">시장성 검토 · MERGED REPORT</div>
        <h1>작업표시줄 위에 사는 작은 심해</h1>
        <p>어비스리움 IP를 PC 작업 흐름 안으로 확장하는 데스크톱 companion 시장성·게임성 검토.</p>
        <div class="chips dark"><span>Steam APIs</span><span>SteamDB</span><span>Game concept</span></div>
      </div>
      <div class="cover-visual">
        <img src="{MVP_EXPANDED}" alt="">
      </div>
      <div class="cover-foot"><b>Abyssrium Desk</b><span>checked 2026-07-04</span></div>
    </section>
    """,
    """
    <section class="slide summary">
      <div class="kicker">결론</div>
      <h2>작게 들어와<br>오래 남는 IP</h2>
      <p class="lead">무료 설치형 데스크톱 companion으로 들어오고, 업무 옆에서 감정 기반 리텐션과 코스메틱 수익화를 만든다.</p>
      <div class="thesis-row">
        <div><b>무료 진입</b><span>설치 장벽을 낮추고 바이럴을 먼저 만든다.</span></div>
        <div><b>작업 흐름 상주</b><span>게임을 켜는 시간이 아니라 PC 사용 시간을 점유한다.</span></div>
        <div><b>코스메틱 수익화</b><span>장터 경제가 아니라 애착 기반 꾸미기로 간다.</span></div>
      </div>
      <div class="proofs">
        <div><small>Bongo Cat · Steam 리뷰</small><b>105K+</b><span>긍정 96.6%</span></div>
        <div><small>TBH · Steam 리뷰</small><b>36K+</b><span>긍정 51.5%</span></div>
        <div><small>Abyssrium 기존 유저 주장</small><b>65M+</b><span>힐링 수족관 문법 보유</span></div>
      </div>
    </section>
    """,
    """
    <section class="slide market">
      <div class="kicker">수요 검증</div>
      <h2>Steam에서 이미 검증된 관심</h2>
      <div class="bars">
        <div class="bar-col main"><div class="value">105K+</div><div class="bar h1"></div><b>Bongo Cat</b><span>리뷰 · 긍정 96.6%</span></div>
        <div class="bar-col risk"><div class="value">36K+</div><div class="bar h2"></div><b>TBH</b><span>리뷰 · 긍정 51.5%</span></div>
        <div class="bar-col tag"><div class="value">100+</div><div class="bar h3"></div><b>Desktop Companion</b><span>SteamDB 태그 신호</span></div>
      </div>
      <p class="bottom-line">리뷰 수는 관심의 크기를, 태그 등록은 장르가 형성되는 초기 신호를 보여준다.</p>
      <div class="source">출처 · Steam Reviews API / SteamDB</div>
    </section>
    """,
    """
    <section class="slide category">
      <div class="kicker">시장 규모</div>
      <h2>작지만 빠르게 형성되는 장르</h2>
      <div class="category-grid">
        <div class="mega">
          <b>28</b>
          <span>실제 taskbar / 화면 하단 상주형 후보</span>
          <p>Steam “taskbar” 검색 153건 중 실제 상주형 후보는 28종. 아직 소수만 존재하는 초기 시장으로, 브랜드 IP가 먼저 자리를 잡을 여지가 크다.</p>
        </div>
        <div class="status">
          <div><b>16</b><span>출시된 후보</span></div>
          <div><b>12</b><span>출시 예정 후보</span></div>
          <div><b>18%</b><span>검색 결과 대비 실제 후보 비율</span></div>
        </div>
      </div>
      <div class="source">출처 · Steam Store 검색 / SteamDB 태그 확인</div>
    </section>
    """,
    """
    <section class="slide reviews">
      <div class="kicker">리뷰 분석</div>
      <h2>긍정은 감정에서,<br>부정은 손실감에서 나온다</h2>
      <div class="review-pair">
        <div class="review-card positive">
          <div class="card-head"><b>Bongo Cat</b><span>리뷰 105K+</span></div>
          <div class="score">96.6% <span>긍정</span></div>
          <div class="mini-bars">
            <div><span>짧은 밈 리뷰</span><b>66.2K</b><i style="--w:100%"></i></div>
            <div><span>귀여움·밈 언급</span><b>36.6K</b><i style="--w:55%"></i></div>
            <div><span>무료·힐링 언급</span><b>20.3K</b><i style="--w:31%"></i></div>
            <div><span>작업 중 상주</span><b>7.7K</b><i style="--w:12%"></i></div>
          </div>
          <p>“귀엽다”는 감정이 설치와 공유의 이유가 됐다.</p>
        </div>
        <div class="review-card negative">
          <div class="card-head"><b>TBH</b><span>리뷰 36K+</span></div>
          <div class="score">51.5% <span>긍정</span></div>
          <div class="mini-bars">
            <div><span>장터·아이템 손실</span><b>7.3K</b><i style="--w:100%"></i></div>
            <div><span>서버·접속·버그</span><b>4.8K</b><i style="--w:66%"></i></div>
            <div><span>신뢰·정책 불만</span><b>2.5K</b><i style="--w:34%"></i></div>
            <div><span>DLC·P2W 인식</span><b>1.6K</b><i style="--w:22%"></i></div>
          </div>
          <p>관심은 컸지만, 장터 경제가 분노의 중심이 됐다.</p>
        </div>
      </div>
      <p class="bottom-line">Abyssrium Desk는 Bongo Cat의 감정 구조를 따르고, TBH의 장터 리스크를 피한다.</p>
    </section>
    """,
    f"""
    <section class="slide ipfit">
      <div class="kicker">IP 적합성</div>
      <h2>어비스리움은 이미<br>“방치형 힐링 수족관”이다</h2>
      <div class="ip-layout">
        <div class="ip-copy">
          <div class="big-blue">65M+</div>
          <p>모바일에서 검증된 정서: 조용함, 수집, 성장, 나만의 바다.</p>
          <div class="chips"><span>조용함</span><span>수집</span><span>성장</span><span>나만의 바다</span></div>
        </div>
        <div class="compare-card">
          <div><b>모바일</b><span>방치형 힐링 수족관</span></div>
          <i></i>
          <div><b>PC</b><span>업무 옆 companion</span></div>
          <p>같은 정서가 업무 옆에 오래 머무는 문법으로 바뀐다.</p>
        </div>
      </div>
      <img class="wide-strip" src="{MVP_EXPANDED}" alt="">
    </section>
    """,
    f"""
    <section class="slide principle">
      <div class="kicker">제품 원칙</div>
      <h2>평소엔 얇게. 필요할 때만 크게.</h2>
      <p class="lead">확장은 선택이다. 기본값은 언제나 업무에 양보한다.</p>
      <div class="state-pair">
        <div class="state">
          <div class="state-label"><b>기본 상태</b><span>56px 리프 바 · 항상</span></div>
          <img src="{MVP_DEFAULT}" alt="">
          <ul><li>작업표시줄 위 56px만 차지</li><li>키보드 입력에 버블·빛으로 반응</li><li>물고기가 업무 옆을 조용히 유영</li></ul>
        </div>
        <div class="click-dot">클릭 1회</div>
        <div class="state">
          <div class="state-label"><b>확장 상태</b><span>수집 패널 · 원할 때만</span></div>
          <img src="{MVP_EXPANDED}" alt="">
          <ul><li>클릭 한 번으로 수집 패널 확장</li><li>도감과 오늘의 방문자 확인</li><li>닫으면 다시 56px 리프 바로</li></ul>
        </div>
      </div>
      <p class="bottom-line">업무 화면을 가리지 않는 것 — 상주형 companion의 첫 번째 조건.</p>
    </section>
    """,
    """
    <section class="slide coreplay">
      <div class="kicker">게임 코어</div>
      <h2>게임의 코어는<br>화면 크기가 아니다</h2>
      <p class="lead">PC 행동이 바다를 반응시키고, 작은 발견이 다시 접속 이유가 된다.</p>
      <div class="core-loop">
        <div><b>1</b><span>키보드·마우스 입력</span></div>
        <i></i>
        <div><b>2</b><span>버블·빛·물결 반응</span></div>
        <i></i>
        <div><b>3</b><span>방문자·도감 발견</span></div>
        <i></i>
        <div><b>4</b><span>캡처·공유·꾸미기</span></div>
      </div>
      <div class="reef-illo">
        <span class="bubble b1"></span><span class="bubble b2"></span><span class="bubble b3"></span>
        <span class="fish f1"></span><span class="fish f2"></span><span class="fish f3"></span>
        <span class="coral c1"></span><span class="coral c2"></span><span class="coral c3"></span>
      </div>
      <p class="bottom-line">플레이어 시간을 뺏는 게임이 아니라, 업무 중 자연스럽게 쌓이는 보상으로 만든다.</p>
    </section>
    """,
    f"""
    <section class="slide reaction">
      <div class="kicker">상호작용</div>
      <h2>키보드와 마우스가<br>바다를 움직인다</h2>
      <div class="reaction-shot">
        <img src="{MVP_DEFAULT}" alt="">
        <div class="callout one">키 입력<br><b>버블 발생</b></div>
        <div class="callout two">마우스 이동<br><b>물고기 반응</b></div>
      </div>
      <div class="reaction-list">
        <div><b>키보드 입력</b><span>입력 리듬에 맞춰 버블과 빛이 올라온다.</span></div>
        <div><b>마우스 움직임</b><span>물고기가 커서 방향을 따라가거나 피한다.</span></div>
        <div><b>집중 시간</b><span>장시간 작업하면 산호 에너지가 천천히 쌓인다.</span></div>
      </div>
    </section>
    """,
    f"""
    <section class="slide retention">
      <div class="kicker">리텐션 훅</div>
      <h2>오늘 못 보면<br>지나가는 게 아니라,<br>오늘이라서 만나는 것</h2>
      <div class="visitor-stage">
        <img src="{MVP_EXPANDED}" alt="">
        <div class="visitor-card"><small>오늘의 방문자</small><b>심해 팔레트피쉬</b><span>18:42 · 집중 30분 후 등장</span></div>
      </div>
      <div class="visitor-logic">
        <div><b>조건</b><span>시간대, 집중 시간, 계절, 플레이 패턴</span></div>
        <div><b>발견</b><span>작은 방문자가 업무 옆 바다에 등장</span></div>
        <div><b>기록</b><span>도감에 남고 캡처 카드로 공유</span></div>
      </div>
    </section>
    """,
    f"""
    <section class="slide share">
      <div class="kicker">공유 구조</div>
      <h2>공유는 전체 화면이 아니라<br>작은 바다 카드다</h2>
      <div class="share-source">
        <img src="{MVP_EXPANDED}" alt="">
        <div class="crop-box">캡처 영역</div>
      </div>
      <div class="share-card">
        <small>ABYSSRIUM DESK</small>
        <b>심해 팔레트피쉬 발견</b>
        <p>오늘 18:42 · 집중 30분 후 등장<br>내 리프: Blue Quiet Reef</p>
        <div class="card-reef"><span></span></div>
      </div>
      <div class="share-dest">
        <div>Steam<br><span>스크린샷</span></div>
        <div>Discord<br><span>친구 공유</span></div>
        <div>X / 커뮤니티<br><span>짧은 밈 카드</span></div>
      </div>
      <p class="bottom-line">업무 화면을 노출하지 않고, 게임이 자동으로 만든 공유용 이미지만 내보낸다.</p>
    </section>
    """,
    """
    <section class="slide mvp">
      <div class="kicker">MVP 우선순위</div>
      <h2>작게 만들고,<br>빠르게 검증한다</h2>
      <div class="mvp-grid">
        <div class="p0"><b>P0</b><span>56px 리프 바</span><span>키보드·마우스 반응</span><span>오늘의 방문자</span><span>캡처 카드</span><span>기본 도감</span></div>
        <div><b>P1</b><span>산호 성장</span><span>시즌 물고기</span><span>테마 팩</span><span>저사양 모드</span></div>
        <div><b>P2</b><span>친구 방문</span><span>스트리머 오버레이</span><span>고급 공유 카드</span></div>
      </div>
      <div class="validation">
        <div><b>D7 재방문</b><span>상주형 리텐션</span></div>
        <div><b>캡처 공유율</b><span>바이럴 후보성</span></div>
        <div><b>테마 구매 전환</b><span>코스메틱 수익성</span></div>
      </div>
      <div class="source">자료 기준 · Steam 공개 데이터 / SteamDB / 공개 보도 / 내부 콘셉트 가정</div>
    </section>
    """,
]


CSS = """
@page { size: 1920px 1080px; margin: 0; }
* { box-sizing: border-box; }
html, body { width: 1920px; height: 1080px; margin: 0; overflow: hidden; }
body {
  font-family: "Segoe UI", "Malgun Gothic", "Apple SD Gothic Neo", Arial, sans-serif;
  color: #171717;
  background: #f7f6f2;
  word-break: keep-all;
  overflow-wrap: normal;
}
.slide {
  position: absolute;
  inset: 0;
  width: 1920px;
  height: 1080px;
  padding: 88px 110px 72px;
  background: #f7f6f2;
  overflow: hidden;
}
h1, h2, p { margin: 0; letter-spacing: 0; }
h1, h2 { font-weight: 900; color: #171717; }
h1 { font-size: 92px; line-height: 1.04; }
h2 { font-size: 70px; line-height: 1.08; }
p { font-size: 31px; line-height: 1.42; color: #5f5d58; font-weight: 650; }
.kicker {
  display: inline-flex;
  align-items: center;
  height: 56px;
  padding: 0 28px;
  border-radius: 999px;
  background: #ebefff;
  color: #3f5be0;
  font-size: 28px;
  font-weight: 860;
  margin-bottom: 32px;
  white-space: nowrap;
}
.kicker.light { color: #aeb8ff; background: transparent; padding: 0; height: auto; letter-spacing: 4px; }
.lead { margin-top: 26px; max-width: 1040px; font-size: 34px; }
.source {
  position: absolute;
  right: 110px;
  bottom: 45px;
  color: #a6a29b;
  font-size: 23px;
  font-weight: 700;
}
.bottom-line {
  position: absolute;
  left: 110px;
  right: 110px;
  bottom: 44px;
  padding-top: 24px;
  border-top: 1px solid #dfdcd4;
  font-size: 30px;
  font-weight: 850;
  color: #3b3a36;
}
.chips { display: flex; gap: 14px; flex-wrap: wrap; }
.chips span {
  display: inline-flex;
  align-items: center;
  height: 56px;
  padding: 0 26px;
  border-radius: 999px;
  background: #ebefff;
  color: #3f5be0;
  font-size: 27px;
  font-weight: 850;
  white-space: nowrap;
}
.chips.dark span { background: rgba(255,255,255,.12); color: #c4cbff; }

.cover { background: #1c2033; color: white; }
.cover-copy { position: absolute; left: 122px; top: 275px; width: 850px; }
.cover h1 { color: white; font-size: 86px; line-height: 1.12; margin-top: 34px; }
.cover p { color: #bbbdd1; font-size: 35px; line-height: 1.58; margin-top: 28px; width: 760px; }
.cover .chips { margin-top: 32px; }
.cover-visual {
  position: absolute;
  right: 120px;
  top: 194px;
  width: 728px;
  height: 620px;
  overflow: hidden;
  background: #07313e;
  border: 1px solid rgba(255,255,255,.16);
  box-shadow: 0 46px 120px rgba(0,0,0,.32);
}
.cover-visual img { width: 100%; height: 100%; object-fit: cover; object-position: 45% 96%; }
.cover-foot {
  position: absolute;
  left: 120px;
  right: 120px;
  bottom: 84px;
  border-top: 1px solid rgba(255,255,255,.17);
  padding-top: 38px;
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 28px;
}
.cover-foot span { color: #b7b8c8; font-weight: 600; }

.summary h2 { font-size: 96px; width: 700px; }
.summary .lead { position: absolute; left: 790px; top: 182px; width: 930px; }
.thesis-row {
  position: absolute;
  left: 790px;
  top: 355px;
  right: 110px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}
.thesis-row div, .proofs div {
  background: white;
  border: 1px solid #dedbd3;
  border-radius: 18px;
  box-shadow: 0 22px 55px rgba(38,37,34,.07);
}
.thesis-row div { padding: 28px; min-height: 168px; }
.thesis-row b { display: block; color: #3f5be0; font-size: 29px; margin-bottom: 14px; }
.thesis-row span { display: block; color: #5f5d58; font-size: 24px; line-height: 1.35; font-weight: 700; }
.proofs {
  position: absolute;
  left: 110px;
  right: 110px;
  bottom: 86px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}
.proofs div { padding: 30px 34px; }
.proofs small { display: block; color: #807c73; font-size: 23px; font-weight: 760; }
.proofs b { display: block; color: #3f5be0; font-size: 68px; line-height: 1; margin: 16px 0 10px; }
.proofs span { color: #34332f; font-size: 26px; font-weight: 850; }

.market h2 { font-size: 78px; }
.bars {
  position: absolute;
  left: 170px;
  right: 170px;
  top: 290px;
  height: 610px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 90px;
  align-items: end;
}
.bar-col { text-align: center; position: relative; height: 100%; }
.bar-col .value { font-size: 56px; font-weight: 920; margin-bottom: 18px; }
.bar {
  margin: 0 auto 24px;
  width: 170px;
  border-radius: 18px 18px 4px 4px;
  background: linear-gradient(180deg, #4bd3ef, #3f5be0);
  box-shadow: 0 22px 55px rgba(63,91,224,.22);
}
.bar.h1 { height: 390px; }
.bar.h2 { height: 214px; background: linear-gradient(180deg, #ffb660, #d24940); box-shadow: 0 22px 55px rgba(210,73,64,.16); }
.bar.h3 { height: 118px; background: #d9dde8; box-shadow: none; }
.bar-col b { display: block; font-size: 30px; margin-bottom: 8px; }
.bar-col span { display: block; color: #7d7970; font-size: 24px; font-weight: 760; }
.bar-col.main .value { color: #3f5be0; }
.bar-col.risk .value { color: #c9443d; }
.bar-col.tag .value { color: #44423d; }

.category-grid {
  position: absolute;
  left: 110px;
  right: 110px;
  top: 292px;
  bottom: 118px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 44px;
}
.mega {
  background: white;
  border: 1px solid #dedbd3;
  border-radius: 22px;
  padding: 58px 64px;
}
.mega b { display: block; color: #3f5be0; font-size: 190px; line-height: .86; }
.mega span { display: block; color: #171717; font-size: 42px; font-weight: 900; margin-top: 22px; }
.mega p { margin-top: 26px; font-size: 31px; max-width: 760px; }
.status { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 24px; }
.status div {
  background: white;
  border: 1px solid #dedbd3;
  border-radius: 22px;
  padding: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.status div:nth-child(3) { grid-column: 1 / span 2; }
.status b { display: block; font-size: 86px; color: #3f5be0; line-height: 1; }
.status span { margin-top: 16px; font-size: 30px; font-weight: 850; color: #33322e; }

.reviews h2 { font-size: 62px; }
.review-pair {
  position: absolute;
  left: 110px;
  right: 110px;
  top: 365px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 44px;
}
.review-card {
  background: white;
  border: 1px solid #dedbd3;
  border-radius: 22px;
  padding: 28px 36px 26px;
  min-height: 508px;
}
.card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.card-head b { font-size: 34px; }
.card-head span { color: #8f8a81; font-size: 24px; font-weight: 780; }
.score { font-size: 66px; font-weight: 940; margin-bottom: 14px; }
.score span { font-size: 28px; vertical-align: middle; color: #4b4944; }
.positive .score, .positive .card-head b { color: #2e9b5b; }
.negative .score, .negative .card-head b { color: #ca4540; }
.mini-bars { display: grid; gap: 14px; }
.mini-bars div { position: relative; height: 49px; border-bottom: 1px solid #ece9e2; }
.mini-bars span { position: absolute; left: 0; top: 0; font-size: 25px; color: #3d3b36; font-weight: 780; }
.mini-bars b { position: absolute; right: 0; top: 0; font-size: 25px; }
.mini-bars i { position: absolute; left: 0; right: 0; bottom: 0; width: var(--w); height: 8px; border-radius: 999px; background: #2e9b5b; }
.negative .mini-bars i { background: #ca4540; }
.review-card p { margin-top: 20px; font-size: 26px; color: #5f5d58; }

.ip-layout {
  position: absolute;
  left: 110px;
  right: 110px;
  top: 320px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 58px;
  align-items: start;
}
.big-blue { font-size: 128px; font-weight: 940; color: #3f5be0; line-height: 1; margin-bottom: 28px; }
.ip-copy p { width: 640px; margin-bottom: 26px; }
.compare-card {
  background: white;
  border: 1px solid #dedbd3;
  border-radius: 22px;
  padding: 48px 56px 42px;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 40px;
  align-items: center;
}
.compare-card i { width: 1px; height: 176px; background: #dedbd3; }
.compare-card b { display: block; font-size: 40px; margin-bottom: 18px; }
.compare-card span { display: block; color: #6c6860; font-size: 28px; line-height: 1.36; font-weight: 760; }
.compare-card p { grid-column: 1 / span 3; border-top: 1px solid #e6e2db; padding-top: 26px; color: #33322e; }
.wide-strip {
  position: absolute;
  left: 110px;
  right: 110px;
  bottom: 76px;
  width: 1700px;
  height: 210px;
  object-fit: cover;
  object-position: 44% 100%;
  box-shadow: 0 24px 70px rgba(38,37,34,.1);
}

.principle .lead { position: absolute; left: 110px; top: 250px; }
.state-pair {
  position: absolute;
  left: 110px;
  right: 110px;
  top: 325px;
  display: grid;
  grid-template-columns: 1fr 92px 1fr;
  gap: 24px;
  align-items: center;
}
.state img {
  width: 100%;
  height: 470px;
  object-fit: cover;
  object-position: 50% 100%;
  box-shadow: 0 22px 70px rgba(38,37,34,.14);
  border: 1px solid #dedbd3;
}
.state-label {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 62px;
  margin-bottom: 16px;
}
.state-label b {
  background: #ebefff;
  color: #3f5be0;
  border-radius: 999px;
  padding: 13px 24px;
  font-size: 28px;
}
.state-label span { color: #8b857c; font-size: 25px; font-weight: 760; }
.state ul {
  margin: 24px 0 0;
  padding-left: 42px;
  color: #3f3d38;
  font-size: 29px;
  line-height: 1.65;
  font-weight: 760;
}
.click-dot {
  width: 92px;
  height: 92px;
  border-radius: 999px;
  background: #ebefff;
  color: #5b5a54;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 24px;
  font-weight: 820;
}

.coreplay h2 { font-size: 86px; }
.coreplay .lead { max-width: 900px; margin-top: 20px; font-size: 30px; }
.core-loop {
  position: absolute;
  left: 110px;
  right: 110px;
  top: 500px;
  display: grid;
  grid-template-columns: 1fr 72px 1fr 72px 1fr 72px 1fr;
  align-items: center;
  z-index: 2;
}
.core-loop div {
  background: white;
  border: 1px solid #dedbd3;
  border-radius: 22px;
  padding: 28px 22px;
  min-height: 158px;
  text-align: center;
}
.core-loop b {
  display: inline-flex;
  width: 50px;
  height: 50px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: #3f5be0;
  color: white;
  font-size: 30px;
  margin-bottom: 16px;
}
.core-loop span { display: block; color: #262522; font-size: 25px; line-height: 1.28; font-weight: 850; }
.core-loop i { height: 4px; background: #3f5be0; }
.reef-illo {
  position: absolute;
  right: 110px;
  bottom: 140px;
  width: 760px;
  height: 230px;
  background: linear-gradient(180deg, rgba(69,91,224,.07), rgba(55,153,178,.13));
  border-bottom: 8px solid #3f5be0;
  border-radius: 24px 24px 0 0;
}
.bubble { position: absolute; border-radius: 999px; border: 3px solid #7dcdea; opacity: .65; }
.b1 { width: 34px; height: 34px; left: 190px; top: 48px; }
.b2 { width: 22px; height: 22px; left: 238px; top: 16px; }
.b3 { width: 42px; height: 42px; left: 555px; top: 64px; }
.fish { position: absolute; width: 78px; height: 35px; border-radius: 50%; background: #5bc9e8; }
.fish:after { content: ""; position: absolute; right: -20px; top: 8px; border-left: 25px solid #5bc9e8; border-top: 10px solid transparent; border-bottom: 10px solid transparent; }
.f1 { left: 96px; top: 106px; background: #f2ad4e; }
.f1:after { border-left-color: #f2ad4e; }
.f2 { left: 350px; top: 76px; transform: scale(.72); }
.f3 { right: 118px; top: 124px; background: #9169d8; transform: scale(.86); }
.f3:after { border-left-color: #9169d8; }
.coral { position: absolute; bottom: 0; width: 42px; height: 92px; border-radius: 999px 999px 0 0; background: #e87799; }
.c1 { left: 250px; height: 120px; }
.c2 { left: 286px; height: 86px; background: #6cc78b; }
.c3 { left: 595px; height: 110px; background: #8f7eea; }

.reaction h2, .retention h2 { width: 790px; }
.share h2 { width: 720px; font-size: 64px; line-height: 1.08; }
.reaction-shot {
  position: absolute;
  right: 110px;
  top: 230px;
  width: 980px;
  height: 610px;
}
.reaction-shot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 100%;
  box-shadow: 0 26px 80px rgba(38,37,34,.14);
  border: 1px solid #dedbd3;
}
.callout {
  position: absolute;
  background: #1c2033;
  color: white;
  border-radius: 18px;
  padding: 18px 22px;
  font-size: 25px;
  line-height: 1.24;
  font-weight: 760;
  box-shadow: 0 18px 60px rgba(28,32,51,.22);
}
.callout b { color: #75ddea; }
.callout.one { left: 48px; bottom: 78px; }
.callout.two { right: 60px; bottom: 92px; }
.reaction-list {
  position: absolute;
  left: 110px;
  bottom: 94px;
  width: 660px;
  display: grid;
  gap: 18px;
}
.reaction-list div, .visitor-logic div {
  background: white;
  border: 1px solid #dedbd3;
  border-radius: 18px;
  padding: 25px 28px;
}
.reaction-list b, .visitor-logic b { display: block; color: #3f5be0; font-size: 31px; margin-bottom: 8px; }
.reaction-list span, .visitor-logic span { color: #4d4a44; font-size: 25px; line-height: 1.3; font-weight: 760; }

.visitor-stage {
  position: absolute;
  right: 110px;
  top: 230px;
  width: 860px;
  height: 610px;
  overflow: hidden;
  border: 1px solid #dedbd3;
  box-shadow: 0 26px 80px rgba(38,37,34,.14);
}
.visitor-stage img { width: 100%; height: 100%; object-fit: cover; object-position: 38% 100%; filter: brightness(.88); }
.visitor-card {
  position: absolute;
  left: 36px;
  bottom: 36px;
  width: 430px;
  background: rgba(28,32,51,.92);
  color: white;
  border-radius: 20px;
  padding: 28px 30px;
}
.visitor-card small { display: block; color: #aeb8ff; font-size: 22px; font-weight: 800; margin-bottom: 12px; }
.visitor-card b { display: block; font-size: 42px; line-height: 1.12; }
.visitor-card span { display: block; color: #d8d9e5; font-size: 24px; margin-top: 18px; }
.visitor-logic {
  position: absolute;
  left: 110px;
  bottom: 96px;
  width: 680px;
  display: grid;
  gap: 20px;
}

.share-source {
  position: absolute;
  left: 110px;
  top: 410px;
  width: 620px;
  height: 310px;
  overflow: hidden;
  border: 1px solid #dedbd3;
  box-shadow: 0 22px 70px rgba(38,37,34,.12);
}
.share-source img { width: 100%; height: 100%; object-fit: cover; object-position: 36% 100%; filter: brightness(.82); }
.crop-box {
  position: absolute;
  left: 42px;
  bottom: 42px;
  width: 340px;
  height: 150px;
  border: 4px solid #75ddea;
  color: white;
  padding: 14px;
  font-size: 24px;
  font-weight: 850;
  background: rgba(117,221,234,.08);
}
.share-card {
  position: absolute;
  left: 810px;
  top: 385px;
  width: 470px;
  height: 370px;
  background: #1c2033;
  color: white;
  border-radius: 24px;
  padding: 28px 34px;
  box-shadow: 0 30px 90px rgba(28,32,51,.24);
}
.share-card small { color: #aeb8ff; font-size: 20px; font-weight: 850; }
.share-card b { display: block; margin-top: 25px; font-size: 38px; line-height: 1.12; }
.share-card p { color: #d8d9e5; font-size: 22px; margin-top: 16px; }
.card-reef {
  position: absolute;
  left: 34px;
  right: 34px;
  bottom: 34px;
  height: 70px;
  background: linear-gradient(180deg, rgba(93,201,232,.24), rgba(12,35,54,.92));
  border-bottom: 5px solid #75ddea;
  border-radius: 16px 16px 4px 4px;
}
.card-reef span { position: absolute; left: 190px; top: 28px; width: 70px; height: 30px; border-radius: 50%; background: #f2ad4e; }
.share-dest {
  position: absolute;
  right: 110px;
  top: 410px;
  width: 470px;
  display: grid;
  gap: 20px;
}
.share-dest div {
  background: white;
  border: 1px solid #dedbd3;
  border-radius: 18px;
  padding: 22px 30px;
  font-size: 29px;
  font-weight: 880;
}
.share-dest span { display: block; color: #6b675f; font-size: 24px; margin-top: 8px; }

.mvp-grid {
  position: absolute;
  left: 110px;
  right: 110px;
  top: 325px;
  display: grid;
  grid-template-columns: 1.35fr 1fr 1fr;
  gap: 28px;
}
.mvp-grid div {
  background: white;
  border: 1px solid #dedbd3;
  border-radius: 22px;
  padding: 36px 38px;
  min-height: 338px;
}
.mvp-grid .p0 { background: #ebefff; border-color: #cfd8ff; }
.mvp-grid b { display: block; color: #3f5be0; font-size: 78px; line-height: 1; margin-bottom: 24px; }
.mvp-grid span {
  display: inline-flex;
  margin: 0 10px 14px 0;
  padding: 13px 18px;
  border-radius: 999px;
  background: rgba(255,255,255,.78);
  color: #2f2e2a;
  font-size: 25px;
  font-weight: 790;
}
.validation {
  position: absolute;
  left: 110px;
  right: 110px;
  bottom: 108px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}
.validation div {
  padding: 28px 34px;
  border-top: 6px solid #3f5be0;
  background: white;
  border-radius: 0 0 18px 18px;
}
.validation b { display: block; font-size: 32px; margin-bottom: 8px; }
.validation span { color: #6b675f; font-size: 25px; font-weight: 760; }
"""


def write_html() -> None:
    body = "\n".join(SLIDES)
    script = """
    <script>
      const params = new URLSearchParams(location.search);
      const index = Number(params.get("slide") || "1") - 1;
      document.addEventListener("DOMContentLoaded", () => {
        const slides = [...document.querySelectorAll(".slide")];
        slides.forEach((slide, i) => slide.style.display = i === index ? "block" : "none");
      });
    </script>
    """
    HTML.write_text(
        f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>Abyssrium Desk Merged Report</title>
  <style>{CSS}</style>
  {script}
</head>
<body>{body}</body>
</html>
""",
        encoding="utf-8",
    )


def render_slides() -> list[Path]:
    if not CHROME.exists():
        raise FileNotFoundError(f"Chrome not found: {CHROME}")

    slide_paths: list[Path] = []
    for index in range(1, len(SLIDES) + 1):
        output = OUT / f"slide_{index:02d}.png"
        url = HTML.resolve().as_uri() + f"?slide={index}"
        subprocess.run(
            [
                str(CHROME),
                "--headless=new",
                "--disable-gpu",
                "--hide-scrollbars",
                "--window-size=1920,1080",
                f"--screenshot={output}",
                url,
            ],
            check=True,
        )
        slide_paths.append(output)
    return slide_paths


def ps_quote(path: Path) -> str:
    return "'" + str(path).replace("'", "''") + "'"


def build_pptx(slide_paths: list[Path]) -> int:
    ps_script = OUT / "build_pptx.ps1"
    images = ",\n  ".join(ps_quote(path.resolve()) for path in slide_paths)
    pptx = ps_quote(PPTX)
    ps_script.write_text(
        f"""
$ErrorActionPreference = 'Stop'
$images = @(
  {images}
)
$out = {pptx}
if (Test-Path -LiteralPath $out) {{
  Remove-Item -LiteralPath $out -Force
}}
$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = 1
$pres = $ppt.Presentations.Add()
$pres.PageSetup.SlideWidth = 960
$pres.PageSetup.SlideHeight = 540
foreach ($img in $images) {{
  $slide = $pres.Slides.Add($pres.Slides.Count + 1, 12)
  $shape = $slide.Shapes.AddPicture($img, 0, -1, 0, 0, 960, 540)
}}
$pres.SaveAs($out, 24)
$pres.Close()
$verify = $ppt.Presentations.Open($out, 0, 0, 0)
$count = $verify.Slides.Count
$verify.Close()
$ppt.Quit()
[GC]::Collect()
[GC]::WaitForPendingFinalizers()
Write-Output "SlideCount=$count"
""",
        encoding="utf-8-sig",
    )
    result = subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(ps_script)],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    for line in result.stdout.splitlines():
        if line.startswith("SlideCount="):
            return int(line.split("=", 1)[1])
    raise RuntimeError("PowerPoint verification did not return SlideCount")


def main() -> None:
    write_html()
    slide_paths = render_slides()
    count = build_pptx(slide_paths)
    print(f"slides_rendered={len(slide_paths)}")
    print(f"slides_verified={count}")
    print(f"html={HTML}")
    print(f"pptx={PPTX}")


if __name__ == "__main__":
    main()
