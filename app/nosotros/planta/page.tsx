import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { Photo } from "@/components/site/photo";
import { ClosingCta } from "@/components/site/closing-cta";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "La planta: así se convierte el papel en Santiago",
  description:
    "Proceso de conversión en la planta de AG Supply, Las Palomas, Santiago: bobinas, rebobinado, corte, doblado, interfoliado y empaque.",
  path: "/nosotros/planta",
});

const STAGES = [
  {
    img: "/images/fotos/hero-2.webp",
    alt: "Bobinas de papel base en la nave",
    title: "Bobinas y materia prima",
    text: "Entra el papel base (tissue, toalla, servilleta) en bobinas de gran diámetro, además de plásticos y material de empaque.",
  },
  {
    img: "/images/fotos/planta-2.webp",
    alt: "Rebobinadora con una bobina de papel",
    title: "Rebobinado y control de tensión",
    text: "La bobina madre se rebobina en rollos de trabajo con el diámetro, la tensión y el gofrado de cada línea.",
  },
  {
    img: "/images/fotos/planta-3.webp",
    alt: "Máquina de corte y conversión de papel",
    title: "Corte, doblado e interfoliado",
    text: "Corte al ancho y largo de hoja del producto final y doblado: dinner, cocktail, tall fold, C-fold e interfoliado de dispensación individual.",
  },
  {
    img: "/images/fotos/planta-4.webp",
    alt: "Máquina de empaque con cajas de producto",
    title: "Empaque",
    text: "Empaque primario impreso o liso, agrupado por presentación (por ejemplo 12/1, 30/1 o 48/1) y etiquetado.",
  },
  {
    img: "/images/fotos/planta-5.webp",
    alt: "Cajas de producto terminado apiladas",
    title: "Almacén y despacho",
    text: "Producto terminado en cajas, consolidado por pedido para su despacho.",
  },
];

export default function PlantaPage() {
  return (
    <>
      <PageHero
        breadcrumb={[
          { name: "Inicio", href: "/" },
          { name: "Nosotros", href: "/nosotros" },
          { name: "La planta" },
        ]}
        title="Proceso de conversión, etapa por etapa"
        lead="Planta de AG Supply en Las Palomas, Santiago de los Caballeros."
      />

      <Section>
        <ol className="divide-y divide-border border-y border-border">
          {STAGES.map((s, i) => (
            <li key={s.title} className="grid gap-6 py-8 md:grid-cols-[3rem_1fr_20rem] md:gap-10">
              <p className="font-heading text-4xl font-bold leading-none text-brand-blue">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <h2 className="text-2xl">{s.title}</h2>
                <p className="mt-3 max-w-xl text-body">{s.text}</p>
              </div>
              <Photo src={s.img} alt={s.alt} ratio="4/3" sizes="(max-width: 768px) 100vw, 320px" />
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Button asChild>
            <Link href="/productos">Ver lo que producimos</Link>
          </Button>
        </div>
      </Section>

      <ClosingCta title="¿Quiere conocer la planta?" text="Coordine una visita o consulte capacidad y formatos con atención comercial." />
    </>
  );
}
