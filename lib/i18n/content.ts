import en from "@/content/en.json";
import type { Brand, Category, Product } from "@/lib/content/types";
import { translateKeySpec, translateProductName, translateValue } from "./product-terms";
import type { Lang } from "./routes";

// Versión localizada del contenido. Los datos viven en español (Odoo); en inglés se
// sustituyen textos con content/en.json y el glosario de lib/i18n/product-terms.ts.
// Los identificadores (slug, odooId, SKU, valores de especificaciones) no cambian.

type CatEn = { name: string; short: string; description: string };
type BrandEn = { short: string; description: string; audience?: string[] };

export function localizeCategory(c: Category, lang: Lang): Category {
  if (lang === "es") return c;
  const t = (en.categories as Record<string, CatEn>)[c.slug];
  return {
    ...c,
    ...(t ?? {}),
    subcategories: c.subcategories?.map(subcategoryLabel(lang)),
  };
}

export function localizeBrand(b: Brand, lang: Lang): Brand {
  if (lang === "es") return b;
  const t = (en.brands as Record<string, BrandEn>)[b.slug];
  return t ? { ...b, name: b.slug === "generico" ? "Generic" : b.name, short: t.short, description: t.description } : b;
}

export const brandAudience = (slug: string, lang: Lang, fallback: string[]): string[] =>
  lang === "en" ? ((en.brands as Record<string, BrandEn>)[slug]?.audience ?? fallback) : fallback;

export const subcategoryLabel = (lang: Lang) => (s: string): string =>
  lang === "es" ? s : ((en.subcategories as Record<string, string>)[s] ?? translateValue(s));

export function localizeProduct(p: Product, lang: Lang): Product {
  if (lang === "es") return p;
  return {
    ...p,
    name: translateProductName(p.name, p.odooId),
    subcategory: p.subcategory ? subcategoryLabel(lang)(p.subcategory) : undefined,
    keySpecs: p.keySpecs.map(translateKeySpec),
  };
}

/** Valor de especificación (color, doblez…) para mostrar. */
export const specValue = (v: string, lang: Lang): string => (lang === "es" ? v : translateValue(v));
