import LabAboutPage from "../page";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Our Approach & Interdisciplinary Methodology",
  description:
    "How the Sustainability Lab works: empirical evidence before assumption, people before technology, and living systems over symptoms.",
  path: "/lab/approach",
  keywords: [
    "Sustainability Methodology",
    "Interdisciplinary Approach",
    "Systems Engineering",
    "Living Watersheds",
  ],
});

export default function ApproachRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "The Lab", url: "/lab" },
          { name: "Approach", url: "/lab/approach" },
        ]}
      />
      <LabAboutPage />
    </>
  );
}
