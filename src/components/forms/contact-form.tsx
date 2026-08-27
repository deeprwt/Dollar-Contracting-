"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Upload,
  FileText,
  X,
  AlertTriangle,
} from "lucide-react";

type Props = {
  variant?: "contact" | "quote";
};

const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
// Vercel serverless functions reject request bodies over 4.5 MB. We compress
// down to a safe budget below that, leaving headroom for multipart overhead
// and the other form fields.
const SAFE_PAYLOAD_BYTES = 4 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const SEND_COUNTDOWN_SECONDS = 5;

function SendingRing({ elapsedMs }: { elapsedMs: number }) {
  const budgetMs = SEND_COUNTDOWN_SECONDS * 1000;
  const progress = Math.min(1, elapsedMs / budgetMs);
  const secondsLeft = Math.max(0, Math.ceil((budgetMs - elapsedMs) / 1000));
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  return (
    <span className="relative mr-2 inline-flex h-5 w-5 items-center justify-center">
      <svg viewBox="0 0 20 20" className="h-5 w-5 -rotate-90">
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2"
        />
        <circle
          cx="10"
          cy="10"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={(1 - progress) * circumference}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-100 ease-linear"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold leading-none tabular-nums">
        {secondsLeft}
      </span>
    </span>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function compressImage(file: File, targetBytes: number): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement | null>((resolve) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => resolve(null);
      el.src = url;
    });
    if (!img) return file;

    let width = img.naturalWidth;
    let height = img.naturalHeight;
    let quality = 0.82;
    let out: Blob | null = null;

    for (let attempt = 0; attempt < 7; attempt++) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width));
      canvas.height = Math.max(1, Math.round(height));
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
      if (!blob) return file;
      out = blob;
      if (blob.size <= targetBytes) break;

      if (quality > 0.5) quality -= 0.12;
      else {
        width *= 0.8;
        height *= 0.8;
      }
    }

    if (!out || out.size >= file.size) return file;
    const newName = file.name.replace(/\.(png|webp|heic|heif|jpeg|jpg)$/i, "") + ".jpg";
    return new File([out], newName, { type: "image/jpeg", lastModified: file.lastModified });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function ContactForm({ variant = "contact" }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const photosRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [sendElapsedMs, setSendElapsedMs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submitting || optimizing) return;
    const start = performance.now();
    const id = window.setInterval(() => {
      setSendElapsedMs(performance.now() - start);
    }, 100);
    return () => window.clearInterval(id);
  }, [submitting, optimizing]);

  function totalSize() {
    return photos.reduce((n, f) => n + f.size, 0);
  }

  function onPhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files ?? []);
    const bad = incoming.find(
      (f) => !IMAGE_TYPES.includes(f.type) && !f.type.startsWith("image/"),
    );
    if (bad) {
      setError(`"${bad.name}" is not a supported image.`);
      e.target.value = "";
      return;
    }
    const merged = [...photos, ...incoming];
    const total = merged.reduce((n, f) => n + f.size, 0);
    if (total > MAX_TOTAL_BYTES) {
      setError(`Attachments exceed ${formatBytes(MAX_TOTAL_BYTES)}. Please reduce file sizes.`);
      e.target.value = "";
      return;
    }
    setError(null);
    setPhotos(merged);
    e.target.value = "";
  }

  function removePhoto(idx: number) {
    setPhotos((arr) => arr.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (totalSize() > MAX_TOTAL_BYTES) {
      const msg = `Attachments exceed ${formatBytes(MAX_TOTAL_BYTES)}.`;
      setError(msg);
      toast.error(msg);
      return;
    }

    setSendElapsedMs(0);
    setSubmitting(true);
    const form = e.currentTarget;
    try {
      let toSend = photos;
      if (totalSize() > SAFE_PAYLOAD_BYTES && photos.length > 0) {
        setOptimizing(true);
        setProgress({ done: 0, total: photos.length });
        const perImageTarget = Math.floor(SAFE_PAYLOAD_BYTES / photos.length);
        const compressed: File[] = [];
        for (let i = 0; i < photos.length; i++) {
          // Yield to the paint frame so the progress UI updates between images.
          await new Promise((r) => requestAnimationFrame(() => r(null)));
          compressed.push(await compressImage(photos[i], perImageTarget));
          setProgress({ done: i + 1, total: photos.length });
        }
        toSend = compressed;
        const after = toSend.reduce((n, f) => n + f.size, 0);
        setOptimizing(false);
        if (after > SAFE_PAYLOAD_BYTES) {
          const msg = `Photos still too large after optimizing (${formatBytes(after)}). Please remove some.`;
          setError(msg);
          toast.error(msg);
          setSubmitting(false);
          return;
        }
      }

      const fd = new FormData(form);
      fd.delete("photos");
      fd.append("variant", variant);
      toSend.forEach((p) => fd.append("photos", p, p.name));

      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      toast.success(
        variant === "quote"
          ? "Quote request sent — we'll be in touch within one business day."
          : "Message sent — we'll be in touch within one business day.",
      );
      form.reset();
      setPhotos([]);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
      setOptimizing(false);
      setProgress({ done: 0, total: 0 });
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold">
          {variant === "quote" ? "Tell us about your project" : "Send Us a Message"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {variant === "quote"
            ? "The more detail, the more accurate our estimate."
            : "Fill out the form and we'll get back to you shortly."}
        </p>
        <form ref={formRef} className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" required placeholder="John Doe" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                className="mt-1.5"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="(807) 555-0123"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" placeholder="Thunder Bay" className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Project Address</Label>
            <Input id="address" name="address" placeholder="123 Main Street" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              name="subject"
              required
              placeholder={variant === "quote" ? "Kitchen renovation quote" : "How can we help?"}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={5}
              placeholder={
                variant === "quote"
                  ? "Tell us about the project — what, where, when, and any sketches or photos."
                  : "Tell us what you're looking for…"
              }
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="photos">
              {variant === "quote" ? "Site Photos (optional)" : "Photos (optional)"}
            </Label>
            <div className="mt-1.5">
              <label
                htmlFor="photos"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 px-3 py-4 text-sm text-muted-foreground transition hover:border-[var(--brand)]/60 hover:bg-muted/60"
              >
                <Upload className="h-4 w-4" />
                {photos.length ? "Add more photos" : "Click to upload photos"}
              </label>
              <input
                ref={photosRef}
                id="photos"
                name="photos"
                type="file"
                accept="image/*"
                multiple
                onChange={onPhotosChange}
                className="sr-only"
              />
              {photos.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {photos.map((p, i) => (
                    <li
                      key={`${p.name}-${i}`}
                      className="flex items-center justify-between rounded-md border bg-background px-2.5 py-1.5 text-xs"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <FileText className="h-3.5 w-3.5 text-[var(--brand)]" />
                        <span className="truncate font-medium">{p.name}</span>
                        <span className="text-muted-foreground">({formatBytes(p.size)})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="ml-2 inline-flex items-center text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${p.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                JPG, PNG, WEBP, or HEIC. Max {formatBytes(MAX_TOTAL_BYTES)} total
                {photos.length > 0 && ` · using ${formatBytes(totalSize())}`}.
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {(optimizing || (submitting && photos.length > 0)) && (
            <div className="rounded-md border bg-muted/40 px-3 py-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {optimizing
                    ? `Compressing photo ${progress.done + (progress.done < progress.total ? 1 : 0)} of ${progress.total}…`
                    : "Sending your request…"}
                </span>
                {optimizing && progress.total > 0 && (
                  <span className="text-muted-foreground">
                    {Math.round((progress.done / progress.total) * 100)}%
                  </span>
                )}
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-[var(--brand)] transition-all duration-200"
                  style={{
                    width: optimizing
                      ? `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%`
                      : "100%",
                  }}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white"
          >
            {submitting && !optimizing ? (
              <SendingRing elapsedMs={sendElapsedMs} />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {optimizing
              ? `Compressing… (${progress.done}/${progress.total})`
              : submitting
                ? "Sending…"
                : variant === "quote"
                  ? "Send Quote Request"
                  : "Send Message"}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            By submitting, you agree to be contacted about your project. We don&apos;t share your info.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
