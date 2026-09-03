import type { NextConfig } from "next";

// GitHub Pages sirve el proyecto desde /<repo>/ (subruta), no desde la raíz, así
// que en ese deploy hay que prefijar rutas y assets. El workflow pone
// NEXT_PUBLIC_BASE_PATH=/ag-supply. Con un dominio propio (agsupply.com.do) el
// sitio va a la raíz y esta variable queda vacía → sin basePath.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Salida 100% estática: `next build` escribe out/ (HTML/CSS/JS), sin servidor.
  output: "export",
  // Loader propio: no optimiza (export estático) pero antepone el basePath al
  // src, que es lo que `images.unoptimized` no hace.
  images: { loader: "custom", loaderFile: "./lib/image-loader.ts" },
  // /ruta/ → out/ruta/index.html, lo que resuelve un host de archivos.
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
