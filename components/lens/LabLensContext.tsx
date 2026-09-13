"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { getKnowledgeEntryBySlug } from "@/lib/knowledge/data";

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
      const segments = pathname.split("/").filter(Boolean);
      const articleSlug = segments[2]; // /intelligence/knowledge/[slug]
      
      if (articleSlug) {
        const article = getKnowledgeEntryBySlug(articleSlug);
        if (article) {
          const metrics: LensMetric[] = [
            {
              label: "EVIDENCE LEVEL",
              value: article.source.level.toUpperCase(),
              status: "safe",
              details: `Authority: ${article.source.name}`,
            },
            {
              label: "CITATION AUDIT",
              value: "OFFICIAL",
              status: "safe",
              details: `Date: ${article.source.date} • ${article.source.type}`,
            },
            {
              label: "GEOGRAPHIC SCOPE",
              value: article.region.toUpperCase(),
              status: "neutral",
              details: `${article.locality ? `${article.locality}, ` : ""}${article.country}`,
            },
            {
              label: "TOPIC / CATEGORY",
              value: article.category.toUpperCase(),
              status: "safe",
              details: `Index Topic: ${article.topic}`,
            },
          ];

          if (article.data?.temperatureMedianC !== undefined) {
            metrics.push({
              label: "TEMP PROJECTION",
              value: `+${article.data.temperatureMedianC}°C`,
              status: "warning",
              details: `${article.data.scenario || "Scenario"} (${article.data.period || "2050"})`,
            });
          } else if (article.data?.temperatureChangeCPerDecade !== undefined) {
            metrics.push({
              label: "DECADAL WARMING",
              value: `+${article.data.temperatureChangeCPerDecade}°C / dec`,
              status: "warning",
              details: "Observed trend since 1970 (ERA5)",
            });
          } else {
            metrics.push({
              label: "AI READINESS",
              value: "RAG LOADED",
              status: "safe",
              details: "Full report text ready for interactive interrogation",
            });
          }

          return {
            title: article.title,
            subtitle: `Source: ${article.source.name} (${article.source.date})`,
            category: `VERIFIED REPORT • ${article.category.toUpperCase()}`,
            confidenceScore: 100,
            metrics,
            insights: [
              article.summary,
              `Primary URL: ${article.source.url}`,
            ],
          };
        }
      }

      return {
        title: "Sustainability Lab Knowledge Commons",
        subtitle: "28 Sourced Research Reports & Baseline Assessments",
        category: "KNOWLEDGE COMMONS",
        confidenceScore: 100,
        metrics: [
          { label: "INDEXED PAPERS", value: "28 REPORTS", status: "safe", details: "UNFCCC NDC, World Bank, ICIMOD, WHO, ADB" },
          { label: "PRIMARY CITATIONS", value: "100% SOURCED", status: "safe", details: "All data cross-referenced to institutional releases" },
          { label: "BASELINE PERIOD", value: "1995–2014 ERA5", status: "neutral", details: "Historical baseline 12.66°C, 2,042mm precip" },
          { label: "PROJECTION HORIZONS", value: "2030 / 2050", status: "safe", details: "IPCC CMIP6 SSP1-2.6 to SSP3-7.0 pathways" },
          { label: "AI ADVISOR", value: "SYNCHRONIZED", status: "safe", details: "Direct chat enabled for each document" },
        ],
        insights: [
          "Browse reports by Category (Climate, Infrastructure, Policy, Enterprise) or Kind.",
          "Select any report to interrogate its primary figures, methodologies, and localized adaptation guidance.",
        ],
      };
    }

    if (pathname.includes("/our-story") || pathname.includes("/lab")) {
      return {
        title: "The Sustainability Lab • Maharajgunj Research Station",
        subtitle: "Station Coordinates: 27.7408° N, 85.3365° E • Kathmandu Valley",
        category: "INSTITUTIONAL HEADQUARTERS",
        confidenceScore: 100,
        metrics: [
          { label: "HEADQUARTERS", value: "MAHARAJGUNJ, KTM", status: "safe", details: "Physical station, workshop, and testing labs" },
          { label: "DOOR 1: INTELLIGENCE", value: "ACTIVE", status: "safe", details: "28-article Knowledge Base, GIS layers, Risk Scanner" },
          { label: "DOOR 2: RESILIENCE", value: "ACTIVE", status: "safe", details: "Watershed hydrology, GLOF and flood safeguarding" },
          { label: "DOOR 3: ENTERPRISE", value: "KĀRVA STUDIO", status: "safe", details: "Circular craftsmanship, Sal timber, SME incubation" },
        ],
        insights: [
          "Door 1 (Intelligence): Real-time watershed GIS, 28 knowledge base reports, climate risk scanner.",
          "Door 2 (Resilience): Himalayan watershed hydrology, GLOF modeling, bio-engineering slope stabilization.",
          "Door 3 (Enterprise): Circular craftsmanship studio (KĀRVA) and regenerative business diagnostics.",
        ],
      };
    }

    // Default / Homepage / Environmental Intelligence
    return {
      title: "Environmental Intelligence Telemetry",
      subtitle: "Maharajgunj Research Station • 27.7408° N, 85.3365° E (Kathmandu Valley)",
      category: "WATERSHED & CLIMATE BASELINE",
      confidenceScore: 98,
      metrics: [
        { label: "HISTORICAL MEAN TEMP", value: "12.66 °C", status: "neutral", details: "World Bank CCKP baseline period (1995–2014)" },
        { label: "ANNUAL PRECIPITATION", value: "2,042.3 mm", status: "neutral", details: "National climatological average (ERA5)" },
        { label: "WARMING RATE", value: "+0.17 °C / dec", status: "warning", details: "Observed temperature trend across Nepal since 1970" },
        { label: "MID-CENTURY PROJECTION", value: "+1.50 °C [SSP3-7.0]", status: "alert", details: "Median warming for 2040–2059 (1.10°C to 2.01°C range)" },
        { label: "RESEARCH COMMONS", value: "28 REPORTS", status: "safe", details: "Verified evidence catalog ready for AI synthesis" },
      ],
      insights: [
        "All metrics calibrated directly against World Bank CCKP (ERA5 reanalysis) and IPCC CMIP6 models.",
        "Use the Ask Lab Lens prompt below to query localized adaptation measures for your site.",
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
