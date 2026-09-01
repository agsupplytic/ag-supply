"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { useQuote } from "@/lib/quote/context";
import { cn } from "@/lib/utils";

export function QuoteButton({ className }: { className?: string }) {
  const { count, hydrated } = useQuote();
  const [bump, setBump] = useState(false);
  const prev = useRef(count);

  useEffect(() => {
    if (hydrated && count > prev.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 420);
      return () => clearTimeout(t);
    }
    prev.current = count;
  }, [count, hydrated]);

  return (
    <Link
      href="/cotizacion"
      className={cn(
        "relative inline-flex items-center gap-2 rounded-md px-3 py-2 font-heading text-sm font-semibold text-ink transition-colors hover:text-brand-blue",
        className,
      )}
      aria-label={`Cotización, ${count} ${count === 1 ? "producto" : "productos"}`}
    >
      <FileText className="size-5" aria-hidden />
      <span className="hidden sm:inline">Cotización</span>
      <span
        className={cn(
          "inline-flex min-w-5 items-center justify-center rounded-full bg-brand-blue px-1.5 text-[0.7rem] font-bold leading-5 text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          !hydrated && "opacity-0",
          bump && "scale-125",
        )}
      >
        {hydrated ? count : 0}
      </span>
    </Link>
  );
}
