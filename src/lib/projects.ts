export type Project = {
  slug: string;
  title: string;
  category: string;
  location?: string;
  description?: string;
  images: string[];
};

export const projects: Project[] = [
  {
    slug: "full-house-renovation",
    title: "Full House Renovation",
    category: "Renovation",
    location: "Squaw Bay Road, Thunder Bay",
    description:
      "Top-to-bottom interior overhaul — floors, finishes, kitchen, and bath all brought back to life in one job.",
    images: [
      "/2026/04/1-2-576x1024.png",
      "/2026/04/2-3-576x1024.png",
      "/2026/04/3-3-576x1024.png",
      "/2026/04/4-3-576x1024.png",
      "/2026/04/5-1-576x1024.png",
      "/2026/04/6-1-576x1024.png",
      "/2026/04/7-1-576x1024.png",
      "/2026/04/8-576x1024.png",
      "/2026/04/9-576x1024.png",
      "/2026/04/10-576x1024.png",
      "/2026/04/11-576x1024.png",
      "/2026/04/12-576x1024.png",
    ],
  },
  {
    slug: "bathroom-renovation",
    title: "Bathroom Renovation",
    category: "Renovation",
    location: "Thunder Bay",
    description:
      "Custom bath build — precise tile work, plumbing, and finishes that turn the smallest room into the best one.",
    images: [
      "/2026/04/1-4-576x1024.png",
      "/2026/04/2-5-576x1024.png",
    ],
  },
  {
    slug: "roofing",
    title: "Roofing",
    category: "Exterior",
    location: "Thunder Bay",
    description:
      "Full re-roof with clean lines, proper underlay, and weather-tight finishes built for Northern Ontario winters.",
    images: [
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.21-768x1024.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.22-768x1024.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.22-1-1024x768.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.22-2-768x1024.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.22-3-768x1024.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.23-768x1024.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.23-1-1024x768.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.23-2-768x1024.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.24-768x1024.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.24-1-768x1024.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.24-2-768x1024.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.25-768x1024.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.25-1-1024x768.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.25-2-768x1024.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.26-1024x768.jpeg",
      "/2026/04/WhatsApp-Image-2026-03-24-at-15.41.26-1-1024x768.jpeg",
    ],
  },
  {
    slug: "signboard-installed",
    title: "Signboard Installation",
    category: "Exterior",
    location: "Thunder Bay",
    description:
      "Fabrication and clean install of a custom storefront signboard — measured, mounted, and finished on schedule.",
    images: [
      "/2026/04/signboard-1024x1024.png",
      "/2026/04/1-1-1024x1024.png",
      "/2026/04/2-1-1024x1024.png",
      "/2026/04/2-2-1024x1024.png",
      "/2026/04/3-1-1024x1024.png",
      "/2026/04/3-2-1024x1024.png",
      "/2026/04/4-1-1024x1024.png",
      "/2026/04/4-2-1024x1024.png",
      "/2026/04/1-768x1024.jpeg",
      "/2026/04/2-768x1024.jpeg",
      "/2026/04/3-768x1024.jpeg",
      "/2026/04/vlcsnap-2026-03-24-15h22m48s554-576x1024.png",
    ],
  },
];
