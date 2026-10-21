import type { Lang } from "./routes";

// Textos de la empresa por idioma. Los datos (teléfonos, cifras, dirección) viven en
// lib/site-config.ts; aquí solo la redacción. El inglés es traducción nuestra de los
// textos del cliente y debe revisarla (ver docs/DATOS-PENDIENTES.md).

export const siteText = {
  es: {
    tagline: "Convertidora de papel dominicana",
    slogan: "Siente la limpieza",
    description:
      "AG Supply es una convertidora de papel con planta en Santiago, República Dominicana. Fabrica papel higiénico, toallas, servilletas, interfoliados y papel facial bajo las marcas Ocean Breeze y Bonche.",
    mission:
      "Somos una empresa convertidora de papel, que comercializa productos de higiene personal, con un enfoque innovador y eficiente, contando con personal capacitado para garantizar la satisfacción de nuestros clientes, la rentabilidad del negocio y la mejora continua de los procesos.",
    vision:
      "Ser líderes en la fabricación de productos higiénicos, la primera opción de las empresas en la comercialización de sus marcas y la expansión de nuestras operaciones comerciales a todo el Caribe.",
    hours: "Lun a Vie, 8:00 a.m. – 5:00 p.m.",
    values: [
      { name: "Servicio", text: "Atención al cliente como prioridad." },
      { name: "Sentido humano", text: "Valorar el esfuerzo del personal y su desarrollo." },
      { name: "Eficiencia", text: "Manufactura ágil y maximización de los recursos." },
      { name: "Higiene", text: "Esencia de nuestros productos y hábito del personal." },
      { name: "Integridad", text: "Ética y responsabilidad, sin necesidad de supervisión." },
      { name: "Innovación", text: "Productos de vanguardia para el mercado." },
    ],
    proximity: [
      "500 m de la autopista principal del país",
      "800 m de la circunvalación norte",
      "3 km del Aeropuerto Internacional del Cibao",
    ],
    address: { line1: "Sector Las Palomas", city: "Santiago de los Caballeros", country: "República Dominicana" },
    whatsapp: {
      quoteIntro: "Hola, quisiera cotizar los siguientes productos de AG Supply:",
      quoteOutro: "Gracias.",
      genericMessage: "Hola, me gustaría recibir información sobre los productos de AG Supply.",
      productMessage: (name: string, sku?: string) =>
        `Hola, quisiera información sobre: ${name}${sku ? ` (SKU ${sku})` : ""}`,
    },
  },
  en: {
    tagline: "Dominican paper converter",
    slogan: "Feel the clean",
    description:
      "AG Supply is a paper converter with a plant in Santiago, Dominican Republic. It manufactures toilet paper, paper towels, napkins, interfolded towels and facial tissue under the Ocean Breeze and Bonche brands.",
    mission:
      "We are a paper converting company that markets personal hygiene products, with an innovative and efficient approach and trained staff, to ensure customer satisfaction, business profitability and continuous process improvement.",
    vision:
      "To lead in the manufacture of hygiene products, to be the first choice of companies for marketing their brands, and to expand our commercial operations throughout the Caribbean.",
    hours: "Mon–Fri, 8:00 a.m. – 5:00 p.m.",
    values: [
      { name: "Service", text: "Customer care as a priority." },
      { name: "Human touch", text: "Valuing our people's effort and development." },
      { name: "Efficiency", text: "Agile manufacturing and the best use of resources." },
      { name: "Hygiene", text: "The essence of our products and a habit of our staff." },
      { name: "Integrity", text: "Ethics and responsibility, with no need for supervision." },
      { name: "Innovation", text: "Cutting-edge products for the market." },
    ],
    proximity: [
      "500 m from the country's main highway",
      "800 m from the northern ring road",
      "3 km from Cibao International Airport",
    ],
    address: { line1: "Las Palomas district", city: "Santiago de los Caballeros", country: "Dominican Republic" },
    whatsapp: {
      quoteIntro: "Hello, I would like a quote for the following AG Supply products:",
      quoteOutro: "Thank you.",
      genericMessage: "Hello, I would like information about AG Supply products.",
      productMessage: (name: string, sku?: string) =>
        `Hello, I would like information about: ${name}${sku ? ` (SKU ${sku})` : ""}`,
    },
  },
} as const satisfies Record<Lang, unknown>;

export const textFor = (lang: Lang) => siteText[lang];
