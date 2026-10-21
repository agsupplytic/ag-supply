import type { Metadata } from "next";
import { getCategories } from "@/lib/content";
import { CategoryPage, categoryMetadata } from "@/components/pages/catalog";
import { catFromSlug, catSlug } from "@/lib/i18n/routes";

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: catSlug("en", c.slug) }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  return categoryMetadata("en", catFromSlug("en", category));
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <CategoryPage lang="en" slug={catFromSlug("en", category)} />;
}
