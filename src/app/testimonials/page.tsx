import type { Metadata } from "next";
import Link from "next/link";
import { Star, MapPin, Briefcase, Quote } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { TestimonialsSlider } from "@/components/sections/testimonials-slider";
import { GoogleReviewsSection } from "@/components/sections/google-reviews-section";
import { testimonials } from "@/lib/testimonials";
import { locations } from "@/lib/locations";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Client Testimonials",
  description:
    "Real reviews from homeowners and businesses across Thunder Bay, Fort William First Nation, Greenstone, Marathon, Dryden, and Pickle Lake.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  const total = testimonials.length;
  const average = (
    testimonials.reduce((s, t) => s + t.rating, 0) / total
  ).toFixed(1);
  const uniqueLocations = new Set(testimonials.map((t) => t.locationSlug ?? t.location));
  const uniqueProjects = new Set(testimonials.map((t) => t.project));

  return (
    <>
      <PageHero
        eyebrow="What Clients Say"
        title="Real Reviews From Real Builds"
        body="Homeowners, business owners, and property managers across Northern Ontario sharing what it's like to work with Dollar Contracting."
      />

      <section className="border-b border-border bg-muted/40 py-8">
        <div className="container-page grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background p-5 text-center shadow-sm">
            <div className="flex items-center justify-center gap-1 text-[var(--brand)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5" fill="currentColor" strokeWidth={1.5} />
              ))}
            </div>
            <p className="heading-display mt-2 text-3xl">{average}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Average rating · {total} reviews
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-5 text-center shadow-sm">
            <div className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="heading-display mt-2 text-3xl">{uniqueLocations.size}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Communities served
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-5 text-center shadow-sm">
            <div className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
              <Briefcase className="h-5 w-5" />
            </div>
            <p className="heading-display mt-2 text-3xl">{uniqueProjects.size}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Different project types
            </p>
          </div>
        </div>
      </section>

      <GoogleReviewsSection />

      <section className="border-y border-border bg-muted/30 py-10">
        <div className="container-page text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--brand)]">
            From Our Project Files
          </span>
          <h2 className="heading-display mt-2 text-2xl sm:text-3xl">
            More stories from past builds
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Detailed write-ups from homeowners and businesses we&apos;ve worked with.
          </p>
        </div>
      </section>

      <TestimonialsSlider showHeader={false} showCta={false} background="plain" />

      <section className="bg-muted/40 py-14">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--brand)]">
              By Location
            </span>
            <h2 className="heading-display mt-2 text-3xl sm:text-4xl">Reviews From Across Northern Ontario</h2>
            <p className="mt-3 text-muted-foreground">
              Clients in every service area, sharing what we built and how it went.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => {
              const count = testimonials.filter((t) => t.locationSlug === loc.slug).length;
              return (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="group rounded-xl border border-border bg-background p-5 shadow-sm transition hover:border-[var(--brand)]/40 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
                        {loc.region}
                      </p>
                      <h3 className="mt-1 font-bold">{loc.city}</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--brand)]">
                      <Quote className="h-3 w-3" />
                      {count} {count === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{loc.blurb}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Have a story to share?"
        body="If we built it, we'd love to hear how it's holding up. Send us a note and we'll add it to the wall."
        ctaLabel="Send Us A Review"
        href="/contact"
      />
    </>
  );
}
