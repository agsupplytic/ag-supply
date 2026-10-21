import { CatalogPage, catalogMetadata } from "@/components/pages/catalog";

export const metadata = catalogMetadata("es");

export default function Page() {
  return <CatalogPage lang="es" />;
}
