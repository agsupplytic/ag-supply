// Lista los productos sin fotografía para que se puedan preparar las imágenes.
//   node scripts/list-missing-photos.mjs   → docs/FOTOS-PRODUCTOS.csv
// Cada foto se guarda en public/images/products/ como `odoo-<id>.webp` (o `.jpg`/`.png`;
// varias fotos: `odoo-<id>-2.webp`…) y luego se ejecuta `npm run content:curate`.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const products = JSON.parse(readFileSync(join(ROOT, "content", "products.json"), "utf8"));
const categories = JSON.parse(readFileSync(join(ROOT, "content", "categories.json"), "utf8"));
const catName = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
const csv = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

const missing = products.filter((p) => !p.images.length);
const rows = [
  ["archivo_sugerido", "odoo_id", "sku", "categoria", "producto", "presentacion"].join(","),
  ...missing.map((p) =>
    [`odoo-${p.odooId}.webp`, p.odooId, p.sku ?? "", catName[p.category], p.name, p.specs.packFormat ?? ""].map(csv).join(","),
  ),
];
writeFileSync(join(ROOT, "docs", "FOTOS-PRODUCTOS.csv"), "﻿" + rows.join("\r\n") + "\r\n");
console.log(`${missing.length} de ${products.length} productos sin foto → docs/FOTOS-PRODUCTOS.csv`);
