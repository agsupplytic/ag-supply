import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "./container";
import { InstagramIcon } from "./icons";
import { getCategories } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

const COMPANY = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/nosotros/planta", label: "Planta y proceso" },
  { href: "/ocean-breeze", label: "Ocean Breeze" },
  { href: "/bonche", label: "Bonche" },
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto y distribuidores" },
];

export async function SiteFooter() {
  const categories = await getCategories();
  const year = new Date().getFullYear();
  const a = siteConfig.address;

  const h = "label text-navy-300";
  const link = "hover:text-white hover:underline underline-offset-4";

  return (
    <footer className="bg-navy text-[0.9375rem] text-white on-navy">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
        <div>
          <Logo plate height={40} />
          <p className="mt-5 max-w-xs text-navy-300">
            {siteConfig.legalName}. Convertidora de papel en {a.line1}, Santiago de los Caballeros.
            Fabricamos papel higiénico, toallas, servilletas, interfoliados y papel facial; marcas
            Ocean Breeze y Bonche.
          </p>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-navy-300 hover:text-white"
          >
            <InstagramIcon className="size-4" />
            {siteConfig.social.handle}
          </a>
        </div>

        <nav aria-label="Categorías">
          <h2 className={h}>Productos</h2>
          <ul className="mt-4 space-y-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/productos/${c.slug}`} className={link}>{c.name}</Link>
              </li>
            ))}
            <li className="pt-1">
              <Link href="/productos" className={`font-semibold ${link}`}>Catálogo completo</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Empresa">
          <h2 className={h}>Empresa</h2>
          <ul className="mt-4 space-y-2">
            {COMPANY.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className={link}>{c.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={h}>Contacto</h2>
          <address className="mt-4 space-y-2 not-italic">
            {siteConfig.phones.map((p) => (
              <p key={p.tel}>
                <a href={`tel:${p.tel}`} className={link}>{p.value}</a>
                <span className="text-navy-300"> · {p.label}</span>
              </p>
            ))}
            <p><a href={`mailto:${siteConfig.email}`} className={link}>{siteConfig.email}</a></p>
            <p className="text-navy-300">
              {a.line1}, {a.city}, {a.country}
            </p>
            <p className="text-navy-300">{siteConfig.hours.label}</p>
            <p>
              <a href={a.mapsUrl} target="_blank" rel="noopener noreferrer" className={`font-semibold ${link}`}>
                Ver en Google Maps
              </a>
            </p>
          </address>
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-col gap-2 py-5 text-sm text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {siteConfig.legalName}. Todos los derechos reservados.</p>
          <p className="font-heading font-semibold italic text-white">{siteConfig.slogan}</p>
        </Container>
      </div>
    </footer>
  );
}
