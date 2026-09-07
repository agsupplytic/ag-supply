"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { ProductCard } from "./product-card";
import { brandLabel } from "./brand-badge";
import { cn } from "@/lib/utils";
import type { Brand, Category, Product } from "@/lib/content/types";

const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const ATTR_DEFS = [
  { key: "ply", param: "capas", label: "Capas", suffix: (v: string) => `${v} ${v === "1" ? "capa" : "capas"}` },
  { key: "fold", param: "doblez", label: "Doblez", suffix: (v: string) => v },
  { key: "color", param: "color", label: "Color", suffix: (v: string) => v },
] as const;

export function Catalog({
  products,
  categories,
  brands,
  lockedCategory,
}: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  lockedCategory?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const selected = {
    categoria: lockedCategory ?? params.get("categoria") ?? "",
    marca: params.get("marca") ?? "",
    sub: params.get("sub") ?? "",
    capas: params.get("capas") ?? "",
    doblez: params.get("doblez") ?? "",
    color: params.get("color") ?? "",
  };

  const urlQ = params.get("q") ?? "";
  const [query, setQuery] = useState(urlQ);

  const subOptions = useMemo(() => {
    const cat = categories.find((c) => c.slug === selected.categoria);
    if (!cat?.subcategories?.length) return [];
    const present = new Set(
      products
        .filter((p) => p.category === selected.categoria && p.subcategory)
        .map((p) => p.subcategory as string),
    );
    return cat.subcategories.filter((s) => present.has(s));
  }, [categories, products, selected.categoria]);

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const clearAll = useCallback(() => {
    setQuery("");
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  // debounce the box -> ?q=
  useEffect(() => {
    if (query.trim() === urlQ) return;
    const t = setTimeout(() => setParam("q", query.trim()), 250);
    return () => clearTimeout(t);
  }, [query, urlQ, setParam]);

  // Apply category + brand + subcategory first; attribute options come from that subset.
  const preAttr = useMemo(
    () =>
      products.filter(
        (p) =>
          (!selected.categoria || p.category === selected.categoria) &&
          (!selected.marca || p.brand === selected.marca) &&
          (!selected.sub || p.subcategory === selected.sub),
      ),
    [products, selected.categoria, selected.marca, selected.sub],
  );

  const attrOptions = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const def of ATTR_DEFS) {
      const values = new Set<string>();
      for (const p of preAttr) {
        const v = p.specs[def.key as keyof Product["specs"]];
        if (v !== undefined && v !== null && v !== "") values.add(String(v));
      }
      if (values.size > 1) {
        out[def.param] = [...values].sort((a, b) =>
          a.localeCompare(b, "es", { numeric: true }),
        );
      }
    }
    return out;
  }, [preAttr]);

  const filtered = useMemo(() => {
    const q = norm(urlQ.trim());
    return preAttr.filter((p) => {
      const okAttrs = ATTR_DEFS.every((def) => {
        const want = selected[def.param as keyof typeof selected];
        if (!want) return true;
        return (
          String(p.specs[def.key as keyof Product["specs"]] ?? "") === want
        );
      });
      if (!okAttrs) return false;
      if (!q) return true;
      return norm(`${p.name} ${p.sku ?? ""}`).includes(q);
    });
  }, [preAttr, selected, urlQ]);

  const brandCountsInScope = useMemo(() => {
    const base = products.filter(
      (p) => !selected.categoria || p.category === selected.categoria,
    );
    const counts: Record<string, number> = {};
    for (const p of base) counts[p.brand] = (counts[p.brand] ?? 0) + 1;
    return counts;
  }, [products, selected.categoria]);

  const hasActiveFilters =
    (!lockedCategory && selected.categoria) ||
    selected.marca ||
    selected.sub ||
    selected.capas ||
    selected.doblez ||
    selected.color ||
    urlQ;

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      {/* filters */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-ink">
            Filtros
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-blue hover:underline"
            >
              <X className="size-3" /> Limpiar
            </button>
          )}
        </div>

        {!lockedCategory && (
          <FilterGroup label="Categoría">
            <Chip
              active={!selected.categoria}
              onClick={() => setParam("categoria", "")}
            >
              Todas
            </Chip>
            {categories.map((c) => (
              <Chip
                key={c.slug}
                active={selected.categoria === c.slug}
                onClick={() => setParam("categoria", c.slug)}
              >
                {c.name}
              </Chip>
            ))}
          </FilterGroup>
        )}

        <FilterGroup label="Marca">
          <Chip active={!selected.marca} onClick={() => setParam("marca", "")}>
            Todas
          </Chip>
          {brands
            .filter((b) => brandCountsInScope[b.slug])
            .map((b) => (
              <Chip
                key={b.slug}
                active={selected.marca === b.slug}
                onClick={() => setParam("marca", b.slug)}
              >
                {b.name}
              </Chip>
            ))}
        </FilterGroup>

        {subOptions.length > 0 && (
          <FilterGroup label="Tipo">
            <Chip active={!selected.sub} onClick={() => setParam("sub", "")}>
              Todos
            </Chip>
            {subOptions.map((s) => (
              <Chip
                key={s}
                active={selected.sub === s}
                onClick={() => setParam("sub", s)}
              >
                {s}
              </Chip>
            ))}
          </FilterGroup>
        )}

        {ATTR_DEFS.filter((d) => attrOptions[d.param]).map((def) => (
          <FilterGroup key={def.param} label={def.label}>
            <Chip
              active={!selected[def.param as keyof typeof selected]}
              onClick={() => setParam(def.param, "")}
            >
              Todos
            </Chip>
            {attrOptions[def.param].map((v) => (
              <Chip
                key={v}
                active={selected[def.param as keyof typeof selected] === v}
                onClick={() => setParam(def.param, v)}
              >
                {def.suffix(v)}
              </Chip>
            ))}
          </FilterGroup>
        ))}
      </aside>

      {/* grid */}
      <div>
        <div className="relative mb-4">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o referencia…"
            aria-label="Buscar productos"
            className="w-full rounded-lg border border-control-border bg-white py-2.5 pl-10 pr-9 text-sm text-ink placeholder:text-muted focus-visible:border-brand-blue"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Borrar búsqueda"
              className="absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted hover:text-brand-blue-dark"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <p className="mb-5 text-sm text-muted">
          {filtered.length}{" "}
          {filtered.length === 1 ? "producto" : "productos"}
          {urlQ ? ` para «${urlQ}»` : ""}
          {selected.marca ? ` · ${brandLabel(selected.marca as never)}` : ""}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="font-heading font-semibold text-ink">
              {urlQ
                ? `Nada coincide con «${urlQ}».`
                : "Sin resultados para esta combinación de filtros."}
            </p>
            <button
              onClick={clearAll}
              className="mt-2 text-sm font-medium text-brand-blue hover:underline"
            >
              Limpiar {urlQ ? "búsqueda y filtros" : "filtros"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard
                key={p.slug}
                product={p}
                categorySlug={p.category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-brand-blue-dark bg-brand-blue-dark text-white"
          : "border-control-border bg-white text-body hover:border-brand-blue hover:text-brand-blue-dark",
      )}
    >
      {children}
    </button>
  );
}
