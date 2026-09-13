import { siteConfig } from "@/site.config";

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.site_domain}/#organization`,
    name: "The Sustainability Lab",
    alternateName: ["Sustainability Lab", "SusLab", "KĀRVA by Sustainability Lab"],
    legalName: "The Sustainability Lab",
    url: siteConfig.site_domain,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.site_domain}/logo.png`,
      width: 1198,
      height: 542,
      caption: "The Sustainability Lab Logo",
    },
    image: `${siteConfig.site_domain}/logo.png`,
    description:
      "Interdisciplinary research laboratory and living platform for environmental intelligence, resilient infrastructure, climate risk adaptation, circular craftsmanship, and enterprise incubation.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Maharajgunj",
      addressLocality: "Maharajgunj, Kathmandu",
      addressRegion: "Bagmati Province",
      postalCode: "44600",
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "27.740824",
      longitude: "85.336483",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@sustainabilitylab.org",
      contactType: "directorate",
      availableLanguage: ["English", "Nepali"],
    },
    knowsAbout: [
      "Environmental Intelligence",
      "Climate Risk Assessment & IPCC Horizons",
      "Green Infrastructure & Bio-Engineering",
      "Disaster Risk Reduction (DRR)",
      "Natural Resource Safeguards & Compliance (IEE/EIA)",
      "Circular Economy & Reclaimed Material Crafts (KĀRVA)",
      "Remote Sensing & GIS Telemetry",
      "Artificial Intelligence Domain Decision Systems",
      "Himalayan Watershed Resilience",
    ],
    sameAs: [
      "https://github.com/thesuslab",
      "https://linkedin.com/company/sustainability-lab",
      "https://twitter.com/suslab",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.site_domain}/#website`,
    url: siteConfig.site_domain,
    name: "Sustainability Lab",
    description: "Intelligence for a resilient future.",
    publisher: {
      "@id": `${siteConfig.site_domain}/#organization`,
    },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.site_domain}/intelligence/knowledge?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${siteConfig.site_domain}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
}: ArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    url: url,
    image: image ? [image] : [`${siteConfig.site_domain}/logo.png`],
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName || "Sustainability Lab Directorate",
    },
    publisher: {
      "@id": `${siteConfig.site_domain}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
