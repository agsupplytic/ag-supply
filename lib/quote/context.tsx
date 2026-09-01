"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { QuoteItem } from "./build-message";

const STORAGE_KEY = "agsupply_quote_v1";
const MAX_QTY = 999999;

interface QuoteContextValue {
  items: QuoteItem[];
  count: number;
  hydrated: boolean;
  /** Returns true if the item was newly added, false if it was already present. */
  addItem: (item: Omit<QuoteItem, "qty">, qty?: number) => boolean;
  removeItem: (slug: string) => void;
  updateQty: (slug: string, qty: number) => void;
  updateNote: (slug: string, note: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

function readStorage(): QuoteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is QuoteItem =>
          x && typeof x.slug === "string" && typeof x.name === "string",
      )
      .map((x) => ({
        slug: x.slug,
        name: x.name,
        brand: x.brand ?? "generico",
        qty: clampQty(x.qty),
        note: typeof x.note === "string" ? x.note : undefined,
      }));
  } catch {
    return [];
  }
}

function clampQty(n: unknown): number {
  const v = Math.floor(Number(n));
  if (!Number.isFinite(v) || v < 1) return 1;
  return Math.min(v, MAX_QTY);
}

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate once on mount (client only).
  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  // Persist (debounced) and sync across tabs.
  useEffect(() => {
    if (!hydrated) return;
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        /* quota / private mode — ignore */
      }
    }, 150);
    return () => {
      if (writeTimer.current) clearTimeout(writeTimer.current);
    };
  }, [items, hydrated]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback<QuoteContextValue["addItem"]>((item, qty = 1) => {
    let added = false;
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.slug === item.slug);
      if (idx === -1) {
        added = true;
        return [...prev, { ...item, qty: clampQty(qty) }];
      }
      const next = prev.slice();
      next[idx] = { ...next[idx], qty: clampQty(next[idx].qty + qty) };
      return next;
    });
    return added;
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const updateQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, qty: clampQty(qty) } : p)),
    );
  }, []);

  const updateNote = useCallback((slug: string, note: string) => {
    setItems((prev) =>
      prev.map((p) =>
        p.slug === slug ? { ...p, note: note.slice(0, 280) } : p,
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const has = useCallback(
    (slug: string) => items.some((p) => p.slug === slug),
    [items],
  );

  const value = useMemo<QuoteContextValue>(
    () => ({
      items,
      count: items.length,
      hydrated,
      addItem,
      removeItem,
      updateQty,
      updateNote,
      has,
      clear,
    }),
    [items, hydrated, addItem, removeItem, updateQty, updateNote, has, clear],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote(): QuoteContextValue {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within <QuoteProvider>");
  return ctx;
}
