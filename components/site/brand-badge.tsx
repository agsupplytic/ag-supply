import { Badge } from "@/components/ui/badge";
import type { BrandSlug } from "@/lib/content/types";

const LABEL: Record<BrandSlug, string> = {
  "ocean-breeze": "Ocean Breeze",
  bonche: "Bonche",
  generico: "Genérico",
};

export function BrandBadge({ brand }: { brand: BrandSlug }) {
  return (
    <Badge variant={brand === "generico" ? "outline" : "blue"}>
      {LABEL[brand]}
    </Badge>
  );
}

export const brandLabel = (b: BrandSlug) => LABEL[b];
