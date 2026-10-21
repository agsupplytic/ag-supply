import { Clock, Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { Section } from "@/components/site/section";
import { Container } from "@/components/site/container";
import { ContactForm } from "@/components/site/contact-form";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { InstagramIcon } from "@/components/site/icons";
import { Distributors } from "@/components/site/distributors";
import { PageHero } from "@/components/site/page-hero";
import { IconChip } from "@/components/site/icon-chip";
import { siteConfig, waLink } from "@/lib/site-config";
import { textFor } from "@/lib/i18n/site-text";
import { href, type Lang } from "@/lib/i18n/routes";
import { ui } from "@/lib/i18n/ui";
import { pageMetadata } from "@/lib/seo";

const COPY = {
  es: {
    meta: {
      title: "Contacto y cotización",
      description: "Contacte a AG Supply en Las Palomas, Santiago: teléfonos, correo, WhatsApp, horario, mapa y distribuidores autorizados. Lunes a viernes, 8:00 a.m. a 5:00 p.m.",
    },
    h1: "Contacto y cotización",
    lead: "Indíquenos qué productos y volúmenes maneja su operación. Atención comercial responde en horario de oficina.",
    data: "Datos de contacto",
    phones: "Teléfonos",
    email: "Correo",
    whatsapp: "WhatsApp",
    whatsappLink: "Escribir por WhatsApp",
    address: "Dirección",
    hours: "Horario",
    maps: "Abrir en Google Maps",
    write: "Escríbanos",
    required: "Todos los campos son necesarios para poder responderle.",
    mapTitle: "Ubicación de AG Supply en Las Palomas, Santiago",
  },
  en: {
    meta: {
      title: "Contact and quotes",
      description: "Contact AG Supply in Las Palomas, Santiago: phones, email, WhatsApp, business hours, map and authorized distributors. Monday to Friday, 8:00 a.m. to 5:00 p.m.",
    },
    h1: "Contact and quotes",
    lead: "Tell us which products and volumes your operation handles. Our sales team replies during office hours.",
    data: "Contact details",
    phones: "Phones",
    email: "Email",
    whatsapp: "WhatsApp",
    whatsappLink: "Write on WhatsApp",
    address: "Address",
    hours: "Hours",
    maps: "Open in Google Maps",
    write: "Write to us",
    required: "All fields are required so we can reply to you.",
    mapTitle: "AG Supply location in Las Palomas, Santiago",
  },
};

export function contactMetadata(lang: Lang) {
  const c = COPY[lang].meta;
  return pageMetadata({ lang, route: { name: "contact" }, title: c.title, description: c.description });
}

export function ContactPage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const t = ui(lang);
  const tt = textFor(lang);
  const { address, phones, email, social } = siteConfig;
  const mapSrc = `https://www.google.com/maps?q=${address.lat},${address.lng}&z=16&output=embed`;
  const link = "text-brand-blue-dark hover:underline";

  const rows = [
    {
      icon: Phone, label: c.phones,
      value: phones.map((p) => (
        <span key={p.tel} className="block">
          <a href={`tel:${p.tel}`} className={link}>{p.value}</a>
          <span className="font-normal text-muted"> · {p.label}</span>
        </span>
      )),
    },
    { icon: Mail, label: c.email, value: <a href={`mailto:${email}`} className={link}>{email}</a> },
    {
      icon: MessageCircle, label: c.whatsapp,
      value: <a href={waLink(tt.whatsapp.genericMessage)} target="_blank" rel="noopener noreferrer" className={link}>{c.whatsappLink}</a>,
    },
    { icon: MapPin, label: c.address, value: `${tt.address.line1}, ${tt.address.city}, ${tt.address.country}` },
    { icon: Clock, label: c.hours, value: tt.hours },
  ];

  return (
    <>
      <PageHero
        breadcrumb={[{ name: t.home, href: href(lang, { name: "home" }) }, { name: t.nav.contact }]}
        breadcrumbLabel={t.nav.breadcrumb}
        title={c.h1}
        lead={c.lead}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="rule-red">{c.data}</h2>
            <ul className="mt-5 divide-y divide-border">
              {rows.map((r) => (
                <li key={r.label} className="flex gap-4 py-3.5">
                  <IconChip icon={r.icon} />
                  <div>
                    <p className="label text-muted">{r.label}</p>
                    <div className="mt-0.5 font-medium text-ink">{r.value}</div>
                  </div>
                </li>
              ))}
              <li className="flex gap-4 py-3.5">
                <span className="icon-chip" aria-hidden><InstagramIcon className="size-5" /></span>
                <div>
                  <p className="label text-muted">Instagram</p>
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" className={`mt-0.5 block font-medium ${link}`}>{social.handle}</a>
                </div>
              </li>
            </ul>
            <p className="mt-4">
              <a href={address.mapsUrl} target="_blank" rel="noopener noreferrer" className="link font-bold">{c.maps}</a>
            </p>
            <div className="mt-6">
              <WhatsAppButton size="lg" lang={lang} />
            </div>
          </div>

          <div className="card bg-surface p-6 md:p-8">
            <h2 className="text-2xl">
              
              {c.write}
            </h2>
            <p className="mt-2 text-body">{c.required}</p>
            <div className="relative mt-6">
              <ContactForm lang={lang} />
            </div>
          </div>
        </div>
      </Section>

      <Container className="pb-14 md:pb-20">
        <iframe
          title={c.mapTitle}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full rounded-xl border border-border md:h-96"
        />
      </Container>

      <Distributors lang={lang} />
    </>
  );
}
