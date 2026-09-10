import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "AI Advisory Engine — Ask the Lab",
  description:
    "Domain-specific decision intelligence assistant pairing real-world environmental data with contextual infrastructure and business modeling.",
  path: "/intelligence/ai",
  keywords: [
    "AI Advisory Engine",
    "Environmental AI",
    "Ask the Lab",
    "Climate Decision Intelligence",
    "Circular Economy Modeling",
  ],
});

export default function AiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Intelligence", url: "/intelligence" },
          { name: "AI Advisory Engine", url: "/intelligence/ai" },
        ]}
      />
      {children}
    </>
  );
}
