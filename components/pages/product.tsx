import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Factory, Truck } from "lucide-react";
import { getBrand, getCategories, getProduct, getRelatedProducts } from "@/lib/content";
import { localizeBrand, localizeCategory, localizeProduct } from "@/lib/i18n/content";
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
import { textFor } from "@/lib/i18n/site-text";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { clip, pageMetadata, productDescription } from "@/lib/seo";

export async function productMetadata(lang: Lang, cat: string, slug: string) {
  const raw = await getProduct(slug);
  if (!raw || raw.category !== cat) return {};
  const [category, brand] = await Promise.all([
    getCategories().then((l) => l.find((x) => x.slug === raw.category)),
    getBrand(raw.brand),
  ]);
  const product = localizeProduct(raw, lang);
  return pageMetadata({
    lang,
    route: { name: "product", cat, slug },
    title: clip(product.name, 56),
    description: clip(
      productDescription(product, category ? localizeCategory(category, lang).name : undefined, brand ? localizeBrand(brand, lang).name : undefined, lang),
    ),
    image: product.images[0] ? { url: product.images[0], alt: product.name } : undefined,
  });
}

export async function ProductPage({ lang, cat, slug }: { lang: Lang; cat: string; slug: string }) {
  const t = ui(lang);
  const raw = await getProduct(slug);
  if (!raw || raw.category !== cat) notFound();

  const [cats, brandRaw, relatedRaw] = await Promise.all([getCategories(), getBrand(raw.brand), getRelatedProducts(raw, 4)]);
  const categories = cats.map((x) => localizeCategory(x, lang));
  const category = categories.find((x) => x.slug === raw.category);
  const iconOf = new Map(categories.map((x) => [x.slug, x.icon]));
  const brand = brandRaw ? localizeBrand(brandRaw, lang) : undefined;
  const product = localizeProduct(raw, lang);
  const related = relatedRaw.map((p) => localizeProduct(p, lang));
  const { packFormat } = product.specs;
  const catalogName = lang === "es" ? "Catálogo" : "Catalog";
  const icon = iconOf.get(product.category) ?? "";

  return (
    <>
      <ProductJsonLd product={product} category={category} brandName={brand?.name} lang={lang} />
      <BreadcrumbJsonLd
        trail={[
          [catalogName, href(lang, { name: "products" })],
          [category?.name ?? product.category, href(lang, { name: "category", cat: product.category })],
          [product.name, href(lang, { name: "product", cat: product.category, slug: product.slug })],
        ]}
      />

      <Container className="py-8 md:py-10">
        <Breadcrumbs
          label={t.nav.breadcrumb}
          items={[
            { name: t.home, href: href(lang, { name: "home" }) },
            { name: catalogName, href: href(lang, { name: "products" }) },
            { name: category?.name ?? product.category, href: href(lang, { name: "category", cat: product.category }) },
            { name: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <ProductImage
              product={product}
              icon={icon}
              soonLabel={t.product.photoPending}
              className="rounded-xl border border-border"
              sizes="(max-width: 1024px) 100vw, 560px"
              priority
            />
            {product.images.length > 1 && (
              <ul className="mt-3 grid grid-cols-4 gap-3">
                {product.images.slice(1).map((src, i) => (
                  <li key={src} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-white">
                    <Image src={src} alt={`${product.name}, ${t.product.view(i + 2)}`} fill sizes="120px" className="object-contain p-2" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <BrandBadge brand={product.brand} lang={lang} />
              {product.subcategory && <span className="label text-muted">{product.subcategory}</span>}
            </div>
            <h1 className="mt-3 !text-[clamp(1.625rem,3.2vw,2.375rem)]">{product.name}</h1>

            <table className="spec-table mt-6">
              <tbody>
                <tr>
                  <th scope="row">{t.product.sku}</th>
                  <td>{product.sku ? <CopySku sku={product.sku} lang={lang} /> : t.product.skuPending}</td>
                </tr>
                {packFormat && <tr><th scope="row">{t.product.pack}</th><td>{packFormat}</td></tr>}
                {product.keySpecs
                  .filter((k) => !/^(Presentación|Pack)\b/.test(k))
                  .map((k) => (
                    <tr key={k}><th scope="row">{t.product.detail}</th><td>{k}</td></tr>
                  ))}
                <tr>
                  <th scope="row">{t.origin.label}</th>
                  <td>
                    <span className="inline-flex items-center gap-2">
                      {product.fabricated ? <Factory className="size-4 text-brand-blue" aria-hidden /> : <Truck className="size-4 text-brand-blue" aria-hidden />}
                      {product.fabricated ? t.origin.made : t.origin.supplied}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-8 rounded-xl border border-border bg-brand-blue-50 p-5">
              <AddToQuoteButton product={product} lang={lang} layout="detail" />
              <p className="mt-3 text-sm text-body">{t.product.noPrice}</p>
              <div className="mt-4">
                <WhatsAppButton size="sm" lang={lang} message={textFor(lang).whatsapp.productMessage(product.name, product.sku)}>
                  {t.product.whatsappAsk}
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Section tone="surface">
        <h2 className="rule-red">{t.product.specs}</h2>
        <p className="mt-3 max-w-2xl text-body">{t.product.specsIntro(category?.name?.toLowerCase() ?? "")}</p>
        <div className="mt-8">
          <SpecGroups specs={product.specs} lang={lang} />
        </div>
      </Section>

      {related.length > 0 && (
        <Section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="rule-red">{t.product.related}</h2>
            <Link href={href(lang, { name: "category", cat: product.category })} className="link font-bold">
              {t.product.viewCategory}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} icon={iconOf.get(p.category) ?? ""} lang={lang} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
