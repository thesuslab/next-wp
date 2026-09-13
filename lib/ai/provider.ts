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
- Summary: ${article.summary}
- Full Body Extract:
${article.body}${dataStr}
`;
    }
  }

  const q = (query || "").toLowerCase();
  if (!q.trim()) return "";

  // Search entire knowledge base including freshly ingested editorial entries
  const allEntries = getAllKnowledgeEntries();
  const matches = allEntries.filter((art) => {
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
   - Authoritative Knowledge Base of 28+ source-grounded research reports and field guides based on UNFCCC Second NDC, World Bank CCKP & Health Vulnerability Assessments, ICIMOD Hindu Kush Himalaya Assessment, WHO, and ADB.
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

## Knowledge Base Grounding:
${knowledgeContext || "Access to all Sustainability Lab verified knowledge reports spanning Nepal Climate Policy (NDC), Cryosphere & Glaciers (ICIMOD), Climate Data & Historical Baselines (World Bank CCKP/ERA5), Health Vulnerability, and Adaptation Practice."}

## Output Formatting & Polish Rules (MANDATORY):
1. **No Broken Tables**: Do NOT output markdown tables that have bullet points, newlines, or multiple paragraphs inside table cells. Markdown tables cannot render multi-line cells. Instead of tables, use clean, hierarchical sections with bold headings and bulleted lists.
2. **Never Cut Off**: Ensure every sentence, paragraph, and bullet point is fully completed. Never leave a thought truncated mid-sentence.
3. **Rigorous & Practical**: Maintain an authoritative, interdisciplinary tone grounded in physical engineering, empirical climate data, and local ecological reality.
4. **Clean Markdown**: Use standard markdown line breaks and lists. Do NOT output raw HTML tags (such as break tags, div containers, or non-breaking spaces).${contextStr}`;
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
        text: generateSimulatedResponse(
          messages[messages.length - 1]?.content || "",
          context
        ),
      };
    }

    const data = await res.json();
    let replyText =
      data.choices?.[0]?.message?.content ||
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    // Clean any unwanted raw HTML tags like <br>, <br/>, <br />, &nbsp; from response
    replyText = replyText
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/&nbsp;/gi, " ")
      .replace(/<\/?[a-z0-9]+[^>]*>/gi, "");

    return {
      provider: config.provider,
      model: config.model,
      status: "OK",
      text: replyText.trim(),
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
    return `### How The Sustainability Lab Can Support You

The Sustainability Lab (Maharajgunj Research Station, Kathmandu Valley: 27.7408° N, 85.3365° E) operates as an interdisciplinary research laboratory, environmental intelligence platform, and circular craftsmanship studio. We bridge scientific research, physical climate engineering, and tangible regenerative products.

Here is how we can support your work across our operational pillars:

#### 1. Intelligence & Open Knowledge Hub
- **28+ Verified Evidence Reports**: Access our open repository of peer-reviewed syntheses grounded in official multilateral documents (UNFCCC Second NDC, World Bank CCKP, ICIMOD Hindu Kush Himalaya Assessment, WHO, and ADB).
- **High-Resolution Spatial GIS Telemetry**: Explore interactive spatial layers for Himalayan river catchments, glacier retreat zones, and climate vulnerability hotspots.
- **Climate Risk Scanner**: Run forward-looking IPCC scenario modeling (SSP3-7.0 / SSP1-2.6) for 2030 and 2050 horizons to evaluate temperature anomalies and extreme precipitation risks for your projects.
- *Explore*: \`/intelligence\` and \`/intelligence/knowledge\`.

#### 2. Watershed Resilience & Climate Engineering
- **Hydrological Risk Auditing**: Run-of-River hydropower vulnerability assessments, cloudburst peak return calculation, and desanding basin adaptations.
- **Nature-Based Bio-Engineering**: Slope stabilization blueprints utilizing deep-rooted native species (*Alnus nepalensis*, vetiver grass) for mountain roads and fragile hillsides.
- **Early-Warning & IoT Sensing**: Low-cost telemetry mesh deployment for ungauged mountain catchments.
- *Explore*: \`/resilience\`.

#### 3. Enterprise Incubation & Circular Diagnostics
- **Diagnostic Tool**: Rapidly benchmark your venture across circularity metrics, material footprint, and climate risk.
- **Working Capital & Supply Chain Advisory**: Structuring regenerative business models and sustainable agricultural waste aggregation.
- *Explore*: \`/enterprise\`.

#### 4. KĀRVA — The Sustainability Lab Shop
- **Circular Craftsmanship & Upcycling**: KĀRVA is the official commercial shop and craft design studio of The Sustainability Lab.
- **Reclaimed Himalayan Timber**: We recover century-old salvaged *Shorea robusta* (Sal) architectural beams from heritage demolition sites, handcrafting museum-grade furniture and architectural artifacts with non-toxic, zero-VOC beeswax and natural oil finishes.
- **Bio-Composite Products**: Agricultural waste transformations (paddy straw, bagasse, mycelium packaging alternatives).
- *Visit Official Shop*: [KĀRVA – The Sustainability Lab Shop](https://shop.sustainabilitylab.xyz/) or browse our archive at \`/karva\`.

#### 5. Physical Research Station & Coworking
- **Maharajgunj Research Station**: A physical workspace, testing lab, and convening space in Kathmandu (Coordinates: 27.7408° N, 85.3365° E) for climate researchers, technologists, and circular entrepreneurs.
- *Connect*: Visit \`/collaborate\` or reach out directly to **hello@sustainabilitylab.xyz**.`;
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
  if (q.includes("packag") || q.includes("waste") || q.includes("material") || q.includes("karva") || q.includes("timber") || q.includes("shop")) {
    return `### KĀRVA — The Sustainability Lab Shop & Material Studio
**Official Online Shop**: [KĀRVA – The Sustainability Lab Shop](https://shop.sustainabilitylab.xyz/)
**Physical Location**: Maharajgunj Research Station Material Workshop, Kathmandu

KĀRVA is the official circular craftsmanship and lifestyle shop of The Sustainability Lab. We recover discarded materials from Himalayan ecosystems and heritage urban demolition sites, transforming them into high-performance, timeless architectural furniture and lifestyle goods.

#### Core KĀRVA Collections & Offerings:
1. **Salvaged Century-Old Sal Timber (Shorea Robusta)**:
   - Recovered from 80–100 year-old traditional buildings scheduled for demolition across Kathmandu Valley.
   - Laboratory compressive testing confirms century-old heartwood exhibits 18% higher structural shear strength than virgin kiln-dried lumber due to slow silica mineralization.
   - Finished exclusively with organic tung oil and natural Himalayan beeswax (100% zero-VOC and non-toxic).
2. **Upcycled Agricultural Residues & Bio-Composites**:
   - Thermoformed agricultural fibers (bagasse, paddy straw) and mycelium bio-bound materials offering a 74% embodied carbon reduction over polystyrene (thermocol).
3. **Heritage Architectural Relics & Functional Craft**:
   - Limited-run specimen furniture, artisanal desk goods, and custom architectural commissions for regenerative spaces.

Browse current releases and specimens directly at [KĀRVA – The Sustainability Lab Shop](https://shop.sustainabilitylab.xyz/) or visit the physical fabrication bench at our Maharajgunj Research Station.`;
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
