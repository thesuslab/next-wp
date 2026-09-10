import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Environmental Intelligence & Sector Baselines",
  description:
    "Initial Environmental Examination (IEE), EIA compliance, biodiversity corridors, and spatial safeguards across six core infrastructure sectors.",
  path: "/intelligence/environmental",
  keywords: [
    "Environmental Intelligence",
    "EIA Nepal",
    "IEE Safeguards",
    "Hydropower Baselines",
    "Biodiversity Corridor",
    "Spatial Telemetry",
  ],
});

export default function EnvironmentalLayout({
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
          { name: "Environmental Intelligence", url: "/intelligence/environmental" },
        ]}
      />
      {children}
    </>
  );
}
