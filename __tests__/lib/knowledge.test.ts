import { describe, it, expect } from "vitest";
import {
  getAllKnowledgeEntries,
  getKnowledgeEntryBySlug,
  getRelatedKnowledgeEntries,
  getKnowledgeTopics,
  knowledgeEntries,
} from "@/lib/knowledge/data";

describe("Knowledge Base Data Layer", () => {
  it("populates exactly 28 source-grounded entries from knowledge seed", () => {
    const entries = getAllKnowledgeEntries();
    expect(entries).toHaveLength(28);
    expect(knowledgeEntries).toHaveLength(28);
  });

  it("ensures all entries have valid titles, slugs, bodies, and sources", () => {
    for (const entry of knowledgeEntries) {
      expect(entry.slug).toBeTruthy();
      expect(entry.title).toBeTruthy();
      expect(entry.summary).toBeTruthy();
      expect(entry.body).toBeTruthy();
      expect(entry.topic).toBeTruthy();
      expect(entry.category).toBeTruthy();
      expect(entry.readTime).toMatch(/min read$/);
      expect(entry.country).toBe("Nepal");
      expect(entry.source).toBeDefined();
      expect(entry.source.name).toBeTruthy();
      expect(entry.source.url).toMatch(/^https?:\/\//);
      expect(["primary", "synthesis"]).toContain(entry.source.level);
      expect(Array.isArray(entry.tags)).toBe(true);
      expect(entry.tags.length).toBeGreaterThan(0);
    }
  });

  it("finds entry by unique slug", () => {
    const found = getKnowledgeEntryBySlug("nepal-climate-policy-vulnerability-agency");
    expect(found).toBeDefined();
    expect(found?.title).toBe("Nepal’s climate policy begins with vulnerability and agency");
    expect(found?.kind).toBe("knowledge");
    expect(found?.source.level).toBe("primary");
  });

  it("returns undefined for non-existent slug", () => {
    const notFound = getKnowledgeEntryBySlug("non-existent-article-slug");
    expect(notFound).toBeUndefined();
  });

  it("retrieves related entries excluding the target slug", () => {
    const slug = "nepal-climate-policy-vulnerability-agency";
    const related = getRelatedKnowledgeEntries(slug, 3);
    expect(related.length).toBeGreaterThan(0);
    expect(related.length).toBeLessThanOrEqual(3);
    for (const item of related) {
      expect(item.slug).not.toBe(slug);
    }
  });

  it("extracts unique topics across the library", () => {
    const topics = getKnowledgeTopics();
    expect(topics.length).toBeGreaterThan(5);
    expect(topics).toContain("Climate policy");
    expect(topics).toContain("Climate and health");
    expect(topics).toContain("Cryosphere");
    expect(topics).toContain("Energy transition");
  });

  it("includes structured climate data metrics where applicable", () => {
    const baseline = getKnowledgeEntryBySlug("nepal-historical-climate-baseline-1995-2014");
    expect(baseline?.data?.annualTemperatureC).toBe(12.66);
    expect(baseline?.data?.annualPrecipitationMm).toBe(2042.28);

    const trend = getKnowledgeEntryBySlug("nepal-observed-climate-trends-since-1970");
    expect(trend?.data?.temperatureChangeCPerDecade).toBe(0.17);

    const projection = getKnowledgeEntryBySlug("nepal-mid-century-projection-ssp370");
    expect(projection?.data?.temperatureMedianC).toBe(1.5);
    expect(projection?.data?.temperatureP10C).toBe(1.1);
    expect(projection?.data?.temperatureP90C).toBe(2.01);
  });
});
