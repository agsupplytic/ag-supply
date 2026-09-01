// Single source of truth for contact details, WhatsApp wiring and copy constants.
// Nothing user-facing should hardcode a phone number or address.

export const siteConfig = {
  name: "AG Supply",
  legalName: "AG Supply SRL",
  /** One-line description of what the company is — a converter, not a reseller. */
  tagline: "Convertidora de papel dominicana",
  /** Official brand slogan. */
  slogan: "Siente la limpieza",
  description:
    "Convertidora de papel en Santiago, República Dominicana. Fabricamos papel higiénico, toallas, servilletas, faciales, interfoliados y desechables bajo las marcas Ocean Breeze y Bonche.",
  url: "https://agsupply.com.do",

  phones: [
    { label: "Central", value: "809-612-2020", tel: "+18096122020" },
    { label: "Alterno", value: "809-778-9119", tel: "+18097789119" },
  ],
  email: "agsupplycxc@gmail.com",
  social: { handle: "@agsupplyrd", instagram: "https://instagram.com/agsupplyrd" },

  /** Horario comercial. weekdaysShort para schema.org (Mo-Fr 08:00-17:00). */
  hours: {
    label: "Lun a Vie, 8:00 a.m. – 5:00 p.m.",
    opens: "08:00",
    closes: "17:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },

  address: {
    line1: "Sector Las Palomas",
    city: "Santiago de los Caballeros",
    country: "República Dominicana",
    // Coordinates of the AG Supply pin on Google Maps (maps.app.goo.gl/QYBnhB5UNn57N5Ld9).
    lat: 19.4258125,
    lng: -70.6474375,
    mapsUrl: "https://maps.app.goo.gl/QYBnhB5UNn57N5Ld9",
    mapsQuery: "AG Supply, Santiago de los Caballeros",
  },

  company: {
    foundedYear: 2007,
    pivotYear: 2014,
    formerName: "A.G. Office Supply, S.R.L.",
    capacityTonsMonth: 400,
    plant: {
      landM2: 2000,
      builtM2: 1000,
      officeM2: 200,
      productionM2: 800,
      proximity: [
        "500 m de la autopista principal del país",
        "800 m de la circunvalación norte",
        "3 km del Aeropuerto Internacional del Cibao",
      ],
    },
  },

  mission:
    "Somos una empresa convertidora de papel, que comercializa productos de higiene personal, con un enfoque innovador y eficiente, contando con personal capacitado para garantizar la satisfacción de nuestros clientes, la rentabilidad del negocio y la mejora continua de los procesos.",
  vision:
    "Ser líderes en la fabricación de productos higiénicos, la primera opción de las empresas en la comercialización de sus marcas y la expansión de nuestras operaciones comerciales a todo el Caribe.",
  valueProp:
    "Suplir suministros y productos desechables de buena calidad a precios competitivos a todas las empresas e instituciones de la región del Caribe.",
  values: [
    { name: "Servicio", text: "Atención al cliente como prioridad." },
    { name: "Sentido humano", text: "Valorar el esfuerzo del personal y su desarrollo." },
    { name: "Eficiencia", text: "Manufactura ágil y maximización de los recursos." },
    { name: "Higiene", text: "Esencia de nuestros productos y hábito del personal." },
    { name: "Integridad", text: "Ética y responsabilidad, sin necesidad de supervisión." },
    { name: "Innovación", text: "Productos de vanguardia para el mercado." },
  ],

  whatsapp: {
    /** International format, digits only, for wa.me links. */
    number: "18096122020",
    quoteIntro: "Hola, quisiera cotizar los siguientes productos de AG Supply:",
    quoteOutro: "Gracias.",
    genericMessage:
      "Hola, me gustaría recibir información sobre los productos de AG Supply.",
  },
} as const;

/**
 * Distribuidores autorizados de AG Supply, por zona. Datos tomados del sitio
 * actual (agsupply.com.do/contacto-ag-supply). Confirmar y completar direcciones
 * si se quieren mostrar — ver docs/COPY-NEEDED.md.
 */
export const distributors: {
  zone: string;
  items: { name: string; phone: string; tel: string }[];
}[] = [
  {
    zone: "Santiago",
    items: [
      { name: "Concaribe", phone: "809-287-8000", tel: "+18092878000" },
      { name: "Martes y Reyes", phone: "809-582-1746", tel: "+18095821746" },
    ],
  },
  {
    zone: "Santo Domingo",
    items: [
      { name: "Suplisol", phone: "809-540-6636", tel: "+18095406636" },
      { name: "Vinky", phone: "809-286-3202", tel: "+18092863202" },
      { name: "Abastra", phone: "829-793-0303", tel: "+18297930303" },
    ],
  },
  {
    zone: "Región Este",
    items: [
      { name: "Alimundo", phone: "809-362-7953", tel: "+18093627953" },
      {
        name: "Suministro Expreso Hotelero",
        phone: "809-534-4760",
        tel: "+18095344760",
      },
      { name: "Athil y Martínez", phone: "809-227-8494", tel: "+18092278494" },
    ],
  },
  {
    zone: "Puerto Plata",
    items: [
      { name: "Costa Atlántica", phone: "809-320-8509", tel: "+18093208509" },
      { name: "Jenny Market", phone: "809-970-3028", tel: "+18099703028" },
    ],
  },
];

export function waLink(text: string): string {
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(text)}`;
}
