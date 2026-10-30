"use client";

import { ANALYTICS_ID, CONSENT_KEY } from "@/lib/analytics";
import type { Lang } from "@/lib/i18n/routes";

export const CONSENT_RESET_EVENT = "ag-consent-reset";

/**
 * Enlace del pie para volver a elegir sobre la medición (aceptar o rechazar). Borra la
 * elección guardada y vuelve a mostrar el aviso. Solo existe si el sitio tiene medición.
 */
export function ConsentLink({ lang, className }: { lang: Lang; className?: string }) {
  if (!ANALYTICS_ID) return null;
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        try {
          localStorage.removeItem(CONSENT_KEY);
        } catch {
          /* sin almacenamiento: el aviso vuelve a aparecer igualmente */
        }
        window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
      }}
    >
      {lang === "es" ? "Preferencias de medición" : "Measurement preferences"}
    </button>
  );
}
