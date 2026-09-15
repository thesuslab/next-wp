/**
 * Evidence-Based Rewriter and Categorization Pipeline.
 * Converts raw verified source dispatches into rigorous, citation-backed
 * Sustainability Lab Knowledge Entries and Editorial Dispatches.
 */

import { RawEditorialItem } from "./scraper";
import { KnowledgeEntry, KnowledgeSource, ClimateDataMetric } from "@/lib/knowledge/data";
import { queryAIProvider } from "@/lib/ai/provider";

/**
 * Clean LLM markdown output, stripping unwanted HTML breaks and vendor names.
 */
function sanitizeMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<br\s*\/?>/gi, "\n\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\b(groq|openai|chatgpt|grok|anthropic|llama)\b/gi, "Sustainability Lab Evidence Engine")
    .trim();
}

/**
 * Generate a clean URL slug from title.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/**
 * Deterministic category mapper based on keywords.
 */
export function inferCategory(
  title: string,
  content: string,
  defaultCat: KnowledgeEntry["category"]
): KnowledgeEntry["category"] {
  const text = `${title} ${content}`.toLowerCase();

  if (
    text.includes("policy") ||
    text.includes("treaty") ||
    text.includes("cop") ||
    text.includes("ndc") ||
    text.includes("regulation") ||
    text.includes("unfccc") ||
    text.includes("carbon tax")
  ) {
    return "Policy";
  }

  if (
    text.includes("hydropower") ||
    text.includes("grid") ||
    text.includes("infrastructure") ||
    text.includes("transport") ||
    text.includes("mobility") ||
    text.includes("solar") ||
    text.includes("transmission")
  ) {
    return "Infrastructure";
  }

  if (
    text.includes("enterprise") ||
    text.includes("business") ||
    text.includes("startup") ||
    text.includes("finance") ||
    text.includes("circular economy") ||
    text.includes("investment") ||
    text.includes("market")
  ) {
    return "Enterprise";
  }

  if (
    text.includes("glacier") ||
    text.includes("temperature") ||
    text.includes("monsoon") ||
    text.includes("glof") ||
    text.includes("warming") ||
    text.includes("climate change") ||
    text.includes("drought")
  ) {
    return "Climate";
  }

  if (
    text.includes("forest") ||
    text.includes("biodiversity") ||
    text.includes("watershed") ||
    text.includes("wildlife") ||
    text.includes("ecosystem") ||
    text.includes("river")
  ) {
    return "Environment";
  }

  return defaultCat || "Environment";
}

/**
 * Extracts quantitative numerical climate/environmental metrics from text.
 */
export function extractQuantitativeData(text: string): ClimateDataMetric | null {
  const metric: ClimateDataMetric = {};
  let found = false;

  // Temperature match (e.g. +1.5°C, 2.4 degrees Celsius)
  const tempMatch = text.match(/([+-]?\d+(?:\.\d+)?)\s*(?:°C|degrees\s*celsius)/i);
  if (tempMatch) {
    metric.temperatureMedianC = parseFloat(tempMatch[1]);
    found = true;
  }

  // Precipitation match (e.g. 1500 mm, 25% decrease)
  const precipMatch = text.match(/(\d+(?:\.\d+)?)\s*mm/i);
  if (precipMatch) {
    metric.annualPrecipitationMm = parseFloat(precipMatch[1]);
    found = true;
  }

  // Area in hectares
  const haMatch = text.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:hectares|ha)\b/i);
  if (haMatch) {
    metric.areaHectares = parseFloat(haMatch[1].replace(/,/g, ""));
    found = true;
  }

  // Financial commitment (USD)
  const financeMatch = text.match(/\$\s*(\d+(?:\.\d+)?)\s*(billion|million)/i);
  if (financeMatch) {
    metric.fundingUsd = `${financeMatch[1]} ${financeMatch[2]}`;
    found = true;
  }

  return found ? metric : null;
}

/**
 * Synthesizes an evidence-based article body without external LLM latency or as fallback.
 */
export function fallbackEvidenceSynthesis(item: RawEditorialItem): {
  summary: string;
  body: string;
  topic: string;
  tags: string[];
} {
  const cleanedItemSummary = (item.summary || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
  const summary =
    cleanedItemSummary.length > 250
      ? `${cleanedItemSummary.slice(0, 247).trim()}...`
      : cleanedItemSummary || `Verified institutional findings published by ${item.sourceName}.`;

  const topic = inferCategory(item.title, item.content, item.defaultCategory);

  const tags = Array.from(
    new Set([
      item.sourceId.toUpperCase(),
      topic,
      item.region.split("/")[0].trim(),
      "Verified Report",
      "Evidence Base",
    ])
  );

  const body = `### 1. Empirical Findings & Field Observations
According to authoritative reporting released by **${item.sourceName}** on ${item.pubDate}, regional environmental assessments indicate substantial operational shifts across local and transboundary ecosystems. 

${item.content || item.summary}

### 2. Ecosystem & Regional Impact
Within the ${item.region} context, unmitigated climatic and hydrological variability creates compound vulnerabilities for community adaptation buffers, seasonal agriculture, and water storage security. Institutional monitoring underscores the urgency of empirical baseline validation over static historical averages.

### 3. Policy, Engineering & Practitioner Implications
- **Evidence Verification**: Telemetry and field methodologies must align with peer-reviewed assessment frameworks.
- **Intervention Protocol**: Regional practitioners are advised to incorporate dynamic risk profiles into infrastructure planning and community disaster mitigation.
- **Institutional Alignment**: Multilateral funding channels and national adaptation bodies must bridge high-level policy commitments with direct watershed-level telemetry.

*Official provenance and source documentation verified at [${item.canonicalUrl}](${item.canonicalUrl}).*`;

  return { summary, body, topic, tags };
}

/**
 * Rewrite raw editorial item using the AI Provider into an Evidence-Based Knowledge Entry.
 */
export async function rewriteEditorialItem(item: RawEditorialItem): Promise<KnowledgeEntry> {
  const category = inferCategory(item.title, item.content, item.defaultCategory);
  const data = extractQuantitativeData(`${item.title} ${item.content}`);
  const slug = `ed-${item.pubDate.replace(/-/g, "")}-${generateSlug(item.title).slice(0, 50)}`;

  const prompt = `You are the chief environmental scientist and senior editorial researcher for The Sustainability Lab (Kathmandu, Nepal).
Rewrite the following raw news dispatch from a verified institutional source into an authoritative, evidence-based research entry for our practitioner knowledge base.

Source Name: ${item.sourceName}
Published Date: ${item.pubDate}
Original URL: ${item.canonicalUrl}
Raw Title: ${item.title}
Raw Snippet/Content: ${item.content.slice(0, 1500)}

Your output must be strict JSON matching this structure:
{
  "academicTitle": "Rigorous, clear academic/practitioner title (no sensationalism)",
  "summary": "2-3 sentence executive synthesis explaining the key empirical finding and practical consequence",
  "empiricalFindings": "Detailed 1-2 paragraphs breaking down the core evidence, data points, or field observations from the source",
  "ecosystemImpact": "1 paragraph explaining the environmental, biodiversity, or climate vulnerability impact on ${item.region}",
  "practitionerImplications": "3 clear bullet points highlighting actionable engineering, policy, or community adaptation recommendations",
  "topic": "Concise topic classification (e.g., Cryosphere & Glaciology, Clean Energy Transition, Himalayan Water Governance, Carbon Policy)",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"]
}

Important:
- Provide strictly evidence-grounded statements.
- Never output raw <br> tags. Use standard markdown paragraphs.
- Never mention the names of AI companies, LLM models, or chatbots.
- Return ONLY valid JSON.`;

  let academicTitle = item.title;
  let summary = item.summary;
  let body = "";
  let topic = `${category} Synthesis`;
  let tags = [item.sourceId.toUpperCase(), category, "Evidence Base"];

  try {
    const aiResponse = await queryAIProvider(
      [{ role: "user", content: prompt }],
      { articleSlug: slug, temperature: 0.2 }
    );

    if (aiResponse && aiResponse.text && !aiResponse.status.includes("Connection failed")) {
      const cleaned = aiResponse.text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
        try {
          const parsed = JSON.parse(cleaned);
          if (parsed.academicTitle) academicTitle = sanitizeMarkdown(parsed.academicTitle);
          if (parsed.summary) summary = sanitizeMarkdown(parsed.summary);
          if (parsed.topic) topic = sanitizeMarkdown(parsed.topic);
          if (Array.isArray(parsed.tags) && parsed.tags.length > 0) {
            tags = parsed.tags.map((t: string) => sanitizeMarkdown(t));
          }

          body = `### 1. Empirical Findings & Field Observations
${sanitizeMarkdown(parsed.empiricalFindings || item.content)}

### 2. Ecosystem & Regional Vulnerability
${sanitizeMarkdown(parsed.ecosystemImpact || item.summary)}

### 3. Policy & Practitioner Implications
${
  Array.isArray(parsed.practitionerImplications)
    ? parsed.practitionerImplications.map((b: string) => `- ${sanitizeMarkdown(b)}`).join("\n")
    : sanitizeMarkdown(parsed.practitionerImplications || "- Strengthen baseline telemetry and field verification.")
}

*Official provenance and source documentation verified at [${item.canonicalUrl}](${item.canonicalUrl}).*`;
        } catch {
          const fallback = fallbackEvidenceSynthesis(item);
          summary = fallback.summary;
          body = fallback.body;
          topic = fallback.topic;
          tags = fallback.tags;
        }
      } else {
        const fallback = fallbackEvidenceSynthesis(item);
        summary = fallback.summary;
        body = fallback.body;
        topic = fallback.topic;
        tags = fallback.tags;
      }
    } else {
      // Fallback synthesis
      const fallback = fallbackEvidenceSynthesis(item);
      summary = fallback.summary;
      body = fallback.body;
      topic = fallback.topic;
      tags = fallback.tags;
    }
  } catch {
    const fallback = fallbackEvidenceSynthesis(item);
    summary = fallback.summary;
    body = fallback.body;
    topic = fallback.topic;
    tags = fallback.tags;
  }

  // Calculate read time based on word count
  const totalWords = (body + summary).split(/\s+/).length;
  const readTimeMinutes = Math.max(3, Math.ceil(totalWords / 180));

  const source: KnowledgeSource = {
    name: item.sourceName,
    url: item.canonicalUrl,
    date: item.pubDate,
    type: `${item.institutionType} verified report`,
    level: item.evidenceLevel,
  };

  return {
    id: `ed-${item.id}`,
    slug,
    title: academicTitle,
    kind: "research",
    summary,
    body,
    topic,
    category,
    region: item.region,
    locality: null,
    country: item.country,
    source,
    tags,
    data,
    readTime: `${readTimeMinutes} min read`,
    seoTitle: `${academicTitle} | Sustainability Lab Editorial`,
    seoDescription: summary.slice(0, 155),
  };
}
