"use client";

import { useState } from "react";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import Link from "next/link";

const HOTSPOTS = [
  {
    id: "work",
    label: "WORK",
    sublabel: "Coworking",
    x: 20,
    y: 30,
    width: 25,
    height: 35,
  },
  {
    id: "meet",
    label: "MEET",
    sublabel: "Partner meetings",
    x: 50,
    y: 20,
    width: 20,
    height: 25,
  },
  {
    id: "learn",
    label: "LEARN",
    sublabel: "Workshops",
    x: 75,
    y: 30,
    width: 20,
    height: 30,
  },
  {
    id: "build",
    label: "BUILD",
    sublabel: "Project teams",
    x: 35,
    y: 65,
    width: 30,
    height: 25,
  },
  {
    id: "connect",
    label: "CONNECT",
    sublabel: "Community",
    x: 70,
    y: 68,
    width: 22,
    height: 22,
  },
];

export function PhysicalLabSection() {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section className="py-24 md:py-32" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
        <div
          className={`max-w-3xl mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            A place for people working on the future.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            The Lab is also a physical space for people working on climate,
            sustainability, technology, research, entrepreneurship and social
            change.
          </p>
        </div>

        {/* Floor plan interactive */}
        <div
          className={`transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative border border-border/30 bg-surface aspect-[16/9] max-w-4xl mx-auto overflow-hidden">
            {/* Grid background */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {Array.from({ length: 20 }).map((_, i) => (
                <g key={i}>
                  <line
                    x1={`${i * 5}%`}
                    y1="0"
                    x2={`${i * 5}%`}
                    y2="100%"
                    stroke="currentColor"
                    strokeOpacity={0.03}
                    strokeWidth={0.5}
                  />
                  <line
                    x1="0"
                    y1={`${i * 5}%`}
                    x2="100%"
                    y2={`${i * 5}%`}
                    stroke="currentColor"
                    strokeOpacity={0.03}
                    strokeWidth={0.5}
                  />
                </g>
              ))}
            </svg>

            {/* Hotspots */}
            {HOTSPOTS.map((spot) => {
              const isActive = activeHotspot === spot.id;
              return (
                <div
                  key={spot.id}
                  className={`absolute cursor-pointer transition-all duration-300 flex items-center justify-center border ${
                    isActive
                      ? "border-bamboo/50 bg-bamboo/10"
                      : "border-border/20 bg-foreground/[0.01] hover:border-bamboo/30 hover:bg-bamboo/[0.02]"
                  }`}
                  style={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    width: `${spot.width}%`,
                    height: `${spot.height}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => setActiveHotspot(spot.id)}
                  onMouseLeave={() => setActiveHotspot(null)}
                >
                  <div className="text-center">
                    <span
                      className={`block text-[10px] sm:text-[11px] font-display font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${
                        isActive ? "text-bamboo" : "text-muted-foreground/50"
                      }`}
                    >
                      {spot.label}
                    </span>
                    {isActive && (
                      <span className="block text-[9px] sm:text-[10px] text-muted-foreground/40 mt-1 animate-fade-in">
                        {spot.sublabel}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/community/coworking"
              className="inline-flex items-center gap-2 text-sm font-display font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-bamboo transition-colors duration-300"
            >
              Work from the Lab
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
