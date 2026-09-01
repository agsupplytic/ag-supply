// Sanity content adapter — INACTIVE until the project is connected.
//
// To activate:
//   1. Create a Sanity project, deploy the Studio (see docs/DEPLOY.md).
//   2. Set env vars: CONTENT_SOURCE=sanity, NEXT_PUBLIC_SANITY_PROJECT_ID,
//      NEXT_PUBLIC_SANITY_DATASET, SANITY_API_READ_TOKEN.
//   3. Run `node scripts/seed-sanity.mjs` to push content/products.json.
//
// The GROQ queries below already map to lib/content/types.ts. They are written
// out so the swap is a config change, not a rewrite.
import { createClient, type SanityClient } from "@sanity/client";
import type {
  Brand,
  Category,
  ContentSource,
  Product,
  ProductFilter,
} from "./types";

let client: SanityClient | null = null;
function getClient(): SanityClient {
  if (client) return client;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  if (!projectId) {
    throw new Error(
      "CONTENT_SOURCE=sanity but NEXT_PUBLIC_SANITY_PROJECT_ID is not set. See docs/DEPLOY.md.",
    );
  }
  client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-10-01",
    useCdn: true,
    token: process.env.SANITY_API_READ_TOKEN,
    perspective: "published",
  });
  return client;
}

const PRODUCT_PROJECTION = /* groq */ `{
  "slug": slug.current,
  name,
  "brand": brand,
  "category": category->slug.current,
  subcategory,
  "images": images[].asset->url,
  "placeholderImage": count(images) == 0,
  specs,
  keySpecs,
  description,
  sku,
  odooId,
  "active": coalesce(active, true)
}`;

export const sanitySource: ContentSource = {
  async getCategories() {
    return getClient().fetch<Category[]>(
      /* groq */ `*[_type == "category"] | order(order asc) {
        "slug": slug.current, name, icon, order, description,
        "count": count(*[_type == "product" && references(^._id) && coalesce(active, true)])
      }`,
    );
  },

  async getCategory(slug) {
    const rows = await getClient().fetch<Category[]>(
      /* groq */ `*[_type == "category" && slug.current == $slug][0...1] {
        "slug": slug.current, name, icon, order, description,
        "count": count(*[_type == "product" && references(^._id) && coalesce(active, true)])
      }`,
      { slug },
    );
    return rows[0] ?? null;
  },

  async getProducts(filter: ProductFilter = {}) {
    return getClient().fetch<Product[]>(
      /* groq */ `*[_type == "product" && coalesce(active, true)
        && ($category == null || category->slug.current == $category)
        && ($brand == null || brand == $brand)
      ] | order(name asc) ${PRODUCT_PROJECTION}`,
      { category: filter.category ?? null, brand: filter.brand ?? null },
    );
  },

  async getProduct(slug) {
    const rows = await getClient().fetch<Product[]>(
      /* groq */ `*[_type == "product" && slug.current == $slug][0...1] ${PRODUCT_PROJECTION}`,
      { slug },
    );
    return rows[0] ?? null;
  },

  async getRelatedProducts(product, limit = 4) {
    return getClient().fetch<Product[]>(
      /* groq */ `*[_type == "product" && coalesce(active, true)
        && category->slug.current == $category && slug.current != $slug
      ] | order(brand == $brand desc, count(images) > 0 desc)[0...$limit] ${PRODUCT_PROJECTION}`,
      {
        category: product.category,
        slug: product.slug,
        brand: product.brand,
        limit,
      },
    );
  },

  async getBrand(slug) {
    const rows = await getClient().fetch<Brand[]>(
      /* groq */ `*[_type == "brand" && slug.current == $slug][0...1] {
        "slug": slug.current, name, positioning, description,
        "count": count(*[_type == "product" && brand == ^.slug.current && coalesce(active, true)])
      }`,
      { slug },
    );
    return rows[0] ?? null;
  },

  async getBrands() {
    return getClient().fetch<Brand[]>(
      /* groq */ `*[_type == "brand"] {
        "slug": slug.current, name, positioning, description,
        "count": count(*[_type == "product" && brand == ^.slug.current && coalesce(active, true)])
      }`,
    );
  },
};
