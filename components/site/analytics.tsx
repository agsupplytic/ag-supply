"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ANALYTICS_ID, loadAnalytics, readConsent, track, writeConsent, type TrackEvent } from "@/lib/analytics";
import type { Lang } from "@/lib/i18n/routes";

const TEXT = {
  es: {
    region: "Medición del sitio",
    text: "Usamos una medición anónima (Google Analytics) para saber qué páginas y botones se usan y mejorar el sitio. No guarda tu nombre, teléfono ni mensajes.",
    accept: "Aceptar",
    reject: "Rechazar",
  },
  en: {
    region: "Site measurement",
    text: "We use anonymous measurement (Google Analytics) to learn which pages and buttons are used and improve the site. It does not store your name, phone or messages.",
    accept: "Accept",
    reject: "Reject",
  },
} as const;

/**
 * Conversiones por delegación de clics: cualquier enlace a wa.me cuenta como
 * `whatsapp_click`, y cualquier elemento con `data-track="evento"` envía ese evento.
 * Sin ID de analítica en el build, este componente no hace nada ni muestra nada.
 */
export function Analytics({ lang }: { lang: Lang }) {
  const [choice, setChoice] = useState<"granted" | "denied" | "ask" | null>(null);
  const t = TEXT[lang];

  useEffect(() => {
    if (!ANALYTICS_ID) return;
    const saved = readConsent();
    if (saved === "granted") loadAnalytics();
    const raf = requestAnimationFrame(() => setChoice(saved ?? "ask"));

    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest<HTMLElement>("a[href], [data-track]");
      if (!el) return;
      const named = el.dataset.track as TrackEvent | undefined;
      if (named) {
        track(named);
        return;
      }
      if (el instanceof HTMLAnchorElement && el.href.startsWith("https://wa.me/")) track("whatsapp_click");
    }
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
    };
  }, []);

  if (!ANALYTICS_ID || choice !== "ask") return null;

  function decide(value: "granted" | "denied") {
    writeConsent(value);
    if (value === "granted") loadAnalytics();
    setChoice(value);
  }

  return (
    <section
      aria-label={t.region}
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-xl border border-border bg-white p-4 shadow-lg sm:left-4 sm:right-auto sm:max-w-md"
    >
      <p className="text-sm text-body">{t.text}</p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => decide("granted")}>{t.accept}</Button>
        <Button size="sm" variant="outline" onClick={() => decide("denied")}>{t.reject}</Button>
      </div>
    </section>
  );
}
