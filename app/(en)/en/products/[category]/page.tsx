import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/content";
import { publishedCollections } from "@/lib/collections";
import { CategoryPage, CollectionPage, categoryMetadata, collectionMetadata } from "@/components/pages/catalog";
import { catFromSlug, catSlug, collectionFromSlug, collectionSlug } from "@/lib/i18n/routes";

// /productos/<slug>/ es una categoría o una colección (tipo de producto): slugs distintos.
export async function generateStaticParams() {
  const [cats, products] = await Promise.all([getCategories(), getProducts()]);
  return [
    ...cats.map((c) => ({ category: catSlug("en", c.slug) })),
    ...publishedCollections(products).map((x) => ({ category: collectionSlug("en", x.collection.id) })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const col = collectionFromSlug("en", category);
  return col ? collectionMetadata("en", col) : categoryMetadata("en", catFromSlug("en", category));
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const col = collectionFromSlug("en", category);
  return col ? <CollectionPage lang="en" id={col} /> : <CategoryPage lang="en" slug={catFromSlug("en", category)} />;
}
