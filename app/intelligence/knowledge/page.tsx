"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface KnowledgeArticle {
  id: string;
  title: string;
  category: "Climate" | "Infrastructure" | "Enterprise" | "Environment" | "Policy" | "Tools" | "Case Studies";
  readTime: string;
  date: string;
  summary: string;
  relatedTool?: string;
  relatedProject?: string;
}

const articles: KnowledgeArticle[] = [
  {
    id: "01",
    title: "Designing Run-of-River Hydro for 2050 Glacial Hydrology Scenarios",
    category: "Climate",
    readTime: "8 min read",
    date: "Aug 2026",
    summary: "Himalayan discharge models show a 32% increase in peak monsoon flash events alongside a 14% drop in dry-season baseline flow. How engineering standards must shift.",
    relatedTool: "Climate Risk Scanner",
    relatedProject: "Trishuli Basin Hydro Baseline",
  },
  {
    id: "02",
    title: "Sponge City Retrofits in Dense Historical Newar Settlements",
    category: "Infrastructure",
    readTime: "12 min read",
    date: "Jul 2026",
    summary: "How ancient hitis, ponds (pukhuris), and permeable brick paving provide a decentralized blueprint for urban flood absorption in Patan.",
    relatedTool: "Resilience Score Calculator",
    relatedProject: "Resilient Urban Ward Pilot",
  },
  {
    id: "03",
    title: "Financing Circular Agri-Waste Enterprises in South Asia",
    category: "Enterprise",
    readTime: "10 min read",
    date: "Aug 2026",
    summary: "A practical breakdown of debt-equity ratios, concessional climate finance facilities, and working capital buffers for bio-material manufacturers.",
    relatedTool: "Enterprise Diagnostic Tool",
    relatedProject: "KĀRVA Material Experiments",
  },
  {
    id: "04",
    title: "Environmental Impact Assessments Beyond the Compliance Checkbox",
    category: "Environment",
    readTime: "7 min read",
    date: "Jun 2026",
    summary: "Moving from static paper reports to continuous spatial telemetry and living sensor networks for infrastructure projects.",
    relatedTool: "Spatial GIS Inspector",
    relatedProject: "Mid-Hill Bio-Engineering Corridor",
  },
  {
    id: "05",
    title: "Community Free, Prior & Informed Consent (FPIC) Protocol Framework",
    category: "Policy",
    readTime: "15 min read",
    date: "May 2026",
    summary: "Translating international multilateral safeguards into indigenous and community stewardship agreements in high-mountain watersheds.",
    relatedTool: "Safeguard Auditor",
    relatedProject: "Eastern Hill Agro-Forestry",
  },
  {
    id: "06",
    title: "The KĀRVA Circular Timber Salvage Standard & Testing Protocol",
    category: "Case Studies",
    readTime: "9 min read",
    date: "Jul 2026",
    summary: "Grading compressive strength and non-toxic surface treatment methods for 80-year-old salvaged Shorea robusta (Sal) architectural timber.",
    relatedTool: "Material Circularity Audit",
    relatedProject: "KĀRVA Collection 01",
  },
];

const categories = ["ALL", "Climate", "Infrastructure", "Enterprise", "Environment", "Policy", "Tools", "Case Studies"] as const;

export default function KnowledgePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCat = selectedCategory === "ALL" || art.category === selectedCategory;
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
          <Link href="/intelligence" className="hover:text-data transition-colors">
            INTELLIGENCE
          </Link>
          <span>/</span>
          <span className="text-foreground">KNOWLEDGE</span>
        </div>

        {/* Hero */}
        <div className="max-w-3xl mb-12">
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
            KNOWLEDGE FOR <br />
            <span className="text-data">PRACTITIONERS.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            Field manuals, policy blueprints, spatial models, and technical research from our lab experiments and real-world infrastructure deployments.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-6 mb-12">
          {/* Search Input */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the Lab knowledge base by topic, keyword, or project..."
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground focus:border-data focus:outline-none font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-xs font-mono text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                  selectedCategory === cat
                    ? "bg-data text-black font-semibold shadow-[0_0_12px_rgba(0,212,170,0.3)]"
                    : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="p-6 rounded-xl bg-card border border-border/60 hover:border-data/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-3">
                  <span className="px-2 py-0.5 rounded bg-muted text-foreground">
                    {art.category}
                  </span>
                  <span>{art.readTime}</span>
                </div>

                <h2 className="font-display font-bold text-lg leading-snug group-hover:text-data transition-colors mb-3">
                  {art.title}
                </h2>

                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  {art.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-border/40 space-y-3">
                {art.relatedTool && (
                  <div className="text-[10px] font-mono text-muted-foreground">
                    Related Tool: <span className="text-foreground">{art.relatedTool}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-mono font-medium text-foreground hover:text-data cursor-pointer">
                    Read Report →
                  </span>
                  <Link
                    href="/intelligence/ai"
                    className="text-[11px] font-mono text-data hover:underline"
                  >
                    Ask AI ↗
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-mono text-xs">
            No knowledge articles found matching &quot;{searchQuery}&quot; in {selectedCategory}.
          </div>
        )}
      </div>
    </main>
  );
}
