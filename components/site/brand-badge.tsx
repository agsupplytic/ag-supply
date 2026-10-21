import { Badge } from "@/components/ui/badge";
import type { BrandSlug } from "@/lib/content/types";
import type { Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";

export function brandLabel(b: BrandSlug, lang: Lang): string {
  const t = ui(lang).brand;
  return b === "ocean-breeze" ? t.ob : b === "bonche" ? t.bonche : t.generic;
}

export function BrandBadge({ brand, lang }: { brand: BrandSlug; lang: Lang }) {
  return (
    <Badge variant={brand === "generico" ? "outline" : brand === "bonche" ? "neutral" : "blue"}>
      {brandLabel(brand, lang)}
    </Badge>
  );
}
