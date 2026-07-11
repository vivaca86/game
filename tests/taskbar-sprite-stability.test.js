const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const root = path.resolve(__dirname, "..");
const spritePath = path.join(
  root,
  "assets/taskbar-cat-baker-v2/taskbar-cat-baker-v2-atlas.png"
);

const COLUMNS = 2;
const ROWS = 2;
const FRAME_COUNT = COLUMNS * ROWS;
const SOURCE_FRAME_WIDTH = 512;
const SOURCE_FRAME_HEIGHT = 512;
const DISPLAY_FRAME_WIDTH = 128;
const DISPLAY_FRAME_HEIGHT = 128;
// The lower source rows isolate the paws/dough/counter support mass from the
// face. Alpha 32 keeps visible antialiasing while excluding transparent fringe
// noise that should not influence the perceived anchor.
const LOWER_BODY_START_Y = 320;
const ALPHA_THRESHOLD = 32;
const SELECTED_FRAMES = Object.freeze([
  { frame: 0, cssOffsetX: 0, cssOffsetY: 0 },
  { frame: 1, cssOffsetX: -128, cssOffsetY: 0 },
  { frame: 2, cssOffsetX: 0, cssOffsetY: -128 },
  { frame: 3, cssOffsetX: -128, cssOffsetY: -128 }
]);

function paethPredictor(left, up, upperLeft) {
  const prediction = left + up - upperLeft;
  const leftDistance = Math.abs(prediction - left);
  const upDistance = Math.abs(prediction - up);
  const upperLeftDistance = Math.abs(prediction - upperLeft);

  if (leftDistance <= upDistance && leftDistance <= upperLeftDistance) return left;
  if (upDistance <= upperLeftDistance) return up;
  return upperLeft;
}

/**
 * Minimal, deterministic decoder for this project's 8-bit RGBA, non-interlaced
 * PNG master. Keeping the analyzer in Node avoids image-library differences in
 * CI and makes the Unity-import stability threshold reproducible.
 */
function decodeRgbaPng(bytes) {
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");

  let offset = 8;
  let header = null;
  const compressedParts = [];

  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    offset += length + 12;

    if (type === "IHDR") {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        compression: data[10],
        filter: data[11],
        interlace: data[12]
      };
    } else if (type === "IDAT") {
      compressedParts.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  assert.ok(header, "PNG must contain IHDR");
  assert.equal(header.bitDepth, 8);
  assert.equal(header.colorType, 6, "analyzer expects RGBA pixels");
  assert.equal(header.compression, 0);
  assert.equal(header.filter, 0);
  assert.equal(header.interlace, 0, "analyzer expects a non-interlaced sprite");
  assert.ok(compressedParts.length > 0, "PNG must contain IDAT data");

  const bytesPerPixel = 4;
  const stride = header.width * bytesPerPixel;
  const inflated = zlib.inflateSync(Buffer.concat(compressedParts));
  const expectedLength = header.height * (stride + 1);
  assert.equal(inflated.length, expectedLength);

  const pixels = Buffer.alloc(header.height * stride);
  let inputOffset = 0;

  for (let y = 0; y < header.height; y += 1) {
    const filterType = inflated[inputOffset];
    inputOffset += 1;
    const outputRowOffset = y * stride;
    const previousRowOffset = (y - 1) * stride;

    for (let x = 0; x < stride; x += 1) {
      const raw = inflated[inputOffset + x];
      const left = x >= bytesPerPixel ? pixels[outputRowOffset + x - bytesPerPixel] : 0;
      const up = y > 0 ? pixels[previousRowOffset + x] : 0;
      const upperLeft = y > 0 && x >= bytesPerPixel
        ? pixels[previousRowOffset + x - bytesPerPixel]
        : 0;
      let value;

      switch (filterType) {
        case 0:
          value = raw;
          break;
        case 1:
          value = raw + left;
          break;
        case 2:
          value = raw + up;
          break;
        case 3:
          value = raw + Math.floor((left + up) / 2);
          break;
        case 4:
          value = raw + paethPredictor(left, up, upperLeft);
          break;
        default:
          assert.fail(`unsupported PNG row filter ${filterType}`);
      }

      pixels[outputRowOffset + x] = value & 0xff;
    }

    inputOffset += stride;
  }

  return { ...header, pixels, stride, bytesPerPixel };
}

function analyzeLowerBody(image, frame) {
  let weightedX = 0;
  let alphaWeight = 0;
  let visiblePixelCount = 0;
  let baselineY = -1;
  const column = frame % COLUMNS;
  const row = Math.floor(frame / COLUMNS);
  const frameStartX = column * SOURCE_FRAME_WIDTH;
  const frameStartY = row * SOURCE_FRAME_HEIGHT;

  for (let y = LOWER_BODY_START_Y; y < SOURCE_FRAME_HEIGHT; y += 1) {
    for (let x = 0; x < SOURCE_FRAME_WIDTH; x += 1) {
      const sourceX = frameStartX + x;
      const sourceY = frameStartY + y;
      const alphaOffset = sourceY * image.stride + sourceX * image.bytesPerPixel + 3;
      const alpha = image.pixels[alphaOffset];

      if (alpha < ALPHA_THRESHOLD) continue;
      weightedX += x * alpha;
      alphaWeight += alpha;
      visiblePixelCount += 1;
      baselineY = y;
    }
  }

  assert.ok(alphaWeight > 0, `frame ${frame} lower body must contain visible pixels`);
  const sourceCenterX = weightedX / alphaWeight;

  return {
    frame,
    visiblePixelCount,
    sourceCenterX,
    displayCenterX: sourceCenterX * (DISPLAY_FRAME_WIDTH / SOURCE_FRAME_WIDTH),
    sourceBaselineY: baselineY,
    displayBaselineY: baselineY * (DISPLAY_FRAME_HEIGHT / SOURCE_FRAME_HEIGHT)
  };
}

test("all registered baker v2 poses keep lower-body center within one displayed pixel and share a fixed baseline", (context) => {
  const image = decodeRgbaPng(fs.readFileSync(spritePath));
  assert.equal(image.width, COLUMNS * SOURCE_FRAME_WIDTH);
  assert.equal(image.height, ROWS * SOURCE_FRAME_HEIGHT);

  for (const selection of SELECTED_FRAMES) {
    const column = selection.frame % COLUMNS;
    const row = Math.floor(selection.frame / COLUMNS);
    assert.equal(
      column === 0 ? 0 : -column * DISPLAY_FRAME_WIDTH,
      selection.cssOffsetX,
      `frame ${selection.frame} CSS X offset must match the 128px display grid`
    );
    assert.equal(
      row === 0 ? 0 : -row * DISPLAY_FRAME_HEIGHT,
      selection.cssOffsetY,
      `frame ${selection.frame} CSS Y offset must match the 128px display grid`
    );
  }

  const measurements = SELECTED_FRAMES.map(({ frame }) => analyzeLowerBody(image, frame));
  const displayCenters = measurements.map((measurement) => measurement.displayCenterX);
  const centerSpread = Math.max(...displayCenters) - Math.min(...displayCenters);
  const sourceBaselines = measurements.map((measurement) => measurement.sourceBaselineY);

  assert.ok(
    centerSpread < 1,
    `displayed lower-body center spread must be <1px; measured ${centerSpread.toFixed(4)}px`
  );
  assert.deepEqual(sourceBaselines, [511, 511, 511, 511]);

  const summary = measurements
    .map((measurement) => (
      `f${measurement.frame}: center=${measurement.displayCenterX.toFixed(4)}px, ` +
      `baseline=${measurement.displayBaselineY.toFixed(4)}px`
    ))
    .join(" | ");
  context.diagnostic(`${summary} | center spread=${centerSpread.toFixed(4)}px`);
});
