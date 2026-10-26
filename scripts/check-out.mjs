// Verificación del sitio exportado (out/). Se ejecuta después de `npm run build`:
//   npm run check:out
// Falla (código 1) si encuentra algo que dañaría el SEO o la navegación:
//  - enlaces internos que no resuelven a un archivo de out/
//  - título, descripción o canónico ausentes o repetidos; canónico sin barra final
//  - JSON-LD que no se puede interpretar
//  - sitemap con URLs que redirigen (sin barra final) o que no existen
//  - catálogo vacío en el HTML estático (/productos/ y categorías)
//  - texto de marcas de terceros ocultas, o "0+" de contadores
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = join(process.cwd(), "out");
const SITE = "https://agsupply.com.do";
const errors = [];
const fail = (msg) => errors.push(msg);

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const htmlFiles = walk(OUT).filter((f) => f.endsWith(".html") && !/(^|\/)(404|_not-found)\b/.test(relative(OUT, f)) && !f.includes("/_next/"));
const pageOf = (f) => {
  const rel = relative(OUT, f).replace(/index\.html$/, "");
  return rel === "" ? "/" : `/${rel}`;
};

const resolves = (path) => {
  const clean = decodeURIComponent(path.split("#")[0].split("?")[0]);
  if (clean === "" || clean === "/") return true;
  const abs = join(OUT, clean);
  if (existsSync(abs) && statSync(abs).isFile()) return true;
  return existsSync(join(abs, "index.html"));
};

const titles = new Map();
const descs = new Map();
const BLOCKED = /\b(Pannez|Chito|Rancho Chito|Samey|Senator|Jerez Brand|Sumeh|Barcelo|Geto)\b/i;
const pageSet = new Set();
const noindexSet = new Set();
const enOf = new Map(); // ruta ES → ruta EN (por hreflang)

for (const f of htmlFiles) {
  const path = pageOf(f);
  pageSet.add(path);
  const html = readFileSync(f, "utf8");
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1]?.trim();
  const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1];
  const canon = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1];
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  if (noindex) noindexSet.add(path);

  if (!title) fail(`${path}: sin <title>`);
  if (!desc) fail(`${path}: sin meta description`);
  if (!canon) fail(`${path}: sin canónico`);
  else if (!canon.startsWith(SITE) || !canon.endsWith("/")) fail(`${path}: canónico inválido (${canon})`);
  else if (canon !== `${SITE}${path}`) fail(`${path}: canónico apunta a otra URL (${canon})`);
  // idioma del documento y hreflang recíproco
  const htmlLang = /<html lang="([^"]*)"/.exec(html)?.[1];
  const isEn = path.startsWith("/en/") || path === "/en/";
  if (htmlLang !== (isEn ? "en" : "es-DO")) fail(`${path}: <html lang="${htmlLang}" incorrecto`);
  const alts = Object.fromEntries([...html.matchAll(/<link rel="alternate" hrefLang="([^"]*)" href="([^"]*)"/g)].map((m) => [m[1], m[2]]));
  if (alts.en) enOf.set(path, alts.en.slice(SITE.length));
  if (!alts["es-DO"] || !alts.en || !alts["x-default"]) fail(`${path}: faltan hreflang`);
  else {
    if (alts[isEn ? "en" : "es-DO"] !== canon) fail(`${path}: hreflang propio distinto del canónico`);
    for (const other of [alts["es-DO"], alts.en]) {
      const p2 = other.slice(SITE.length);
      if (!resolves(p2)) fail(`${path}: hreflang apunta a una página inexistente (${other})`);
    }
  }
  if (!noindex) {
    if (title) titles.set(`${isEn ? "en" : "es"}|${title}`, [...(titles.get(`${isEn ? "en" : "es"}|${title}`) ?? []), path]);
    if (desc) descs.set(`${isEn ? "en" : "es"}|${desc}`, [...(descs.get(`${isEn ? "en" : "es"}|${desc}`) ?? []), path]);
  }
  // Límites que usan los auditores de SEO: título ≤ 60, descripción 110–160 (solo páginas indexables).
  if (title && title.length > 60) fail(`${path}: título de ${title.length} caracteres (máx. 60)`);
  if (desc && desc.length > 160) fail(`${path}: descripción de ${desc.length} caracteres (máx. 160)`);
  if (!noindex && desc && desc.length < 110) fail(`${path}: descripción de ${desc.length} caracteres (mín. 110)`);
  if (title && /AG Supply.*AG Supply/.test(title)) fail(`${path}: el título repite la marca`);
  // imágenes con texto alternativo (las decorativas deben marcarse aria-hidden, no alt vacío)
  for (const im of html.match(/<img\b[^>]*>/g) ?? []) if (!/\balt="[^"]+"/.test(im)) fail(`${path}: imagen sin texto alternativo`);
  // contenido mínimo en páginas indexables
  if (!noindex) {
    const visible = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/g, " ");
    const words = visible.split(/\s+/).filter(Boolean).length;
    if (words < 300) fail(`${path}: solo ${words} palabras visibles (mín. 300)`);
  }

  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(`${path}: JSON-LD inválido`); }
  }

  // un solo h1
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) fail(`${path}: ${h1s} elementos h1`);

  // enlaces internos
  for (const m of html.matchAll(/<a [^>]*href="(\/[^"#?]*)[^"]*"/g)) {
    const href = m[1];
    if (href.startsWith("//")) continue;
    if (!resolves(href)) fail(`${path}: enlace roto → ${href}`);
    if (!href.endsWith("/") && !/\.[a-z0-9]+$/i.test(href)) fail(`${path}: enlace sin barra final → ${href}`);
  }

  const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
  if (BLOCKED.test(text)) fail(`${path}: contiene el nombre de una marca de terceros`);
  if (/>\s*0\+\s*</.test(html)) fail(`${path}: contador "0+" en el HTML`);
}

for (const [t, pages] of titles) if (pages.length > 1) fail(`título repetido «${t.slice(3)}» en ${pages.slice(0, 3).join(", ")}`);
for (const pages of descs.values()) if (pages.length > 1) fail(`descripción repetida en ${pages.slice(0, 3).join(", ")}`);

// catálogo presente en el HTML
for (const p of ["/productos/", "/productos/papel-higienico/", "/en/products/", "/en/products/toilet-paper/"]) {
  const file = join(OUT, p, "index.html");
  const html = existsSync(file) ? readFileSync(file, "utf8") : "";
  if (html.includes("Cargando catálogo")) fail(`${p}: el HTML trae «Cargando catálogo»`);
  const rows = (html.match(/\/(?:productos|products)\/[a-z-]+\/[a-z0-9-]+\//g) ?? []).length;
  if (rows < 20) fail(`${p}: solo ${rows} enlaces a productos en el HTML`);
}

// sitemap
const sm = readFileSync(join(OUT, "sitemap.xml"), "utf8");
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const l of locs) {
  if (!l.endsWith("/")) fail(`sitemap: URL sin barra final → ${l}`);
  else if (!resolves(l.slice(SITE.length))) fail(`sitemap: URL inexistente → ${l}`);
}
console.log(`páginas HTML: ${htmlFiles.length} · URLs en sitemap: ${locs.length}`);
const inSitemap = new Set(locs.map((l) => l.slice(SITE.length)));
for (const p of pageSet) if (!inSitemap.has(p) && !noindexSet.has(p)) fail(`falta en sitemap: ${p}`);
for (const p of noindexSet) if (inSitemap.has(p)) fail(`sitemap incluye una página noindex: ${p}`);

// fichas delgadas (misma regla que lib/content/thin.ts): sin foto y sin datos técnicos aparte de la presentación
const catalog = JSON.parse(readFileSync(join(process.cwd(), "content", "products.json"), "utf8"));
const isThin = (p) => p.images.length === 0 && Object.keys(p.specs).every((k) => k === "packFormat");
const pagesOf = (p) => { const es = `/productos/${p.category}/${p.slug}/`; return [es, enOf.get(es)].filter(Boolean); };
let thinCount = 0;
for (const p of catalog.filter((x) => x.active !== false)) {
  for (const path of pagesOf(p)) {
    if (!pageSet.has(path)) continue;
    if (isThin(p) !== noindexSet.has(path)) fail(`${path}: ${isThin(p) ? "ficha delgada sin noindex" : "ficha con contenido marcada noindex"}`);
    if (isThin(p) && path.startsWith("/productos/")) thinCount++;
  }
}
console.log(`fichas: ${catalog.length - thinCount} indexables · ${thinCount} noindex (sin foto ni datos técnicos)`);

// redirecciones de slugs: el destino debe existir
const redirects = JSON.parse(readFileSync(join(process.cwd(), "content", "slug-redirects.json"), "utf8"));
for (const r of redirects) if (!resolves(`/productos/${r.category}/${r.to}/`)) fail(`redirección a página inexistente: ${r.to}`);

if (errors.length) {
  console.error(`\n✖ ${errors.length} problema(s):\n` + errors.slice(0, 60).map((e) => ` - ${e}`).join("\n"));
  process.exit(1);
}
console.log("✔ out/ verificado");
