import { siteConfig, distributors } from "@/lib/site-config";

/** Organization + LocalBusiness structured data for search engines. */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${siteConfig.url}/#organization`,
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
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
