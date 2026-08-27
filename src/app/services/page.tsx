import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = pageMetadata({
  title: "Construction & Renovation Services",
  description:
    "Concrete, masonry, carpentry, renovations, restoration, HVAC, electrical, plumbing and more — full-service contracting in Thunder Bay and across Northern Ontario.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Full-Service Contracting"
        body="From the foundation up to the final coat of paint, one crew handles the whole job. Pick a service to see scope, process, and what's included."
      />
      <ServicesGrid />
      <CtaBanner
        title="Not sure which service you need?"
        body="Tell us what's broken, what you want to build, or what you're dreaming about. We'll figure out the scope together."
        ctaLabel="Talk to Us"
      />
    </>
  );
}
