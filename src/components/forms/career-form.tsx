"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Upload, FileText, X, AlertTriangle } from "lucide-react";

const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
// Vercel serverless functions reject request bodies over 4.5 MB. We compress
// photos down to a safe budget below that, leaving headroom for multipart
// overhead, the resume, and the other form fields.
const SAFE_PAYLOAD_BYTES = 4 * 1024 * 1024;
const SEND_COUNTDOWN_SECONDS = 5;
const RESUME_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Re-encode a JPEG byte stream at lower quality via canvas. Used both for
// standalone photos and for JPEG image streams found inside PDFs.
async function recompressJpegBytes(bytes: Uint8Array, quality: number): Promise<Uint8Array | null> {
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob = new Blob([buf], { type: "image/jpeg" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement | null>((resolve) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => resolve(null);
      el.src = url;
    });
    if (!img) return null;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    const out = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!out) return null;
    return new Uint8Array(await out.arrayBuffer());
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Compress a PDF by re-encoding its embedded JPEG (DCTDecode) image streams
// at lower quality. Text and vector content are untouched, so the resume stays
// searchable. Has no effect on text-only PDFs or PDFs that embed images via
// other filters (FlateDecode/JBIG2/etc.).
async function compressPdf(file: File, targetBytes: number): Promise<File> {
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  if (!isPdf || file.size <= targetBytes) return file;
  try {
    const { PDFDocument, PDFRawStream, PDFName } = await import("pdf-lib");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const qualities = [0.55, 0.4, 0.28];
    let best: Uint8Array | null = null;
    for (const quality of qualities) {
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const ctx = doc.context;
      let touched = 0;
      for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
        if (!(obj instanceof PDFRawStream)) continue;
        const subtype = obj.dict.get(PDFName.of("Subtype"));
        if (!subtype || subtype.toString() !== "/Image") continue;
        const filter = obj.dict.get(PDFName.of("Filter"));
        if (!filter || filter.toString() !== "/DCTDecode") continue;
        const recompressed = await recompressJpegBytes(obj.contents, quality);
        if (!recompressed || recompressed.length >= obj.contents.length) continue;
        obj.dict.set(PDFName.of("Length"), ctx.obj(recompressed.length));
        ctx.assign(ref, PDFRawStream.of(obj.dict, recompressed));
        touched++;
      }
      if (touched === 0) break;
      const saved = await doc.save();
      if (saved.length <= targetBytes) {
        return new File([saved as BlobPart], file.name, {
          type: "application/pdf",
          lastModified: file.lastModified,
        });
      }
      if (!best || saved.length < best.length) best = saved;
    }
    if (best && best.length < bytes.length) {
      return new File([best as BlobPart], file.name, {
        type: "application/pdf",
        lastModified: file.lastModified,
      });
    }
    return file;
  } catch (err) {
    console.error("PDF compression failed:", err);
    return file;
  }
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

type Props = {
  jobId?: string;
  jobTitle?: string;
  positionDefault?: string;
};

export function CareerForm({ jobId, jobTitle, positionDefault }: Props = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<HTMLInputElement>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [phase, setPhase] = useState<"resume" | "photos" | null>(null);
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
    return (resume?.size ?? 0) + photos.reduce((n, f) => n + f.size, 0);
  }

  function onResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && !RESUME_TYPES.includes(f.type) && !/\.(pdf|doc|docx)$/i.test(f.name)) {
      setError("Resume must be a PDF or Word document.");
      e.target.value = "";
      return;
    }
    setError(null);
    setResume(f);
  }

  function onPhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const bad = files.find((f) => !IMAGE_TYPES.includes(f.type) && !f.type.startsWith("image/"));
    if (bad) {
      setError(`"${bad.name}" is not a supported image.`);
      e.target.value = "";
      return;
    }
    setError(null);
    setPhotos(files);
  }

  function removePhoto(idx: number) {
    setPhotos((arr) => arr.filter((_, i) => i !== idx));
  }

  function clearResume() {
    setResume(null);
    if (resumeRef.current) resumeRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (totalSize() > MAX_TOTAL_BYTES) {
      const msg = `Attachments exceed ${formatBytes(MAX_TOTAL_BYTES)}. Please reduce file sizes.`;
      setError(msg);
      toast.error(msg);
      return;
    }

    setSendElapsedMs(0);
    setSubmitting(true);
    const form = e.currentTarget;
    try {
      let resumeToSend = resume!;
      let photosToSend = photos;
      if (totalSize() > SAFE_PAYLOAD_BYTES) {
        // Step 1: try to shrink the resume PDF if it's contributing meaningfully.
        // Reserve roughly half the budget for the resume; the rest is for photos.
        const resumeBudget = photos.length > 0
          ? Math.floor(SAFE_PAYLOAD_BYTES / 2)
          : SAFE_PAYLOAD_BYTES;
        if (resumeToSend.size > resumeBudget) {
          setOptimizing(true);
          setPhase("resume");
          await new Promise((r) => requestAnimationFrame(() => r(null)));
          resumeToSend = await compressPdf(resumeToSend, resumeBudget);
        }

        // Step 2: compress photos to fit the remaining budget.
        if (photos.length > 0) {
          setOptimizing(true);
          setPhase("photos");
          setProgress({ done: 0, total: photos.length });
          const photoBudget = Math.max(64 * 1024, SAFE_PAYLOAD_BYTES - resumeToSend.size);
          const perImageTarget = Math.floor(photoBudget / photos.length);
          const compressed: File[] = [];
          for (let i = 0; i < photos.length; i++) {
            // Yield to the paint frame so the progress UI updates between images.
            await new Promise((r) => requestAnimationFrame(() => r(null)));
            compressed.push(await compressImage(photos[i], perImageTarget));
            setProgress({ done: i + 1, total: photos.length });
          }
          photosToSend = compressed;
        }

        setPhase(null);
        setOptimizing(false);

        const finalSize = resumeToSend.size + photosToSend.reduce((n, f) => n + f.size, 0);
        if (finalSize > SAFE_PAYLOAD_BYTES) {
          const msg = `Attachments still too large after optimizing (${formatBytes(finalSize)}). Please reduce file sizes (${resumeToSend.name} is ${formatBytes(resumeToSend.size)}).`;
          setError(msg);
          toast.error(msg);
          setSubmitting(false);
          return;
        }
      }

      const fd = new FormData(form);
      fd.delete("resume");
      fd.delete("photos");
      fd.append("resume", resumeToSend, resumeToSend.name);
      photosToSend.forEach((p) => fd.append("photos", p, p.name));

      const res = await fetch("/api/career", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      toast.success("Application received — we'll review and reach out if there's a fit.");
      form.reset();
      setResume(null);
      setPhotos([]);
      if (resumeRef.current) resumeRef.current.value = "";
      if (photosRef.current) photosRef.current.value = "";
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
      setOptimizing(false);
      setPhase(null);
      setProgress({ done: 0, total: 0 });
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold">
          {jobTitle ? `Apply for ${jobTitle}` : "Apply Now"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {jobTitle
            ? "Tell us about yourself and attach your resume."
            : "Tell us about yourself and attach your resume. Photos of past work are welcome."}
        </p>

        <form ref={formRef} className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          {jobId && <input type="hidden" name="jobId" value={jobId} />}
          {jobTitle && <input type="hidden" name="jobTitleSnapshot" value={jobTitle} />}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" required placeholder="John Doe" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" name="email" type="email" required placeholder="john@example.com" className="mt-1.5" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="(807) 555-0123" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" placeholder="Thunder Bay" className="mt-1.5" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="position">Position Applying For *</Label>
              <Input
                id="position"
                name="position"
                required
                defaultValue={positionDefault ?? ""}
                readOnly={!!positionDefault}
                placeholder="Carpenter, Labourer, Project Manager…"
                className={`mt-1.5 ${positionDefault ? "bg-muted/50" : ""}`}
              />
            </div>
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input id="experience" name="experience" placeholder="e.g. 5 years" className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Cover Note</Label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              placeholder="A quick intro — what you do, the type of work you're looking for, when you can start."
              className="mt-1.5"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="resume">Resume (PDF or Word) *</Label>
              <div className="mt-1.5">
                <label
                  htmlFor="resume"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 px-3 py-4 text-sm text-muted-foreground transition hover:border-[var(--brand)]/60 hover:bg-muted/60"
                >
                  <Upload className="h-4 w-4" />
                  {resume ? "Choose a different file" : "Click to upload resume"}
                </label>
                <input
                  ref={resumeRef}
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  required
                  onChange={onResumeChange}
                  className="sr-only"
                />
                {resume && (
                  <div className="mt-2 flex items-center justify-between rounded-md border bg-background px-2.5 py-1.5 text-xs">
                    <span className="flex items-center gap-2 truncate">
                      <FileText className="h-3.5 w-3.5 text-[var(--brand)]" />
                      <span className="truncate font-medium">{resume.name}</span>
                      <span className="text-muted-foreground">({formatBytes(resume.size)})</span>
                    </span>
                    <button
                      type="button"
                      onClick={clearResume}
                      className="ml-2 inline-flex items-center text-muted-foreground hover:text-destructive"
                      aria-label="Remove resume"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="photos">Work Samples (images, optional)</Label>
              <div className="mt-1.5">
                <label
                  htmlFor="photos"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 px-3 py-4 text-sm text-muted-foreground transition hover:border-[var(--brand)]/60 hover:bg-muted/60"
                >
                  <Upload className="h-4 w-4" />
                  {photos.length ? "Add more images" : "Click to upload images"}
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
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Max {formatBytes(MAX_TOTAL_BYTES)} total across all attachments. PDF, DOC, DOCX, JPG, PNG, WEBP, HEIC accepted.
          </p>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {(optimizing || (submitting && (photos.length > 0 || !!resume))) && (
            <div className="rounded-md border bg-muted/40 px-3 py-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {phase === "resume"
                    ? "Compressing resume…"
                    : phase === "photos"
                      ? `Compressing image ${progress.done + (progress.done < progress.total ? 1 : 0)} of ${progress.total}…`
                      : "Sending your application…"}
                </span>
                {phase === "photos" && progress.total > 0 && (
                  <span className="text-muted-foreground">
                    {Math.round((progress.done / progress.total) * 100)}%
                  </span>
                )}
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full bg-[var(--brand)] transition-all duration-200 ${
                    phase === "resume" ? "animate-pulse" : ""
                  }`}
                  style={{
                    width:
                      phase === "resume"
                        ? "50%"
                        : phase === "photos"
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
            {phase === "resume"
              ? "Compressing resume…"
              : phase === "photos"
                ? `Compressing… (${progress.done}/${progress.total})`
                : submitting
                  ? "Sending…"
                  : "Submit Application"}
          </Button>

          <p className="text-[11px] text-muted-foreground">
            By submitting, you agree to be contacted about your application. We don&apos;t share your information.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
