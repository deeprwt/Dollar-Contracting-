import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Building2, Hammer, ShieldCheck, Award, Target } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { TeamSection } from "@/components/sections/team-section";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "Dollar Contracting is a Thunder Bay-based construction and renovation company with 10+ years building across Northern Ontario. Meet the team and learn how we run our projects.",
  path: "/about",
});

const stats = [
  { label: "Years building", value: "10+" },
  { label: "Projects completed", value: "500+" },
  { label: "Repeat clients", value: "80%" },
];

const values = [
  {
    icon: Target,
    title: "Client-first",
    body: "Clear scope, clear price, clear timeline. No surprises after the deposit.",
  },
  {
    icon: ShieldCheck,
    title: "Built to last",
    body: "Materials and methods chosen for Northern Ontario weather — not the spec sheet.",
  },
  {
    icon: Award,
    title: "Craftsmanship",
    body: "Tradespeople who care about the work showing through every finished detail.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Dollar Contracting"
        title="Building better futures, one project at a time"
        body="A Thunder Bay-based contracting team handling concrete, masonry, carpentry, and full residential and commercial renovations across Northern Ontario."
      />

      <section className="py-14">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="heading-display text-2xl sm:text-3xl">Our story</h2>
            <p className="mt-4 text-muted-foreground">
              Dollar Contracting was started by tradespeople who got tired of
              watching jobs get bounced between sub-contractors with nobody owning
              the outcome. We do the opposite: one crew, one project manager, one
              phone number — from the first site visit to the final walk-through.
            </p>
            <p className="mt-4 text-muted-foreground">
              We work on everything from foundation pours and chimney repairs to
              full kitchen renovations and second-storey additions. Most of our
              jobs come from word-of-mouth in Thunder Bay, which is exactly how
              we want it.
            </p>

            <Separator className="my-10" />

            <h2 id="why" className="heading-display text-2xl sm:text-3xl">Why homeowners pick us</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {values.map(({ icon: Icon, title, body }) => (
                <Card key={title}>
                  <CardContent className="p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator className="my-10" />

            <h2 id="systems" className="heading-display text-3xl sm:text-4xl lg:text-5xl">How we run a project</h2>
            <ol className="mt-4 space-y-3">
              {[
                "On-site walkthrough and scope conversation.",
                "Written estimate with clear inclusions and exclusions.",
                "Signed agreement, schedule, and payment plan.",
                "Build with daily clean-up and weekly progress updates.",
                "Final walkthrough and punch list.",
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>

            <h2 id="careers" className="heading-display mt-10 text-3xl sm:text-4xl lg:text-5xl">Careers</h2>
            <p className="mt-4 text-muted-foreground">
              We hire tradespeople who care about doing good work and treating
              homeowners well. Send your resume to{" "}
              <a href="mailto:Dollarcontractingltd@gmail.com" className="text-[var(--brand)] hover:underline">
                Dollarcontractingltd@gmail.com
              </a>
              .
            </p>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-[var(--brand)]">
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    By the numbers
                  </span>
                </div>
                <div className="mt-4 space-y-4">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-3xl font-black text-foreground">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-[var(--brand)]">
                  <Hammer className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    What we work on
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>Single-family residential</li>
                  <li>Commercial and light commercial</li>
                  <li>Restoration and repair</li>
                  <li>Additions and conversions</li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <TeamSection />

      <CtaBanner
        title="Got a project in mind?"
        body="A 15-minute call is the fastest way to know whether we're the right fit. No pressure either way."
        ctaLabel="Get In Touch"
      />
    </>
  );
}
