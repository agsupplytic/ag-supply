import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Brand logos live in /public/images/brand and are shown AS logos, large. */
export const BRAND_LOGO: Record<"ocean-breeze" | "bonche", string> = {
  "ocean-breeze": "/images/brand/ocean-breeze-logo.webp",
  bonche: "/images/brand/bonche-logo.webp",
};

const TONE = {
  premium: {
    panel: "border-brand-blue-100 bg-brand-blue-50",
    accent: "text-brand-blue-dark",
    dot: "bg-brand-blue",
  },
  value: {
    panel: "border-[#d4e7c1] bg-[#eef6e6]",
    accent: "text-[#3f7d1f]",
    dot: "bg-[#5aa832]",
  },
} as const;

export function BrandCard({
  slug,
  name,
  positioning,
  body,
  attrs,
  href,
  cta,
  tone = "premium",
  className,
}: {
  slug: "ocean-breeze" | "bonche";
  name: string;
  positioning: string;
  body?: string;
  attrs?: string[];
  href: string;
  cta?: string;
  tone?: "premium" | "value";
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border shadow-sm transition-shadow hover:shadow-xl",
        t.panel,
        className,
      )}
    >
      <div className="flex h-40 items-center justify-center bg-white px-8">
        <Image
          src={BRAND_LOGO[slug]}
          alt={name}
          width={440}
          height={230}
          draggable={false}
          className="max-h-24 w-auto object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <p className={cn("font-heading text-sm font-semibold", t.accent)}>
          {positioning}
        </p>
        {body && <p className="mt-3 leading-relaxed text-body">{body}</p>}
        {attrs && attrs.length > 0 && (
          <ul className="mt-4 space-y-1.5 text-sm text-ink">
            {attrs.map((a) => (
              <li key={a} className="flex items-start gap-2.5">
                <span
                  className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", t.dot)}
                />
                {a}
              </li>
            ))}
          </ul>
        )}
        <span
          className={cn(
            "mt-6 inline-flex items-center gap-1.5 font-heading text-sm font-semibold",
            t.accent,
          )}
        >
          {cta ?? `Conocer ${name}`}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
