import { getBrands, getCategories, getProducts } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

/**
 * Versión completa de llms.txt para asistentes de IA: empresa, marcas y el
 * catálogo entero con su SKU y especificaciones. Se genera en cada build a
 * partir de content/*.json, así que nunca queda desactualizado. Sin precios.
 */
export async function GET() {
  const [categories, brands, products] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(),
  ]);
  const base = siteConfig.url;
  const L: string[] = [];

  L.push("# AG Supply — catálogo completo");
  L.push("");
  L.push(
    `> ${siteConfig.legalName} es una convertidora de papel y fábrica de papel higiénico, servilletas, toallas, faciales, interfoliados y desechables en ${siteConfig.address.city}, República Dominicana. Marcas propias: Ocean Breeze (premium, HORECA) y Bonche (económica, consumo masivo). Sitio: ${base}`,
  );
  L.push("");
  L.push("## Cómo cotizar");
  L.push("");
  L.push(
    `Cada producto tiene un SKU (código interno). Cita el SKU al cotizar por WhatsApp (${siteConfig.phones[0].value}) o correo (${siteConfig.email}). No hay precios públicos: se confirman por pedido según formato y volumen. Horario: ${siteConfig.hours.label}`,
  );
  L.push("");
  L.push("## Marcas");
  L.push("");
  for (const b of brands)
    L.push(`- ${b.name}: ${b.short} (${b.count} productos)`);
  L.push("");
  for (const c of categories) {
    const items = products.filter((p) => p.category === c.slug);
    L.push(`## ${c.name} (${items.length})`);
    L.push("");
    L.push(`${c.description} ${base}/productos/${c.slug}`);
    L.push("");
    for (const p of items) {
      const bits = [
        p.sku ? `SKU ${p.sku}` : null,
        p.brand !== "generico" ? p.brand : null,
        p.subcategory ?? null,
        ...p.keySpecs,
      ].filter(Boolean);
      L.push(
        `- [${p.name}](${base}/productos/${p.category}/${p.slug})${bits.length ? " — " + bits.join(" · ") : ""}`,
      );
    }
    L.push("");
  }
  return new Response(L.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
