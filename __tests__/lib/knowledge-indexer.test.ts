import { describe, it, expect } from "vitest";
import { indexWordPressPost, indexArticleIntoKnowledge, cleanContent } from "@/lib/knowledge/indexer";
import { searchKnowledgeEntries, getKnowledgeEntryBySlug } from "@/lib/knowledge/data";
import { findRelevantKnowledgeContext } from "@/lib/ai/provider";
import type { Post } from "@/lib/wordpress.d";

describe("Sustainable AI Knowledge Indexer", () => {
  it("cleans HTML entities and tags into plain readable text", () => {
    const raw = "<p>Hello &amp; welcome to the <strong>Himalayan</strong> research station!&#8217;s</p>";
    expect(cleanContent(raw)).toBe("Hello & welcome to the Himalayan research station!'s");
  });

  it("indexes a published WordPress post into the AI Advisor knowledge base", () => {
    const mockPost: Partial<Post> = {
      id: 9991,
      status: "publish",
      slug: "glacial-lake-outburst-flood-monitoring-2026",
      date: "2026-09-15T08:00:00",
      link: "https://sustainabilitylab.xyz/posts/glacial-lake-outburst-flood-monitoring-2026",
      title: {
        rendered: "Glacial Lake Outburst Flood Monitoring in the Dudh Koshi",
      },
      excerpt: {
        rendered: "<p>Real-time seismic telemetry deployed around Imja Tsho glacial lake.</p>",
      },
      content: {
        rendered: `<div>
          <p>Researchers installed acoustic sensors to detect sudden sub-surface dam displacement.</p>
          <p>Early warning sirens are calibrated to transmit emergency alerts within 90 seconds of breach threshold.</p>
        </div>`,
      },
    };

    const indexed = indexWordPressPost(mockPost as Post);
    expect(indexed).not.toBeNull();
    expect(indexed?.title).toBe("Glacial Lake Outburst Flood Monitoring in the Dudh Koshi");
    expect(indexed?.slug).toBe("glacial-lake-outburst-flood-monitoring-2026");
    expect(indexed?.source.name).toContain("WordPress CMS");

    // Verify it is retrievable by getKnowledgeEntryBySlug
    const retrieved = getKnowledgeEntryBySlug("glacial-lake-outburst-flood-monitoring-2026");
    expect(retrieved).toBeDefined();
    expect(retrieved?.title).toBe("Glacial Lake Outburst Flood Monitoring in the Dudh Koshi");

    // Verify it is indexed into searchKnowledgeEntries and findRelevantKnowledgeContext for AI Advisor
    const searchResults = searchKnowledgeEntries("Dudh Koshi Imja Tsho glacial lake");
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults.some((r) => r.slug === "glacial-lake-outburst-flood-monitoring-2026")).toBe(true);

    const aiContext = findRelevantKnowledgeContext("Tell me about Dudh Koshi glacial lake monitoring");
    expect(aiContext).toContain("Glacial Lake Outburst Flood Monitoring in the Dudh Koshi");
    expect(aiContext).toContain("acoustic sensors");
  });

  it("indexes custom published articles into the Sustainable AI Advisor", () => {
    const customArticle = indexArticleIntoKnowledge({
      title: "Biochar Carbon Sequestration Trials in Bagmati Valley",
      body: "Empirical soil trials indicate high porosity biochar enhances cation exchange capacity by 34% across degraded hillslope terraces.",
      summary: "Biochar field trials demonstrate substantial soil carbon retention in Nepal.",
      topic: "Soil & Agriculture",
      category: "Environment",
      tags: ["biochar", "soil science", "bagmati"],
    });

    expect(customArticle.slug).toBe("biochar-carbon-sequestration-trials-in-bagmati-valley");
    expect(customArticle.title).toBe("Biochar Carbon Sequestration Trials in Bagmati Valley");

    // Verify search retrieval
    const results = searchKnowledgeEntries("biochar cation exchange bagmati");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe("Biochar Carbon Sequestration Trials in Bagmati Valley");
  });
});
