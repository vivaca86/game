from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent / "qa"
OUT.mkdir(parents=True, exist_ok=True)

FULL = Image.open(ROOT / "assets/concept/full-v9.png").convert("RGBA")
ROOM = Image.open(ROOT / "assets/concept/restaurant-room-v9.png").convert("RGBA")
SCENE = Image.open(ROOT / "assets/concept/restaurant-scene-v9.png").convert("RGBA")
RECIPE = Image.open(ROOT / "assets/concept/recipe-panel-v9.png").convert("RGBA")
PRODUCTION = Image.open(ROOT / "assets/concept/production-strip-v9.png").convert("RGBA")
ROUTE = Image.open(ROOT / "assets/concept/route-map-v9.png").convert("RGBA")
CAT = Image.open(ROOT / "assets/taskbar-cat-cutout-rig-v4/chef-cat-transparent-neutral-open-eyes.png").convert("RGBA")
PORTRAIT = Image.open(ROOT / "assets/concept/widget-portrait-v9.png").convert("RGBA")

FONT = Path("C:/Windows/Fonts/malgun.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/malgunbd.ttf")


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT), size)


def cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    ratio = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * ratio), round(image.height * ratio)), Image.Resampling.LANCZOS)
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


def contain(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    ratio = min(size[0] / image.width, size[1] / image.height)
    return image.resize((round(image.width * ratio), round(image.height * ratio)), Image.Resampling.LANCZOS)


def rounded(image: Image.Image, radius: int, outline: int = 0, outline_color=(103, 57, 33, 255)) -> Image.Image:
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, image.width - 1, image.height - 1), radius, fill=255)
    result = Image.new("RGBA", image.size)
    result.paste(image, (0, 0), mask)
    if outline:
        draw = ImageDraw.Draw(result)
        for i in range(outline):
            draw.rounded_rectangle((i, i, image.width - 1 - i, image.height - 1 - i), max(1, radius - i), outline=outline_color, width=1)
    return result


def panel_shadow(canvas: Image.Image, box: tuple[int, int, int, int], radius: int = 22) -> None:
    x0, y0, x1, y1 = box
    shadow = Image.new("RGBA", canvas.size)
    d = ImageDraw.Draw(shadow)
    d.rounded_rectangle((x0 + 8, y0 + 12, x1 + 8, y1 + 12), radius, fill=(2, 12, 20, 115))
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    canvas.alpha_composite(shadow)


def desktop() -> Image.Image:
    canvas = Image.new("RGBA", (1280, 720), (12, 35, 52, 255))
    px = canvas.load()
    for y in range(654):
        t = y / 654
        r = round(20 * (1 - t) + 7 * t)
        g = round(67 * (1 - t) + 22 * t)
        b = round(94 * (1 - t) + 34 * t)
        for x in range(1280):
            px[x, y] = (r, g, b, 255)
    draw = ImageDraw.Draw(canvas)
    for x, h in [(35, 130), (94, 175), (160, 115), (1040, 150), (1115, 205), (1200, 125)]:
        draw.rectangle((x, 654 - h, x + 54, 654), fill=(8, 25, 38, 210))
        for yy in range(654 - h + 18, 640, 28):
            for xx in range(x + 12, x + 46, 18):
                draw.rectangle((xx, yy, xx + 5, yy + 8), fill=(236, 184, 78, 120))
    draw.rectangle((0, 654, 1280, 720), fill=(7, 15, 24, 250))
    for x, color in [(26, (45, 181, 229)), (86, (238, 242, 246)), (160, (241, 190, 64)), (225, (57, 157, 217))]:
        draw.rounded_rectangle((x, 670, x + 36, 706), 8, fill=color + (255,))
    return canvas


def title(canvas: Image.Image, label: str, subtitle: str) -> None:
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((28, 24, 350, 67), 12, fill=(4, 19, 30, 188), outline=(255, 244, 218, 75), width=1)
    draw.text((44, 31), label, font=font(16, True), fill=(255, 244, 218))
    draw.text((44, 52), subtitle, font=font(9), fill=(176, 210, 222))


def header_resource_crop(width: int) -> Image.Image:
    crop = FULL.crop((590, 34, 1328, 94))
    return crop.resize((width, round(width * crop.height / crop.width)), Image.Resampling.LANCZOS)


def room_tabs(width: int) -> Image.Image:
    crop = ROOM.crop((78, 416, 546, 490))
    return crop.resize((width, round(width * crop.height / crop.width)), Image.Resampling.LANCZOS)


def add_taskbar_cat(canvas: Image.Image, x: int = 1075) -> None:
    cat = contain(CAT, (118, 118))
    canvas.alpha_composite(cat, (x, 548 - cat.height // 5))


def mockup_a() -> Image.Image:
    """Compact classic management: scene + one content panel."""
    canvas = desktop()
    title(canvas, "A · 작은 식당 경영", "추천 · 한 장면과 한 패널만 유지")
    box = (185, 82, 1095, 602)
    panel_shadow(canvas, box)
    frame = Image.new("RGBA", (910, 520), (255, 239, 202, 255))
    d = ImageDraw.Draw(frame)
    d.rounded_rectangle((1, 1, 908, 518), 22, fill=(255, 239, 202), outline=(104, 58, 34), width=5)
    d.rectangle((5, 5, 905, 54), fill=(238, 191, 111), outline=(104, 58, 34), width=3)
    d.text((24, 17), "모모의 작은 식당", font=font(17, True), fill=(67, 37, 26))
    resources = header_resource_crop(430)
    frame.alpha_composite(resources, (452, 10))
    scene = rounded(cover(SCENE, (575, 388)), 12, 3)
    frame.alpha_composite(scene, (18, 70))
    recipe = rounded(cover(RECIPE, (278, 388)), 12, 3)
    frame.alpha_composite(recipe, (614, 70))
    tabs = room_tabs(420)
    frame.alpha_composite(tabs, (96, 445))
    d.rounded_rectangle((630, 469, 884, 508), 10, fill=(100, 163, 66), outline=(73, 70, 31), width=3)
    d.text((704, 480), "오늘의 요리 시작", font=font(12, True), fill="white")
    frame = rounded(frame, 22)
    canvas.alpha_composite(frame, (185, 82))
    add_taskbar_cat(canvas)
    return canvas


def mockup_b() -> Image.Image:
    """Scene first: the restaurant is the game; UI floats only where needed."""
    canvas = desktop()
    title(canvas, "B · 식당 장면 중심", "가장 게임답고, 조작 대상이 공간에 있음")
    box = (225, 92, 1055, 592)
    panel_shadow(canvas, box)
    scene = cover(ROOM, (830, 500))
    scene = rounded(scene, 24, 4)
    canvas.alpha_composite(scene, (225, 92))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((250, 108, 525, 151), 14, fill=(255, 241, 203, 238), outline=(104, 58, 34), width=3)
    draw.text((270, 119), "오늘의 냥식당 · 손님 4마리", font=font(13, True), fill=(65, 36, 24))
    resources = header_resource_crop(360)
    resources = rounded(resources, 16, 2)
    canvas.alpha_composite(resources, (670, 106))
    draw.rounded_rectangle((746, 184, 1027, 278), 18, fill=(255, 245, 215, 242), outline=(104, 58, 34), width=3)
    draw.text((764, 199), "다음 주문", font=font(10, True), fill=(47, 126, 103))
    draw.text((764, 220), "토마토 스튜 1그릇", font=font(17, True), fill=(61, 34, 24))
    draw.text((764, 248), "재료 준비 완료 · 약 4분", font=font(9), fill=(116, 78, 58))
    draw.rounded_rectangle((827, 286, 1018, 325), 10, fill=(66, 149, 91), outline=(64, 78, 36), width=3)
    draw.text((870, 296), "주문 받기", font=font(12, True), fill="white")
    add_taskbar_cat(canvas)
    return canvas


def mockup_c() -> Image.Image:
    """Character counter: approved cat is the anchor, management is secondary."""
    canvas = desktop()
    title(canvas, "C · 고양이 카운터", "캐릭터 중심 · 가장 작고 데스크톱 친화적")
    box = (245, 105, 1035, 585)
    panel_shadow(canvas, box)
    frame = Image.new("RGBA", (790, 480), (255, 239, 203, 255))
    d = ImageDraw.Draw(frame)
    d.rounded_rectangle((1, 1, 788, 478), 24, fill=(255, 239, 203), outline=(103, 57, 33), width=5)
    d.rectangle((5, 5, 785, 48), fill=(196, 113, 65), outline=(103, 57, 33), width=3)
    d.text((22, 14), "모모의 카운터", font=font(16, True), fill=(255, 244, 218))
    resources = header_resource_crop(350)
    frame.alpha_composite(resources, (418, 8))
    d.rounded_rectangle((18, 64, 390, 405), 20, fill=(246, 211, 154), outline=(103, 57, 33), width=3)
    cat = contain(CAT, (345, 345))
    frame.alpha_composite(cat, (32 + (345 - cat.width) // 2, 75))
    d.rounded_rectangle((414, 68, 768, 204), 16, fill=(255, 247, 222), outline=(103, 57, 33), width=3)
    d.text((436, 88), "오늘 할 일", font=font(10, True), fill=(47, 126, 103))
    d.text((436, 111), "토마토 스튜 준비", font=font(20, True), fill=(61, 34, 24))
    d.text((436, 146), "토마토 1/1  ·  우유 1/1", font=font(10), fill=(116, 78, 58))
    d.rounded_rectangle((436, 165, 744, 194), 8, fill=(63, 145, 103), outline=(33, 91, 72), width=2)
    d.text((536, 171), "시작하기", font=font(10, True), fill="white")
    production = rounded(PRODUCTION.resize((354, 112), Image.Resampling.LANCZOS), 10, 2)
    frame.alpha_composite(production, (414, 219))
    route = rounded(ROUTE.resize((354, 106), Image.Resampling.LANCZOS), 10, 2)
    frame.alpha_composite(route, (414, 341))
    tabs = room_tabs(300)
    frame.alpha_composite(tabs, (47, 398))
    frame = rounded(frame, 24)
    canvas.alpha_composite(frame, (245, 105))
    add_taskbar_cat(canvas)
    return canvas


def contact_sheet(images: list[tuple[str, Image.Image]]) -> Image.Image:
    sheet = Image.new("RGBA", (1280, 760), (22, 43, 55, 255))
    draw = ImageDraw.Draw(sheet)
    draw.text((34, 22), "관리창 v4 · 실제 크기 방향 비교", font=font(24, True), fill=(255, 244, 218))
    draw.text((34, 53), "각 안은 1280×720 데스크톱에서 900×520 이하 창을 사용합니다.", font=font(11), fill=(175, 207, 219))
    positions = [(24, 92), (438, 92), (852, 92)]
    for (label, image), pos in zip(images, positions):
        thumb = image.resize((404, 227), Image.Resampling.LANCZOS)
        sheet.alpha_composite(thumb, pos)
        draw.text((pos[0], pos[1] + 239), label, font=font(16, True), fill=(255, 239, 196))
    notes = [
        "A · 정보가 많지만 전체화면은 아님\n장면 1 + 패널 1로 범위를 제한",
        "B · 공간 자체가 메뉴\n아이콘보다 식당 오브젝트가 우선",
        "C · 승인 고양이가 중심\n가장 작은 창과 가장 적은 메뉴",
    ]
    for note, pos in zip(notes, positions):
        draw.multiline_text((pos[0], 370), note, font=font(11), fill=(213, 225, 224), spacing=6)
    draw.rounded_rectangle((26, 510, 1254, 724), 18, fill=(248, 229, 187), outline=(103, 57, 33), width=3)
    draw.text((52, 536), "공통 품질 기준", font=font(17, True), fill=(61, 34, 24))
    common = [
        "• 얇은 코드 SVG와 중첩 원형 테두리를 사용하지 않음",
        "• 승인 고양이 또는 full-v9 원본과 같은 굵은 갈색 외곽·따뜻한 평면 채색",
        "• 한 화면에 장면 1개, 주 행동 1개, 보조 메뉴 3개 이하",
        "• 실제 런타임 구현은 한 안의 실제 크기 사용자 승인 뒤에만 시작",
    ]
    for index, line in enumerate(common):
        draw.text((52, 575 + index * 30), line, font=font(12), fill=(83, 54, 39))
    return sheet


def main() -> None:
    images = [
        ("A · 작은 식당 경영", mockup_a()),
        ("B · 식당 장면 중심", mockup_b()),
        ("C · 고양이 카운터", mockup_c()),
    ]
    for index, (_, image) in enumerate(images, start=1):
        image.convert("RGB").save(OUT / f"direction-{index}.png", quality=95)
    contact_sheet(images).convert("RGB").save(OUT / "direction-contact-sheet.png", quality=95)
    print(f"wrote={len(images) + 1}")
    for path in sorted(OUT.glob("*.png")):
        print(f"{path.name}={path.stat().st_size}")


if __name__ == "__main__":
    main()
