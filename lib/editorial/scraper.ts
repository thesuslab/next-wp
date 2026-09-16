/**
 * Verified Institutional Source Scraper for Sustainability Lab Editorial.
 * Strictly whitelists legitimate, reputable environmental science and policy publishers.
 */

export interface VerifiedSourceDefinition {
  id: string;
  name: string;
  url: string;
  feedUrl: string;
  institutionType: "intergovernmental" | "treaty body" | "multilateral bank" | "peer-reviewed journalism";
  evidenceLevel: "primary" | "synthesis";
  defaultCategory: "Climate" | "Policy" | "Infrastructure" | "Environment" | "Enterprise" | "Case Studies";
  region: string;
  country: string;
}

export interface RawEditorialItem {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  canonicalUrl: string;
  title: string;
  pubDate: string;
  summary: string;
  content: string;
  institutionType: string;
  evidenceLevel: "primary" | "synthesis";
  defaultCategory: "Climate" | "Policy" | "Infrastructure" | "Environment" | "Enterprise" | "Case Studies";
  region: string;
  country: string;
}

/**
 * Whitelist of trusted, reputable multilateral, scientific, and field-reporting sources
 * directly aligned with the Sustainability Lab Knowledge Base.
 */
export const VERIFIED_SOURCES: VerifiedSourceDefinition[] = [
  {
    id: "icimod",
    name: "ICIMOD — International Centre for Integrated Mountain Development",
    url: "https://www.icimod.org",
    feedUrl: "https://www.icimod.org/feed/",
    institutionType: "intergovernmental",
    evidenceLevel: "synthesis",
    defaultCategory: "Environment",
    region: "Hindu Kush Himalaya",
    country: "Nepal",
  },
  {
    id: "unfccc",
    name: "UNFCCC — United Nations Framework Convention on Climate Change",
    url: "https://unfccc.int",
    feedUrl: "https://unfccc.int/rss.xml",
    institutionType: "treaty body",
    evidenceLevel: "primary",
    defaultCategory: "Policy",
    region: "Global / Asia-Pacific",
    country: "Global",
  },
  {
    id: "unep",
    name: "UNEP — United Nations Environment Programme",
    url: "https://www.unep.org",
    feedUrl: "https://www.unep.org/rss.xml",
    institutionType: "intergovernmental",
    evidenceLevel: "synthesis",
    defaultCategory: "Climate",
    region: "Global / South Asia",
    country: "Global",
  },
  {
    id: "sciencedaily",
    name: "ScienceDaily: Sustainability News",
    url: "https://www.sciencedaily.com/news/earth_climate/sustainability/",
    feedUrl: "https://www.sciencedaily.com/rss/earth_climate/sustainability.xml",
    institutionType: "peer-reviewed journalism",
    evidenceLevel: "primary",
    defaultCategory: "Environment",
    region: "Global",
    country: "Global",
  },
  {
    id: "theconversation",
    name: "The Conversation",
    url: "https://theconversation.com/",
    feedUrl: "https://theconversation.com/global/articles.atom",
    institutionType: "peer-reviewed journalism",
    evidenceLevel: "synthesis",
    defaultCategory: "Climate",
    region: "Global",
    country: "Global",
  },
  {
    id: "carbonbrief",
    name: "Carbon Brief",
    url: "https://www.carbonbrief.org/",
    feedUrl: "https://www.carbonbrief.org/feed/",
    institutionType: "peer-reviewed journalism",
    evidenceLevel: "synthesis",
    defaultCategory: "Climate",
    region: "Global",
    country: "Global",
  },
  {
    id: "insideclimatenews",
    name: "Inside Climate News",
    url: "https://insideclimatenews.org/",
    feedUrl: "https://insideclimatenews.org/feed/",
    institutionType: "peer-reviewed journalism",
    evidenceLevel: "primary",
    defaultCategory: "Climate",
    region: "Global / North America",
    country: "Global",
  },
  {
    id: "climatecentral",
    name: "Climate Central",
    url: "https://www.climatecentral.org/",
    feedUrl: "https://www.climatecentral.org/feed",
    institutionType: "peer-reviewed journalism",
    evidenceLevel: "primary",
    defaultCategory: "Climate",
    region: "Global",
    country: "Global",
  },
  {
    id: "mongabay",
    name: "Mongabay",
    url: "https://news.mongabay.com/",
    feedUrl: "https://news.mongabay.com/feed/",
    institutionType: "peer-reviewed journalism",
    evidenceLevel: "primary",
    defaultCategory: "Environment",
    region: "Global",
    country: "Global",
  },
  {
    id: "e360",
    name: "Yale Environment 360 (E360)",
    url: "https://e360.yale.edu/",
    feedUrl: "https://e360.yale.edu/feed",
    institutionType: "peer-reviewed journalism",
    evidenceLevel: "synthesis",
    defaultCategory: "Environment",
    region: "Global",
    country: "Global",
  },
  {
    id: "ipcc",
    name: "IPCC — Intergovernmental Panel on Climate Change",
    url: "https://www.ipcc.ch/",
    feedUrl: "https://www.ipcc.ch/feed/",
    institutionType: "intergovernmental",
    evidenceLevel: "primary",
    defaultCategory: "Climate",
    region: "Global",
    country: "Global",
  },
];

/**
 * Detects whether a news item or article is specifically related to Nepal
 * (by country, region, locality, or text keywords).
 * Used at publishing time to ensure news related to Nepal is never branded
 * or shown under EDITORIAL 6:00 AM FEED • VERIFIED.
 */
export function isRelatedToNepal(item: {
  title?: string;
  summary?: string;
  content?: string;
  body?: string;
  country?: string;
  region?: string;
  locality?: string | null;
  tags?: string[];
}): boolean {
  if (!item) return false;

  const country = (item.country || "").trim().toLowerCase();
  if (country === "nepal") return true;

  const region = (item.region || "").trim().toLowerCase();
  if (region.includes("nepal")) return true;

  const locality = (item.locality || "").trim().toLowerCase();
  if (locality.includes("nepal")) return true;

  if (Array.isArray(item.tags) && item.tags.some((t) => t.toLowerCase() === "nepal")) {
    return true;
  }

  const tagsStr = Array.isArray(item.tags) ? item.tags.join(" ") : "";
  const combined = `${item.title || ""} ${item.summary || ""} ${item.content || ""} ${item.body || ""} ${item.locality || ""} ${item.region || ""} ${item.country || ""} ${tagsStr}`.toLowerCase();
  const nepalPatterns = [
    /\bnepal\b/i,
    /\bnepali\b/i,
    /\bnepalese\b/i,
    /\bkathmandu\b/i,
    /\bpokhara\b/i,
    /\blalitpur\b/i,
    /\bbhaktapur\b/i,
    /\bchitwan\b/i,
    /\bbagmati\b/i,
    /\bdudh\s+koshi\b/i,
    /\bgandaki\b/i,
    /\bkarnali\b/i,
    /\bkoshi\b/i,
    /\bmaharajgunj\b/i,
    /\bkhumbu\b/i,
    /\beverest\b/i,
    /\bsagarmatha\b/i,
    /\bimja\s+tsho\b/i,
    /\bmustang\b/i,
    /\bterai\b/i,
  ];

  return nepalPatterns.some((pattern) => pattern.test(combined));
}

/**
 * Clean raw text from HTML tags, CDATA wrappers, entities, and excessive whitespace.
 */
export function cleanHtmlSnippet(raw: string): string {
  if (!raw) return "";
  let text = raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Unescape common entities that may conceal comments or tags
  text = text
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  // Strip comments and remaining tags
  text = text
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ");

  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parses RSS / Atom XML into normalized item structures.
 */
export function parseRssXml(xml: string, source: VerifiedSourceDefinition): RawEditorialItem[] {
  const items: RawEditorialItem[] = [];

  // Match RSS 2.0 <item> or Atom <entry>
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];

  for (const block of itemBlocks) {
    // Title
    const titleMatch = block.match(/<title[\s\S]*?>([\s\S]*?)<\/title>/i);
    const title = cleanHtmlSnippet(titleMatch ? titleMatch[1] : "");

    // Link
    let link = "";
    const linkMatch = block.match(/<link[\s\S]*?>([\s\S]*?)<\/link>/i);
    if (linkMatch && linkMatch[1].trim()) {
      link = cleanHtmlSnippet(linkMatch[1]);
    } else {
      // Check href attribute (Atom format: <link href="..." />)
      const hrefMatch = block.match(/<link[^>]+href=["']([^"']+)["']/i);
      if (hrefMatch) link = hrefMatch[1].trim();
    }

    // Publication Date
    const pubDateMatch =
      block.match(/<pubDate[\s\S]*?>([\s\S]*?)<\/pubDate>/i) ||
      block.match(/<published[\s\S]*?>([\s\S]*?)<\/published>/i) ||
      block.match(/<updated[\s\S]*?>([\s\S]*?)<\/updated>/i) ||
      block.match(/<dc:date[\s\S]*?>([\s\S]*?)<\/dc:date>/i);
    let pubDate = "";
    if (pubDateMatch) {
      const rawDate = cleanHtmlSnippet(pubDateMatch[1]);
      const parsed = new Date(rawDate);
      pubDate = isNaN(parsed.getTime()) ? new Date().toISOString().split("T")[0] : parsed.toISOString().split("T")[0];
    } else {
      pubDate = new Date().toISOString().split("T")[0];
    }

    // Description / Summary
    const descMatch =
      block.match(/<description[\s\S]*?>([\s\S]*?)<\/description>/i) ||
      block.match(/<summary[\s\S]*?>([\s\S]*?)<\/summary>/i);
    const summary = cleanHtmlSnippet(descMatch ? descMatch[1] : "");

    // Full Content / Encoded
    const contentMatch =
      block.match(/<content:encoded[\s\S]*?>([\s\S]*?)<\/content:encoded>/i) ||
      block.match(/<content[\s\S]*?>([\s\S]*?)<\/content>/i);
    const content = cleanHtmlSnippet(contentMatch ? contentMatch[1] : summary);

    if (title && (link || summary)) {
      // Simple hash / ID from title or URL
      const id = `${source.id}-${title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 32)}`;
      items.push({
        id,
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: source.url,
        canonicalUrl: link || source.url,
        title,
        pubDate,
        summary: summary || title,
        content: content || summary || title,
        institutionType: source.institutionType,
        evidenceLevel: source.evidenceLevel,
        defaultCategory: source.defaultCategory,
        region: source.region,
        country: source.country,
      });
    }
  }

  return items;
}

/**
 * Filter items for environmental, climate, sustainability, and mountain ecosystem relevance.
 */
export function isRelevantEnvironmentalNews(item: RawEditorialItem): boolean {
  const combined = `${item.title} ${item.summary} ${item.content}`.toLowerCase();
  const keywords = [
    "climate",
    "sustainable",
    "sustainability",
    "carbon",
    "emission",
    "energy",
    "renewable",
    "water",
    "hydrology",
    "glacier",
    "cryosphere",
    "mountain",
    "himalaya",
    "himalayan",
    "nepal",
    "south asia",
    "forest",
    "biodiversity",
    "adaptation",
    "resilience",
    "waste",
    "circular",
    "environment",
    "environmental",
    "ecosystem",
    "pollution",
    "conservation",
  ];

  return keywords.some((kw) => combined.includes(kw));
}

/**
 * Fetch verified source feeds with resilient timeout & headers.
 */
export async function fetchVerifiedSourceFeed(
  source: VerifiedSourceDefinition,
  timeoutMs = 12000
): Promise<RawEditorialItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(source.feedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "SustainabilityLabEditorialBot/1.0 (+https://www.sustainabilitylab.xyz)",
        Accept: "application/rss+xml, application/xml, text/xml, application/atom+xml, */*",
      },
      next: { revalidate: 0 },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[Editorial Scraper] Source ${source.name} responded with status ${res.status}`);
      return [];
    }

    const xml = await res.text();
    const parsed = parseRssXml(xml, source);
    return parsed.filter(isRelevantEnvironmentalNews);
  } catch (err: any) {
    console.error(`[Editorial Scraper] Error fetching feed for ${source.name}:`, err.message);
    return [];
  }
}

/**
 * Fetch from all verified sources in parallel, returning deduplicated candidate articles.
 */
export async function scrapeAllVerifiedSources(): Promise<RawEditorialItem[]> {
  const results = await Promise.allSettled(
    VERIFIED_SOURCES.map((source) => fetchVerifiedSourceFeed(source))
  );

  const allItems: RawEditorialItem[] = [];
  const seenUrls = new Set<string>();

  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const item of result.value) {
        if (!seenUrls.has(item.canonicalUrl)) {
          seenUrls.add(item.canonicalUrl);
          allItems.push(item);
        }
      }
    }
  }

  return allItems;
}
