import Link from "next/link";
import { ProductImage } from "./product-image";
import { BrandBadge } from "./brand-badge";
import { AddToQuoteButton } from "./add-to-quote-button";
import type { Product } from "@/lib/content/types";

export function ProductCard({
  product,
  categorySlug,
}: {
  product: Product;
  categorySlug: string;
}) {
  const href = `/productos/${categorySlug}/${product.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue-200 hover:shadow-xl">
      <Link href={href} className="relative block" aria-label={product.name}>
        <ProductImage
          product={product}
          className="aspect-4/3 border-b border-border"
        />
        <span className="absolute left-3 top-3">
          <BrandBadge brand={product.brand} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-heading text-[0.95rem] font-semibold leading-snug text-ink">
          <Link href={href} className="transition-colors hover:text-brand-blue">
            {product.name}
          </Link>
        </h3>

        {product.keySpecs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.keySpecs.map((s) => (
              <span
                key={s}
                className="rounded-md bg-brand-blue-50 px-1.5 py-0.5 text-[0.7rem] font-medium text-brand-blue-dark"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-1">
          <AddToQuoteButton
            product={product}
            variant="outline"
            size="sm"
            className="w-full"
          />
        </div>
      </div>
    </article>
  );
}
