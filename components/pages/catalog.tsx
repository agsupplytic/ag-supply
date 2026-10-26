import { getBrands, getCategories, getProducts } from "@/lib/content";
import { localizeBrand, localizeCategory, localizeProduct } from "@/lib/i18n/content";
import Link from "next/link";
import { Section } from "@/components/site/section";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { Catalog } from "@/components/site/catalog";
import { BreadcrumbJsonLd, CollectionJsonLd } from "@/components/site/json-ld";
import { CATEGORY_PHOTOS } from "@/lib/photos";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { clip, pageMetadata } from "@/lib/seo";
import { PLANT_PHOTOS } from "@/lib/photos";
import { notFound } from "next/navigation";

const COPY = {
  es: {
    meta: {
      title: "Catálogo: papel higiénico, servilletas, toallas",
      description: "Catálogo de AG Supply: papel higiénico, toallas, servilletas, interfoliados, papel facial, jabón y desechables con SKU y presentación. Cotización por WhatsApp.",
    },
    lead: (refs: number, cats: number) => `${refs} referencias en ${cats} categorías. Busque por producto, SKU o presentación y arme su lista de cotización. Los precios se confirman por pedido.`,
    categoryMeta: (name: string) => `${name}: catálogo y presentaciones`,
    made: "Fabricado en la planta de AG Supply",
    supplied: "Suministrado por AG Supply",
    madeDesc: "Fabricado",
    suppliedDesc: "Suministrado",
    descTail: "por AG Supply, Santiago, RD. Cotización por WhatsApp.",
  },
  en: {
    meta: {
      title: "Toilet paper, napkins and paper towels catalog",
      description: "AG Supply catalog: toilet paper, paper towels, napkins, interfolded towels, facial tissue, soap and disposables with SKU and pack size. Quote via WhatsApp.",
    },
    lead: (refs: number, cats: number) => `${refs} items in ${cats} categories. Search by product, SKU or pack size and build your quote list. Prices are confirmed per order.`,
    categoryMeta: (name: string) => `${name}: catalog and pack sizes`,
    made: "Manufactured at the AG Supply plant",
    supplied: "Supplied by AG Supply",
    madeDesc: "Manufactured",
    suppliedDesc: "Supplied",
    descTail: "by AG Supply, Santiago, DR. Quote via WhatsApp.",
  },
};

export function catalogMetadata(lang: Lang) {
  const c = COPY[lang].meta;
  return pageMetadata({
    lang, route: { name: "products" }, title: c.title, description: c.description,
    image: { url: PLANT_PHOTOS.dispatch.src, alt: PLANT_PHOTOS.dispatch.alt[lang] },
  });
}

export async function CatalogPage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const t = ui(lang);
  const [cats, prods, brs] = await Promise.all([getCategories(), getProducts(), getBrands()]);
  const categories = cats.map((x) => localizeCategory(x, lang));
  const products = prods.map((p) => localizeProduct(p, lang));
  const brands = brs.map((b) => localizeBrand(b, lang));

  return (
    <>
      <PageHero
        breadcrumb={[{ name: t.home, href: href(lang, { name: "home" }) }, { name: lang === "es" ? "Catálogo" : "Catalog" }]}
        breadcrumbLabel={t.nav.breadcrumb}
        title={t.catalog.title}
        lead={c.lead(products.length, categories.length)}
        image={{ src: PLANT_PHOTOS.dispatch.src, alt: PLANT_PHOTOS.dispatch.alt[lang] }}
      />
      <Container className="py-10 md:py-12">
        <Catalog products={products} categories={categories} brands={brands} lang={lang} />
      </Container>
    </>
  );
}

const HOW = {
  es: {
    title: "Cómo cotizar en esta categoría",
    steps: [
      "Filtre o busque la referencia por nombre, código (SKU), marca o presentación.",
      "Añádala a su lista con la cantidad que necesita; puede sumar productos de otras categorías.",
      "Envíe la lista por WhatsApp o escríbanos: ventas confirma precio y disponibilidad por pedido.",
    ],
    list: "Ver mi lista de cotización",
  },
  en: {
    title: "How to request a quote in this category",
    steps: [
      "Filter or search for the item by name, code (SKU), brand or pack size.",
      "Add it to your list with the quantity you need; you can add products from other categories.",
      "Send the list via WhatsApp or write to us: sales confirms price and availability per order.",
    ],
    list: "View my quote list",
  },
} as const;

// ---------------------------------------------------------------- categoría
export async function categoryMetadata(lang: Lang, slug: string) {
  const cat = await getCategories().then((l) => l.find((x) => x.slug === slug));
  if (!cat) return {};
  const lc = localizeCategory(cat, lang);
  const photo = CATEGORY_PHOTOS[slug];
  const c = COPY[lang];
  return pageMetadata({
    lang,
    route: { name: "category", cat: slug },
    title: c.categoryMeta(lc.name),
    description: clip(`${lc.description} ${cat.fabricated ? c.madeDesc : c.suppliedDesc} ${c.descTail}`),
    image: photo ? { url: photo.src, alt: photo.alt[lang] } : undefined,
  });
}

export async function CategoryPage({ lang, slug }: { lang: Lang; slug: string }) {
  const c = COPY[lang];
  const t = ui(lang);
  const [cats, prods, brs] = await Promise.all([getCategories(), getProducts({ category: slug }), getBrands()]);
  const rawCat = cats.find((x) => x.slug === slug);
  if (!rawCat) notFound();
  const categories = cats.map((x) => localizeCategory(x, lang));
  const category = categories.find((x) => x.slug === slug)!;
  const products = prods.map((p) => localizeProduct(p, lang));
  const brands = brs.map((b) => localizeBrand(b, lang));
  const photo = CATEGORY_PHOTOS[slug];

  return (
    <>
      <CollectionJsonLd category={category} products={products} lang={lang} />
      <BreadcrumbJsonLd
        trail={[
          [lang === "es" ? "Catálogo" : "Catalog", href(lang, { name: "products" })],
          [category.name, href(lang, { name: "category", cat: slug })],
        ]}
      />
      <PageHero
        breadcrumb={[
          { name: t.home, href: href(lang, { name: "home" }) },
          { name: lang === "es" ? "Catálogo" : "Catalog", href: href(lang, { name: "products" }) },
          { name: category.name },
        ]}
        breadcrumbLabel={t.nav.breadcrumb}
        title={category.name}
        lead={category.short}
        meta={`${t.count.product(products.length)} · ${category.fabricated ? c.made : c.supplied}`}
        image={photo ? { src: photo.src, alt: photo.alt[lang] } : undefined}
      />
      <Container className="pt-10 md:pt-12">
        <p className="max-w-3xl text-lg text-body">{category.description}</p>
      </Container>
      <Container className="py-10 md:py-12">
        <Catalog products={products} categories={categories} brands={brands} lang={lang} lockedCategory={slug} />
      </Container>
      <Section tone="surface">
        <h2 className="rule-red">{HOW[lang].title}</h2>
        <ol className="mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-body marker:font-bold marker:text-brand-blue-dark">
          {HOW[lang].steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <p className="mt-4">
          <Link href={href(lang, { name: "quote" })} className="link font-bold">{HOW[lang].list}</Link>
        </p>
      </Section>
    </>
  );
}
