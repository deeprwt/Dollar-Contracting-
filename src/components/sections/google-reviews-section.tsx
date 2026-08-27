import Link from "next/link";
import { Star, ArrowUpRight, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { GoogleReviewsEmbed } from "@/components/sections/google-reviews-embed";

type Props = {
  showHeader?: boolean;
  className?: string;
};

// Renders the live Google reviews widget when configured, otherwise a
// graceful fallback CTA that links straight to the Google Business Profile.
export function GoogleReviewsSection({ showHeader = true, className = "" }: Props) {
  const widgetId = process.env.NEXT_PUBLIC_TRUSTINDEX_WIDGET_ID;

  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="container-page">
        {showHeader && (
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
              <Sparkles className="h-3 w-3" />
              Live From Google
            </span>
            <h2 className="heading-display mt-3 text-3xl sm:text-4xl">
              Reviews From Our Customers
            </h2>
            <p className="mt-3 text-muted-foreground">
              Verified Google reviews
            </p>
          </div>
        )}

        <div className="mx-auto mt-10 max-w-5xl">
          {widgetId ? (
            <GoogleReviewsEmbed widgetId={widgetId} />
          ) : (
            <ReviewsFallback />
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={siteConfig.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--brand)]/90 hover:shadow-lg"
          >
            <Star className="h-4 w-4" fill="currentColor" strokeWidth={1.5} />
            Leave us a Google review
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href={siteConfig.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            View all reviews on Google
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReviewsFallback() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
        <Star className="h-5 w-5" fill="currentColor" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 font-semibold">Google reviews widget not configured yet</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Set <code className="rounded bg-muted px-1.5 py-0.5">NEXT_PUBLIC_TRUSTINDEX_WIDGET_ID</code>
        {" "}in your environment to display live Google reviews here. See{" "}
        <code className="rounded bg-muted px-1.5 py-0.5">GOOGLE_REVIEWS_SETUP.md</code> for steps.
      </p>
      <div className="mt-5">
        <Link
          href="https://maps.app.goo.gl/7DE4kZ3pMbREc7h1A"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline"
        >
          Read our reviews on Google in the meantime
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
