import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Community, Calendar & Maharajgunj Coworking Station",
  description:
    "Join the interdisciplinary community at the Sustainability Lab. Coworking desk residencies, public climate meetups, and open research sessions in Maharajgunj, Kathmandu.",
  path: "/community",
  keywords: [
    "Sustainability Community",
    "Maharajgunj Coworking Space",
    "Climate Meetup Nepal",
    "Open Lab Sessions",
    "Kathmandu Innovation Hub",
  ],
});

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Community", url: "/community" },
        ]}
      />
      {children}
    </>
  );
}
