// Browser-only: resize + upload a blog image straight to Supabase Storage with
// the signed-in admin's session. Going direct (rather than through a Server
// Action) avoids the 1 MB Server Action body limit and Vercel's request cap —
// phone photos are routinely 5–10 MB.

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { BLOG_BUCKET, postImageFolder } from "@/lib/blog/images";
import { slugify } from "@/lib/slug";
import type { BlogImage } from "@/lib/blog/blocks";

// Wide enough for a full-bleed image on a 2x screen, small enough to keep the
// free-tier storage and bandwidth budget comfortable.
const MAX_DIMENSION = 2400;
const MAX_SOURCE_BYTES = 40 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // matches the bucket's file_size_limit
const PASSTHROUGH_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

type Prepared = { blob: Blob; width: number; height: number; ext: string; type: string };

function encode(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

function extFor(type: string): string {
  if (type === "image/jpeg") return "jpg";
  return type.split("/")[1] ?? "img";
}

async function prepare(file: File): Promise<Prepared> {
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error(`${file.name} is too large (40 MB max).`);
  }

  let bitmap: ImageBitmap;
  try {
    // Honors EXIF orientation, so portrait phone shots come out upright.
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(`${file.name} isn't an image this browser can read. Use JPG, PNG or WebP.`);
  }
  const { width, height } = bitmap;

  // Leave GIFs untouched so animations survive.
  if (file.type === "image/gif") {
    bitmap.close();
    return { blob: file, width, height, ext: "gif", type: "image/gif" };
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    if (!PASSTHROUGH_TYPES.has(file.type)) throw new Error(`Couldn't process ${file.name}.`);
    return { blob: file, width, height, ext: extFor(file.type), type: file.type };
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  let out = await encode(canvas, "image/webp", 0.85);
  // Browsers without a WebP encoder silently hand back a PNG instead.
  if (!out || out.type !== "image/webp") {
    // Paint a white backdrop first so transparent areas don't turn black as JPEG.
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    out = await encode(canvas, "image/jpeg", 0.85);
  }
  if (!out) throw new Error(`Couldn't process ${file.name}.`);

  // Already small and web-friendly? Keep the original bytes.
  if (scale === 1 && PASSTHROUGH_TYPES.has(file.type) && file.size <= out.size) {
    return { blob: file, width, height, ext: extFor(file.type), type: file.type };
  }
  return { blob: out, width: w, height: h, ext: extFor(out.type), type: out.type };
}

export async function uploadBlogImage(file: File, postId: string): Promise<BlogImage> {
  const prepared = await prepare(file);
  if (prepared.blob.size > MAX_UPLOAD_BYTES) {
    throw new Error(`${file.name} is still over 10 MB after compressing. Try a smaller image.`);
  }

  const base = slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 40) || "image";
  const unique = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const path = `${postImageFolder(postId)}/${unique}-${base}.${prepared.ext}`;

  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.storage.from(BLOG_BUCKET).upload(path, prepared.blob, {
    contentType: prepared.type,
    // Paths are unique per upload, so the file at a URL never changes.
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  return { path, alt: "", width: prepared.width, height: prepared.height };
}
