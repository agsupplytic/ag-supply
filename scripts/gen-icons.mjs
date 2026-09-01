// Generates the app favicons from the AG monogram with ROUNDED corners.
//   source: public/images/brand/ag-monogram.png  (blue "AG" on white, square)
//   out:    app/icon.png        512x512  rounded-corner tile (transparent outside)
//           app/apple-icon.png  180x180  full-bleed white tile (iOS masks it itself)
//
// Usage: node scripts/gen-icons.mjs
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = join(ROOT, "public", "images", "brand", "ag-monogram.png");

const roundedMask = (size, radiusPct) => {
  const r = Math.round(size * radiusPct);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/>
     </svg>`,
  );
};

async function main() {
  // app/icon.png — 512, clearly rounded corners (≈30% radius → squircle)
  const size = 512;
  const base = await sharp(SRC)
    .resize(size, size, { fit: "cover" })
    .flatten({ background: "#ffffff" })
    .toBuffer();
  await sharp(base)
    .composite([{ input: roundedMask(size, 0.3), blend: "dest-in" }])
    .png()
    .toFile(join(ROOT, "app", "icon.png"));
  console.log("wrote app/icon.png", `${size}x${size}`);

  // app/apple-icon.png — 180, full-bleed white tile with a little padding
  const a = 180;
  const pad = 16;
  const inner = await sharp(SRC)
    .resize(a - pad * 2, a - pad * 2, { fit: "contain", background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .toBuffer();
  await sharp({
    create: {
      width: a,
      height: a,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite([{ input: inner, top: pad, left: pad }])
    .png()
    .toFile(join(ROOT, "app", "apple-icon.png"));
  console.log("wrote app/apple-icon.png", `${a}x${a}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
