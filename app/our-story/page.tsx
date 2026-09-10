import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Our Story — The Genesis of Sustainability Lab",
  description:
    "Why we built the Sustainability Lab: bridging Himalayan environmental science, climate engineering, circular craftsmanship (KĀRVA), and resilient enterprise in Nepal.",
  path: "/our-story",
  keywords: [
    "Our Story Sustainability Lab",
    "Genesis",
    "Himalayan Watershed Resilience",
    "Patan Station Nepal",
    "Circular Craftsmanship KĀRVA",
  ],
});

const PILLARS = [
  {
    step: "01",
    label: "CONVERGENCE",
    title: "Breaking Institutional Silos",
    desc: "Uniting field ecology, hydrology, remote sensing, and local indigenous knowledge into unified decision frameworks for real-world infrastructure.",
    tag: "INTERDISCIPLINARY SCIENCE",
  },
  {
    step: "02",
    label: "CIRCULARITY",
    title: "KĀRVA Material Studio",
    desc: "Transforming century-old salvaged architectural timbers, reclaimed brick, and agricultural residues into enduring circular objects.",
    tag: "TANGIBLE SUSTAINABILITY",
  },
  {
    step: "03",
    label: "RESILIENCE",
    title: "Planetary Decision Tools",
    desc: "Equipping governments, engineers, and entrepreneurs with open telemetry, Climate Risk Scanners, and 50-year IPCC resilience models.",
    tag: "LIVING TELEMETRY",
  },
];

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Our Story", url: "/our-story" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb nav */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-8">
          <Link href="/" className="hover:text-bamboo transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-foreground">OUR STORY</span>
        </div>

        {/* Hero */}
        <div className="space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-bamboo/10 text-bamboo border border-bamboo/30 rounded-full">
            00 • OUR STORY / GENESIS
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] uppercase">
            Why we built the <br />
            <span className="text-bamboo">Sustainability Lab.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light">
            From Himalayan watersheds to living systems — bridging the gap
            between planetary science, local craft, and resilient enterprise.
          </p>
        </div>

        {/* Article Body */}
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 font-sans text-base sm:text-lg leading-relaxed text-muted-foreground">
          <section className="space-y-4 border-t border-border/40 pt-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              1. The Fragile Horizon
            </h2>
            <p>
              The Sustainability Lab began in the fragile valleys of the
              Himalayas with a simple, inescapable realization: the most
              consequential challenges of our era do not occur within neat
              academic or institutional silos.
            </p>
            <p>
              In Nepal and across the high-mountain headwaters of South Asia,
              rapidly expanding infrastructure, volatile mountain hydrology,
              compounding climate risks, and centuries of vernacular knowledge
              collide every single day. Glaciers recede faster than reports are
              drafted; cloudbursts trigger flash floods that wash away
              newly-laid highways; and traditional construction techniques are
              abandoned in favor of fragile, carbon-intensive concrete.
            </p>
          </section>

          <section className="space-y-4 border-t border-border/40 pt-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              2. Breaking the Silos
            </h2>
            <p>
              We saw that environmental reports alone do not prevent slope
              failures, and software algorithms alone cannot rebuild a fractured
              ecosystem. When engineers build without ecologists, slopes fail.
              When policymakers design subsidies without entrepreneurs, markets
              stall. When technology platforms deploy without community
              stewardship, sensors sit neglected in the dust.
            </p>
            <p>
              What was urgently needed was a <strong className="text-foreground">living bridge</strong> —
              an open, interdisciplinary laboratory where field environmental
              intelligence, climate-resilient engineering, circular
              craftsmanship (<strong className="text-foreground">KĀRVA</strong>),
              and entrepreneurial incubation operate as one coupled, cohesive
              system.
            </p>
          </section>

          {/* Three Pillars */}
          <section className="border-t border-border/40 pt-10 space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              3. The Three Pillars of Our Work
            </h2>
            <p>
              Our laboratory is structured around three interconnected vectors
              that translate scientific evidence into tangible interventions:
            </p>

            <div className="grid gap-6 not-prose">
              {PILLARS.map((p) => (
                <div
                  key={p.step}
                  className="border border-border/60 bg-card p-6 rounded-xl hover:border-bamboo/50 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-bamboo font-bold tracking-widest">
                      {p.step} / {p.label}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 border-t border-border/40 pt-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              4. The Patan Research Station
            </h2>
            <p>
              Today, from our research station in Patan, Kathmandu Valley, we
              bring together hydrologists, data scientists, architects,
              policymakers, and local builders. We test hypotheses in living
              watersheds, engineer bio-shields for critical assets, salvage
              heritage timber for circular joinery, and build resilient
              intelligence tools designed to endure for the next fifty years.
            </p>
            <p className="font-mono text-sm text-bamboo italic">
              &quot;The point isn&apos;t to predict the future. It&apos;s to make ourselves ready for it.&quot;
            </p>
          </section>

          {/* Call to action */}
          <div className="not-prose border-t border-border/40 pt-10 flex flex-wrap gap-4">
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 text-xs font-display font-medium tracking-[0.12em] uppercase bg-foreground text-background px-6 py-3.5 hover:bg-bamboo hover:text-white transition-all duration-300"
            >
              Explore our methodology
              <span>→</span>
            </Link>
            <Link
              href="/karva"
              className="inline-flex items-center gap-2 text-xs font-display font-medium tracking-[0.12em] uppercase border border-border px-6 py-3.5 text-muted-foreground hover:text-bamboo hover:border-bamboo transition-all duration-300"
            >
              Discover KĀRVA Circular Studio
            </Link>
            <Link
              href="/collaborate/contact"
              className="inline-flex items-center gap-2 text-xs font-display font-medium tracking-[0.12em] uppercase border border-border px-6 py-3.5 text-muted-foreground hover:text-bamboo hover:border-bamboo transition-all duration-300"
            >
              Start a conversation
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
