import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "People, Fellows & Research Directorate",
  description:
    "Meet the team of hydrologists, data engineers, infrastructure architects, and circularity fellows at the Sustainability Lab in Maharajgunj, Kathmandu.",
  path: "/lab/people",
  keywords: [
    "Sustainability Lab Team",
    "Research Fellows Nepal",
    "Hydrologists Nepal",
    "Climate Modeler Directorate",
  ],
});

interface TeamMember {
  name: string;
  role: string;
  philosophy: string;
  domains: string[];
  station: string;
}

const team: TeamMember[] = [
  {
    name: "Ashutosh Gautam",
    role: "Technology, Systems & AI Lead",
    philosophy: "Technology is only useful when it makes difficult, compound problems legible to the people living with them.",
    domains: ["Domain AI", "Spatial Data Pipelines", "Enterprise Incubation"],
    station: "Maharajgunj Station",
  },
  {
    name: "Dr. Sunita Shrestha",
    role: "Lead Hydrologist & Climate Modeler",
    philosophy: "Rivers in the Himalaya do not respect linear statistical averages; we must model dynamic sediment and glacial pulses.",
    domains: ["Glacial Lake Outbursts", "Run-of-River Baselines", "Catchment Telemetry"],
    station: "Kathmandu / Field Stations",
  },
  {
    name: "Bikash Rana",
    role: "Infrastructure Resilience Engineer",
    philosophy: "Building with nature is not an aesthetic choice; it is the only way concrete survives mountain freeze-thaw cycles.",
    domains: ["Bio-Engineering", "Slope Stabilization", "Seismic Ductility"],
    station: "Mid-Hills Field Office",
  },
  {
    name: "Karma Wangdi",
    role: "KĀRVA Master Craftsman & Materials Researcher",
    philosophy: "Old wood has memory; if you listen to its grain, it tells you what it wants to become next.",
    domains: ["Vernacular Joinery", "Reclaimed Sal Timber", "Circular Prototyping"],
    station: "KĀRVA Studio Maharajgunj",
  },
  {
    name: "Pooja Gurung",
    role: "Community & Safeguards Director",
    philosophy: "Free, prior, and informed consent is not a legal checklist—it is an enduring social covenant.",
    domains: ["FPIC Protocols", "Indigenous Stewardship", "Social Impact"],
    station: "Maharajgunj Station",
  },
  {
    name: "Aarav Adhikari",
    role: "Climate Finance Specialist",
    philosophy: "Green capital flows when risks are quantified transparently rather than obscured behind marketing jargon.",
    domains: ["Blended Debt", "Carbon Accounting", "Enterprise Diagnostics"],
    station: "Kathmandu Station",
  },
];

export default function PeoplePage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "The Lab", url: "/lab" },
          { name: "People & Fellows", url: "/lab/people" },
        ]}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
          <Link href="/lab" className="hover:text-data transition-colors">
            THE LAB
          </Link>
          <span>/</span>
          <span className="text-foreground">PEOPLE</span>
        </div>

        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-data/10 text-data border border-data/30 rounded-full mb-6">
            LAB DIRECTORY
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
            PEOPLE WHO BUILD <br />
            <span className="text-data">AT THE EDGES.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            We don&apos;t do corporate headshots. Our team is an interdisciplinary cohort of field hydrologists, systems engineers, craftspeople, and economists working side by side.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {team.map((member) => (
            <div
              key={member.name}
              className="p-8 rounded-2xl bg-card border border-border/80 hover:border-data/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4 text-xs font-mono text-muted-foreground">
                  <span>{member.station}</span>
                  <span className="w-2 h-2 rounded-full bg-data/60" />
                </div>

                <h3 className="font-display font-bold text-2xl text-foreground mb-1">
                  {member.name}
                </h3>
                <div className="text-xs font-mono text-data mb-6">
                  {member.role}
                </div>

                <blockquote className="text-xs text-muted-foreground italic font-serif leading-relaxed pl-3 border-l-2 border-data/40 mb-8">
                  &ldquo;{member.philosophy}&rdquo;
                </blockquote>
              </div>

              <div className="pt-4 border-t border-border/40">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                  Areas of Work
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {member.domains.map((dom) => (
                    <span
                      key={dom}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-foreground/80"
                    >
                      {dom}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visiting Fellowships Callout */}
        <div className="p-8 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl font-bold mb-1">
              Interested in a Visiting Research Fellowship?
            </h3>
            <p className="text-xs text-muted-foreground">
              We host 6-month residencies for climate data scientists, ecological engineers, and circular material designers.
            </p>
          </div>
          <Link
            href="/collaborate/contact"
            className="px-6 py-3 rounded bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider hover:bg-data hover:text-black transition-colors shrink-0"
          >
            Apply for Fellowship →
          </Link>
        </div>
      </div>
    </main>
  );
}
