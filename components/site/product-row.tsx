import Link from "next/link";
import { BrandBadge } from "./brand-badge";
import { AddToQuoteButton } from "./add-to-quote-button";
import { ProductThumb } from "./product-thumb";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import type { Product } from "@/lib/content/types";

/** Columnas de la tabla del catálogo (compartidas por la cabecera y las filas). */
export const ROW_COLS = "md:grid-cols-[5.5rem_7rem_minmax(0,1fr)_7rem_6.5rem_12.5rem]";

/**
 * Fila densa del catálogo: miniatura, SKU, producto, marca, presentación y alta a
 * cotización. En móvil se apila; desde `md` es una fila de seis columnas.
 */
export function ProductRow({ product, icon, lang }: { product: Product; icon: string; lang: Lang }) {
  const t = ui(lang).catalog;
  const to = href(lang, { name: "product", cat: product.category, slug: product.slug });
  const { packFormat } = product.specs;
  const detail = product.keySpecs.filter((k) => !/^(Presentación|Pack)\b/.test(k));
  const sub = [product.subcategory, ...detail].filter(Boolean).join(" · ");

  return (
    <li className={`grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-2 px-3 py-3 hover:bg-brand-blue-50/60 md:items-center ${ROW_COLS}`}>
      <ProductThumb product={product} icon={icon} lang={lang} className="row-span-3 md:order-1 md:row-span-1" />

      <div className="min-w-0 md:order-3">
        <Link href={to} className="font-heading text-[1.0625rem] font-bold leading-snug text-ink [font-stretch:100%] hover:text-brand-blue-dark hover:underline">
          {product.name}
        </Link>
        {sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:contents">
        <span className="tabular-nums text-muted md:order-2 md:text-[0.9375rem]">
          <span className="md:hidden">{t.skuPrefix} </span>
          {product.sku ?? <span aria-label={t.noSku}>—</span>}
        </span>
        <span className="md:order-4">
          <BrandBadge brand={product.brand} lang={lang} />
        </span>
        <span className={packFormat ? "text-body md:order-5 md:text-[0.9375rem]" : "hidden text-body md:order-5 md:inline md:text-[0.9375rem]"}>
          <span className="text-muted md:hidden">{t.packPrefix} </span>
          {packFormat ?? "—"}
        </span>
      </div>

      <AddToQuoteButton product={product} lang={lang} layout="inline" className="md:order-6 md:justify-end" />
    </li>
  );
}
