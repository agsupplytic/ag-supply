// Fotografía de cabecera por categoría. Solo las categorías de papel tissue tienen
// una toma de planta asociada; el resto va sin foto (no se usa material genérico).
export type Photo = { src: string; alt: string; position?: string };

export const CATEGORY_PHOTOS: Record<string, Photo> = {
  "papel-higienico": {
    src: "/images/fotos/planta-2.webp",
    alt: "Rebobinadora con una bobina de papel en la planta de AG Supply",
  },
  toallas: {
    src: "/images/fotos/planta-3.webp",
    alt: "Máquina de conversión de papel en la planta de AG Supply",
  },
  servilletas: {
    src: "/images/fotos/planta-4.webp",
    alt: "Máquina de empaque con cajas de producto terminado",
  },
};
