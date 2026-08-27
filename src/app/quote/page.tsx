import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactInfo } from "@/components/sections/contact-info";
import { LocationMap } from "@/components/sections/location-map";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Get a Free Quote",
  description:
    "Request a free, no-obligation quote from Dollar Contracting. Site visits in Thunder Bay are usually scheduled within the week.",
  path: "/quote",
});

const includes = [
  "Detailed line-item scope",
  "Materials list and brand options",
  "Timeline with milestones",
  "Payment schedule",
];

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Free Estimate"
        title="Get Your Free Quote"
        body="Send the form below or call us directly. We'll get back within one business day to book a site visit or talk through scope."
      />

      <section className="py-14">
        <div className="container-page grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm variant="quote" />
          </div>
          <div className="lg:col-span-2 space-y-5">
            <ContactInfo />
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">What&apos;s in your written quote</h3>
                <ul className="mt-4 space-y-2">
                  {includes.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <LocationMap />
    </>
  );
}
