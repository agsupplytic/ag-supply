// Production extraction path: pull product.template from Odoo via JSON-RPC and
// write scripts/odoo-raw.json + product images, then run normalize-odoo.mjs.
//
// The first seed in this repo was extracted through the Odoo MCP tools; this
// script is the dependency-free equivalent for future refreshes.
//
// Env (.env or shell):
//   ODOO_URL=https://your-odoo-host
//   ODOO_DB=your-db
//   ODOO_USER=user@example.com
//   ODOO_API_KEY=xxxx: (an API key or password)
//
// Usage:
//   node scripts/import-from-odoo.mjs
//   node scripts/extract-odoo-images.mjs   # if you changed the image source
//   node scripts/normalize-odoo.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const { ODOO_URL, ODOO_DB, ODOO_USER, ODOO_API_KEY } = process.env;
if (!ODOO_URL || !ODOO_DB || !ODOO_USER || !ODOO_API_KEY) {
  console.error(
    "Missing ODOO_URL / ODOO_DB / ODOO_USER / ODOO_API_KEY. See docs/DATA-IMPORT.md.",
  );
  process.exit(1);
}

const FIELDS = [
  "id", "name", "default_code", "categ_id", "ag_marca", "ag_categoria",
  "ag_sub_categoria", "ag_origen", "ag_tipo_de_papel", "ag_n_de_capas",
  "ag_gramaje", "ag_ancho", "ag_largo_de_hoja", "ag_cantidad_de_hojas",
  "ag_paquete", "ag_color", "ag_doblez", "ag_acabado", "ag_dimensiones",
  "ag_dimensiones_fardo_caja", "ag_peso_bruto_paquete", "ag_peso_bruto_caja",
  "ag_aptitud_legal", "ag_fardos_cajas_por_estiba",
  "ag_total_de_fardos_cajas_por_palet", "sale_ok", "active",
];

async function rpc(service, method, args) {
  const res = await fetch(`${ODOO_URL.replace(/\/$/, "")}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: { service, method, args },
      id: Date.now(),
    }),
  });
  const json = await res.json();
  if (json.error) {
    throw new Error(JSON.stringify(json.error.data ?? json.error, null, 2));
  }
  return json.result;
}

async function main() {
  const uid = await rpc("common", "login", [ODOO_DB, ODOO_USER, ODOO_API_KEY]);
  if (!uid) throw new Error("Odoo login failed — check credentials.");

  const records = await rpc("object", "execute_kw", [
    ODOO_DB,
    uid,
    ODOO_API_KEY,
    "product.template",
    "search_read",
    [[["active", "=", true]]],
    { fields: FIELDS, order: "id", limit: 5000 },
  ]);

  mkdirSync(join(process.cwd(), "scripts"), { recursive: true });
  writeFileSync(
    join(process.cwd(), "scripts", "odoo-raw.json"),
    JSON.stringify(records, null, 1),
  );
  console.log(`Wrote scripts/odoo-raw.json (${records.length} records).`);

  // Images: ids that have image_1024, then fetch and decode.
  const withImg = await rpc("object", "execute_kw", [
    ODOO_DB,
    uid,
    ODOO_API_KEY,
    "product.template",
    "search_read",
    [[["active", "=", true], ["image_1024", "!=", false]]],
    { fields: ["id"], limit: 5000 },
  ]);
  const ids = withImg.map((r) => r.id);
  console.log(`${ids.length} products have an image.`);

  const outDir = join(process.cwd(), "public", "images", "products");
  mkdirSync(outDir, { recursive: true });
  let sharp;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch {
    console.warn("sharp not installed — skipping image conversion.");
  }

  for (const id of ids) {
    const [rec] = await rpc("object", "execute_kw", [
      ODOO_DB,
      uid,
      ODOO_API_KEY,
      "product.template",
      "read",
      [[id], ["image_1024"]],
    ]);
    if (!rec?.image_1024) continue;
    const buf = Buffer.from(rec.image_1024, "base64");
    const outPath = join(outDir, `odoo-${id}.webp`);
    if (sharp) {
      await sharp(buf)
        .resize(1000, 1000, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath);
    } else {
      writeFileSync(outPath.replace(/\.webp$/, ".png"), buf);
    }
  }
  console.log(`Images written to ${outDir}. Now run: node scripts/normalize-odoo.mjs`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
