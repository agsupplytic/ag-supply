// Validación en tiempo de build de content/*.json. Un dato mal formado debe
// romper el build, no llegar a producción.
import { z } from "zod";

const productSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  brand: z.enum(["ocean-breeze", "bonche", "generico"]),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  images: z.array(z.string()),
  placeholderImage: z.boolean(),
  specs: z.record(z.string(), z.union([z.string(), z.number()])),
  keySpecs: z.array(z.string()),
  description: z.string().optional(),
  sku: z.string().optional(),
  odooId: z.number(),
  active: z.boolean(),
  fabricated: z.boolean(),
});

const categorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  icon: z.string(),
  order: z.number(),
  short: z.string(),
  description: z.string(),
  count: z.number(),
  fabricated: z.boolean(),
  subcategories: z.array(z.string()).optional(),
});

const brandSchema = z.object({
  slug: z.enum(["ocean-breeze", "bonche", "generico"]),
  name: z.string(),
  positioning: z.enum(["premium", "economica", "generico"]),
  short: z.string(),
  description: z.string(),
  count: z.number(),
});

export function parseContent<T>(kind: "products" | "categories" | "brands", data: unknown): T[] {
  const schema = { products: productSchema, categories: categorySchema, brands: brandSchema }[kind];
  const result = z.array(schema).safeParse(data);
  if (!result.success) {
    throw new Error(`content/${kind}.json inválido: ${result.error.issues.slice(0, 3).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
  }
  return result.data as T[];
}
