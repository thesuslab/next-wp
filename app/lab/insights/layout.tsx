import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Insights, Field Notes & Critical Dispatches",
  description:
    "Technical essays, field research dispatches, and policy analysis on climate resilience, materials, and infrastructure from the Himalayas.",
  path: "/lab/insights",
  keywords: [
    "Field Notes Nepal",
    "Climate Technical Essays",
    "Himalayan Research Dispatches",
    "Sustainability Insights",
  ],
});

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "The Lab", url: "/lab" },
          { name: "Insights & Field Notes", url: "/lab/insights" },
        ]}
      />
      {children}
    </>
  );
}
