import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TeamMember = {
  name?: string;
  role: string;
  photo: string;
  alt: string;
  bio: string;
};

const team: TeamMember[] = [
  {
    name: "Harpreet",
    role: "Sales Head Manager",
    photo: "/team/harpreet.jpeg",
    alt: "Harpreet, Sales Head Manager at Dollar Contracting Ltd.",
    bio: "As Sales Head Manager at Dollar Contracting Ltd., Harpreet is your trusted first point of contact — guiding clients through consultations, project planning, budgeting, and on-site meetings with professionalism and transparency. He works closely with homeowners and businesses to understand their vision, provide practical solutions, and ensure every detail is planned before construction begins. From the first conversation to project kickoff, Harpreet is committed to delivering a smooth, honest, and client-focused renovation experience across Northern Ontario.",
  },
  {
    name: "Sarleen Kaur",
    role: "Office & Administration Manager",
    photo: "/team/office-manager.jpeg",
    alt: "Sarleen Kaur, Office & Administration Manager at Dollar Contracting Ltd.",
    bio: "Sarleen is the organizational backbone of Dollar Contracting Ltd., managing daily office operations, staff coordination, scheduling, client communication, back-end emails, company documentation, and administrative paperwork. From handling internal workflow to ensuring projects stay organized behind the scenes, she helps keep our team efficient, professional, and client-focused every day.",
  },
  {
    name: "Arshdeep",
    role: "Finishing & Renovation Specialist",
    photo: "/team/Arshdeep.jpeg",
    alt: "Arshdeep, Finishing & Renovation Specialist at Dollar Contracting Ltd.",
    bio: "Arshdeep handles interior and exterior finishing work, including painting, tile installation, drywall finishing, and detailed renovations. He also supervises crews on-site, monitors work quality, and ensures all employees complete tasks efficiently and professionally to maintain high project standards.",
  },
  {
    name: "Lovepreet",
    role: "HVAC Technician (Duct Work)",
    photo: "/team/Lovepreet.jpeg",
    alt: "Lovepreet, HVAC Technician specializing in duct work at Dollar Contracting Ltd.",
    bio: "Lovepreet leads our HVAC and duct work, handling duct layout, fabrication, installation, and replacement on both residential and commercial projects. From running new duct lines in additions, basements, and new builds to sealing, insulating, and balancing existing systems, he makes sure every room gets proper airflow and steady heating and cooling through Northern Ontario winters. He also works alongside our framing and finishing crews so all mechanical work is roughed in cleanly, on schedule, and ready for inspection.",
  },
  {
    name: "Amteshwar",
    role: "Marketing Coordinator",
    photo: "/team/Amteshwar.jpeg",
    alt: "Amteshwar, Marketing Coordinator at Dollar Contracting Ltd.",
    bio: "Amteshwar manages marketing initiatives, coordinates promotional campaigns, and supports the company's branding and client engagement efforts. He works closely with the team to enhance brand visibility, strengthen customer relationships, and contribute to the growth of Dollar Contracting Ltd.",
  },
];

export function TeamSection() {
  return (
    <section id="team" className="relative overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, oklch(0.94 0.04 27 / 0.5) 0%, transparent 65%)",
        }}
      />

      <div className="container-page relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--brand)]">
            Meet The Team
          </span>
          <h2 className="heading-display mt-2 text-3xl sm:text-4xl lg:text-5xl">
            The people behind every build
          </h2>
          <p className="mt-3 text-muted-foreground">
            From the first conversation to the final walkthrough, you&apos;ll work
            with the same people every step of the way.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl space-y-8 sm:space-y-10">
          {team.map((member, idx) => (
            <div
              key={member.role}
              className="flex flex-col items-center gap-6 sm:flex-row sm:items-stretch sm:gap-8 md:gap-10"
            >
              <div className="relative h-40 w-40 shrink-0 self-center overflow-hidden rounded-full bg-muted shadow-xl ring-4 ring-white sm:h-48 sm:w-48 md:h-56 md:w-56">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/5"
                />
                <Image
                  src={member.photo}
                  alt={member.alt}
                  fill
                  sizes="(min-width: 768px) 224px, (min-width: 640px) 192px, 160px"
                  className="rounded-full object-cover"
                  priority={idx === 0}
                />
              </div>

              <Card className="flex-1 border-border/70 bg-card p-0 shadow-sm transition hover:border-[var(--brand)]/40 hover:shadow-lg">
                <CardContent className="space-y-3 p-6 sm:p-7">
                  <Badge className="border-0 bg-[var(--brand)] text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm">
                    {member.role}
                  </Badge>
                  {member.name && (
                    <h3 className="heading-display text-2xl sm:text-3xl">
                      {member.name}
                    </h3>
                  )}
                  <p className="text-sm leading-relaxed text-foreground/85">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
