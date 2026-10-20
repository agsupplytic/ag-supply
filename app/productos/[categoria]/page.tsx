import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategory, getProducts, getBrands } from "@/lib/content";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { BreadcrumbJsonLd, CollectionJsonLd } from "@/components/site/json-ld";
import { Catalog } from "@/components/site/catalog";
import { CATEGORY_PHOTOS } from "@/lib/photos";
import { clip, pageMetadata } from "@/lib/seo";

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
  const photo = CATEGORY_PHOTOS[category.slug];
  return pageMetadata({
    title: `${category.name}: catálogo y presentaciones`,
    description: clip(
      `${category.description} ${category.fabricated ? "Fabricado" : "Suministrado"} por AG Supply, Santiago, RD. Cotización por WhatsApp.`,
    ),
    path: `/productos/${category.slug}`,
    image: photo ? { url: photo.src, alt: photo.alt } : undefined,
  });
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
  const photo = CATEGORY_PHOTOS[category.slug];

  return (
    <>
      <CollectionJsonLd category={category} products={products} />
      <BreadcrumbJsonLd
        trail={[
          ["Catálogo", "/productos"],
          [category.name, `/productos/${category.slug}`],
        ]}
      />
      <PageHero
        breadcrumb={[
          { name: "Inicio", href: "/" },
          { name: "Catálogo", href: "/productos" },
          { name: category.name },
        ]}
        title={category.name}
        lead={category.short}
        meta={`${products.length} ${products.length === 1 ? "producto" : "productos"} · ${
          category.fabricated ? "Fabricado en la planta de AG Supply" : "Suministrado por AG Supply"
        }`}
        image={photo}
      />
      <Container className="pt-10 md:pt-12">
        <p className="max-w-3xl text-lg text-body">{category.description}</p>
      </Container>
      <Container className="py-10 md:py-12">
        <Catalog
          products={products}
          categories={categories}
          brands={brands}
          lockedCategory={categoria}
        />
      </Container>
    </>
  );
}
