import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBrand, getCategory, getProduct, getProducts, getRelatedProducts } from "@/lib/content";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ProductImage } from "@/components/site/product-image";
import { ProductCard } from "@/components/site/product-card";
import { SpecGroups } from "@/components/site/spec-groups";
import { CopySku } from "@/components/site/copy-sku";
import { AddToQuoteButton } from "@/components/site/add-to-quote-button";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { BrandBadge } from "@/components/site/brand-badge";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/site/json-ld";
import { clip, pageMetadata, productDescription } from "@/lib/seo";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ categoria: p.category, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const [category, brand] = await Promise.all([getCategory(product.category), getBrand(product.brand)]);
  return pageMetadata({
    title: clip(product.name, 56),
    description: clip(productDescription(product, category?.name, brand?.name)),
    path: `/productos/${product.category}/${product.slug}`,
    image: product.images[0] ? { url: product.images[0], alt: product.name } : undefined,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ categoria: string; slug: string }>;
}) {
  const { categoria, slug } = await params;
  const product = await getProduct(slug);
  if (!product || product.category !== categoria) notFound();

  const [category, brand, related] = await Promise.all([
    getCategory(product.category),
    getBrand(product.brand),
    getRelatedProducts(product, 4),
  ]);
  const { packFormat } = product.specs;

  return (
    <>
      <ProductJsonLd product={product} category={category} brandName={brand?.name} />
      <BreadcrumbJsonLd
        trail={[
          ["Catálogo", "/productos"],
          [category?.name ?? product.category, `/productos/${product.category}`],
          [product.name, `/productos/${product.category}/${product.slug}`],
        ]}
      />

      <Container className="py-8 md:py-10">
        <Breadcrumbs
          items={[
            { name: "Inicio", href: "/" },
            { name: "Catálogo", href: "/productos" },
            { name: category?.name ?? product.category, href: `/productos/${product.category}` },
            { name: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <ProductImage
              product={product}
              className="border border-border"
              sizes="(max-width: 1024px) 100vw, 560px"
              priority
            />
            {product.images.length > 1 && (
              <ul className="mt-3 grid grid-cols-4 gap-3">
                {product.images.slice(1).map((src, i) => (
                  <li key={src} className="relative aspect-square border border-border bg-white">
                    <Image src={src} alt={`${product.name}, vista ${i + 2}`} fill sizes="120px" className="object-contain p-2" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <BrandBadge brand={product.brand} />
              {product.subcategory && <span className="label text-muted">{product.subcategory}</span>}
            </div>
            <h1 className="mt-3 !text-[clamp(1.75rem,3.4vw,2.5rem)]">{product.name}</h1>

            <table className="spec-table mt-6">
              <tbody>
                <tr>
                  <th scope="row">SKU</th>
                  <td>{product.sku ? <CopySku sku={product.sku} /> : "Por confirmar con atención comercial"}</td>
                </tr>
                {packFormat && <tr><th scope="row">Presentación</th><td>{packFormat}</td></tr>}
                {product.keySpecs
                  .filter((k) => !k.startsWith("Presentación"))
                  .map((k) => (
                    <tr key={k}><th scope="row">Detalle</th><td>{k}</td></tr>
                  ))}
                <tr>
                  <th scope="row">Origen</th>
                  <td>
                    {product.fabricated
                      ? "Fabricado por AG Supply en Las Palomas, Santiago"
                      : "Suministrado por AG Supply"}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-8 border-t-2 border-ink pt-6">
              <AddToQuoteButton product={product} layout="detail" />
              <p className="mt-3 text-sm text-muted">
                Sin precio en línea: el precio y la disponibilidad se confirman por pedido.
              </p>
              <div className="mt-4">
                <WhatsAppButton
                  size="sm"
                  message={`Hola, quisiera información sobre: ${product.name}${product.sku ? ` (SKU ${product.sku})` : ""}`}
                >
                  Consultar este producto por WhatsApp
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Section tone="surface">
        <h2 className="rule-red">Especificaciones técnicas</h2>
        <p className="mt-3 max-w-2xl text-body">
          Datos de {category?.name?.toLowerCase() ?? "este producto"} registrados en catálogo. Lo que no aparece se confirma por pedido.
        </p>
        <div className="mt-8">
          <SpecGroups specs={product.specs} />
        </div>
      </Section>

      {related.length > 0 && (
        <Section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="rule-red">Productos relacionados</h2>
            <Link href={`/productos/${product.category}`} className="link font-semibold">
              Ver toda la categoría
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </Section>
      )}
    </>
  );
}
