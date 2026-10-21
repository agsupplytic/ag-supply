import { MapPin, Phone } from "lucide-react";
import { Section, SectionHeading } from "./section";
import { distributors } from "@/lib/site-config";
import type { Lang } from "@/lib/i18n/routes";

const COPY = {
  es: {
    title: "Distribuidores autorizados",
    intro: "Además de la venta directa, los productos se consiguen en estos distribuidores, organizados por zona.",
    note: "Para ser distribuidor autorizado, escríbanos por el formulario de contacto o por WhatsApp.",
    zones: { Santiago: "Santiago", "Santo Domingo": "Santo Domingo", "Región Este": "Región Este", "Puerto Plata": "Puerto Plata" } as Record<string, string>,
  },
  en: {
    title: "Authorized distributors",
    intro: "In addition to direct sales, our products are available through these distributors, organized by zone.",
    note: "To become an authorized distributor, write to us through the contact form or on WhatsApp.",
    zones: { Santiago: "Santiago", "Santo Domingo": "Santo Domingo", "Región Este": "East region", "Puerto Plata": "Puerto Plata" } as Record<string, string>,
  },
};

/** Distribuidores autorizados por zona (datos en lib/site-config.ts). */
export function Distributors({ lang, headingAs = "h2" }: { lang: Lang; headingAs?: "h2" | "h3" }) {
  const c = COPY[lang];
  return (
    <Section tone="surface">
      <SectionHeading as={headingAs} title={c.title} intro={c.intro} />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {distributors.map((zone) => (
          <div key={zone.zone} className="card card-hover p-5">
            <h3 className="flex items-center gap-2 !text-base">
              <MapPin className="size-5 text-brand-blue" aria-hidden />
              {c.zones[zone.zone] ?? zone.zone}
            </h3>
            <ul className="mt-3 divide-y divide-border">
              {zone.items.map((d) => (
                <li key={d.name} className="py-2.5">
                  <p className="font-heading font-bold text-ink [font-stretch:100%]">{d.name}</p>
                  <a href={`tel:${d.tel}`} className="inline-flex items-center gap-1.5 text-sm text-brand-blue-dark hover:underline">
                    <Phone className="size-3.5" aria-hidden />
                    {d.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">{c.note}</p>
    </Section>
  );
}
