import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Factory,
  Truck,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { getCategories, getProducts, getBrands } from "@/lib/content";
import { Container } from "@/components/site/container";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Swoosh } from "@/components/site/swoosh";
import { Figure } from "@/components/site/figure";
import { BackgroundCarousel } from "@/components/site/background-carousel";
import { CategoryCard } from "@/components/site/category-card";
import { BrandSplit } from "@/components/site/brand-split";
import { CountUp } from "@/components/site/count-up";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { t } from "@/lib/i18n";
import { ogFor } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute:
      "AG Supply — Fabricante de papel higiénico, servilletas y toallas en Santiago, RD",
  },
  description:
    "AG Supply convierte bobinas en papel higiénico, toallas, servilletas, faciales, interfoliados y desechables para empresas de República Dominicana. Marcas propias Ocean Breeze y Bonche. Cotiza por WhatsApp, sin precios en línea.",
  alternates: { canonical: "/" },
  openGraph: ogFor(
    "AG Supply — Fabricante de higiene institucional en República Dominicana",
    "Convertidora de papel en Santiago. Papel higiénico, toallas, servilletas, faciales e interfoliados bajo las marcas Ocean Breeze y Bonche.",
  ),
};

const HERO_IMAGES = [
  { src: "/images/placeholders/hero-1.webp", alt: "Planta de conversión de AG Supply" },
  { src: "/images/placeholders/hero-2.webp", alt: "Bobinas de papel entrando a conversión" },
  { src: "/images/placeholders/hero-3.webp", alt: "Producto terminado y empacado" },
];

export default async function HomePage() {
  const [categories, products, brands] = await Promise.all([
    getCategories(),
    getProducts(),
    getBrands(),
  ]);

  const oceanBreeze = brands.find((b) => b.slug === "ocean-breeze");
  const bonche = brands.find((b) => b.slug === "bonche");

  const stats = [
    { icon: Factory, value: t("stats.factory"), label: t("stats.factoryLabel") },
    { icon: Truck, value: t("stats.national"), label: t("stats.nationalLabel") },
    {
      icon: Layers,
      value: <CountUp to={products.length} suffix="+" />,
      label: `${categories.length} categorías · ${t("stats.capacity")}`,
    },
    { icon: ShieldCheck, value: t("stats.brands"), label: t("stats.brandsLabel") },
  ];

  const pillars = [
    { icon: Factory, title: "Fabricamos, no revendemos", text: "Recibimos bobinas y materia prima y las convertimos en producto terminado en nuestra planta." },
    { icon: ShieldCheck, title: "Control de calidad propio", text: "Gramaje, formato y rendimiento consistentes en cada lote, porque el proceso es nuestro." },
    { icon: Truck, title: "Abastecimiento estable", text: "Producción local: menos dependencia de importación y entrega en el tiempo acordado." },
  ];

  const steps = [
    { n: 1, title: t("home.step1"), text: "Filtra por categoría, marca o especificación técnica." },
    { n: 2, title: t("home.step2"), text: "Ajusta cantidades y agrega una nota si lo necesitas." },
    { n: 3, title: t("home.step3"), text: "Generamos el mensaje con tu lista y lo abres listo para enviar." },
  ];


  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="relative isolate overflow-hidden text-white">
        <BackgroundCarousel images={HERO_IMAGES} overlay="brand" />
        <Container className="relative py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="max-w-xl text-3xl leading-[1.1] text-white sm:text-4xl lg:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 font-heading text-xl italic text-white sm:text-2xl">
              {siteConfig.slogan}
            </p>
            <p className="mt-5 max-w-xl text-base text-white/90 sm:text-lg">
              {t("hero.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-brand-blue hover:bg-brand-blue-50"
              >
                <Link href="/productos">
                  {t("cta.viewCatalog")}
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <WhatsAppButton size="lg">{t("cta.quoteWhatsapp")}</WhatsAppButton>
            </div>
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------- trust strip */}
      <div className="border-b border-border bg-brand-blue-50">
        <Container className="grid grid-cols-1 gap-6 py-9 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-start gap-3.5">
              <span className="panel-icon size-10 shrink-0">
                <s.icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-heading text-lg font-bold leading-tight text-ink">
                  {s.value}
                </p>
                <p className="mt-0.5 text-sm leading-snug text-body">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </Container>
      </div>

      {/* ---------------------------------------------------- company / plant */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Figure
              src="/images/placeholders/section-manufactura.webp"
              alt="Detalle de la línea de conversión de AG Supply"
              className="aspect-4/3 shadow-xl"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </Reveal>
          <Reveal delay={80}>
            <SectionHeading
              title="El proceso de conversión ocurre en nuestra planta"
              intro="Recibimos bobinas de papel y materia prima y las convertimos: rebobinado, corte, doblado, interfoliado y empaque. Eso nos permite controlar el rendimiento, el formato y el abastecimiento de cada pedido."
            />
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/nosotros">
                  {t("cta.knowAg")} <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/nosotros/planta">{t("cta.seeProcess")}</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------- categories */}
      <Section className="border-t border-border bg-brand-blue-50">
        <Reveal>
          <SectionHeading
            title={t("home.catalogTitle")}
            intro="Cada categoría se produce en planta y se entrega en el formato que tu operación necesita. Sin precios públicos, sin intermediarios."
          />
        </Reveal>
        <Reveal className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </Reveal>
      </Section>

      {/* ------------------------------------------------------------- brands */}
      <Section className="border-t border-border pb-0">
        <Reveal>
          <SectionHeading
            title={t("home.brandsTitle")}
            intro="Misma planta, mismo control de calidad. Cambia el posicionamiento según a quién sirve cada línea."
          />
        </Reveal>
      </Section>
      <Reveal>
        <BrandSplit
          oceanBreeze={{
            slug: "ocean-breeze",
            name: "Ocean Breeze",
            tag: "Premium · Hoteles, restaurantes y cadenas",
            body: oceanBreeze?.short,
          }}
          bonche={{
            slug: "bonche",
            name: "Bonche",
            tag: "Económica · Consumo masivo y uso cotidiano",
            body: bonche?.short,
          }}
        />
      </Reveal>

      {/* --------------------------------------------------------- why us (red band) */}
      <div className="relative isolate overflow-hidden text-white">
        <div className="absolute inset-0 -z-10 bg-red-gradient" />
        <Swoosh
          variant="field"
          tone="light"
          className="inset-x-0 bottom-0 h-1/2 w-full opacity-[0.07]"
        />
        <Section className="relative">
          <Reveal>
            <SectionHeading
              title={t("home.whyTitle")}
              intro="Trabajar con el fabricante cambia el rendimiento, la consistencia y el tiempo de respuesta."
              className="[&_h2]:text-white [&_p]:text-white/90"
            />
          </Reveal>
          <Reveal className="mt-10 grid gap-5 md:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title} className="panel-quiet p-6">
                <span className="panel-icon size-11">
                  <p.icon className="size-5" aria-hidden />
                </span>
                <p className="mt-4 font-heading text-base font-semibold">
                  {p.title}
                </p>
                <p className="mt-1.5 text-sm text-white/85">{p.text}</p>
              </div>
            ))}
          </Reveal>
        </Section>
      </div>

      {/* ------------------------------------------------------ how to quote */}
      <Section className="bg-surface">
        <Reveal>
          <SectionHeading
            title={t("home.howTitle")}
            intro="Sin cuenta, sin espera. Tu lista se arma en el navegador y se envía por WhatsApp."
          />
        </Reveal>
        <Reveal className="mt-12">
          <ol className="grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.n} className="panel relative p-6">
                <span className="panel-icon size-11 font-heading text-lg font-bold">
                  {step.n}
                </span>
                <p className="mt-4 font-heading text-lg font-semibold text-ink">
                  {step.title}
                </p>
                <p className="mt-1.5 text-body">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/productos">
                {t("cta.startQuote")} <ArrowRight className="size-5" />
              </Link>
            </Button>
            <WhatsAppButton size="lg">{t("cta.quoteWhatsapp")}</WhatsAppButton>
          </div>
        </Reveal>
      </Section>

      {/* ----------------------------------------------------------- contact */}
      <section className="relative isolate border-t border-border text-white">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/images/placeholders/section-cta.webp"
            alt="Almacén y despacho de AG Supply"
            fill
            sizes="100vw"
            draggable={false}
            className="object-cover"
          />
          <div className="absolute inset-0 hero-scrim-deep" />
        </div>
        <Container className="relative py-16 md:py-24">
          <Reveal className="max-w-2xl">
            <h2 className="text-white">¿Listo para abastecer tu operación?</h2>
            <p className="mt-4 text-lg text-white/90">
              Escríbenos o llámanos. Coordinamos volúmenes, formatos y entrega en
              el tiempo acordado.
            </p>
            <div className="mt-6 space-y-1">
              {siteConfig.phones.map((p) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  className="block font-heading text-lg font-semibold text-white"
                >
                  {p.value}{" "}
                  <span className="text-sm font-medium text-white/75">
                    · {p.label}
                  </span>
                </a>
              ))}
              <a
                href={`mailto:${siteConfig.email}`}
                className="block text-white/90 hover:text-white"
              >
                {siteConfig.email}
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <WhatsAppButton size="lg" />
              <Button
                asChild
                size="lg"
                className="bg-white text-brand-blue hover:bg-brand-blue-50"
              >
                <Link href="/contacto">{t("cta.contactForm")}</Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
