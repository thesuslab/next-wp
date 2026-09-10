"use client";

import { useState } from "react";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import Link from "next/link";

const NODES = [
  { id: "climate", label: "CLIMATE", x: 50, y: 10 },
  { id: "environment", label: "ENVIRONMENT", x: 15, y: 45 },
  { id: "lab", label: "LAB", x: 50, y: 45 },
  { id: "technology", label: "TECHNOLOGY", x: 85, y: 45 },
  { id: "enterprise", label: "ENTERPRISE", x: 50, y: 75 },
  { id: "people", label: "PEOPLE", x: 50, y: 95 },
];

const EDGES = [
  ["climate", "lab"],
  ["environment", "lab"],
  ["lab", "technology"],
  ["lab", "enterprise"],
  ["enterprise", "people"],
  ["climate", "environment"],
  ["climate", "technology"],
  ["environment", "enterprise"],
  ["technology", "enterprise"],
];

export function PropositionSection() {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getNode = (id: string) => NODES.find((n) => n.id === id)!;

  const isConnected = (nodeId: string) => {
    if (!hoveredNode) return true;
    if (nodeId === hoveredNode) return true;
    return EDGES.some(
      ([a, b]) =>
        (a === hoveredNode && b === nodeId) ||
        (b === hoveredNode && a === nodeId)
    );
  };

  const isEdgeHighlighted = (edge: string[]) => {
    if (!hoveredNode) return false;
    return edge.includes(hoveredNode);
  };

  return (
    <section className="py-24 md:py-32 bg-surface" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] max-w-3xl mb-4">
            The problems are connected.
          </h2>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] max-w-3xl text-muted-foreground/50 mb-16">
            So should the solutions be.
          </h2>
        </div>

        {/* Relationship Map */}
        <div
          className={`max-w-2xl mx-auto transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <svg viewBox="0 0 100 100" className="w-full" style={{ maxHeight: "500px" }}>
            {/* Edges */}
            {EDGES.map(([from, to], i) => {
              const a = getNode(from);
              const b = getNode(to);
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  className="transition-all duration-300"
                  stroke={
                    isEdgeHighlighted([from, to])
                      ? "hsl(var(--bamboo))"
                      : "currentColor"
                  }
                  strokeOpacity={
                    hoveredNode
                      ? isEdgeHighlighted([from, to])
                        ? 0.7
                        : 0.08
                      : 0.15
                  }
                  strokeWidth={isEdgeHighlighted([from, to]) ? 0.35 : 0.15}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const connected = isConnected(node.id);
              const isHovered = hoveredNode === node.id;
              return (
                <g
                  key={node.id}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{
                    opacity: hoveredNode ? (connected ? 1 : 0.2) : 1,
                  }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered ? 2.5 : node.id === "lab" ? 2 : 1.5}
                    fill={
                      isHovered
                        ? "hsl(var(--bamboo))"
                        : node.id === "lab"
                        ? "hsl(var(--bamboo))"
                        : "currentColor"
                    }
                    className="transition-all duration-300"
                  />
                  <text
                    x={node.x}
                    y={node.y + (node.y < 50 ? -4 : 5)}
                    textAnchor="middle"
                    className="fill-current font-display transition-all duration-300"
                    style={{
                      fontSize: node.id === "lab" ? "3.5px" : "2.5px",
                      fontWeight: node.id === "lab" ? 700 : 500,
                      letterSpacing: "0.1em",
                      fill: isHovered
                        ? "hsl(var(--bamboo))"
                        : undefined,
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
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/lab/approach"
            className="inline-flex items-center gap-2 text-sm font-display font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-bamboo transition-colors duration-300"
          >
            See how we work
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
