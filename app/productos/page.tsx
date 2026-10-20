import { getCategories, getProducts, getBrands } from "@/lib/content";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { Catalog } from "@/components/site/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Catálogo de papel higiénico, servilletas y toallas",
  description:
    "Catálogo de AG Supply: papel higiénico, toallas, servilletas, interfoliados, papel facial, jabón y desechables con SKU y presentación. Cotización por WhatsApp.",
  path: "/productos",
  image: {
    url: "/images/fotos/planta-5.webp",
    alt: "Producto terminado en cajas, listo para despacho",
  },
});

export default async function ProductosPage() {
  const [categories, products, brands] = await Promise.all([
    getCategories(),
    getProducts(),
    getBrands(),
  ]);

  return (
    <>
      <PageHero
        breadcrumb={[{ name: "Inicio", href: "/" }, { name: "Catálogo" }]}
        title="Catálogo de productos"
        lead={`${products.length} referencias en ${categories.length} categorías. Busque por producto, SKU o presentación y arme su lista de cotización. Los precios se confirman por pedido.`}
        image={{
          src: "/images/fotos/planta-5.webp",
          alt: "Producto terminado en cajas, listo para despacho",
        }}
      />
      <Container className="py-10 md:py-12">
        <Catalog products={products} categories={categories} brands={brands} />
      </Container>
    </>
  );
}
