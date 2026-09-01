import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Factory,
  SlidersHorizontal,
  Truck,
} from "lucide-react";
import {
  getBrand,
  getCategory,
  getProduct,
  getProducts,
  getRelatedProducts,
} from "@/lib/content";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { ProductImage } from "@/components/site/product-image";
import { ProductCard } from "@/components/site/product-card";
import { SpecGroups } from "@/components/site/spec-groups";
import { AddToQuoteButton } from "@/components/site/add-to-quote-button";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { brandLabel } from "@/components/site/brand-badge";
import { siteConfig } from "@/lib/site-config";

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
  const specLine = product.keySpecs.join(" · ");
  const description =
    `${product.name}${specLine ? ` — ${specLine}` : ""}. Fabricado por AG Supply. ` +
    "Solicita cotización sin compromiso.";
  return {
    title: product.name,
    description,
    alternates: { canonical: `/productos/${product.category}/${product.slug}` },
    openGraph: {
      title: `${product.name} — AG Supply`,
      description,
      images: product.images.length ? [product.images[0]] : undefined,
    },
  };
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

  const trust = [
    {
      icon: Factory,
      title: "Fabricado en planta propia",
      text: "Se produce en nuestra nave de Las Palomas, Santiago. Control de gramaje y formato lote a lote.",
    },
    {
      icon: SlidersHorizontal,
      title: "Formato a tu medida",
      text: "Ajustamos presentación, conteo y empaque al volumen de tu operación.",
    },
    {
      icon: Truck,
      title: "Entrega en el tiempo acordado",
      text: "Cobertura nacional. Confirmamos precio y disponibilidad por pedido.",
    },
  ];

  return (
    <>
      {/* ============================================================ HERO */}
      <section className="relative isolate overflow-hidden bg-brand-gradient text-white">
        <Container className="relative py-10 md:py-14">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm text-white/80">
            <Link href="/productos" className="hover:text-white">
              Catálogo
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              href={`/productos/${product.category}`}
              className="hover:text-white"
            >
              {category?.name ?? product.category}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-white">{product.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/25">
                  {brand?.name ?? brandLabel(product.brand)}
                </span>
                {product.subcategory && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
                    {product.subcategory}
                  </span>
                )}
                {product.sku && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
                    Ref. {product.sku}
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-white">{product.name}</h1>

              {product.keySpecs.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.keySpecs.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-white/15 px-2.5 py-1 text-sm font-semibold text-white ring-1 ring-white/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {product.description && (
                <p className="mt-5 max-w-xl text-lg text-white/90">
                  {product.description}
                </p>
              )}

              {/* action card floats on the band */}
              <div className="mt-8 rounded-2xl bg-white p-6 text-ink shadow-2xl md:p-7">
                <AddToQuoteButton product={product} withQuantity size="lg" />
                <p className="mt-3 text-sm text-muted">
                  Sin precio en línea. Confirmamos precio y disponibilidad por
                  pedido, con entrega en el tiempo acordado.
                </p>
                <div className="mt-4 border-t border-border pt-4">
                  <WhatsAppButton
                    size="sm"
                    message={`Hola, quisiera información sobre: ${product.name}${
                      product.sku ? ` (Ref. ${product.sku})` : ""
                    }`}
                  >
                    Consultar por WhatsApp
                  </WhatsAppButton>
                </div>
              </div>
            </div>

            {/* visual */}
            <div className="lg:pt-2">
              <div className="overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
                <ProductImage
                  product={product}
                  className="aspect-square rounded-2xl"
                  sizes="(max-width: 1024px) 100vw, 460px"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {product.images.slice(1).map((src) => (
                    <div
                      key={src}
                      className="relative aspect-square overflow-hidden rounded-lg bg-white"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={product.name}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================== SPECIFICATIONS */}
      <Section>
        <h2>Especificaciones técnicas</h2>
        <p className="mt-3 max-w-2xl text-body">
          Datos de fábrica para{" "}
          {category?.name?.toLowerCase() ?? "este producto"}. Lo que no aparezca
          aquí lo confirmamos por pedido.
        </p>
        <div className="mt-8">
          <SpecGroups specs={product.specs} />
        </div>
        {product.placeholderImage && (
          <p className="mt-4 text-sm text-muted">
            Foto y ficha en actualización. Para dimensiones completas o una
            muestra física, escríbenos a {siteConfig.email}.
          </p>
        )}
      </Section>

      {/* ================================================= MANUFACTURER STRIP */}
      <div className="bg-brand-blue-50">
        <Container className="grid gap-8 py-12 sm:grid-cols-3">
          {trust.map((t) => (
            <div key={t.title} className="flex gap-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-white shadow-sm">
                <t.icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-heading font-semibold text-ink">{t.title}</p>
                <p className="mt-1 text-sm text-body">{t.text}</p>
              </div>
            </div>
          ))}
        </Container>
      </div>

      {/* =========================================================== RELATED */}
      {related.length > 0 && (
        <Section className="border-t border-border">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2>De la misma categoría</h2>
            <Link
              href={`/productos/${product.category}`}
              className="font-heading text-sm font-semibold text-brand-blue-dark hover:underline"
            >
              Ver toda la categoría
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} categorySlug={p.category} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
