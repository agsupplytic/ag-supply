import Link from "next/link";
import { BrandBadge } from "./brand-badge";
import { AddToQuoteButton } from "./add-to-quote-button";
import type { Product } from "@/lib/content/types";

/** Columnas de la tabla del catálogo (compartidas por la cabecera y las filas). */
export const ROW_COLS = "md:grid-cols-[7.5rem_minmax(0,1fr)_7.5rem_7rem_13rem]";

/**
 * Fila densa del catálogo: SKU, producto, marca, presentación y alta a cotización.
 * En móvil se apila (nombre, una línea de datos, cantidad y botón); desde `md` es una
 * fila de cinco columnas.
 */
export function ProductRow({ product }: { product: Product }) {
  const href = `/productos/${product.category}/${product.slug}`;
  const { packFormat } = product.specs;
  const detail = product.keySpecs.filter((k) => !k.startsWith("Presentación"));
  const sub = [product.subcategory, ...detail].filter(Boolean).join(" · ");

  return (
    <li className={`grid gap-x-4 gap-y-2 px-3 py-3 hover:bg-surface md:items-center ${ROW_COLS}`}>
      <div className="order-1 min-w-0 md:order-2">
        <Link
          href={href}
          className="font-heading text-[1.0625rem] font-semibold leading-snug text-ink hover:text-brand-blue-dark hover:underline"
        >
          {product.name}
        </Link>
        {sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}
      </div>

      <div className="order-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:contents">
        <span className="tabular-nums text-muted md:order-1 md:text-[0.9375rem]">
          <span className="md:hidden">SKU </span>
          {product.sku ?? <span aria-label="Sin SKU">—</span>}
        </span>
        <span className="md:order-3">
          <BrandBadge brand={product.brand} />
        </span>
        <span className={packFormat ? "text-body md:order-4 md:text-[0.9375rem]" : "hidden text-body md:order-4 md:inline md:text-[0.9375rem]"}>
          <span className="text-muted md:hidden">Presentación </span>
          {packFormat ?? "—"}
        </span>
      </div>

      <AddToQuoteButton product={product} layout="inline" className="order-3 md:order-5 md:justify-end" />
    </li>
  );
}
