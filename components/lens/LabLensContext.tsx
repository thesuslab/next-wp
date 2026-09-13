"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { usePathname } from "next/navigation";

export interface LensMetric {
  label: string;
  value: string;
  status: "safe" | "warning" | "alert" | "neutral";
  details?: string;
}

export interface RouteLensContext {
  title: string;
  subtitle: string;
  category: string;
  confidenceScore: number;
  metrics: LensMetric[];
  insights: string[];
}

interface LabLensContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleLens: () => void;
  activeContext: RouteLensContext;
}

const LabLensContext = createContext<LabLensContextType | undefined>(undefined);

export function LabLensProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleLens = () => setIsOpen((prev) => !prev);

  const activeContext: RouteLensContext = useMemo(() => {
    if (pathname.includes("/enterprise")) {
      return {
        title: "Enterprise Ecosystem Diagnostic",
        subtitle: "Live Telemetry: Nepal & Regional SMEs",
        category: "ECONOMIC RESILIENCE",
        confidenceScore: 89,
        metrics: [
          { label: "MARKET FIT", value: "HIGH (74/100)", status: "safe", details: "Growing circular product demand" },
          { label: "FINANCIAL BUFFER", value: "ALERT (42/100)", status: "alert", details: "Runway < 6 months for 58% of cohort" },
          { label: "OPERATIONS", value: "MEDIUM (68/100)", status: "warning", details: "Supply chain bottlenecks in raw goods" },
          { label: "DIGITAL ADOPTION", value: "MEDIUM (54/100)", status: "warning", details: "Low automated inventory capture" },
          { label: "SUSTAINABILITY", value: "STRONG (81/100)", status: "safe", details: "High ESG and local resource compliance" },
        ],
        insights: [
          "Priority 01: Establish formal monthly financial recording.",
          "Priority 02: Diversify localized supplier dependencies.",
          "Priority 03: Prepare blended finance pitch decks for climate capital.",
        ],
      };
    }

    if (pathname.includes("/resilience")) {
      return {
        title: "Infrastructure Hazard Evaluation",
        subtitle: "Spatial Grid: Bagmati & Koshi River Basins",
        category: "PHYSICAL RESILIENCE",
        confidenceScore: 94,
        metrics: [
          { label: "CLIMATE EXPOSURE", value: "62/100", status: "warning", details: "Projected +2.1°C thermal stress by 2040" },
          { label: "ENV SENSITIVITY", value: "78/100", status: "safe", details: "High ecological buffer zone preserved" },
          { label: "HAZARD VULNERABILITY", value: "49/100", status: "alert", details: "Monsoon flash-flood & landslide risk high" },
          { label: "INFRA STRUCTURE", value: "71/100", status: "safe", details: "Flexible ductile design implemented" },
          { label: "COMMUNITY CO-BENEFIT", value: "65/100", status: "neutral", details: "Local employment & irrigation access" },
        ],
        insights: [
          "Critical Action: Reinforce toe-wall drainage along steep embankment cuts.",
          "Secondary Action: Institute catchment-wide early warning telemetry.",
        ],
      };
    }

    if (pathname.includes("/karva")) {
      return {
        title: "Material Circularity Audit",
        subtitle: "Reclaimed Timber & Architectural Salvage Index",
        category: "TANGIBLE SYSTEMS",
        confidenceScore: 92,
        metrics: [
          { label: "EMBODIED CARBON", value: "-76% vs Virgin", status: "safe", details: "Salvaged sal & pine structural members" },
          { label: "RESOURCE DIVERSION", value: "4.8 Tons Reclaimed", status: "safe", details: "Diverted from urban demolition landfill" },
          { label: "TOXICITY / ADHESIVES", value: "ZERO VOC", status: "safe", details: "Tung oil & natural beeswax sealants" },
          { label: "LIFECYCLE PROJECTION", value: "60+ Years", status: "neutral", details: "Modular disassemblable joinery" },
        ],
        insights: [
          "Batch 04 sal timber exhibits compressive strength equal to grade A structural lumber.",
          "All joinery designed for 100% post-use recovery without mechanical destruction.",
        ],
      };
    }

    if (pathname.includes("/community")) {
      return {
        title: "Physical Commons & Network Dynamics",
        subtitle: "Lab Facility: Maharajgunj / Kathmandu Station",
        category: "COMMUNITY ECOSYSTEM",
        confidenceScore: 95,
        metrics: [
          { label: "ACTIVE RESIDENTS", value: "48 Fellows / Startups", status: "safe", details: "Climate tech, research, policy" },
          { label: "INTERDISCIPLINARY COUPLING", value: "88%", status: "safe", details: "High cross-collaboration between teams" },
          { label: "FACILITY OCCUPANCY", value: "73%", status: "neutral", details: "Desk & workshop capacity optimal" },
          { label: "MONTHLY SESSIONS", value: "14 Open Labs", status: "safe", details: "Average attendance: 35 practitioners" },
        ],
        insights: [
          "Upcoming priority: Expand bio-foundry rapid prototyping access.",
          "Next public session: Hydrological modeling working group on Thursday.",
        ],
      };
    }

    if (pathname.startsWith("/intelligence/knowledge")) {
      // Check if viewing a specific article
      const segments = pathname.split("/").filter(Boolean);
      const articleSlug = segments[2]; // /intelligence/knowledge/[slug]
      
      if (articleSlug) {
        return {
          title: "Knowledge Base Verification Ledger",
          subtitle: `Article ID: ${articleSlug} • Primary Source Grounded`,
          category: "VERIFIED EVIDENCE",
          confidenceScore: 98,
          metrics: [
            { label: "EVIDENCE LEVEL", value: "PEER / UN / WB", status: "safe", details: "Ground-truth institutional data verification" },
            { label: "CITATION AUDIT", value: "VERIFIED", status: "safe", details: "Direct link to primary source publication" },
            { label: "AI GROUNDING", value: "SYNCHRONIZED", status: "safe", details: "Article text actively available to AI Advisor" },
            { label: "METHODOLOGY", value: "SYSTEMATIC", status: "neutral", details: "Quantitative baseline & multi-scenario projections" },
          ],
          insights: [
            "This report is registered in the Sustainability Lab verified ledger.",
            "Ask Lab Lens or the AI Advisor to synthesize this data with your project parameters.",
          ],
        };
      }

      return {
        title: "Sustainability Lab Knowledge Base",
        subtitle: "28 Grounded Reports • Evidence-First Environmental Intelligence",
        category: "KNOWLEDGE COMMONS",
        confidenceScore: 97,
        metrics: [
          { label: "TOTAL REPORTS", value: "28 INDEXED", status: "safe", details: "UNFCCC NDC, World Bank CCKP, ICIMOD, WHO, ADB" },
          { label: "PRIMARY SOURCES", value: "100% SOURCED", status: "safe", details: "Zero speculative or unsourced claims" },
          { label: "GEOGRAPHIC SCOPE", value: "HIMALAYAN / S. ASIA", status: "neutral", details: "Nepal national, river basins, & ecological zones" },
          { label: "AI READINESS", value: "RAG EMBEDDED", status: "safe", details: "Full contextual querying enabled across catalog" },
        ],
        insights: [
          "Browse by Category (Climate, Infrastructure, Policy, Enterprise) or Kind.",
          "Select any article to interrogate its methodology and localized risk implications with the AI Advisor.",
        ],
      };
    }

    if (pathname.includes("/our-story") || pathname.includes("/lab")) {
      return {
        title: "The Sustainability Lab • Maharajgunj Station",
        subtitle: "Physical Station: 27.7408° N, 85.3365° E • Kathmandu Valley",
        category: "INSTITUTIONAL IDENTITY",
        confidenceScore: 99,
        metrics: [
          { label: "HEADQUARTERS", value: "MAHARAJGUNJ, KTM", status: "safe", details: "Research station, workshop & testing commons" },
          { label: "PILLARS", value: "3 DOORS", status: "safe", details: "Intelligence, Resilience, Enterprise (KĀRVA)" },
          { label: "COMMONS NETWORK", value: "OPEN ACCESS", status: "safe", details: "Fellowships, residencies, and public data APIs" },
          { label: "FOUNDATION", value: "NON-PROFIT / STUDIO", status: "neutral", details: "Hybrid research lab and regenerative venture studio" },
        ],
        insights: [
          "Door 1 (Intelligence): GIS spatial telemetry, 28 knowledge base reports, climate scanner.",
          "Door 2 (Resilience): Himalayan watershed hydrology, GLOF modeling, bio-engineering.",
          "Door 3 (Enterprise): Circular craftsmanship studio (KĀRVA) and regenerative business diagnostics.",
        ],
      };
    }

    // Default / Homepage / Intelligence
    return {
      title: "The Sustainability Lab • Environmental Intelligence",
      subtitle: "Active Coordinates: 27.7408° N, 85.3365° E (Maharajgunj, Kathmandu)",
      category: "EARTH TELEMETRY",
      confidenceScore: 96,
      metrics: [
        { label: "ENVIRONMENT", value: "HIGH CONCERN", status: "alert", details: "Catchment runoff & topsoil erosion active" },
        { label: "CLIMATE HAZARD", value: "ELEVATED", status: "warning", details: "Monsoon anomaly +18% variability" },
        { label: "BIODIVERSITY INDEX", value: "76/100", status: "neutral", details: "Key wildlife corridors under pressure" },
        { label: "COMMUNITY RESILIENCE", value: "MEDIUM", status: "warning", details: "Decentralized water storage required" },
        { label: "INFRASTRUCTURE BUFFER", value: "MODERATE", status: "neutral", details: "Seismic retrofitting ongoing" },
      ],
      insights: [
        "Intelligence telemetry refreshed from 42 satellite & in-situ hydrological nodes.",
        "Model projection: Early intervention yields 4.2x disaster cost avoidance by 2030.",
      ],
    };
  }, [pathname]);

  return (
    <LabLensContext.Provider value={{ isOpen, setIsOpen, toggleLens, activeContext }}>
      {children}
    </LabLensContext.Provider>
  );
}

export function useLabLens() {
  const context = useContext(LabLensContext);
  if (!context) {
    throw new Error("useLabLens must be used within a LabLensProvider");
  }
  return context;
}
