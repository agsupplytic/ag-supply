"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

const COOKIE = "NEXT_LOCALE";

export function LanguageToggle({ locale }: { locale: "es" | "en" }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setLocale(next: "es" | "en") {
    if (next === locale) return;
    document.cookie = `${COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-border px-1 py-0.5 text-xs font-semibold"
      aria-label="Idioma / Language"
    >
      <Languages className="mx-1 size-3.5 text-muted" aria-hidden />
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          disabled={pending}
          className={cn(
            "rounded-full px-2 py-0.5 uppercase transition-colors",
            l === locale
              ? "bg-brand-blue text-white"
              : "text-muted hover:text-brand-blue",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
