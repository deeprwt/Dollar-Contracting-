import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const reasons = [
  {
    title: "Experienced Crews",
    body: "Skilled tradespeople with years on Northern Ontario job sites — not subbed out, not rotating.",
  },
  {
    title: "Documented Process",
    body: "Scope, schedule, and price set in writing before a single tool comes off the truck.",
  },
  {
    title: "Local Accountability",
    body: "Headquartered in Thunder Bay. Same phone number, same crew, after the job is done.",
  },
];

export function WhyUs() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="heading-display text-3xl sm:text-4xl">
            Why Homeowners Pick Us
          </h2>
          <p className="mt-3 text-muted-foreground">
            Clear scope, real crews, and the same standards on every project.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reasons.map((r) => (
            <Card key={r.title} className="rounded-xl border-border bg-card transition hover:border-[var(--brand)]/40 hover:shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-[var(--brand)]" />
                  <h3 className="text-lg font-bold tracking-tight">{r.title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{r.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
