import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Sustainable AI Advisor — Ask the Lab",
  description:
    "Sustainable AI decision intelligence assistant pairing real-world environmental data with contextual infrastructure, climate risk, and circular modeling.",
  path: "/intelligence/ai",
  keywords: [
    "Sustainable AI",
    "Sustainable AI Advisor",
    "Lab Lens",
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
          { name: "Sustainable AI Advisor", url: "/intelligence/ai" },
        ]}
      />
      {children}
    </>
  );
}
