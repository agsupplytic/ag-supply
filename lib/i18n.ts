import { cookies } from "next/headers";

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";
export const LOCALE_COOKIE = "NEXT_LOCALE";

type Dict = Record<string, string>;

const es: Dict = {
  "nav.home": "Inicio",
  "nav.about": "Nosotros",
  "nav.products": "Productos",
  "nav.contact": "Contacto",
  "nav.quote": "Cotización",
  "nav.fullCatalog": "Ver catálogo completo",
  "cta.viewCatalog": "Ver catálogo",
  "cta.quoteWhatsapp": "Cotizar por WhatsApp",
  "cta.whatsapp": "WhatsApp",
  "cta.knowAg": "Conocer AG Supply",
  "cta.seeProcess": "Ver el proceso",
  "cta.startQuote": "Empezar cotización",
  "cta.contactForm": "Formulario y distribuidores",
  "cta.addQuote": "Añadir a cotización",
  "hero.eyebrow": "Convertidora de papel · República Dominicana",
  "hero.title": "Fabricamos la higiene institucional que mueve tu operación",
  "hero.body":
    "Convertimos bobinas y materia prima en papel higiénico, toallas, servilletas, faciales, interfoliados y desechables. Fabricantes de nuestras propias marcas Ocean Breeze y Bonche, con capacidad para 400 toneladas de papel al mes.",
  "stats.factory": "Fábrica propia",
  "stats.factoryLabel": "Conversión desde bobina en Las Palomas, Santiago",
  "stats.national": "Alcance nacional",
  "stats.nationalLabel": "Entrega en todo el territorio de República Dominicana",
  "stats.capacity": "400 t/mes",
  "stats.capacityLabel": "Capacidad instalada de procesamiento de papel",
  "stats.brands": "2 marcas propias",
  "stats.brandsLabel": "Ocean Breeze para HORECA · Bonche para consumo masivo",
  "home.catalogEyebrow": "Catálogo",
  "home.catalogTitle": "Todo el programa de higiene, de un solo fabricante",
  "home.brandsEyebrow": "Marcas propias",
  "home.brandsTitle": "Dos líneas, dos públicos",
  "home.whyEyebrow": "Por qué AG Supply",
  "home.whyTitle": "Una operación de manufactura, no un catálogo más",
  "home.howEyebrow": "Cómo cotizar",
  "home.howTitle": "Tres pasos, sin registro",
  "home.step1": "Explora el catálogo",
  "home.step2": "Añade a tu cotización",
  "home.step3": "Envía por WhatsApp",
  "footer.products": "Productos",
  "footer.contact": "Contacto",
  "footer.requestQuote": "Solicitar cotización",
  "footer.rights": "Todos los derechos reservados.",
  "i18n.notice": "",
};

const en: Dict = {
  "nav.home": "Home",
  "nav.about": "About",
  "nav.products": "Products",
  "nav.contact": "Contact",
  "nav.quote": "Quote",
  "nav.fullCatalog": "View full catalogue",
  "cta.viewCatalog": "View catalogue",
  "cta.quoteWhatsapp": "Quote via WhatsApp",
  "cta.whatsapp": "WhatsApp",
  "cta.knowAg": "About AG Supply",
  "cta.seeProcess": "See the process",
  "cta.startQuote": "Start a quote",
  "cta.contactForm": "Form & distributors",
  "cta.addQuote": "Add to quote",
  "hero.eyebrow": "Paper converter · Dominican Republic",
  "hero.title": "We manufacture the institutional hygiene your operation runs on",
  "hero.body":
    "We convert parent reels and raw material into toilet paper, hand towels, napkins, facial tissue, interfolded products and disposables. Makers of our own brands Ocean Breeze and Bonche, with capacity for 400 tons of paper per month.",
  "stats.factory": "Own factory",
  "stats.factoryLabel": "Reel-to-product conversion in Las Palomas, Santiago",
  "stats.national": "Nationwide",
  "stats.nationalLabel": "Delivery across the Dominican Republic",
  "stats.capacity": "400 t/month",
  "stats.capacityLabel": "Installed paper-processing capacity",
  "stats.brands": "2 own brands",
  "stats.brandsLabel": "Ocean Breeze for HORECA · Bonche for mass retail",
  "home.catalogEyebrow": "Catalogue",
  "home.catalogTitle": "The whole hygiene programme, from one manufacturer",
  "home.brandsEyebrow": "Own brands",
  "home.brandsTitle": "Two lines, two audiences",
  "home.whyEyebrow": "Why AG Supply",
  "home.whyTitle": "A manufacturing operation, not just another catalogue",
  "home.howEyebrow": "How to request a quote",
  "home.howTitle": "Three steps, no sign-up",
  "home.step1": "Browse the catalogue",
  "home.step2": "Add to your quote",
  "home.step3": "Send via WhatsApp",
  "footer.products": "Products",
  "footer.contact": "Contact",
  "footer.requestQuote": "Request a quote",
  "footer.rights": "All rights reserved.",
  "i18n.notice":
    "Product catalogue and company profile are shown in Spanish.",
};

const DICTS: Record<Locale, Dict> = { es, en };

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const v = store.get(LOCALE_COOKIE)?.value;
  return v === "en" ? "en" : "es";
}

export function makeT(locale: Locale) {
  const dict = DICTS[locale] ?? es;
  return (key: string) => dict[key] ?? es[key] ?? key;
}

export async function getT() {
  return makeT(await getLocale());
}
