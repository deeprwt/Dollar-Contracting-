"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  Loader2,
  ImagePlus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mainNav } from "@/lib/site-config";
import { blogImageUrl } from "@/lib/blog/images";
import {
  parseVideoUrl,
  safeHref,
  type Block,
  type CalloutBlock,
  type CtaBlock,
  type GalleryBlock,
  type HeadingBlock,
  type ImageBlock,
  type ListBlock,
  type ParagraphBlock,
  type QuoteBlock,
  type VideoBlock,
} from "@/lib/blog/blocks";
import { ImageField } from "./image-field";
import { uploadBlogImage } from "./upload-image";

export type FieldProps<T extends Block> = {
  block: T;
  update: (fn: (b: T) => T) => void;
  postId: string;
  onUploadingChange: (delta: 1 | -1) => void;
  autoFocus: boolean;
};

function patchWith<T extends Block>(update: FieldProps<T>["update"]) {
  return (patch: Partial<T>) => update((b) => ({ ...b, ...patch }));
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

export function Segmented<V extends string | number>({
  value,
  options,
  onChange,
  label,
}: {
  value: V;
  options: { value: V; label: string }[];
  onChange: (v: V) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-md border border-border bg-muted/40 p-0.5">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded px-2.5 py-1 text-xs font-medium transition ${
            value === o.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
      {children}
    </label>
  );
}

// Internal pages an editor can link to in one click — internal links from blog
// posts to service and location pages are one of the best local-SEO signals.
const SITE_LINKS = mainNav.flatMap((item) =>
  item.sections
    ? item.sections.flatMap((s) =>
        s.items.map((c) => ({ group: item.label, label: c.label, href: c.href })),
      )
    : [{ group: "Pages", label: item.label, href: item.href }],
);
const SITE_LINK_GROUPS = [...new Set(SITE_LINKS.map((l) => l.group))];

/**
 * Plain textarea with a small toolbar for the inline markup the renderer
 * understands: **bold**, *italic* and [text](url).
 */
export function RichTextarea({
  value,
  onChange,
  placeholder,
  autoFocus,
  minRows = 3,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  minRows?: number;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function replaceSelection(build: (selected: string) => { text: string; select: [number, number] }) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const { text, select } = build(value.slice(start, end));
    onChange(value.slice(0, start) + text + value.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + select[0], start + select[1]);
    });
  }

  function wrap(mark: string, fallback: string) {
    replaceSelection((selected) => {
      const inner = selected || fallback;
      return { text: `${mark}${inner}${mark}`, select: [mark.length, mark.length + inner.length] };
    });
  }

  function link(href = "https://", label?: string) {
    replaceSelection((selected) => {
      const inner = selected || label || "link text";
      const text = `[${inner}](${href})`;
      // With text already chosen, jump to the URL; otherwise select the text.
      const urlStart = inner.length + 3;
      return {
        text,
        select:
          selected || label ? [urlStart, urlStart + href.length] : [1, 1 + inner.length],
      };
    });
  }

  return (
    <div className={`rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 ${className}`}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-1.5 py-1">
        <ToolbarButton title="Bold (Ctrl+B)" onClick={() => wrap("**", "bold text")}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Italic (Ctrl+I)" onClick={() => wrap("*", "italic text")}>
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Link (Ctrl+K)" onClick={() => link()}>
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <select
          aria-label="Link to a page on this site"
          value=""
          onChange={(e) => {
            const target = SITE_LINKS.find((l) => l.href === e.target.value);
            if (target) link(target.href, target.label);
          }}
          className="ml-1 h-7 max-w-44 rounded-md border-0 bg-transparent px-1.5 text-xs text-muted-foreground hover:bg-muted focus:outline-none"
        >
          <option value="">Link to our page…</option>
          {SITE_LINK_GROUPS.map((group) => (
            <optgroup key={group} label={group}>
              {SITE_LINKS.filter((l) => l.group === group).map((l) => (
                <option key={l.href} value={l.href}>
                  {l.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <textarea
        ref={ref}
        value={value}
        autoFocus={autoFocus}
        rows={minRows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (!(e.ctrlKey || e.metaKey)) return;
          const key = e.key.toLowerCase();
          if (key === "b") {
            e.preventDefault();
            wrap("**", "bold text");
          } else if (key === "i") {
            e.preventDefault();
            wrap("*", "italic text");
          } else if (key === "k") {
            e.preventDefault();
            link();
          }
        }}
        className="block field-sizing-content w-full resize-none bg-transparent px-3 py-2 text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

function ToolbarButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      // Keep the textarea's selection when clicking the toolbar.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Block editors
// ---------------------------------------------------------------------------

export function HeadingFields({ block, update, autoFocus }: FieldProps<HeadingBlock>) {
  const set = patchWith(update);
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Segmented
        label="Heading size"
        value={block.level}
        options={[
          { value: 2, label: "H2 Section" },
          { value: 3, label: "H3 Sub-section" },
        ]}
        onChange={(level) => set({ level })}
      />
      <Input
        value={block.text}
        autoFocus={autoFocus}
        maxLength={300}
        onChange={(e) => set({ text: e.target.value })}
        placeholder="Section heading"
        className={`h-10 flex-1 font-semibold ${block.level === 2 ? "text-lg md:text-lg" : "text-base md:text-base"}`}
      />
    </div>
  );
}

export function ParagraphFields({ block, update, autoFocus }: FieldProps<ParagraphBlock>) {
  const set = patchWith(update);
  return (
    <RichTextarea
      value={block.text}
      autoFocus={autoFocus}
      onChange={(text) => set({ text })}
      placeholder="Write something… Leave a blank line to start a new paragraph."
      minRows={4}
    />
  );
}

export function ImageFields({ block, update, postId, onUploadingChange }: FieldProps<ImageBlock>) {
  const set = patchWith(update);
  return (
    <div className="space-y-3">
      <ImageField
        postId={postId}
        image={block.image}
        setImage={(fn) => update((b) => ({ ...b, image: fn(b.image) }))}
        onUploadingChange={onUploadingChange}
      />
      {block.image && (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <FieldLabel>Caption (optional)</FieldLabel>
            <Input
              value={block.caption}
              maxLength={500}
              onChange={(e) => set({ caption: e.target.value })}
              placeholder="Shown under the photo"
              className="mt-1"
            />
          </div>
          <Segmented
            label="Image width"
            value={block.size}
            options={[
              { value: "normal", label: "Text width" },
              { value: "wide", label: "Wide" },
            ]}
            onChange={(size) => set({ size })}
          />
        </div>
      )}
    </div>
  );
}

const MAX_GALLERY = 24;

export function GalleryFields({ block, update, postId, onUploadingChange }: FieldProps<GalleryBlock>) {
  const set = patchWith(update);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const room = MAX_GALLERY - block.images.length;

  async function addFiles(files: FileList | null | undefined) {
    if (!files?.length) return;
    setError(null);
    const list = [...files].slice(0, Math.max(0, room));
    if (files.length > list.length) setError(`A gallery holds up to ${MAX_GALLERY} photos.`);
    await Promise.all(
      list.map(async (file) => {
        setUploading((n) => n + 1);
        onUploadingChange(1);
        try {
          const img = await uploadBlogImage(file, postId);
          update((b) => ({ ...b, images: [...b.images, img].slice(0, MAX_GALLERY) }));
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed.");
        } finally {
          setUploading((n) => n - 1);
          onUploadingChange(-1);
        }
      }),
    );
  }

  function moveImage(path: string, dir: -1 | 1) {
    update((b) => {
      const i = b.images.findIndex((img) => img.path === path);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= b.images.length) return b;
      const images = [...b.images];
      [images[i], images[j]] = [images[j], images[i]];
      return { ...b, images };
    });
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif"
        className="hidden"
        onChange={(e) => {
          void addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {block.images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {block.images.map((img, i) => (
            <div key={img.path} className="space-y-1.5">
              <div className="group relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted">
                <Image
                  src={blogImageUrl(img.path)}
                  alt={img.alt}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
                <div className="absolute inset-x-1 top-1 flex justify-between">
                  <div className="flex gap-1">
                    <ThumbButton title="Move left" disabled={i === 0} onClick={() => moveImage(img.path, -1)}>
                      <ChevronLeft className="h-3 w-3" />
                    </ThumbButton>
                    <ThumbButton
                      title="Move right"
                      disabled={i === block.images.length - 1}
                      onClick={() => moveImage(img.path, 1)}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </ThumbButton>
                  </div>
                  <ThumbButton
                    title="Remove photo"
                    onClick={() =>
                      update((b) => ({ ...b, images: b.images.filter((x) => x.path !== img.path) }))
                    }
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </ThumbButton>
                </div>
              </div>
              <Input
                value={img.alt}
                maxLength={300}
                aria-label={`Alt text for photo ${i + 1}`}
                onChange={(e) => {
                  const alt = e.target.value;
                  update((b) => ({
                    ...b,
                    images: b.images.map((x) => (x.path === img.path ? { ...x, alt } : x)),
                  }));
                }}
                placeholder="Alt text"
                className="h-7 text-xs md:text-xs"
              />
            </div>
          ))}
        </div>
      )}

      {room > 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void addFiles(e.dataTransfer.files);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-5 text-sm text-muted-foreground transition hover:border-[var(--brand)]/50 hover:bg-muted/40"
        >
          {uploading > 0 ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Uploading {uploading} photo
              {uploading === 1 ? "" : "s"}…
            </>
          ) : (
            <>
              <ImagePlus className="h-4 w-4" /> Add photos (select several at once, or drop them here)
            </>
          )}
        </button>
      )}
      {error && (
        <p className="flex items-start gap-1.5 text-xs text-destructive">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <FieldLabel>Caption (optional)</FieldLabel>
          <Input
            value={block.caption}
            maxLength={500}
            onChange={(e) => set({ caption: e.target.value })}
            placeholder="e.g. Before and after — basement renovation in Current River"
            className="mt-1"
          />
        </div>
        <Segmented
          label="Columns"
          value={block.columns}
          options={[
            { value: 2, label: "2 columns" },
            { value: 3, label: "3 columns" },
          ]}
          onChange={(columns) => set({ columns })}
        />
      </div>
    </div>
  );
}

function ThumbButton({
  title,
  onClick,
  disabled,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-6 w-6 items-center justify-center rounded bg-background/95 shadow hover:bg-background disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function ListFields({ block, update, autoFocus }: FieldProps<ListBlock>) {
  const set = patchWith(update);
  return (
    <div className="space-y-2">
      <Segmented
        label="List style"
        value={block.style}
        options={[
          { value: "bullet", label: "• Bulleted" },
          { value: "number", label: "1. Numbered" },
        ]}
        onChange={(style) => set({ style })}
      />
      <RichTextarea
        value={block.items.join("\n")}
        autoFocus={autoFocus}
        onChange={(text) => set({ items: text.split("\n") })}
        placeholder={"One item per line\nSecond item\nThird item"}
        minRows={3}
      />
    </div>
  );
}

export function QuoteFields({ block, update, autoFocus }: FieldProps<QuoteBlock>) {
  const set = patchWith(update);
  const citeId = useId();
  return (
    <div className="space-y-2">
      <Textarea
        value={block.text}
        autoFocus={autoFocus}
        maxLength={3000}
        onChange={(e) => set({ text: e.target.value })}
        placeholder="“They finished our driveway two days early and left the site spotless.”"
        className="text-[15px] italic md:text-[15px]"
      />
      <div>
        <FieldLabel htmlFor={citeId}>Who said it (optional)</FieldLabel>
        <Input
          id={citeId}
          value={block.cite}
          maxLength={200}
          onChange={(e) => set({ cite: e.target.value })}
          placeholder="e.g. Sarah M., Thunder Bay homeowner"
          className="mt-1"
        />
      </div>
    </div>
  );
}

export function CalloutFields({ block, update, autoFocus }: FieldProps<CalloutBlock>) {
  const set = patchWith(update);
  return (
    <div className="space-y-2">
      <Segmented
        label="Callout style"
        value={block.tone}
        options={[
          { value: "tip", label: "💡 Tip" },
          { value: "info", label: "ℹ️ Note" },
          { value: "warning", label: "⚠️ Warning" },
        ]}
        onChange={(tone) => set({ tone })}
      />
      <Input
        value={block.title}
        autoFocus={autoFocus}
        maxLength={200}
        onChange={(e) => set({ title: e.target.value })}
        placeholder="Title (optional), e.g. Pro tip"
        className="font-semibold"
      />
      <RichTextarea
        value={block.text}
        onChange={(text) => set({ text })}
        placeholder="The highlighted message"
        minRows={2}
      />
    </div>
  );
}

export function VideoFields({ block, update, autoFocus }: FieldProps<VideoBlock>) {
  const set = patchWith(update);
  const video = parseVideoUrl(block.url);
  return (
    <div className="space-y-2">
      <Input
        value={block.url}
        autoFocus={autoFocus}
        maxLength={500}
        onChange={(e) => set({ url: e.target.value })}
        placeholder="Paste a YouTube or Vimeo link, e.g. https://youtu.be/…"
      />
      {block.url.trim() &&
        (video ? (
          <p className="flex items-center gap-1.5 text-xs text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {video.provider === "youtube" ? "YouTube" : "Vimeo"} video found
          </p>
        ) : (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" />
            That doesn&apos;t look like a YouTube or Vimeo video link.
          </p>
        ))}
      {video && (
        <div className="aspect-video overflow-hidden rounded-lg border border-border bg-black">
          <iframe
            src={video.embedUrl}
            title="Video preview"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            className="h-full w-full"
          />
        </div>
      )}
      <Input
        value={block.caption}
        maxLength={500}
        onChange={(e) => set({ caption: e.target.value })}
        placeholder="Caption (optional)"
      />
    </div>
  );
}

export function CtaFields({ block, update, autoFocus }: FieldProps<CtaBlock>) {
  const set = patchWith(update);
  const hrefOk = safeHref(block.href) !== null;
  return (
    <div className="space-y-2">
      <Input
        value={block.title}
        autoFocus={autoFocus}
        maxLength={200}
        onChange={(e) => set({ title: e.target.value })}
        placeholder="Headline"
        className="font-semibold"
      />
      <Textarea
        value={block.body}
        maxLength={1000}
        onChange={(e) => set({ body: e.target.value })}
        placeholder="Supporting line (optional)"
        className="min-h-12"
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <FieldLabel>Button text</FieldLabel>
          <Input
            value={block.label}
            maxLength={60}
            onChange={(e) => set({ label: e.target.value })}
            placeholder="Get A Free Quote"
            className="mt-1"
          />
        </div>
        <div>
          <FieldLabel>Button link</FieldLabel>
          <Input
            value={block.href}
            maxLength={500}
            onChange={(e) => set({ href: e.target.value })}
            placeholder="/quote"
            aria-invalid={(!!block.href && !hrefOk) || undefined}
            className="mt-1"
          />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Use a page on this site like <code>/quote</code> or <code>/services/concrete-driveways</code>,
        a phone link like <code>tel:+18077097997</code>, or a full https:// address.
      </p>
    </div>
  );
}

export function DividerFields() {
  return (
    <div className="flex items-center gap-3 py-1 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      Section divider
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
