"use client";

import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import Link from "next/link";

const HAZARDS = [
  { label: "FLOOD", position: 15 },
  { label: "HEAT", position: 30 },
  { label: "LANDSLIDE", position: 48 },
  { label: "WATER STRESS", position: 65 },
  { label: "EXTREME RAINFALL", position: 82 },
];

const RESILIENCE_STEPS = [
  "Assess",
  "Anticipate",
  "Adapt",
  "Build",
  "Monitor",
];

export function ResilienceSection() {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();

  return (
    <section className="py-24 md:py-32 bg-surface" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
        <div
          className={`max-w-4xl mb-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-2">
            Infrastructure shouldn&apos;t just survive today.
          </h2>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-muted-foreground/50">
            It should anticipate tomorrow.
          </h2>
        </div>

        {/* Timeline */}
        <div
          className={`mb-20 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="h-[1px] bg-border w-full relative">
              <div
                className="absolute inset-y-0 left-0 bg-data/40 transition-all duration-[2s] ease-out"
                style={{ width: isVisible ? "100%" : "0%" }}
              />
            </div>

            {/* Year markers */}
            <div className="flex justify-between mt-3 mb-8">
              <span className="text-[11px] font-mono text-muted-foreground/60">TODAY</span>
              <span className="text-[11px] font-mono text-muted-foreground/60">2030</span>
              <span className="text-[11px] font-mono text-muted-foreground/60">2050</span>
            </div>

            {/* Hazards */}
            <div className="relative h-16">
              {HAZARDS.map((hazard, i) => (
                <div
                  key={hazard.label}
                  className={`absolute top-0 transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    left: `${hazard.position}%`,
                    transform: `translateX(-50%)`,
                    transitionDelay: `${0.5 + i * 0.2}s`,
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive/60 mb-2" />
                    <span className="text-[9px] sm:text-[10px] font-mono text-destructive/70 tracking-[0.1em] whitespace-nowrap">
                      {hazard.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resilience lens */}
        <div
          className={`transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="text-[11px] font-mono text-muted-foreground/50 tracking-[0.2em] uppercase mb-8">
            Our resilience lens
          </h3>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-12">
            {RESILIENCE_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-3 sm:gap-4">
                <span
                  className={`font-display text-lg sm:text-xl font-bold tracking-tight transition-all duration-500 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: `${0.8 + i * 0.15}s` }}
                >
                  {step}
                </span>
                {i < RESILIENCE_STEPS.length - 1 && (
                  <span className="text-muted-foreground/30 text-xs">→</span>
                )}
              </div>
            ))}
          </div>

          <Link
            href="/resilience"
            className="inline-flex items-center gap-2 text-sm font-display font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-data transition-colors duration-300"
          >
            Explore Resilience
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
