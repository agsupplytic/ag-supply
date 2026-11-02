"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CONSENT_RESET_EVENT } from "./consent-link";
import {
  ANALYTICS_ID,
  CONSENT_MODE,
  analyticsLoaded,
  browserOptOut,
  effectiveConsent,
  loadAnalytics,
  readConsent,
  track,
  writeConsent,
  type TrackEvent,
} from "@/lib/analytics";
import { href, type Lang } from "@/lib/i18n/routes";

const TEXT = {
  es: {
    region: "Cookies y medición del sitio",
    text: "Este sitio usa cookies de Google para medir de forma anónima las visitas y mejorar el sitio. No registramos su nombre, teléfono ni mensajes.",
    policy: "Política de privacidad y cookies",
    ok: CONSENT_MODE === "opt-out" ? "Entendido" : "Aceptar",
    reject: "Rechazar",
  },
  en: {
    region: "Cookies and site measurement",
    text: "This site uses Google cookies to measure visits anonymously and improve the site. We do not record your name, phone or messages.",
    policy: "Privacy and cookies policy",
    ok: CONSENT_MODE === "opt-out" ? "Got it" : "Accept",
    reject: "Reject",
  },
} as const;

/**
 * Medición: arranca según el modo de consentimiento (lib/analytics.ts) y muestra un aviso con
 * «Rechazar» hasta que la persona responde. Conversiones por delegación de clics: cualquier
 * enlace a wa.me cuenta como `whatsapp_click` y cualquier elemento con `data-track="evento"`
 * envía ese evento. Sin ID de analítica en el build, este componente no hace nada.
 */
export function Analytics({ lang }: { lang: Lang }) {
  const [ask, setAsk] = useState(false);
  const t = TEXT[lang];

  useEffect(() => {
    if (!ANALYTICS_ID) return;
    if (effectiveConsent() === "granted") loadAnalytics();
    // Aviso solo si todavía no hay elección guardada y el navegador no pidió no ser medido.
    const raf = requestAnimationFrame(() => setAsk(!readConsent() && !browserOptOut()));

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
    const onReset = () => setAsk(true);
    window.addEventListener(CONSENT_RESET_EVENT, onReset);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener(CONSENT_RESET_EVENT, onReset);
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
    };
  }, []);

  if (!ANALYTICS_ID || !ask) return null;

  function decide(value: "granted" | "denied") {
    writeConsent(value);
    setAsk(false);
    if (value === "granted") loadAnalytics();
    // Si la medición ya estaba cargada en esta visita, recargar es la forma de dejarla apagada.
    else if (analyticsLoaded()) window.location.reload();
  }

  return (
    <section
      aria-label={t.region}
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-xl border border-border bg-white p-4 shadow-lg sm:left-4 sm:right-auto sm:max-w-md"
    >
      <p className="text-sm text-body">
        {t.text}{" "}
        <Link href={href(lang, { name: "privacy" })} className="link font-bold">{t.policy}</Link>.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => decide("granted")}>{t.ok}</Button>
        <Button size="sm" variant="outline" onClick={() => decide("denied")}>{t.reject}</Button>
      </div>
    </section>
  );
}
