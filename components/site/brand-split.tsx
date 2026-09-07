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
      className={`group relative isolate flex min-h-[24rem] flex-col justify-end overflow-hidden p-8 text-white md:min-h-[30rem] md:p-14 ${THEME[slug]}`}
    >
      {/* logo as an oversized graphic bleeding off the top-right — no plate */}
      <Image
        src={`/images/brand/${slug}-logo.webp`}
        alt=""
        aria-hidden
        width={1600}
        height={1000}
        priority
        draggable={false}
        className="pointer-events-none absolute -right-[12%] -top-[14%] w-[78%] opacity-25 mix-blend-soft-light transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-40 md:w-[64%]"
      />

      {/* keep the copy legible over the artwork */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/25 to-transparent"
      />

      <div className="relative">
        <p className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
          {name}
        </p>
        <p className="mt-2 text-sm font-semibold text-white/80">{tag}</p>
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
 * Full-bleed split band — the two brand lines as two doors, edge to edge, each
 * its own colour field. The brand name in large type carries the identity; the
 * logo rides behind it as oversized artwork, never boxed on white.
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
