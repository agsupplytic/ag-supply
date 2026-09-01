import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getProducts, getBrands } from "@/lib/content";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { OperationalInfo } from "@/components/site/operational-info";
import { Catalog } from "@/components/site/catalog";
import { ogFor } from "@/lib/seo";

const CATALOGO_DESC =
  "Papel higiénico, toallas, servilletas, faciales, interfoliados, jabón y desechables fabricados por AG Supply. Filtra por categoría, marca y especificación. Sin precios públicos.";

export const metadata: Metadata = {
  title: "Catálogo de productos",
  description: CATALOGO_DESC,
  alternates: { canonical: "/productos" },
  openGraph: ogFor("Catálogo de productos — AG Supply", CATALOGO_DESC),
};

export default async function ProductosPage() {
  const [categories, products, brands] = await Promise.all([
    getCategories(),
    getProducts(),
    getBrands(),
  ]);

  return (
    <>
      <PageHero
        image={{
          src: "/images/placeholders/hero-2.webp",
          alt: "Bobinas de papel entrando a la línea de conversión de AG Supply",
        }}
        title="Catálogo de productos AG Supply"
        lead={
          <>
            {products.length} productos terminados fabricados en planta, en{" "}
            {categories.length} categorías. Añade lo que necesites a tu cotización
            y envíala por WhatsApp. Los precios se confirman por pedido.
          </>
        }
      />

      <OperationalInfo />

      <Container className="py-12">
        <Suspense fallback={<div className="py-20 text-center text-muted">Cargando catálogo…</div>}>
          <Catalog products={products} categories={categories} brands={brands} />
        </Suspense>
      </Container>
    </>
  );
}
