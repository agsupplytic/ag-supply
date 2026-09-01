import { Phone, MapPin } from "lucide-react";
import { distributors } from "@/lib/site-config";

export function Distributors() {
  return (
    <section className="bg-brand-gradient py-16 text-white md:py-24">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-white">Distribuidores autorizados</h2>
          <p className="mt-4 text-lg text-white/90">
            Además de la venta directa, nuestros productos se consiguen a través
            de distribuidores autorizados en todo el país.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {distributors.map((zone) => (
            <div key={zone.zone} className="panel-quiet p-6">
              <div className="flex items-center gap-2 text-white/85">
                <MapPin className="size-4" aria-hidden />
                <h3 className="font-heading text-base font-semibold uppercase tracking-wide text-white">
                  {zone.zone}
                </h3>
              </div>
              <ul className="mt-4 space-y-4">
                {zone.items.map((d) => (
                  <li key={d.name}>
                    <p className="font-heading font-semibold text-white">
                      {d.name}
                    </p>
                    <a
                      href={`tel:${d.tel}`}
                      className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-white/85 transition-colors hover:text-white"
                    >
                      <Phone className="size-3.5" aria-hidden />
                      {d.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-white/90">
          ¿Quieres ser distribuidor autorizado de AG Supply? Escríbenos y lo
          conversamos.
        </p>
      </div>
    </section>
  );
}
