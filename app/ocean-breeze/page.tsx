import type { Metadata } from "next";
import { BrandLanding } from "@/components/site/brand-landing";
import { ogFor } from "@/lib/seo";

const OB_DESC =
  "Ocean Breeze es la línea premium de AG Supply para hoteles, restaurantes y cadenas: servilletas, faciales, higiénicos y toallas con blancura superior al 98 %, alta resistencia y cortes exactos.";

export const metadata: Metadata = {
  title: "Ocean Breeze — Línea premium HORECA",
  description: OB_DESC,
  alternates: { canonical: "/ocean-breeze" },
  openGraph: ogFor("Ocean Breeze — Línea premium HORECA de AG Supply", OB_DESC),
};

export default function OceanBreezePage() {
  return (
    <BrandLanding
      slug="ocean-breeze"
      tone="premium"

      headline="Ocean Breeze: la línea premium para hotelería y restaurantes"
      subhead="Servilletas dinner y cocktail, faciales, higiénico envuelto y toallas pensados para la mesa y las áreas de huésped. Presentación cuidada y abastecimiento estable, fabricados por AG Supply."
      audience={["Hoteles", "Restaurantes", "Cadenas", "Catering", "Eventos"]}
      valueProps={[
        {
          title: "Presentación de mesa",
          text: "Doblez dinner, cocktail y tall fold, liso o timbrado, en blanco y kraft.",
        },
        {
          title: "Consistencia de lote",
          text: "Mismo gramaje, mismo formato en cada pedido, porque se produce en planta propia.",
        },
        {
          title: "Formato para dispensador",
          text: "Interfoliados y servilletas de dispensación individual para controlar el consumo.",
        },
      ]}
    />
  );
}
