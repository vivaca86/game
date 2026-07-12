from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/management-v4"
QA = OUT / "qa"
MANIFEST = OUT / "management-v4-manifest.json"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save_crop(source: Image.Image, box: tuple[int, int, int, int], path: Path, size: tuple[int, int]) -> None:
    crop = source.crop(box).resize(size, Image.Resampling.LANCZOS)
    crop.save(path, optimize=True)


def build() -> dict:
    OUT.mkdir(parents=True, exist_ok=True)
    QA.mkdir(parents=True, exist_ok=True)
    (OUT / "recipes").mkdir(exist_ok=True)
    (OUT / "ingredients").mkdir(exist_ok=True)
    (OUT / "tabs").mkdir(exist_ok=True)
    (OUT / "resources").mkdir(exist_ok=True)

    full_path = ROOT / "assets/concept/full-v9.png"
    room_path = ROOT / "assets/concept/restaurant-room-v9.png"
    scene_path = ROOT / "assets/concept/restaurant-scene-v9.png"
    recipe_path = ROOT / "assets/concept/recipe-panel-v9.png"
    full = Image.open(full_path).convert("RGBA")
    room = Image.open(room_path).convert("RGBA")
    scene = Image.open(scene_path).convert("RGBA")
    recipe = Image.open(recipe_path).convert("RGBA")

    scene_out = OUT / "restaurant-scene.png"
    scene.save(scene_out, optimize=True)

    recipe_boxes = {
        "stew": (17, 65, 98, 135),
        "pasta": (123, 65, 211, 135),
        "juice": (344, 65, 444, 135),
    }
    cake_box = (402, 36, 478, 112)
    ingredient_boxes = {
        "wheat": (2, 372, 58, 431),
        "carrot": (68, 372, 124, 431),
        "tomato": (130, 372, 186, 431),
        "milk": (196, 372, 252, 431),
        "cheese": (256, 372, 312, 431),
        "egg": (327, 372, 383, 431),
    }
    tab_boxes = {
        "kitchen": (82, 420, 232, 487),
        "decorate": (236, 420, 390, 487),
        "farm": (393, 420, 548, 487),
    }
    resource_boxes = {
        "heart": (610, 43, 654, 91),
        "coin": (836, 43, 882, 91),
        "gem": (1012, 43, 1062, 91),
        "energy": (1167, 39, 1216, 93),
        "cat": (1324, 42, 1370, 92),
    }

    outputs: list[dict] = []
    for name, box in recipe_boxes.items():
        path = OUT / "recipes" / f"{name}.png"
        save_crop(recipe, box, path, (96, 82))
        outputs.append({"path": path.relative_to(ROOT).as_posix(), "source": recipe_path.relative_to(ROOT).as_posix(), "crop": box, "kind": "prototype-recipe-art"})
    cake_path = OUT / "recipes" / "cake.png"
    save_crop(room, cake_box, cake_path, (96, 82))
    outputs.append({"path": cake_path.relative_to(ROOT).as_posix(), "source": room_path.relative_to(ROOT).as_posix(), "crop": cake_box, "kind": "prototype-recipe-art"})
    for name, box in ingredient_boxes.items():
        path = OUT / "ingredients" / f"{name}.png"
        save_crop(recipe, box, path, (56, 56))
        outputs.append({"path": path.relative_to(ROOT).as_posix(), "source": recipe_path.relative_to(ROOT).as_posix(), "crop": box, "kind": "prototype-ingredient-art"})
    for name, box in tab_boxes.items():
        path = OUT / "tabs" / f"{name}.png"
        save_crop(room, box, path, (186, 88))
        outputs.append({"path": path.relative_to(ROOT).as_posix(), "source": room_path.relative_to(ROOT).as_posix(), "crop": box, "kind": "prototype-tab-art"})
    for name, box in resource_boxes.items():
        path = OUT / "resources" / f"{name}.png"
        save_crop(full, box, path, (52, 52))
        outputs.append({"path": path.relative_to(ROOT).as_posix(), "source": full_path.relative_to(ROOT).as_posix(), "crop": box, "kind": "prototype-resource-art"})

    outputs.append({"path": scene_out.relative_to(ROOT).as_posix(), "source": scene_path.relative_to(ROOT).as_posix(), "crop": (0, 0, scene.width, scene.height), "kind": "prototype-scene-art"})
    for row in outputs:
        path = ROOT / row["path"]
        with Image.open(path) as image:
            row["width"], row["height"] = image.size
        row["sha256"] = sha(path)

    contact = Image.new("RGB", (1100, 520), (250, 232, 195))
    draw = ImageDraw.Draw(contact)
    bold = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 22)
    small = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 13)
    draw.text((24, 18), "management-v4 runtime art contact sheet", font=bold, fill=(64, 35, 24))
    x = 24
    for name in ("stew", "pasta", "cake", "juice"):
        image = Image.open(OUT / "recipes" / f"{name}.png").convert("RGB")
        contact.paste(image, (x, 70))
        draw.text((x, 158), name, font=small, fill=(83, 52, 36))
        x += 122
    x = 24
    for name in ingredient_boxes:
        image = Image.open(OUT / "ingredients" / f"{name}.png").convert("RGB")
        contact.paste(image, (x, 210))
        draw.text((x, 271), name, font=small, fill=(83, 52, 36))
        x += 88
    x = 24
    for name in tab_boxes:
        image = Image.open(OUT / "tabs" / f"{name}.png").convert("RGB")
        contact.paste(image, (x, 322))
        draw.text((x, 416), name, font=small, fill=(83, 52, 36))
        x += 220
    x = 744
    for name in resource_boxes:
        image = Image.open(OUT / "resources" / f"{name}.png").convert("RGB")
        contact.paste(image, (x, 322))
        draw.text((x, 380), name, font=small, fill=(83, 52, 36))
        x += 66
    contact_path = QA / "management-v4-assets-contact-sheet.png"
    contact.save(contact_path, optimize=True)

    manifest = {
        "version": 1,
        "status": "prototype-runtime-candidate-user-selected-direction-a",
        "source_policy": "reference crops only; not production-approved",
        "scene": scene_out.relative_to(ROOT).as_posix(),
        "outputs": outputs,
        "qa": {"path": contact_path.relative_to(ROOT).as_posix(), "sha256": sha(contact_path), "width": 1100, "height": 520},
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


def check() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for row in manifest["outputs"]:
        path = ROOT / row["path"]
        if not path.exists() or sha(path) != row["sha256"]:
            raise SystemExit(f"asset mismatch: {row['path']}")
    qa = manifest["qa"]
    if sha(ROOT / qa["path"]) != qa["sha256"]:
        raise SystemExit("qa mismatch")
    print(f"checked={len(manifest['outputs'])} qa=1")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.check:
        check()
    else:
        manifest = build()
        print(f"wrote={len(manifest['outputs'])} qa=1")


if __name__ == "__main__":
    main()
