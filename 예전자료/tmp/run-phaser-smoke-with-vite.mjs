import { createServer } from "vite";

async function startServer() {
  for (const port of [4177, 4178, 4179, 4180]) {
    try {
      const server = await createServer({
        root: process.cwd(),
        logLevel: "silent",
        server: { host: "127.0.0.1", port, strictPort: true }
      });
      await server.listen();
      return { server, baseUrl: `http://127.0.0.1:${port}/` };
    } catch (error) {
      if (!String(error?.message ?? error).includes("Port")) throw error;
    }
  }
  throw new Error("No free smoke port found");
}

let server;

try {
  const started = await startServer();
  server = started.server;
  process.env.PHASER_SMOKE_URL = started.baseUrl;
  await import("../tools/phaser-smoke-test.mjs");
} finally {
  if (server) await server.close();
}
