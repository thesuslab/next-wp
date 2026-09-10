import { siteConfig } from "@/site.config";
import type { Metadata } from "next";

export interface ContentMetadataOptions {
  title: string;
  description: string;
  slug: string;
  basePath: "posts" | "pages";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  image?: string;
  keywords?: string[];
}

export function generateContentMetadata({
  title,
  description,
  slug,
  basePath,
  publishedTime,
  modifiedTime,
  author,
  image,
  keywords,
}: ContentMetadataOptions): Metadata {
  const pageUrl = `${siteConfig.site_domain}/${basePath}/${slug}`;
  let ogImageUrl = image;

  if (!ogImageUrl) {
    const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
    ogUrl.searchParams.append("title", title);
    ogUrl.searchParams.append("description", description);
    ogImageUrl = ogUrl.toString();
  }

  return {
    title,
    description,
    keywords: keywords || [
      "Sustainability Lab",
      "Environmental Intelligence",
      "Climate Resilience",
      "Field Research",
      "Infrastructure Safeguards",
    ],
    authors: [{ name: author || "Sustainability Lab Researcher", url: siteConfig.site_domain }],
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      type: basePath === "posts" ? "article" : "website",
      url: pageUrl,
      siteName: "Sustainability Lab",
      locale: "en_US",
      publishedTime: publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: author ? [author] : ["Sustainability Lab"],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
      creator: "@suslab",
    },
  };
}

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  image = "/logo.png",
}: PageMetadataOptions): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${siteConfig.site_domain}${cleanPath}`;
  const fullImageUrl = image.startsWith("http")
    ? image
    : `${siteConfig.site_domain}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title,
    description,
    keywords: keywords || [
      "Sustainability Lab",
      "Environmental Intelligence",
      "Climate Risk",
      "Resilient Infrastructure",
      "Himalayas",
      "Nepal",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `${title} | Sustainability Lab`,
      description,
      url: canonicalUrl,
      siteName: "Sustainability Lab",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: fullImageUrl,
          width: 1198,
          height: 542,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Sustainability Lab`,
      description,
      images: [fullImageUrl],
      creator: "@suslab",
    },
  };
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function truncateHtml(html: string, maxWords: number): string {
  const text = html.replace(/<[^>]*>/g, "").trim();
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
