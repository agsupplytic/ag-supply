"use client";

import { useState } from "react";
import { Check, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { useQuote } from "@/lib/quote/context";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/content/types";

type QuoteTarget = Pick<Product, "slug" | "name" | "brand">;

export function AddToQuoteButton({
  product,
  variant = "primary",
  size = "md",
  withQuantity = false,
  className,
  label = "Añadir a cotización",
}: {
  product: QuoteTarget;
  variant?: "primary" | "outline" | "subtle";
  size?: "sm" | "md" | "lg";
  withQuantity?: boolean;
  className?: string;
  label?: string;
}) {
  const { addItem, has } = useQuote();
  const inQuote = has(product.slug);
  const [qty, setQty] = useState(1);

  function add() {
    const isNew = addItem(
      { slug: product.slug, name: product.name, brand: product.brand },
      qty,
    );
    toast.success(isNew ? "Añadido a cotización" : "Cantidad actualizada", {
      description: product.name,
      action: { label: "Ver", onClick: () => (window.location.href = "/cotizacion") },
    });
  }

  if (withQuantity) {
    return (
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        <div className="inline-flex items-center rounded-md border border-border">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid size-11 place-items-center text-body hover:text-brand-blue"
            aria-label="Disminuir cantidad"
          >
            <Minus className="size-4" />
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) =>
              setQty(Math.max(1, Math.floor(Number(e.target.value) || 1)))
            }
            className="w-14 border-x border-border bg-transparent py-2 text-center font-heading font-semibold text-ink"
            aria-label="Cantidad"
          />
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="grid size-11 place-items-center text-body hover:text-brand-blue"
            aria-label="Aumentar cantidad"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <Button variant={variant} size={size} onClick={add}>
          {inQuote ? <Check className="size-4" /> : <Plus className="size-4" />}
          {inQuote ? "En cotización · añadir más" : label}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={inQuote ? "subtle" : variant}
      size={size}
      onClick={add}
      className={className}
    >
      {inQuote ? <Check className="size-4" /> : <Plus className="size-4" />}
      {inQuote ? "En cotización" : label}
    </Button>
  );
}
