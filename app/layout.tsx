import "./globals.css";

import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";
import { LabLensProvider } from "@/components/lens/LabLensContext";
import { LabLensHUD } from "@/components/lens/LabLensHUD";

import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import Script from "next/script";

import type { Metadata } from "next";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sustainability Lab — Intelligence for a living planet",
    template: "%s | Sustainability Lab",
  },
  description:
    "Research. Experiment. Collaborate. Build. Environmental intelligence, climate risk adaptation, resilient infrastructure engineering, circular craftsmanship (KĀRVA), and enterprise incubation in the Himalayas.",
  keywords: [
    "Sustainability Lab",
    "Environmental Intelligence",
    "Climate Risk Scanner",
    "Climate Adaptation",
    "Resilient Infrastructure",
    "Green Infrastructure",
    "Disaster Risk Reduction",
    "KĀRVA",
    "Circular Craftsmanship",
    "Reclaimed Materials",
    "AI Advisory Engine",
    "Spatial GIS Remote Sensing",
    "Nepal Climate Resilience",
    "Kathmandu Valley",
    "Maharajgunj Research Station",
    "Himalayan Watershed Hydrology",
    "EIA IEE Safeguards",
  ],
  authors: [{ name: "Sustainability Lab Directorate", url: siteConfig.site_domain }],
  creator: "The Sustainability Lab",
  publisher: "The Sustainability Lab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "./",
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
    title: "Sustainability Lab — Intelligence for a living planet",
    description:
      "Research. Experiment. Collaborate. Build. Environmental intelligence, climate engineering, circular craftsmanship, and resilient enterprise.",
    url: siteConfig.site_domain,
    siteName: "Sustainability Lab",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1198,
        height: 542,
        alt: "The Sustainability Lab — Intelligence for a living planet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sustainability Lab — Intelligence for a living planet",
    description:
      "Environmental intelligence, technology, enterprise and people working together to build systems that can last.",
    images: ["/logo.png"],
    creator: "@suslab",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  category: "Environment, Science & Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H1PNLS2RMQ"
          strategy="afterInteractive"
        />
        <Script id="google-tag-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H1PNLS2RMQ');
          `}
        </Script>
      </head>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          fontSans.variable,
          fontDisplay.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LabLensProvider>
            <Nav />
            {children}
            <Footer />
            <LabLensHUD />
          </LabLensProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
