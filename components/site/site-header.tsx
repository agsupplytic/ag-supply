import { getCategories } from "@/lib/content";
import { makeT, type Locale } from "@/lib/i18n";
import { HeaderNav } from "./header-nav";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const categories = await getCategories();
  const t = makeT(locale);

  return (
    <HeaderNav
      locale={locale}
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
