// Static file server for the release-readiness test harness (RELEASE-READINESS.md §4).
// Serves the repo root over IPv4 so test fixtures under /tests/fixtures/*.html can link the
// BUILT packages (/packages/css/dist/stisla.css, /packages/vanilla/dist/stisla.js) same-origin —
// no docs app, no sandboxed iframe. Playwright starts/stops this via `webServer` in the config.
//
// Prereq: `pnpm build:packages` (dist/ is gitignored; fixtures reference the built bundles).
// Port/host mirror the config: 5273, 127.0.0.1 (IPv4 so Playwright's healthcheck matches).
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url))); // repo root
const PORT = Number(process.env.FIXTURES_PORT ?? 5273);
const HOST = "127.0.0.1";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${HOST}:${PORT}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/tests/fixtures/index.html";
    // Contain to repo root — reject path traversal.
    const filePath = normalize(resolve(ROOT, "." + pathname));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    const body = await readFile(filePath);
    res.writeHead(200, { "content-type": TYPES[extname(filePath)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`fixtures server → http://${HOST}:${PORT}/  (root: ${ROOT})`);
});
