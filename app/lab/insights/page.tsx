"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { KnowledgeEntry } from "@/lib/knowledge/data";
import editorialSeedArticles from "@/data/editorial_articles.json";

interface FieldNoteArticle {
  id: string;
  category: "FIELD NOTES" | "RESEARCH" | "CLIMATE" | "TECHNOLOGY" | "ENTERPRISE" | "MATERIALS" | "OPINION";
  title: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  isFeatured?: boolean;
}

const staticArticles: FieldNoteArticle[] = [
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
  const [editorialArticles, setEditorialArticles] = useState<KnowledgeEntry[]>(
    (Array.isArray(editorialSeedArticles) ? editorialSeedArticles : []) as KnowledgeEntry[]
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const loadEditorial = () => {
    fetch("/api/editorial/articles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.editorialArticles)) {
          setEditorialArticles(data.editorialArticles);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadEditorial();
  }, []);

  const handleSyncEditorial = async () => {
    setIsSyncing(true);
    setSyncStatus("Ingesting from ICIMOD, UNFCCC, UNEP, Mongabay...");
    try {
      const res = await fetch("/api/cron/editorial?force=true&limit=2", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncStatus(
          `Success: ${data.newlyIngestedCount} new evidence dispatch(es) synthesized & published.`
        );
        loadEditorial();
      } else {
        setSyncStatus(`Sync issue: ${data.error || "Could not complete ingestion."}`);
      }
    } catch (err: any) {
      setSyncStatus(`Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const featured = staticArticles.find((a) => a.isFeatured) || staticArticles[0];
  const listArticles = staticArticles.filter((a) => {
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
          <span className="text-foreground">FIELD NOTES &amp; EDITORIAL</span>
        </div>

        {/* Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-foreground/5 text-foreground border border-border rounded-full mb-6">
              EDITORIAL DISPATCHES &bull; 6:00 AM AUTOMATED INGESTION
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
              FIELD NOTES &amp; <br />
              <span className="text-data">LAB THINKING.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed font-light">
              Working hypotheses, technical findings, and critical essays paired with daily 6:00 AM automated editorial dispatches synthesized directly from verified multilateral institutions (ICIMOD, UNFCCC, UNEP, Mongabay).
            </p>
          </div>

          {/* Sync Trigger Action */}
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <button
              onClick={handleSyncEditorial}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-data/40 hover:border-data text-foreground font-mono text-xs transition-all shadow-sm hover:shadow-[0_0_15px_rgba(0,212,170,0.2)] disabled:opacity-50 cursor-pointer"
            >
              <span className={`w-2 h-2 rounded-full bg-data ${isSyncing ? "animate-spin" : "animate-pulse"}`} />
              {isSyncing ? "Synthesizing Feeds..." : "Trigger 6:00 AM Digest Now"}
            </button>
            {syncStatus && (
              <span className="text-[11px] font-mono text-data max-w-xs text-left md:text-right">
                {syncStatus}
              </span>
            )}
          </div>
        </div>

        {/* Dynamic 6:00 AM Daily Ingested Section */}
        {editorialArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-data animate-pulse" />
                <h2 className="font-mono text-xs uppercase tracking-widest text-data font-bold">
                  Daily 6:00 AM Ingested Editorial Dispatches ({editorialArticles.length})
                </h2>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Verified Multilateral Evidence
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {editorialArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-6 rounded-2xl bg-card/80 border border-data/30 hover:border-data/60 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div>
                    {/* Source citation header */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-3">
                      <span className="px-2 py-0.5 rounded bg-data/10 text-data font-semibold text-[10px] uppercase">
                        {art.category}
                      </span>
                      <span>{art.readTime}</span>
                    </div>

                    <h3 className="font-display font-bold text-base leading-snug group-hover:text-data transition-colors mb-3">
                      <Link href={`/intelligence/knowledge/${art.slug}`}>
                        {art.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/40 text-[11px] font-mono">
                    <div className="text-foreground/90 font-medium truncate mb-1">
                      {art.source.name}
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                      <span>{art.source.date}</span>
                      <a
                        href={art.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-data hover:underline flex items-center gap-1"
                      >
                        Verified Source ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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

        {/* Static Article Grid */}
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
