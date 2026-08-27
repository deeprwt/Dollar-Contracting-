import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Phone, ArrowRight, ShieldCheck, Hammer, Clock, Award } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getService, services } from "@/lib/services";
import { siteConfig } from "@/lib/site-config";
import { ImageWatermark } from "@/components/ui/image-watermark";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { serviceLd, breadcrumbLd, faqPageLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({
    // Prefer the hand-tuned, keyword-targeted title; fall back to a sensible
    // "{service} in Thunder Bay" pattern for services without one.
    ...(s.seoTitle
      ? { absoluteTitle: `${s.seoTitle} | ${siteConfig.name}` }
      : { title: `${s.shortTitle} in Thunder Bay` }),
    description: s.metaDescription ?? s.description,
    keywords: s.keywords,
    path: `/services/${s.slug}`,
  });
}

const trustItems = [
  { icon: ShieldCheck, title: "Licensed & insured", body: "Full liability, WSIB, and provincial certifications." },
  { icon: Hammer, title: "In-house crews", body: "Our trades, not subbed out. Same standards every job." },
  { icon: Clock, title: "On-time delivery", body: "Schedules written into the contract, milestones tracked weekly." },
];

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return notFound();

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 4);

  const breadcrumbs = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.shortTitle, path: `/services/${service.slug}` },
  ]);

  const hasFaqs = Boolean(service.faqs && service.faqs.length > 0);
  const jsonLd = [
    serviceLd(service),
    breadcrumbs,
    ...(hasFaqs ? [faqPageLd(service.faqs!)] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow={service.shortTitle}
        title={service.title}
        body={service.tagline}
      />

      <section className="py-14">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted shadow-sm">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
                priority
              />
              <ImageWatermark size="lg" />
            </div>

            <div className="prose-spacing mt-10 space-y-5 text-base text-foreground/85">
              {service.longDescription.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {service.features.length > 0 && (
              <div className="mt-12">
                <h2 className="heading-display text-2xl sm:text-3xl">What&apos;s included</h2>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.materials && service.materials.length > 0 && (
              <div className="mt-12 rounded-2xl bg-muted/50 p-6 sm:p-8">
                <h2 className="heading-display text-2xl sm:text-3xl">Materials &amp; methods</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  The specific products and techniques we use on a {service.shortTitle.toLowerCase()} job.
                </p>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {service.materials.map((m) => (
                    <li key={m} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.gallery.length > 0 && (
              <div className="mt-12">
                <h2 className="heading-display text-2xl sm:text-3xl">On the job</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.gallery.map((src, i) => (
                    <div
                      key={src}
                      className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted"
                    >
                      <Image
                        src={src}
                        alt={`${service.title} — work photo ${i + 1}`}
                        fill
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="object-cover"
                      />
                      <ImageWatermark size="md" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12">
              <h2 className="heading-display text-2xl sm:text-3xl">How the job runs</h2>
              <ol className="mt-5 space-y-3">
                {service.scope.map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-sm text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold">Get a quote</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Free estimate on {service.shortTitle.toLowerCase()} projects in Thunder Bay and surrounding areas.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <Button asChild className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white">
                    <Link href="/quote">
                      Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={siteConfig.phoneHref}>
                      <Phone className="mr-2 h-4 w-4" /> {siteConfig.phone}
                    </a>
                  </Button>
                </div>
                <div className="mt-6 text-xs text-muted-foreground">
                  Open Mon–Sat 8am to 9pm. Closed Sundays.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold">Service area</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thunder Bay, Greenstone, Marathon, and surrounding Northern Ontario communities.
                </p>
                <Link
                  href="/locations"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand)] hover:opacity-80"
                >
                  See all locations <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <section className="bg-muted/40 py-14">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="heading-display text-3xl sm:text-4xl">
              Why pick Dollar Contracting for {service.shortTitle.toLowerCase()}
            </h2>
            <p className="mt-3 text-muted-foreground">
              Clear scope, real crews, and accountability you can hold us to.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="rounded-xl">
                <CardContent className="p-5">
                  <Icon className="h-5 w-5 text-[var(--brand)]" />
                  <h3 className="mt-3 text-base font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {hasFaqs && (
        <section className="bg-muted/40 py-14">
          <div className="container-page mx-auto max-w-3xl">
            <h2 className="heading-display text-3xl sm:text-4xl">
              {service.shortTitle} in Thunder Bay — FAQs
            </h2>
            <p className="mt-3 text-muted-foreground">
              Common questions about {service.shortTitle.toLowerCase()} projects in
              Thunder Bay and across Northern Ontario.
            </p>
            <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
              {service.faqs!.map((faq) => (
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

      <section className="py-14">
        <div className="container-page">
          <h2 className="heading-display text-2xl sm:text-3xl">Related services</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/services/${r.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-[var(--brand)]/50 hover:shadow-sm"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                  <ImageWatermark />
                </div>
                <div className="flex-1 p-4">
                  <p className="text-sm font-bold group-hover:text-[var(--brand)]">
                    {r.shortTitle}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {r.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
