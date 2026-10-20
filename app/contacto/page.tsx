import { Section } from "@/components/site/section";
import { Container } from "@/components/site/container";
import { ContactForm } from "@/components/site/contact-form";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Distributors } from "@/components/site/distributors";
import { PageHero } from "@/components/site/page-hero";
import { siteConfig, waLink } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contacto y cotización",
  description:
    "Contacte a AG Supply en Las Palomas, Santiago: teléfonos, correo, WhatsApp, horario, mapa y distribuidores autorizados. Lunes a viernes, 8:00 a.m. a 5:00 p.m.",
  path: "/contacto",
});

export default function ContactoPage() {
  const { address, phones, email, social } = siteConfig;
  const mapSrc = `https://www.google.com/maps?q=${address.lat},${address.lng}&z=16&output=embed`;
  const link = "text-brand-blue-dark hover:underline";

  return (
    <>
      <PageHero
        breadcrumb={[{ name: "Inicio", href: "/" }, { name: "Contacto" }]}
        title="Contacto y cotización"
        lead="Indíquenos qué productos y volúmenes maneja su operación. Atención comercial responde en horario de oficina."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="rule-red">Datos de contacto</h2>
            <table className="spec-table mt-4">
              <tbody>
                <tr>
                  <th scope="row">Teléfonos</th>
                  <td>
                    {phones.map((p) => (
                      <span key={p.tel} className="block">
                        <a href={`tel:${p.tel}`} className={link}>{p.value}</a>
                        <span className="font-normal text-muted"> · {p.label}</span>
                      </span>
                    ))}
                  </td>
                </tr>
                <tr><th scope="row">Correo</th><td><a href={`mailto:${email}`} className={link}>{email}</a></td></tr>
                <tr>
                  <th scope="row">WhatsApp</th>
                  <td><a href={waLink(siteConfig.whatsapp.genericMessage)} target="_blank" rel="noopener noreferrer" className={link}>Escribir por WhatsApp</a></td>
                </tr>
                <tr><th scope="row">Instagram</th><td><a href={social.instagram} target="_blank" rel="noopener noreferrer" className={link}>{social.handle}</a></td></tr>
                <tr><th scope="row">Dirección</th><td>{address.line1}, {address.city}, {address.country}</td></tr>
                <tr><th scope="row">Horario</th><td>{siteConfig.hours.label}</td></tr>
              </tbody>
            </table>
            <p className="mt-4">
              <a href={address.mapsUrl} target="_blank" rel="noopener noreferrer" className="link font-semibold">
                Abrir en Google Maps
              </a>
            </p>
            <div className="mt-6">
              <WhatsAppButton size="lg" />
            </div>
          </div>

          <div className="border border-border bg-surface p-6 md:p-8">
            <h2 className="text-2xl">Escríbanos</h2>
            <p className="mt-2 text-body">Todos los campos son necesarios para poder responderle.</p>
            <div className="relative mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>

      <Container className="pb-14 md:pb-20">
        <iframe
          title="Ubicación de AG Supply en Las Palomas, Santiago"
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full border border-border md:h-96"
        />
      </Container>

      <Distributors />
    </>
  );
}
