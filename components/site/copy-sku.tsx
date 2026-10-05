"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "@/components/ui/toaster";

/** Código interno (SKU) del producto, con botón para copiarlo al cotizar. */
export function CopySku({ sku }: { sku: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(sku);
      setCopied(true);
      toast.success("SKU copiado", { description: sku });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar. Selecciona el código manualmente.");
    }
  }

  return (
    <div className="inline-flex items-center gap-3 rounded-xl bg-white/15 py-2 pl-4 pr-2 ring-1 ring-white/25">
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-white/75">
          Código interno / SKU
        </p>
        <p className="select-all font-heading text-lg font-bold tabular-nums text-white">
          {sku}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-brand-blue-dark transition-colors hover:bg-brand-blue-50"
        aria-label={`Copiar SKU ${sku}`}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}
