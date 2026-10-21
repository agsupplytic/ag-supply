import { execSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/content";
import { absUrl } from "@/lib/seo";
import { href, type Route } from "@/lib/i18n/routes";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

/** Fecha del último commit que tocó estas rutas. Sin git no se inventa una: se omite. */
function lastChange(...paths: string[]): Date | undefined {
  try {
    const iso = execSync(`git log -1 --format=%cI -- ${paths.join(" ")}`, { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
    return iso ? new Date(iso) : undefined;
  } catch {
    return undefined;
  }
}

/** Entrada con las dos versiones de idioma y sus alternates (hreflang). */
function entry(route: Route, lastModified?: Date, images?: string[]): MetadataRoute.Sitemap {
  const es = absUrl(href("es", route));
  const en = absUrl(href("en", route));
  const alternates = { languages: { "es-DO": es, en, "x-default": es } };
  return [
    { url: es, lastModified, alternates, ...(images ? { images } : {}) },
    { url: en, lastModified, alternates, ...(images ? { images } : {}) },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const catalogDate = lastChange("content");
  const shared = ["components/site", "app/globals.css", "lib/site-config.ts", "lib/i18n"];

  // ruta → archivo de la página (su contenido vive allí)
  const pages: [Route, string][] = [
    [{ name: "home" }, "components/pages/home.tsx"],
    [{ name: "about" }, "components/pages/about.tsx"],
    [{ name: "plant" }, "components/pages/plant.tsx"],
    [{ name: "products" }, "components/pages/catalog.tsx"],
    [{ name: "oceanBreeze" }, "components/pages/brand.tsx"],
    [{ name: "bonche" }, "components/pages/brand.tsx"],
    [{ name: "faq" }, "components/pages/faq.tsx"],
    [{ name: "contact" }, "components/pages/contact.tsx"],
  ];

  return [
    ...pages.flatMap(([route, file]) => entry(route, lastChange(file, ...(route.name === "home" ? shared : [])))),
    ...categories.flatMap((c) => entry({ name: "category", cat: c.slug }, catalogDate)),
    ...products.flatMap((p) =>
      entry({ name: "product", cat: p.category, slug: p.slug }, catalogDate, p.images[0] ? [`${siteConfig.url}${p.images[0]}`] : undefined),
    ),
  ];
}
