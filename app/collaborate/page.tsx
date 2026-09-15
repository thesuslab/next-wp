"use client";

import { useState } from "react";
import Link from "next/link";
import { LocationMap } from "@/components/maps/LocationMap";
import { Phone, Mail, MapPin } from "lucide-react";

type IntentType =
  | "project"
  | "expertise"
  | "partner"
  | "coworking"
  | "business"
  | "collaborate"
  | "other";

interface IntentConfig {
  label: string;
  question: string;
  fieldPlaceholder: string;
  secondaryPlaceholder: string;
}

const intentConfigs: Record<IntentType, IntentConfig> = {
  project: {
    label: "I have a project",
    question: "Tell us about your infrastructure or development asset.",
    fieldPlaceholder: "e.g. 30MW run-of-river hydro, 25km mountain road, urban drainage masterplan...",
    secondaryPlaceholder: "Current project phase (feasibility, EIA, active construction)?",
  },
  expertise: {
    label: "I need expertise",
    question: "What specific domain challenge are you attempting to solve?",
    fieldPlaceholder: "e.g. Slope stability bio-engineering, GLOF early warning, FPIC community consent...",
    secondaryPlaceholder: "What is your target decision horizon?",
  },
  partner: {
    label: "I want to partner",
    question: "What institutional or research synergy do you envision?",
    fieldPlaceholder: "e.g. Bilateral funding facility, joint research publication, technology deployment...",
    secondaryPlaceholder: "Organization type (multilateral, NGO, academic, enterprise)?",
  },
  coworking: {
    label: "I want to work from the Lab",
    question: "Tell us about yourself and your work focus.",
    fieldPlaceholder: "e.g. Independent climate data scientist, visiting researcher, early-stage founder...",
    secondaryPlaceholder: "Preferred residency duration (flexible hot-desk, dedicated monthly team bench)?",
  },
  business: {
    label: "I am building a business",
    question: "What circular or climate venture are you scaling?",
    fieldPlaceholder: "e.g. Agri-waste packaging, solar drying equipment, electric micro-mobility...",
    secondaryPlaceholder: "Current monthly revenue and key operational bottleneck?",
  },
  collaborate: {
    label: "I want to collaborate",
    question: "How would you like to contribute to the Lab commons?",
    fieldPlaceholder: "e.g. Open-source data pipeline, workshop hosting, mentorship...",
    secondaryPlaceholder: "Relevant technical domains or past projects?",
  },
  other: {
    label: "I have another idea",
    question: "What would you like to bring to the table?",
    fieldPlaceholder: "Tell us anything that doesn't fit standard categories...",
    secondaryPlaceholder: "How can we assist you best?",
  },
};

const lifecycle = [
  { step: "01", name: "CHALLENGE", desc: "Identify systemic failure points or regulatory blindspots." },
  { step: "02", name: "DISCOVERY", desc: "Ground-truth field conditions and review local hydrological records." },
  { step: "03", name: "RESEARCH", desc: "Spatial modeling, ecological baselines, and stakeholder mapping." },
  { step: "04", name: "PROTOTYPE", desc: "Physical workshop testing and bio-engineering specimen fabrication." },
  { step: "05", name: "PILOT", desc: "Real-world micro-deployment in target watershed or community." },
  { step: "06", name: "MEASURE", desc: "Sensor telemetry tracking of resilience gains and carbon diversion." },
  { step: "07", name: "SCALE", desc: "Policy translation, technical manual publication, and ecosystem handover." },
];

export default function CollaboratePage() {
  const [activeIntent, setActiveIntent] = useState<IntentType>("project");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [primaryDetails, setPrimaryDetails] = useState("");
  const [secondaryDetails, setSecondaryDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeConfig = intentConfigs[activeIntent];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: activeConfig.label,
          name,
          email,
          primaryDetails,
          secondaryDetails,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit project brief.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong sending your brief. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
          <Link href="/" className="hover:text-data transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-foreground">COLLABORATE</span>
        </div>

        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-data/10 text-data border border-data/30 rounded-full mb-6">
            07 • PARTNERSHIP &amp; ENGAGEMENT
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-6">
            BRING US A <br />
            <span className="text-data">CHALLENGE.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            Some problems are too complex to solve in isolation. We partner with infrastructure developers, multilateral lenders, research institutes, and audacious founders.
          </p>
        </div>

        {/* Three Pathways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-8 rounded-2xl bg-card border border-border/70">
            <span className="text-xs font-mono text-data block mb-3">PATHWAY 01</span>
            <h3 className="font-display font-bold text-2xl mb-2">Partner</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Co-design multi-year research initiatives, living watershed observatories, and resilient infrastructure frameworks.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border/70">
            <span className="text-xs font-mono text-data block mb-3">PATHWAY 02</span>
            <h3 className="font-display font-bold text-2xl mb-2">Fund</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Deploy catalytic capital, impact grants, or concessional debt to pilot high-altitude climate adaptation experiments.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border/70">
            <span className="text-xs font-mono text-data block mb-3">PATHWAY 03</span>
            <h3 className="font-display font-bold text-2xl mb-2">Collaborate</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Contribute software algorithms, domain hydrology data, academic fellows, or test bio-materials at the Lab.
            </p>
          </div>
        </div>

        {/* Partnership Lifecycle Flow */}
        <div className="p-8 sm:p-10 rounded-2xl bg-card border border-border mb-20 shadow-xl">
          <div className="text-xs font-mono text-data uppercase tracking-wider mb-2">
            THE LAB METHODOLOGY
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8">
            How We Work Together
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {lifecycle.map((item) => (
              <div key={item.step} className="p-4 rounded-xl bg-background border border-border/60">
                <span className="text-xs font-mono text-data font-bold block mb-1">
                  {item.step}
                </span>
                <div className="font-display font-bold text-xs mb-1.5 uppercase">
                  {item.name}
                </div>
                <p className="text-[11px] text-muted-foreground font-light leading-snug">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Contact Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-card border border-border/80 flex items-start gap-4 shadow-sm hover:border-bamboo/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-bamboo/10 text-bamboo flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Direct Line / WhatsApp
              </div>
              <a
                href="tel:9860897903"
                className="font-mono text-base sm:text-lg font-bold text-foreground hover:text-bamboo transition-colors"
              >
                9860897903
              </a>
              <p className="text-xs text-muted-foreground mt-1">
                Directorate telephone &amp; rapid communication
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 flex items-start gap-4 shadow-sm hover:border-data/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-data/10 text-data flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Directorate Email
              </div>
              <a
                href="mailto:hello@sustainabilitylab.xyz"
                className="font-mono text-base sm:text-lg font-bold text-foreground hover:text-data transition-colors"
              >
                hello@sustainabilitylab.xyz
              </a>
              <p className="text-xs text-muted-foreground mt-1">
                Project briefs, data exchanges &amp; RFPs
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 flex items-start gap-4 shadow-sm hover:border-border transition-colors">
            <div className="w-10 h-10 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Research Station
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-foreground">
                Maharajgunj, Kathmandu
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Coordinates: 27.7408° N, 85.3365° E
              </p>
            </div>
          </div>
        </div>

        {/* Intelligent Contact Form (Section 29) */}
        <div id="contact" className="p-8 sm:p-12 rounded-2xl bg-card border border-data/30 shadow-2xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono text-data uppercase tracking-widest block mb-2">
              INTELLIGENT INTAKE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
              What are you working on?
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              Select your intention below; our interface adapts the diagnostic questions to your specific context.
            </p>
          </div>

          {/* Dynamic Intent Selector Pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {(Object.keys(intentConfigs) as IntentType[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveIntent(key);
                  setIsSubmitted(false);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                  activeIntent === key
                    ? "bg-data text-black font-semibold shadow-[0_0_15px_rgba(0,212,170,0.3)]"
                    : "bg-background border border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {intentConfigs[key].label}
              </button>
            ))}
          </div>

          {isSubmitted ? (
            <div className="p-8 rounded-xl bg-bamboo/10 border border-bamboo/30 text-center max-w-lg mx-auto font-mono text-xs text-bamboo space-y-3">
              <div className="text-2xl">✓</div>
              <div className="font-bold text-sm text-foreground">Inquiry Received by Lab Directorate</div>
              <p className="text-muted-foreground font-sans text-xs">
                Thank you, {name || "Colleague"}. Your project brief has been routed to our domain leads. We will review your context and respond within 2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
              {/* Context-Specific Dynamic Question */}
              <div className="p-6 rounded-xl bg-background border border-border/80 space-y-4">
                <div className="text-xs font-mono text-data uppercase tracking-wider font-semibold">
                  CONTEXTUAL INQUIRY: {activeConfig.label}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {activeConfig.question}
                </div>

                <div>
                  <textarea
                    required
                    rows={3}
                    value={primaryDetails}
                    onChange={(e) => setPrimaryDetails(e.target.value)}
                    placeholder={activeConfig.fieldPlaceholder}
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:border-data focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={secondaryDetails}
                    onChange={(e) => setSecondaryDetails(e.target.value)}
                    placeholder={activeConfig.secondaryPlaceholder}
                    className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:border-data focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Standard Identity Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-xs text-foreground focus:border-data focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav@organization.org"
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-xs text-foreground focus:border-data focus:outline-none font-mono"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-xs font-mono text-destructive">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-data text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-data/90 transition-all shadow-lg hover:shadow-data/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Transmitting to Directorate...
                  </>
                ) : (
                  "Submit Project Brief →"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Maharajgunj Station Map */}
        <LocationMap className="mt-16" />
      </div>
    </main>
  );
}
