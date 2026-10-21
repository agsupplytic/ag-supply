import { getCategories } from "@/lib/content";
import { localizeCategory } from "@/lib/i18n/content";
import type { Lang } from "@/lib/i18n/routes";
import { HeaderNav } from "./header-nav";

export async function SiteHeader({ lang }: { lang: Lang }) {
  const categories = (await getCategories()).map((c) => localizeCategory(c, lang));
  return (
    <HeaderNav
      lang={lang}
      categories={categories.map((c) => ({ slug: c.slug, name: c.name, icon: c.icon, count: c.count }))}
    />
  );
}
