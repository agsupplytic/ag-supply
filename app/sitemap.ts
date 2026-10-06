import { execSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

/** Fecha del último commit que tocó el catálogo (no la del build). */
function contentDate(): Date {
  try {
    const iso = execSync("git log -1 --format=%cI -- content", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    if (iso) return new Date(iso);
  } catch {
    /* sin git: se usa la fecha fija de abajo */
  }
  return new Date("2026-10-05T00:00:00Z");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = contentDate();

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
