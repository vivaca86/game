"""Build deterministic runtime crops for the menu-v1 generated masters.

The generated masters remain untouched for the Unity/IP-holder handoff. This
script only crops and resizes them into stable web-prototype slots and records
hashes/dimensions. Unity should import the masters, then reproduce these crops
as SpriteAtlas rectangles rather than upscaling the runtime PNGs.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "assets" / "menu-v1"
MASTER_ROOT = ASSET_ROOT / "masters"

SOURCE_HASHES = {
    "dispatch-map-master.png": "53264e306dfb8d3c7ef6970e92a25d4bf41efba70255c17126eb0655cc5ee179",
    "object-icons-master.png": "1c90fdb64dcff06cb68785ff5037760c9aaac904efb80366144ea34a08044cdd",
    "party-portraits-master.png": "73ecc482af837de9bdc12bb6c6b05d711f0f53c3de7114d2d64426b0078e18aa",
    "production-strip-master.png": "2fe831fe74025e1ceb7f337de304a8f7ecc4d83c5576ba043abe08e444ffeb42",
    "restaurant-scene-master.png": "9d04004776100c552381d4d0c043a8db2cc8d328d8d42e6d8dab1f26e30fb2f0",
}

ICON_IDS = [
    "stew", "pasta", "cake", "juice", "spatula",
    "pot", "roller", "book", "wheat", "carrot",
    "tomato", "milk", "cheese", "egg", "coat",
    "bag", "apron", "gift", "chair", "bread",
]

PORTRAIT_IDS = ["momo", "gray", "marmalade", "calico"]
PRODUCTION_IDS = ["field", "bakery", "truck", "greenhouse", "village"]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify_sources() -> None:
    for filename, expected in SOURCE_HASHES.items():
        path = MASTER_ROOT / filename
        if not path.exists():
            raise SystemExit(f"Missing generated master: {path}")
        actual = sha256(path)
        if actual != expected:
            raise SystemExit(
                f"Generated master changed without review: {filename}\n"
                f"expected={expected}\nactual={actual}"
            )


def contain(image: Image.Image, size: tuple[int, int], color=(255, 248, 232)) -> Image.Image:
    fitted = ImageOps.contain(image.convert("RGB"), size, Image.Resampling.LANCZOS)
    out = Image.new("RGB", size, color)
    out.paste(fitted, ((size[0] - fitted.width) // 2, (size[1] - fitted.height) // 2))
    return out


def build_outputs() -> dict[Path, Image.Image]:
    outputs: dict[Path, Image.Image] = {}

    restaurant = Image.open(MASTER_ROOT / "restaurant-scene-master.png").convert("RGB")
    outputs[ASSET_ROOT / "restaurant-scene.png"] = ImageOps.fit(
        restaurant, (1300, 810), Image.Resampling.LANCZOS, centering=(0.5, 0.5)
    )

    route = Image.open(MASTER_ROOT / "dispatch-map-master.png").convert("RGB")
    outputs[ASSET_ROOT / "dispatch-map.png"] = ImageOps.fit(
        route, (1320, 418), Image.Resampling.LANCZOS, centering=(0.5, 0.5)
    )

    portraits = Image.open(MASTER_ROOT / "party-portraits-master.png").convert("RGB")
    portrait_boxes = [
        (32, 31, 612, 612), (643, 31, 1222, 612),
        (32, 643, 612, 1223), (643, 643, 1222, 1223),
    ]
    for portrait_id, box in zip(PORTRAIT_IDS, portrait_boxes, strict=True):
        outputs[ASSET_ROOT / "portraits" / f"{portrait_id}.png"] = ImageOps.fit(
            portraits.crop(box), (512, 512), Image.Resampling.LANCZOS
        )
    outputs[ASSET_ROOT / "chef-card.png"] = ImageOps.fit(
        portraits.crop(portrait_boxes[0]), (512, 512), Image.Resampling.LANCZOS
    )

    strip = Image.open(MASTER_ROOT / "production-strip-master.png").convert("RGB")
    x_spans = [(25, 419), (470, 840), (890, 1276), (1327, 1701), (1753, 2139)]
    y0, y1 = 149, 576
    for production_id, (x0, x1) in zip(PRODUCTION_IDS, x_spans, strict=True):
        center = (x0 + x1) // 2
        side = y1 - y0
        box = (center - side // 2, y0, center - side // 2 + side, y1)
        outputs[ASSET_ROOT / "production" / f"{production_id}.png"] = ImageOps.fit(
            strip.crop(box), (512, 512), Image.Resampling.LANCZOS
        )

    atlas = Image.open(MASTER_ROOT / "object-icons-master.png").convert("RGB")
    x_bounds = [0, 277, 535, 772, 1012, 1254]
    y_bounds = [0, 327, 633, 913, 1254]
    for index, icon_id in enumerate(ICON_IDS):
        row, column = divmod(index, 5)
        cell = atlas.crop(
            (x_bounds[column], y_bounds[row], x_bounds[column + 1], y_bounds[row + 1])
        )
        outputs[ASSET_ROOT / "icons" / f"{icon_id}.png"] = contain(cell, (256, 320))

    return outputs


def save_outputs(outputs: dict[Path, Image.Image]) -> None:
    for path, image in outputs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        image.save(path, format="PNG", optimize=True)


def build_contact_sheet(outputs: dict[Path, Image.Image]) -> Image.Image:
    canvas = Image.new("RGB", (1500, 930), (31, 43, 52))
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()

    restaurant = outputs[ASSET_ROOT / "restaurant-scene.png"].resize((650, 405), Image.Resampling.LANCZOS)
    canvas.paste(restaurant, (28, 48))
    draw.text((28, 24), "Restaurant final slot 650x405", fill=(255, 240, 205), font=font)

    chef = outputs[ASSET_ROOT / "chef-card.png"].resize((220, 220), Image.Resampling.LANCZOS)
    canvas.paste(chef, (706, 48))
    draw.text((706, 24), "Chef card crop", fill=(255, 240, 205), font=font)

    x = 28
    for production_id in PRODUCTION_IDS:
        tile = outputs[ASSET_ROOT / "production" / f"{production_id}.png"].resize(
            (112, 82), Image.Resampling.LANCZOS
        )
        canvas.paste(tile, (x, 490))
        x += 122
    draw.text((28, 468), "Production final-size row", fill=(255, 240, 205), font=font)

    route = outputs[ASSET_ROOT / "dispatch-map.png"].resize((660, 209), Image.Resampling.LANCZOS)
    canvas.paste(route, (706, 292))
    draw.text((706, 270), "Dispatch map 2x final slot", fill=(255, 240, 205), font=font)

    for index, icon_id in enumerate(ICON_IDS):
        row, column = divmod(index, 10)
        icon = outputs[ASSET_ROOT / "icons" / f"{icon_id}.png"].resize((64, 80), Image.Resampling.LANCZOS)
        px, py = 28 + column * 72, 630 + row * 120
        canvas.paste(icon, (px, py))
        draw.text((px, py + 84), icon_id[:9], fill=(240, 225, 196), font=font)

    for index, portrait_id in enumerate(PORTRAIT_IDS):
        portrait = outputs[ASSET_ROOT / "portraits" / f"{portrait_id}.png"].resize(
            (92, 92), Image.Resampling.LANCZOS
        )
        px, py = 782 + index * 110, 650
        canvas.paste(portrait, (px, py))
        draw.text((px, py + 96), portrait_id, fill=(240, 225, 196), font=font)

    return canvas


def write_manifest(outputs: dict[Path, Image.Image]) -> None:
    records = []
    for path in sorted(outputs):
        with Image.open(path) as image:
            records.append({
                "path": path.relative_to(ROOT).as_posix(),
                "width": image.width,
                "height": image.height,
                "sha256": sha256(path),
            })
    manifest = {
        "version": 1,
        "sources": SOURCE_HASHES,
        "runtime_assets": records,
        "project_vector_assets": [
            {
                "path": path.relative_to(ROOT).as_posix(),
                "sha256": sha256(path),
            }
            for path in [ASSET_ROOT / "ui-symbols.svg", ASSET_ROOT / "recipe-paper.svg"]
        ],
        "unity_note": "Import generated masters and reproduce these crop rectangles in a SpriteAtlas; runtime PNGs are prototype derivatives.",
    }
    (ASSET_ROOT / "menu-assets-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def check_outputs(outputs: dict[Path, Image.Image]) -> None:
    missing = [path for path in outputs if not path.exists()]
    if missing:
        raise SystemExit("Missing runtime menu assets:\n" + "\n".join(map(str, missing)))
    for path, expected in outputs.items():
        with Image.open(path) as actual:
            if actual.size != expected.size:
                raise SystemExit(f"Wrong size for {path}: {actual.size} != {expected.size}")
    print(f"menu_asset_check=passed outputs={len(outputs)}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.write == args.check:
        raise SystemExit("Use exactly one of --write or --check")

    verify_sources()
    outputs = build_outputs()
    if args.write:
        save_outputs(outputs)
        contact = build_contact_sheet(outputs)
        contact.save(ASSET_ROOT / "qa" / "menu-v1-final-size-contact-sheet.png", optimize=True)
        write_manifest(outputs)
        print(f"menu_asset_write=passed outputs={len(outputs)}")
    else:
        check_outputs(outputs)


if __name__ == "__main__":
    main()
