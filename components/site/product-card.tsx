import Link from "next/link";
import { ProductImage } from "./product-image";
import { BrandBadge } from "./brand-badge";
import { AddToQuoteButton } from "./add-to-quote-button";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import type { Product } from "@/lib/content/types";

/** Tarjeta de producto (vista de cuadrícula del catálogo y productos relacionados). */
export function ProductCard({ product, icon, lang }: { product: Product; icon: string; lang: Lang }) {
  const to = href(lang, { name: "product", cat: product.category, slug: product.slug });
  const t = ui(lang);
  return (
    <article className="card card-hover flex flex-col overflow-hidden">
      <Link href={to} tabIndex={-1} aria-hidden="true">
        <ProductImage product={product} icon={icon} soonLabel={t.catalog.photoSoon} className="border-b border-border" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <BrandBadge brand={product.brand} lang={lang} />
          {product.sku && <span className="text-xs tabular-nums text-muted">{product.sku}</span>}
        </div>
        <h3 className="font-heading text-base font-bold leading-snug text-ink [font-stretch:100%]">
          <Link href={to} className="hover:text-brand-blue-dark hover:underline">
            {product.name}
          </Link>
        </h3>
        {product.keySpecs.length > 0 && <p className="text-sm text-muted">{product.keySpecs.join(" · ")}</p>}
        <div className="mt-auto pt-2">
          <AddToQuoteButton product={product} lang={lang} className="w-full" />
        </div>
      </div>
    </article>
  );
}
