import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { locations } from "@/lib/locations";

export function LocationPicker() {
  return (
    <section className="bg-muted/50 py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="heading-display text-3xl sm:text-4xl">
            Choose Your Location
          </h2>
          <p className="mt-3 text-muted-foreground">
            Services and timelines vary by city. Pick yours to see what we offer.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {locations.map((l) => (
            <Link
              key={l.slug}
              href={`/locations/${l.slug}`}
              className="group flex items-center justify-between rounded-lg border border-[var(--brand)]/25 bg-[var(--brand)]/10 px-5 py-4 text-foreground shadow-sm transition hover:border-[var(--brand)] hover:bg-[var(--brand)] hover:text-white hover:shadow-md"
            >
              <span className="flex items-center gap-2 font-semibold">
                <MapPin className="h-4 w-4 text-[var(--brand)] transition group-hover:text-white" />
                {l.city}
              </span>
              <ArrowRight className="h-4 w-4 text-[var(--brand)] transition group-hover:translate-x-0.5 group-hover:text-white" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
