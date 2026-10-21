// Verifica que las páginas /en/ de out/ no contengan texto en español. Busca palabras
// funcionales y de producto que solo existen en español; si aparecen, falta traducir
// (glosario en lib/i18n/product-terms.ts, overrides en content/en-overrides.json,
// textos de página en components/pages/*).
//   npm run build && node scripts/check-translations.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "out", "en");
const SPANISH = [
  "para", "con", "los", "las", "del", "una", "uno", "que", "por", "sin", "nuestra", "nuestro",
  "papel", "higiénico", "higienico", "servilleta", "servilletas", "toalla", "toallas", "capas", "capa",
  "fardo", "caja", "blanca", "blanco", "negra", "negro", "envuelto", "pies", "libras", "cocina", "baño",
  "producto", "productos", "cotización", "cotizacion", "empresa", "contacto", "inicio", "planta", "marcas",
  "catálogo", "catalogo", "genérico", "cantidad", "añadir", "todas", "todos", "buscar", "ver", "ordenar", "filtros", "limpiar", "presentación", "presentacion", "fabricado", "suministrado", "hoteles", "restaurantes",
];
// Excepciones legítimas: nombres propios, razón social, marcas, direcciones.
const ALLOW = [/Las Palomas/g, /Santiago de los Caballeros/g, /Sector Las Palomas/g, /AG Supply SRL/g, /A\.G\. Office Supply, S\.R\.L\./g,
  /Servilletas Bonche/g, /Siente la limpieza/g, /Región Este/g, /Cibao/g, /Hight/g, /Doblez/g, /Papel Encerado/gi];

function walk(d) {
  return readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const re = new RegExp(`(?<![\\p{L}-])(${SPANISH.join("|")})(?![\\p{L}-])`, "giu");
const found = new Map();
for (const f of walk(OUT).filter((x) => x.endsWith(".html"))) {
  let html = readFileSync(f, "utf8")
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/g, " ");
  for (const a of ALLOW) html = html.replace(a, " ");
  for (const m of html.matchAll(re)) {
    const key = m[1].toLowerCase();
    const list = found.get(key) ?? new Set();
    list.add(f.replace(OUT, "/en"));
    found.set(key, list);
  }
}

if (found.size) {
  console.error("✖ Posible texto en español en /en/:");
  for (const [w, pages] of found) console.error(` - «${w}» en ${[...pages].slice(0, 3).join(", ")}${pages.size > 3 ? ` (+${pages.size - 3})` : ""}`);
  process.exit(1);
}
console.log("✔ /en/ sin texto en español detectable");
