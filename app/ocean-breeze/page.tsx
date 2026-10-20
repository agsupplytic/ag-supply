import { BrandLanding } from "@/components/site/brand-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ocean Breeze: línea institucional de AG Supply",
  description:
    "Ocean Breeze, marca de AG Supply para hoteles, restaurantes y cadenas: servilletas, papel higiénico, toallas, interfoliados y papel facial fabricados en Santiago.",
  path: "/ocean-breeze",
  image: { url: "/images/brand/ocean-breeze-logo.webp", alt: "Logotipo Ocean Breeze" },
});

export default function OceanBreezePage() {
  return (
    <BrandLanding
      slug="ocean-breeze"
      headline="Ocean Breeze, la línea de AG Supply para hoteles y restaurantes"
      subhead="Servilletas, papel higiénico, toallas, interfoliados y papel facial con marca Ocean Breeze, para hoteles, restaurantes, cadenas, catering y eventos."
      audience={["Hoteles", "Restaurantes", "Cadenas", "Catering", "Eventos"]}
      features={[
        { title: "Servilletas de mesa", text: "Dinner, cocktail y tall fold, lisas o timbradas, en blanco y kraft." },
        { title: "Formatos de dispensador", text: "Interfoliados y servilletas de dispensación individual." },
        { title: "Papel higiénico y toallas", text: "Envuelto individual, 12/1, 24/1 y 48/1; toallas de cocina y de manos." },
      ]}
    />
  );
}
