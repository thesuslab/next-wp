import IntelligencePage from "../page";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Interactive Intelligence Tools & Simulation Utilities",
  description:
    "Explore the Sustainability Lab interactive tool suite: Climate Risk Scanner, Project Resilience Calculator, and AI Advisory Engine.",
  path: "/intelligence/tools",
  keywords: [
    "Climate Risk Scanner Tool",
    "Resilience Calculator",
    "Environmental Simulation",
    "Open Intelligence Utilities",
  ],
});

export default function ToolsRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Intelligence", url: "/intelligence" },
          { name: "Tools", url: "/intelligence/tools" },
        ]}
      />
      <IntelligencePage />
    </>
  );
}
