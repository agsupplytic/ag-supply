import type { Metadata } from "next";
import { getCategories } from "@/lib/content";
import { CategoryPage, categoryMetadata } from "@/components/pages/catalog";
import { catFromSlug, catSlug } from "@/lib/i18n/routes";

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ categoria: catSlug("es", c.slug) }));
}

export async function generateMetadata({ params }: { params: Promise<{ categoria: string }> }): Promise<Metadata> {
  const { categoria } = await params;
  return categoryMetadata("es", catFromSlug("es", categoria));
}

export default async function Page({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  return <CategoryPage lang="es" slug={catFromSlug("es", categoria)} />;
}
