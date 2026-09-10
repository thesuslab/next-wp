"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Parameter {
  id: string;
  name: string;
  desc: string;
  weight: number;
  value: number; // 0 - 100
}

export default function ResiliencePage() {
  const [climateParam, setClimateParam] = useState(62);
  const [envParam, setEnvParam] = useState(78);
  const [hazardParam, setHazardParam] = useState(49);
  const [infraParam, setInfraParam] = useState(71);
  const [communityParam, setCommunityParam] = useState(65);

  const overallScore = useMemo(() => {
    return Math.round(
      climateParam * 0.25 +
      envParam * 0.2 +
      hazardParam * 0.25 +
      infraParam * 0.15 +
      communityParam * 0.15
    );
  }, [climateParam, envParam, hazardParam, infraParam, communityParam]);

  const resiliencePillars = [
    {
      title: "Green Infrastructure",
      desc: "Bio-engineered slope stabilization, permeable surfaces, and ecological water retention replacing rigid concrete.",
    },
    {
      title: "Climate Adaptation",
      desc: "Upgrading culvert hydrologic envelopes, flexible ductile joints, and high-temperature material standards.",
    },
    {
      title: "Nature-Based Solutions (NbS)",
      desc: "Restoring upstream wetland aquifers and riparian forests to reduce downstream flood energy naturally.",
    },
    {
      title: "Disaster Risk Reduction (DRR)",
      desc: "Integrated hazard warning telemetry, seismic structural retrofitting, and redundant evacuation corridors.",
    },
    {
      title: "Resource Circularity",
      desc: "Recycling excavation spoil into engineered fill and reducing embodied carbon through local materials.",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
          <Link href="/" className="hover:text-data transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-foreground">RESILIENCE</span>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-bamboo/10 text-bamboo border border-bamboo/30 rounded-full mb-6">
            03 • PHYSICAL INFRASTRUCTURE
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
            BUILD FOR THE WORLD <br />
            <span className="text-bamboo">WE ARE ENTERING.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            Infrastructure can no longer be designed on static 20th-century historical records. We combine nature-based engineering, sensor telemetry, and dynamic hazard envelopes so systems bend without breaking.
          </p>
        </div>

        {/* Structural Cross-Section Diagram Concept */}
        <div className="p-8 rounded-2xl bg-card border border-border/70 mb-20 shadow-lg">
          <div className="text-xs font-mono text-bamboo uppercase tracking-wider mb-2">
            INFRASTRUCTURE CROSS-SECTION ARCHITECTURE
          </div>
          <h2 className="font-display text-2xl font-bold mb-6">
            The Multi-Layer Resilient Corridor
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-5 rounded-xl bg-background border border-border/60">
              <div className="text-bamboo font-bold mb-2">01 / UPPER CATCHMENT</div>
              <div className="text-sm font-semibold mb-2">Native Deep-Root Bio-Shield</div>
              <p className="text-muted-foreground leading-relaxed font-sans text-xs">
                Vetiver grass terraces, alder forests, and check-dams attenuate mountain runoff velocity and lock topsoil before it reaches the asset.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-background border border-border/60">
              <div className="text-cyan-400 font-bold mb-2">02 / CORE ASSET MATRIX</div>
              <div className="text-sm font-semibold mb-2">Ductile &amp; Redundant Structures</div>
              <p className="text-muted-foreground leading-relaxed font-sans text-xs">
                Modular bridges with expansion bearings, over-engineered 1:500-year spillway outfalls, and seismic isolation foundations.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-background border border-border/60">
              <div className="text-amber-400 font-bold mb-2">03 / DOWNSTREAM SPONGE</div>
              <div className="text-sm font-semibold mb-2">Wetland Dissipation Basins</div>
              <p className="text-muted-foreground leading-relaxed font-sans text-xs">
                Constructed seasonal wetlands and groundwater recharge channels absorb extreme hydraulic surges, protecting downstream settlements.
              </p>
            </div>
          </div>
        </div>

        {/* Five Core Pillars */}
        <div className="mb-20">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
            CORE DOMAINS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {resiliencePillars.map((pillar, i) => (
              <div key={i} className="p-5 rounded-xl bg-card border border-border/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block mb-2">
                    0{i + 1}
                  </span>
                  <h3 className="font-display font-bold text-sm mb-2">{pillar.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-light mt-2">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Resilience Score Prototype */}
        <div className="p-8 sm:p-10 rounded-2xl bg-card border border-bamboo/30 shadow-2xl mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-border/40">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bamboo/10 text-bamboo text-xs font-mono tracking-widest uppercase mb-2">
                INTERACTIVE SCORING PROTOCOL
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Project Resilience Score Calculator
              </h2>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              Adjust parameters to preview composite asset resilience score
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Sliders (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="font-semibold">Climate Scenario Hardening</span>
                  <span className="text-bamboo">{climateParam} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={climateParam}
                  onChange={(e) => setClimateParam(Number(e.target.value))}
                  className="w-full accent-bamboo cursor-pointer"
                />
                <span className="text-[11px] text-muted-foreground">Hydrological variance, thermal tolerance, extreme precipitation design.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="font-semibold">Ecological Buffer Integrity</span>
                  <span className="text-bamboo">{envParam} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={envParam}
                  onChange={(e) => setEnvParam(Number(e.target.value))}
                  className="w-full accent-bamboo cursor-pointer"
                />
                <span className="text-[11px] text-muted-foreground">Forest connectivity, topsoil stability, riparian corridor protection.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="font-semibold">Disaster &amp; Hazard Attenuation</span>
                  <span className="text-bamboo">{hazardParam} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hazardParam}
                  onChange={(e) => setHazardParam(Number(e.target.value))}
                  className="w-full accent-bamboo cursor-pointer"
                />
                <span className="text-[11px] text-muted-foreground">Early warning telemetry, debris deflectors, flood bypass gates.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="font-semibold">Infrastructure Structural Redundancy</span>
                  <span className="text-bamboo">{infraParam} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={infraParam}
                  onChange={(e) => setInfraParam(Number(e.target.value))}
                  className="w-full accent-bamboo cursor-pointer"
                />
                <span className="text-[11px] text-muted-foreground">Alternative power routing, bypass culverts, modular maintenance joints.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="font-semibold">Community Co-Benefit &amp; Stewardship</span>
                  <span className="text-bamboo">{communityParam} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={communityParam}
                  onChange={(e) => setCommunityParam(Number(e.target.value))}
                  className="w-full accent-bamboo cursor-pointer"
                />
                <span className="text-[11px] text-muted-foreground">Local livelihood integration, emergency refuge utility, FPIC alignment.</span>
              </div>
            </div>

            {/* Score Display Card (5 cols) */}
            <div className="lg:col-span-5 bg-black/50 p-8 rounded-2xl border border-border/80 flex flex-col items-center justify-center text-center font-mono">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                OVERALL COMPOSITE RESILIENCE
              </span>

              <div className="text-6xl sm:text-7xl font-bold my-4 text-bamboo">
                {overallScore}
                <span className="text-2xl text-muted-foreground font-normal">/100</span>
              </div>

              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 border bg-bamboo/10 border-bamboo/30 text-bamboo">
                {overallScore >= 75 ? "RESILIENT • READY FOR CLIMATE ACCELERATION" : overallScore >= 55 ? "MODERATE BUFFER • RETROFIT RECOMMENDED" : "VULNERABLE • ACTION REQUIRED"}
              </div>

              <div className="w-full space-y-2 text-left text-xs pt-4 border-t border-white/10">
                <div className="flex justify-between text-white/70">
                  <span>Climate Exposure</span>
                  <span className="font-bold text-white">{climateParam}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Environment &amp; Soil</span>
                  <span className="font-bold text-white">{envParam}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Hazard Mitigation</span>
                  <span className="font-bold text-white">{hazardParam}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Structural Redundancy</span>
                  <span className="font-bold text-white">{infraParam}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Community Stewardship</span>
                  <span className="font-bold text-white">{communityParam}</span>
                </div>
              </div>

              <Link
                href="/collaborate/contact"
                className="w-full mt-6 py-3 rounded bg-bamboo text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-bamboo-dark transition-colors"
              >
                Assess your project →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
