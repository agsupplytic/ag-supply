// Pushes content/*.json into Sanity once the project is connected.
// Idempotent: uses deterministic _id values so re-running updates in place.
//
// Env:
//   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
//   NEXT_PUBLIC_SANITY_DATASET=production
//   SANITY_API_WRITE_TOKEN=xxxx   (Editor token)
//
// Usage:  node scripts/seed-sanity.mjs
//
// Note: product images are NOT uploaded here (the local seed only has ~33).
// Upload real photography through the Studio, or extend this script with
// client.assets.upload() reading from public/images/products.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

const read = (f) =>
  JSON.parse(readFileSync(join(process.cwd(), "content", f), "utf8"));

const categories = read("categories.json");
const brands = read("brands.json");
const products = read("products.json");

async function main() {
  const tx = client.transaction();

  for (const c of categories) {
    tx.createOrReplace({
      _id: `category.${c.slug}`,
      _type: "category",
      name: c.name,
      slug: { _type: "slug", current: c.slug },
      order: c.order,
      icon: c.icon,
      description: c.description,
    });
  }

  for (const b of brands) {
    tx.createOrReplace({
      _id: `brand.${b.slug}`,
      _type: "brand",
      name: b.name,
      slug: { _type: "slug", current: b.slug },
      positioning: b.positioning,
      description: b.description,
    });
  }

  for (const p of products) {
    tx.createOrReplace({
      _id: `product.${p.slug}`,
      _type: "product",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      brand: p.brand,
      category: { _type: "reference", _ref: `category.${p.category}` },
      subcategory: p.subcategory,
      specs: p.specs,
      keySpecs: p.keySpecs,
      description: p.description,
      sku: p.sku,
      odooId: p.odooId,
      active: p.active,
    });
  }

  const res = await tx.commit();
  console.log(
    `Seeded Sanity: ${categories.length} categorías, ${brands.length} marcas, ${products.length} productos.`,
  );
  console.log(`Transaction ${res.transactionId}`);
  console.log(
    "Recuerda subir imágenes reales desde el Studio y poner CONTENT_SOURCE=sanity.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
