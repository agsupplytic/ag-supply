import type { Metadata } from "next";
import { siteConfig } from "./site-config";
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
  alt: `${siteConfig.name} — ${siteConfig.slogan}`,
};

/**
 * Metadatos completos de una página: título, descripción, canónico, Open Graph y
 * Twitter coherentes entre sí. `title` es el título propio SIN el sufijo de
 * marca (la plantilla del layout añade " — AG Supply"); con `absolute` se usa tal
 * cual. Descripciones de 120–160 caracteres.
 */
export function pageMetadata({
  title,
  absolute = false,
  description,
  path,
  image,
  noindex = false,
}: {
  title: string;
  absolute?: boolean;
  description: string;
  path: string;
  /** Imagen propia de la página; sin ella se usa la imagen de marca. */
  image?: { url: string; alt: string };
  noindex?: boolean;
}): Metadata {
  const fullTitle = absolute ? title : `${title} — ${siteConfig.name}`;
  const og = image ? { url: image.url, alt: image.alt } : DEFAULT_OG;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: absUrl(path) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      url: absUrl(path),
      siteName: siteConfig.name,
      locale: "es_DO",
      type: "website",
      images: [og],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [og.url],
    },
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
 * especificaciones). No inventa beneficios ni cifras. "Fabricado" únicamente si el
 * producto está marcado `fabricated` en los datos (papel tissue).
 */
export function productDescription(
  product: Product,
  categoryName?: string,
  brandName?: string,
): string {
  const parts = [`${product.name}.`];
  if (categoryName) parts.push(`${categoryName}.`);
  if (product.brand !== "generico" && brandName) parts.push(`Marca ${brandName}.`);
  if (product.keySpecs.length) parts.push(`${product.keySpecs.join(", ")}.`);
  parts.push(
    product.fabricated
      ? "Fabricado por AG Supply en Santiago, República Dominicana."
      : "Suministrado por AG Supply, Santiago, República Dominicana.",
  );
  parts.push("Cotización por WhatsApp.");
  return parts.join(" ");
}
