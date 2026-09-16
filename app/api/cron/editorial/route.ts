import { NextResponse } from "next/server";
import {
  scrapeAllVerifiedSources,
  fetchVerifiedSourceFeed,
  VERIFIED_SOURCES,
  RawEditorialItem,
  isRelatedToNepal,
} from "@/lib/editorial/scraper";
import { rewriteEditorialItem } from "@/lib/editorial/rewriter";
import { addEditorialArticle, hasArticleBeenIngested } from "@/lib/editorial/store";
import { KnowledgeEntry } from "@/lib/knowledge/data";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds maximum execution for serverless / Railway

/**
 * Validates request authorization for cron job execution.
 */
function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  // In development without CRON_SECRET configured, allow local triggers
  if (!secret) return true;

  const url = new URL(req.url);
  const querySecret = url.searchParams.get("secret");
  const authHeader = req.headers.get("authorization");
  const xCronSecret = req.headers.get("x-cron-secret");

  if (querySecret && querySecret === secret) return true;
  if (xCronSecret && xCronSecret === secret) return true;
  if (authHeader && authHeader === `Bearer ${secret}`) return true;

  return false;
}

async function handleEditorialIngestion(req: Request) {
  const startTime = Date.now();

  if (!isAuthorized(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Invalid or missing CRON_SECRET." },
      { status: 401 }
    );
  }

  try {
    const url = new URL(req.url);
    const limitParam = parseInt(url.searchParams.get("limit") || "3", 10);
    const maxItemsToIngest = isNaN(limitParam) ? 3 : Math.min(Math.max(1, limitParam), 10);
    const sourceFilter = url.searchParams.get("source");
    const force = url.searchParams.get("force") === "true";

    // 1. Ingest raw articles from verified institutional sources
    let rawItems: RawEditorialItem[] = [];
    if (sourceFilter) {
      const sourceDef = VERIFIED_SOURCES.find(
        (s) => s.id.toLowerCase() === sourceFilter.toLowerCase()
      );
      if (sourceDef) {
        rawItems = await fetchVerifiedSourceFeed(sourceDef);
      }
    } else {
      rawItems = await scrapeAllVerifiedSources();
    }

    // 2. Filter for novel, un-ingested articles unless force=true
    // Ensure news related to Nepal at publishing time is NOT shown/ingested into the 6:00 AM verified feed
    const candidateItems: RawEditorialItem[] = [];
    for (const item of rawItems) {
      if (isRelatedToNepal(item)) {
        continue;
      }
      if (force || !hasArticleBeenIngested(item.canonicalUrl)) {
        candidateItems.push(item);
      }
      if (candidateItems.length >= maxItemsToIngest) break;
    }

    if (candidateItems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All verified source items are already up to date.",
        timestamp: new Date().toISOString(),
        scrapedCount: rawItems.length,
        newlyIngestedCount: 0,
        articles: [],
        durationMs: Date.now() - startTime,
      });
    }

    // 3. Rewrite each candidate item using the Evidence-Based AI pipeline
    const newlyAdded: KnowledgeEntry[] = [];
    for (const candidate of candidateItems) {
      try {
        const rewritten = await rewriteEditorialItem(candidate);
        const added = addEditorialArticle(rewritten);
        if (added) {
          newlyAdded.push(rewritten);
        }
      } catch (err: any) {
        console.error(
          `[Editorial Cron] Failed to rewrite candidate "${candidate.title}":`,
          err.message
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Editorial ingestion complete. Added ${newlyAdded.length} new evidence-based dispatch(es).`,
      timestamp: new Date().toISOString(),
      scrapedCount: rawItems.length,
      candidatesEvaluated: candidateItems.length,
      newlyIngestedCount: newlyAdded.length,
      articles: newlyAdded.map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        category: a.category,
        topic: a.topic,
        source: a.source,
        readTime: a.readTime,
      })),
      durationMs: Date.now() - startTime,
    });
  } catch (err: any) {
    console.error("[Editorial Cron Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error during editorial ingestion.",
        durationMs: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return handleEditorialIngestion(req);
}

export async function POST(req: Request) {
  return handleEditorialIngestion(req);
}
