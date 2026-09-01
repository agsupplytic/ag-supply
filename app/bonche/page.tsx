import type { Metadata } from "next";
import { BrandLanding } from "@/components/site/brand-landing";
import { ogFor } from "@/lib/seo";

const BONCHE_DESC =
  "Bonche es la línea económica de AG Supply para colmados, supermercados y consumo masivo: alta absorción y rendimiento excepcional a precios muy competitivos.";

export const metadata: Metadata = {
  title: "Bonche — Línea económica de consumo masivo",
  description: BONCHE_DESC,
  alternates: { canonical: "/bonche" },
  openGraph: ogFor("Bonche — Línea económica de AG Supply", BONCHE_DESC),
};

export default function BonchePage() {
  return (
    <BrandLanding
      slug="bonche"
      tone="value"

      headline="Bonche: higiene de alto volumen para el canal masivo"
      subhead="Servilletas de dispensador y productos de uso diario en presentaciones de mucho paquete, pensados para colmados, supermercados y operaciones que mueven volumen."
      audience={["Colmados", "Supermercados", "Mayoristas", "Cafeterías"]}
      valueProps={[
        {
          title: "Rinde más por peso",
          text: "Formatos de alto conteo de paquetes por fardo para bajar el costo por unidad.",
        },
        {
          title: "Rotación rápida",
          text: "Producto de uso diario, fácil de exhibir y de reponer en góndola.",
        },
        {
          title: "Fabricación local",
          text: "Se produce en Santiago, así que el abastecimiento no depende de importación.",
        },
      ]}
    />
  );
}
