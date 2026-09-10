import CollaboratePage from "../page";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Contact & Directorate Intake",
  description:
    "Direct project intake with the Sustainability Lab Directorate. Submit your infrastructure challenges, research questions, or collaboration proposals.",
  path: "/collaborate/contact",
  keywords: [
    "Contact Sustainability Lab",
    "Project Intake",
    "Directorate Consultation",
    "Patan Station Address",
  ],
});

export default function ContactRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Collaborate", url: "/collaborate" },
          { name: "Contact & Intake", url: "/collaborate/contact" },
        ]}
      />
      <CollaboratePage />
    </>
  );
}
