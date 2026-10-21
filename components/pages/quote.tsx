import { getProducts } from "@/lib/content";
import { localizeProduct } from "@/lib/i18n/content";
import { QuoteView, type QuoteIndex } from "@/components/site/quote-view";
import { pageMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/i18n/routes";

// Página de uso personal: fuera del índice, pero rastreable para que Google lea el noindex.
export function quoteMetadata(lang: Lang) {
  return pageMetadata({
    lang,
    route: { name: "quote" },
    noindex: true,
    title: lang === "es" ? "Su lista de cotización" : "Your quote list",
    description:
      lang === "es"
        ? "Revise su lista de productos y envíela por WhatsApp a AG Supply. Los precios se confirman por pedido."
        : "Review your product list and send it to AG Supply via WhatsApp. Prices are confirmed per order.",
  });
}

export async function QuotePage({ lang }: { lang: Lang }) {
  const products = await getProducts();
  const index: QuoteIndex = {};
  for (const raw of products) {
    const p = localizeProduct(raw, lang);
    index[p.slug] = { name: p.name, category: p.category, keySpecs: p.keySpecs, sku: p.sku ?? null, pack: p.specs.packFormat ?? null };
  }
  return <QuoteView index={index} lang={lang} />;
}
