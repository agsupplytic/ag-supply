/**
 * Placeholder image basenames that have been replaced with REAL photography.
 * `Figure` and `BackgroundCarousel` hide the "Imagen de prueba" badge for these.
 * Add a basename here when its real photo lands in public/images/placeholders/.
 */
const REAL = new Set<string>([
  // heroes / section bands
  "hero-1",
  "hero-2",
  "hero-3",
  "section-cta",
  "section-manufactura",
  "section-nosotros",
  "header-productos",
  // planta — proceso de conversión
  "planta-1",
  "planta-2",
  "planta-3",
  "planta-4",
  "planta-5",
  // marca
  "brand-bonche-hero",
  // categorías (foto de producto sobre blanco)
  "cat-papel-higienico",
  "cat-toallas",
  "cat-servilletas",
  "cat-interfoliados",
  "cat-facial",
  "cat-jabon",
  "cat-desechables",
  "cat-cuberteria",
]);

/** True when `src` points at a placeholder path that now holds a real photo. */
export function isRealImage(src: string): boolean {
  const m = /\/images\/placeholders\/([^/.]+)\./.exec(src);
  return m ? REAL.has(m[1]) : false;
}
