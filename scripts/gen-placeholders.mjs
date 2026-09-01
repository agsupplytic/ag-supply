// Generates labelled placeholder images so every image slot on the site shows
// "AQUÍ VA UNA IMAGEN: <qué foto va>" until real photography is supplied.
// Output: public/images/placeholders/*.webp   (also referenced by content/*.json
// via the category `placeholder` field and by BackgroundCarousel).
//
// Usage: node scripts/gen-placeholders.mjs
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT = join(process.cwd(), "public", "images", "placeholders");
mkdirSync(OUT, { recursive: true });

const BLUE = "#0f5a92";
const BLUE_D = "#0f4a7a";
const RED = "#ED1C24";

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const cameraGlyph = (cx, cy, s, op = 0.9) => `
  <g transform="translate(${cx}, ${cy})">
    <rect x="${-s * 1.4}" y="${-s * 1.1}" width="${s * 2.8}" height="${s * 2.1}" rx="${s * 0.28}"
          fill="none" stroke="#ffffff" stroke-width="${Math.max(2, s * 0.09)}" opacity="${op}"/>
    <circle cx="0" cy="${s * 0.05}" r="${s * 0.55}" fill="none" stroke="#ffffff" stroke-width="${Math.max(2, s * 0.09)}" opacity="${op}"/>
    <circle cx="${s * 0.9}" cy="${-s * 0.65}" r="${s * 0.16}" fill="#ffffff" opacity="${op}"/>
  </g>`;

const base = (w, h) => `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BLUE}"/>
      <stop offset="1" stop-color="${BLUE_D}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <g transform="translate(${-w * 0.05} ${h * 0.55}) scale(${(w * 1.2) / 500} ${(h * 1.0) / 200})">
    <path d="M16 196 C 1 193 1 152 16 149 C 170 156 334 124 492 64 C 356 126 204 172 64 194 C 48 197 30 200 16 196 Z" fill="#ffffff" fill-opacity="0.12"/>
    <path d="M18 122 C 3 119 3 81 18 78 C 172 86 330 56 486 16 C 344 74 200 116 62 128 C 46 129 30 127 18 122 Z" fill="${RED}" fill-opacity="0.85"/>
  </g>`;

function svgLabeled(w, h, title, subtitle) {
  const fs = Math.round(Math.min(w, h) * 0.052);
  const fsSub = Math.round(fs * 0.62);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${base(w, h)}
  ${cameraGlyph(w / 2, h / 2 - fs * 1.6, fs)}
  <text x="50%" y="${h / 2 + fs * 0.4}" text-anchor="middle" font-family="Montserrat, Arial, sans-serif"
        font-size="${fs}" font-weight="700" fill="#ffffff" fill-opacity="0.9" letter-spacing="1">AQUÍ VA UNA IMAGEN</text>
  <text x="50%" y="${h / 2 + fs * 1.7}" text-anchor="middle" font-family="Inter, Arial, sans-serif"
        font-size="${fsSub}" font-weight="500" fill="#ffffff" fill-opacity="0.9">${esc(title)}</text>
  ${subtitle ? `<text x="50%" y="${h / 2 + fs * 2.7}" text-anchor="middle" font-family="Inter, Arial, sans-serif"
        font-size="${Math.round(fsSub * 0.8)}" fill="#ffffff" fill-opacity="0.82">${esc(subtitle)}</text>` : ""}
</svg>`;
}

function svgMinimal(w, h) {
  const s = Math.round(Math.min(w, h) * 0.11);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${base(w, h)}
  ${cameraGlyph(w / 2, h / 2, s, 0.28)}
</svg>`;
}

function svgMinimalLight(w, h) {
  const s = Math.round(Math.min(w, h) * 0.13);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#eef3f8"/>
  <g transform="translate(${w / 2}, ${h / 2})">
    <rect x="${-s * 1.4}" y="${-s * 1.1}" width="${s * 2.8}" height="${s * 2.1}" rx="${s * 0.28}" fill="none" stroke="#9cbfdd" stroke-width="${Math.max(2, s * 0.09)}"/>
    <circle cx="0" cy="${s * 0.05}" r="${s * 0.55}" fill="none" stroke="#9cbfdd" stroke-width="${Math.max(2, s * 0.09)}"/>
    <circle cx="${s * 0.9}" cy="${-s * 0.65}" r="${s * 0.16}" fill="#9cbfdd"/>
  </g>
</svg>`;
}

async function make(name, w, h, title, subtitle, mode = "labeled") {
  const svg =
    mode === "minimal-light"
      ? svgMinimalLight(w, h)
      : mode === "minimal"
        ? svgMinimal(w, h)
        : svgLabeled(w, h, title, subtitle);
  await sharp(Buffer.from(svg)).webp({ quality: 84 }).toFile(join(OUT, `${name}.webp`));
  console.log("wrote", `${name}.webp`, `${w}x${h}`, mode);
}

// NOTE (ronda 10): the site no longer renders "AQUÍ VA UNA IMAGEN" art. Missing
// photos now show a quiet <ImageSlot> panel (components/site/image-slot.tsx) and
// are tracked in docs/IMAGES-NEEDED.md. hero-1/2/3, section-manufactura,
// section-nosotros and section-cta hold REAL photography. `jobs` is intentionally
// empty so re-running this never overwrites a real photo; the svg helpers above
// are kept for reference only.
const jobs = [];

for (const j of jobs) await make(...j);
console.log(`\nDone — ${jobs.length} placeholders in ${OUT}`);
