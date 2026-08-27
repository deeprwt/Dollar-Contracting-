import Link from "next/link";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

type Props = {
  eyebrow?: string;
  title: string;
  body?: string;
  showBack?: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  body,
  showBack = true,
  showPhone = true,
  showEmail = false,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-[var(--ink)] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 60% at 80% 0%, oklch(0.55 0.22 27 / 0.4) 0%, transparent 55%), radial-gradient(50% 50% at 15% 100%, oklch(0.35 0.15 27 / 0.4) 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="container-page relative py-10 sm:py-16">
        {showBack && (
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-md bg-white/95 px-3 py-1.5 text-sm font-medium text-slate-900 shadow hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        )}
        <div className="mx-auto mt-6 max-w-3xl text-center">
          {eyebrow && (
            <span className="inline-block rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              {eyebrow}
            </span>
          )}
          <h1 className="heading-display mt-4 text-balance text-3xl sm:text-5xl text-white">
            {title}
          </h1>
          {body && (
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
              {body}
            </p>
          )}
          {(showPhone || showEmail) && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {showPhone && (
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex items-center gap-2 text-lg font-bold text-[var(--brand)] hover:opacity-90"
                >
                  <Phone className="h-5 w-5" />
                  {siteConfig.phone}
                </a>
              )}
              {showEmail && (
                <a
                  href={siteConfig.emailHref}
                  className="inline-flex items-center gap-2 text-lg font-bold text-[var(--brand)] hover:opacity-90 break-all"
                >
                  <Mail className="h-5 w-5" />
                  {siteConfig.email}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
