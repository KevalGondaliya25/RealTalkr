import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ICON_DIR = path.join(process.cwd(), "public", "assets", "icons");
const ICON_EXTS = ["svg", "avif", "jpg", "png"] as const;
const MIME: Record<string, string> = {
  svg: "image/svg+xml",
  avif: "image/avif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

function safeJoin(base: string, p: string) {
  const full = path.join(base, p);
  if (!full.startsWith(base)) throw new Error("Invalid path");
  return full;
}

async function findFile(rel: string): Promise<{ abs: string; ext: string } | null> {
  const hasExt = /\.[a-z0-9]+$/i.test(rel);
  const candidates = hasExt ? [rel] : ICON_EXTS.map((e) => `${rel}.${e}`);
  for (const c of candidates) {
    const abs = safeJoin(ICON_DIR, c);
    try {
      await fs.access(abs);
      const ext = (path.extname(abs).slice(1) || "svg").toLowerCase();
      return { abs, ext };
    } catch {}
  }
  return null;
}

export async function GET(
  req: Request,
  ctx: { params: { file: string[] } }
) {
  try {
    const slugs = ctx.params.file || [];
    const rel = slugs.map(decodeURIComponent).join("/");
    const hit = await findFile(rel);
    const chosen = hit ?? { abs: safeJoin(ICON_DIR, "default.svg"), ext: "svg" };

    const buf = await fs.readFile(chosen.abs);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": MIME[chosen.ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    // Hard fallback to default.svg
    const def = safeJoin(ICON_DIR, "default.svg");
    const buf = await fs.readFile(def).catch(() => Buffer.from(""));
    return new NextResponse(buf, {
      status: 200,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}