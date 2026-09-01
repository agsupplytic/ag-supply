import { siteConfig, distributors } from "@/lib/site-config";
import { brandLabel } from "./brand-badge";
import type { Product, Category } from "@/lib/content/types";

const ORG_ID = `${siteConfig.url}/#organization`;

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization + LocalBusiness — site-wide, rendered once in the layout. */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["Organization", "LocalBusiness"],
        "@id": ORG_ID,
        name: siteConfig.legalName,
        alternateName: siteConfig.name,
        slogan: siteConfig.slogan,
        url: siteConfig.url,
        logo: `${siteConfig.url}/images/brand/agsupply-logo.png`,
        image: `${siteConfig.url}/images/og.png`,
        description: siteConfig.description,
        foundingDate: String(siteConfig.company.foundedYear),
        email: siteConfig.email,
        telephone: siteConfig.phones.map((p) => p.tel),
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.address.line1,
          addressLocality: siteConfig.address.city,
          addressRegion: "Santiago",
          addressCountry: "DO",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: siteConfig.address.lat,
          longitude: siteConfig.address.lng,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: siteConfig.hours.days,
          opens: siteConfig.hours.opens,
          closes: siteConfig.hours.closes,
        },
        areaServed: { "@type": "Country", name: "Dominican Republic" },
        sameAs: [siteConfig.social.instagram],
        brand: [
          { "@type": "Brand", name: "Ocean Breeze" },
          { "@type": "Brand", name: "Bonche" },
        ],
        subOrganization: distributors.flatMap((z) =>
          z.items.map((d) => ({
            "@type": "Organization",
            name: d.name,
            telephone: d.tel,
            areaServed: z.zone,
          })),
        ),
      }}
    />
  );
}

/** WebSite — helps search engines label the site as an entity. */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        url: siteConfig.url,
        inLanguage: "es-DO",
        publisher: { "@id": ORG_ID },
      }}
    />
  );
}

/** Product — on each product detail page. Deliberately price-free. */
export function ProductJsonLd({
  product,
  category,
}: {
  product: Product;
  category?: Category | null;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description:
          product.description ??
          `${product.name}. Fabricado por ${siteConfig.legalName}.`,
        ...(product.sku ? { sku: product.sku, mpn: product.sku } : {}),
        ...(product.images.length
          ? { image: `${siteConfig.url}${product.images[0]}` }
          : {}),
        category: category?.name ?? product.category,
        brand: { "@type": "Brand", name: brandLabel(product.brand) },
        manufacturer: { "@id": ORG_ID },
        url: `${siteConfig.url}/productos/${product.category}/${product.slug}`,
      }}
    />
  );
}

/** BreadcrumbList — on category and product pages. `trail` is [name, path][]. */
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
          item: `${siteConfig.url}${path}`,
        })),
      }}
    />
  );
}

/** FAQPage — on /faq, from the same Q&A array the page renders. */
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
