import KarvaPage from "../page";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "KĀRVA Material Stories — Provenance & Craft",
  description:
    "Every material carries a story. Discover the provenance, craft history, and transformation journey of reclaimed architectural salvage in Kathmandu Valley.",
  path: "/karva/stories",
  keywords: [
    "Material Provenance",
    "Kathmandu Craft Stories",
    "Circular Architecture",
    "Vernacular Heritage",
  ],
});

export default function StoriesRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "KĀRVA", url: "/karva" },
          { name: "Material Stories", url: "/karva/stories" },
        ]}
      />
      <KarvaPage />
    </>
  );
}
