import type { Metadata } from "next";
import { Geist_Mono, Anton, Oswald, Black_Ops_One } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "sonner";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StickyQuoteCTA } from "@/components/layout/sticky-quote-cta";
import { PublicOnly } from "@/components/layout/public-only";
import { siteConfig } from "@/lib/site-config";
import { JsonLd } from "@/components/seo/json-ld";
import { localBusinessLd, websiteLd } from "@/lib/structured-data";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-condensed",
  subsets: ["latin"],
  display: "swap",
});

const blackOpsOne = Black_Ops_One({
  variable: "--font-wordmark",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Construction",
  formatDetection: { telephone: true, address: true, email: true },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/og.png"],
  },
  // Set GOOGLE_SITE_VERIFICATION in the environment to emit the Search Console
  // verification meta tag (an alternative to the DNS/HTML-file methods).
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${anton.variable} ${oswald.variable} ${blackOpsOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd data={[localBusinessLd(), websiteLd()]} />
        <PublicOnly>
          <SiteHeader />
        </PublicOnly>
        <main className="flex-1">{children}</main>
        <PublicOnly>
          <SiteFooter />
          <StickyQuoteCTA />
        </PublicOnly>
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={5000}
          toastOptions={{
            classNames: {
              toast: "border border-border shadow-lg",
            },
          }}
        />
        <PublicOnly>
          <Script
            src="https://code.tidio.co/mh2pduhxcmulgbrnjvdcko7bmf3kg2ee.js"
            strategy="afterInteractive"
          />
          <GoogleAnalytics gaId="G-2DLKX3736H" />
        </PublicOnly>
      </body>
    </html>
  );
}
