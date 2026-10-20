import { getCategories } from "@/lib/content";
import { HeaderNav } from "./header-nav";

export async function SiteHeader() {
  const categories = await getCategories();
  return (
    <HeaderNav
      categories={categories.map((c) => ({
        slug: c.slug,
        name: c.name,
        count: c.count,
        short: c.short,
      }))}
    />
  );
}
