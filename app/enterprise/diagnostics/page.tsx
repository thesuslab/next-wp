"use client";

import { useState } from "react";
import Link from "next/link";

interface Question {
  id: number;
  category: "Market" | "Finance" | "Operations" | "Digital" | "Sustainability";
  prompt: string;
  options: { label: string; score: number }[];
}

const diagnosticQuestions: Question[] = [
  // 1. Market
  {
    id: 1,
    category: "Market",
    prompt: "How well validated is your primary customer segment?",
    options: [
      { label: "Assumed demand based on desk research", score: 25 },
      { label: "Interviewed 10-20 potential buyers with interest", score: 50 },
      { label: "Have repeat paying customers with documented feedback", score: 85 },
      { label: "Long-term purchase agreements / recurring contracts in place", score: 100 },
    ],
  },
  {
    id: 2,
    category: "Market",
    prompt: "How do your product prices compare to conventional (non-green) alternatives?",
    options: [
      { label: "Over 50% more expensive with slow customer conversion", score: 30 },
      { label: "15-30% premium, but customer sees sustainability value", score: 65 },
      { label: "Price parity achieved through local raw material sourcing", score: 90 },
      { label: "Cheaper than conventional alternatives while maintaining margin", score: 100 },
    ],
  },
  {
    id: 3,
    category: "Market",
    prompt: "What is your customer retention or referral rate?",
    options: [
      { label: "Mostly one-off transactions; high churn", score: 35 },
      { label: "About 20-30% repeat purchases", score: 60 },
      { label: "Over 50% repeat purchases or word-of-mouth referrals", score: 90 },
    ],
  },
  {
    id: 4,
    category: "Market",
    prompt: "How large is your addressable domestic/regional market?",
    options: [
      { label: "Niche local pocket under $100k annual volume", score: 40 },
      { label: "Regional domestic market ($1M - $5M potential)", score: 75 },
      { label: "Scalable nationwide with cross-border export channels", score: 100 },
    ],
  },

  // 2. Finance
  {
    id: 5,
    category: "Finance",
    prompt: "How are your operational finances and accounts tracked?",
    options: [
      { label: "Informal notes or mixed with personal expenses", score: 20 },
      { label: "Spreadsheets updated irregularly every few months", score: 45 },
      { label: "Monthly reconciliations with dedicated accounting software", score: 85 },
      { label: "Audited annual statements with 12-month rolling cash forecasts", score: 100 },
    ],
  },
  {
    id: 6,
    category: "Finance",
    prompt: "What is your current cash runway at current burn rate?",
    options: [
      { label: "Less than 30 days of operating expenses", score: 20 },
      { label: "1 to 3 months of buffer", score: 50 },
      { label: "4 to 6 months of buffer", score: 80 },
      { label: "Over 6 months or self-sustaining cashflow positive", score: 100 },
    ],
  },
  {
    id: 7,
    category: "Finance",
    prompt: "What is your gross profit margin on core offerings?",
    options: [
      { label: "Negative or unknown gross margins", score: 15 },
      { label: "10% to 25% gross margin", score: 55 },
      { label: "25% to 45% gross margin", score: 80 },
      { label: "Over 45% healthy unit economics", score: 100 },
    ],
  },
  {
    id: 8,
    category: "Finance",
    prompt: "Do you have debt or equity investor readiness documentation?",
    options: [
      { label: "No pitch deck or cap table created yet", score: 25 },
      { label: "Basic pitch deck, but no formal financial projections", score: 55 },
      { label: "Complete financial model, data room, and cap table ready", score: 95 },
    ],
  },

  // 3. Operations
  {
    id: 9,
    category: "Operations",
    prompt: "How resilient is your raw material / feedstock supply chain?",
    options: [
      { label: "Single supplier vulnerable to seasonal road closures", score: 30 },
      { label: "2-3 local suppliers with occasional delays", score: 65 },
      { label: "Decentralized supplier cooperative with buffered inventory", score: 90 },
      { label: "Closed-loop circular sourcing with guaranteed contracts", score: 100 },
    ],
  },
  {
    id: 10,
    category: "Operations",
    prompt: "How standardized are your production and quality assurance processes?",
    options: [
      { label: "Varies batch by batch; high reject rate (>15%)", score: 25 },
      { label: "Standard operating procedures exist but inconsistently tracked", score: 60 },
      { label: "Documented QA checkpoints with reject rate < 3%", score: 90 },
    ],
  },
  {
    id: 11,
    category: "Operations",
    prompt: "What is your production capacity utilization?",
    options: [
      { label: "Bottlenecked by equipment breakdowns or power outages", score: 35 },
      { label: "Running at 40-60% capacity due to demand swings", score: 70 },
      { label: "Optimized 70-85% capacity with clear scaling pathway", score: 95 },
    ],
  },
  {
    id: 12,
    category: "Operations",
    prompt: "How do you handle workplace health and worker safety standards?",
    options: [
      { label: "Informal, PPE provided only when requested", score: 30 },
      { label: "Mandatory PPE and basic safety orientation provided", score: 75 },
      { label: "Comprehensive safety audits, fair wage compliance, and training", score: 100 },
    ],
  },

  // 4. Digital
  {
    id: 13,
    category: "Digital",
    prompt: "How do you capture inventory and order fulfillment data?",
    options: [
      { label: "Paper registers or memory", score: 20 },
      { label: "Basic Excel / Google Sheets updated weekly", score: 55 },
      { label: "Integrated cloud POS / inventory ERP software", score: 90 },
    ],
  },
  {
    id: 14,
    category: "Digital",
    prompt: "What proportion of sales and customer acquisition occurs via digital channels?",
    options: [
      { label: "0% — 100% walk-ins or physical broker network", score: 30 },
      { label: "20-40% via social channels or messaging apps", score: 65 },
      { label: "Over 50% via dedicated digital platform / e-commerce portal", score: 95 },
    ],
  },
  {
    id: 15,
    category: "Digital",
    prompt: "How are company documents, contracts, and IP stored?",
    options: [
      { label: "Physical paper binders and scattered local hard drives", score: 30 },
      { label: "Centralized cloud storage (Google Drive / OneDrive)", score: 75 },
      { label: "Encrypted cloud repo with role-based access control and backups", score: 100 },
    ],
  },
  {
    id: 16,
    category: "Digital",
    prompt: "Do you utilize data analytics or AI to inform decision making?",
    options: [
      { label: "No digital data analysis currently utilized", score: 25 },
      { label: "Reviewing basic web/sales analytics monthly", score: 65 },
      { label: "Active predictive modeling for demand, pricing, or supply", score: 95 },
    ],
  },

  // 5. Sustainability
  {
    id: 17,
    category: "Sustainability",
    prompt: "What percentage of raw inputs are recycled, reclaimed, or renewable?",
    options: [
      { label: "Under 20% virgin/petrochemical materials dominate", score: 25 },
      { label: "40% - 70% bio-based or recycled content", score: 70 },
      { label: "Over 80% circular, upcycled, or zero-waste inputs", score: 100 },
    ],
  },
  {
    id: 18,
    category: "Sustainability",
    prompt: "How is waste from your manufacturing/operating process managed?",
    options: [
      { label: "Disposed via municipal landfill without sorting", score: 20 },
      { label: "Separated into basic recyclable fractions", score: 60 },
      { label: "Zero-landfill: all process byproducts sold or re-fed into loop", score: 95 },
    ],
  },
  {
    id: 19,
    category: "Sustainability",
    prompt: "How energy and carbon intensive is your production footprint?",
    options: [
      { label: "Heavy diesel generator dependency with high emissions", score: 25 },
      { label: "Grid electricity with backup battery banks", score: 65 },
      { label: "On-site solar/renewable integration with measured carbon footprint", score: 100 },
    ],
  },
  {
    id: 20,
    category: "Sustainability",
    prompt: "Do you track social and community impact metrics (local jobs, gender parity)?",
    options: [
      { label: "Not tracked formally", score: 30 },
      { label: "Track basic employee headcounts and wages", score: 65 },
      { label: "Documented ESG impact framework with third-party verification", score: 100 },
    ],
  },
];

export default function EnterpriseDiagnosticPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = diagnosticQuestions[currentIdx];

  const handleSelectOption = (score: number) => {
    const updated = { ...answers, [currentQ.id]: score };
    setAnswers(updated);

    if (currentIdx < diagnosticQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  // Score Calculation
  const calculateScores = () => {
    const categories = ["Market", "Finance", "Operations", "Digital", "Sustainability"] as const;
    const scores: Record<string, number> = {};

    categories.forEach((cat) => {
      const qInCat = diagnosticQuestions.filter((q) => q.category === cat);
      const totalScore = qInCat.reduce((acc, q) => acc + (answers[q.id] || 50), 0);
      scores[cat] = Math.round(totalScore / qInCat.length);
    });

    const overall = Math.round(
      Object.values(scores).reduce((a, b) => a + b, 0) / categories.length
    );

    return { scores, overall };
  };

  const { scores, overall } = calculateScores();

  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
          <Link href="/enterprise" className="hover:text-data transition-colors">
            ENTERPRISE
          </Link>
          <span>/</span>
          <span className="text-foreground">DIAGNOSTIC</span>
        </div>

        {!hasStarted && !isCompleted && (
          /* Landing Screen */
          <div className="p-8 sm:p-12 rounded-2xl bg-card border border-border/80 shadow-2xl text-center max-w-2xl mx-auto">
            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-mono tracking-widest uppercase mb-6">
              DIAGNOSTIC ENGINE v2.4
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              How healthy is your business?
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
              Answer 20 targeted questions across Market, Finance, Operations, Digital, and Sustainability. Receive an immediate composite score, category breakdown, and a tailored 30-day action plan.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-left font-mono text-xs mb-10">
              <div className="p-3 rounded bg-background border border-border/60">
                <div className="text-amber-500 font-bold mb-1">01</div>
                <div>Market Fit</div>
              </div>
              <div className="p-3 rounded bg-background border border-border/60">
                <div className="text-amber-500 font-bold mb-1">02</div>
                <div>Finance</div>
              </div>
              <div className="p-3 rounded bg-background border border-border/60">
                <div className="text-amber-500 font-bold mb-1">03</div>
                <div>Operations</div>
              </div>
              <div className="p-3 rounded bg-background border border-border/60">
                <div className="text-amber-500 font-bold mb-1">04</div>
                <div>Digital</div>
              </div>
              <div className="p-3 rounded bg-background border border-border/60">
                <div className="text-amber-500 font-bold mb-1">05</div>
                <div>Sustainability</div>
              </div>
            </div>

            <button
              onClick={() => setHasStarted(true)}
              className="px-8 py-4 rounded-xl bg-amber-500 text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/25"
            >
              Start Diagnostic Assessment →
            </button>
          </div>
        )}

        {hasStarted && !isCompleted && (
          /* Question Flow Screen */
          <div className="p-8 sm:p-12 rounded-2xl bg-card border border-border shadow-2xl">
            {/* Progress Header */}
            <div className="flex items-center justify-between pb-6 border-b border-border/60 mb-8 font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="text-amber-500 font-bold">
                  QUESTION {String(currentIdx + 1).padStart(2, "0")} / 20
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-muted-foreground uppercase">{currentQ.category}</span>
              </div>
              <span className="text-muted-foreground">
                {Math.round(((currentIdx + 1) / diagnosticQuestions.length) * 100)}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-10">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / diagnosticQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question Prompt */}
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-8">
              {currentQ.prompt}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-10">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt.score)}
                  className="w-full p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-amber-500/5 hover:border-amber-500/60 text-left transition-all flex items-start gap-4 group"
                >
                  <span className="w-6 h-6 rounded-full border border-border flex items-center justify-center font-mono text-xs text-muted-foreground group-hover:border-amber-500 group-hover:text-amber-500 shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm text-foreground/90 font-medium group-hover:text-foreground">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Navigation back */}
            {currentIdx > 0 && (
              <button
                onClick={handlePrev}
                className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Previous Question
              </button>
            )}
          </div>
        )}

        {isCompleted && (
          /* Results Screen */
          <div className="space-y-8">
            <div className="p-8 sm:p-12 rounded-2xl bg-card border border-amber-500/30 shadow-2xl">
              <div className="text-center max-w-md mx-auto mb-10">
                <span className="text-xs font-mono text-amber-500 uppercase tracking-widest block mb-2">
                  ASSESSMENT COMPLETE
                </span>
                <h2 className="font-display text-3xl font-bold mb-3">
                  Your Enterprise Scorecard
                </h2>
                <div className="text-6xl sm:text-7xl font-mono font-bold text-amber-500 my-4">
                  {overall} <span className="text-2xl text-muted-foreground font-normal">/ 100</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {overall >= 70
                    ? "GROWTH READY • High operational & sustainability maturity"
                    : overall >= 50
                    ? "DEVELOPING FOUNDATION • Core vulnerabilities require structured 30-day intervention"
                    : "EARLY STAGE • Focus urgently on unit economics & cashflow tracking"}
                </p>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-4 max-w-lg mx-auto font-mono text-xs">
                {Object.entries(scores).map(([cat, score]) => (
                  <div key={cat}>
                    <div className="flex justify-between mb-1">
                      <span className="text-foreground font-medium">{cat}</span>
                      <span className={score >= 70 ? "text-bamboo font-bold" : score >= 50 ? "text-amber-500 font-bold" : "text-rose-500 font-bold"}>
                        {score} / 100
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${score >= 70 ? "bg-bamboo" : score >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tailored 30-Day Action Plan */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-6">
                <div>
                  <div className="text-xs font-mono text-amber-500 uppercase tracking-wider mb-1">
                    ACTION PLAN
                  </div>
                  <h3 className="font-display text-xl font-bold">
                    Your Next 30 Days
                  </h3>
                </div>
                <span className="text-xs font-mono text-muted-foreground">Priority Milestones</span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-background border border-border/80 flex items-start gap-4">
                  <span className="text-amber-500 font-bold text-sm">01</span>
                  <div>
                    <div className="font-bold text-foreground mb-1">Set up monthly financial tracking &amp; separate accounts</div>
                    <p className="text-muted-foreground font-sans text-xs">
                      Establish a dedicated accounting ledger with weekly reconciliation to achieve clear cash runway visibility.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border/80 flex items-start gap-4">
                  <span className="text-amber-500 font-bold text-sm">02</span>
                  <div>
                    <div className="font-bold text-foreground mb-1">Validate unit economics with your top customer segment</div>
                    <p className="text-muted-foreground font-sans text-xs">
                      Verify whether current gross margins cover rising seasonal logistics and raw material price volatility.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border/80 flex items-start gap-4">
                  <span className="text-amber-500 font-bold text-sm">03</span>
                  <div>
                    <div className="font-bold text-foreground mb-1">Formalize supplier contracts &amp; quality standards</div>
                    <p className="text-muted-foreground font-sans text-xs">
                      Contract with at least two alternative regional feedstock suppliers to mitigate single-source failure risks.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border/80 flex items-start gap-4">
                  <span className="text-amber-500 font-bold text-sm">04</span>
                  <div>
                    <div className="font-bold text-foreground mb-1">Prepare blended finance &amp; impact grant documentation</div>
                    <p className="text-muted-foreground font-sans text-xs">
                      Package your carbon diversion and local employment metrics into a formal data room for impact debt facilities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => {
                    setHasStarted(false);
                    setIsCompleted(false);
                    setCurrentIdx(0);
                    setAnswers({});
                  }}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground"
                >
                  ↺ Retake Diagnostic
                </button>

                <Link
                  href="/collaborate/contact"
                  className="px-6 py-3 rounded-xl bg-amber-500 text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
                >
                  Submit for Lab Incubation →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
