// Normalized content shapes consumed by the whole site. The `local` adapter reads
// these from content/*.json today; the `sanity` adapter will return the same
// shapes from GROQ once CONTENT_SOURCE=sanity. Nothing downstream should care
// which source produced the data. There is deliberately NO price field anywhere.

export type BrandSlug = "ocean-breeze" | "bonche" | "generico";

export interface ProductSpecs {
  ply?: number;
  widthCm?: number;
  sheetLengthCm?: number;
  sheets?: number;
  grammageGsm?: number;
  rollLengthM?: number;
  rollLengthFt?: number;
  color?: string;
  fold?: string;
  finish?: string;
  paperType?: string;
  /** Raw pack notation from the source, e.g. "48/1", "20/150". */
  packFormat?: string;
  packsPerBale?: number;
  packageDims?: string;
  caseDims?: string;
  unitsPerPallet?: number;
  compliance?: string;
}

export interface Product {
  slug: string;
  name: string;
  brand: BrandSlug;
  /** Category slug, matches Category.slug. */
  category: string;
  subcategory?: string;
  images: string[];
  /** True when no real photo exists yet — render a branded placeholder. */
  placeholderImage: boolean;
  specs: ProductSpecs;
  /** 1–2 short strings for the product card, e.g. ["2 capas", "500 hojas"]. */
  keySpecs: string[];
  description?: string;
  sku?: string;
  odooId: number;
  active: boolean;
}

export interface Category {
  slug: string;
  name: string;
  /** lucide-react icon name. */
  icon: string;
  order: number;
  /** Short blurb for cards / mega-menu. */
  short: string;
  /** Full description for the category page header. */
  description: string;
  count: number;
  /** Background image for the category card (placeholder until real photo). */
  placeholder?: string;
  /** Ordered subcategory labels shown as filters on the category page. */
  subcategories?: string[];
}

export interface Brand {
  slug: BrandSlug;
  name: string;
  positioning: "premium" | "economica" | "generico";
  /** Short blurb for cards. */
  short: string;
  /** Full positioning statement for the brand landing page. */
  description: string;
  count: number;
}

export interface ProductFilter {
  category?: string;
  brand?: BrandSlug;
  /** Attribute filters, e.g. { ply: 2 }. Values compared loosely. */
  attrs?: Partial<Record<keyof ProductSpecs, string | number>>;
}

export interface ContentSource {
  getCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | null>;
  getProducts(filter?: ProductFilter): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  getRelatedProducts(product: Product, limit?: number): Promise<Product[]>;
  getBrand(slug: string): Promise<Brand | null>;
  getBrands(): Promise<Brand[]>;
}
