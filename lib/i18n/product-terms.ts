// Traducción de los nombres públicos de producto al inglés. Los nombres vienen de
// Odoo en español; esta tabla sustituye términos (de lo más largo a lo más corto) y
// `content/en-overrides.json` fija a mano los que el glosario no resuelve bien.
// scripts/check-translations.mjs falla si en `/en/` queda vocabulario español.

// [expresión, reemplazo]. Se aplican en orden; sin distinguir mayúsculas.
const TERMS: [RegExp, string | ((m: string, ...g: string[]) => string)][] = [
  // frases
  [/\bpapel\s+higi[eé]nico\b/gi, "Toilet paper"],
  [/\bhigi[eé]nico\s+jumbo\b/gi, "Jumbo toilet paper"],
  [/\bhigi[eé]nico\b/gi, "Toilet paper"],
  [/\bpa[ñn]uelos\s+faciales\b/gi, "Facial tissues"],
  [/\bpapel\s+encerado\b/gi, "Wax paper"],
  [/\bpapel\s+mg\s+impresi[oó]n\b/gi, "Printed MG paper"],
  [/\bplegadizas\s+papel\s+encerado\b/gi, "Folded wax paper sheets"],
  [/\btipo\s+peri[oó]dico\b/gi, "newsprint type"],
  [/\bbrillo\s+verde\b/gi, "Green scouring pad"],
  [/\bcartucho\s+jab[oó]n\s+espuma\b/gi, "Foam soap cartridge"],
  [/\bdesinfectante\s+lavanda\b/gi, "Lavender disinfectant"],
  [/\bdispensador\s+de\s+jab[oó]n\s+cartucho\b/gi, "Soap dispenser (cartridge)"],
  [/\bdispensador\s+de\s+jab[oó]n\s+l[ií]quido\b/gi, "Liquid soap dispenser"],
  [/\bc\/v[aá]lvula\b/gi, "with valve"],
  [/\bdispensador\s+de\s+papel\b/gi, "Paper dispenser"],
  [/\bdispensador\s+de\s+toalla\b/gi, "Towel dispenser"],
  [/\bdispensador\s+inox\b/gi, "Stainless steel dispenser"],
  [/\besponja\s+de\s+acero\s+inoxidable\b/gi, "Stainless steel sponge"],
  [/\besponja\s+doble\s+uso\b/gi, "Dual-use sponge"],
  [/\bcenter\s+pull\b/gi, "Center-pull"],
  [/\bsin\s+envoltura\b/gi, "Unwrapped"],
  [/\benvuelt[oa]s?\s+individual\b/gi, "Individually wrapped"],
  [/\benvuelt[oa]s?\b/gi, "Wrapped"],
  [/\bindividual\b/gi, "Individual"],
  [/\bbolsas\s+lisas\b/gi, "Plain bags"],
  [/\bfardo\s+funda\b/gi, "Bale of bags –"],
  [/\bten\+cuchi\b/gi, "Fork + knife"],
  [/\btoalla\s+tela\s+cocina\b/gi, "Kitchen cloth towel"],
  [/\btoalla\s+cocina\b/gi, "Kitchen towel"],
  [/\btoallas\s+cocina\b/gi, "Kitchen towels"],
  [/\btoallacocina\b/gi, "Kitchen towel"],
  [/\bpre-?\s*cortada\b/gi, "pre-cut"],
  [/\bfardo\s+de\b/gi, "bale of"],
  // objetos
  [/\bservilletas\b/gi, "Napkins"],
  [/\bservilleta\b/gi, "Napkin"],
  [/\btoallas\b/gi, "Paper towels"],
  [/\btoalla\b/gi, "Paper towel"],
  [/\bcombos\b/gi, "Combo sets"],
  [/\bcombo\b(?!\s+sets)/gi, "Combo set"],
  [/\bcucharas\b/gi, "Spoons"],
  [/\bcuchara\b/gi, "Spoon"],
  [/\bcuchillos?\b/gi, "Knife"],
  [/\btenedor(es)?\b/gi, "Fork"],
  [/\bfunda\b/gi, "Bag"],
  [/\bfardo\b/gi, "Bale"],
  [/\bcaja\b/gi, "Box"],
  [/\bcubo\b/gi, "Cube box"],
  [/\bplano\b/gi, "Flat box"],
  [/\bjumbos\b/gi, "Jumbo"],
  [/\bdispensador\b/gi, "Dispenser"],
  [/\bimpres[oa]\b/gi, "Printed"],
  // medidas y capas
  [/\b(\d+)\s*(?:mts?|metros)\b\.?/gi, "$1 m"],
  [/\bpies\b/gi, "ft"],
  [/\blibras?\b/gi, "lb"],
  [/\blbs\b\.?/gi, "lb"],
  [/\b(\d)\s*capas?\b/gi, "$1-ply"],
  [/\b(\d)\s*ply\b/gi, "$1-ply"],
  [/\bhojas\b/gi, "sheets"],
  [/\b(\d+)\s*piezas?\b/gi, (_m: string, n: string) => (n === "1" ? "1 piece" : `${n} pieces`)],
  [/\b(\d+)\s*pzas\b/gi, "$1 pcs"],
  [/\bpaquetes?\b/gi, "packs"],
  [/\bpaq\b/gi, "packs"],
  [/\b(\d+)\s*uds?\b/gi, (_m: string, n: string) => (n === "1" ? "1 unit" : `${n} units`)],
  [/\bgls\b/gi, "gal"],
  [/\bgln\b/gi, "gal"],
  [/\bgrs?\b\.?/gi, "g"],
  // calificativos y colores
  [/\becon[oó]mic[oa]\b/gi, "Economy"],
  [/\bliso\b/gi, "plain"],
  [/\btimbrada\b/gi, "stamped"],
  [/\bcja\b\.?/gi, "Box"],
  [/\bpulg\b\.?/gi, "in"],
  [/\brollos\/fdo\b/gi, "rolls/bale"],
  [/\bplegadizas\b/gi, "Folded sheets"],
  [/\bgen[eé]rico\b/gi, "Generic"],
  [/\bnormal\b/gi, "Standard"],
  [/\bespecial\b/gi, "Special"],
  [/\bblancos?\b/gi, "White"],
  [/\bblancas?\b/gi, "White"],
  [/\bnegr[oa]s?\b/gi, "Black"],
  [/\bazul\b/gi, "Blue"],
  [/\brojas?\b/gi, "Red"],
  [/\brosado\b/gi, "Pink"],
  [/\bgris\b/gi, "Grey"],
  [/\bverde\b/gi, "Green"],
  [/\bcuadrada\b/gi, "Square"],
  [/\bba[ñn]o\b/gi, "Bathroom"],
  [/\bcocina\b/gi, "Kitchen"],
  [/\btanque\b/gi, "Drum"],
  [/\bjard[ií]n\b/gi, "Garden"],
  [/\bdoblez\b/gi, "fold"],
  [/\ben\b/gi, "in"],
  [/\bcon\b/gi, "with"],
  [/\bde\b/gi, "of"],
];

import overrides from "../../content/en-overrides.json" with { type: "json" };

/** Nombre público en inglés a partir del nombre público en español. */
export function translateProductName(es: string, odooId?: number): string {
  const o = odooId !== undefined ? (overrides as Record<string, string>)[String(odooId)] : undefined;
  if (o) return o;
  let n = es;
  for (const [re, to] of TERMS) n = n.replace(re, to as string);
  return n
    .replace(/\s+with$/i, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.)])/g, "$1")
    .replace(/\(\s+/g, "(")
    .trim();
}

// ---- valores de especificaciones -------------------------------------------------
const VALUES: Record<string, string> = {
  Blanco: "White", Blanca: "White", Negro: "Black", Negra: "Black", Azul: "Blue", Rojo: "Red", Rojas: "Red",
  Rosado: "Pink", Gris: "Grey", Verde: "Green", Natural: "Natural", Kraft: "Kraft", Salmón: "Salmon",
  Interfold: "Interfold", "Z-fold": "Z-fold", "C-fold": "C-fold", "Tall fold": "Tall fold", "1/4 fold": "Quarter fold",
  Combos: "Combo sets", "Cubertería suelta": "Loose cutlery", Dispenser: "Dispenser", Cocktail: "Cocktail", Dinner: "Dinner",
  Jumbo: "Jumbo", "Higiénico": "Toilet paper", Toalla: "Towel", "Tall Fold": "Tall fold", "Facial Interfold": "Facial interfold",
  "Papel toalla": "Paper towel", "Papel toalla absorbente": "Absorbent paper towel", Facial: "Facial tissue", Virgen: "Virgin pulp",
  Repujado: "Embossed", "Hoja continua": "Continuous sheet", "Slim fold": "Slim fold", "Center pull": "Center-pull", Multifold: "Multifold",
  "Dinner timbradas": "Dinner, stamped", "Cocktail timbradas": "Cocktail, stamped", Plastico: "Plastic", "Plástico": "Plastic",
};

/** Valor de especificación (color, doblez, subcategoría…) en el idioma pedido. */
export function translateValue(v: string): string {
  return VALUES[v] ?? translateProductName(v);
}

/** Texto corto de ficha («2 capas», «Presentación 12/1», «800 pies») en inglés. */
export function translateKeySpec(k: string): string {
  const m = /^Presentación\s+(.+)$/i.exec(k);
  if (m) return `Pack ${m[1]}`;
  const f = /^Fardo\s+(.+)$/i.exec(k);
  if (f) return `Bale ${f[1]}`;
  return VALUES[k] ?? translateProductName(k);
}
