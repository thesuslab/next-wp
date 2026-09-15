/**
 * Knowledge Indexer
 * Automatically indexes published WordPress posts, editorial scrapings,
 * and custom published articles into the Sustainable AI Advisor knowledge base.
 */

import { KnowledgeEntry } from "./data";
import { addEditorialArticle, hasArticleBeenIngested } from "@/lib/editorial/store";
import { stripHtml } from "@/lib/metadata";
import type { Post } from "@/lib/wordpress.d";

/**
 * Convert HTML or formatted text to a clean plain-text extract for AI context.
 */
export function cleanContent(html: string): string {
  if (!html) return "";
  return stripHtml(html)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "--")
    .replace(/&#038;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Indexes a WordPress post into the Sustainability Lab Knowledge Base
 * so it is immediately searchable and cited by the Sustainable AI Advisor.
 */
export function indexWordPressPost(post: Post): KnowledgeEntry | null {
  if (!post || post.status !== "publish") return null;

  const rawTitle = post.title?.rendered || "Untitled Post";
  const cleanTitle = cleanContent(rawTitle);
  const cleanExcerpt = cleanContent(post.excerpt?.rendered || "");
  const cleanBody = cleanContent(post.content?.rendered || "");

  const entry: KnowledgeEntry = {
    id: `wp-${post.id}`,
    slug: post.slug || `post-${post.id}`,
    title: cleanTitle,
    kind: "research",
    summary: cleanExcerpt || (cleanBody.length > 240 ? cleanBody.slice(0, 240) + "..." : cleanBody),
    body: cleanBody || cleanExcerpt,
    topic: "Editorial & Field Dispatches",
    category: "Policy",
    region: "Himalaya / South Asia",
    locality: null,
    country: "Nepal",
    source: {
      name: "Sustainability Lab Publishing • WordPress CMS",
      url: post.link || `/posts/${post.slug}`,
      date: (post.date || new Date().toISOString()).split("T")[0],
      type: "published article",
      level: "primary",
    },
    tags: ["editorial", "published", "field dispatch", "sustainability lab"],
    data: null,
    readTime: `${Math.max(1, Math.ceil(cleanBody.split(/\s+/).length / 200))} min read`,
    seoTitle: `${cleanTitle} | Sustainability Lab Dispatch`,
    seoDescription: cleanExcerpt || cleanBody.slice(0, 160),
  };

  const added = addEditorialArticle(entry);
  if (added) {
    console.info(
      `[Sustainable AI Indexer] Indexed published WordPress post into AI Advisor: "${entry.title}" (${entry.slug})`
    );
  }
  return entry;
}

/**
 * Indexes any newly published article into the AI Advisor knowledge base.
 */
export function indexArticleIntoKnowledge(
  article: Partial<KnowledgeEntry> & { title: string; body: string }
): KnowledgeEntry {
  const slug =
    article.slug ||
    article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const entry: KnowledgeEntry = {
    id: article.id || `art-${Date.now()}`,
    slug,
    title: cleanContent(article.title),
    kind: article.kind || "knowledge",
    summary: article.summary
      ? cleanContent(article.summary)
      : cleanContent(article.body).slice(0, 240) + "...",
    body: cleanContent(article.body),
    topic: article.topic || "Environmental Intelligence",
    category: (article.category as any) || "Environment",
    region: article.region || "Nepal / Himalaya",
    locality: article.locality || null,
    country: article.country || "Nepal",
    source: article.source || {
      name: "Sustainability Lab Editorial Desk",
      url: `/intelligence/knowledge/${slug}`,
      date: new Date().toISOString().split("T")[0],
      type: "verified editorial",
      level: "primary",
    },
    tags:
      Array.isArray(article.tags) && article.tags.length > 0
        ? article.tags
        : ["sustainable ai", "knowledge base"],
    data: article.data || null,
    readTime:
      article.readTime ||
      `${Math.max(1, Math.ceil(cleanContent(article.body).split(/\s+/).length / 200))} min read`,
    seoTitle: article.seoTitle || `${cleanContent(article.title)} | Sustainability Lab`,
    seoDescription:
      article.seoDescription ||
      (article.summary
        ? cleanContent(article.summary).slice(0, 160)
        : cleanContent(article.body).slice(0, 160)),
  };

  addEditorialArticle(entry);
  console.info(
    `[Sustainable AI Indexer] Successfully indexed published article into AI Advisor: "${entry.title}"`
  );
  return entry;
}
