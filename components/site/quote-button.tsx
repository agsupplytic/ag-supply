"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { useQuote } from "@/lib/quote/store";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";

/** Acceso a la lista de cotización con el número de líneas. */
export function QuoteButton({ lang, className }: { lang: Lang; className?: string }) {
  const { count, hydrated } = useQuote();
  const t = ui(lang);
  const n = hydrated ? count : 0;
  return (
    <Link
      href={href(lang, { name: "quote" })}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-md border border-brand-blue-dark px-3 font-heading text-sm font-bold text-brand-blue-dark transition-colors hover:bg-brand-blue-50",
        className,
      )}
    >
      <FileText className="size-4" aria-hidden />
      <span className="sr-only sm:not-sr-only">{t.quoteBtn}</span>
      <span className="inline-flex min-w-5 items-center justify-center rounded-sm bg-brand-blue px-1.5 text-xs font-bold leading-5 text-white">
        {n}
      </span>
      <span className="sr-only">{t.quoteCount(n)}</span>
    </Link>
  );
}
