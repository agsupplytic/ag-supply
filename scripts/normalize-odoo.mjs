// Normalizes the raw Odoo product.template export (scripts/odoo-raw.json) into the
// site's content layer: content/products.json, content/categories.json,
// content/brands.json. Also refreshes the data section of docs/PENDING-CONTENT.md.
//
// The Odoo data is inconsistent: brand often lives only in the product name,
// structured specs exist for a minority of products, and the rest must be parsed
// from the name string. This script encodes those heuristics in one place so the
// curation rules are reviewable. Re-run after a fresh export:
//   node scripts/import-from-odoo.mjs   (produces scripts/odoo-raw.json)
//   node scripts/extract-odoo-images.mjs
//   node scripts/normalize-odoo.mjs
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const raw = JSON.parse(readFileSync(join(ROOT, "scripts", "odoo-raw.json"), "utf8"));
const imageDir = join(ROOT, "public", "images", "products");
const imageIds = new Set(
  (existsSync(imageDir) ? readdirSync(imageDir) : [])
    .map((f) => /^odoo-(\d+)\.webp$/.exec(f)?.[1])
    .filter(Boolean)
    .map(Number),
);

/* ------------------------------------------------------------------ categories
   Descripciones oficiales (fuente: NotebookLM del cliente). `short` para tarjetas,
   `description` (más largo) para la cabecera de la página de categoría. */
const CATEGORIES = [
  {
    slug: "papel-higienico", name: "Papel higiénico", icon: "Disc3", order: 1,
    short: "Papel higiénico doméstico e institucional: 12/1 genérico, doble capa 24/1 y 30/1, y 48/1 envuelto individual en 24 m y 35 m.",
    description: "Manufactura y distribución de papel higiénico de uso doméstico e institucional. La gama incluye el formato clásico 12/1 genérico, formatos de doble capa 24/1 (gramajes de 65, 75 y 85 g) y 30/1 (75 y 90–95 g), paquetes de 6/1 de 9 libras y el formato 48/1 con opciones envueltas individualmente en metrajes de 24 m y 35 m (marcas Ocean Breeze y Bio).",
  },
  {
    slug: "toallas", name: "Toallas de papel", icon: "Layers", order: 2,
    short: "Secado de manos y limpieza para alto tránsito: center pull 6/1, toallas de cocina, bobina Kraft de 550 pies y rollos Bleach de 600 y 700 pies.",
    description: "Soluciones para el secado de manos y la limpieza en entornos corporativos y hoteleros de alto tránsito. Destacan las toallas Center Pull 6/1, toallas de cocina lisas, bobinas de papel toalla Kraft de 550 pies, toallas en caja Wave o fardo de 800 pies y los rollos de Toalla Bleach industrial en formatos de 600 y 700 pies.",
  },
  {
    slug: "servilletas", name: "Servilletas", icon: "Square", order: 3,
    short: "Servilletas de mesa, cafetería y restaurante: dispensador (Softpel, Bonche), dinner 15x17 blanca o Kraft de 2 capas, Moka y cocktail.",
    description: "Línea especializada en servilletas de mesa, cafeterías y restaurantes. Abarca desde la servilleta genérica de 10 paquetes y la cuadrada de 13x13 hasta las servilletas de dispensador (Softpel, Bonche) en formatos 10/500 y 10/1, la línea Dinner 15x17 blanca o Kraft de 2 capas, las servilletas Moka y las cocktail en blanco, Kraft y negro.",
  },
  {
    slug: "interfoliados", name: "Interfoliados", icon: "Rows3", order: 4,
    short: "Toallas interfoliadas (plegado Z o V) para dispensación individual: Sanitisue 20/200, Mini Napkin Waves 30/200 y Quick Nap.",
    description: "Toallas de papel interfoliadas (plegadas en «Z» o «V») para dispensación individual manual, lo que reduce drásticamente el desperdicio y garantiza la máxima higiene en oficinas y comercios. Ejemplos: Interfold Sanitisue 20/200, Interfold Mini Napkin Waves 30/200, Interfold Quick Nap y Mini Napkin de 2 capas.",
  },
  {
    slug: "facial", name: "Papel facial", icon: "Wind", order: 5,
    short: "Pañuelos de papel tisú de doble capa, muy suaves y absorbentes. Marca Ocean Breeze en caja plana y formato cubo 30/1.",
    description: "Pañuelos de papel tisú de doble capa, con extraordinaria suavidad y alta absorción, para el cuidado personal en oficinas, clínicas y habitaciones de hotel. Se comercializan bajo la marca Ocean Breeze en formato de caja plana o cubo de 30/1.",
  },
  {
    slug: "jabon", name: "Jabón y limpieza", icon: "SprayCan", order: 6,
    short: "Químicos y limpieza líquida: cloro, desinfectantes perfumados, desengrasantes, lavaplatos, jabón de manos, suavizantes y detergentes en polvo.",
    description: "Productos químicos y soluciones de limpieza líquida para la higiene industrial, institucional y doméstica: cloro líquido, desinfectantes perfumados (lavanda, floral, brisa marina), desengrasantes, lavaplatos líquido, jabones líquidos para manos, jabón hipoalergénico, suavizantes para ropa y detergentes en polvo para ropa blanca, de color o negra.",
  },
  {
    slug: "desechables", name: "Desechables", icon: "Trash2", order: 7,
    short: "Fundas de basura, papel encerado, bandejas de aluminio y envases desechables para servicio de alimentos y manejo de desperdicios.",
    description: "Desechables para el servicio de alimentos y el manejo de desperdicios: fundas de basura en distintos calibres y galonajes, papel encerado y papel MG para envolver, bandejas de aluminio, envases de sopa/habichuela de 4 oz con tapa y cajas de pizza. Opciones plásticas y biodegradables.",
  },
  {
    slug: "cuberteria", name: "Cubertería", icon: "Utensils", order: 8,
    subcategories: ["Cubertería suelta", "Combos"],
    short: "Cucharas, tenedores, cuchillos, vasos, platos y sorbetes desechables, más los combos preensamblados de cubierto + servilleta.",
    description: "Menaje de mesa de un solo uso para comida rápida, eventos y catering. Incluye cubertería suelta —cucharas, tenedores, cuchillos de mango de madera, platos (n.º 9, n.º 6 para picadera y con divisiones), vasos rígidos y biodegradables (n.º 10 y 7) y sorbetes de papel— y la subcategoría de Combos: sets pre-empaquetados de cubierto + servilleta de alta calidad, fabricados de forma automatizada, ideales para delivery y hotelería (combos HW de 2 piezas 500/1, de 1 pieza blanco MW, de 3 piezas en caja, de 2 piezas negro MW y Pannez impresos).",
  },
];
const CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));

/* ---------------------------------------------------------------------- brands
   Textos de posicionamiento oficiales (fuente: NotebookLM del cliente). */
const BRANDS = [
  {
    slug: "ocean-breeze", name: "Ocean Breeze", positioning: "premium",
    short: "Marca premium para el mercado institucional, corporativo y hotelero: alta resistencia, óptima absorción y blancura superior al 98 %.",
    description: "Nuestra marca premium, desarrollada específicamente para satisfacer las altas exigencias del mercado institucional, corporativo y hotelero. Se distingue por productos de alta resistencia, óptima absorción y una blancura superior al 98 %. Garantizamos metrajes y cortes exactos combinados con una extraordinaria suavidad, asegurando un rendimiento excelente y precios justos que maximizan el valor de la inversión corporativa.",
  },
  {
    slug: "bonche", name: "Bonche", positioning: "economica",
    short: "La solución para el consumo masivo y el uso cotidiano: alta absorción, rendimiento excepcional y precios muy competitivos.",
    description: "La solución perfecta para el consumo masivo y el uso cotidiano. Diseñada para brindar productos de alta absorción con un rendimiento excepcional en el día a día. Ofrece precios sumamente económicos y competitivos sin sacrificar la utilidad, respaldada por una disponibilidad inmediata que asegura el abastecimiento constante del hogar o el negocio.",
  },
  {
    slug: "generico", name: "Genérico", positioning: "generico",
    short: "Producto institucional de base, sin marca comercial, para operaciones que priorizan rendimiento y costo.",
    description: "Producto institucional de base, sin marca comercial, para operaciones que priorizan el rendimiento y el costo por unidad.",
  },
];

/* ------------------------------------------------------------------- utilities */
const clean = (s) =>
  String(s || "")
    .replace(/^\s*\[[^\]]*\]\s*/, "") // strip leading [CODE]
    .replace(/\s+/g, " ")
    .replace(/[\s.,;-]+$/, "")
    .trim();

const ACRONYMS = new Set(["OB", "O.B", "HW", "MW", "TAD", "PLY", "GSM", "XL", "LD", "FF", "SL",
  "MB", "RD", "JRT", "HWT", "U.R", "SHH", "MTZ", "PU", "C-FOLD", "Z", "AG", "SD", "S.D", "PZAS",
  "PZS", "UD", "UDS", "GLN", "GLS", "2K", "4K", "7K", "MG"]);

function titleCase(str) {
  const words = str.split(" ");
  const upperCount = (str.match(/[A-ZÁÉÍÓÚÑ]/g) || []).length;
  const letterCount = (str.match(/[A-Za-zÁÉÍÓÚÑáéíóúñ]/g) || []).length;
  if (letterCount === 0 || upperCount / letterCount < 0.6) return str; // already mixed case
  const small = new Set(["de", "del", "la", "el", "los", "las", "y", "o", "para", "con", "en", "por", "a"]);
  return words
    .map((w, i) => {
      const bare = w.replace(/[^A-Za-z0-9ÁÉÍÓÚÑ.\-/]/g, "");
      if (ACRONYMS.has(bare.toUpperCase()) && bare.length <= 6) return w.toUpperCase();
      if (/\d/.test(w) && /[A-Za-z]/.test(w)) return w.toUpperCase(); // 2PLY, 20MTS, 13X13
      if (/^\d+(\.\d+)?["'x×/-]?/i.test(w)) return w.toLowerCase();
      const lw = w.toLowerCase();
      if (i > 0 && small.has(lw)) return lw;
      return lw.charAt(0).toUpperCase() + lw.slice(1);
    })
    .join(" ");
}

function slugify(s) {
  return String(s)
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

/* ------------------------------------------------------------ exclusion filter */
const EXCLUDE_CATEG = [/^Serv\. Contabilidad/, /^Servicio$/, /Productos? de? Segunda/, /Productos Segunda/];
const EXCLUDE_NAME = [
  /^servicio\b/i, /^prod(ucto)?\s+term/i, /^producto terminado/i, /\bkilo\b/i,
  /^caja\b/i, /corrugad/i, /^bobina\b/i, /\bdiam\b/i, /\bcore\s*\d/i, /\d+\s*gsm/i,
  /^recycled napkin paper/i, /^etiqueta/i, /^brazalete/i, /^bolsa kraft/i,
  /art[ií]culos fuera/i, /^standard delivery$/i, /^event registration$/i,
  /^cauced/i, /^naviera$/i, /^wendy$/i, /^transporte/i, /implementaci[oó]n sistema/i,
  /^handy fuel/i, /^handi fuel/i, /^paphigienico/i,
  // internal / raw / packaging that classify into a catalog category by keyword
  /^l[aá]mina\b/i, /servilletas?\s+(para\s+)?combo/i, /^plegadiza\s+(cubo|plana|facial)/i,
  /plegadiza facial/i, /^funda de papel\s+\d+$/i, /^fundas? de papel\s+\d+$/i,
  /funda papel\s+\d+k/i, /^fardo funda papel/i, /^fardo funda\s*#/i,
  /^funda\b.*(\bcal\b|fuelle|baja dens|\bff\b|\bsl\b|\bld\b|dis\s*\d|\+\s*\d|\d+\s*x\s*\d+\s*\+)/i,
  /\bescoba\b|rastrillo|pala recoger|\bsuape\b|multiesponj|\bcepillo\b/i,
  /^combo sorbeto/i, /sorbeto mas servilleta/i, /^funda\b.*para combos?/i,
  /^banda\b/i, /\birregular\b/i,
];
// Bags starting with "FUNDA" are packaging film UNLESS they are consumer trash/produce bags.
const TRASHBAG = /(GLN|GLS|GAL[OÓ]N|GALLON|TANQUE|JARD[IÍ]N|BASURA|\bMTZ\b|\bHD\b|\bV\s*10X200\b)/i;

/* --------------------------------------------------------------- classifier    */
function classify(name, categName) {
  const n = name.toUpperCase();
  // most specific name rules first
  if (/\bCOMBO/.test(n)) return "cuberteria"; // subcat "Combos" set below
  if (/PA[ÑN]UELO|FACIAL(?!.*CORRUGAD)|KLEENEX/.test(n) && !/CORRUGAD/.test(n)) return "facial";
  if (/INTERFOLD|QUICK NAPKIN|MINI NAPKIN/.test(n)) return "interfoliados";
  // cutlery / disposable tableware → cubertería
  if (/CUCHAR|CUCHILLO|TENEDOR|CUBIERTO|REVOLVEDOR|SORBETE|PAJILLA|\bVASO\b|\bPLATO\b|BANDEJA/.test(n)) return "cuberteria";
  // trash bags, wraps, aluminium trays, food containers → desechables
  if (/PAPEL ENCERADO|PAPEL MG|CAJA DE PIZZA|ENVASE/.test(n)) return "desechables";
  if (/FARDO FUNDA|FUNDA .*(GLN|GLS|GAL[OÓ]N|GALLON|TANQUE|JARD[IÍ]N|BASURA|55 GLN|MTZ)/.test(n)) return "desechables";
  if (/BRILLO|CEPILLO|ESCOBA|ESPONJA|MULTIESPONJ|\bPALA\b|RASTRILLO|SUAPE|TRAPEAD|\bMOPA\b|DESINFECTANTE|\bJAB[OÓ]N|\bCLORO\b|DETERGENTE|DISPENSADOR/.test(n)) return "jabon";
  const isBath = /HIGIENICO|HIGI[EÉ]NICO|JUMBO|BATH TISSUE|PAPEL DE BA[ÑN]O|\bJRT\b/.test(n);
  if (isBath) return "papel-higienico";
  if (/SERVILLETA|DINNER|COCKTAIL|C[OÓ]CTEL|DISPENSER|TALL ?FOLD|MOKA|LUNCH NAPKIN|SERV\b/.test(n)) return "servilletas";
  if (/TOALLA|HAND TOWEL|C-?FOLD|CFOLD|MULTIFOLD|MULTI ?FOLD|CENTER ?PULL|COCINA|KITCHEN|ROLL TOWEL/.test(n)) return "toallas";
  // fall back to the internal manufacturing category
  const c = (categName || "").toLowerCase();
  if (c.includes("combos")) return "cuberteria";
  if (c.includes("interfold")) return "interfoliados";
  if (c.includes("dinner") || c.includes("cocktail") || c.includes("dispenser") || c.includes("cfold")) return "servilletas";
  if (c.includes("toalla") || c.includes("cocina")) return "toallas";
  if (c.includes("higienico") || c.includes("jumbo")) return "papel-higienico";
  return null;
}

/** Subcategory for a normalized product (used for the /productos filter). */
function subcategoryFor(category, name) {
  if (category === "cuberteria") {
    return /\bCOMBO/i.test(name) ? "Combos" : "Cubertería suelta";
  }
  return undefined;
}

/* --------------------------------------------------------------- brand deriver */
function deriveBrand(name, agMarca) {
  const n = name.toUpperCase();
  if (/\bBONCHE\b/.test(n)) return "bonche";
  const m = (agMarca && agMarca[1]) || "";
  if (/ocean breeze/i.test(m)) return "ocean-breeze";
  if (/bonche/i.test(m)) return "bonche";
  if (/\b(O\.?B\.?|0\.?B\.?|OCEAN\s*BRE?E?Z+E?)\b/.test(n)) return "ocean-breeze";
  if (m && !/gen[eé]rico|marca1/i.test(m)) return "generico"; // named non-flagship brands (Durasol, Senator, Xtra...) roll up to genérico for the storefront
  return "generico";
}

/* ---------------------------------------------------------------- spec parsing */
const COLOR_MAP = {
  KRAFT: "Kraft", BLANCA: "Blanco", BLANCO: "Blanco", NEGRA: "Negro", NEGRO: "Negro",
  AZUL: "Azul", ROJA: "Rojo", ROJO: "Rojo", GRIS: "Gris", ROSADA: "Rosado", ROSADO: "Rosado",
  VERDE: "Verde", NATURAL: "Natural", BLEACH: "Blanco", BLECH: "Blanco", WHITE: "Blanco",
  BROWN: "Kraft", "N/A": null, NA: null,
};
function normColor(v) {
  if (!v) return null;
  const key = String(v).trim().toUpperCase();
  if (key in COLOR_MAP) return COLOR_MAP[key];
  return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
}
function parseColor(n) {
  for (const k of Object.keys(COLOR_MAP)) {
    if (COLOR_MAP[k] && new RegExp(`\\b${k}\\b`).test(n)) return COLOR_MAP[k];
  }
  return null;
}
function parseFold(n) {
  if (/TALL ?FOLD|TALLFOLD/.test(n)) return "Tall fold";
  if (/C-?FOLD|CFOLD/.test(n)) return "C-fold";
  if (/MULTIFOLD|MULTI ?FOLD/.test(n)) return "Multifold";
  if (/Z ?FOLD|DOBLADO EN Z/.test(n)) return "Z-fold";
  if (/INTERFOLD/.test(n)) return "Interfold";
  if (/CENTER ?PULL/.test(n)) return "Center pull";
  return null;
}
function normFold(v) {
  if (!v) return null;
  const s = String(v).toLowerCase().trim();
  const map = {
    "interfold": "Interfold", "tallfold": "Tall fold", "tall fold": "Tall fold",
    "slimfold": "Slim fold", "doblado en z": "Z-fold", "doblado en c": "C-fold",
    "doblez en c": "C-fold", "hoja continua": "Hoja continua", "center pull": "Center pull",
  };
  if (map[s]) return map[s];
  if (s.includes("1/4")) return "1/4 fold";
  if (s.includes("1/8")) return "1/8 fold";
  if (s.includes("cfold") || s.includes("c-fold")) return "C-fold";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function normFinish(v) {
  if (!v) return null;
  const s = String(v).toLowerCase();
  if (s.includes("emboss") || s.includes("repuj")) return "Repujado";
  if (s === "n/a" || s === "na") return null;
  return v.charAt(0).toUpperCase() + v.slice(1);
}
function normPaperType(v) {
  if (!v) return null;
  const s = String(v).toLowerCase();
  if (s.includes("bath")) return "Bath tissue";
  if (s.includes("napk")) return "Napkin tissue";
  if (s.includes("facial")) return "Facial";
  return v.charAt(0).toUpperCase() + v.slice(1);
}
const num = (v) => (typeof v === "number" && v > 0 ? Math.round(v * 100) / 100 : undefined);

// Free-text dimension strings from Odoo have stray separators ("9.5 x 4 x 3.15 x in").
const cleanDims = (v) =>
  v
    ? String(v)
        .replace(/\s+/g, " ")
        .replace(/\s*x\s*(?=(in|cm|mm|pulg|pulgadas?)\b)/gi, " ")
        .replace(/[\s,x/]+$/i, "")
        .trim() || undefined
    : undefined;

function buildSpecs(rec, cleanName) {
  const n = cleanName.toUpperCase();
  const plyName = /(\d+)\s*(?:CAPAS?|PLY|PLIEGUES?)/.exec(n) || /(\d+)\s*CAPA\b/.exec(n);
  const sheetsName = /(\d+)\s*HOJAS/.exec(n);
  const metersName = /(\d+(?:\.\d+)?)\s*MTS?\b/.exec(n) || /(\d+(?:\.\d+)?)\s*METROS?\b/.exec(n);
  const feetName = /(\d+)\s*PIES\b/.exec(n);
  const packName = /(\d+)\s*\/\s*(\d+)\b/.exec(n);
  const paquetesName = /(\d+)\s*(?:PAQUETES?|PQUETES?|PAQ\b)/.exec(n);

  const specs = {
    ply: rec.ag_n_de_capas || (plyName ? Number(plyName[1]) : undefined),
    widthCm: num(rec.ag_ancho),
    sheetLengthCm: num(rec.ag_largo_de_hoja),
    sheets: rec.ag_cantidad_de_hojas || (sheetsName ? Number(sheetsName[1]) : undefined),
    grammageGsm: num(rec.ag_gramaje),
    rollLengthM: metersName ? Number(metersName[1]) : undefined,
    rollLengthFt: feetName ? Number(feetName[1]) : undefined,
    color: rec.ag_color ? normColor(rec.ag_color) : parseColor(n),
    fold: normFold(rec.ag_doblez) || parseFold(n),
    finish: normFinish(rec.ag_acabado),
    paperType: normPaperType(rec.ag_tipo_de_papel),
    packFormat: packName ? `${packName[1]}/${packName[2]}` : undefined,
    packsPerBale: paquetesName ? Number(paquetesName[1]) : undefined,
    packageDims: cleanDims(rec.ag_dimensiones),
    caseDims: cleanDims(rec.ag_dimensiones_fardo_caja),
    unitsPerPallet: rec.ag_total_de_fardos_cajas_por_palet || undefined,
    compliance: rec.ag_aptitud_legal || undefined,
  };
  for (const k of Object.keys(specs)) if (specs[k] === undefined || specs[k] === false || specs[k] === 0) delete specs[k];
  return specs;
}

// Odoo carries stray paper attributes on plastic/chemical products — strip them.
const PAPER_SPEC_KEYS = ["ply", "widthCm", "sheetLengthCm", "sheets", "grammageGsm",
  "rollLengthM", "rollLengthFt", "paperType", "finish"];
function stripNonPaperSpecs(category, specs) {
  if (PAPER_CATS.has(category)) return specs;
  for (const k of PAPER_SPEC_KEYS) delete specs[k];
  return specs;
}

const PAPER_CATS = new Set(["papel-higienico", "toallas", "servilletas", "interfoliados", "facial"]);
function buildKeySpecs(category, s) {
  const out = [];
  if (s.ply && PAPER_CATS.has(category)) out.push(`${s.ply} ${s.ply === 1 ? "capa" : "capas"}`);
  if (category === "papel-higienico" || category === "toallas") {
    if (s.rollLengthM) out.push(`${s.rollLengthM} m`);
    else if (s.rollLengthFt) out.push(`${s.rollLengthFt} pies`);
    else if (s.sheets) out.push(`${s.sheets} hojas`);
    if (s.packFormat && out.length < 2) out.push(`Fardo ${s.packFormat}`);
  } else if (category === "servilletas" || category === "interfoliados" || category === "facial") {
    if (s.fold) out.push(s.fold);
    else if (s.sheets) out.push(`${s.sheets} hojas`);
    else if (s.packFormat) out.push(`Fardo ${s.packFormat}`);
  } else {
    if (s.packFormat) out.push(`Presentación ${s.packFormat}`);
    else if (s.packsPerBale) out.push(`${s.packsPerBale} paquetes`);
    if (s.color && out.length < 2) out.push(s.color);
  }
  if (out.length === 0 && s.color) out.push(s.color);
  if (out.length === 0 && s.packsPerBale) out.push(`${s.packsPerBale} paquetes`);
  return out.slice(0, 2);
}

/* --------------------------------------------------------------------- run     */
const pending = { noImage: [], noSpecs: [], dropped: [] };
const bySignature = new Map();

for (const rec of raw) {
  const categName = rec.categ_id ? rec.categ_id[1] : "";
  const rawName = String(rec.name || "");
  if (EXCLUDE_CATEG.some((re) => re.test(categName))) { pending.dropped.push({ id: rec.id, name: rawName, why: "categ" }); continue; }
  if (EXCLUDE_NAME.some((re) => re.test(rawName.trim()))) { pending.dropped.push({ id: rec.id, name: rawName, why: "name" }); continue; }

  const name = titleCase(clean(rawName));
  if (!name || name.length < 4) { pending.dropped.push({ id: rec.id, name: rawName, why: "empty" }); continue; }
  if (/^funda\b/i.test(name) && !TRASHBAG.test(name)) { pending.dropped.push({ id: rec.id, name, why: "funda-empaque" }); continue; }

  const category = classify(name, categName);
  if (!category || !CATEGORY_SLUGS.has(category)) { pending.dropped.push({ id: rec.id, name, why: "unclassified" }); continue; }

  const brand = deriveBrand(name, rec.ag_marca);
  const specs = stripNonPaperSpecs(category, buildSpecs(rec, name));
  const keySpecs = buildKeySpecs(category, specs);
  const hasImage = imageIds.has(rec.id);
  const structured = !!(rec.ag_categoria || rec.ag_n_de_capas || rec.ag_gramaje || rec.ag_largo_de_hoja);

  const product = {
    slug: `${slugify(name)}-${rec.id}`,
    name,
    brand,
    category,
    subcategory:
      subcategoryFor(category, name) ??
      (rec.ag_sub_categoria ? rec.ag_sub_categoria[1] : undefined),
    images: hasImage ? [`/images/products/odoo-${rec.id}.webp`] : [],
    placeholderImage: !hasImage,
    specs,
    keySpecs,
    description: undefined,
    sku: rec.default_code || undefined,
    odooId: rec.id,
    active: true,
  };
  for (const k of Object.keys(product)) if (product[k] === undefined) delete product[k];

  // dedupe by normalized name + brand: prefer the one with an image, then with a SKU, then lower id
  const sig = `${slugify(name)}|${brand}`;
  const prev = bySignature.get(sig);
  if (!prev) bySignature.set(sig, product);
  else {
    const score = (p) => (p.images.length ? 2 : 0) + (p.sku ? 1 : 0);
    if (score(product) > score(prev) || (score(product) === score(prev) && rec.id < prev.odooId))
      bySignature.set(sig, product);
  }
  if (!hasImage) pending.noImage.push(name);
  if (!structured) pending.noSpecs.push(name);
}

const products = [...bySignature.values()].sort((a, b) =>
  a.category === b.category ? a.name.localeCompare(b.name) : a.category.localeCompare(b.category),
);

// per-category counts
const counts = {};
for (const p of products) counts[p.category] = (counts[p.category] || 0) + 1;
const categoriesOut = CATEGORIES.map((c) => ({
  ...c,
  count: counts[c.slug] || 0,
  placeholder: `/images/placeholders/cat-${c.slug}.webp`,
}));
const brandCounts = {};
for (const p of products) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
const brandsOut = BRANDS.map((b) => ({ ...b, count: brandCounts[b.slug] || 0 }));

writeFileSync(join(ROOT, "content", "products.json"), JSON.stringify(products, null, 2));
writeFileSync(join(ROOT, "content", "categories.json"), JSON.stringify(categoriesOut, null, 2));
writeFileSync(join(ROOT, "content", "brands.json"), JSON.stringify(brandsOut, null, 2));

const uniq = (a) => [...new Set(a)].sort();
const pendingMd = `<!-- AUTO-GENERADO por scripts/normalize-odoo.mjs — no editar a mano la sección de datos -->
# Contenido pendiente de confirmar antes de publicar

> Estado de todos los textos: **docs/COPY-NEEDED.md**.

## 1. Textos institucionales
- **Confirmados e integrados**: slogan, historia (2007/2014), planta (400 t/mes,
  m², ubicación), misión, visión, valores, propuesta de valor, descripciones de
  las 8 categorías y posicionamiento de las 2 marcas. Fuente: NotebookLM del cliente.
- **Pendiente**: dirección exacta (calle/número en Las Palomas), correo público
  (\`infoagsupply@gmail.com\` vs \`agsupplycxc@gmail.com\`), horario, sucursal Santo
  Domingo, confirmación de distribuidores, proveedor de envío del formulario.

## 2. Fotografía (reemplazar placeholders antes de publicar)
- Hero, Nosotros y Planta usan paneles de marca como placeholder. Sustituir por **fotografía real** de la planta de conversión en Las Palomas, Santiago.
- Solo **${products.filter((p) => p.images.length).length}** productos publicados traen foto real desde Odoo (${imageIds.size} imágenes extraídas en total). El resto (${products.filter((p) => !p.images.length).length}) muestra un panel de categoría. Falta fotografía de producto/fardo.

## 3. Datos de catálogo (import Odoo — AUTO)
- Productos publicados: **${products.length}** (de ${raw.length} registros activos en Odoo).
- Por categoría: ${categoriesOut.map((c) => `${c.name} ${c.count}`).join(" · ")}
- Por marca: ${brandsOut.map((b) => `${b.name} ${b.count}`).join(" · ")}

### 3.1 Productos sin specs estructuradas (specs inferidas del nombre — revisar) — ${uniq(pending.noSpecs).length}
${uniq(pending.noSpecs).map((n) => `- ${n}`).join("\n") || "- (ninguno)"}

### 3.2 Productos sin imagen real — ${uniq(pending.noImage).length}
${uniq(pending.noImage).map((n) => `- ${n}`).join("\n") || "- (ninguno)"}

### 3.3 Registros Odoo excluidos del catálogo — ${pending.dropped.length}
(servicios, materia prima, empaque, productos de segunda, sin clasificar)
${pending.dropped.slice(0, 200).map((d) => `- [${d.id}] (${d.why}) ${d.name}`).join("\n")}
${pending.dropped.length > 200 ? `\n…y ${pending.dropped.length - 200} más` : ""}
`;
writeFileSync(join(ROOT, "docs", "PENDING-CONTENT.md"), pendingMd);

console.log(`products.json: ${products.length}`);
console.log("by category:", counts);
console.log("by brand:", brandCounts);
console.log(`with real image: ${products.filter((p) => p.images.length).length}`);
console.log(`dropped: ${pending.dropped.length}`);
