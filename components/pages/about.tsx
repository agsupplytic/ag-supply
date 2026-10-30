import Link from "next/link";
import { Briefcase, Eye, Gauge, HeartHandshake, Lightbulb, MapPin, ShieldCheck, Sparkles, Target, Users, Building2 } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/site/section";
import { ClosingCta } from "@/components/site/closing-cta";
import { IconChip } from "@/components/site/icon-chip";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { textFor } from "@/lib/i18n/site-text";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { PLANT_PHOTOS } from "@/lib/photos";
import { pageMetadata } from "@/lib/seo";

const VALUE_ICONS = [HeartHandshake, Users, Gauge, Sparkles, ShieldCheck, Lightbulb];

const COPY = {
  es: {
    meta: {
      title: "Nosotros: convertidora de papel en Santiago",
      description: "AG Supply SRL: fundada en 2015, convertidora de papel con tres naves en Las Palomas, Santiago. Capacidad instalada de hasta 400 t de papel al mes.",
    },
    h1: "AG Supply SRL, convertidora de papel dominicana",
    lead: "Convertimos bobinas de papel en papel higiénico, toallas, servilletas, interfoliados y papel facial en nuestra planta de Las Palomas, Santiago de los Caballeros.",
    timelineTitle: "De suministros de oficina a convertidora de papel",
    timeline: (former: string, tons: number) => [
      { icon: Briefcase, year: "2015", title: "Suministros de oficina", text: `Nace como ${former}, dedicada a la venta de suministros y materiales para oficinas.` },
      { icon: Building2, year: "Hoy", title: "Planta propia en Santiago", text: `Tres naves en el sector Las Palomas con capacidad instalada de hasta ${tons} toneladas de papel al mes y dos marcas propias, Ocean Breeze y Bonche.` },
    ],
    plantTitle: "La planta",
    plantIntro: "Tres naves en el sector Las Palomas, con áreas de producción, despacho y oficinas administrativas, cerca de las principales vías de acceso del país.",
    seePlant: "Ver el proceso en planta",
    rows: { capacity: "Capacidad instalada", land: "Terreno", built: "Construcción", address: "Dirección", location: "Ubicación" },
    capacityValue: (t: number) => `Hasta ${t} toneladas de papel al mes`,
    builtValue: (b: string, o: number, p: number) => `${b} m²: ${o} m² de oficinas y ${p} m² de producción`,
    mission: "Misión",
    vision: "Visión",
    values: "Valores",
    brandsTitle: "Marcas propias",
    brandsIntro: "Ocean Breeze y Bonche se fabrican en la planta de AG Supply y atienden a públicos distintos.",
    ocean: "Línea para hoteles, restaurantes, cadenas e instituciones.",
    bonche: "Línea para consumo masivo y uso cotidiano.",
  },
  en: {
    meta: {
      title: "About us: paper converter in Santiago",
      description: "AG Supply SRL: founded in 2015, a paper converter with three buildings in Las Palomas, Santiago. Installed capacity of up to 400 t of paper per month.",
    },
    h1: "AG Supply SRL, a Dominican paper converter",
    lead: "We convert paper reels into toilet paper, paper towels, napkins, interfolded towels and facial tissue at our plant in Las Palomas, Santiago de los Caballeros.",
    timelineTitle: "From office supplies to paper converter",
    timeline: (former: string, tons: number) => [
      { icon: Briefcase, year: "2015", title: "Office supplies", text: `Founded as ${former}, dedicated to selling office supplies and materials.` },
      { icon: Building2, year: "Today", title: "Own plant in Santiago", text: `Three buildings in the Las Palomas district with installed capacity of up to ${tons} tonnes of paper per month and two own brands, Ocean Breeze and Bonche.` },
    ],
    plantTitle: "The plant",
    plantIntro: "Three buildings in the Las Palomas district, with production, dispatch and administrative office areas, close to the country's main access roads.",
    seePlant: "See the plant process",
    rows: { capacity: "Installed capacity", land: "Land", built: "Built area", address: "Address", location: "Location" },
    capacityValue: (t: number) => `Up to ${t} tonnes of paper per month`,
    builtValue: (b: string, o: number, p: number) => `${b} m²: ${o} m² of offices and ${p} m² of production`,
    mission: "Mission",
    vision: "Vision",
    values: "Values",
    brandsTitle: "Own brands",
    brandsIntro: "Ocean Breeze and Bonche are made at the AG Supply plant and serve different audiences.",
    ocean: "Line for hotels, restaurants, chains and institutions.",
    bonche: "Line for mass consumption and everyday use.",
  },
};

export function aboutMetadata(lang: Lang) {
  const c = COPY[lang].meta;
  return pageMetadata({
    lang, route: { name: "about" }, title: c.title, description: c.description,
    image: { url: PLANT_PHOTOS.facade.src, alt: PLANT_PHOTOS.facade.alt[lang] },
  });
}

export function AboutPage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const t = ui(lang);
  const tt = textFor(lang);
  const { company } = siteConfig;
  const fmt = (n: number) => n.toLocaleString(lang === "es" ? "es-DO" : "en-US");

  return (
    <>
      <PageHero
        breadcrumb={[{ name: t.home, href: href(lang, { name: "home" }) }, { name: t.nav.about }]}
        breadcrumbLabel={t.nav.breadcrumb}
        title={c.h1}
        lead={c.lead}
        image={{ src: PLANT_PHOTOS.facade.src, alt: PLANT_PHOTOS.facade.alt[lang] }}
      />

      <Section>
        <SectionHeading title={c.timelineTitle} />
        <ol className="relative mt-10 grid gap-5 md:grid-cols-3">
          {c.timeline(company.formerName, company.capacityTonsMonth).map((m, i) => (
            <li key={m.year} className="card card-hover rise relative p-6" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="flex items-center justify-between">
                <IconChip icon={m.icon} />
                <span className="font-heading text-4xl font-extrabold leading-none text-brand-blue">{m.year}</span>
              </div>
              <h3 className="mt-4 !text-xl">{m.title}</h3>
              <p className="mt-2 text-body">{m.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="soft">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading title={c.plantTitle} intro={c.plantIntro} />
            <p className="mt-6">
              <Button asChild variant="outline">
                <Link href={href(lang, { name: "plant" })}>{c.seePlant}</Link>
              </Button>
            </p>
          </div>
          <div className="card self-start p-5">
            <table className="spec-table">
              <tbody>
                <tr><th scope="row">{c.rows.capacity}</th><td>{c.capacityValue(company.capacityTonsMonth)}</td></tr>
                <tr><th scope="row">{c.rows.land}</th><td>{fmt(company.plant.landM2)} m²</td></tr>
                <tr><th scope="row">{c.rows.built}</th><td>{c.builtValue(fmt(company.plant.builtM2), company.plant.officeM2, company.plant.productionM2)}</td></tr>
                <tr><th scope="row">{c.rows.address}</th><td>{tt.address.line1}, {tt.address.city}, {tt.address.country}</td></tr>
                <tr>
                  <th scope="row">{c.rows.location}</th>
                  <td>
                    {tt.proximity.map((p) => (
                      <span key={p} className="flex items-start gap-1.5">
                        <MapPin className="mt-1 size-3.5 shrink-0 text-brand-blue" aria-hidden />
                        {p}
                      </span>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card p-6">
            <IconChip icon={Target} />
            <h2 className="mt-4 !text-2xl">{c.mission}</h2>
            <p className="mt-3 text-lg">{tt.mission}</p>
          </div>
          <div className="card p-6">
            <IconChip icon={Eye} />
            <h2 className="mt-4 !text-2xl">{c.vision}</h2>
            <p className="mt-3 text-lg">{tt.vision}</p>
          </div>
        </div>
        <h2 className="rule-red mt-14">{c.values}</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tt.values.map((v, i) => {
            const Icon = VALUE_ICONS[i] ?? Sparkles;
            return (
              <li key={v.name} className="card card-hover rise flex gap-4 p-5" style={{ animationDelay: `${(i % 3) * 60}ms` }}>
                <IconChip icon={Icon} />
                <div>
                  <h3 className="!text-lg">{v.name}</h3>
                  <p className="mt-1 text-body">{v.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section tone="soft">
        <SectionHeading title={c.brandsTitle} intro={c.brandsIntro} />
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          <li className="card card-hover p-6">
            <h3><Link href={href(lang, { name: "oceanBreeze" })} className="text-ocean hover:underline">Ocean Breeze</Link></h3>
            <p className="mt-2 text-body">{c.ocean}</p>
          </li>
          <li className="card card-hover p-6">
            <h3><Link href={href(lang, { name: "bonche" })} className="text-bonche hover:underline">Bonche</Link></h3>
            <p className="mt-2 text-body">{c.bonche}</p>
          </li>
        </ul>
      </Section>

      <ClosingCta lang={lang} />
    </>
  );
}
