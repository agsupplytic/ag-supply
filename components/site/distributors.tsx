import Link from "next/link";
import { Section, SectionHeading } from "./section";
import { distributors } from "@/lib/site-config";

/** Distribuidores autorizados por zona (datos en lib/site-config.ts). */
export function Distributors({ headingAs = "h2" as "h2" | "h3" }) {
  return (
    <Section tone="surface">
      <SectionHeading
        as={headingAs}
        title="Distribuidores autorizados"
        intro="Además de la venta directa, los productos se consiguen en estos distribuidores, organizados por zona."
      />
      <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {distributors.map((zone) => (
          <div key={zone.zone} className="border-t-2 border-ink pt-3">
            <h3 className="label text-ink">{zone.zone}</h3>
            <ul className="mt-3 divide-y divide-border">
              {zone.items.map((d) => (
                <li key={d.name} className="py-2.5">
                  <p className="font-heading font-semibold text-ink">{d.name}</p>
                  <a href={`tel:${d.tel}`} className="text-sm text-brand-blue-dark hover:underline">
                    {d.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">
        Para ser distribuidor autorizado, escriba a {" "}
        <Link href="/contacto" className="link">Contacto</Link>.
      </p>
    </Section>
  );
}
