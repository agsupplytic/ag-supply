import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  getCategories,
  getCategory,
  getProducts,
  getBrands,
} from "@/lib/content";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { BreadcrumbJsonLd } from "@/components/site/json-ld";
import { Catalog } from "@/components/site/catalog";
import { ogFor } from "@/lib/seo";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const category = await getCategory(categoria);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/productos/${category.slug}` },
    openGraph: ogFor(`${category.name} — AG Supply`, category.short),
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const [category, categories, brands] = await Promise.all([
    getCategory(categoria),
    getCategories(),
    getBrands(),
  ]);
  if (!category) notFound();

  const products = await getProducts({ category: categoria });

  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          ["Catálogo", "/productos"],
          [category.name, `/productos/${category.slug}`],
        ]}
      />
      <PageHero
        image={{
          src: "/images/placeholders/section-manufactura.webp",
          alt: "Producto terminado y empacado en la planta de AG Supply",
        }}
        breadcrumb={
          <span className="flex items-center gap-1.5">
            <Link href="/productos" className="hover:text-white">
              Catálogo
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-white">{category.name}</span>
          </span>
        }
        title={category.name}
        lead={category.description}
        meta={`${products.length} ${
          products.length === 1 ? "producto" : "productos"
        } en esta categoría`}
      />

      <Container className="py-12">
        <Suspense fallback={<div className="py-20 text-center text-muted">Cargando…</div>}>
          <Catalog
            products={products}
            categories={categories}
            brands={brands}
            lockedCategory={categoria}
          />
        </Suspense>
      </Container>
    </>
  );
}
