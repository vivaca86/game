import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { inflateSync } from "node:zlib";

const inputPath = resolve(process.argv[2] || "assets/concept/widget-chef-cat-generated-cook-v31-16.png");
const frameWidth = Number(process.argv[3] || 180);
const frameHeight = Number(process.argv[4] || 170);
const png = readFileSync(inputPath);

function fail(message) {
  throw new Error(message);
}

function paeth(left, above, upperLeft) {
  const prediction = left + above - upperLeft;
  const leftDistance = Math.abs(prediction - left);
  const aboveDistance = Math.abs(prediction - above);
  const upperLeftDistance = Math.abs(prediction - upperLeft);
  if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left;
  return aboveDistance <= upperLeftDistance ? above : upperLeft;
}

function decodeRgba8(buffer) {
  if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") fail("Not a PNG");
  let offset = 8;
  let width;
  let height;
  let bitDepth;
  let colorType;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      if (data[10] !== 0 || data[11] !== 0 || data[12] !== 0) fail("Unsupported PNG compression/filter/interlace");
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (bitDepth !== 8 || colorType !== 6) fail(`Expected 8-bit RGBA PNG, got depth=${bitDepth} type=${colorType}`);
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const inflated = inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(width * height * bytesPerPixel);
  let inputOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[inputOffset];
    inputOffset += 1;
    const rowOffset = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const raw = inflated[inputOffset + x];
      const left = x >= bytesPerPixel ? pixels[rowOffset + x - bytesPerPixel] : 0;
      const above = y > 0 ? pixels[rowOffset + x - stride] : 0;
      const upperLeft = y > 0 && x >= bytesPerPixel ? pixels[rowOffset + x - stride - bytesPerPixel] : 0;
      let value;
      if (filter === 0) value = raw;
      else if (filter === 1) value = raw + left;
      else if (filter === 2) value = raw + above;
      else if (filter === 3) value = raw + Math.floor((left + above) / 2);
      else if (filter === 4) value = raw + paeth(left, above, upperLeft);
      else fail(`Unsupported PNG filter ${filter}`);
      pixels[rowOffset + x] = value & 0xff;
    }
    inputOffset += stride;
  }

  return { width, height, pixels };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function analyzeFrame(image, frameIndex) {
  const frameLeft = frameIndex * frameWidth;
  let minX = frameWidth;
  let minY = frameHeight;
  let maxX = -1;
  let maxY = -1;
  let alphaTotal = 0;
  let weightedX = 0;
  let weightedY = 0;
  let lowerAlphaTotal = 0;
  let lowerWeightedX = 0;
  let lowerWeightedY = 0;
  let opaquePixels = 0;

  for (let y = 0; y < frameHeight; y += 1) {
    for (let x = 0; x < frameWidth; x += 1) {
      const alpha = image.pixels[((y * image.width) + frameLeft + x) * 4 + 3];
      if (alpha < 24) continue;
      opaquePixels += 1;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      alphaTotal += alpha;
      weightedX += x * alpha;
      weightedY += y * alpha;
      if (y >= 105) {
        lowerAlphaTotal += alpha;
        lowerWeightedX += x * alpha;
        lowerWeightedY += y * alpha;
      }
    }
  }

  return {
    frame: frameIndex,
    bbox: { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1, right: maxX, bottom: maxY },
    centroid: { x: weightedX / alphaTotal, y: weightedY / alphaTotal },
    lowerCentroid: { x: lowerWeightedX / lowerAlphaTotal, y: lowerWeightedY / lowerAlphaTotal },
    opaquePixels
  };
}

const image = decodeRgba8(png);
if (image.width % frameWidth !== 0 || image.height !== frameHeight) {
  fail(`Frame grid mismatch: image=${image.width}x${image.height} frame=${frameWidth}x${frameHeight}`);
}

const frameCount = image.width / frameWidth;
const frames = Array.from({ length: frameCount }, (_, index) => analyzeFrame(image, index));
const medianLowerX = median(frames.map((frame) => frame.lowerCentroid.x));
const medianBottom = median(frames.map((frame) => frame.bbox.bottom));
const medianCentroidX = median(frames.map((frame) => frame.centroid.x));

for (const frame of frames) {
  frame.offsetToMedian = {
    lowerX: medianLowerX - frame.lowerCentroid.x,
    bottomY: medianBottom - frame.bbox.bottom,
    centroidX: medianCentroidX - frame.centroid.x
  };
}

const summary = {
  input: inputPath,
  image: { width: image.width, height: image.height },
  frame: { width: frameWidth, height: frameHeight, count: frameCount },
  medians: { lowerX: medianLowerX, bottom: medianBottom, centroidX: medianCentroidX },
  ranges: {
    lowerX: [Math.min(...frames.map((frame) => frame.lowerCentroid.x)), Math.max(...frames.map((frame) => frame.lowerCentroid.x))],
    centroidX: [Math.min(...frames.map((frame) => frame.centroid.x)), Math.max(...frames.map((frame) => frame.centroid.x))],
    bboxLeft: [Math.min(...frames.map((frame) => frame.bbox.x)), Math.max(...frames.map((frame) => frame.bbox.x))],
    bboxRight: [Math.min(...frames.map((frame) => frame.bbox.right)), Math.max(...frames.map((frame) => frame.bbox.right))],
    bboxBottom: [Math.min(...frames.map((frame) => frame.bbox.bottom)), Math.max(...frames.map((frame) => frame.bbox.bottom))]
  },
  frames
};

console.log(JSON.stringify(summary, null, 2));
