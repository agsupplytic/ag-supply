import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { getLocale } from "@/lib/i18n";
import { QuoteProvider } from "@/lib/quote/context";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsAppFab } from "@/components/site/whatsapp-button";
import { Toaster } from "@/components/ui/toaster";
import { ProtectImages } from "@/components/site/protect-images";
import { OrganizationJsonLd } from "@/components/site/json-ld";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "convertidora de papel",
    "papel higiénico institucional",
    "servilletas",
    "toallas de papel",
    "Ocean Breeze",
    "Bonche",
    "Santiago",
    "República Dominicana",
    "HORECA",
    "desechables",
  ],
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  alternates: { canonical: "/" },
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html
      lang={locale === "en" ? "en" : "es-DO"}
      className={`${montserrat.variable} ${inter.variable}`}
    >
      <body>
        <OrganizationJsonLd />
        <QuoteProvider>
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand-blue focus:px-4 focus:py-2 focus:text-white"
          >
            Saltar al contenido
          </a>
          <SiteHeader locale={locale} />
          <main id="contenido">{children}</main>
          <SiteFooter locale={locale} />
          <WhatsAppFab />
          <Toaster />
          <ProtectImages />
        </QuoteProvider>
      </body>
    </html>
  );
}
