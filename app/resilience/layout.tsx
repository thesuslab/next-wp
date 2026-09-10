import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Resilience Suite & Infrastructure Calculator",
  description:
    "Multi-criteria project resilience assessment, bio-engineered slope stabilization, and ductile infrastructure design for 50-year climate horizons.",
  path: "/resilience",
  keywords: [
    "Infrastructure Resilience",
    "Climate Hardening",
    "Resilience Score Calculator",
    "Bio-Engineering",
    "Disaster Risk Reduction",
    "Nepal Infrastructure",
  ],
});

export default function ResilienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Resilience Suite", url: "/resilience" },
        ]}
      />
      {children}
    </>
  );
}
