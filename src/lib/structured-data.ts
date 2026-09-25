import { siteConfig } from "./site-config";
import { services } from "./services";
import type { Service, Faq } from "./services";
import type { Location } from "./locations";
import type { BlogPost, Job } from "./supabase/types";
import { blogImageUrl } from "./blog/images";

/** Stable @id for the business node so other nodes can reference it. */
const BUSINESS_ID = `${siteConfig.url}/#business`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

const sameAs = Object.values(siteConfig.social).filter(
  (url) => url && url !== "#",
);

// NOTE: no `aggregateRating` / `review` on the business node below.
// Google does not use self-serving reviews — ratings a business publishes about
// itself on its own site — for LocalBusiness review snippets, so the markup
// earned no stars while still being the kind of thing that draws a structured
// data manual action. Star ratings for this business come from its Google
// Business Profile instead. Reviews still render for humans on /testimonials.

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

/**
 * WebSite node — links the domain to the brand.
 *
 * This is the highest-priority source Google uses for the site name shown above
 * the URL in search results. It falls back to printing the bare domain when the
 * signals disagree, so `name` here, `og:site_name` and `application-name` must
 * all carry the same string, and the short form goes in `alternateName` rather
 * than contradicting `name` somewhere else.
 */
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.siteName,
    alternateName: siteConfig.name,
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

const BLOG_ID = `${siteConfig.url}/blog#blog`;

/** Blog node for the /blog index — the container each BlogPosting is part of. */
export function blogLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": BLOG_ID,
    name: `${siteConfig.name} Blog`,
    url: `${siteConfig.url}/blog`,
    inLanguage: "en-CA",
    publisher: { "@id": BUSINESS_ID },
  };
}

/** BlogPosting node for a single post — eligible for article rich results. */
export function blogPostingLd(post: BlogPost) {
  const url = `${siteConfig.url}/blog/${post.slug}`;
  // Posts credited to the company point at the business node; anyone else is a Person.
  const author =
    post.author_name === siteConfig.name
      ? { "@type": "Organization", "@id": BUSINESS_ID, name: siteConfig.name, url: siteConfig.url }
      : { "@type": "Person", name: post.author_name };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title.slice(0, 110),
    description: post.seo_description || post.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: [
      post.cover_image_path ? blogImageUrl(post.cover_image_path) : `${siteConfig.url}/og.png`,
    ],
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    dateModified: post.updated_at,
    author,
    publisher: { "@id": BUSINESS_ID },
    isPartOf: { "@id": BLOG_ID },
    inLanguage: "en-CA",
    ...(post.category ? { articleSection: post.category } : {}),
    ...(post.tags.length ? { keywords: post.tags.map((t) => t.replace(/-/g, " ")).join(", ") } : {}),
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
