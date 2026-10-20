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
import { waLink } from "@/lib/site-config";

export type QuoteIndex = Record<
  string,
  { category: string; keySpecs: string[]; sku: string | null; pack: string | null }
>;

/** Cantidad editable: permite vaciar el campo al escribir y la corrige al salir. */
function QtyField({ name, value, onChange }: { name: string; value: number; onChange: (n: number) => void }) {
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
      aria-label={`Cantidad de ${name}`}
      className="h-10 w-20 border border-control-border bg-white text-center font-heading text-base font-semibold text-ink"
    />
  );
}

export function QuoteView({ index }: { index: QuoteIndex }) {
  const { items, hydrated, updateQty, updateNote, removeItem, clear } = useQuote();

  // Listas guardadas antes de existir SKU o presentación: se completan desde el catálogo.
  const enriched = items.map((i) => ({
    ...i,
    sku: i.sku ?? index[i.slug]?.sku ?? undefined,
    pack: i.pack ?? index[i.slug]?.pack ?? undefined,
  }));
  const messages = buildWhatsAppMessages(enriched);

  async function copyList() {
    try {
      await navigator.clipboard.writeText(messages.join("\n\n"));
      toast.success("Lista copiada", { description: "Péguela en WhatsApp, correo o donde prefiera." });
    } catch {
      toast.error("No se pudo copiar. Use «Ver el mensaje» y copie el texto.");
    }
  }

  return (
    <>
      <PageHero
        breadcrumb={[{ name: "Inicio", href: "/" }, { name: "Cotización" }]}
        title="Su lista de cotización"
        lead="Revise las cantidades, agregue notas y envíe la lista por WhatsApp. La lista se guarda solo en este navegador hasta que usted la envíe."
      />

      <Container className="py-10 md:py-12">
        {!hydrated ? (
          <p className="py-16 text-center text-muted" role="status">Cargando su lista…</p>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-lg border border-border p-10 text-center">
            <FileText className="mx-auto size-8 text-muted" aria-hidden />
            <h2 className="mt-4 text-2xl">La lista está vacía</h2>
            <p className="mt-2 text-body">Busque en el catálogo y añada los productos que necesita.</p>
            <Button asChild className="mt-6">
              <Link href="/productos">Ir al catálogo</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
            <div>
              <p className="mb-3 text-sm text-muted">
                {items.length} {items.length === 1 ? "producto" : "productos"}. La cantidad se cuenta en la
                presentación indicada de cada producto.
              </p>
              <ul className="divide-y divide-border border-y border-border">
                {enriched.map((item) => {
                  const meta = index[item.slug];
                  const href = meta ? `/productos/${meta.category}/${item.slug}` : "/productos";
                  const detail = (meta?.keySpecs ?? []).filter((k) => !k.startsWith("Presentación"));
                  return (
                    <li key={item.slug} className="grid gap-3 py-4 md:grid-cols-[1fr_auto] md:gap-6">
                      <div className="min-w-0">
                        <Link href={href} className="font-heading text-lg font-semibold leading-snug text-ink hover:text-brand-blue-dark hover:underline">
                          {item.name}
                        </Link>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                          <BrandBadge brand={item.brand} />
                          {item.sku && <span>SKU {item.sku}</span>}
                          {item.pack && <span>Presentación {item.pack}</span>}
                          {detail.length > 0 && <span>{detail.join(" · ")}</span>}
                        </p>
                        <input
                          type="text"
                          value={item.note ?? ""}
                          maxLength={280}
                          onChange={(e) => updateNote(item.slug, e.target.value)}
                          placeholder="Nota: formato, color, empaque…"
                          aria-label={`Nota para ${item.name}`}
                          className="mt-3 h-10 w-full border border-control-border bg-white px-3 text-base text-ink placeholder:text-muted"
                        />
                      </div>
                      <div className="flex items-start gap-3 md:justify-end">
                        <QtyField name={item.name} value={item.qty} onChange={(n) => updateQty(item.slug, n)} />
                        <button
                          type="button"
                          onClick={() => removeItem(item.slug)}
                          aria-label={`Quitar ${item.name}`}
                          className="grid size-10 place-items-center border border-control-border text-muted hover:border-brand-red-dark hover:text-brand-red-dark"
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
              <div className="border-2 border-ink p-5">
                <h2 className="label !text-ink">Resumen</h2>
                <table className="spec-table mt-2">
                  <tbody>
                    <tr><th scope="row">Productos</th><td>{items.length}</td></tr>
                    <tr><th scope="row">Precios</th><td>Se confirman por pedido</td></tr>
                  </tbody>
                </table>

                {messages.length > 1 && (
                  <p className="mt-4 border-l-4 border-brand-red pl-3 text-sm text-body">
                    La lista es larga: se enviará en {messages.length} mensajes para que WhatsApp no la corte.
                  </p>
                )}

                <div className="mt-5 flex flex-col gap-2">
                  {messages.map((m, i) => (
                    <Button key={i} asChild variant="whatsapp" size="lg" className="w-full">
                      <a href={waLink(m)} target="_blank" rel="noopener noreferrer">
                        <Send aria-hidden />
                        {messages.length > 1 ? `Enviar parte ${i + 1} de ${messages.length}` : "Enviar por WhatsApp"}
                      </a>
                    </Button>
                  ))}
                  <Button variant="outline" onClick={copyList} className="w-full">
                    <Copy aria-hidden /> Copiar la lista
                  </Button>
                  <Button variant="ghost" onClick={clear} className="w-full">
                    Vaciar lista
                  </Button>
                </div>

                <details className="mt-4 border-t border-border pt-4">
                  <summary className="cursor-pointer font-heading font-semibold text-ink">Ver el mensaje</summary>
                  <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap bg-surface p-3 text-sm leading-relaxed text-body">
                    {messages.join("\n\n")}
                  </pre>
                </details>
              </div>
              <p className="mt-4 text-sm">
                <Link href="/productos" className="link">Seguir agregando productos</Link>
              </p>
            </aside>
          </div>
        )}
      </Container>
    </>
  );
}
