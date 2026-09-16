import { describe, it, expect } from "vitest";
import {
  getStoredEditorialArticles,
  saveEditorialArticles,
  addEditorialArticle,
  hasArticleBeenIngested,
  getCombinedKnowledgeEntries,
} from "@/lib/editorial/store";
import { KnowledgeEntry } from "@/lib/knowledge/data";

describe("Editorial Article Store & Deduplication", () => {
  it("reads stored articles without throwing", () => {
    const articles = getStoredEditorialArticles();
    expect(Array.isArray(articles)).toBe(true);
  });

  it("checks whether an article has been ingested by URL or slug", () => {
    // Check against foundational knowledge base URL
    const isIngested = hasArticleBeenIngested(
      "https://unfccc.int/sites/default/files/NDC/2022-06/Second%20Nationally%20Determined%20Contribution%20%28NDC%29%20-%202020.pdf"
    );
    expect(isIngested).toBe(true);

    const nonExistent = hasArticleBeenIngested("https://random-unknown-site.org/not-real");
    expect(nonExistent).toBe(false);
  });

  it("combines baseline knowledge seed with stored articles without duplicating", () => {
    const combined = getCombinedKnowledgeEntries();
    expect(combined.length).toBeGreaterThanOrEqual(28);

    const slugs = combined.map((e) => e.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("guarantees verified bundled editorial articles exist in production", () => {
    const articles = getStoredEditorialArticles();
    expect(articles.length).toBeGreaterThanOrEqual(8);
    const combined = getCombinedKnowledgeEntries();
    expect(combined.length).toBeGreaterThanOrEqual(36);
  });
});
