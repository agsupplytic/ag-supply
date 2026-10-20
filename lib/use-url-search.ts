"use client";

import { useSyncExternalStore } from "react";

// Estado de filtros en la URL sin useSearchParams: esa API obliga a que el HTML
// estático salga con el catálogo vacío ("Cargando…"). Con este enfoque el servidor
// renderiza la lista completa y el cliente aplica los filtros de la URL al hidratar.

const EVENT = "agsupply:urlchange";

function subscribe(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENT, cb);
  };
}

/** `location.search` actual ("" en el servidor). */
export function useUrlSearch(): string {
  return useSyncExternalStore(subscribe, () => window.location.search, () => "");
}

/** Sustituye la query de la URL sin recargar ni añadir entradas al historial. */
export function replaceUrlSearch(params: URLSearchParams) {
  const qs = params.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(EVENT));
}
