// Decodes the base64 product images pulled from Odoo (image_1024) into optimized
// webp files under public/images/products/. The raw MCP result dumps live in the
// Claude tool-results dir for this session; for a production re-run, point
// RAW_FILES at fresh exports produced by scripts/import-from-odoo.mjs.
//
// Usage: node scripts/extract-odoo-images.mjs
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const TOOL_RESULTS =
  "C:/Users/judit/.claude/projects/C--Users-judit-Desktop-AG-SITIO/4a82d143-309d-4136-a74a-2c5015fd28d3/tool-results";

const RAW_FILES = [
  "mcp-odoo-agsupply-search_records-1787923956367.txt",
  "mcp-odoo-agsupply-search_records-1787923965165.txt",
  "mcp-odoo-agsupply-search_records-1787923970144.txt",
  "mcp-odoo-agsupply-search_records-1787923975930.txt",
  "mcp-odoo-agsupply-search_records-1787923979775.txt",
  "mcp-odoo-agsupply-search_records-1787923984024.txt",
  "mcp-odoo-agsupply-search_records-1787923987701.txt",
].map((f) => join(TOOL_RESULTS, f));

const OUT_DIR = join(process.cwd(), "public", "images", "products");
mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
for (const file of RAW_FILES) {
  if (!existsSync(file)) {
    console.warn("skip (missing):", file);
    continue;
  }
  const json = JSON.parse(readFileSync(file, "utf8"));
  const records = json?.result?.records ?? [];
  for (const rec of records) {
    const b64 = rec.image_1024 || rec.image_1920 || rec.image_512;
    if (!b64 || typeof b64 !== "string") continue;
    const buf = Buffer.from(b64, "base64");
    const outPath = join(OUT_DIR, `odoo-${rec.id}.webp`);
    await sharp(buf)
      .resize(1000, 1000, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);
    count++;
    console.log("wrote", outPath, `(${(buf.length / 1024).toFixed(0)} KB source)`);
  }
}
console.log(`\nDone. ${count} product images written to ${OUT_DIR}`);
