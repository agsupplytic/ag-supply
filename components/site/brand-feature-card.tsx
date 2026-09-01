import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const BRAND_LOGO_SRC: Record<"ocean-breeze" | "bonche", string> = {
  "ocean-breeze": "/images/brand/ocean-breeze-plate.webp",
  bonche: "/images/brand/bonche-plate.webp",
};

/** Each card follows its own logo's palette, but kept LIGHT: a soft tinted foot,
 *  not a saturated band. The logo sits on its natural white plate up top (both
 *  logos use white as a design colour and can't be keyed out). */
const THEME: Record<
  "ocean-breeze" | "bonche",
  { foot: string; rule: string; kicker: string; cta: string }
> = {
  "ocean-breeze": {
    foot: "bg-brand-blue-50",
    rule: "bg-brand-blue",
    kicker: "text-brand-blue-dark",
    cta: "text-brand-blue-dark",
  },
  bonche: {
    foot: "bg-bonche-50",
    rule: "bg-bonche",
    kicker: "text-bonche-dark",
    cta: "text-bonche-dark",
  },
};

export function BrandFeatureCard({
  slug,
  name,
  tag,
  body,
}: {
  slug: "ocean-breeze" | "bonche";
  name: string;
  tag: string;
  body?: string;
}) {
  const src = BRAND_LOGO_SRC[slug];
  const t = THEME[slug];

  return (
    <Link
      href={`/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* logo on its white plate */}
      <div className="relative aspect-16/10 overflow-hidden bg-white">
        <Image
          src={src}
          alt={name}
          fill
          draggable={false}
          sizes="(max-width: 768px) 100vw, 520px"
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      {/* soft tinted foot carries the copy */}
      <div className={`flex flex-1 flex-col p-7 ${t.foot}`}>
        <span className={`block h-1 w-10 rounded-full ${t.rule}`} />
        <p className="mt-4 font-heading text-2xl font-bold text-ink">{name}</p>
        <p className={`mt-1 text-sm font-semibold ${t.kicker}`}>{tag}</p>
        {body && (
          <p className="mt-3 text-sm leading-relaxed text-body">{body}</p>
        )}
        <span
          className={`mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-semibold ${t.cta}`}
        >
          Conocer {name}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
