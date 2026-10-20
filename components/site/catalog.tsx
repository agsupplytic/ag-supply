"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./product-card";
import { ProductRow, ROW_COLS } from "./product-row";
import { replaceUrlSearch, useUrlSearch } from "@/lib/use-url-search";
import { cn } from "@/lib/utils";
import type { Brand, Category, Product } from "@/lib/content/types";

const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const collator = new Intl.Collator("es", { numeric: true, sensitivity: "base" });

const ATTRS = [
  { key: "ply", param: "capas", label: "Capas", show: (v: string) => `${v} ${v === "1" ? "capa" : "capas"}` },
  { key: "fold", param: "doblez", label: "Doblez", show: (v: string) => v },
  { key: "color", param: "color", label: "Color", show: (v: string) => v },
  { key: "packFormat", param: "pres", label: "Presentación", show: (v: string) => v },
] as const;

const SORTS = [
  { id: "", label: "Orden del catálogo" },
  { id: "nombre", label: "Nombre (A–Z)" },
  { id: "sku", label: "SKU" },
  { id: "marca", label: "Marca" },
] as const;

const FILTER_PARAMS = ["categoria", "marca", "sub", ...ATTRS.map((a) => a.param)];

type Params = Record<string, string>;

export function Catalog({
  products,
  categories,
  brands,
  lockedCategory,
  headingLevel = "h2",
}: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  lockedCategory?: string;
  headingLevel?: "h2" | "h3";
}) {
  const search = useUrlSearch();
  const url = useMemo(() => new URLSearchParams(search), [search]);
  const get = (k: string) => url.get(k) ?? "";

  // ------------------------------------------------------------ estado en URL
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const update = (changes: Params) => {
    const next = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    replaceUrlSearch(next);
  };

  const setFilter = (key: string, value: string) => {
    // Cambiar de categoría invalida los filtros que dependen de ella.
    const reset: Params = key === "categoria" ? { sub: "", capas: "", doblez: "", color: "", pres: "" } : {};
    update({ ...reset, [key]: value });
  };

  const onQuery = (value: string) => {
    setDraft(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      update({ q: value.trim() });
      setDraft(null);
    }, 200);
  };

  const urlQ = get("q");
  const query = draft ?? urlQ;
  const view = get("vista") === "tarjetas" ? "tarjetas" : "tabla";
  const sort = SORTS.some((s) => s.id === get("orden")) ? get("orden") : "";

  // ------------------------------------------------------------------ filtros
  const scoped = useMemo(
    () => products.filter((p) => !lockedCategory || p.category === lockedCategory),
    [products, lockedCategory],
  );
  const categoria = lockedCategory ?? get("categoria");
  const inCategory = useMemo(
    () => scoped.filter((p) => !categoria || p.category === categoria),
    [scoped, categoria],
  );

  const brandOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of inCategory) counts[p.brand] = (counts[p.brand] ?? 0) + 1;
    return brands.filter((b) => counts[b.slug]).map((b) => ({ ...b, n: counts[b.slug] }));
  }, [inCategory, brands]);
  const marca = brandOptions.some((b) => b.slug === get("marca")) ? get("marca") : "";

  const subOptions = useMemo(() => {
    const cat = categories.find((c) => c.slug === categoria);
    if (!cat?.subcategories?.length) return [];
    const counts: Record<string, number> = {};
    for (const p of inCategory) if (p.subcategory) counts[p.subcategory] = (counts[p.subcategory] ?? 0) + 1;
    return cat.subcategories.filter((s) => counts[s]).map((s) => ({ name: s, n: counts[s] }));
  }, [categories, categoria, inCategory]);
  const sub = subOptions.some((s) => s.name === get("sub")) ? get("sub") : "";

  const base = useMemo(
    () => inCategory.filter((p) => (!marca || p.brand === marca) && (!sub || p.subcategory === sub)),
    [inCategory, marca, sub],
  );

  const attrValue = (p: Product, key: string) => {
    const v = p.specs[key as keyof Product["specs"]];
    return v === undefined || v === null || v === "" ? "" : String(v);
  };

  // Opciones de cada atributo: se calculan con los demás atributos aplicados.
  const attrOptions = useMemo(() => {
    const out: Record<string, { value: string; n: number }[]> = {};
    for (const def of ATTRS) {
      const counts = new Map<string, number>();
      for (const p of base) {
        const others = ATTRS.every((o) => o.param === def.param || !url.get(o.param) || attrValue(p, o.key) === url.get(o.param));
        if (!others) continue;
        const v = attrValue(p, def.key);
        if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
      }
      if (counts.size > 1) {
        out[def.param] = [...counts.entries()]
          .map(([value, n]) => ({ value, n }))
          .sort((a, b) => collator.compare(a.value, b.value));
      }
    }
    return out;
  }, [base, url]);

  // Un valor en la URL que ya no existe entre las opciones se ignora (no filtra a ciegas).
  const activeAttrs = ATTRS.filter((d) => attrOptions[d.param]?.some((o) => o.value === get(d.param)));

  const filtered = useMemo(() => {
    const tokens = norm(urlQ.trim()).split(/\s+/).filter(Boolean);
    const brandName = (slug: string) => brands.find((b) => b.slug === slug)?.name ?? "";
    let list = base.filter((p) => {
      if (!activeAttrs.every((d) => attrValue(p, d.key) === get(d.param))) return false;
      if (!tokens.length) return true;
      const hay = norm(
        `${p.name} ${p.sku ?? ""} ${brandName(p.brand)} ${p.subcategory ?? ""} ${p.keySpecs.join(" ")} ${p.specs.packFormat ?? ""}`,
      );
      return tokens.every((t) => hay.includes(t));
    });
    if (sort) {
      list = list.slice().sort((a, b) =>
        sort === "sku" ? collator.compare(a.sku ?? "~", b.sku ?? "~")
        : sort === "marca" ? collator.compare(a.brand, b.brand) || collator.compare(a.name, b.name)
        : collator.compare(a.name, b.name),
      );
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, activeAttrs, urlQ, sort, brands, search]);

  const hasFilters = Boolean((!lockedCategory && categoria) || marca || sub || activeAttrs.length || urlQ);
  const activeCount = [!lockedCategory && categoria, marca, sub, ...activeAttrs].filter(Boolean).length;
  const clearAll = () => {
    if (timer.current) clearTimeout(timer.current);
    setDraft(null);
    const next = new URLSearchParams(window.location.search);
    for (const k of [...FILTER_PARAMS, "q"]) next.delete(k);
    replaceUrlSearch(next);
  };

  const H = headingLevel;
  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of scoped) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [scoped]);

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
      {/* búsqueda primero en móvil */}
      <div className="lg:col-start-2 lg:row-start-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Buscar por producto, SKU, marca o presentación (ej. 48/1)"
            aria-label="Buscar productos"
            className="h-12 w-full border border-control-border bg-white pl-11 pr-10 text-base text-ink placeholder:text-muted"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setDraft(null); update({ q: "" }); }}
              aria-label="Borrar búsqueda"
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center text-muted hover:text-ink"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* filtros */}
      <aside className="lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start">
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          aria-controls="catalog-filters"
          className="flex h-11 w-full items-center justify-between border border-control-border px-3 font-heading font-semibold text-ink lg:hidden"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="size-4" aria-hidden /> Filtros
          </span>
          {activeCount > 0 && <span className="bg-brand-blue px-1.5 text-sm text-white">{activeCount}</span>}
        </button>

        <div id="catalog-filters" className={cn("lg:block", filtersOpen ? "block" : "hidden")}>
          <div className="mt-4 flex items-center justify-between lg:mt-0">
            <H className="label !text-ink">Filtros</H>
            {hasFilters && (
              <button type="button" onClick={clearAll} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue-dark hover:underline">
                <X className="size-3.5" aria-hidden /> Limpiar todo
              </button>
            )}
          </div>

          {!lockedCategory && (
            <Group label="Categoría">
              <Option active={!categoria} onClick={() => setFilter("categoria", "")} n={scoped.length}>Todas</Option>
              {categories.map((c) => (
                <Option key={c.slug} active={categoria === c.slug} onClick={() => setFilter("categoria", c.slug)} n={categoryCounts[c.slug] ?? 0}>
                  {c.name}
                </Option>
              ))}
            </Group>
          )}

          {brandOptions.length > 1 && (
            <Group label="Marca">
              <Option active={!marca} onClick={() => setFilter("marca", "")}>Todas</Option>
              {brandOptions.map((b) => (
                <Option key={b.slug} active={marca === b.slug} onClick={() => setFilter("marca", b.slug)} n={b.n}>
                  {b.name}
                </Option>
              ))}
            </Group>
          )}

          {subOptions.length > 0 && (
            <Group label="Tipo">
              <Option active={!sub} onClick={() => setFilter("sub", "")}>Todos</Option>
              {subOptions.map((s) => (
                <Option key={s.name} active={sub === s.name} onClick={() => setFilter("sub", s.name)} n={s.n}>
                  {s.name}
                </Option>
              ))}
            </Group>
          )}

          {ATTRS.filter((d) => attrOptions[d.param]).map((def) => (
            <Group key={def.param} label={def.label}>
              <Option active={!activeAttrs.includes(def)} onClick={() => setFilter(def.param, "")}>Todas</Option>
              {attrOptions[def.param].map((o) => (
                <Option key={o.value} active={get(def.param) === o.value} onClick={() => setFilter(def.param, o.value)} n={o.n}>
                  {def.show(o.value)}
                </Option>
              ))}
            </Group>
          ))}
        </div>
      </aside>

      {/* resultados */}
      <div className="lg:col-start-2 lg:row-start-2">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-sm text-muted">
            <strong className="font-semibold text-ink">{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "producto" : "productos"}
            {urlQ ? ` para «${urlQ}»` : ""}
          </p>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="sr-only sm:not-sr-only">Ordenar</span>
              <select
                value={sort}
                onChange={(e) => update({ orden: e.target.value })}
                className="h-10 border border-control-border bg-white px-2 text-sm text-ink"
              >
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            <div className="inline-flex border border-control-border" role="group" aria-label="Vista">
              {([["tabla", List, "Tabla"], ["tarjetas", LayoutGrid, "Tarjetas"]] as const).map(([id, Icon, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={view === id}
                  onClick={() => update({ vista: id === "tabla" ? "" : id })}
                  className={cn("inline-flex h-10 items-center gap-1.5 px-3 text-sm font-semibold", view === id ? "bg-brand-blue-dark text-white" : "bg-white text-body hover:bg-surface")}
                >
                  <Icon className="size-4" aria-hidden /> <span className="hidden sm:inline">{label}</span>
                  <span className="sr-only sm:hidden">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="border border-dashed border-control-border p-10 text-center">
            <p className="font-heading text-lg font-semibold text-ink">
              {urlQ ? `Ningún producto coincide con «${urlQ}».` : "Sin resultados con estos filtros."}
            </p>
            <p className="mt-1 text-body">Pruebe con menos filtros o escríbanos y le ayudamos a ubicar la referencia.</p>
            <button type="button" onClick={clearAll} className="mt-4 font-semibold text-brand-blue-dark underline underline-offset-4">
              Limpiar búsqueda y filtros
            </button>
          </div>
        ) : view === "tarjetas" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        ) : (
          <div className="border-y border-border">
            <div className={cn("label hidden gap-x-4 border-b-2 border-ink px-3 py-2 text-muted md:grid", ROW_COLS)} aria-hidden>
              <span>SKU</span><span>Producto</span><span>Marca</span><span>Presentación</span><span className="text-right">Cotizar</span>
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((p) => <ProductRow key={p.slug} product={p} />)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-6 min-w-0 border-t border-border pt-3">
      <legend className="label -ml-0 pr-2 text-muted">{label}</legend>
      <ul className="mt-1">{children}</ul>
    </fieldset>
  );
}

function Option({ active, onClick, n, children }: { active: boolean; onClick: () => void; n?: number; children: React.ReactNode }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "flex w-full items-baseline justify-between gap-2 border-l-[3px] px-2.5 py-1.5 text-left text-[0.9375rem] hover:bg-surface",
          active ? "border-brand-red bg-brand-blue-50 font-semibold text-brand-blue-dark" : "border-transparent text-body",
        )}
      >
        <span>{children}</span>
        {n !== undefined && <span className="text-sm tabular-nums text-muted">{n}</span>}
      </button>
    </li>
  );
}
