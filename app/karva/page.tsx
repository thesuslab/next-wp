"use client";

import { useState } from "react";
import Link from "next/link";

interface Specimen {
  id: string;
  name: string;
  origin: string;
  age: string;
  transformation: string;
  outcome: string;
  embodiedCarbonSaving: string;
  detail: string;
}

const specimens: Specimen[] = [
  {
    id: "specimen-01",
    name: "Himalayan Shorea Robusta (Sal)",
    origin: "Decommissioned 1930s Rana-era heritage post, Patan",
    age: "95+ Years Old",
    transformation: "De-nailed, surface planed with hand Japanese kanna, stabilized with beeswax",
    outcome: "Modular acoustic wall baffles & low-profile research benches",
    embodiedCarbonSaving: "-84% vs imported hardwood",
    detail: "Dense heartwood with rich iron mineralization and natural termite resistance that outperforms modern virgin lumber.",
  },
  {
    id: "specimen-02",
    name: "Dachhapa Kiln Clay Brick",
    origin: "Earthquake rubble salvage, Bhaktapur",
    age: "70+ Years Old",
    transformation: "Mechanically crushed, graded by micron size, blended with lime pozzolana binder",
    outcome: "Permeable urban courtyard pavers with natural evaporative cooling",
    embodiedCarbonSaving: "-68% vs Portland cement blocks",
    detail: "Retains high porosity, allowing rain infiltration directly into urban groundwater aquifers rather than sewer overflows.",
  },
  {
    id: "specimen-03",
    name: "Agricultural Bagasse & Straw Fiber",
    origin: "Post-harvest residue burning diversion, Terai",
    age: "Seasonal (2025)",
    transformation: "Hydropulped without chlorine bleaching, compression molded under low steam heat",
    outcome: "Shock-absorbing electronic device packaging & compostable containers",
    embodiedCarbonSaving: "-92% vs expanded polystyrene",
    detail: "Diverted from open-field burning which causes severe winter smog in the Indo-Gangetic plain. Degrades in soil within 45 days.",
  },
];

export default function KarvaPage() {
  const [activeSpecimen, setActiveSpecimen] = useState<Specimen>(specimens[0]);

  return (
    <main className="min-h-screen bg-[#141210] text-[#EBE7DF] pt-8 pb-28 selection:bg-[#B8926A] selection:text-black">
      {/* Top Header / Brand Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between py-6 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-[#B8926A] font-bold tracking-[0.25em]">KĀRVA</span>
            <span className="text-white/20">|</span>
            <span className="text-white/50">CRAFTS BY SUSTAINABILITY LAB</span>
          </div>
          <Link href="/" className="text-white/40 hover:text-white transition-colors">
            Return to Lab →
          </Link>
        </div>

        {/* Minimal Hero */}
        <div className="max-w-4xl pt-12 pb-16">
          <span className="text-xs font-mono tracking-[0.3em] text-[#B8926A] uppercase block mb-4">
            05 • TANGIBLE CIRCULARITY
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-light tracking-tight text-white mb-6 leading-[0.95]">
            WHAT WE DISCARD <br />
            <span className="font-serif italic text-[#B8926A]">CAN STILL HAVE A FUTURE.</span>
          </h1>
          <p className="text-lg text-white/60 font-light leading-relaxed max-w-2xl">
            KĀRVA is our physical craft and materials laboratory. We rescue architectural salvage, industrial waste, and agricultural byproducts — turning discarded matter into enduring objects.
          </p>
        </div>
      </div>

      {/* The 4-Stage Material Transformation Flow */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          <div className="space-y-3">
            <span className="text-[11px] font-mono text-[#B8926A]">01 / MATERIAL</span>
            <h3 className="font-display text-xl text-white font-medium">Where it came from.</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              We scout demolition sites, closed kilns, and agrarian fields for structural lumber, kiln brick, stone, and virgin fibers.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-mono text-[#B8926A]">02 / PROCESS</span>
            <h3 className="font-display text-xl text-white font-medium">How it was transformed.</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Non-destructive disassembly, mechanical grading, precision joinery, and non-toxic bio-based natural oil finishes.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-mono text-[#B8926A]">03 / OBJECT</span>
            <h3 className="font-display text-xl text-white font-medium">What it became.</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Functional furniture, architectural acoustic screens, research benches, and circular packaging designed for indefinite disassembly.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-mono text-[#B8926A]">04 / STORY</span>
            <h3 className="font-display text-xl text-white font-medium">Why it matters.</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Every piece carries its historical weathering and tool marks — proving that circularity is more beautiful than mass extraction.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Material Specimen Archive */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono text-[#B8926A] uppercase tracking-widest block mb-1">
              MATERIAL ARCHIVE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-white">
              Salvaged Specimen Registry
            </h2>
          </div>
          <span className="text-xs font-mono text-white/40">
            Batch 2026 • Verified Circularity
          </span>
        </div>

        {/* Specimen Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {specimens.map((specimen) => {
            const isSelected = activeSpecimen.id === specimen.id;
            return (
              <button
                key={specimen.id}
                onClick={() => setActiveSpecimen(specimen)}
                className={`p-6 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-[#1E1A16] border-[#B8926A] shadow-[0_0_20px_rgba(184,146,106,0.15)]"
                    : "bg-[#161412] border-white/10 hover:border-white/20 text-white/60 hover:text-white"
                }`}
              >
                <div className="text-[10px] font-mono text-[#B8926A] mb-1">{specimen.age}</div>
                <h4 className="font-display font-medium text-base text-white mb-2">{specimen.name}</h4>
                <div className="text-xs text-white/50 truncate">{specimen.origin}</div>
              </button>
            );
          })}
        </div>

        {/* Active Specimen Detail Display */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#181512] border border-[#B8926A]/30 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono text-[#B8926A] uppercase tracking-widest block mb-2">
                ACTIVE SPECIMEN ANALYSIS
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-normal text-white">
                {activeSpecimen.name}
              </h3>
              <div className="text-xs font-mono text-white/50 mt-1">
                Historical Origin: {activeSpecimen.origin}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3 font-mono text-xs">
              <div className="text-white/40 uppercase text-[10px]">Processing Protocol</div>
              <p className="text-white/80 leading-relaxed font-sans text-xs">
                {activeSpecimen.transformation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3 font-mono text-xs">
              <div className="text-white/40 uppercase text-[10px]">Circularity &amp; Embodied Impact</div>
              <p className="text-white/80 leading-relaxed font-sans text-xs">
                {activeSpecimen.detail}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-black/50 p-6 rounded-xl border border-white/10 flex flex-col justify-between font-mono text-xs">
            <div className="space-y-4">
              <div className="text-[#B8926A] uppercase tracking-widest text-[10px]">
                METRIC SPECIFICATIONS
              </div>

              <div className="pb-3 border-b border-white/10">
                <div className="text-white/40 mb-1">Embodied Carbon Reduction</div>
                <div className="text-lg font-bold text-bamboo">
                  {activeSpecimen.embodiedCarbonSaving}
                </div>
              </div>

              <div className="pb-3 border-b border-white/10">
                <div className="text-white/40 mb-1">Functional Output</div>
                <div className="text-xs text-white">
                  {activeSpecimen.outcome}
                </div>
              </div>

              <div>
                <div className="text-white/40 mb-1">Material Longevity Expectancy</div>
                <div className="text-xs text-white">
                  60+ Years with modular disassemblable joints
                </div>
              </div>
            </div>

            <Link
              href="/collaborate/contact"
              className="w-full mt-8 py-3 rounded-lg bg-[#B8926A] text-black font-mono font-bold text-xs uppercase tracking-wider text-center block hover:bg-[#B8926A]/90 transition-colors"
            >
              Inquire for Commission →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
