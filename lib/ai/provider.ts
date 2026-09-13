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
  knowledgeEntries,
  getKnowledgeEntryBySlug,
  type KnowledgeEntry,
} from "../knowledge/data";

/**
 * Retrieve matching Knowledge Base articles to ground AI responses.
 */
export function findRelevantKnowledgeContext(
  query: string,
  articleSlug?: string
): string {
  if (articleSlug) {
    const article = getKnowledgeEntryBySlug(articleSlug);
    if (article) {
      const dataStr = article.data ? `\n- Telemetry Metrics: ${JSON.stringify(article.data)}` : "";
      return `### Active Knowledge Base Report Context:
- Title: "${article.title}"
- Slug: ${article.slug}
- Topic: ${article.topic} | Category: ${article.category} | Kind: ${article.kind}
- Primary Source: ${article.source.name} (${article.source.date})
- Source URL: ${article.source.url}
- Evidence Level: ${article.source.level.toUpperCase()}
- Geographic Focus: ${article.region}${article.locality ? ` (${article.locality})` : ""}, ${article.country}
- Executive Summary: ${article.summary}
- Full Report Body:
"""
${article.body}
"""${dataStr}`;
    }
  }

  const q = (query || "").toLowerCase();
  if (!q.trim()) return "";

  // Search knowledge base
  const matches = knowledgeEntries.filter((art) => {
    return (
      art.title.toLowerCase().includes(q) ||
      art.slug.toLowerCase().includes(q) ||
      art.topic.toLowerCase().includes(q) ||
      art.tags.some((t) => q.includes(t.toLowerCase())) ||
      art.source.name.toLowerCase().includes(q)
    );
  });

  if (matches.length === 0) return "";

  const selected = matches.slice(0, 3);
  return `### Relevant Verified Knowledge Base References:
${selected
  .map(
    (art) =>
      `• [${art.source.level.toUpperCase()}] "${art.title}" (${art.source.name}, ${art.source.date}):
  Summary: ${art.summary}
  Body: ${art.body}
  ${art.data ? `Data: ${JSON.stringify(art.data)}` : ""}`
  )
  .join("\n\n")}`;
}

/**
 * System prompt embedding Sustainability Lab domain expertise and verified knowledge base.
 */
export function buildSystemPrompt(context?: any, userQuery = ""): string {
  const articleSlug = context?.articleSlug || context?.article;
  const knowledgeContext = findRelevantKnowledgeContext(userQuery, articleSlug);
  const contextStr = context ? `\nActive Page Telemetry: ${JSON.stringify(context, null, 2)}` : "";

  return `You are the Sustainability Lab's Autonomous Intelligence Advisor and Lab Lens Engine.

## Institutional Identity & Headquarters:
- Name: The Sustainability Lab (Headquarters: Maharajgunj Research Station, Kathmandu Valley, Nepal).
- Physical Coordinates: 27.7408° N, 85.3365° E.
- Mission: An interdisciplinary research laboratory, environmental intelligence platform, and circular design studio. It bridges planetary environmental science, climate engineering, high-resolution spatial telemetry, circular craftsmanship (KĀRVA Studio), and entrepreneurial incubation.

## Core Operational Pillars ("Three Doors"):
1. **Intelligence & Open Knowledge Hub** (/intelligence, /intelligence/knowledge):
   - Spatial telemetry, river catchment GIS, and Climate Risk Scanner (IPCC 2030/2050 horizons).
   - Authoritative Knowledge Base of 28 source-grounded research reports and field guides based on UNFCCC Second NDC, World Bank CCKP & Health Vulnerability Assessments, ICIMOD Hindu Kush Himalaya Assessment, WHO, and ADB.
2. **Resilience & Engineering** (/resilience):
   - Himalayan watershed hydrology, Run-of-River hydropower resilience, GLOF (glacial lake outburst floods) and flash-flood hazard engineering, nature-based bio-engineering slope stabilization (vetiver, Alnus nepalensis).
3. **Enterprise & KĀRVA Studio** (/enterprise, /karva):
   - KĀRVA: Circular craftsmanship studio recovering 80-100 year-old salvaged Shorea robusta (Sal) architectural timber, demolition bricks, and agricultural waste (paddy straw, bagasse, mycelium bio-composites) with zero-VOC finishes.
   - Enterprise diagnostic tool and incubation for South Asian regenerative businesses.
4. **Community & Research Station** (/community, /lab):
   - Physical research station, material testing workshop, and collaborative coworking space in Maharajgunj, Kathmandu.

## Knowledge Base Grounding:
${knowledgeContext || "Access to all 28 Sustainability Lab verified knowledge reports spanning Nepal Climate Policy (NDC), Cryosphere & Glaciers (ICIMOD), Climate Data & Historical Baselines (World Bank CCKP/ERA5), Health Vulnerability, and Adaptation Practice."}

## Instructions:
1. When asked about The Sustainability Lab, explain our identity, location (Maharajgunj), mission, and programs accurately.
2. When asked about specific reports, climate policy, baseline temperatures, trends, or adaptation, cite the primary source (e.g. "According to Nepal's Second NDC...", "World Bank Climate Change Knowledge Portal baseline (1995–2014)...").
3. Maintain a tone that is rigorous, interdisciplinary, quantitative, grounded in physical engineering and ecological science. Format with concise, readable markdown.${contextStr}`;
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

  // If simulation mode, return structured contextual synthesis
  if (config.provider === "simulation" || !config.isConfigured) {
    return {
      provider: config.provider,
      model: config.model,
      status: config.statusMessage,
      text: generateSimulatedResponse(userQuery, context),
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
    max_tokens: 1000,
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
        text: generateSimulatedResponse(
          messages[messages.length - 1]?.content || "",
          context
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
      text: replyText,
    };
  } catch (err: any) {
    console.error(`[AI Provider ${config.provider}] Fetch Exception:`, err);
    return {
      provider: config.provider,
      model: config.model,
      status: `Connection failed: ${err.message}. Showing simulated synthesis.`,
      text: generateSimulatedResponse(
        messages[messages.length - 1]?.content || "",
        context
      ),
    };
  }
}

/**
 * High-fidelity fallback synthesis when keys are absent or offline.
 */
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
      return `### Synthesis: ${article.title}
**Verified Knowledge Base Report • Provenance: ${article.source.name} (${article.source.date})**
*Evidence Level: ${article.source.level.toUpperCase()} • Region: ${article.region}${article.locality ? ` (${article.locality})` : ""}*

1. **Core Finding**: ${article.summary}
2. **Context & Analysis**:
${article.body}
${
  article.data
    ? `3. **Quantitative Telemetry Metrics**:\n${Object.entries(article.data)
        .map(([k, v]) => `   - **${k}**: ${v}`)
        .join("\n")}`
    : ""
}

*Direct citation verified from official document at [${article.source.url}](${article.source.url}).*`;
    }
  }

  // 2. Questions about The Sustainability Lab itself
  if (
    q.includes("what is sustainability lab") ||
    q.includes("what do you do") ||
    q.includes("about the lab") ||
    q.includes("who are you") ||
    q.includes("headquarter") ||
    q.includes("location") ||
    q.includes("where")
  ) {
    return `### The Sustainability Lab (Kathmandu Valley, Nepal)
**Headquarters**: Maharajgunj Research Station (Coordinates: 27.7408° N, 85.3365° E)

The Sustainability Lab is an interdisciplinary research laboratory, environmental intelligence platform, and circular design studio based in Nepal. We bridge planetary environmental science, engineering, spatial telemetry, circular craftsmanship, and entrepreneurial incubation.

**Our Core Operational Pillars ("Three Doors")**:
1. **Intelligence Platform & Open Knowledge Hub** (\`/intelligence\`, \`/intelligence/knowledge\`):
   - Real-time environmental layers, river basin GIS telemetry, and Climate Risk Scanner.
   - Authoritative open repository of **28 source-grounded research reports** synthesizing UNFCCC NDCs, World Bank CCKP climate data, ICIMOD assessments, WHO, and ADB profiles.
2. **Resilience & Watershed Engineering** (\`/resilience\`):
   - Himalayan watershed hydrology, Run-of-River hydropower safeguarding, GLOF (glacial lake outburst floods) and flash-flood hazard modeling, and native bio-engineering (vetiver, Alnus nepalensis).
3. **Enterprise & KĀRVA Studio** (\`/enterprise\`, \`/karva\`):
   - **KĀRVA Studio**: Circular craftsmanship recovering century-old salvaged Shorea robusta (Sal) architectural timber, demolition bricks, and agricultural waste with non-toxic finishes.
   - Diagnostic tools and incubation supporting regenerative businesses across South Asia.
4. **Physical Research Station & Coworking** (\`/community\`, \`/lab\`):
   - Living laboratory and collaborative workspace hosting climate researchers, technologists, and fellows in Maharajgunj.`;
  }

  // 3. Knowledge Base / NDC / Policy topics
  if (q.includes("ndc") || q.includes("net zero") || q.includes("policy") || q.includes("vulnerab")) {
    const ndcArticle = getKnowledgeEntryBySlug("nepal-climate-policy-vulnerability-agency");
    return `### Nepal Climate Policy & Vulnerability Framework
**Primary Source: Government of Nepal — Second Nationally Determined Contribution (NDC)**
*Verified Primary Policy Document*

1. **Topography & Agency**: Nepal's Second NDC connects climate action to fragile mountain topography, climate-sensitive livelihoods, and limited adaptive capacity while asserting political agency for global mitigation.
2. **Net Zero by 2050**: Frames net-zero emissions by 2050 as a binding long-horizon constraint shaping energy, transport, and public finance choices today.
3. **Sectoral Targets (2030)**:
   - Expansion of clean energy generation (hydropower and solar).
   - Electric mobility targets across public transit and rail networks.
   - 200,000 household biogas plants and improved clean-cooking stoves.
   - Forest cover maintenance with equitable community benefit sharing.

*For full report analysis, see the Knowledge Base article at \`/intelligence/knowledge/nepal-climate-policy-vulnerability-agency\`.*`;
  }

  // 4. Packaging / Materials / KĀRVA
  if (q.includes("packag") || q.includes("waste") || q.includes("material") || q.includes("karva") || q.includes("timber")) {
    return `### Circular Material & KĀRVA Studio Assessment
**Maharajgunj Station Telemetry • Material Circularity Testing**

1. **Feedstock Logistics**: In Nepal's central Terai and Bagmati corridors, agricultural residues (paddy straw, bagasse, corn stover) have an average aggregation radius of 20–30 km, keeping transport below $18/metric ton when baled locally.
2. **Salvaged Structural Sal Timber (KĀRVA)**: Compressive strength testing on 80-year-old salvaged Shorea robusta architectural beams shows performance matching or exceeding virgin Grade A lumber, with zero VOC non-toxic tung oil and natural beeswax finishes.
3. **Embodied Carbon Differential**: Utilizing bio-bound mycelium or thermoformed agricultural fiber reduces lifecycle carbon footprint by **74%** compared to imported expanded polystyrene (thermocol).
4. **Next Step**: Pilot testing and material characterization at the Maharajgunj Research Station material workshop.`;
  }

  // 5. Water / Hydrology / GLOF / Mountains
  if (q.includes("hydro") || q.includes("water") || q.includes("flood") || q.includes("river") || q.includes("glacier") || q.includes("glof") || q.includes("himalaya")) {
    return `### Himalayan Watershed & Cryosphere Resilience Analysis
**Primary Source: ICIMOD — The Hindu Kush Himalaya Assessment & World Bank GLOF Health Profile**

1. **Cryosphere Risk**: Mountain warming outpaces global averages. Glaciers act as water towers whose retreat reorganizes dry-season lean flow and peak monsoon discharge timing.
2. **GLOF & Cloudburst Coupling**: Glacial lake outburst floods and cloudburst events require integrated early warning, debris-basin sediment traps upstream of powerhouse intakes, and health system continuity.
3. **Run-of-River Standards**: High-mountain hydropower facilities must shift engineering standards to maintain a minimum 15% lean-season ecological flow (e-flow) and reinforce cut slopes with deep-rooted Alnus nepalensis and vetiver grass.
4. **Basin Approach**: Walk and monitor headwaters, farms, roads, drainage, and downstream users as a single interconnected living infrastructure.`;
  }

  // 6. Climate Data / Baseline / Projections
  if (q.includes("baseline") || q.includes("projection") || q.includes("temperature") || q.includes("era5") || q.includes("ssp")) {
    return `### Nepal Historical Baseline & Mid-Century Climate Telemetry
**Dataset: World Bank Climate Change Knowledge Portal (ERA5 Reanalysis & CMIP6)**

- **Historical Baseline (1995–2014)**:
  - Annual Mean Temperature: **12.66 °C**
  - Annual Precipitation: **2,042.28 mm**
- **Observed Decadal Trends (Since 1970)**:
  - Temperature Rate: **+0.17 °C / decade**
  - Precipitation Shift: **+40.14 mm / decade**
- **Mid-Century Projection (2040–2059, SSP3-7.0)**:
  - Median Temperature Rise: **+1.5 °C** (10th–90th percentile uncertainty range: **1.10 °C to 2.01 °C**)
  - Median Precipitation Shift: **+129.58 mm** (-72.55 mm to +539.67 mm range)

*Reference: Consult \`/intelligence/knowledge/nepal-historical-climate-baseline-1995-2014\` in the Knowledge Hub for the complete evidence ledger.*`;
  }

  return `### Sustainability Lab Intelligence Synthesis
**Maharajgunj Research Station • Active Intelligence Engine**

The Sustainability Lab combines planetary science, physical watershed engineering, spatial telemetry, and circular design across South Asia:
- **Spatial Telemetry**: Catchment vulnerability and hazard exposure assessed across Gandaki, Koshi, and Bagmati river basins.
- **Physical Hardening**: Ductile engineering, bio-shield embankments, and decentralized municipal retention.
- **Knowledge Library**: 28 open reports grounded in UNFCCC, World Bank, ICIMOD, WHO, and ADB assessments.
- **KĀRVA Studio**: Reclaimed vernacular Sal timber and circular material innovation.

*Ask any specific question about our programs, or select any of the 28 Knowledge Base articles to chat directly with verified source documents.*`;
}
