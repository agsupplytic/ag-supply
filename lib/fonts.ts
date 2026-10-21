import { Archivo, IBM_Plex_Sans } from "next/font/google";

// Archivo (eje de ancho, 100–125 %): titulares y etiquetas, con aspecto de maquinaria y
// rotulación corporativa. IBM Plex Sans: texto corrido. `next/font` las autoaloja en el build.
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  axes: ["wdth"],
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex",
  weight: ["400", "500", "600"],
});

export const fontClassNames = `${archivo.variable} ${plex.variable}`;
