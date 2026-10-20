import { BrandLanding } from "@/components/site/brand-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Bonche: servilletas de consumo masivo",
  description:
    "Bonche, marca de AG Supply para consumo masivo y uso cotidiano: servilletas y papel encerado fabricados en Santiago para colmados, supermercados y mayoristas.",
  path: "/bonche",
  image: { url: "/images/fotos/brand-bonche-hero.webp", alt: "Servilletas Bonche" },
});

export default function BonchePage() {
  return (
    <BrandLanding
      slug="bonche"
      headline="Bonche, la línea de AG Supply para consumo masivo"
      subhead="Servilletas de dispensador y papel de uso diario, de precio accesible, para colmados, supermercados, mayoristas y cafeterías."
      audience={["Colmados", "Supermercados", "Mayoristas", "Cafeterías"]}
      features={[
        { title: "Servilletas de dispensador", text: "Presentación en paquetes para exhibición y reposición en góndola." },
        { title: "Papel encerado", text: "Plegadizas de papel encerado para envolver alimentos." },
        { title: "Más referencias por consulta", text: "El catálogo publicado es parcial; consulte por otras presentaciones." },
      ]}
    />
  );
}
