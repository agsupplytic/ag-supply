"use client";

import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ZoomIn } from "lucide-react";
import { ProductImage } from "./product-image";
import { BrandBadge } from "./brand-badge";
import { AddToQuoteButton } from "./add-to-quote-button";
import { Button } from "@/components/ui/button";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/content/types";

/**
 * Miniatura de producto para el listado. Con foto abre un visor (diálogo accesible:
 * Esc cierra, el foco queda dentro) con la imagen grande, el SKU, «Ver ficha» y «Añadir».
 * Sin foto muestra el icono de la categoría.
 */
export function ProductThumb({
  product,
  icon,
  lang,
  className,
}: {
  product: Product;
  icon: string;
  lang: Lang;
  className?: string;
}) {
  const t = ui(lang);
  const src = product.images[0];
  const box = cn("size-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-border", className);

  if (!src) {
    return (
      <div className={box} aria-hidden>
        <ProductImage product={product} icon={icon} soonLabel={t.catalog.photoSoon} compact className="size-full !aspect-auto" />
      </div>
    );
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label={t.catalog.enlarge(product.name)}
        className={cn(box, "group relative bg-white transition-shadow hover:shadow-md focus-visible:ring-2")}
      >
        <Image src={src} alt="" width={72} height={72} className="size-full object-contain p-1" />
        <span className="absolute inset-x-0 bottom-0 flex justify-end bg-white/80 p-0.5 text-brand-blue opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <ZoomIn className="size-3.5" aria-hidden />
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-ink/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[61] w-[min(92vw,34rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-xl">
          <div className="relative aspect-4/3 w-full border-b border-border bg-white">
            <Image src={src} alt={product.name} fill sizes="(max-width: 640px) 92vw, 544px" className="object-contain p-4" />
          </div>
          <div className="space-y-3 p-5">
            <BrandBadge brand={product.brand} lang={lang} />
            <Dialog.Title className="font-heading text-xl font-bold leading-snug text-ink">{product.name}</Dialog.Title>
            <Dialog.Description className="text-sm text-muted">
              {[
                product.sku && `${t.catalog.viewer.sku} ${product.sku}`,
                product.specs.packFormat && `${t.catalog.viewer.pack} ${product.specs.packFormat}`,
                ...product.keySpecs.filter((k) => !/^(Presentación|Pack)\b/.test(k)),
              ]
                .filter(Boolean)
                .join(" · ")}
            </Dialog.Description>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <AddToQuoteButton product={product} lang={lang} layout="inline" />
              <Button asChild variant="outline" size="sm">
                <Link href={href(lang, { name: "product", cat: product.category, slug: product.slug })}>{t.catalog.viewer.viewSheet}</Link>
              </Button>
            </div>
          </div>
          <Dialog.Close
            aria-label={t.catalog.viewer.close}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-md bg-white/90 text-ink hover:bg-white"
          >
            <X className="size-5" aria-hidden />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
