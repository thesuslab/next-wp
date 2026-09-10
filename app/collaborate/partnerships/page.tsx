import CollaboratePage from "../page";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Institutional Partnerships & Strategic Network",
  description:
    "Partner with the Sustainability Lab across government agencies, international finance institutions, research universities, and grassroots community networks.",
  path: "/collaborate/partnerships",
  keywords: [
    "Institutional Partnerships",
    "Development Finance",
    "Government Infrastructure Partnerships",
    "Himalayan Climate Alliance",
  ],
});

export default function PartnershipsRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Collaborate", url: "/collaborate" },
          { name: "Partnerships Network", url: "/collaborate/partnerships" },
        ]}
      />
      <CollaboratePage />
    </>
  );
}
