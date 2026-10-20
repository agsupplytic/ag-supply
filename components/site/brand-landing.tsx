import Link from "next/link";
import Image from "next/image";
import { getBrand, getCategories, getProducts } from "@/lib/content";
import { Container } from "./container";
import { Section, SectionHeading } from "./section";
import { Breadcrumbs } from "./breadcrumbs";
import { ProductRow, ROW_COLS } from "./product-row";
import { ClosingCta } from "./closing-cta";
import { Photo } from "./photo";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "./whatsapp-button";
import { cn } from "@/lib/utils";
import type { BrandSlug } from "@/lib/content/types";

type Props = {
  slug: Extract<BrandSlug, "ocean-breeze" | "bonche">;
  headline: string;
  subhead: string;
  audience: string[];
  features: { title: string; text: string }[];
};

/**
 * Página de marca. Cada marca conserva su identidad y su composición propia:
 *  - Ocean Breeze: fondo celeste y logotipo protagonista (línea institucional).
 *  - Bonche: banda verde con fotografía de producto (línea de consumo masivo).
 * Ambas dicen con claridad que AG Supply es quien las fabrica.
 */
export async function BrandLanding({ slug, headline, subhead, audience, features }: Props) {
  const [brand, products, categories] = await Promise.all([
    getBrand(slug),
    getProducts({ brand: slug }),
    getCategories(),
  ]);
  const ocean = slug === "ocean-breeze";
  const name = brand?.name ?? "";
  const byCategory = categories
    .map((c) => ({ c, n: products.filter((p) => p.category === c.slug).length }))
    .filter((x) => x.n > 0);

  const crumbs = [{ name: "Inicio", href: "/" }, { name: "Marcas" }, { name }];

  return (
    <>
      {ocean ? (
        <section className="border-b-4 border-ocean bg-ocean-50">
          <Container className="grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <Image
              src="/images/brand/ocean-breeze-logo.webp"
              alt="Logotipo Ocean Breeze"
              width={560}
              height={350}
              priority
              className="mx-auto h-auto w-full max-w-md"
            />
            <div>
              <Breadcrumbs items={crumbs} className="mb-5" />
              <h1 className="!text-ocean">{headline}</h1>
              <p className="mt-4 max-w-xl text-lg text-body">{subhead}</p>
              <p className="label mt-5 text-muted">Fabricada por AG Supply · Santiago, República Dominicana</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-ocean hover:bg-ocean/90">
                  <Link href={`/productos?marca=${slug}`}>Ver productos {name}</Link>
                </Button>
                <WhatsAppButton size="lg" />
              </div>
            </div>
          </Container>
        </section>
      ) : (
        <section className="bg-bonche text-white">
          <Container className="grid items-center gap-8 py-10 md:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div>
              <Breadcrumbs items={crumbs} className="mb-5 [&_*]:!text-white/90" />
              <div className="inline-block bg-white p-3">
                <Image
                  src="/images/brand/bonche-logo.webp"
                  alt="Logotipo Bonche Servilletas"
                  width={220}
                  height={138}
                  priority
                  className="h-auto w-48"
                />
              </div>
              <h1 className="mt-6 !text-white">{headline}</h1>
              <p className="mt-4 max-w-xl text-lg text-white/95">{subhead}</p>
              <p className="label mt-5 text-white/90">Fabricada por AG Supply · Santiago, República Dominicana</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="light" className="text-bonche-dark">
                  <Link href={`/productos?marca=${slug}`}>Ver productos {name}</Link>
                </Button>
                <WhatsAppButton size="lg" />
              </div>
            </div>
            <Photo
              src="/images/fotos/brand-bonche-hero.webp"
              alt="Servilletas Bonche en su empaque"
              ratio="3/2"
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
            />
          </Container>
        </section>
      )}

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <SectionHeading title={`${name} en una línea`} intro={brand?.description} />
            <h3 className="label mt-8 text-muted">A quién atiende</h3>
            <p className="mt-2 text-lg text-ink">{audience.join(" · ")}</p>
          </div>
          <div>
            <h3 className="label text-muted">Qué incluye hoy el catálogo</h3>
            <table className="spec-table mt-3">
              <tbody>
                {byCategory.map(({ c, n }) => (
                  <tr key={c.slug}>
                    <th scope="row" className="!normal-case !tracking-normal !text-base !font-semibold !text-ink">
                      <Link href={`/productos/${c.slug}?marca=${slug}`} className="hover:text-brand-blue-dark hover:underline">
                        {c.name}
                      </Link>
                    </th>
                    <td>{n} {n === 1 ? "producto" : "productos"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <dl className="mt-12 grid gap-x-10 gap-y-0 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className={cn("border-t-2 py-4", ocean ? "border-ocean" : "border-bonche")}>
              <dt className="font-heading text-xl font-semibold text-ink">{f.title}</dt>
              <dd className="mt-1 text-body">{f.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="surface">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            title={`Productos ${name}`}
            intro={`${products.length} ${products.length === 1 ? "producto" : "productos"} de esta línea en el catálogo.`}
          />
          <Button asChild variant="outline">
            <Link href={`/productos?marca=${slug}`}>Filtrar en el catálogo</Link>
          </Button>
        </div>
        {products.length > 0 ? (
          <div className="mt-8 border-y border-border bg-white">
            <div className={cn("label hidden gap-x-4 border-b-2 border-ink px-3 py-2 text-muted md:grid", ROW_COLS)} aria-hidden>
              <span>SKU</span><span>Producto</span><span>Marca</span><span>Presentación</span><span className="text-right">Cotizar</span>
            </div>
            <ul className="divide-y divide-border">
              {products.slice(0, 12).map((p) => <ProductRow key={p.slug} product={p} />)}
            </ul>
          </div>
        ) : null}
        {products.length > 12 && (
          <p className="mt-4">
            <Link href={`/productos?marca=${slug}`} className="link font-semibold">
              Ver los {products.length} productos
            </Link>
          </p>
        )}
      </Section>

      <ClosingCta
        title={`Cotice ${name}`}
        text="Arme su lista en el catálogo o consulte por referencias que aún no aparecen publicadas."
      />
    </>
  );
}
