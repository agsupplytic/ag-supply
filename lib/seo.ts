import type { Metadata } from "next";
import { siteConfig } from "./site-config";

/**
 * Per-page Open Graph block. Without this, subpages inherit the root layout's OG
 * title/description, so a shared card would say "AG Supply — Convertidora de
 * papel" regardless of the page. Pass the page's own title and description.
 */
export function ogFor(
  title: string,
  description: string,
  path?: string,
): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    ...(path ? { url: `${siteConfig.url}${path}` } : {}),
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
  };
}
