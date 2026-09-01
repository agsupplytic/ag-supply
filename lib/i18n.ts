// UI string table. The site ships in Spanish only — an English dictionary and a
// cookie-based locale switch existed earlier but the catalogue, product sheets
// and company pages were never translated, and the cookie read (`next/headers`)
// blocked a fully static export. Kept as a tiny lookup so copy stays in one place.

export const LOCALES = ["es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

type Dict = Record<string, string>;

const es: Dict = {
  "nav.home": "Inicio",
  "nav.about": "Nosotros",
  "nav.products": "Productos",
  "nav.contact": "Contacto",
  "nav.quote": "Cotización",
  "nav.faq": "Preguntas frecuentes",
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
};

const DICTS: Record<Locale, Dict> = { es };

export function makeT(locale: Locale = DEFAULT_LOCALE) {
  const dict = DICTS[locale] ?? es;
  return (key: string) => dict[key] ?? es[key] ?? key;
}

/** Ready-to-use translator. The site is single-locale, so this is a constant. */
export const t = makeT("es");
