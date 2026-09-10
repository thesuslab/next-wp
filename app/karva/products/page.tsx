import KarvaPage from "../page";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "KĀRVA Products & Material Experiments",
  description:
    "Enduring circular objects, architectural surfaces, and experimental joinery crafted from discarded and reclaimed materials by the Sustainability Lab.",
  path: "/karva/products",
  keywords: [
    "KĀRVA Products",
    "Circular Objects",
    "Reclaimed Furniture Nepal",
    "Material Experiments",
  ],
});

export default function ProductsRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "KĀRVA", url: "/karva" },
          { name: "Products & Experiments", url: "/karva/products" },
        ]}
      />
      <KarvaPage />
    </>
  );
}
