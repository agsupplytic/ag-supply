import type { Metadata } from "next";
import { getProducts } from "@/lib/content";
import { ProductPage, productMetadata } from "@/components/pages/product";
import { catFromSlug, catSlug } from "@/lib/i18n/routes";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ categoria: catSlug("es", p.category), slug: p.slug }));
}

type Params = Promise<{ categoria: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { categoria, slug } = await params;
  return productMetadata("es", catFromSlug("es", categoria), slug);
}

export default async function Page({ params }: { params: Params }) {
  const { categoria, slug } = await params;
  return <ProductPage lang="es" cat={catFromSlug("es", categoria)} slug={slug} />;
}
