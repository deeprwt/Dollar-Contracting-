export const siteConfig = {
  name: "Dollar Contracting",
  shortName: "Dollar Contracting",
  tagline: "Building better futures, one project at a time.",
  description:
    "Thunder Bay's trusted construction and renovation company. Concrete, masonry, carpentry, full interior and exterior renovations across Northern Ontario.",
  // Canonical host. The apex (dollarcontracting.com) redirects to www, so www
  // is the URL that serves 200 — canonical links, OG tags, the sitemap and
  // robots all point here so the canonical URL is never itself a redirect.
  url: "https://www.dollarcontracting.com",
  phone: "807-709-7997",
  phoneHref: "tel:+18077097997",
  // E.164 form, used in LocalBusiness structured data.
  phoneE164: "+1-807-709-7997",
  email: "Dollarcontractingltd@gmail.com",
  emailHref: "mailto:Dollarcontractingltd@gmail.com",
  address: {
    street: "48 Carl Ave",
    city: "Thunder Bay",
    region: "Ontario",
    regionCode: "ON",
    country: "Canada",
    countryCode: "CA",
    postal: "",
  },
  // Approximate Thunder Bay coordinates for LocalBusiness geo. Replace with the
  // exact 48 Carl Ave lat/lng (and a postal code above) for best local ranking.
  geo: {
    latitude: 48.3809,
    longitude: -89.2477,
  },
  foundingYear: "2014",
  priceRange: "$$",
  hours: {
    weekdays: "Monday – Saturday: 8:00 AM – 9:00 PM",
    weekend: "Sunday: Closed",
  },
  social: {
    instagram: "https://instagram.com/dollarcontracting",
    facebook: "https://www.facebook.com/people/Dollar-Contracting-Ltd/61582556120725/",
    twitter: "#",
    linkedin: "#",
  },
  // Google Business Profile — used for "Leave a review" CTAs and for the
  // Trustindex widget fallback when the widget isn't configured yet.
  googleMapsUrl: "https://maps.app.goo.gl/7DE4kZ3pMbREc7h1A",
  googleReviewUrl: "https://maps.app.goo.gl/7DE4kZ3pMbREc7h1A",
  // Places we serve. Fed into LocalBusiness/Service `areaServed` structured
  // data and used across copy so "in {place}" queries have a matching signal.
  serviceArea: [
    "Thunder Bay",
    "Fort William First Nation",
    "Dryden",
    "Greenstone",
    "Geraldton",
    "Longlac",
    "Marathon",
    "Pickle Lake",
    "Northwestern Ontario",
    "Northern Ontario",
  ],
  // Default <meta name="keywords">. Google ignores this tag for ranking, but
  // it's harmless and other engines/tools still read it. Real ranking comes
  // from titles, headings, content and structured data — not this list. Kept in
  // sync with our target search phrases; per-page keywords override this.
  keywords: [
    "general contractor Thunder Bay",
    "construction company Thunder Bay",
    "renovation contractor Thunder Bay",
    "home renovations Thunder Bay",
    "concrete contractor Thunder Bay",
    "kitchen renovation Thunder Bay",
    "bathroom renovation Thunder Bay",
    "home additions Thunder Bay",
    "masonry contractor Thunder Bay",
    "carpentry services Thunder Bay",
    "concrete driveway Thunder Bay",
    "foundation repair Thunder Bay",
    "basement renovation Thunder Bay",
    "chimney repair Thunder Bay",
    "deck builder Thunder Bay",
    "siding contractor Thunder Bay",
    "flooring installation Thunder Bay",
    "painting contractor Thunder Bay",
    "water damage restoration Thunder Bay",
    "commercial contractor Thunder Bay",
    "renovation contractor Northern Ontario",
    "construction company Northwestern Ontario",
    "contractor Dryden Ontario",
    "contractor Greenstone Geraldton",
    "contractor Marathon Ontario",
    "Dollar Contracting",
  ],
} as const;

export type NavChild = {
  label: string;
  href: string;
  description?: string;
  tag?: string;
};

export type NavSection = {
  header?: string;
  items: NavChild[];
};

export type NavItem = {
  label: string;
  href: string;
  sections?: NavSection[];
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    sections: [
      {
        header: "Concrete & Foundations",
        items: [
          { label: "Concrete Work", href: "/services/concrete-work", description: "Footings, slabs, pours" },
          { label: "Concrete Driveways", href: "/services/concrete-driveways", description: "Driveways, walkways, patios" },
          { label: "Foundation Repair", href: "/services/foundation-repair", description: "Cracks, waterproofing, leveling" },
          { label: "Masonry Work", href: "/services/masonry-work", description: "Brick, stone, block" },
          { label: "Chimney Repair", href: "/services/chimney-repair", description: "Repointing & rebuilds" },
          { label: "Carpentry Work", href: "/services/carpentry-work", description: "Framing to finish" },
        ],
      },
      {
        header: "Renovations",
        items: [
          { label: "Kitchen Renovation", href: "/services/kitchen-renovation" },
          { label: "Bathroom Renovation", href: "/services/bathroom-renovation" },
          { label: "Basement Renovation", href: "/services/basement-renovation" },
          { label: "Home Additions", href: "/services/additions" },
          { label: "Interior Renovation", href: "/services/interior-renovation" },
          { label: "Water Damage Restoration", href: "/services/restoration", description: "Water, fire, storm" },
        ],
      },
      {
        header: "Exterior & Trades",
        items: [
          { label: "Deck Building", href: "/services/deck-building" },
          { label: "Siding", href: "/services/siding" },
          { label: "Exterior Work", href: "/services/exterior-work" },
          { label: "Painting", href: "/services/painting" },
          { label: "Flooring", href: "/services/flooring" },
          { label: "HVAC", href: "/services/hvac" },
          { label: "Electrical", href: "/services/electrical-work" },
          { label: "Plumbing", href: "/services/plumbing" },
        ],
      },
      {
        header: "Commercial",
        items: [
          { label: "Commercial Construction", href: "/services/commercial-construction", description: "Build-outs, renos, TI" },
          { label: "All Services", href: "/services" },
        ],
      },
    ],
  },
  {
    label: "Locations",
    href: "/locations",
    sections: [
      {
        header: "Service Areas",
        items: [
          { label: "Thunder Bay", href: "/locations/thunder-bay", description: "Our home base" },
          { label: "Fort William First Nation", href: "/locations/fort-william-first-nation", description: "Across the Kaministiquia" },
          { label: "Greenstone", href: "/locations/greenstone", description: "Geraldton, Longlac & area" },
          { label: "Marathon", href: "/locations/marathon", description: "North-shore communities" },
          { label: "Dryden", href: "/locations/dryden", description: "Dryden & Wabigoon area" },
          { label: "Pickle Lake", href: "/locations/pickle-lake", description: "Far-north communities" },
          { label: "All Service Areas", href: "/locations" },
        ],
      },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/career" },
];

export const footerColumns = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Careers", href: "/career" },
      { label: "Get A Quote", href: "/quote" },
    ],
  },
  {
    title: "Locations",
    links: [
      { label: "Thunder Bay", href: "/locations/thunder-bay" },
      { label: "Fort William First Nation", href: "/locations/fort-william-first-nation" },
      { label: "Greenstone", href: "/locations/greenstone" },
      { label: "Marathon", href: "/locations/marathon" },
      { label: "Dryden", href: "/locations/dryden" },
      { label: "Pickle Lake", href: "/locations/pickle-lake" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Concrete Driveways", href: "/services/concrete-driveways" },
      { label: "Foundation Repair", href: "/services/foundation-repair" },
      { label: "Kitchen Renovation", href: "/services/kitchen-renovation" },
      { label: "Bathroom Renovation", href: "/services/bathroom-renovation" },
      { label: "Basement Renovation", href: "/services/basement-renovation" },
      { label: "Home Additions", href: "/services/additions" },
      { label: "Deck Building", href: "/services/deck-building" },
      { label: "Siding Contractor", href: "/services/siding" },
      { label: "Water Damage Restoration", href: "/services/restoration" },
      { label: "Commercial Construction", href: "/services/commercial-construction" },
    ],
  },
];
