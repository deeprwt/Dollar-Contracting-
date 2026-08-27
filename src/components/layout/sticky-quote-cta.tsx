import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function StickyQuoteCTA() {
  return (
    <a
      href={siteConfig.phoneHref}
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[var(--brand)]/90 lg:bottom-8 lg:right-8"
    >
      <Phone className="h-4 w-4" />
      Call Now
    </a>
  );
}
