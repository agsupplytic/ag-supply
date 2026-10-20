import { siteConfig } from "@/lib/site-config";
import type { BrandSlug } from "@/lib/content/types";

export interface QuoteItem {
  slug: string;
  name: string;
  brand: BrandSlug;
  /** Código interno (referencia de Odoo); lo usa el equipo comercial para cotizar. */
  sku?: string;
  /** Presentación del producto (p. ej. "12/1"): unidad en la que se pide la cantidad. */
  pack?: string;
  qty: number;
  note?: string;
}

const BRAND_LABEL: Record<BrandSlug, string> = {
  "ocean-breeze": "Ocean Breeze",
  bonche: "Bonche",
  generico: "Genérico",
};

/**
 * Largo máximo por mensaje, medido CODIFICADO (lo que viaja en el enlace wa.me): las
 * tildes y la raya inflan el texto ~1,5 veces y los enlaces muy largos fallan.
 */
export const MAX_ENCODED_CHARS = 3800;
const enc = (t: string) => encodeURIComponent(t).length;

function lineFor(item: QuoteItem): string[] {
  const brand =
    item.brand && item.brand !== "generico" ? ` (${BRAND_LABEL[item.brand]})` : "";
  const sku = item.sku ? `[SKU ${item.sku}] ` : "";
  const pack = item.pack ? ` (presentación ${item.pack})` : "";
  const out = [`- ${sku}${item.name}${brand} — Cantidad: ${item.qty}${pack}`];
  if (item.note?.trim()) out.push(`  Nota: ${item.note.trim()}`);
  return out;
}

/**
 * Mensaje de WhatsApp en texto plano:
 *
 *   Hola, quisiera cotizar los siguientes productos de AG Supply:
 *   - [SKU X] [Nombre] — Cantidad: [N] (presentación 12/1)
 *     Nota: ...
 *   Gracias.
 */
export function buildWhatsAppMessage(items: QuoteItem[]): string {
  return [siteConfig.whatsapp.quoteIntro, ...items.flatMap(lineFor), siteConfig.whatsapp.quoteOutro].join("\n");
}

/**
 * Igual que `buildWhatsAppMessage`, pero reparte la lista en varios mensajes si
 * excede MAX_ENCODED_CHARS. Cada parte empieza con la introducción y, si hay más
 * de una, lleva "(parte i de n)".
 */
export function buildWhatsAppMessages(items: QuoteItem[]): string[] {
  const whole = buildWhatsAppMessage(items);
  if (enc(whole) <= MAX_ENCODED_CHARS) return [whole];

  const budget = MAX_ENCODED_CHARS - enc(siteConfig.whatsapp.quoteIntro) - enc(siteConfig.whatsapp.quoteOutro) - 120;
  const groups: string[][] = [[]];
  let size = 0;
  for (const item of items) {
    const block = lineFor(item);
    const len = enc(block.join("\n") + "\n");
    if (size + len > budget && groups[groups.length - 1].length) {
      groups.push([]);
      size = 0;
    }
    groups[groups.length - 1].push(...block);
    size += len;
  }
  return groups.map((g, i) =>
    [`${siteConfig.whatsapp.quoteIntro} (parte ${i + 1} de ${groups.length})`, ...g, siteConfig.whatsapp.quoteOutro].join("\n"),
  );
}
