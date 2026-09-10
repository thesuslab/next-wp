"use client";

import { useState } from "react";
import Link from "next/link";

interface SectorData {
  id: string;
  name: string;
  icon: string;
  headline: string;
  keyRisks: string[];
  ecologicalConsiderations: string[];
  baselineMetrics: { label: string; val: string }[];
  caseSnippet: { title: string; location: string; outcome: string };
}

const sectors: SectorData[] = [
  {
    id: "hydropower",
    name: "HYDROPOWER",
    icon: "⚡",
    headline: "Run-of-River & Storage Dam Environmental Baselines",
    keyRisks: ["Aquatic river connectivity & fish migration blockages", "Reservoir sedimentation & downstream scour", "Catchment landslide & flood outburst vulnerability"],
    ecologicalConsiderations: ["Minimum environmental flow (e-flow) compliance", "Riparian buffer zone afforestation", "Sediment bypass tunneling"],
    baselineMetrics: [
      { label: "River Continuity Index", val: "72% preserved" },
      { label: "Aquatic Habitat Offset", val: "1.4x restoration" },
      { label: "Sediment Trapping Rate", val: "< 8% annual loss" },
    ],
    caseSnippet: {
      title: "Trishuli Basin Hydro Baseline",
      location: "Central Himalaya, Nepal",
      outcome: "Modeled 30-year river discharge variability to optimize bypass e-flow without lowering peak generation capacity.",
    },
  },
  {
    id: "roads",
    name: "ROADS & HIGHWAYS",
    icon: "🛣️",
    headline: "Slope Stability & Cut-Slope Ecological Bio-Engineering",
    keyRisks: ["Debris slide triggers during monsoon downpours", "Corridor fragmentation of endangered mammal corridors", "Drainage discharge causing gully erosion in settlements"],
    ecologicalConsiderations: ["Vetiver grass & deep-root native tree stabilization", "Dedicated wildlife underpasses and tree-canopy bridges", "Cascading energy-dissipating culvert outfalls"],
    baselineMetrics: [
      { label: "Slope Stabilization", val: "94% erosion reduction" },
      { label: "Canopy Re-coupling", val: "12 crossings active" },
      { label: "Runoff Velocity Buffer", val: "-60% peak force" },
    ],
    caseSnippet: {
      title: "Mid-Hill Highway Resilient Corridor",
      location: "Bagmati Province",
      outcome: "Applied GIS LiDAR slope-angle modeling to eliminate cut-and-dump spoil disposal across 45km.",
    },
  },
  {
    id: "railways",
    name: "RAILWAYS",
    icon: "🚆",
    headline: "Linear Corridor Impact & Terrestrial Ecosystem Safeguards",
    keyRisks: ["Linear fragmentation of critical national park corridors", "Groundwater table disruption from tunneling and portal blasting", "Acoustic and vibration disturbances on sensitive fauna"],
    ecologicalConsiderations: ["Continuous geo-hydrological aquifer monitoring", "Acoustic baffle barriers along sensitive wetlands", "Grade-separated fauna viaducts"],
    baselineMetrics: [
      { label: "Aquifer Integrity", val: "100% monitored nodes" },
      { label: "Fauna Corridor Permeability", val: "88% pass rate" },
      { label: "Tunnel Spoil Repurposed", val: "76% used in aggregate" },
    ],
    caseSnippet: {
      title: "East-West Railway Forest Pass",
      location: "Terai Arc Landscape",
      outcome: "Rerouted alignment by 3.2km around primary elephant migration paths, cutting collision risk to near zero.",
    },
  },
  {
    id: "transmission",
    name: "TRANSMISSION",
    icon: "🗼",
    headline: "High-Voltage Right-of-Way Bird Flight & Forest Corridors",
    keyRisks: ["Avian collision with high-tension conductor wires", "Forest canopy clearing along 50m right-of-way swaths", "Erosion along steep tower footings in fragile soils"],
    ecologicalConsiderations: ["Spiral bird flight diverters on earth wires", "Low-impact selective trimming instead of clear-cutting", "Micropile foundation drilling for zero-excavation footprint"],
    baselineMetrics: [
      { label: "Avian Collision Reduction", val: "-85% post-diverters" },
      { label: "Canopy Biomass Retained", val: "68% in ROW" },
      { label: "Soil Displacement", val: "-70% vs standard footing" },
    ],
    caseSnippet: {
      title: "400kV Cross-Valley Grid Link",
      location: "Marsyangdi Corridor",
      outcome: "Integrated LiDAR fly-through analysis to keep towers below skyline ridges and preserve migratory vulture thermal corridors.",
    },
  },
  {
    id: "water",
    name: "WATER & SANITATION",
    icon: "💧",
    headline: "Watershed Hydrology, Aquifer Recharge & Effluent Safety",
    keyRisks: ["Over-extraction leading to groundwater subsidence", "Untreated effluent contaminating downstream agricultural lands", "Extreme seasonal drought vs flash waterlogging swings"],
    ecologicalConsiderations: ["Constructed treatment wetlands for natural phytoremediation", "Recharge ponds and permeable catchment surfaces", "Real-time biological water quality sensor telemetry"],
    baselineMetrics: [
      { label: "Phytoremediation Efficiency", val: "92% BOD removal" },
      { label: "Groundwater Recharge", val: "+3.2M liters / year" },
      { label: "Pathogen Attenuation", val: "99.8% reduction" },
    ],
    caseSnippet: {
      title: "Peri-Urban Wetland Basin",
      location: "Kathmandu Valley Fringe",
      outcome: "Designed a 4-hectare nature-based water treatment wetland serving 18,000 households without mechanical chemical dosing.",
    },
  },
  {
    id: "urban",
    name: "URBAN INFRASTRUCTURE",
    icon: "🏙️",
    headline: "Urban Heat Islands, Sponge Cities & Micro-Climate Control",
    keyRisks: ["Impervious surface flooding during cloudburst events", "Micro-climate heat traps affecting dense residential blocks", "Loss of urban green spaces and native pollinator flora"],
    ecologicalConsiderations: ["Bioswales, rain gardens, and permeable pavements", "Urban pocket forests (Miyawaki method) for cooling", "Reflective roofing and green envelope requirements"],
    baselineMetrics: [
      { label: "Stormwater Retention", val: "82% absorbed on-site" },
      { label: "Local Heat Island Reduction", val: "-2.8°C surface temp" },
      { label: "Biodiversity Gain", val: "+45 native plant species" },
    ],
    caseSnippet: {
      title: "Resilient Urban Ward Pilot",
      location: "Patan Heritage District",
      outcome: "Transformed 6 paved open squares into dual-purpose retention basins that absorb cloudbursts and supply emergency non-potable water.",
    },
  },
];

const serviceModules = [
  {
    title: "Environmental Assessment",
    items: ["Initial Environmental Examination (IEE)", "Comprehensive EIA Support & Modeling", "Statutory Environmental Audits", "Multi-Seasonal Baseline Studies", "Environmental Management Plans (EMP)"],
  },
  {
    title: "Natural Resource Systems",
    items: ["Catchment & Forest Biomass Accounting", "Surface & Groundwater Hydrology", "Terrestrial & Aquatic Biodiversity Inventories", "Soil Chemistry & Land Capability Mapping", "Ecosystem Service Valuation"],
  },
  {
    title: "Safeguards & Compliance",
    items: ["ADB / World Bank Environmental Safeguards", "Social Impact Assessment (SIA)", "Free, Prior & Informed Consent (FPIC)", "Third-Party Safeguard Monitoring", "Grievance Redress Architecture"],
  },
  {
    title: "Spatial Intelligence",
    items: ["High-Resolution GIS Mapping", "Remote Sensing & Satellite Classification", "Multi-Criteria Terrain Sensitivity Analysis", "Digital Elevation & Flood Inundation Modeling", "Interactive Risk Dashboards"],
  },
];

export default function EnvironmentalIntelligencePage() {
  const [selectedSector, setSelectedSector] = useState<SectorData>(sectors[0]);

  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
          <Link href="/intelligence" className="hover:text-data transition-colors">
            INTELLIGENCE
          </Link>
          <span>/</span>
          <span className="text-foreground">ENVIRONMENTAL</span>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl mb-16">
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
            UNDERSTAND THE IMPACT <br />
            <span className="text-bamboo">BEFORE YOU BUILD.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            Rigorous environmental intelligence for infrastructure developers, national utilities, multilateral financiers, and natural resource custodians.
          </p>
        </div>

        {/* Service Modules Grid */}
        <div className="mb-20">
          <div className="text-xs font-mono tracking-widest text-bamboo uppercase mb-4">
            SERVICE MODULES
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceModules.map((mod) => (
              <div
                key={mod.title}
                className="p-6 rounded-xl bg-card border border-border/60 hover:border-bamboo/50 transition-colors"
              >
                <h3 className="font-display font-semibold text-lg mb-4 text-foreground">
                  {mod.title}
                </h3>
                <ul className="space-y-2.5">
                  {mod.items.map((item) => (
                    <li key={item} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-bamboo font-mono">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Infrastructure Sector Explorer */}
        <div className="mb-20 p-8 sm:p-10 rounded-2xl bg-card border border-border/70 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-border/40">
            <div>
              <div className="text-xs font-mono tracking-widest text-data uppercase mb-1">
                INTERACTIVE DIAGNOSTIC SECTORS
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Infrastructure Impact Modeling
              </h2>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              Select a sector to preview ecological risk vectors & intervention baselines
            </p>
          </div>

          {/* Sector Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-10">
            {sectors.map((sector) => {
              const isSelected = selectedSector.id === sector.id;
              return (
                <button
                  key={sector.id}
                  onClick={() => setSelectedSector(sector)}
                  className={`p-3 rounded-lg border text-left font-mono text-xs transition-all duration-200 flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "bg-bamboo/10 border-bamboo text-bamboo shadow-[0_0_15px_rgba(93,121,36,0.2)]"
                      : "bg-muted/40 border-border/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  <span className="text-lg">{sector.icon}</span>
                  <span className="font-semibold tracking-wider text-[11px]">{sector.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Sector Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="text-xs font-mono text-bamboo uppercase tracking-wider mb-1">
                  SECTOR PROFILE: {selectedSector.name}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold">
                  {selectedSector.headline}
                </h3>
              </div>

              {/* Risks */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 mb-2">
                  Primary Critical Environmental Risks
                </h4>
                <div className="space-y-2">
                  {selectedSector.keyRisks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground bg-rose-500/5 p-2.5 rounded border border-rose-500/20">
                      <span className="text-rose-400 font-mono font-bold">!</span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ecological Solutions */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-bamboo mb-2">
                  Lab Intervention & Bio-Engineering Safeguards
                </h4>
                <div className="space-y-2">
                  {selectedSector.ecologicalConsiderations.map((eco, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground bg-bamboo/5 p-2.5 rounded border border-bamboo/20">
                      <span className="text-bamboo font-mono font-bold">✓</span>
                      <span>{eco}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics and Case Study Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-xl bg-background border border-border/80">
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
                  Baseline Verification Metrics
                </div>
                <div className="space-y-4">
                  {selectedSector.baselineMetrics.map((metric, i) => (
                    <div key={i} className="flex justify-between items-center pb-3 border-b border-border/40 last:border-0 last:pb-0">
                      <span className="text-xs text-muted-foreground">{metric.label}</span>
                      <span className="text-xs font-mono font-bold text-data">{metric.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-bamboo/10 border border-bamboo/30">
                <div className="text-[10px] font-mono text-bamboo uppercase tracking-widest mb-1">
                  FIELD CASE SNIPPET
                </div>
                <h5 className="font-display font-bold text-sm text-foreground mb-1">
                  {selectedSector.caseSnippet.title}
                </h5>
                <div className="text-[11px] font-mono text-muted-foreground mb-3">
                  Location: {selectedSector.caseSnippet.location}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedSector.caseSnippet.outcome}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="p-8 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight mb-1">
              Have an infrastructure or development project to evaluate?
            </h3>
            <p className="text-sm text-muted-foreground">
              Our specialists conduct comprehensive EIA, hydrological and GIS spatial baseline studies.
            </p>
          </div>
          <Link
            href="/collaborate/contact"
            className="px-6 py-3 rounded bg-foreground text-background font-display font-medium text-xs tracking-wider uppercase hover:bg-data hover:text-black transition-colors shrink-0"
          >
            Discuss a project →
          </Link>
        </div>
      </div>
    </main>
  );
}
