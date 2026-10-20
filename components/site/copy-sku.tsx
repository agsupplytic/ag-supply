"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "@/components/ui/toaster";

/** SKU del producto con botón para copiarlo al cotizar. */
export function CopySku({ sku }: { sku: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(sku);
      setCopied(true);
      toast.success("SKU copiado", { description: sku });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar. Seleccione el código manualmente.");
    }
  }

  return (
    <span className="inline-flex items-center gap-3">
      <span className="select-all font-heading text-lg font-semibold tabular-nums text-ink">{sku}</span>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-8 items-center gap-1.5 border border-control-border px-2.5 text-sm font-semibold text-brand-blue-dark hover:bg-brand-blue-50"
        aria-label={`Copiar SKU ${sku}`}
      >
        {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
        {copied ? "Copiado" : "Copiar"}
      </button>
    </span>
  );
}
