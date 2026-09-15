import { HeroSection } from "@/components/home/HeroSection";
import { PropositionSection } from "@/components/home/PropositionSection";
import { ThreeDoorsSection } from "@/components/home/ThreeDoorsSection";
import { IntelligenceEngineSection } from "@/components/home/IntelligenceEngineSection";
import { ResilienceSection } from "@/components/home/ResilienceSection";
import { EnterpriseSection } from "@/components/home/EnterpriseSection";
import { PhysicalLabSection } from "@/components/home/PhysicalLabSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { PartnershipsSection } from "@/components/home/PartnershipsSection";
import { WorkSection } from "@/components/home/WorkSection";
import { ManifestoSection } from "@/components/home/ManifestoSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";
import { FaqJsonLd } from "@/components/seo/JsonLd";

const HOME_FAQ_ITEMS = [
  {
    question: "What is the Sustainability Lab?",
    answer:
      "The Sustainability Lab is an interdisciplinary research laboratory, environmental intelligence platform, and circular design studio based in Maharajgunj, Kathmandu Valley, Nepal. It bridges planetary environmental science, climate engineering, high-resolution spatial telemetry, circular craftsmanship, and entrepreneurial incubation.",
  },
  {
    question: "Where is the Sustainability Lab located?",
    answer:
      "The Sustainability Lab's primary research station, material workshop, and community coworking hub are located in Maharajgunj, Kathmandu Valley, Nepal (Coordinates: 27.7408° N, 85.3365° E).",
  },
  {
    question: "What is Sustainable AI (Lab Lens)?",
    answer:
      "Sustainable AI (Lab Lens) is the Sustainability Lab's persistent sitewide intelligence HUD and autonomous advisor. It delivers real-time environmental, climate hazard, and biodiversity telemetry grounded in verified evidence and newly published dispatches for every domain explored across the platform.",
  },
  {
    question: "How does the Sustainability Lab collaborate with external organizations?",
    answer:
      "The Lab partners with government ministries, international finance institutions, engineering firms, and local community leaders on infrastructure safeguards (IEE/EIA), IPCC 2050 climate risk scanning, nature-based bio-engineering solutions, and blended climate finance.",
  },
];

export default function Home() {
  return (
    <main>
      <FaqJsonLd items={HOME_FAQ_ITEMS} />
      {/* 01 — Hero */}
      <HeroSection />

      {/* 02 — The Proposition */}
      <PropositionSection />

      {/* 03 — Three Doors */}
      <ThreeDoorsSection />

      {/* 04 — The Intelligence Engine */}
      <IntelligenceEngineSection />

      {/* 05 — Resilience */}
      <ResilienceSection />

      {/* 06 — Enterprise */}
      <EnterpriseSection />

      {/* 07 — The Physical Lab */}
      <PhysicalLabSection />

      {/* 09 — Community */}
      <CommunitySection />

      {/* 10 — Partnerships */}
      <PartnershipsSection />

      {/* 11 — Work */}
      <WorkSection />

      {/* 12 — Manifesto */}
      <ManifestoSection />

      {/* 13 — Final CTA */}
      <FinalCTASection />
    </main>
  );
}
