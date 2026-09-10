import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Climate Risk Scanner & IPCC Horizons",
  description:
    "Interactive Climate Risk Scanner projecting multi-hazard exposure across 2030 and 2050 IPCC scenarios for Himalayan and South Asian infrastructure.",
  path: "/intelligence/climate",
  keywords: [
    "Climate Risk Scanner",
    "IPCC 2050 Nepal",
    "GLOF Hazards",
    "Landslide Vulnerability",
    "Climate Adaptation Engineering",
  ],
});

export default function ClimateLayout({
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
          { name: "Climate Intelligence", url: "/intelligence/climate" },
        ]}
      />
      {children}
    </>
  );
}
