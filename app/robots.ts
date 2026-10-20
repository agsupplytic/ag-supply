import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

// Todo el sitio es rastreable, incluidos los buscadores y asistentes de IA. La
// lista de cotización no se bloquea aquí: lleva `noindex`, y un bloqueo en robots
// impediría que Google llegara a leer esa etiqueta.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
