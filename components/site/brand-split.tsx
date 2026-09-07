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
      className={`group relative isolate flex min-h-[24rem] flex-col justify-between overflow-hidden p-8 text-white md:min-h-[30rem] md:p-14 ${THEME[slug]}`}
    >
      {/* full logo, crisp, no plate */}
      <Image
        src={`/images/brand/${slug}-logo.webp`}
        alt={name}
        width={1600}
        height={1000}
        priority
        draggable={false}
        className="h-16 w-auto max-w-[70%] object-contain object-left drop-shadow-[0_3px_14px_rgba(0,0,0,0.28)] transition-transform duration-500 group-hover:scale-105 md:h-24"
      />

      <div>
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
 * its own colour field with its full logo shown crisp (no white plate) and the
 * brand name set large.
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
