import type { Metadata } from "next";
import { getProducts } from "@/lib/content";
import { QuoteView, type QuoteIndex } from "@/components/site/quote-view";
import { absUrl } from "@/lib/seo";

// Página de uso personal: fuera del índice, pero rastreable para que Google lea el noindex.
export const metadata: Metadata = {
  title: "Su lista de cotización",
  description: "Revise su lista de productos y envíela por WhatsApp a AG Supply. Los precios se confirman por pedido.",
  robots: { index: false, follow: true },
  alternates: { canonical: absUrl("/cotizacion") },
};

export default async function CotizacionPage() {
  const products = await getProducts();
  const index: QuoteIndex = {};
  for (const p of products) {
    index[p.slug] = {
      category: p.category,
      keySpecs: p.keySpecs,
      sku: p.sku ?? null,
      pack: p.specs.packFormat ?? null,
    };
  }
  return <QuoteView index={index} />;
}
