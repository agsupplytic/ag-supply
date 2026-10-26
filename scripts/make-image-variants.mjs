// Genera versiones reducidas de las imágenes raster en public/images/_w/ para que el listado
// y las tarjetas no descarguen la foto original (un export estático no redimensiona nada).
//   public/images/products/odoo-3673.webp → public/images/_w/products/odoo-3673-256.webp
// Anchos = los de next/image; el loader (lib/image-loader.ts) elige el más cercano por encima del
// pedido y usa el original solo si pide más de 1080 px. Se ejecuta en prebuild/predev; lo ya
// generado y más reciente que el original se conserva. public/images/_w/ no se versiona.
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, parse } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC_DIRS = ["products", "fotos", "brand"];
const WIDTHS = [128, 256, 384, 640, 828, 1080];
const RASTER = /\.(webp|jpe?g|png)$/i;

let made = 0, kept = 0;
for (const dir of SRC_DIRS) {
  const from = join(ROOT, "public", "images", dir);
  if (!existsSync(from)) continue;
  const to = join(ROOT, "public", "images", "_w", dir);
  mkdirSync(to, { recursive: true });
  for (const file of readdirSync(from).filter((f) => RASTER.test(f))) {
    const src = join(from, file);
    const { name } = parse(file);
    const meta = await sharp(src).metadata();
    for (const w of WIDTHS) {
      const dest = join(to, `${name}-${w}.webp`);
      if (existsSync(dest) && statSync(dest).mtimeMs >= statSync(src).mtimeMs) { kept++; continue; }
      // Nunca se amplía: si el original es más estrecho, la variante conserva su tamaño.
      await sharp(src).resize({ width: Math.min(w, meta.width ?? w), withoutEnlargement: true }).webp({ quality: 76 }).toFile(dest);
      made++;
    }
  }
}
console.log(`imágenes: ${made} variantes nuevas, ${kept} ya vigentes`);
