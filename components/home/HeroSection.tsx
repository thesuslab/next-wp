"use client";

import { useRef, useEffect, useCallback } from "react";
import { useMousePosition } from "@/lib/hooks/useMousePosition";
import Link from "next/link";

interface DataPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label?: string;
  size: number;
}

const LABELS = ["CLIMATE", "DATA", "INFRASTRUCTURE", "ENTERPRISE", "COMMUNITY"];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<DataPoint[]>([]);
  const animFrameRef = useRef<number>(0);
  const mouse = useMousePosition(containerRef);

  const initPoints = useCallback((width: number, height: number) => {
    const points: DataPoint[] = [];
    const count = Math.min(80, Math.floor((width * height) / 12000));

    for (let i = 0; i < count; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        label: i < LABELS.length ? LABELS[i] : undefined,
        size: Math.random() * 2 + 1,
      });
    }
    pointsRef.current = points;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      if (pointsRef.current.length === 0) {
        initPoints(rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Draw topographic lines
      const isDark = document.documentElement.classList.contains("dark");
      const lineColor = isDark ? "rgba(124,159,46,0.07)" : "rgba(93,121,36,0.06)";
      const pointColor = isDark ? "rgba(124,159,46,0.75)" : "rgba(93,121,36,0.7)";
      const connectionColor = isDark ? "rgba(0,212,170,0.18)" : "rgba(6,114,110,0.14)";
      const labelColor = isDark ? "rgba(164,186,101,0.9)" : "rgba(46,66,17,0.8)";

      // Topographic contour lines
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        const yBase = (h / 12) * i + Math.sin(Date.now() / 4000 + i) * 15;
        ctx.moveTo(0, yBase);
        for (let x = 0; x < w; x += 4) {
          const mouseInfluence =
            Math.exp(-Math.pow(x - mouse.x, 2) / 40000 - Math.pow(yBase - mouse.y, 2) / 40000) * 25;
          const y = yBase + Math.sin(x / 120 + i * 0.5 + Date.now() / 5000) * 20 + mouseInfluence;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Update and draw points
      const points = pointsRef.current;
      for (const point of points) {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0 || point.x > w) point.vx *= -1;
        if (point.y < 0 || point.y > h) point.vy *= -1;

        // Mouse attraction
        const dx = mouse.x - point.x;
        const dy = mouse.y - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          point.vx += dx * 0.00005;
          point.vy += dy * 0.00005;
        }

        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = pointColor;
        ctx.fill();

        // Draw label near cursor
        if (point.label && dist < 150) {
          ctx.font = "9px 'Space Grotesk', sans-serif";
          ctx.fillStyle = labelColor;
          ctx.globalAlpha = Math.max(0, 1 - dist / 150);
          ctx.fillText(point.label, point.x + 8, point.y - 8);
          ctx.globalAlpha = 1;
        }
      }

      // Draw connections
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = connectionColor;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [mouse.x, mouse.y, initPoints]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[64px] pt-[64px]"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-bamboo/10 text-bamboo border border-bamboo/30 rounded-full mb-6">
            01 • THE LIVING PLATFORM
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
            INTELLIGENCE FOR
            <br />
            <span className="text-muted-foreground/60">A living planet.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
            Environmental intelligence, technology, enterprise and people working
            together to build systems that can last.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/lab"
              className="inline-flex px-7 py-3.5 text-xs font-display font-medium tracking-[0.15em] uppercase bg-foreground text-background hover:bg-bamboo hover:text-white transition-all duration-300"
            >
              Explore the Lab
            </Link>
            <Link
              href="/collaborate/contact"
              className="inline-flex px-7 py-3.5 text-xs font-display font-medium tracking-[0.15em] uppercase border border-foreground/20 text-foreground hover:border-bamboo hover:text-bamboo transition-all duration-300"
            >
              Work with us
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <span className="text-[10px] font-mono text-muted-foreground/40 tracking-[0.2em] uppercase">
          Scroll
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-muted-foreground/30 to-transparent" />
      </div>
    </section>
  );
}
