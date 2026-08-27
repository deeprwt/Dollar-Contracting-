export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  longDescription: string[];
  image: string;
  gallery: string[];
  features: string[];
  scope: string[];
  materials?: string[];
  /**
   * Exact <title> for this service page. Overrides the generic
   * "{shortTitle} in Thunder Bay" fallback so each page can target its precise
   * search phrase (e.g. "Concrete Driveway Thunder Bay"). Keep under ~60 chars
   * (the template appends " | Dollar Contracting").
   */
  seoTitle?: string;
  /** Meta description (~150–160 chars). Falls back to `description`. */
  metaDescription?: string;
  /** Page-specific keyword phrases for <meta name="keywords">. */
  keywords?: readonly string[];
  /** Q&A pairs — rendered as a visible FAQ and emitted as FAQPage JSON-LD. */
  faqs?: Faq[];
};

export const services: Service[] = [
  {
    slug: "concrete-work",
    title: "All Concrete Work",
    shortTitle: "Concrete Work",
    tagline: "Concrete solutions built to last.",
    description:
      "Concrete pours, foundations, footings, slabs, sidewalks, and driveways finished to a clean, even surface that holds up to Northern Ontario winters.",
    image:
      "/2026/04/All-Concrete-Work.jpg",
    longDescription: [
      "Concrete is the backbone of modern construction, and at Dollar Contracting we treat every pour with the precision and expertise it demands. Our concrete division handles everything from residential foundation work and driveway installations to large-scale commercial slabs and structural elements.",
      "Our team manages the entire concrete process from subgrade preparation through final curing and sealing. We use engineered formwork systems, properly specified rebar and wire mesh reinforcement, and high-performance concrete mixes tailored to each project's load requirements, exposure conditions, and finish specifications.",
      "Beyond standard flatwork and structural pours, we specialize in decorative concrete applications including stamped patterns, acid staining, integral colour, and polished concrete finishes. We also provide comprehensive concrete repair and resurfacing services to restore cracked, spalled, or deteriorated concrete to like-new condition.",
    ],
    gallery: [
      "/2026/04/cement-mixer-construction-site-1024x683.jpg",
      "/2026/04/worker-leveling-fresh-floor-with-special-machine-1024x666.jpg",
    ],
    features: [
      "Foundations, footings, and slabs",
      "Driveways, walkways, and patios",
      "Reinforced and decorative finishes",
      "Stamped, stained, and polished concrete",
      "Concrete repair, resurfacing, and crack repair",
      "Curing, sealing, and surface protection",
    ],
    scope: [
      "Site prep, excavation, and subgrade compaction",
      "Forming, rebar, and wire mesh placement",
      "Pour, screed, float, and finish",
      "Cure, seal, and final clean-up",
    ],
    materials: [
      "High-performance ready-mix concrete",
      "Fibre and rebar reinforcement",
      "Decorative stamps, integral colour, and stains",
      "Penetrating and topical concrete sealers",
    ],
    seoTitle: "Concrete Contractor Thunder Bay | Driveways, Slabs & Footings",
    metaDescription:
      "Licensed concrete contractor in Thunder Bay. Driveways, footings, foundations, slabs, sidewalks and decorative concrete built to survive Northern Ontario winters. Free quotes — call 807-709-7997.",
    keywords: [
      "concrete contractor Thunder Bay",
      "concrete driveway Thunder Bay",
      "foundation repair Thunder Bay",
      "concrete slab Thunder Bay",
    ],
    faqs: [
      {
        q: "How much does a concrete driveway cost in Thunder Bay?",
        a: "Most residential concrete driveways in Thunder Bay fall into a per-square-foot range that depends on thickness, reinforcement, prep work, and finish (broom, exposed aggregate, or stamped). We give a firm written quote after a quick site visit — no guessing.",
      },
      {
        q: "Can you pour concrete in the winter in Northern Ontario?",
        a: "Yes. We pour year-round using cold-weather practices — heated enclosures, insulated blankets, accelerators, and monitored curing — but most flatwork like driveways and walkways is best scheduled spring through fall for the cleanest finish.",
      },
      {
        q: "Do you fix cracked or spalling concrete?",
        a: "We do. Beyond new pours we handle concrete repair, resurfacing, crack injection, and sealing to bring cracked, pitted, or spalled surfaces back to a solid, even finish.",
      },
      {
        q: "How long before I can drive on a new driveway?",
        a: "Foot traffic is usually fine after 24–48 hours; wait about 7 days before parking a vehicle and roughly 28 days for full cure strength. We seal after the initial cure to protect against road salt and freeze-thaw damage.",
      },
    ],
  },
  {
    slug: "masonry-work",
    title: "All Masonry Work",
    shortTitle: "Masonry Work",
    tagline: "Precision masonry for every application.",
    description:
      "Structural and decorative masonry — chimneys, retaining walls, brick veneers, stone facades, and full block work executed by experienced crews.",
    image:
      "/2026/04/All-Masonry-Work.jpg",
    longDescription: [
      "Masonry is among the oldest and most trusted building methods in the construction industry, and at Dollar Contracting we carry that legacy forward with modern precision and craftsmanship. We specialize in brick, block, and natural stone construction for residential and commercial projects.",
      "Whether you need a load-bearing block wall for a new commercial building, an elegant stone veneer facade for your home, or detailed tuckpointing to restore aging brickwork, our masons bring decades of hands-on experience to every project.",
      "We handle historic restoration too — matching original materials, replicating mortar profiles, and meeting preservation standards while still satisfying modern structural requirements. Fireplaces, garden retaining walls, chimneys, and feature walls all fall within our scope.",
    ],
    gallery: [
      "/2026/04/two-workers-stacking-bricks-looking-camera-1024x681.jpg",
      "/2026/04/bricklaying-construction-worker-building-brick-wall-1024x683.jpg",
    ],
    features: [
      "Brick, block, and stone construction",
      "Load-bearing and veneer walls",
      "Chimney builds and repointing",
      "Tuckpointing and mortar repair",
      "Retaining walls and feature walls",
      "Heritage and historic restoration",
    ],
    scope: [
      "Layout, footings, and bonding plan",
      "Cut, bed, and finish each course",
      "Pointing, cleaning, and sealing",
      "Final inspection and walk-through",
    ],
    materials: [
      "Clay brick and concrete masonry units (CMU)",
      "Natural limestone, granite, and slate",
      "Manufactured stone veneer",
      "Type N, S, and M mortar mixes",
    ],
    seoTitle: "Masonry Contractor Thunder Bay | Brick, Stone & Block",
    metaDescription:
      "Experienced masonry contractor in Thunder Bay — brick, block, and natural stone, chimney repair, tuckpointing, retaining walls, and heritage restoration. Free estimates, call 807-709-7997.",
    keywords: [
      "masonry contractor Thunder Bay",
      "brick repair Thunder Bay",
      "chimney repair Thunder Bay",
      "stone veneer Thunder Bay",
    ],
    faqs: [
      {
        q: "Do you repair brick chimneys and do tuckpointing?",
        a: "Yes — chimney rebuilds, repointing, crown repair, and tuckpointing are core masonry services. We match existing brick and mortar profiles so repairs blend into the original wall.",
      },
      {
        q: "Can you build a stone or brick retaining wall?",
        a: "We build both structural and decorative retaining walls in block, natural stone, and manufactured veneer, engineered with proper footings and drainage for Northern Ontario frost depths.",
      },
      {
        q: "Do you work on heritage or older masonry?",
        a: "We do heritage restoration — matching original materials, replicating mortar profiles, and meeting preservation standards while still satisfying modern structural requirements.",
      },
    ],
  },
  {
    slug: "carpentry-work",
    title: "All Carpentry Work",
    shortTitle: "Carpentry Work",
    tagline: "Framing to finish — handled by craftsmen.",
    description:
      "Rough framing, trim, doors, custom built-ins, and finish carpentry. The bones of the build and the details that show.",
    image:
      "/2026/04/All-Carpentry-Work.jpg",
    longDescription: [
      "Carpentry is the craft that gives a building its shape, character, and soul. Our carpentry division handles everything from structural framing through finish work, combining traditional techniques with modern building standards.",
      "Our rough carpentry covers wall framing, roof truss installation, floor joist systems, sheathing, and structural headers for windows and doors — all built to International Building Code standards.",
      "On the finish side we handle custom cabinetry, crown molding and baseboards, casing installation, built-in shelving and entertainment centres, wainscoting, coffered ceilings, and full staircase construction. Every joint is tight, every surface is sanded smooth, and every detail reflects our commitment to excellence.",
    ],
    gallery: [
      "/2026/04/medium-shot-artisan-doing-woodcutting-1024x683.jpg",
      "/2026/04/carpenter-cutting-mdf-board-inside-workshop-1024x683.jpg",
    ],
    features: [
      "Wall framing and roof trusses",
      "Floor joist systems and sheathing",
      "Custom cabinetry and built-ins",
      "Crown molding, baseboards, and casing",
      "Staircases, wainscoting, and coffered ceilings",
      "Doors, windows, and trim install",
    ],
    scope: [
      "Measure, take-off, and material order",
      "Frame, sheath, or install per spec",
      "Caulk, sand, and prep for paint",
      "Final adjustment and hand-off",
    ],
    materials: [
      "Premium hardwoods — oak, maple, cherry, walnut",
      "Engineered lumber and composites",
      "Pressure-treated decking and structural timbers",
      "Cabinet-grade plywood and MDF",
    ],
    seoTitle: "Carpentry Services Thunder Bay | Framing to Finish",
    metaDescription:
      "Skilled carpentry services in Thunder Bay — framing, trim, custom cabinetry, built-ins, staircases, and finish carpentry to code. Free quotes, call 807-709-7997.",
    keywords: [
      "carpentry services Thunder Bay",
      "finish carpentry Thunder Bay",
      "custom cabinetry Thunder Bay",
      "framing contractor Thunder Bay",
    ],
    faqs: [
      {
        q: "Do you do both rough framing and finish carpentry?",
        a: "Yes — everything from wall framing, roof trusses, and floor systems to crown molding, casing, built-ins, and staircases. One crew carries the project from structure through finish.",
      },
      {
        q: "Can you build custom cabinetry and built-ins?",
        a: "We build custom cabinetry, entertainment centres, bookshelves, wainscoting, and coffered ceilings in cabinet-grade hardwoods and plywood, sanded and finished on site.",
      },
    ],
  },
  {
    slug: "restoration",
    title: "Restoration",
    shortTitle: "Restoration",
    tagline: "Bring damaged structures back to life.",
    description:
      "Water, fire, storm, and age damage — we restore residential and commercial properties to original condition or better.",
    image:
      "/2026/04/Restoration.jpg",
    longDescription: [
      "Disasters and time both leave their mark. Dollar Contracting's restoration division is built to handle the full recovery — from initial assessment and emergency stabilization through final finish work that returns the property to original condition or better.",
      "We work on water and flood damage, fire and smoke restoration, structural repair after storms, and the slow-burn damage caused by age, neglect, or hidden moisture. Our crews coordinate with insurance adjusters and document every stage of the work so your claim has everything it needs.",
      "Heritage and matching finishes are part of what we do. Where original materials still exist, we save and re-use them. Where they don't, we source replacements that blend seamlessly so the repair disappears and the property reads as whole again.",
    ],
    gallery: [
      "/2026/04/All-Concrete-Work.jpg",
      "/2026/04/All-Carpentry-Work.jpg",
    ],
    features: [
      "Water and flood damage recovery",
      "Fire and smoke restoration",
      "Structural repair after storm or impact",
      "Heritage and historic matching",
      "Insurance documentation and coordination",
      "Mold remediation and dry-out",
    ],
    scope: [
      "Damage assessment and written scope",
      "Stabilize, dry out, and demo",
      "Rebuild and refinish to match",
      "Final inspection and hand-off",
    ],
    materials: [
      "Period-appropriate trim and millwork",
      "Matched brick, mortar, and stone",
      "Moisture-rated drywall and insulation",
      "Anti-microbial sealers and primers",
    ],
    seoTitle: "Water Damage Restoration Thunder Bay | Fire & Storm Repair",
    metaDescription:
      "Water damage restoration in Thunder Bay and Northern Ontario. Flood, fire, storm, and mold recovery with insurance coordination and full rebuild. Fast response — call 807-709-7997.",
    keywords: [
      "water damage restoration Thunder Bay",
      "fire damage restoration Thunder Bay",
      "flood cleanup Thunder Bay",
      "mold remediation Thunder Bay",
    ],
    faqs: [
      {
        q: "Do you work with insurance on water damage claims?",
        a: "Yes. We document every stage of the work, coordinate directly with your adjuster, and provide the scope and photos your claim needs so the rebuild is covered properly.",
      },
      {
        q: "How fast can you respond to water or flood damage?",
        a: "We prioritize water and flood calls because standing moisture causes mold and structural damage quickly. We handle emergency stabilization and dry-out first, then rebuild to original condition or better.",
      },
      {
        q: "Do you handle fire and smoke damage too?",
        a: "We restore water, fire, smoke, and storm damage across residential and commercial properties — from cleanup and demo through refinishing so the repair disappears.",
      },
    ],
  },
  {
    slug: "additions",
    title: "Additions",
    shortTitle: "Additions",
    tagline: "Add space without losing what you love.",
    description:
      "Single-room additions, second-storey adds, garages, sunrooms, and full extensions designed to match the existing structure.",
    image:
      "/2026/04/Additions.jpg",
    longDescription: [
      "When you love your neighbourhood but need more room, an addition is usually the smartest move. Dollar Contracting designs and builds single-room additions, second-storey adds, garages, sunrooms, and full extensions that look like they were always part of the house.",
      "Matching the existing structure is the tricky part — roofline, siding profile, window proportions, and trim details all have to line up. We measure carefully, source matching materials when they're still available, and use modern alternatives that blend in when they aren't.",
      "Permits, structural engineering, and inspections are all handled in-house. You get one project manager, one contract, and one schedule from the first sketch through the final walk-through.",
    ],
    gallery: [
      "/2026/04/All-Exterior-Work.jpg",
      "/2026/04/All-Carpentry-Work.jpg",
    ],
    features: [
      "Single-room and full-storey additions",
      "Garage and sunroom builds",
      "Permit drawings and structural engineering",
      "Seamless tie-in with existing roof and siding",
      "Mechanical, electrical, and plumbing extensions",
      "Inspection coordination and sign-off",
    ],
    scope: [
      "Design, permits, and engineering",
      "Foundation, framing, and envelope",
      "Mechanical rough-in and inspection",
      "Finishing, paint, and hand-off",
    ],
    seoTitle: "Home Additions Thunder Bay | Room & Second-Storey Adds",
    metaDescription:
      "Home additions in Thunder Bay — room additions, second-storey adds, garages, and sunrooms that match your existing home. Permits and engineering handled in-house. Call 807-709-7997.",
    keywords: [
      "home additions Thunder Bay",
      "room addition Thunder Bay",
      "second storey addition Thunder Bay",
      "garage builder Thunder Bay",
    ],
    faqs: [
      {
        q: "Do you handle permits and structural engineering for additions?",
        a: "Yes — permit drawings, structural engineering, and inspection coordination are all handled in-house. You get one project manager, one contract, and one schedule from sketch to final walk-through.",
      },
      {
        q: "Will the addition match my existing house?",
        a: "That's the tricky part and where we focus: roofline, siding profile, window proportions, and trim all have to line up. We source matching materials where they're still available and blend modern alternatives where they aren't.",
      },
    ],
  },
  {
    slug: "interior-renovation",
    title: "All Interior Renovation",
    shortTitle: "Interior Renovation",
    tagline: "Whole-home or single-room — your call.",
    description:
      "Full interior overhauls: walls, ceilings, floors, lighting, and finishes. Designed for how you actually live.",
    image:
      "/2026/04/All-Interior-Renovation.jpg",
    longDescription: [
      "Interior renovation is more than new paint and flooring — it's reshaping how a space works. We handle open-concept conversions that remove barriers between rooms, creating seamless airy environments that match how people actually live today.",
      "Our scope runs from precision drywall and advanced insulation upgrades to custom trim work and millwork. Before any finish work starts we assess the structure, check code compliance, and address underlying issues like outdated wiring, leaky plumbing, or moisture concerns.",
      "Natural light, traffic flow, dedicated functional zones, and premium materials from trusted suppliers — these are the ingredients of a renovation that holds up. Every milestone is tracked and you'll know exactly where the project stands at every stage.",
    ],
    gallery: [
      "/2026/04/beautiful-shot-modern-house-kitchen-dining-room-1024x683.jpg",
      "/2026/04/3d-rendering-modern-dining-room-living-room-with-luxury-decor-1024x550.jpg",
    ],
    features: [
      "Whole-home interior overhauls",
      "Open-concept conversions",
      "Basement finishing",
      "Drywall, insulation, and trim",
      "Custom millwork and built-ins",
      "Lighting design and electrical upgrades",
    ],
    scope: [
      "Walk-through, design, and material selection",
      "Demo, structural changes, and rough-in",
      "Drywall, paint, flooring, and finish",
      "Punch list and final walk-through",
    ],
    materials: [
      "Premium drywall, insulation, and vapour barriers",
      "Hardwood, engineered, vinyl plank, and tile flooring",
      "Custom millwork and cabinet-grade hardwoods",
      "Premium paint, stains, and clear coats",
    ],
    seoTitle: "Home Renovations Thunder Bay | Whole-Home Interior Reno",
    metaDescription:
      "Home renovations in Thunder Bay — whole-home interior overhauls, open-concept conversions, basement finishing, drywall, trim, and custom millwork. One crew, start to finish. Call 807-709-7997.",
    keywords: [
      "home renovations Thunder Bay",
      "renovation contractor Thunder Bay",
      "interior renovation Thunder Bay",
      "open concept renovation Thunder Bay",
    ],
    faqs: [
      {
        q: "Do you do whole-home renovations or just single rooms?",
        a: "Both. We handle single-room refreshes, open-concept conversions, and full whole-home interior overhauls — walls, ceilings, floors, lighting, and finishes, all coordinated by one crew.",
      },
      {
        q: "Can you remove walls to open up my floor plan?",
        a: "Yes. We assess whether a wall is load-bearing, engineer the beam or header if it is, and handle the structural change, rough-in, and finishing so the space opens up safely.",
      },
    ],
  },
  {
    slug: "exterior-work",
    title: "All Exterior Work",
    shortTitle: "Exterior Work",
    tagline: "Curb appeal and weather protection.",
    description:
      "Siding, soffit, fascia, decks, fencing, and full exterior facelifts that hold up to Thunder Bay winters and summer storms.",
    image:
      "/2026/04/All-Exterior-Work.jpg",
    longDescription: [
      "The exterior of your home is its first line of defence against Northern Ontario weather — and the first thing anyone sees. Dollar Contracting handles full exterior renewals: siding, soffit, fascia, gutters, decks, porches, fencing, and exterior trim.",
      "Every assembly is detailed for our climate: continuous insulation behind siding, properly flashed window openings, ice-and-water shield at vulnerable edges, and ventilation that prevents ice damming. We don't just install — we detail.",
      "Whether you're replacing failing siding before winter or planning a full facelift to refresh curb appeal, we'll write a scope that addresses what you can see and the things you can't (but matter just as much).",
    ],
    gallery: [
      "/2026/04/All-Carpentry-Work.jpg",
      "/2026/04/All-Concrete-Work.jpg",
    ],
    features: [
      "Vinyl, fibre cement, and engineered wood siding",
      "Soffit, fascia, and eavestrough",
      "Decks, porches, and railings",
      "Fencing and gates",
      "Exterior trim, paint, and stain",
      "Door and window install",
    ],
    scope: [
      "Tear-off, inspection, and rot repair",
      "House wrap, flashing, and weather details",
      "Install siding, trim, and accessories",
      "Caulk, paint, and clean-up",
    ],
    materials: [
      "James Hardie fibre cement and premium vinyl siding",
      "Cedar and composite decking",
      "Aluminum eavestrough and trim",
      "Self-adhered membranes and house wrap",
    ],
    seoTitle: "Exterior Renovations Thunder Bay | Siding, Soffit & Decks",
    metaDescription:
      "Exterior renovations in Thunder Bay — siding, soffit, fascia, eavestrough, decks, and fencing detailed for Northern Ontario weather. Free estimates, call 807-709-7997.",
    keywords: [
      "exterior renovation Thunder Bay",
      "siding contractor Thunder Bay",
      "deck builder Thunder Bay",
      "soffit fascia Thunder Bay",
    ],
    faqs: [
      {
        q: "What siding do you install?",
        a: "Vinyl, engineered wood, and James Hardie fibre cement, installed over proper house wrap and flashing with continuous insulation detailing for our climate.",
      },
      {
        q: "Do you build decks and fences too?",
        a: "Yes — cedar and composite decks, porches, railings, fencing, and gates, all built on frost-rated footings so they don't heave over the winter.",
      },
    ],
  },
  {
    slug: "kitchen-renovation",
    title: "Kitchen Renovation",
    shortTitle: "Kitchen Renovation",
    tagline: "Full kitchen remodels designed around how you actually cook.",
    description:
      "Custom kitchen design and build — cabinets, counters, layout changes, plumbing, electrical, and finishes coordinated by one crew.",
    image:
      "/2026/04/Kitchen-Renovation.jpg",
    longDescription: [
      "The kitchen is the heart of every home — the place where meals are prepared, conversations happen, and families connect. Dollar Contracting designs kitchens around how you actually cook and gather, not just what looks good in a brochure.",
      "Our process starts with understanding your cooking habits, storage needs, entertaining style, and aesthetic preferences. From there we optimize the classic work triangle and bring in modern concepts: prep zones, baking stations, beverage centres, and dedicated landing space around the range.",
      "Design styles run the full range — contemporary handleless cabinets and waterfall countertops, traditional shaker doors with natural stone, or something in between. Electrical upgrades for modern appliances, plumbing reconfiguration, ducted range hoods, and layered lighting are all handled by our crew, not subbed out.",
    ],
    gallery: [
      "/2026/04/beautiful-kitchen-interior-design-1-1024x778.jpg",
      "/2026/04/beautiful-shot-modern-house-kitchen-1024x683.jpg",
    ],
    features: [
      "Custom cabinet design and install",
      "Quartz, granite, and natural stone counters",
      "Layout changes and structural walls removed",
      "Plumbing relocation for sinks and dishwashers",
      "Electrical upgrades for modern appliances",
      "Range hoods, lighting, and ventilation",
    ],
    scope: [
      "Discovery, measure, and concept",
      "Final design, materials, and pricing",
      "Demo, rough-in, and inspections",
      "Cabinet, counter, and finish install",
    ],
    materials: [
      "Custom and semi-custom cabinetry",
      "Quartz, granite, marble, and butcher block",
      "Tile and stone backsplash",
      "Hardwood, engineered, and luxury vinyl flooring",
    ],
    seoTitle: "Kitchen Renovation Thunder Bay | Custom Kitchen Remodels",
    metaDescription:
      "Kitchen renovation in Thunder Bay — custom cabinets, quartz and granite counters, layout changes, and full remodels coordinated by one crew. Free design consult, call 807-709-7997.",
    keywords: [
      "kitchen renovation Thunder Bay",
      "kitchen remodel Thunder Bay",
      "custom kitchen cabinets Thunder Bay",
      "kitchen contractor Thunder Bay",
    ],
    faqs: [
      {
        q: "How long does a kitchen renovation take in Thunder Bay?",
        a: "A typical full kitchen renovation runs about 4–8 weeks on site once materials are in, depending on cabinet lead times, layout changes, and whether plumbing or walls move. We give you a written schedule before demo starts.",
      },
      {
        q: "Can you move plumbing and take out walls?",
        a: "Yes — we relocate sinks and dishwashers, remove or open up walls (structural work engineered as needed), upgrade electrical for modern appliances, and vent range hoods, all with our own crew.",
      },
      {
        q: "Do you supply the cabinets and countertops?",
        a: "We handle custom and semi-custom cabinetry and quartz, granite, marble, or butcher-block counters — supplied, templated, and installed as part of one contract.",
      },
    ],
  },
  {
    slug: "bathroom-renovation",
    title: "Bathroom Renovation",
    shortTitle: "Bathroom Renovation",
    tagline: "Luxury bathroom design and construction for your personal retreat.",
    description:
      "Full bathroom remodels — tile work, walk-in showers, vanities, and fixtures. Done with proper waterproofing so it lasts.",
    image:
      "/2026/04/Bathroom-Renovation.jpg",
    longDescription: [
      "Your bathroom should feel like a retreat — but it also has to handle daily wear, moisture, and Northern Ontario's freeze-thaw cycles for decades. Dollar Contracting designs bathrooms with both in mind.",
      "Our remodels run the full spectrum: same-footprint refreshes with new fixtures and tile, mid-range overhauls with walk-in showers and double vanities, and luxury redesigns with steam showers, soaking tubs, heated floors, and custom millwork.",
      "Waterproofing is where most bathroom remodels go wrong. We use proper schluter membranes or equivalent systems behind every tiled surface, slope shower pans correctly, and detail the curb-to-floor transition so water stays where it belongs.",
    ],
    gallery: [
      "/2026/04/small-bathroom-with-modern-style-ai-generated-1024x847.jpg",
      "/2026/04/3d-rendering-modern-bathroom-with-luxury-tile-decor-1024x853.jpg",
    ],
    features: [
      "Walk-in and curbless tiled showers",
      "Soaking and freestanding tubs",
      "Custom vanities, mirrors, and lighting",
      "Heated tile floors",
      "Layout changes and plumbing relocation",
      "Proper waterproofing systems",
    ],
    scope: [
      "Measure, design, and material selection",
      "Demo, plumb, and waterproof",
      "Tile, fixtures, vanity, and accessories",
      "Final caulk, seal, and walk-through",
    ],
    materials: [
      "Schluter and equivalent waterproofing systems",
      "Porcelain, ceramic, and natural stone tile",
      "Quartz and stone vanity tops",
      "Premium fixtures from trusted brands",
    ],
    seoTitle: "Bathroom Renovation Thunder Bay | Tiled Showers & Remodels",
    metaDescription:
      "Bathroom renovation in Thunder Bay — walk-in tiled showers, soaking tubs, vanities, and heated floors with proper waterproofing that lasts. Free quotes, call 807-709-7997.",
    keywords: [
      "bathroom renovation Thunder Bay",
      "bathroom remodel Thunder Bay",
      "walk-in shower Thunder Bay",
      "tile shower installation Thunder Bay",
    ],
    faqs: [
      {
        q: "Do you build custom tiled and walk-in showers?",
        a: "Yes — walk-in and curbless tiled showers are a specialty. We waterproof with Schluter or equivalent membrane systems behind every tiled surface and slope pans correctly so water stays where it belongs.",
      },
      {
        q: "Can you add a heated tile floor?",
        a: "We install in-floor heating under tile as part of most mid-range and luxury bathroom remodels — a small upgrade that makes a big difference through a Northern Ontario winter.",
      },
      {
        q: "Why does waterproofing matter so much?",
        a: "It's where most bathroom remodels fail. Proper membranes, correctly sloped pans, and detailed curb-to-floor transitions are what keep water out of your framing and prevent mold years down the line.",
      },
    ],
  },
  {
    slug: "painting",
    title: "Painting Work",
    shortTitle: "Painting",
    tagline: "Precision finishes that protect and beautify every surface.",
    description:
      "Interior and exterior painting — proper prep, premium paint, and protected surfaces. The work nobody notices when it's done right.",
    image:
      "/2026/04/Painting-work.jpg",
    longDescription: [
      "Paint is the only thing on your wall that you actually touch every day — so getting it right matters more than people think. Dollar Contracting handles the full process: surface prep, premium materials, and clean lines that hold up.",
      "Interior work covers full repaints, accent walls, ceilings, trim, and cabinet refinishing. Exterior work covers siding, decks, trim, and stain refresh — properly prepped so the paint actually bonds and lasts.",
      "Drywall patching, hole repair, and surface smoothing are part of standard prep. We use low-VOC paints by default and premium brands like Benjamin Moore and Sherwin-Williams for the long-life finish you'd expect.",
    ],
    gallery: [],
    features: [
      "Interior repaint and accent walls",
      "Exterior paint and stain",
      "Drywall patching and surface prep",
      "Cabinet refinishing",
      "Stain, varnish, and lacquer finishes",
      "Low-VOC and premium product lines",
    ],
    scope: [
      "Mask, cover, and protect",
      "Sand, patch, and prime",
      "Two-coat finish with back-roll",
      "Clean-up and walk-through",
    ],
    materials: [
      "Benjamin Moore, Sherwin-Williams, and Behr Premium",
      "Low-VOC interior paint",
      "Exterior-grade alkyd and acrylic systems",
      "Penetrating wood stains and sealers",
    ],
    seoTitle: "Painting Contractor Thunder Bay | Interior & Exterior",
    metaDescription:
      "Painting contractor in Thunder Bay — interior and exterior painting with proper prep, premium paint, and clean lines. Drywall repair and cabinet refinishing too. Call 807-709-7997.",
    keywords: [
      "painting contractor Thunder Bay",
      "interior painting Thunder Bay",
      "exterior painting Thunder Bay",
      "house painters Thunder Bay",
    ],
    faqs: [
      {
        q: "Do you do interior and exterior painting?",
        a: "Both — interior repaints, accent walls, ceilings, trim, and cabinet refinishing, plus exterior siding, decks, and trim, properly prepped so the paint bonds and lasts.",
      },
      {
        q: "Is drywall and surface prep included?",
        a: "Yes — patching, hole repair, sanding, and priming are part of standard prep. A good paint job is mostly prep; the finish coat just shows the work underneath.",
      },
    ],
  },
  {
    slug: "flooring",
    title: "Flooring Work",
    shortTitle: "Flooring",
    tagline: "Level subfloor. Tight seams. Clean edges.",
    description:
      "Hardwood, engineered, laminate, vinyl plank, tile, and carpet. Installed on a properly prepped subfloor so it sits flat and stays flat.",
    image:
      "/2026/04/Flooring-work.jpg",
    longDescription: [
      "A floor is only as good as the subfloor under it. Dollar Contracting takes the time to assess what's beneath before installing what's on top — leveling, patching, and replacing damaged subfloor where required.",
      "We work in every flooring material: site-finished and pre-finished hardwood, engineered, luxury vinyl plank, laminate, ceramic and porcelain tile, natural stone, and carpet. Each comes with its own substrate requirements and we follow them.",
      "Transitions, trim, and edge details matter as much as the field — that's where most installations show their age first. We mitre, undercut, and detail every transition properly so the floor reads as one continuous surface.",
    ],
    gallery: [
      "/2026/04/worker-leveling-fresh-floor-with-special-machine-1024x666.jpg",
    ],
    features: [
      "Hardwood and engineered installs",
      "Luxury vinyl plank and laminate",
      "Porcelain, ceramic, and stone tile",
      "Carpet and runners",
      "Subfloor levelling and patching",
      "Transitions, trim, and stair nosing",
    ],
    scope: [
      "Tear-out and substrate prep",
      "Subfloor level and moisture check",
      "Lay, fasten, or glue per spec",
      "Trim, transitions, and final clean",
    ],
    materials: [
      "Solid and engineered hardwood",
      "Luxury vinyl plank and tile",
      "Porcelain, ceramic, and natural stone",
      "Quality underlayments and moisture barriers",
    ],
    seoTitle: "Flooring Installation Thunder Bay | Hardwood, Vinyl & Tile",
    metaDescription:
      "Flooring installation in Thunder Bay — hardwood, engineered, luxury vinyl plank, laminate, tile, and carpet laid on a properly prepped, level subfloor. Free quotes, call 807-709-7997.",
    keywords: [
      "flooring installation Thunder Bay",
      "hardwood flooring Thunder Bay",
      "vinyl plank flooring Thunder Bay",
      "tile installation Thunder Bay",
    ],
    faqs: [
      {
        q: "What types of flooring do you install?",
        a: "Solid and engineered hardwood, luxury vinyl plank, laminate, ceramic and porcelain tile, natural stone, and carpet — each installed to its own substrate and moisture requirements.",
      },
      {
        q: "Do you prep and level the subfloor?",
        a: "Always. A floor is only as good as the subfloor under it, so we level, patch, and moisture-check before anything goes down — that's what keeps it flat and quiet for years.",
      },
    ],
  },
  {
    slug: "plumbing",
    title: "Plumbing Work",
    shortTitle: "Plumbing",
    tagline: "Reliable water in, water out.",
    description:
      "Rough-in and finish plumbing for renos and new builds — supply lines, drains, fixtures, and water heaters. No leaks, no surprises.",
    image:
      "/2026/04/Plumbing-work.jpg",
    longDescription: [
      "Plumbing is one of those trades where invisible mistakes show up months or years later — leaks behind drywall, slow drains, freezing pipes. Dollar Contracting does it right the first time so you don't see us again until you want to.",
      "We handle full rough-in and finish plumbing for renovations, additions, and new builds — supply lines, DWV (drain-waste-vent), gas lines, water heaters, and every fixture you can think of. All work is pressure-tested and inspected before walls close up.",
      "Service work includes leak repair, fixture replacement, water heater swaps, drain clearing, and emergency response. If it carries water, gas, or waste — we install it, fix it, or replace it.",
    ],
    gallery: [],
    features: [
      "Rough-in and finish plumbing",
      "Fixture install and replacement",
      "Water heater installs and swaps",
      "Drain, supply, and gas line work",
      "Pressure testing and inspection",
      "Emergency leak and burst-pipe repair",
    ],
    scope: [
      "Plan, lay out, and rough-in",
      "Pressure test and inspect",
      "Fixture install and trim",
      "Test and walk-through",
    ],
  },
  {
    slug: "electrical-work",
    title: "Electrical Work",
    shortTitle: "Electrical",
    tagline: "Safe power, properly grounded.",
    description:
      "Electrical work for renovations and additions — panel upgrades, new circuits, lighting, and outlets. Code-compliant and inspected.",
    image:
      "/2026/04/Electrical-Work.jpg",
    longDescription: [
      "Electrical isn't the place to cut corners. Dollar Contracting's electrical crew handles panel upgrades, new circuits, lighting layouts, outlets, switches, and full wiring for renovations and new construction — all to ESA code and inspected.",
      "Modern homes need more circuits and more capacity than they used to. We upgrade panels from 100A to 200A, add dedicated circuits for kitchens and laundry rooms, and pull new lines for EV chargers, hot tubs, and outbuildings.",
      "Lighting design is part of the scope where it matters — pot light layouts, under-cabinet lighting, dimmers, and three-way switching. We dry-fit fixtures and walk the layout before drilling anything irreversible.",
    ],
    gallery: [],
    features: [
      "Panel upgrades (100A to 200A)",
      "New circuits and outlets",
      "Pot lights, sconces, and fixtures",
      "Dimmers, smart switches, and three-way",
      "EV chargers and outbuilding power",
      "ESA code compliance and inspection",
    ],
    scope: [
      "Walk-through and circuit plan",
      "Rough-in and wire pull",
      "Device install, label, and test",
      "Inspection and sign-off",
    ],
  },
  {
    slug: "hvac",
    title: "HVAC — Heating, Ventilation & AC",
    shortTitle: "HVAC",
    tagline: "Even heat, clean air, lower bills.",
    description:
      "Furnaces, ductwork, heat pumps, A/C, and ventilation. Sized correctly so every room is comfortable — not just the one nearest the thermostat.",
    image:
      "/2026/04/HVAC-Heating-Ventilation-and-Air-Conditioning.jpg",
    longDescription: [
      "A furnace that's too big short-cycles and wastes fuel. One that's too small can't keep up on the coldest week of the year. Dollar Contracting starts every HVAC job with a proper load calculation so the system is sized for your specific house.",
      "We install and service high-efficiency natural gas and propane furnaces, central A/C, heat pumps (cold-climate rated for Northern Ontario), HRV and ERV ventilators, and full ductwork. Older homes get sealed and balanced ductwork — usually the highest-impact upgrade in the whole system.",
      "Routine service, filter changes, and maintenance contracts are available. A well-maintained system runs cleaner, lasts longer, and costs less to operate — and we'll set up the schedule that fits your home.",
    ],
    gallery: [],
    features: [
      "High-efficiency furnace install",
      "Central A/C and cold-climate heat pumps",
      "Full ductwork design and balancing",
      "HRV and ERV ventilation",
      "Thermostats and smart controls",
      "Annual service and maintenance",
    ],
    scope: [
      "Load calculation and equipment sizing",
      "Install and commission",
      "Test, balance, and document",
      "Walk-through and filter setup",
    ],
  },
  {
    slug: "concrete-driveways",
    title: "Concrete Driveways",
    shortTitle: "Concrete Driveways",
    tagline: "Flat, straight, and built to beat freeze-thaw.",
    description:
      "New concrete driveways, walkways, and patios in Thunder Bay — properly graded, reinforced, and sealed to survive Northern Ontario winters and road salt.",
    image: "/2026/04/All-Concrete-Work.jpg",
    longDescription: [
      "A concrete driveway is one of the highest-value upgrades you can make to a Thunder Bay property — but only if it's built to handle our freeze-thaw cycles. Dollar Contracting pours driveways that stay flat and crack-free for decades, starting with the part nobody sees: a compacted granular base graded for drainage.",
      "Every driveway gets an engineered base, proper thickness for vehicle loads, rebar or wire mesh reinforcement, and control joints cut at the right spacing so the slab cracks where we tell it to — not randomly across the surface. We finish with a broom, exposed-aggregate, or stamped texture to your preference.",
      "After the pour we cure the slab correctly and come back to seal it, protecting against the road salt and meltwater that destroy unsealed concrete. The result is a driveway that reads clean and even the day it's poured and still looks that way after a decade of Thunder Bay winters.",
    ],
    gallery: [
      "/2026/04/cement-mixer-construction-site-1024x683.jpg",
      "/2026/04/worker-leveling-fresh-floor-with-special-machine-1024x666.jpg",
    ],
    features: [
      "New driveway pours and full replacements",
      "Walkways, sidewalks, and patios",
      "Compacted granular base and proper grading",
      "Rebar / wire mesh reinforcement",
      "Broom, exposed-aggregate, and stamped finishes",
      "Curing, sealing, and freeze-thaw protection",
    ],
    scope: [
      "Excavate, grade, and compact the base",
      "Form, place rebar, and set control joints",
      "Pour, screed, float, and finish",
      "Cure, seal, and final clean-up",
    ],
    materials: [
      "High-performance ready-mix concrete",
      "Rebar and wire mesh reinforcement",
      "Compacted Granular A base",
      "Penetrating salt-resistant sealers",
    ],
    seoTitle: "Concrete Driveway Thunder Bay | Pouring & Replacement",
    metaDescription:
      "Concrete driveway installation and replacement in Thunder Bay — properly based, reinforced, and sealed against freeze-thaw and road salt. Free written quotes, call 807-709-7997.",
    keywords: [
      "concrete driveway Thunder Bay",
      "driveway replacement Thunder Bay",
      "concrete walkway Thunder Bay",
      "concrete patio Thunder Bay",
    ],
    faqs: [
      {
        q: "How much does a concrete driveway cost in Thunder Bay?",
        a: "Cost depends on square footage, slab thickness, reinforcement, base prep, and finish. We measure on site and give a firm written quote — a plain broom finish costs less than exposed-aggregate or stamped concrete.",
      },
      {
        q: "How thick should a concrete driveway be?",
        a: "Four inches over a compacted granular base is standard for cars; we go to five or six inches with heavier reinforcement where trucks, RVs, or trailers will park. Correct base prep matters as much as thickness.",
      },
      {
        q: "How long until I can use a new driveway?",
        a: "Walk on it after 24–48 hours, wait about a week before driving on it, and roughly 28 days for full strength. We seal after the initial cure so the surface resists salt and water going into winter.",
      },
      {
        q: "Can you replace a cracked or heaved driveway?",
        a: "Yes — we remove the old slab, correct the base and drainage that usually caused the failure, and pour a new reinforced driveway that won't repeat the same cracking.",
      },
    ],
  },
  {
    slug: "foundation-repair",
    title: "Foundation Repair",
    shortTitle: "Foundation Repair",
    tagline: "Stop the crack, stop the water, stabilize the structure.",
    description:
      "Foundation repair in Thunder Bay — crack injection, waterproofing, parging, structural reinforcement, and drainage fixes for poured, block, and stone foundations.",
    image: "/2026/04/All-Concrete-Work.jpg",
    longDescription: [
      "A foundation problem only gets more expensive the longer it waits. Dollar Contracting diagnoses and repairs the full range of foundation issues Thunder Bay homes develop — cracks, water infiltration, bowing walls, settlement, and frost heave — starting with finding out why it's happening, not just patching the symptom.",
      "For active leaks and cracks we use polyurethane and epoxy injection from the inside and, where needed, excavate and waterproof from the outside with membrane and proper weeping-tile drainage. Bowing or shifting walls get structural reinforcement — carbon-fibre straps, steel bracing, or rebuild depending on the severity.",
      "We work on poured concrete, concrete block, and older stone foundations, and we handle the grading, downspout, and drainage corrections that caused the water problem in the first place. Every repair comes with a clear written scope so you know exactly what's being fixed and why.",
    ],
    gallery: [
      "/2026/04/cement-mixer-construction-site-1024x683.jpg",
      "/2026/04/All-Concrete-Work.jpg",
    ],
    features: [
      "Crack injection (polyurethane & epoxy)",
      "Interior and exterior waterproofing",
      "Weeping tile and drainage repair",
      "Bowing and cracked wall reinforcement",
      "Parging and surface restoration",
      "Poured, block, and stone foundations",
    ],
    scope: [
      "Inspect, diagnose, and write the scope",
      "Excavate or access the repair area",
      "Seal, reinforce, or rebuild as needed",
      "Waterproof, backfill, and correct drainage",
    ],
    materials: [
      "Polyurethane and epoxy injection resins",
      "Exterior waterproofing membranes",
      "Carbon-fibre and steel reinforcement",
      "Weeping tile and drainage aggregate",
    ],
    seoTitle: "Foundation Repair Thunder Bay | Cracks & Waterproofing",
    metaDescription:
      "Foundation repair in Thunder Bay — crack injection, basement waterproofing, drainage fixes, and structural reinforcement for poured, block, and stone foundations. Call 807-709-7997.",
    keywords: [
      "foundation repair Thunder Bay",
      "basement waterproofing Thunder Bay",
      "foundation crack repair Thunder Bay",
      "wet basement Thunder Bay",
    ],
    faqs: [
      {
        q: "Why is my foundation leaking or cracking?",
        a: "Usually water and frost. Poor grading, blocked weeping tile, or downspouts dumping against the wall let water build up, then freeze-thaw pressure cracks the foundation. We fix the cause, not just the crack.",
      },
      {
        q: "Do you waterproof from the inside or outside?",
        a: "Both, depending on the problem. Interior crack injection handles many leaks quickly; persistent water or structural issues call for exterior excavation, membrane waterproofing, and drainage repair.",
      },
      {
        q: "Can you fix a bowing basement wall?",
        a: "Yes — depending on severity we reinforce with carbon-fibre straps or steel bracing, or excavate and rebuild. We assess the wall and recommend the right level of repair rather than over-selling.",
      },
    ],
  },
  {
    slug: "basement-renovation",
    title: "Basement Renovation",
    shortTitle: "Basement Renovation",
    tagline: "Turn the coldest square footage in the house into the best.",
    description:
      "Basement renovation and finishing in Thunder Bay — legal suites, family rooms, bathrooms, and proper insulation, vapour control, and egress done to code.",
    image: "/2026/04/All-Interior-Renovation.jpg",
    longDescription: [
      "A finished basement is the cheapest square footage you'll ever add — you already own the space, it just needs to be built out right. Dollar Contracting turns damp, unfinished Thunder Bay basements into warm, dry family rooms, home theatres, gyms, in-law suites, and legal rental apartments.",
      "Basements are unforgiving if the building science is wrong, so we start below the finishes: address any moisture or foundation issues, then build the assembly correctly — sub-slab or rigid insulation, a proper vapour and air barrier, and framing held off the concrete. That's what keeps a finished basement from growing mold behind the drywall.",
      "From there it's a full renovation — egress windows for bedrooms, bathroom rough-ins, pot lighting, flooring rated for below-grade, and sound insulation for suites. Whether it's a simple rec room or a full secondary suite with its own entrance, we handle permits, trades, and inspections in-house.",
    ],
    gallery: [
      "/2026/04/3d-rendering-modern-dining-room-living-room-with-luxury-decor-1024x550.jpg",
      "/2026/04/All-Interior-Renovation.jpg",
    ],
    features: [
      "Full basement finishing and rec rooms",
      "Legal secondary and in-law suites",
      "Egress windows and code compliance",
      "Moisture-proof insulation and vapour control",
      "Basement bathrooms and wet bars",
      "Below-grade flooring and sound insulation",
    ],
    scope: [
      "Assess moisture, then design and permit",
      "Frame, insulate, and vapour-barrier",
      "Rough-in electrical, plumbing, and HVAC",
      "Drywall, floor, finish, and inspect",
    ],
    materials: [
      "Rigid and batt insulation with vapour barrier",
      "Moisture-rated drywall and subfloor systems",
      "Below-grade luxury vinyl and tile flooring",
      "Egress window wells and covers",
    ],
    seoTitle: "Basement Renovation Thunder Bay | Finishing & Suites",
    metaDescription:
      "Basement renovation in Thunder Bay — finished rec rooms, legal in-law suites, egress windows, and moisture-proof insulation done to code. Free quotes, call 807-709-7997.",
    keywords: [
      "basement renovation Thunder Bay",
      "basement finishing Thunder Bay",
      "basement apartment Thunder Bay",
      "in-law suite Thunder Bay",
    ],
    faqs: [
      {
        q: "Can you build a legal basement apartment or in-law suite?",
        a: "Yes — we build secondary suites to code, including egress, fire separation, ceiling height, and separate entrances where required. We handle the permits and inspections so it's a legal, rentable unit.",
      },
      {
        q: "How do you keep a finished basement from getting damp or moldy?",
        a: "We deal with moisture before finishing — grading, drainage, and any foundation leaks — then build the wall assembly with correct insulation and a continuous vapour/air barrier so warm interior air never condenses on cold concrete.",
      },
      {
        q: "Do basement bedrooms need egress windows?",
        a: "Yes. A legal basement bedroom needs an egress window sized for escape. We cut the foundation, install the window well, and waterproof the opening as part of the renovation.",
      },
    ],
  },
  {
    slug: "chimney-repair",
    title: "Chimney Repair",
    shortTitle: "Chimney Repair",
    tagline: "Repointed, recrowned, and rebuilt to keep water out.",
    description:
      "Chimney repair in Thunder Bay — repointing, crown repair, rebuilds, flashing, and waterproofing for brick and stone chimneys damaged by freeze-thaw.",
    image: "/2026/04/All-Masonry-Work.jpg",
    longDescription: [
      "A chimney takes more weather abuse than any other part of your home — exposed on all sides, top to bottom, through every freeze-thaw cycle. Dollar Contracting's masons repair and rebuild brick and stone chimneys across Thunder Bay, stopping the water intrusion that quietly rots ceilings and framing below.",
      "Most chimney problems start at the mortar joints and the crown. We repoint deteriorated joints by grinding out failed mortar and repacking with a matched mix, rebuild or re-cast cracked concrete crowns, and re-flash the roof-to-chimney junction so meltwater sheds instead of seeping in.",
      "For chimneys past the point of patching, we take them down to a sound course and rebuild — matching the original brick or stone so the repair disappears. We also waterproof with breathable sealers that shed water without trapping moisture in the masonry.",
    ],
    gallery: [
      "/2026/04/bricklaying-construction-worker-building-brick-wall-1024x683.jpg",
      "/2026/04/two-workers-stacking-bricks-looking-camera-1024x681.jpg",
    ],
    features: [
      "Repointing and tuckpointing",
      "Concrete crown repair and re-casting",
      "Partial and full chimney rebuilds",
      "Roof-to-chimney flashing",
      "Breathable waterproofing",
      "Brick and stone matching",
    ],
    scope: [
      "Inspect and photograph the damage",
      "Grind out and repoint or rebuild",
      "Re-crown and re-flash as needed",
      "Waterproof and clean up",
    ],
    materials: [
      "Type N and S mortar, colour-matched",
      "Matched clay brick and natural stone",
      "Poured and pre-cast concrete crowns",
      "Breathable masonry water repellents",
    ],
    seoTitle: "Chimney Repair Thunder Bay | Repointing & Rebuilds",
    metaDescription:
      "Chimney repair in Thunder Bay — repointing, crown repair, rebuilds, flashing, and waterproofing for brick and stone chimneys. Stop the leak before it rots the framing. Call 807-709-7997.",
    keywords: [
      "chimney repair Thunder Bay",
      "chimney repointing Thunder Bay",
      "chimney rebuild Thunder Bay",
      "brick chimney repair Thunder Bay",
    ],
    faqs: [
      {
        q: "How do I know if my chimney needs repair?",
        a: "Crumbling mortar joints, white staining (efflorescence), spalling brick faces, a cracked crown, or water stains on the ceiling near the chimney are the common signs. We inspect and photograph so you can see exactly what's failing.",
      },
      {
        q: "What's the difference between repointing and rebuilding?",
        a: "Repointing grinds out and replaces failed mortar while keeping the existing brick — right for surface deterioration. A rebuild takes the chimney down to a sound course and re-lays it, needed when the brick itself has failed.",
      },
      {
        q: "Can you stop my chimney from leaking?",
        a: "Yes — most chimney leaks come from a cracked crown or failed flashing. We repair the crown, re-flash the roof junction, and apply breathable waterproofing so water sheds instead of soaking into the masonry.",
      },
    ],
  },
  {
    slug: "deck-building",
    title: "Deck Building",
    shortTitle: "Deck Building",
    tagline: "Frost-footed decks that don't heave or sag.",
    description:
      "Custom deck builder in Thunder Bay — cedar, pressure-treated, and composite decks, porches, and railings built on frost-rated footings to code.",
    image: "/2026/04/All-Exterior-Work.jpg",
    longDescription: [
      "A deck is only as good as what's under it. Plenty of Thunder Bay decks heave, twist, and pull away from the house within a few winters because the footings never went below the frost line. Dollar Contracting builds decks the right way — on properly sized footings poured below frost depth — so your deck sits level for its whole life.",
      "We design and build cedar, pressure-treated, and low-maintenance composite decks, from simple ground-level platforms to multi-level structures with built-in benches, planters, privacy screens, and pergolas. Ledger connections are flashed and lagged correctly so water never gets behind the board and into your rim joist.",
      "Railings, stairs, and lighting are detailed to code and to look right — hidden fasteners on composite surfaces, solid guardrails, and clean picture-frame borders. We pull the permit, pass the inspection, and hand you a deck that's ready for the first barbecue of the summer.",
    ],
    gallery: [
      "/2026/04/All-Carpentry-Work.jpg",
      "/2026/04/All-Exterior-Work.jpg",
    ],
    features: [
      "Cedar, pressure-treated, and composite decks",
      "Frost-rated footings and proper ledger flashing",
      "Multi-level decks and platforms",
      "Railings, stairs, and gates to code",
      "Built-in benches, planters, and pergolas",
      "Deck lighting and privacy screens",
    ],
    scope: [
      "Design, permit, and locate footings",
      "Pour frost-depth footings and set posts",
      "Frame, flash, and lay decking",
      "Railings, stairs, and final inspection",
    ],
    materials: [
      "Western red cedar and pressure-treated lumber",
      "Composite decking (Trex and equivalent)",
      "Galvanized and hidden fastening systems",
      "Concrete tube footings below frost line",
    ],
    seoTitle: "Deck Builder Thunder Bay | Cedar & Composite Decks",
    metaDescription:
      "Deck builder in Thunder Bay — custom cedar, pressure-treated, and composite decks on frost-rated footings that won't heave. Permits and inspection handled. Call 807-709-7997.",
    keywords: [
      "deck builder Thunder Bay",
      "deck construction Thunder Bay",
      "composite deck Thunder Bay",
      "deck contractor Thunder Bay",
    ],
    faqs: [
      {
        q: "How deep do deck footings need to be in Thunder Bay?",
        a: "Below the local frost line — generally around 4 feet — so the footing sits under the ground that freezes and heaves each winter. Shallow footings are the number-one reason older decks tilt and pull away from the house.",
      },
      {
        q: "Cedar, pressure-treated, or composite — which should I choose?",
        a: "Pressure-treated is the budget-friendly workhorse, cedar gives a warm natural look, and composite costs more upfront but needs almost no maintenance. We'll walk you through the trade-offs for your budget and how much upkeep you want.",
      },
      {
        q: "Do I need a permit for a deck?",
        a: "Most decks above a certain height or attached to the house do. We handle the permit drawings and inspection so the deck is legal and won't be a problem when you sell.",
      },
    ],
  },
  {
    slug: "siding",
    title: "Siding",
    shortTitle: "Siding",
    tagline: "A tight, insulated envelope that looks sharp and sheds weather.",
    description:
      "Siding contractor in Thunder Bay — vinyl, engineered wood, and James Hardie fibre cement siding installed with proper flashing, house wrap, and insulation.",
    image: "/2026/04/All-Exterior-Work.jpg",
    longDescription: [
      "Siding is your home's raincoat and its first impression at the same time. Dollar Contracting installs and replaces siding across Thunder Bay — vinyl, engineered wood, and James Hardie fibre cement — with the flashing and moisture detailing that actually keeps water out of your walls.",
      "The material everyone sees is only half the job. Behind it we install a proper weather-resistive barrier, flash every window and door opening, and add continuous exterior insulation where it makes sense — the detail that stops drafts, cuts heating bills, and prevents the hidden rot that destroys walls from the outside in.",
      "We also handle soffit, fascia, and eavestrough as part of a full exterior package so the whole envelope goes on as one coordinated system. Whether you're replacing failing siding before winter or refreshing curb appeal for a sale, you get crews who detail the parts you can't see as carefully as the parts you can.",
    ],
    gallery: [
      "/2026/04/All-Carpentry-Work.jpg",
      "/2026/04/All-Exterior-Work.jpg",
    ],
    features: [
      "Vinyl, engineered wood, and fibre cement siding",
      "Full tear-off and re-side",
      "House wrap and window/door flashing",
      "Continuous exterior insulation",
      "Soffit, fascia, and eavestrough",
      "Rot repair and sheathing replacement",
    ],
    scope: [
      "Tear off, inspect, and repair rot",
      "House wrap, flash, and insulate",
      "Install siding, trim, and accessories",
      "Caulk, detail, and clean-up",
    ],
    materials: [
      "James Hardie fibre cement siding",
      "Premium vinyl and engineered wood siding",
      "Self-adhered flashing and house wrap",
      "Rigid continuous exterior insulation",
    ],
    seoTitle: "Siding Contractor Thunder Bay | Vinyl & Fibre Cement",
    metaDescription:
      "Siding contractor in Thunder Bay — vinyl, engineered wood, and James Hardie fibre cement siding installed with proper flashing and insulation. Soffit and fascia too. Call 807-709-7997.",
    keywords: [
      "siding contractor Thunder Bay",
      "siding installation Thunder Bay",
      "vinyl siding Thunder Bay",
      "James Hardie siding Thunder Bay",
    ],
    faqs: [
      {
        q: "What siding holds up best in Thunder Bay's climate?",
        a: "Fibre cement (James Hardie) is the most durable against our freeze-thaw and sun, engineered wood gives a warm look, and quality vinyl is the most budget-friendly. All perform well when flashed and installed correctly.",
      },
      {
        q: "Can you add insulation while re-siding?",
        a: "Yes, and it's the best time to. Adding continuous rigid insulation behind new siding cuts drafts and heating bills and stops thermal bridging — a big efficiency gain you can only get easily during a re-side.",
      },
      {
        q: "Do you replace soffit, fascia, and eavestrough too?",
        a: "We do — installing the whole exterior envelope as one system means the flashing laps and water paths all line up, which is what keeps water out over the long run.",
      },
    ],
  },
  {
    slug: "commercial-construction",
    title: "Commercial Construction",
    shortTitle: "Commercial Construction",
    tagline: "Build-outs and renovations that open on schedule.",
    description:
      "Commercial contractor in Thunder Bay — retail and office build-outs, tenant improvements, commercial renovations, and concrete work delivered on schedule and to code.",
    image: "/2026/04/All-Concrete-Work.jpg",
    longDescription: [
      "For a business, a construction delay is lost revenue. Dollar Contracting handles commercial construction and renovation across Thunder Bay and Northwestern Ontario — retail and restaurant build-outs, office renovations, tenant improvements, and the structural, concrete, and envelope work behind them — with the scheduling discipline commercial projects demand.",
      "We coordinate the full trade stack under one project manager: demolition, concrete, framing, mechanical and electrical rough-in, drywall, and finishes, sequenced so your fit-out hits its opening date. We work around occupied businesses, phase work to keep you operating where possible, and keep the site clean and safe throughout.",
      "Every commercial job is built to the Ontario Building Code with the permits, inspections, WSIB coverage, and liability insurance a commercial client needs on file. From a single storefront refresh to a full interior fit-out, you get one accountable contractor and one written schedule.",
    ],
    gallery: [
      "/2026/04/cement-mixer-construction-site-1024x683.jpg",
      "/2026/04/All-Concrete-Work.jpg",
    ],
    features: [
      "Retail, restaurant, and office build-outs",
      "Tenant improvements and fit-outs",
      "Commercial renovations and refreshes",
      "Commercial concrete and structural work",
      "Phased work around occupied businesses",
      "Permits, inspections, and code compliance",
    ],
    scope: [
      "Scope, budget, and construction schedule",
      "Permits, demo, and structural work",
      "Mechanical, electrical, and drywall",
      "Finishes, inspection, and turnover",
    ],
    materials: [
      "Commercial-grade concrete and steel",
      "Fire-rated assemblies and drywall",
      "Commercial-grade flooring and finishes",
      "Code-compliant mechanical and electrical",
    ],
    seoTitle: "Commercial Contractor Thunder Bay | Build-Outs & Renos",
    metaDescription:
      "Commercial contractor in Thunder Bay — retail and office build-outs, tenant improvements, and commercial renovations delivered on schedule and to code. Call 807-709-7997.",
    keywords: [
      "commercial contractor Thunder Bay",
      "commercial construction Thunder Bay",
      "commercial renovation Thunder Bay",
      "tenant improvement Thunder Bay",
    ],
    faqs: [
      {
        q: "Do you do commercial tenant fit-outs and build-outs?",
        a: "Yes — retail, restaurant, and office build-outs and tenant improvements are core commercial work. We coordinate every trade under one project manager and one schedule so you open on time.",
      },
      {
        q: "Can you work around our operating business?",
        a: "We phase and schedule work — including after-hours and weekends where needed — to keep you operating, and we keep the site clean, dust-controlled, and safe for staff and customers.",
      },
      {
        q: "Are you insured and code-compliant for commercial work?",
        a: "We carry full liability insurance and WSIB coverage and build to the Ontario Building Code, with permits and inspections handled and documented for your records.",
      },
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
