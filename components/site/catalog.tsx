"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./product-card";
import { ProductRow, ROW_COLS } from "./product-row";
import { CategoryIcon } from "./category-icon";
import { replaceUrlSearch, useUrlSearch } from "@/lib/use-url-search";
import { QUERY, catFromSlug, catSlug, type Lang } from "@/lib/i18n/routes";
import { specValue } from "@/lib/i18n/content";
import { ui } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";
import type { Brand, Category, Product } from "@/lib/content/types";

const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const collator = new Intl.Collator("es", { numeric: true, sensitivity: "base" });

const ATTRS = [
  { key: "ply", param: "capas" as const },
  { key: "fold", param: "doblez" as const },
  { key: "color", param: "color" as const },
  { key: "packFormat", param: "pres" as const },
];
const SORT_IDS = ["", "nombre", "sku", "marca"] as const;

type Params = Record<string, string>;

/**
 * Catálogo con filtros, búsqueda y dos vistas (tabla densa y tarjetas). Recibe los datos
 * ya localizados; el estado vive en la URL (parámetros según el idioma). El servidor
 * renderiza la lista completa, así que el HTML estático trae todos los productos.
 */
export function Catalog({
  products,
  categories,
  brands,
  lang,
  lockedCategory,
  headingLevel = "h2",
}: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  lang: Lang;
  lockedCategory?: string;
  headingLevel?: "h2" | "h3";
}) {
  const t = ui(lang).catalog;
  const Q = QUERY[lang];
  const search = useUrlSearch();
  const url = useMemo(() => new URLSearchParams(search), [search]);
  const get = (k: keyof typeof Q) => url.get(Q[k]) ?? "";
  const iconOf = useMemo(() => new Map(categories.map((c) => [c.slug, c.icon])), [categories]);

  // ------------------------------------------------------------ estado en URL
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const update = (changes: Params) => {
    const next = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(Q[k as keyof typeof Q], v);
      else next.delete(Q[k as keyof typeof Q]);
    }
    replaceUrlSearch(next);
  };

  const setFilter = (key: keyof typeof Q, value: string) => {
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
  const view = get("vista") === (lang === "es" ? "tarjetas" : "cards") ? "cards" : "table";
  const sortId = (SORT_IDS as readonly string[]).includes(get("orden")) ? get("orden") : "";

  // ------------------------------------------------------------------ filtros
  const scoped = useMemo(
    () => products.filter((p) => !lockedCategory || p.category === lockedCategory),
    [products, lockedCategory],
  );
  const categoria = lockedCategory ?? catFromSlug(lang, get("categoria"));
  const inCategory = useMemo(() => scoped.filter((p) => !categoria || p.category === categoria), [scoped, categoria]);

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
  const attrLabel = (param: string) =>
    param === "capas" ? t.ply : param === "doblez" ? t.fold : param === "color" ? t.color : t.pack;
  const attrShow = (param: string, v: string) =>
    param === "capas" ? t.plyValue(v) : param === "pres" ? v : specValue(v, lang);

  // Opciones de cada atributo: se calculan con los demás atributos aplicados.
  const attrOptions = useMemo(() => {
    const out: Record<string, { value: string; n: number }[]> = {};
    for (const def of ATTRS) {
      const counts = new Map<string, number>();
      for (const p of base) {
        const others = ATTRS.every((o) => o.param === def.param || !url.get(Q[o.param]) || attrValue(p, o.key) === url.get(Q[o.param]));
        if (!others) continue;
        const v = attrValue(p, def.key);
        if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
      }
      if (counts.size > 1) {
        out[def.param] = [...counts.entries()].map(([value, n]) => ({ value, n })).sort((a, b) => collator.compare(a.value, b.value));
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, url]);

  // Un valor en la URL que ya no existe entre las opciones se ignora (no filtra a ciegas).
  const activeAttrs = ATTRS.filter((d) => attrOptions[d.param]?.some((o) => o.value === get(d.param)));

  const filtered = useMemo(() => {
    const tokens = norm(urlQ.trim()).split(/\s+/).filter(Boolean);
    const brandName = (slug: string) => brands.find((b) => b.slug === slug)?.name ?? "";
    const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "";
    let list = base.filter((p) => {
      if (!activeAttrs.every((d) => attrValue(p, d.key) === get(d.param))) return false;
      if (!tokens.length) return true;
      const hay = norm(
        `${p.name} ${p.sku ?? ""} ${catName(p.category)} ${brandName(p.brand)} ${p.subcategory ?? ""} ${p.keySpecs.join(" ")} ${p.specs.packFormat ?? ""}`,
      );
      return tokens.every((tk) => hay.includes(tk));
    });
    if (sortId) {
      list = list.slice().sort((a, b) =>
        sortId === "sku" ? collator.compare(a.sku ?? "~", b.sku ?? "~")
        : sortId === "marca" ? collator.compare(a.brand, b.brand) || collator.compare(a.name, b.name)
        : collator.compare(a.name, b.name),
      );
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, activeAttrs, urlQ, sortId, brands, categories, search]);

  const hasFilters = Boolean((!lockedCategory && categoria) || marca || sub || activeAttrs.length || urlQ);
  const activeCount = [!lockedCategory && categoria, marca, sub, ...activeAttrs].filter(Boolean).length;
  const clearAll = () => {
    if (timer.current) clearTimeout(timer.current);
    setDraft(null);
    const next = new URLSearchParams(window.location.search);
    for (const k of ["categoria", "marca", "sub", "capas", "doblez", "color", "pres", "q"] as const) next.delete(Q[k]);
    replaceUrlSearch(next);
  };

  const H = headingLevel;
  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of scoped) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [scoped]);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:grid-rows-[auto_auto_1fr] lg:items-start lg:gap-x-10 lg:gap-y-5">
      {/* búsqueda primero (también en móvil) */}
      <div className="lg:col-start-2 lg:row-start-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-brand-blue" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchLabel}
            className="h-12 w-full rounded-lg border border-control-border bg-white pl-11 pr-10 text-base text-ink placeholder:text-muted"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setDraft(null); update({ q: "" }); }}
              aria-label={t.clearSearch}
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted hover:text-ink"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* categorías: acceso directo con icono y conteo */}
      {!lockedCategory && (
        <div className="lg:col-start-2 lg:row-start-2">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible" aria-label={t.category}>
            <li>
              <Chip active={!categoria} onClick={() => setFilter("categoria", "")}>
                {t.all} <span className="text-muted">{scoped.length}</span>
              </Chip>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Chip active={categoria === c.slug} onClick={() => setFilter("categoria", catSlug(lang, c.slug))}>
                  <CategoryIcon name={c.icon} className="size-4 text-brand-blue" />
                  {c.name} <span className="text-muted">{categoryCounts[c.slug] ?? 0}</span>
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* filtros */}
      <aside className="lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:self-start">
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          aria-controls="catalog-filters"
          className="flex h-11 w-full items-center justify-between rounded-lg border border-control-border px-3 font-heading font-bold text-ink lg:hidden"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-brand-blue" aria-hidden /> {t.filters}
          </span>
          {activeCount > 0 && <span className="rounded-sm bg-brand-blue px-1.5 text-sm text-white">{activeCount}</span>}
        </button>

        <div id="catalog-filters" className={cn("lg:block", filtersOpen ? "block" : "hidden")}>
          <div className="mt-4 flex items-center justify-between lg:mt-0">
            <H className="label !text-ink">{t.filters}</H>
            {hasFilters && (
              <button type="button" onClick={clearAll} className="inline-flex items-center gap-1 text-sm font-bold text-brand-blue-dark hover:underline">
                <X className="size-3.5" aria-hidden /> {t.clearAll}
              </button>
            )}
          </div>

          {brandOptions.length > 1 && (
            <Group label={t.brand}>
              <Option active={!marca} onClick={() => setFilter("marca", "")}>{t.all}</Option>
              {brandOptions.map((b) => (
                <Option key={b.slug} active={marca === b.slug} onClick={() => setFilter("marca", b.slug)} n={b.n}>
                  {b.name}
                </Option>
              ))}
            </Group>
          )}

          {subOptions.length > 0 && (
            <Group label={t.type}>
              <Option active={!sub} onClick={() => setFilter("sub", "")}>{t.allM}</Option>
              {subOptions.map((s) => (
                <Option key={s.name} active={sub === s.name} onClick={() => setFilter("sub", s.name)} n={s.n}>
                  {s.name}
                </Option>
              ))}
            </Group>
          )}

          {ATTRS.filter((d) => attrOptions[d.param]).map((def) => (
            <Group key={def.param} label={attrLabel(def.param)}>
              <Option active={!activeAttrs.includes(def)} onClick={() => setFilter(def.param, "")}>{t.all}</Option>
              {attrOptions[def.param].map((o) => (
                <Option key={o.value} active={get(def.param) === o.value} onClick={() => setFilter(def.param, o.value)} n={o.n}>
                  {attrShow(def.param, o.value)}
                </Option>
              ))}
            </Group>
          ))}
        </div>
      </aside>

      {/* resultados */}
      <div className={cn("lg:col-start-2", lockedCategory ? "lg:row-start-2" : "lg:row-start-3")}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="text-sm text-muted">
            <strong className="font-bold text-ink">{filtered.length}</strong>{" "}
            {ui(lang).count.product(filtered.length).replace(/^\d+\s/, "")}
            {urlQ ? t.forQuery(urlQ) : ""}
          </p>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="sr-only sm:not-sr-only">{t.sort}</span>
              <select
                value={sortId}
                onChange={(e) => update({ orden: e.target.value })}
                className="h-10 rounded-md border border-control-border bg-white px-2 text-sm text-ink"
              >
                {SORT_IDS.map((id) => <option key={id} value={id}>{t.sortOptions[id]}</option>)}
              </select>
            </label>
            <div className="inline-flex overflow-hidden rounded-md border border-control-border" role="group" aria-label={t.view}>
              {([["table", List, t.table], ["cards", LayoutGrid, t.cards]] as const).map(([id, Icon, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={view === id}
                  onClick={() => update({ vista: id === "table" ? "" : lang === "es" ? "tarjetas" : "cards" })}
                  className={cn("inline-flex h-10 items-center gap-1.5 px-3 text-sm font-bold", view === id ? "bg-brand-blue-dark text-white" : "bg-white text-body hover:bg-surface")}
                >
                  <Icon className="size-4" aria-hidden /> <span className="hidden sm:inline">{label}</span>
                  <span className="sr-only sm:hidden">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <h2 className="sr-only">{t.results}</h2>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-control-border p-10 text-center">
            <p className="font-heading text-lg font-bold text-ink">{urlQ ? t.emptyQuery(urlQ) : t.emptyFilters}</p>
            <p className="mt-1 text-body">{t.emptyHint}</p>
            <button type="button" onClick={clearAll} className="mt-4 font-bold text-brand-blue-dark underline underline-offset-4">
              {t.emptyClear}
            </button>
          </div>
        ) : view === "cards" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => <ProductCard key={p.slug} product={p} icon={iconOf.get(p.category) ?? ""} lang={lang} />)}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <div className={cn("label hidden gap-x-4 border-b border-border bg-brand-blue-50 px-3 py-2.5 text-brand-blue-dark md:grid", ROW_COLS)} aria-hidden>
              <span />
              <span>{t.colSku}</span>
              <span>{t.colProduct}</span>
              <span>{t.colBrand}</span>
              <span>{t.colPack}</span>
              <span className="text-right">{t.colQuote}</span>
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((p) => <ProductRow key={p.slug} product={p} icon={iconOf.get(p.category) ?? ""} lang={lang} />)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 text-sm font-semibold transition-colors",
        active ? "border-brand-blue bg-brand-blue-50 text-brand-blue-dark" : "border-control-border bg-white text-body hover:border-brand-blue hover:bg-brand-blue-50",
      )}
    >
      {children}
    </button>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-6 min-w-0 border-t border-border pt-3">
      <legend className="label pr-2 text-muted">{label}</legend>
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
          "flex w-full items-baseline justify-between gap-2 rounded-md border-l-[3px] px-2.5 py-1.5 text-left text-[0.9375rem] hover:bg-brand-blue-50",
          active ? "border-brand-red bg-brand-blue-50 font-bold text-brand-blue-dark" : "border-transparent text-body",
        )}
      >
        <span>{children}</span>
        {n !== undefined && <span className="text-sm tabular-nums text-muted">{n}</span>}
      </button>
    </li>
  );
}
