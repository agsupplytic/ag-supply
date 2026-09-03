// Loader de imagen para el export estático. Sustituye a `images.unoptimized`:
// no optimiza (devuelve el archivo local tal cual) pero SÍ antepone el basePath,
// cosa que `unoptimized` no hace. Necesario para que las imágenes carguen cuando
// el sitio se sirve desde /ag-supply/ en GitHub Pages.
export default function imageLoader({ src }: { src: string }): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return src.startsWith("/") ? `${base}${src}` : src;
}
