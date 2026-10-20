"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { BrandSlug } from "@/lib/content/types";
import type { QuoteItem } from "./build-message";

// Lista de cotización: almacén externo sobre localStorage, leído con
// useSyncExternalStore. En el servidor (HTML estático) la lista es siempre vacía,
// y en el cliente se sincroniza sin efectos ni parpadeos de hidratación.

const STORAGE_KEY = "agsupply_quote_v1";
const MAX_QTY = 999999;
const MAX_ITEMS = 200;
const BRANDS: BrandSlug[] = ["ocean-breeze", "bonche", "generico"];
const EMPTY: QuoteItem[] = [];

let cache: QuoteItem[] | null = null;
const listeners = new Set<() => void>();

function clampQty(n: unknown): number {
  const v = Math.floor(Number(n));
  if (!Number.isFinite(v) || v < 1) return 1;
  return Math.min(v, MAX_QTY);
}

const str = (v: unknown, max: number): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;

/** Lee y valida lo guardado: ignora entradas corruptas, duplicados y excesos. */
function read(): QuoteItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const seen = new Set<string>();
    const out: QuoteItem[] = [];
    for (const x of parsed) {
      if (!x || typeof x !== "object") continue;
      const r = x as Record<string, unknown>;
      const slug = str(r.slug, 160);
      const name = str(r.name, 200);
      if (!slug || !name || seen.has(slug)) continue;
      seen.add(slug);
      out.push({
        slug,
        name,
        brand: BRANDS.includes(r.brand as BrandSlug) ? (r.brand as BrandSlug) : "generico",
        sku: str(r.sku, 40),
        pack: str(r.pack, 20),
        qty: clampQty(r.qty),
        note: str(r.note, 280),
      });
      if (out.length >= MAX_ITEMS) break;
    }
    return out.length ? out : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): QuoteItem[] {
  if (cache === null) cache = read();
  return cache;
}

function commit(next: QuoteItem[]) {
  cache = next.length ? next : EMPTY;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    /* cuota o modo privado: la lista sigue viva en memoria */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const subscribeNever = () => () => {};

export type QuoteTarget = Omit<QuoteItem, "qty" | "note">;

export function useQuote() {
  const items = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  // false en el servidor y durante la hidratación; true ya en el cliente
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);

  const addItem = useCallback((item: QuoteTarget, qty = 1): boolean => {
    const cur = getSnapshot();
    const idx = cur.findIndex((p) => p.slug === item.slug);
    if (idx === -1) {
      if (cur.length >= MAX_ITEMS) return false;
      commit([...cur, { ...item, qty: clampQty(qty) }]);
      return true;
    }
    const next = cur.slice();
    next[idx] = { ...next[idx], qty: clampQty(next[idx].qty + qty) };
    commit(next);
    return false;
  }, []);

  const removeItem = useCallback(
    (slug: string) => commit(getSnapshot().filter((p) => p.slug !== slug)),
    [],
  );
  const updateQty = useCallback(
    (slug: string, qty: number) =>
      commit(getSnapshot().map((p) => (p.slug === slug ? { ...p, qty: clampQty(qty) } : p))),
    [],
  );
  const updateNote = useCallback(
    (slug: string, note: string) =>
      commit(getSnapshot().map((p) => (p.slug === slug ? { ...p, note: note.slice(0, 280) } : p))),
    [],
  );
  const clear = useCallback(() => commit([]), []);

  return useMemo(
    () => ({
      items,
      count: items.length,
      hydrated,
      addItem,
      removeItem,
      updateQty,
      updateNote,
      clear,
      has: (slug: string) => items.some((p) => p.slug === slug),
    }),
    [items, hydrated, addItem, removeItem, updateQty, updateNote, clear],
  );
}
