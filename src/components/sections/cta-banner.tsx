import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  body?: string;
  href?: string;
  ctaLabel?: string;
};

export function CtaBanner({
  title = "Ready to Start Your Project?",
  body = "Book a free, no-obligation consultation with Dollar Contracting. Bring us your blueprints, sketches, or just an idea — we'll help you scope it.",
  href = "/quote",
  ctaLabel = "Get A Quote",
}: Props) {
  return (
    <section className="relative overflow-hidden bg-[var(--brand)] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 49%, white 49%, white 51%, transparent 51%)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="container-page relative py-14 text-center sm:py-20">
        <h2 className="heading-display text-balance text-3xl sm:text-4xl lg:text-5xl text-white">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-white/90">{body}</p>
        <Button
          asChild
          variant="secondary"
          className="mt-6 bg-white text-[var(--brand)] hover:bg-white/95 font-semibold"
        >
          <Link href={href}>
            {ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
