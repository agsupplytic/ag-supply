import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { BackgroundCarousel } from "@/components/site/background-carousel";
import { Figure } from "@/components/site/figure";
import { PendingContent } from "@/components/site/pending-content";
import { Button } from "@/components/ui/button";
import { ogFor } from "@/lib/seo";

const PLANTA_DESC =
  "El proceso de conversión de AG Supply en Las Palomas, Santiago: rebobinado, corte, doblado, interfoliado y empaque.";

export const metadata: Metadata = {
  title: "La planta",
  description: PLANTA_DESC,
  alternates: { canonical: "/nosotros/planta" },
  openGraph: ogFor("La planta — AG Supply", PLANTA_DESC),
};

const STAGES = [
  {
    img: "/images/placeholders/planta-1.webp",
    title: "Recepción de bobina y materia prima",
    text: "Entra el papel base (tissue, toalla, servilleta) en bobinas de gran diámetro, además de plásticos y material de empaque.",
  },
  {
    img: "/images/placeholders/planta-2.webp",
    title: "Rebobinado y control de tensión",
    text: "La bobina madre se rebobina en rollos de trabajo con el diámetro, la tensión y el gofrado de cada línea.",
  },
  {
    img: "/images/placeholders/planta-3.webp",
    title: "Corte a formato",
    text: "Corte al ancho y largo de hoja del producto final: 24 m, 35 m, 350 hojas, C-fold 24/100, dinner 20/150, etc.",
  },
  {
    img: "/images/placeholders/planta-4.webp",
    title: "Doblado e interfoliado",
    text: "Servilletas dinner, cocktail, tall fold; toallas multifold y C-fold; faciales y servilletas interfoliadas de dispensación individual.",
  },
  {
    img: "/images/placeholders/planta-5.webp",
    title: "Empaque y fardo",
    text: "Empaque primario impreso o liso, agrupado en fardo o caja, etiquetado y consolidado por pedido.",
  },
];

export default function PlantaPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <BackgroundCarousel
          images={[
            { src: "/images/placeholders/section-manufactura.webp", alt: "Línea de conversión" },
            { src: "/images/placeholders/planta-2.webp", alt: "Rebobinado" },
            { src: "/images/placeholders/planta-4.webp", alt: "Doblado" },
          ]}
          overlay="brand"
        />
        <Container className="relative py-16 md:py-24">
          <nav className="text-sm text-white/90">
            <Link href="/nosotros" className="hover:text-white">
              Nosotros
            </Link>{" "}
            / La planta
          </nav>
          <h1 className="mt-3 max-w-3xl text-white">
            El proceso de conversión, etapa por etapa
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">
            Planta de AG Supply en Las Palomas, Santiago.
          </p>
        </Container>
      </section>

      <Section>
        <PendingContent label="Fotografía de planta" className="mb-10 w-full">
          Las imágenes de esta página son de prueba. Deben reemplazarse por
          fotografía real de la planta y de la línea de producción antes de
          publicar (ver docs/COPY-NEEDED.md).
        </PendingContent>

        <ol className="space-y-6">
          {STAGES.map((stage, i) => (
            <li
              key={stage.title}
              className="grid gap-6 rounded-2xl border border-border bg-white p-4 md:grid-cols-[280px_1fr] md:items-center md:p-6"
            >
              <Figure
                src={stage.img}
                alt={stage.title}
                className="aspect-4/3"
                sizes="(max-width: 768px) 100vw, 280px"
              >
                <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-lg bg-white/90 font-heading text-lg font-bold text-brand-blue">
                  {i + 1}
                </span>
              </Figure>
              <div>
                <h2 className="text-xl">{stage.title}</h2>
                <p className="mt-2 text-body">{stage.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Button asChild>
            <Link href="/productos">Ver lo que producimos</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
