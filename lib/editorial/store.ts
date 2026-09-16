/**
 * Persistence layer for dynamically scraped and rewritten editorial articles.
 * Stores articles in data/editorial_articles.json and provides querying/deduplication.
 */

import fs from "fs";
import path from "path";
import { KnowledgeEntry, knowledgeEntries as baseEntries } from "@/lib/knowledge/data";
import bundledEditorialArticles from "@/data/editorial_articles.json";

const DATA_DIR = path.join(process.cwd(), "data");
const ARTICLES_FILE = path.join(DATA_DIR, "editorial_articles.json");

// In-memory cache for dynamic additions during runtime
let memoryEditorialArticles: KnowledgeEntry[] | null = null;

const staticSeedArticles: KnowledgeEntry[] = Array.isArray(bundledEditorialArticles)
  ? (bundledEditorialArticles as KnowledgeEntry[])
  : [];

/**
 * Ensure storage directory and JSON file exist safely.
 */
function ensureStorageFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ARTICLES_FILE)) {
      fs.writeFileSync(
        ARTICLES_FILE,
        JSON.stringify(staticSeedArticles, null, 2),
        "utf-8"
      );
    }
  } catch (err: any) {
    // Expected on read-only filesystems (Vercel, AWS Lambda, Docker read-only)
    console.warn("[Editorial Store] File system note:", err.message);
  }
}

/**
 * Retrieve all dynamically stored editorial articles, falling back cleanly to bundled seed.
 */
export function getStoredEditorialArticles(): KnowledgeEntry[] {
  if (typeof window !== "undefined") {
    return memoryEditorialArticles || staticSeedArticles;
  }

  try {
    ensureStorageFile();
    if (fs.existsSync(ARTICLES_FILE)) {
      const content = fs.readFileSync(ARTICLES_FILE, "utf-8");
      if (content.trim()) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge disk articles with bundled seed articles to ensure complete archive
          const seenSlugs = new Set<string>();
          const merged: KnowledgeEntry[] = [];
          for (const item of [...parsed, ...staticSeedArticles]) {
            if (item && item.slug && !seenSlugs.has(item.slug)) {
              seenSlugs.add(item.slug);
              merged.push(item);
            }
          }
          memoryEditorialArticles = merged;
          return merged;
        }
      }
    }
  } catch (err: any) {
    console.warn("[Editorial Store] Error reading disk storage, using bundled baseline:", err.message);
  }

  return memoryEditorialArticles || staticSeedArticles;
}

/**
 * Persist articles list to disk and update in-memory cache.
 */
export function saveEditorialArticles(articles: KnowledgeEntry[]): void {
  memoryEditorialArticles = articles;
  try {
    ensureStorageFile();
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf-8");
  } catch (err: any) {
    console.warn("[Editorial Store] Could not write to disk (kept in memory):", err.message);
  }
}

/**
 * Check if an article URL or slug has already been ingested.
 */
export function hasArticleBeenIngested(canonicalUrl: string, slug?: string): boolean {
  const stored = getStoredEditorialArticles();
  return (
    stored.some(
      (entry) =>
        entry.source.url === canonicalUrl ||
        (slug && entry.slug === slug)
    ) ||
    baseEntries.some(
      (entry) =>
        entry.source.url === canonicalUrl ||
        (slug && entry.slug === slug)
    )
  );
}

/**
 * Add a new editorial article, preventing duplicate canonical URLs or slugs.
 * Returns true if added, false if duplicate.
 */
export function addEditorialArticle(article: KnowledgeEntry): boolean {
  if (hasArticleBeenIngested(article.source.url, article.slug)) {
    return false;
  }

  const stored = getStoredEditorialArticles();
  // Place newest at the front
  stored.unshift(article);
  saveEditorialArticles(stored);
  return true;
}

/**
 * Combines foundational 28 knowledge seed articles with dynamically scraped editorial articles.
 */
export function getCombinedKnowledgeEntries(): KnowledgeEntry[] {
  const stored = getStoredEditorialArticles();
  if (stored.length === 0) return baseEntries;

  // Filter out any overlap just in case
  const seenSlugs = new Set(baseEntries.map((e) => e.slug));
  const newUnique = stored.filter((e) => !seenSlugs.has(e.slug));

  return [...newUnique, ...baseEntries];
}
