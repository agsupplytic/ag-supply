import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/nosotros",
    "/nosotros/planta",
    "/productos",
    "/ocean-breeze",
    "/bonche",
    "/faq",
    "/contacto",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const categoryRoutes = categories.map((c) => ({
    url: `${base}/productos/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/productos/${p.category}/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
