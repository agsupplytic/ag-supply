import type { Metadata } from "next";
import { getProducts } from "@/lib/content";
import { QuoteView, type QuoteIndex } from "@/components/site/quote-view";

export const metadata: Metadata = {
  title: "Cotización",
  description:
    "Revisa tu lista de productos y envíala por WhatsApp a AG Supply. Sin precios en línea: se confirman por pedido.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cotizacion" },
};

export default async function CotizacionPage() {
  const products = await getProducts();

  const index: QuoteIndex = {};
  for (const p of products) {
    index[p.slug] = {
      image: p.images[0] ?? null,
      placeholderImage: p.placeholderImage,
      category: p.category,
      keySpecs: p.keySpecs,
      sku: p.sku ?? null,
    };
  }

  return <QuoteView index={index} />;
}
