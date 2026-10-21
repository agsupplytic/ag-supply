import { BrandPage, brandMetadata } from "@/components/pages/brand";

export const metadata = brandMetadata("en", "oceanBreeze");

export default function Page() {
  return <BrandPage lang="en" slug="oceanBreeze" />;
}
