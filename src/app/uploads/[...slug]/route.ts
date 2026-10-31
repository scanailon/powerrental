import { promises as fs } from "node:fs";
import path from "node:path";
import { uploadsDir } from "@/lib/uploads";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/** Resuelve la ruta dentro de la carpeta de uploads, bloqueando path traversal. */
function resolveUpload(slug: string[]) {
  if (slug.some((s) => s === "" || s.includes("..") || s.startsWith("."))) return null;
  const base = uploadsDir();
  const full = path.join(/*turbopackIgnore: true*/ base, ...slug);
  return full.startsWith(base + path.sep) ? full : null;
}

// Sirve las imágenes subidas desde el panel (viven fuera de /public).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const file = resolveUpload(slug);
  if (!file) return new Response("Not found", { status: 404 });

  let stat;
  try {
    stat = await fs.stat(/*turbopackIgnore: true*/ file);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (!stat.isFile()) return new Response("Not found", { status: 404 });

  const type = MIME[path.extname(file).slice(1).toLowerCase()] ?? "application/octet-stream";
  return new Response(await fs.readFile(/*turbopackIgnore: true*/ file), {
    headers: {
      "Content-Type": type,
      "Content-Length": String(stat.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
