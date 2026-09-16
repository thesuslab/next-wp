import { getAllKnowledgeEntries } from "@/lib/knowledge/data";
import { KnowledgePageClient } from "./KnowledgePageClient";
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Knowledge Hub • Practical Environmental Intelligence",
  description:
    "Field manuals, policy blueprints, climate risk portals, and technical syntheses grounded in official multilateral assessments, national commitments, and local ecosystems.",
  path: "/intelligence/knowledge",
  keywords: [
    "Sustainability Knowledge Hub",
    "Climate Field Reports",
    "Himalayan Watershed Resilience",
    "Policy Blueprints",
    "Verified Institutional Evidence",
  ],
});

export const dynamic = "force-dynamic";

export default function KnowledgePage() {
  const articles = getAllKnowledgeEntries();
  return <KnowledgePageClient initialArticles={articles} />;
}
