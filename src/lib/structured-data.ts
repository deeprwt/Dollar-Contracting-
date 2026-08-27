import { siteConfig } from "./site-config";
import { services } from "./services";
import type { Service, Faq } from "./services";
import type { Location } from "./locations";
import type { Job } from "./supabase/types";
import { testimonials } from "./testimonials";

/** Stable @id for the business node so other nodes can reference it. */
const BUSINESS_ID = `${siteConfig.url}/#business`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

const sameAs = Object.values(siteConfig.social).filter(
  (url) => url && url !== "#",
);

/**
 * AggregateRating built from the testimonials shown on the site. Google requires
 * that rating markup reflects reviews genuinely displayed to users — ours are on
 * /testimonials and the home page — so this stays truthful and in sync.
 */
function aggregateRating() {
  const ratings = testimonials.map((t) => t.rating).filter((r) => r > 0);
  if (ratings.length === 0) return undefined;
  const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  return {
    "@type": "AggregateRating",
    ratingValue: avg.toFixed(1),
    reviewCount: ratings.length,
    bestRating: 5,
    worstRating: 1,
  };
}

/** Individual Review nodes from real, displayed testimonials. */
function reviewNodes() {
  return testimonials.slice(0, 6).map((t) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: t.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: { "@type": "Person", name: t.name },
    reviewBody: t.quote,
    ...(t.project ? { name: t.project } : {}),
  }));
}

/** The full service list as an OfferCatalog — tells Google every service we offer. */
function serviceOfferCatalog() {
  return {
    "@type": "OfferCatalog",
    name: "Construction & Renovation Services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.shortTitle,
        url: `${siteConfig.url}/services/${s.slug}`,
      },
    })),
  };
}

/**
 * Primary LocalBusiness node (GeneralContractor). Acts as both the Organization
 * and the local map entity Google reads for "near me" / "in Thunder Bay" queries.
 */
export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": BUSINESS_ID,
    name: siteConfig.name,
    // Legal/registered name as it appears on the Google Business Profile, plus
    // the common short form. Matching these helps Google merge the website with
    // the existing map/GBP entity (which is what surfaces the favicon and the
    // knowledge panel for brand searches like "dollar contracting ltd").
    legalName: "Dollar Contracting Ltd.",
    alternateName: ["Dollar Contracting Ltd.", "Dollar Contracting Ltd"],
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phoneE164,
    email: siteConfig.email,
    image: `${siteConfig.url}/og.png`,
    logo: `${siteConfig.url}/logo.png`,
    priceRange: siteConfig.priceRange,
    foundingDate: siteConfig.foundingYear,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.regionCode,
      addressCountry: siteConfig.address.countryCode,
      ...(siteConfig.address.postal
        ? { postalCode: siteConfig.address.postal }
        : {}),
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    hasMap: siteConfig.googleMapsUrl,
    areaServed: siteConfig.serviceArea.map((name) => ({
      "@type": "Place",
      name,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:00",
        closes: "21:00",
      },
    ],
    // Topics/services the business is an authority on — reinforces relevance for
    // service-intent queries beyond the free-text description.
    knowsAbout: [
      "General contracting",
      "Home renovations",
      "Concrete driveways and foundations",
      "Foundation repair",
      "Masonry and chimney repair",
      "Kitchen and bathroom renovation",
      "Basement renovation",
      "Home additions",
      "Deck building",
      "Siding installation",
      "Flooring installation",
      "Painting",
      "Water damage restoration",
      "Commercial construction",
    ],
    hasOfferCatalog: serviceOfferCatalog(),
    ...(aggregateRating() ? { aggregateRating: aggregateRating() } : {}),
    review: reviewNodes(),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/**
 * FAQPage node. Emit alongside a visible FAQ list — the Q&A here must match the
 * Q&A rendered on the page or Google treats it as a violation.
 */
export function faqPageLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** WebSite node — links the domain to the brand. */
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: { "@id": BUSINESS_ID },
  };
}

/** Service node for a single service page, provided by the business. */
export function serviceLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    serviceType: service.shortTitle,
    url: `${siteConfig.url}/services/${service.slug}`,
    image: `${siteConfig.url}${service.image}`,
    provider: { "@id": BUSINESS_ID },
    areaServed: siteConfig.serviceArea.map((name) => ({
      "@type": "Place",
      name,
    })),
  };
}

/** Location page node — the business serving a specific community. */
export function locationLd(location: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${siteConfig.url}/locations/${location.slug}/#business`,
    name: `${siteConfig.name} — ${location.city}`,
    description: location.intro,
    url: `${siteConfig.url}/locations/${location.slug}`,
    telephone: siteConfig.phoneE164,
    image: `${siteConfig.url}/og.png`,
    parentOrganization: { "@id": BUSINESS_ID },
    areaServed: {
      "@type": "City",
      name: location.city,
      containedInPlace: { "@type": "AdministrativeArea", name: location.region },
    },
  };
}

const EMPLOYMENT_TYPE: Record<Job["job_type"], string> = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACTOR",
  apprenticeship: "INTERN",
};

/** JobPosting node — eligible for the Google Jobs experience. */
export function jobPostingLd(job: Job) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || job.summary,
    datePosted: job.created_at,
    ...(job.closes_at ? { validThrough: job.closes_at } : {}),
    employmentType: EMPLOYMENT_TYPE[job.job_type],
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: siteConfig.url,
      logo: `${siteConfig.url}/logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || siteConfig.address.city,
        addressRegion: siteConfig.address.regionCode,
        addressCountry: siteConfig.address.countryCode,
      },
    },
  };
}

/** BreadcrumbList for inner pages. Pass [{ name, path }] from home onward. */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}
