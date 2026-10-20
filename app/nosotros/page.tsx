import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/site/section";
import { ClosingCta } from "@/components/site/closing-cta";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Nosotros: convertidora de papel en Santiago",
  description:
    "AG Supply SRL: fundada en 2007, convertidora de papel desde 2014, con planta en Las Palomas, Santiago. Capacidad instalada de hasta 400 t de papel al mes.",
  path: "/nosotros",
  image: {
    url: "/images/fotos/section-nosotros.webp",
    alt: "Fachada de AG Supply en Las Palomas, Santiago",
  },
});

const TIMELINE = [
  {
    year: "2007",
    title: "Suministros de oficina",
    text: `Nace como ${siteConfig.company.formerName}, dedicada a la venta de suministros y materiales para oficinas.`,
  },
  {
    year: "2014",
    title: "Giro a la conversión de papel",
    text: "Se especializa en la fabricación, conversión y distribución de desechables de papel y cambia su nombre a A.G. Supply, S.R.L.",
  },
  {
    year: "Hoy",
    title: "Planta propia en Santiago",
    text: `Nave en el sector Las Palomas con capacidad instalada de hasta ${siteConfig.company.capacityTonsMonth} toneladas de papel al mes y dos marcas propias, Ocean Breeze y Bonche.`,
  },
];

export default function NosotrosPage() {
  const { company, address } = siteConfig;
  const fmt = (n: number) => n.toLocaleString("es-DO");

  return (
    <>
      <PageHero
        breadcrumb={[{ name: "Inicio", href: "/" }, { name: "Nosotros" }]}
        title="AG Supply SRL, convertidora de papel dominicana"
        lead="Convertimos bobinas de papel en papel higiénico, toallas, servilletas, interfoliados y papel facial en nuestra planta de Las Palomas, Santiago de los Caballeros."
        image={{
          src: "/images/fotos/section-nosotros.webp",
          alt: "Fachada de AG Supply en Las Palomas, Santiago",
        }}
      />

      <Section>
        <SectionHeading title="De suministros de oficina a convertidora de papel" />
        <ol className="mt-10 divide-y divide-border border-y border-border">
          {TIMELINE.map((m) => (
            <li key={m.year} className="grid gap-2 py-6 md:grid-cols-[8rem_16rem_1fr] md:gap-8">
              <p className="font-heading text-4xl font-bold leading-none text-brand-blue">{m.year}</p>
              <h3 className="text-xl">{m.title}</h3>
              <p className="text-body">{m.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              title="La planta"
              intro="Una nave de producción y despacho con oficinas administrativas, cerca de las principales vías de acceso del país."
            />
            <p className="mt-6">
              <Button asChild variant="outline">
                <Link href="/nosotros/planta">Ver el proceso en planta</Link>
              </Button>
            </p>
          </div>
          <table className="spec-table self-start">
            <tbody>
              <tr><th scope="row">Capacidad instalada</th><td>Hasta {company.capacityTonsMonth} toneladas de papel al mes</td></tr>
              <tr><th scope="row">Terreno</th><td>{fmt(company.plant.landM2)} m²</td></tr>
              <tr><th scope="row">Construcción</th><td>{fmt(company.plant.builtM2)} m²: {company.plant.officeM2} m² de oficinas y {company.plant.productionM2} m² de producción</td></tr>
              <tr><th scope="row">Dirección</th><td>{address.line1}, {address.city}, {address.country}</td></tr>
              {company.plant.proximity.map((p, i) => (
                <tr key={p}><th scope="row">{i === 0 ? "Ubicación" : ""}</th><td>{p}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="rule-red">Misión</h2>
            <p className="mt-4 text-lg">{siteConfig.mission}</p>
          </div>
          <div>
            <h2 className="rule-red">Visión</h2>
            <p className="mt-4 text-lg">{siteConfig.vision}</p>
          </div>
        </div>
        <div className="mt-14">
          <h2 className="rule-red">Valores</h2>
          <dl className="mt-6 grid gap-x-12 md:grid-cols-2">
            {siteConfig.values.map((v) => (
              <div key={v.name} className="border-t border-border py-4">
                <dt className="font-heading text-xl font-semibold text-ink">{v.name}</dt>
                <dd className="mt-1 text-body">{v.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          title="Marcas propias"
          intro="Ocean Breeze y Bonche se fabrican en la planta de AG Supply y atienden a públicos distintos."
        />
        <ul className="mt-8 grid gap-px bg-border md:grid-cols-2">
          <li className="bg-white p-6">
            <h3>
              <Link href="/ocean-breeze" className="text-ocean hover:underline">Ocean Breeze</Link>
            </h3>
            <p className="mt-2 text-body">Línea para hoteles, restaurantes, cadenas e instituciones.</p>
          </li>
          <li className="bg-white p-6">
            <h3>
              <Link href="/bonche" className="text-bonche hover:underline">Bonche</Link>
            </h3>
            <p className="mt-2 text-body">Línea para consumo masivo y uso cotidiano.</p>
          </li>
        </ul>
      </Section>

      <ClosingCta />
    </>
  );
}
