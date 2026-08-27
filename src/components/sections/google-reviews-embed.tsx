"use client";

import { useEffect, useRef, useState } from "react";

// Mounts the Trustindex loader script *inside* a container so the widget
// renders in place. Trustindex auto-syncs the latest Google reviews on a
// daily schedule once the widget is configured in their dashboard.
//
// The free tier ships with a small "Trustindex" badge — no way to remove it
// without upgrading, but the reviews themselves are unlimited and update
// without code changes.
export function GoogleReviewsEmbed({ widgetId }: { widgetId: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !widgetId) return;
    const container = containerRef.current;

    const script = document.createElement("script");
    script.src = `https://cdn.trustindex.io/loader.js?${widgetId}`;
    script.defer = true;
    script.async = true;
    script.onerror = () => setHasError(true);

    container.appendChild(script);

    return () => {
      script.remove();
      // Clean up any nodes Trustindex injected so re-mounts don't duplicate.
      container.querySelectorAll('[id^="ti-widget"], .ti-widget, .ti-rev-content').forEach(
        (el) => el.remove(),
      );
    };
  }, [widgetId]);

  if (hasError) {
    return (
      <p className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Couldn&apos;t load Google reviews right now. Try refreshing the page.
      </p>
    );
  }

  return <div ref={containerRef} className="trustindex-widget" />;
}
