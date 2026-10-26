import Link from "next/link";
import {
  ArrowRight, Boxes, Briefcase, Building2, Calendar, Factory, Hotel, Layers, ListPlus, PackageCheck,
  Scissors, Search, Send, Store, Truck, UtensilsCrossed, Warehouse, Disc3,
} from "lucide-react";
import { getBrands, getCategories, getProducts } from "@/lib/content";
import { localizeBrand, localizeCategory, localizeProduct } from "@/lib/i18n/content";
import { Container } from "@/components/site/container";
import { Section, SectionHeading } from "@/components/site/section";
import { Photo } from "@/components/site/photo";
import { PageHero } from "@/components/site/page-hero";
import { CategoryCards, type CategorySamples } from "@/components/site/category-list";
import { BrandPanels } from "@/components/site/brand-panels";
import { Distributors } from "@/components/site/distributors";
import { ClosingCta } from "@/components/site/closing-cta";
import { IconChip } from "@/components/site/icon-chip";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { siteConfig } from "@/lib/site-config";
import { textFor } from "@/lib/i18n/site-text";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { PLANT_PHOTOS } from "@/lib/photos";
import { WebSiteJsonLd } from "@/components/site/json-ld";
import { pageMetadata } from "@/lib/seo";

const COPY = {
  es: {
    meta: {
      title: "AG Supply — Papel higiénico, papel toalla y servilletas",
      description: "Convertidora de papel en Santiago, RD. Fabricamos papel higiénico, toallas, servilletas, interfoliados y papel facial. Marcas Ocean Breeze y Bonche.",
    },
    h1: "Convertidora de papel en Santiago, República Dominicana",
    lead: "Fabricamos papel higiénico, toallas de papel, servilletas, interfoliados y papel facial para hoteles, restaurantes, comercios y distribuidores. Marcas propias: Ocean Breeze y Bonche.",
    heroAlt: "Bobinas de papel base almacenadas en la nave de conversión",
    stats: (cats: number, refs: number, tons: number, m2: string, since: number) => [
      { icon: Calendar, value: String(since), label: "año de fundación" },
      { icon: Factory, value: `${tons} t`, label: "de papel al mes, capacidad instalada" },
      { icon: Building2, value: `${m2} m²`, label: "construidos en Las Palomas, Santiago" },
      { icon: Layers, value: String(refs), label: `referencias en ${cats} categorías` },
    ],
    makeTitle: "Qué fabricamos",
    makeIntro: "Papel tissue convertido en la planta de Santiago. Cada categoría tiene su propio catálogo con presentaciones y referencias.",
    suppliedTitle: "También suministramos",
    suppliedIntro: "Complementos para la misma operación. No se fabrican en nuestra planta: los suministra AG Supply.",
    processTitle: "Cómo se convierte el papel",
    processIntro: "De la bobina al pedido, en cinco etapas dentro de la misma planta.",
    steps: [
      { title: "Bobinas y materia prima", text: "Recibimos papel base en bobinas de gran diámetro, más el material de empaque.", icon: Boxes },
      { title: "Rebobinado", text: "Cada bobina se rebobina con el diámetro y la tensión que pide la línea.", icon: Disc3 },
      { title: "Corte y doblado", text: "Corte al ancho y largo de hoja; doblez dinner, cocktail, C-fold o interfoliado.", icon: Scissors },
      { title: "Empaque", text: "Empaque primario, agrupado por presentación y etiquetado.", icon: PackageCheck },
      { title: "Almacén y despacho", text: "Producto terminado en cajas, preparado por pedido para su despacho.", icon: Truck },
    ],
    plantTitle: "Una planta propia en Las Palomas",
    plantIntro: "El producto se convierte en nuestra nave de Santiago, a partir de bobinas de papel base. Eso permite definir formato, metraje y presentación por pedido.",
    facts: "Datos de la empresa",
    rows: {
      name: "Razón social", founded: "Fundación", pivot: "Conversión de papel", capacity: "Capacidad instalada", plant: "Planta",
      location: "Ubicación", access: "Acceso", brands: "Marcas propias",
    },
    foundedValue: (y: number, f: string) => `${y}, como ${f}`,
    pivotValue: (y: number) => `Desde ${y}`,
    capacityValue: (t: number) => `Hasta ${t} toneladas de papel al mes`,
    plantValue: (b: string, l: string, p: number) => `${b} m² construidos en ${l} m² de terreno (${p} m² de producción)`,
    knowCompany: "Conocer la empresa",
    seePlant: "Ver el proceso en planta",
    marketsTitle: "A quién atendemos",
    marketsIntro: "Venta directa a empresas y, además, a través de distribuidores autorizados.",
    markets: [
      { icon: Hotel, title: "Hoteles", text: "Papel higiénico, toallas, servilletas y faciales para habitaciones y áreas comunes." },
      { icon: UtensilsCrossed, title: "Restaurantes y cafeterías", text: "Servilletas de mesa y de dispensador, toallas y desechables." },
      { icon: Briefcase, title: "Catering y eventos", text: "Servilletas cocktail y dinner, cubertería y combos de cubierto + servilleta." },
      { icon: Store, title: "Colmados y supermercados", text: "Línea Bonche para consumo masivo y uso cotidiano." },
      { icon: Warehouse, title: "Mayoristas y distribuidores", text: "Presentaciones en fardo y caja para reventa." },
      { icon: Building2, title: "Empresas e instituciones", text: "Suministro de higiene y desechables para oficinas y organizaciones." },
    ],
    brandsTitle: "Dos marcas propias, una sola planta",
    brandsIntro: "Ocean Breeze atiende al canal institucional; Bonche, al consumo masivo. Las dos se fabrican en AG Supply.",
    ocAudience: "Hoteles, restaurantes y cadenas",
    boAudience: "Consumo masivo y uso cotidiano",
    quoteTitle: "Cómo pedir una cotización",
    quoteSteps: [
      { icon: Search, title: "Busque en el catálogo", text: "Filtre por categoría, marca o presentación y encuentre la referencia." },
      { icon: ListPlus, title: "Arme su lista", text: "Añada productos, ajuste cantidades y deje una nota por producto." },
      { icon: Send, title: "Envíela por WhatsApp", text: "El mensaje sale armado con sus referencias, listo para enviar." },
    ],
    startQuote: "Empezar cotización",
    closingTitle: "Atención comercial",
    closingText: "Escríbanos o llámenos en horario de oficina; respondemos con precios y disponibilidad por pedido.",
  },
  en: {
    meta: {
      title: "AG Supply — Toilet paper, paper towels and napkins",
      description: "Paper converter in Santiago, DR. We manufacture toilet paper, paper towels, napkins, interfolded towels and facial tissue. Ocean Breeze and Bonche brands.",
    },
    h1: "Paper converter in Santiago, Dominican Republic",
    lead: "We manufacture toilet paper, paper towels, napkins, interfolded towels and facial tissue for hotels, restaurants, shops and distributors. Our own brands: Ocean Breeze and Bonche.",
    heroAlt: "Base paper reels stored in the converting plant",
    stats: (cats: number, refs: number, tons: number, m2: string, since: number) => [
      { icon: Calendar, value: String(since), label: "year founded" },
      { icon: Factory, value: `${tons} t`, label: "of paper per month, installed capacity" },
      { icon: Building2, value: `${m2} m²`, label: "built in Las Palomas, Santiago" },
      { icon: Layers, value: String(refs), label: `items in ${cats} categories` },
    ],
    makeTitle: "What we manufacture",
    makeIntro: "Tissue paper converted at our Santiago plant. Each category has its own catalog with pack sizes and item codes.",
    suppliedTitle: "We also supply",
    suppliedIntro: "Complements for the same operation. They are not manufactured at our plant: AG Supply supplies them.",
    processTitle: "How the paper is converted",
    processIntro: "From reel to order, in five stages inside the same plant.",
    steps: [
      { title: "Reels and raw material", text: "We receive base paper in large-diameter reels, plus packaging material.", icon: Boxes },
      { title: "Rewinding", text: "Each reel is rewound to the diameter and tension the line requires.", icon: Disc3 },
      { title: "Cutting and folding", text: "Cut to sheet width and length; dinner, cocktail, C-fold or interfolded folds.", icon: Scissors },
      { title: "Packing", text: "Primary packaging, grouped by pack size and labelled.", icon: PackageCheck },
      { title: "Storage and dispatch", text: "Finished product in boxes, prepared per order for dispatch.", icon: Truck },
    ],
    plantTitle: "Our own plant in Las Palomas",
    plantIntro: "The product is converted at our Santiago plant from base paper reels. This lets us define format, length and pack size per order.",
    facts: "Company facts",
    rows: {
      name: "Legal name", founded: "Founded", pivot: "Paper converting", capacity: "Installed capacity", plant: "Plant",
      location: "Location", access: "Access", brands: "Own brands",
    },
    foundedValue: (y: number, f: string) => `${y}, as ${f}`,
    pivotValue: (y: number) => `Since ${y}`,
    capacityValue: (t: number) => `Up to ${t} tonnes of paper per month`,
    plantValue: (b: string, l: string, p: number) => `${b} m² built on ${l} m² of land (${p} m² of production)`,
    knowCompany: "About the company",
    seePlant: "See the plant process",
    marketsTitle: "Who we serve",
    marketsIntro: "Direct sales to businesses and, in addition, through authorized distributors.",
    markets: [
      { icon: Hotel, title: "Hotels", text: "Toilet paper, paper towels, napkins and facial tissue for rooms and common areas." },
      { icon: UtensilsCrossed, title: "Restaurants and cafés", text: "Table and dispenser napkins, paper towels and disposables." },
      { icon: Briefcase, title: "Catering and events", text: "Cocktail and dinner napkins, cutlery and cutlery + napkin combo sets." },
      { icon: Store, title: "Corner stores and supermarkets", text: "Bonche line for mass consumption and everyday use." },
      { icon: Warehouse, title: "Wholesalers and distributors", text: "Bale and box pack sizes for resale." },
      { icon: Building2, title: "Companies and institutions", text: "Hygiene and disposables supply for offices and organizations." },
    ],
    brandsTitle: "Two own brands, one plant",
    brandsIntro: "Ocean Breeze serves the institutional channel; Bonche, mass consumption. Both are made at AG Supply.",
    ocAudience: "Hotels, restaurants and chains",
    boAudience: "Mass consumption and everyday use",
    quoteTitle: "How to request a quote",
    quoteSteps: [
      { icon: Search, title: "Browse the catalog", text: "Filter by category, brand or pack size and find the item." },
      { icon: ListPlus, title: "Build your list", text: "Add products, adjust quantities and leave a note per product." },
      { icon: Send, title: "Send it via WhatsApp", text: "The message comes ready with your items, ready to send." },
    ],
    startQuote: "Start a quote",
    closingTitle: "Sales team",
    closingText: "Write or call us during office hours; we reply with prices and availability per order.",
  },
};

export function homeMetadata(lang: Lang) {
  const c = COPY[lang].meta;
  return pageMetadata({ lang, route: { name: "home" }, title: c.title, absolute: true, description: c.description });
}

export async function HomePage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const t = ui(lang);
  const tt = textFor(lang);
  const [cats, products, brands] = await Promise.all([getCategories(), getProducts(), getBrands()]);
  const categories = cats.map((x) => localizeCategory(x, lang));
  const made = categories.filter((x) => x.fabricated);
  const supplied = categories.filter((x) => !x.fabricated);
  const ocean = brands.map((b) => localizeBrand(b, lang)).find((b) => b.slug === "ocean-breeze");
  const bonche = brands.map((b) => localizeBrand(b, lang)).find((b) => b.slug === "bonche");
  const { company } = siteConfig;
  const fmt = (n: number) => n.toLocaleString(lang === "es" ? "es-DO" : "en-US");

  const samples: CategorySamples = {};
  for (const p of products) {
    if (!p.images[0]) continue;
    const lp = localizeProduct(p, lang);
    (samples[p.category] ??= []).push({ src: p.images[0], alt: lp.name });
  }

  const stats = c.stats(categories.length, products.length, company.capacityTonsMonth, fmt(company.plant.builtM2), company.foundedYear);
  const photos = [PLANT_PHOTOS.reels, PLANT_PHOTOS.rewind, PLANT_PHOTOS.cut, PLANT_PHOTOS.pack, PLANT_PHOTOS.dispatch];

  return (
    <>
      <WebSiteJsonLd lang={lang} />
      <PageHero
        title={c.h1}
        lead={
          <>
            {c.lead}
            <span className="mt-4 block font-heading text-xl font-bold italic text-white">{tt.slogan}</span>
          </>
        }
        actions={
          <>
            <Button asChild size="lg" variant="light">
              <Link href={href(lang, { name: "products" })}>
                {t.catalogBtn} <ArrowRight aria-hidden />
              </Link>
            </Button>
            <WhatsAppButton size="lg" lang={lang} />
          </>
        }
        image={{ src: PLANT_PHOTOS.reels.src, alt: PLANT_PHOTOS.reels.alt[lang] }}
      />

      {/* datos verificados de la empresa, sobre el borde del encabezado */}
      <Container className="relative z-10 -mt-8">
        <ul className="card grid grid-cols-2 gap-px overflow-hidden !border-0 bg-border shadow-lg lg:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="flex items-center gap-3 bg-white p-4 md:p-5">
              <IconChip icon={s.icon} />
              <p>
                <strong className="block font-heading text-2xl font-extrabold leading-none text-brand-blue-dark">{s.value}</strong>
                <span className="mt-1 block text-sm leading-snug text-body">{s.label}</span>
              </p>
            </li>
          ))}
        </ul>
      </Container>

      <Section>
        <SectionHeading title={c.makeTitle} intro={c.makeIntro} />
        <div className="mt-10">
          <CategoryCards categories={made} samples={samples} lang={lang} />
        </div>
        <h3 className="mt-14 text-xl">{c.suppliedTitle}</h3>
        <p className="mt-2 max-w-2xl text-body">{c.suppliedIntro}</p>
        <div className="mt-6">
          <CategoryCards categories={supplied} samples={samples} lang={lang} compact />
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeading title={c.processTitle} intro={c.processIntro} />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {c.steps.map((s, i) => (
            <li key={s.title} className="card card-hover rise overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}>
              <Photo src={photos[i].src} alt={photos[i].alt[lang]} ratio="4/3" sizes="(max-width: 640px) 100vw, 260px" className="!rounded-none" />
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <IconChip icon={s.icon} />
                  <span className="font-heading text-3xl font-extrabold leading-none text-brand-blue" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-3 !text-lg">{s.title}</h3>
                <p className="mt-1.5 text-sm text-body">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading title={c.plantTitle} intro={c.plantIntro} />
            <Photo
              src={PLANT_PHOTOS.facade.src}
              alt={PLANT_PHOTOS.facade.alt[lang]}
              ratio="3/2"
              className="mt-8"
            />
          </div>
          <div>
            <h3 className="label text-brand-blue-dark">{c.facts}</h3>
            <table className="spec-table mt-3">
              <tbody>
                <tr><th scope="row">{c.rows.name}</th><td>{siteConfig.legalName}</td></tr>
                <tr><th scope="row">{c.rows.founded}</th><td>{c.foundedValue(company.foundedYear, company.formerName)}</td></tr>
                <tr><th scope="row">{c.rows.pivot}</th><td>{c.pivotValue(company.pivotYear)}</td></tr>
                <tr><th scope="row">{c.rows.capacity}</th><td>{c.capacityValue(company.capacityTonsMonth)}</td></tr>
                <tr><th scope="row">{c.rows.plant}</th><td>{c.plantValue(fmt(company.plant.builtM2), fmt(company.plant.landM2), company.plant.productionM2)}</td></tr>
                <tr><th scope="row">{c.rows.location}</th><td>{tt.address.line1}, {tt.address.city}</td></tr>
                <tr><th scope="row">{c.rows.access}</th><td>{tt.proximity.join("; ")}</td></tr>
                <tr><th scope="row">{c.rows.brands}</th><td>Ocean Breeze · Bonche</td></tr>
              </tbody>
            </table>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={href(lang, { name: "about" })}>{c.knowCompany}</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href={href(lang, { name: "plant" })}>{c.seePlant}</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="band">
        <SectionHeading tone="dark" title={c.marketsTitle} intro={c.marketsIntro} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.markets.map((m, i) => (
            <li key={m.title} className="rise flex gap-4 rounded-xl bg-brand-blue-700 p-5 ring-1 ring-white/25 transition-colors hover:bg-brand-blue-dark" style={{ animationDelay: `${(i % 3) * 60}ms` }}>
              <IconChip icon={m.icon} />
              <div>
                <h3 className="!text-lg !text-white">{m.title}</h3>
                <p className="mt-1 text-sm text-white">{m.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading title={c.brandsTitle} intro={c.brandsIntro} />
        <div className="mt-10">
          <BrandPanels
            lang={lang}
            ocean={{ name: "Ocean Breeze", audience: c.ocAudience, body: ocean?.short ?? "", count: ocean?.count ?? 0 }}
            bonche={{ name: "Bonche", audience: c.boAudience, body: bonche?.short ?? "", count: bonche?.count ?? 0 }}
          />
        </div>
      </Section>

      <Section tone="soft">
        <SectionHeading title={c.quoteTitle} />
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {c.quoteSteps.map((s, i) => (
            <li key={s.title} className="card rise p-5" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-3">
                <IconChip icon={s.icon} />
                <span className="font-heading text-3xl font-extrabold leading-none text-brand-blue" aria-hidden>{i + 1}</span>
              </div>
              <h3 className="mt-3 !text-xl">{s.title}</h3>
              <p className="mt-1.5 text-body">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={href(lang, { name: "products" })}>{c.startQuote}</Link>
          </Button>
          <WhatsAppButton size="lg" lang={lang} />
        </div>
      </Section>

      <Distributors lang={lang} />

      <ClosingCta lang={lang} title={c.closingTitle} text={c.closingText} />
    </>
  );
}
