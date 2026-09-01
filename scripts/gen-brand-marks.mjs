// Prepara los logos de marca para las tarjetas.
//
// Se intentó quitar el fondo blanco por dos vías (umbral de luminancia y
// flood-fill desde los bordes). Ambas destruyen el logotipo: el blanco es color
// de diseño en los dos — las letras "BONCHE" son blancas y el script de Ocean
// Breeze tiene brillos y una ola en azul muy claro que el recorte se come. No
// hay forma automática limpia con estos archivos; necesitarían un PNG con
// transparencia hecho a mano.
//
// Lo que sí mejora sin transparencia — y es lo que se aplica aquí: recortar el
// borde blanco muerto para que el logo llene su caja (se ve más grande) y
// re-encuadrar sobre blanco limpio a una proporción fija.
//
//   public/images/brand/{slug}-plate.webp
//
// Los originales `*-logo.webp` NO se tocan.
//
//   node scripts/gen-brand-marks.mjs

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = path.join(root, "public", "images", "brand");

const RATIO = 16 / 10; // proporción final de la placa (ancho / alto)
const PAD = 0.09; // margen blanco alrededor del logo recortado

async function makePlate(slug) {
  const src = path.join(brandDir, `${slug}-logo.webp`);
  const out = path.join(brandDir, `${slug}-plate.webp`);

  const trimmed = await sharp(src)
    .trim({ background: "#ffffff", threshold: 12 })
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = trimmed.info;
  const pad = Math.round(Math.max(w, h) * PAD);

  let boxW = w + pad * 2;
  let boxH = h + pad * 2;
  if (boxW / boxH < RATIO) boxW = Math.round(boxH * RATIO);
  else boxH = Math.round(boxW / RATIO);

  await sharp(trimmed.data)
    .resize(boxW, boxH, { fit: "contain", background: "#ffffff" })
    .webp({ quality: 92 })
    .toFile(out);

  const meta = await sharp(out).metadata();
  console.log(
    `  ${slug}-plate.webp  ${meta.width}x${meta.height}  (logo ${w}x${h})`,
  );
}

console.log("Generando placas de marca:");
for (const slug of ["ocean-breeze", "bonche"]) {
  await makePlate(slug);
}
console.log("Listo.");
