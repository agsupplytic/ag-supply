import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./logo";
import { Container } from "./container";
import { InstagramIcon } from "./icons";
import { CategoryIcon } from "./category-icon";
import { getCategories } from "@/lib/content";
import { localizeCategory } from "@/lib/i18n/content";
import { siteConfig } from "@/lib/site-config";
import { textFor } from "@/lib/i18n/site-text";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";

/** Pie claro: el logotipo (con transparencia) va directo, sin caja blanca. */
export async function SiteFooter({ lang }: { lang: Lang }) {
  const categories = (await getCategories()).map((c) => localizeCategory(c, lang));
  const t = ui(lang);
  const tt = textFor(lang);
  const year = new Date().getFullYear();
  const a = tt.address;

  const COMPANY = [
    { href: href(lang, { name: "about" }), label: t.nav.about },
    { href: href(lang, { name: "plant" }), label: t.footer.plantProcess },
    { href: href(lang, { name: "oceanBreeze" }), label: "Ocean Breeze" },
    { href: href(lang, { name: "bonche" }), label: "Bonche" },
    { href: href(lang, { name: "faq" }), label: t.nav.faq },
    { href: href(lang, { name: "contact" }), label: t.footer.contactDistributors },
  ];

  const h = "label text-brand-blue-dark";
  const link = "hover:text-brand-blue-dark hover:underline underline-offset-4";
  const row = "flex items-start gap-2.5";
  const ico = "mt-1 size-4 shrink-0 text-brand-blue";

  return (
    <footer className="border-t-4 border-brand-blue bg-surface text-[0.9375rem] text-body">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
        <div>
          <Logo height={44} />
          <p className="mt-5 max-w-xs">{t.footer.about(a.city, a.line1)}</p>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 font-medium text-brand-blue-dark hover:underline"
          >
            <InstagramIcon className="size-4" />
            {siteConfig.social.handle}
          </a>
        </div>

        <nav aria-label={t.footer.categories}>
          <h2 className={h}>{t.footer.products}</h2>
          <ul className="mt-4 space-y-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={href(lang, { name: "category", cat: c.slug })} className={`${link} inline-flex items-center gap-2`}>
                  <CategoryIcon name={c.icon} className="size-4 text-brand-blue" />
                  {c.name}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link href={href(lang, { name: "products" })} className={`font-bold ${link}`}>
                {t.nav.fullCatalog}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={t.footer.company}>
          <h2 className={h}>{t.footer.company}</h2>
          <ul className="mt-4 space-y-2">
            {COMPANY.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className={link}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={h}>{t.footer.contact}</h2>
          <address className="mt-4 space-y-2.5 not-italic">
            {siteConfig.phones.map((p) => (
              <p key={p.tel} className={row}>
                <Phone className={ico} aria-hidden />
                <span>
                  <a href={`tel:${p.tel}`} className={link}>{p.value}</a>
                  <span className="text-muted"> · {p.label}</span>
                </span>
              </p>
            ))}
            <p className={row}>
              <Mail className={ico} aria-hidden />
              <a href={`mailto:${siteConfig.email}`} className={link}>{siteConfig.email}</a>
            </p>
            <p className={row}>
              <MapPin className={ico} aria-hidden />
              <span>{a.line1}, {a.city}, {a.country}</span>
            </p>
            <p className={row}>
              <Clock className={ico} aria-hidden />
              <span>{tt.hours}</span>
            </p>
            <p className="pl-6.5">
              <a href={siteConfig.address.mapsUrl} target="_blank" rel="noopener noreferrer" className={`font-bold text-brand-blue-dark ${link}`}>
                {t.footer.maps}
              </a>
            </p>
          </address>
        </div>
      </Container>

      <div className="border-t border-border bg-white">
        <Container className="flex flex-col gap-2 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {siteConfig.legalName}. {t.footer.rights}</p>
          <p className="font-heading font-bold italic text-brand-blue-dark">{tt.slogan}</p>
        </Container>
      </div>
    </footer>
  );
}


