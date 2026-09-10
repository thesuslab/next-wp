"use client";

import React from "react";
import { useLabLens } from "./LabLensContext";
import Link from "next/link";

export function LabLensHUD() {
  const { isOpen, toggleLens, activeContext } = useLabLens();

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
          <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-white animate-ping" : "bg-bamboo animate-pulse"}`} />
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
          className="fixed inset-x-0 bottom-0 z-40 max-h-[85vh] bg-[#1A1A18]/98 border-t border-bamboo/40 text-[#F7F5F0] backdrop-blur-2xl shadow-[0_-15px_40px_rgba(0,0,0,0.7)] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header / Telemetry Bar */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-mono tracking-widest text-bamboo uppercase px-2 py-0.5 rounded bg-bamboo/10 border border-bamboo/30">
                    {activeContext.category}
                  </span>
                  <span className="text-[11px] font-mono text-white/50">
                    SYSTEM CONFIDENCE: {activeContext.confidenceScore}%
                  </span>
                </div>
                <h3 className="text-xl font-medium tracking-tight text-white">
                  {activeContext.title}
                </h3>
                <p className="text-xs text-white/60 font-mono mt-0.5">
                  {activeContext.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/intelligence/ai"
                  onClick={() => toggleLens()}
                  className="text-xs font-mono text-bamboo border border-bamboo/40 hover:bg-bamboo/10 px-3 py-1.5 rounded transition-colors"
                >
                  Ask AI Advisor →
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
                      <div className={`text-sm font-semibold font-mono px-2 py-1 rounded border inline-block ${statusColor}`}>
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

            {/* Bottom Insights and Action Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div className="lg:col-span-2">
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

              <div className="flex flex-col justify-center items-start lg:items-end gap-2">
                <div className="text-[11px] font-mono text-white/50">
                  INTELLIGENCE ENGINE v4.2 • RUNNING
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/intelligence/climate"
                    onClick={() => toggleLens()}
                    className="text-xs px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-mono transition-colors"
                  >
                    Climate Scanner
                  </Link>
                  <Link
                    href="/enterprise/diagnostics"
                    onClick={() => toggleLens()}
                    className="text-xs px-3 py-1.5 rounded bg-[#00D4AA] text-[#1A1A18] font-mono font-medium hover:bg-[#00D4AA]/90 transition-colors"
                  >
                    Enterprise Diagnostic
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
