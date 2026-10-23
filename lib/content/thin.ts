import type { Product } from "./types";

/**
 * Ficha «delgada»: sin foto propia y sin ningún dato técnico aparte del formato de
 * presentación. Su contenido es casi el mismo nombre repetido, así que no se indexa
 * (noindex, fuera del sitemap) hasta que tenga foto o datos; el resto del sitio la sigue
 * enlazando. Regla documentada en docs/GUIA-SEARCH-CONSOLE.md y vigilada por
 * scripts/check-out.mjs (que repite esta misma condición sobre content/products.json).
 */
export function isThinProduct(p: Pick<Product, "images" | "specs">): boolean {
  return p.images.length === 0 && Object.keys(p.specs).every((k) => k === "packFormat");
}
