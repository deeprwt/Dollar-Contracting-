export type Location = {
  slug: string;
  city: string;
  region: string;
  blurb: string;
  intro: string;
  popularServices: string[];
  highlights: { title: string; body: string }[];
  /** Exact <title>. Falls back to "Construction & Renovation in {city}". */
  seoTitle?: string;
  /** Meta description (~150–160 chars). Falls back to `intro`. */
  metaDescription?: string;
  /** Page-specific keyword phrases for this location. */
  keywords?: readonly string[];
  /** Unique long-form body paragraphs — real content Google can rank. */
  body?: string[];
  /** Location-specific Q&A — visible FAQ + FAQPage JSON-LD. */
  faqs?: { q: string; a: string }[];
};

export const locations: Location[] = [
  {
    slug: "thunder-bay",
    city: "Thunder Bay",
    region: "Ontario",
    blurb: "Our home base. Full crew, full service.",
    intro:
      "Headquartered at 48 Carl Ave, we serve homeowners and businesses across Thunder Bay from foundations to finished kitchens. Most jobs are within a 30-minute drive of our shop.",
    popularServices: ["concrete-work", "kitchen-renovation", "bathroom-renovation", "additions", "interior-renovation"],
    highlights: [
      {
        title: "Local crews",
        body: "Crews based in Thunder Bay — no out-of-town subs running your project.",
      },
      {
        title: "Cold-climate built",
        body: "Every assembly is detailed for Northern Ontario weather: insulation, vapour control, snow loads.",
      },
      {
        title: "Same-week consults",
        body: "Quote requests in Thunder Bay typically get a site visit within the week.",
      },
    ],
    seoTitle: "General Contractor Thunder Bay | Construction & Renovation",
    metaDescription:
      "Dollar Contracting is a licensed general contractor and construction company in Thunder Bay — concrete, renovations, additions, kitchens, bathrooms, and restoration. Free quotes, call 807-709-7997.",
    keywords: [
      "general contractor Thunder Bay",
      "construction company Thunder Bay",
      "renovation contractor Thunder Bay",
      "home renovations Thunder Bay",
    ],
    body: [
      "Dollar Contracting is a full-service general contractor and construction company based in Thunder Bay, Ontario. From our shop at 48 Carl Ave we build and renovate homes and businesses across the city — Current River to Westfort, the intercity core to the rural roads on the outskirts — with our own in-house crews rather than a rotating cast of subcontractors.",
      "Homeowners come to us for kitchen and bathroom renovations, basement finishing, home additions, and whole-home renovations; we also handle the structural side most renovation companies sub out — concrete driveways and foundations, foundation repair, masonry and chimney work, framing, siding, and decks. Because one company carries the whole scope, there's one schedule, one budget, and one crew accountable for the finish.",
      "Everything we build is detailed for Thunder Bay's climate — real insulation and vapour control, frost-depth footings, ice-and-water protection at vulnerable edges, and drainage that keeps water away from your foundation. Licensed, insured, and WSIB-covered, we give you a written scope and schedule before any work begins.",
    ],
    faqs: [
      {
        q: "Are you licensed and insured to work in Thunder Bay?",
        a: "Yes — Dollar Contracting carries full liability insurance and WSIB coverage and builds to the Ontario Building Code, with permits and inspections handled as part of the job.",
      },
      {
        q: "What areas of Thunder Bay do you serve?",
        a: "All of Thunder Bay and the surrounding area, plus Fort William First Nation just across the Kaministiquia. Most city jobs are within a 30-minute drive of our Carl Ave shop, so site visits are quick.",
      },
      {
        q: "Do you offer free quotes in Thunder Bay?",
        a: "We do. Quote requests in Thunder Bay typically get a site visit within the week, followed by a firm written estimate with the scope spelled out.",
      },
    ],
  },
  {
    slug: "greenstone",
    city: "Greenstone",
    region: "Ontario",
    blurb: "Serving Geraldton, Longlac, and surrounding communities.",
    intro:
      "Renovations, additions, and exterior work in Greenstone-area communities. We mobilize crews and materials from Thunder Bay for projects scoped ahead of time.",
    popularServices: ["additions", "exterior-work", "restoration", "carpentry-work"],
    highlights: [
      {
        title: "Scoped trips",
        body: "We bundle work into focused trips so labour and material costs stay predictable.",
      },
      {
        title: "Insured & licensed",
        body: "Same insurance, same licensing, same crew standards as Thunder Bay jobs.",
      },
      {
        title: "Clear timelines",
        body: "Start dates and milestones written into your contract before we mobilize.",
      },
    ],
    seoTitle: "Contractor Greenstone & Geraldton | Renovations & Additions",
    metaDescription:
      "Renovation and construction contractor serving Greenstone, Geraldton, and Longlac. Additions, exterior work, restoration, and carpentry mobilized from Thunder Bay. Call 807-709-7997.",
    keywords: [
      "contractor Greenstone",
      "contractor Geraldton",
      "renovation contractor Northern Ontario",
      "construction Longlac",
    ],
    body: [
      "Dollar Contracting serves Greenstone and its communities — Geraldton, Longlac, Nakina, Beardmore, and the surrounding area — with renovations, additions, exterior work, and restoration mobilized from our Thunder Bay shop. Finding a reliable contractor this far north is half the challenge; we solve it by scoping projects ahead of time and bringing a full crew and materials in one coordinated trip.",
      "That bundled-trip approach keeps labour and material costs predictable and your timeline firm. Whether it's a Geraldton home addition, a Longlac exterior re-side before winter, or storm and water restoration, you get the same insured, licensed crew and the same build standards we apply on Thunder Bay jobs — with start dates and milestones written into the contract before we mobilize.",
    ],
    faqs: [
      {
        q: "Do you travel to Geraldton and Longlac for renovations?",
        a: "Yes — we regularly serve Geraldton, Longlac, and the wider Greenstone area. We bundle work into focused trips and price the mobilization upfront so there are no surprise travel line items.",
      },
      {
        q: "Is it more expensive to hire a Thunder Bay contractor in Greenstone?",
        a: "Travel is a real cost, but we control it by scoping the full project ahead of time and mobilizing one crew with all materials in a single trip, then quoting that cost transparently in the estimate.",
      },
    ],
  },
  {
    slug: "marathon",
    city: "Marathon",
    region: "Ontario",
    blurb: "Coastal renovations along the north shore.",
    intro:
      "Marathon and the surrounding north-shore communities. Restoration, exterior work, and full renovations handled with the same standards we apply at home.",
    popularServices: ["restoration", "exterior-work", "interior-renovation", "additions"],
    highlights: [
      {
        title: "Travel built in",
        body: "Mobilization is priced upfront — no surprise line items at the end.",
      },
      {
        title: "Weather-aware scheduling",
        body: "We schedule envelope work around north-shore weather windows.",
      },
      {
        title: "Direct contact",
        body: "One project manager, one phone number, from first site visit to handover.",
      },
    ],
    seoTitle: "Contractor Marathon Ontario | Renovations & Restoration",
    metaDescription:
      "Construction and renovation contractor serving Marathon and the north-shore communities of Lake Superior. Restoration, exterior work, and full renovations. Call 807-709-7997.",
    keywords: [
      "contractor Marathon Ontario",
      "renovation contractor Marathon",
      "construction company Northwestern Ontario",
      "restoration Marathon Ontario",
    ],
    body: [
      "Marathon and the north-shore communities along Lake Superior are a long way from most trades — which is exactly why we make the trip. Dollar Contracting handles restoration, exterior work, additions, and full interior renovations in Marathon with the same standards and the same insured, licensed crews we run at home in Thunder Bay.",
      "North-shore weather doesn't wait, so we schedule envelope work — siding, roofing, exterior repairs — around real weather windows and price the mobilization upfront. From first site visit to handover you deal with one project manager and one phone number, and the timeline is written into your contract before a crew rolls out.",
    ],
    faqs: [
      {
        q: "Do you take on projects in Marathon?",
        a: "Yes — Marathon and the surrounding north-shore communities are part of our regular Northwestern Ontario service area for restoration, renovations, additions, and exterior work.",
      },
      {
        q: "How do you handle scheduling for the north shore?",
        a: "We scope the full project ahead of time, schedule weather-sensitive exterior work around north-shore conditions, and mobilize one crew with everything needed so the job runs start to finish without repeat trips.",
      },
    ],
  },
  {
    slug: "dryden",
    city: "Dryden",
    region: "Ontario",
    blurb: "Renovations and exterior work for Dryden and the Wabigoon area.",
    intro:
      "Dryden and the surrounding Wabigoon-area communities. We schedule larger renovation, addition, and exterior packages so labour and materials arrive together.",
    popularServices: ["additions", "exterior-work", "interior-renovation", "carpentry-work"],
    highlights: [
      {
        title: "Bundled trips",
        body: "Work is grouped into focused mobilizations so quotes stay predictable.",
      },
      {
        title: "Local sub-trades",
        body: "We coordinate with regional plumbers and electricians familiar with Kenora-district code.",
      },
      {
        title: "Written timelines",
        body: "Start and finish dates are in the contract before a single material truck leaves the yard.",
      },
    ],
    seoTitle: "Contractor Dryden Ontario | Renovations & Exterior Work",
    metaDescription:
      "Renovation and construction contractor serving Dryden and the Wabigoon area. Additions, exterior work, interior renovations, and carpentry scheduled as bundled trips. Call 807-709-7997.",
    keywords: [
      "contractor Dryden Ontario",
      "renovation contractor Dryden",
      "construction company Northwestern Ontario",
      "home additions Dryden",
    ],
    body: [
      "Dryden and the surrounding Wabigoon-area communities sit at the western edge of our Northwestern Ontario service area, and we schedule work there so the whole package — labour and materials — arrives together. Dollar Contracting takes on renovations, additions, exterior work, and carpentry in Dryden, grouping the work into focused mobilizations that keep quotes predictable.",
      "We coordinate with regional plumbers and electricians familiar with Kenora-district code, and we put start and finish dates in the contract before a single material truck leaves the yard. It's the same insured, licensed crew and the same standards we run in Thunder Bay — just planned around the distance so nothing stalls mid-project.",
    ],
    faqs: [
      {
        q: "Do you serve Dryden and the Wabigoon area?",
        a: "Yes — Dryden and the surrounding communities are part of our regular service area for renovations, additions, exterior work, and carpentry, scheduled as bundled trips to keep costs predictable.",
      },
      {
        q: "Who handles plumbing and electrical on Dryden jobs?",
        a: "We coordinate with regional sub-trades familiar with Kenora-district code where it makes sense, while our own crew carries the carpentry, structural, and finishing work.",
      },
    ],
  },
  {
    slug: "pickle-lake",
    city: "Pickle Lake",
    region: "Ontario",
    blurb: "Far-north builds, restorations, and exterior work.",
    intro:
      "Pickle Lake and the surrounding far-north communities. We plan logistics carefully — freight scheduling, crew rotations, and weather windows all factored into the timeline.",
    popularServices: ["restoration", "exterior-work", "additions", "carpentry-work"],
    highlights: [
      {
        title: "Logistics first",
        body: "Material orders, freight, and crew travel are scoped before a contract is signed.",
      },
      {
        title: "Self-sufficient crews",
        body: "We send full crews with tools, equipment, and a site supervisor — no relying on local rentals.",
      },
      {
        title: "Cold-climate detailing",
        body: "Every envelope assembly is detailed for sub-arctic winters and freeze-thaw cycles.",
      },
    ],
    seoTitle: "Contractor Pickle Lake | Far-North Builds & Restoration",
    metaDescription:
      "Construction and renovation contractor serving Pickle Lake and the far-north communities of Northwestern Ontario. Builds, restoration, and exterior work with logistics planned in. Call 807-709-7997.",
    keywords: [
      "contractor Pickle Lake",
      "construction company Northwestern Ontario",
      "far north renovation Ontario",
      "restoration Pickle Lake",
    ],
    body: [
      "Pickle Lake is as far north as the road goes in Ontario, and getting a capable crew there is the whole battle. Dollar Contracting plans far-north projects down to the freight schedule — material orders, crew rotations, and weather windows all factored into the timeline before a contract is signed, so the job doesn't stall waiting on a part that's four hundred kilometres away.",
      "We send full, self-sufficient crews with their own tools, equipment, and a site supervisor — no relying on local rentals — and detail every envelope assembly for sub-arctic winters and freeze-thaw cycles. Restoration, exterior work, additions, and carpentry all get the same build standards we run in Thunder Bay, adapted to the realities of far-north Northwestern Ontario.",
    ],
    faqs: [
      {
        q: "Can you really take on work in Pickle Lake?",
        a: "Yes — far-north projects are part of what we do. The difference is planning: we scope material orders, freight, crew travel, and weather windows before the contract is signed so nothing stalls once we're on site.",
      },
      {
        q: "Do you rely on local trades and rentals up north?",
        a: "No — we send self-sufficient crews with their own tools, equipment, and a site supervisor, so the project doesn't depend on scarce local rentals or trades.",
      },
    ],
  },
  {
    slug: "fort-william-first-nation",
    city: "Fort William First Nation",
    region: "Ontario",
    blurb: "Community-focused builds on Anishinaabe territory south of Thunder Bay.",
    intro:
      "Fort William First Nation, just across the Kaministiquia from our Thunder Bay shop. We work with band administration, housing departments, and individual homeowners on renovations, additions, and new builds.",
    popularServices: ["additions", "interior-renovation", "exterior-work", "concrete-work"],
    highlights: [
      {
        title: "Same-day site visits",
        body: "Just across the bridge from our shop — we can usually be on site the same week.",
      },
      {
        title: "Band-program friendly",
        body: "Experience working with housing-department procurement, draws, and reporting requirements.",
      },
      {
        title: "Respectful crews",
        body: "Our crews follow community protocols and keep work areas clean and tidy.",
      },
    ],
    seoTitle: "Contractor Fort William First Nation | Builds & Renovations",
    metaDescription:
      "Construction and renovation contractor serving Fort William First Nation — renovations, additions, and new builds with band housing-program experience. Just across the bridge from Thunder Bay. Call 807-709-7997.",
    keywords: [
      "contractor Fort William First Nation",
      "construction Fort William First Nation",
      "renovation contractor Thunder Bay",
      "home additions Thunder Bay",
    ],
    body: [
      "Fort William First Nation sits just across the Kaministiquia River from our Thunder Bay shop, so we're one of the closest full-service contractors to the community. Dollar Contracting works with band administration, housing departments, and individual homeowners on renovations, additions, concrete work, and new builds on Anishinaabe territory south of the city.",
      "We have experience with housing-department procurement, draws, and reporting requirements, so the paperwork side runs as smoothly as the build. Because we're minutes away, we can usually be on site the same week — and our crews follow community protocols and keep work areas clean and tidy throughout the project.",
    ],
    faqs: [
      {
        q: "Do you work with band housing departments?",
        a: "Yes — we have experience with housing-department procurement, draws, and reporting, and we work directly with band administration as well as individual homeowners.",
      },
      {
        q: "How quickly can you get to Fort William First Nation?",
        a: "We're just across the bridge from our Thunder Bay shop, so we can usually be on site the same week for a consultation or quote.",
      },
    ],
  },
];

export function getLocation(slug: string) {
  return locations.find((l) => l.slug === slug);
}
