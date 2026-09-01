/**
 * Placeholder image basenames that have been replaced with REAL photography.
 * `Figure` and `BackgroundCarousel` hide the "Imagen de prueba" badge for these.
 * Add a basename here when its real photo lands in public/images/placeholders/.
 */
const REAL = new Set<string>([
  "hero-1",
  "hero-2",
  "hero-3",
  "section-cta",
  "section-manufactura",
  "section-nosotros",
]);

/** True when `src` points at a placeholder path that now holds a real photo. */
export function isRealImage(src: string): boolean {
  const m = /\/images\/placeholders\/([^/.]+)\./.exec(src);
  return m ? REAL.has(m[1]) : false;
}
