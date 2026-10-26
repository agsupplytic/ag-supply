import type { Metadata } from "next";
import { siteConfig } from "./site-config";
import { textFor } from "./i18n/site-text";
import { OG_LOCALE, href, type Lang, type Route } from "./i18n/routes";
import type { Product } from "./content/types";

/** URL absoluta con barra final, igual que el canónico y lo que sirve el hosting. */
export function absUrl(path = "/"): string {
  const clean = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}/`;
  return `${siteConfig.url}${clean}`;
}

const DEFAULT_OG = {
  url: "/images/og.png",
  width: 1200,
  height: 630,
};

const isPreview = Boolean(process.env.NEXT_PUBLIC_PREVIEW);

/** Metadatos base de cada raíz (idioma): título por defecto, plantilla, OG, Twitter y robots. */
export function rootMetadata(lang: Lang): Metadata {
  const t = textFor(lang);
  const title =
    lang === "es"
      ? "AG Supply — Convertidora de papel en Santiago, RD"
      : "AG Supply — Paper converter, Dominican Republic";
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s — ${siteConfig.name}` },
    description: t.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.legalName }],
    creator: siteConfig.legalName,
    publisher: siteConfig.legalName,
    openGraph: {
      title,
      description: t.description,
      siteName: siteConfig.name,
      locale: OG_LOCALE[lang],
      type: "website",
      images: [{ ...DEFAULT_OG, alt: `${siteConfig.name} — ${t.slogan}` }],
    },
    twitter: { card: "summary_large_image", title, description: t.description, images: [DEFAULT_OG.url] },
    robots: isPreview
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  };
}

/** `alternates` con canónico propio y hreflang recíproco (es-DO, en, x-default). */
export function alternatesFor(lang: Lang, route: Route): NonNullable<Metadata["alternates"]> {
  return {
    canonical: absUrl(href(lang, route)),
    languages: {
      "es-DO": absUrl(href("es", route)),
      en: absUrl(href("en", route)),
      "x-default": absUrl(href("es", route)),
    },
  };
}

/**
 * Metadatos completos de una página: título, descripción, canónico, hreflang, Open
 * Graph y Twitter coherentes entre sí. `title` es el título propio SIN el sufijo de
 * marca (la plantilla lo añade); con `absolute` se usa tal cual.
 */
export function pageMetadata({
  lang,
  route,
  title,
  absolute = false,
  description,
  image,
  noindex = false,
}: {
  lang: Lang;
  route: Route;
  title: string;
  absolute?: boolean;
  description: string;
  image?: { url: string; alt: string };
  noindex?: boolean;
}): Metadata {
  const fullTitle = absolute ? title : `${title} — ${siteConfig.name}`;
  const og = image ? { url: image.url, alt: image.alt } : { ...DEFAULT_OG, alt: `${siteConfig.name} — ${textFor(lang).slogan}` };
  const url = absUrl(href(lang, route));
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: alternatesFor(lang, route),
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: OG_LOCALE[lang],
      type: "website",
      images: [og],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [og.url] },
  };
}

/** Recorta a un largo seguro para meta description sin cortar palabras. */
export function clip(text: string, max = 158): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/**
 * Descripción de producto generada SOLO con datos reales (nombre, marca, categoría,
 * especificaciones). No inventa beneficios ni cifras. «Fabricado» únicamente si el
 * producto está marcado `fabricated` (papel tissue). El producto llega ya localizado.
 */
export function productDescription(
  product: Product,
  categoryName: string | undefined,
  brandName: string | undefined,
  lang: Lang,
): string {
  const es = lang === "es";
  const parts = [`${product.name}.`];
  if (categoryName) parts.push(`${categoryName}.`);
  if (product.brand !== "generico" && brandName) parts.push(es ? `Marca ${brandName}.` : `${brandName} brand.`);
  if (product.keySpecs.length) parts.push(`${product.keySpecs.join(", ")}.`);
  parts.push(
    product.fabricated
      ? es ? "Fabricado por AG Supply en Santiago, República Dominicana." : "Manufactured by AG Supply in Santiago, Dominican Republic."
      : es ? "Suministrado por AG Supply, Santiago, República Dominicana." : "Supplied by AG Supply, Santiago, Dominican Republic.",
  );
  parts.push(es ? "Cotización por WhatsApp o correo." : "Quote via WhatsApp or email.");
  // Descripciones cortas: se completa con información que aplica a todas las fichas (sin cifras ni promesas).
  if (parts.join(" ").length < 125) parts.push(es ? "Consulte presentaciones y disponibilidad." : "Ask about pack sizes and availability.");
  return parts.join(" ");
}
