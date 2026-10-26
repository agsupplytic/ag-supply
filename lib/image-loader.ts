// Loader de imagen para el export estático. Sustituye a `images.unoptimized`:
// no optimiza en el servidor (no hay), pero SÍ antepone el basePath y, para las fotos de
// public/images/{products,fotos,brand}, apunta a la variante reducida que genera
// scripts/make-image-variants.mjs (public/images/_w/<carpeta>/<nombre>-<ancho>.webp).
// Sin esto, una miniatura de 72 px descargaba la foto completa (hasta 67 KB).
//
// `width` se anexa también como query string: no cambia el archivo servido por un host
// estático, pero hace que la URL varíe por ancho, que es lo que `next/image` exige a un
// loader propio (si no avisa «does not implement width» y desactiva el srcset).

// Mismos anchos que genera el script. Más de 1080 px → archivo original.
const WIDTHS = [128, 256, 384, 640, 828, 1080];
const VARIANT_DIRS = /^\/images\/(products|fotos|brand)\/([^/]+)\.(?:webp|jpe?g|png)$/i;

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  let file = src;
  const m = VARIANT_DIRS.exec(src);
  const bucket = WIDTHS.find((w) => w >= width);
  if (m && bucket) file = `/images/_w/${m[1]}/${m[2]}-${bucket}.webp`;
  const path = file.startsWith("/") ? `${base}${file}` : file;
  const params = new URLSearchParams({ w: String(width) });
  if (quality) params.set("q", String(quality));
  return `${path}?${params.toString()}`;
}
