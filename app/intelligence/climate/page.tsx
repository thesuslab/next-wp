"use client";

import { useState } from "react";
import Link from "next/link";

interface ScanResult {
  hazardProfile: { name: string; score: number; level: "LOW" | "MED" | "HIGH" | "CRITICAL" }[];
  exposureRating: string;
  vulnerabilityBreakdown: string;
  recommendedActions: string[];
}

export default function ClimateIntelligencePage() {
  const [location, setLocation] = useState("Central Himalaya / Trishuli Valley");
  const [projectType, setProjectType] = useState("Hydropower Facility");
  const [projectStage, setProjectStage] = useState("Feasibility & Planning");
  const [primaryConcern, setPrimaryConcern] = useState("Flash Flood & Glacier Outburst (GLOF)");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>({
    hazardProfile: [
      { name: "GLOF & Flash Flood", score: 88, level: "CRITICAL" },
      { name: "Monsoon Landslide & Debris Flow", score: 76, level: "HIGH" },
      { name: "Sedimentation Silt Abrasion", score: 65, level: "MED" },
      { name: "Thermal Anomaly & Heat Stress", score: 32, level: "LOW" },
    ],
    exposureRating: "HIGH EXPOSURE (Spatial Grid Tile #428)",
    vulnerabilityBreakdown: "Unconsolidated glacial moraines upstream + projected +22% monsoon intensity spike under SSP2-4.5 trajectory.",
    recommendedActions: [
      "Install acoustic early-warning sensors at tributary confluence 12km upstream.",
      "Design spillway capacity with a 1:500-year return envelope rather than traditional 1:100.",
      "Establish native deep-root bio-engineering along access road embankment slopes.",
    ],
  });

  const handleRunScan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);

    setTimeout(() => {
      // Dynamic simulated result based on selection
      const isUrbanOrRoad = projectType.includes("Urban") || projectType.includes("Road");
      const isHeatOrDrought = primaryConcern.includes("Heat") || primaryConcern.includes("Water");

      setScanResult({
        hazardProfile: [
          { name: "Flash Flood & Inundation", score: isUrbanOrRoad ? 82 : 75, level: isUrbanOrRoad ? "CRITICAL" : "HIGH" },
          { name: "Thermal & Heat Stress", score: isHeatOrDrought ? 84 : 45, level: isHeatOrDrought ? "CRITICAL" : "MED" },
          { name: "Slope Failure / Landslide", score: location.includes("Himalaya") || location.includes("Hills") ? 86 : 38, level: location.includes("Himalaya") || location.includes("Hills") ? "CRITICAL" : "LOW" },
          { name: "Water Table Depletion", score: isHeatOrDrought ? 78 : 40, level: isHeatOrDrought ? "HIGH" : "LOW" },
        ],
        exposureRating: `ELEVATED EXPOSURE (${location} • ${projectType})`,
        vulnerabilityBreakdown: `Current lifecycle stage (${projectStage}) presents optimal window for structural retrofitting before lock-in occurs.`,
        recommendedActions: [
          `Target primary vulnerability: ${primaryConcern} with multi-scenario stress tests.`,
          "Integrate redundant decentralized drainage and emergency diversion paths.",
          "Establish automated satellite SAR interferometry monitoring for early ground displacement.",
        ],
      });
      setIsScanning(false);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
          <Link href="/intelligence" className="hover:text-data transition-colors">
            INTELLIGENCE
          </Link>
          <span>/</span>
          <span className="text-foreground">CLIMATE</span>
        </div>

        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
            THE CLIMATE IS CHANGING. <br />
            <span className="text-cyan-400">YOUR ASSUMPTIONS SHOULD TOO.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            Infrastructure designed on historical weather averages will fail. We model extreme weather hazards, non-linear tipping points, and actionable adaptation pathways.
          </p>
        </div>

        {/* Four Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="p-6 rounded-xl bg-card border border-border">
            <span className="text-xs font-mono text-cyan-400 block mb-2">01 • HAZARDS</span>
            <h3 className="font-display font-bold text-lg mb-2">Climate Risk</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Understand physical asset exposure, precipitation extremes, and compound regional vulnerability.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <span className="text-xs font-mono text-cyan-400 block mb-2">02 • STRATEGY</span>
            <h3 className="font-display font-bold text-lg mb-2">Adaptation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Identify and cost practical engineering and ecosystem adaptation measures before deployment.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <span className="text-xs font-mono text-cyan-400 block mb-2">03 • DISASTER REDUCTION</span>
            <h3 className="font-display font-bold text-lg mb-2">Disaster Risk (DRR)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Model flood propagation, landslide runout zones, and community vulnerability before disasters strike.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <span className="text-xs font-mono text-cyan-400 block mb-2">04 • CONTINUITY</span>
            <h3 className="font-display font-bold text-lg mb-2">Resilience</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Engineer graceful degradation into utilities and supply networks so disruptions never trigger catastrophic collapse.
            </p>
          </div>
        </div>

        {/* Interactive Climate Risk Scanner */}
        <div className="p-8 sm:p-10 rounded-2xl bg-card border border-cyan-500/30 shadow-2xl mb-16">
          <div className="mb-8 pb-6 border-b border-border/40">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2">
              PROTOTYPE TOOL • ENGINE v3.1
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Climate Risk Scanner
            </h2>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              Select project parameters below to compute real-time spatial hazard exposure
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Input Form */}
            <form onSubmit={handleRunScan} className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                  01 / Geographic Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option>Central Himalaya / Trishuli Valley</option>
                  <option>Terai Plains / Koshi River Basin</option>
                  <option>Kathmandu Urban Watershed</option>
                  <option>Western Mountain Escarpment (Karnali)</option>
                  <option>Eastern Hill Agro-Forestry Belt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                  02 / Infrastructure / Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option>Hydropower Facility</option>
                  <option>Highway / Bridge Corridor</option>
                  <option>Urban Drainage & Sponge District</option>
                  <option>Transmission & Substation Grid</option>
                  <option>Commercial Agro-Processing Hub</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                  03 / Asset Stage
                </label>
                <select
                  value={projectStage}
                  onChange={(e) => setProjectStage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option>Feasibility & Planning</option>
                  <option>Detailed Architectural Design</option>
                  <option>Active Construction</option>
                  <option>Operational Asset (Retrofit)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                  04 / Primary Vulnerability Concern
                </label>
                <select
                  value={primaryConcern}
                  onChange={(e) => setPrimaryConcern(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option>Flash Flood & Glacier Outburst (GLOF)</option>
                  <option>Extreme Heat Wave & Drought</option>
                  <option>Landslide & Slope Destabilization</option>
                  <option>Aquifer & Water Table Depletion</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="w-full mt-4 py-3 rounded-lg bg-cyan-500 text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                    Synthesizing Hazard Vectors...
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    Run Preliminary Risk Scan
                  </>
                )}
              </button>
            </form>

            {/* Results Output Screen */}
            <div className="lg:col-span-7 bg-black/60 rounded-xl border border-border/80 p-6 flex flex-col justify-between font-mono">
              {scanResult && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] text-cyan-400 uppercase tracking-widest block">
                        ASSESSMENT SUMMARY
                      </span>
                      <span className="text-xs font-bold text-white">
                        {scanResult.exposureRating}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      IPCC AR6 CALIBRATED
                    </span>
                  </div>

                  {/* Hazard Bars */}
                  <div>
                    <div className="text-[11px] text-white/50 mb-3 uppercase tracking-wider">
                      Hazard Profile Breakdown
                    </div>
                    <div className="space-y-3">
                      {scanResult.hazardProfile.map((hazard, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white/80">{hazard.name}</span>
                            <span
                              className={`font-bold ${
                                hazard.level === "CRITICAL"
                                  ? "text-rose-400"
                                  : hazard.level === "HIGH"
                                  ? "text-amber-400"
                                  : hazard.level === "MED"
                                  ? "text-cyan-400"
                                  : "text-bamboo"
                              }`}
                            >
                              {hazard.score} / 100 ({hazard.level})
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                hazard.level === "CRITICAL"
                                  ? "bg-rose-500"
                                  : hazard.level === "HIGH"
                                  ? "bg-amber-500"
                                  : hazard.level === "MED"
                                  ? "bg-cyan-500"
                                  : "bg-bamboo"
                              }`}
                              style={{ width: `${hazard.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Context & Actions */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-[11px] text-white/50 mb-2 uppercase tracking-wider">
                      Vulnerability Assessment
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed mb-4">
                      {scanResult.vulnerabilityBreakdown}
                    </p>

                    <div className="text-[11px] text-cyan-400 mb-2 uppercase tracking-wider">
                      Recommended Engineering Safeguards
                    </div>
                    <ul className="space-y-2 text-xs text-white/80">
                      {scanResult.recommendedActions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-cyan-400">›</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
