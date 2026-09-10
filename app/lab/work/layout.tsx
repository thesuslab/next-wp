import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Work & Case Studies — Ideas Put to Work",
  description:
    "Real-world project interventions: high-altitude wetland conservation, flood-prone highway corridor hardening, and AI enterprise diagnostics.",
  path: "/lab/work",
  keywords: [
    "Sustainability Case Studies",
    "Wetland Conservation Nepal",
    "Resilient Highway Infrastructure",
    "Intervention Outcomes",
  ],
});

export default function WorkLayout({
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
          { name: "Work & Case Studies", url: "/lab/work" },
        ]}
      />
      {children}
    </>
  );
}
