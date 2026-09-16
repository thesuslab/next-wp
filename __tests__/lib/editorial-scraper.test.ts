import { describe, it, expect } from "vitest";
import {
  cleanHtmlSnippet,
  parseRssXml,
  isRelevantEnvironmentalNews,
  VERIFIED_SOURCES,
  isRelatedToNepal,
} from "@/lib/editorial/scraper";

describe("Verified Editorial Scraper", () => {
  it("whitelists legitimate and verified institutional sources", () => {
    expect(VERIFIED_SOURCES.length).toBeGreaterThanOrEqual(4);
    const ids = VERIFIED_SOURCES.map((s) => s.id);
    expect(ids).toContain("icimod");
    expect(ids).toContain("unfccc");
    expect(ids).toContain("unep");
    expect(ids).toContain("mongabay");

    for (const source of VERIFIED_SOURCES) {
      expect(source.url).toMatch(/^https?:\/\//);
      expect(source.feedUrl).toMatch(/^https?:\/\//);
      expect(["primary", "synthesis"]).toContain(source.evidenceLevel);
    }
  });

  it("cleans HTML snippets and removes scripts/tags safely", () => {
    const raw = "<p>Glacial melting in the <strong>Hindu Kush Himalaya</strong> &amp; rapid runoff.<script>alert(1)</script></p>";
    const cleaned = cleanHtmlSnippet(raw);
    expect(cleaned).toBe("Glacial melting in the Hindu Kush Himalaya & rapid runoff.");
  });

  it("parses RSS XML item blocks into structured raw items", () => {
    const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>ICIMOD Updates</title>
    <item>
      <title>Cryosphere Monitoring in Langtang Basin</title>
      <link>https://www.icimod.org/article/cryosphere-langtang</link>
      <pubDate>Mon, 08 Sep 2026 06:00:00 GMT</pubDate>
      <description><![CDATA[<p>Field teams observe +1.8°C thermal anomaly across glacier terminus.</p>]]></description>
      <content:encoded><![CDATA[<p>Full research findings on glacial recession and meltwater discharge.</p>]]></content:encoded>
    </item>
  </channel>
</rss>`;

    const source = VERIFIED_SOURCES[0];
    const items = parseRssXml(sampleXml, source);
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("Cryosphere Monitoring in Langtang Basin");
    expect(items[0].canonicalUrl).toBe("https://www.icimod.org/article/cryosphere-langtang");
    expect(items[0].pubDate).toBe("2026-09-08");
    expect(items[0].sourceName).toBe(source.name);
  });

  it("filters for environmental and climate relevance", () => {
    const source = VERIFIED_SOURCES[0];
    const relevantItem = {
      id: "test-1",
      sourceId: source.id,
      sourceName: source.name,
      sourceUrl: source.url,
      canonicalUrl: "https://example.com/1",
      title: "Himalayan Watershed Resilience and Flood Adaptation",
      pubDate: "2026-09-10",
      summary: "Restoring mountain stream hydrology through bio-engineering.",
      content: "Details on watershed stabilization.",
      institutionType: "intergovernmental",
      evidenceLevel: "synthesis" as const,
      defaultCategory: "Environment" as const,
      region: "Hindu Kush Himalaya",
      country: "Nepal",
    };

    const irrelevantItem = {
      ...relevantItem,
      title: "Quarterly IT Server Maintenance Notice",
      summary: "Scheduled database indexing on cloud cluster.",
      content: "No ecological relevance.",
    };

    expect(isRelevantEnvironmentalNews(relevantItem)).toBe(true);
    expect(isRelevantEnvironmentalNews(irrelevantItem)).toBe(false);
  });

  it("whitelists all 8 verified sustainability and climate news sources requested", () => {
    const ids = VERIFIED_SOURCES.map((s) => s.id);
    expect(ids).toContain("sciencedaily");
    expect(ids).toContain("theconversation");
    expect(ids).toContain("carbonbrief");
    expect(ids).toContain("insideclimatenews");
    expect(ids).toContain("climatecentral");
    expect(ids).toContain("mongabay");
    expect(ids).toContain("e360");
    expect(ids).toContain("ipcc");

    const urls = VERIFIED_SOURCES.map((s) => s.url);
    expect(urls).toContain("https://www.sciencedaily.com/news/earth_climate/sustainability/");
    expect(urls).toContain("https://theconversation.com/");
    expect(urls).toContain("https://www.carbonbrief.org/");
    expect(urls).toContain("https://insideclimatenews.org/");
    expect(urls).toContain("https://www.climatecentral.org/");
    expect(urls).toContain("https://news.mongabay.com/");
    expect(urls).toContain("https://e360.yale.edu/");
    expect(urls).toContain("https://www.ipcc.ch/");
  });

  it("accurately detects articles related to Nepal at publishing time", () => {
    // Matches country
    expect(isRelatedToNepal({ country: "Nepal", title: "Global Climate Summit" })).toBe(true);
    expect(isRelatedToNepal({ country: "nepal" })).toBe(true);

    // Matches region or locality
    expect(isRelatedToNepal({ region: "Nepal Highlands", title: "Forest Report" })).toBe(true);
    expect(isRelatedToNepal({ locality: "Kathmandu Valley", title: "Air Quality" })).toBe(true);
    expect(isRelatedToNepal({ locality: "Pokhara" })).toBe(true);

    // Matches tags
    expect(isRelatedToNepal({ tags: ["climate", "nepal", "adaptation"], title: "Regional Strategy" })).toBe(true);

    // Matches keywords in title, summary, content, or body
    expect(isRelatedToNepal({ title: "Monsoon Landslide Risk in Bagmati Basin" })).toBe(true);
    expect(isRelatedToNepal({ summary: "Glacial monitoring near Dudh Koshi and Everest" })).toBe(true);
    expect(isRelatedToNepal({ content: "Field crews surveyed Imja Tsho glacial moraine." })).toBe(true);
    expect(isRelatedToNepal({ body: "High-altitude weather station installed in Khumbu." })).toBe(true);
    expect(isRelatedToNepal({ title: "Agriculture restoration across Chitwan and Terai" })).toBe(true);

    // Does NOT match non-Nepal global items
    expect(
      isRelatedToNepal({
        title: "Amazon Rainforest Carbon Flux and Biodiversity Collapse",
        summary: "Satellite telemetry tracks canopy density across Brazilian Amazon.",
        country: "Brazil",
        region: "South America",
        tags: ["amazon", "rainforest", "brazil"],
      })
    ).toBe(false);

    expect(
      isRelatedToNepal({
        title: "North Sea Offshore Wind Transmission Expansion",
        summary: "European interconnectors link Danish wind farms to German grid.",
        country: "Denmark",
        region: "Europe",
        tags: ["wind energy", "europe", "grid"],
      })
    ).toBe(false);
  });
});
