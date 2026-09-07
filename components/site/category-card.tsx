import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "./category-icon";
import type { Category } from "@/lib/content/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/productos/${category.slug}`}
      className="group relative flex min-h-60 flex-col justify-end overflow-hidden rounded-2xl bg-brand-blue-dark p-6 text-white shadow-sm transition-shadow hover:shadow-xl"
    >
      {category.placeholder && (
        <Image
          src={category.placeholder}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          draggable={false}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      )}
      {/* blue scrim: dense at the base for the text, clearing toward the top */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark via-brand-blue-dark/85 to-brand-blue-dark/35" />

      <div className="relative">
        <span className="panel-icon on-dark size-11">
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
