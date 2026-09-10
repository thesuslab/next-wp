import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Collaborate & Partner With the Lab",
  description:
    "Partner with the Sustainability Lab across infrastructure assessments, climate finance advisory, spatial telemetry, and enterprise incubation.",
  path: "/collaborate",
  keywords: [
    "Partner Sustainability Lab",
    "Infrastructure Collaboration",
    "Climate Advisory Intake",
    "Development Agency Partnerships",
  ],
});

export default function CollaborateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Collaborate", url: "/collaborate" },
        ]}
      />
      {children}
    </>
  );
}
