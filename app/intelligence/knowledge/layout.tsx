import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Knowledge Hub & Open Datasets",
  description:
    "Curated research papers, field notes, open environmental datasets, and actionable policy playbooks from the Sustainability Lab.",
  path: "/intelligence/knowledge",
  keywords: [
    "Environmental Knowledge Base",
    "Open Datasets Nepal",
    "Climate Policy Briefs",
    "Field Research Notes",
  ],
});

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Intelligence", url: "/intelligence" },
          { name: "Knowledge Hub", url: "/intelligence/knowledge" },
        ]}
      />
      {children}
    </>
  );
}
