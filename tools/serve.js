/* Minimal static file server for local preview / Lighthouse testing. No deps. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "..", "dist");
const PORT = process.env.PORT || 8080;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".ico": "image/x-icon",
};

async function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  let fp = path.join(DIST, p);
  try {
    const s = await stat(fp);
    if (s.isDirectory()) fp = path.join(fp, "index.html");
    return fp;
  } catch {
    if (!path.extname(fp)) {
      const idx = path.join(DIST, p, "index.html");
      try { await stat(idx); return idx; } catch {}
    }
    return null;
  }
}

createServer(async (req, res) => {
  const fp = await resolveFile(req.url);
  if (!fp) {
    const nf = path.join(DIST, "404.html");
    try {
      const body = await readFile(nf);
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      return res.end(body);
    } catch {
      res.writeHead(404); return res.end("404");
    }
  }
  try {
    const body = await readFile(fp);
    const ext = path.extname(fp);
    res.writeHead(200, {
      "content-type": TYPES[ext] || "application/octet-stream",
      "cache-control": ext === ".html" ? "no-cache" : "public, max-age=31536000",
    });
    res.end(body);
  } catch {
    res.writeHead(500); res.end("500");
  }
}).listen(PORT, () => {
  console.log(`LEGIUS dev server → http://localhost:${PORT}`);
});
