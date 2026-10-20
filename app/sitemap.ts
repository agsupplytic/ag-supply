import { execSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/content";
import { absUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

/** Fecha del último commit que tocó estas rutas. Sin git no se inventa una: se omite. */
function lastChange(...paths: string[]): Date | undefined {
  try {
    const iso = execSync(`git log -1 --format=%cI -- ${paths.join(" ")}`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    return iso ? new Date(iso) : undefined;
  } catch {
    return undefined;
  }
}

const shared = ["components/site", "app/globals.css", "lib/site-config.ts"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const catalogDate = lastChange("content");

  // ruta → archivo de la página (el contenido de cada una vive allí)
  const pages: [string, string][] = [
    ["/", "app/page.tsx"],
    ["/nosotros", "app/nosotros/page.tsx"],
    ["/nosotros/planta", "app/nosotros/planta/page.tsx"],
    ["/productos", "app/productos/page.tsx"],
    ["/ocean-breeze", "app/ocean-breeze/page.tsx"],
    ["/bonche", "app/bonche/page.tsx"],
    ["/faq", "app/faq/page.tsx"],
    ["/contacto", "app/contacto/page.tsx"],
  ];

  const staticRoutes = pages.map(([path, file]) => ({
    url: absUrl(path),
    lastModified: lastChange(file, ...(path === "/" ? shared : [])),
  }));
  const categoryRoutes = categories.map((c) => ({
    url: absUrl(`/productos/${c.slug}`),
    lastModified: catalogDate,
  }));
  const productRoutes = products.map((p) => ({
    url: absUrl(`/productos/${p.category}/${p.slug}`),
    lastModified: catalogDate,
    ...(p.images[0] ? { images: [`${siteConfig.url}${p.images[0]}`] } : {}),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
