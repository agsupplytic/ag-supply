"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { track } from "@/lib/analytics";
import { useQuote } from "@/lib/quote/store";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/content/types";

type QuoteSource = Pick<Product, "slug" | "name" | "brand" | "sku" | "specs">;

const parseQty = (v: string) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n >= 1 ? n : 1;
};

/**
 * Añade un producto a la lista de cotización.
 *  - `inline`: campo de cantidad + botón compacto (filas del catálogo).
 *  - `block` : botón de ancho completo (tarjetas).
 *  - `detail`: cantidad + botón grande (ficha).
 */
export function AddToQuoteButton({
  product,
  lang,
  layout = "block",
  className,
}: {
  product: QuoteSource;
  lang: Lang;
  layout?: "inline" | "block" | "detail";
  className?: string;
}) {
  const t = ui(lang).add;
  const { addItem, has, hydrated } = useQuote();
  const router = useRouter();
  const [qty, setQty] = useState("1");
  const inQuote = hydrated && has(product.slug);

  function add() {
    const n = parseQty(qty);
    const isNew = addItem(
      { slug: product.slug, name: product.name, brand: product.brand, sku: product.sku, pack: product.specs.packFormat },
      n,
    );
    setQty("1");
    track("quote_add", { quantity: n });
    toast.success(isNew ? t.added : t.updated, {
      description: product.name,
      action: { label: t.viewList, onClick: () => router.push(href(lang, { name: "quote" })) },
    });
  }

  const qtyInput = (
    <input
      type="number"
      inputMode="numeric"
      min={1}
      value={qty}
      onChange={(e) => setQty(e.target.value)}
      onBlur={() => setQty(String(parseQty(qty)))}
      onKeyDown={(e) => e.key === "Enter" && add()}
      aria-label={t.qty(product.name)}
      className={cn(
        "rounded-md border border-control-border bg-white text-center font-heading font-bold text-ink",
        layout === "detail" ? "h-12 w-20" : "h-9 w-16 text-sm",
      )}
    />
  );

  const icon = inQuote ? <Check aria-hidden /> : <Plus aria-hidden />;

  if (layout === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {qtyInput}
        <Button size="sm" variant={inQuote ? "subtle" : "primary"} onClick={add}>
          {icon}
          {inQuote ? t.addMore : t.add}
        </Button>
      </div>
    );
  }
  if (layout === "detail") {
    return (
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        {qtyInput}
        <Button size="lg" onClick={add}>
          {icon}
          {inQuote ? t.inListMore : t.addToQuote}
        </Button>
      </div>
    );
  }
  return (
    <Button variant={inQuote ? "subtle" : "outline"} size="sm" onClick={add} className={className}>
      {icon}
      {inQuote ? t.inList : t.addToQuote}
    </Button>
  );
}
