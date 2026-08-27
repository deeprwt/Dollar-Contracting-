import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactInfo } from "@/components/sections/contact-info";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail } from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Call, email, or send a message to Dollar Contracting in Thunder Bay, Ontario. Call 807-709-7997 — we reply within one business day.",
  path: "/contact",
});

const process = [
  { title: "Reach Out", body: "Call, email, or send the form." },
  { title: "Site Visit", body: "We come to you to scope the project." },
  { title: "Written Quote", body: "Detailed estimate with clear scope." },
  { title: "Build", body: "One crew, one timeline, one finish." },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title="Contact Dollar Contracting"
        body="Call us, email us, or send the form. We respond within one business day on most requests."
      />

      <section className="py-14">
        <div className="container-page grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm variant="contact" />
          </div>
          <div className="lg:col-span-2 space-y-5">
            <ContactInfo />
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">Prefer to talk?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Most homeowners get answers faster on the phone — especially on emergency repairs.
                </p>
                <div className="mt-4 flex flex-col gap-3 text-sm">
                  <a href="tel:+18077097997" className="inline-flex items-center gap-2 font-semibold text-[var(--brand)]">
                    <Phone className="h-4 w-4" /> 807-709-7997
                  </a>
                  <a href="mailto:Dollarcontractingltd@gmail.com" className="inline-flex items-center gap-2 text-foreground hover:text-[var(--brand)] break-all">
                    <Mail className="h-4 w-4" /> Dollarcontractingltd@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-14">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
              How It Works
            </span>
            <h2 className="heading-display mt-2 text-4xl sm:text-5xl">Our Simple Process</h2>
            <p className="mt-3 text-muted-foreground">
              From first call to final walk-through, here&apos;s what to expect.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <div key={p.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand)] text-lg font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
