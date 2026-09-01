"use client";

import Link from "next/link";
import {
  Trash2,
  Send,
  ArrowLeft,
  Minus,
  Plus,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { ProductImage } from "@/components/site/product-image";
import { BrandBadge } from "@/components/site/brand-badge";
import { Button } from "@/components/ui/button";
import { useQuote } from "@/lib/quote/context";
import { buildWhatsAppMessage } from "@/lib/quote/build-message";
import { waLink } from "@/lib/site-config";

export type QuoteIndex = Record<
  string,
  {
    image: string | null;
    placeholderImage: boolean;
    category: string;
    keySpecs: string[];
    sku: string | null;
  }
>;

export function QuoteView({ index }: { index: QuoteIndex }) {
  const { items, hydrated, updateQty, updateNote, removeItem, clear } =
    useQuote();

  const message = buildWhatsAppMessage(items);
  const totalUnits = items.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <PageHero
        image={{
          src: "/images/placeholders/section-cta.webp",
          alt: "Contenedor cargado con producto terminado de AG Supply",
        }}
        title="Tu cotización"
        lead="Revisa cantidades, añade una nota si necesitas un formato específico y envía la lista por WhatsApp. No se guarda en ningún servidor: vive solo en este navegador hasta que la envías."
      />

      <Container className="py-12">
        {!hydrated ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl border border-border bg-surface"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-control-border p-12 text-center">
            <span className="panel-icon mx-auto size-14">
              <FileText className="size-7" aria-hidden />
            </span>
            <p className="mt-4 font-heading text-lg font-semibold text-ink">
              Tu cotización está vacía
            </p>
            <p className="mt-2 text-body">
              Explora el catálogo y añade los productos que necesitas.
            </p>
            <Button asChild className="mt-6">
              <Link href="/productos">
                <ArrowLeft className="size-4" /> Ir al catálogo
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            {/* ---------------------------------------------------- item list */}
            <div>
              <p className="mb-4 text-sm text-muted">
                {items.length}{" "}
                {items.length === 1 ? "producto" : "productos"} ·{" "}
                {totalUnits} {totalUnits === 1 ? "unidad" : "unidades"} en total
              </p>

              <ul className="space-y-4">
                {items.map((item) => {
                  const meta = index[item.slug];
                  const href = meta
                    ? `/productos/${meta.category}/${item.slug}`
                    : "/productos";
                  return (
                    <li
                      key={item.slug}
                      className="flex gap-4 rounded-2xl border border-border bg-white p-3 sm:p-4"
                    >
                      <Link
                        href={href}
                        className="w-20 shrink-0 sm:w-28"
                        aria-hidden
                        tabIndex={-1}
                      >
                        <ProductImage
                          product={{
                            name: item.name,
                            images: meta?.image ? [meta.image] : [],
                            placeholderImage: meta?.placeholderImage ?? true,
                          }}
                          className="aspect-square rounded-lg border border-border"
                          sizes="120px"
                          watermark={false}
                          showNote={false}
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-heading text-sm font-semibold leading-snug text-ink">
                              <Link
                                href={href}
                                className="transition-colors hover:text-brand-blue-dark"
                              >
                                {item.name}
                              </Link>
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              <BrandBadge brand={item.brand} />
                              {(meta?.keySpecs ?? []).map((s) => (
                                <span
                                  key={s}
                                  className="rounded bg-brand-blue-50 px-1.5 py-0.5 text-[0.7rem] font-medium text-brand-blue-dark"
                                >
                                  {s}
                                </span>
                              ))}
                              {meta?.sku && (
                                <span className="text-[0.7rem] text-muted">
                                  Ref. {meta.sku}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.slug)}
                            className="shrink-0 rounded-md p-1.5 text-muted transition-colors hover:bg-surface hover:text-brand-red-dark"
                            aria-label={`Eliminar ${item.name}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center gap-3">
                          {/* qty stepper */}
                          <div className="inline-flex items-center rounded-md border border-control-border">
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(item.slug, Math.max(1, item.qty - 1))
                              }
                              className="grid size-9 place-items-center text-body hover:text-brand-blue-dark"
                              aria-label={`Disminuir cantidad de ${item.name}`}
                            >
                              <Minus className="size-4" />
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) =>
                                updateQty(
                                  item.slug,
                                  Math.max(
                                    1,
                                    Math.floor(Number(e.target.value) || 1),
                                  ),
                                )
                              }
                              className="w-12 border-x border-control-border bg-transparent py-1.5 text-center font-heading font-semibold text-ink"
                              aria-label={`Cantidad de ${item.name}`}
                            />
                            <button
                              type="button"
                              onClick={() => updateQty(item.slug, item.qty + 1)}
                              className="grid size-9 place-items-center text-body hover:text-brand-blue-dark"
                              aria-label={`Aumentar cantidad de ${item.name}`}
                            >
                              <Plus className="size-4" />
                            </button>
                          </div>

                          <input
                            type="text"
                            value={item.note ?? ""}
                            onChange={(e) =>
                              updateNote(item.slug, e.target.value)
                            }
                            placeholder="Nota: formato, color, empaque…"
                            className="min-w-0 flex-1 rounded-md border border-control-border bg-white px-2.5 py-1.5 text-sm text-ink placeholder:text-muted"
                            aria-label={`Nota para ${item.name}`}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ------------------------------------------------------ summary */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-brand-blue-100 bg-brand-blue-50 p-6">
                <h2 className="font-heading text-lg font-bold text-ink">
                  Resumen
                </h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-body">Productos</dt>
                    <dd className="font-heading font-semibold text-ink">
                      {items.length}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-body">Unidades en total</dt>
                    <dd className="font-heading font-semibold text-ink">
                      {totalUnits}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex items-start gap-2 rounded-lg bg-white p-3 text-xs text-body">
                  <ShieldCheck
                    className="mt-0.5 size-4 shrink-0 text-brand-blue-dark"
                    aria-hidden
                  />
                  Sin precios en línea. Confirmamos precio y disponibilidad por
                  pedido, con entrega en el tiempo acordado.
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <Button asChild variant="whatsapp" size="lg" className="w-full">
                    <a
                      href={waLink(message)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Send className="size-4" />
                      Enviar por WhatsApp
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clear}
                    className="w-full"
                  >
                    Vaciar lista
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/productos">Seguir explorando</Link>
                  </Button>
                </div>

                <details className="group mt-4 border-t border-border pt-4">
                  <summary className="flex cursor-pointer items-center justify-between font-heading text-sm font-semibold text-ink">
                    Ver el mensaje
                    <Plus className="size-4 transition-transform group-open:rotate-45" />
                  </summary>
                  <pre className="mt-3 whitespace-pre-wrap rounded-md bg-white p-3 text-xs leading-relaxed text-body">
                    {message}
                  </pre>
                </details>
              </div>
            </aside>
          </div>
        )}
      </Container>
    </>
  );
}
