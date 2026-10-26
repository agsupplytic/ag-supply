import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/content";
import { publishedCollections } from "@/lib/collections";
import { CategoryPage, CollectionPage, categoryMetadata, collectionMetadata } from "@/components/pages/catalog";
import { catFromSlug, catSlug, collectionFromSlug, collectionSlug } from "@/lib/i18n/routes";

// /productos/<slug>/ es una categoría o una colección (tipo de producto): slugs distintos.
export async function generateStaticParams() {
  const [cats, products] = await Promise.all([getCategories(), getProducts()]);
  return [
    ...cats.map((c) => ({ categoria: catSlug("es", c.slug) })),
    ...publishedCollections(products).map((x) => ({ categoria: collectionSlug("es", x.collection.id) })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ categoria: string }> }): Promise<Metadata> {
  const { categoria } = await params;
  const col = collectionFromSlug("es", categoria);
  return col ? collectionMetadata("es", col) : categoryMetadata("es", catFromSlug("es", categoria));
}

export default async function Page({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const col = collectionFromSlug("es", categoria);
  return col ? <CollectionPage lang="es" id={col} /> : <CategoryPage lang="es" slug={catFromSlug("es", categoria)} />;
}
