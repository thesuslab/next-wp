"use client";

import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import Link from "next/link";

const ITEMS = [
  "A project.",
  "A business.",
  "A dataset.",
  "A research question.",
  "A climate challenge.",
  "An idea.",
  "A room full of people who should meet.",
];

export function FinalCTASection() {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();

  return (
    <section ref={ref} className="py-32 md:py-48 relative overflow-hidden">
      {/* Atmospheric gradient background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, hsl(var(--bamboo), 0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, hsl(28, 35%, 57%, 0.08) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className={`font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-10 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Have a problem worth solving?
          </h2>

          <p
            className={`text-lg text-muted-foreground mb-8 transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Maybe you have:
          </p>

          <div className="space-y-2 mb-12">
            {ITEMS.map((item, i) => (
              <p
                key={i}
                className={`text-lg sm:text-xl text-muted-foreground/70 transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${0.4 + i * 0.1}s` }}
              >
                {item}
              </p>
            ))}
          </div>

          <p
            className={`font-display text-2xl sm:text-3xl font-bold tracking-tight mb-10 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "1.2s" }}
          >
            Bring it to the Lab.
          </p>

          <div
            className={`flex flex-wrap justify-center gap-4 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "1.4s" }}
          >
            <Link
              href="/collaborate/contact"
              className="inline-flex px-8 py-4 text-xs font-display font-medium tracking-[0.15em] uppercase bg-foreground text-background hover:bg-bamboo hover:text-white transition-all duration-300"
            >
              Start a conversation
            </Link>
            <Link
              href="/community/coworking"
              className="inline-flex px-8 py-4 text-xs font-display font-medium tracking-[0.15em] uppercase border border-foreground/20 text-foreground hover:border-bamboo hover:text-bamboo transition-all duration-300"
            >
              Visit the Lab
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
