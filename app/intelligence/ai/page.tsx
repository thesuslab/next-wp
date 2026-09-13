"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getAllKnowledgeEntries,
  getKnowledgeEntryBySlug,
  type KnowledgeEntry,
} from "@/lib/knowledge/data";

interface Message {
  role: "user" | "lab";
  content: string;
  time: string;
  sourceDoc?: string;
}

const defaultConversations: Record<
  string,
  {
    title: string;
    sector: string;
    stage: string;
    corridor: string;
    horizon: string;
    messages: Message[];
    nextSteps: string[];
    templates: string[];
    mentors: string[];
  }
> = {
  lab: {
    title: "The Sustainability Lab • Institutional Grounding",
    sector: "Environmental Science & Climate Engineering",
    stage: "Research & Deployment",
    corridor: "Kathmandu Valley (Maharajgunj)",
    horizon: "Operational Baseline",
    messages: [
      {
        role: "user",
        content: "What is The Sustainability Lab and what does it actually do?",
        time: "10:15 AM",
      },
      {
        role: "lab",
        content:
          "The Sustainability Lab is an interdisciplinary environmental intelligence institute, climate engineering laboratory, and circular design studio headquartered at the Maharajgunj Research Station in Kathmandu Valley (27.7408° N, 85.3365° E).\n\nWe operate across three core institutional doors:\n\n1. **Door 1: Intelligence & Open Knowledge Hub** (/intelligence)\n   - High-resolution spatial telemetry, river catchment GIS, and IPCC 2030/2050 Climate Risk Scanner.\n   - Authoritative Knowledge Base of 28 source-grounded research reports and field guides based on UNFCCC Second NDC, World Bank CCKP, ICIMOD, WHO, and ADB.\n\n2. **Door 2: Resilience & Engineering** (/resilience)\n   - Himalayan watershed hydrology, Run-of-River hydropower lean-flow resilience, glacial lake outburst flood (GLOF) hazard modeling, and bio-engineering slope stabilization (vetiver, Alnus nepalensis).\n\n3. **Door 3: Enterprise & KĀRVA Studio** (/enterprise, /karva)\n   - KĀRVA: Circular craftsmanship studio recovering 80-100 year-old salvaged Shorea robusta (Sal) architectural timber, demolition bricks, and agricultural waste into architectural artifacts with zero-VOC finishes.\n   - Enterprise diagnostic tool and incubation for South Asian regenerative businesses.\n\nHow can our station and models assist your project or research today?",
        time: "10:15 AM",
      },
    ],
    nextSteps: [
      "Explore the 28 Knowledge Base research reports.",
      "Run the Climate Risk Scanner for local river basin projections.",
      "Launch an Enterprise Diagnostic for circular business modeling.",
    ],
    templates: [
      "Sustainability Lab Institutional Charter & Protocol (PDF)",
      "Open Knowledge Commons Citation Guidelines",
    ],
    mentors: [
      "Er. B. R. Joshi — Hydrological Hazard Specialist",
      "Dr. S. Shakya — Industrial Bio-Materials & Fiber",
      "N. Shrestha — Environmental Safeguards Lead",
    ],
  },
  packaging: {
    title: "Circular Agri-Packaging Studio",
    sector: "Circular Bio-Materials",
    stage: "Pilot Feasibility",
    corridor: "Chitwan Agro-Basin",
    horizon: "Immediate 90-Day Deployment",
    messages: [
      {
        role: "user",
        content: "I want to start a sustainable packaging company using agricultural waste in Nepal.",
        time: "10:24 AM",
      },
      {
        role: "lab",
        content:
          "Let's first understand your customer economics and feedstock availability. In Nepal, paddy straw and bagasse represent huge seasonal biomass volumes, but decentralized collection logistics and moisture management typically drive 45% of total operating expenditure.\n\nHave you calculated your localized radius for raw material sourcing?",
        time: "10:25 AM",
      },
      {
        role: "user",
        content: "We're looking at a 25km radius in the Chitwan agricultural corridor.",
        time: "10:26 AM",
      },
      {
        role: "lab",
        content:
          "That 25km radius keeps transport under $18/ton, which makes you cost-competitive against imported extruded polystyrene (thermocol). Next, you will need to determine whether you are pursuing thermoformed molded pulp or mycelium-bound packaging, as the capital expenditure for steam tooling versus biological curing chambers differs by 3.5x.",
        time: "10:27 AM",
      },
    ],
    nextSteps: [
      "Map seasonal biomass availability in Chitwan district.",
      "Compare Capex: Steam-pressed molded fiber vs mycelium bio-curing.",
      "Conduct test pilot with 3 local e-commerce shippers.",
    ],
    templates: [
      "Bio-Packaging Feedstock Mass Balance Model (Excel)",
      "Food-Grade Barrier Coating Assessment Protocol (PDF)",
    ],
    mentors: [
      "Dr. S. Shakya — Industrial Bio-Materials & Fiber",
      "P. Adhikari — AgTech Supply Chain Logistics",
    ],
  },
  eia: {
    title: "Himalayan Run-of-River EIA Risk Matrix",
    sector: "Renewable Energy & Water",
    stage: "Detailed EIA Baseline",
    corridor: "Trishuli River Watershed",
    horizon: "Pre-Construction Review",
    messages: [
      {
        role: "user",
        content: "What environmental and social risks should we prioritize for a 25MW run-of-river hydro project?",
        time: "11:15 AM",
      },
      {
        role: "lab",
        content:
          "For a 25MW Himalayan run-of-river facility, the top three risk vectors are:\n1. River Connectivity & e-flow compliance during lean winter months.\n2. Upstream glacial hazard & flash-flood debris flow.\n3. Cut-slope spoil dumping and downstream irrigation impact.\n\nMultilateral lenders (ADB/WB) will require minimum 10-15% mean lean flow or species-specific depth velocity curves.",
        time: "11:16 AM",
      },
    ],
    nextSteps: [
      "Calculate 10-day winter low-flow hydrology duration curves.",
      "Perform GIS LiDAR slope angle stability assessment on powerhouse footprint.",
      "Draft Free, Prior & Informed Consent (FPIC) stakeholder schedule.",
    ],
    templates: [
      "Environmental Management Plan (EMP) Matrix Template",
      "Aquatic Biodiversity Baseline Survey Standard",
    ],
    mentors: [
      "Er. B. R. Joshi — Hydrological Hazard Specialist",
      "N. Shrestha — Environmental Safeguard Lead",
    ],
  },
};

function AIAdvisorInner() {
  const searchParams = useSearchParams();
  const articleParam = searchParams.get("article");
  const topicParam = searchParams.get("topic");

  const allArticles = getAllKnowledgeEntries();
  const [activeTab, setActiveTab] = useState<"scenario" | "knowledge">("knowledge");
  const [activeScenario, setActiveScenario] = useState<string>("lab");
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>(
    articleParam || "nepal-ndc-2020-commitments"
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const activeArticle = allArticles.find((a) => a.slug === selectedArticleSlug);

  // Initialize conversation when scenario or article changes
  useEffect(() => {
    if (articleParam) {
      setActiveTab("knowledge");
      setSelectedArticleSlug(articleParam);
      const art = getKnowledgeEntryBySlug(articleParam);
      if (art) {
        setMessages([
          {
            role: "user",
            content: `I am reviewing "${art.title}". What are the critical findings, baseline metrics, and action requirements from this report?`,
            time: "12:00 PM",
          },
          {
            role: "lab",
            content: `### Executive Intelligence Summary: "${art.title}"\n\n**Primary Authority:** ${art.source.name} (${art.source.date})\n**Geographic Focus:** ${art.region}${art.locality ? ` (${art.locality})` : ""}, ${art.country}\n**Evidence Classification:** ${art.source.level.toUpperCase()}\n\n**Summary:**\n${art.summary}\n\n${
              art.data
                ? `**Key Quantitative Telemetry:**\n- Scenario / Period: ${art.data.scenario || art.data.period || "Historical Baseline"}\n- Temperature Projection: +${art.data.temperatureMedianC ?? art.data.temperatureChangeCPerDecade ?? "N/A"}°C\n- Precipitation Metric: ${art.data.precipitationChangeMmPerDecade ? `+${art.data.precipitationChangeMmPerDecade} mm/decade` : "Monsoon Anomaly"}\n\n`
                : ""
            }You can now interrogate any specific aspect of this document, request localized risk implications, or cross-reference it against our regional hydrology and circularity models.`,
            time: "12:00 PM",
            sourceDoc: art.source.name,
          },
        ]);
        return;
      }
    }

    if (activeTab === "scenario") {
      const scen = defaultConversations[activeScenario] || defaultConversations.lab;
      setMessages(scen.messages);
    } else {
      const art = activeArticle || allArticles[0];
      if (art) {
        setMessages([
          {
            role: "user",
            content: `Can you analyze the report "${art.title}" and explain its relevance to Nepal's climate and economic resilience?`,
            time: "12:00 PM",
          },
          {
            role: "lab",
            content: `### Grounded Intelligence: "${art.title}"\n\n**Source Authority:** ${art.source.name} (${art.source.date})\n**Topic / Category:** ${art.topic} • ${art.category} [${art.source.level.toUpperCase()}]\n\n${art.summary}\n\nI have loaded the full evidence ledger for this report into memory. What specific parameters would you like to evaluate (e.g. baseline numbers, policy targets, mitigation costs, or regional adaptation protocols)?`,
            time: "12:00 PM",
            sourceDoc: art.source.name,
          },
        ]);
      }
    }
  }, [activeTab, activeScenario, selectedArticleSlug, articleParam]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    const newMsg: Message = {
      role: "user",
      content: userText,
      time: "Just now",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal("");
    setIsTyping(true);

    try {
      const isKnowledgeMode = activeTab === "knowledge";
      const payload = {
        messages: [...messages, newMsg].map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
        context: {
          station: "Maharajgunj Research Station, Kathmandu (27.7408° N, 85.3365° E)",
          mode: isKnowledgeMode ? "knowledge_chat" : "scenario_advisor",
          articleSlug: isKnowledgeMode && activeArticle ? activeArticle.slug : undefined,
          articleTitle: isKnowledgeMode && activeArticle ? activeArticle.title : undefined,
          source: isKnowledgeMode && activeArticle ? activeArticle.source.name : undefined,
          topic: isKnowledgeMode && activeArticle ? activeArticle.topic : activeScenario,
        },
      };

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "lab",
          content: data.text || "Synthesis complete.",
          time: "Just now",
          sourceDoc: activeArticle ? activeArticle.source.name : "The Sustainability Lab",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "lab",
          content:
            "Synthesis complete based on Maharajgunj station records. Review the action protocols and source references in the adjacent panel to continue.",
          time: "Just now",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredArticles = allArticles.filter(
    (art) =>
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-[#111110] text-[#F7F5F0] pt-8 pb-16 flex flex-col">
      <div className="max-w-[1680px] w-full mx-auto px-4 sm:px-6 flex-1 flex flex-col">
        {/* Top Navigation & Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/intelligence/knowledge"
              className="text-xs font-mono text-white/50 hover:text-white transition-colors"
            >
              ← KNOWLEDGE BASE
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-xs font-mono text-[#00D4AA] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
              SUSTAINABILITY LAB • AUTONOMOUS INTELLIGENCE ADVISOR
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("knowledge")}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
                activeTab === "knowledge"
                  ? "bg-[#00D4AA]/20 border-[#00D4AA] text-[#00D4AA]"
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white"
              }`}
            >
              ◉ Chat Knowledge Base ({allArticles.length} Reports)
            </button>
            <button
              onClick={() => setActiveTab("scenario")}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
                activeTab === "scenario"
                  ? "bg-[#00D4AA]/20 border-[#00D4AA] text-[#00D4AA]"
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white"
              }`}
            >
              ⚙ Project Scenarios
            </button>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Column 1: Selector / Context (3.5 cols) */}
          <div className="lg:col-span-3 xl:col-span-3 bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col justify-between overflow-hidden">
            {activeTab === "knowledge" ? (
              <div className="flex flex-col h-full">
                <div className="text-[10px] font-mono text-[#00D4AA] uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span>01 • SELECT EVIDENCE REPORT</span>
                  <span className="text-white/40">28 SOURCED</span>
                </div>

                {/* Search Knowledge Filter */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by title, source, NDC..."
                  className="w-full px-3 py-1.5 mb-3 rounded bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:border-[#00D4AA] focus:outline-none font-mono"
                />

                {/* Scrollable list of 28 articles */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[520px]">
                  {filteredArticles.map((art) => {
                    const isSelected = art.slug === selectedArticleSlug;
                    return (
                      <button
                        key={art.slug}
                        onClick={() => setSelectedArticleSlug(art.slug)}
                        className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                          isSelected
                            ? "bg-[#00D4AA]/15 border-[#00D4AA] text-white"
                            : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/60 uppercase">
                            {art.category}
                          </span>
                          <span className="text-[9px] font-mono text-[#00D4AA]">
                            {art.source.level.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs font-medium line-clamp-2 leading-snug">
                          {art.title}
                        </div>
                        <div className="text-[10px] font-mono text-white/40 mt-1 truncate">
                          {art.source.name}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Station Coordinates Footer */}
                <div className="pt-4 mt-4 border-t border-white/10 text-[10px] font-mono text-white/40">
                  MAHARAJGUNJ RESEARCH STATION
                  <div className="text-white/60">27.7408° N, 85.3365° E</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-[10px] font-mono text-[#00D4AA] uppercase tracking-widest mb-4">
                  01 • SELECT SCENARIO
                </div>
                <div className="space-y-2">
                  {Object.entries(defaultConversations).map(([key, scen]) => (
                    <button
                      key={key}
                      onClick={() => setActiveScenario(key)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        activeScenario === key
                          ? "bg-[#00D4AA]/15 border-[#00D4AA] text-white"
                          : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-semibold">{scen.title}</div>
                      <div className="text-[10px] font-mono text-white/50 mt-1">
                        Sector: {scen.sector}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded bg-white/5 border border-white/5 text-xs font-mono space-y-2 mt-4">
                  <div className="text-white/40 text-[10px]">ACTIVE HORIZON</div>
                  <div className="text-white font-semibold">
                    {defaultConversations[activeScenario]?.horizon || "Immediate"}
                  </div>
                  <div className="text-white/40 text-[10px] pt-2 border-t border-white/5">
                    REGIONAL CORRIDOR
                  </div>
                  <div className="text-white font-semibold">
                    {defaultConversations[activeScenario]?.corridor || "Himalayan Watershed"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Center Interactive Chat (6 cols) */}
          <div className="lg:col-span-6 xl:col-span-6 bg-black/60 border border-white/10 rounded-xl p-5 flex flex-col justify-between min-h-[600px]">
            {/* Chat header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[#00D4AA]">●</span>
                <span className="text-white/80 truncate max-w-md font-medium">
                  {activeTab === "knowledge" && activeArticle
                    ? `Grounding: ${activeArticle.title}`
                    : defaultConversations[activeScenario]?.title}
                </span>
              </div>
              {activeTab === "knowledge" && activeArticle && (
                <Link
                  href={`/intelligence/knowledge/${activeArticle.slug}`}
                  target="_blank"
                  className="text-[11px] text-[#00D4AA] hover:underline flex items-center gap-1"
                >
                  View Full Report ↗
                </Link>
              )}
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 max-h-[500px]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-white/40">{msg.time}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        msg.role === "user"
                          ? "bg-white/10 text-white/80"
                          : "bg-[#00D4AA]/20 text-[#00D4AA]"
                      }`}
                    >
                      {msg.role === "user" ? "YOU" : "LAB INTELLIGENCE"}
                    </span>
                    {msg.sourceDoc && (
                      <span className="text-[9px] font-mono text-white/40 border border-white/10 px-1 rounded truncate max-w-[200px]">
                        ref: {msg.sourceDoc}
                      </span>
                    )}
                  </div>
                  <div
                    className={`max-w-[90%] p-4 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-white/10 text-white border border-white/10"
                        : "bg-[#181816] text-[#F7F5F0] border border-[#00D4AA]/30 shadow-lg"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#00D4AA] p-3 rounded bg-white/5 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-ping" />
                  Synthesizing environmental intelligence with primary sources...
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSend} className="relative mt-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  activeTab === "knowledge" && activeArticle
                    ? `Ask about "${activeArticle.title}" (e.g. data points, policy mandates, implications)...`
                    : "Ask about climate risk, engineering safeguards, KĀRVA circularity..."
                }
                className="w-full pl-4 pr-24 py-3.5 rounded-lg bg-black border border-white/20 text-xs text-white placeholder:text-white/40 focus:border-[#00D4AA] focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={isTyping || !inputVal.trim()}
                className="absolute right-2 top-2 px-3 py-1.5 rounded bg-[#00D4AA] text-black text-xs font-mono font-semibold hover:bg-[#00D4AA]/90 transition-colors disabled:opacity-40"
              >
                Inquire →
              </button>
            </form>
          </div>

          {/* Column 3: Evidence & Action Panel (3 cols) */}
          <div className="lg:col-span-3 xl:col-span-3 bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
            {activeTab === "knowledge" && activeArticle ? (
              <div className="space-y-5">
                <div>
                  <div className="text-[10px] font-mono text-[#00D4AA] uppercase tracking-widest mb-3">
                    02 • EVIDENCE PROFILE
                  </div>
                  <div className="p-3 rounded bg-white/5 border border-white/5 space-y-2 text-xs font-mono">
                    <div className="text-white/50 text-[10px]">PRIMARY CITATION</div>
                    <div className="text-white font-medium leading-snug">
                      {activeArticle.source.name}
                    </div>
                    <div className="text-white/40 text-[10px]">
                      Published: {activeArticle.source.date} • {activeArticle.source.type}
                    </div>
                    <div className="pt-2 border-t border-white/5">
                      <a
                        href={activeArticle.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00D4AA] hover:underline text-[11px] block truncate"
                      >
                        Source Link ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* Quantitative Data Badge if present */}
                {activeArticle.data && (
                  <div>
                    <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">
                      CALIBRATED METRICS
                    </div>
                    <div className="p-3 rounded bg-white/5 border border-white/5 space-y-1.5 text-xs font-mono">
                      {activeArticle.data.temperatureMedianC !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-white/50">Temp Median:</span>
                          <span className="text-[#00D4AA] font-bold">
                            +{activeArticle.data.temperatureMedianC}°C
                          </span>
                        </div>
                      )}
                      {activeArticle.data.temperatureChangeCPerDecade !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-white/50">Decadal Trend:</span>
                          <span className="text-[#00D4AA] font-bold">
                            +{activeArticle.data.temperatureChangeCPerDecade}°C / dec
                          </span>
                        </div>
                      )}
                      {activeArticle.data.precipitationChangeMmPerDecade !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-white/50">Precip Trend:</span>
                          <span className="text-white font-bold">
                            +{activeArticle.data.precipitationChangeMmPerDecade} mm
                          </span>
                        </div>
                      )}
                      {activeArticle.data.annualTemperatureC !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-white/50">Annual Baseline:</span>
                          <span className="text-white">
                            {activeArticle.data.annualTemperatureC}°C
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Topic tags */}
                <div>
                  <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">
                    CLASSIFICATION
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeArticle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-mono text-[#00D4AA] uppercase tracking-widest mb-3">
                    02 • RECOMMENDED ACTIONS
                  </div>
                  <div className="space-y-2">
                    {defaultConversations[activeScenario]?.nextSteps.map((step, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded bg-white/5 border border-white/5 text-xs text-white/80 flex items-start gap-2"
                      >
                        <span className="text-[#00D4AA] font-mono font-bold">›</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">
                    VERIFIED PROTOCOLS
                  </div>
                  <div className="space-y-2">
                    {defaultConversations[activeScenario]?.templates.map((tpl, i) => (
                      <div
                        key={i}
                        className="p-2 rounded bg-white/5 hover:bg-white/10 transition-colors text-xs text-white/70 font-mono flex items-center justify-between"
                      >
                        <span className="truncate">{tpl}</span>
                        <span className="text-[#00D4AA] ml-2">↓</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-white/10 space-y-2">
              <Link
                href="/enterprise/diagnostics"
                className="w-full py-2.5 px-4 rounded bg-[#00D4AA] text-black font-mono text-xs font-semibold text-center block hover:bg-[#00D4AA]/90 transition-colors"
              >
                Run Enterprise Diagnostic →
              </Link>
              <Link
                href="/intelligence/climate"
                className="w-full py-2.5 px-4 rounded bg-white/10 text-white font-mono text-xs font-medium text-center block hover:bg-white/20 transition-colors"
              >
                Open Climate Risk Scanner →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AIAdvisorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111110] flex items-center justify-center text-xs font-mono text-[#00D4AA]">
          Loading Sustainability Lab Autonomous Advisor...
        </div>
      }
    >
      <AIAdvisorInner />
    </Suspense>
  );
}
