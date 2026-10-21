"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { switchPath, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";

/**
 * Botón de idioma: lleva a la misma página en el otro idioma (rutas /en/…). Es un
 * enlace normal, así que funciona sin JavaScript tras la hidratación y los buscadores
 * lo rastrean.
 */
export function LanguageSwitch({ lang, className }: { lang: Lang; className?: string }) {
  const pathname = usePathname() ?? "/";
  const other: Lang = lang === "es" ? "en" : "es";
  const t = ui(lang).nav;
  return (
    <Link
      href={switchPath(pathname, other)}
      hrefLang={other}
      lang={other}
      prefetch={false}
      title={t.language}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-md border border-control-border px-3 font-heading text-sm font-bold text-ink transition-colors hover:border-brand-blue hover:bg-brand-blue-50",
        className,
      )}
    >
      <Languages className="size-4 text-brand-blue" aria-hidden />
      {t.languageShort}
      <span className="sr-only"> – {t.languageName}</span>
    </Link>
  );
}
