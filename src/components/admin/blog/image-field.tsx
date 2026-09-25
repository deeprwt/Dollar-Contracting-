"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { blogImageUrl } from "@/lib/blog/images";
import type { BlogImage } from "@/lib/blog/blocks";
import { uploadBlogImage } from "./upload-image";

type ImageUpdate = (update: (prev: BlogImage | null) => BlogImage | null) => void;

type Props = {
  postId: string;
  image: BlogImage | null;
  /** Functional so an upload finishing late never clobbers newer edits. */
  setImage: ImageUpdate;
  onUploadingChange: (delta: 1 | -1) => void;
  emptyLabel?: string;
  sizes?: string;
};

export function ImageField({
  postId,
  image,
  setImage,
  onUploadingChange,
  emptyLabel = "Upload an image",
  sizes = "(min-width: 1024px) 700px, 100vw",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const altId = useId();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    onUploadingChange(1);
    try {
      const uploaded = await uploadBlogImage(file, postId);
      // Keep alt text the editor already typed when replacing an image.
      setImage((prev) => ({ ...uploaded, alt: prev?.alt ?? "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      onUploadingChange(-1);
    }
  }

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif"
      className="hidden"
      onChange={(e) => {
        void upload(e.target.files?.[0]);
        e.target.value = "";
      }}
    />
  );

  if (!image) {
    return (
      <div>
        {fileInput}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void upload(e.dataTransfer.files?.[0]);
          }}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-sm transition disabled:opacity-60 ${
            dragOver
              ? "border-[var(--brand)] bg-[var(--brand)]/5 text-[var(--brand)]"
              : "border-border text-muted-foreground hover:border-[var(--brand)]/50 hover:bg-muted/40"
          }`}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <ImagePlus className="h-6 w-6" />
          )}
          <span className="font-medium">{uploading ? "Uploading…" : emptyLabel}</span>
          {!uploading && (
            <span className="text-xs">Click or drop a file · JPG, PNG, WebP, GIF</span>
          )}
        </button>
        {error && <UploadError message={error} />}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {fileInput}
      <div className="group relative overflow-hidden rounded-lg border border-border bg-muted/40">
        <Image
          src={blogImageUrl(image.path)}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          className="h-auto max-h-80 w-full object-contain"
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--brand)]" />
          </div>
        )}
        <div className="absolute right-2 top-2 flex gap-1.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-7 items-center gap-1 rounded-md bg-background/95 px-2 text-xs font-medium shadow hover:bg-background"
          >
            <RefreshCw className="h-3 w-3" /> Replace
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => setImage(() => null)}
            className="inline-flex h-7 items-center gap-1 rounded-md bg-background/95 px-2 text-xs font-medium text-destructive shadow hover:bg-background"
          >
            <Trash2 className="h-3 w-3" /> Remove
          </button>
        </div>
      </div>
      <div>
        <label htmlFor={altId} className="text-xs font-medium text-muted-foreground">
          Alt text <span className="font-normal">— describe the photo for Google and screen readers</span>
        </label>
        <Input
          id={altId}
          value={image.alt}
          maxLength={300}
          onChange={(e) => {
            const alt = e.target.value;
            setImage((prev) => (prev ? { ...prev, alt } : prev));
          }}
          placeholder="e.g. New stamped concrete driveway in Thunder Bay"
          aria-invalid={!image.alt.trim() || undefined}
          className="mt-1"
        />
      </div>
      {error && <UploadError message={error} />}
    </div>
  );
}

function UploadError({ message }: { message: string }) {
  return (
    <p className="mt-2 flex items-start gap-1.5 text-xs text-destructive">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}
