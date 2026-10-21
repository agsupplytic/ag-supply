import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "./category-icon";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import type { Category } from "@/lib/content/types";
import { cn } from "@/lib/utils";

export type CategorySamples = Record<string, { src: string; alt: string }[]>;

/**
 * Tarjetas de categoría: icono, nombre, descripción corta, número de productos y, si hay,
 * una tira de miniaturas de fotos reales de producto de esa categoría.
 */
export function CategoryCards({
  categories,
  samples,
  lang,
  compact = false,
}: {
  categories: Category[];
  samples: CategorySamples;
  lang: Lang;
  compact?: boolean;
}) {
  const t = ui(lang);
  return (
    <ul className={cn("grid gap-5", compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3")}>
      {categories.map((c, i) => {
        const imgs = samples[c.slug] ?? [];
        return (
          <li key={c.slug} className="rise" style={{ animationDelay: `${(i % 3) * 60}ms` }}>
            <Link href={href(lang, { name: "category", cat: c.slug })} className="card group flex h-full flex-col p-5">
              <div className="flex items-start gap-3">
                <span className="icon-chip" aria-hidden><CategoryIcon name={c.icon} /></span>
                <div className="min-w-0 flex-1">
                  <h3 className="!text-xl group-hover:text-brand-blue-dark">{c.name}</h3>
                  <p className="text-sm font-bold text-brand-blue-dark">{t.count.product(c.count)}</p>
                </div>
                <ArrowRight className="mt-1 size-5 text-brand-blue transition-transform group-hover:translate-x-1" aria-hidden />
              </div>
              {!compact && <p className="mt-3 flex-1 text-[0.9375rem] text-body">{c.short}</p>}
              {imgs.length > 0 && !compact && (
                <div className="mt-4 flex gap-2">
                  {imgs.slice(0, 3).map((im) => (
                    <span key={im.src} className="relative size-16 overflow-hidden rounded-lg border border-border bg-white">
                      <Image src={im.src} alt={im.alt} fill sizes="64px" className="object-contain p-1" />
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
