import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Enterprise Suite — Incubation & Readiness",
  description:
    "From idea to enterprise. AI-assisted incubation, dynamic business diagnostics, and climate finance readiness for regenerative ventures in South Asia.",
  path: "/enterprise",
  keywords: [
    "Climate Startup Incubation",
    "Enterprise Readiness",
    "Regenerative Ventures",
    "Blended Climate Finance",
  ],
});

const journeySteps = [
  {
    step: "01",
    title: "Discover",
    subtitle: "Tell us what you are building.",
    desc: "Map your core value proposition, raw material dependencies, and local climate alignment.",
  },
  {
    step: "02",
    title: "Diagnose",
    subtitle: "Understand your business health.",
    desc: "Run the Lab 20-point diagnostic across Market, Finance, Operations, Digital, and Sustainability.",
  },
  {
    step: "03",
    title: "Plan",
    subtitle: "Build your roadmap.",
    desc: "Turn vulnerabilities into milestones with a realistic, phased 90-day operational blueprint.",
  },
  {
    step: "04",
    title: "Learn",
    subtitle: "Find the knowledge you need.",
    desc: "Access localized supply chain benchmarks, compliance protocols, and technical manuals.",
  },
  {
    step: "05",
    title: "Connect",
    subtitle: "Meet the right people.",
    desc: "Tap into our network of domain mentors, academic researchers, and vetted suppliers.",
  },
  {
    step: "06",
    title: "Finance",
    subtitle: "Prepare for funding.",
    desc: "Structure your unit economics for blended finance, carbon credits, and impact grants.",
  },
  {
    step: "07",
    title: "Grow",
    subtitle: "Scale with resilience.",
    desc: "Deploy working capital, track continuous telemetry, and expand across watershed corridors.",
  },
];

export default function EnterprisePage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Enterprise", url: "/enterprise" },
        ]}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
          <Link href="/" className="hover:text-data transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-foreground">ENTERPRISE</span>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-full mb-6">
            04 • ECONOMIC SYSTEMS
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
            FROM IDEA TO <br />
            <span className="text-amber-500">ENTERPRISE.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            Good ideas shouldn&apos;t fail because founders lack operational playbooks. We combine AI diagnostics, financial engineering, and hands-on incubation to help sustainable businesses grow.
          </p>
        </div>

        {/* Diagnostic Highlight Card */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-card to-amber-950/20 border border-amber-500/30 mb-20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-mono text-amber-500 uppercase tracking-widest block mb-2">
              FEATURED APPLICATION
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              How healthy is your business?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Answer our 20-question dynamic diagnostic. Receive an instant enterprise score across Market, Finance, Operations, Digital, and Sustainability — plus a tailored 30-day action roadmap.
            </p>
          </div>
          <Link
            href="/enterprise/diagnostics"
            className="px-8 py-4 rounded-xl bg-amber-500 text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/20 shrink-0"
          >
            Try Enterprise Diagnostic →
          </Link>
        </div>

        {/* The 7-Step Enterprise Journey */}
        <div className="mb-20">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-8 pb-4 border-b border-border/40">
            THE INCUBATION JOURNEY
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {journeySteps.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-xl bg-card border border-border/70 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-sm font-mono text-amber-500 block mb-3 font-bold">
                    {step.step}
                  </span>
                  <h3 className="font-display font-bold text-xl mb-1">{step.title}</h3>
                  <div className="text-xs font-mono text-muted-foreground mb-4">
                    {step.subtitle}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Incubation Ecosystem Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 rounded-2xl bg-card border border-border">
          <div>
            <div className="text-xs font-mono text-amber-500 mb-2">INCUBATION</div>
            <h4 className="font-display font-bold text-lg mb-2">AI Incubation Engine</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Continuous algorithmic coaching that flags cashflow crunches, compliance gaps, and supply chain delays before they threaten operations.
            </p>
          </div>
          <div>
            <div className="text-xs font-mono text-amber-500 mb-2">CAPITAL</div>
            <h4 className="font-display font-bold text-lg mb-2">Financial Readiness</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Transforming fragile balance sheets into bankable collateral packages attractive to impact investors, DFIs, and commercial climate debt.
            </p>
          </div>
          <div>
            <div className="text-xs font-mono text-amber-500 mb-2">PEOPLE</div>
            <h4 className="font-display font-bold text-lg mb-2">Domain Mentorship</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pairing founders directly with veteran engineers, supply chain operators, and policy analysts who have built enterprises in high-altitude environments.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
