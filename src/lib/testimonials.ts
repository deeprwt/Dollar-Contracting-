export type Testimonial = {
  id: string;
  name: string;
  initials: string;
  role: string;
  location: string;
  locationSlug?: string;
  project: string;
  projectHref?: string;
  rating: number;
  quote: string;
  date: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "henderson-squaw-bay",
    name: "Mike Henderson",
    initials: "MH",
    role: "Homeowner",
    location: "Squaw Bay Road, Thunder Bay",
    locationSlug: "thunder-bay",
    project: "Full house renovation",
    projectHref: "/projects#full-house-renovation",
    rating: 5,
    quote:
      "We hired Dollar Contracting for a full gut of our place on Squaw Bay Road. Floors, kitchen, bath, all of it. They stuck to the schedule, kept the site clean, and the finish carpentry is top-notch. Wouldn't hesitate to call them again.",
    date: "April 2026",
  },
  {
    id: "morin-kitchen",
    name: "Sarah & Greg Morin",
    initials: "SM",
    role: "Homeowners",
    location: "Thunder Bay",
    locationSlug: "thunder-bay",
    project: "Kitchen renovation",
    projectHref: "/services/kitchen-renovation",
    rating: 5,
    quote:
      "Took a wall out, moved the sink, and rebuilt the whole kitchen around how we actually cook. The crew showed up when they said they would and the quartz seam is perfect. Big upgrade from the 1980s setup we had.",
    date: "March 2026",
  },
  {
    id: "pelletier-fwfn-addition",
    name: "Janelle Pelletier",
    initials: "JP",
    role: "Homeowner",
    location: "Fort William First Nation",
    locationSlug: "fort-william-first-nation",
    project: "Home addition",
    projectHref: "/services/additions",
    rating: 5,
    quote:
      "Added a back bedroom and a proper mudroom for the kids' winter gear. The team worked with our band housing department on the draws and inspections without us having to babysit anything. Quiet, respectful crew — appreciated that.",
    date: "February 2026",
  },
  {
    id: "korpela-marathon-roof",
    name: "Ron & Linda Korpela",
    initials: "RK",
    role: "Homeowners",
    location: "Marathon",
    locationSlug: "marathon",
    project: "Roofing",
    projectHref: "/projects#roofing",
    rating: 5,
    quote:
      "Old roof was leaking in two spots and our last contractor never showed. Dollar Contracting drove up, did the full re-roof in three days, and the ice-and-water shield they added at the eaves stopped our ice-dam problem cold. Worth the call.",
    date: "October 2025",
  },
  {
    id: "saari-signboard",
    name: "Dave Saari",
    initials: "DS",
    role: "Business owner",
    location: "Thunder Bay",
    locationSlug: "thunder-bay",
    project: "Storefront signboard install",
    projectHref: "/projects#signboard-installed",
    rating: 5,
    quote:
      "Needed a signboard fabricated and mounted on a tight timeline before our grand opening. They measured the wall, sourced the materials, and had it up two days ahead of schedule. Looks sharp. Customers comment on it weekly.",
    date: "January 2026",
  },
  {
    id: "bouchard-greenstone-bath",
    name: "Karen Bouchard",
    initials: "KB",
    role: "Homeowner",
    location: "Geraldton, Greenstone",
    locationSlug: "greenstone",
    project: "Bathroom renovation",
    projectHref: "/services/bathroom-renovation",
    rating: 5,
    quote:
      "Walk-in shower with heated tile floor — the upgrade I should have done ten years ago. They scheduled the trip from Thunder Bay so all the materials came in one load. Three weeks, dust contained, and they hauled the demo out themselves.",
    date: "December 2025",
  },
  {
    id: "watson-dryden-water",
    name: "Steve Watson",
    initials: "SW",
    role: "Property manager",
    location: "Dryden",
    locationSlug: "dryden",
    project: "Water damage restoration",
    projectHref: "/services/restoration",
    rating: 5,
    quote:
      "Burst pipe on the upper floor of one of our rentals — full ceiling and flooring loss in three rooms. Dollar Contracting handled the dry-out, the insurance paperwork, and the rebuild. Tenants moved back in four weeks later. Real pros.",
    date: "November 2025",
  },
  {
    id: "mackenzie-pickle-lake-exterior",
    name: "Cheryl Mackenzie",
    initials: "CM",
    role: "Homeowner",
    location: "Pickle Lake",
    locationSlug: "pickle-lake",
    project: "Siding & exterior trim",
    projectHref: "/services/exterior-work",
    rating: 5,
    quote:
      "Getting tradespeople to Pickle Lake is half the battle. They quoted the trip costs upfront, mobilized one crew with everything they needed, and we have new siding and soffits that look like the house was built yesterday. Honest about everything.",
    date: "September 2025",
  },
  {
    id: "obrien-concrete",
    name: "Patrick O'Brien",
    initials: "PO",
    role: "Homeowner",
    location: "Thunder Bay",
    locationSlug: "thunder-bay",
    project: "Concrete driveway & walkway",
    projectHref: "/services/concrete-work",
    rating: 5,
    quote:
      "Replaced a cracked driveway and added a walkway to the side door. Forms were dead-straight, the finish is even, and they came back to seal it after the cure. Already through one winter — no cracks, no spalling.",
    date: "August 2025",
  },
  {
    id: "tanguay-bath",
    name: "Diane Tanguay",
    initials: "DT",
    role: "Homeowner",
    location: "Thunder Bay",
    locationSlug: "thunder-bay",
    project: "Master bathroom remodel",
    projectHref: "/services/bathroom-renovation",
    rating: 5,
    quote:
      "Soaking tub, double vanity, and a curbless tiled shower. The waterproofing was done with proper membrane systems — they walked me through it before they tiled so I knew what I was paying for. Quality work, no surprises on the invoice.",
    date: "July 2025",
  },
];
