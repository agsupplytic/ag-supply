import Link from "next/link";
import { ProductImage } from "./product-image";
import { BrandBadge } from "./brand-badge";
import { AddToQuoteButton } from "./add-to-quote-button";
import type { Product } from "@/lib/content/types";

/** Tarjeta de producto (vista de cuadrícula del catálogo y productos relacionados). */
export function ProductCard({ product }: { product: Product }) {
  const href = `/productos/${product.category}/${product.slug}`;
  return (
    <article className="flex flex-col border border-border bg-white">
      <Link href={href} tabIndex={-1} aria-hidden="true">
        <ProductImage product={product} className="border-b border-border" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <BrandBadge brand={product.brand} />
          {product.sku && <span className="text-xs tabular-nums text-muted">{product.sku}</span>}
        </div>
        <h3 className="font-heading text-base font-semibold leading-snug text-ink">
          <Link href={href} className="hover:text-brand-blue-dark hover:underline">
            {product.name}
          </Link>
        </h3>
        {product.keySpecs.length > 0 && (
          <p className="text-sm text-muted">{product.keySpecs.join(" · ")}</p>
        )}
        <div className="mt-auto pt-2">
          <AddToQuoteButton product={product} className="w-full" />
        </div>
      </div>
    </article>
  );
}
