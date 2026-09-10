import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Intelligence Suite — System Architecture",
  description:
    "Planetary intelligence, environmental assessment, dynamic climate hazard modeling, and AI advisory systems for real-world infrastructure decisions.",
  path: "/intelligence",
  keywords: [
    "Environmental Intelligence",
    "Climate Intelligence",
    "AI Advisory Engine",
    "Knowledge Hub",
    "Planetary Data",
  ],
});

const pillars = [
  {
    number: "01",
    title: "Environmental Intelligence",
    href: "/intelligence/environmental",
    desc: "Understand ecological impact, natural resources, and regulatory safeguards before deploying infrastructure.",
    tags: ["EIA / IEE", "Spatial GIS", "Biodiversity", "Safeguards"],
    accent: "border-bamboo/30 hover:border-bamboo",
  },
  {
    number: "02",
    title: "Climate Intelligence",
    href: "/intelligence/climate",
    desc: "Dynamic hazard projection, exposure analysis, and the interactive Climate Risk Scanner.",
    tags: ["Hazard Scanner", "2030 / 2050 Horizons", "Vulnerability", "Adaptation"],
    accent: "border-cyan-500/30 hover:border-cyan-500",
  },
  {
    number: "03",
    title: "AI Advisory Engine",
    href: "/intelligence/ai",
    desc: "Domain-specific intelligence assistant pairing environmental data with contextual business modeling.",
    tags: ["3-Column Interface", "Decision Trees", "Action Roadmaps", "Data Synthesis"],
    accent: "border-[#00D4AA]/40 hover:border-[#00D4AA]",
  },
  {
    number: "04",
    title: "Knowledge Hub",
    href: "/intelligence/knowledge",
    desc: "Curated research papers, field notes, open datasets, and actionable policy playbooks.",
    tags: ["Field Research", "Policy Briefs", "Open Data", "Case Studies"],
    accent: "border-amber-500/30 hover:border-amber-500",
  },
];

export default function IntelligencePage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Intelligence", url: "/intelligence" },
        ]}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header / Hero */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-data/10 text-data border border-data/30 rounded-full mb-6">
            02 • SYSTEM ARCHITECTURE
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
            INTELLIGENCE <br />
            FOR REAL-WORLD <br />
            <span className="text-data">DECISIONS.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            We are engineering tools that synthesize planetary data, environmental science, infrastructure engineering, and artificial intelligence into actionable decision frameworks.
          </p>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-card/60 backdrop-blur-md rounded-xl border border-border/50 mb-16">
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-data">850M+</div>
            <div className="text-xs text-muted-foreground font-mono mt-1">Telemetry Data Points</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">42</div>
            <div className="text-xs text-muted-foreground font-mono mt-1">Hazard Risk Layers</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">99.4%</div>
            <div className="text-xs text-muted-foreground font-mono mt-1">Spatial Grid Accuracy</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-bamboo">&lt; 350ms</div>
            <div className="text-xs text-muted-foreground font-mono mt-1">Vector Query Latency</div>
          </div>
        </div>

        {/* Four Pillar Portals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar) => (
            <Link
              key={pillar.number}
              href={pillar.href}
              className={`group p-8 rounded-2xl bg-card border ${pillar.accent} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-sm font-mono text-muted-foreground">
                    {pillar.number}
                  </span>
                  <span className="text-sm font-mono text-data opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore Architecture →
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight mb-3">
                  {pillar.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  {pillar.desc}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-border/40">
                {pillar.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-muted text-foreground/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
