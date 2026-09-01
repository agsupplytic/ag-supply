import { siteConfig } from "@/lib/site-config";
import type { BrandSlug } from "@/lib/content/types";

export interface QuoteItem {
  slug: string;
  name: string;
  brand: BrandSlug;
  qty: number;
  note?: string;
}

const BRAND_LABEL: Record<BrandSlug, string> = {
  "ocean-breeze": "Ocean Breeze",
  bonche: "Bonche",
  generico: "Genérico",
};

/**
 * Plain-text WhatsApp message for a quote request. Format is fixed by the spec:
 *
 *   Hola, quisiera cotizar los siguientes productos de AG Supply:
 *   - [Nombre] — Cantidad: [X]
 *     Nota: ...
 *   Gracias.
 */
export function buildWhatsAppMessage(items: QuoteItem[]): string {
  const lines: string[] = [siteConfig.whatsapp.quoteIntro];
  for (const item of items) {
    const brand =
      item.brand && item.brand !== "generico"
        ? ` (${BRAND_LABEL[item.brand]})`
        : "";
    lines.push(`- ${item.name}${brand} — Cantidad: ${item.qty}`);
    if (item.note?.trim()) lines.push(`  Nota: ${item.note.trim()}`);
  }
  lines.push(siteConfig.whatsapp.quoteOutro);
  return lines.join("\n");
}
