from __future__ import annotations

import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "abyssrium-game-content-deck"
OUT.mkdir(exist_ok=True)

CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
HTML = OUT / "slides.html"

MVP_DEFAULT = "../abyssrium-desk-mvp-default.png"
MVP_EXPANDED = "../abyssrium-desk-mvp-expanded.png"


SLIDES = [
    """
    <section class="slide cover">
      <div class="small">Abyssrium Desk · Game Concept</div>
      <h1>게임의 코어는<br>화면 크기가 아니다</h1>
      <div class="core-formula">
        <div><b>PC 행동</b><span>키보드 · 마우스 · 집중 시간</span></div>
        <i></i>
        <div><b>바다 반응</b><span>버블 · 빛 · 물고기 움직임</span></div>
        <i></i>
        <div><b>수집/공유</b><span>방문자 · 도감 · 캡처 카드</span></div>
      </div>
      <p>플레이어가 일을 하는 동안, 그 행동이 바다의 변화와 발견으로 쌓이는 게임.</p>
    </section>
    """,
    """
    <section class="slide core">
      <h1>코어 루프</h1>
      <div class="core-center">행동이<br>바다에<br>남는다</div>
      <div class="loop-card c1"><b>1. 입력</b><span>키보드, 마우스, 실행 시간</span></div>
      <div class="loop-card c2"><b>2. 즉시 반응</b><span>뽀글뽀글 버블, 빛, 물결</span></div>
      <div class="loop-card c3"><b>3. 발견</b><span>조건에 맞는 방문자 등장</span></div>
      <div class="loop-card c4"><b>4. 소유</b><span>도감, 산호 성장, 내 리프</span></div>
      <div class="loop-card c5"><b>5. 공유</b><span>업무 화면을 가리지 않는 캡처 카드</span></div>
    </section>
    """,
    f"""
    <section class="slide response">
      <h1>키보드와 마우스가<br>바다를 움직인다</h1>
      <img class="response-shot" src="{MVP_DEFAULT}" alt="">
      <div class="input-row">
        <div><b>키보드 입력</b><span>버블이 올라오고 리프가 반짝임</span></div>
        <div><b>마우스 이동</b><span>물고기가 커서 방향을 따라봄</span></div>
        <div><b>집중 시간</b><span>산호 에너지가 천천히 쌓임</span></div>
      </div>
      <div class="callout bubble-callout">뽀글뽀글<br>입력 반응</div>
      <div class="callout fish-callout">커서를 따라<br>움직이는 물고기</div>
    </section>
    """,
    f"""
    <section class="slide visitor">
      <h1>재방문 훅은<br>오늘의 발견이다</h1>
      <div class="visitor-scene">
        <img src="{MVP_EXPANDED}" alt="">
        <div class="visitor-card">
          <span>오늘의 방문자</span>
          <b>심해 발광어</b>
          <p>18:42 · 집중 30분 후 등장</p>
        </div>
      </div>
      <div class="visitor-steps">
        <div><b>조건</b><span>시간, 집중, 날씨, 시즌</span></div>
        <div><b>발견</b><span>잠깐 나타나는 특별한 물고기</span></div>
        <div><b>기록</b><span>도감에 남고 캡처 카드로 저장</span></div>
      </div>
      <p class="bottom-note">“못 보면 손해”가 아니라, 오늘 내 PC에 생긴 작은 사건을 발견하는 재미.</p>
    </section>
    """,
    f"""
    <section class="slide collection">
      <h1>확장 화면은 큰 화면이 아니라<br>수집 확인 장소다</h1>
      <img src="{MVP_EXPANDED}" alt="">
      <div class="collection-points">
        <div><b>도감</b><span>처음 만난 날짜 · 등장 조건</span></div>
        <div><b>산호 성장</b><span>실행 시간과 집중 세션이 누적</span></div>
        <div><b>테마</b><span>내 리프를 다르게 보이게 함</span></div>
      </div>
    </section>
    """,
    f"""
    <section class="slide share">
      <h1>공유는 이렇게 나간다</h1>
      <div class="capture-source">
        <img src="{MVP_EXPANDED}" alt="">
        <div class="crop-box">캡처 영역</div>
      </div>
      <div class="share-card">
        <span>ABYSSRIUM DESK</span>
        <b>심해 발광어 발견</b>
        <p>오늘 18:42 · 집중 30분 후 등장<br>내 리프: Blue Quiet Reef</p>
        <div class="mini-reef"></div>
      </div>
      <div class="share-dest">
        <div>Steam<br>스크린샷</div>
        <div>Discord<br>친구 공유</div>
        <div>X / 커뮤니티<br>짧은 밈 카드</div>
      </div>
      <p class="bottom-note">전체 업무 화면을 찍는 게 아니라, 게임이 자동으로 공유용 카드 이미지를 만든다.</p>
    </section>
    """,
    """
    <section class="slide money">
      <h1>거래가 아니라<br>애착을 판다</h1>
      <div class="yesno">
        <div class="yes">
          <b>해야 할 것</b>
          <span>테마 팩</span><span>물고기 팩</span><span>산호 스킨</span><span>사운드스케이프</span>
        </div>
        <div class="no">
          <b>피해야 할 것</b>
          <span>유저 간 거래</span><span>확률형 손실감</span><span>가격 기대</span><span>서버 정책 손실</span>
        </div>
      </div>
      <p class="bottom-note">TBH의 장터 리스크를 피하고, Bongo Cat처럼 감정 기반 구매로 간다.</p>
    </section>
    """,
    """
    <section class="slide mvp">
      <h1>MVP는 콘텐츠 양이 아니라<br>켜둘 이유 검증</h1>
      <div class="mvp-list">
        <div class="must"><b>P0</b><span>56px 리프 바</span><span>입력 반응</span><span>오늘의 방문자</span><span>캡처 카드</span><span>기본 도감</span></div>
        <div><b>P1</b><span>산호 성장</span><span>시즌 물고기</span><span>테마 팩</span><span>저사양 모드</span></div>
        <div><b>P2</b><span>친구 방문</span><span>스트리머 오버레이</span><span>고급 공유 카드</span></div>
      </div>
    </section>
    """,
    """
    <section class="slide close">
      <h1>정리</h1>
      <div class="final-lines">
        <div>1. 키보드와 마우스가 바다의 반응이 된다.</div>
        <div>2. 방문자와 도감이 매일 켜둘 이유가 된다.</div>
        <div>3. 캡처 카드가 공유와 바이럴의 단위가 된다.</div>
      </div>
      <p>그래서 Abyssrium Desk의 게임성은 화면 전환이 아니라, PC 사용 시간 위에 쌓이는 작은 생태계다.</p>
    </section>
    """,
]


CSS = """
@page { size: 1920px 1080px; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; }
body { font-family: "Segoe UI", "Malgun Gothic", Arial, sans-serif; color: #f8fcff; background: #061621; }
.slide {
  position: absolute;
  inset: 0;
  width: 1920px;
  height: 1080px;
  padding: 86px 96px;
  overflow: hidden;
  background:
    radial-gradient(circle at 80% 18%, rgba(93, 226, 255, .2), transparent 34%),
    radial-gradient(circle at 15% 85%, rgba(75, 106, 220, .18), transparent 31%),
    linear-gradient(135deg, #061621 0%, #092433 48%, #0b3546 100%);
}
h1, h2, p { margin: 0; letter-spacing: 0; }
h1 { font-size: 78px; line-height: 1.08; font-weight: 930; }
p { color: #ceeffb; font-size: 30px; line-height: 1.38; font-weight: 700; }
.small { color: #7df2ff; font-size: 28px; font-weight: 850; margin-bottom: 28px; }
.cover h1 { font-size: 108px; line-height: .98; width: 980px; }
.cover p { position: absolute; left: 96px; right: 96px; bottom: 80px; padding: 24px 30px; border-radius: 8px; background: rgba(5,24,35,.78); border: 1px solid rgba(125,242,255,.24); font-size: 35px; }
.core-formula { position: absolute; left: 96px; right: 96px; top: 440px; display: grid; grid-template-columns: 1fr 80px 1fr 80px 1fr; align-items: center; }
.core-formula div { min-height: 230px; padding: 34px; border-radius: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(171,236,255,.2); }
.core-formula b { display: block; color: #7df2ff; font-size: 52px; margin-bottom: 22px; }
.core-formula span { display: block; color: #e4f8ff; font-size: 28px; line-height: 1.32; font-weight: 760; }
.core-formula i { width: 80px; height: 4px; background: #7df2ff; box-shadow: 0 0 28px rgba(125,242,255,.55); }
.core-center { position: absolute; left: 700px; top: 260px; width: 520px; height: 520px; border-radius: 999px; background: radial-gradient(circle, rgba(125,242,255,.38), rgba(125,242,255,.08) 62%, transparent 63%); display: flex; align-items: center; justify-content: center; text-align: center; font-size: 66px; line-height: 1.05; font-weight: 950; color: #f8fcff; }
.loop-card { position: absolute; width: 430px; min-height: 140px; padding: 26px 30px; border-radius: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(171,236,255,.2); }
.loop-card b { display: block; color: #7df2ff; font-size: 31px; margin-bottom: 10px; }
.loop-card span { display: block; color: #e8faff; font-size: 25px; line-height: 1.24; font-weight: 760; }
.c1 { left: 135px; top: 330px; } .c2 { left: 210px; top: 650px; } .c3 { right: 160px; top: 250px; } .c4 { right: 250px; top: 520px; } .c5 { right: 640px; bottom: 90px; width: 520px; }
.response h1 { width: 780px; }
.response-shot { position: absolute; right: 70px; top: 235px; width: 1130px; height: 670px; object-fit: cover; border-radius: 8px; box-shadow: 0 42px 120px rgba(0,0,0,.42); border: 1px solid rgba(171,236,255,.24); }
.input-row { position: absolute; left: 96px; bottom: 94px; width: 650px; display: grid; gap: 18px; }
.input-row div { padding: 24px 28px; border-radius: 8px; background: rgba(7,28,41,.82); border: 1px solid rgba(125,242,255,.24); box-shadow: 0 24px 70px rgba(0,0,0,.24); }
.input-row b { display: block; color: #7df2ff; font-size: 34px; margin-bottom: 8px; }
.input-row span { display: block; color: #e4f8ff; font-size: 25px; line-height: 1.25; font-weight: 760; }
.callout { position: absolute; padding: 16px 18px; border-radius: 8px; background: rgba(5,24,35,.86); border: 1px solid rgba(125,242,255,.34); color: #f8fcff; font-size: 24px; line-height: 1.18; font-weight: 840; }
.bubble-callout { right: 560px; bottom: 235px; }
.fish-callout { right: 120px; bottom: 205px; }
.visitor-scene { position: absolute; left: 96px; bottom: 88px; width: 820px; height: 590px; border-radius: 8px; overflow: hidden; background: rgba(5,24,35,.6); border: 1px solid rgba(171,236,255,.24); box-shadow: 0 42px 120px rgba(0,0,0,.42); }
.visitor-scene img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 30% 100%; }
.visitor-scene:after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(5,24,35,.08), rgba(5,24,35,.44)); }
.visitor-card { position: absolute; left: 36px; bottom: 36px; z-index: 2; width: 430px; padding: 26px 30px; border-radius: 8px; background: rgba(5,24,35,.84); border: 1px solid rgba(125,242,255,.34); box-shadow: 0 24px 80px rgba(0,0,0,.34); }
.visitor-card span { display: block; color: #9df5ff; font-size: 24px; font-weight: 850; margin-bottom: 8px; }
.visitor-card b { display: block; color: #7df2ff; font-size: 54px; line-height: 1.04; }
.visitor-card p { margin-top: 18px; color: #e7fbff; font-size: 25px; line-height: 1.32; }
.visitor-steps { position: absolute; left: 1035px; right: 100px; top: 300px; display: grid; gap: 22px; }
.visitor-steps div { padding: 28px 30px; border-radius: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(171,236,255,.2); }
.visitor-steps b { display: block; color: #7df2ff; font-size: 40px; margin-bottom: 12px; }
.visitor-steps span { display: block; color: #e8faff; font-size: 29px; line-height: 1.24; font-weight: 760; }
.bottom-note { position: absolute; left: 96px; right: 96px; bottom: 62px; padding: 22px 28px; border-radius: 8px; background: rgba(5,24,35,.8); border: 1px solid rgba(125,242,255,.24); color: #f8fcff; font-size: 30px; }
.collection img { position: absolute; left: 96px; bottom: 90px; width: 1050px; height: 600px; object-fit: contain; border-radius: 8px; border: 1px solid rgba(171,236,255,.24); background: rgba(5,24,35,.45); }
.collection-points { position: absolute; right: 96px; bottom: 112px; width: 620px; display: grid; gap: 22px; }
.collection-points div { padding: 30px; border-radius: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(171,236,255,.2); }
.collection-points b, .share-card b, .yesno b, .mvp-list b { display: block; color: #7df2ff; font-size: 34px; margin-bottom: 18px; }
.collection-points span, .yesno span, .mvp-list span { display: block; color: #e4f8ff; font-size: 25px; line-height: 1.26; font-weight: 760; }
.capture-source { position: absolute; left: 96px; top: 255px; width: 710px; height: 430px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(171,236,255,.24); background: rgba(5,24,35,.45); }
.capture-source img { width: 100%; height: 100%; object-fit: cover; object-position: 28% 100%; filter: brightness(.82); }
.crop-box { position: absolute; left: 54px; bottom: 48px; width: 430px; height: 190px; border: 3px solid #7df2ff; border-radius: 8px; background: rgba(125,242,255,.08); color: #f8fcff; font-size: 26px; font-weight: 880; padding: 14px; }
.share-card { position: absolute; left: 870px; top: 245px; width: 520px; height: 450px; padding: 32px; border-radius: 8px; background: linear-gradient(180deg, rgba(9,51,71,.96), rgba(5,24,35,.96)); border: 1px solid rgba(125,242,255,.34); box-shadow: 0 35px 110px rgba(0,0,0,.42); }
.share-card span { color: #9df5ff; font-size: 21px; font-weight: 900; }
.share-card b { margin-top: 34px; font-size: 48px; line-height: 1.08; }
.share-card p { margin-top: 18px; color: #e4f8ff; font-size: 23px; }
.mini-reef { position: absolute; left: 32px; right: 32px; bottom: 34px; height: 92px; border-radius: 8px; background: radial-gradient(circle at 42% 55%, rgba(125,242,255,.45), transparent 18%), linear-gradient(180deg, rgba(38,111,145,.35), rgba(6,29,43,.92)); border-bottom: 3px solid #7df2ff; }
.share-dest { position: absolute; right: 96px; top: 260px; width: 360px; display: grid; gap: 20px; }
.share-dest div { padding: 25px; border-radius: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(171,236,255,.2); color: #f8fcff; font-size: 28px; line-height: 1.22; font-weight: 850; }
.yesno { position: absolute; left: 96px; right: 96px; top: 330px; display: grid; grid-template-columns: 1fr 1fr; gap: 34px; }
.yesno > div { padding: 40px; min-height: 410px; border-radius: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(171,236,255,.2); }
.yesno b { font-size: 54px; }
.yesno span { margin-top: 20px; padding: 14px 18px; border-radius: 8px; background: rgba(255,255,255,.08); font-size: 31px; }
.no b, .no span { color: #ffbd79; }
.mvp-list { position: absolute; left: 96px; right: 96px; bottom: 96px; top: 330px; display: grid; grid-template-columns: 1.35fr 1fr 1fr; gap: 28px; }
.mvp-list div { padding: 40px; border-radius: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(171,236,255,.2); }
.mvp-list b { font-size: 62px; }
.mvp-list span { margin-top: 20px; font-size: 30px; }
.must { background: linear-gradient(135deg, rgba(125,242,255,.22), rgba(255,255,255,.08)) !important; }
.must b { font-size: 108px; }
.final-lines { margin-top: 78px; display: grid; gap: 24px; width: 1260px; }
.final-lines div { padding: 30px 36px; border-radius: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(171,236,255,.2); font-size: 42px; font-weight: 860; }
.close p { position: absolute; left: 96px; right: 96px; bottom: 96px; font-size: 36px; }
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
    HTML.write_text(f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>Abyssrium Desk Game Content Deck</title>
  <style>{CSS}</style>
  {script}
</head>
<body>{body}</body>
</html>
""", encoding="utf-8")


def render() -> list[Path]:
    if not CHROME.exists():
        raise SystemExit(f"Chrome not found: {CHROME}")
    paths: list[Path] = []
    for i in range(1, len(SLIDES) + 1):
        out = OUT / f"slide_{i:02d}.png"
        cmd = [
            str(CHROME),
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--window-size=1920,1080",
            f"--screenshot={out}",
            f"{HTML.as_uri()}?slide={i}",
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        paths.append(out)
    return paths


def main() -> None:
    write_html()
    paths = render()
    print(f"slides={len(paths)}")
    print(f"html={HTML}")


if __name__ == "__main__":
    main()
