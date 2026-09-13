export type LLMProvider =
  | "openrouter"
  | "openai"
  | "chatgpt"
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
  gemini: "gemini-1.5-flash",
  nvidia: "meta/llama-3.1-70b-instruct",
  ollama: "llama3.2",
};

/**
 * Resolve active LLM provider and credentials from environment variables.
 */
export function getActiveAIConfig(): AIProviderConfig {
  const explicitProvider = (process.env.LLM_PROVIDER || "").toLowerCase().trim();

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

  if (
    explicitProvider === "openai" ||
    explicitProvider === "chatgpt" ||
    (!explicitProvider && process.env.OPENAI_API_KEY)
  ) {
    const key = process.env.OPENAI_API_KEY;
    return {
      provider: "openai",
      model: process.env.LLM_MODEL || process.env.OPENAI_MODEL || DEFAULT_MODELS.openai,
      endpoint: "https://api.openai.com/v1/chat/completions",
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

/**
 * System prompt embedding Sustainability Lab domain expertise.
 */
export function buildSystemPrompt(context?: any): string {
  const contextStr = context ? `\nActive Page Telemetry: ${JSON.stringify(context, null, 2)}` : "";

  return `You are the Sustainability Lab's Autonomous Intelligence Advisor and Lab Lens Engine.
Headquarters: Maharajgunj Research Station, Kathmandu Valley, Nepal (Coordinates: 27.7408° N, 85.3365° E).
Domains of Expertise:
1. Himalayan Watershed Hydrology & Run-of-River infrastructure resilience.
2. Climate Risk Mitigation (IPCC AR6 2030/2050 horizons, GLOF, flash-flood debris flow).
3. Circular Materials & Craftsmanship (KĀRVA Studio: reclaimed timber, brick, agro-residues).
4. Environmental Compliance (Nepal EIA/IEE laws, ADB/World Bank safeguards).
5. Enterprise Incubation for regenerative and circular businesses in South Asia.

Tone: Rigorous, interdisciplinary, quantitative, grounded in physical engineering and ecological science.
Formatting: Concise, actionable markdown with numbered priorities or bullet points.${contextStr}`;
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

  // If simulation mode, return structured contextual synthesis
  if (config.provider === "simulation" || !config.isConfigured) {
    const userQuery = messages[messages.length - 1]?.content || "";
    return {
      provider: config.provider,
      model: config.model,
      status: config.statusMessage,
      text: generateSimulatedResponse(userQuery, context),
    };
  }

  const systemMsg: ChatMessage = {
    role: "system",
    content: buildSystemPrompt(context),
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
    headers["HTTP-Referer"] = "https://sustainabilitylab.org";
    headers["X-Title"] = "Sustainability Lab Intelligence";
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
function generateSimulatedResponse(query: string, context?: any): string {
  const q = query.toLowerCase();

  if (q.includes("packag") || q.includes("waste") || q.includes("material") || q.includes("karva")) {
    return `### Circular Material & Agro-Packaging Assessment
**Maharajgunj Station Telemetry • Feedstock Mass Balance**

1. **Feedstock Logistics**: In Nepal's central Terai and Bagmati corridors, agricultural residues (paddy straw, bagasse, corn stover) have an average aggregation radius of 20–30 km. Transport costs stay beneath $18/metric ton if baled on-site.
2. **Embodied Carbon Differential**: Utilizing bio-bound mycelium or thermoformed pulp reduces lifecycle carbon footprint by **74%** compared to extruded polystyrene (EPS).
3. **Moisture & Storage Safeguards**: Ensure dry moisture thresholds (<14%) before compounding to prevent early microbial degradation.
4. **Recommended Next Step**: Prototype tooling at the Maharajgunj Research Station material workshop.`;
  }

  if (q.includes("hydro") || q.includes("water") || q.includes("flood") || q.includes("river") || q.includes("climate")) {
    return `### Himalayan Watershed Resilience Analysis
**Maharajgunj Hydrological Telemetry • Coordinates: 27.7408° N, 85.3365° E**

1. **Hydrological Variability**: Mountain headwaters in South Asia exhibit non-linear monsoon pulses. The 2030 IPCC scenario projects +18% peak precipitation intensity alongside extended dry-season lean flows.
2. **Upstream Hazard Coupling**: Incorporate debris-basin traps upstream of intake gates to mitigate coarse sediment grinding during extreme cloudburst events.
3. **Environmental Flow (e-flow)**: Maintain a minimum 15% lean-season mean discharge to ensure aquatic biodiversity corridor survival.
4. **Bio-Shield Embankments**: Reinforce cut slopes with vetiver grass and deep-rooted native alnus nepalensis to prevent catastrophic slope slumping.`;
  }

  return `### Sustainability Lab Intelligence Synthesis
**Station 01: Maharajgunj, Kathmandu Valley • Active Engine**

Based on synthesized environmental layers and spatial telemetry:
- **Spatial Sensitivity**: Regional catchment vulnerability is rated elevated due to slope gradients and monsoon precipitation variability.
- **Physical Hardening**: Prioritize ductile civil engineering and decentralized bio-engineering buffers over brittle monocultures.
- **Decision Horizon**: Actionable 90-day intervention yields up to 4.2x disaster damage avoidance across a 10-year horizon.

*(To connect this query directly to OpenRouter, ChatGPT, Gemini, NVIDIA, or local Ollama, configure your keys in \`.env.local\` as detailed in \`setupinstruction.md\`)*`;
}
