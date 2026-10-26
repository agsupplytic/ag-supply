import type { Category, Product } from "./content/types";
import { COLLECTION_SLUGS, type Lang } from "./i18n/routes";

// Colecciones por tipo de producto (páginas indexables propias). Cada una agrupa
// referencias REALES del catálogo con una regla sobre nombre/subcategoría; el texto de
// cada página se completa con datos calculados de esos productos (presentaciones, capas,
// colores), no con afirmaciones nuevas. Una colección con menos de MIN_PRODUCTS
// referencias no se publica.
export const MIN_PRODUCTS = 3;

type Copy = { name: string; blurb: string };

export interface Collection {
  id: string;
  cat: string;
  match: (p: Product) => boolean;
  es: Copy;
  en: Copy;
}

const n = (p: Product) => p.name.toLowerCase();
const sub = (p: Product) => (p.subcategory ?? "").toLowerCase();

export const COLLECTIONS: Collection[] = [
  {
    id: "jumbo",
    cat: "papel-higienico",
    match: (p) => n(p).includes("jumbo"),
    es: { name: "Papel higiénico jumbo", blurb: "El papel higiénico jumbo viene en rollos de gran diámetro, pensado para dispensadores de baños de alto tránsito en hoteles, oficinas e instituciones." },
    en: { name: "Jumbo toilet paper", blurb: "Jumbo toilet paper comes in large-diameter rolls, designed for dispensers in high-traffic restrooms in hotels, offices and institutions." },
  },
  {
    id: "toalla-kraft",
    cat: "toallas",
    match: (p) => n(p).includes("kraft"),
    es: { name: "Papel toalla kraft", blurb: "El papel toalla kraft es de color natural, sin blanquear. Se usa para el secado de manos en baños y áreas de servicio con mucho uso." },
    en: { name: "Kraft paper towels", blurb: "Kraft paper towels are natural-colored and unbleached. They are used for hand drying in restrooms and heavy-use service areas." },
  },
  {
    id: "toalla-cocina",
    cat: "toallas",
    match: (p) => n(p).includes("cocina") && !n(p).includes("tela"),
    es: { name: "Papel toalla de cocina", blurb: "El papel toalla de cocina se usa para limpiar y secar superficies, utensilios y alimentos en cocinas domésticas y comerciales." },
    en: { name: "Kitchen paper towels", blurb: "Kitchen paper towels are used to clean and dry surfaces, utensils and food in home and commercial kitchens." },
  },
  {
    id: "dinner",
    cat: "servilletas",
    match: (p) => n(p).includes("dinner") || sub(p).includes("dinner"),
    es: { name: "Servilletas dinner", blurb: "La servilleta dinner es la de mesa de tamaño completo, usada en comedores y restaurantes. Hay opciones lisas y timbradas." },
    en: { name: "Dinner napkins", blurb: "The dinner napkin is the full-size table napkin used in dining rooms and restaurants. Plain and stamped options are available." },
  },
  {
    id: "cocktail",
    cat: "servilletas",
    match: (p) => n(p).includes("cocktail") || sub(p).includes("cocktail"),
    es: { name: "Servilletas cocktail", blurb: "La servilleta cocktail es de menor tamaño y se usa en bares, cafeterías y eventos para acompañar bebidas y bocadillos." },
    en: { name: "Cocktail napkins", blurb: "The cocktail napkin is smaller and is used in bars, cafés and events to go with drinks and snacks." },
  },
  {
    id: "servilleta-kraft",
    cat: "servilletas",
    match: (p) => n(p).includes("kraft"),
    es: { name: "Servilletas kraft", blurb: "Las servilletas kraft son de color natural, sin blanquear, y se usan en restaurantes y cafeterías que buscan una presentación más rústica." },
    en: { name: "Kraft napkins", blurb: "Kraft napkins are natural-colored and unbleached, used in restaurants and cafés that want a more rustic presentation." },
  },
  {
    id: "dispenser",
    cat: "servilletas",
    match: (p) => n(p).includes("dispenser") || n(p).includes("disp.") || sub(p) === "dispenser",
    es: { name: "Servilletas para dispensador", blurb: "Las servilletas para dispensador se colocan en el dispensador de mesa o mostrador y se toman una a una, lo que reduce el desperdicio en servicio rápido." },
    en: { name: "Dispenser napkins", blurb: "Dispenser napkins are loaded into a table or counter dispenser and taken one at a time, which reduces waste in quick service." },
  },
  {
    id: "combos",
    cat: "cuberteria",
    match: (p) => sub(p) === "combos",
    es: { name: "Combos de cubiertos desechables", blurb: "Los combos reúnen varias piezas de cubertería desechable en una sola bolsa o caja, listos para servir en comida rápida, eventos y catering." },
    en: { name: "Disposable cutlery combos", blurb: "Combos bring several pieces of disposable cutlery together in one bag or box, ready to serve in fast food, events and catering." },
  },
  {
    id: "suelta",
    cat: "cuberteria",
    match: (p) => sub(p) === "cubertería suelta",
    es: { name: "Cubertería desechable suelta", blurb: "Cucharas, tenedores y cuchillos desechables por separado, en cajas por cantidad, para restaurantes, eventos y distribuidores." },
    en: { name: "Loose disposable cutlery", blurb: "Disposable spoons, forks and knives sold separately, in boxes by quantity, for restaurants, events and distributors." },
  },
];

export const collectionById = (id: string) => COLLECTIONS.find((c) => c.id === id);
export const collectionProducts = (c: Collection, all: Product[]) => all.filter((p) => p.category === c.cat && c.match(p));

/** Colecciones publicables (con suficientes referencias) y sus productos. */
export function publishedCollections(all: Product[]): { collection: Collection; products: Product[] }[] {
  return COLLECTIONS.filter((c) => COLLECTION_SLUGS[c.id])
    .map((collection) => ({ collection, products: collectionProducts(collection, all) }))
    .filter((x) => x.products.length >= MIN_PRODUCTS);
}

/** Colecciones a las que pertenece un producto. */
export function collectionsOf(p: Product, all: Product[]) {
  return publishedCollections(all).filter((x) => x.products.some((q) => q.slug === p.slug)).map((x) => x.collection);
}

/** Datos calculados de los productos de una colección, para escribir el texto sin inventar. */
export function collectionFacts(products: Product[], lang: Lang, valueOf: (v: string) => string) {
  const uniq = <T,>(xs: (T | undefined)[]) => [...new Set(xs.filter((x): x is T => x !== undefined && x !== ""))];
  const collator = new Intl.Collator("es", { numeric: true });
  const packs = uniq(products.map((p) => p.specs.packFormat)).sort(collator.compare);
  const plies = uniq(products.map((p) => p.specs.ply)).sort((a, b) => Number(a) - Number(b));
  const colors = uniq(products.map((p) => (p.specs.color ? valueOf(String(p.specs.color)).toLowerCase() : undefined)));
  void lang;
  return { packs, plies, colors };
}

export type { Category };
