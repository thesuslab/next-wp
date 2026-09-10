import KarvaPage from "../page";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "KĀRVA Materials Registry — Salvaged Timber & Residues",
  description:
    "Explore the reclaimed material registry at KĀRVA: century-old Sal timber, historic kiln bricks, agricultural bagasse fiber, and vernacular joinery.",
  path: "/karva/materials",
  keywords: [
    "Reclaimed Sal Timber",
    "Material Registry Nepal",
    "Salvaged Architectural Elements",
    "Circularity Studio",
  ],
});

export default function MaterialsRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "KĀRVA", url: "/karva" },
          { name: "Materials Registry", url: "/karva/materials" },
        ]}
      />
      <KarvaPage />
    </>
  );
}
