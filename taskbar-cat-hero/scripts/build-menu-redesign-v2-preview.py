"""Build deterministic static QA previews for the menu-redesign-v2 prototype.

This is not a browser screenshot and must not be reported as live DOM verification.
It exists to review the selected information hierarchy, density, color system and
approved cat placement at the intended 1280x720 design size before runtime work.
"""

import hashlib
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "prototypes" / "menu-redesign-v2" / "qa"
CAT_PATH = ROOT / "assets" / "taskbar-cat-cutout-rig-v4" / "chef-cat-transparent-neutral-open-eyes.png"

W, H = 1280, 720
C = {
    "ink": "#34251f", "muted": "#765f52", "cream": "#fff8e9", "paper": "#f8e8c8",
    "paper2": "#f2d79f", "line": "#70452f", "soft": "#c99763", "wood": "#6b3d2a",
    "teal": "#277f72", "teal2": "#175b53", "coral": "#dc624b", "gold": "#f0b84d",
    "green": "#58a65d", "white": "#fffdf6", "gray": "#d7d3ca", "dark": "#30373b",
}


def font(size: int, bold: bool = False):
    name = "malgunbd.ttf" if bold else "malgun.ttf"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), size)


def rr(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def text(draw, xy, value, size, fill=None, bold=False, anchor=None):
    draw.text(xy, value, font=font(size, bold), fill=fill or C["ink"], anchor=anchor)


def crop_contain(im: Image.Image, size: tuple[int, int]):
    copy = im.copy()
    copy.thumbnail(size, Image.Resampling.LANCZOS)
    return copy


def draw_header(draw):
    draw.rectangle((0, 0, W, 72), fill="#f5dda7", outline=C["line"], width=3)
    rr(draw, (18, 14, 58, 54), 13, C["coral"], C["line"], 3)
    text(draw, (38, 34), "T", 20, "white", True, "mm")
    text(draw, (72, 19), "오늘의 냥식당", 18, bold=True)
    text(draw, (72, 43), "7일차 · 맑음", 11, C["muted"], True)
    for x, label, fill in [(870, "2,274", C["gold"]), (995, "8", "#70bad0"), (1080, "50/50", "#ef8d50")]:
        draw.ellipse((x, 27, x + 16, 43), fill=fill, outline=C["line"], width=2)
        text(draw, (x + 24, 26), label, 14, bold=True)
    rr(draw, (1219, 17, 1257, 55), 12, C["white"], C["line"], 2)
    text(draw, (1238, 36), "×", 22, anchor="mm")


def draw_nav(draw):
    draw.rectangle((0, 72, 92, H), fill="#ead0a0", outline=C["line"], width=3)
    for i, label in enumerate(["오늘", "주방", "농장", "고양이"]):
        y = 88 + i * 82
        active = i == 0
        rr(draw, (11, y, 81, y + 68), 17, C["cream"] if active else "#ead0a0", C["line"] if active else None, 2)
        symbol = ["홈", "솥", "잎", "냥"][i]
        text(draw, (46, y + 25), symbol, 13, C["teal2"] if active else C["muted"], True, "mm")
        text(draw, (46, y + 52), label, 11, C["teal2"] if active else C["muted"], True, "mm")


def draw_direction_a(path: Path):
    im = Image.new("RGB", (W, H), C["cream"])
    draw = ImageDraw.Draw(im)
    draw_header(draw)
    draw_nav(draw)

    stage = (112, 92, 755, 540)
    rr(draw, stage, 24, "#f5dea9", C["line"], 3)
    draw.rectangle((115, 440, 752, 537), fill="#bd794c")
    text(draw, (140, 125), "지금 작업표시줄에서는", 12, C["teal2"], True)
    text(draw, (140, 154), "모모가 반죽을 쉬고 있어요", 28, bold=True)
    text(draw, (140, 198), "다음 요리를 정하면 데스크톱에서도", 13, C["muted"])
    text(draw, (140, 220), "그 준비를 시작합니다.", 13, C["muted"])

    cat = Image.open(CAT_PATH).convert("RGBA")
    cat = crop_contain(cat, (410, 410))
    im.paste(cat, (365, 116), cat)
    rr(draw, (134, 462, 384, 516), 15, "#fffaf0", C["line"], 2)
    draw.ellipse((150, 483, 162, 495), fill=C["teal"])
    text(draw, (174, 473), "작업표시줄 반영", 9, C["muted"], True)
    text(draw, (174, 491), "차분한 대기 모션", 12, bold=True)

    card = (776, 92, 1258, 354)
    rr(draw, card, 22, "#fffaf0", C["line"], 3)
    rr(draw, (796, 112, 884, 137), 8, "#f6d993")
    text(draw, (840, 124), "다음에 할 일", 10, bold=True, anchor="mm")
    text(draw, (1190, 118), "약 4분", 11, C["teal2"], True)
    text(draw, (796, 155), "토마토 스튜 준비", 24, bold=True)
    text(draw, (796, 192), "보유 재료로 바로 시작할 수 있어요.", 12, C["muted"])
    text(draw, (796, 212), "선택하면 작업표시줄 행동도 바뀝니다.", 12, C["muted"])
    rr(draw, (796, 236, 900, 265), 14, "#fff2d4", C["soft"])
    text(draw, (848, 250), "토마토 1/1", 10, bold=True, anchor="mm")
    rr(draw, (908, 236, 1000, 265), 14, "#fff2d4", C["soft"])
    text(draw, (954, 250), "우유 1/1", 10, bold=True, anchor="mm")
    rr(draw, (796, 283, 1237, 333), 16, C["teal"], C["teal2"], 3)
    text(draw, (1016, 307), "이 요리 시작하기   →", 15, "white", True, "mm")

    rr(draw, (776, 368, 1258, 438), 18, "#fffaf0", C["line"], 3)
    draw.ellipse((794, 383, 836, 425), fill=C["green"], outline="#39703d", width=2)
    text(draw, (815, 404), "2", 14, "white", True, "mm")
    text(draw, (850, 382), "지금 확인할 것", 9, C["muted"], True)
    text(draw, (850, 401), "밀밭과 온실 수확 가능", 12, bold=True)
    rr(draw, (1152, 385, 1238, 420), 10, "#dff0d7", "#39703d", 2)
    text(draw, (1195, 402), "보러 가기", 10, "#285d2f", True, "mm")

    rr(draw, (776, 450, 1258, 520), 18, "#fffaf0", C["line"], 3)
    rr(draw, (794, 465, 836, 507), 13, "#ffd08c", C["line"], 2)
    text(draw, (815, 486), "모", 14, bold=True, anchor="mm")
    text(draw, (850, 464), "모모와의 오늘", 9, C["muted"], True)
    text(draw, (850, 484), "기분 좋음 · 애정 68", 12, bold=True)

    rr(draw, (112, 558, 1258, 700), 22, "#f3dfb7", C["line"], 3)
    text(draw, (132, 580), "오늘의 흐름", 10, C["muted"], True)
    text(draw, (132, 602), "수확 → 요리 →", 13, bold=True)
    text(draw, (132, 622), "작업표시줄 변화", 13, bold=True)
    steps = [(315, "농장", "재료 2곳 준비", "수확 가능", "#dcefd7"), (600, "주방", "다음 요리 선택", "지금 할 일", "#d8efea"), (885, "데스크톱", "고양이 행동 변경", "선택 결과", "#eee3cf")]
    for i, (x, top, middle, tag, fill) in enumerate(steps, 1):
        rr(draw, (x, 575, x + 245, 677), 16, C["white"], C["teal"] if i == 2 else C["soft"], 2)
        rr(draw, (x + 12, 590, x + 44, 622), 10, "white", C["line"], 2)
        text(draw, (x + 28, 606), str(i), 12, bold=True, anchor="mm")
        text(draw, (x + 56, 589), top, 9, C["muted"], True)
        text(draw, (x + 56, 608), middle, 11, bold=True)
        rr(draw, (x + 12, 637, x + 88, 661), 7, fill)
        text(draw, (x + 50, 649), tag, 9, C["muted"], True, "mm")
        if i < 3:
            text(draw, (x + 263, 626), "›", 26, C["soft"], True, "mm")

    OUT.mkdir(parents=True, exist_ok=True)
    im.save(path)


def draw_wire(path: Path, kind: str):
    im = Image.new("RGB", (W, H), "#e9e7e1")
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 70), fill="#d3d0c7", outline="#60676a", width=3)
    title = "B · 하루 계획표" if kind == "b" else "C · 식당 공간"
    text(d, (24, 22), title, 20, C["dark"], True)
    if kind == "b":
        d.rectangle((0, 70, 170, H), fill="#ddd9cf", outline="#777", width=3)
        for i, label in enumerate(["오늘", "주방", "농장", "고양이"]):
            rr(d, (22, 100 + 64 * i, 148, 148 + 64 * i), 10, "#4d565a" if i == 0 else "#f7f5ef", "#777", 2)
            text(d, (85, 124 + 64 * i), label, 12, "white" if i == 0 else C["dark"], True, "mm")
        rr(d, (205, 102, 1240, 260), 18, "#faf9f5", "#666", 3)
        d.ellipse((232, 120, 352, 240), outline="#666", width=3)
        text(d, (292, 180), "CAT", 16, C["dark"], True, "mm")
        text(d, (390, 132), "오늘의 목표", 11, "#666", True)
        text(d, (390, 163), "토마토 스튜 3그릇", 30, C["dark"], True)
        text(d, (390, 210), "보상: 코인 180 · 애정 4", 13, "#666")
        for i, label in enumerate(["밀밭 수확", "온실 수확", "스튜 조리", "모모 서빙"]):
            x = 205 + i * 258
            rr(d, (x, 310, x + 225, 590), 18, "white", "#333" if i == 1 else "#777", 3)
            d.ellipse((x + 18, 332, x + 60, 374), outline="#666", width=3)
            text(d, (x + 39, 353), str(i + 1), 13, C["dark"], True, "mm")
            text(d, (x + 18, 400), label, 18, C["dark"], True)
            text(d, (x + 18, 552), "지금" if i == 1 else "다음", 11, "#666", True)
    else:
        d.rectangle((0, 70, W, H), fill="#dedbd2")
        d.rectangle((120, 140, 510, 380), fill="#cecac0", outline="#777", width=4)
        d.rounded_rectangle((850, 120, 1160, 310), radius=90, fill="#c5c2b9", outline="#777", width=4)
        d.rectangle((220, 540, 1060, 680), fill="#b9b4a9", outline="#666", width=4)
        d.rounded_rectangle((550, 320, 720, 570), radius=70, fill="#e9e7e1", outline="#666", width=4)
        text(d, (635, 440), "CAT", 18, C["dark"], True, "mm")
        for x, y, label, sub in [(150, 330, "주방", "요리 1개 진행"), (900, 360, "뒷마당", "수확 2곳"), (760, 520, "모모", "기분 좋음")]:
            rr(d, (x, y, x + 190, y + 72), 14, "#faf9f5", "#555", 3)
            text(d, (x + 18, y + 14), label, 14, C["dark"], True)
            text(d, (x + 18, y + 42), sub, 10, "#666")
    im.save(path)


def draw_controls(path: Path):
    im = Image.new("RGB", (1280, 520), "#183144")
    d = ImageDraw.Draw(im)
    rr(d, (55, 35, 1225, 485), 24, C["cream"], C["line"], 4)
    text(d, (88, 65), "VISUAL SYSTEM v0.1", 10, C["teal2"], True)
    text(d, (88, 88), "게임 컨트롤 상태표", 26, C["ink"], True)
    labels = ["DEFAULT", "HOVER", "FOCUS", "PRESSED", "DISABLED", "READY"]
    fills = [C["teal"], "#3a9b8b", C["teal"], C["teal"], "#aaa198", C["green"]]
    for i, (label, fill) in enumerate(zip(labels, fills)):
        x = 88 + (i % 3) * 372
        y = 145 + (i // 3) * 155
        rr(d, (x, y, x + 340, y + 132), 18, "#f6e5c4", C["soft"], 2)
        text(d, (x + 18, y + 15), label, 10, C["muted"], True)
        shadow = "#71685f" if label == "DISABLED" else ("#2f6335" if label == "READY" else C["teal2"])
        rr(d, (x + 18, y + 59, x + 322, y + 108), 15, shadow)
        offset = 4 if label == "PRESSED" else 0
        rr(d, (x + 18, y + 53 + offset, x + 322, y + 102 + offset), 15, fill, shadow, 3)
        if label == "FOCUS":
            d.rounded_rectangle((x + 11, y + 46, x + 329, y + 109), radius=19, outline="#77c9d5", width=4)
        button_text = "재료가 부족해요" if label == "DISABLED" else ("수확물 받기" if label == "READY" else "요리 시작하기  →")
        text(d, (x + 170, y + 78 + offset), button_text, 13, "#eee9e2" if label == "DISABLED" else "white", True, "mm")
    im.save(path)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    draw_direction_a(OUT / "direction-a-cat-home-1280x720.png")
    draw_wire(OUT / "direction-b-day-planner-1280x720.png", "b")
    draw_wire(OUT / "direction-c-restaurant-room-1280x720.png", "c")
    draw_controls(OUT / "control-state-sheet-1280x520.png")
    output_paths = sorted(OUT.glob("*.png"))
    manifest = {
        "status": "prototype_not_production_approved",
        "character_anchor": {
            "path": str(CAT_PATH.relative_to(ROOT)).replace("\\", "/"),
            "sha256": hashlib.sha256(CAT_PATH.read_bytes()).hexdigest(),
            "disposition": "user_selected_style_derivative_prototype_anchor",
        },
        "rejected_menu_v1_raster_references": 0,
        "outputs": [
            {
                "path": str(path.relative_to(ROOT)).replace("\\", "/"),
                "size": list(Image.open(path).size),
                "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            }
            for path in output_paths
        ],
    }
    (OUT.parent / "prototype-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("preview_outputs=4")
