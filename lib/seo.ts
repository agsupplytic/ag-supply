import type { Metadata } from "next";
import { siteConfig } from "./site-config";
import type { Product } from "./content/types";

/**
 * Per-page Open Graph block. Without this, subpages inherit the root layout's OG
 * title/description, so a shared card would say "AG Supply — Convertidora de
 * papel" regardless of the page. Pass the page's own title and description.
 */
export function ogFor(
  title: string,
  description: string,
  path?: string,
  image?: string,
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
        url: image ?? "/images/og.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.slogan}`,
      },
    ],
  };
}

/** Recorta a un largo seguro para meta description sin cortar palabras. */
export function clip(text: string, max = 158): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/**
 * Descripción de producto generada SOLO con datos reales (nombre, SKU, marca,
 * categoría, specs). No inventa beneficios ni cifras. Sirve para la meta
 * description, el JSON-LD y el párrafo visible de la ficha.
 */
export function productDescription(
  product: Product,
  categoryName?: string,
  brandName?: string,
): string {
  const sku = product.sku ? ` (SKU ${product.sku})` : "";
  const cat = categoryName ? ` Categoría: ${categoryName}.` : "";
  const brand =
    product.brand !== "generico" && brandName ? ` Marca ${brandName}.` : "";
  const specs = product.keySpecs.length ? ` ${product.keySpecs.join(", ")}.` : "";
  return (
    `${product.name}${sku}.${cat}${brand}${specs} Fabricado por AG Supply, convertidora de papel en Santiago, República Dominicana. Cotiza por WhatsApp citando el SKU.`
  );
}
