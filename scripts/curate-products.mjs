// Curación editorial de content/products.json. Se ejecuta DESPUÉS de
// normalize-odoo.mjs (que regenera el JSON crudo desde Odoo) y es idempotente:
//   node scripts/normalize-odoo.mjs && node scripts/curate-products.mjs
//
// Qué hace (y qué no):
//  - Quita del texto público los nombres de marcas de terceros (clientes de marca
//    privada); la referencia interna sigue disponible por SKU.
//  - Corrige erratas inequívocas y tildes en el nombre; no reinterpreta siglas
//    internas (MW/HW/SD/TAD...), que el cliente debe definir.
//  - Alinea `specs.ply` con lo que dice el nombre y elimina nulos de `specs`.
//  - Unifica la nota de presentación ("Presentación 12/1").
//  - Marca `fabricated` por producto (categoría de papel tissue y no textil).
//  - Si el slug cambia, escribe content/slug-redirects.json y el bloque 301 de
//    public/.htaccess (solo para las rutas que existían).
//  - Detecta las fotos de public/images/products (odoo-<id>.webp, odoo-<id>-2.webp, .jpg, .png)
//    y rellena `images`: para añadir una foto basta copiarla allí con ese nombre y re-ejecutar.
//  - NO toca SKU: los duplicados o malformados se reportan en
//    docs/CATALOGO-DATOS.md para corregirse en Odoo.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const productsPath = join(ROOT, "content", "products.json");
const products = JSON.parse(readFileSync(productsPath, "utf8"));
const categories = JSON.parse(readFileSync(join(ROOT, "content", "categories.json"), "utf8"));
const fabricatedCat = new Set(categories.filter((c) => c.fabricated).map((c) => c.slug));

/** Marcas de terceros que no deben aparecer en texto público. */
const THIRD_PARTY = [
  "Rancho Chito", "Chito", "Pannez", "Samey", "Senator", "Jerez Brand", "Maine",
  "Sumeh", "Barcelo", "Geto", "la Terminal",
];
const thirdPartyRe = new RegExp(`\\b(?:${THIRD_PARTY.join("|")})\\b`, "gi");

const ACCENTS = [
  [/\bHigienico\b/gi, "Higiénico"], [/\bEconomic([oa])\b/gi, "Económic$1"],
  [/\bJabon\b/gi, "Jabón"], [/\bLiquido\b/gi, "Líquido"], [/\bJardin\b/gi, "Jardín"],
  [/\bPañuelos\b/gi, "Pañuelos"], [/\bPeriodico\b/gi, "Periódico"],
  [/\bImpresion\b/gi, "Impresión"], [/\bBobina\b/gi, "Bobina"], [/\bPaqutes\b/gi, "Paquetes"],
  [/\bPquetes\b/gi, "Paquetes"], [/\bboblez\b/gi, "doblez"],
];
const TYPOS = [
  [/\bBlech\b/gi, "Bleach"], [/\bBrezze\b/gi, "Breeze"],
  [/\b(?:O\.B|0\.B|OB|Ob)\.?(?=[\s,.]|$)/g, "Ocean Breeze"],
  [/\bJUMBO(\d)/g, "Jumbo $1"], [/\bPre- Cortada\b/gi, "Precortada"],
];
const KEEP_UPPER = new Set(["TAD", "SMC", "MW", "HW", "PLY", "UDS", "UD", "SD", "XL", "MB", "SHH", "LC", "AG", "GR", "GRS", "MG", "II", "S.D", "U.R", "PZAS", "HD", "MTS", "MTZ", "GLN", "GLS", "C-FOLD", "LBS"]);

function titleCaseShouting(s) {
  return s.replace(/\b[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ]{3,}\b/g, (w) =>
    KEEP_UPPER.has(w) ? w : w[0] + w.slice(1).toLowerCase(),
  );
}

function cleanName(name) {
  let n = name.replace(thirdPartyRe, " ");
  for (const [re, to] of TYPOS) n = n.replace(re, to);
  for (const [re, to] of ACCENTS) n = n.replace(re, to);
  n = titleCaseShouting(n);
  return n
    .replace(/\s*,\s*,/g, ",")
    .replace(/\s+([,.])/g, "$1")
    .replace(/[,.\s]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();
}

const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").slice(0, 60);

const photoDir = join(ROOT, "public", "images", "products");
const photoFiles = existsSync(photoDir) ? readdirSync(photoDir) : [];
const photosFor = (odooId) =>
  photoFiles
    .filter((f) => new RegExp(`^(?:odoo-)?${odooId}(?:-\\d+)?\\.(?:webp|jpe?g|png)$`, "i").test(f))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((f) => `/images/products/${f}`);

const redirects = [];
const SKU_OK = /^\d{4}-[A-ZÑ]{3}-\d{2}$/;

for (const p of products) {
  const oldSlug = p.slug;
  const name = cleanName(p.name);
  p.name = name;
  const newSlug = `${slugify(name)}-${p.odooId}`;
  if (newSlug !== oldSlug) {
    redirects.push({ category: p.category, from: oldSlug, to: newSlug });
    p.slug = newSlug;
  }

  // ply según el nombre cuando es explícito
  const plyMatch = /(\d)\s*(?:ply|capas?)\b/i.exec(name);
  if (plyMatch && ["1", "2", "3"].includes(plyMatch[1])) p.specs.ply = Number(plyMatch[1]);

  // specs sin nulos
  for (const k of Object.keys(p.specs)) {
    if (p.specs[k] === null || p.specs[k] === undefined || p.specs[k] === "") delete p.specs[k];
  }

  // keySpecs: capas coherentes + presentación unificada
  const key = [];
  const seen = new Set();
  const push = (s) => { if (s && !seen.has(s)) { seen.add(s); key.push(s); } };
  if (p.specs.ply) push(`${p.specs.ply} ${p.specs.ply === 1 ? "capa" : "capas"}`);
  for (const k of p.keySpecs) {
    if (/^\d capas?$/i.test(k)) continue;
    const m = /^(?:Fardo|Presentación)\s+(\d+\/\d+)$/i.exec(k);
    push(m ? `Presentación ${m[1]}` : k);
  }
  p.keySpecs = key;

  p.images = photosFor(p.odooId);
  p.placeholderImage = p.images.length === 0;
  p.fabricated = fabricatedCat.has(p.category) && !/\btela\b/i.test(name);
}

// SKU: reporte, sin modificar
const bySku = new Map();
for (const p of products) if (p.sku) bySku.set(p.sku, [...(bySku.get(p.sku) ?? []), p]);
const dupes = [...bySku.entries()].filter(([, v]) => v.length > 1);
const malformed = products.filter((p) => p.sku && !SKU_OK.test(p.sku));
const missing = products.filter((p) => !p.sku);
// Misma regla que lib/content/thin.ts.
const thin = products.filter((p) => p.images.length === 0 && Object.keys(p.specs).every((k) => k === "packFormat"));

writeFileSync(productsPath, JSON.stringify(products, null, 2) + "\n");

// Redirecciones 301 (solo cambios de slug); el destino siempre existe.
const slugSet = new Set(products.map((p) => `${p.category}/${p.slug}`));
// Se conservan las redirecciones de ejecuciones anteriores (el script es idempotente: una
// segunda pasada ya no ve el cambio de nombre) y se descartan las que apunten a algo inexistente.
const redirectsPath = join(ROOT, "content", "slug-redirects.json");
const previous = existsSync(redirectsPath) ? JSON.parse(readFileSync(redirectsPath, "utf8")) : [];
const merged = new Map();
for (const r of [...previous, ...redirects]) merged.set(`${r.category}/${r.from}`, r);
const valid = [...merged.values()].filter((r) => slugSet.has(`${r.category}/${r.to}`) && r.from !== r.to);
writeFileSync(redirectsPath, JSON.stringify(valid, null, 2) + "\n");

const htPath = join(ROOT, "public", ".htaccess");
const START = "# >>> slug-redirects (generado por scripts/curate-products.mjs)";
const END = "# <<< slug-redirects";
const block = [
  START,
  ...valid.map((r) => `RewriteRule ^productos/${r.category}/${r.from}/?$ /productos/${r.category}/${r.to}/ [R=301,L]`),
  END,
].join("\n");
let ht = readFileSync(htPath, "utf8");
if (ht.includes(START)) {
  ht = ht.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block);
} else {
  ht = ht.replace("# /ruta -> /ruta/", `${block}\n\n# /ruta -> /ruta/`);
}
writeFileSync(htPath, ht);

const lines = [
  "# Datos del catálogo por corregir en Odoo",
  "",
  "Generado por `scripts/curate-products.mjs`. El sitio muestra el SKU tal como viene de Odoo; ",
  "no se inventan ni se reasignan códigos.",
  "",
  `## SKU duplicados (${dupes.length})`,
  "",
  ...dupes.flatMap(([sku, v]) => [`- \`${sku}\`:`, ...v.map((p) => `  - ${p.name} (Odoo ${p.odooId})`)]),
  "",
  `## SKU con formato inválido (${malformed.length})`,
  "",
  ...malformed.map((p) => `- \`${p.sku}\` — ${p.name} (Odoo ${p.odooId})`),
  "",
  `## Productos sin SKU (${missing.length})`,
  "",
  ...missing.map((p) => `- ${p.name} (Odoo ${p.odooId})`),
  "",
  `## Fichas sin indexar por contenido delgado (${thin.length} de ${products.length})`,
  "",
  "Sin foto propia y sin datos técnicos aparte de la presentación: llevan `noindex` y no están en el",
  "sitemap. Salen solas de esta lista al añadir una foto (`public/images/products/odoo-<id>.webp`)",
  "o datos técnicos en Odoo y volver a ejecutar `npm run content:curate`.",
  "",
  ...thin.map((p) => `- ${p.name} (Odoo ${p.odooId})`),
  "",
  "## Siglas internas sin definición pública",
  "",
  "MW, HW, SD, U.R, TAD, SMC, XL, Lc, Mopc, SHH, MB: aparecen en nombres de producto. ",
  "Definirlas (o sustituirlas por una descripción) mejora la búsqueda y la comparación.",
  "",
  "## Posibles erratas no corregidas automáticamente",
  "",
  "- `Servilleta Dinner Azul 20150 2 PLY`: ¿es 20/150?",
  "- `Toalla TAD 13 Libras 6/1 con`: nombre truncado.",
  "",
];
writeFileSync(join(ROOT, "docs", "CATALOGO-DATOS.md"), lines.join("\n"));

console.log(`productos: ${products.length}; slugs cambiados: ${valid.length}; SKU duplicados: ${dupes.length}; malformados: ${malformed.length}; sin SKU: ${missing.length}`);
