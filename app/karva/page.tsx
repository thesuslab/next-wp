"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Specimen {
  id: string;
  name: string;
  origin: string;
  age: string;
  transformation: string;
  outcome: string;
  embodiedCarbonSaving: string;
  detail: string;
  image: string;
  imageAlt: string;
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
    image: "/images/karva-hero.jpg",
    imageAlt: "KĀRVA handcrafted product specimen on the studio workbench",
  },
  {
    id: "specimen-02",
    name: "Dachhapa Kiln Clay Brick & Terracotta",
    origin: "Earthquake rubble salvage, Bhaktapur",
    age: "70+ Years Old",
    transformation: "Mechanically crushed, graded by micron size, blended with lime pozzolana binder",
    outcome: "Permeable urban courtyard pavers with natural evaporative cooling",
    embodiedCarbonSaving: "-68% vs Portland cement blocks",
    detail: "Retains high porosity, allowing rain infiltration directly into urban groundwater aquifers rather than sewer overflows.",
    image: "/images/lab-workbench.jpg",
    imageAlt: "KĀRVA Material Fabrication Lab: wood samples, slate prototypes, and measuring tools",
  },
  {
    id: "specimen-03",
    name: "Agricultural Bagasse & Straw Fiber Matrix",
    origin: "Post-harvest residue burning diversion, Terai",
    age: "Seasonal (2025)",
    transformation: "Hydropulped without chlorine bleaching, compression molded under low steam heat",
    outcome: "Shock-absorbing electronic device packaging & compostable containers",
    embodiedCarbonSaving: "-92% vs expanded polystyrene",
    detail: "Diverted from open-field burning which causes severe winter smog in the Indo-Gangetic plain. Degrades in soil within 45 days.",
    image: "/images/karva-macro.jpg",
    imageAlt: "Detail of natural fiber grain, pressed leaf textures, and mineral binder integration",
  },
];

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  description: string;
  aspect: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "img-01",
    src: "/images/karva-hero.jpg",
    alt: "KĀRVA handcrafted product specimen on the studio workbench",
    title: "Handcrafted Sal Specimen",
    category: "FINISHED SPECIMEN",
    description: "Handcrafted heritage Sal timber product specimen resting on the central studio workbench, finished with cold-pressed mustard oil and local beeswax.",
    aspect: "aspect-[16/10]",
  },
  {
    id: "img-02",
    src: "/images/karva-process.jpg",
    alt: "Artisan hands shaping natural materials and bio-composite forms in the workshop",
    title: "Artisan Hands at the Bench",
    category: "FABRICATION PROCESS",
    description: "Master woodworker shaping raw timber joints and testing compression molds using traditional hand chisels and non-destructive measuring gauges.",
    aspect: "aspect-[4/3]",
  },
  {
    id: "img-03",
    src: "/images/karva-macro.jpg",
    alt: "Detail of natural fiber grain, pressed leaf textures, and mineral binder integration",
    title: "Bio-Composite Surface Grain",
    category: "MATERIAL MACRO",
    description: "Extreme close-up revealing natural Shorea robusta leaf fibers bound with organic mineral matrices, eliminating the need for petroleum epoxy.",
    aspect: "aspect-[4/3]",
  },
  {
    id: "img-04",
    src: "/images/lab-workbench.jpg",
    alt: "KĀRVA Material Fabrication Lab: wood samples, slate prototypes, and measuring tools",
    title: "The Material Fabrication Lab",
    category: "RESEARCH WORKSHOP",
    description: "Active workbench with graded timber samples, regional slate cutoffs, acoustic tile prototypes, and digital moisture telemetry tools.",
    aspect: "aspect-[16/10]",
  },
  {
    id: "img-05",
    src: "/images/karva-logo.png",
    alt: "Official KĀRVA brand emblem (SL / 001)",
    title: "Official KĀRVA Brand Emblem",
    category: "IDENTITY & SEAL",
    description: "The official insignia of KĀRVA (SL / 001), representing tangible circularity, vernacular craft heritage, and practical sustainability.",
    aspect: "aspect-[16/10]",
  },
];

export default function KarvaPage() {
  const [activeSpecimen, setActiveSpecimen] = useState<Specimen>(specimens[0]);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  return (
    <main className="min-h-screen bg-[#141210] text-[#EBE7DF] pt-8 pb-28 selection:bg-[#B8926A] selection:text-black">
      {/* Top Header / Brand Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <div className="flex flex-wrap items-center justify-between py-6 border-b border-white/10 text-xs font-mono gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[#B8926A] font-bold tracking-[0.25em]">KĀRVA</span>
            <span className="text-white/20">|</span>
            <span className="text-white/50">CRAFTS BY SUSTAINABILITY LAB</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-[#B8926A]/20 text-[#B8926A] border border-[#B8926A]/30">
              SL / 001
            </span>
          </div>

          {/* Subnavigation */}
          <nav className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
            <Link href="/karva" className="text-white font-semibold border-b-2 border-[#B8926A] pb-1">
              Overview
            </Link>
            <Link href="/karva/materials" className="text-white/50 hover:text-white transition-colors pb-1">
              Materials
            </Link>
            <Link href="/karva/products" className="text-white/50 hover:text-white transition-colors pb-1">
              Products
            </Link>
            <Link href="/karva/stories" className="text-white/50 hover:text-white transition-colors pb-1">
              Stories
            </Link>
            <Link href="/" className="text-white/40 hover:text-white transition-colors ml-2">
              Return to Lab →
            </Link>
          </nav>
        </div>

        {/* Hero Section with Live Photo Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 pb-16 items-center border-b border-white/10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8926A]/15 border border-[#B8926A]/30 text-[#B8926A] text-xs font-mono tracking-widest uppercase mb-6">
              05 • TANGIBLE CIRCULARITY &amp; FABRICATION
            </div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6 leading-[0.98]">
              WHAT WE DISCARD <br />
              <span className="font-serif italic text-[#B8926A]">CAN STILL HAVE A FUTURE.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-2xl mb-8">
              KĀRVA is our physical craft and materials laboratory in Nepal. We rescue architectural salvage, century-old heritage timber, and agricultural byproducts — turning discarded matter into enduring, high-performance objects.
            </p>
            <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
              <a
                href="#gallery"
                className="px-5 py-3 rounded-lg bg-[#B8926A] text-black font-bold uppercase tracking-wider hover:bg-[#B8926A]/90 transition-all shadow-[0_0_20px_rgba(184,146,106,0.25)]"
              >
                Inspect Visual Archive ↓
              </a>
              <Link
                href="/collaborate/contact"
                className="px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-all uppercase tracking-wider"
              >
                Commission a Piece →
              </Link>
            </div>
          </div>

          {/* Hero Featured Photography Showcase */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-2xl overflow-hidden border border-[#B8926A]/40 bg-black/60 shadow-2xl">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/karva-hero.jpg"
                  alt="KĀRVA handcrafted product specimen on the studio workbench"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
                
                {/* Brand Seal Overlay */}
                <div className="absolute top-4 right-4 w-20 h-14 relative bg-black/70 backdrop-blur-md rounded-lg p-1 border border-white/20">
                  <Image
                    src="/images/karva-logo.png"
                    alt="KĀRVA Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between font-mono">
                  <div>
                    <span className="text-[10px] text-[#B8926A] uppercase tracking-widest block">
                      STUDIO BENCHMARK • SL / 001
                    </span>
                    <h3 className="text-white font-display text-base font-medium">
                      Handcrafted Shorea Robusta Specimen
                    </h3>
                  </div>
                  <button
                    onClick={() => setLightboxItem(GALLERY_ITEMS[0])}
                    className="px-2.5 py-1 rounded bg-black/70 text-[11px] text-white/80 hover:text-white border border-white/20 backdrop-blur-sm"
                  >
                    Zoom ⤢
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The 4-Stage Material Transformation Flow */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          <div className="space-y-3 p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] font-mono text-[#B8926A]">01 / MATERIAL</span>
            <h3 className="font-display text-xl text-white font-medium">Where it came from.</h3>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              We scout demolition sites, closed brick kilns, and agrarian fields for structural lumber, kiln brick, stone, and virgin fibers.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] font-mono text-[#B8926A]">02 / PROCESS</span>
            <h3 className="font-display text-xl text-white font-medium">How it was transformed.</h3>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              Non-destructive disassembly, ultrasonic grading, precision joinery, and non-toxic bio-based natural oil finishes.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] font-mono text-[#B8926A]">03 / OBJECT</span>
            <h3 className="font-display text-xl text-white font-medium">What it became.</h3>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              Functional furniture, architectural acoustic screens, research benches, and circular packaging designed for indefinite disassembly.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] font-mono text-[#B8926A]">04 / STORY</span>
            <h3 className="font-display text-xl text-white font-medium">Why it matters.</h3>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              Every piece carries its historical weathering and tool marks — proving that circularity is more beautiful than mass extraction.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Record / Photographic Documentation Gallery */}
      <section id="gallery" className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-[#B8926A] uppercase tracking-widest block mb-1">
              VISUAL RECORD &amp; DOCUMENTATION
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-light text-white">
              Studio Photography &amp; Workshop Process
            </h2>
          </div>
          <p className="text-xs font-mono text-white/50 max-w-sm">
            High-resolution photographic record of KĀRVA materials, bench testing, and handcrafted fabrication.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item, idx) => (
            <figure
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className={`group relative rounded-xl overflow-hidden border border-white/10 bg-[#181512] cursor-pointer hover:border-[#B8926A]/50 transition-all ${
                idx === 0 || idx === 3 ? "md:col-span-2 lg:col-span-2" : ""
              }`}
            >
              <div className={`relative ${item.aspect} w-full bg-black/40`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 66vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                
                {/* Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-black/70 text-[#B8926A] border border-[#B8926A]/30 uppercase backdrop-blur-md">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-mono text-white/70 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    Click to Enlarge ⤢
                  </span>
                </div>

                {/* Bottom Caption */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="font-display text-lg font-medium text-white group-hover:text-[#B8926A] transition-colors mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/60 line-clamp-2 font-sans font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            </figure>
          ))}
        </div>
      </section>

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

            {/* Specimen Image Preview */}
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/10 group">
              <Image
                src={activeSpecimen.image}
                alt={activeSpecimen.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end font-mono text-xs">
                <span className="text-white/80">{activeSpecimen.imageAlt}</span>
                <span className="text-[#B8926A] text-[10px] uppercase">Registered Photo</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 font-mono text-xs">
              <div className="text-white/40 uppercase text-[10px]">Processing Protocol</div>
              <p className="text-white/80 leading-relaxed font-sans text-xs">
                {activeSpecimen.transformation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 font-mono text-xs">
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
                <div className="text-lg font-bold text-[#B8926A]">
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

      {/* Lightbox Modal for Photo Inspection */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#161412] border border-[#B8926A]/40 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-[#B8926A]/20 text-[#B8926A] border border-[#B8926A]/30 uppercase text-[10px]">
                  {lightboxItem.category}
                </span>
                <span className="text-white font-medium">{lightboxItem.title}</span>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
              >
                ✕ Close (Esc)
              </button>
            </div>

            {/* High-Res Image View */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
              <Image
                src={lightboxItem.src}
                alt={lightboxItem.alt}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
              />
            </div>

            {/* Footer / Caption */}
            <div className="p-4 sm:p-6 bg-[#181512] border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 font-mono text-xs">
              <div className="max-w-2xl">
                <p className="text-white/80 font-sans text-sm leading-relaxed mb-1">
                  {lightboxItem.description}
                </p>
                <div className="text-[10px] text-white/40">
                  Asset Path: {lightboxItem.src}
                </div>
              </div>
              <div className="flex sm:flex-col justify-end items-end gap-2">
                <a
                  href={lightboxItem.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs text-center block transition-colors"
                >
                  Open Original ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
