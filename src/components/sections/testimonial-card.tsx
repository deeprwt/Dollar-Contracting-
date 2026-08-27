import Link from "next/link";
import { Quote, Star, MapPin } from "lucide-react";
import type { Testimonial } from "@/lib/testimonials";

const AVATAR_PALETTE: { from: string; to: string }[] = [
  { from: "#f43f5e", to: "#dc2626" },
  { from: "#f59e0b", to: "#ea580c" },
  { from: "#10b981", to: "#0d9488" },
  { from: "#0ea5e9", to: "#4f46e5" },
  { from: "#8b5cf6", to: "#9333ea" },
  { from: "#ec4899", to: "#c026d3" },
  { from: "#475569", to: "#1e293b" },
  { from: "#06b6d4", to: "#2563eb" },
];

function avatarGradient(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

export function TestimonialAvatar({
  name,
  initials,
  size = "md",
}: {
  name: string;
  initials: string;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "h-14 w-14 text-base" : "h-11 w-11 text-sm";
  const g = avatarGradient(name);
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full font-bold leading-none text-white shadow-md ring-2 ring-white ${dim}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
    >
      <span aria-hidden>{initials}</span>
    </div>
  );
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-black/[0.02] transition hover:border-[var(--brand)]/40 hover:shadow-lg sm:p-7">
      <div className="absolute right-5 top-5 text-[var(--brand)]/10">
        <Quote className="h-12 w-12" strokeWidth={1.5} />
      </div>

      <div className="flex items-center gap-1 text-[var(--brand)]">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4" fill="currentColor" strokeWidth={1.5} />
        ))}
      </div>

      <p className="relative mt-4 text-[15px] leading-relaxed text-foreground/90">
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="mt-6 flex items-center gap-3 border-t border-border/70 pt-4">
        <TestimonialAvatar name={t.name} initials={t.initials} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">{t.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {t.role} · {t.date}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px]">
        {t.locationSlug ? (
          <Link
            href={`/locations/${t.locationSlug}`}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--brand)]/10 px-2.5 py-1 font-semibold text-[var(--brand)] hover:bg-[var(--brand)]/15"
          >
            <MapPin className="h-3 w-3" />
            {t.location}
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {t.location}
          </span>
        )}
        {t.projectHref ? (
          <Link
            href={t.projectHref}
            className="inline-flex items-center rounded-full bg-foreground/5 px-2.5 py-1 font-semibold text-foreground/80 hover:bg-foreground/10"
          >
            {t.project}
          </Link>
        ) : (
          <span className="text-muted-foreground">{t.project}</span>
        )}
      </div>
    </article>
  );
}
