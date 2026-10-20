import { siteConfig } from "@/lib/site-config";
import { absUrl, productDescription } from "@/lib/seo";
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
export function OrganizationJsonLd() {
  const a = siteConfig.address;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": ORG_ID,
        name: siteConfig.legalName,
        alternateName: [siteConfig.name, "A.G. Supply, S.R.L."],
        slogan: siteConfig.slogan,
        url: absUrl("/"),
        logo: `${siteConfig.url}/images/brand/agsupply-logo-main.png`,
        image: `${siteConfig.url}/images/og.png`,
        description: siteConfig.description,
        foundingDate: String(siteConfig.company.foundedYear),
        email: siteConfig.email,
        telephone: siteConfig.phones.map((p) => p.tel),
        contactPoint: siteConfig.phones.map((p) => ({
          "@type": "ContactPoint",
          contactType: "ventas",
          telephone: p.tel,
          email: siteConfig.email,
          availableLanguage: "es",
        })),
        location: {
          "@type": "Place",
          name: "Planta de AG Supply",
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

/** WebSite — etiqueta al sitio como entidad. */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: siteConfig.name,
        url: absUrl("/"),
        inLanguage: "es-DO",
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
}: {
  product: Product;
  category?: Category | null;
  brandName?: string;
}) {
  const specs: [string, string | number | undefined][] = [
    ["Capas", product.specs.ply],
    ["Color", product.specs.color],
    ["Presentación", product.specs.packFormat],
    ["Gramaje (g/m²)", product.specs.grammageGsm],
    ["Ancho (cm)", product.specs.widthCm],
    ["Hojas", product.specs.sheets],
  ];
  const url = absUrl(`/productos/${product.category}/${product.slug}`);
  const uniqueSku = product.skuStatus === "ok" ? product.sku : undefined;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.name,
        description: product.description ?? productDescription(product, category?.name, brandName),
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
export function CollectionJsonLd({ category, products }: { category: Category; products: Product[] }) {
  const url = absUrl(`/productos/${category.slug}`);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${category.name} — AG Supply`,
        description: category.description,
        url,
        inLanguage: "es-DO",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: products.length,
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absUrl(`/productos/${p.category}/${p.slug}`),
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
export function FaqJsonLd({ qa }: { qa: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: qa.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }}
    />
  );
}
