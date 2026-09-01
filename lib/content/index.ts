// Single entry point for all content reads. Components import from here and never
// touch a JSON file or the Sanity client directly.
//
// Switching sources: set CONTENT_SOURCE=sanity (and the Sanity env vars from
// docs/DEPLOY.md). The sanity module is import-safe — it only contacts Sanity
// when a query actually runs — so importing both here costs nothing at rest.
import { localSource } from "./local";
import { sanitySource } from "./sanity";
import type { ContentSource } from "./types";

const source: ContentSource =
  process.env.CONTENT_SOURCE === "sanity" ? sanitySource : localSource;

export const getCategories = source.getCategories.bind(source);
export const getCategory = source.getCategory.bind(source);
export const getProducts = source.getProducts.bind(source);
export const getProduct = source.getProduct.bind(source);
export const getRelatedProducts = source.getRelatedProducts.bind(source);
export const getBrand = source.getBrand.bind(source);
export const getBrands = source.getBrands.bind(source);

export * from "./types";
