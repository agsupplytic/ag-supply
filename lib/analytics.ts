// Medición de conversiones, apagada por defecto. Solo envía algo si hay ID de Google
// Analytics 4 en el build (NEXT_PUBLIC_ANALYTICS_ID, formato G-XXXXXXXXXX) Y la persona
// aceptó la medición. Sin ID no se carga ningún script de terceros ni se guarda nada.
// Los parámetros nunca llevan datos personales (nombre, teléfono, correo, mensaje).

const RAW_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID ?? "";

/** ID válido o cadena vacía: el valor se inserta en una URL, así que se valida el formato. */
export const ANALYTICS_ID = /^G-[A-Z0-9]{4,20}$/.test(RAW_ID) ? RAW_ID : "";

export const CONSENT_KEY = "ag-consent";
export type Consent = "granted" | "denied";

export type TrackEvent =
  | "whatsapp_click"
  | "quote_add"
  | "quote_copy"
  | "quote_whatsapp_send"
  | "contact_submit"
  | "language_switch";

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: Consent): void {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* sin almacenamiento: la elección vale solo para esta visita */
  }
}

/** Registra un evento. No hace nada sin ID configurado, sin consentimiento o sin gtag cargado. */
export function track(event: TrackEvent, params: Params = {}): void {
  if (!ANALYTICS_ID || typeof window === "undefined") return;
  try {
    if (readConsent() !== "granted") return;
    window.gtag?.("event", event, { ...params, page_path: location.pathname });
  } catch {
    /* la medición nunca debe romper la página */
  }
}

/** Carga gtag.js una sola vez, con anonimización de IP y sin señales de publicidad. */
export function loadAnalytics(): void {
  if (!ANALYTICS_ID || window.gtag) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", ANALYTICS_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
  document.head.appendChild(s);
}
