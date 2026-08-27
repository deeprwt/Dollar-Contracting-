import { siteConfig } from "@/lib/site-config";

const addressQuery = encodeURIComponent(
  `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.region}, ${siteConfig.address.country}`,
);
const embedSrc = `https://www.google.com/maps?q=${addressQuery}&output=embed`;

export function LocationMap() {
  return (
    <section className="border-t border-border bg-muted/30 py-10 sm:py-12">
      <div className="container-page">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
          <iframe
            title={`Map showing ${siteConfig.name} location`}
            src={embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[500px] w-full border-0 sm:h-[600px] lg:h-[700px]"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
