import type { Metadata } from "next";
import Link from "next/link";
import {
  HardHat,
  Hammer,
  Shield,
  TrendingUp,
  Users,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  MapPin,
  Briefcase,
} from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { CareerForm } from "@/components/forms/career-form";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";
import { getPublishedJobs, jobTypeLabel } from "@/lib/jobs";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description:
    "Join the Dollar Contracting team in Thunder Bay. We're hiring carpenters, labourers, project leads, and trades. Apply with your resume online.",
  path: "/career",
});

const perks = [
  {
    icon: Hammer,
    title: "Real Craft Work",
    body: "Concrete, framing, finish carpentry, full renovations — not just one trade in a silo.",
  },
  {
    icon: Shield,
    title: "Safety First",
    body: "Full PPE, regular toolbox talks, and WSIB-covered crews. We don't cut corners on safety.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Skills",
    body: "Learn from senior tradespeople. We promote from within and back apprenticeships.",
  },
  {
    icon: Users,
    title: "Crew Culture",
    body: "Small, tight crews who actually like working together. Respect on every site.",
  },
  {
    icon: Clock,
    title: "Steady Hours",
    body: "Year-round work across Thunder Bay and Northern Ontario. We keep the schedule full.",
  },
  {
    icon: HardHat,
    title: "Quality Tools",
    body: "The right gear for the job. You bring your hands; we bring the equipment.",
  },
];

export default async function CareerPage() {
  const jobs = await getPublishedJobs();

  return (
    <>
      <PageHero
        eyebrow="We're Hiring"
        title="Build Your Career With Us"
        body="Join a Thunder Bay crew that values quality, safety, and craft. Open roles across carpentry, concrete, and project management — apply below with your resume."
        showPhone={false}
        showEmail
      />

      <section id="open-roles" className="py-14">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
              Open Roles
            </span>
            <h2 className="heading-display mt-2 text-3xl sm:text-4xl">
              Positions we&apos;re actively hiring
            </h2>
            <p className="mt-3 text-muted-foreground">
              See a role that fits? Click it for full details and apply. Don&apos;t see
              your trade? Send us a general application below — we keep good resumes on
              file.
            </p>
          </div>

          {jobs.length === 0 ? (
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 font-semibold">No open postings right now</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We hire year-round. Send us a general application below and we&apos;ll
                reach out when something opens up that fits your skills.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/career/${job.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-border bg-background p-5 shadow-sm transition hover:border-[var(--brand)]/40 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-[var(--brand)]/10 px-2.5 py-0.5 font-semibold text-[var(--brand)]">
                      {jobTypeLabel(job.job_type)}
                    </span>
                    {job.pay_range && (
                      <span className="text-muted-foreground">{job.pay_range}</span>
                    )}
                  </div>
                  <h3 className="mt-3 font-bold leading-tight group-hover:text-[var(--brand)]">
                    {job.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {job.summary}
                  </p>
                  <div className="mt-4 flex flex-1 items-end justify-between text-xs">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[var(--brand)]">
                      View & apply
                      <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-14">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
              Why Dollar Contracting
            </span>
            <h2 className="heading-display mt-2 text-3xl sm:text-4xl">
              Good work, fair pay, a crew that has your back
            </h2>
            <p className="mt-4 text-muted-foreground">
              We&apos;re a Thunder Bay-based contracting team building everything from
              foundations to full home renovations across Northern Ontario. If you take
              pride in your trade and want steady, varied work — we want to meet you.
            </p>
            <p className="mt-3 text-muted-foreground">
              Apprentices, journeypersons, and seasoned trades all welcome. Bring your
              skills; we&apos;ll bring the projects.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--brand)] px-4 py-2 font-semibold text-white hover:bg-[var(--brand)]/90"
              >
                <Phone className="h-4 w-4" /> {siteConfig.phone}
              </a>
              <a
                href={siteConfig.emailHref}
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 font-semibold hover:bg-muted"
              >
                <Mail className="h-4 w-4" /> Email Us
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {perks.map((p) => (
              <Card key={p.title} className="h-full">
                <CardContent className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="bg-muted/50 py-14">
        <div className="container-page grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <CareerForm />
          </div>
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">What we look for</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• Reliability — show up, on time, every day.</li>
                  <li>• Pride in your work and respect for the customer&apos;s home.</li>
                  <li>• Valid driver&apos;s licence and own transport (most roles).</li>
                  <li>• Willingness to learn from senior trades.</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">How hiring works</h3>
                <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <span className="font-semibold text-foreground">1. Apply</span> — send us your resume and any work samples.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">2. Quick chat</span> — we&apos;ll call to talk about the role.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">3. Site visit</span> — meet the crew, see how we work.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">4. Offer</span> — written offer, clear pay and schedule.
                  </li>
                </ol>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">Prefer to talk?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Call us directly — we answer most hiring questions on the phone.
                </p>
                <div className="mt-4 flex flex-col gap-3 text-sm">
                  <a
                    href={siteConfig.phoneHref}
                    className="inline-flex items-center gap-2 font-semibold text-[var(--brand)]"
                  >
                    <Phone className="h-4 w-4" /> {siteConfig.phone}
                  </a>
                  <a
                    href={siteConfig.emailHref}
                    className="inline-flex items-center gap-2 text-foreground hover:text-[var(--brand)] break-all"
                  >
                    <Mail className="h-4 w-4" /> {siteConfig.email}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to join the crew?"
        body="Submit your application above, or call us directly to talk about open roles."
        ctaLabel="Call Us"
        href={siteConfig.phoneHref}
      />
    </>
  );
}
