import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories, getBrands } from "@/lib/content";
import { Container } from "@/components/site/container";
import { Section, SectionHeading } from "@/components/site/section";
import { Photo } from "@/components/site/photo";
import { PageHero } from "@/components/site/page-hero";
import { CategoryList } from "@/components/site/category-list";
import { BrandPanels } from "@/components/site/brand-panels";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { siteConfig, distributors } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AG Supply — Convertidora de papel en Santiago, República Dominicana",
  absolute: true,
  description:
    "Convertidora de papel en Santiago, RD. Fabricamos papel higiénico, toallas, servilletas, interfoliados y papel facial. Marcas Ocean Breeze y Bonche.",
  path: "/",
});

const PROCESS = [
  { title: "Bobinas y materia prima", text: "Recibimos papel base en bobinas de gran diámetro, más el material de empaque." },
  { title: "Rebobinado y corte", text: "Cada bobina se rebobina y se corta al ancho y largo de hoja del producto final." },
  { title: "Doblado e interfoliado", text: "Doblez dinner, cocktail, tall fold, C-fold o interfoliado, según la referencia." },
  { title: "Empaque y despacho", text: "Empaque primario, agrupado por presentación, etiquetado y preparado por pedido." },
];

const QUOTE_STEPS = [
  "Filtre el catálogo por categoría, marca o presentación y agregue productos.",
  "Ajuste las cantidades y deje una nota por producto si hace falta.",
  "Envíe la lista por WhatsApp: el mensaje sale armado con sus referencias.",
];

export default async function HomePage() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);
  const made = categories.filter((c) => c.fabricated);
  const supplied = categories.filter((c) => !c.fabricated);
  const ocean = brands.find((b) => b.slug === "ocean-breeze");
  const bonche = brands.find((b) => b.slug === "bonche");
  const { company } = siteConfig;
  const fmt = (n: number) => n.toLocaleString("es-DO");

  return (
    <>
      <PageHero
        title="Convertidora de papel en Santiago, República Dominicana"
        lead={
          <>
            Fabricamos papel higiénico, toallas de papel, servilletas, interfoliados y papel facial
            para hoteles, restaurantes, comercios y distribuidores. Marcas propias: Ocean Breeze y
            Bonche.
            <span className="mt-4 block font-heading text-xl font-semibold italic text-white">
              {siteConfig.slogan}
            </span>
          </>
        }
        actions={
          <>
            <Button asChild size="lg" variant="light">
              <Link href="/productos">
                Ver catálogo <ArrowRight aria-hidden />
              </Link>
            </Button>
            <WhatsAppButton size="lg">Cotizar por WhatsApp</WhatsAppButton>
          </>
        }
        image={{
          src: "/images/fotos/hero-2.webp",
          alt: "Bobinas de papel base almacenadas en la nave de conversión",
        }}
      />

      {/* ------------------------------------------------ ficha de la empresa */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              title="Una planta propia, un proceso de conversión"
              intro="El producto se convierte en la nave de Las Palomas, a partir de bobinas de papel base. Eso permite definir formato, metraje y presentación por pedido."
            />
            <Photo
              src="/images/fotos/planta-3.webp"
              alt="Máquina de corte y rebobinado en la planta de AG Supply"
              ratio="3/2"
              className="mt-8"
            />
          </div>
          <div>
            <h3 className="label text-muted">Datos de la empresa</h3>
            <table className="spec-table mt-3">
              <tbody>
                <tr><th scope="row">Razón social</th><td>{siteConfig.legalName}</td></tr>
                <tr><th scope="row">Fundación</th><td>{company.foundedYear}, como {company.formerName}</td></tr>
                <tr><th scope="row">Conversión de papel</th><td>Desde {company.pivotYear}</td></tr>
                <tr><th scope="row">Capacidad instalada</th><td>Hasta {company.capacityTonsMonth} toneladas de papel al mes</td></tr>
                <tr><th scope="row">Planta</th><td>{fmt(company.plant.builtM2)} m² construidos en {fmt(company.plant.landM2)} m² de terreno ({company.plant.productionM2} m² de producción)</td></tr>
                <tr><th scope="row">Ubicación</th><td>{siteConfig.address.line1}, {siteConfig.address.city}</td></tr>
                <tr><th scope="row">Acceso</th><td>{company.plant.proximity.join("; ")}</td></tr>
                <tr><th scope="row">Marcas propias</th><td>Ocean Breeze · Bonche</td></tr>
              </tbody>
            </table>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/nosotros">Conocer la empresa</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/nosotros/planta">Ver el proceso en planta</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ qué fabricamos */}
      <Section tone="surface">
        <SectionHeading
          title="Qué fabricamos"
          intro="Papel tissue convertido en la planta de Santiago. Cada categoría tiene su propio catálogo con presentaciones y referencias."
        />
        <div className="mt-10">
          <CategoryList categories={made} />
        </div>
        <h3 className="mt-14 text-xl">También suministramos</h3>
        <p className="mt-2 max-w-2xl text-body">
          Complementos para la misma operación. No se fabrican en nuestra planta: los suministra AG Supply.
        </p>
        <div className="mt-6">
          <CategoryList categories={supplied} />
        </div>
      </Section>

      {/* --------------------------------------------------------- proceso */}
      <Section>
        <SectionHeading title="Cómo se convierte el papel" />
        <ol className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((s, i) => (
            <li key={s.title} className="bg-white py-2 pr-6 sm:p-6 sm:first:pl-0 lg:py-0">
              <p className="font-heading text-5xl font-bold leading-none text-brand-blue">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-xl">{s.title}</h3>
              <p className="mt-2 text-body">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ----------------------------------------------------------- marcas */}
      <Section tone="surface">
        <SectionHeading
          title="Dos marcas propias, una sola planta"
          intro="Ocean Breeze atiende al canal institucional; Bonche, al consumo masivo. Las dos se fabrican en AG Supply."
        />
        <div className="mt-10">
          <BrandPanels
            ocean={{
              slug: "ocean-breeze",
              name: "Ocean Breeze",
              audience: "Hoteles, restaurantes y cadenas",
              body: ocean?.short ?? "",
              count: ocean?.count ?? 0,
            }}
            bonche={{
              slug: "bonche",
              name: "Bonche",
              audience: "Consumo masivo y uso cotidiano",
              body: bonche?.short ?? "",
              count: bonche?.count ?? 0,
            }}
          />
        </div>
      </Section>

      {/* ------------------------------------------------- distribución */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              title="Venta directa y distribuidores autorizados"
              intro="Atendemos pedidos de hoteles, restaurantes, comercios e instituciones. Además, los productos se consiguen a través de distribuidores autorizados."
            />
            <p className="mt-6">
              <Link href="/contacto" className="link font-semibold">
                Ver distribuidores y datos de contacto
              </Link>
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t-2 border-ink pt-5">
            {distributors.map((z) => (
              <div key={z.zone}>
                <dt className="label text-muted">{z.zone}</dt>
                <dd className="mt-1 font-heading text-2xl font-semibold text-ink">
                  {z.items.length} {z.items.length === 1 ? "distribuidor" : "distribuidores"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* ----------------------------------------------------------- cotizar */}
      <section className="bg-navy text-white on-navy">
        <Container className="grid gap-10 py-14 md:py-16 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <h2 className="rule-red !text-white">Solicite su cotización</h2>
            <ol className="mt-6 space-y-3 text-lg">
              {QUOTE_STEPS.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="font-heading text-2xl font-bold leading-snug text-brand-blue-200">{i + 1}</span>
                  <span className="text-navy-300">{s}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="light">
                <Link href="/productos">Empezar cotización</Link>
              </Button>
              <WhatsAppButton size="lg" />
            </div>
          </div>
          <div>
            <h3 className="label text-navy-300">Atención comercial</h3>
            <address className="mt-4 space-y-2 text-lg not-italic">
              {siteConfig.phones.map((p) => (
                <p key={p.tel}>
                  <a href={`tel:${p.tel}`} className="font-heading text-2xl font-semibold hover:underline">{p.value}</a>
                  <span className="text-navy-300"> · {p.label}</span>
                </p>
              ))}
              <p><a href={`mailto:${siteConfig.email}`} className="hover:underline">{siteConfig.email}</a></p>
              <p className="text-navy-300">{siteConfig.hours.label}</p>
            </address>
          </div>
        </Container>
      </section>
    </>
  );
}
