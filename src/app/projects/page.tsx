import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ProjectsGallery } from "@/components/sections/projects-gallery";
import { ImageWatermark } from "@/components/ui/image-watermark";
import { projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Projects",
  description:
    "A look at recent Dollar Contracting work across Thunder Bay — full house renovations, bathroom remodels, roofing, and exterior installs.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Recent Projects"
        body="A selection of work we've delivered across Thunder Bay and Northern Ontario — renovations, roofing, and exterior installs. Tap any photo to view the full gallery."
      />

      <section className="py-10">
        <div className="container-page">
          <nav aria-label="Project quick links" className="flex flex-wrap gap-2">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`#${p.slug}`}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground transition hover:border-[var(--brand)]/60 hover:text-[var(--brand)]"
              >
                {p.title}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page">
          <ProjectsGallery projects={projects} />
        </div>
      </section>

      <section className="bg-muted/50 py-14">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
              Project Index
            </span>
            <h2 className="heading-display mt-2 text-3xl sm:text-4xl">All Projects</h2>
            <p className="mt-3 text-muted-foreground">
              Browse the complete project list.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`#${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:border-[var(--brand)]/50 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <Image
                    src={p.images[0]}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                  <ImageWatermark />
                </div>
                <div className="p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
                    {p.category}
                  </p>
                  <h3 className="mt-1 font-semibold">{p.title}</h3>
                  {p.location && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.location}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Have a project in mind?"
        body="From a quick repair to a full renovation, we'd love to take a look. Get a free quote today."
        ctaLabel="Get A Quote"
        href="/quote"
      />
    </>
  );
}
