"use client";

import { useState } from "react";
import Link from "next/link";

interface CaseStudy {
  id: string;
  title: string;
  category: "ENVIRONMENT" | "CLIMATE" | "ENTERPRISE" | "TECHNOLOGY" | "KĀRVA";
  location: string;
  year: string;
  challenge: string;
  context: string;
  approach: string;
  intervention: string;
  outcome: string;
  whatWeLearned: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: "case-01",
    title: "Trishuli River Catchment Hydrologic Vulnerability Assessment",
    category: "CLIMATE",
    location: "Central Himalaya, Nepal",
    year: "2025–2026",
    challenge: "A 45MW run-of-river hydropower asset was experiencing unprecedented silt abrasion that degraded turbine runners in under 18 months, causing recurring seasonal outages.",
    context: "Upper catchment glacial retreat and road construction cut-slopes were injecting 4x normal quartz silt volume into the river during early monsoon surges, rendering standard desanding basins undersized.",
    approach: "Combined satellite Sentinel-2 turbidity tracking with automated acoustic in-situ bedload sensors to map exactly which upstream tributaries were contributing the peak abrasive quartz fractions.",
    intervention: "Engineered an upstream vortex silt extractor and real-time bypass automation that triggers turbine shutdown for only 4-6 hours during peak bedload pulses, preserving 94% of generation while tripling runner lifespan.",
    outcome: "Turbine runner lifespan extended from 18 months to 48+ months, saving an estimated $1.2M in recurring maintenance and replacement capex.",
    whatWeLearned: "Sediment load cannot be modeled from daily river discharge gauges alone. In mountain catchments, sediment arrives in violent discrete pulses triggered by localized cloudbursts on road cuts.",
  },
  {
    id: "case-02",
    title: "Bio-Engineered Slope Stabilization on the Mid-Hill Corridor",
    category: "ENVIRONMENT",
    location: "Bagmati Highway Section, Nepal",
    year: "2024–2025",
    challenge: "Recurring monsoon debris flows consistently severed food and hospital transit along an essential 12km mountain arterial.",
    context: "Conventional concrete retaining walls repeatedly failed due to hydrostatic pressure build-up behind impermeable mortar during torrential cloudbursts.",
    approach: "Replaced rigid concrete masonry with flexible, deep-root living bio-engineering solutions and permeable dry-stone breast walls.",
    intervention: "Planted tiered vetiver grass (Chrysopogon zizanioides) contour hedgerows coupled with deep-rooted Alnus nepalensis (Uttis) trees and cascading subsurface perforated drain channels.",
    outcome: "Zero slope failures recorded during the 2025 monsoon record downpour (320mm in 24h), with road maintenance costs reduced by 78%.",
    whatWeLearned: "Living root networks increase in shear strength year after year as roots penetrate deeper, whereas concrete structures begin deteriorating the moment they are poured.",
  },
  {
    id: "case-03",
    title: "KĀRVA Reclaimed Heritage Timber Acoustic Screen Deployment",
    category: "KĀRVA",
    location: "Patan Urban Center, Nepal",
    year: "2025",
    challenge: "Demolition of traditional Newar residential structures was sending centenarian Shorea robusta (Sal) structural posts directly to brick kilns as firewood.",
    context: "Salvaged wood had multiple square-head iron nails, uneven weathering, and variable moisture content, making industrial milling difficult and unprofitable for scrap merchants.",
    approach: "Developed a standardized grading, de-nailing, and ultrasonic structural testing protocol in the Lab craft workshop.",
    intervention: "Crafted modular acoustic baffles and demountable research furniture utilizing traditional mortise-and-tenon joints without chemical glues or VOC resins.",
    outcome: "4.8 tons of heritage timber diverted from kiln incineration; commissioned by 3 regional research institutes with an estimated 60-year lifespan.",
    whatWeLearned: "Centenarian heartwood requires specialized diamond-toothed blades to plane due to silica mineralization, but rewards the effort with dimensional stability impossible to find in new timber.",
  },
  {
    id: "case-04",
    title: "Decentralized Agri-Biomass Pellet Micro-Enterprise Incubation",
    category: "ENTERPRISE",
    location: "Chitwan Agricultural Basin",
    year: "2025",
    challenge: "Farmers were burning 14,000 tons of post-harvest mustard and paddy crop residue annually, generating toxic winter particulate smog.",
    context: "Previous government attempts to introduce centralized pellet plants failed due to high transport costs for low-density uncompacted straw.",
    approach: "Structured a decentralized micro-hub model where mobile tractor-mounted briquetting units compact residue directly at village collection yards within a 5km radius.",
    intervention: "Delivered our 20-point enterprise diagnostic, structured a blended concessional finance loan with a local cooperative bank, and guaranteed an industrial off-take contract with regional tea driers.",
    outcome: "Operational micro-enterprise generating $65k annual net margin, diverting 3,200 tons of open-field smoke, and providing supplemental winter cash to 140 farming families.",
    whatWeLearned: "The bottleneck in rural circular economy enterprises is never machinery; it is establishing working capital credit to pay farmers cash-on-delivery during harvest week.",
  },
];

const categories = ["ALL", "CLIMATE", "ENVIRONMENT", "ENTERPRISE", "TECHNOLOGY", "KĀRVA"] as const;

export default function WorkPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredCases = selectedCategory === "ALL"
    ? caseStudies
    : caseStudies.filter((c) => c.category === selectedCategory);

  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
          <Link href="/lab" className="hover:text-data transition-colors">
            THE LAB
          </Link>
          <span>/</span>
          <span className="text-foreground">WORK</span>
        </div>

        {/* Hero */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-data/10 text-data border border-data/30 rounded-full mb-6">
            PRACTICAL EVIDENCE
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
            IDEAS WE HAVE <br />
            <span className="text-data">PUT TO WORK.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            We don&apos;t build glossy marketing portfolios. Every project is documented as a transparent technical post-mortem: what went wrong, what we built, what changed, and what we learned.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12 pb-6 border-b border-border/40">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? "bg-data text-black font-semibold shadow-[0_0_12px_rgba(0,212,170,0.3)]"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Structured Case Study Cards */}
        <div className="space-y-12">
          {filteredCases.map((cs) => (
            <div
              key={cs.id}
              className="p-8 sm:p-12 rounded-2xl bg-card border border-border/80 shadow-xl"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border/40 mb-8 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-data/10 text-data border border-data/30 font-bold">
                    {cs.category}
                  </span>
                  <span className="text-muted-foreground">{cs.location}</span>
                </div>
                <span className="text-muted-foreground">{cs.year}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-8">
                {cs.title}
              </h2>

              {/* 6-Part Structured Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-mono">
                {/* 1. Challenge */}
                <div className="p-5 rounded-xl bg-background border border-border/60">
                  <div className="text-rose-400 font-bold uppercase mb-2">01 / THE CHALLENGE</div>
                  <p className="text-muted-foreground font-sans text-xs leading-relaxed">
                    {cs.challenge}
                  </p>
                </div>

                {/* 2. Context */}
                <div className="p-5 rounded-xl bg-background border border-border/60">
                  <div className="text-amber-400 font-bold uppercase mb-2">02 / THE CONTEXT</div>
                  <p className="text-muted-foreground font-sans text-xs leading-relaxed">
                    {cs.context}
                  </p>
                </div>

                {/* 3. Approach */}
                <div className="p-5 rounded-xl bg-background border border-border/60">
                  <div className="text-cyan-400 font-bold uppercase mb-2">03 / THE APPROACH</div>
                  <p className="text-muted-foreground font-sans text-xs leading-relaxed">
                    {cs.approach}
                  </p>
                </div>

                {/* 4. Intervention */}
                <div className="p-5 rounded-xl bg-background border border-border/60">
                  <div className="text-data font-bold uppercase mb-2">04 / THE INTERVENTION</div>
                  <p className="text-muted-foreground font-sans text-xs leading-relaxed">
                    {cs.intervention}
                  </p>
                </div>

                {/* 5. Outcome */}
                <div className="p-5 rounded-xl bg-background border border-border/60">
                  <div className="text-bamboo font-bold uppercase mb-2">05 / THE OUTCOME</div>
                  <p className="text-muted-foreground font-sans text-xs leading-relaxed">
                    {cs.outcome}
                  </p>
                </div>

                {/* 6. What We Learned */}
                <div className="p-5 rounded-xl bg-muted/40 border border-border/60">
                  <div className="text-foreground font-bold uppercase mb-2">06 / WHAT WE LEARNED</div>
                  <p className="text-foreground/80 font-sans text-xs leading-relaxed">
                    {cs.whatWeLearned}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
