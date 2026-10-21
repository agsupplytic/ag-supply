import { CatalogPage, catalogMetadata } from "@/components/pages/catalog";

export const metadata = catalogMetadata("en");

export default function Page() {
  return <CatalogPage lang="en" />;
}
