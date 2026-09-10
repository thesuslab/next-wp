import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Enterprise Diagnostic Tool & Action Roadmap",
  description:
    "20-question dynamic enterprise diagnostic assessing Market, Finance, Operations, Digital, and Sustainability readiness with an instant 30-day roadmap.",
  path: "/enterprise/diagnostics",
  keywords: [
    "Enterprise Diagnostic Tool",
    "Climate Startup Assessment",
    "Sustainability Audit",
    "Business Readiness Score",
  ],
});

export default function EnterpriseDiagnosticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Enterprise", url: "/enterprise" },
          { name: "Diagnostics Tool", url: "/enterprise/diagnostics" },
        ]}
      />
      {children}
    </>
  );
}
