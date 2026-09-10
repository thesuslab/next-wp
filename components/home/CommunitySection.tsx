"use client";

import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import Link from "next/link";

const COMMUNITY_CARDS = [
  {
    title: "Climate entrepreneurs",
    description: "Build your company.",
    icon: "🌱",
  },
  {
    title: "Researchers",
    description: "Turn evidence into action.",
    icon: "🔬",
  },
  {
    title: "Technologists",
    description: "Build tools for real-world problems.",
    icon: "⚡",
  },
  {
    title: "Designers",
    description: "Make sustainable ideas usable.",
    icon: "✦",
  },
  {
    title: "Organizations",
    description: "Find collaborators.",
    icon: "◎",
  },
  {
    title: "Curious humans",
    description: "Start somewhere.",
    icon: "◉",
  },
];

export function CommunitySection() {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();

  return (
    <section className="py-24 md:py-32 bg-surface" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
        <div
          className={`max-w-3xl mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            You don&apos;t have to work for Sustainability Lab to belong here.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMUNITY_CARDS.map((card, i) => (
            <div
              key={card.title}
              className={`group border border-border/30 p-6 sm:p-8 hover:border-bamboo/30 hover:bg-bamboo/[0.02] transition-all duration-500 cursor-default ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
            >
              <span className="text-2xl mb-4 block opacity-60 group-hover:opacity-100 transition-opacity">
                {card.icon}
              </span>
              <h3 className="font-display text-lg font-bold tracking-tight mb-2 group-hover:text-bamboo transition-colors duration-300">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`text-center mt-12 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/community"
            className="inline-flex px-7 py-3.5 text-xs font-display font-medium tracking-[0.15em] uppercase bg-foreground text-background hover:bg-bamboo hover:text-white transition-all duration-300"
          >
            Join the community
          </Link>
        </div>
      </div>
    </section>
  );
}
