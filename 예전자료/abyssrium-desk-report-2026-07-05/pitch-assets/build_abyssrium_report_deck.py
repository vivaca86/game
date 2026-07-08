from __future__ import annotations

import html
import os
import shutil
import subprocess
import textwrap
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "abyssrium-desk-report"
OUT.mkdir(exist_ok=True)

CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
DECK_HTML = OUT / "slides.html"
PPTX = ROOT / "Abyssrium_Desk_market_report.pptx"

MVP_DEFAULT = "../abyssrium-desk-mvp-default.png"
MVP_EXPANDED = "../abyssrium-desk-mvp-expanded.png"
TWO_STATE = "../abyssrium-desk-visual-investor-slide.png"


def safe_text(text: str) -> str:
    return html.escape(text, quote=True)


def source_note() -> str:
    return "Data: Steam public APIs / SteamDB / public press, checked 2026-07-04"


SLIDES: list[str] = [
    f"""
    <section class="slide cover">
      <div class="cover-copy">
        <div class="eyebrow">Abyssrium x Desktop Companion</div>
        <h1>작업표시줄 위에<br>사는 작은 심해</h1>
        <p>어비스리움 IP를 PC 작업 흐름 안으로 확장하는 시장성 검토</p>
      </div>
      <img class="cover-img" src="{MVP_DEFAULT}" alt="">
      <div class="stamp">{source_note()}</div>
    </section>
    """,
    """
    <section class="slide summary">
      <div class="kicker">Executive Summary</div>
      <h2>기회는 “게임을 더 크게”가 아니라<br>“항상 켜둘 이유”를 만드는 쪽에 있다</h2>
      <div class="three">
        <div><b>1</b><h3>수요 확인</h3><p>Bongo Cat과 TBH가 작업표시줄 companion의 체류시간과 관심을 증명</p></div>
        <div><b>2</b><h3>리스크 확인</h3><p>장터·수익 기대 중심 설계는 리뷰와 신뢰를 빠르게 훼손</p></div>
        <div><b>3</b><h3>IP 적합성</h3><p>어비스리움은 이미 방치·수집·힐링 문법을 가진 PC companion 후보</p></div>
      </div>
    </section>
    """,
    """
    <section class="slide graph">
      <div class="kicker">Market Signal</div>
      <h2>Steam에서 이미 검증된 관심</h2>
      <div class="bar-chart">
        <div class="bar-item hero">
          <div class="value">105K+</div><div class="bar" style="height: 430px"></div><div class="label">Bongo Cat<br><span>96.6% positive</span></div>
        </div>
        <div class="bar-item">
          <div class="value">36K+</div><div class="bar muted" style="height: 151px"></div><div class="label">TBH<br><span>51.5% positive</span></div>
        </div>
        <div class="bar-item">
          <div class="value">100+</div><div class="bar muted soft" style="height: 74px"></div><div class="label">Desktop Companion<br><span>SteamDB tag</span></div>
        </div>
      </div>
      <p class="takeaway">귀여운 상주형 companion은 대규모 리뷰를 만들 수 있고, 장터형 설계는 관심과 리스크를 동시에 키운다.</p>
    </section>
    """,
    """
    <section class="slide split">
      <div>
        <div class="kicker">Category Size</div>
        <h2>아직 작지만 빠르게 형성되는 장르</h2>
        <p class="lead">`taskbar` 검색과 Desktop Companion 태그 기준으로 보면, 정확히 작업표시줄·화면 하단 상주형 게임은 아직 20~30개 규모의 신흥 시장입니다.</p>
      </div>
      <div class="number-grid">
        <div><b>153</b><span>Steam taskbar 검색 결과</span></div>
        <div><b>28</b><span>실제 taskbar/하단 상주형 후보</span></div>
        <div><b>16</b><span>출시된 후보</span></div>
        <div><b>12</b><span>출시 예정 후보</span></div>
      </div>
    </section>
    """,
    """
    <section class="slide case bongo">
      <div class="kicker">Case Study: Bongo Cat</div>
      <h2>성공 이유: 설명이 필요 없는 귀여운 행동</h2>
      <div class="bubble-row">
        <div>이미 유명한 밈</div><div>무료 진입</div><div>키보드 입력이 플레이</div><div>모자·스킨 수집</div><div>스크린샷 공유</div>
      </div>
      <div class="mini-chart">
        <div><b>36.6K</b><span>귀여움/고양이/밈 언급</span></div>
        <div><b>20.3K</b><span>단순함/무료/힐링 언급</span></div>
        <div><b>66.2K</b><span>3단어 이하 짧은 리뷰</span></div>
      </div>
      <p class="takeaway">리뷰 자체가 밈 참여가 됨. “귀엽다”는 감정이 설치와 공유를 끌고 갑니다.</p>
    </section>
    """,
    """
    <section class="slide case tbh">
      <div class="kicker">Case Study: TBH</div>
      <h2>수요는 컸지만, 장터 경제가 평가를 흔들었다</h2>
      <div class="risk-bars">
        <div><span>장터/아이템 손실/거래 제한</span><b style="width: 100%"></b><em>7.3K</em></div>
        <div><span>서버/접속/버그</span><b style="width: 66%"></b><em>4.8K</em></div>
        <div><span>개발사 신뢰/정책 불만</span><b style="width: 34%"></b><em>2.5K</em></div>
        <div><span>DLC/슬롯/P2W 인식</span><b style="width: 22%"></b><em>1.6K</em></div>
      </div>
      <p class="takeaway danger">교훈: 수익 기대를 전면에 두면 바이럴은 커지지만, 실패 시 분노도 커집니다.</p>
    </section>
    """,
    """
    <section class="slide matrix">
      <div class="kicker">Positioning</div>
      <h2>Abyssrium Desk는 Bongo Cat의 감정 구조를 따르고, TBH의 장터 리스크를 피한다</h2>
      <div class="matrix-box">
        <div class="axis x">수익 기대 중심 →</div>
        <div class="axis y">↑ 감정/애착 중심</div>
        <div class="dot bongo">Bongo Cat</div>
        <div class="dot tbh">TBH</div>
        <div class="dot abyss">Abyssrium Desk</div>
      </div>
    </section>
    """,
    f"""
    <section class="slide visual-two">
      <div class="kicker">Product Concept</div>
      <h2>평소엔 얇게. 필요할 때만 크게.</h2>
      <img src="{TWO_STATE}" alt="">
    </section>
    """,
    f"""
    <section class="slide product-detail">
      <div>
        <div class="kicker">MVP Default</div>
        <h2>56px 리프 바</h2>
        <p>업무 화면을 가리지 않고, 키보드 입력과 집중 시간이 기포·산호 성장으로 전환됩니다.</p>
      </div>
      <img src="{MVP_DEFAULT}" alt="">
    </section>
    """,
    f"""
    <section class="slide product-detail reverse">
      <div>
        <div class="kicker">MVP Expanded</div>
        <h2>수집 패널</h2>
        <p>클릭했을 때만 확장되어 물고기 도감, 산호 성장, 희귀 방문자, 스킨 구매 흐름을 보여줍니다.</p>
      </div>
      <img src="{MVP_EXPANDED}" alt="">
    </section>
    """,
    """
    <section class="slide roadmap">
      <div class="kicker">MVP Scope</div>
      <h2>작게 만들어 빠르게 검증</h2>
      <div class="road">
        <div><b>MVP</b><span>56px 리프 바 · 산호석 · 기본 물고기 · 입력 반응 · 최소화</span></div>
        <div><b>P1</b><span>도감 · 오늘의 방문자 · 시즌 물고기 · 저사양 모드</span></div>
        <div><b>P2</b><span>친구 방문 · 스트리머 오버레이 · 유료 테마 팩</span></div>
      </div>
    </section>
    """,
    """
    <section class="slide monetization">
      <div class="kicker">Monetization</div>
      <h2>무료 진입, 코스메틱 수익화</h2>
      <div class="flow">
        <div>무료 설치</div><span>→</span><div>체류·공유</div><span>→</span><div>희귀 방문자</div><span>→</span><div>테마/물고기 DLC</div>
      </div>
      <p class="takeaway">장터 거래가 아니라 애착 기반 꾸미기로 매출을 만든다.</p>
    </section>
    """,
    """
    <section class="slide validation">
      <div class="kicker">Validation Plan</div>
      <h2>투자 전 확인해야 할 3개 지표</h2>
      <div class="three metrics">
        <div><b>D7</b><h3>재방문율</h3><p>다시 켜는 companion인지 확인</p></div>
        <div><b>Share</b><h3>캡처 공유율</h3><p>희귀 물고기/내 바다 공유성 검증</p></div>
        <div><b>DLC</b><h3>구매 전환율</h3><p>테마·물고기 팩 지불 의사 확인</p></div>
      </div>
    </section>
    """,
    """
    <section class="slide sources">
      <div class="kicker">Sources & Assumptions</div>
      <h2>공개 지표 기반 조사</h2>
      <ul>
        <li>Steam Store / Steam Reviews API: Bongo Cat, TBH, taskbar 후보 28종</li>
        <li>SteamDB: Desktop Companion 태그, app charts, follower/peak player indicators</li>
        <li>Public press: PC Gamer, GameSpot, Polygon coverage on Bongo Cat viral growth</li>
        <li>Abyssrium official / App Store / Google Play: IP positioning and existing audience claim</li>
      </ul>
      <p class="small">비공개 매출, 위시리스트, 실제 DLC 전환율은 추정 대상이며 확정값으로 사용하지 않았습니다.</p>
    </section>
    """,
]


CSS = """
@page { size: 1920px 1080px; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; }
body {
  font-family: "Segoe UI", "Malgun Gothic", Arial, sans-serif;
  color: #f7fcff;
  background: #061621;
}
.slide {
  position: absolute;
  inset: 0;
  width: 1920px;
  height: 1080px;
  padding: 76px 92px;
  overflow: hidden;
  background:
    radial-gradient(circle at 82% 14%, rgba(86, 213, 255, .18), transparent 34%),
    radial-gradient(circle at 12% 86%, rgba(91, 119, 255, .15), transparent 30%),
    linear-gradient(135deg, #061621 0%, #0a2433 48%, #0b3345 100%);
}
.kicker, .eyebrow {
  display: inline-block;
  color: #88eaff;
  font-size: 24px;
  font-weight: 850;
  padding: 10px 16px;
  border: 1px solid rgba(136,234,255,.32);
  border-radius: 999px;
  background: rgba(9,42,59,.68);
}
h1, h2, h3, p { margin: 0; letter-spacing: 0; }
h1 { margin-top: 28px; font-size: 92px; line-height: .98; font-weight: 900; }
h2 { margin-top: 28px; font-size: 68px; line-height: 1.08; font-weight: 900; }
h3 { font-size: 30px; line-height: 1.18; }
p { color: #cfeefa; font-size: 28px; line-height: 1.38; }
.lead { margin-top: 28px; font-size: 34px; max-width: 840px; }
.takeaway {
  position: absolute;
  left: 92px;
  right: 92px;
  bottom: 44px;
  padding: 22px 28px;
  border-radius: 8px;
  background: rgba(7,26,38,.82);
  border: 1px solid rgba(130,244,255,.23);
  font-size: 30px;
  font-weight: 760;
}
.danger { border-color: rgba(255,133,133,.35); color: #ffd8d8; }
.cover-copy { position: relative; z-index: 3; width: 720px; }
.cover-copy p { margin-top: 28px; font-size: 34px; font-weight: 740; }
.cover-img {
  position: absolute;
  right: 78px;
  bottom: 120px;
  width: 1040px;
  height: 610px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 44px 130px rgba(0,0,0,.42);
  border: 1px solid rgba(171,236,255,.24);
}
.stamp { position: absolute; left: 92px; bottom: 54px; color: rgba(216,239,248,.7); font-size: 19px; }
.summary .three, .three {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-top: 80px;
}
.three > div {
  min-height: 260px;
  padding: 34px;
  border-radius: 8px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(171,236,255,.18);
  box-shadow: 0 28px 90px rgba(0,0,0,.22);
}
.three b {
  display: block;
  color: #80f0ff;
  font-size: 58px;
  line-height: 1;
  margin-bottom: 24px;
}
.three h3 { color: #fff; margin-bottom: 16px; }
.three p { font-size: 24px; }
.bar-chart {
  position: absolute;
  left: 170px;
  right: 170px;
  bottom: 250px;
  height: 500px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: end;
  gap: 92px;
  border-bottom: 2px solid rgba(190,241,255,.28);
  padding: 0 90px;
}
.bar-item { text-align: center; position: relative; }
.bar { width: 100%; max-width: 210px; margin: 0 auto; border-radius: 8px 8px 0 0; background: linear-gradient(180deg,#61edff,#2677ff); box-shadow: 0 0 46px rgba(85,231,255,.45); }
.bar.muted { background: linear-gradient(180deg,#6b92a7,#314e64); box-shadow: none; opacity: .84; }
.bar.soft { opacity: .64; }
.value { font-size: 54px; font-weight: 900; margin-bottom: 18px; }
.label { margin-top: 20px; color: #f5fcff; font-size: 28px; font-weight: 850; line-height: 1.12; }
.label span { display: block; margin-top: 8px; color: #a8cfda; font-size: 20px; }
.split { display: grid; grid-template-columns: 1fr 820px; gap: 64px; align-items: center; }
.number-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.number-grid div { padding: 34px; border-radius: 8px; background: rgba(255,255,255,.09); border: 1px solid rgba(171,236,255,.2); }
.number-grid b { display: block; font-size: 72px; color: #84edff; line-height: 1; }
.number-grid span { display: block; margin-top: 18px; color: #d8f3fb; font-size: 25px; font-weight: 750; }
.bubble-row { display: flex; gap: 18px; margin-top: 92px; flex-wrap: wrap; }
.bubble-row div { padding: 22px 28px; border-radius: 999px; background: rgba(126,240,255,.14); border: 1px solid rgba(126,240,255,.28); color: #fff; font-size: 28px; font-weight: 850; }
.mini-chart { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; margin-top: 88px; }
.mini-chart div { padding: 30px; border-radius: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(171,236,255,.2); }
.mini-chart b { display: block; color: #82f4ff; font-size: 62px; line-height: 1; }
.mini-chart span { display: block; margin-top: 14px; color: #d4eff7; font-size: 24px; font-weight: 740; }
.risk-bars { margin-top: 84px; width: 1120px; }
.risk-bars div { position: relative; height: 72px; margin: 22px 0; background: rgba(255,255,255,.07); border-radius: 8px; border: 1px solid rgba(255,255,255,.11); overflow: hidden; }
.risk-bars b { position: absolute; left: 0; top: 0; bottom: 0; background: linear-gradient(90deg,#ff6e7a,#ffb86a); opacity: .92; }
.risk-bars span, .risk-bars em { position: relative; z-index: 2; display: inline-block; font-size: 26px; line-height: 72px; font-style: normal; font-weight: 820; }
.risk-bars span { margin-left: 24px; }
.risk-bars em { float: right; margin-right: 24px; color: #fff; }
.matrix-box {
  position: relative;
  margin-top: 54px;
  width: 1240px;
  height: 620px;
  border-left: 3px solid rgba(220,247,255,.5);
  border-bottom: 3px solid rgba(220,247,255,.5);
  background: rgba(255,255,255,.055);
  border-radius: 8px;
}
.axis { position: absolute; color: #bfe8f3; font-size: 24px; font-weight: 800; }
.axis.x { right: 28px; bottom: 20px; }
.axis.y { left: 28px; top: 22px; }
.dot { position: absolute; padding: 20px 26px; border-radius: 8px; color: #061621; font-size: 28px; font-weight: 900; box-shadow: 0 24px 80px rgba(0,0,0,.35); }
.dot.bongo { left: 170px; top: 105px; background: #7df0ff; }
.dot.tbh { right: 150px; bottom: 115px; background: #ffad70; }
.dot.abyss { left: 430px; top: 220px; background: #ffffff; color: #0e6789; border: 5px solid #7df0ff; }
.visual-two img { position: absolute; left: 86px; right: 86px; bottom: 64px; width: 1748px; height: 760px; object-fit: cover; border-radius: 8px; box-shadow: 0 42px 120px rgba(0,0,0,.4); border: 1px solid rgba(171,236,255,.24); }
.product-detail { display: grid; grid-template-columns: 520px 1fr; gap: 56px; align-items: center; }
.product-detail.reverse { grid-template-columns: 560px 1fr; }
.product-detail img { width: 1120px; height: 710px; object-fit: cover; border-radius: 8px; box-shadow: 0 42px 120px rgba(0,0,0,.4); border: 1px solid rgba(171,236,255,.24); }
.product-detail p { margin-top: 28px; font-size: 30px; }
.road { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-top: 92px; }
.road div { min-height: 330px; padding: 42px; border-radius: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(171,236,255,.2); }
.road b { display: block; color: #82f4ff; font-size: 54px; margin-bottom: 34px; }
.road span { color: #d8f3fb; font-size: 30px; line-height: 1.34; font-weight: 760; }
.flow { display: flex; align-items: center; gap: 24px; margin-top: 130px; }
.flow div { padding: 34px 44px; min-width: 260px; text-align: center; border-radius: 8px; background: rgba(255,255,255,.09); border: 1px solid rgba(171,236,255,.2); font-size: 32px; font-weight: 880; }
.flow span { color: #82f4ff; font-size: 54px; font-weight: 900; }
.metrics div { min-height: 300px; }
.sources ul { margin: 72px 0 0; padding-left: 38px; color: #d8f3fb; font-size: 31px; line-height: 1.58; font-weight: 720; }
.small { margin-top: 52px; color: #9bc6d4; font-size: 24px; }
"""


def write_html() -> None:
    slide_index = """
    <script>
      const params = new URLSearchParams(location.search);
      const index = Number(params.get("slide") || "1") - 1;
      document.addEventListener("DOMContentLoaded", () => {
        const slides = [...document.querySelectorAll(".slide")];
        slides.forEach((slide, i) => {
          slide.style.display = i === index ? "block" : "none";
        });
      });
    </script>
    """
    body = "\n".join(textwrap.dedent(slide).strip() for slide in SLIDES)
    html_doc = f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Abyssrium Desk Report Deck</title>
  <style>{CSS}</style>
  {slide_index}
</head>
<body>
{body}
</body>
</html>
"""
    DECK_HTML.write_text(html_doc, encoding="utf-8")


def render_slides() -> list[Path]:
    if not CHROME.exists():
        raise SystemExit(f"Chrome not found: {CHROME}")
    paths: list[Path] = []
    for i in range(1, len(SLIDES) + 1):
        out = OUT / f"slide_{i:02d}.png"
        url = f"{DECK_HTML.as_uri()}?slide={i}"
        cmd = [
            str(CHROME),
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--window-size=1920,1080",
            f"--screenshot={out}",
            url,
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        paths.append(out)
    return paths


def content_types(num_slides: int) -> str:
    slide_overrides = "\n".join(
        f'<Override PartName="/ppt/slides/slide{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>'
        for i in range(1, num_slides + 1)
    )
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/>
  <Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/>
  <Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/>
  {slide_overrides}
</Types>'''


def rels_root() -> str:
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>'''


def presentation_xml(num_slides: int) -> str:
    sld_ids = "\n".join(
        f'<p:sldId id="{255+i}" r:id="rId{i}"/>'
        for i in range(1, num_slides + 1)
    )
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>
    {sld_ids}
  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
  <p:defaultTextStyle/>
</p:presentation>'''


def presentation_rels(num_slides: int) -> str:
    rels = "\n".join(
        f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i}.xml"/>'
        for i in range(1, num_slides + 1)
    )
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  {rels}
</Relationships>'''


def slide_xml(idx: int) -> str:
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:pic>
        <p:nvPicPr>
          <p:cNvPr id="2" name="slide_{idx:02d}.png"/>
          <p:cNvPicPr/>
          <p:nvPr/>
        </p:nvPicPr>
        <p:blipFill>
          <a:blip r:embed="rId1"/>
          <a:stretch><a:fillRect/></a:stretch>
        </p:blipFill>
        <p:spPr>
          <a:xfrm>
            <a:off x="0" y="0"/>
            <a:ext cx="12192000" cy="6858000"/>
          </a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
        </p:spPr>
      </p:pic>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>'''


def slide_rels(idx: int) -> str:
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/slide_{idx:02d}.png"/>
</Relationships>'''


def build_pptx(slide_pngs: list[Path]) -> None:
    if PPTX.exists():
        PPTX.unlink()
    with zipfile.ZipFile(PPTX, "w", compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types(len(slide_pngs)))
        z.writestr("_rels/.rels", rels_root())
        z.writestr("ppt/presentation.xml", presentation_xml(len(slide_pngs)))
        z.writestr("ppt/_rels/presentation.xml.rels", presentation_rels(len(slide_pngs)))
        z.writestr("ppt/presProps.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentationPr xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>')
        z.writestr("ppt/viewProps.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:viewPr xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>')
        z.writestr("ppt/tableStyles.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>')
        for idx, png in enumerate(slide_pngs, 1):
            z.writestr(f"ppt/slides/slide{idx}.xml", slide_xml(idx))
            z.writestr(f"ppt/slides/_rels/slide{idx}.xml.rels", slide_rels(idx))
            z.write(png, f"ppt/media/slide_{idx:02d}.png")


def main() -> None:
    write_html()
    pngs = render_slides()
    build_pptx(pngs)
    print(f"slides={len(pngs)}")
    print(f"html={DECK_HTML}")
    print(f"pptx={PPTX}")


if __name__ == "__main__":
    main()
