import { Layers, Ruler, PackageOpen, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ProductSpecs } from "@/lib/content/types";

type Row = { label: string; value?: string };
type Group = { title: string; icon: LucideIcon; rows: Row[] };

function val(v?: string | number, unit = ""): string | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  return `${v}${unit}`;
}

function buildGroups(s: ProductSpecs): Group[] {
  const groups: Group[] = [
    {
      title: "Material y formato",
      icon: Layers,
      rows: [
        { label: "Capas", value: val(s.ply) },
        { label: "Gramaje", value: val(s.grammageGsm, " g/m²") },
        { label: "Color", value: val(s.color) },
        { label: "Tipo de papel", value: val(s.paperType) },
        { label: "Doblez", value: val(s.fold) },
        { label: "Acabado", value: val(s.finish) },
      ],
    },
    {
      title: "Medidas",
      icon: Ruler,
      rows: [
        { label: "Ancho", value: val(s.widthCm, " cm") },
        { label: "Largo de hoja", value: val(s.sheetLengthCm, " cm") },
        { label: "Hojas por rollo / paquete", value: val(s.sheets) },
        {
          label: "Longitud del rollo",
          value: val(s.rollLengthM, " m") ?? val(s.rollLengthFt, " pies"),
        },
      ],
    },
    {
      title: "Empaque y logística",
      icon: PackageOpen,
      rows: [
        { label: "Presentación", value: val(s.packFormat) },
        { label: "Paquetes por fardo", value: val(s.packsPerBale) },
        { label: "Dimensiones del paquete", value: val(s.packageDims) },
        { label: "Dimensiones del fardo / caja", value: val(s.caseDims) },
        { label: "Unidades por paleta", value: val(s.unitsPerPallet) },
      ],
    },
    {
      title: "Cumplimiento normativo",
      icon: ShieldCheck,
      rows: [{ label: "Normas", value: val(s.compliance) }],
    },
  ];

  return groups
    .map((g) => ({ ...g, rows: g.rows.filter((r) => r.value) }))
    .filter((g) => g.rows.length > 0);
}

export function SpecGroups({ specs }: { specs: ProductSpecs }) {
  const groups = buildGroups(specs);

  if (groups.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-body">
        Ficha técnica en actualización. Escríbenos para las dimensiones completas o
        una muestra física de este producto.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {groups.map((g) => (
        <div
          key={g.title}
          className="rounded-2xl border border-border bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue-dark">
              <g.icon className="size-5" aria-hidden />
            </span>
            <h3 className="font-heading text-base font-bold text-ink">
              {g.title}
            </h3>
          </div>
          <dl className="mt-4 divide-y divide-border">
            {g.rows.map((r) => (
              <div
                key={r.label}
                className="flex items-baseline justify-between gap-6 py-2.5"
              >
                <dt className="text-sm text-muted">{r.label}</dt>
                <dd className="text-right font-heading text-sm font-semibold text-ink">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
