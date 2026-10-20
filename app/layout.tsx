import type { Metadata } from "next";
import { Barlow, Barlow_Semi_Condensed, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsAppFab } from "@/components/site/whatsapp-button";
import { Toaster } from "@/components/ui/toaster";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/site/json-ld";

const barlow = Barlow({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const barlowSc = Barlow_Semi_Condensed({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow-sc",
  weight: ["600"],
});

// Fuente variable: un solo archivo cubre 400–700.
const source = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "AG Supply — Convertidora de papel y fábrica de papel higiénico en República Dominicana",
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "Manufactura de papel e higiene institucional",
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "es_DO",
    type: "website",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.slogan}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/images/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Favicons auto-detected from app/icon.png + app/apple-icon.png.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es-DO"
      className={`${barlow.variable} ${barlowSc.variable} ${source.variable}`}
    >
      <body>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-brand-blue focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <WhatsAppFab />
        <Toaster />
      </body>
    </html>
  );
}
