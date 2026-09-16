export type LLMProvider =
  | "openrouter"
  | "openai"
  | "chatgpt"
  | "groq"
  | "grok"
  | "gemini"
  | "nvidia"
  | "ollama"
  | "simulation";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIProviderConfig {
  provider: LLMProvider;
  model: string;
  endpoint: string;
  isConfigured: boolean;
  statusMessage: string;
}

const DEFAULT_MODELS: Record<string, string> = {
  openrouter: "meta-llama/llama-3.3-70b-instruct",
  openai: "gpt-4o-mini",
  chatgpt: "gpt-4o-mini",
  groq: "openai/gpt-oss-120b",
  grok: "grok-2-latest",
  gemini: "gemini-1.5-flash",
  nvidia: "meta/llama-3.1-70b-instruct",
  ollama: "llama3.2",
};

/**
 * Resolve active LLM provider and credentials from environment variables.
 */
export function getActiveAIConfig(): AIProviderConfig {
  const rawProvider = (process.env.LLM_PROVIDER || "").toLowerCase().trim();
  const explicitProvider = rawProvider === "auto" ? "" : rawProvider;

  // 1. Explicit provider check
  if (explicitProvider === "openrouter" || (!explicitProvider && process.env.OPENROUTER_API_KEY)) {
    const key = process.env.OPENROUTER_API_KEY;
    return {
      provider: "openrouter",
      model: process.env.LLM_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_MODELS.openrouter,
      endpoint: "https://openrouter.ai/api/v1/chat/completions",
      isConfigured: Boolean(key),
      statusMessage: key ? "Connected to OpenRouter" : "Missing OPENROUTER_API_KEY",
    };
  }

  // 2. Groq (native key or gsk_ key configured under OPENAI_API_KEY)
  const groqKey =
    process.env.GROQ_API_KEY ||
    (process.env.OPENAI_API_KEY?.startsWith("gsk_") ? process.env.OPENAI_API_KEY : "");
  if (
    explicitProvider === "groq" ||
    (explicitProvider === "grok" && groqKey) ||
    (!explicitProvider && groqKey)
  ) {
    return {
      provider: "groq",
      model:
        process.env.LLM_MODEL ||
        process.env.GROQ_MODEL ||
        process.env.OPENAI_MODEL ||
        DEFAULT_MODELS.groq,
      endpoint: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1/chat/completions",
      isConfigured: Boolean(groqKey),
      statusMessage: groqKey ? "Connected to Groq Cloud (Ultra-Fast Inference)" : "Missing GROQ_API_KEY",
    };
  }

  // 3. xAI Grok (native key or xai- key configured under OPENAI_API_KEY)
  const xaiKey =
    process.env.XAI_API_KEY ||
    (process.env.OPENAI_API_KEY?.startsWith("xai-") ? process.env.OPENAI_API_KEY : "");
  if (
    explicitProvider === "grok" ||
    explicitProvider === "xai" ||
    (!explicitProvider && xaiKey)
  ) {
    return {
      provider: "grok",
      model: process.env.LLM_MODEL || process.env.XAI_MODEL || DEFAULT_MODELS.grok,
      endpoint: process.env.XAI_BASE_URL || "https://api.x.ai/v1/chat/completions",
      isConfigured: Boolean(xaiKey),
      statusMessage: xaiKey ? "Connected to xAI (Grok)" : "Missing XAI_API_KEY",
    };
  }

  // 4. Standard OpenAI (or custom OpenAI-compatible endpoint)
  if (
    explicitProvider === "openai" ||
    explicitProvider === "chatgpt" ||
    (!explicitProvider && process.env.OPENAI_API_KEY)
  ) {
    const key = process.env.OPENAI_API_KEY;
    const endpoint = process.env.OPENAI_BASE_URL
      ? `${process.env.OPENAI_BASE_URL.replace(/\/+$/, "")}/chat/completions`
      : "https://api.openai.com/v1/chat/completions";

    return {
      provider: "openai",
      model: process.env.LLM_MODEL || process.env.OPENAI_MODEL || DEFAULT_MODELS.openai,
      endpoint,
      isConfigured: Boolean(key),
      statusMessage: key ? "Connected to OpenAI (ChatGPT)" : "Missing OPENAI_API_KEY",
    };
  }

  if (explicitProvider === "gemini" || (!explicitProvider && process.env.GEMINI_API_KEY)) {
    const key = process.env.GEMINI_API_KEY;
    return {
      provider: "gemini",
      model: process.env.LLM_MODEL || process.env.GEMINI_MODEL || DEFAULT_MODELS.gemini,
      endpoint: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      isConfigured: Boolean(key),
      statusMessage: key ? "Connected to Google Gemini" : "Missing GEMINI_API_KEY",
    };
  }

  if (explicitProvider === "nvidia" || (!explicitProvider && process.env.NVIDIA_API_KEY)) {
    const key = process.env.NVIDIA_API_KEY;
    return {
      provider: "nvidia",
      model: process.env.LLM_MODEL || process.env.NVIDIA_MODEL || DEFAULT_MODELS.nvidia,
      endpoint: "https://integrate.api.nvidia.com/v1/chat/completions",
      isConfigured: Boolean(key),
      statusMessage: key ? "Connected to NVIDIA NIM" : "Missing NVIDIA_API_KEY",
    };
  }

  if (explicitProvider === "ollama" || (!explicitProvider && process.env.OLLAMA_BASE_URL)) {
    const base = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    return {
      provider: "ollama",
      model: process.env.LLM_MODEL || process.env.OLLAMA_MODEL || DEFAULT_MODELS.ollama,
      endpoint: `${base.replace(/\/+$/, "")}/v1/chat/completions`,
      isConfigured: true,
      statusMessage: `Connected to Local Ollama at ${base}`,
    };
  }

  // Fallback simulation
  return {
    provider: "simulation",
    model: "lab-synthesis-v4.2",
    endpoint: "local://simulated-engine",
    isConfigured: true,
    statusMessage: "Autonomous Lab Intelligence Simulation Mode (Add API key or Ollama to switch to live model)",
  };
}

import {
  getAllKnowledgeEntries,
  getKnowledgeEntryBySlug,
  searchKnowledgeEntries,
  type KnowledgeEntry,
} from "../knowledge/data";

/**
 * Retrieve matching Knowledge Base articles to ground Sustainable AI responses.
 * Uses relevance scoring across titles, summaries, tags, topics, source names, and bodies.
 */
export function findRelevantKnowledgeContext(
  query: string,
  articleSlug?: string
): string {
  let contextOutput = "";

  // 1. If active article slug is provided (user viewing a specific article), include it first
  if (articleSlug) {
    const activeArticle = getKnowledgeEntryBySlug(articleSlug);
    if (activeArticle) {
      const dataStr = activeArticle.data ? `\n- Telemetry Metrics: ${JSON.stringify(activeArticle.data)}` : "";
      contextOutput += `### Active Knowledge Base Report Context:
- Title: "${activeArticle.title}"
- Slug: ${activeArticle.slug}
- Topic: ${activeArticle.topic} | Category: ${activeArticle.category} | Kind: ${activeArticle.kind}
- Primary Source: ${activeArticle.source.name} (${activeArticle.source.date})
- Source URL: ${activeArticle.source.url}
- Summary: ${activeArticle.summary}
- Full Body Extract:
${activeArticle.body}${dataStr}
\n`;
    }
  }

  // 2. Search all indexed knowledge entries (including freshly published and editorial dispatches)
  const matches = searchKnowledgeEntries(query, 3).filter((a) => a.slug !== articleSlug);

  if (matches.length > 0) {
    contextOutput += `### Relevant Verified Knowledge Base & Published Dispatches:
${matches
  .map(
    (art) =>
      `• [${art.source.level.toUpperCase()}] "${art.title}" (${art.source.name}, ${art.source.date}):
  Summary: ${art.summary}
  Body Extract: ${art.body.slice(0, 1200)}...
  Source Citation: ${art.source.url}
  ${art.data ? `Data: ${JSON.stringify(art.data)}` : ""}`
  )
  .join("\n\n")}`;
  }

  return contextOutput.trim();
}

/**
 * System prompt embedding Sustainability Lab domain expertise and verified knowledge base.
 */
export function buildSystemPrompt(context?: any, userQuery = ""): string {
  const articleSlug = context?.articleSlug || context?.article;
  const knowledgeContext = findRelevantKnowledgeContext(userQuery, articleSlug);
  const contextStr = context ? `\nActive Page Telemetry: ${JSON.stringify(context, null, 2)}` : "";

  return `You are the Sustainability Lab's Sustainable AI Advisor and Lab Lens Engine.

## Sustainable AI Identity & Core Principles:
- **Sustainable AI by Design**: You deliver high-density, actionable environmental intelligence with zero hallucination. Every recommendation is grounded in empirical physics, verified assessments, and published field reports.
- **Dynamic Knowledge Indexing**: You have real-time access to the Sustainability Lab's authoritative knowledge base, including freshly published dispatches, institutional assessments (UNEP, ICIMOD, World Bank CCKP, UNFCCC, WHO, ADB), and spatial watershed telemetry.
- **Attribution & Provenance**: Always cite the relevant reports, datasets, and field dispatches when synthesizing answers.

## Institutional Identity & Headquarters:
- Name: The Sustainability Lab (Headquarters: Maharajgunj Research Station, Kathmandu Valley, Nepal).
- Physical Coordinates: 27.7408° N, 85.3365° E.
- Mission: An interdisciplinary research laboratory, environmental intelligence platform, and circular design studio. It bridges planetary environmental science, climate engineering, high-resolution spatial telemetry, circular craftsmanship (KĀRVA Studio), and entrepreneurial incubation.

## Core Operational Pillars ("Three Doors"):
1. **Intelligence & Open Knowledge Hub** (/intelligence, /intelligence/knowledge):
   - Spatial telemetry, river catchment GIS, and Climate Risk Scanner (IPCC 2030/2050 horizons).
   - Authoritative Knowledge Base of source-grounded research reports and field guides based on UNFCCC Second NDC, World Bank CCKP & Health Vulnerability Assessments, ICIMOD Hindu Kush Himalaya Assessment, WHO, and ADB.
2. **Resilience & Engineering** (/resilience):
   - Himalayan watershed hydrology, Run-of-River hydropower resilience, GLOF (glacial lake outburst floods) and flash-flood hazard engineering, nature-based bio-engineering slope stabilization (vetiver, Alnus nepalensis).
3. **Enterprise & KĀRVA — The Sustainability Lab Shop** (/enterprise, /karva):
   - **KĀRVA** is the official craft and product shop of The Sustainability Lab (Shop URL: https://shop.sustainabilitylab.xyz/).
   - Produces circular handcrafted furniture and design artifacts from century-old salvaged Shorea robusta (Sal) architectural timber, non-toxic zero-VOC beeswax finishes, and agricultural bio-composites.
   - Enterprise diagnostic tools and regenerative incubation for South Asian enterprises.
4. **Community & Research Station** (/community, /lab):
   - Physical research station, material testing workshop, and collaborative coworking space in Maharajgunj, Kathmandu.

## How KĀRVA Relates to The Sustainability Lab:
- KĀRVA is the dedicated craftsmanship and circular lifestyle shop of The Sustainability Lab.
- Official Shop Website: [KĀRVA – The Sustainability Lab Shop](https://shop.sustainabilitylab.xyz/)
- Whenever discussing products, furniture, reclaimed timber, or circular craft, ALWAYS provide the link: [KĀRVA Shop](https://shop.sustainabilitylab.xyz/).

## Grounded Knowledge Base Context:
${knowledgeContext || "Access to all Sustainability Lab verified knowledge reports spanning Nepal Climate Policy (NDC), Cryosphere & Glaciers (ICIMOD), Climate Data & Historical Baselines (World Bank CCKP/ERA5), Health Vulnerability, and Published Dispatches."}

## STRICT DOMAIN RELEVANCE ENFORCEMENT (MANDATORY):
- You are exclusively the Sustainability Lab's Sustainable AI Advisor.
- You must ONLY answer questions that pertain to the Sustainability Lab, Maharajgunj Research Station, planetary science, environmental intelligence, climate change, watershed hydrology, cryosphere/GLOF hazards, infrastructure safeguards, circular design/timber craft (KĀRVA), and published reports.
- If the user asks general, off-topic, or unrelated questions (e.g. general trivia, pop culture, sports, general programming/coding puzzles, entertainment, cooking recipes, general world history, or non-environmental queries):
  You must politely decline to answer, state that as the Sustainability Lab's Sustainable AI Advisor you strictly focus on environmental science and climate resilience, and invite them to ask about our research, reports, or watershed data.

## Output Formatting & Polish Rules (MANDATORY):
1. **Never Output Markdown**: The output from the AI is never marked down content. Do NOT use markdown headers (#, ##, ###), no bold or italic asterisks (**, *), no markdown bullet asterisks, no markdown link syntax [text](url), no markdown tables, and no code backticks.
2. **No Broken Tables**: Do NOT output markdown tables that have bullet points, newlines, or multiple paragraphs inside table cells. Use clean, plain text with simple unicode bullet points (•) and clear line breaks.
3. **Never Cut Off**: Ensure every sentence, paragraph, and bullet point is fully completed. Never leave a thought truncated mid-sentence.
4. **Rigorous & Practical**: Maintain an authoritative, interdisciplinary tone grounded in physical engineering, empirical climate data, and local ecological reality.
5. **Clean Plain Text**: Provide readable, formatted plain text with natural paragraphs and unicode bullets (•). Do NOT output raw HTML tags or markdown tags.${contextStr}`;
}

/**
 * Keywords and domain terms that establish relevance to the Sustainability Lab,
 * environmental intelligence, climate science, watershed engineering, or circular craft.
 */
const DOMAIN_RELEVANCE_PATTERNS = [
  /sustainab/i,
  /environ/i,
  /climat/i,
  /ecolog/i,
  /resilien/i,
  /watershed/i,
  /hydrolog/i,
  /water/i,
  /flood/i,
  /river/i,
  /glacier/i,
  /cryosphere/i,
  /glof/i,
  /himalay/i,
  /nepal/i,
  /kathmandu/i,
  /maharajgunj/i,
  /k[aā]rva/i,
  /sal(\s+timber|\s+wood)?/i,
  /timber/i,
  /wood/i,
  /biochar/i,
  /biomass/i,
  /biomaterial/i,
  /carbon/i,
  /emission/i,
  /ndc/i,
  /nap/i,
  /ipcc/i,
  /unfccc/i,
  /unep/i,
  /icimod/i,
  /world\s*bank/i,
  /soil/i,
  /forest/i,
  /hazard/i,
  /risk/i,
  /safeguard/i,
  /eia/i,
  /iee/i,
  /alnus/i,
  /vetiver/i,
  /slope/i,
  /landslide/i,
  /sediment/i,
  /temperature/i,
  /precipitat/i,
  /monsoon/i,
  /weather/i,
  /energy/i,
  /solar/i,
  /hydro/i,
  /waste/i,
  /circular/i,
  /plastic/i,
  /policy/i,
  /governance/i,
  /adaptation/i,
  /mitigation/i,
  /vulnerab/i,
  /bagmati/i,
  /koshi/i,
  /gandaki/i,
  /lab/i,
  /lens/i,
  /advisor/i,
  /report/i,
  /dispatch/i,
  /article/i,
  /telemetry/i,
  /what\s+can\s+you\s+do/i,
  /how\s+can\s+you\s+help/i,
  /how\s+can\s+you\s+support/i,
  /who\s+are\s+you/i,
  /about/i,
  /service/i,
  /collaborat/i,
  /contact/i,
  /visit/i,
  /research/i,
];

/**
 * Validates whether a query is relevant to the Sustainability Lab's domain.
 */
export function isRelevantDomainQuery(query: string, context?: any): boolean {
  if (!query || !query.trim()) return false;
  // If user is currently looking at an article, knowledge page, or active context, allow context questions
  if (context?.articleSlug || context?.article || context?.category || context?.title) {
    return true;
  }

  // Check against domain patterns
  if (DOMAIN_RELEVANCE_PATTERNS.some((pattern) => pattern.test(query))) {
    return true;
  }

  // Check if query matches any indexed knowledge base articles
  const matched = searchKnowledgeEntries(query, 1);
  if (matched.length > 0) {
    const top = matched[0];
    const topTitleTokens = top.title.toLowerCase().split(/\s+/).filter((w) => w.length >= 4);
    const queryLower = query.toLowerCase();
    if (topTitleTokens.some((t) => queryLower.includes(t))) {
      return true;
    }
  }

  return false;
}

/**
 * Strips all markdown syntax and formatting from text, guaranteeing that
 * AI output is never marked down content.
 */
export function stripMarkdown(text: string): string {
  if (!text) return "";

  let cleaned = text;

  // 1. Remove HTML comments and raw tags
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");
  cleaned = cleaned.replace(/<br\s*\/?>/gi, "\n");
  cleaned = cleaned.replace(/&nbsp;/gi, " ");
  cleaned = cleaned.replace(/<\/?[a-z0-9]+[^>]*>/gi, "");

  // 2. Remove code block backticks but keep code content
  cleaned = cleaned.replace(/```[a-zA-Z0-9_-]*\n?([\s\S]*?)```/g, "$1");
  cleaned = cleaned.replace(/`([^`\n]+)`/g, "$1");

  // 3. Remove Markdown headers (#, ##, ###, ####, #####, ######)
  cleaned = cleaned.replace(/^#{1,6}\s+(.+)$/gm, "$1");

  // 4. Remove bold & italic markup (***text***, **text**, *text*, ___text___, __text__, _text_)
  cleaned = cleaned.replace(/\*\*\*([^*]+)\*\*\*/g, "$1");
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, "$1");
  cleaned = cleaned.replace(/\*([^*\n]+)\*/g, "$1");
  cleaned = cleaned.replace(/___([^_]+)___/g, "$1");
  cleaned = cleaned.replace(/__([^_]+)__/g, "$1");
  cleaned = cleaned.replace(/_([^_\n]+)_/g, "$1");

  // 5. Convert markdown links [Label](url) -> "Label: url" or plain url
  cleaned = cleaned.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
    if (label.trim() === url.trim() || !label.trim()) {
      return url;
    }
    return `${label}: ${url}`;
  });

  // 6. Convert markdown images ![alt](url) -> ""
  cleaned = cleaned.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "");

  // 7. Remove blockquote markers
  cleaned = cleaned.replace(/^>\s*/gm, "");

  // 8. Remove horizontal rules
  cleaned = cleaned.replace(/^[-*_]{3,}\s*$/gm, "");

  // 9. Standardize list bullets: convert asterisk/plus/hyphen bullets to clean unicode bullets (• )
  cleaned = cleaned.replace(/^(\s*)[*+]\s+/gm, "$1• ");
  cleaned = cleaned.replace(/^(\s*)-\s+/gm, "$1• ");

  // 10. Clean up excessive empty lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return cleaned.trim();
}

export function getOutOfScopeResponse(): string {
  return stripMarkdown(`Out of Scope • Sustainable AI Advisor

I am the Sustainability Lab's Sustainable AI Advisor, specialized exclusively in environmental intelligence, Himalayan climate resilience, watershed engineering, and circular craftsmanship.

I can only assist with inquiries related to:
• Climate Science & Telemetry: Nepal historical baselines, SSP3-7.0 projections, and cryosphere telemetry.
• Watershed & Engineering: GLOF multi-hazard early warning, Run-of-River hydro safeguarding, and bio-engineering cut-slope stabilization.
• Circular Design & Craft: Salvaged Shorea robusta (Sal) architectural timber and KĀRVA Studio artifacts.
• Published Dispatches: Verified institutional reports and field dispatches published across the knowledge base.

Please pose an inquiry related to environmental science, climate adaptation, or Sustainability Lab research.`);
}

/**
 * Send chat completion request to active provider.
 */
export async function queryAIProvider(
  messages: ChatMessage[],
  context?: any
): Promise<{
  text: string;
  provider: LLMProvider;
  model: string;
  status: string;
}> {
  const config = getActiveAIConfig();
  const userQuery = messages[messages.length - 1]?.content || "";

  // Reject off-topic / general questions
  if (userQuery && !isRelevantDomainQuery(userQuery, context)) {
    return {
      provider: config.provider,
      model: config.model,
      status: "Domain relevance enforced: off-topic query declined.",
      text: stripMarkdown(getOutOfScopeResponse()),
    };
  }

  // If simulation mode, return structured contextual synthesis
  if (config.provider === "simulation" || !config.isConfigured) {
    return {
      provider: config.provider,
      model: config.model,
      status: config.statusMessage,
      text: stripMarkdown(generateSimulatedResponse(userQuery, context)),
    };
  }

  const systemMsg: ChatMessage = {
    role: "system",
    content: buildSystemPrompt(context, userQuery),
  };

  const payload = {
    model: config.model,
    messages: [systemMsg, ...messages],
    temperature: 0.3,
    max_tokens: 3000,
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.provider === "openrouter") {
    headers["Authorization"] = `Bearer ${process.env.OPENROUTER_API_KEY}`;
    headers["HTTP-Referer"] = "https://sustainabilitylab.xyz";
  } else if (config.provider === "groq") {
    const key = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    headers["Authorization"] = `Bearer ${key}`;
  } else if (config.provider === "grok") {
    const key = process.env.XAI_API_KEY || process.env.OPENAI_API_KEY;
    headers["Authorization"] = `Bearer ${key}`;
  } else if (config.provider === "openai" || config.provider === "chatgpt") {
    headers["Authorization"] = `Bearer ${process.env.OPENAI_API_KEY}`;
  } else if (config.provider === "gemini") {
    headers["Authorization"] = `Bearer ${process.env.GEMINI_API_KEY}`;
  } else if (config.provider === "nvidia") {
    headers["Authorization"] = `Bearer ${process.env.NVIDIA_API_KEY}`;
  } else if (config.provider === "ollama") {
    headers["Authorization"] = "Bearer ollama";
  }

  try {
    const res = await fetch(config.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.warn(`[AI Provider ${config.provider}] Error ${res.status}:`, errorText);
      return {
        provider: config.provider,
        model: config.model,
        status: `Provider error ${res.status}: falling back to Lab simulation`,
        text: stripMarkdown(
          generateSimulatedResponse(
            messages[messages.length - 1]?.content || "",
            context
          )
        ),
      };
    }

    const data = await res.json();
    const replyText =
      data.choices?.[0]?.message?.content ||
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    return {
      provider: config.provider,
      model: config.model,
      status: "OK",
      text: stripMarkdown(replyText),
    };
  } catch (err: any) {
    console.error(`[AI Provider ${config.provider}] Fetch Exception:`, err);
    return {
      provider: config.provider,
      model: config.model,
      status: `Connection failed: ${err.message}. Showing simulated synthesis.`,
      text: stripMarkdown(
        generateSimulatedResponse(
          messages[messages.length - 1]?.content || "",
          context
        )
      ),
    };
  }
}

/**
 * High-fidelity fallback synthesis when keys are absent or offline.
 */
function generateSimulatedResponse(query: string, context?: any): string {
  const q = query.toLowerCase();
  const articleSlug = context?.articleSlug || context?.article;

  // 1. If an active knowledge article is present in context, answer based on it
  if (articleSlug) {
    const article = getKnowledgeEntryBySlug(articleSlug);
    if (article) {
      return stripMarkdown(`Synthesis: ${article.title}
Verified Knowledge Base Report • Provenance: ${article.source.name} (${article.source.date})
Evidence Level: ${article.source.level.toUpperCase()} • Region: ${article.region}${article.locality ? ` (${article.locality})` : ""}

1. Core Finding: ${article.summary}

2. Context & Analysis:
${article.body}
${
  article.data
    ? `\n3. Quantitative Telemetry Metrics:\n${Object.entries(article.data)
        .map(([k, v]) => `   • ${k}: ${v}`)
        .join("\n")}`
    : ""
}

Direct citation verified from official document at ${article.source.url}.`);
    }
  }

  // 2. Comprehensive Support Capabilities ("What can you do for me?", "How can you support me?", etc.)
  if (
    q.includes("what can you do") ||
    q.includes("how can you support") ||
    q.includes("how can you help") ||
    q.includes("support me") ||
    q.includes("offer me") ||
    q.includes("what do you offer") ||
    q.includes("services") ||
    q.includes("what is sustainability lab") ||
    q.includes("what do you do") ||
    q.includes("about the lab") ||
    q.includes("who are you") ||
    q.includes("headquarter") ||
    q.includes("location") ||
    q.includes("where")
  ) {
    return stripMarkdown(`How The Sustainability Lab Can Support You

The Sustainability Lab (Maharajgunj Research Station, Kathmandu Valley: 27.7408° N, 85.3365° E) operates as an interdisciplinary research laboratory, environmental intelligence platform, and circular craftsmanship studio. We bridge scientific research, physical climate engineering, and tangible regenerative products.

Here is how we can support your work across our operational pillars:

1. Intelligence & Open Knowledge Hub
• 28+ Verified Evidence Reports: Access our open repository of peer-reviewed syntheses grounded in official multilateral documents (UNFCCC Second NDC, World Bank CCKP, ICIMOD Hindu Kush Himalaya Assessment, WHO, and ADB).
• High-Resolution Spatial GIS Telemetry: Explore interactive spatial layers for Himalayan river catchments, glacier retreat zones, and climate vulnerability hotspots.
• Climate Risk Scanner: Run forward-looking IPCC scenario modeling (SSP3-7.0 / SSP1-2.6) for 2030 and 2050 horizons to evaluate temperature anomalies and extreme precipitation risks for your projects.
• Explore: /intelligence and /intelligence/knowledge

2. Watershed Resilience & Climate Engineering
• Hydrological Risk Auditing: Run-of-River hydropower vulnerability assessments, cloudburst peak return calculation, and desanding basin adaptations.
• Nature-Based Bio-Engineering: Slope stabilization blueprints utilizing deep-rooted native species (Alnus nepalensis, vetiver grass) for mountain roads and fragile hillsides.
• Early-Warning & IoT Sensing: Low-cost telemetry mesh deployment for ungauged mountain catchments.
• Explore: /resilience

3. Enterprise Incubation & Circular Diagnostics
• Diagnostic Tool: Rapidly benchmark your venture across circularity metrics, material footprint, and climate risk.
• Working Capital & Supply Chain Advisory: Structuring regenerative business models and sustainable agricultural waste aggregation.
• Explore: /enterprise

4. KĀRVA — The Sustainability Lab Shop
• Circular Craftsmanship & Upcycling: KĀRVA is the official commercial shop and craft design studio of The Sustainability Lab.
• Reclaimed Himalayan Timber: We recover century-old salvaged Shorea robusta (Sal) architectural beams from heritage demolition sites, handcrafting museum-grade furniture and architectural artifacts with non-toxic, zero-VOC beeswax and natural oil finishes.
• Bio-Composite Products: Agricultural waste transformations (paddy straw, bagasse, mycelium packaging alternatives).
• Visit Official Shop: KĀRVA – The Sustainability Lab Shop: https://shop.sustainabilitylab.xyz/ or browse our archive at /karva.

5. Physical Research Station & Coworking
• Maharajgunj Research Station: A physical workspace, testing lab, and convening space in Kathmandu (Coordinates: 27.7408° N, 85.3365° E) for climate researchers, technologists, and circular entrepreneurs.
• Connect: Visit /collaborate or reach out directly to hello@sustainabilitylab.xyz.`);
  }

  // 3. Knowledge Base / NDC / Policy topics
  if (q.includes("ndc") || q.includes("net zero") || q.includes("policy") || q.includes("vulnerab")) {
    return stripMarkdown(`Nepal Climate Policy & Vulnerability Framework
Primary Source: Government of Nepal — Second Nationally Determined Contribution (NDC)
Verified Primary Policy Document

1. Topography & Agency: Nepal's Second NDC connects climate action to fragile mountain topography, climate-sensitive livelihoods, and limited adaptive capacity while asserting political agency for global mitigation.
2. Net Zero by 2050: Frames net-zero emissions by 2050 as a binding long-horizon constraint shaping energy, transport, and public finance choices today.
3. Sectoral Targets (2030):
   • Expansion of clean energy generation (hydropower and solar).
   • Electric mobility targets across public transit and rail networks.
   • 200,000 household biogas plants and improved clean-cooking stoves.
   • Forest cover maintenance with equitable community benefit sharing.

For full report analysis, see the Knowledge Base article at /intelligence/knowledge/nepal-climate-policy-vulnerability-agency.`);
  }

  // 4. Packaging / Materials / KĀRVA
  if (q.includes("packag") || q.includes("waste") || q.includes("material") || q.includes("karva") || q.includes("timber") || q.includes("shop")) {
    return stripMarkdown(`KĀRVA — The Sustainability Lab Shop & Material Studio
Official Online Shop: KĀRVA – The Sustainability Lab Shop: https://shop.sustainabilitylab.xyz/
Physical Location: Maharajgunj Research Station Material Workshop, Kathmandu

KĀRVA is the official circular craftsmanship and lifestyle shop of The Sustainability Lab. We recover discarded materials from Himalayan ecosystems and heritage urban demolition sites, transforming them into high-performance, timeless architectural furniture and lifestyle goods.

Core KĀRVA Collections & Offerings:
1. Salvaged Century-Old Sal Timber (Shorea Robusta):
   • Recovered from 80–100 year-old traditional buildings scheduled for demolition across Kathmandu Valley.
   • Laboratory compressive testing confirms century-old heartwood exhibits 18% higher structural shear strength than virgin kiln-dried lumber due to slow silica mineralization.
   • Finished exclusively with organic tung oil and natural Himalayan beeswax (100% zero-VOC and non-toxic).
2. Upcycled Agricultural Residues & Bio-Composites:
   • Thermoformed agricultural fibers (bagasse, paddy straw) and mycelium bio-bound materials offering a 74% embodied carbon reduction over polystyrene (thermocol).
3. Heritage Architectural Relics & Functional Craft:
   • Limited-run specimen furniture, artisanal desk goods, and custom architectural commissions for regenerative spaces.

Browse current releases and specimens directly at KĀRVA – The Sustainability Lab Shop: https://shop.sustainabilitylab.xyz/ or visit the physical fabrication bench at our Maharajgunj Research Station.`);
  }

  // 5. Water / Hydrology / GLOF / Mountains
  if (q.includes("hydro") || q.includes("water") || q.includes("flood") || q.includes("river") || q.includes("glacier") || q.includes("glof") || q.includes("himalaya")) {
    return stripMarkdown(`Himalayan Watershed & Cryosphere Resilience Analysis
Primary Source: ICIMOD — The Hindu Kush Himalaya Assessment & World Bank GLOF Health Profile

1. Cryosphere Risk: Mountain warming outpaces global averages. Glaciers act as water towers whose retreat reorganizes dry-season lean flow and peak monsoon discharge timing.
2. GLOF & Cloudburst Coupling: Glacial lake outburst floods and cloudburst events require integrated early warning, debris-basin sediment traps upstream of powerhouse intakes, and health system continuity.
3. Run-of-River Standards: High-mountain hydropower facilities must shift engineering standards to maintain a minimum 15% lean-season ecological flow (e-flow) and reinforce cut slopes with deep-rooted Alnus nepalensis and vetiver grass.
4. Basin Approach: Walk and monitor headwaters, farms, roads, drainage, and downstream users as a single interconnected living infrastructure.`);
  }

  // 6. Climate Data / Baseline / Projections
  if (q.includes("baseline") || q.includes("projection") || q.includes("temperature") || q.includes("era5") || q.includes("ssp")) {
    return stripMarkdown(`Nepal Historical Baseline & Mid-Century Climate Telemetry
Dataset: World Bank Climate Change Knowledge Portal (ERA5 Reanalysis & CMIP6)

Historical Baseline (1995–2014):
• Annual Mean Temperature: 12.66 °C
• Annual Precipitation: 2,042.28 mm

Observed Decadal Trends (Since 1970):
• Temperature Rate: +0.17 °C / decade
• Precipitation Shift: +40.14 mm / decade

Mid-Century Projection (2040–2059, SSP3-7.0):
• Median Temperature Rise: +1.5 °C (10th–90th percentile uncertainty range: 1.10 °C to 2.01 °C)
• Median Precipitation Shift: +129.58 mm (-72.55 mm to +539.67 mm range)

Reference: Consult /intelligence/knowledge/nepal-historical-climate-baseline-1995-2014 in the Knowledge Hub for the complete evidence ledger.`);
  }

  // 7. Dynamic synthesis grounded in newly indexed or published knowledge articles
  const matchedEntries = searchKnowledgeEntries(query, 1);
  if (matchedEntries.length > 0) {
    const art = matchedEntries[0];
    return stripMarkdown(`Sustainable AI Synthesis: ${art.title}
Verified Knowledge Base Dispatch • Provenance: ${art.source.name} (${art.source.date})
Topic: ${art.topic} • Category: ${art.category} • Evidence Level: ${art.source.level.toUpperCase()}

1. Executive Finding: ${art.summary}

2. Context & Ingested Analysis:
${art.body}
${art.data ? `\n3. Empirical Telemetry: ${JSON.stringify(art.data, null, 2)}` : ""}

Direct citation verified from ${art.source.name}: ${art.source.url}`);
  }

  return stripMarkdown(`Sustainable AI Intelligence Synthesis
Maharajgunj Research Station • Autonomous Sustainable AI Advisor

The Sustainability Lab pairs physical climate science, spatial watershed engineering, and verified knowledge indexing:
• Spatial Telemetry: Catchment vulnerability and hazard exposure across Himalayan river basins.
• Physical Hardening: Ductile engineering, bio-shield embankments, and decentralized municipal retention.
• Dynamic Knowledge Base: All published dispatches and research reports are continuously indexed into this Sustainable AI Advisor.
• KĀRVA Studio: Reclaimed vernacular Sal timber and circular biomaterial innovation.

Ask any specific question about our programs, or select any published article to chat directly with verified source documents.`);
}
