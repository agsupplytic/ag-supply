"use client";

import Link from "next/link";
import { useState } from "react";
import { Copy, FileText, Send, Trash2 } from "lucide-react";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { BrandBadge } from "@/components/site/brand-badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { useQuote } from "@/lib/quote/store";
import { buildWhatsAppMessages } from "@/lib/quote/build-message";
import { track } from "@/lib/analytics";
import { waLink } from "@/lib/site-config";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";

export type QuoteIndex = Record<
  string,
  { name: string; category: string; keySpecs: string[]; sku: string | null; pack: string | null }
>;

/** Cantidad editable: permite vaciar el campo al escribir y la corrige al salir. */
function QtyField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  const [text, setText] = useState<string | null>(null);
  return (
    <input
      type="number"
      inputMode="numeric"
      min={1}
      value={text ?? String(value)}
      onChange={(e) => {
        setText(e.target.value);
        const n = Math.floor(Number(e.target.value));
        if (Number.isFinite(n) && n >= 1) onChange(n);
      }}
      onBlur={() => setText(null)}
      aria-label={label}
      className="h-10 w-20 rounded-md border border-control-border bg-white text-center font-heading text-base font-bold text-ink"
    />
  );
}

export function QuoteView({ index, lang }: { index: QuoteIndex; lang: Lang }) {
  const t = ui(lang).quote;
  const { items, hydrated, updateQty, updateNote, removeItem, clear } = useQuote();

  // Listas guardadas en otro idioma o antes de existir SKU/presentación: se completan
  // y se nombran desde el catálogo en el idioma actual.
  const enriched = items.map((i) => ({
    ...i,
    name: index[i.slug]?.name ?? i.name,
    sku: i.sku ?? index[i.slug]?.sku ?? undefined,
    pack: i.pack ?? index[i.slug]?.pack ?? undefined,
  }));
  const messages = buildWhatsAppMessages(enriched, lang);

  async function copyList() {
    try {
      await navigator.clipboard.writeText(messages.join("\n\n"));
      track("quote_copy", { items: items.length });
      toast.success(t.copied, { description: t.copiedHint });
    } catch {
      toast.error(t.copyFail);
    }
  }

  return (
    <>
      <PageHero
        breadcrumb={[{ name: ui(lang).home, href: href(lang, { name: "home" }) }, { name: ui(lang).quoteBtn }]}
        breadcrumbLabel={ui(lang).nav.breadcrumb}
        title={t.title}
        lead={t.lead}
      />

      <Container className="py-10 md:py-12">
        {!hydrated ? (
          <p className="py-16 text-center text-muted" role="status">{t.loading}</p>
        ) : items.length === 0 ? (
          <div className="card mx-auto max-w-lg p-10 text-center">
            <FileText className="mx-auto size-10 text-brand-blue" aria-hidden />
            <h2 className="mt-4 text-2xl">{t.emptyTitle}</h2>
            <p className="mt-2 text-body">{t.emptyText}</p>
            <Button asChild className="mt-6">
              <Link href={href(lang, { name: "products" })}>{t.goCatalog}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
            <div>
              <p className="mb-3 text-sm text-muted">{t.intro(items.length)}</p>
              <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
                {enriched.map((item) => {
                  const meta = index[item.slug];
                  const to = meta ? href(lang, { name: "product", cat: meta.category, slug: item.slug }) : href(lang, { name: "products" });
                  const detail = (meta?.keySpecs ?? []).filter((k) => !/^(Presentación|Pack)\b/.test(k));
                  return (
                    <li key={item.slug} className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:gap-6">
                      <div className="min-w-0">
                        <Link href={to} className="font-heading text-lg font-bold leading-snug text-ink [font-stretch:100%] hover:text-brand-blue-dark hover:underline">
                          {item.name}
                        </Link>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                          <BrandBadge brand={item.brand} lang={lang} />
                          {item.sku && <span>{t.skuLabel} {item.sku}</span>}
                          {item.pack && <span>{t.packLabel} {item.pack}</span>}
                          {detail.length > 0 && <span>{detail.join(" · ")}</span>}
                        </p>
                        <input
                          type="text"
                          value={item.note ?? ""}
                          maxLength={280}
                          onChange={(e) => updateNote(item.slug, e.target.value)}
                          placeholder={t.notePlaceholder}
                          aria-label={t.noteLabel(item.name)}
                          className="mt-3 h-10 w-full rounded-md border border-control-border bg-white px-3 text-base text-ink placeholder:text-muted"
                        />
                      </div>
                      <div className="flex items-start gap-3 md:justify-end">
                        <QtyField label={ui(lang).add.qty(item.name)} value={item.qty} onChange={(n) => updateQty(item.slug, n)} />
                        <button
                          type="button"
                          onClick={() => removeItem(item.slug)}
                          aria-label={t.remove(item.name)}
                          className="grid size-10 place-items-center rounded-md border border-control-border text-muted hover:border-brand-red-dark hover:text-brand-red-dark"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <aside className="lg:sticky lg:top-36 lg:self-start">
              <div className="card p-5">
                <h2 className="label !text-brand-blue-dark">{t.summary}</h2>
                <table className="spec-table mt-2">
                  <tbody>
                    <tr><th scope="row">{t.products}</th><td>{items.length}</td></tr>
                    <tr><th scope="row">{t.prices}</th><td>{t.pricesValue}</td></tr>
                  </tbody>
                </table>

                {messages.length > 1 && (
                  <p className="mt-4 rounded-md border-l-4 border-brand-red bg-brand-blue-50 p-3 text-sm text-body">{t.long(messages.length)}</p>
                )}

                <div className="mt-5 flex flex-col gap-2">
                  {messages.map((m, i) => (
                    <Button key={i} asChild variant="whatsapp" size="lg" className="w-full">
                      <a href={waLink(m)} target="_blank" rel="noopener noreferrer" data-track="quote_whatsapp_send">
                        <Send aria-hidden />
                        {messages.length > 1 ? t.sendPart(i + 1, messages.length) : t.send}
                      </a>
                    </Button>
                  ))}
                  <Button variant="outline" onClick={copyList} className="w-full">
                    <Copy aria-hidden /> {t.copy}
                  </Button>
                  <Button variant="ghost" onClick={clear} className="w-full">
                    {t.clear}
                  </Button>
                </div>

                <details className="mt-4 border-t border-border pt-4">
                  <summary className="cursor-pointer font-heading font-bold text-ink">{t.viewMessage}</summary>
                  <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-surface p-3 text-sm leading-relaxed text-body">
                    {messages.join("\n\n")}
                  </pre>
                </details>
              </div>
              <p className="mt-4 text-sm">
                <Link href={href(lang, { name: "products" })} className="link">{t.keepAdding}</Link>
              </p>
            </aside>
          </div>
        )}
      </Container>
    </>
  );
}
