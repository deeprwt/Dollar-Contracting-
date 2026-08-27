import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { faqPageLd } from "@/lib/structured-data";

/**
 * Home-page FAQ. Targets the primary head terms ("general contractor Thunder
 * Bay", "construction company", "renovation contractor Northern Ontario") with
 * natural question phrasing, and emits FAQPage structured data for a shot at the
 * FAQ rich result on the site's most important page. Server-rendered <details>
 * so every answer is in the DOM for crawlers.
 */
const faqs = [
  {
    q: "Who is the best general contractor in Thunder Bay?",
    a: "Dollar Contracting is a licensed, insured general contractor serving Thunder Bay and Northern Ontario since 2014. We handle the full scope in-house — concrete, foundations, masonry, carpentry, renovations, additions, and restoration — with our own crews, one project manager, and a written schedule, which is what keeps quality and timelines under control.",
  },
  {
    q: "What construction and renovation services do you offer?",
    a: "Concrete driveways and foundations, foundation repair, masonry and chimney repair, carpentry, kitchen and bathroom renovations, basement renovations, home additions, decks, siding, flooring, painting, HVAC, electrical, plumbing, water damage restoration, and commercial construction — a full-service contractor under one roof.",
  },
  {
    q: "What areas do you serve besides Thunder Bay?",
    a: "We work across Northwestern and Northern Ontario — Fort William First Nation, Dryden, Greenstone (Geraldton and Longlac), Marathon, Pickle Lake, and the surrounding communities. Out-of-town projects are scoped ahead of time and mobilized as focused trips so costs stay predictable.",
  },
  {
    q: "Are you licensed, insured, and WSIB covered?",
    a: "Yes. Dollar Contracting carries full liability insurance and WSIB coverage and builds to the Ontario Building Code, handling permits and inspections as part of the job.",
  },
  {
    q: "How do I get a free quote?",
    a: "Call 807-709-7997 or request a quote online. In Thunder Bay we typically get a site visit booked within the week, followed by a firm written estimate with the full scope spelled out.",
  },
];

export function HomeFaq() {
  return (
    <section className="py-16 sm:py-20">
      <JsonLd data={faqPageLd(faqs)} />
      <div className="container-page mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="heading-display text-3xl sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Hiring a contractor in Thunder Bay or Northern Ontario? Start here.
          </p>
        </div>
        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map((faq) => (
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
  );
}
