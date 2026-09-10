"use client";

import { useState } from "react";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import Link from "next/link";

const PARTNER_NODES = [
  { id: "government", label: "GOVERNMENT", x: 50, y: 8 },
  { id: "research", label: "RESEARCH", x: 25, y: 32 },
  { id: "business", label: "BUSINESS", x: 75, y: 32 },
  { id: "community", label: "COMMUNITY", x: 18, y: 68 },
  { id: "technology", label: "TECHNOLOGY", x: 82, y: 68 },
  { id: "finance", label: "FINANCE", x: 50, y: 92 },
];

const PARTNER_EDGES = [
  ["government", "research"],
  ["government", "business"],
  ["research", "business"],
  ["research", "community"],
  ["business", "technology"],
  ["community", "finance"],
  ["technology", "finance"],
  ["community", "technology"],
  ["research", "finance"],
  ["business", "finance"],
];

export function PartnershipsSection() {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getNode = (id: string) => PARTNER_NODES.find((n) => n.id === id)!;

  const isConnected = (nodeId: string) => {
    if (!hoveredNode) return true;
    if (nodeId === hoveredNode) return true;
    return PARTNER_EDGES.some(
      ([a, b]) =>
        (a === hoveredNode && b === nodeId) ||
        (b === hoveredNode && a === nodeId)
    );
  };

  return (
    <section className="py-24 md:py-32" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Some problems are too big to solve alone.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We partner with organizations that bring knowledge, resources,
            networks, technology and ambition to problems worth solving.
          </p>
        </div>

        {/* Partner network */}
        <div
          className={`max-w-lg mx-auto mb-12 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <svg viewBox="0 0 100 100" className="w-full" style={{ maxHeight: "400px" }}>
            {/* Edges */}
            {PARTNER_EDGES.map(([from, to], i) => {
              const a = getNode(from);
              const b = getNode(to);
              const highlighted = hoveredNode
                ? from === hoveredNode || to === hoveredNode
                : false;
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={highlighted ? "hsl(var(--bamboo))" : "currentColor"}
                  strokeOpacity={
                    hoveredNode ? (highlighted ? 0.6 : 0.05) : 0.1
                  }
                  strokeWidth={highlighted ? 0.35 : 0.15}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Nodes */}
            {PARTNER_NODES.map((node) => {
              const connected = isConnected(node.id);
              const isHovered = hoveredNode === node.id;
              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{
                    opacity: hoveredNode ? (connected ? 1 : 0.15) : 1,
                    transition: "opacity 0.3s",
                  }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered ? 2.2 : 1.5}
                    fill={isHovered ? "hsl(var(--bamboo))" : "currentColor"}
                    opacity={isHovered ? 1 : 0.4}
                    className="transition-all duration-300"
                  />
                  <text
                    x={node.x}
                    y={node.y + (node.y < 50 ? -4 : 5)}
                    textAnchor="middle"
                    className="fill-current font-display"
                    style={{
                      fontSize: "2.2px",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      fill: isHovered ? "hsl(var(--bamboo))" : undefined,
                      transition: "fill 0.3s",
                    }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div
          className={`text-center transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/collaborate/partnerships"
            className="inline-flex px-7 py-3.5 text-xs font-display font-medium tracking-[0.15em] uppercase border border-foreground/20 text-foreground hover:border-bamboo hover:text-bamboo transition-all duration-300"
          >
            Partner with us
          </Link>
        </div>
      </div>
    </section>
  );
}
