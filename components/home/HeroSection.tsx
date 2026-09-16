"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sprout } from "lucide-react";
import { useMousePosition } from "@/lib/hooks/useMousePosition";

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
      const lineColor = isDark ? "rgba(124,159,46,0.08)" : "rgba(93,121,36,0.12)";
      const pointColor = isDark ? "rgba(164,186,101,0.8)" : "rgba(75,102,24,0.75)";
      const connectionColor = isDark ? "rgba(0,212,170,0.16)" : "rgba(6,114,110,0.16)";
      const labelColor = isDark ? "rgba(164,186,101,0.9)" : "rgba(46,66,17,0.85)";

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
      {/* Background Image: Sprouting Moss and Sapling Emerging from Fertile Ground */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <Image
          src="/images/hero-moss-sprout.jpg"
          alt="Lush green moss and saplings sprouting from fertile ground with morning dewdrops"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_70%] sm:object-[center_60%] scale-[1.02] brightness-[1.03] contrast-[1.02]"
        />

        {/* Ambient Light Theme Overlay Gradients for Readability and Depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/30 dark:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-background/50 dark:hidden" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-background/80 via-transparent to-transparent dark:hidden" />

        {/* Ambient Dark Theme Overlay Gradients */}
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-r from-background/95 via-background/85 to-background/50" />
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-t from-background via-background/35 to-background/75" />
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-background/90 via-transparent to-transparent" />
      </div>

      {/* Interactive Topographic & Telemetry Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-1 pointer-events-none"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono tracking-widest uppercase bg-bamboo/15 text-bamboo-dark dark:text-bamboo-light border border-bamboo/30 rounded-full mb-6 backdrop-blur-md shadow-xs">
            <Sprout className="w-3.5 h-3.5 text-bamboo animate-pulse" />
            <span>01 • THE LIVING PLATFORM</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
            INTELLIGENCE FOR
            <br />
            <span className="text-bamboo-dark/85 dark:text-bamboo-light/95">A living planet.</span>
          </h1>

          <p className="text-lg sm:text-xl text-foreground/80 dark:text-muted-foreground max-w-xl mb-10 leading-relaxed font-normal">
            Environmental intelligence, technology, enterprise and people working
            together to build systems that can last.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/lab"
              className="inline-flex px-7 py-3.5 text-xs font-display font-medium tracking-[0.15em] uppercase bg-foreground text-background hover:bg-bamboo hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Explore the Lab
            </Link>
            <Link
              href="/collaborate/contact"
              className="inline-flex px-7 py-3.5 text-xs font-display font-medium tracking-[0.15em] uppercase border border-foreground/30 bg-background/50 backdrop-blur-sm text-foreground hover:border-bamboo hover:text-bamboo hover:bg-background/80 transition-all duration-300"
            >
              Work with us
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-float pointer-events-none">
        <span className="text-[10px] font-mono text-foreground/50 dark:text-muted-foreground/40 tracking-[0.2em] uppercase">
          Scroll
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-foreground/30 dark:from-muted-foreground/30 to-transparent" />
      </div>
    </section>
  );
}
