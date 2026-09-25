// The blog content model. A post body is an ordered array of blocks, stored as
// JSONB in `blog_posts.content`. The admin editor builds these, the save action
// runs them through `sanitizeBlocks`, and `PostContent` renders them.
//
// Shared by client and server code, so keep this file free of server-only and
// browser-only imports.

import { slugify } from "@/lib/slug";

export type BlogImage = {
  /** Storage path inside the `blog` bucket, e.g. `posts/<post-id>/abc.webp`. */
  path: string;
  alt: string;
  width: number;
  height: number;
};

export type HeadingBlock = { id: string; type: "heading"; level: 2 | 3; text: string };
export type ParagraphBlock = { id: string; type: "paragraph"; text: string };
export type ImageBlock = {
  id: string;
  type: "image";
  image: BlogImage | null;
  caption: string;
  size: "normal" | "wide";
};
export type GalleryBlock = {
  id: string;
  type: "gallery";
  images: BlogImage[];
  caption: string;
  columns: 2 | 3;
};
export type ListBlock = {
  id: string;
  type: "list";
  style: "bullet" | "number";
  /** May contain blank entries while editing; blanks are skipped on render. */
  items: string[];
};
export type QuoteBlock = { id: string; type: "quote"; text: string; cite: string };
export type CalloutBlock = {
  id: string;
  type: "callout";
  tone: "info" | "tip" | "warning";
  title: string;
  text: string;
};
export type VideoBlock = { id: string; type: "video"; url: string; caption: string };
export type CtaBlock = {
  id: string;
  type: "cta";
  title: string;
  body: string;
  label: string;
  href: string;
};
export type DividerBlock = { id: string; type: "divider" };

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | GalleryBlock
  | ListBlock
  | QuoteBlock
  | CalloutBlock
  | VideoBlock
  | CtaBlock
  | DividerBlock;

export type BlockType = Block["type"];

export const BLOCK_TYPES: { type: BlockType; label: string; hint: string }[] = [
  { type: "paragraph", label: "Paragraph", hint: "Body text with bold, italic and links" },
  { type: "heading", label: "Heading", hint: "Section title (shows in the table of contents)" },
  { type: "image", label: "Image", hint: "A single photo with caption" },
  { type: "gallery", label: "Gallery", hint: "Grid of photos, e.g. before & after" },
  { type: "list", label: "List", hint: "Bulleted or numbered list" },
  { type: "quote", label: "Quote", hint: "Customer quote or pull-quote" },
  { type: "callout", label: "Callout", hint: "Highlighted tip, note or warning" },
  { type: "video", label: "Video", hint: "YouTube or Vimeo embed" },
  { type: "cta", label: "Call to action", hint: "Button box, e.g. “Get a free quote”" },
  { type: "divider", label: "Divider", hint: "Horizontal line between sections" },
];

export function newBlockId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function createBlock(type: BlockType): Block {
  const id = newBlockId();
  switch (type) {
    case "heading":
      return { id, type, level: 2, text: "" };
    case "paragraph":
      return { id, type, text: "" };
    case "image":
      return { id, type, image: null, caption: "", size: "normal" };
    case "gallery":
      return { id, type, images: [], caption: "", columns: 2 };
    case "list":
      return { id, type, style: "bullet", items: [""] };
    case "quote":
      return { id, type, text: "", cite: "" };
    case "callout":
      return { id, type, tone: "tip", title: "", text: "" };
    case "video":
      return { id, type, url: "", caption: "" };
    case "cta":
      return {
        id,
        type,
        title: "Planning a project like this?",
        body: "Get a free, no-obligation quote from our Thunder Bay crew.",
        label: "Get A Free Quote",
        href: "/quote",
      };
    case "divider":
      return { id, type };
  }
}

/** Deep copy with fresh ids, for the editor's "duplicate block" button. */
export function cloneBlock(block: Block): Block {
  return { ...structuredClone(block), id: newBlockId() };
}

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

/**
 * Allow-list a link target typed by an editor. Returns null for anything that
 * could execute script (javascript:, data:, ...). Site-relative paths are kept
 * relative so they route client-side and count as internal links.
 */
export function safeHref(raw: string): string | null {
  const href = raw.trim();
  if (!href) return null;
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (href.startsWith("#")) return href;
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  if (/^www\./i.test(href)) return `https://${href}`;
  return null;
}

export function isExternalHref(href: string): boolean {
  return /^https?:/i.test(href);
}

// ---------------------------------------------------------------------------
// Video
// ---------------------------------------------------------------------------

export type ParsedVideo = { provider: "youtube" | "vimeo"; id: string; embedUrl: string };

/** Turn a YouTube or Vimeo page URL into an embeddable player URL. */
export function parseVideoUrl(raw: string): ParsedVideo | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, "");

  let youtubeId: string | null | undefined;
  if (host === "youtu.be") {
    youtubeId = url.pathname.slice(1).split("/")[0];
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    youtubeId =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
  }
  if (youtubeId && /^[A-Za-z0-9_-]{11}$/.test(youtubeId)) {
    return {
      provider: "youtube",
      id: youtubeId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
    };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const vimeoId = url.pathname.match(/(?:^|\/)(\d{6,12})(?:\/|$)/)?.[1];
    if (vimeoId) {
      return {
        provider: "vimeo",
        id: vimeoId,
        embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

// Inline markup understood inside text fields: **bold**, *italic*, [text](url).
// Italic markers must hug the text, so "2 * 3 * 4" stays literal.
export const INLINE_TOKEN =
  /\*\*(.+?)\*\*|\[([^\]\n]+)\]\(([^)\s]+)\)|\*(?![\s*])([^*\n]*[^*\s])\*/;

/** Remove the inline markup from a string, keeping the visible text. */
export function stripInline(text: string): string {
  return text.replace(
    new RegExp(INLINE_TOKEN.source, "g"),
    (_match, bold?: string, linkText?: string, _href?: string, italic?: string) =>
      stripInline(bold ?? linkText ?? italic ?? ""),
  );
}

/** All reader-visible text in a block, markup removed. */
export function blockText(block: Block): string {
  switch (block.type) {
    case "heading":
    case "paragraph":
      return stripInline(block.text);
    case "image":
      return block.caption;
    case "gallery":
      return block.caption;
    case "list":
      return block.items.map(stripInline).join(" ");
    case "quote":
      return `${block.text} ${block.cite}`;
    case "callout":
      return `${block.title} ${stripInline(block.text)}`;
    case "video":
      return block.caption;
    case "cta":
      return `${block.title} ${block.body}`;
    case "divider":
      return "";
  }
}

export function readingMinutes(blocks: Block[]): number {
  const words = blocks
    .map(blockText)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** First ~`max` characters of body text, cut at a word, for an auto excerpt. */
export function autoExcerpt(blocks: Block[], max = 200): string {
  const text = blocks
    .filter((b) => b.type === "paragraph")
    .map(blockText)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, "")}…`;
}

export function hasRenderableContent(block: Block): boolean {
  switch (block.type) {
    case "heading":
    case "paragraph":
      return block.text.trim().length > 0;
    case "image":
      return block.image !== null;
    case "gallery":
      return block.images.length > 0;
    case "list":
      return block.items.some((i) => i.trim());
    case "quote":
      return block.text.trim().length > 0;
    case "callout":
      return block.text.trim().length > 0 || block.title.trim().length > 0;
    case "video":
      return parseVideoUrl(block.url) !== null;
    case "cta":
      return block.title.trim().length > 0 && safeHref(block.href) !== null;
    case "divider":
      return true;
  }
}

export type OutlineItem = { blockId: string; anchor: string; text: string; level: 2 | 3 };

/**
 * Headings with stable, unique anchor ids. Both the table of contents and the
 * heading renderer read from this so their ids always agree.
 */
export function buildOutline(blocks: Block[]): OutlineItem[] {
  const seen = new Map<string, number>();
  const out: OutlineItem[] = [];
  for (const block of blocks) {
    if (block.type !== "heading" || !block.text.trim()) continue;
    const text = stripInline(block.text).trim();
    const base = slugify(text) || "section";
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    out.push({
      blockId: block.id,
      anchor: n === 1 ? base : `${base}-${n}`,
      text,
      level: block.level,
    });
  }
  return out;
}

/** Every storage path a set of blocks points at. */
export function blockImagePaths(blocks: Block[]): string[] {
  const paths: string[] = [];
  for (const block of blocks) {
    if (block.type === "image" && block.image) paths.push(block.image.path);
    if (block.type === "gallery") paths.push(...block.images.map((i) => i.path));
  }
  return paths;
}

// ---------------------------------------------------------------------------
// Server-side validation
// ---------------------------------------------------------------------------

const MAX_BLOCKS = 300;
const MAX_GALLERY_IMAGES = 24;
const MAX_LIST_ITEMS = 100;

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}

function int(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? Math.min(Math.round(n), 20000) : 0;
}

/** Storage paths must live in this post's own folder. */
export function isPostImagePath(path: unknown, postId: string): path is string {
  return (
    typeof path === "string" &&
    path.startsWith(`posts/${postId}/`) &&
    /^[A-Za-z0-9/_.-]+$/.test(path) &&
    !path.includes("..")
  );
}

export function sanitizeImage(v: unknown, postId: string): BlogImage | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (!isPostImagePath(o.path, postId)) return null;
  const width = int(o.width);
  const height = int(o.height);
  if (!width || !height) return null;
  return { path: o.path, alt: str(o.alt, 300).trim(), width, height };
}

function sanitizeBlock(v: unknown, postId: string): Block | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const id = typeof o.id === "string" && /^[A-Za-z0-9_-]{1,40}$/.test(o.id) ? o.id : newBlockId();

  switch (o.type) {
    case "heading":
      return { id, type: "heading", level: o.level === 3 ? 3 : 2, text: str(o.text, 300) };
    case "paragraph":
      return { id, type: "paragraph", text: str(o.text, 10000) };
    case "image":
      return {
        id,
        type: "image",
        image: sanitizeImage(o.image, postId),
        caption: str(o.caption, 500),
        size: o.size === "wide" ? "wide" : "normal",
      };
    case "gallery":
      return {
        id,
        type: "gallery",
        images: (Array.isArray(o.images) ? o.images : [])
          .map((img) => sanitizeImage(img, postId))
          .filter((img): img is BlogImage => img !== null)
          .slice(0, MAX_GALLERY_IMAGES),
        caption: str(o.caption, 500),
        columns: o.columns === 3 ? 3 : 2,
      };
    case "list":
      return {
        id,
        type: "list",
        style: o.style === "number" ? "number" : "bullet",
        items: (Array.isArray(o.items) ? o.items : [])
          .map((item) => str(item, 1000))
          .slice(0, MAX_LIST_ITEMS),
      };
    case "quote":
      return { id, type: "quote", text: str(o.text, 3000), cite: str(o.cite, 200) };
    case "callout":
      return {
        id,
        type: "callout",
        tone: o.tone === "info" || o.tone === "warning" ? o.tone : "tip",
        title: str(o.title, 200),
        text: str(o.text, 3000),
      };
    case "video":
      return { id, type: "video", url: str(o.url, 500).trim(), caption: str(o.caption, 500) };
    case "cta":
      return {
        id,
        type: "cta",
        title: str(o.title, 200),
        body: str(o.body, 1000),
        label: str(o.label, 60),
        href: str(o.href, 500).trim(),
      };
    case "divider":
      return { id, type: "divider" };
    default:
      return null;
  }
}

/**
 * Validate untrusted block JSON from the editor. Unknown block types and
 * malformed fields are dropped, strings are length-capped, and image paths
 * must point into this post's storage folder.
 */
export function sanitizeBlocks(input: unknown, postId: string): Block[] {
  if (!Array.isArray(input)) return [];
  const ids = new Set<string>();
  const out: Block[] = [];
  for (const raw of input.slice(0, MAX_BLOCKS)) {
    const block = sanitizeBlock(raw, postId);
    if (!block) continue;
    if (ids.has(block.id)) block.id = newBlockId();
    ids.add(block.id);
    out.push(block);
  }
  return out;
}
