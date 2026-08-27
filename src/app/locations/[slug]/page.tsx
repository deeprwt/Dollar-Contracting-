import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Card, CardContent } from "@/components/ui/card";
import { locations, getLocation } from "@/lib/locations";
import { getService } from "@/lib/services";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { locationLd, breadcrumbLd, faqPageLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const l = getLocation(slug);
  if (!l) return {};
  return pageMetadata({
    ...(l.seoTitle
      ? { absoluteTitle: `${l.seoTitle} | ${siteConfig.name}` }
      : { title: `Construction & Renovation in ${l.city}` }),
    description: l.metaDescription ?? l.intro,
    keywords: l.keywords,
    path: `/locations/${l.slug}`,
  });
}

export default async function LocationDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return notFound();

  const popular = loc.popularServices
    .map((s) => getService(s))
    .filter((s): s is NonNullable<ReturnType<typeof getService>> => Boolean(s));

  const breadcrumbs = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Service Areas", path: "/locations" },
    { name: loc.city, path: `/locations/${loc.slug}` },
  ]);

  const hasFaqs = Boolean(loc.faqs && loc.faqs.length > 0);
  const jsonLd = [
    locationLd(loc),
    breadcrumbs,
    ...(hasFaqs ? [faqPageLd(loc.faqs!)] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow={loc.region}
        title={loc.city}
        body={loc.intro}
      />

      <section className="py-14">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {loc.body && loc.body.length > 0 && (
              <div className="prose-spacing mb-12 space-y-5 text-base text-foreground/85">
                {loc.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}

            <h2 className="heading-display text-2xl sm:text-3xl">
              What to expect in {loc.city}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {loc.highlights.map((h) => (
                <Card key={h.title}>
                  <CardContent className="p-5">
                    <CheckCircle2 className="h-5 w-5 text-[var(--brand)]" />
                    <h3 className="mt-3 text-sm font-semibold">{h.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {h.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="heading-display mt-12 text-3xl sm:text-4xl lg:text-5xl">
              Popular services in {loc.city}
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {popular.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition hover:border-[var(--brand)]/50"
                >
                  <span className="text-sm font-semibold">{s.shortTitle}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:text-[var(--brand)]" />
                </Link>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-[var(--brand)]">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {loc.city} HQ
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold">Visit or call</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Reach our Thunder Bay office to start your {loc.city} project.
                </p>
                <Link
                  href="/quote"
                  className="mt-4 inline-flex items-center gap-1 rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand)]/90"
                >
                  Request a Quote <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      {hasFaqs && (
        <section className="bg-muted/40 py-14">
          <div className="container-page mx-auto max-w-3xl">
            <h2 className="heading-display text-3xl sm:text-4xl">
              {loc.city} contractor FAQs
            </h2>
            <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
              {loc.faqs!.map((faq) => (
                <details key={faq.q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--brand)] transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
