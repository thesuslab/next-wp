"use client";

import { useState } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "lab";
  content: string;
  time: string;
}

const defaultConversations: Record<string, { messages: Message[]; nextSteps: string[]; templates: string[]; mentors: string[] }> = {
  "packaging": {
    messages: [
      {
        role: "user",
        content: "I want to start a sustainable packaging company using agricultural waste in Nepal.",
        time: "10:24 AM",
      },
      {
        role: "lab",
        content: "Let's first understand your customer economics and feedstock availability. In Nepal, paddy straw and bagasse represent huge seasonal biomass volumes, but decentralized collection logistics and moisture management typically drive 45% of total operating expenditure.\n\nHave you calculated your localized radius for raw material sourcing?",
        time: "10:25 AM",
      },
      {
        role: "user",
        content: "We're looking at a 25km radius in the Chitwan agricultural corridor.",
        time: "10:26 AM",
      },
      {
        role: "lab",
        content: "That 25km radius keeps transport under $18/ton, which makes you cost-competitive against imported extruded polystyrene (thermocol). Next, you will need to determine whether you are pursuing thermoformed molded pulp or mycelium-bound packaging, as the capital expenditure for steam tooling versus biological curing chambers differs by 3.5x.",
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
  "eia": {
    messages: [
      {
        role: "user",
        content: "What environmental and social risks should we prioritize for a 25MW run-of-river hydro project?",
        time: "11:15 AM",
      },
      {
        role: "lab",
        content: "For a 25MW Himalayan run-of-river facility, the top three risk vectors are:\n1. River Connectivity & e-flow compliance during lean winter months.\n2. Upstream glacial hazard & flash-flood debris flow.\n3. Cut-slope spoil dumping and downstream irrigation impact.\n\nMultilateral lenders (ADB/WB) will require minimum 10-15% mean lean flow or species-specific depth velocity curves.",
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

export default function AIAdvisorPage() {
  const [activeTopic, setActiveTopic] = useState<"packaging" | "eia">("packaging");
  const [messages, setMessages] = useState<Message[]>(defaultConversations["packaging"].messages);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const contextData = defaultConversations[activeTopic];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg: Message = {
      role: "user",
      content: inputVal,
      time: "Just now",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "lab",
          content: "We've synthesized your inquiry with our regional environmental intelligence layers. To turn this into an operational milestone, consider reviewing the recommended action items and template guidelines in the right-hand panel.",
          time: "Just now",
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const switchTopic = (topic: "packaging" | "eia") => {
    setActiveTopic(topic);
    setMessages(defaultConversations[topic].messages);
  };

  return (
    <main className="min-h-screen bg-[#111110] text-[#F7F5F0] pt-8 pb-16 flex flex-col">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 flex-1 flex flex-col">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link href="/intelligence" className="text-xs font-mono text-white/50 hover:text-white">
              ← INTELLIGENCE
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-xs font-mono text-[#00D4AA] uppercase tracking-wider">
              ASK THE LAB • SPECIALIZED AI ADVISOR
            </span>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-white/50 hidden sm:inline">Scenario:</span>
            <button
              onClick={() => switchTopic("packaging")}
              className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                activeTopic === "packaging"
                  ? "bg-[#00D4AA]/20 border-[#00D4AA] text-[#00D4AA]"
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white"
              }`}
            >
              Circular Agri-Packaging
            </button>
            <button
              onClick={() => switchTopic("eia")}
              className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                activeTopic === "eia"
                  ? "bg-[#00D4AA]/20 border-[#00D4AA] text-[#00D4AA]"
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white"
              }`}
            >
              Hydro EIA Risk
            </button>
          </div>
        </div>

        {/* 3-Column Architecture */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Column 1: Context & Parameters (3 cols) */}
          <div className="lg:col-span-3 bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#00D4AA] uppercase tracking-widest mb-4">
                01 • ACTIVE CONTEXT
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-3 rounded bg-white/5 border border-white/5">
                  <div className="text-white/40 text-[10px] mb-1">PROJECT SECTOR</div>
                  <div className="text-white font-semibold">
                    {activeTopic === "packaging" ? "Circular Bio-Materials" : "Renewable Energy & Water"}
                  </div>
                </div>

                <div className="p-3 rounded bg-white/5 border border-white/5">
                  <div className="text-white/40 text-[10px] mb-1">DEVELOPMENT STAGE</div>
                  <div className="text-white font-semibold">
                    {activeTopic === "packaging" ? "Pilot Feasibility" : "Detailed EIA Baseline"}
                  </div>
                </div>

                <div className="p-3 rounded bg-white/5 border border-white/5">
                  <div className="text-white/40 text-[10px] mb-1">REGIONAL CORRIDOR</div>
                  <div className="text-white font-semibold">
                    {activeTopic === "packaging" ? "Chitwan Agro-Basin" : "Trishuli River Watershed"}
                  </div>
                </div>

                <div className="p-3 rounded bg-white/5 border border-white/5">
                  <div className="text-white/40 text-[10px] mb-1">DECISION HORIZON</div>
                  <div className="text-white font-semibold">Immediate 90-Day Deployment</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="text-[10px] font-mono text-white/40 mb-2 uppercase">
                Underlying Knowledge Bases
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                  IPCC AR6
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                  Nepal EIA Act
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                  Circularity DB
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Center Conversation (6 cols) */}
          <div className="lg:col-span-6 bg-black/60 border border-white/10 rounded-xl p-5 flex flex-col justify-between min-h-[500px]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest text-center py-2 border-b border-white/5">
                Session Started • Knowledge Synthesis Mode
              </div>

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
                      {msg.role === "user" ? "YOU" : "LAB AI"}
                    </span>
                  </div>
                  <div
                    className={`max-w-[88%] p-3.5 rounded-lg text-xs leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-white/10 text-white border border-white/10"
                        : "bg-[#1A1A18] text-[#F7F5F0] border border-[#00D4AA]/30"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#00D4AA] p-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-ping" />
                  Synthesizing environmental intelligence...
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about environmental risks, business planning, or compliance..."
                className="w-full pl-4 pr-24 py-3 rounded-lg bg-black border border-white/20 text-xs text-white placeholder:text-white/40 focus:border-[#00D4AA] focus:outline-none font-mono"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-3 py-1.5 rounded bg-[#00D4AA] text-black text-xs font-mono font-semibold hover:bg-[#00D4AA]/90 transition-colors"
              >
                Send →
              </button>
            </form>
          </div>

          {/* Column 3: Action Panel (3 cols) */}
          <div className="lg:col-span-3 bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <div className="text-[10px] font-mono text-[#00D4AA] uppercase tracking-widest mb-3">
                  02 • RECOMMENDED ACTIONS
                </div>
                <div className="space-y-2">
                  {contextData.nextSteps.map((step, i) => (
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
                  VERIFIED TEMPLATES
                </div>
                <div className="space-y-2">
                  {contextData.templates.map((tpl, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-white/5 hover:bg-white/10 transition-colors text-xs text-white/70 font-mono flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{tpl}</span>
                      <span className="text-[#00D4AA] ml-2">↓</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">
                  MATCHED LAB MENTORS
                </div>
                <div className="space-y-1.5">
                  {contextData.mentors.map((mentor, i) => (
                    <div key={i} className="text-xs text-white/70 font-mono">
                      • {mentor}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <Link
                href="/enterprise/diagnostics"
                className="w-full py-2.5 px-4 rounded bg-[#00D4AA] text-black font-mono text-xs font-semibold text-center block hover:bg-[#00D4AA]/90 transition-colors"
              >
                Run Enterprise Diagnostic →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
