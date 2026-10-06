import { getCategories, getProducts } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

/** Catálogo legible por máquina (proveedores, integraciones, IA). Sin precios. */
export async function GET() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);
  const catName = new Map(categories.map((c) => [c.slug, c.name]));
  const body = {
    empresa: siteConfig.legalName,
    sitio: siteConfig.url,
    contacto: {
      whatsapp: siteConfig.phones[0].value,
      correo: siteConfig.email,
    },
    nota: "Sin precios públicos. Cotizar citando el SKU.",
    productos: products.map((p) => ({
      sku: p.sku ?? null,
      nombre: p.name,
      marca: p.brand,
      categoria: catName.get(p.category) ?? p.category,
      subcategoria: p.subcategory ?? null,
      especificaciones: p.keySpecs,
      imagen: p.images[0] ? `${siteConfig.url}${p.images[0]}` : null,
      url: `${siteConfig.url}/productos/${p.category}/${p.slug}`,
    })),
  };
  return Response.json(body);
}
