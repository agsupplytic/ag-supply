import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "./category-icon";
import type { Category } from "@/lib/content/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/productos/${category.slug}`}
      className="group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl bg-brand-blue-dark p-6 text-white shadow-sm transition-shadow hover:shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-700 via-brand-blue-dark to-brand-blue-dark" />
      <div className="relative">
        <span className="flex size-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
          <CategoryIcon name={category.icon} className="size-6" />
        </span>
        <h3 className="mt-4 font-heading text-xl font-bold text-white">
          {category.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-white/85">
          {category.short}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-white">
          Ver {category.count} {category.count === 1 ? "producto" : "productos"}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
