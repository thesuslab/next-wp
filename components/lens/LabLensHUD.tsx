"use client";

import React, { useState, useEffect } from "react";
import { useLabLens } from "./LabLensContext";
import Link from "next/link";

interface AIStatus {
  provider: string;
  model: string;
  isConfigured: boolean;
  statusMessage: string;
}

export function LabLensHUD() {
  const { isOpen, toggleLens, activeContext } = useLabLens();
  const [aiStatus, setAiStatus] = useState<AIStatus | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Check active AI provider on open
  useEffect(() => {
    if (isOpen && !aiStatus) {
      fetch("/api/ai")
        .then((res) => res.json())
        .then((data) => setAiStatus(data))
        .catch(() =>
          setAiStatus({
            provider: "simulation",
            model: "lab-synthesis-v4.2",
            isConfigured: true,
            statusMessage: "Simulation Mode Active",
          })
        );
    }
  }, [isOpen, aiStatus]);

  const handleAskAI = async (customPrompt?: string) => {
    const promptToSend = customPrompt || aiInput;
    if (!promptToSend.trim() && !customPrompt) return;

    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToSend,
          context: {
            title: activeContext.title,
            category: activeContext.category,
            confidenceScore: activeContext.confidenceScore,
            metrics: activeContext.metrics,
            insights: activeContext.insights,
            location: "Maharajgunj Research Station, Kathmandu (27.7408° N, 85.3365° E)",
          },
        }),
      });

      const data = await res.json();
      setAiResponse(data.text);
      if (data.provider) {
        setAiStatus((prev) => ({
          ...prev!,
          provider: data.provider,
          model: data.model,
          statusMessage: data.status,
        }));
      }
    } catch (err: any) {
      setAiResponse("Could not connect to AI engine. Please check your setup.");
    } finally {
      setIsAiLoading(false);
      setAiInput("");
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleLens}
          aria-label="Toggle Sustainability Lab Intelligence Lens"
          className={`group flex items-center gap-3 px-4 py-2.5 rounded-full border text-xs font-mono tracking-wider transition-all duration-300 shadow-2xl backdrop-blur-md ${
            isOpen
              ? "bg-bamboo text-white border-bamboo shadow-[0_0_25px_rgba(124,159,46,0.4)]"
              : "bg-[#1A1A18]/90 text-[#F7F5F0] border-white/20 hover:border-bamboo hover:text-bamboo"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOpen ? "bg-white animate-ping" : "bg-bamboo animate-pulse"
            }`}
          />
          <span className="font-semibold">◉ LAB LENS</span>
          <span className="text-[10px] opacity-70 px-1.5 py-0.5 rounded bg-black/20">
            {isOpen ? "ACTIVE" : "INSPECT"}
          </span>
        </button>
      </div>

      {/* Intelligence HUD Overlay Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Lab Lens Intelligence HUD"
          className="fixed inset-x-0 bottom-0 z-40 max-h-[88vh] bg-[#1A1A18]/98 border-t border-bamboo/40 text-[#F7F5F0] backdrop-blur-2xl shadow-[0_-15px_40px_rgba(0,0,0,0.7)] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header / Telemetry Bar */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-1.5">
                  <span className="text-[10px] font-mono tracking-widest text-bamboo uppercase px-2 py-0.5 rounded bg-bamboo/10 border border-bamboo/30">
                    {activeContext.category}
                  </span>
                  <span className="text-[11px] font-mono text-white/50">
                    SYSTEM CONFIDENCE: {activeContext.confidenceScore}%
                  </span>

                  {/* Provider Connectivity Badge */}
                  {aiStatus && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase flex items-center gap-1.5 ${
                        aiStatus.provider === "simulation"
                          ? "bg-white/5 border-white/10 text-white/60"
                          : "bg-bamboo/20 border-bamboo text-bamboo-light"
                      }`}
                      title={aiStatus.statusMessage}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      LLM: {aiStatus.provider.toUpperCase()} ({aiStatus.model})
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white">
                  {activeContext.title}
                </h3>
                <p className="text-xs text-white/60 font-mono mt-0.5">
                  {activeContext.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleAskAI(
                      `Perform a targeted real-time environmental diagnosis for ${activeContext.title} under Himalayan watershed and 2030 climate conditions.`
                    )
                  }
                  disabled={isAiLoading}
                  className="text-xs font-mono bg-bamboo/20 text-bamboo hover:bg-bamboo hover:text-white border border-bamboo/40 px-3 py-1.5 rounded transition-all duration-200 disabled:opacity-50"
                >
                  {isAiLoading ? "Synthesizing..." : "⚡ Live AI Diagnosis"}
                </button>

                <Link
                  href="/intelligence/ai"
                  onClick={() => toggleLens()}
                  className="text-xs font-mono text-white/80 border border-white/20 hover:bg-white/10 px-3 py-1.5 rounded transition-colors"
                >
                  Full AI Advisor →
                </Link>

                <button
                  onClick={toggleLens}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 my-6">
              {activeContext.metrics.map((metric, idx) => {
                const statusColor =
                  metric.status === "safe"
                    ? "text-bamboo border-bamboo/30 bg-bamboo/10"
                    : metric.status === "warning"
                    ? "text-amber-400 border-amber-400/30 bg-amber-400/5"
                    : metric.status === "alert"
                    ? "text-rose-400 border-rose-400/30 bg-rose-400/5"
                    : "text-white/80 border-white/10 bg-white/5";

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-black/40 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-2">
                        {metric.label}
                      </div>
                      <div
                        className={`text-sm font-semibold font-mono px-2 py-1 rounded border inline-block ${statusColor}`}
                      >
                        {metric.value}
                      </div>
                    </div>
                    {metric.details && (
                      <div className="text-xs text-white/60 mt-3 pt-3 border-t border-white/5 leading-relaxed">
                        {metric.details}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Live AI Synthesis Box (if triggered) */}
            {(isAiLoading || aiResponse) && (
              <div className="mb-6 p-5 rounded-xl bg-bamboo/[0.04] border border-bamboo/30 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-3 border-b border-bamboo/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-bamboo animate-ping" />
                    <span className="text-xs font-mono text-bamboo font-semibold uppercase tracking-wider">
                      Live AI Synthesis • {aiStatus?.provider?.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => setAiResponse(null)}
                    className="text-xs text-white/40 hover:text-white"
                  >
                    Clear ✕
                  </button>
                </div>

                {isAiLoading ? (
                  <div className="flex items-center gap-3 py-4 text-xs font-mono text-bamboo">
                    <span className="w-4 h-4 border-2 border-bamboo border-t-transparent rounded-full animate-spin" />
                    <span>Querying {aiStatus?.provider || "AI engine"} with page context & telemetry...</span>
                  </div>
                ) : (
                  <div className="text-xs leading-relaxed text-white/90 whitespace-pre-line font-sans space-y-2">
                    {aiResponse}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Insights and Action Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-white/10 items-start">
              {/* Left: Key Insights (6 cols) */}
              <div className="lg:col-span-6">
                <h4 className="text-xs font-mono text-bamboo uppercase tracking-wider mb-2">
                  Key Vectorized Insights
                </h4>
                <ul className="space-y-1.5 text-xs text-white/70">
                  {activeContext.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-bamboo font-mono">›</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Quick Ask Bar & Shortcuts (6 cols) */}
              <div className="lg:col-span-6 space-y-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskAI();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask Lab Lens (e.g. 'What slope failure risks apply here?')..."
                    className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-white/20 text-xs text-white placeholder:text-white/40 focus:border-bamboo focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading || !aiInput.trim()}
                    className="px-4 py-2 rounded-lg bg-bamboo text-white text-xs font-mono font-semibold hover:bg-bamboo-light transition-colors disabled:opacity-40"
                  >
                    Ask →
                  </button>
                </form>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] font-mono text-white/40">
                    ENGINE: {aiStatus?.provider || "AUTO"} • MAHARAJGUNJ STATION
                  </span>

                  <div className="flex gap-2">
                    <Link
                      href="/intelligence/climate"
                      onClick={() => toggleLens()}
                      className="text-xs px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono transition-colors"
                    >
                      Climate Scanner
                    </Link>
                    <Link
                      href="/enterprise/diagnostics"
                      onClick={() => toggleLens()}
                      className="text-xs px-2.5 py-1 rounded bg-[#00D4AA] text-[#1A1A18] font-mono font-medium hover:bg-[#00D4AA]/90 transition-colors"
                    >
                      Diagnostics
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
