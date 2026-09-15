"use client";

import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import Link from "next/link";
import {
  Sprout,
  Microscope,
  Zap,
  Sparkles,
  Building2,
  Compass,
} from "lucide-react";

const COMMUNITY_CARDS = [
  {
    title: "Climate entrepreneurs",
    description: "Build your company.",
    icon: Sprout,
  },
  {
    title: "Researchers",
    description: "Turn evidence into action.",
    icon: Microscope,
  },
  {
    title: "Technologists",
    description: "Build tools for real-world problems.",
    icon: Zap,
  },
  {
    title: "Designers",
    description: "Make sustainable ideas usable.",
    icon: Sparkles,
  },
  {
    title: "Organizations",
    description: "Find collaborators.",
    icon: Building2,
  },
  {
    title: "Curious humans",
    description: "Start somewhere.",
    icon: Compass,
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
          {COMMUNITY_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`group border border-border/30 p-6 sm:p-8 hover:border-bamboo/30 hover:bg-bamboo/[0.02] transition-all duration-500 cursor-default ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-lg bg-bamboo/10 text-bamboo flex items-center justify-center mb-5 group-hover:bg-bamboo/20 group-hover:scale-105 transition-all duration-300">
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>
                <h3 className="font-display text-lg font-bold tracking-tight mb-2 group-hover:text-bamboo transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
              </div>
            );
          })}
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
