import Link from "next/link";
import { Phone, ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { locations } from "@/lib/locations";

const badges = [
  { label: "Licensed & Insured" },
  { label: "10+ Years Experience" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--ink)] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(60% 60% at 80% 0%, oklch(0.55 0.22 27 / 0.45) 0%, transparent 55%), radial-gradient(50% 50% at 15% 90%, oklch(0.35 0.15 27 / 0.45) 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="container-page relative pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="wordmark mx-auto text-[clamp(2.5rem,7.5vw,5.5rem)] text-white">
            <span className="block whitespace-nowrap">DOLLAR</span>
            <span className="block whitespace-nowrap text-[var(--brand)]">
              CONTRACTING LTD.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-white/90 sm:text-lg">
            is a trusted Northern Ontario construction company specializing in renovations, new homes, and multi-home developments with quality craftsmanship and reliable service.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/65 sm:text-base">
            Serving Thunder Bay, Greenstone, Dryden, Pickle Lake, Fort William First Nation and Marathon with concrete,
            masonry, carpentry, restoration, and full residential &amp;
            commercial renovations.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white text-slate-900 hover:bg-white/95 hover:text-slate-900"
            >
              <a href={siteConfig.phoneHref}>
                <Phone className="mr-2 h-4 w-4" /> Call Now
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white"
            >
              <Link href="/quote">
                Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {badges.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--brand)]" />
                {b.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-4xl rounded-2xl bg-white/95 p-4 text-slate-900 shadow-2xl ring-1 ring-black/5 backdrop-blur sm:p-6">
          <p className="text-center text-sm font-semibold">Choose your location</p>
          <p className="text-center text-xs text-slate-500">Services vary by city.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((l) => (
              <Link
                key={l.slug}
                href={`/locations/${l.slug}`}
                className="group flex items-start gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-[var(--brand)] hover:bg-[var(--brand)]/5 hover:shadow-sm"
              >
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--brand)] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold group-hover:text-[var(--brand)]">{l.city}</p>
                  <p className="truncate text-xs text-slate-500">View services in {l.city}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
