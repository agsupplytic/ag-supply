import { BrandPage, brandMetadata } from "@/components/pages/brand";

export const metadata = brandMetadata("es", "oceanBreeze");

export default function Page() {
  return <BrandPage lang="es" slug="oceanBreeze" />;
}
