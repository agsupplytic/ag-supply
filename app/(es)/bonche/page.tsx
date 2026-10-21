import { BrandPage, brandMetadata } from "@/components/pages/brand";

export const metadata = brandMetadata("es", "bonche");

export default function Page() {
  return <BrandPage lang="es" slug="bonche" />;
}
