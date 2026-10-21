"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "@/components/ui/toaster";
import { ui } from "@/lib/i18n/ui";
import type { Lang } from "@/lib/i18n/routes";

/** SKU del producto con botón para copiarlo al cotizar. */
export function CopySku({ sku, lang }: { sku: string; lang: Lang }) {
  const [copied, setCopied] = useState(false);
  const t = ui(lang).product;

  async function copy() {
    try {
      await navigator.clipboard.writeText(sku);
      setCopied(true);
      toast.success(t.skuCopied, { description: sku });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.copyFail);
    }
  }

  return (
    <span className="inline-flex items-center gap-3">
      <span className="select-all font-heading text-lg font-bold tabular-nums text-ink [font-stretch:100%]">{sku}</span>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-control-border px-2.5 text-sm font-bold text-brand-blue-dark hover:bg-brand-blue-50"
        aria-label={t.copySkuLabel(sku)}
      >
        {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
        {copied ? t.copied : t.copySku}
      </button>
    </span>
  );
}
