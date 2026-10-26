import Link from "next/link";
import { Boxes, Disc3, PackageCheck, Scissors, Truck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { Photo } from "@/components/site/photo";
import { ClosingCta } from "@/components/site/closing-cta";
import { IconChip } from "@/components/site/icon-chip";
import { Button } from "@/components/ui/button";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { PLANT_PHOTOS } from "@/lib/photos";
import { pageMetadata } from "@/lib/seo";

const COPY = {
  es: {
    meta: {
      title: "Planta: conversión de papel en Santiago",
      description: "Proceso de conversión en la planta de AG Supply, Las Palomas, Santiago: bobinas, rebobinado, corte, doblado, interfoliado y empaque.",
    },
    h1: "Proceso de conversión, etapa por etapa",
    lead: "Planta de AG Supply en Las Palomas, Santiago de los Caballeros.",
    stages: [
      { icon: Boxes, photo: PLANT_PHOTOS.reels, title: "Bobinas y materia prima", text: "Entra el papel base (tissue, toalla, servilleta) en bobinas de gran diámetro, además de plásticos y material de empaque." },
      { icon: Disc3, photo: PLANT_PHOTOS.rewind, title: "Rebobinado y control de tensión", text: "La bobina madre se rebobina en rollos de trabajo con el diámetro, la tensión y el gofrado de cada línea." },
      { icon: Scissors, photo: PLANT_PHOTOS.cut, title: "Corte, doblado e interfoliado", text: "Corte al ancho y largo de hoja del producto final y doblado: dinner, cocktail, tall fold, C-fold e interfoliado de dispensación individual." },
      { icon: PackageCheck, photo: PLANT_PHOTOS.pack, title: "Empaque", text: "Empaque primario impreso o liso, agrupado por presentación (por ejemplo 12/1, 30/1 o 48/1) y etiquetado." },
      { icon: Truck, photo: PLANT_PHOTOS.dispatch, title: "Almacén y despacho", text: "Producto terminado en cajas, consolidado por pedido para su despacho." },
    ],
    see: "Ver lo que producimos",
    outro: "Del rebobinado al empaque, cada línea trabaja con las presentaciones que figuran en el catálogo. Si necesita un formato o empaque que no aparece, consúltelo con atención comercial: se evalúa cada caso.",
    closingTitle: "¿Quiere conocer la planta?",
    closingText: "Coordine una visita o consulte capacidad y formatos con atención comercial.",
    stage: "Etapa",
  },
  en: {
    meta: {
      title: "Plant: paper converting in Santiago",
      description: "Converting process at the AG Supply plant, Las Palomas, Santiago: reels, rewinding, cutting, folding, interfolding and packing.",
    },
    h1: "The converting process, stage by stage",
    lead: "AG Supply plant in Las Palomas, Santiago de los Caballeros.",
    stages: [
      { icon: Boxes, photo: PLANT_PHOTOS.reels, title: "Reels and raw material", text: "Base paper (tissue, towel, napkin) arrives in large-diameter reels, along with plastics and packaging material." },
      { icon: Disc3, photo: PLANT_PHOTOS.rewind, title: "Rewinding and tension control", text: "The parent reel is rewound into working rolls with the diameter, tension and embossing of each line." },
      { icon: Scissors, photo: PLANT_PHOTOS.cut, title: "Cutting, folding and interfolding", text: "Cut to the sheet width and length of the final product and folded: dinner, cocktail, tall fold, C-fold and single-sheet interfolded dispensing." },
      { icon: PackageCheck, photo: PLANT_PHOTOS.pack, title: "Packing", text: "Printed or plain primary packaging, grouped by pack size (for example 12/1, 30/1 or 48/1) and labelled." },
      { icon: Truck, photo: PLANT_PHOTOS.dispatch, title: "Storage and dispatch", text: "Finished product in boxes, consolidated per order for dispatch." },
    ],
    see: "See what we produce",
    outro: "From rewinding to packing, each line works with the pack sizes listed in the catalog. If you need a format or packaging that is not listed, ask our sales team: each case is evaluated.",
    closingTitle: "Want to see the plant?",
    closingText: "Arrange a visit or ask sales about capacity and formats.",
    stage: "Stage",
  },
};

export function plantMetadata(lang: Lang) {
  const c = COPY[lang].meta;
  return pageMetadata({ lang, route: { name: "plant" }, title: c.title, description: c.description });
}

export function PlantPage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const t = ui(lang);
  return (
    <>
      <PageHero
        breadcrumb={[
          { name: t.home, href: href(lang, { name: "home" }) },
          { name: t.nav.about, href: href(lang, { name: "about" }) },
          { name: t.nav.plant },
        ]}
        breadcrumbLabel={t.nav.breadcrumb}
        title={c.h1}
        lead={c.lead}
      />

      <Section>
        <ol className="space-y-6">
          {c.stages.map((s, i) => (
            <li key={s.title} className="card card-hover rise grid items-center gap-6 overflow-hidden md:grid-cols-[1fr_22rem] md:gap-10">
              <div className={`p-6 md:p-8 ${i % 2 ? "md:order-2" : ""}`}>
                <div className="flex items-center gap-3">
                  <IconChip icon={s.icon} />
                  <span className="label text-brand-blue-dark">{c.stage} {i + 1}</span>
                </div>
                <h2 className="mt-3 !text-2xl">{s.title}</h2>
                <p className="mt-3 max-w-xl text-body">{s.text}</p>
              </div>
              <Photo src={s.photo.src} alt={s.photo.alt[lang]} ratio="4/3" sizes="(max-width: 768px) 100vw, 352px" className={`!rounded-none ${i % 2 ? "md:order-1" : ""}`} />
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-body">{c.outro}</p>
        <div className="mt-6">
          <Button asChild>
            <Link href={href(lang, { name: "products" })}>{c.see}</Link>
          </Button>
        </div>
      </Section>

      <ClosingCta lang={lang} title={c.closingTitle} text={c.closingText} />
    </>
  );
}
