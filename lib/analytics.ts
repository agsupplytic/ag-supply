// Medición de conversiones. Sin ID en el build (NEXT_PUBLIC_ANALYTICS_ID) no se carga ningún script
// de terceros, no se guarda nada y no se muestra aviso.
//
// Modo de consentimiento (CONSENT_MODE):
//  - "opt-out" (actual): la medición arranca por defecto y un aviso informativo ofrece «Rechazar».
//    Quien rechaza, o tiene activada la señal Global Privacy Control / No rastrear, no se mide.
//    En zonas horarias de la UE/Reino Unido/Suiza (priorConsentRequired) se pide «Aceptar» antes.
//  - "opt-in": no se carga nada hasta que la persona pulse «Aceptar».
// Cambiar el modo es cambiar esta constante; el resto del código ya lo respeta.
// El ID puede ser un contenedor de Google Tag Manager (GTM-XXXXXXX): los eventos se empujan al
// dataLayer y las etiquetas (GA4, etc.) se configuran en el panel de GTM; o un ID de medición de
// GA4 (G-XXXXXXXXXX), que se carga directo con gtag.js.
// Los parámetros nunca llevan datos personales (nombre, teléfono, correo, mensaje).

const RAW_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID ?? "";

/** ID válido o cadena vacía: el valor se inserta en una URL, así que se valida el formato. */
export const ANALYTICS_ID = /^(?:GTM-[A-Z0-9]{4,12}|G-[A-Z0-9]{4,20})$/.test(RAW_ID) ? RAW_ID : "";
const IS_GTM = ANALYTICS_ID.startsWith("GTM-");
let loaded = false;
/** ¿Ya se cargó la medición en esta visita? (para recargar si se rechaza después). */
export const analyticsLoaded = () => loaded;

export const CONSENT_MODE: "opt-in" | "opt-out" = "opt-out";
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

/**
 * Zonas horarias de la Unión Europea, el Reino Unido, Suiza, Islandia y los territorios
 * franceses de ultramar (Guadalupe, Martinica, Guayana Francesa, San Martín, Reunión,
 * Mayotte), donde el consentimiento previo para cookies de medición es exigible. Es una
 * heurística: la zona horaria del navegador no prueba la residencia, pero evita pedir
 * permiso a todos y obliga a pedirlo donde la norma es más estricta.
 */
const PRIOR_CONSENT_ZONE =
  /^(?:Europe\/|Atlantic\/(?:Azores|Canary|Madeira|Reykjavik)$|America\/(?:Martinique|Guadeloupe|Marigot|Cayenne)$|Indian\/(?:Reunion|Mayotte)$)/;

/** ¿Hay que pedir permiso antes de medir? Siempre en modo opt-in; en opt-out, solo en esas regiones. */
export function priorConsentRequired(): boolean {
  if (CONSENT_MODE === "opt-in") return true;
  try {
    return PRIOR_CONSENT_ZONE.test(Intl.DateTimeFormat().resolvedOptions().timeZone ?? "");
  } catch {
    return false;
  }
}

/** Señales del navegador que equivalen a rechazar: Global Privacy Control y No rastrear. */
export function browserOptOut(): boolean {
  try {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    return nav.globalPrivacyControl === true || nav.doNotTrack === "1";
  } catch {
    return false;
  }
}

/** Decisión efectiva: la elección guardada y, si no hay, el modo por defecto. */
export function effectiveConsent(): Consent | null {
  if (browserOptOut()) return "denied";
  const saved = readConsent();
  if (saved) return saved;
  return priorConsentRequired() ? null : "granted";
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
    if (effectiveConsent() !== "granted") return;
    const data = { ...params, page_path: location.pathname };
    if (IS_GTM) window.dataLayer?.push({ event, ...data });
    else window.gtag?.("event", event, data);
  } catch {
    /* la medición nunca debe romper la página */
  }
}

/** Carga Tag Manager o gtag.js una sola vez, tras el consentimiento. */
export function loadAnalytics(): void {
  if (!ANALYTICS_ID || loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer ?? [];
  const s = document.createElement("script");
  s.async = true;
  if (IS_GTM) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    s.src = `https://www.googletagmanager.com/gtm.js?id=${ANALYTICS_ID}`;
  } else {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    // IP anonimizada y sin señales de publicidad.
    window.gtag("config", ANALYTICS_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
  }
  document.head.appendChild(s);
}
