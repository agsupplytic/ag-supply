import { siteConfig } from "@/lib/site-config";
import { absUrl, productDescription } from "@/lib/seo";
import { textFor } from "@/lib/i18n/site-text";
import { HTML_LANG, href, type Lang } from "@/lib/i18n/routes";
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
        sameAs: [siteConfig.social.instagram],
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
 * Product — ficha de producto, sin precio ni valoraciones. Sin `offers` no habrá
 * fragmentos de producto en Google; es intencional: no se inventan precios.
 * `sku` solo si es único en el catálogo; `manufacturer` solo si AG Supply lo fabrica;
 * `brand` solo para las marcas propias.
 */
export function ProductJsonLd({
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
  const es = lang === "es";
  const specs: [string, string | number | undefined][] = [
    [es ? "Capas" : "Plies", product.specs.ply],
    ["Color", product.specs.color],
    [es ? "Presentación" : "Pack size", product.specs.packFormat],
    [es ? "Gramaje (g/m²)" : "Basis weight (g/m²)", product.specs.grammageGsm],
    [es ? "Ancho (cm)" : "Width (cm)", product.specs.widthCm],
    [es ? "Hojas" : "Sheets", product.specs.sheets],
  ];
  const url = absUrl(href(lang, { name: "product", cat: product.category, slug: product.slug }));
  const uniqueSku = product.skuStatus === "ok" ? product.sku : undefined;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.name,
        description: product.description ?? productDescription(product, category?.name, brandName, lang),
        inLanguage: HTML_LANG[lang],
        ...(uniqueSku ? { sku: uniqueSku } : {}),
        ...(product.images.length ? { image: `${siteConfig.url}${product.images[0]}` } : {}),
        category: category?.name ?? product.category,
        ...(product.brand !== "generico" && brandName ? { brand: { "@type": "Brand", name: brandName } } : {}),
        ...(product.fabricated ? { manufacturer: { "@id": ORG_ID } } : {}),
        additionalProperty: specs
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
        url,
      }}
    />
  );
}

/** CollectionPage + ItemList — páginas de categoría. */
export function CollectionJsonLd({ category, products, lang }: { category: Category; products: Product[]; lang: Lang }) {
  const url = absUrl(href(lang, { name: "category", cat: category.slug }));
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
