import type { Metadata } from "next";
import {
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  Clock,
  Truck,
  FileText,
} from "lucide-react";
import { Container } from "@/components/site/container";
import { Section } from "@/components/site/section";
import { ContactForm } from "@/components/site/contact-form";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { WhatsAppIcon, InstagramIcon } from "@/components/site/icons";
import { Distributors } from "@/components/site/distributors";
import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta a AG Supply en Las Palomas, Santiago. Teléfonos 809-612-2020 y 809-778-9119, correo agsupplycxc@gmail.com. Horario de lunes a viernes de 8:00 a.m. a 5:00 p.m. Cotiza por WhatsApp.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    siteConfig.address.mapsQuery,
  )}&z=15&output=embed`;

  const cards = [
    {
      icon: <Phone className="size-6" aria-hidden />,
      title: "Teléfono",
      lines: siteConfig.phones.map((p) => `${p.value} · ${p.label}`),
      cta: { label: "Llamar ahora", href: `tel:${siteConfig.phones[0].tel}` },
    },
    {
      icon: <Mail className="size-6" aria-hidden />,
      title: "Correo",
      lines: [siteConfig.email],
      cta: { label: "Enviar correo", href: `mailto:${siteConfig.email}` },
    },
    {
      icon: <WhatsAppIcon className="size-6" />,
      title: "WhatsApp",
      lines: ["Cotización directa desde el catálogo"],
      cta: {
        label: "Abrir WhatsApp",
        href: `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(siteConfig.whatsapp.genericMessage)}`,
      },
    },
    {
      icon: <InstagramIcon className="size-6" />,
      title: "Instagram",
      lines: [siteConfig.social.handle],
      cta: { label: "Ir a Instagram", href: siteConfig.social.instagram },
    },
  ];

  const infoTiles = [
    {
      icon: MapPin,
      title: "Dirección",
      body: `${siteConfig.address.line1}, ${siteConfig.address.city}`,
      link: { label: "Google Maps", href: siteConfig.address.mapsUrl },
    },
    { icon: Clock, title: "Horario", body: siteConfig.hours.label },
    {
      icon: Truck,
      title: "Entrega",
      body: "Cobertura nacional, en el tiempo acordado por pedido.",
    },
    {
      icon: FileText,
      title: "Cotización",
      body: "Arma tu lista en el catálogo y envíala por WhatsApp.",
    },
  ];

  return (
    <>
      <PageHero
        image={{
          src: "/images/placeholders/hero-3.webp",
          alt: "Despacho de producto terminado de AG Supply",
        }}
        title="Hablemos de tu abastecimiento"
        lead="Cuéntanos qué productos y volúmenes maneja tu operación. Coordinamos formatos y entrega en el tiempo acordado, en todo el país."
        className="pb-10 md:pb-14"
      />

      {/* contact cards — overlap the hero */}
      <Container className="relative z-10 -mt-14 md:-mt-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-2xl border border-border bg-white p-6 shadow-lg"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-blue-50 text-brand-blue-dark">
                {card.icon}
              </span>
              <p className="mt-4 font-heading text-lg font-bold text-ink">
                {card.title}
              </p>
              <div className="mt-1.5 flex-1 space-y-0.5 text-sm text-body">
                {card.lines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
              <a
                href={card.cta.href}
                target={card.cta.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-brand-blue-dark hover:underline"
              >
                {card.cta.label}
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          ))}
        </div>
      </Container>

      {/* info + form */}
      <Section className="pt-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2>Dónde estamos</h2>
            <p className="mt-3 text-body">
              Planta y oficinas en el sector Las Palomas, Santiago de los
              Caballeros — a minutos de la autopista, la circunvalación norte y el
              Aeropuerto Internacional del Cibao.
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {infoTiles.map((tile) => (
                <div
                  key={tile.title}
                  className="rounded-2xl border border-border p-5"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue-dark">
                    <tile.icon className="size-5" aria-hidden />
                  </span>
                  <dt className="mt-3 font-heading font-semibold text-ink">
                    {tile.title}
                  </dt>
                  <dd className="mt-0.5 text-sm text-body">{tile.body}</dd>
                  {tile.link && (
                    <a
                      href={tile.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue-dark hover:underline"
                    >
                      {tile.link.label} <ArrowUpRight className="size-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppButton size="lg" />
              <Button asChild variant="outline">
                <a href={`tel:${siteConfig.phones[0].tel}`}>
                  <Phone className="size-4" /> {siteConfig.phones[0].value}
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-blue-100 bg-brand-blue-50 p-6 md:p-8">
            <div className="flex items-center gap-2">
              <WhatsAppIcon className="size-5 text-[color:var(--color-whatsapp-ink)]" />
              <h2>Escríbenos</h2>
            </div>
            <p className="mt-2 text-sm text-body">
              Todos los campos son necesarios para responderte bien.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>

      {/* map — full width */}
      <Container className="pb-16 md:pb-24">
        <div className="overflow-hidden rounded-2xl border border-border">
          <iframe
            title="Ubicación de AG Supply en Las Palomas, Santiago"
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full md:h-96"
          />
        </div>
      </Container>

      <Distributors />
    </>
  );
}
