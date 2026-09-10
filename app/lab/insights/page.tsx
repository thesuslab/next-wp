"use client";

import { useState } from "react";
import Link from "next/link";

interface Article {
  id: string;
  category: "FIELD NOTES" | "RESEARCH" | "CLIMATE" | "TECHNOLOGY" | "ENTERPRISE" | "MATERIALS" | "OPINION";
  title: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  isFeatured?: boolean;
}

const articles: Article[] = [
  {
    id: "fn-01",
    category: "FIELD NOTES",
    title: "Why Himalayan Hydrology Cannot Be Governed by 20th-Century Historical Averages",
    author: "Dr. Sunita Shrestha",
    date: "September 02, 2026",
    readTime: "9 min read",
    excerpt: "Dispatches from the Upper Trishuli catchment: as glacial lake volumes expand and cloudburst frequency increases by 28%, our engineering calculations for run-of-river desanding basins must abandon static historical return periods.",
    isFeatured: true,
  },
  {
    id: "fn-02",
    category: "MATERIALS",
    title: "The Mineralized Strength of 90-Year-Old Shorea Robusta (Sal)",
    author: "Karma Wangdi",
    date: "August 24, 2026",
    readTime: "6 min read",
    excerpt: "Laboratory compressive testing of salvaged heritage timber reveals an unexpected finding: century-old heartwood exhibits 18% higher structural shear strength than kiln-dried virgin lumber due to slow silica mineralization.",
  },
  {
    id: "fn-03",
    category: "TECHNOLOGY",
    title: "Deploying Edge-AI IoT Gauges on Ungauged Mountain Streams",
    author: "Ashutosh Gautam",
    date: "August 12, 2026",
    readTime: "7 min read",
    excerpt: "Commercial flood telemetry stations cost $8,000 each and frequently wash away during flash debris surges. How we built $120 solar-powered ultrasonic mesh nodes that communicate over LoRaWAN.",
  },
  {
    id: "fn-04",
    category: "ENTERPRISE",
    title: "The Working Capital Trap in Rural Circular Economy Startups",
    author: "Aarav Adhikari",
    date: "July 29, 2026",
    readTime: "8 min read",
    excerpt: "Why agri-waste conversion ventures fail even when product margins are healthy: analyzing the critical 3-week harvest payment crunch that traditional banking credit fails to solve.",
  },
  {
    id: "fn-05",
    category: "OPINION",
    title: "Stop Selling Carbon Offsets That No Local Forest Custodian Can Audit",
    author: "Pooja Gurung",
    date: "July 14, 2026",
    readTime: "5 min read",
    excerpt: "Voluntary carbon registries have become financial instruments divorced from actual community land tenure. A call for verifiable open satellite telemetry directly tied to community payouts.",
  },
];

const categories = ["ALL", "FIELD NOTES", "RESEARCH", "CLIMATE", "TECHNOLOGY", "ENTERPRISE", "MATERIALS", "OPINION"] as const;

export default function FieldNotesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const featured = articles.find((a) => a.isFeatured) || articles[0];
  const listArticles = articles.filter((a) => {
    if (selectedCategory === "ALL") return true;
    return a.category === selectedCategory;
  });

  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
          <Link href="/lab" className="hover:text-data transition-colors">
            THE LAB
          </Link>
          <span>/</span>
          <span className="text-foreground">FIELD NOTES</span>
        </div>

        {/* Hero */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-foreground/5 text-foreground border border-border rounded-full mb-6">
            EDITORIAL DISPATCHES
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
            FIELD NOTES &amp; <br />
            <span className="text-data">LAB THINKING.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            Working hypotheses, technical findings, and critical essays written directly by our practitioners from high-altitude watersheds, craft benches, and software terminals.
          </p>
        </div>

        {/* Featured Article Banner */}
        {selectedCategory === "ALL" && (
          <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-card via-background to-card border border-data/30 mb-16 shadow-2xl">
            <div className="flex items-center gap-3 font-mono text-xs mb-4">
              <span className="px-2.5 py-0.5 rounded bg-data/10 text-data border border-data/30 font-bold">
                FEATURED DISPATCH
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{featured.date}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{featured.readTime}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight mb-4 max-w-3xl leading-tight">
              {featured.title}
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-6">
              {featured.excerpt}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-border/40 text-xs font-mono">
              <span className="text-foreground font-semibold">By {featured.author}</span>
              <span className="text-data font-bold hover:underline cursor-pointer">
                Read Full Dispatch →
              </span>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-border/40">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? "bg-data text-black font-semibold shadow-[0_0_12px_rgba(0,212,170,0.3)]"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {listArticles.map((art) => (
            <article
              key={art.id}
              className="p-8 rounded-2xl bg-card border border-border/70 hover:border-data/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-3">
                  <span className="px-2 py-0.5 rounded bg-muted text-foreground">
                    {art.category}
                  </span>
                  <span>{art.readTime}</span>
                </div>

                <h3 className="font-display font-bold text-xl leading-snug group-hover:text-data transition-colors mb-3">
                  {art.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-light">
                  {art.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs font-mono">
                <span className="text-muted-foreground">{art.author}</span>
                <span className="text-data group-hover:translate-x-1 transition-transform">
                  Read →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
