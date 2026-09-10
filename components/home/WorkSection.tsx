"use client";

import { useState } from "react";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import Link from "next/link";

const FILTERS = ["ALL", "ENVIRONMENT", "CLIMATE", "ENTERPRISE", "TECHNOLOGY", "KĀRVA"];

const PROJECTS = [
  {
    problem: "Road expansion threatens high-altitude wetlands",
    intervention: "Environmental assessment + spatial analysis",
    impact: "Alternative alignment saved 12 hectares of wetland",
    category: "ENVIRONMENT",
  },
  {
    problem: "Flood-prone highway corridor needs resilience upgrade",
    intervention: "Climate risk assessment + adaptation design",
    impact: "Infrastructure resilience score improved from 38 to 72",
    category: "CLIMATE",
  },
  {
    problem: "Young entrepreneurs lack structured business guidance",
    intervention: "AI diagnostic tool + mentorship matching",
    impact: "84 enterprises assessed, 23 connected to finance",
    category: "ENTERPRISE",
  },
  {
    problem: "Disaster response teams lack spatial intelligence",
    intervention: "Custom GIS dashboards + real-time data feeds",
    impact: "Response time reduced by 40% in pilot districts",
    category: "TECHNOLOGY",
  },
];

export function WorkSection() {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredProjects =
    activeFilter === "ALL"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section className="py-24 md:py-32 bg-surface" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
        <div
          className={`mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-8">
            Ideas we&apos;ve put to work.
          </h2>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-[10px] font-display font-medium tracking-[0.15em] uppercase transition-all duration-300 border ${
                  activeFilter === filter
                    ? "bg-bamboo text-white border-bamboo"
                    : "border-border/30 text-muted-foreground hover:border-bamboo/40 hover:text-bamboo"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {filteredProjects.map((project, i) => (
            <div
              key={i}
              className={`border border-border/30 p-6 sm:p-8 hover:border-bamboo/40 hover:bg-bamboo/[0.02] transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
            >
              <span
                className={`text-[9px] font-mono tracking-[0.15em] uppercase block mb-4 ${
                  project.category === "ENVIRONMENT"
                    ? "text-bamboo font-semibold"
                    : "text-data/70"
                }`}
              >
                {project.category}
              </span>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground/40 tracking-[0.1em] uppercase block mb-1">
                    Problem
                  </span>
                  <p className="text-sm font-medium leading-relaxed">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground/40 tracking-[0.1em] uppercase block mb-1">
                    Intervention
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.intervention}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground/40 tracking-[0.1em] uppercase block mb-1">
                    Impact
                  </span>
                  <p className="text-sm text-bamboo font-medium leading-relaxed">
                    {project.impact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`text-center mt-12 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/lab/work"
            className="inline-flex items-center gap-2 text-sm font-display font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-bamboo transition-colors duration-300"
          >
            View all work
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
