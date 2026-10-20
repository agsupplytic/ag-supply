"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { useQuote } from "@/lib/quote/store";
import { cn } from "@/lib/utils";

/** Acceso a la lista de cotización con el número de líneas. */
export function QuoteButton({ className }: { className?: string }) {
  const { count, hydrated } = useQuote();
  const n = hydrated ? count : 0;
  return (
    <Link
      href="/cotizacion"
      className={cn(
        "inline-flex h-10 items-center gap-2 border border-brand-blue-dark px-3 font-heading text-sm font-semibold text-brand-blue-dark transition-colors hover:bg-brand-blue-50",
        className,
      )}
      aria-label={`Lista de cotización, ${n} ${n === 1 ? "producto" : "productos"}`}
    >
      <FileText className="size-4" aria-hidden />
      <span className="hidden sm:inline">Cotización</span>
      <span className="inline-flex min-w-5 items-center justify-center bg-brand-blue px-1.5 text-xs font-bold leading-5 text-white">
        {n}
      </span>
    </Link>
  );
}
