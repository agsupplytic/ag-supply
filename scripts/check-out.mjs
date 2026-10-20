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

for (const f of htmlFiles) {
  const path = pageOf(f);
  pageSet.add(path);
  const html = readFileSync(f, "utf8");
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1]?.trim();
  const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1];
  const canon = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1];
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);

  if (!title) fail(`${path}: sin <title>`);
  if (!desc) fail(`${path}: sin meta description`);
  if (!canon) fail(`${path}: sin canónico`);
  else if (!canon.startsWith(SITE) || !canon.endsWith("/")) fail(`${path}: canónico inválido (${canon})`);
  else if (canon !== `${SITE}${path}`) fail(`${path}: canónico apunta a otra URL (${canon})`);
  if (!noindex) {
    if (title) titles.set(title, [...(titles.get(title) ?? []), path]);
    if (desc) descs.set(desc, [...(descs.get(desc) ?? []), path]);
  }
  if (title && title.length > 70) fail(`${path}: título de ${title.length} caracteres (máx. 70)`);
  if (desc && desc.length > 165) fail(`${path}: descripción de ${desc.length} caracteres (máx. 165)`);

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

for (const [t, pages] of titles) if (pages.length > 1) fail(`título repetido «${t}» en ${pages.slice(0, 3).join(", ")}`);
for (const pages of descs.values()) if (pages.length > 1) fail(`descripción repetida en ${pages.slice(0, 3).join(", ")}`);

// catálogo presente en el HTML
for (const p of ["/productos/", "/productos/papel-higienico/"]) {
  const file = join(OUT, p, "index.html");
  const html = existsSync(file) ? readFileSync(file, "utf8") : "";
  if (html.includes("Cargando catálogo")) fail(`${p}: el HTML trae «Cargando catálogo»`);
  const rows = (html.match(/\/productos\/[a-z-]+\/[a-z0-9-]+\//g) ?? []).length;
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
for (const p of pageSet) if (!inSitemap.has(p) && p !== "/cotizacion/") fail(`falta en sitemap: ${p}`);

// redirecciones de slugs: el destino debe existir
const redirects = JSON.parse(readFileSync(join(process.cwd(), "content", "slug-redirects.json"), "utf8"));
for (const r of redirects) if (!resolves(`/productos/${r.category}/${r.to}/`)) fail(`redirección a página inexistente: ${r.to}`);

if (errors.length) {
  console.error(`\n✖ ${errors.length} problema(s):\n` + errors.slice(0, 60).map((e) => ` - ${e}`).join("\n"));
  process.exit(1);
}
console.log("✔ out/ verificado");
