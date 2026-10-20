"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { useQuote } from "@/lib/quote/store";
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
  layout = "block",
  className,
}: {
  product: QuoteSource;
  layout?: "inline" | "block" | "detail";
  className?: string;
}) {
  const { addItem, has, hydrated } = useQuote();
  const router = useRouter();
  const [qty, setQty] = useState("1");
  const inQuote = hydrated && has(product.slug);

  function add() {
    const n = parseQty(qty);
    const isNew = addItem(
      {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        sku: product.sku,
        pack: product.specs.packFormat,
      },
      n,
    );
    setQty("1");
    toast.success(isNew ? "Añadido a la cotización" : "Cantidad actualizada", {
      description: product.name,
      action: { label: "Ver lista", onClick: () => router.push("/cotizacion") },
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
      aria-label={`Cantidad de ${product.name}`}
      className={cn(
        "border border-control-border bg-white text-center font-heading font-semibold text-ink",
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
          {inQuote ? "Sumar" : "Añadir"}
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
          {inQuote ? "En la lista · sumar cantidad" : "Añadir a la cotización"}
        </Button>
      </div>
    );
  }
  return (
    <Button
      variant={inQuote ? "subtle" : "outline"}
      size="sm"
      onClick={add}
      className={className}
    >
      {icon}
      {inQuote ? "En la lista" : "Añadir a la cotización"}
    </Button>
  );
}
