import type { Lang } from "./i18n/routes";

// Fotografía de cabecera por categoría. Solo las categorías de papel tissue tienen
// una toma de planta asociada; el resto va sin foto (no se usa material genérico).
export type Photo = { src: string; alt: Record<Lang, string>; position?: string };

export const CATEGORY_PHOTOS: Record<string, Photo> = {
  "papel-higienico": {
    src: "/images/fotos/planta-2.webp",
    alt: { es: "Rebobinadora con una bobina de papel en la planta de AG Supply", en: "Rewinder with a paper reel at the AG Supply plant" },
  },
  toallas: {
    src: "/images/fotos/planta-3.webp",
    alt: { es: "Máquina de conversión de papel en la planta de AG Supply", en: "Paper converting machine at the AG Supply plant" },
  },
  servilletas: {
    src: "/images/fotos/planta-4.webp",
    alt: { es: "Máquina de empaque con cajas de producto terminado", en: "Packing machine with boxes of finished product" },
  },
};

/** Fotos de la planta, en el orden del proceso de conversión. */
export const PLANT_PHOTOS = {
  reels: {
    src: "/images/fotos/hero-2.webp",
    alt: { es: "Bobinas de papel base almacenadas en la nave", en: "Base paper reels stored in the plant" },
  },
  rewind: {
    src: "/images/fotos/planta-2.webp",
    alt: { es: "Rebobinadora con una bobina de papel", en: "Rewinder with a paper reel" },
  },
  cut: {
    src: "/images/fotos/planta-3.webp",
    alt: { es: "Máquina de corte y conversión de papel", en: "Paper cutting and converting machine" },
  },
  pack: {
    src: "/images/fotos/planta-4.webp",
    alt: { es: "Máquina de empaque con cajas de producto", en: "Packing machine with product boxes" },
  },
  dispatch: {
    src: "/images/fotos/planta-5.webp",
    alt: { es: "Cajas de producto terminado apiladas", en: "Stacked boxes of finished product" },
  },
  facade: {
    src: "/images/fotos/section-nosotros.webp",
    alt: { es: "Fachada de AG Supply en Las Palomas, Santiago", en: "AG Supply building in Las Palomas, Santiago" },
  },
} as const;
