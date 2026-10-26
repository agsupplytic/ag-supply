import { siteConfig } from "@/lib/site-config";
import { absUrl, productDescription } from "@/lib/seo";
import { textFor } from "@/lib/i18n/site-text";
import { HTML_LANG, href, type Lang, type Route } from "@/lib/i18n/routes";
import type { Product, Category } from "@/lib/content/types";

const ORG_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // `<` escapado para que ningún texto pueda cerrar la etiqueta <script>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * Organization — una sola entidad en todo el sitio (se renderiza en el layout).
 * Datos verificados únicamente: nombre, año de fundación, contacto, sede y horario.
 * La sede va en `location` (Place); no se declara como LocalBusiness porque la
 * empresa atiende a clientes corporativos desde una planta, no es un comercio local.
 */
export function OrganizationJsonLd({ lang }: { lang: Lang }) {
  const a = siteConfig.address;
  const tt = textFor(lang);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": ORG_ID,
        name: siteConfig.legalName,
        alternateName: [siteConfig.name, "A.G. Supply, S.R.L."],
        slogan: tt.slogan,
        url: absUrl("/"),
        logo: `${siteConfig.url}/images/brand/agsupply-logo-main.png`,
        image: `${siteConfig.url}/images/og.png`,
        description: tt.description,
        foundingDate: String(siteConfig.company.foundedYear),
        email: siteConfig.email,
        telephone: siteConfig.phones.map((p) => p.tel),
        contactPoint: siteConfig.phones.map((p) => ({
          "@type": "ContactPoint",
          contactType: "ventas",
          telephone: p.tel,
          email: siteConfig.email,
          availableLanguage: ["es", "en"],
        })),
        location: {
          "@type": "Place",
          name: lang === "es" ? "Planta de AG Supply" : "AG Supply plant",
          address: {
            "@type": "PostalAddress",
            streetAddress: a.line1,
            addressLocality: a.city,
            addressCountry: "DO",
          },
          geo: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lng },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: siteConfig.hours.days,
            opens: siteConfig.hours.opens,
            closes: siteConfig.hours.closes,
          },
        },
        sameAs: [siteConfig.social.instagram, siteConfig.address.mapsUrl],
        brand: [
          { "@type": "Brand", name: "Ocean Breeze" },
          { "@type": "Brand", name: "Bonche" },
        ],
      }}
    />
  );
}

/** WebSite — nombre del sitio para Google. Solo en la portada de cada idioma, como pide su guía. */
export function WebSiteJsonLd({ lang }: { lang: Lang }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: siteConfig.name,
        alternateName: [siteConfig.legalName, "agsupply.com.do"],
        url: absUrl(href(lang, { name: "home" })),
        inLanguage: HTML_LANG[lang],
        publisher: { "@id": ORG_ID },
      }}
    />
  );
}

/**
 * ItemPage — ficha de producto. No se declara `Product`: Google exige `offers`, `review` o
 * `aggregateRating` para ese tipo y el sitio no publica precios ni valoraciones (no se
 * inventan), así que Search Console marcaba error en cada ficha. El producto va como
 * `about` (Thing) con su nombre, SKU (solo si es único), imagen y descripción; las
 * especificaciones quedan en la tabla visible de la página. Si algún día se publican
 * precios reales, volver a `Product` con `offers` (ver historial de git).
 */
export function ItemPageJsonLd({
  product,
  category,
  brandName,
  lang,
}: {
  product: Product;
  category?: Category | null;
  brandName?: string;
  lang: Lang;
}) {
  const url = absUrl(href(lang, { name: "product", cat: product.category, slug: product.slug }));
  const uniqueSku = product.skuStatus === "ok" ? product.sku : undefined;
  const description = product.description ?? productDescription(product, category?.name, brandName, lang);
  const image = product.images.length ? `${siteConfig.url}${product.images[0]}` : undefined;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemPage",
        "@id": `${url}#itempage`,
        url,
        name: product.name,
        description,
        inLanguage: HTML_LANG[lang],
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORG_ID },
        ...(image ? { primaryImageOfPage: { "@type": "ImageObject", url: image } } : {}),
        about: {
          "@type": "Thing",
          name: product.name,
          description,
          ...(uniqueSku ? { identifier: uniqueSku } : {}),
          ...(image ? { image } : {}),
          url,
        },
      }}
    />
  );
}

/** CollectionPage + ItemList — páginas de categoría. */
export function CollectionJsonLd({ category, products, lang, route }: { category: Category; products: Product[]; lang: Lang; route?: Route }) {
  const url = absUrl(href(lang, route ?? { name: "category", cat: category.slug }));
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${category.name} — AG Supply`,
        description: category.description,
        url,
        inLanguage: HTML_LANG[lang],
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: products.length,
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absUrl(href(lang, { name: "product", cat: p.category, slug: p.slug })),
            name: p.name,
          })),
        },
      }}
    />
  );
}

/** BreadcrumbList — `trail` es [nombre, ruta][]. */
export function BreadcrumbJsonLd({ trail }: { trail: [string, string][] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map(([name, path], i) => ({
          "@type": "ListItem",
          position: i + 1,
          name,
          item: absUrl(path),
        })),
      }}
    />
  );
}

/** FAQPage — a partir del mismo arreglo de preguntas que pinta la página. */
export function FaqJsonLd({ qa, lang }: { qa: { q: string; a: string }[]; lang: Lang }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: HTML_LANG[lang],
        mainEntity: qa.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }}
    />
  );
}
