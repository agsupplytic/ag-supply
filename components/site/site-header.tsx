import { getCategories } from "@/lib/content";
import { t } from "@/lib/i18n";
import { HeaderNav } from "./header-nav";

export async function SiteHeader() {
  const categories = await getCategories();

  return (
    <HeaderNav
      labels={{
        home: t("nav.home"),
        about: t("nav.about"),
        products: t("nav.products"),
        contact: t("nav.contact"),
        fullCatalog: t("nav.fullCatalog"),
        whatsapp: t("cta.whatsapp"),
      }}
      categories={categories.map((c) => ({
        slug: c.slug,
        name: c.name,
        icon: c.icon,
        count: c.count,
        short: c.short,
        placeholder: c.placeholder ?? null,
      }))}
    />
  );
}
