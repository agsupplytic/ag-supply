// Loader de imagen para el export estático. Sustituye a `images.unoptimized`:
// no optimiza (devuelve el archivo local tal cual) pero SÍ antepone el basePath,
// cosa que `unoptimized` no hace. Necesario para que las imágenes carguen cuando
// el sitio se sirve desde /ag-supply/ en GitHub Pages.
//
// `width` (y `quality` si viene) se anexan como query string: no cambian el
// archivo servido por un host estático —GitHub Pages ignora el query al
// resolver el fichero— pero hacen que la URL varíe por ancho, que es lo que
// `next/image` exige a un loader propio (si no, avisa "does not implement width"
// y desactiva el srcset).
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
  const path = src.startsWith("/") ? `${base}${src}` : src;
  const params = new URLSearchParams({ w: String(width) });
  if (quality) params.set("q", String(quality));
  return `${path}?${params.toString()}`;
}
