import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "The Lab — Interdisciplinary Approach & Principles",
  description:
    "We are building a laboratory for real-world change. Interdisciplinary research, environmental intelligence, and systems engineering in the Himalayas.",
  path: "/lab",
  keywords: [
    "About Sustainability Lab",
    "Interdisciplinary Approach",
    "Systems Engineering",
    "Himalayan Watershed Research",
  ],
});

const disciplines = [
  { name: "Environment", desc: "Hydrology, ecology, biodiversity, forest carbon, and natural resource monitoring." },
  { name: "Technology", desc: "Decentralized sensors, computer vision, GIS remote sensing, and domain AI models." },
  { name: "Economics", desc: "Blended climate finance, circular unit economics, and micro-enterprise resilience." },
  { name: "Infrastructure", desc: "Bio-engineered slope stabilization, resilient bridges, and sponge city drainage." },
  { name: "Design", desc: "Vernacular craftsmanship, disassemblable joinery, and human-centered tool interfaces." },
  { name: "People", desc: "Community stewardship, indigenous land tenure, and interdisciplinary collaboration." },
];

const principles = [
  { num: "01", title: "Evidence before assumption.", desc: "We test hypotheses on the ground with empirical measurements before writing recommendations." },
  { num: "02", title: "People before technology.", desc: "Algorithms and sensors are useless if the communities living alongside them cannot steward them." },
  { num: "03", title: "Systems before symptoms.", desc: "We do not treat isolated failures; we map the interconnected hydrology, economics, and ecology." },
  { num: "04", title: "Experiment before scale.", desc: "We prototype in physical workshops and living watersheds before recommending national deployment." },
  { num: "05", title: "Long-term value before short-term noise.", desc: "We build infrastructure and enterprises designed for 50-year horizons, not grant cycles." },
];

export default function LabAboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "The Lab", url: "/lab" },
        ]}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
          <Link href="/" className="hover:text-data transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-foreground">THE LAB</span>
        </div>

        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-foreground/5 text-foreground border border-border rounded-full mb-6">
            01 • ABOUT THE LAB
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
            WE ARE BUILDING A LABORATORY <br />
            <span className="text-data">FOR REAL-WORLD CHANGE.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            We believe the most difficult problems sit between disciplines. Sustainability Lab was founded to dismantle the silos between environmental science, engineering, enterprise, and local knowledge.
          </p>
        </div>

        {/* Interdisciplinary Matrix */}
        <div className="mb-20">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6 pb-4 border-b border-border/40">
            DISCIPLINARY COUPLING
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {disciplines.map((d) => (
              <div key={d.name} className="p-6 rounded-xl bg-card border border-border/70">
                <h3 className="font-display font-bold text-xl mb-2 text-foreground">
                  {d.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Principles */}
        <div className="p-8 sm:p-12 rounded-2xl bg-card border border-border mb-20 shadow-lg">
          <div className="text-xs font-mono text-data uppercase tracking-wider mb-2">
            OPERATING PHILOSOPHY
          </div>
          <h2 className="font-display text-3xl font-bold mb-10">
            Our Core Principles
          </h2>

          <div className="space-y-6">
            {principles.map((p) => (
              <div
                key={p.num}
                className="p-5 rounded-xl bg-background border border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start md:items-center gap-4">
                  <span className="font-mono text-sm text-data font-bold">{p.num}</span>
                  <div>
                    <h3 className="font-display font-bold text-base text-foreground mb-0.5">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-sans">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links to Sub-routes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/lab/people"
            className="p-6 rounded-xl bg-card border border-border/60 hover:border-data/50 transition-all group"
          >
            <span className="text-xs font-mono text-data block mb-2">DIRECTORY</span>
            <h4 className="font-display font-bold text-lg text-foreground group-hover:text-data transition-colors mb-1">
              People &amp; Fellows →
            </h4>
            <p className="text-xs text-muted-foreground">
              Meet our resident researchers, systems engineers, and visiting fellows.
            </p>
          </Link>

          <Link
            href="/lab/work"
            className="p-6 rounded-xl bg-card border border-border/60 hover:border-data/50 transition-all group"
          >
            <span className="text-xs font-mono text-data block mb-2">EVIDENCE</span>
            <h4 className="font-display font-bold text-lg text-foreground group-hover:text-data transition-colors mb-1">
              Case Studies &amp; Projects →
            </h4>
            <p className="text-xs text-muted-foreground">
              Read structured post-mortems of our interventions in the field.
            </p>
          </Link>

          <Link
            href="/lab/insights"
            className="p-6 rounded-xl bg-card border border-border/60 hover:border-data/50 transition-all group"
          >
            <span className="text-xs font-mono text-data block mb-2">EDITORIAL</span>
            <h4 className="font-display font-bold text-lg text-foreground group-hover:text-data transition-colors mb-1">
              Field Notes &amp; Essays →
            </h4>
            <p className="text-xs text-muted-foreground">
              Dispatches on climate hydrology, materials, and regional resilience.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
