"use client";

import { useState, useEffect, useCallback } from "react";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import Link from "next/link";

const LOADING_STEPS = [
  "ANALYSING PROJECT TYPE...",
  "CHECKING RISK FACTORS...",
  "MAPPING KNOWLEDGE...",
];

const RESULT_CARDS = [
  { category: "ENVIRONMENT", items: "Forest / biodiversity / aquatic ecosystem", color: "hsl(var(--bamboo))" },
  { category: "CLIMATE", items: "Flood / rainfall / landslide", color: "hsl(200, 60%, 40%)" },
  { category: "SOCIAL", items: "Land / livelihood / communities", color: "hsl(28, 35%, 57%)" },
  { category: "SAFEGUARDS", items: "Assessment / monitoring / mitigation", color: "hsl(var(--circuit))" },
];

export function IntelligenceEngineSection() {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();
  const [phase, setPhase] = useState<"idle" | "loading" | "results">("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);

  const runAnalysis = useCallback(() => {
    setPhase("loading");
    setLoadingStep(0);
  }, []);

  // Auto-trigger on first visibility
  useEffect(() => {
    if (isVisible && !hasTriggered) {
      setHasTriggered(true);
      const timer = setTimeout(runAnalysis, 800);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hasTriggered, runAnalysis]);

  // Loading progression
  useEffect(() => {
    if (phase !== "loading") return;

    if (loadingStep < LOADING_STEPS.length) {
      const timer = setTimeout(() => setLoadingStep((s) => s + 1), 900);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase("results"), 400);
      return () => clearTimeout(timer);
    }
  }, [phase, loadingStep]);

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 bg-[hsl(0,0%,7%)] text-[hsl(40,15%,92%)] relative overflow-hidden"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8">
        <div
          className={`max-w-3xl mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            What if sustainability intelligence could answer back?
          </h2>
          <p className="text-lg text-[hsl(40,10%,60%)] leading-relaxed max-w-xl">
            We&apos;re building tools that combine environmental knowledge, climate
            information, data, AI and human expertise to help people make better
            decisions.
          </p>
        </div>

        {/* Terminal */}
        <div
          className={`max-w-3xl mx-auto transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="border border-white/10 bg-white/[0.02] backdrop-blur-sm">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="ml-3 text-[10px] font-mono text-white/30 tracking-[0.15em] uppercase">
                Ask the Lab
              </span>
            </div>

            {/* Terminal body */}
            <div className="p-6 sm:p-8 font-mono text-sm">
              {/* Query */}
              <div className="flex gap-3 mb-6">
                <span className="text-bamboo shrink-0">&gt;</span>
                <span className="text-white/70">
                  What environmental risks should I investigate before developing a
                  hydropower project?
                </span>
              </div>

              {/* Loading steps */}
              {phase !== "idle" && (
                <div className="space-y-2 mb-6">
                  {LOADING_STEPS.map((step, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-[11px] tracking-[0.1em] transition-all duration-300 ${
                        i <= loadingStep
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2"
                      }`}
                      style={{ transitionDelay: `${i * 0.1}s` }}
                    >
                      <span
                        className={
                          i < loadingStep
                            ? "text-bamboo"
                            : i === loadingStep && phase === "loading"
                            ? "text-white/40 animate-pulse"
                            : "text-white/20"
                        }
                      >
                        {i < loadingStep ? "✓" : "○"}
                      </span>
                      <span className="text-white/40">{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Results */}
              {phase === "results" && (
                <div className="grid sm:grid-cols-2 gap-3 animate-fade-in-up">
                  {RESULT_CARDS.map((card, i) => (
                    <div
                      key={card.category}
                      className="border border-white/8 bg-white/[0.02] p-4 transition-all duration-500"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        borderLeftColor: card.color,
                        borderLeftWidth: "2px",
                      }}
                    >
                      <h4
                        className="text-[10px] font-display tracking-[0.15em] uppercase mb-2 font-bold"
                        style={{ color: card.color }}
                      >
                        {card.category}
                      </h4>
                      <p className="text-[12px] text-white/50 leading-relaxed">
                        {card.items}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Analyse button */}
              {phase === "idle" && (
                <button
                  onClick={runAnalysis}
                  className="mt-4 px-5 py-2 text-[11px] font-display tracking-[0.15em] uppercase border border-bamboo/40 text-bamboo hover:bg-bamboo/10 transition-all duration-300"
                >
                  Analyse
                </button>
              )}
            </div>
          </div>

          {/* CTA below terminal */}
          {phase === "results" && (
            <div className="text-center mt-10 animate-fade-in">
              <Link
                href="/intelligence"
                className="inline-flex items-center gap-2 text-sm font-display font-medium tracking-[0.1em] uppercase text-bamboo hover:text-bamboo-light transition-colors"
              >
                Explore Intelligence
                <span className="text-lg">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
