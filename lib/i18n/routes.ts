// Rutas del sitio en español (raíz, sin prefijo) e inglés (/en/). Única tabla de
// segmentos: de ella salen los enlaces, los canónicos, los hreflang y el botón de
// idioma (que convierte una ruta a su equivalente en el otro idioma).

export type Lang = "es" | "en";
export const LANGS: Lang[] = ["es", "en"];
export const HTML_LANG: Record<Lang, string> = { es: "es-DO", en: "en" };
export const OG_LOCALE: Record<Lang, string> = { es: "es_DO", en: "en_US" };

export type Route =
  | { name: "home" }
  | { name: "about" }
  | { name: "plant" }
  | { name: "products" }
  | { name: "category"; cat: string }
  | { name: "product"; cat: string; slug: string }
  | { name: "oceanBreeze" }
  | { name: "bonche" }
  | { name: "contact" }
  | { name: "faq" }
  | { name: "quote" };

type Fixed = Exclude<Route["name"], "category" | "product" | "home">;

const SEG: Record<Lang, Record<Fixed, string>> = {
  es: {
    about: "nosotros",
    plant: "nosotros/planta",
    products: "productos",
    oceanBreeze: "ocean-breeze",
    bonche: "bonche",
    contact: "contacto",
    faq: "faq",
    quote: "cotizacion",
  },
  en: {
    about: "about",
    plant: "about/plant",
    products: "products",
    oceanBreeze: "ocean-breeze",
    bonche: "bonche",
    contact: "contact",
    faq: "faq",
    quote: "quote",
  },
};

/** Slug de categoría en inglés. Internamente el catálogo usa siempre el slug español. */
export const CAT_EN: Record<string, string> = {
  "papel-higienico": "toilet-paper",
  toallas: "paper-towels",
  servilletas: "napkins",
  interfoliados: "interfolded",
  facial: "facial-tissue",
  jabon: "soap-cleaning",
  desechables: "disposables",
  cuberteria: "cutlery",
};
const CAT_ES = Object.fromEntries(Object.entries(CAT_EN).map(([es, en]) => [en, es]));

export const catSlug = (lang: Lang, cat: string) => (lang === "en" ? (CAT_EN[cat] ?? cat) : cat);
export const catFromSlug = (lang: Lang, slug: string) => (lang === "en" ? (CAT_ES[slug] ?? slug) : slug);

/** Ruta interna (con barra inicial y final) de una página en un idioma. */
export function href(lang: Lang, route: Route): string {
  const prefix = lang === "en" ? "/en" : "";
  switch (route.name) {
    case "home":
      return `${prefix}/`;
    case "category":
      return `${prefix}/${SEG[lang].products}/${catSlug(lang, route.cat)}/`;
    case "product":
      return `${prefix}/${SEG[lang].products}/${catSlug(lang, route.cat)}/${route.slug}/`;
    default:
      return `${prefix}/${SEG[lang][route.name]}/`;
  }
}

/** Interpreta una ruta (sin basePath) de cualquiera de los dos idiomas. */
export function parsePath(pathname: string): { lang: Lang; route: Route } | null {
  const parts = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);
  const lang: Lang = parts[0] === "en" ? "en" : "es";
  if (lang === "en") parts.shift();
  if (parts.length === 0) return { lang, route: { name: "home" } };
  const joined = parts.join("/");
  for (const name of Object.keys(SEG[lang]) as Fixed[]) {
    if (SEG[lang][name] === joined) return { lang, route: { name } as Route };
  }
  if (parts[0] === SEG[lang].products) {
    if (parts.length === 2) return { lang, route: { name: "category", cat: catFromSlug(lang, parts[1]) } };
    if (parts.length === 3) return { lang, route: { name: "product", cat: catFromSlug(lang, parts[1]), slug: parts[2] } };
  }
  return null;
}

/** Equivalente de `pathname` en el idioma `to`; si no se reconoce, el inicio. */
export function switchPath(pathname: string, to: Lang): string {
  const parsed = parsePath(pathname);
  return parsed ? href(to, parsed.route) : href(to, { name: "home" });
}

/** Parámetros de la URL del catálogo, por idioma. */
export const QUERY: Record<Lang, Record<"categoria" | "marca" | "sub" | "capas" | "doblez" | "color" | "pres" | "vista" | "orden" | "q", string>> = {
  es: { categoria: "categoria", marca: "marca", sub: "sub", capas: "capas", doblez: "doblez", color: "color", pres: "pres", vista: "vista", orden: "orden", q: "q" },
  en: { categoria: "category", marca: "brand", sub: "type", capas: "ply", doblez: "fold", color: "color", pres: "pack", vista: "view", orden: "sort", q: "q" },
};
