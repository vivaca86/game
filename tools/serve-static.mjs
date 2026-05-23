import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requestedRoot = process.argv[2] ? path.resolve(repoRoot, process.argv[2]) : repoRoot;
const port = Number(process.env.PORT || 4173);

if (!requestedRoot.startsWith(repoRoot)) {
  throw new Error("서버 루트는 저장소 안쪽이어야 합니다.");
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp"
};

function resolveRequestPath(url) {
  const requestUrl = new URL(url, `http://127.0.0.1:${port}`);
  const decodedPath = decodeURIComponent(requestUrl.pathname);
  const targetPath = path.resolve(requestedRoot, `.${decodedPath}`);
  if (!targetPath.startsWith(requestedRoot)) {
    return null;
  }
  return targetPath;
}

const server = createServer(async (request, response) => {
  try {
    let targetPath = resolveRequestPath(request.url || "/");
    if (!targetPath) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const info = await stat(targetPath).catch(() => null);
    if (!info) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    if (info.isDirectory()) {
      targetPath = path.join(targetPath, "index.html");
    }

    const body = await readFile(targetPath);
    const contentType = mimeTypes[path.extname(targetPath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    response.end(body);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`서버 오류: ${error.message}`);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`개발 서버 실행 중: http://127.0.0.1:${port}/`);
  console.log(`루트: ${requestedRoot}`);
});
