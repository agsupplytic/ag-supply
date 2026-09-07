import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type Half = {
  slug: "ocean-breeze" | "bonche";
  name: string;
  tag: string;
  body?: string;
};

const ART: Record<
  Half["slug"],
  { photo: string; alt: string; scrim: string }
> = {
  "ocean-breeze": {
    photo: "/images/placeholders/header-productos.webp",
    alt: "Producto Ocean Breeze empacado y listo para despacho",
    scrim:
      "bg-gradient-to-t from-brand-blue-dark via-brand-blue-dark/78 via-45% to-brand-blue-dark/10",
  },
  bonche: {
    photo: "/images/placeholders/brand-bonche-hero.webp",
    alt: "Servilletas y empaques Bonche",
    scrim:
      "bg-gradient-to-t from-bonche-dark via-bonche-dark/78 via-45% to-bonche-dark/10",
  },
};

function BrandHalf({ slug, name, tag, body }: Half) {
  const art = ART[slug];
  return (
    <Link
      href={`/${slug}`}
      className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden p-8 text-white md:min-h-[32rem] md:p-14"
    >
      <Image
        src={art.photo}
        alt={art.alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        draggable={false}
        className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className={`absolute inset-0 -z-10 ${art.scrim}`} />

      {/* logo, crisp, on the photo */}
      <Image
        src={`/images/brand/${slug}-logo.webp`}
        alt={name}
        width={640}
        height={400}
        draggable={false}
        className="mb-auto h-12 w-auto max-w-[55%] object-contain object-left drop-shadow-[0_3px_14px_rgba(0,0,0,0.45)] md:h-16"
      />

      <div>
        <p className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
          {name}
        </p>
        <p className="mt-2 text-sm font-semibold text-white/85">{tag}</p>
        {body && (
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/90">
            {body}
          </p>
        )}
        <span className="mt-6 inline-flex items-center gap-2 font-heading text-sm font-semibold">
          Conocer {name}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/**
 * Full-bleed split band — the two brand lines as two doors, each a real product
 * photo under its brand colour, with the logo and name over it.
 */
export function BrandSplit({
  oceanBreeze,
  bonche,
}: {
  oceanBreeze: Half;
  bonche: Half;
}) {
  return (
    <div className="grid md:grid-cols-2">
      <BrandHalf {...oceanBreeze} />
      <BrandHalf {...bonche} />
    </div>
  );
}
