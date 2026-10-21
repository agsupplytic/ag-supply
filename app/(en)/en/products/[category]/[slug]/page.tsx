import type { Metadata } from "next";
import { getProducts } from "@/lib/content";
import { ProductPage, productMetadata } from "@/components/pages/product";
import { catFromSlug, catSlug } from "@/lib/i18n/routes";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ category: catSlug("en", p.category), slug: p.slug }));
}

type Params = Promise<{ category: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, slug } = await params;
  return productMetadata("en", catFromSlug("en", category), slug);
}

export default async function Page({ params }: { params: Params }) {
  const { category, slug } = await params;
  return <ProductPage lang="en" cat={catFromSlug("en", category)} slug={slug} />;
}
