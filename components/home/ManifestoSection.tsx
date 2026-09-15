"use client";

import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

const MANIFESTO_LINES_1 = [
  "We don't have all the answers.",
  "That's why we're building a Lab.",
  "",
  "We investigate.",
  "We prototype.",
  "We test.",
  "We fail.",
  "We learn.",
  "We try again.",
];

const MANIFESTO_LINES_2 = [
  "The point isn't to predict the future.",
  "It's to make ourselves ready for it.",
];

export function ManifestoSection() {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
  });

  return (
    <section
      ref={ref}
      className="py-32 md:py-48 bg-[#11130e] text-white relative overflow-hidden border-y border-white/10"
    >
      {/* Subtle ambient bio-luminescent glow */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, hsl(var(--bamboo) / 0.25) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8">
        <div className="max-w-3xl mx-auto">
          {/* First block */}
          <div className="mb-16">
            {MANIFESTO_LINES_1.map((line, i) => {
              if (line === "") {
                return <div key={i} className="h-6" />;
              }
              return (
                <p
                  key={i}
                  className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.3] mb-1 transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    transitionDelay: `${i * 0.12}s`,
                    color:
                      i >= 3
                        ? "rgba(255,255,255,0.55)"
                        : "rgba(255,255,255,0.95)",
                  }}
                >
                  {line}
                </p>
              );
            })}
          </div>

          {/* Second block */}
          <div className="border-t border-white/10 pt-12">
            {MANIFESTO_LINES_2.map((line, i) => (
              <p
                key={i}
                className={`font-display text-xl sm:text-2xl md:text-3xl font-medium tracking-tight leading-[1.3] mb-1 transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: `${1.3 + i * 0.15}s`,
                  color:
                    i === 0
                      ? "rgba(255,255,255,0.55)"
                      : "hsl(var(--bamboo-light))",
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
