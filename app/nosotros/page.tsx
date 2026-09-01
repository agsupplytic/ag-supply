import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Recycle,
  Scissors,
  Layers,
  PackageCheck,
  Target,
  Eye,
  Route,
  Plane,
  Gauge,
  Building2,
  Boxes,
} from "lucide-react";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/site/section";
import { Container } from "@/components/site/container";
import { BackgroundCarousel } from "@/components/site/background-carousel";
import { Reveal } from "@/components/site/reveal";
import { CountUp } from "@/components/site/count-up";
import { BrandSplit } from "@/components/site/brand-split";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { getBrands } from "@/lib/content";
import { ogFor } from "@/lib/seo";

const NOSOTROS_DESC =
  "AG Supply SRL, convertidora de papel en Las Palomas, Santiago. Desde 2014 fabricamos, convertimos y distribuimos productos desechables de papel bajo las marcas Ocean Breeze y Bonche, con capacidad para 400 toneladas de papel al mes.";

export const metadata: Metadata = {
  title: "Nosotros",
  description: NOSOTROS_DESC,
  openGraph: ogFor("Nosotros — AG Supply", NOSOTROS_DESC),
  alternates: { canonical: "/nosotros" },
};

const TIMELINE = [
  { year: "2007", title: "Suministros de oficina", text: "La empresa nace como A.G. Office Supply, S.R.L., dedicada a la venta de suministros y materiales para oficinas." },
  { year: "2014", title: "Giro a la conversión de papel", text: "Se especializa en fabricación, conversión y distribución de desechables de papel. Pasa a llamarse A.G. Supply, S.R.L." },
  { year: "Hoy", title: "Planta propia en Santiago", text: "Nave en el sector Las Palomas con capacidad para procesar 400 toneladas de papel al mes y dos marcas propias." },
];

const STEPS = [
  { icon: Recycle, title: "Rebobinado", text: "La bobina de papel crudo se rebobina al diámetro y la tensión de cada formato." },
  { icon: Scissors, title: "Corte", text: "Se corta al ancho y largo de hoja del producto: higiénico, toalla, servilleta o facial." },
  { icon: Layers, title: "Doblado e interfoliado", text: "Doblez dinner, cocktail, tall fold, C-fold o interfoliado según la línea." },
  { icon: PackageCheck, title: "Empaque", text: "Empaque primario y fardo, etiquetado y preparación del pedido para despacho." },
];

export default async function NosotrosPage() {
  const brands = await getBrands();
  const ocean = brands.find((b) => b.slug === "ocean-breeze");
  const bonche = brands.find((b) => b.slug === "bonche");
  const { company } = siteConfig;

  const heroStats: { k: React.ReactNode; v: string }[] = [
    { k: `${company.foundedYear}`, v: "año de fundación" },
    { k: <CountUp to={400} suffix=" t" />, v: "de papel al mes" },
    { k: <CountUp to={2} />, v: "marcas propias" },
    { k: "Nacional", v: "cobertura + Caribe" },
  ];

  const plantStats = [
    { icon: Gauge, k: "400 t/mes", v: "capacidad de procesamiento de papel" },
    { icon: Building2, k: `${company.plant.landM2.toLocaleString("es-DO")} m²`, v: "de terreno" },
    { icon: Boxes, k: `${company.plant.builtM2.toLocaleString("es-DO")} m²`, v: `construidos · ${company.plant.officeM2} oficinas + ${company.plant.productionM2} producción` },
  ];

  return (
    <>
      {/* ============================================================== HERO */}
      <section className="relative isolate overflow-hidden text-white">
        <BackgroundCarousel
          images={[
            { src: "/images/placeholders/section-nosotros.webp", alt: "Fachada de AG Supply en Las Palomas, Santiago" },
          ]}
          overlay="brand"
        />
        <Container className="relative py-20 md:py-28">
          <h1 className="max-w-3xl text-white">
            Fabricamos aquí lo que tu operación consume todos los días
          </h1>
          <p className="mt-4 font-heading text-2xl italic text-white">
            {siteConfig.slogan}
          </p>
          <p className="mt-5 max-w-2xl text-lg text-white/95">
            AG Supply SRL es una convertidora de papel dominicana con planta en el
            sector Las Palomas, Santiago. Transformamos bobinas y materia prima en
            productos terminados de higiene bajo las marcas Ocean Breeze y Bonche,
            con vocación de servir a toda la región del Caribe.
          </p>
        </Container>
        <div className="relative border-t border-white/15 bg-brand-blue-dark/70">
          <Container className="grid grid-cols-2 divide-x divide-white/15 md:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.v} className="px-4 py-5 md:px-6">
                <p className="font-heading text-2xl font-bold text-white md:text-3xl">
                  {s.k}
                </p>
                <p className="mt-0.5 text-xs text-white/90 md:text-sm">{s.v}</p>
              </div>
            ))}
          </Container>
        </div>
      </section>

      {/* ========================================================= TIMELINE */}
      <Section>
        <Reveal>
          <SectionHeading title="De suministros de oficina a convertidora de papel" />
        </Reveal>
        <Reveal as="ol" className="relative mt-12 grid gap-8 md:grid-cols-3">
          <span
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden h-0.5 bg-brand-blue-100 md:block"
          />
          {TIMELINE.map((m, i) => (
            <li key={m.year} className="relative">
              <span className="panel-icon relative z-10 size-14 rounded-2xl font-heading text-lg font-bold">
                {i + 1}
              </span>
              <p className="mt-4 font-heading text-4xl font-bold leading-none text-brand-blue">
                {m.year}
              </p>
              <p className="mt-2 font-heading text-lg font-semibold text-ink">
                {m.title}
              </p>
              <p className="mt-1 text-sm text-body">{m.text}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      {/* ==================================================== PLANT (feature band) */}
      <div className="relative isolate text-white">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/images/placeholders/section-manufactura.webp"
            alt="Planta de conversión de AG Supply en Las Palomas"
            fill
            sizes="100vw"
            draggable={false}
            className="object-cover"
          />
          <div className="absolute inset-0 hero-scrim-deep" />
        </div>
        <Section>
          <div className="max-w-2xl">
            <div>
              <h2 className="text-white">
                Una nave pensada para producir y despachar
              </h2>
              <p className="mt-4 text-lg text-white/95">
                200 m² de oficinas y 800 m² de producción y almacenamiento, en una
                ubicación logística privilegiada.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {plantStats.map((s) => (
                  <div key={s.v} className="panel-quiet p-4">
                    <s.icon className="size-5 text-white" aria-hidden />
                    <p className="mt-2 font-heading text-xl font-bold text-white">
                      {s.k}
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-white/90">
                      {s.v}
                    </p>
                  </div>
                ))}
              </div>

              <ul className="mt-6 flex flex-col gap-2.5 text-sm text-white/95">
                {[
                  { icon: Route, t: company.plant.proximity[0] },
                  { icon: Route, t: company.plant.proximity[1] },
                  { icon: Plane, t: company.plant.proximity[2] },
                ].map((p) => (
                  <li key={p.t} className="flex items-center gap-2.5">
                    <p.icon className="size-4 shrink-0 text-white" aria-hidden />
                    {p.t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </div>

      {/* ================================================== MISSION / VISION */}
      <Section>
        <Reveal>
          <SectionHeading title="Nuestra razón de ser" />
        </Reveal>
        <Reveal className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            { icon: Target, label: "Misión", body: siteConfig.mission },
            { icon: Eye, label: "Visión", body: siteConfig.vision },
          ].map((c) => (
            <div key={c.label} className="panel p-8">
              <span className="panel-icon size-12">
                <c.icon className="size-6" aria-hidden />
              </span>
              <p className="mt-4 font-heading text-lg font-bold text-ink">
                {c.label}
              </p>
              <p className="mt-2 leading-relaxed text-body">{c.body}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      {/* ================================================ PROPUESTA (red band) */}
      <div className="bg-red-gradient text-white">
        <Container className="py-16 text-center md:py-20">
          <p className="mx-auto max-w-3xl font-heading text-2xl leading-snug md:text-3xl">
            «{siteConfig.valueProp}»
          </p>
        </Container>
      </div>

      {/* =========================================================== VALUES */}
      <Section className="bg-surface">
        <SectionHeading title="Seis valores que sostienen la operación" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.values.map((v) => (
            <div key={v.name} className="panel p-6">
              <span className="block h-1 w-8 rounded-full bg-brand-blue" />
              <p className="mt-4 font-heading text-lg font-semibold text-ink">
                {v.name}
              </p>
              <p className="mt-1.5 text-sm text-body">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ================================================ CONVERSION PROCESS */}
      <div className="bg-brand-blue-50">
        <Section>
          <SectionHeading
            title="De bobina a producto terminado"
            intro="Esto es lo que nos separa de un revendedor: el producto se hace aquí."
          />
          <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <span
              aria-hidden
              className="absolute left-0 right-0 top-6 hidden h-0.5 bg-brand-blue-200 lg:block"
            />
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="panel-icon relative z-10 size-12 font-heading text-lg font-bold">
                  {i + 1}
                </span>
                <div className="mt-4 flex items-center gap-2">
                  <step.icon className="size-5 text-brand-blue-dark" aria-hidden />
                  <p className="font-heading font-semibold text-ink">
                    {step.title}
                  </p>
                </div>
                <p className="mt-1 text-sm text-body">{step.text}</p>
              </li>
            ))}
          </ol>
          <Button asChild className="mt-10">
            <Link href="/nosotros/planta">
              Ver el proceso en planta <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Section>
      </div>

      {/* =========================================================== BRANDS */}
      <Section className="border-t border-border pb-0">
        <SectionHeading
          title="Por qué existen dos líneas"
          intro="Cada marca sirve a un público. Ninguna es «mejor»: son operaciones distintas con necesidades distintas."
        />
      </Section>
      <BrandSplit
        oceanBreeze={{
          slug: "ocean-breeze",
          name: "Ocean Breeze",
          tag: "Premium · Hoteles, restaurantes y cadenas",
          body: ocean?.short,
        }}
        bonche={{
          slug: "bonche",
          name: "Bonche",
          tag: "Económica · Consumo masivo y uso cotidiano",
          body: bonche?.short,
        }}
      />

      {/* ========================================================= CTA band */}
      <div className="bg-brand-gradient text-white">
        <Container className="py-16 text-center md:py-20">
          <h2 className="mx-auto max-w-2xl text-white">
            ¿Listo para abastecer tu operación con el fabricante?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-white/95">
            Coordinamos volúmenes, formatos y entrega en el tiempo acordado, en
            todo el país.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-white text-brand-blue hover:bg-brand-blue-50"
            >
              <Link href="/productos">
                Ver catálogo <ArrowRight className="size-5" />
              </Link>
            </Button>
            <WhatsAppButton size="lg" />
          </div>
        </Container>
      </div>
    </>
  );
}
