import CommunityPage from "../page";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Coworking & Desk Residencies — Maharajgunj Station",
  description:
    "Work from the Sustainability Lab in Maharajgunj, Kathmandu. Flexible desks, private meeting rooms, rapid prototyping tools, and community membership for climate founders and researchers.",
  path: "/community/coworking",
  keywords: [
    "Maharajgunj Coworking Space",
    "Climate Desk Residency",
    "Sustainability Lab Coworking",
    "Kathmandu Workstations",
  ],
});

export default function CoworkingRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Community", url: "/community" },
          { name: "Coworking & Residencies", url: "/community/coworking" },
        ]}
      />
      <CommunityPage />
    </>
  );
}
