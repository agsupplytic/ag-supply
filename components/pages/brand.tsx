import Link from "next/link";
import Image from "next/image";
import { Boxes, FileText, Layers, Sandwich, Scroll, Users, UtensilsCrossed } from "lucide-react";
import { getBrand, getCategories, getProducts } from "@/lib/content";
import { brandAudience, localizeBrand, localizeCategory, localizeProduct } from "@/lib/i18n/content";
import { Container } from "@/components/site/container";
import { Section, SectionHeading } from "@/components/site/section";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ProductRow, ROW_COLS } from "@/components/site/product-row";
import { ClosingCta } from "@/components/site/closing-cta";
import { IconChip } from "@/components/site/icon-chip";
import { CategoryIcon } from "@/components/site/category-icon";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { href, QUERY, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Slug = "oceanBreeze" | "bonche";
const BRAND_SLUG = { oceanBreeze: "ocean-breeze", bonche: "bonche" } as const;

const COPY = {
  es: {
    oceanBreeze: {
      meta: { title: "Ocean Breeze: línea institucional", description: "Ocean Breeze, marca de AG Supply para hoteles, restaurantes y cadenas: servilletas, papel higiénico, toallas e interfoliados fabricados en Santiago." },
      h1: "Ocean Breeze, la línea de AG Supply para hoteles y restaurantes",
      sub: "Servilletas, papel higiénico, toallas, interfoliados y papel facial con marca Ocean Breeze, para hoteles, restaurantes, cadenas, catering y eventos.",
      audience: ["Hoteles", "Restaurantes", "Cadenas", "Catering", "Eventos"],
      features: [
        { icon: UtensilsCrossed, title: "Servilletas de mesa", text: "Dinner, cocktail y tall fold, lisas o timbradas, en blanco y kraft." },
        { icon: Layers, title: "Formatos de dispensador", text: "Interfoliados y servilletas de dispensación individual." },
        { icon: Scroll, title: "Papel higiénico y toallas", text: "Envuelto individual, 12/1, 24/1 y 48/1; toallas de cocina y de manos." },
      ],
    },
    bonche: {
      meta: { title: "Bonche: servilletas de consumo masivo", description: "Bonche, marca de AG Supply para consumo masivo y uso cotidiano: servilletas y papel encerado fabricados en Santiago para colmados, supermercados y mayoristas." },
      h1: "Bonche, la línea de AG Supply para consumo masivo",
      sub: "Servilletas de dispensador y papel de uso diario, de precio accesible, para colmados, supermercados, mayoristas y cafeterías.",
      audience: ["Colmados", "Supermercados", "Mayoristas", "Cafeterías"],
      features: [
        { icon: Sandwich, title: "Servilletas de dispensador", text: "Presentación en paquetes para exhibición y reposición en góndola." },
        { icon: FileText, title: "Papel encerado", text: "Plegadizas de papel encerado para envolver alimentos." },
        { icon: Boxes, title: "Más referencias por consulta", text: "El catálogo publicado es parcial; consulte por otras presentaciones." },
      ],
    },
    brands: "Marcas",
    inline: (n: string) => `${n} en una línea`,
    who: "A quién atiende",
    includes: "Qué incluye hoy el catálogo",
    products: (n: string) => `Productos ${n}`,
    count: (n: number) => `${n} ${n === 1 ? "producto" : "productos"} de esta línea en el catálogo.`,
    filter: "Filtrar en el catálogo",
    seeAll: (n: number) => `Ver los ${n} productos`,
    made: "Fabricada por AG Supply · Santiago, República Dominicana",
    view: (n: string) => `Ver productos ${n}`,
    closing: (n: string) => `Cotice ${n}`,
    closingText: "Arme su lista en el catálogo o consulte por referencias que aún no aparecen publicadas.",
    cutAlt: "Servilletas Bonche en su empaque",
  },
  en: {
    oceanBreeze: {
      meta: { title: "Ocean Breeze: institutional line", description: "Ocean Breeze, AG Supply's brand for hotels, restaurants and chains: napkins, toilet paper, paper towels and interfolded towels made in Santiago." },
      h1: "Ocean Breeze, AG Supply's line for hotels and restaurants",
      sub: "Napkins, toilet paper, paper towels, interfolded towels and facial tissue under the Ocean Breeze brand, for hotels, restaurants, chains, catering and events.",
      audience: ["Hotels", "Restaurants", "Chains", "Catering", "Events"],
      features: [
        { icon: UtensilsCrossed, title: "Table napkins", text: "Dinner, cocktail and tall fold, plain or stamped, in white and Kraft." },
        { icon: Layers, title: "Dispenser formats", text: "Interfolded towels and single-sheet dispenser napkins." },
        { icon: Scroll, title: "Toilet paper and towels", text: "Individually wrapped, 12/1, 24/1 and 48/1; kitchen and hand towels." },
      ],
    },
    bonche: {
      meta: { title: "Bonche: mass-consumption napkins", description: "Bonche, AG Supply's brand for mass consumption and everyday use: napkins and wax paper made in Santiago for corner stores, supermarkets and wholesalers." },
      h1: "Bonche, AG Supply's line for mass consumption",
      sub: "Dispenser napkins and everyday paper products at an affordable price, for corner stores, supermarkets, wholesalers and cafeterias.",
      audience: ["Corner stores", "Supermarkets", "Wholesalers", "Cafeterias"],
      features: [
        { icon: Sandwich, title: "Dispenser napkins", text: "Packs designed for display and shelf restocking." },
        { icon: FileText, title: "Wax paper", text: "Folded wax paper sheets for wrapping food." },
        { icon: Boxes, title: "More items on request", text: "The published catalog is partial; ask about other pack sizes." },
      ],
    },
    brands: "Brands",
    inline: (n: string) => `${n} at a glance`,
    who: "Who it serves",
    includes: "What the catalog includes today",
    products: (n: string) => `${n} products`,
    count: (n: number) => `${n} ${n === 1 ? "product" : "products"} from this line in the catalog.`,
    filter: "Filter in the catalog",
    seeAll: (n: number) => `View all ${n} products`,
    made: "Made by AG Supply · Santiago, Dominican Republic",
    view: (n: string) => `View ${n} products`,
    closing: (n: string) => `Quote ${n}`,
    closingText: "Build your list in the catalog or ask about items not yet published.",
    cutAlt: "Bonche napkins in their packaging",
  },
};

export function brandMetadata(lang: Lang, slug: Slug) {
  const c = COPY[lang][slug].meta;
  const image =
    slug === "bonche"
      ? { url: "/images/fotos/brand-bonche-hero.webp", alt: COPY[lang].cutAlt }
      : { url: "/images/brand/ocean-breeze-logo.webp", alt: "Ocean Breeze" };
  return pageMetadata({ lang, route: { name: slug }, title: c.title, description: c.description, image });
}

/**
 * Página de marca. Las dos comparten composición —logotipo grande sobre fondo claro de
 * la propia marca, texto a la derecha, filete inferior— y cambian de paleta. El logotipo
 * va directo (transparente), sin caja blanca. AG Supply figura como fabricante.
 */
export async function BrandPage({ lang, slug }: { lang: Lang; slug: Slug }) {
  const t = ui(lang);
  const c = COPY[lang];
  const k = c[slug];
  const ocean = slug === "oceanBreeze";
  const [brandRaw, prods, cats] = await Promise.all([getBrand(BRAND_SLUG[slug]), getProducts({ brand: BRAND_SLUG[slug] }), getCategories()]);
  const brand = brandRaw ? localizeBrand(brandRaw, lang) : undefined;
  const categories = cats.map((x) => localizeCategory(x, lang));
  const iconOf = new Map(categories.map((x) => [x.slug, x.icon]));
  const products = prods.map((p) => localizeProduct(p, lang));
  const name = ocean ? "Ocean Breeze" : "Bonche";
  const audience = brandAudience(BRAND_SLUG[slug], lang, k.audience);
  const byCategory = categories.map((cat) => ({ cat, n: products.filter((p) => p.category === cat.slug).length })).filter((x) => x.n > 0);
  const crumbs = [{ name: t.home, href: href(lang, { name: "home" }) }, { name: c.brands }, { name }];
  const Q = QUERY[lang];

  const theme = ocean
    ? { bg: "bg-ocean-50", border: "border-ocean", h1: "!text-ocean", btn: "bg-ocean text-white hover:bg-ocean/90", feat: "border-t-ocean", icon: "!bg-white !text-ocean" }
    : { bg: "bg-bonche-50", border: "border-bonche", h1: "!text-bonche-dark", btn: "bg-bonche text-white hover:bg-bonche-dark", feat: "border-t-bonche-accent", icon: "!bg-white !text-bonche" };

  return (
    <>
      <section className={cn("border-b-4", theme.bg, theme.border)}>
        <Container className="grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Image
            src={ocean ? "/images/brand/ocean-breeze-logo.webp" : "/images/brand/bonche-logo.webp"}
            alt={ocean ? "Ocean Breeze" : "Bonche Servilletas"}
            width={560}
            height={350}
            priority
            className="mx-auto h-auto w-full max-w-md"
          />
          <div>
            <Breadcrumbs items={crumbs} label={t.nav.breadcrumb} className="mb-5" />
            <h1 className={theme.h1}>{k.h1}</h1>
            <p className="mt-4 max-w-xl text-lg text-body">{k.sub}</p>
            <p className="label mt-5 text-muted">{c.made}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className={theme.btn}>
                <Link href={href(lang, { name: "products" }) + `?${Q.marca}=${BRAND_SLUG[slug]}`}>{c.view(name)}</Link>
              </Button>
              <WhatsAppButton size="lg" lang={lang} />
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <SectionHeading title={c.inline(name)} intro={brand?.description} />
            <h3 className="label mt-8 flex items-center gap-2 text-muted">
              <Users className="size-4 text-brand-blue" aria-hidden /> {c.who}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {audience.map((a) => (
                <li key={a} className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold", theme.bg, ocean ? "text-ocean" : "text-bonche-dark")}>
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-5">
            {!ocean && (
              <div className={cn("rounded-xl p-6", theme.bg)}>
                <Image
                  src="/images/fotos/bonche-productos.webp"
                  alt={c.cutAlt}
                  width={1379}
                  height={399}
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="h-auto w-full drop-shadow-[0_10px_14px_rgba(31,90,29,0.25)]"
                />
              </div>
            )}
            <div className="card p-5">
              <h3 className="label text-brand-blue-dark">{c.includes}</h3>
              <table className="spec-table mt-2">
                <tbody>
                  {byCategory.map(({ cat, n }) => (
                    <tr key={cat.slug}>
                      <th scope="row" className="!normal-case !tracking-normal !text-base !font-semibold !text-ink">
                        <Link href={href(lang, { name: "category", cat: cat.slug }) + `?${Q.marca}=${BRAND_SLUG[slug]}`} className="inline-flex items-center gap-2 hover:text-brand-blue-dark hover:underline">
                          <CategoryIcon name={cat.icon} className="size-4 text-brand-blue" />
                          {cat.name}
                        </Link>
                      </th>
                      <td>{t.count.product(n)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {k.features.map((f, i) => (
            <li key={f.title} className={cn("card card-hover rise flex gap-4 border-t-4 p-5", theme.feat)} style={{ animationDelay: `${i * 60}ms` }}>
              <IconChip icon={f.icon} className={theme.icon + " ring-1 ring-border"} />
              <div>
                <h3 className="!text-lg">{f.title}</h3>
                <p className="mt-1 text-body">{f.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="surface">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title={c.products(name)} intro={c.count(products.length)} />
          <Button asChild variant="outline">
            <Link href={href(lang, { name: "products" }) + `?${Q.marca}=${BRAND_SLUG[slug]}`}>{c.filter}</Link>
          </Button>
        </div>
        {products.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-white">
            <div className={cn("label hidden gap-x-4 border-b border-border bg-brand-blue-50 px-3 py-2.5 text-brand-blue-dark md:grid", ROW_COLS)} aria-hidden>
              <span />
              <span>{t.catalog.colSku}</span>
              <span>{t.catalog.colProduct}</span>
              <span>{t.catalog.colBrand}</span>
              <span>{t.catalog.colPack}</span>
              <span className="text-right">{t.catalog.colQuote}</span>
            </div>
            <ul className="divide-y divide-border">
              {products.slice(0, 12).map((p) => (
                <ProductRow key={p.slug} product={p} icon={iconOf.get(p.category) ?? ""} lang={lang} />
              ))}
            </ul>
          </div>
        )}
        {products.length > 12 && (
          <p className="mt-4">
            <Link href={href(lang, { name: "products" }) + `?${Q.marca}=${BRAND_SLUG[slug]}`} className="link font-bold">
              {c.seeAll(products.length)}
            </Link>
          </p>
        )}
      </Section>

      <ClosingCta lang={lang} title={c.closing(name)} text={c.closingText} />
    </>
  );
}
