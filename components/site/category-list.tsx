import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/content/types";

/** Lista de categorías en filas con filete: nombre, descripción corta y nº de productos. */
export function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {categories.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/productos/${c.slug}`}
            className="group grid items-baseline gap-x-6 gap-y-1 py-4 hover:bg-surface sm:grid-cols-[14rem_1fr_auto] sm:px-3"
          >
            <span className="font-heading text-xl font-semibold text-ink group-hover:text-brand-blue-dark">
              {c.name}
            </span>
            <span className="text-body">{c.short}</span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-brand-blue-dark">
              {c.count} {c.count === 1 ? "producto" : "productos"}
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
