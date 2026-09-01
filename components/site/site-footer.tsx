import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight, ArrowRight } from "lucide-react";
import { Logo } from "./logo";
import { InstagramIcon } from "./icons";
import { Container } from "./container";
import { getCategories } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { t } from "@/lib/i18n";

export async function SiteFooter() {
  const categories = await getCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white text-body">
      {/* columns */}
      <Container className="grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1.2fr] lg:gap-16">
        <div>
          <Logo variant="full" height={64} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-body">
            {siteConfig.legalName}. Convertidora de papel en el sector Las
            Palomas, Santiago. Fabricamos higiénicos, toallas, servilletas,
            faciales, interfoliados, desechables y cubertería bajo las marcas
            Ocean Breeze y Bonche.
          </p>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-blue-dark hover:underline"
          >
            <InstagramIcon className="size-4" />
            {siteConfig.social.handle}
          </a>
        </div>

        <nav aria-label="Categorías">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-ink">
            {t("footer.products")}
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/productos/${c.slug}`}
                  className="transition-colors hover:text-brand-blue-dark"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link
                href="/productos"
                className="inline-flex items-center gap-1 font-semibold text-brand-blue-dark hover:underline"
              >
                {t("nav.fullCatalog")} <ArrowRight className="size-3.5" />
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="transition-colors hover:text-brand-blue-dark"
              >
                {t("nav.faq")}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-ink">
            {t("footer.contact")}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {siteConfig.phones.map((p) => (
              <li key={p.tel} className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-brand-blue-dark" aria-hidden />
                <a href={`tel:${p.tel}`} className="hover:text-brand-blue-dark">
                  {p.value}
                </a>
                <span className="text-muted">· {p.label}</span>
              </li>
            ))}
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-brand-blue-dark" aria-hidden />
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-brand-blue-dark"
              >
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-brand-blue-dark"
                aria-hidden
              />
              <span>
                {siteConfig.address.line1}, {siteConfig.address.city},{" "}
                {siteConfig.address.country}
              </span>
            </li>
          </ul>
          <a
            href={siteConfig.address.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue-dark hover:underline"
          >
            Ver en Google Maps <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <p>
            © {year} {siteConfig.legalName}. {t("footer.rights")}
          </p>
          <p>Convertidora de papel · República Dominicana</p>
        </Container>
      </div>
    </footer>
  );
}
