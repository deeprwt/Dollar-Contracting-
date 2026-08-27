import Link from "next/link";
import { HardHat, Hammer, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    icon: HardHat,
    title: "Concrete & Foundations",
    body: "Pours, footings, slabs, and structural repairs finished to a flat, durable surface.",
    href: "/services/concrete-work",
  },
  {
    icon: Hammer,
    title: "Renovations & Additions",
    body: "Kitchens, bathrooms, basements, and home additions — design through finish, one crew.",
    href: "/services/interior-renovation",
  },
  {
    icon: Wrench,
    title: "Trades & Restoration",
    body: "HVAC, electrical, plumbing, masonry, carpentry, and post-damage restoration.",
    href: "/services",
  },
];

export function WhatWeDo() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="heading-display text-3xl sm:text-4xl">What We Build</h2>
          <p className="mt-3 text-muted-foreground">
            We protect the structural and renovation systems that make your home work.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map(({ icon: Icon, title, body, href }) => (
            <Link key={title} href={href}>
              <Card className="h-full rounded-xl border-border bg-card transition hover:border-[var(--brand)]/40 hover:shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-5 w-5 text-[var(--brand)]" />
                    <h3 className="text-lg font-bold tracking-tight">{title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{body}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
