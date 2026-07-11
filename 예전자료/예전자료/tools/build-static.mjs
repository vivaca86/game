import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(repoRoot, "dist");
const requiredEntries = ["index.html", "src", ".nojekyll"];

if (!distDir.startsWith(`${repoRoot}${path.sep}`)) {
  throw new Error("dist 경로가 저장소 밖입니다.");
}

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const entry of requiredEntries) {
  const from = path.join(repoRoot, entry);
  const to = path.join(distDir, entry);
  const info = await stat(from).catch(() => null);
  if (!info) {
    console.warn(`건너뜀: ${entry}`);
    continue;
  }
  await cp(from, to, { recursive: true });
  console.log(`복사 완료: ${entry}`);
}

console.log(`정적 빌드 완료: ${distDir}`);
