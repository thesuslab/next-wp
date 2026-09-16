/**
 * Persistence layer for dynamically scraped and rewritten editorial articles.
 * Stores articles in data/editorial_articles.json and provides querying/deduplication.
 */

import fs from "fs";
import path from "path";
import {
  KnowledgeEntry,
  knowledgeEntries as baseEntries,
  registerKnowledgeEntry,
  getAllKnowledgeEntries,
} from "@/lib/knowledge/data";

const DATA_DIR = path.join(process.cwd(), "data");
const ARTICLES_FILE = path.join(DATA_DIR, "editorial_articles.json");

/**
 * Ensure storage directory and JSON file exist safely.
 */
function ensureStorageFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ARTICLES_FILE)) {
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err: any) {
    console.error("[Editorial Store] Error ensuring storage file:", err.message);
  }
}

/**
 * Retrieve all dynamically stored editorial articles.
 */
export function getStoredEditorialArticles(): KnowledgeEntry[] {
  ensureStorageFile();
  try {
    if (!fs.existsSync(ARTICLES_FILE)) return [];
    const content = fs.readFileSync(ARTICLES_FILE, "utf-8");
    if (!content.trim()) return [];
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err: any) {
    console.error("[Editorial Store] Error reading editorial articles:", err.message);
    return [];
  }
}

/**
 * Persist articles list to disk.
 */
export function saveEditorialArticles(articles: KnowledgeEntry[]): void {
  ensureStorageFile();
  try {
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf-8");
  } catch (err: any) {
    console.error("[Editorial Store] Error writing editorial articles:", err.message);
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
  // Always register in runtime memory so it is immediately searchable
  registerKnowledgeEntry(article);

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
 * Combines baseline knowledge articles with dynamically scraped editorial articles.
 */
export function getCombinedKnowledgeEntries(): KnowledgeEntry[] {
  return getAllKnowledgeEntries();
}

