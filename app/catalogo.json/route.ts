import { getBrands, getCategories, getProducts } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { absUrl } from "@/lib/seo";
import { href } from "@/lib/i18n/routes";
import { translateProductName } from "@/lib/i18n/product-terms";

export const dynamic = "force-static";

/** Catálogo legible por máquina (proveedores, integraciones, IA). Sin precios. */
export async function GET() {
  const [categories, products, brands] = await Promise.all([
    getCategories(),
    getProducts(),
    getBrands(),
  ]);
  const brandName = new Map(brands.map((b) => [b.slug, b.name]));
  const catName = new Map(categories.map((c) => [c.slug, c.name]));
  const body = {
    empresa: siteConfig.legalName,
    sitio: siteConfig.url,
    contacto: {
      whatsapp: siteConfig.phones[0].value,
      correo: siteConfig.email,
    },
    nota: "Sin precios públicos: se confirman por pedido. Cotizar citando SKU y nombre (algunos SKU se repiten entre referencias).",
    productos: products.map((p) => ({
      sku: p.sku ?? null,
      nombre: p.name,
      nameEn: translateProductName(p.name, p.odooId),
      urlEn: absUrl(href("en", { name: "product", cat: p.category, slug: p.slug })),
      marca: p.brand === "generico" ? null : brandName.get(p.brand),
      fabricadoPorAgSupply: p.fabricated,
      categoria: catName.get(p.category) ?? p.category,
      subcategoria: p.subcategory ?? null,
      especificaciones: p.keySpecs,
      imagen: p.images[0] ? `${siteConfig.url}${p.images[0]}` : null,
      url: absUrl(href("es", { name: "product", cat: p.category, slug: p.slug })),
    })),
  };
  return Response.json(body);
}
