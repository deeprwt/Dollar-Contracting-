import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Card, CardContent } from "@/components/ui/card";
import { locations } from "@/lib/locations";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Service Areas",
  description:
    "Dollar Contracting serves Thunder Bay, Fort William First Nation, Greenstone, Marathon, Dryden, Pickle Lake, and the surrounding Northern Ontario communities.",
  path: "/locations",
});

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Where We Work"
        title="Serving Thunder Bay & Northern Ontario"
        body="Pick your city to see how we mobilize, what we typically build there, and what to expect from a Dollar Contracting site visit."
      />

      <section className="py-14">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {locations.map((l) => (
            <Card key={l.slug} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-[var(--brand)]">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {l.region}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold">{l.city}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{l.blurb}</p>
                <Link
                  href={`/locations/${l.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand)] hover:opacity-80"
                >
                  View {l.city} services <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Outside these areas?"
        body="We sometimes travel for larger scoped projects in Northern Ontario. Send us the details and we'll let you know if we can help."
        ctaLabel="Ask Us"
      />
    </>
  );
}
