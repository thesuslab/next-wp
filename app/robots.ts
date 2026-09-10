import { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/revalidate"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Applebot",
          "Googlebot",
          "Bingbot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${siteConfig.site_domain}/sitemap.xml`,
    host: siteConfig.site_domain,
  };
}
