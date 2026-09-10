"use client";

import { useState } from "react";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import Link from "next/link";

const DOORS = [
  {
    id: "understand",
    title: "UNDERSTAND",
    subtitle: "Environmental & Climate Intelligence",
    description:
      "Understand environmental impacts, natural resources, climate risks and vulnerabilities.",
    href: "/intelligence",
    visual: "terrain",
  },
  {
    id: "build",
    title: "BUILD",
    subtitle: "Green & Resilient Infrastructure",
    description:
      "Design infrastructure that works with nature and is prepared for uncertainty.",
    href: "/resilience",
    visual: "structure",
  },
  {
    id: "accelerate",
    title: "ACCELERATE",
    subtitle: "AI for Sustainable Enterprise",
    description:
      "Help entrepreneurs understand their businesses, build better plans and connect with the right ecosystem.",
    href: "/enterprise",
    visual: "network",
  },
];

function TerrainVisual({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="none">
      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={i}
          d={`M0 ${160 - i * 18} Q75 ${140 - i * 18 + Math.sin(i) * 10} 150 ${
            150 - i * 18
          } T300 ${145 - i * 18}`}
          fill="none"
          stroke="currentColor"
          strokeOpacity={active ? 0.3 + i * 0.05 : 0.1}
          strokeWidth={active ? 1 : 0.5}
          className="transition-all duration-500"
        />
      ))}
      {active &&
        Array.from({ length: 5 }).map((_, i) => (
          <circle
            key={`dot-${i}`}
            cx={50 + i * 55}
            cy={80 + Math.sin(i * 2) * 30}
            r={2}
            fill="hsl(var(--bamboo))"
            opacity={0.7}
            className="animate-pulse-glow"
          />
        ))}
    </svg>
  );
}

function StructureVisual({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="none">
      {/* Grid lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <line
            x1={50 + i * 40}
            y1={30}
            x2={50 + i * 40}
            y2={180}
            stroke="currentColor"
            strokeOpacity={active ? 0.2 : 0.06}
            strokeWidth={0.5}
            className="transition-all duration-500"
          />
          <line
            x1={30}
            y1={40 + i * 28}
            x2={270}
            y2={40 + i * 28}
            stroke="currentColor"
            strokeOpacity={active ? 0.2 : 0.06}
            strokeWidth={0.5}
            className="transition-all duration-500"
          />
        </g>
      ))}
      {/* Structure blocks */}
      {active && (
        <>
          <rect x={90} y={100} width={40} height={60} fill="hsl(var(--bamboo))" opacity={0.15} />
          <rect x={130} y={80} width={40} height={80} fill="hsl(var(--bamboo))" opacity={0.2} />
          <rect x={170} y={120} width={40} height={40} fill="hsl(var(--bamboo))" opacity={0.1} />
        </>
      )}
    </svg>
  );
}

function NetworkVisual({ active }: { active: boolean }) {
  const nodes = [
    { x: 150, y: 60 },
    { x: 80, y: 100 },
    { x: 220, y: 100 },
    { x: 100, y: 150 },
    { x: 200, y: 150 },
    { x: 60, y: 60 },
    { x: 240, y: 60 },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 3], [2, 4], [1, 5], [2, 6],
  ];

  return (
    <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="none">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="currentColor"
          strokeOpacity={active ? 0.25 : 0.08}
          strokeWidth={0.5}
          className="transition-all duration-500"
        />
      ))}
      {nodes.map((node, i) => (
        <circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={active ? (i === 0 ? 4 : 3) : 2}
          fill={
            active
              ? i === 0
                ? "hsl(var(--bamboo))"
                : "currentColor"
              : "currentColor"
          }
          opacity={active ? (i === 0 ? 0.8 : 0.3) : 0.15}
          className="transition-all duration-500"
        />
      ))}
    </svg>
  );
}

export function ThreeDoorsSection() {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();
  const [hoveredDoor, setHoveredDoor] = useState<string | null>(null);

  const visuals: Record<string, (props: { active: boolean }) => React.JSX.Element> = {
    terrain: TerrainVisual,
    structure: StructureVisual,
    network: NetworkVisual,
  };

  return (
    <section className="py-24 md:py-32" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
        <div className="grid md:grid-cols-3 gap-6 md:gap-4">
          {DOORS.map((door, index) => {
            const VisualComponent = visuals[door.visual];
            const isHovered = hoveredDoor === door.id;

            return (
              <Link
                key={door.id}
                href={door.href}
                className={`group relative overflow-hidden border border-border/30 p-8 md:p-10 flex flex-col justify-between min-h-[420px] transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                } ${isHovered ? "bg-foreground/[0.02]" : ""}`}
                style={{ transitionDelay: `${index * 0.15}s` }}
                onMouseEnter={() => setHoveredDoor(door.id)}
                onMouseLeave={() => setHoveredDoor(null)}
              >
                {/* Background visual */}
                <div className="absolute inset-0 opacity-50 pointer-events-none">
                  <VisualComponent active={isHovered} />
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] font-mono text-muted-foreground/40 block mb-4">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 group-hover:text-data transition-colors duration-300">
                    {door.title}
                  </h3>
                  <p className="text-sm font-display text-clay font-medium mb-4">
                    {door.subtitle}
                  </p>
                </div>

                <div className="relative z-10">
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {door.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-display font-medium tracking-[0.05em] group-hover:text-data transition-all duration-300 group-hover:gap-3">
                    Explore
                    <span className="text-base">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
