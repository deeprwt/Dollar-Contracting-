import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/hero";
import { WhatWeDo } from "@/components/sections/what-we-do";
import { ServicesSlider } from "@/components/sections/services-slider";
import { LocationPicker } from "@/components/sections/location-picker";
import { WhyUs } from "@/components/sections/why-us";
import { TestimonialsSlider } from "@/components/sections/testimonials-slider";
import { HomeFaq } from "@/components/sections/home-faq";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = pageMetadata({
  absoluteTitle:
    "Dollar Contracting | Construction & Renovation in Thunder Bay, ON",
  description:
    "Dollar Contracting is Thunder Bay's trusted construction and renovation company — concrete, masonry, carpentry, kitchens, bathrooms, additions and full interior & exterior renovations across Northern Ontario. Licensed, insured, in-house crews. Call 807-709-7997 for a free quote.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <ServicesSlider />
      <LocationPicker />
      <WhyUs />
      <TestimonialsSlider />
      <HomeFaq />
      <CtaBanner />
    </>
  );
}
