"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  getAllKnowledgeEntries,
  knowledgeEntries,
  KnowledgeEntry,
  getKnowledgeTopics,
} from "@/lib/knowledge/data";
import { InlineMarkdown } from "@/components/knowledge/MarkdownViewer";

const categories = [
  "ALL",
  "Climate",
  "Policy",
  "Infrastructure",
  "Environment",
  "Enterprise",
  "Tools",
] as const;

const kinds = ["ALL", "knowledge", "research", "documentation"] as const;

export default function KnowledgePage() {
  const [articles, setArticles] = useState<KnowledgeEntry[]>(getAllKnowledgeEntries());
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTopic, setSelectedTopic] = useState<string>("ALL");
  const [selectedKind, setSelectedKind] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/editorial/articles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.articles)) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});
  }, []);

  const allTopics = useMemo(() => {
    return Array.from(new Set(articles.map((e) => e.topic))).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return articles.filter((art) => {
      const matchesCat =
        selectedCategory === "ALL" || art.category === selectedCategory;
      const matchesTopic =
        selectedTopic === "ALL" || art.topic === selectedTopic;
      const matchesKind =
        selectedKind === "ALL" || art.kind === selectedKind;

      if (!matchesCat || !matchesTopic || !matchesKind) return false;

      if (!query) return true;

      const inTitle = art.title.toLowerCase().includes(query);
      const inSummary = art.summary.toLowerCase().includes(query);
      const inBody = art.body.toLowerCase().includes(query);
      const inTopic = art.topic.toLowerCase().includes(query);
      const inSource = art.source.name.toLowerCase().includes(query);
      const inLocality = art.locality?.toLowerCase().includes(query) || false;
      const inTags = art.tags.some((t) => t.toLowerCase().includes(query));

      return (
        inTitle ||
        inSummary ||
        inBody ||
        inTopic ||
        inSource ||
        inLocality ||
        inTags
      );
    });
  }, [articles, selectedCategory, selectedTopic, selectedKind, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedTopic("ALL");
    setSelectedKind("ALL");
    setSearchQuery("");
  };

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-data/10 border border-data/30 text-data text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-data animate-pulse" />
            {articles.length} VERIFIED EVIDENCE ENTRIES • SOURCE-LINKED
            {articles.length > knowledgeEntries.length && (
              <span className="text-[10px] bg-data/20 text-data px-1.5 py-0.5 rounded font-semibold">
                +{articles.length - knowledgeEntries.length} INGESTED (6:00 AM FEED)
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
            KNOWLEDGE FOR <br />
            <span className="text-data">PRACTITIONERS.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            Field manuals, policy blueprints, climate risk portals, and technical syntheses grounded in official multilateral assessments, national commitments, and local ecosystems.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-6 mb-12 bg-card/60 border border-border/80 rounded-2xl p-6 backdrop-blur-sm shadow-sm">
          {/* Search Input */}
          <div className="relative max-w-3xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, source (World Bank, NDC, ICIMOD, WHO), topic, locality..."
              className="w-full px-4 py-3.5 rounded-xl bg-background border border-border text-sm placeholder:text-muted-foreground focus:border-data focus:ring-1 focus:ring-data focus:outline-none font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3.5 text-xs font-mono text-muted-foreground hover:text-foreground px-2 py-0.5 rounded bg-muted"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Domain Category
              </span>
              {(selectedCategory !== "ALL" ||
                selectedTopic !== "ALL" ||
                selectedKind !== "ALL" ||
                searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-mono text-data hover:underline"
                >
                  Reset all filters
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                    selectedCategory === cat
                      ? "bg-data text-black font-semibold shadow-[0_0_12px_rgba(0,212,170,0.3)]"
                      : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters: Topic & Kind */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/40 text-xs font-mono">
            {/* Kind Filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-muted-foreground mr-1">Kind:</span>
              {kinds.map((kind) => (
                <button
                  key={kind}
                  onClick={() => setSelectedKind(kind)}
                  className={`px-2.5 py-1 rounded-md text-[11px] capitalize transition-colors ${
                    selectedKind === kind
                      ? "bg-foreground text-background font-semibold"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {kind}
                </button>
              ))}
            </div>

            {/* Specific Topic Select */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-muted-foreground">Topic:</span>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="bg-background border border-border text-foreground rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-data"
              >
                <option value="ALL">All Topics ({allTopics.length})</option>
                {allTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-6">
          <div>
            Showing <span className="text-foreground font-semibold">{filteredArticles.length}</span> of{" "}
            <span>{articles.length}</span> articles
          </div>
          {filteredArticles.length > 0 && (
            <div className="hidden sm:block text-[11px]">
              Click any report to read full text & inspect provenance
            </div>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              className="p-6 rounded-2xl bg-card border border-border/70 hover:border-data/60 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                {/* Editorial Daily Badge if dynamically ingested */}
                {art.id.startsWith("ed-") && (
                  <div className="mb-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-data/15 border border-data/30 text-data text-[10px] font-mono font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-data animate-pulse" />
                      EDITORIAL 6:00 AM FEED • VERIFIED
                    </span>
                  </div>
                )}

                {/* Meta Top: Kind, Category, Read Time */}
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-muted text-foreground uppercase tracking-wider font-semibold text-[10px]">
                      {art.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-data/10 text-data text-[10px] uppercase font-mono">
                      {art.kind}
                    </span>
                  </div>
                  <span>{art.readTime}</span>
                </div>

                {/* Title */}
                <h2 className="font-display font-bold text-lg leading-snug group-hover:text-data transition-colors mb-3">
                  <Link href={`/intelligence/knowledge/${art.slug}`}>
                    {art.title}
                  </Link>
                </h2>

                {/* Summary */}
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  <InlineMarkdown content={art.summary} />
                </p>

                {/* Structured Data Metric Callout (if present) */}
                {art.data && (
                  <div className="mb-4 p-2.5 rounded-lg bg-muted/40 border border-border/50 text-[11px] font-mono text-muted-foreground">
                    <div className="text-foreground font-medium text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-data" />
                      Climate Telemetry Data:
                    </div>
                    {art.data.annualTemperatureC && (
                      <div>• Baseline: {art.data.annualTemperatureC}°C / {art.data.annualPrecipitationMm}mm ({art.data.period})</div>
                    )}
                    {art.data.temperatureChangeCPerDecade && (
                      <div>• Trend: +{art.data.temperatureChangeCPerDecade}°C/decade ({art.data.dataset} since {art.data.startYear})</div>
                    )}
                    {art.data.temperatureMedianC && (
                      <div>• {art.data.scenario}: +{art.data.temperatureMedianC}°C median [{art.data.temperatureP10C}–{art.data.temperatureP90C}°C range]</div>
                    )}
                  </div>
                )}

                {/* Source & Provenance Badge */}
                <div className="mb-4 text-[11px] font-mono">
                  <div className="text-muted-foreground truncate" title={art.source.name}>
                    <span className="text-foreground/70">Source:</span>{" "}
                    <span className="text-foreground font-medium">{art.source.name.split("—")[0].trim()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                    <span className="capitalize">{art.source.level} Evidence</span>
                    <span>•</span>
                    <span>{art.source.date}</span>
                    {art.locality && (
                      <>
                        <span>•</span>
                        <span className="text-data">{art.locality}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-6">
                  {art.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted/50 text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <Link
                  href={`/intelligence/knowledge/${art.slug}`}
                  className="text-xs font-mono font-medium text-foreground hover:text-data transition-colors flex items-center gap-1 group/btn"
                >
                  Read Report
                  <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                </Link>

                <Link
                  href={`/intelligence/ai?topic=${encodeURIComponent(
                    art.topic
                  )}&article=${encodeURIComponent(art.slug)}`}
                  className="text-[11px] font-mono text-data hover:underline flex items-center gap-1"
                >
                  Ask AI ↗
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-20 rounded-2xl bg-card border border-border/60 p-8">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground font-mono">
              ∅
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">No matching knowledge articles</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              No entries match your search query &quot;{searchQuery}&quot; under the selected filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-data text-black text-xs font-mono font-semibold hover:bg-data/90 transition-all"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
