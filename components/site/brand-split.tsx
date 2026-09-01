import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type Half = {
  slug: "ocean-breeze" | "bonche";
  name: string;
  tag: string;
  body?: string;
};

const THEME: Record<Half["slug"], string> = {
  "ocean-breeze": "bg-brand-gradient",
  bonche: "bg-bonche-gradient",
};

function BrandHalf({ slug, name, tag, body }: Half) {
  return (
    <Link
      href={`/${slug}`}
      className={`group relative isolate flex min-h-[22rem] flex-col justify-between overflow-hidden p-8 text-white md:min-h-[28rem] md:p-14 ${THEME[slug]}`}
    >
      {/* hover wash */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-white/0 transition-colors duration-300 group-hover:bg-white/[0.06]"
      />

      {/* logo on a clean white plate */}
      <span className="inline-flex w-fit rounded-2xl bg-white p-5 shadow-xl transition-transform duration-500 group-hover:scale-[1.03] md:p-6">
        <Image
          src={`/images/brand/${slug}-plate.webp`}
          alt={name}
          width={320}
          height={200}
          draggable={false}
          className="h-12 w-auto object-contain md:h-16"
        />
      </span>

      <div className="mt-10">
        <p className="font-heading text-3xl font-bold md:text-4xl">{name}</p>
        <p className="mt-2 text-sm font-semibold text-white/80">{tag}</p>
        {body && (
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/90">
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
 * Full-bleed split band — the two brand lines as two doors, edge to edge, each
 * in its own colour with the logo crisp on white. Replaces the earlier grid of
 * small bordered cards.
 */
export function BrandSplit({ oceanBreeze, bonche }: { oceanBreeze: Half; bonche: Half }) {
  return (
    <div className="grid md:grid-cols-2">
      <BrandHalf {...oceanBreeze} />
      <BrandHalf {...bonche} />
    </div>
  );
}
