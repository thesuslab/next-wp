import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "KĀRVA — Earth Systems & Circular Craft",
  description:
    "Circularity and material experiments by the Sustainability Lab. Transforming salvaged architectural timber, kiln brick, and agricultural residue into circular objects.",
  path: "/karva",
  keywords: [
    "KĀRVA",
    "Circular Craftsmanship",
    "Reclaimed Sal Timber",
    "Material Stories",
    "Tangible Sustainability",
    "Architectural Salvage Nepal",
  ],
});

export default function KarvaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "KĀRVA", url: "/karva" },
        ]}
      />
      {children}
    </>
  );
}
