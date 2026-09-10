"use client";

import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import { useCountUp } from "@/lib/hooks/useCountUp";
import Link from "next/link";

const JOURNEY_STEPS = [
  { label: "IDEA", icon: "◇" },
  { label: "DIAGNOSE", icon: "◈" },
  { label: "PLAN", icon: "▢" },
  { label: "LEARN", icon: "△" },
  { label: "CONNECT", icon: "◎" },
  { label: "FINANCE", icon: "⬡" },
  { label: "GROW", icon: "●" },
];

const DASHBOARD_SCORES = [
  { label: "Market", value: 71, color: "hsl(var(--bamboo))" },
  { label: "Finance", value: 43, color: "hsl(0, 60%, 55%)" },
  { label: "Operations", value: 68, color: "hsl(40, 60%, 55%)" },
  { label: "Digital", value: 54, color: "hsl(200, 60%, 55%)" },
  { label: "Sustainability", value: 81, color: "hsl(var(--bamboo-light))" },
];

function ScoreBar({
  label,
  value,
  color,
  enabled,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  enabled: boolean;
  delay: number;
}) {
  const count = useCountUp({ end: value, enabled, duration: 1500 });

  return (
    <div
      className="transition-all duration-500"
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-mono text-white/50 tracking-[0.1em] uppercase">
          {label}
        </span>
        <span className="text-[13px] font-mono text-white/80 font-medium">
          {count}
        </span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-[1.5s] ease-out"
          style={{
            width: enabled ? `${value}%` : "0%",
            backgroundColor: color,
            transitionDelay: `${delay}s`,
          }}
        />
      </div>
    </div>
  );
}

export function EnterpriseSection() {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();
  const overallScore = useCountUp({ end: 62, enabled: isVisible, duration: 2000 });

  return (
    <section
      className="py-24 md:py-32 bg-[hsl(28,20%,12%)] text-[hsl(40,15%,92%)]"
      ref={ref}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — Content */}
          <div>
            <div
              className={`transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
                Good ideas shouldn&apos;t fail because people don&apos;t know what to do
                next.
              </h2>
              <p className="text-lg text-white/40 mb-12 max-w-md">
                Our AI incubation system helps entrepreneurs understand, plan, and grow.
              </p>
            </div>

            {/* Journey steps */}
            <div className="space-y-0">
              {JOURNEY_STEPS.map((step, i) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-4 py-3 border-b border-white/5 transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
                >
                  <span className="text-[hsl(28,35%,57%)] text-sm w-5">
                    {step.icon}
                  </span>
                  <span className="text-[11px] font-display tracking-[0.15em] uppercase font-medium text-white/60">
                    {step.label}
                  </span>
                  {i < JOURNEY_STEPS.length - 1 && (
                    <span className="ml-auto text-white/10 text-xs">↓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Dashboard */}
          <div
            className={`transition-all duration-700 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="border border-white/8 bg-white/[0.02] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-mono tracking-[0.15em] uppercase text-white/40">
                  Enterprise Health
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-[hsl(28,35%,57%)]">
                    {overallScore}
                  </span>
                  <span className="text-sm text-white/30 font-mono">/ 100</span>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                {DASHBOARD_SCORES.map((score, i) => (
                  <ScoreBar
                    key={score.label}
                    label={score.label}
                    value={score.value}
                    color={score.color}
                    enabled={isVisible}
                    delay={0.6 + i * 0.15}
                  />
                ))}
              </div>

              <div className="border-t border-white/5 pt-5">
                <span className="text-[10px] font-mono text-white/30 tracking-[0.1em] uppercase block mb-2">
                  Top priority
                </span>
                <p className="text-sm text-white/70">
                  Improve financial record keeping.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/enterprise"
                className="inline-flex items-center gap-2 text-sm font-display font-medium tracking-[0.1em] uppercase text-[hsl(28,35%,57%)] hover:text-bamboo transition-colors duration-300"
              >
                Explore Enterprise Intelligence →
              </Link>
            </div>
            <Link
              href="/collaborate/partnerships"
              className="inline-flex mt-2 items-center gap-2 text-xs font-display tracking-[0.05em] text-white/40 hover:text-white/60 transition-colors duration-300"
            >
              Become an ecosystem partner
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
