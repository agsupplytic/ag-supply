import { Boxes, Clock, MapPinned, SlidersHorizontal } from "lucide-react";
import { Container } from "./container";

const ITEMS = [
  {
    icon: Boxes,
    title: "Pedido mínimo",
    text: "Se coordina por pedido según el formato y el volumen de tu operación.",
  },
  {
    icon: Clock,
    title: "Plazo de entrega",
    text: "En el tiempo acordado por pedido. Confirmamos disponibilidad al cotizar.",
  },
  {
    icon: MapPinned,
    title: "Cobertura",
    text: "Nacional en República Dominicana, con vocación de servir al Caribe.",
  },
  {
    icon: SlidersHorizontal,
    title: "Formato a tu medida",
    text: "Presentación, conteo y empaque —impreso o liso, fardo o caja— ajustados a tu consumo.",
  },
];

/** Compact operational facts. Prices are never shown — they are confirmed per order. */
export function OperationalInfo() {
  return (
    <div className="border-y border-border bg-surface">
      <Container className="grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it) => (
          <div key={it.title} className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-white shadow-sm">
              <it.icon className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-heading text-sm font-bold text-ink">
                {it.title}
              </p>
              <p className="mt-1 text-sm leading-snug text-body">{it.text}</p>
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
