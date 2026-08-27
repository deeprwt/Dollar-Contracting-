import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  CircleDollarSign,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CareerForm } from "@/components/forms/career-form";
import { Card, CardContent } from "@/components/ui/card";
import { getPublishedJobBySlug, jobTypeLabel } from "@/lib/jobs";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { jobPostingLd, breadcrumbLd } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

function lines(input: string | null | undefined): string[] {
  if (!input) return [];
  return input
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) return { title: "Job not found" };
  return pageMetadata({
    title: `${job.title} — Careers`,
    description: job.summary,
    path: `/career/${job.slug}`,
  });
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) notFound();

  const responsibilities = lines(job.responsibilities);
  const requirements = lines(job.requirements);
  const perks = lines(job.perks);

  const breadcrumbs = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Careers", path: "/career" },
    { name: job.title, path: `/career/${job.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[jobPostingLd(job), breadcrumbs]} />
      <PageHero
        eyebrow={jobTypeLabel(job.job_type)}
        title={job.title}
        body={job.summary}
      />

      <section className="border-b border-border bg-muted/30 py-6">
        <div className="container-page flex flex-wrap items-center gap-4 text-sm">
          <Link
            href="/career"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 font-medium hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            All open roles
          </Link>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Briefcase className="h-4 w-4" /> {jobTypeLabel(job.job_type)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {job.location}
          </span>
          {job.pay_range && (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <CircleDollarSign className="h-4 w-4" /> {job.pay_range}
            </span>
          )}
          {job.closes_at && (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              Apply by {new Date(job.closes_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container-page grid gap-10 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-3">
            <div>
              <h2 className="heading-display text-2xl sm:text-3xl">About the role</h2>
              <div className="prose prose-sm mt-4 max-w-none whitespace-pre-wrap text-foreground/90">
                {job.description}
              </div>
            </div>

            {responsibilities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">What you&apos;ll do</h3>
                <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                  {responsibilities.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {requirements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">What we&apos;re looking for</h3>
                <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                  {requirements.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {perks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">What you get</h3>
                <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                  {perks.map((p, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold">Apply for this role</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Send your resume and a quick intro — we&apos;ll be in touch within a few days.
                  </p>
                </CardContent>
              </Card>
              <div className="mt-4">
                <CareerForm
                  jobId={job.id}
                  jobTitle={job.title}
                  positionDefault={job.title}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
