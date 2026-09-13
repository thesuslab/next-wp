import { describe, it, expect } from "vitest";
import {
  generateSlug,
  inferCategory,
  extractQuantitativeData,
  fallbackEvidenceSynthesis,
} from "@/lib/editorial/rewriter";
import { RawEditorialItem } from "@/lib/editorial/scraper";

describe("Evidence-Based Editorial Rewriter", () => {
  it("generates URL-friendly slugs from article titles", () => {
    const slug = generateSlug("Glacial Outburst Floods (GLOFs) in Koshi Catchment: +2.1°C Trends!");
    expect(slug).toBe("glacial-outburst-floods-glofs-in-koshi-catchment-21c-trends");
  });

  it("infers categories accurately based on environmental domain", () => {
    expect(
      inferCategory("UNFCCC COP30 Carbon Trading Guidelines", "New multilateral treaty draft.", "Environment")
    ).toBe("Policy");

    expect(
      inferCategory("Upper Trishuli Hydropower Dam Micro-Grid Interconnection", "Transmission lines.", "Policy")
    ).toBe("Infrastructure");

    expect(
      inferCategory("Glacier Ice Core Anomaly and GLOF Hazard In High Valleys", "Thermal warming.", "Environment")
    ).toBe("Climate");

    expect(
      inferCategory("Sacred Forest Corridors and Cloud Forest Bio-conservation", "Restoring species.", "Climate")
    ).toBe("Environment");

    expect(
      inferCategory("Circular Agro-Waste Startups Receive Seed Investment", "Venture capital.", "Climate")
    ).toBe("Enterprise");
  });

  it("extracts quantitative environmental and financial metrics", () => {
    const text = "Average temperatures rose by +1.5°C with 1420 mm annual rainfall across 45,000 hectares, mobilizing $2.4 billion in climate finance.";
    const metrics = extractQuantitativeData(text);

    expect(metrics).toBeDefined();
    expect(metrics?.temperatureMedianC).toBe(1.5);
    expect(metrics?.annualPrecipitationMm).toBe(1420);
    expect(metrics?.areaHectares).toBe(45000);
    expect(metrics?.fundingUsd).toBe("2.4 billion");
  });

  it("generates structured evidence-based fallback body with proper citations and no raw br tags", () => {
    const item: RawEditorialItem = {
      id: "test-icimod-01",
      sourceId: "icimod",
      sourceName: "ICIMOD — International Centre for Integrated Mountain Development",
      sourceUrl: "https://www.icimod.org",
      canonicalUrl: "https://www.icimod.org/article/snow-cover-loss-2026",
      title: "Himalayan Snow Cover Deficit Reaches Record Depletion",
      pubDate: "2026-09-05",
      summary: "Satellite telemetry confirms 22% reduction in spring snow persistence across HKH river basins.",
      content: "Detailed findings on river discharge vulnerability for downstream populations.",
      institutionType: "intergovernmental",
      evidenceLevel: "synthesis",
      defaultCategory: "Climate",
      region: "Hindu Kush Himalaya",
      country: "Nepal",
    };

    const result = fallbackEvidenceSynthesis(item);

    expect(result.summary).toBeTruthy();
    expect(result.body).toContain("### 1. Empirical Findings & Field Observations");
    expect(result.body).toContain("### 2. Ecosystem & Regional Impact");
    expect(result.body).toContain("### 3. Policy, Engineering & Practitioner Implications");
    expect(result.body).toContain("[https://www.icimod.org/article/snow-cover-loss-2026]");
    expect(result.body).not.toContain("<br>");
    expect(result.body).not.toContain("<br/>");
  });
});
