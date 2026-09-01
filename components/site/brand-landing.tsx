import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getBrand, getProducts } from "@/lib/content";
import { Section, SectionHeading } from "./section";
import { Reveal } from "./reveal";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "./whatsapp-button";
import { Container } from "./container";
import { siteConfig } from "@/lib/site-config";
import { isRealImage } from "@/lib/real-images";
import type { BrandSlug } from "@/lib/content/types";

interface BrandLandingProps {
  slug: Extract<BrandSlug, "ocean-breeze" | "bonche">;
  eyebrow?: string;
  headline: string;
  subhead: string;
  audience: string[];
  valueProps: { title: string; text: string }[];
  tone: "premium" | "value";
}

/** Per-brand hero background. Ocean Breeze has a real photo of its own boxes in
 *  the plant; Bonche has no photo yet, so its header waits on a green slot. */
const HERO: Record<
  "premium" | "value",
  { src: string; alt: string; slotFile?: string }
> = {
  premium: {
    src: "/images/placeholders/section-manufactura.webp",
    alt: "Cajas de producto Ocean Breeze en la planta de AG Supply",
  },
  value: {
    src: "",
    alt: "",
    slotFile: "brand-bonche-hero.webp",
  },
};

export async function BrandLanding({
  slug,
  headline,
  subhead,
  audience,
  valueProps,
  tone,
}: BrandLandingProps) {
  const [brand, products] = await Promise.all([
    getBrand(slug),
    getProducts({ brand: slug }),
  ]);

  const heroLogo = `/images/brand/${slug}-plate.webp`;
  const hero = HERO[tone];
  const hasPhoto = Boolean(hero.src);
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative isolate border-b border-border text-white">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {hasPhoto ? (
            <>
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                priority
                sizes="100vw"
                draggable={false}
                className="object-cover"
              />
              <div className="absolute inset-0 hero-scrim-deep" />
              {!isRealImage(hero.src) && isDev && (
                <span className="figure-note">Imagen de prueba</span>
              )}
            </>
          ) : (
            <>
              {/* Bonche: green brand wash until a real photo lands */}
              <div className="absolute inset-0 bg-bonche-gradient" />
              {isDev && (
                <span className="figure-note">{hero.slotFile}</span>
              )}
            </>
          )}
        </div>

        <Container className="relative grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <h1 className="max-w-2xl text-white">{headline}</h1>
            <p className="mt-3 font-heading text-xl italic text-white/95">
              {siteConfig.slogan}
            </p>
            <p className="mt-5 max-w-xl text-lg text-white/90">{subhead}</p>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              {audience.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white ring-1 ring-white/25"
                >
                  {a}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className={
                  tone === "premium"
                    ? "bg-white text-brand-blue hover:bg-brand-blue-50"
                    : "bg-white text-bonche-dark hover:bg-bonche-50"
                }
              >
                <Link href={`/productos?marca=${slug}`}>
                  Ver productos {brand?.name}
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <WhatsAppButton size="lg" />
            </div>
          </div>

          {/* brand logo on a clean white plate */}
          <div className="flex items-center justify-center rounded-2xl bg-white p-8 shadow-2xl">
            <Image
              src={heroLogo}
              alt={brand?.name ?? ""}
              width={460}
              height={288}
              priority
              draggable={false}
              className="h-auto w-full max-w-[22rem] object-contain"
            />
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------- positioning */}
      <Section>
        <Reveal>
          <SectionHeading
            title={
              tone === "premium"
                ? "Consistencia y presentación para el canal HORECA"
                : "Rendimiento y volumen para el canal masivo"
            }
            intro={brand?.description}
          />
        </Reveal>
        <Reveal className="mt-10 grid gap-6 md:grid-cols-3">
          {valueProps.map((v) => (
            <div
              key={v.title}
              className={
                "rounded-2xl border p-6 " +
                (tone === "premium"
                  ? "border-brand-blue-100 bg-brand-blue-50"
                  : "border-bonche-100 bg-bonche-50")
              }
            >
              <span
                className={
                  "block h-1 w-8 rounded-full " +
                  (tone === "premium" ? "bg-brand-blue" : "bg-bonche")
                }
              />
              <p className="mt-4 font-heading text-lg font-semibold text-ink">
                {v.title}
              </p>
              <p className="mt-2 text-sm text-body">{v.text}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      {/* ------------------------------------------------------------ products */}
      <Section className="border-t border-border">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            title={`Productos ${brand?.name}`}
            intro={`${products.length} productos de esta línea disponibles para cotización.`}
          />
          <Button asChild variant="outline">
            <Link href={`/productos?marca=${slug}`}>Ver todos</Link>
          </Button>
        </Reveal>
        <Reveal className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 9).map((p) => (
            <ProductCard key={p.slug} product={p} categorySlug={p.category} />
          ))}
        </Reveal>
        {products.length === 0 && (
          <p className="mt-8 text-body">
            Estamos cargando el catálogo de esta línea. Mientras tanto,{" "}
            <Link href="/contacto" className="text-brand-blue-dark underline">
              escríbenos
            </Link>{" "}
            y te compartimos las fichas.
          </p>
        )}
      </Section>

      {/* ----------------------------------------------------------- cta band */}
      <div
        className={
          "text-white " +
          (tone === "premium" ? "bg-brand-gradient" : "bg-bonche-gradient")
        }
      >
        <Section className="text-center">
          <h2 className="mx-auto max-w-xl text-white">
            ¿Abasteces con {brand?.name}? Arma tu cotización
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className={
                tone === "premium"
                  ? "bg-white text-brand-blue hover:bg-brand-blue-50"
                  : "bg-white text-bonche-dark hover:bg-bonche-50"
              }
            >
              <Link href={`/productos?marca=${slug}`}>Ir al catálogo</Link>
            </Button>
            <WhatsAppButton size="lg" />
          </div>
        </Section>
      </div>
    </>
  );
}
