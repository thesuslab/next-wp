"use client";

import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import Link from "next/link";

const TRANSFORMATION_STEPS = [
  { label: "DISCARDED", desc: "What was thrown away" },
  { label: "RECLAIMED", desc: "What was recovered" },
  { label: "TRANSFORMED", desc: "What was reimagined" },
  { label: "KĀRVA", desc: "What it became" },
];

const MATERIALS = [
  "wood grain",
  "reclaimed timber",
  "old brick",
  "tools",
  "engraving",
  "finished objects",
];

export function KarvaSection() {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(20, 15%, 12%) 0%, hsl(20, 10%, 8%) 100%)",
        color: "hsl(35, 25%, 85%)",
      }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Content */}
          <div>
            <div
              className={`transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-2">
                Materials have stories.
              </h2>
              <h2
                className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-6"
                style={{ color: "hsl(28, 35%, 57%)" }}
              >
                KĀRVA
              </h2>
              <p className="text-[11px] font-display tracking-[0.15em] uppercase text-white/40 mb-6">
                Crafts by the Sustainability Lab
              </p>
              <p className="text-base text-white/50 max-w-md leading-relaxed mb-10">
                KĀRVA explores reclaimed materials, circularity, craftsmanship
                and the possibility of giving discarded things another life.
              </p>
            </div>

            {/* Transformation journey */}
            <div className="space-y-0">
              {TRANSFORMATION_STEPS.map((step, i) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-4 py-4 border-b border-white/5 transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${0.4 + i * 0.15}s` }}
                >
                  <span className="text-white/15 text-xs">↓</span>
                  <span
                    className={`font-display text-lg font-bold tracking-tight ${
                      step.label === "KĀRVA"
                        ? "text-[hsl(28,35%,57%)]"
                        : "text-white/70"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[11px] text-white/30 ml-auto">
                    {step.desc}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/karva"
                className="inline-flex items-center gap-2 text-sm font-display font-medium tracking-[0.1em] uppercase text-[hsl(28,35%,57%)] hover:text-bamboo-light transition-colors duration-300"
              >
                Enter KĀRVA
                <span className="text-lg">→</span>
              </Link>
            </div>
          </div>

          {/* Right — Material grid */}
          <div
            className={`transition-all duration-700 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="grid grid-cols-2 gap-2">
              {MATERIALS.map((material, i) => (
                <div
                  key={material}
                  className={`aspect-square border border-white/5 bg-white/[0.02] flex items-end p-4 transition-all duration-500 hover:bg-white/[0.04] ${
                    i === 0 ? "col-span-2 aspect-[2/1]" : ""
                  }`}
                  style={{ transitionDelay: `${0.6 + i * 0.1}s` }}
                >
                  <span className="text-[10px] font-mono text-white/25 tracking-[0.1em] uppercase">
                    {material}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
