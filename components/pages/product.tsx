import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Factory, Truck } from "lucide-react";
import { getBrand, getCategories, getProduct, getProducts, getRelatedProducts } from "@/lib/content";
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
import { isThinProduct } from "@/lib/content/thin";
import { collectionsOf } from "@/lib/collections";
import { clip, pageMetadata, productDescription } from "@/lib/seo";

const ABOUT = {
  es: {
    title: "Acerca de este producto",
    inCategory: (name: string, cat: string) => `${name} pertenece a la categoría ${cat} de AG Supply.`,
    made: "AG Supply lo fabrica en su planta del sector Las Palomas, en Santiago, República Dominicana.",
    supplied: "AG Supply lo suministra desde Santiago, República Dominicana.",
    pack: (pack: string) => `Se presenta en formato ${pack}, tal como figura en nuestro inventario. Confirme con ventas la unidad de pedido antes de cotizar.`,
    noPack: "Consulte con ventas la presentación disponible antes de cotizar.",
    howTitle: "Cómo cotizar este producto",
    steps: [
      "Añádalo a su lista de cotización con la cantidad que necesita.",
      "Revise la lista y agregue otros productos del catálogo si lo desea.",
      "Envíela por WhatsApp o escríbanos por correo: ventas confirma precio y disponibilidad por pedido.",
    ],
    list: "Ver mi lista de cotización",
    moreOf: "Vea más:",
  },
  en: {
    title: "About this product",
    inCategory: (name: string, cat: string) => `${name} belongs to AG Supply's ${cat} category.`,
    made: "AG Supply manufactures it at its plant in the Las Palomas district of Santiago, Dominican Republic.",
    supplied: "AG Supply supplies it from Santiago, Dominican Republic.",
    pack: (pack: string) => `It is offered in ${pack} format, as listed in our inventory. Confirm the order unit with sales before requesting a quote.`,
    noPack: "Ask sales about the available pack size before requesting a quote.",
    howTitle: "How to request a quote for this product",
    steps: [
      "Add it to your quote list with the quantity you need.",
      "Review the list and add other catalog products if you wish.",
      "Send it via WhatsApp or email us: sales confirms price and availability per order.",
    ],
    list: "View my quote list",
    moreOf: "See more:",
  },
} as const;

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
    // Con la categoría cuando cabe (47 + « — AG Supply» = 60): «Toalla 6/1 TAD 500 Pies · Papel toalla».
    title: category && `${product.name} · ${localizeCategory(category, lang).name}`.length <= 47
      ? `${product.name} · ${localizeCategory(category, lang).name}`
      : clip(product.name, 47),
    description: clip(
      productDescription(product, category ? localizeCategory(category, lang).name : undefined, brand ? localizeBrand(brand, lang).name : undefined, lang),
      150,
    ),
    image: product.images[0] ? { url: product.images[0], alt: product.name } : undefined,
    noindex: isThinProduct(raw),
  });
}

export async function ProductPage({ lang, cat, slug }: { lang: Lang; cat: string; slug: string }) {
  const t = ui(lang);
  const raw = await getProduct(slug);
  if (!raw || raw.category !== cat) notFound();

  const [cats, brandRaw, relatedRaw, allProducts] = await Promise.all([getCategories(), getBrand(raw.brand), getRelatedProducts(raw, 4), getProducts()]);
  const collections = collectionsOf(raw, allProducts);
  const categories = cats.map((x) => localizeCategory(x, lang));
  const category = categories.find((x) => x.slug === raw.category);
  const iconOf = new Map(categories.map((x) => [x.slug, x.icon]));
  const brand = brandRaw ? localizeBrand(brandRaw, lang) : undefined;
  const product = localizeProduct(raw, lang);
  const related = relatedRaw.map((p) => localizeProduct(p, lang));
  const { packFormat } = product.specs;
  const catalogName = lang === "es" ? "Catálogo" : "Catalog";
  const icon = iconOf.get(product.category) ?? "";
  const about = ABOUT[lang];

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

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="rule-red">{about.title}</h2>
            <div className="mt-4 space-y-3 text-body">
              <p>{about.inCategory(product.name, category?.name ?? product.category)} {product.fabricated ? about.made : about.supplied}</p>
              {category?.description && <p>{category.description}</p>}
              <p>{packFormat ? about.pack(packFormat) : about.noPack}</p>
              {brand && product.brand !== "generico" && <p>{brand.description}</p>}
            </div>
          </div>
          <div>
            <h2 className="rule-red">{about.howTitle}</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-body marker:font-bold marker:text-brand-blue-dark">
              {about.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <p className="mt-4">
              <Link href={href(lang, { name: "quote" })} className="link font-bold">{about.list}</Link>
            </p>
            {collections.length > 0 && (
              <p className="mt-4 text-body">
                {about.moreOf}{" "}
                {collections.map((col, i) => (
                  <span key={col.id}>
                    {i > 0 && ", "}
                    <Link href={href(lang, { name: "collection", col: col.id })} className="link font-bold">{col[lang].name}</Link>
                  </span>
                ))}
                .
              </p>
            )}
          </div>
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
