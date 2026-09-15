import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllKnowledgeEntries,
  getKnowledgeEntryBySlug,
  getRelatedKnowledgeEntries,
  type KnowledgeEntry,
} from "@/lib/knowledge/data";
import { MarkdownViewer } from "@/components/knowledge/MarkdownViewer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entries = getAllKnowledgeEntries();
  return entries.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getKnowledgeEntryBySlug(slug);

  if (!entry) {
    return {
      title: "Article Not Found | Sustainability Lab",
    };
  }

  const cleanDescription = (entry.seoDescription || entry.summary || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();

  return {
    title: entry.seoTitle,
    description: cleanDescription,
    openGraph: {
      title: entry.seoTitle,
      description: cleanDescription,
      type: "article",
    },
  };
}

export default async function KnowledgeArticlePage({ params }: Props) {
  const { slug } = await params;
  const entry = getKnowledgeEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const related = getRelatedKnowledgeEntries(slug, 3);

  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-8">
          <Link href="/intelligence" className="hover:text-data transition-colors">
            INTELLIGENCE
          </Link>
          <span>/</span>
          <Link href="/intelligence/knowledge" className="hover:text-data transition-colors">
            KNOWLEDGE
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[240px] sm:max-w-none">
            {entry.slug}
          </span>
        </nav>

        {/* Article Header */}
        <header className="mb-10 space-y-6">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-muted text-foreground uppercase tracking-wider font-semibold text-[10px]">
              {entry.category}
            </span>
            <span className="px-2.5 py-1 rounded bg-data/10 text-data uppercase text-[10px] font-semibold">
              {entry.kind}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{entry.readTime}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{entry.topic}</span>
            {entry.locality && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-data font-medium">{entry.locality}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
            {entry.title}
          </h1>

          {/* Executive Summary Card */}
          <div className="p-6 rounded-2xl bg-card border border-border/80 border-l-4 border-l-data shadow-sm">
            <div className="text-[11px] font-mono text-data uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-data" />
              Executive Summary
            </div>
            <MarkdownViewer
              content={entry.summary}
              className="prose-p:text-base sm:prose-p:text-base prose-p:my-1 text-foreground/90 font-light leading-relaxed"
            />
          </div>
        </header>

        {/* Evidence & Provenance Ledger Box */}
        <section className="mb-10 p-6 rounded-2xl bg-muted/30 border border-border/70 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
                Evidence Ledger & Provenance
              </span>
              <span className="px-2 py-0.5 rounded bg-data/15 text-data text-[10px] font-mono capitalize">
                {entry.source.level} Evidence
              </span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{entry.country}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-muted-foreground block text-[11px] mb-0.5">Primary Source:</span>
              <span className="text-foreground font-medium">{entry.source.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px] mb-0.5">Source Type:</span>
              <span className="text-foreground capitalize">{entry.source.type}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px] mb-0.5">Publication / Reference Date:</span>
              <span className="text-foreground">{entry.source.date}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px] mb-0.5">Region Scope:</span>
              <span className="text-foreground">{entry.region} {entry.locality ? `(${entry.locality})` : ""}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-border/40 flex items-center justify-between">
            <a
              href={entry.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-data hover:underline font-medium"
            >
              Access Official Multilateral Source Document ↗
            </a>
            <span className="text-[11px] font-mono text-muted-foreground">
              Direct Citation Verified
            </span>
          </div>
        </section>

        {/* Structured Data Metric Box (if data present) */}
        {entry.data && (
          <section className="mb-10 p-6 rounded-2xl bg-card border border-border/80 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-foreground font-semibold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-data animate-pulse" />
              Verified Climate Telemetry Dataset
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {entry.data.period && (
                <div className="p-3.5 rounded-xl bg-background border border-border/60">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">Observation Period</div>
                  <div className="text-lg font-mono font-bold text-foreground mt-1">{entry.data.period}</div>
                </div>
              )}
              {entry.data.annualTemperatureC !== undefined && (
                <div className="p-3.5 rounded-xl bg-background border border-border/60">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">Annual Mean Temp</div>
                  <div className="text-lg font-mono font-bold text-data mt-1">{entry.data.annualTemperatureC} °C</div>
                </div>
              )}
              {entry.data.annualPrecipitationMm !== undefined && (
                <div className="p-3.5 rounded-xl bg-background border border-border/60">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">Annual Precipitation</div>
                  <div className="text-lg font-mono font-bold text-foreground mt-1">{entry.data.annualPrecipitationMm} mm</div>
                </div>
              )}
              {entry.data.temperatureChangeCPerDecade !== undefined && (
                <div className="p-3.5 rounded-xl bg-background border border-border/60">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">Decadal Warming Rate</div>
                  <div className="text-lg font-mono font-bold text-data mt-1">+{entry.data.temperatureChangeCPerDecade} °C / decade</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{entry.data.dataset} since {entry.data.startYear}</div>
                </div>
              )}
              {entry.data.precipitationChangeMmPerDecade !== undefined && (
                <div className="p-3.5 rounded-xl bg-background border border-border/60">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">Decadal Precip Shift</div>
                  <div className="text-lg font-mono font-bold text-foreground mt-1">+{entry.data.precipitationChangeMmPerDecade} mm / decade</div>
                </div>
              )}
              {entry.data.temperatureMedianC !== undefined && (
                <div className="p-3.5 rounded-xl bg-background border border-border/60 sm:col-span-2">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">
                    {entry.data.scenario} Projection ({entry.data.period})
                  </div>
                  <div className="text-lg font-mono font-bold text-data mt-1">
                    +{entry.data.temperatureMedianC} °C median
                  </div>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">
                    10th–90th percentile range: [{entry.data.temperatureP10C} °C to {entry.data.temperatureP90C} °C]
                  </div>
                  {entry.data.precipitationMedianMm !== undefined && (
                    <div className="text-xs font-mono text-muted-foreground mt-1">
                      Precipitation change: +{entry.data.precipitationMedianMm} mm median [{entry.data.precipitationP10Mm} to {entry.data.precipitationP90Mm} mm]
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Article Full Body */}
        <article className="mb-14">
          <MarkdownViewer content={entry.body} />
        </article>

        {/* Tags */}
        <div className="mb-12 pt-6 border-t border-border/60">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
            Index & Classification Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-mono bg-muted/60 text-foreground border border-border/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Action Toolbar */}
        <div className="mb-16 p-6 rounded-2xl bg-card border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-display font-bold text-base">Inquire with the AI Advisor</h3>
            <p className="text-xs text-muted-foreground font-mono">
              Synthesize this report with your project parameters and physical site conditions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/intelligence/ai?topic=${encodeURIComponent(
                entry.topic
              )}&article=${encodeURIComponent(entry.slug)}`}
              className="px-5 py-2.5 rounded-xl bg-data text-black text-xs font-mono font-semibold hover:bg-data/90 transition-all shadow-[0_0_15px_rgba(0,212,170,0.3)]"
            >
              Ask AI About This ↗
            </Link>
            <Link
              href="/intelligence/knowledge"
              className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-mono transition-colors"
            >
              Browse Library
            </Link>
          </div>
        </div>

        {/* Related Articles Section */}
        {related.length > 0 && (
          <section className="pt-10 border-t border-border/60">
            <h2 className="font-display font-bold text-2xl mb-6">Related Knowledge Reports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/intelligence/knowledge/${rel.slug}`}
                  className="p-4 rounded-xl bg-card border border-border/60 hover:border-data/50 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-2">
                      <span className="uppercase text-data">{rel.category}</span>
                      <span>{rel.readTime}</span>
                    </div>
                    <h3 className="font-display font-semibold text-sm leading-snug group-hover:text-data transition-colors mb-2">
                      {rel.title}
                    </h3>
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground mt-4 group-hover:text-foreground">
                    Read Report →
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
